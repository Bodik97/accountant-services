"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { brand, nav } from "@/content/site";
import Button from "@/components/ui/Button";
import T from "@/components/ui/T";
import { ArrowRight } from "@/components/ui/icons";
import { PhoneIcon, TelegramIcon, ViberIcon } from "@/components/ui/ContactIcons";
import LeadModal from "@/components/LeadModal";

/**
 * Шапка — завжди закріплена зверху (не ховається при прокрутці).
 * Над hero: прозора; після прокрутки — біла напівпрозора панель із розмиттям і тонкою лінією знизу.
 * Телефон: лого, кругла кнопка дзвінка і pill «Меню» (лінії морфляться в ×). Меню — аркуш зверху + затемнення.
 */
export default function Header() {
  const [open, setOpen] = useState(false);
  const [consult, setConsult] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const burger = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  const navigated = useRef(false);

  useEffect(() => {
    const onScroll = () => setScrolled(scrollY > 40);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  // Активний розділ: секція, що перетинає середину екрана
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(`#${e.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    document.querySelectorAll("main section[id]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    // Поки меню відкрите, решта сторінки недоступна для фокусу (Tab не «втікає» під меню)
    document.querySelectorAll("main, footer, [data-mobile-bar], [data-skip-link]").forEach((el) => el.toggleAttribute("inert", open));
    // Після закриття кнопкою/Escape повертаємо фокус на кнопку меню; після переходу за посиланням — ні
    if (!open && wasOpen.current && !navigated.current) burger.current?.focus();
    navigated.current = false;
    wasOpen.current = open;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open]);

  // Меню закривається, якщо екран розширили до десктопа
  useEffect(() => {
    const mq = matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const go = () => {
    navigated.current = true;
    setOpen(false);
  };

  const solid = scrolled || open;
  // На телефоні hero зверху чорний — поки панель прозора, кнопки інверсні
  const phoneInk = solid ? "border-black/15 text-black hover:border-black" : "border-white/30 text-white hover:border-white";
  const menuInk = solid ? "bg-black text-white hover:bg-[#262626]" : "bg-white text-black hover:bg-gray-light";

  const contacts = [
    { href: brand.phoneHref, label: "Дзвінок", icon: <PhoneIcon className="size-6" />, external: false },
    { href: brand.telegramHref, label: "Telegram", icon: <TelegramIcon className="size-6" />, external: true },
    { href: brand.viberHref, label: "Viber", icon: <ViberIcon className="size-6" />, external: false },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b pt-[env(safe-area-inset-top)] transition-[background-color,border-color] duration-300 ${
        open ? "border-transparent bg-white" : scrolled ? "border-hairline bg-white/85 backdrop-blur-xl" : "border-transparent bg-transparent"
      }`}
    >
      <div className="grid h-16 items-center lg:h-20 lg:grid-cols-2">
        <div className="flex items-center justify-between px-[clamp(1rem,0.5rem+2.5vw,2.5rem)] lg:pl-[max(clamp(1rem,0.5rem+2.5vw,2.5rem),calc(50vw-40rem+clamp(1rem,0.5rem+2.5vw,2.5rem)))]">
          <a
            href="#top"
            onClick={() => setOpen(false)}
            className={`flex min-h-11 items-center font-display text-[1.375rem] font-bold tracking-[-0.04em] transition-colors duration-300 ${solid ? "text-black" : "text-white"}`}
          >
            {brand.name}
          </a>
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href={brand.phoneHref}
              aria-label={`Подзвонити ${brand.phone}`}
              className={`grid size-11 place-items-center rounded-full border transition-colors duration-300 ${phoneInk}`}
            >
              <PhoneIcon className="size-[1.125rem]" />
            </a>
            <button
              ref={burger}
              type="button"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
              className={`inline-flex min-h-11 min-w-[6.75rem] items-center justify-between gap-3 rounded-full pl-5 pr-4 text-[0.9375rem] font-medium transition-colors duration-300 ${menuInk}`}
            >
              <span>{open ? "Закрити" : "Меню"}</span>
              <span aria-hidden="true" className="relative block size-4">
                <span className={`absolute left-0 top-1/2 h-[1.5px] w-4 rounded-full bg-current transition-transform duration-300 ease-[var(--ease-out-expo)] ${open ? "rotate-45" : "-translate-y-[3px]"}`} />
                <span className={`absolute left-0 top-1/2 h-[1.5px] rounded-full bg-current transition-[transform,width] duration-300 ease-[var(--ease-out-expo)] ${open ? "w-4 -rotate-45" : "w-2.5 translate-y-[3px]"}`} />
              </span>
            </button>
          </div>
        </div>

        <div className="hidden items-center justify-between gap-2 pl-4 xl:pl-8 pr-[max(clamp(1rem,0.5rem+2.5vw,2.5rem),calc(50vw-40rem+clamp(1rem,0.5rem+2.5vw,2.5rem)))] lg:flex">
          <nav aria-label="Основна навігація" className="flex items-center gap-1">
            {nav.map((l) => (
              <a
                key={l.href}
                href={l.href}
                aria-current={active === l.href ? "location" : undefined}
                className={`flex min-h-11 items-center rounded-full px-3 text-[0.9375rem] transition-colors duration-200 hover:text-black ${
                  active === l.href ? "text-black" : "text-black/70"
                }`}
              >
                {l.label}
              </a>
            ))}
          </nav>
          {/* Відкриває вікно заявки; без JS — звичайне посилання на форму внизу сторінки */}
          <Button
            href="#contact"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              setConsult(true);
            }}
          >
            Консультація
          </Button>
        </div>
      </div>

      <div id="mobile-menu" hidden={!open} className="lg:hidden">
        <div className="flex h-[calc(100svh-4rem-env(safe-area-inset-top))] flex-col">
          <div
            data-lenis-prevent
            className="menu-sheet max-h-full overflow-y-auto rounded-b-[28px] bg-white px-[clamp(1rem,0.5rem+2.5vw,2.5rem)] pb-[calc(1.5rem+env(safe-area-inset-bottom))] text-black shadow-[var(--shadow-float)]"
          >
            <nav aria-label="Мобільна навігація" className="border-t border-hairline">
              <ul>
                {nav.map((l, i) => {
                  const current = active === l.href;
                  return (
                    <li key={l.href} className="menu-item border-b border-hairline" style={{ "--i": i } as CSSProperties}>
                      <a
                        href={l.href}
                        onClick={go}
                        aria-current={current ? "location" : undefined}
                        className="group flex min-h-[4.25rem] items-center gap-4 py-2"
                      >
                        <span className="caption w-6 text-gray-text" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                        <span className="flex-1 font-display text-[clamp(1.75rem,1.4rem+1.5vw,2.25rem)] font-semibold leading-none tracking-[-0.035em]">
                          {l.label}
                          {current && <span aria-hidden="true" className="ml-2 inline-block size-2 -translate-y-1 rounded-full bg-success align-middle" />}
                        </span>
                        <span
                          aria-hidden="true"
                          className={`grid size-10 place-items-center rounded-full transition-colors duration-200 ${current ? "bg-black text-white" : "bg-surface text-black group-hover:bg-black group-hover:text-white"}`}
                        >
                          <ArrowRight />
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="menu-item mt-6" style={{ "--i": nav.length } as CSSProperties}>
              <Button href="#contact" arrow className="w-full" onClick={go}>Записатися на консультацію</Button>
            </div>

            <div className="menu-item mt-6" style={{ "--i": nav.length + 1 } as CSSProperties}>
              <p className="caption mb-3 text-gray-text">Зв&apos;язатися зі мною напряму</p>
              <ul className="grid grid-cols-3 gap-2">
                {contacts.map((c) => (
                  <li key={c.label}>
                    <a
                      href={c.href}
                      {...(c.external ? { target: "_blank", rel: "noopener" } : {})}
                      className="flex min-h-[4.75rem] flex-col items-center justify-center gap-2 rounded-[20px] border border-transparent bg-surface px-2 text-sm font-medium transition-colors duration-200 hover:border-black/15"
                    >
                      {c.icon}
                      {c.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="menu-item mt-4 flex items-center gap-3 rounded-[20px] border border-hairline px-4 py-3" style={{ "--i": nav.length + 2 } as CSSProperties}>
              <svg className="size-5 shrink-0 text-gray-text" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
              <p className="text-sm leading-snug">
                <span className="block text-gray-text">Графік роботи</span>
                <T>{brand.hours}</T>
              </p>
            </div>
          </div>
          {/* Затемнення під аркушем: клік закриває меню (для клавіатури є Escape і кнопка «Закрити») */}
          <div aria-hidden="true" onClick={() => setOpen(false)} className="menu-backdrop min-h-6 flex-1 bg-black/40" />
        </div>
      </div>
      {/* <dialog> відкривається у top layer, тож положення всередині шапки не впливає на вигляд */}
      <LeadModal plan={null} open={consult} onClose={() => setConsult(false)} />
    </header>
  );
}
