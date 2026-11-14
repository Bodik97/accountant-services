import { hero } from "@/content/site";
import { heroWidgets } from "@/content/demo";
import ConsultButton from "@/components/ConsultButton";
import Scene3D from "@/components/three/Scene3D";
import HeroBackdrop from "./HeroBackdrop";
import TaxesPaid from "@/components/widgets/TaxesPaid";
import Income from "@/components/widgets/Income";
import Toast from "@/components/widgets/Toast";
import NextPayment from "@/components/widgets/NextPayment";

/**
 * Hero, split-екран.
 * Ліворуч (чорне): навігація-прогрес, заголовок у 2 рядки, головна дія, кнопка-скрол.
 * Праворуч (світле): 3D-форма і плаваючі віджети. data-depth — швидкість parallax для GSAP (хвиля 2).
 * Телефон: чорний блок із заголовком зверху, нижче 3D і 2 віджети у свайп-ряду.
 */
export default function Hero() {
  const w = heroWidgets;
  return (
    <section id="hero" className="relative grid bg-[linear-gradient(#f4f4f4_70%,#fff)] lg:min-h-svh lg:grid-cols-2">
      {/* Ліва половина */}
      <div className="relative flex flex-col justify-between overflow-hidden bg-black px-[clamp(1rem,0.5rem+2.5vw,2.5rem)] pb-16 pt-28 lg:rounded-r-[3rem] text-white [@media(max-height:31rem)]:pb-8 [@media(max-height:31rem)]:pt-20 lg:min-h-svh lg:pb-14 lg:pl-[max(clamp(1rem,0.5rem+2.5vw,2.5rem),calc(50vw-40rem+clamp(1rem,0.5rem+2.5vw,2.5rem)))] lg:pt-32">
        <HeroBackdrop />
        <nav aria-label="Розділи сторінки" className="relative hidden lg:block lg:[@media(max-height:50rem)]:hidden" data-progress-nav>
          <ol className="relative grid gap-0 border-l border-white/15 pl-5">
            {hero.progress.map((p, i) => (
              <li key={p.href} className="relative">
                <span
                  data-progress-bar
                  className={`absolute -left-[21px] top-0 h-full w-px origin-top bg-white transition-transform duration-300 ${i === 0 ? "scale-y-100" : "scale-y-0"}`}
                  aria-hidden="true"
                />
                <a href={p.href} data-progress-link className={`inline-flex min-h-11 items-center text-[0.9375rem] transition-colors duration-200 hover:text-white ${i === 0 ? "text-white" : "text-gray-mid"}`}>
                  {p.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="relative lg:pr-10">
          <h1 data-split className="max-w-[11ch] [@media(max-height:31rem)]:max-w-none [@media(max-height:31rem)]:text-[2.5rem]">
            {hero.titleLines.map((l) => (
              <span key={l} className="block">{l}</span>
            ))}
          </h1>
          <p className="mt-6 max-w-[42ch] [@media(max-height:31rem)]:mt-4 text-[length:var(--text-lead)] text-gray-light" data-hero>{hero.lead}</p>
          <div className="mt-10 flex flex-wrap [@media(max-height:31rem)]:mt-6 items-center justify-between gap-4" data-hero>
            <ConsultButton surface="dark" arrow className="max-w-full whitespace-normal! py-1.5 text-left">{hero.cta}</ConsultButton>
          </div>
        </div>
      </div>

      {/* Права половина */}
      {/* Перехід: на телефоні/планшеті світла частина «наїжджає» заокругленою шторкою з тінню; на десктопі темна половина має заокруглений правий край */}
      <div className="relative z-10 overflow-hidden bg-[linear-gradient(#f4f4f4_65%,#fff)] lg:bg-transparent max-lg:-mt-8 max-lg:rounded-t-[2rem] max-lg:shadow-[0_-18px_40px_-16px_rgb(0_0_0/0.55)]">
        {/* Десктоп: 3D у центрі, 4 віджети навколо */}
        <div className="relative hidden h-full min-h-svh lg:block">
          <div data-hero-scene className="absolute inset-0"><Scene3D variant="hero-bars" label={hero.sceneLabel} className="absolute inset-0" /></div>
          {/* Композиція віджетів обмежена по ширині, щоб на 1920+ не розлазилась по краях; 1024–1279 — без 4-го віджета */}
          <div className="absolute inset-y-0 left-1/2 w-full max-w-[50rem] -translate-x-1/2">
            {/* Віджети по кутах, центр лишається вільним для скульптури; на 1024–1279 — лише 2 віджети, зменшені */}
            <div className="absolute right-[5%] top-[13%] hidden xl:block" data-depth="0.6"><Toast {...w.toast} /></div>
            <div className="absolute left-[4%] top-[13%]" data-depth="0.35"><div className="origin-top-left max-xl:scale-[0.82]"><TaxesPaid {...w.taxesPaid} animate className="w-[19rem]" /></div></div>
            <div className="absolute bottom-[6%] right-[4%]" data-depth="0.8"><div className="origin-bottom-right max-xl:scale-[0.82]"><Income {...w.income} animate /></div></div>
            <div className="absolute bottom-[6%] left-[5%] hidden xl:block" data-depth="0.5"><NextPayment {...w.nextPayment} animate /></div>
          </div>
        </div>

        {/* Телефон і планшет: спрощене 3D + віджети сіткою (без горизонтального свайпу — картки не обрізаються) */}
        <div className="lg:hidden">
          <div data-hero-scene><Scene3D variant="hero-bars" quality="low" label={hero.sceneLabel} className="h-[clamp(16rem,70vw,24rem)] md:h-[28rem]" /></div>
          {/* Картки повністю видно: одна колонка на телефоні, дві — з 640px */}
          <div className="-mt-8 grid grid-cols-1 gap-3 px-[clamp(1rem,0.5rem+2.5vw,2.5rem)] pb-10 sm:grid-cols-2">
            <TaxesPaid {...w.taxesPaid} animate className="w-full" />
            <div className="grid content-start gap-3">
              <Toast {...w.toast} className="w-full" />
              <NextPayment {...w.nextPayment} className="hidden w-full sm:block" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
