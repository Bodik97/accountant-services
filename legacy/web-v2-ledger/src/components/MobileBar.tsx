"use client";

import { useEffect, useState } from "react";
import { brand } from "@/content/site";

/** Нижня панель дій на телефоні: з'являється після першого екрана, ховається біля форми і при відкритій клавіатурі. */
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
      className={`fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 grid grid-cols-[auto_auto_1fr] gap-2 rounded-sm border border-line bg-ink-2/95 p-1.5 transition-[transform,opacity] duration-300 ease-out-soft lg:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-[150%] opacity-0"
      }`}
      aria-hidden={!show}
    >
      <a href={brand.phoneHref} tabIndex={show ? 0 : -1} className="flex min-h-12 items-center rounded-sm px-4 text-sm font-medium">Подзвонити</a>
      <a href={brand.telegramHref} target="_blank" rel="noopener" tabIndex={show ? 0 : -1} className="flex min-h-12 items-center rounded-sm px-4 text-sm font-medium">Telegram</a>
      <a href="#contact" tabIndex={show ? 0 : -1} className="flex min-h-12 items-center justify-center rounded-sm bg-brass px-4 text-sm font-semibold text-ink">Заявка</a>
    </div>
  );
}
