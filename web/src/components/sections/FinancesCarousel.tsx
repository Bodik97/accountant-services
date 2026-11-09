"use client";

import { Children, useEffect, useRef, useState, type ReactNode } from "react";

/**
 * «Фінанси» на телефоні: звіт як свайп-картки (scroll-snap) + перемикач-прогрес над ними.
 * Свайп оновлює активну кнопку, натиск на кнопку гортає до картки. Без JS — звичайний свайп.
 * Планшет (md): картки сіткою 2×2, перемикач прихований — усе видно одразу.
 */
/** Час для блокування підсвітки під час програмної прокрутки (викликається лише з обробників подій). */
const now = () => performance.now();

export default function FinancesCarousel({ label, tabs, children }: { label: string; tabs: readonly string[]; children: ReactNode }) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const slides = Children.toArray(children);

  const lockUntil = useRef(0);
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      if (now() < lockUntil.current) return; // програмна прокрутка після кліку на вкладку — підсвітка не «пробігає» проміжні
      const items = [...el.children] as HTMLElement[];
      const pad = parseFloat(getComputedStyle(el).scrollPaddingLeft) || 0;
      const max = el.scrollWidth - el.clientWidth;
      // Остання картка може не дійти до лівого краю — наприкінці прокрутки активна вона
      if (max > 0 && el.scrollLeft >= max - 4) return setActive(items.length - 1);
      let best = Infinity;
      let i = 0;
      items.forEach((s, j) => {
        const d = Math.abs(s.offsetLeft - pad - el.scrollLeft);
        if (d < best) { best = d; i = j; }
      });
      setActive(i);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => { el.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  const go = (i: number) => {
    const el = track.current;
    const s = el?.children[i] as HTMLElement | undefined;
    if (!el || !s) return;
    const pad = parseFloat(getComputedStyle(el).scrollPaddingLeft) || 0;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.mode === "lite";
    lockUntil.current = still ? 0 : now() + 700;
    el.scrollTo({ left: s.offsetLeft - pad, behavior: still ? "auto" : "smooth" });
    setActive(i);
  };

  return (
    <div role="region" aria-roledescription="карусель" aria-label={label}>
      <div className="grid grid-cols-4 gap-1 rounded-full bg-black/[0.06] p-1 md:hidden">
        {tabs.map((t, i) => (
          <button
            key={t}
            type="button"
            aria-controls={`finance-slide-${i}`}
            aria-current={i === active ? "true" : undefined}
            onClick={() => go(i)}
            className={`min-h-11 truncate rounded-full px-1 text-[0.875rem] font-medium transition-colors duration-300 ${i === active ? "bg-black text-white" : "text-gray-text"}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div
        ref={track}
        tabIndex={0}
        role="group"
        aria-label="Картки звіту, гортайте вбік"
        className="relative -mx-[clamp(1rem,0.5rem+2.5vw,2.5rem)] mt-5 flex snap-x snap-mandatory scroll-px-[clamp(1rem,0.5rem+2.5vw,2.5rem)] gap-4 overflow-x-auto overscroll-x-contain px-[clamp(1rem,0.5rem+2.5vw,2.5rem)] pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-2 md:gap-x-6 md:gap-y-10 md:overflow-visible md:px-0"
      >
        {slides.map((s, i) => (
          <div
            key={i}
            id={`finance-slide-${i}`}
            role="group"
            aria-roledescription="картка"
            aria-label={`${i + 1} з ${slides.length}: ${tabs[i] ?? ""}`}
            className={`w-[min(85%,22rem)] shrink-0 snap-start transition-opacity duration-300 md:w-auto ${i === active ? "" : "max-md:opacity-50"}`}
          >
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}
