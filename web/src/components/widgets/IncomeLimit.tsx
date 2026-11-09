import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/charts/ProgressBar";
import Counter from "@/components/charts/Counter";
import DemoNote from "./DemoNote";
import { isDark, muted, rootClass } from "./utils";
import type { IncomeLimitProps } from "./types";

const nf = new Intl.NumberFormat("uk-UA");

/** Контроль річного ліміту доходу групи ФОП: скільки використано і скільки лишилось. */
export default function IncomeLimit({ title, used, limit, caption, variant = "white", demo = true, animate = false, className = "" }: IncomeLimitProps) {
  const dark = isDark(variant);
  const share = limit > 0 ? Math.round((used / limit) * 100) : 0;
  return (
    <Card variant={variant} className={`p-5 ${rootClass("w-[17rem]", className)}`} data-widget>
      <div className="flex items-center justify-between gap-3">
        <p className="truncate text-[0.9375rem] font-medium">{title}</p>
        <span className="shrink-0"><Badge tone={share < 80 ? "success" : "neutral"} on={dark ? "dark" : "light"}>{share < 80 ? "У межах" : "Увага"}</Badge></span>
      </div>
      <p className="metric mt-4 text-[1.75rem]"><Counter value={used} format="uah" animate={animate} /></p>
      <p className={`mt-0.5 text-[0.8125rem] ${muted(dark)}`}>з {nf.format(limit)} ₴ на рік</p>
      <ProgressBar className="mt-3" value={used} max={limit} label={caption} valueText={`${share}%`} tone={dark ? "dark" : "light"} animate={animate} ariaLabel={`${title}: використано ${share}% ліміту`} />
      {demo && <p className="mt-3"><DemoNote on={dark ? "dark" : "light"} /></p>}
    </Card>
  );
}
