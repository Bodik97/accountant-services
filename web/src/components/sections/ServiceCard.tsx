"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import { ArrowRight, Check } from "@/components/ui/icons";

/**
 * Картка послуги: світло за курсором (десктоп), клік/тап/Enter — розгортає «Що входить»
 * і кнопку «Обговорити», яка підставляє послугу у форму заявки (через data-plan).
 */
export default function ServiceCard({ title, text, price, includes, icon }: {
  title: string;
  text: string;
  price: ReactNode;
  includes: readonly string[];
  icon: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const card = useRef<HTMLDivElement>(null);
  const panelId = useId();

  const onMove = (e: React.PointerEvent) => {
    const el = card.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--sx", `${e.clientX - r.left}px`);
    el.style.setProperty("--sy", `${e.clientY - r.top}px`);
  };

  return (
    <div
      ref={card}
      onPointerMove={onMove}
      data-service-card
      className={`group relative isolate flex flex-col overflow-hidden rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)] transition-[transform,box-shadow] duration-300 [--sx:50%] [--sy:0%] hover:-translate-y-1 hover:shadow-[var(--shadow-float)] ${open ? "ring-1 ring-black" : ""}`}
    >
      {/* Світло за курсором */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(320px_circle_at_var(--sx)_var(--sy),rgb(10_10_10/0.06),transparent_70%)]" />
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="flex min-h-[16rem] flex-1 flex-col p-6 text-left focus-visible:outline-offset-[-4px]"
      >
        <span className="flex items-start justify-between gap-4">
          <span className={`grid size-11 place-items-center rounded-full transition-colors duration-300 ${open ? "bg-black text-white" : "bg-surface text-black group-hover:bg-black group-hover:text-white"}`} aria-hidden="true">
            {icon}
          </span>
          {/* Кнопка-«плюс»: пульсує, доки картку не відкрили — підказка, що сюди можна натиснути */}
          <span className={`relative grid size-10 place-items-center rounded-full text-[1.25rem] leading-none transition-[transform,background-color,color] duration-300 ${open ? "rotate-45 bg-black text-white" : "bg-black text-white group-hover:scale-110"}`} aria-hidden="true">
            {!open && <span className="svc-ping absolute inset-0 rounded-full border-2 border-black/40" />}
            +
          </span>
        </span>
        <span className="mt-5 font-display text-[1.1875rem] font-semibold tracking-[-0.02em]">{title}</span>
        <span className="mb-5 mt-2 text-[0.9375rem] text-gray-text md:min-h-[4.8em]">{text}</span>
        <span className="mt-auto flex items-center justify-between gap-3 border-t border-black/[0.08] pt-4">
          <span className="font-medium tabular-nums">{price}</span>
          <span className={`inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 text-[0.8125rem] font-medium transition-colors duration-300 ${open ? "border-black bg-black text-white" : "border-black/15 text-black group-hover:border-black"}`}>
            {open ? "Згорнути" : "Що входить"}
            <svg viewBox="0 0 24 24" className={`size-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
          </span>
        </span>
      </button>

      {/* Розгортання без стрибка висоти: grid 0fr → 1fr */}
      <div id={panelId} inert={!open} className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <div className="border-t border-black/[0.08] bg-surface p-6">
            <ul className="grid gap-2.5">
              {includes.map((it) => (
                <li key={it} className="flex gap-3 text-[0.9375rem]">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-black text-white" aria-hidden="true"><Check className="size-3" /></span>
                  {it}
                </li>
              ))}
            </ul>
            <a
              href="#contact"
              data-plan={title}
              tabIndex={open ? 0 : -1}
              className="group/cta mt-5 inline-flex min-h-11 items-center gap-3 rounded-full bg-black py-1.5 pl-5 pr-1.5 text-[0.9375rem] font-medium text-white"
            >
              Обговорити цю послугу
              <span className="grid size-8 place-items-center rounded-full bg-white text-black transition-transform duration-200 group-hover/cta:translate-x-0.5"><ArrowRight /></span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
