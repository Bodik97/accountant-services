"use client";

import { gsap, ScrollTrigger, useGSAP, MQ, type Cleanup } from "./gsap";
import { setupFaq } from "./faq";
import { setupSmoothScroll } from "./smoothScroll";
import { setupIntro } from "./intro";
import { setupProgressNav, setupScroll } from "./scroll";
import { setupTilt } from "./tilt";

/**
 * Уся анімація сторінки (рендерить null). Секції — серверні компоненти, вони лише ставлять data-атрибути.
 *
 * Завжди: FAQ (плавне розкриття), навігація-прогрес hero (активний розділ).
 * html[data-mode="full"] без reduced motion: Lenis (десктоп із мишею), вступ hero,
 *   scroll-анімації (split-заголовки, появи, parallax, діаграми, pin «Фінансів»), нахил карток.
 * lite або reduced motion: прибираємо клас .motion — усе одразу у фінальному стані.
 */
export default function Motion() {
  useGSAP((context) => {
    const html = document.documentElement;
    const full = html.dataset.mode === "full";
    ScrollTrigger.config({ ignoreMobileResize: true });

    const cleanups: Cleanup[] = [setupFaq()];
    const run = () => cleanups.forEach((f) => f());
    setupProgressNav();

    if (!full || matchMedia(MQ.reduce).matches) {
      html.classList.remove("motion");
      return run;
    }
    html.classList.add("motion-ready");

    let alive = true;
    const smooth = setupSmoothScroll();
    if (smooth) cleanups.push(smooth);

    // Вступ — один раз за завантаження (не перезапускається при зміні breakpoint)
    setupIntro((fn) => { if (alive) context.add(fn); }, cleanups);

    const mm = gsap.matchMedia();
    // Усі scroll-анімації — однією гілкою: зміна breakpoint/pin перебудовує їх разом (pin створюється першим)
    // mobile у переліку обов'язковий: gsap.matchMedia запускає гілку, лише коли збігається хоча б одна умова
    mm.add({ desktop: MQ.desktop, mobile: MQ.mobile, pin: MQ.pin, reduce: MQ.reduce }, (ctx) => {
      const { desktop, pin, reduce } = ctx.conditions ?? {};
      if (reduce) {
        gsap.set("[data-split]", { visibility: "visible" });
        return;
      }
      return setupScroll({ pinFinances: !!pin, parallaxFactor: desktop ? 1 : 0.3 });
    });
    mm.add(`${MQ.fine} and (prefers-reduced-motion: no-preference)`, () => setupTilt());

    // Перерахунок позицій: шрифти, повне завантаження, перший кадр кожної 3D-сцени
    let raf = 0;
    const refresh = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      });
    };
    document.fonts.ready.then(() => { if (alive) refresh(); });
    window.addEventListener("scene3d:ready", refresh);
    window.addEventListener("load", refresh);

    cleanups.push(() => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("scene3d:ready", refresh);
      window.removeEventListener("load", refresh);
      mm.revert();
      html.classList.remove("motion-ready");
    });
    return run;
  });

  return null;
}
