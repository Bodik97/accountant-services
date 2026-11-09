import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Counter from "@/components/charts/Counter";
import DemoNote from "./DemoNote";
import { hairline, isDark, muted, rootClass } from "./utils";
import type { TaxesPaidProps } from "./types";

export default function TaxesPaid({ items, statusLabel, title = "Податки сплачено", periodLabel, variant = "white", demo = true, animate = false, className = "" }: TaxesPaidProps) {
  const total = items.reduce((s, i) => s + i.amount, 0);
  const dark = isDark(variant);
  return (
    <Card variant={variant} className={`p-5 ${rootClass("w-[17rem]", className)}`} data-widget>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[0.9375rem] font-medium">{title}</p>
          {periodLabel && <p className={`mt-0.5 truncate text-[0.75rem] ${muted(dark)}`}>{periodLabel}</p>}
        </div>
        <span className="shrink-0"><Badge tone="success">{statusLabel}</Badge></span>
      </div>
      <dl className="mt-4 grid gap-2 text-[0.9375rem]">
        {items.map((i) => (
          <div key={i.label} className="flex justify-between gap-3">
            <dt className={`min-w-0 truncate ${muted(dark)}`}>{i.label}</dt>
            <dd className="shrink-0"><Counter value={i.amount} format="uah" animate={animate} /></dd>
          </div>
        ))}
      </dl>
      <div className={`mt-3 flex items-baseline justify-between gap-3 border-t pt-3 ${hairline(dark)}`}>
        <span className="text-[0.9375rem] font-medium">Разом</span>
        <span className="metric text-2xl"><Counter value={total} format="uah" animate={animate} /></span>
      </div>
      {demo && <p className="mt-3"><DemoNote on={dark ? "dark" : "light"} /></p>}
    </Card>
  );
}
