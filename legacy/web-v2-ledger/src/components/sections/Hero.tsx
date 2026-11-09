import { brand, hero } from "@/content/site";
import SceneSlot from "@/components/scene/SceneSlot";
import T from "@/components/ui/T";

export default function Hero() {
  return (
    <section id="hero" className="relative flex min-h-svh items-center pb-16 pt-24 lg:pb-20 lg:pt-28">
      <div className="container-x relative grid items-center gap-y-6 lg:grid-cols-12 lg:gap-x-8">
        {/* Мобільний: ілюстрація під текстом, щоб кнопка була на першому екрані. Десктоп: права половина */}
        <SceneSlot stage={0} className="order-last mb-10 mt-6 h-[clamp(16rem,78vw,22rem)] lg:col-span-6 lg:col-start-7 lg:mb-0 lg:mt-0 lg:h-[min(36rem,62vh)]" />
        <div className="lg:col-span-6">
          <p className="eyebrow" data-hero>{hero.eyebrow}</p>
          <h1 data-split className="max-w-[14ch]">
            {hero.title.join(" ")} <em>{hero.titleAccent}</em>
          </h1>
          <p className="mt-6 max-w-[46ch] text-[length:var(--text-lead)] text-bone-dim" data-hero>{hero.lead}</p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8" data-hero>
            <a href="#contact" className="btn btn-primary w-full sm:w-auto" data-hero-cta>{hero.cta}</a>
            <a href="#pricing" className="link-quiet self-center sm:self-auto">{hero.secondary}</a>
          </div>
          {/* Рядок «відомості»: факти з вертикальними роздільниками */}
          <dl className="relative mt-14 grid grid-cols-3" data-hero>
            <span data-rule className="absolute inset-x-0 top-0 h-px origin-left bg-line" aria-hidden="true" />
            {hero.stats.map((s, i) => (
              <div key={s.label} className={`pt-5 ${i > 0 ? "border-l border-line pl-4 sm:pl-6" : "pr-4"}`}>
                <dd className="font-display text-[clamp(1.25rem,1rem+1vw,1.75rem)] leading-tight"><T>{s.value}</T></dd>
                <dt className="caption mt-1 text-bone-dim">{s.label}</dt>
              </div>
            ))}
          </dl>
          <a href={brand.telegramHref} target="_blank" rel="noopener" className="link-quiet mt-8 inline-flex sm:hidden">
            Написати в Telegram
          </a>
        </div>
      </div>
    </section>
  );
}
