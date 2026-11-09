"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, MeshTransmissionMaterial } from "@react-three/drei";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import {
  Color,
  Curve,
  ExtrudeGeometry,
  MathUtils,
  Shape,
  TubeGeometry,
  Vector3,
  type BufferGeometry,
  type Group,
  type Mesh,
  type MeshStandardMaterial,
} from "three";
import { toCreasedNormals } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { SceneCanvas, StudioLights } from "./common";
import type { Quality } from "./types";
import { DEFAULT_SEGMENTS, type DonutSegment } from "./GlassDonutFallback";

/**
 * «Скляна кругова діаграма»: товсте кільце з трьох секторів (Розподіл платежів).
 * Найбільший сектор — рідке скло, другий — чорний матовий пластик, третій — світлий матовий.
 * progress (0..1, пише GSAP) веде кільце через 4 кроки секції «Фінанси»:
 * 0 — зібране, повільно обертається; 1 — розвертається до камери, біла дуга-індикатор;
 * 2 — сектори розходяться назовні й по черзі піднімаються; 3 — збираються і спокійно лягають.
 */

export interface GlassDonutProps {
  quality?: Quality;
  /** false — сцена поза екраном, рендер на паузі (Scene3D передає сам) */
  active?: boolean;
  progress?: RefObject<number>;
  segments?: readonly DonutSegment[];
  /** Колір фону секції, який заломлюється у склі */
  background?: string;
}

// Розміри кільця (локальні одиниці, до масштабу під viewport)
const R_OUT = 1;
const R_IN = 0.6;
const DEPTH = 0.26;
const GAP = 0.1; // ширина проміжку між секторами по середньому радіусу
const START = Math.PI / 2; // перший сектор починається згори, далі — за годинниковою стрілкою
const ARC_R = R_OUT + 0.14; // радіус дуги-індикатора

/** Ключові пози кільця по кроках (центри кроків: 0.125, 0.375, 0.625, 0.875). */
const TILT = [-1.05, -0.6, -0.86, -0.98] as const; // нахил «до столу»: 0 — кільце дивиться в камеру
const YAW = [0.12, 0, -0.06, 0] as const;

function keyed(p: number, keys: readonly number[]) {
  const s = MathUtils.clamp((p - 0.125) / 0.25, 0, keys.length - 1);
  const i = Math.min(Math.floor(s), keys.length - 2);
  const f = MathUtils.smoothstep(s - i, 0, 1);
  return MathUtils.lerp(keys[i], keys[i + 1], f);
}

/** Плавне «вікно»: 0 → 1 на [a, b], 1 → 0 на [c, d]. */
function windowed(p: number, a: number, b: number, c: number, d: number) {
  return MathUtils.smoothstep(p, a, b) * (1 - MathUtils.smoothstep(p, c, d));
}

/** Коло в площині XY, проходиться за годинниковою стрілкою від START (як і сектори). */
class RingArc extends Curve<Vector3> {
  constructor(private radius: number) {
    super();
  }
  override getPoint(t: number, target = new Vector3()) {
    const a = START - t * Math.PI * 2;
    return target.set(Math.cos(a) * this.radius, Math.sin(a) * this.radius, 0);
  }
}

interface SegmentGeo {
  geometry: BufferGeometry;
  dir: [number, number]; // напрям «розльоту» (середина сектора)
  mid: number; // середній кут
}

function buildSegments(values: readonly number[], low: boolean): SegmentGeo[] {
  const total = values.reduce((a, v) => a + Math.max(v, 0), 0) || 1;
  const gapAngle = GAP / ((R_OUT + R_IN) / 2);
  let cursor = START;
  return values.map((v) => {
    const sweep = (Math.max(v, 0) / total) * Math.PI * 2;
    const hi = cursor - gapAngle / 2;
    const lo = cursor - sweep + gapAngle / 2;
    cursor -= sweep;
    const shape = new Shape();
    shape.absarc(0, 0, R_OUT, lo, hi, false);
    shape.absarc(0, 0, R_IN, hi, lo, true);
    shape.closePath();
    const frac = sweep / (Math.PI * 2);
    const raw = new ExtrudeGeometry(shape, {
      depth: DEPTH,
      curveSegments: Math.max(6, Math.round(frac * (low ? 48 : 128))),
      bevelEnabled: true,
      bevelThickness: 0.025,
      bevelSize: 0.022,
      bevelSegments: low ? 1 : 3,
    });
    const geometry = toCreasedNormals(raw, Math.PI / 5); // гладкі дуги, чіткі ребра
    raw.dispose();
    const mid = (hi + lo) / 2;
    return { geometry, dir: [Math.cos(mid), Math.sin(mid)], mid };
  });
}

