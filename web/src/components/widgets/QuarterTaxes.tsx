import Card from "@/components/ui/Card";
import BarChart from "@/components/charts/BarChart";
import Counter, { formatValue } from "@/components/charts/Counter";
import DemoNote from "./DemoNote";
import { isDark, muted, rootClass } from "./utils";
import type { QuarterTaxesProps } from "./types";

export default function QuarterTaxes({ title, quarters, variant = "white", demo = true, animate = false, className = "" }: QuarterTaxesProps) {
  const dark = isDark(variant);
  const total = quarters.reduce((s, q) => s + q.value, 0);
  const last = quarters.length - 1;
  return (
    <Card variant={variant} className={`p-5 ${rootClass("w-[19rem]", className)}`} data-widget>
      <p className={`truncate text-[0.8125rem] ${muted(dark)}`}>{title}</p>
      <p className="metric mt-1 text-[1.75rem]"><Counter value={total} format="uah" animate={animate} /></p>
      <BarChart
        className="mt-4"
        data={quarters}
        highlightIndex={last}
        tone={dark ? "dark" : "light"}
        animate={animate}
        height={96}
        ariaLabel={`${title}: ${quarters.map((q) => `${q.label} — ${formatValue(q.value, "uah")}`).join(", ")}`}
      />
      <ul className="sr-only">
        {quarters.map((q) => (
          <li key={q.label}>{`${q.label}: ${formatValue(q.value, "uah")}`}</li>
        ))}
      </ul>
      <div className="mt-3 flex items-center justify-between gap-3 text-[0.75rem]">
        {last >= 0 && (
          <span className={`truncate ${muted(dark)}`}>
            {quarters[last].label}: <span className={dark ? "text-white" : "text-black"}>{formatValue(quarters[last].value, "uah")}</span>
          </span>
        )}
        {demo && <span className="shrink-0"><DemoNote on={dark ? "dark" : "light"} /></span>}
      </div>
    </Card>
  );
}
