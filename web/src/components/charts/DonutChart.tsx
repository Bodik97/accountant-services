import { TONES, anim } from "./shared";
import type { DonutChartProps } from "./types";

/**
 * Непрозорості сегментів за порядком (сегмент i → DONUT_OPACITIES[i]).
 * Віджет малює легенду тим самим кольором мітки (TONES[tone].mark) з цією ж непрозорістю.
 * Максимум 4 сегменти; решту варто згорнути в «Інше» (інакше вони отримають останній крок).
 */
export const DONUT_OPACITIES = [1, 0.55, 0.3, 0.15] as const;

export function donutOpacity(index: number): number {
  return DONUT_OPACITIES[Math.min(index, DONUT_OPACITIES.length - 1)];
}

const C = 50; // центр viewBox 100×100
const SW = 8; // товщина кільця
const R = C - SW / 2 - 1;
const GAP = 2.5; // видимий проміжок між закругленими кінцями

const point = (a: number) => `${(C + R * Math.cos(a)).toFixed(3)} ${(C + R * Math.sin(a)).toFixed(3)}`;

function arcPath(start: number, end: number) {
  // Закруглені кінці виступають на SW/2 — компенсуємо кутом, щоб лишився рівний GAP
  const pad = (SW / 2 + GAP / 2) / R;
  const a0 = start + pad;
  const a1 = end - pad;
  if (a1 <= a0) {
    const mid = (start + end) / 2;
    return `M${point(mid)} L${point(mid)}`; // замалий сегмент → крапка
  }
  return `M${point(a0)} A${R} ${R} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${point(a1)}`;
}

/** Кільцева діаграма: сегменти з проміжками й закругленими кінцями, розрізнені кроками непрозорості. */
export default function DonutChart({ segments, centerLabel, size = 160, tone = "light", animate = false, ariaLabel, className = "" }: DonutChartProps) {
  const c = TONES[tone];
  const total = segments.reduce((s, d) => s + Math.max(0, d.value), 0);
  const visible = segments.filter((d) => d.value > 0).length;
  let acc = 0;

  return (
    <svg viewBox="0 0 100 100" role="img" aria-label={ariaLabel} className={`block h-auto max-w-full ${className}`} style={{ width: size }}>
      {total === 0 ? (
        <circle cx={C} cy={C} r={R} fill="none" stroke={c.grid} strokeWidth={SW} aria-hidden="true" />
      ) : (
        segments.map((d, i) => {
          const v = Math.max(0, d.value);
          const start = -Math.PI / 2 + (acc / total) * Math.PI * 2;
          acc += v;
          const end = -Math.PI / 2 + (acc / total) * Math.PI * 2;
          if (v === 0) return null;
          const dPath = visible === 1 ? `M${point(-Math.PI / 2)} A${R} ${R} 0 1 1 ${point(Math.PI / 2)} A${R} ${R} 0 1 1 ${point(-Math.PI / 2)}` : arcPath(start, end);
          return (
            <path
              key={`${d.label}-${i}`}
              d={dPath}
              fill="none"
              stroke={c.mark}
              strokeOpacity={donutOpacity(i)}
              strokeWidth={SW}
              strokeLinecap="round"
              aria-hidden="true"
              {...anim(animate, "donut")}
            />
          );
        })
      )}
      {centerLabel && (
        <text
          x={C}
          y={C}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="13"
          fontWeight="600"
          fill={c.text}
          aria-hidden="true"
          style={{ fontFamily: "var(--font-display)", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}
        >
          {centerLabel}
        </text>
      )}
    </svg>
  );
}
