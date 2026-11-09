"use client";

import { useEffect, useState } from "react";
import { brand, nav } from "@/content/site";
import T from "@/components/ui/T";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = scrollY;
    const onScroll = () => {
      const y = scrollY;
      setScrolled(y > 40);
      setHidden(y > 400 && y > last);
      last = y;
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] transition-[transform,background-color,border-color] duration-300 ease-out-soft ${
        hidden && !open ? "-translate-y-full" : ""
      } ${scrolled || open ? "border-b border-line bg-ink/95" : "border-b border-transparent"}`}
    >
      <div className="container-x flex h-16 items-center justify-between gap-4 lg:h-20">
        <a href="#top" className="font-display text-2xl font-semibold tracking-tight" onClick={() => setOpen(false)}>
          {brand.name}
          <span className="text-brass">.</span>
        </a>

        <nav aria-label="Основна навігація" className="hidden items-center gap-1 lg:flex">
          {nav.map((l) => (
            <a key={l.href} href={l.href} className="flex min-h-11 items-center px-4 text-[0.95rem] text-bone-dim transition-colors hover:text-bone">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a href={brand.phoneHref} aria-label={`Подзвонити ${brand.phone}`} className="grid size-11 place-items-center rounded-sm border border-line-strong lg:hidden">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
            </svg>
          </a>
          <a href="#contact" className="btn btn-primary hidden min-h-11 px-5 text-[0.9rem] lg:inline-flex">
            Консультація
          </a>
          <button
            type="button"
            aria-label={open ? "Закрити меню" : "Відкрити меню"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="grid size-11 place-items-center rounded-sm border border-line-strong lg:hidden"
          >
            <span className="relative block h-3 w-5">
              <span className={`absolute left-0 h-px w-5 bg-bone transition-transform duration-200 ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 h-px w-5 bg-bone transition-transform duration-200 ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        hidden={!open}
        className="h-[calc(100svh-4rem-env(safe-area-inset-top))] overflow-y-auto bg-ink px-[clamp(1rem,0.6rem+2vw,2.5rem)] pb-[calc(2rem+env(safe-area-inset-bottom))] lg:hidden"
      >
        <nav aria-label="Мобільна навігація" className="flex flex-col border-t border-line">
          {nav.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="flex min-h-14 items-center border-b border-line font-display text-2xl">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="mt-8 grid gap-3">
          <a href="#contact" onClick={() => setOpen(false)} className="btn btn-primary w-full">Записатися на консультацію</a>
          <div className="grid grid-cols-2 gap-3">
            <a href={brand.phoneHref} className="btn btn-secondary w-full">Подзвонити</a>
            <a href={brand.telegramHref} target="_blank" rel="noopener" className="btn btn-secondary w-full">Telegram</a>
          </div>
          <p className="mt-2 text-center text-sm text-bone-dim"><T>{brand.hours}</T></p>
        </div>
      </div>
    </header>
  );
}
