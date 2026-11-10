"use client";

import { type KeyboardEvent, useActionState, useEffect, useId, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { submitLead } from "@/app/actions/lead";
import { contactMethods, formatPhone, nameError, phoneDigits, phoneError, NAME_MAX, type LeadState } from "@/lib/lead-schema";
import { brand, contact, formCopy as c } from "@/content/site";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import T from "@/components/ui/T";
import { PhoneIcon, TelegramIcon, ViberIcon } from "@/components/ui/ContactIcons";

type Field = "name" | "phone";
type Method = (typeof contactMethods)[number];

/**
 * Форма заявки (світла панель). Валідація на клієнті (на blur і при відправці) за тими самими правилами,
 * що й zod на сервері (lib/lead-schema.server.ts). Телефон — з префіксом +380 і маскою XX XXX XX XX.
 *
 * fixedPlan — режим модального вікна тарифу: пакет зафіксований, без заголовка і без слухача [data-plan].
 * onClose — у стані успіху показує кнопку «Закрити»; onSuccess — викликається після успішної відправки.
 */
export default function LeadForm({ fixedPlan, onClose, onSuccess }: { fixedPlan?: string; onClose?: () => void; onSuccess?: () => void }) {
  const inModal = fixedPlan !== undefined;
  const [state, action, pending] = useActionState<LeadState, FormData>(submitLead, { status: "idle" });
  const uid = useId();
  const id = (s: string) => `${uid}-${s}`;

  const [name, setName] = useState("");
  const [digits, setDigits] = useState("");
  const [method, setMethod] = useState<Method>(contactMethods[0]);
  const [pickedPlan, setPickedPlan] = useState("");
  const plan = fixedPlan ?? pickedPlan;

  // Помилки клієнта (з'являються після blur або спроби відправки) і поля, змінені після відповіді сервера
  const [touched, setTouched] = useState<Record<Field, boolean>>({ name: false, phone: false });
  const [editedAfterSubmit, setEditedAfterSubmit] = useState<Record<Field, boolean>>({ name: false, phone: false });

  // Час відкриття форми зберігаємо в ref і додаємо до FormData при відправці.
  // (Прихований input скидався при перерендері/після помилки — і сервер відхиляв справжні заявки.)
  const openedAt = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLParagraphElement>(null);

  const clientError: Record<Field, string | null> = { name: nameError(name), phone: phoneError(digits) };
  const serverErrors = state.status === "error" ? state.fieldErrors : undefined;
  const errorOf = (f: Field) =>
    (touched[f] ? clientError[f] : null) ?? (!editedAfterSubmit[f] ? serverErrors?.[f]?.[0] ?? null : null);

  const submit = (fd: FormData) => {
    if (pending) return; // захист від подвійної відправки (кнопка лишається у фокусі, тому без disabled)
    fd.set("ts", String(openedAt.current || Date.now()));
    fd.set("phone", `+380${digits}`);
    fd.set("name", name.trim().replace(/\s+/g, " "));
    return action(fd);
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    if (pending) {
      e.preventDefault();
      return;
    }
    setTouched({ name: true, phone: true });
    setEditedAfterSubmit({ name: false, phone: false });
    const first = (["name", "phone"] as const).find((f) => clientError[f]);
    if (first) {
      e.preventDefault();
      formRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus();
    }
  };

  // Після помилки сервера — фокус на перше невірне поле (скрінрідер одразу чує, що не так)
  // Успіх: фокус на заголовок результату (інакше він падає на body, а в модалці — поза вмістом діалогу)
  useEffect(() => {
    if (state.status === "success") successRef.current?.focus();
  }, [state.status]);

  useEffect(() => {
    if (state.status !== "error") return;
    formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [state]);

  useEffect(() => {
    if (state.status === "success") onSuccess?.();
  }, [state.status, onSuccess]);

  // Кнопки з data-plan (напр. «Обговорити цю послугу» в послугах) підставляють пакет у форму секції
  useEffect(() => {
    openedAt.current = Date.now();
    if (inModal) return;
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-plan]");
      if (el?.dataset.plan) setPickedPlan(el.dataset.plan);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [inModal]);

  const onName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setEditedAfterSubmit((s) => ({ ...s, name: true }));
  };

  // Маска телефону: лише цифри, формат XX XXX XX XX, курсор лишається після тієї ж цифри
  const onPhone = (e: ChangeEvent<HTMLInputElement>) => {
    const el = e.target;
    const caret = el.selectionStart ?? el.value.length;
    const next = phoneDigits(el.value);
    setDigits(next);
    setEditedAfterSubmit((s) => ({ ...s, phone: true }));
    if (caret >= el.value.length) return; // друк у кінці — курсор і так у кінці
    // Редагування всередині: ставимо курсор після тієї ж кількості цифр
    const before = Math.min(next.length, el.value.slice(0, caret).replace(/\D/g, "").length);
    const formatted = formatPhone(next);
    let pos = 0;
    for (let n = 0; pos < formatted.length && n < before; pos++) if (/\d/.test(formatted[pos])) n++;
    requestAnimationFrame(() => phoneRef.current?.setSelectionRange(pos, pos));
  };

  // Backspace одразу після пробілу маски видаляє цифру перед ним (інакше перше натискання «порожнє»)
  const onPhoneKey = (e: KeyboardEvent<HTMLInputElement>) => {
    const el = e.currentTarget;
    const at = el.selectionStart ?? 0;
    if (e.key !== "Backspace" || at !== el.selectionEnd || at === 0 || el.value[at - 1] !== " ") return;
    e.preventDefault();
    const n = el.value.slice(0, at).replace(/\D/g, "").length; // цифр до курсора
    const next = digits.slice(0, n - 1) + digits.slice(n);
    setDigits(next);
    setEditedAfterSubmit((s) => ({ ...s, phone: true }));
    const formatted = formatPhone(next);
    let pos = 0;
    for (let k = 0; pos < formatted.length && k < n - 1; pos++) if (/\d/.test(formatted[pos])) k++;
    requestAnimationFrame(() => phoneRef.current?.setSelectionRange(pos, pos));
  };

  if (state.status === "success") {
    const first = method === "Дзвінок" ? c.success.call : `${c.success.write} ${method}.`;
    return (
      <div role="status" className={`flex flex-col items-start gap-4 ${inModal ? "" : "min-h-[24rem] justify-center"}`}>
        <Badge tone="success">{c.success.eyebrow}</Badge>
        <p ref={successRef} tabIndex={-1} className="font-display text-[1.75rem] font-semibold leading-tight tracking-[-0.03em] outline-none sm:text-[2rem]">{c.success.title}</p>
        <div className="w-full rounded-[var(--radius-card-sm)] bg-surface p-5">
          <p className="text-[0.875rem] font-medium text-gray-text">{c.success.nextTitle}</p>
          <ol className="mt-3 grid gap-3">
            {[first, contact.next[1], contact.next[2]].map((n, i) => (
              <li key={n} className="flex gap-3 text-[0.9375rem]">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-black text-[0.75rem] text-white tabular-nums" aria-hidden="true">{i + 1}</span>
                <span className="pt-px"><T>{n}</T></span>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-[0.875rem] text-gray-text">{c.success.text} <T>{brand.hours}</T></p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <Button href={brand.telegramHref} variant="outline" target="_blank" rel="noopener" className="w-full sm:w-auto">{c.success.telegramCta}</Button>
          {onClose && <Button onClick={onClose} className="w-full sm:w-auto">{c.success.close}</Button>}
        </div>
      </div>
    );
  }

  const label = "text-[0.875rem] font-medium text-black";
  const hint = "pl-5 text-[0.8125rem] leading-snug text-gray-text";
  const err = "pl-5 text-[0.8125rem] font-medium leading-snug text-danger-ink";
  const box = "flex min-h-14 w-full items-center rounded-full border bg-white transition-[border-color,box-shadow] duration-200 focus-within:border-black focus-within:shadow-[0_0_0_3px_rgb(10_10_10/0.08)]";
  const boxState = (f: Field) => (errorOf(f) ? "border-danger-ink" : "border-black/20 hover:border-black/45");
  const input = "h-14 min-w-0 flex-1 bg-transparent text-base text-black placeholder:text-black/40 focus:outline-none";
  const describedBy = (f: Field) => `${id(`${f}-hint`)}${errorOf(f) ? ` ${id(`${f}-err`)}` : ""}`;

  return (
    <form ref={formRef} action={submit} onSubmit={onSubmit} noValidate className="grid grid-cols-1 gap-5">
      {!inModal && (
        <div className="grid gap-2 border-b border-black/[0.08] pb-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-display text-[1.375rem] font-semibold tracking-[-0.02em]">{c.header}</p>
            <Badge tone="success">{c.badge}</Badge>
          </div>
          <p className="text-[0.9375rem] text-gray-text">{c.intro}</p>
        </div>
      )}

      <div className="grid gap-1.5">
        <label htmlFor={id("name")} className={label}>{c.name.label}</label>
        <div className={`${box} ${boxState("name")} px-5`}>
          <input
            id={id("name")} name="name" data-field="name" className={input}
            autoComplete="name" autoCapitalize="words" enterKeyHint="next" spellCheck={false}
            maxLength={NAME_MAX + 10} required placeholder={c.name.placeholder}
            value={name} onChange={onName} onBlur={() => setTouched((t) => ({ ...t, name: true }))}
            aria-invalid={!!errorOf("name")} aria-describedby={describedBy("name")}
          />
        </div>
        {errorOf("name")
          ? <p id={id("name-err")} className={err}>{errorOf("name")}</p>
          : null}
        <p id={id("name-hint")} className={hint}>{c.name.hint}</p>
      </div>

      <div className="grid gap-1.5">
        <label htmlFor={id("phone")} className={label}>{c.phone.label}</label>
        <div className={`${box} ${boxState("phone")} pl-5 pr-5`}>
          <span className="mr-2 select-none border-r border-black/15 pr-3 text-base font-medium tabular-nums text-black" aria-hidden="true">+380</span>
          <input
            ref={phoneRef} id={id("phone")} name="phone" data-field="phone" type="tel" inputMode="tel"
            autoComplete="tel-national" enterKeyHint={inModal ? "send" : "next"} required
            placeholder={c.phone.placeholder} className={`${input} tabular-nums`} maxLength={20}
            value={formatPhone(digits)} onChange={onPhone} onKeyDown={onPhoneKey} onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
            aria-invalid={!!errorOf("phone")} aria-describedby={describedBy("phone")}
          />
        </div>
        {errorOf("phone")
          ? <p id={id("phone-err")} className={err}>{errorOf("phone")}</p>
          : null}
        <p id={id("phone-hint")} className={hint}>{c.phone.hint}</p>
      </div>

      <fieldset className="grid gap-2">
        <legend className={`${label} mb-2`}>{c.methodLegend}</legend>
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
          {contactMethods.map((m) => {
            const Icon = m === "Telegram" ? TelegramIcon : m === "Viber" ? ViberIcon : PhoneIcon;
            return (
              <label key={m} className="group relative" title={m}>
                <input type="radio" name="method" value={m} checked={method === m} onChange={() => setMethod(m)} className="peer sr-only" />
                {/* Обраний спосіб: чорна рамка і галочка; необраний — приглушений, яскравіший при наведенні */}
                {/* Плитка на всю третину ширини: іконка + підпис усередині */}
                <span className="flex h-[5.25rem] w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border border-black/15 bg-white text-[0.8125rem] text-gray-text transition-[border-color,box-shadow,background-color,color] duration-200 group-hover:border-black/40 peer-checked:border-black peer-checked:bg-surface peer-checked:font-medium peer-checked:text-black peer-checked:shadow-[inset_0_0_0_1px_#0a0a0a] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-black">
                  <Icon className={m === "Дзвінок" ? "size-7 text-black" : "size-8"} />
                  {m}
                </span>
                <span aria-hidden="true" className="absolute right-2 top-2 grid size-5 scale-0 place-items-center rounded-full bg-success text-black transition-transform duration-200 peer-checked:scale-100">
                  <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5 9-10" /></svg>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <input type="hidden" name="plan" value={plan} />
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>Не заповнюйте<input name="hp_extra" tabIndex={-1} autoComplete="off" /></label>
      </div>

      {!inModal && plan && (
        <p className="flex flex-wrap items-center gap-2 text-sm text-gray-text">
          {c.selectedPlan}
          <span className="inline-flex min-h-11 items-center gap-1 rounded-full bg-surface pl-4 pr-1 font-medium text-black">
            {plan}
            <button
              type="button" onClick={() => setPickedPlan("")} aria-label={`${c.removePlan} «${plan}»`}
              className="grid size-11 place-items-center rounded-full text-[1.25rem] leading-none text-gray-text transition-colors hover:text-black"
            >
              <span aria-hidden="true">×</span>
            </button>
          </span>
        </p>
      )}

      <Button
        type="submit" aria-disabled={pending}
        arrow className={`w-full justify-between py-1.5 text-left text-[0.9375rem] sm:text-base ${pending ? "cursor-progress opacity-80" : ""}`}
      >
        <span className="inline-flex items-center gap-2.5">
          {pending && <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />}
          {pending ? c.pending : c.submit}
        </span>
      </Button>
      <p aria-live="polite" className="sr-only">{pending ? c.pending : ""}</p>
      {state.status === "error" && state.message && <p role="alert" className="text-sm font-medium text-danger-ink">{state.message}</p>}
      <p className="text-[0.8125rem] text-gray-text">{c.trustNote}</p>
    </form>
  );
}
