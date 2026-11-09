import type { ReactNode } from "react";
import { accountant, guarantees } from "@/content/site";
import SectionHead from "@/components/ui/SectionHead";
import Card from "@/components/ui/Card";
import T from "@/components/ui/T";
import { Check } from "@/components/ui/icons";

/* Іконки гарантій (лінія 1.75, як в ui/icons). Декоративні. */
const svg = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.75, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;
const ShieldIcon = () => (
  <svg className="size-5" {...svg}><path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6l7-3z" /><path d="M9 12l2 2 4-4" /></svg>
);
const PersonIcon = () => (
  <svg className="size-5" {...svg}><circle cx="9" cy="8" r="3.5" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" /><path d="M15 4h5.5v4.5H18l-2 1.5V8.5h-1z" /></svg>
);
const ReportIcon = () => (
  <svg className="size-5" {...svg}><path d="M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" /><path d="M14 3v5h5" /><path d="M9 17v-3M12 17v-5M15 17v-2" /></svg>
);

/** Спільна оболонка картки гарантії: іконка, номер, обіцянка, пояснення, «доказ». */
function GuaranteeCard({ n, icon, title, text, children, wide = false, className = "" }: {
  n: string; icon: ReactNode; title: string; text: string; children: ReactNode; wide?: boolean; className?: string;
}) {
  return (
    <Card
      variant="dark"
      radius="lg"
      data-tilt
      className={`group flex h-full flex-col border border-white/[0.08] p-6 transition-colors duration-300 hover:border-white/20 sm:p-8 ${wide ? "lg:grid lg:grid-cols-2 lg:items-center lg:gap-12 lg:p-10" : ""} ${className}`}
    >
      <div>
        <div className="flex items-center justify-between">
          <span className="grid size-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.06] transition-colors duration-300 group-hover:bg-white group-hover:text-black">
            {icon}
          </span>
          <span className="caption text-gray-mid" aria-hidden="true">{n}</span>
        </div>
        <h3 className="mt-8 text-[1.375rem] sm:text-[1.5rem]">{title}</h3>
        <p className="mt-2 max-w-[42ch] text-[0.9375rem] text-gray-mid"><T>{text}</T></p>
      </div>
      <div className={`mt-auto pt-8 ${wide ? "lg:mt-0 lg:pt-0" : ""}`} aria-hidden="true">
        <div className="relative transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-1">{children}</div>
      </div>
    </Card>
  );
}

const Sample = ({ on = "dark" }: { on?: "dark" | "light" }) => (
  <span className={`absolute right-3 top-3 rounded-full px-2 py-0.5 text-[0.6875rem] font-medium ${on === "dark" ? "bg-white/[0.08] text-gray-light" : "bg-black/[0.06] text-gray-text"}`}>
    {guarantees.sample}
  </span>
);
const Bar = ({ w, light = false }: { w: string; light?: boolean }) => (
  <span className={`block h-1.5 rounded-full ${light ? "bg-black/[0.08]" : "bg-white/10"}`} style={{ width: w }} />
);

