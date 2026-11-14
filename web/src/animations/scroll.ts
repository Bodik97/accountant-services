import { aboutProgress } from "@/lib/scroll-progress";
import { buildCharts, chartGroups } from "./charts";
import { setupSections } from "./sections";
import { gsap, EXPO, ScrollTrigger, SplitText, OUT, type Cleanup } from "./gsap";

const all = <T extends Element = HTMLElement>(sel: string, scope: ParentNode = document) => [...scope.querySelectorAll<T>(sel)];

/**
 * Навігація-прогрес у hero: активне посилання й смужка відповідають розділу, який зараз у центрі екрана.
 * Без анімацій GSAP — лише класи (переходи вже є в розмітці), тож працює і в lite.
 */
export function setupProgressNav(): void {
  const links = all<HTMLAnchorElement>("[data-progress-link]");
  const bars = all("[data-progress-bar]");
  if (!links.length) return;

  let current = -1;
  const setActive = (i: number) => {
    if (i === current) return;
    current = i;
    links.forEach((a, j) => {
      const on = j === i;
      a.classList.toggle("text-white", on);
      a.classList.toggle("text-gray-mid", !on);
      if (on) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
    bars.forEach((b, j) => {
      b.classList.toggle("scale-y-100", j === i);
      b.classList.toggle("scale-y-0", j !== i);
    });
  };
  setActive(0);

  links.forEach((a, i) => {
    const id = a.hash.slice(1);
    const section = id ? document.getElementById(id) : null;
    if (!section) return;
    ScrollTrigger.create({
      trigger: section,
      start: "top center",
      end: "bottom center",
      onToggle: (self) => { if (self.isActive) setActive(i); },
      // Повернулися у hero — знову перший пункт
      onLeaveBack: i === 0 ? () => setActive(0) : undefined,
    });
  });
}

/** Parallax обгортки [data-depth]: що більше depth, то швидше рухається шар. */
function parallax(el: HTMLElement, factor: number) {
  const depth = Number(el.dataset.depth) || 0;
  if (!depth || !factor) return;
  const section = el.closest("section") ?? el;
  const amp = depth * 140 * factor;
  if (section.id === "hero") {
    // Hero стоїть на місці при завантаженні — шари рушають лише з прокруткою
    gsap.to(el, { y: -amp, ease: "none", scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true } });
  } else {
    gsap.fromTo(el, { y: amp / 2 }, { y: -amp / 2, ease: "none", scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true } });
  }
}

/** Відкриває діаграми групи, коли вона з'являється в кадрі (один раз). */
function chartsOnEnter(group: Element, cleanups: Cleanup[]) {
  const tl = buildCharts(group, cleanups);
  if (!tl) return;
  ScrollTrigger.create({ trigger: group, start: "top 85%", once: true, onEnter: () => { tl.play(); } });
}

/**
 * «Фінанси» з pin: секція закріплюється на ~3 висоти екрана, кроки активуються по черзі,
 * екран телефона гортається до блоку кроку, відповідний віджет виходить на передній план, інші приглушуються.
 * Від активного кроку малюється лінія до підказки біля віджета. Діаграми віджета грають, коли його крок активується вперше.
 */
