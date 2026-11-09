import { steps } from "@/content/site";
import Section from "@/components/ui/Section";
import T from "@/components/ui/T";

/** Співпраця як журнал операцій: строк зліва, лінія прогресу прокреслюється під час прокрутки */
export default function Process() {
  return (
    <Section id="process" index="03" label="Співпраця">
      <h2 data-split className="max-w-[18ch]">
        Як проходить <em>співпраця</em>
      </h2>
      <ol data-timeline className="relative mt-12 max-w-4xl pl-8 sm:pl-10 lg:ml-6">
        <span className="absolute left-0 top-2 bottom-2 w-px bg-line" aria-hidden="true" />
        <span data-timeline-progress className="absolute left-0 top-2 bottom-2 w-px origin-top bg-brass" aria-hidden="true" />
        {steps.map((s, i) => (
          <li key={s.title} data-step className="relative grid gap-x-8 gap-y-1 pb-10 last:pb-0 sm:grid-cols-[11rem_1fr]">
            <span data-dot className="absolute -left-8 top-[0.55rem] size-[9px] -translate-x-1/2 rounded-full border border-brass bg-ink sm:-left-10" aria-hidden="true" />
            <p className="caption uppercase tracking-[0.12em] text-bone-dim">
              <span className="tabular-nums text-brass">3.{i + 1}</span>&ensp;<T>{s.when}</T>
            </p>
            <div>
              <h3>{s.title}</h3>
              <p className="mt-1 max-w-[56ch] text-bone-dim">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
