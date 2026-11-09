"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { useRef } from "react";
import { MathUtils, type Group, type Mesh } from "three";
import { SceneCanvas, StudioLights, usePointer } from "./common";
import type { VariantProps } from "./types";

/**
 * Стос тонких пластин-«документів»: чорний матовий пластик чергується зі світлими аркушами.
 * Кожна пластина трохи зсунута і повернута; progress (0..1) розводить стос віялом.
 */
const PLATES = [
  { dark: true, x: -0.06, z: 0.04, ry: 0.05 },
  { dark: false, x: 0.05, z: -0.03, ry: -0.04 },
  { dark: true, x: -0.02, z: 0.06, ry: 0.09 },
  { dark: false, x: 0.07, z: 0.0, ry: -0.07 },
  { dark: true, x: -0.04, z: -0.05, ry: 0.03 },
  { dark: false, x: 0.02, z: 0.03, ry: -0.02 },
] as const;

/** Рядки «документа» на верхній пластині (x від лівого поля, z — рядок) */
const LINES = [
  { z: -0.5, w: 0.8, h: 0.07, strong: true },
  { z: -0.3, w: 1.5, h: 0.035, strong: false },
  { z: -0.18, w: 1.25, h: 0.035, strong: false },
  { z: -0.06, w: 1.4, h: 0.035, strong: false },
  { z: 0.5, w: 0.55, h: 0.07, strong: true },
] as const;

const W = 2.3;
const D = 1.62;
const H = 0.09;
const GAP = 0.17; // відстань у зібраному стані
const FAN = 0.3; // додаткова відстань при progress = 1

function Stack({ quality, progress }: Pick<VariantProps, "quality" | "progress">) {
  const plates = useRef<(Mesh | null)[]>([]);
  const group = useRef<Group>(null);
  const eased = useRef(0);
  const { viewport } = useThree();
  // Діагональ стосу ≈ 3 одиниці → вписуємо у вужчий бік полотна
  const scale = Math.min(1, Math.min(viewport.width, viewport.height) * 0.3);
  const smooth = quality === "low" ? 2 : 4;

  // Рухливість: кожна пластина «дихає» (підйом/нахил зі своєю фазою), стос гойдається,
  // реагує на курсор, а прокрутка розводить пластини віялом із легкою «хвилею»
  const tilt = useRef({ x: 0, y: 0 });
  const pointer = usePointer(quality === "high"); // курсор по всьому вікну (-0.5..0.5); на телефоні — 0
  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    eased.current = MathUtils.damp(eased.current, MathUtils.clamp(progress?.current ?? 0, 0, 1), 7, dt);
    const p = eased.current;
    const mid = (PLATES.length - 1) / 2;
    plates.current.forEach((m, i) => {
      if (!m) return;
      const cfg = PLATES[i];
      const o = i - mid;
      const ph = t * 0.9 + i * 1.1;
      m.position.y = o * (GAP + FAN * p) + Math.sin(ph) * (0.045 + 0.03 * p);
      m.position.x = cfg.x * (1 + p * 4) + o * 0.05 * p + Math.sin(t * 0.5 + i * 0.7) * 0.03 * p;
      m.position.z = cfg.z * (1 + p * 3) + Math.cos(ph * 0.8) * 0.025;
      m.rotation.y = cfg.ry * (1 + p * 2.5) + Math.sin(t * 0.4 + i) * 0.05;
      m.rotation.z = Math.sin(t * 0.7 + i) * 0.035 + o * 0.025 * p;
      m.rotation.x = Math.cos(t * 0.6 + i * 0.8) * 0.03;
    });
    // Курсор: стос м'яко повертається слідом (pointer у межах -1..1)
    tilt.current.x = MathUtils.damp(tilt.current.x, pointer.current.y * 0.24, 3, dt);
    tilt.current.y = MathUtils.damp(tilt.current.y, pointer.current.x * 0.5, 3, dt);
    const g = group.current;
    if (g) {
      g.rotation.y = -0.62 + Math.sin(t * 0.25) * 0.14 + p * 0.25 + tilt.current.y;
      g.rotation.x = 0.52 + Math.sin(t * 0.33) * 0.04 - tilt.current.x;
      g.position.y = Math.sin(t * 0.6) * 0.06;
    }
  });

  return (
    <group ref={group} scale={scale} rotation={[0.52, -0.62, 0]}>
      {PLATES.map((cfg, i) => (
        <RoundedBox
          key={i}
          ref={(m) => {
            plates.current[i] = m;
          }}
          args={[W, H, D]}
          radius={0.044}
          smoothness={smooth}
          bevelSegments={smooth}
        >
          {cfg.dark ? (
            <meshPhysicalMaterial color="#0b0b0b" roughness={0.45} clearcoat={0.7} clearcoatRoughness={0.35} />
          ) : (
            <meshPhysicalMaterial color="#f4f4f4" roughness={0.6} clearcoat={0.3} clearcoatRoughness={0.5} />
          )}
          {/* Верхня пластина — «документ»: кілька тонких рядків */}
          {i === PLATES.length - 1 &&
            LINES.map((l) => (
              <mesh key={l.z} position={[-0.95 + l.w / 2, H / 2 + 0.002, l.z]} rotation-x={-Math.PI / 2}>
                <planeGeometry args={[l.w, l.h]} />
                <meshBasicMaterial color={l.strong ? "#0a0a0a" : "#8a8a8a"} />
              </mesh>
            ))}
        </RoundedBox>
      ))}
    </group>
  );
}

export default function Plates({ quality = "high", active = true, progress }: VariantProps) {
  return (
    <SceneCanvas quality={quality} active={active} fov={30} z={7}>
      <StudioLights />
      <Stack quality={quality} progress={progress} />
    </SceneCanvas>
  );
}
