"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, useGSAP);

// Мова руху: лише дві плавності, без пружин і підскоків
const OUT = "power3.out"; // поява
const IN_OUT = "power2.inOut"; // лінії, переходи

/**
 * Усі анімації сторінки. Секції — серверні компоненти, вони лише позначають елементи data-атрибутами:
 * [data-split] — заголовок з'являється рядками з-під маски (SplitText)
 * [data-rule] — тонка лінія прокреслюється зліва направо
 * [data-row] — рядок «реєстру» проявляється слідом за своєю лінією
 * [data-margin-line] — лінія полів росте разом із прокруткою секції
 * [data-pain] — рядок, який зараз читають, підсвічується
 * [data-timeline] — лінія прогресу співпраці прокреслюється за прокруткою
 * [data-plan-col] — колонки цін відкриваються, як аркуш
 * [data-svg-stage] — ілюстрація історії: контури прокреслюються, документи рухаються за прокруткою
 */
export default function PageMotion() {
  useGSAP(() => {
    ScrollTrigger.config({ ignoreMobileResize: true });
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: (() => void)[] = [];

    // FAQ: плавне розкриття відповіді (з reduced motion — відкривається миттєво)
    gsap.utils.toArray<HTMLDetailsElement>("[data-faq]").forEach((d) => {
      const summary = d.querySelector("summary")!;
      const body = d.querySelector<HTMLElement>("[data-faq-body]")!;
      const onClick = (e: Event) => {
        if (reduce) return;
        e.preventDefault();
        if (d.open) {
          gsap.to(body, { height: 0, duration: 0.3, ease: IN_OUT, onComplete: () => { d.open = false; gsap.set(body, { clearProps: "height" }); } });
        } else {
          d.open = true;
          gsap.fromTo(body, { height: 0 }, { height: "auto", duration: 0.35, ease: OUT, clearProps: "height" });
        }
      };
      summary.addEventListener("click", onClick);
      cleanups.push(() => summary.removeEventListener("click", onClick));
    });

    if (reduce) return () => cleanups.forEach((f) => f());

    // 1. Заголовки: рядки виїжджають з-під маски. Чекаємо шрифти, щоб рядки розбились правильно.
    document.fonts.ready.then(() => {
      gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
        const inHero = !!el.closest("#hero");
        SplitText.create(el, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) => {
            gsap.set(el, { visibility: "visible" });
            return gsap.from(self.lines, {
              yPercent: 105,
              duration: 1.1,
              ease: OUT,
              stagger: 0.09,
              delay: inHero ? 0.1 : 0,
              scrollTrigger: inHero ? undefined : { trigger: el, start: "top 88%", once: true },
            });
          },
        });
      });
      ScrollTrigger.refresh();
    });

    // 2. Перший екран: текст і рядок фактів
    gsap.from("[data-hero]", { y: 16, opacity: 0, duration: 0.9, ease: OUT, stagger: 0.1, delay: 0.45 });

    // 3. Тонкі лінії прокреслюються, рядки «реєстру» проявляються слідом
    gsap.set("[data-rule]", { scaleX: 0 });
    ScrollTrigger.batch("[data-rule]", {
      start: "top 92%",
      once: true,
      onEnter: (els) => gsap.to(els, { scaleX: 1, duration: 1.2, ease: IN_OUT, stagger: 0.07 }),
    });
    gsap.set("[data-row]", { opacity: 0, y: 12 });
    ScrollTrigger.batch("[data-row]", {
      start: "top 90%",
      once: true,
      onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.8, ease: OUT, stagger: 0.08, delay: 0.15 }),
    });
    gsap.set("[data-reveal]", { opacity: 0, y: 16 });
    ScrollTrigger.batch("[data-reveal]", {
      start: "top 90%",
      once: true,
      onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.9, ease: OUT, stagger: 0.08 }),
    });

    // 4. Лінія полів кожної секції росте разом із прокруткою — як заповнення сторінки книги
    gsap.utils.toArray<HTMLElement>("[data-section]").forEach((sec) => {
      const line = sec.querySelector("[data-margin-line]");
      if (!line) return;
      gsap.fromTo(line, { scaleY: 0 }, {
        scaleY: 1, ease: "none",
        scrollTrigger: { trigger: sec, start: "top 75%", end: "bottom 75%", scrub: true },
      });
    });

    // 5. Рутина: рядок, який зараз читають, стає яскравим
    gsap.utils.toArray<HTMLElement>("[data-pain]").forEach((li) => {
      gsap.fromTo(li, { opacity: 0.35 }, {
        opacity: 1, ease: "none",
        scrollTrigger: { trigger: li, start: "top 85%", end: "top 60%", scrub: true },
      });
    });

    // 6. Співпраця: лінія прогресу і точки етапів
    const timeline = document.querySelector("[data-timeline]");
    if (timeline) {
      gsap.fromTo("[data-timeline-progress]", { scaleY: 0 }, {
        scaleY: 1, ease: "none",
        scrollTrigger: { trigger: timeline, start: "top 70%", end: "bottom 60%", scrub: true },
      });
      gsap.utils.toArray<HTMLElement>("[data-step]").forEach((step) => {
        ScrollTrigger.create({ trigger: step, start: "top 68%", toggleClass: { targets: step.querySelector("[data-dot]")!, className: "is-on" } });
        gsap.from(step, { opacity: 0, x: 16, duration: 0.9, ease: OUT, scrollTrigger: { trigger: step, start: "top 88%", once: true } });
      });
    }

    // 7. Ціни: колонки відкриваються зверху вниз, як аркуш відомості; фото — так само
    const cols = gsap.utils.toArray<HTMLElement>("[data-plan-col]");
    if (cols.length) {
      gsap.fromTo(cols, { clipPath: "inset(0% 0% 100% 0%)" }, {
        clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: IN_OUT, stagger: 0.12, clearProps: "clipPath",
        scrollTrigger: { trigger: cols[0], start: "top 82%", once: true },
      });
    }
    gsap.utils.toArray<HTMLElement>("[data-frame]").forEach((f) => {
      gsap.fromTo(f, { clipPath: "inset(100% 0% 0% 0%)" }, {
        clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: IN_OUT, clearProps: "clipPath",
        scrollTrigger: { trigger: f, start: "top 85%", once: true },
      });
    });

    // 8. Ілюстрація історії
    gsap.utils.toArray<SVGSVGElement>("[data-svg-stage]").forEach((svg) => {
      const stage = Number(svg.dataset.svgStage);
      const docs = svg.querySelectorAll<SVGGElement>("[data-doc]");
      const texts = svg.querySelectorAll("[data-doc-text]");

      if (stage === 0) {
        // Перший екран: контури документів прокреслюються, потім проступає текст
        const rects = svg.querySelectorAll("[data-doc] > rect");
        gsap.timeline({ delay: 0.3 })
          .from(rects, { drawSVG: "0%", fillOpacity: 0, duration: 1.4, ease: IN_OUT, stagger: 0.08 })
          .from(texts, { opacity: 0, duration: 0.8, ease: OUT, stagger: 0.06 }, "-=0.7");
        return;
      }

      // Етапи 1–3: перехід із попереднього стану, прив'язаний до прокрутки (scrub)
      const tl = gsap.timeline({
        defaults: { ease: IN_OUT },
        scrollTrigger: { trigger: svg, start: "top 92%", end: "center 55%", scrub: 1 },
      });
      if (stage === 1 || stage === 2) {
        tl.from(docs, {
          x: (_, el) => Number((el as SVGGElement).dataset.dx),
          y: (_, el) => Number((el as SVGGElement).dataset.dy),
          rotation: (_, el) => Number((el as SVGGElement).dataset.dr),
          transformOrigin: "50% 50%",
          duration: 1,
          stagger: 0.08,
        }, stage === 2 ? 0.15 : 0);
      }
      if (stage === 1) tl.fromTo(svg.querySelector("[data-tag]"), { opacity: 1 }, { opacity: 0, duration: 0.4 }, 0.2);
      if (stage === 2) {
        tl.from(svg.querySelector("[data-folder]"), { drawSVG: "0%", fillOpacity: 0, duration: 0.8 }, 0)
          .from(svg.querySelector("[data-pocket]"), { opacity: 0, y: 24, duration: 0.6 }, ">-0.3");
      }
      if (stage === 3) {
        tl.from(svg.querySelector("[data-seal] [data-draw]"), { drawSVG: "50% 50%", duration: 0.8 })
          .from(svg.querySelector("[data-seal-text]"), { opacity: 0, y: 6, duration: 0.5 }, "-=0.2");
      }
    });

    return () => cleanups.forEach((f) => f());
  });

  return null;
}
