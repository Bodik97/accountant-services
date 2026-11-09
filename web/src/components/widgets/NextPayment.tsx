import Card from "@/components/ui/Card";
import Counter from "@/components/charts/Counter";
import DemoNote from "./DemoNote";
import { Calendar } from "./icons";
import { hairline, isDark, muted, rootClass } from "./utils";
import type { NextPaymentProps } from "./types";

export default function NextPayment({ title, date, amount, caption, variant = "white", demo = true, animate = false, className = "" }: NextPaymentProps) {
  const dark = isDark(variant);
  return (
    <Card variant={variant} radius="sm" className={`p-4 ${rootClass("w-[14rem]", className)}`} data-widget>
      <div className="flex items-center gap-2">
        <span className={`grid size-7 shrink-0 place-items-center rounded-full border ${hairline(dark)}`}><Calendar className="size-3.5" /></span>
        <p className={`truncate text-[0.8125rem] ${muted(dark)}`}>Наступний платіж</p>
      </div>
      <p className="mt-2 truncate text-[0.9375rem] font-medium">{title}</p>
      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <span className="metric text-xl">{date}</span>
        {amount !== undefined && <span className="text-[0.875rem]"><Counter value={amount} format="uah" animate={animate} /></span>}
      </div>
      {caption && (
        <p className="mt-2 flex items-center gap-1.5 text-[0.75rem]">
          <span className="size-1.5 shrink-0 rounded-full bg-success" aria-hidden="true" />
          <span className={muted(dark)}>{caption}</span>
        </p>
      )}
      {demo && <p className="mt-2"><DemoNote on={dark ? "dark" : "light"} /></p>}
    </Card>
  );
}
