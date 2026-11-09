import Card from "@/components/ui/Card";
import DonutChart, { donutOpacity } from "@/components/charts/DonutChart";
import { formatValue } from "@/components/charts/Counter";
import DemoNote from "./DemoNote";
import { isDark, muted, rootClass } from "./utils";
import type { PaymentsSplitProps } from "./types";

export default function PaymentsSplit({ title, segments, variant = "white", demo = true, animate = false, className = "" }: PaymentsSplitProps) {
  const dark = isDark(variant);
  const total = segments.reduce((s, x) => s + x.value, 0);
  // Відсотки методом найбільшого залишку — сума завжди 100 (а не 99/101 через округлення)
  const shares = (() => {
    if (!total) return segments.map(() => 0);
    const raw = segments.map((s) => (s.value / total) * 100);
    const base = raw.map(Math.floor);
    let rest = 100 - base.reduce((a, b) => a + b, 0);
    raw.map((r, i) => [r - base[i], i] as const).sort((a, b) => b[0] - a[0]).forEach(([, i]) => { if (rest-- > 0) base[i] += 1; });
    return base;
  })();
  const pct = (v: number) => shares[segments.findIndex((s) => s.value === v)] ?? 0;
  return (
    <Card variant={variant} className={`p-5 ${rootClass("w-[19rem]", className)}`} data-widget>
      <p className="truncate text-[0.9375rem] font-medium">{title}</p>
      <div className="mt-4 flex items-center gap-4">
        <DonutChart
          className="shrink-0"
          segments={segments}
          size={104}
          centerLabel={formatValue(total, "uah")}
          tone={dark ? "dark" : "light"}
          animate={animate}
          ariaLabel={`${title}: ${segments.map((s) => `${s.label} ${pct(s.value)}%`).join(", ")}`}
        />
        {/* Легенда: той самий колір мітки й та сама непрозорість, що й сегмент DonutChart */}
        <ul className="grid min-w-0 flex-1 gap-2 text-[0.8125rem]">
          {segments.map((s, i) => (
            <li key={s.label} className="flex min-w-0 items-center gap-2">
              <span className={`size-2.5 shrink-0 rounded-full ${dark ? "bg-white" : "bg-black"}`} style={{ opacity: donutOpacity(i) }} aria-hidden="true" />
              <span className={`min-w-0 flex-1 truncate ${muted(dark)}`} title={s.label}>{s.label}</span>
              <span className="tabular-nums shrink-0 font-medium">{pct(s.value)}%</span>
            </li>
          ))}
        </ul>
      </div>
      {demo && <p className="mt-4"><DemoNote on={dark ? "dark" : "light"} /></p>}
    </Card>
  );
}
