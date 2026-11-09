import Card from "@/components/ui/Card";
import Counter from "@/components/charts/Counter";
import DemoNote from "./DemoNote";
import { Receipt, TrendUp } from "./icons";
import { hairline, isDark, muted, rootClass } from "./utils";
import type { ReceiptsCounterProps } from "./types";

export default function ReceiptsCounter({ title, count, deltaLabel, periodLabel, variant = "dark", demo = true, animate = false, className = "" }: ReceiptsCounterProps) {
  const dark = isDark(variant);
  return (
    <Card variant={variant} radius="sm" className={`p-4 ${rootClass("w-[15rem]", className)}`} data-widget>
      <div className="flex items-center gap-2">
        <span className={`grid size-7 shrink-0 place-items-center rounded-full border ${hairline(dark)}`}><Receipt className="size-3.5" /></span>
        <p className={`min-w-0 truncate text-[0.8125rem] ${muted(dark)}`}>{title}</p>
      </div>
      <p className="metric mt-3 text-[2rem]"><Counter value={count} format="int" animate={animate} /></p>
      {periodLabel && <p className={`mt-1 text-[0.75rem] ${muted(dark)}`}>{periodLabel}</p>}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.75rem] font-medium ${dark ? "bg-white/10" : "bg-black/[0.06]"}`}>
          <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
          <TrendUp className="size-3" />
          {deltaLabel}
        </span>
        {demo && <DemoNote on={dark ? "dark" : "light"} />}
      </div>
    </Card>
  );
}
