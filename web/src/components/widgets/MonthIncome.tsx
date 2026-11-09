import Card from "@/components/ui/Card";
import AreaChart from "@/components/charts/AreaChart";
import Counter from "@/components/charts/Counter";
import DemoNote from "./DemoNote";
import { TrendUp } from "./icons";
import { isDark, muted, rootClass } from "./utils";
import type { MonthIncomeProps } from "./types";

export default function MonthIncome({ title, amount, data, deltaPercent, periodLabel, variant = "white", demo = true, animate = false, className = "" }: MonthIncomeProps) {
  const dark = isDark(variant);
  return (
    <Card variant={variant} radius="sm" className={`p-4 ${rootClass("w-[16rem]", className)}`} data-widget>
      <div className="flex items-center justify-between gap-3">
        <p className={`min-w-0 truncate text-[0.8125rem] ${muted(dark)}`}>{title}</p>
        {deltaPercent !== undefined && (
          <span className="inline-flex shrink-0 items-center gap-1 text-[0.75rem] font-medium">
            <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
            <TrendUp className="size-3" />
            <span className="sr-only">Зміна</span>
            <Counter value={deltaPercent} format="percent" animate={animate} />
          </span>
        )}
      </div>
      <div className="mt-2 flex items-end justify-between gap-3">
        <p className="metric shrink-0 text-[1.5rem]"><Counter value={amount} format="uah" animate={animate} /></p>
        <div className="w-20 min-w-0">
          <AreaChart data={data} height={36} tone={dark ? "dark" : "light"} animate={animate} ariaLabel={`${title}: динаміка${periodLabel ? ` за ${periodLabel}` : ""}`} />
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        {periodLabel && <span className={`truncate text-[0.75rem] ${muted(dark)}`}>{periodLabel}</span>}
        {demo && <span className="ml-auto shrink-0"><DemoNote on={dark ? "dark" : "light"} /></span>}
      </div>
    </Card>
  );
}
