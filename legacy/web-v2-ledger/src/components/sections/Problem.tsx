import { pains } from "@/content/site";
import SceneSlot from "@/components/scene/SceneSlot";
import Section from "@/components/ui/Section";

export default function Problem() {
  return (
    <Section id="problem" index="01" label="Рутина">
      <div className="grid gap-10 lg:grid-cols-10">
        <div className="lg:col-span-5">
          <SceneSlot stage={1} className="mb-14 h-[clamp(18rem,90vw,26rem)] lg:hidden" />
          <h2 data-split>
            Рутина, яку ми <em>беремо на себе</em>
          </h2>
          <ol id="pains" className="mt-10">
            {pains.map((p, i) => (
              <li key={p.text} data-pain className="relative grid grid-cols-[3rem_1fr] gap-x-4 py-5">
                <span className="caption pt-1 tabular-nums text-brass">1.{i + 1}</span>
                <div>
                  <p className="text-[length:var(--text-lead)] leading-snug">{p.text}</p>
                  <p className="caption mt-1 uppercase tracking-[0.12em] text-bone-dim">{p.doc}</p>
                </div>
                <span data-rule className="absolute inset-x-0 bottom-0 h-px origin-left bg-line" aria-hidden="true" />
              </li>
            ))}
          </ol>
          <p className="mt-10 border-l border-brass pl-5 text-[length:var(--text-lead)]" data-reveal>
            Усе це — наша щоденна робота, а не ваша.
          </p>
        </div>
        <div className="hidden lg:col-span-5 lg:block">
          <SceneSlot stage={1} className="sticky top-[20vh] h-[60vh]" />
        </div>
      </div>
    </Section>
  );
}
