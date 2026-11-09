import { accountant } from "@/content/site";
import Section from "@/components/ui/Section";
import T from "@/components/ui/T";

/** Хто веде облік: людина за брендом — сильний сигнал довіри. Усі дані — від власника. */
export default function Accountant() {
  return (
    <Section id="accountant" index="05" label="Бухгалтер">
      <div className="grid gap-10 md:grid-cols-10 md:items-start">
        {/* ЗАМІНІТЬ на фото бухгалтера (next/image з alt: ім'я та посада) */}
        <div
          data-frame
          className="relative aspect-[4/5] w-full max-w-xs border border-line-strong md:col-span-4"
          role="img"
          aria-label="Місце для фото бухгалтера"
        >
          <span className="placeholder absolute inset-x-5 bottom-5 text-center">[ДАНІ: фото]</span>
        </div>
        <div className="md:col-span-6">
          <h2 data-split><T>{accountant.name}</T></h2>
          <p className="mt-3 text-[length:var(--text-lead)] text-bone-dim" data-reveal>{accountant.role}</p>
          <dl className="mt-10">
            {accountant.facts.map((f) => (
              <div key={f.label} data-row className="relative grid gap-1 py-5 sm:grid-cols-[11rem_1fr] sm:gap-6">
                <dt className="caption uppercase tracking-[0.12em] text-bone-dim">{f.label}</dt>
                <dd><T>{f.value}</T></dd>
                <span data-rule className="absolute inset-x-0 bottom-0 h-px origin-left bg-line" aria-hidden="true" />
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  );
}
