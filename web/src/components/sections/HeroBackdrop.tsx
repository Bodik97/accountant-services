"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import desk from "@/assets/hero-desk.jpg";

/**
 * Фон чорної половини hero: фото робочого столу бухгалтера (затемнене і знебарвлене під монохромний стиль).
 * «Живе» за рахунок шарів:
 *  — фото повільно «наїжджає» (Ken Burns) і рухається при прокрутці (parallax, [data-hero-layer], animations/sections.ts);
 *  — смуги сонячного світла від жалюзі повільно пливуть по столу;
 *  — на десктопі шари зсуваються за мишею (CSS translate від --px/--py), м'яке світло стежить за курсором.
 * Затемнення підібране так, щоб білий текст мав контраст AA. Фото — заглушка: замініть src/assets/hero-desk.jpg власним.
 */
export default function HeroBackdrop() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current?.parentElement;
    if (!el || !matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = el.getBoundingClientRect();
        const s = root.current?.style;
        s?.setProperty("--mx", `${e.clientX - r.left}px`);
        s?.setProperty("--my", `${e.clientY - r.top}px`);
        s?.setProperty("--px", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
        s?.setProperty("--py", (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
      });
    };
    el.addEventListener("pointermove", onMove);
    return () => { el.removeEventListener("pointermove", onMove); cancelAnimationFrame(raf); };
  }, []);

  // Зсув шару за мишею (CSS translate не конфліктує з GSAP transform прокрутки)
  const follow = (d: number) => ({ translate: `calc(var(--px) * ${(-d * 16).toFixed(1)}px) calc(var(--py) * ${(-d * 12).toFixed(1)}px)` });

  return (
    <div ref={root} aria-hidden="true" className="hero-follow pointer-events-none absolute inset-0 overflow-hidden bg-black [--mx:70%] [--my:30%] [--px:0] [--py:0]">
      {/* 1. Фото: запас по краях під parallax і «наїзд» камери */}
      <div className="absolute -inset-x-[10%] -top-[10%] -bottom-[24%]" data-hero-layer="0.6">
        <div className="absolute inset-0" style={follow(1)}>
          <div className="hero-kenburns absolute inset-0">
            <Image
              src={desk}
              alt=""
              fill
              placeholder="blur"
              preload
              sizes="(min-width: 1024px) 60vw, 120vw"
              className="object-cover object-[60%_40%] [filter:grayscale(0.7)_contrast(1.05)_brightness(0.95)]"
            />
          </div>
        </div>
      </div>

      {/* 2. Сонячні смуги від жалюзі — повільно пливуть (ближчий шар) */}
      <div className="absolute -inset-[20%]" data-hero-layer="0.4">
        <div className="hero-blinds absolute inset-0 opacity-60 mix-blend-soft-light" style={follow(1.8)} />
      </div>

      {/* 3. Затемнення для читабельності: сильніше ліворуч і внизу (де текст), світліше вгорі праворуч */}
      <div className="absolute inset-0 bg-[linear-gradient(100deg,rgb(10_10_10/0.92)_0%,rgb(10_10_10/0.8)_45%,rgb(10_10_10/0.55)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgb(10_10_10/0.85)_0%,transparent_45%)]" />

      {/* 4. Тепле м'яке світло за курсором */}
      <div className="absolute inset-0 bg-[radial-gradient(460px_circle_at_var(--mx)_var(--my),rgb(255_255_255/0.07),transparent_70%)]" />
    </div>
  );
}