function setupFinancesPin(section: HTMLElement, cleanups: Cleanup[]) {
  const steps = all("[data-finance-step]", section);
  const widgets = all("[data-finance-widget]", section);
  const n = Math.max(steps.length, 1);
  // Таймлайни діаграм будуємо лише в момент активації кроку: інакше неактивні віджети
  // показували б «0 ₴» / «0%» (початковий стан лічильника), поки до них не дійде черга.
  const played = new Set<number>();

  // Підказки біля віджетів (з'являються лише на своєму кроці)
  const hints = widgets.map((w) => w.querySelector<HTMLElement>("[data-finance-hint]"));
  gsap.set(hints.filter(Boolean), { autoAlpha: 0, y: 8 });

  // Лінія-з'єднувач «пункт ліворуч → його підказка»: SVG поверх секції, перемальовується на кожному кроці
  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("aria-hidden", "true");
  // Білий ореол — щоб чорна лінія не зникала на чорному 3D-кільці
  svg.style.cssText = "position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none;z-index:3;filter:drop-shadow(0 0 1.5px #fff) drop-shadow(0 0 1px #fff)";
  const path = document.createElementNS(NS, "path");
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "#0a0a0a");
  path.setAttribute("stroke-width", "1.5");
  path.setAttribute("stroke-linecap", "round");
  const dotA = document.createElementNS(NS, "circle");
  const dotB = document.createElementNS(NS, "circle");
  dotA.setAttribute("r", "3.5");
  dotB.setAttribute("r", "5");
  [dotA, dotB].forEach((d) => d.setAttribute("fill", "#0a0a0a"));
  svg.append(path, dotA, dotB);
  section.appendChild(svg);
  cleanups.push(() => svg.remove());

  // Телефон зі звітом: «сторінка» екрана їде до блоку активного кроку, інші блоки приглушені
  const phone = section.querySelector<HTMLElement>("[data-phone-scroll]");
  const phoneBlocks = all("[data-phone-section]", section);
  let drawing = false;
  const route = (i: number) => {
    // Лінія веде від пункту до його блоку на екрані телефона (підказка — поруч із телефоном)
    const card = phoneBlocks[i] ?? hints[i] ?? widgets[i]?.querySelector<HTMLElement>("[data-widget]");
    const step = steps[i];
    if (!card || !step) return;
    const box = section.getBoundingClientRect();
    const s = step.getBoundingClientRect();
    const w = card.getBoundingClientRect();
    const sx = s.right - box.left + 6;
    const sy = s.top + s.height / 2 - box.top;
    const ex = w.left - box.left - 8;
    const ey = w.top + w.height / 2 - box.top;
    // Короткий проміжок — рівна лінія; довгий — плавна крива
    const dx = (ex - sx) * 0.5;
    path.setAttribute("d", ex - sx < 90 ? `M ${sx} ${sy} L ${ex} ${ey}` : `M ${sx} ${sy} C ${sx + dx} ${sy}, ${ex - dx} ${ey}, ${ex} ${ey}`);
    dotA.setAttribute("cx", String(sx)); dotA.setAttribute("cy", String(sy));
    dotB.setAttribute("cx", String(ex)); dotB.setAttribute("cy", String(ey));
  };
  const drawConnector = (i: number, instant: boolean) => {
    route(i);
    const len = path.getTotalLength();
    gsap.killTweensOf([path, dotB]);
    // Крапку анімуємо через радіус (attr r), не через transform: cx змінюється на кожному кроці
    if (instant) { gsap.set(path, { strokeDasharray: "none", strokeDashoffset: 0 }); gsap.set(dotB, { attr: { r: 5 } }); return; }
    drawing = true;
    gsap.set(dotB, { attr: { r: 0 } });
    gsap.fromTo(path, { strokeDasharray: len, strokeDashoffset: len }, {
      strokeDashoffset: 0, duration: 0.7, ease: OUT,
      onComplete: () => { drawing = false; gsap.set(path, { strokeDasharray: "none" }); },
    });
    gsap.to(dotB, { attr: { r: 5 }, duration: 0.3, delay: 0.55, ease: OUT });
  };
  let pendingDraw: gsap.core.Tween | null = null;

  const phoneTo = (i: number, instant: boolean) => {
    const block = phoneBlocks[i];
    const view = phone?.parentElement;
    if (!phone || !block || !view) return;
    const maxY = Math.max(0, phone.scrollHeight - view.clientHeight);
    // Активний блок — по центру екрана телефона (у межах довжини «сторінки»)
    const y = -Math.min(maxY, Math.max(0, block.offsetTop + block.offsetHeight / 2 - view.clientHeight / 2));
    if (instant) gsap.set(phone, { y });
    else gsap.to(phone, { y, duration: 1.1, ease: "power3.inOut", overwrite: true });
    phoneBlocks.forEach((b, j) => {
      const vars = { opacity: j === i ? 1 : 0.4, boxShadow: j === i ? "0 0 0 1.5px #0a0a0a, 0 10px 24px -12px rgb(10 10 10 / 0.35)" : "0 0 0 0px #0a0a0a, 0 6px 16px -10px rgb(10 10 10 / 0.25)" };
      if (instant) gsap.set(b, vars);
      else gsap.to(b, { ...vars, duration: 0.6, ease: OUT, overwrite: true });
    });
  };

  let active = -1;
  const show = (i: number, instant: boolean) => {
    active = i;
    hints.forEach((h, j) => {
      if (!h) return;
      // overwrite: true — скасовує і відкладені твіни (швидка прокрутка через кілька кроків)
      const vars = j === i ? { autoAlpha: 1, y: 0 } : { autoAlpha: 0, y: 8 };
      if (instant) gsap.set(h, { ...vars, overwrite: true });
      else gsap.to(h, { ...vars, duration: j === i ? 0.5 : 0.2, delay: j === i ? 0.35 : 0, ease: OUT, overwrite: true });
    });
    phoneTo(i, instant);
    // Віджет масштабується — лінію малюємо, коли він уже на місці
    pendingDraw?.kill();
    if (instant) requestAnimationFrame(() => drawConnector(i, true));
    else {
      // Стара лінія зникає одразу; нова малюється, коли екран телефона догорнувся
      drawing = true;
      gsap.killTweensOf([path, dotB]);
      gsap.set(path, { strokeDasharray: "0 99999" });
      gsap.set(dotB, { attr: { r: 0 } });
      pendingDraw = gsap.delayedCall(0.9, () => drawConnector(i, false));
    }
    steps.forEach((s, j) => {
      const on = j === i;
      s.classList.toggle("is-active", on);
      if (on) s.setAttribute("aria-current", "step");
      else s.removeAttribute("aria-current");
      // Неактивні кроки не тьмяніють (контраст тексту AA) — їх відрізняє фон/рамка через клас is-active
      const vars = { x: on ? 8 : 0 };
      if (instant) gsap.set(s, vars);
      else gsap.to(s, { ...vars, duration: 0.6, ease: OUT, overwrite: "auto" });
    });
    widgets.forEach((w, j) => {
      const on = j === i;
      w.style.zIndex = on ? "2" : "";
      const vars = { opacity: on ? 1 : 0.6, scale: on ? 1.04 : 0.94, transformOrigin: "50% 50%" };
      if (instant) gsap.set(w, vars);
      else gsap.to(w, { ...vars, duration: 0.8, ease: OUT, overwrite: "auto" });
    });
  };
  const playCharts = (i: number) => {
    if (played.has(i)) return;
    played.add(i);
    const w = widgets[i];
    if (w) buildCharts(w, cleanups)?.play();
  };

  // Початковий стан — перший крок; його діаграми грають, щойно секція з'явилася
  section.classList.add("is-pinned");
  cleanups.push(() => section.classList.remove("is-pinned"));
  show(0, true);
  ScrollTrigger.create({ trigger: section, start: "top 60%", once: true, onEnter: () => playCharts(0) });

  // Повільний дрейф шарів під час pin (замість звичайного parallax)
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      // Висока секція закріплюється, коли її низ торкнувся низу екрана, — кроки лишаються видимими
      start: () => (section.offsetHeight > window.innerHeight ? "bottom bottom" : "top top"),
      end: () => `+=${window.innerHeight * 3}`,
      pin: true,
      scrub: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const i = Math.min(n - 1, Math.floor(self.progress * n));
        if (i !== active) show(i, false);
        else if (!drawing) route(i); // віджети повільно дрейфують — лінія стежить за ними
        playCharts(i);
      },
    },
  });
  widgets.forEach((w) => {
    const d = Number(w.dataset.depth) || 0.4;
    tl.fromTo(w, { y: d * 40 }, { y: -d * 40, ease: "none", duration: 1 }, 0);
  });

  cleanups.push(() => {
    gsap.set([phone, ...phoneBlocks].filter(Boolean), { clearProps: "transform,opacity,boxShadow" });
    steps.forEach((s) => { s.classList.remove("is-active"); s.removeAttribute("aria-current"); });
    widgets.forEach((w) => { w.style.zIndex = ""; });
  });
}

