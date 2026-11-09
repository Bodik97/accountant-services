import type { CSSProperties } from "react";

/** Дані «Розподіл платежів» за замовчуванням. Тут, а не в GlassDonut, щоб fallback не тягнув three у бандл. */
export interface DonutSegment {
  label: string;
  value: number;
}
export const DEFAULT_SEGMENTS: readonly DonutSegment[] = [
  { label: "Єдиний податок", value: 62 },
  { label: "ЄСВ", value: 25 },
  { label: "Військовий збір", value: 13 },
];

/**
 * Статичний силует «скляної кругової діаграми» для lite-режиму і як підкладка до завантаження 3D.
 * Те саме кільце з трьох секторів, нахилене «на стіл» (CSS 3D), товщина — кількома шарами.
 * Займає батька повністю, декоративний (aria-hidden).
 */
const R = 40;
const C = 2 * Math.PI * R;
const GAP = 2.2; // довжина проміжку по дузі (одиниці viewBox)
const FILLS = ["url(#donut-glass)", "#0d0d0d", "#e9e9e9"]; // за рангом: скло, чорний, світлий
const SIDES = ["#cfcfcf", "#000000", "#c9c9c9"];
const LAYERS = 6;

function Ring({ segments, rank, side }: { segments: readonly DonutSegment[]; rank: number[]; side: boolean }) {
  const total = segments.reduce((a, s) => a + Math.max(s.value, 0), 0) || 1;
  const lens = segments.map((s) => (Math.max(s.value, 0) / total) * C);
  const starts = lens.map((_, i) => lens.slice(0, i).reduce((a, v) => a + v, 0));
  return (
    <>
      {segments.map((s, i) => {
        const len = lens[i];
        const offset = -(starts[i] + GAP / 2);
        const k = Math.min(rank[i], 2);
        return (
          <circle
            key={s.label}
            cx="50"
            cy="50"
            r={R}
            fill="none"
            stroke={side ? SIDES[k] : FILLS[k]}
            strokeWidth="17"
            strokeDasharray={`${Math.max(len - GAP, 0)} ${C}`}
            strokeDashoffset={offset}
            transform="rotate(-90 50 50)"
          />
        );
      })}
      <circle cx="50" cy="50" r="12" fill={side ? "#000" : "#0b0b0b"} />
    </>
  );
}

export default function GlassDonutFallback({ segments = DEFAULT_SEGMENTS }: { segments?: readonly DonutSegment[] }) {
  const order = segments.map((s, i) => [s.value, i] as const).sort((a, b) => b[0] - a[0]);
  const rank: number[] = [];
  order.forEach(([, i], k) => (rank[i] = k));

  const plane: CSSProperties = { transform: "rotateX(58deg)", transformStyle: "preserve-3d" };
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center [perspective:1200px]">
      <div className="relative aspect-square w-[min(58%,24rem)]" style={plane}>
        {/* М'яка контактна тінь під кільцем */}
        <div className="absolute inset-[6%] rounded-full bg-[#0a0a0a]/25 blur-[18px]" style={{ transform: "translateZ(-26px)" }} />
        {Array.from({ length: LAYERS }, (_, l) => (
          <svg
            key={l}
            viewBox="0 0 100 100"
            className="absolute inset-0 h-full w-full overflow-visible"
            style={{ transform: `translateZ(${(l - LAYERS) * 3}px)` }}
          >
            <Ring segments={segments} rank={rank} side />
          </svg>
        ))}
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible">
          <defs>
            <linearGradient id="donut-glass" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="0.45" stopColor="#f1f1f1" />
              <stop offset="1" stopColor="#d6d6d6" />
            </linearGradient>
          </defs>
          <Ring segments={segments} rank={rank} side={false} />
        </svg>
      </div>
    </div>
  );
}
