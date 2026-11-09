import { buildCharts } from "./charts";
import { gsap, SplitText, OUT, EXPO, type Cleanup } from "./gsap";

/** Корені 3D-сцен у hero. */
function heroScenes(hero: Element): HTMLElement[] {
  return [...hero.querySelectorAll<HTMLElement>("[data-hero-scene]")];
}

/** Найзовнішні віджети hero (вкладені data-widget не рахуються окремо). */
function heroWidgets(hero: Element): HTMLElement[] {
  return [...hero.querySelectorAll<HTMLElement>("[data-widget]")].filter((el) => !el.parentElement?.closest("[data-widget]"));
}

/**
 * Вступ першого екрана. Синхронно ховає елементи (щоб не було «блимання»),
 * після завантаження шрифтів грає таймлайн: рядки h1 з-під маски → текст і дія →
 * 3D (0.8 → 1) → віджети по одному з розмиття → діаграми й лічильники.
 * Викликається всередині gsap.context; асинхронна частина реєструється в ньому через add().
 */
export function setupIntro(add: (fn: () => void) => void, cleanups: Cleanup[]): void {
  const hero = document.getElementById("hero");
  if (!hero) return;

  const h1 = hero.querySelector<HTMLElement>("[data-split]");
  const copy = hero.querySelectorAll("[data-hero]");
  const nav = hero.querySelectorAll("[data-progress-nav]");
  const scenes = heroScenes(hero);
  const widgets = heroWidgets(hero);
  const charts = widgets.map((w) => buildCharts(w, cleanups));

  // Текст і кнопку НЕ ховаємо (opacity) — інакше вони пізно стають LCP. Лише легкий зсув.
  // На телефоні/планшеті заголовок не розбиваємо на рядки: він видимий одразу.
  const splitH1 = matchMedia("(min-width: 64rem)").matches;
  gsap.set(copy, { y: 16 });
  gsap.set(nav, { opacity: 0 });
  gsap.set(scenes, { opacity: 0, scale: 0.8, transformOrigin: "50% 50%" });
  gsap.set(widgets, { opacity: 0, y: 40, filter: "blur(12px)" });

  const fontsReady = Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 600))]);

  fontsReady.then(() => add(() => {
    const tl = gsap.timeline({ defaults: { ease: OUT } });
    let played = false;

    if (h1 && splitH1) {
      SplitText.create(h1, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit: (self) => {
          gsap.set(h1, { visibility: "visible" });
          // Повторне розбиття (resize, підвантаження шрифту) — без повтору вступу
          if (played) return;
          played = true;
          tl.from(self.lines, { yPercent: 105, duration: 1.1, stagger: 0.1 }, 0);
        },
      });
    }

    if (h1 && !splitH1) gsap.set(h1, { visibility: "visible" });
    tl.to(copy, { y: 0, duration: 0.9, stagger: 0.1 }, 0.2)
      .to(nav, { opacity: 1, duration: 0.9 }, 0.6)
      .to(scenes, { opacity: 1, scale: 1, duration: 1.2, ease: EXPO, clearProps: "transform" }, 0.2);

    widgets.forEach((w, i) => {
      const at = 0.55 + i * 0.16;
      tl.to(w, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, clearProps: "filter" }, at);
      const c = charts[i];
      if (c) tl.add(c.paused(false), at + 0.3);
    });
  }));
}
