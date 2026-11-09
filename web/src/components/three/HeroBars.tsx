"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Line } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { MeshPhysicalMaterial, SphereGeometry, type Group, type Mesh } from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import type { Line2 } from "three/examples/jsm/lines/Line2.js";
import { SceneCanvas, StudioLights, usePointer } from "./common";
import type { Quality } from "./types";

/**
 * «Скульптура-графік»: 12 стовпчиків (місяці року) на тонкій плиті.
 * Матовий чорний пластик, останній стовпчик — світлий (поточний місяць).
 * Інтро: стовпчики виростають з 0 по черзі; далі — повільне погойдування ±12° і легкий parallax.
 */

// Розміри в одиницях сцени
const PITCH = 0.27; // крок між стовпчиками
const BAR = 0.17; // ширина і глибина стовпчика
const PLATE = { w: 12 * PITCH + 0.2, h: 0.07, d: 0.62 };
// Плавне зростання з невеликими «живими» відхиленнями
const JITTER = [0, 0.06, -0.05, 0.08, -0.03, 0.05, -0.06, 0.04, 0.07, -0.04, 0.03, 0];
const HEIGHTS = JITTER.map((j, i) => 0.5 + 1.45 * Math.pow(i / 11, 1.15) + j);
const X = HEIGHTS.map((_, i) => (i - 5.5) * PITCH);
const LINE_LIFT = 0.12; // лінія тренду трохи над вершинами
const TREND: [number, number, number][] = HEIGHTS.map((h, i) => [X[i], h + LINE_LIFT, 0]);
const LAST = TREND[11];

// Габарит з урахуванням нахилу і погойдування (для вписування в полотно)
const FIT = { w: 3.6, h: 2.8 };
const CENTER_Y = -0.95; // опускаємо модель, щоб її середина була в центрі обертання

// Камера: невелика перспектива
const FOV = 24;
const Z = 8;

// Рух
const TILT = 0.32; // погляд трохи згори
const YAW = 0.42; // 3/4 ракурс: короткі стовпчики ближче, високі — праворуч углибині
const SWAY = 0.21; // ±12°
const GROW = 0.7; // тривалість зростання одного стовпчика, с
const STAGGER = 0.045; // 11 × 0.045 + 0.7 ≈ 1.2 с

const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

function makeResources(quality: Quality) {
  const finish = { roughness: 0.45, metalness: 0, clearcoat: 0.6, clearcoatRoughness: 0.35, envMapIntensity: 1.1 };
  const segments = quality === "low" ? 2 : 4;
  const radius = 0.028;
  const bars = HEIGHTS.map((h) => {
    const g = new RoundedBoxGeometry(BAR, h, BAR, segments, radius);
    g.translate(0, h / 2, 0); // точка опори — низ стовпчика, щоб рости з плити
    return g;
  });
  return {
    dark: new MeshPhysicalMaterial({ color: "#0d0d0d", ...finish }),
    light: new MeshPhysicalMaterial({ color: "#f2f2f2", ...finish }),
    bars,
    plate: new RoundedBoxGeometry(PLATE.w, PLATE.h, PLATE.d, segments, 0.03),
    dot: new SphereGeometry(0.045, quality === "low" ? 16 : 32, quality === "low" ? 12 : 24),
  };
}

function Sculpture({ quality }: { quality: Quality }) {
  const [res] = useState(() => makeResources(quality));
  const tilt = useRef<Group>(null);
  const yaw = useRef<Group>(null);
  const bars = useRef<(Group | null)[]>([]);
  const dot = useRef<Mesh>(null);
  const line = useRef<Line2>(null);
  const start = useRef<number | null>(null);
  const pointer = usePointer(quality === "high");

  useEffect(
    () => () => {
      res.dark.dispose();
      res.light.dispose();
      res.plate.dispose();
      res.dot.dispose();
      res.bars.forEach((g) => g.dispose());
    },
    [res],
  );

  // Вписуємо в полотно за меншим з обмежень (вузький телефон не обрізає)
  const size = useThree((s) => s.size);
  const visH = 2 * Z * Math.tan(((FOV / 2) * Math.PI) / 180);
  const visW = visH * (size.width / Math.max(1, size.height));
  const high = quality === "high";
  const scale = Math.min(1, (visW * (high ? 0.58 : 0.8)) / FIT.w, (visH * (high ? 0.46 : 0.72)) / FIT.h);
  // Десктоп: центр трохи праворуч-нижче, щоб верхній лівий віджет не затуляв скульптуру
  const offset: [number, number, number] = high ? [visW * 0.03, -visH * 0.01, 0] : [0, -visH * 0.02, 0];

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    if (start.current === null) start.current = t;
    const since = t - start.current;

    // Інтро: стовпчики ростуть по черзі, ease-out без перельоту
    for (let i = 0; i < 12; i++) {
      const b = bars.current[i];
      if (b) b.scale.y = Math.max(0.001, easeOut(clamp01((since - i * STAGGER) / GROW)));
    }
    const done = easeOut(clamp01((since - (11 * STAGGER + GROW * 0.8)) / 0.5));
    if (line.current) line.current.material.opacity = done;
    if (dot.current) dot.current.scale.setScalar(Math.max(0.001, done));

    // Повільне погойдування + parallax (лише high: pointer там ненульовий)
    const k = 1 - Math.exp(-dt * 2.5);
    const p = pointer.current;
    if (yaw.current) {
      const target = YAW + Math.sin(t * 0.25) * SWAY + p.x * 0.1;
      yaw.current.rotation.y += (target - yaw.current.rotation.y) * k;
    }
    if (tilt.current) tilt.current.rotation.x += (TILT + p.y * 0.06 - tilt.current.rotation.x) * k;
  });

  return (
    <group position={offset} scale={scale}>
      <group ref={tilt} rotation-x={TILT}>
        <group ref={yaw} rotation-y={YAW}>
          <group position-y={CENTER_Y}>
            <mesh geometry={res.plate} material={res.dark} position-y={-PLATE.h / 2} />
            {res.bars.map((g, i) => (
              <group
                key={i}
                ref={(el) => {
                  bars.current[i] = el;
                }}
                position-x={X[i]}
                scale-y={0.001}
              >
                <mesh geometry={g} material={i === 11 ? res.light : res.dark} />
              </group>
            ))}
            <Line ref={line} points={TREND} color="#1a1a1a" lineWidth={high ? 1.4 : 1.2} transparent opacity={0} />
            <mesh ref={dot} geometry={res.dot} material={res.dark} position={LAST} scale={0.001} />
            {/* Тінь знімається один раз і обертається разом з плитою — повторний рендер не потрібен */}
            <ContactShadows
              position-y={-PLATE.h - 0.002}
              scale={[PLATE.w * 1.35, PLATE.d * 2.6]}
              resolution={high ? 256 : 128}
              blur={high ? 2.4 : 2}
              opacity={0.42}
              far={1}
              frames={1}
              color="#000000"
            />
          </group>
        </group>
      </group>
    </group>
  );
}

export default function HeroBars({ quality = "high", active = true }: { quality?: Quality; active?: boolean }) {
  return (
    <SceneCanvas quality={quality} active={active} fov={FOV} z={Z}>
      <StudioLights />
      <Sculpture quality={quality} />
    </SceneCanvas>
  );
}
