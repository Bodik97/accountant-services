"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { useEffect, useRef, type ReactNode } from "react";
import type { Quality } from "./types";

/** Спільне полотно: DPR за якістю, прозорий фон, пауза рендеру, коли сцена поза екраном. */
export function SceneCanvas({
  quality,
  active,
  fov = 35,
  z = 5,
  children,
}: {
  quality: Quality;
  active: boolean;
  fov?: number;
  z?: number;
  children: ReactNode;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, z], fov }}
      dpr={quality === "low" ? [1, 1.5] : [1, 2]}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: true, alpha: true, powerPreference: quality === "low" ? "low-power" : "high-performance" }}
    >
      <ReadySignal />
      {children}
    </Canvas>
  );
}

/** Після першого кадру повідомляє сторінку (GSAP робить ScrollTrigger.refresh()). */
function ReadySignal() {
  const sent = useRef(false);
  useFrame(() => {
    if (sent.current) return;
    sent.current = true;
    requestAnimationFrame(() => window.dispatchEvent(new Event("scene3d:ready")));
  });
  return null;
}

/** Студійне світло без HDR-файлів: софтбокси дають м'які довгі відблиски на лаку і склі. */
export function StudioLights({ intensity = 1 }: { intensity?: number }) {
  return (
    <Environment resolution={256} frames={1}>
      <Lightformer intensity={2.4 * intensity} position={[0, 4, 2]} scale={[8, 2, 1]} rotation-x={Math.PI / 2} />
      <Lightformer intensity={1.6 * intensity} position={[-4, 0.5, 1]} scale={[0.6, 6, 1]} rotation-y={Math.PI / 2} />
      <Lightformer intensity={1 * intensity} position={[4, -1, 1]} scale={[0.4, 5, 1]} rotation-y={-Math.PI / 2} />
      <Lightformer intensity={0.5 * intensity} position={[0, -3, -2]} scale={[6, 1, 1]} rotation-x={-Math.PI / 2} />
    </Environment>
  );
}

/** Нормалізована позиція курсора (-0.5..0.5). Вимкнено — завжди 0 (телефон, quality="low"). */
export function usePointer(enabled: boolean) {
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = e.clientX / window.innerWidth - 0.5;
      pointer.current.y = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled]);
  return pointer;
}
