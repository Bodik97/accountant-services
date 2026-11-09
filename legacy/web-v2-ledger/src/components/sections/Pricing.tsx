import { plans } from "@/content/site";
import Section from "@/components/ui/Section";
import T from "@/components/ui/T";

/** Ціни як фінансова відомість: три колонки в одній таблиці, рекомендована — темна */
export default function Pricing() {
  return (
    <Section id="pricing" index="06" label="Ціни" tone="paper">
      <h2 data-split className="max-w-[18ch]">
        Фіксована ціна. <em>Без сюрпризів.</em>
      </h2>
      <p className="mt-5 max-w-[56ch] text-[length:var(--text-lead)] text-paper-dim" data-reveal>
        Точну вартість назвемо після безкоштовної консультації. Вона залежить від кількості операцій і працівників.
      </p>
      <div className="mt-12 grid border-y border-paper-line md:grid-cols-3">
        {plans.map((p, i) => (
          <article
            key={p.name}
            data-plan-col
            className={`flex flex-col p-6 sm:p-8 ${i > 0 ? "border-t border-paper-line md:border-l md:border-t-0" : ""} ${
              p.featured ? "max-md:order-first bg-ink text-bone" : ""
            }`}
          >
            <p className={`caption uppercase tracking-[0.14em] ${p.featured ? "text-brass" : "text-paper-dim"}`}>
              6.{i + 1}&ensp;{p.featured ? "Рекомендовано" : "Пакет"}
            </p>
            <h3 className="mt-4">{p.name}</h3>
            <p className={`mt-1 min-h-[3em] ${p.featured ? "text-bone-dim" : "text-paper-dim"}`}>{p.for}</p>
            <p className={`mt-6 flex items-baseline gap-2 border-t pt-6 tabular-nums ${p.featured ? "border-line" : "border-paper-line"}`}>
              <span className={p.featured ? "text-bone-dim" : "text-paper-dim"}>від</span>
              <span className="font-display text-[length:var(--text-price)] leading-none"><T>{p.price}</T></span>
              <span className={p.featured ? "text-bone-dim" : "text-paper-dim"}>₴/міс</span>
            </p>
            <ul className="mt-6 grid gap-2.5">
              {p.features.map((f) => (
                <li key={f} className="relative pl-5">
                  <span className={`absolute left-0 top-[0.8em] h-px w-2.5 ${p.featured ? "bg-brass" : "bg-brass-deep"}`} aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>
            <a href="#contact" data-plan={p.name} className={`btn mt-8 w-full ${p.featured ? "btn-primary" : "btn-secondary"}`}>
              Обрати «{p.name}»
            </a>
          </article>
        ))}
      </div>
      <p className="caption mt-4 text-paper-dim" data-reveal>Перевірка поточної звітності — безкоштовно для всіх пакетів.</p>
    </Section>
  );
}
