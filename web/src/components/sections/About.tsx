import { about, pains, painsTitle } from "@/content/site";
import { aboutWidgets } from "@/content/demo";
import SectionHead from "@/components/ui/SectionHead";
import Card from "@/components/ui/Card";
import { AboutScene } from "./SceneSlots";
import Stat from "@/components/widgets/Stat";
import { aboutIcons } from "./aboutIcons";

const factIcons = [aboutIcons.person, aboutIcons.globe, aboutIcons.contract];

/** Печатка досвіду: велике «20+» у центрі, по колу повільно обертається напис — як на гербовому знаку. */
function Seal() {
  const { unit, ring } = about.seal;
  const value = about.stats[1].value;
  const num = Number.parseInt(value, 10) || 0;
  const suffix = value.replace(String(num), "");
  const words = [...ring, ...ring];
  return (
    <div className="relative grid size-[12rem] place-items-center rounded-full bg-[radial-gradient(circle_at_30%_25%,#2e2e2e,#0a0a0a_70%)] text-white shadow-[var(--shadow-float)] sm:size-[15rem]" data-seal>
      <svg viewBox="0 0 200 200" aria-hidden="true" className="absolute inset-0 size-full motion-safe:animate-[seal-spin_48s_linear_infinite]">
        <defs>
          <path id="seal-ring" d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" />
        </defs>
        <circle cx="100" cy="100" r="97" fill="none" stroke="rgb(255 255 255/0.18)" strokeWidth="0.75" />
        <circle cx="100" cy="100" r="93" fill="none" stroke="rgb(255 255 255/0.08)" strokeWidth="0.75" />
        <circle cx="100" cy="100" r="66" fill="none" stroke="rgb(255 255 255/0.22)" strokeWidth="0.75" />
        <text fontSize="10.5" fontWeight="500" letterSpacing="2.4" fill="rgb(255 255 255/0.78)" style={{ textTransform: "uppercase" }}>
          <textPath href="#seal-ring" textLength="500" lengthAdjust="spacing">
            {words.map((w, i) => (
              <tspan key={i}>
                {w}
                <tspan fill="var(--color-success)">{"  •  "}</tspan>
              </tspan>
            ))}
          </textPath>
        </text>
      </svg>
      <p className="relative text-center">
        <span className="metric block text-[3.125rem] leading-none tracking-[-0.03em] sm:text-[4rem]">
          <span data-count={num}>{num}</span>{suffix}
        </span>
        <span className="mt-1 block text-[0.75rem] uppercase tracking-[0.22em] text-gray-mid">{unit}</span>
      </p>
      {/* Для читачів екрана — без обертового тексту */}
      <span className="sr-only">{value} {about.stats[1].label}</span>
    </div>
  );
}

/** «Про мене»: текст і факти ліворуч, праворуч 3D-стос пластин, 50+ клієнтів і печатка «20+ років досвіду». */
export default function About() {
  const w = aboutWidgets;
  return (
    <section id="about" className="section-y bg-white">
      <div className="container-x grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
        <div>
          <SectionHead label={about.label} title={about.title} intro={about.text} />
          <ul className="mt-10 grid grid-cols-1 gap-3">
            {about.facts.map((f, i) => (
              <li key={f.title}>
                {/* Біла картка з рамкою і тінню + іконка — «дорожче», ніж сірий блок */}
                <div className="flex h-full gap-4 rounded-[var(--radius-card-sm)] border border-black/[0.07] bg-white p-5 shadow-[0_1px_2px_rgb(10_10_10/0.04),0_14px_32px_-18px_rgb(10_10_10/0.28)] transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-float)]" data-reveal>
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-black text-white">{factIcons[i]}</span>
                  <div>
                    <h3 className="text-[1.0625rem]">{f.title}</h3>
                    <p className="mt-1.5 text-[0.9375rem] text-gray-text">{f.text}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {/* Головне про роботу: проблема → що я роблю. Кожен рядок — окрема картка, читається з першого погляду */}
          <div className="mt-12">
            <h3 className="text-[length:var(--text-h3)]">{painsTitle}</h3>
            <ol className="mt-5 grid grid-cols-1 gap-3">
              {pains.map((p) => (
                <li key={p.text} className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-3 rounded-[var(--radius-card-sm)] bg-surface p-4 sm:p-5" data-reveal>
                  <span className="grid size-11 place-items-center rounded-2xl bg-white text-black shadow-[0_1px_2px_rgb(10_10_10/0.06)]">{aboutIcons[p.icon]}</span>
                  <div className="min-w-0">
                    <p className="text-[0.875rem] text-gray-text">{p.text}</p>
                    <p className="mt-1 flex gap-2 text-[1.0625rem] font-medium leading-snug">
                      <span className="mt-[0.2rem] grid size-[1.125rem] shrink-0 place-items-center rounded-full bg-success text-black" aria-hidden="true">
                        <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5 9-10" /></svg>
                      </span>
                      {p.fix}
                    </p>
                  </div>
                  <span className="col-start-2 justify-self-start rounded-full border border-black/10 bg-white px-2.5 py-1 text-[0.75rem] text-gray-text">{p.doc}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Десктоп: сцена «прилипає» і лишається в кадрі, поки читаєте текст ліворуч (без порожніх зон) */}
        <Card variant="light" radius="lg" className="relative min-h-[30rem] overflow-hidden lg:sticky lg:top-24 lg:h-[calc(100svh-7.5rem)] lg:max-h-[52rem] lg:min-h-[34rem]" data-about-scene>
          <AboutScene className="absolute inset-0" />
          <div className="absolute left-4 top-4 sm:left-6 sm:top-6" data-depth="0.4"><Stat {...w.clients} variant="white" /></div>
          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6" data-depth="0.6"><Seal /></div>
        </Card>
      </div>
    </section>
  );
}
