"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { submitLead } from "@/app/actions/lead";
import { contactMethods, type LeadState } from "@/lib/lead-schema";
import { brand } from "@/content/site";
import T from "@/components/ui/T";

export default function LeadForm() {
  const [state, action, pending] = useActionState<LeadState, FormData>(submitLead, { status: "idle" });
  const [plan, setPlan] = useState("");
  const tsRef = useRef<HTMLInputElement>(null);

  // Кнопки «Обрати» в цінах підставляють пакет у форму
  useEffect(() => {
    if (tsRef.current) tsRef.current.value = String(Date.now());
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-plan]");
      if (el?.dataset.plan) setPlan(el.dataset.plan);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  if (state.status === "success") {
    return (
      <div role="status" className="flex min-h-[24rem] flex-col items-start justify-center gap-4 border border-line-strong p-8">
        <p className="caption uppercase tracking-[0.14em] text-brass">Заявку прийнято</p>
        <b className="font-display text-3xl font-normal">Дякуємо. Ми зв&apos;яжемося з вами.</b>
        <p className="text-bone-dim">Відповідаємо в робочий час: <T>{brand.hours}</T></p>
        <a href={brand.telegramHref} target="_blank" rel="noopener" className="btn btn-secondary mt-2">Написати в Telegram зараз</a>
      </div>
    );
  }

  const errors = state.status === "error" ? state.fieldErrors : undefined;
  const values = state.status === "error" ? state.values : undefined;
  return (
    <form action={action} noValidate className="relative grid gap-7 border border-line-strong p-[clamp(1.25rem,1rem+2vw,2.75rem)]">
      {/* Шапка «бланка» */}
      <div className="-mx-[clamp(1.25rem,1rem+2vw,2.75rem)] -mt-[clamp(1.25rem,1rem+2vw,2.75rem)] mb-1 flex items-baseline justify-between border-b border-line-strong px-[clamp(1.25rem,1rem+2vw,2.75rem)] py-4">
        <span className="caption uppercase tracking-[0.14em] text-brass">Заявка на консультацію</span>
        <span className="caption text-bone-dim">Безкоштовно</span>
      </div>
      <div className="grid gap-2">
        <label htmlFor="f-name" className="caption uppercase tracking-[0.12em] text-bone-dim">Ваше ім&apos;я</label>
        <input id="f-name" name="name" className="field-input field-line" autoComplete="given-name" enterKeyHint="next" required placeholder="Олена" defaultValue={values?.name}
          aria-invalid={!!errors?.name} aria-describedby={errors?.name ? "e-name" : undefined} />
        {errors?.name && <small id="e-name" className="text-sm text-danger">{errors.name[0]}</small>}
      </div>

      <div className="grid gap-2">
        <label htmlFor="f-phone" className="caption uppercase tracking-[0.12em] text-bone-dim">Телефон</label>
        <input id="f-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" enterKeyHint="send" required placeholder="+38 067 123 45 67" defaultValue={values?.phone}
          className="field-input field-line" aria-invalid={!!errors?.phone} aria-describedby={errors?.phone ? "e-phone" : undefined} />
        {errors?.phone && <small id="e-phone" className="text-sm text-danger">{errors.phone[0]}</small>}
      </div>

      <fieldset className="grid gap-2">
        <legend className="caption mb-3 uppercase tracking-[0.12em] text-bone-dim">Як зручніше зв&apos;язатися</legend>
        <div className="grid grid-cols-3 gap-2">
          {contactMethods.map((m, i) => (
            <label key={m} className="relative">
              <input type="radio" name="method" value={m} defaultChecked={i === 0} className="peer sr-only" />
              <span className="flex min-h-11 cursor-pointer items-center justify-center rounded-sm border border-line-strong text-sm transition-colors duration-200 peer-checked:border-brass peer-checked:bg-brass/10 peer-checked:text-brass peer-focus-visible:outline-2 peer-focus-visible:outline-brass">
                {m}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <input type="hidden" name="plan" value={plan} />
      <input ref={tsRef} type="hidden" name="ts" defaultValue="" />
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>Сайт<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      {plan && <p className="text-sm text-bone-dim">Обраний пакет: <b className="text-brass">{plan}</b></p>}

      <button type="submit" disabled={pending} className="btn btn-primary mt-1 w-full">
        {pending ? "Надсилаємо…" : "Записатися на консультацію"}
      </button>
      {state.status === "error" && state.message && <p role="alert" className="text-center text-sm text-danger">{state.message}</p>}
      <p className="caption text-bone-dim">Без зобов&apos;язань. Дані використовуємо лише для відповіді на заявку.</p>
    </form>
  );
}
