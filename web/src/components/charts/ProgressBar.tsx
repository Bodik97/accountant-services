import { TONES, anim, clamp } from "./shared";
import type { ProgressBarProps } from "./types";

/** Підпис + значення («12 / 12») + заокруглений трек із заповненням. */
export default function ProgressBar({
  value,
  max,
  label,
  tone = "light",
  animate = false,
  ariaLabel,
  className = "",
  valueText,
}: ProgressBarProps & {
  /** Власний текст значення замість «value / max», напр. «75%» */
  valueText?: string;
}) {
  const c = TONES[tone];
  const pct = max > 0 ? (clamp(value, 0, max) / max) * 100 : 0;
  const text = valueText ?? `${value} / ${max}`;

  return (
    <div className={`w-full ${className}`}>
      <div className="mb-2 flex items-baseline justify-between gap-3 text-sm">
        <span style={{ color: c.muted }}>{label}</span>
        <span className="font-medium tabular-nums" style={{ color: c.text }}>
          {text}
        </span>
      </div>
      <div
        role="meter"
        aria-label={ariaLabel}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={text}
        className="h-1.5 w-full overflow-hidden rounded-full"
        style={{ background: c.grid }}
      >
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: c.mark, transformOrigin: "left" }} {...anim(animate, "progress")} />
      </div>
    </div>
  );
}
