import { useId } from "react";

/**
 * Статичний силует «Скульптури-графіка» для lite-режиму і як підкладка до завантаження canvas.
 * Ті самі розміри і ракурс, що в HeroBars, спроєктовані в SVG (ортографічно) під час збірки модуля.
 */

type V3 = [number, number, number];

const PITCH = 0.27;
const BAR = 0.17;
const PLATE = { w: 12 * PITCH + 0.2, h: 0.07, d: 0.62 };
const JITTER = [0, 0.06, -0.05, 0.08, -0.03, 0.05, -0.06, 0.04, 0.07, -0.04, 0.03, 0];
const HEIGHTS = JITTER.map((j, i) => 0.5 + 1.45 * Math.pow(i / 11, 1.15) + j);
const X = HEIGHTS.map((_, i) => (i - 5.5) * PITCH);
const YAW = 0.42;
const TILT = 0.32;

const cy = Math.cos(YAW), sy = Math.sin(YAW), ct = Math.cos(TILT), st = Math.sin(TILT);
/** Поворот як у сцені (tilt ∘ yaw); повертає [x, y, z] у просторі камери. */
function rotate([x, y, z]: V3): V3 {
  const x1 = x * cy + z * sy;
  const z1 = -x * sy + z * cy;
  return [x1, y * ct - z1 * st, y * st + z1 * ct];
}

// Грані коробки: нормаль і 4 кути (індекси в масиві вершин)
const FACES: { n: V3; v: number[]; kind: "top" | "front" | "side" }[] = [
  { n: [0, 1, 0], v: [4, 5, 6, 7], kind: "top" },
  { n: [0, 0, 1], v: [1, 0, 4, 5], kind: "front" },
  { n: [0, 0, -1], v: [3, 2, 6, 7], kind: "front" },
  { n: [1, 0, 0], v: [2, 1, 5, 6], kind: "side" },
  { n: [-1, 0, 0], v: [0, 3, 7, 4], kind: "side" },
];

type Tone = Record<"top" | "front" | "side", string>;
const DARK: Tone = { top: "#3a3a3a", front: "#141414", side: "#0a0a0a" };
const TONES: Record<"white" | "grey" | "black" | "red", Tone> = {
  white: { top: "#ffffff", front: "#f2f2f2", side: "#dcdcdc" },
  grey: { top: "#a8a8a8", front: "#8a8a8a", side: "#6e6e6e" },
  black: DARK,
  red: { top: "#f0574d", front: "#e0352b", side: "#b8261e" },
};
// Як barTone у HeroBars (тут без імпорту, щоб не тягнути three.js у lite-режим)
const barTone = (i: number) => (i < 3 ? "red" : i < 6 ? "black" : i < 9 ? "grey" : "white");

function box(cx: number, w: number, y0: number, h: number, d: number, tone: Tone) {
  const xs = [cx - w / 2, cx + w / 2];
  const corners: V3[] = [];
  for (const y of [y0, y0 + h]) {
    corners.push([xs[0], y, d / 2], [xs[1], y, d / 2], [xs[1], y, -d / 2], [xs[0], y, -d / 2]);
  }
  const p = corners.map(rotate);
  return FACES.filter((f) => rotate(f.n)[2] > 0).map((f) => ({
    points: f.v.map((i) => `${p[i][0].toFixed(3)},${(-p[i][1]).toFixed(3)}`).join(" "),
    fill: tone[f.kind],
  }));
}

// Плита, потім стовпчики від дальнього (праворуч углибині) до ближнього
const SHAPES = [
  ...box(0, PLATE.w, -PLATE.h, PLATE.h, PLATE.d, DARK),
  ...HEIGHTS.map((h, i) => box(X[i], BAR, 0, h, BAR, TONES[barTone(i)])).reverse().flat(),
];
const TREND = HEIGHTS.map((h, i) => rotate([X[i], h + 0.12, 0]))
  .map(([x, y]) => `${x.toFixed(3)},${(-y).toFixed(3)}`)
  .join(" ");
const DOT = rotate([X[11], HEIGHTS[11] + 0.12, 0]);
const SHADOW = rotate([0, -PLATE.h, 0]);

export default function HeroBarsFallback() {
  // Унікальний id: fallback може бути на сторінці двічі (десктопний і мобільний hero)
  const shadowId = `hero-bars-shadow-${useId().replace(/:/g, "")}`;
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <svg
        viewBox="-2 -2.45 4 3.1"
        preserveAspectRatio="xMidYMid meet"
        className="absolute left-1/2 top-1/2 h-[70%] w-[78%] -translate-x-1/2 -translate-y-[44%] lg:w-[62%] lg:translate-x-[-44%]"
      >
        <defs>
          <filter id={shadowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.08" />
          </filter>
        </defs>
        <ellipse cx={SHADOW[0]} cy={-SHADOW[1] + 0.12} rx="1.9" ry="0.32" fill="#0a0a0a" opacity="0.22" filter={`url(#${shadowId})`} />
        {SHAPES.map((s, i) => (
          <polygon key={i} points={s.points} fill={s.fill} stroke={s.fill} strokeWidth="0.008" strokeLinejoin="round" />
        ))}
        <polyline points={TREND} fill="none" stroke="#1a1a1a" strokeWidth="0.012" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={DOT[0]} cy={-DOT[1]} r="0.045" fill="#e0352b" />
      </svg>
    </div>
  );
}
