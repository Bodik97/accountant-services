import Card from "@/components/ui/Card";
import AreaChart from "@/components/charts/AreaChart";
import Counter from "@/components/charts/Counter";
import DemoNote from "./DemoNote";
import { TrendUp } from "./icons";
import { isDark, muted, rootClass } from "./utils";
import type { IncomeProps } from "./types";

export default function Income({ title, data, growthPercent, periodLabel, variant = "dark", demo = true, animate = false, className = "" }: IncomeProps) {
  const dark = isDark(variant);
  return (
    <Card variant={variant} className={`p-5 ${rootClass("w-[19rem]", className)}`} data-widget>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className={`truncate text-[0.8125rem] ${muted(dark)}`}>{title}</p>
          <p className="metric mt-1 text-[1.75rem]"><Counter value={data.reduce((a, b) => a + b, 0)} format="uah" animate={animate} /></p>
        </div>
        <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.75rem] font-medium ${dark ? "bg-white/10" : "bg-black/[0.06]"}`}>
          <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
          <TrendUp className="size-3" />
          <span className="sr-only">Зростання</span>
          <Counter value={growthPercent} format="percent" animate={animate} />
        </span>
      </div>
      <AreaChart className="mt-4" data={data} tone={dark ? "dark" : "light"} animate={animate} ariaLabel={`${title}: зростання ${growthPercent}% за ${periodLabel}`} height={64} />
      <div className="mt-3 flex items-center justify-between gap-3">
        <span className={`truncate text-[0.75rem] ${muted(dark)}`}>{periodLabel}</span>
        {demo && <span className="shrink-0"><DemoNote on={dark ? "dark" : "light"} /></span>}
      </div>
    </Card>
  );
}