/**
 * Усі анімації, прив'язані до прокрутки. Викликається всередині gsap.matchMedia (не reduced motion).
 * pinFinances — десктоп із мишею й висотою ≥ 640px; parallaxFactor — 1 на десктопі, 0.3 на телефоні.
 */
export function setupScroll({ pinFinances, parallaxFactor }: { pinFinances: boolean; parallaxFactor: number }): Cleanup {
  const cleanups: Cleanup[] = [];
  const finances = document.querySelector<HTMLElement>("[data-finances]");

  // 1. Pin створюється першим, щоб нижчі тригери враховували його відступ
  if (finances && pinFinances) setupFinancesPin(finances, cleanups);

  // 2. Заголовки секцій: слова виїжджають з-під маски
  all("[data-split]").forEach((el) => {
    if (el.closest("#hero")) return; // h1 — у вступі
    SplitText.create(el, {
      type: "words",
      mask: "words",
      onSplit: (self) => {
        gsap.set(el, { visibility: "visible" });
        return gsap.from(self.words, {
          yPercent: 110,
          duration: 0.9,
          ease: OUT,
          stagger: 0.04,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      },
    });
  });

  // 3. Пакетні появи: тексти, картки, етапи, колонки цін; кроки «Фінансів» — коли без pin
  const reveal = (sel: string, vars: gsap.TweenVars = {}) => {
    const els = all(sel).filter((el) => !el.closest("#hero"));
    if (!els.length) return;
    gsap.set(els, { opacity: 0, y: 24 });
    ScrollTrigger.batch(els, {
      start: "top 90%",
      once: true,
      onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.9, ease: OUT, stagger: 0.08, overwrite: true, ...vars }),
    });
  };
  reveal("[data-reveal]");
  reveal("[data-step]", { stagger: 0.12 });
  reveal("[data-plan-col]", { stagger: 0.12, duration: 1 });
  if (!pinFinances) reveal("[data-finance-step]");

  // «Усі послуги»: картки виїжджають каскадом — знизу, з легким 3D-нахилом і розмиттям, що стає чітким
  const serviceCards = all("[data-service-card]");
  if (serviceCards.length) {
    gsap.set(serviceCards, { opacity: 0, y: 60, rotateX: 14, filter: "blur(6px)", transformOrigin: "50% 0%" });
    ScrollTrigger.batch(serviceCards, {
      start: "top 92%",
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, {
          opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)",
          duration: 1, ease: EXPO, stagger: 0.09, overwrite: true, clearProps: "transform,filter",
        }),
    });
  }

  // 4. Parallax [data-depth] (hero — окремо від вступу: рухаємо обгортку, вступ — картку)
  all("[data-depth]").forEach((el) => {
    if (pinFinances && el.closest("[data-finances]")) return;
    parallax(el, parallaxFactor);
  });

  // 4b. Легкий parallax [data-parallax]: елемент рухається відносно свого місця, поки проходить екран.
  // Значення — частка 100px (0.3 → ±30px); на телефоні слабше (parallaxFactor). Заголовки, віджети послуг, етапи.
  all("[data-parallax]").forEach((el) => {
    if (pinFinances && el.closest("[data-finances]")) return; // всередині pin позиції рахує сам pin
    const amp = (Number(el.dataset.parallax) || 0) * 100 * parallaxFactor;
    if (!amp) return;
    gsap.fromTo(el, { y: amp }, {
      y: -amp,
      ease: "none",
      scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 },
    });
  });

  // 5. Діаграми: один раз при появі (hero — у вступі, «Фінанси» з pin — по кроках)
  chartGroups().forEach((g) => {
    if (g.closest("#hero")) return;
    if (pinFinances && g.closest("[data-finance-widget]")) return;
    chartsOnEnter(g, cleanups);
  });

  // 6. «Про мене»: прогрес прокрутки → розкриття стосу пластин. Тригер — сама сцена (не вся секція),
  // тож стос реагує на коротший відрізок прокрутки — чутливіше, особливо на телефоні
  // Десктоп: сцена sticky — прогрес по всій секції (поки сцена в кадрі); телефон — по самій сцені
  const about = parallaxFactor === 1 ? document.getElementById("about") : document.querySelector<HTMLElement>("[data-about-scene]");
  if (about) {
    ScrollTrigger.create({
      trigger: about,
      start: parallaxFactor === 1 ? "top 60%" : "top 85%",
      end: parallaxFactor === 1 ? "bottom bottom" : "center 35%",
      onUpdate: (self) => { aboutProgress.current = self.progress; },
    });
    cleanups.push(() => { aboutProgress.current = 0; });
  }

  // 6b. Печатка досвіду: «проявляється» з поворотом, число рахує від 0 — один раз при появі
  const seal = document.querySelector<HTMLElement>("[data-seal]");
  const num = seal?.querySelector<HTMLElement>("[data-count]");
  if (seal && num) {
    const end = Number(num.dataset.count) || 0;
    const shown = num.textContent;
    const counter = { v: 0 };
    const tl = gsap.timeline({ scrollTrigger: { trigger: seal, start: "top 85%", once: true } });
    tl.from(seal, { scale: 0.7, rotate: -40, autoAlpha: 0, duration: 1.2, ease: EXPO }, 0);
    if (end) tl.to(counter, { v: end, duration: 2, ease: OUT, onUpdate: () => { num.textContent = String(Math.round(counter.v)); } }, 0.15);
    cleanups.push(() => { tl.scrollTrigger?.kill(); tl.kill(); num.textContent = shown; gsap.set(seal, { clearProps: "transform,opacity,visibility" }); });
  }

  // 7. «Фінанси» без pin: екран телефона гортається разом із прокруткою секції.
  // Лише ≥1024 (сенсорні/низькі екрани); на телефоні/планшеті телефон прихований (offsetParent = null) — там картки.
  const phone = finances?.querySelector<HTMLElement>("[data-phone-scroll]");
  if (finances && phone && !pinFinances && phone.offsetParent) {
    gsap.to(phone, {
      y: () => -Math.max(0, phone.scrollHeight - (phone.parentElement?.clientHeight ?? 0)),
      ease: "none",
      scrollTrigger: { trigger: finances, start: "top 70%", end: "bottom 70%", scrub: 0.6, invalidateOnRefresh: true },
    });
  }

  // 8. Hero-фон і мобільні акордеони послуг
  setupSections(cleanups);

  ScrollTrigger.sort();
  return () => cleanups.forEach((f) => f());
}
