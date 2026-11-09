import { gsap, ScrollTrigger, OUT, type Cleanup } from "./gsap";

const all = (sel: string) => [...document.querySelectorAll<HTMLElement>(sel)];

/**
 * Анімації окремих секцій (викликається з setupScroll, лише без reduced motion):
 * 1) parallax шарів фону hero [data-hero-layer="глибина"] — працює і на телефоні;
 * 2) мобільний «акордеон» карток «Що я роблю»: приклад-віджет розкривається, коли картка доходить до ~70% екрана,
 *    і згортається при прокрутці назад.
 */
export function setupSections(cleanups: Cleanup[]) {
  // 1. Hero: шари їдуть угору з різною швидкістю, поки hero виходить з екрана
  const hero = document.getElementById("hero");
  if (hero) {
    all("[data-hero-layer]").forEach((el) => {
      const d = Number(el.dataset.heroLayer) || 0;
      gsap.to(el, { y: () => -d * Math.min(window.innerHeight, 900) * 0.22, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.4, invalidateOnRefresh: true } });
    });
  }

  // 2. «Що я роблю» на телефоні/планшеті: розкриття при прокрутці
  const mm = gsap.matchMedia();
  mm.add("(max-width: 63.98rem)", () => {
    all("[data-svc-card]").forEach((card) => {
      const body = card.querySelector<HTMLElement>("[data-svc-body]");
      const chevron = card.querySelector<HTMLElement>("[data-svc-chevron]");
      const inner = body?.firstElementChild;
      if (!body || !inner) return;
      gsap.set(body, { height: 0 });
      gsap.set(inner, { opacity: 0, y: 24, scale: 0.96 });
      const tl = gsap.timeline({ paused: true })
        .to(body, { height: "auto", duration: 0.75, ease: "power3.inOut" }, 0)
        .to(inner, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: OUT }, 0.25)
        .to(chevron, { rotate: 180, duration: 0.4, ease: OUT }, 0);
      const toggle = card.querySelector<HTMLButtonElement>("[data-svc-toggle]");
      // Висота змінюється — позиції нижчих тригерів треба перерахувати після анімації
      const refresh = () => gsap.delayedCall(0.8, () => ScrollTrigger.refresh());
      const set = (open: boolean) => {
        if (open) tl.play(); else tl.reverse();
        toggle?.setAttribute("aria-expanded", String(open));
        refresh();
      };
      const st = ScrollTrigger.create({
        trigger: card,
        start: "top 70%",
        // Перескочили картку (якір із меню) — не розкриваємо: інакше вміст над місцем призначення «з'їде»
        onEnter: () => { if (card.getBoundingClientRect().bottom > 0) set(true); },
        onLeaveBack: () => set(false),
      });
      const onClick = () => set(toggle?.getAttribute("aria-expanded") !== "true");
      toggle?.addEventListener("click", onClick);
      return () => { st.kill(); tl.kill(); toggle?.removeEventListener("click", onClick); toggle?.setAttribute("aria-expanded", "false"); };
    });
    return () => {
      all("[data-svc-body]").forEach((b) => { gsap.set([b, b.firstElementChild], { clearProps: "all" }); });
      all("[data-svc-chevron]").forEach((c) => gsap.set(c, { clearProps: "transform" }));
    };
  });
  cleanups.push(() => mm.revert());
}
