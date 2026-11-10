import Lenis from "lenis";
import { gsap, ScrollTrigger, MQ, type Cleanup } from "./gsap";

/**
 * Плавний скрол Lenis — лише десктоп (≥1024px) із мишею, повний режим і без reduced motion;
 * на тач-пристроях — нативний. Lenis рухається тіком GSAP і оновлює ScrollTrigger.
 * Якорі (#about …): відступ під фіксовану шапку дає scroll-padding-top у globals.css (Lenis його враховує).
 */
export function setupSmoothScroll(): Cleanup | undefined {
  if (!matchMedia(MQ.fine).matches || !matchMedia(MQ.desktop).matches || matchMedia(MQ.reduce).matches) return;
  const lenis = new Lenis({ autoRaf: false, anchors: true, lerp: 0.1 });
  lenis.on("scroll", ScrollTrigger.update);
  const tick = (t: number) => lenis.raf(t * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return () => {
    gsap.ticker.remove(tick);
    gsap.ticker.lagSmoothing(500, 33);
    lenis.destroy();
  };
}
