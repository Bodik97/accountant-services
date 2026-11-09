import { TONES, anim, clamp } from "./shared";
import type { BarChartProps } from "./types";

/**
 * Вертикальні стовпчики із заокругленим верхом (4px), квадратні біля бази.
 * Зібрано з HTML-блоків (а не SVG), щоб радіуси й підписи лишались чіткими за будь-якої ширини.
 * Обгортка — role="img" з aria-label, тож ariaLabel має містити ключові значення.
 */
export default function BarChart({
  data,
  highlightIndex,
  height = 96,
  tone = "light",
  animate = false,
  ariaLabel,
  className = "",
  valueLabel,
}: BarChartProps & {
  /** Підпис над виділеним стовпчиком, напр. «12 400 ₴» */
  valueLabel?: string;
}) {
  const c = TONES[tone];
  const max = Math.max(0, ...data.map((d) => d.value)) || 1;
  const hi = data.length ? clamp(highlightIndex ?? data.length - 1, 0, data.length - 1) : -1;

  return (
    <div role="img" aria-label={ariaLabel} className={`w-full tabular-nums ${className}`}>
      <div className="flex items-end gap-1.5" style={{ height, paddingTop: valueLabel ? 20 : 0 }}>
        {data.map((d, i) => {
          const pct = (clamp(d.value, 0, max) / max) * 100;
          const isHi = i === hi;
          return (
            <div key={`${d.label}-${i}`} className="relative flex h-full flex-1 items-end justify-center">
              <div
                className="w-full max-w-6 rounded-t-[4px]"
                style={{
                  height: `${pct}%`,
                  background: c.mark,
                  opacity: isHi ? 1 : c.dimOpacity,
                  transformBox: "fill-box",
                  transformOrigin: "bottom",
                }}
                {...anim(animate, "grow-y")}
              />
              {isHi && valueLabel && (
                <span
                  className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-semibold"
                  style={{ bottom: `calc(${pct}% + 6px)`, color: c.text }}
                >
                  {valueLabel}
                </span>
              )}
            </div>
          );
        })}
      </div>
      <div className="h-px w-full" style={{ background: c.grid }} />
      <div className="mt-2 flex gap-1.5">
        {data.map((d, i) => (
          <span
            key={`${d.label}-${i}`}
            className={`min-w-0 flex-1 truncate text-center text-xs ${i === hi ? "font-medium" : ""}`}
            style={{ color: i === hi ? c.text : c.muted }}
          >
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}
