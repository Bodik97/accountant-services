"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/animations/gsap";

/**
 * Хвиляста лінія через вузли [data-step-dot] батьківського списку.
 * Вузли стоять у шаховому порядку; відрізки — плавні S-криві між ними.
 * З анімаціями: лінія «малюється» з прокруткою, вузли зафарбовуються, коли лінія до них доходить.
 * Без анімацій (reduced motion / lite / без JS-ефектів) — лінія видно повністю, вузли зафарбовані.
 */
export default function ProcessPath() {
  const svg = useRef<SVGSVGElement>(null);
  const path = useRef<SVGPathElement>(null);
  const track = useRef<SVGPathElement>(null);

  useEffect(() => {
    const list = svg.current?.parentElement;
    const p = path.current;
    if (!list || !p || !svg.current) return;
    const dots = [...list.querySelectorAll<HTMLElement>("[data-step-dot]")];
    let fractions: number[] = [];

    const build = () => {
      const box = list.getBoundingClientRect();
      const pts = dots.map((d) => {
        const r = d.getBoundingClientRect();
        return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top };
      });
      if (pts.length < 2) return;
      // Вузли чергуються ліво/право — кожен відрізок м'яка S-крива (дві чверті еліпса), що не заходить на картки
      let d = `M ${pts[0].x} ${pts[0].y}`;
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1];
        const b = pts[i];
        const dy = b.y - a.y;
        d += ` C ${a.x} ${a.y + dy * 0.62}, ${b.x} ${b.y - dy * 0.62}, ${b.x} ${b.y}`;
      }
      p.setAttribute("d", d);
      track.current?.setAttribute("d", d);
      svg.current!.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);
      // Частка довжини лінії до кожного вузла — щоб зафарбовувати вузол, коли лінія до нього доходить
      const total = p.getTotalLength();
      fractions = pts.map((_, i) => {
        if (i === 0) return 0;
        const sub = document.createElementNS("http://www.w3.org/2000/svg", "path");
        sub.setAttribute("d", d.split(" C ").slice(0, i + 1).join(" C "));
        return sub.getTotalLength() / total;
      });
    };
    build();
    const ro = new ResizeObserver(build);
    ro.observe(list);

    const animated = document.documentElement.classList.contains("motion") && !matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!animated) {
      dots.forEach((d) => d.classList.add("is-reached"));
      return () => ro.disconnect();
    }

    const st = ScrollTrigger.create({
      trigger: list,
      start: "top 75%",
      end: "bottom 55%",
      scrub: 0.6,
      onRefresh: build,
      onUpdate: (self) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len * (1 - self.progress) });
        dots.forEach((d, i) => d.classList.toggle("is-reached", self.progress >= fractions[i] - 0.01));
      },
    });
    const len = p.getTotalLength();
    gsap.set(p, { strokeDasharray: len, strokeDashoffset: len * (1 - st.progress) });
    return () => { st.kill(); ro.disconnect(); gsap.set(p, { clearProps: "all" }); };
  }, []);

  return (
    <svg ref={svg} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
      {/* Пунктирна «доріжка» під лінією — видно весь маршрут наперед */}
      <path ref={track} fill="none" stroke="#0a0a0a" strokeOpacity="0.18" strokeWidth="1.5" strokeDasharray="2 7" strokeLinecap="round" />
      <path ref={path} fill="none" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