function Donut({ quality, progress, segments, background }: Required<Omit<GlassDonutProps, "active" | "progress">> & Pick<GlassDonutProps, "progress">) {
  const low = quality === "low";
  const { viewport } = useThree();
  // Компактно в центрі: віджети по кутах не перекривають кільце; працює на будь-якому аспекті
  const scale = Math.min(1, viewport.width * 0.27, viewport.height * 0.36);

  // segments має бути стабільним масивом (константа модуля), інакше геометрія перебудовується
  const geos = useMemo(() => buildSegments(segments.map((s) => s.value), low), [segments, low]);
  useEffect(() => () => geos.forEach((g) => g.geometry.dispose()), [geos]);

  const arcRadial = low ? 5 : 8;
  const arcTubular = low ? 96 : 192;
  const ringArc = useMemo(() => new RingArc(ARC_R), []);
  const arcGeo = useMemo(() => new TubeGeometry(ringArc, arcTubular, 0.012, arcRadial, false), [ringArc, arcTubular, arcRadial]);
  useEffect(() => () => arcGeo.dispose(), [arcGeo]);
  const arcIndexCount = arcGeo.index?.count ?? 0;

  // Матеріал за рангом значення — як у легенді віджета «Платежі»: найбільший — чорний, другий — скло, третій — світлий
  const rank = useMemo(() => {
    const order = segments.map((s, i) => [s.value, i] as const).sort((a, b) => b[0] - a[0]);
    const r: number[] = [];
    order.forEach(([, i], k) => (r[i] = k));
    return r;
  }, [segments]);
  const mat = (i: number) => (rank[i] === 0 ? 1 : rank[i] === 1 ? 0 : rank[i]); // 0 — скло, 1 — чорний, 2+ — світлий
  const glassIndex = rank.indexOf(1);
  // Спокійна поза: середина скляного сектора — до камери (локальне −Y після нахилу)
  const base = -Math.PI / 2 - (geos[glassIndex]?.mid ?? 0);

  const bg = useMemo(() => new Color(background), [background]);

  const tilt = useRef<Group>(null);
  const spin = useRef<Group>(null);
  const parts = useRef<(Group | null)[]>([]);
  const arc = useRef<Mesh>(null);
  const bead = useRef<Mesh>(null);
  const eased = useRef(0);
  const free = useRef(base);
  const tmp = useMemo(() => new Vector3(), []);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const p = (eased.current = MathUtils.damp(eased.current, MathUtils.clamp(progress?.current ?? 0, 0, 1), 3, dt));

    // Крок 0: вільне повільне обертання; далі — плавно до найближчої «рівної» пози
    const align = MathUtils.smoothstep(p, 0.12, 0.32);
    free.current += dt * 0.18 * (1 - align);
    const target = base + Math.PI * 2 * Math.round((free.current - base) / (Math.PI * 2));
    if (spin.current) spin.current.rotation.z = MathUtils.lerp(free.current, target, align);

    if (tilt.current) {
      tilt.current.rotation.x = keyed(p, TILT) + Math.sin(t * 0.3) * 0.02;
      tilt.current.rotation.y = keyed(p, YAW) + Math.sin(t * 0.21) * 0.015;
      tilt.current.position.y = Math.sin(t * 0.4) * 0.02;
    }

    // Крок 2: сектори розходяться по черзі; «активний» (за прогресом усередині кроку) — вище і ближче
    const u = MathUtils.clamp((p - 0.5) / 0.25, 0, 1);
    geos.forEach((g, i) => {
      const part = parts.current[i];
      if (!part) return;
      const d = i * 0.03;
      const e = windowed(p, 0.4 + d, 0.54 + d, 0.74 + d, 0.86 + d);
      const c = (i + 0.5) / geos.length;
      const focus = Math.exp(-(((u - c) / 0.2) ** 2)) * e;
      const out = (e * 0.13 + focus * 0.05) * R_OUT;
      part.position.set(g.dir[0] * out, g.dir[1] * out, e * 0.06 + focus * 0.14);
      part.scale.setScalar(1 + focus * 0.04);
    });

    // Крок 1: біла дуга-індикатор обходить кільце (загальна частка = 100%), з кулькою на кінці
    const show = windowed(p, 0.24, 0.33, 0.5, 0.58);
    const sweep = MathUtils.smoothstep(p, 0.27, 0.46);
    const a = arc.current;
    if (a) {
      a.visible = show > 0.01;
      const steps = Math.round(sweep * arcTubular);
      a.geometry.setDrawRange(0, Math.min(arcIndexCount, steps * arcRadial * 6));
      (a.material as MeshStandardMaterial).opacity = show;
    }
    const b = bead.current;
    if (b) {
      b.visible = show > 0.01;
      b.position.copy(ringArc.getPoint(Math.min(sweep, 0.999), tmp));
      b.scale.setScalar(0.04 * show);
    }
  });

  return (
    <group scale={scale}>
      <group ref={tilt}>
        <group ref={spin}>
          {geos.map((g, i) => (
            <group key={i} ref={(el) => void (parts.current[i] = el)}>
              <mesh geometry={g.geometry} renderOrder={mat(i) === 0 ? 1 : 0}>
                {mat(i) === 0 ? (
                  low ? (
                    <meshPhysicalMaterial
                      color="#ffffff"
                      transparent
                      opacity={0.5}
                      roughness={0.15}
                      ior={1.35}
                      clearcoat={1}
                      clearcoatRoughness={0.1}
                      envMapIntensity={1.4}
                      depthWrite={false}
                    />
                  ) : (
                    <MeshTransmissionMaterial
                      background={bg}
                      resolution={512}
                      samples={6}
                      thickness={0.6}
                      roughness={0.12}
                      ior={1.35}
                      chromaticAberration={0} // монохром: без кольорових облямівок
                      anisotropy={0.1}
                      distortion={0.08}
                      distortionScale={0.3}
                      temporalDistortion={0}
                      clearcoat={1}
                      clearcoatRoughness={0.08}
                      color="#ffffff"
                      attenuationColor="#e6e6e6"
                      attenuationDistance={2}
                    />
                  )
                ) : mat(i) === 1 ? (
                  <meshPhysicalMaterial color="#0d0d0d" roughness={0.45} clearcoat={0.6} clearcoatRoughness={0.3} />
                ) : (
                  <meshPhysicalMaterial color="#eeeeee" roughness={0.55} clearcoat={0.2} clearcoatRoughness={0.5} />
                )}
              </mesh>
            </group>
          ))}

          {/* Темна «шайба» в центрі — дає склу що заломлювати */}
          <mesh position-z={DEPTH * 0.3} rotation-x={Math.PI / 2}>
            <cylinderGeometry args={[0.3, 0.3, DEPTH * 0.6, low ? 32 : 64]} />
            <meshPhysicalMaterial color="#0b0b0b" roughness={0.3} clearcoat={1} clearcoatRoughness={0.2} />
          </mesh>
        </group>

        {/* Індикатор не обертається разом із кільцем — він «прив'язаний» до столу */}
        <mesh ref={arc} geometry={arcGeo} position-z={DEPTH / 2} visible={false}>
          <meshStandardMaterial color="#ffffff" roughness={0.25} transparent opacity={0} />
        </mesh>
        <mesh ref={bead} position-z={DEPTH / 2} visible={false}>
          <sphereGeometry args={[1, 24, 16]} />
          <meshPhysicalMaterial color="#0a0a0a" roughness={0.25} clearcoat={1} />
        </mesh>

        {!low && (
          // ContactShadows знімає «зверху» по осі Y; повертаємо її так, щоб «верх» = нормаль кільця
          <group rotation-x={Math.PI / 2} position-z={-0.03}>
            <ContactShadows resolution={256} scale={3.4} blur={2.6} far={1.2} opacity={0.32} color="#0a0a0a" frames={1} />
          </group>
        )}
      </group>
    </group>
  );
}

export default function GlassDonut({
  quality = "high",
  active = true,
  progress,
  segments = DEFAULT_SEGMENTS,
  background = "#f4f4f4",
}: GlassDonutProps) {
  return (
    <SceneCanvas quality={quality} active={active}>
      <StudioLights intensity={1.15} />
      <Donut quality={quality} progress={progress} segments={segments} background={background} />
    </SceneCanvas>
  );
}
