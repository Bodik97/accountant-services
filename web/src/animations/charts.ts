import { formatValue } from "@/components/charts/Counter";
import type { CounterFormat } from "@/components/charts/types";
import { gsap, OUT, type Cleanup } from "./gsap";

const FORMATS: readonly CounterFormat[] = ["uah", "int", "percent"];

/**
 * Таймлайн появи діаграм усередині root (за контрактом data-anim / data-counter).
 * Повертає ПРИЗУПИНЕНИЙ таймлайн (початковий стан уже застосовано) або null, якщо анімувати нічого.
 * Текст лічильників відновлюється у cleanups (revert GSAP його не повертає).
 */
export function buildCharts(root: Element, cleanups: Cleanup[]): gsap.core.Timeline | null {
  const q = <T extends Element>(sel: string) => Array.from(root.querySelectorAll<T>(sel));
  const draw = q<SVGPathElement>('[data-anim="draw"]');
  const area = q('[data-anim="area"]');
  const dot = q('[data-anim="dot"]');
  const bars = q('[data-anim="grow-y"]');
  const donut = q<SVGPathElement>('[data-anim="donut"]');
  const progress = q('[data-anim="progress"]');
  const counters = q<HTMLElement>("[data-counter]");
  if (!draw.length && !area.length && !dot.length && !bars.length && !donut.length && !progress.length && !counters.length) return null;

  const tl = gsap.timeline({ paused: true, defaults: { ease: OUT } });

  if (draw.length) tl.from(draw, { drawSVG: "0%", duration: 1.2 }, 0);
  if (area.length) tl.from(area, { opacity: 0, duration: 0.9 }, 0.35);
  if (dot.length) tl.from(dot, { opacity: 0, scale: 0.4, duration: 0.5 }, draw.length ? 0.95 : 0.2);
  if (bars.length) tl.from(bars, { scaleY: 0, transformOrigin: "50% 100%", duration: 0.9, stagger: 0.06 }, 0);
  // Сегменти кільця заповнюються послідовно, ніби одна лінія
  if (donut.length) tl.from(donut, { drawSVG: "0%", duration: 0.6, ease: "power2.inOut", stagger: 0.45 }, 0);
  if (progress.length) tl.from(progress, { scaleX: 0, transformOrigin: "0% 50%", duration: 1.1 }, 0.1);

  counters.forEach((el) => {
    const to = Number(el.dataset.to);
    if (!Number.isFinite(to)) return;
    const fmt = (FORMATS as readonly string[]).includes(el.dataset.format ?? "") ? (el.dataset.format as CounterFormat) : "int";
    const finalText = el.textContent ?? formatValue(to, fmt);
    const round = fmt === "percent" ? (v: number) => Math.round(v * 10) / 10 : Math.round;
    const proxy = { v: 0 };
    el.textContent = formatValue(0, fmt);
    tl.to(proxy, {
      v: to,
      duration: 1.2,
      onUpdate: () => { el.textContent = formatValue(round(proxy.v), fmt); },
      onComplete: () => { el.textContent = finalText; },
    }, 0);
    cleanups.push(() => { el.textContent = finalText; });
  });

  return tl;
}

/** Групи діаграм: кожен [data-widget] з анімованими елементами, або діаграма/лічильник поза віджетом. */
export function chartGroups(scope: ParentNode = document): Element[] {
  const groups = new Set<Element>();
  scope.querySelectorAll("[data-anim], [data-counter]").forEach((el) => {
    // найзовнішній віджет (AccountCard може мати вкладений data-widget)
    let w: Element | null = el.closest("[data-widget]");
    while (w?.parentElement?.closest("[data-widget]")) w = w.parentElement.closest("[data-widget]");
    groups.add(w ?? el.closest('[role="img"], [role="meter"]') ?? el);
  });
  return [...groups];
}
