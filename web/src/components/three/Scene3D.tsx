"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ComponentType, type CSSProperties } from "react";
import type { SceneProps, SceneVariant, VariantProps } from "./types";
import HeroBarsFallback from "./HeroBarsFallback";
import GlassDonutFallback from "./GlassDonutFallback";

const SCENES: Record<SceneVariant, ComponentType<VariantProps>> = {
  "hero-bars": dynamic(() => import("./HeroBars"), { ssr: false }),
  plates: dynamic(() => import("./Plates"), { ssr: false }),
  glass: dynamic(() => import("./GlassDonut"), { ssr: false }),
};

/** Чи доступний WebGL (перевіряємо один раз, ліниво — не в <head>, щоб не гальмувати старт). */
let webglOk: boolean | null = null;
function hasWebGL() {
  if (webglOk === null) {
    try {
      const c = document.createElement("canvas");
      webglOk = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      webglOk = false;
    }
  }
  return webglOk;
}

/**
 * Обгортка 3D-сцени.
 * - canvas монтується після першого відмалювання (requestIdleCallback) і лише коли контейнер
 *   має розмір (ResizeObserver) та вперше наблизився до екрана (IntersectionObserver);
 * - поза екраном рендер на паузі (frameloop "never");
 * - html[data-mode="lite"] або немає WebGL — canvas ніколи не монтується, лишається статичний силует;
 * - на телефоні/планшеті 3D вантажиться лише після першої взаємодії (прокрутка, дотик, клавіша):
 *   до того видно статичний силует, і важкий three.js не заважає першому відмалюванню;
 * - якщо контейнер став невидимим (зміна breakpoint) — canvas демонтується і звільняє WebGL-контекст.
 */
export default function Scene3D({ variant, quality = "high", progress, className = "", label, background }: SceneProps) {
  const [idle, setIdle] = useState(false);
  const [sized, setSized] = useState(false);
  const [inView, setInView] = useState(false);
  const [seen, setSeen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  // Мобільна і десктопна версії hero не працюють одночасно: прихований контейнер має розмір 0
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSized(el.offsetWidth > 0 && el.offsetHeight > 0));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setSeen(true);
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (document.documentElement.dataset.mode !== "full" || !hasWebGL()) return;
    const start = () => setIdle(true);
    const hasIdle = typeof window.requestIdleCallback === "function";
    let id: number | ReturnType<typeof setTimeout> | undefined;
    const schedule = () => {
      id = hasIdle ? window.requestIdleCallback(start, { timeout: 1200 }) : setTimeout(start, 400);
    };

    const mobile = matchMedia("(max-width: 63.98rem)").matches;
    const events = ["scroll", "pointerdown", "touchstart", "keydown"] as const;
    const onFirst = () => {
      events.forEach((e) => removeEventListener(e, onFirst));
      schedule();
    };
    if (mobile) events.forEach((e) => addEventListener(e, onFirst, { once: true, passive: true }));
    else schedule();

    return () => {
      events.forEach((e) => removeEventListener(e, onFirst));
      if (id === undefined) return;
      if (hasIdle) window.cancelIdleCallback(id as number);
      else clearTimeout(id as ReturnType<typeof setTimeout>);
    };
  }, []);

  const mounted = idle && sized && seen;
  const Scene = SCENES[variant];

  return (
    <div className={className} role="img" aria-label={label}>
      <div ref={box} className="relative h-full w-full">
        {/* Fallback і «підкладка» до завантаження — той самий силует, що й 3D у спокої */}
        <div aria-hidden="true" className={`absolute inset-0 transition-opacity duration-700 ${mounted ? "opacity-0" : "opacity-100"}`}>
          <Fallback variant={variant} />
        </div>
        {mounted && (
          <div className="absolute inset-0 animate-[fade_0.8s_ease-out]">
            <Scene quality={quality} active={inView} progress={progress} background={background} />
          </div>
        )}
      </div>
    </div>
  );
}

function Fallback({ variant }: { variant: SceneVariant }) {
  if (variant === "plates") return <PlatesFallback />;
  if (variant === "glass") return <GlassDonutFallback />;
  return <HeroBarsFallback />;
}

/** Ізометричний стос: пластини через одну чорні/світлі, нижні — далі по осі Y. */
function PlatesFallback() {
  const plates = [true, false, true, false, true, false];
  return (
    <>
      {plates.map((dark, i) => {
        const style: CSSProperties = {
          top: `${62 - i * 5}%`,
          transform: `translate(-50%, -50%) rotateX(58deg) rotateZ(-38deg) translateX(${(i % 2 ? 1 : -1) * 2}%)`,
        };
        return (
          <div
            key={i}
            style={style}
            className={`absolute left-1/2 aspect-[1.42] w-[52%] rounded-[10px] shadow-[0_10px_24px_-10px_rgb(10_10_10/0.45)] ${dark ? "bg-[#0b0b0b]" : "border border-black/10 bg-[#f4f4f4]"}`}
          />
        );
      })}
    </>
  );
}
