"use client";

import { useId, useState } from "react";
import { formCopy, plans, plansCopy } from "@/content/site";
import SectionHead from "@/components/ui/SectionHead";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import T from "@/components/ui/T";
import { Check } from "@/components/ui/icons";
import LeadModal, { type Plan } from "@/components/LeadModal";

export default function Pricing() {
  const [active, setActive] = useState<Plan | null>(null);
  const [open, setOpen] = useState(false);
  return (
    <section id="pricing" className="section-y bg-white">
      <div className="container-x">
        <SectionHead
          label="Ціни"
          title="Скільки коштує спокій"
          intro="Точну суму називаю після безкоштовної консультації і фіксую в договорі. Вона залежить від кількості операцій і працівників."
        />
        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((p) => (
            <PlanCard
              key={p.name}
              plan={p}
              onChoose={() => {
                setActive(p);
                setOpen(true);
              }}
            />
          ))}
        </div>
        <p className="mt-5 text-center text-[0.875rem] text-gray-text">Перевірка поточної звітності — безкоштовно для всіх пакетів.</p>
      </div>
      <LeadModal plan={active} open={open} onClose={() => setOpen(false)} />
    </section>
  );
}

/**
 * Картка тарифу. До lg список «Що входить» згортається в акордеон (grid-rows 0fr → 1fr),
 * рекомендований пакет відкритий одразу; на lg+ список завжди видно, кнопка-перемикач схована.
 */
function PlanCard({ plan: p, onChoose }: { plan: Plan; onChoose: () => void }) {
  const dark = p.featured;
  const [expanded, setExpanded] = useState<boolean>(p.featured);
  const panelId = useId();
  const muted = dark ? "text-gray-mid" : "text-gray-text";

  return (
    <Card variant={dark ? "dark" : "light"} radius="lg" className={`flex min-w-0 flex-col p-6 sm:p-8 ${dark ? "md:max-lg:order-first md:max-lg:col-span-2" : ""}`} data-plan-col>
      <div className="flex items-center justify-between gap-3">
        <h3>{p.name}</h3>
        {dark && <span className="rounded-full bg-white px-3 py-1 text-[0.75rem] font-medium text-black">{plansCopy.recommended}</span>}
      </div>
      <p className={`mt-2 text-[0.9375rem] lg:min-h-[3em] ${muted}`}>{p.for}</p>
      <p className="mt-5 flex items-baseline gap-2 lg:mt-6">
        <span className={muted}>{formCopy.modal.from}</span>
        <span className="metric text-[length:var(--text-price)]"><T>{p.price}</T></span>
        <span className={muted}>{formCopy.modal.perMonth}</span>
      </p>

      <div className={`mt-5 border-t lg:mt-6 ${dark ? "border-white/10" : "border-black/[0.08]"}`}>
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={() => setExpanded((v) => !v)}
          className="flex min-h-12 w-full items-center justify-between gap-3 pt-1 text-left text-[0.9375rem] font-medium lg:hidden"
        >
          <span>
            {plansCopy.toggle} <span className={`font-normal tabular-nums ${muted}`}>· {p.features.length}</span>
          </span>
          <span
            aria-hidden="true"
            className={`grid size-8 place-items-center rounded-full border text-[1.125rem] leading-none transition-transform duration-300 ${dark ? "border-white/20" : "border-black/15"} ${expanded ? "rotate-45" : ""}`}
          >
            +
          </span>
        </button>
        <div
          id={panelId}
          className={`grid transition-[grid-template-rows,visibility] duration-300 ease-out lg:grid-rows-[1fr] ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr] max-lg:invisible"}`}
        >
          <div className="overflow-hidden">
            <ul className="grid gap-3 pb-1 pt-2 lg:pt-6">
              {p.features.map((f) => (
                <li key={f} className="flex gap-3 text-[0.9375rem]">
                  <span className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full ${dark ? "bg-white text-black" : "bg-black text-white"}`} aria-hidden="true"><Check className="size-3" /></span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-6 lg:pt-8">
        <Button
          onClick={onChoose}
          aria-haspopup="dialog"
          variant={dark ? "primary" : "outline"}
          surface={dark ? "dark" : "light"}
          arrow
          className="w-full justify-between whitespace-normal! py-1.5 text-left"
        >
          {plansCopy.cta} «{p.name}»
        </Button>
      </div>
    </Card>
  );
}
