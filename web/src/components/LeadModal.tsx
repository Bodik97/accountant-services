"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { formCopy, plans, plansCopy } from "@/content/site";
import LeadForm from "@/components/LeadForm";
import T from "@/components/ui/T";
import { Check } from "@/components/ui/icons";

export type Plan = (typeof plans)[number];

const DURATION = 400; // мс, як duration-400 у класах нижче

/**
 * Модальне вікно заявки на тариф. Нативний <dialog> + showModal(): фокус усередині, Esc, решта сторінки inert.
 * Телефон — нижня шторка (bottom sheet), md+ — панель по центру. Клік по фону закриває,
 * фокус повертається на кнопку, що відкрила вікно; сторінка під вікном не прокручується.
 * Стан анімації — атрибут data-state на <dialog> (без перерендеру); з reduced motion — без затримки.
 */
export default function LeadModal({ plan, open, onClose }: { plan: Plan | null; open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const sent = useRef(false);
  const [formKey, setFormKey] = useState(0);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    const html = document.documentElement;
    if (open) {
      if (!dlg.open) {
        trigger.current = document.activeElement as HTMLElement | null;
        dlg.showModal();
        html.style.overflow = "hidden";
        html.style.scrollbarGutter = "stable";
        // На десктопі з мишею — одразу в поле імені; на телефоні не відкриваємо клавіатуру самі
        if (matchMedia("(pointer: fine)").matches) dlg.querySelector<HTMLElement>('[data-field="name"]')?.focus();
      }
      const raf = requestAnimationFrame(() => requestAnimationFrame(() => (dlg.dataset.state = "open")));
      return () => cancelAnimationFrame(raf);
    }
    if (dlg.open) {
      dlg.dataset.state = "closed";
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const t = window.setTimeout(() => {
        dlg.close();
        html.style.overflow = "";
        html.style.scrollbarGutter = "";
        trigger.current?.focus({ preventScroll: true });
        // Після успішної заявки наступне відкриття — з чистою формою
        if (sent.current) {
          sent.current = false;
          setFormKey((k) => k + 1);
        }
      }, reduce ? 0 : DURATION);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  // Якщо компонент зникне з відкритим вікном — повертаємо прокрутку сторінці
  useEffect(() => () => {
    document.documentElement.style.overflow = "";
    document.documentElement.style.scrollbarGutter = "";
  }, []);

  const onSuccess = useCallback(() => {
    sent.current = true;
  }, []);

  const muted = "text-gray-text";

  return (
    <dialog
      ref={ref}
      data-state="closed"
      data-lenis-prevent
      aria-labelledby={titleId}
      aria-describedby={descId}
      onCancel={(e) => {
        e.preventDefault(); // Esc: закриваємо з анімацією
        onClose();
      }}
      className="group/dlg fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-hidden bg-transparent p-0 text-black backdrop:bg-transparent"
    >
      {/* Фон: клік закриває вікно */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity duration-400 group-data-[state=closed]/dlg:opacity-0"
      />
      <div className="pointer-events-none absolute inset-0 flex items-end justify-center md:items-center md:p-6">
        <div
          className="pointer-events-auto relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-[var(--radius-card-lg)] bg-white shadow-[var(--shadow-float)] transition-[translate,scale,opacity] duration-400 ease-out-expo md:max-h-[min(90dvh,52rem)] md:max-w-[34rem] md:rounded-[var(--radius-card-lg)] max-md:group-data-[state=closed]/dlg:translate-y-full md:group-data-[state=closed]/dlg:translate-y-4 md:group-data-[state=closed]/dlg:scale-[0.97] md:group-data-[state=closed]/dlg:opacity-0"
        >
          {/* Ручка шторки (декоративна) */}
          <span aria-hidden="true" className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-black/15 md:hidden" />
          <button
            type="button"
            onClick={onClose}
            aria-label={formCopy.modal.close}
            className="absolute right-3 top-3 z-10 grid size-11 place-items-center rounded-full bg-surface text-[1.5rem] leading-none transition-colors hover:bg-gray-light"
          >
            <span aria-hidden="true">×</span>
          </button>

          <div className="overflow-y-auto overscroll-contain px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-7 sm:px-8 sm:pb-8 sm:pt-8">
            {plan && (
              <>
                <div className="pr-12">
                  <p className={`flex items-center gap-2 text-[0.875rem] font-medium ${muted}`}>
                    {formCopy.modal.label}
                    {plan.featured && <span className="rounded-full bg-black px-2.5 py-0.5 text-[0.75rem] text-white">{plansCopy.recommended}</span>}
                  </p>
                  <h2 id={titleId} className="mt-1 text-[length:var(--text-h3)]">{plan.name}</h2>
                  <p className={`mt-1 text-[0.9375rem] ${muted}`}>{plan.for}</p>
                </div>
                <div className="mt-4 rounded-[var(--radius-card-sm)] bg-surface p-4">
                  <p className="flex items-baseline gap-2">
                    <span className={muted}>{formCopy.modal.from}</span>
                    <span className="metric text-[1.75rem]"><T>{plan.price}</T></span>
                    <span className={muted}>{formCopy.modal.perMonth}</span>
                  </p>
                  <ul className="mt-3 grid gap-2">
                    {plan.features.slice(0, 3).map((f) => (
                      <li key={f} className="flex gap-2.5 text-[0.875rem]">
                        <span className="mt-0.5 grid size-4.5 shrink-0 place-items-center rounded-full bg-black text-white" aria-hidden="true"><Check className="size-2.5" /></span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <p id={descId} className={`mb-5 mt-4 text-[0.9375rem] ${muted}`}>{formCopy.modal.lead}</p>
                <LeadForm key={`${plan.name}-${formKey}`} fixedPlan={plan.name} onClose={onClose} onSuccess={onSuccess} />
              </>
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
}
