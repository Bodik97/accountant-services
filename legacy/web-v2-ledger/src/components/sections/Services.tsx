import { services } from "@/content/site";
import SceneSlot from "@/components/scene/SceneSlot";
import Section from "@/components/ui/Section";
import T from "@/components/ui/T";

/** Послуги як реєстр: код, назва з описом, ціна по правому краю — як у відомості */
export default function Services() {
  return (
    <Section id="services" index="02" label="Послуги">
      <div className="grid gap-10 lg:grid-cols-10">
        <div className="lg:col-span-6">
          <SceneSlot stage={2} className="mb-14 h-[clamp(18rem,90vw,26rem)] lg:hidden" />
          <h2 data-split>
            Увесь облік — <em>в одній папці</em>
          </h2>
          <ul className="mt-10">
            {services.map((s, i) => (
              <li key={s.title} data-row className="group relative grid grid-cols-[3rem_1fr] gap-x-4 gap-y-2 py-6 sm:grid-cols-[3rem_1fr_auto]">
                <span className="caption pt-1.5 tabular-nums text-brass">2.{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p className="mt-1 max-w-[52ch] text-bone-dim">{s.text}</p>
                </div>
                <p className="col-start-2 whitespace-nowrap tabular-nums sm:col-start-3 sm:pt-1 sm:text-right">
                  <T>{s.price}</T>
                </p>
                <span data-rule className="absolute inset-x-0 bottom-0 h-px origin-left bg-line transition-colors duration-200 group-hover:bg-brass/60" aria-hidden="true" />
              </li>
            ))}
          </ul>
        </div>
        <div className="hidden lg:col-span-4 lg:block">
          <SceneSlot stage={2} className="sticky top-[20vh] h-[60vh]" />
        </div>
      </div>
    </Section>
  );
}
