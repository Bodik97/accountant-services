import type { CounterFormat, CounterProps } from "./types";

const nf = new Intl.NumberFormat("uk-UA", { maximumFractionDigits: 0 });
const nfPct = new Intl.NumberFormat("uk-UA", { maximumFractionDigits: 1 });

/**
 * uah → «12 400 ₴» (нерозривний пробіл перед ₴), int → «12 400», percent → «+18%».
 * Експортується, щоб GSAP-анімація форматувала проміжні значення так само.
 */
export function formatValue(value: number, format: CounterFormat = "int"): string {
  if (format === "uah") return `${nf.format(value)} ₴`;
  if (format === "percent") return `${value > 0 ? "+" : ""}${nfPct.format(value)}%`;
  return nf.format(value);
}

/** Число з фінальним значенням у тексті; GSAP рахує від 0 за data-to (якщо animate). */
export default function Counter({ value, format = "int", animate = false, className = "" }: CounterProps) {
  return (
    <span className={`tabular-nums ${className}`} {...(animate ? { "data-counter": "", "data-to": value, "data-format": format } : {})}>
      {formatValue(value, format)}
    </span>
  );
}
