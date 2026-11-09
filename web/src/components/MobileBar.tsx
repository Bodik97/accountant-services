"use client";

import { useEffect, useState } from "react";
import { brand } from "@/content/site";
import { ArrowRight } from "@/components/ui/icons";
import { PhoneIcon, TelegramIcon, ViberIcon } from "@/components/ui/ContactIcons";

// Кнопка зв'язку: іконка над коротким підписом
const item = "flex min-h-12 min-w-[3.75rem] flex-col items-center justify-center gap-0.5 rounded-full px-2 text-[0.6875rem] font-medium leading-none text-white/90 transition-colors hover:bg-white/10";

/** Нижня панель дій на телефоні (дзвінок, Telegram, Viber + головна «Заявка»): з'являється після першого екрана, ховається біля форми і при відкритій клавіатурі. */
export default function MobileBar() {
  const [heroVisible, setHeroVisible] = useState(true);
  const [contactVisible, setContactVisible] = useState(false);
  const [keyboard, setKeyboard] = useState(false);

  useEffect(() => {
    const cta = document.getElementById("hero");
    const contact = document.getElementById("contact");
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === cta) setHeroVisible(e.isIntersecting);
        if (e.target === contact) setContactVisible(e.isIntersecting);
      }
    }, { rootMargin: "0px 0px -10% 0px" });
    if (cta) io.observe(cta);
    if (contact) io.observe(contact);

    const vv = window.visualViewport;
    const onResize = () => vv && setKeyboard(vv.height < innerHeight * 0.75);
    vv?.addEventListener("resize", onResize);
    return () => {
      io.disconnect();
      vv?.removeEventListener("resize", onResize);
    };
  }, []);

  const show = !heroVisible && !contactVisible && !keyboard;
  return (
    <div
      data-mobile-bar
      className={`fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 mx-auto grid max-w-md grid-cols-[auto_auto_auto_1fr] items-center gap-1 rounded-full bg-black p-1.5 text-white shadow-[var(--shadow-float)] transition-[transform,opacity] duration-300 lg:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-[150%] opacity-0"
      }`}
      aria-hidden={!show}
    >
      <a href={brand.phoneHref} aria-label={`Подзвонити ${brand.phone}`} tabIndex={show ? 0 : -1} className={item}>
        <PhoneIcon className="size-5" />
        <span aria-hidden="true">Дзвінок</span>
      </a>
      <a href={brand.telegramHref} target="_blank" rel="noopener" tabIndex={show ? 0 : -1} className={item}>
        <TelegramIcon className="size-5" />
        Telegram
      </a>
      <a href={brand.viberHref} tabIndex={show ? 0 : -1} className={item}>
        <ViberIcon className="size-5" />
        Viber
      </a>
      <a href="#contact" tabIndex={show ? 0 : -1} className="group flex min-h-12 items-center justify-center gap-2 rounded-full bg-white pl-4 pr-1.5 text-sm font-semibold text-black">
        Заявка
        <span aria-hidden="true" className="grid size-9 place-items-center rounded-full bg-black text-white transition-transform duration-200 group-hover:translate-x-0.5">
          <ArrowRight />
        </span>
      </a>
    </div>
  );
}
