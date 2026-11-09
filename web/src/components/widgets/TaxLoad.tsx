import Card from "@/components/ui/Card";
import ProgressBar from "@/components/charts/ProgressBar";
import Counter from "@/components/charts/Counter";
import DemoNote from "./DemoNote";
import { isDark, muted, rootClass } from "./utils";
import type { TaxLoadProps } from "./types";

const nf = new Intl.NumberFormat("uk-UA", { maximumFractionDigits: 1 });

export default function TaxLoad({ title, percent, caption, variant = "light", demo = true, animate = false, className = "" }: TaxLoadProps) {
  const dark = isDark(variant);
  const value = Math.min(Math.max(percent, 0), 100);
  return (
    <Card variant={variant} radius="sm" className={`p-4 ${rootClass("w-[15rem]", className)}`} data-widget>
      <p className={`truncate text-[0.8125rem] ${muted(dark)}`}>{title}</p>
      <p className="metric mt-2 text-[2rem]">
        {/* Counter рахує лише цілі; дробові значення показуємо статично */}
        {Number.isInteger(value) ? <Counter value={value} format="int" animate={animate} /> : nf.format(value)}
        <span className={`ml-0.5 text-[1.25rem] ${muted(dark)}`}>%</span>
      </p>
      <ProgressBar className="mt-3" value={value} max={100} label={caption} valueText={`${nf.format(value)}%`} tone={dark ? "dark" : "light"} animate={animate} ariaLabel={`${title}: ${nf.format(value)}% від доходу`} />
      {demo && <p className="mt-3"><DemoNote on={dark ? "dark" : "light"} /></p>}
    </Card>
  );
}