/** Гарантії і бухгалтер, який веде облік — темна секція. Bento на десктопі, стос карток на телефоні. */
export default function Guarantees() {
  const { contract, direct, report } = guarantees;
  return (
    <section id="guarantees" className="section-y bg-black text-white">
      <div className="container-x">
        <SectionHead on="dark" label="Гарантії" title="Відповідальність, закріплена договором" />
        <ul className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-12">
          {/* 1. Договір: макет аркуша з виділеним пунктом */}
          {/* Широка картка: на десктопі текст ліворуч, договір праворуч — без порожніх зон */}
          <li data-reveal className="md:col-span-2 lg:col-span-12">
            <GuaranteeCard wide n="01" icon={<ShieldIcon />} title={contract.title} text={contract.text}>
              <div className="relative mx-auto max-w-md -rotate-1 rounded-[20px] bg-white p-5 text-black shadow-[var(--shadow-float)] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:rotate-0 sm:p-6">
                <Sample on="light" />
                <p className="pr-16 font-display text-[0.875rem] font-semibold leading-snug">{contract.doc}</p>
                <div className="mt-4 grid gap-2"><Bar light w="92%" /><Bar light w="78%" /><Bar light w="85%" /></div>
                <p className="g-mark mt-4 rounded-lg border-l-2 border-success px-3 py-2 text-[0.8125rem] leading-snug">
                  <span className="font-semibold"><T>{contract.clause}</T>.</span> {contract.clauseText}
                </p>
                <div className="mt-4 grid gap-2"><Bar light w="88%" /><Bar light w="64%" /></div>
                <div className="mt-6 grid grid-cols-2 gap-6 text-[0.6875rem] text-gray-text">
                  {["Виконавець", "Замовник"].map((r) => (
                    <div key={r}>
                      <svg viewBox="0 0 80 20" className="h-5 w-20 text-black" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M2 14c6-10 10-10 9 0s6-9 10-6 2 8 8 3 8-6 12-2 10 3 14-1" />
                      </svg>
                      <span className="mt-1 block border-t border-black/15 pt-1">{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            </GuaranteeCard>
          </li>

          {/* 2. Напряму: міні-переписка */}
          <li data-reveal className="lg:col-span-6">
            <GuaranteeCard n="02" icon={<PersonIcon />} title={direct.title} text={direct.text}>
              <div className="relative rounded-[20px] border border-white/[0.08] bg-white/[0.04] p-4">
                <Sample />
                <p className="flex items-center gap-2 text-[0.75rem] text-gray-light">
                  <span className="size-1.5 rounded-full bg-white" />{direct.tag}
                </p>
                <div className="mt-4 grid gap-2 text-[0.8125rem] leading-snug">
                  <p className="g-bubble ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-white/10 px-3.5 py-2.5">{direct.question}</p>
                  <div className="g-bubble g-bubble--late flex max-w-[90%] items-end gap-2">
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-white/10"><PersonIcon /></span>
                    <p className="rounded-2xl rounded-bl-md bg-white px-3.5 py-2.5 text-black">{direct.answer}</p>
                  </div>
                </div>
              </div>
            </GuaranteeCard>
          </li>

          {/* 3. Звіт: міні-картка звіту */}
          <li data-reveal className="lg:col-span-6">
            <GuaranteeCard n="03" icon={<ReportIcon />} title={report.title} text={report.text}>
              <div className="relative rounded-[20px] border border-white/[0.08] bg-white/[0.04] p-4">
                <Sample />
                <p className="font-display text-[0.9375rem] font-semibold">{report.heading}</p>
                <ul className="mt-3 divide-y divide-white/[0.08] text-[0.8125rem]">
                  {report.rows.map((r) => (
                    <li key={r.label} className="flex items-center justify-between gap-3 py-2.5">
                      <span className="text-gray-light">{r.label}</span>
                      <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[0.75rem] font-medium ${r.done ? "bg-success text-black" : "border border-white/25 text-white"}`}>
                        {r.done && <Check className="size-3" />}{r.status}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-[0.75rem] text-gray-mid">{report.note}</p>
              </div>
            </GuaranteeCard>
          </li>
        </ul>

        <Card id="accountant" variant="dark" radius="lg" className="mt-4 grid gap-8 border border-white/[0.08] p-6 sm:p-8 lg:grid-cols-[14rem_1fr] lg:items-center">
          {/* ЗАМІНІТЬ на фото бухгалтера (next/image з alt: ім'я та посада) */}
          <div className="relative aspect-square w-40 overflow-hidden rounded-[var(--radius-card)] bg-[radial-gradient(circle_at_35%_30%,#3a3a3a,#111_60%)] lg:w-full" role="img" aria-label="Місце для фото бухгалтера">
            <span className="placeholder absolute inset-x-3 bottom-3 text-center text-[0.75rem] text-gray-light">[ДАНІ: фото]</span>
          </div>
          <div>
            <p className="text-[0.9375rem] text-gray-mid">Хто веде ваш облік</p>
            <h3 className="mt-2 text-[length:var(--text-h3)]"><T>{accountant.name}</T></h3>
            <p className="text-gray-light">{accountant.role}</p>
            <dl className="mt-6 grid gap-4 sm:grid-cols-3">
              {accountant.facts.map((f) => (
                <div key={f.label} className="rounded-[var(--radius-card-sm)] bg-white/[0.05] p-4">
                  <dt className="text-[0.8125rem] text-gray-mid">{f.label}</dt>
                  <dd className="mt-1 text-[0.9375rem]"><T>{f.value}</T></dd>
                </div>
              ))}
            </dl>
          </div>
        </Card>
      </div>
    </section>
  );
}
