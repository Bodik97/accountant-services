import { useId } from "react";
import { TONES, anim, clamp } from "./shared";
import type { AreaChartProps } from "./types";

const W = 240; // ширина viewBox; реальна ширина — 100% контейнера
const PAD_Y = 8; // відступ, щоб лінія і точка не різались краєм

/** Монотонна кубічна інтерполяція (Fritsch–Carlson): плавна, без «перельотів» над даними. */
function smoothPath(pts: readonly (readonly [number, number])[]) {
  const n = pts.length;
  if (n < 2) return pts.length ? `M${pts[0][0]} ${pts[0][1]}` : "";
  const dx: number[] = [];
  const m: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    dx[i] = pts[i + 1][0] - pts[i][0];
    m[i] = (pts[i + 1][1] - pts[i][1]) / dx[i];
  }
  const t: number[] = [m[0]];
  for (let i = 1; i < n - 1; i++) t[i] = m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2;
  t[n - 1] = m[n - 2];
  for (let i = 0; i < n - 1; i++) {
    if (m[i] === 0) {
      t[i] = t[i + 1] = 0;
      continue;
    }
    const a = t[i] / m[i];
    const b = t[i + 1] / m[i];
    const s = a * a + b * b;
    if (s > 9) {
      const k = 3 / Math.sqrt(s);
      t[i] = k * a * m[i];
      t[i + 1] = k * b * m[i];
    }
  }
  const f = (v: number) => v.toFixed(2);
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    d += ` C${f(pts[i][0] + h)} ${f(pts[i][1] + t[i] * h)} ${f(pts[i + 1][0] - h)} ${f(pts[i + 1][1] - t[i + 1] * h)} ${f(pts[i + 1][0])} ${f(pts[i + 1][1])}`;
  }
  return d;
}

/**
 * Лінійна діаграма з градієнтною областю і підсвіченою точкою.
 * SVG розтягується на 100% ширини (preserveAspectRatio="none"), лінія — non-scaling-stroke,
 * тому товщина 1.75px незмінна. Точка — HTML-елемент поверх SVG, щоб лишатися круглою.
 */
export default function AreaChart({
  data,
  highlightIndex,
  height = 72,
  tone = "light",
  animate = false,
  ariaLabel,
  className = "",
  grid = true,
}: AreaChartProps & {
  /** Тонкі горизонтальні лінії сітки (3 шт.) */
  grid?: boolean;
}) {
  const c = TONES[tone];
  const gid = `area-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const H = height;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const span = max - min || 1;
  const last = Math.max(data.length - 1, 1);
  const pts = data.map((v, i) => [data.length === 1 ? W / 2 : (i / last) * W, PAD_Y + (1 - (v - min) / span) * (H - PAD_Y * 2)] as const);
  const line = smoothPath(pts);
  const area = pts.length > 1 ? `${line} L${W} ${H} L0 ${H} Z` : "";
  const hi = pts.length ? pts[clamp(highlightIndex ?? pts.length - 1, 0, pts.length - 1)] : undefined;
  const gridYs = [PAD_Y, H / 2, H - 0.5];

  return (
    <div className={`relative w-full ${className}`} style={{ height: H }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full overflow-visible"
        role="img"
        aria-label={ariaLabel}
      >
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={c.mark} stopOpacity={tone === "dark" ? 0.26 : 0.16} />
            <stop offset="100%" stopColor={c.mark} stopOpacity="0" />
          </linearGradient>
        </defs>
        {grid && (
          <g aria-hidden="true">
            {gridYs.map((y) => (
              <line key={y} x1="0" x2={W} y1={y} y2={y} stroke={c.grid} strokeWidth="1" vectorEffect="non-scaling-stroke" />
            ))}
          </g>
        )}
        {area && <path d={area} fill={`url(#${gid})`} aria-hidden="true" {...anim(animate, "area")} />}
        <path
          d={line}
          fill="none"
          stroke={c.mark}
          strokeWidth="1.75"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          aria-hidden="true"
          {...anim(animate, "draw")}
        />
      </svg>
      {hi && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute grid size-3.5 place-items-center rounded-full"
          style={{ left: `${(hi[0] / W) * 100}%`, top: hi[1], marginLeft: -7, marginTop: -7, background: tone === "dark" ? "rgb(255 255 255 / 0.16)" : "rgb(10 10 10 / 0.1)" }}
          {...anim(animate, "dot")}
        >
          <span className="size-[7px] rounded-full" style={{ background: c.mark }} />
        </span>
      )}
    </div>
  );
}
