import { guarantees } from "@/content/site";
import SceneSlot from "@/components/scene/SceneSlot";
import Section from "@/components/ui/Section";
import T from "@/components/ui/T";

export default function Results() {
  return (
    <Section id="results" index="04" label="Гарантії">
      <div className="grid gap-10 lg:grid-cols-10">
        <div className="lg:col-span-6">
          <SceneSlot stage={3} className="mb-14 h-[clamp(18rem,90vw,26rem)] lg:hidden" />
          <h2 data-split>
            Відповідальність, <em>закріплена договором</em>
          </h2>
          <ol className="mt-10">
            {guarantees.map((g, i) => (
              <li key={g.title} data-row className="relative grid grid-cols-[3rem_1fr] gap-x-4 py-6">
                <span className="caption pt-1.5 tabular-nums text-brass">4.{i + 1}</span>
                <div>
                  <h3>{g.title}</h3>
                  <p className="mt-1 max-w-[52ch] text-bone-dim"><T>{g.text}</T></p>
                </div>
                <span data-rule className="absolute inset-x-0 bottom-0 h-px origin-left bg-line" aria-hidden="true" />
              </li>
            ))}
          </ol>
        </div>
        <div className="hidden lg:col-span-4 lg:block">
          <SceneSlot stage={3} className="sticky top-[20vh] h-[60vh]" />
        </div>
      </div>
    </Section>
  );
}
