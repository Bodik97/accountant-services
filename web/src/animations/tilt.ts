import { gsap, OUT, type Cleanup } from "./gsap";

const MAX = 6; // градусів

/**
 * Нахил карток до курсора: [data-tilt] і зовнішні [data-widget].
 * Розмір картки читається на вході курсора і після прокрутки (не на кожен pointermove).
 * Викликається лише для (hover: hover) and (pointer: fine) і без reduced motion.
 */
export function setupTilt(): Cleanup {
  const els = [...document.querySelectorAll<HTMLElement>("[data-tilt], [data-widget]")].filter(
    (el) => !el.parentElement?.closest("[data-tilt], [data-widget]"),
  );
  const offs: Cleanup[] = [];
  // Прокрутка під нерухомим курсором зсуває картку — кешований розмір стає застарілим
  let gen = 0;
  const invalidate = () => { gen++; };
  window.addEventListener("scroll", invalidate, { passive: true });
  offs.push(() => window.removeEventListener("scroll", invalidate));

  els.forEach((el) => {
    gsap.set(el, { transformPerspective: 900 });
    const rx = gsap.quickTo(el, "rotationX", { duration: 0.6, ease: OUT });
    const ry = gsap.quickTo(el, "rotationY", { duration: 0.6, ease: OUT });
    let rect: DOMRect | null = null;
    let rectGen = -1;
    const measure = () => { rect = el.getBoundingClientRect(); rectGen = gen; return rect; };

    const enter = () => { measure(); };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = rect && rectGen === gen ? rect : measure();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      ry(px * MAX * 2);
      rx(-py * MAX * 2);
    };
    const leave = () => { rect = null; rx(0); ry(0); };

    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    offs.push(() => {
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    });
  });

  return () => offs.forEach((f) => f());
}
