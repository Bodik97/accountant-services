import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/charts/ProgressBar";
import DemoNote from "./DemoNote";
import { Document } from "./icons";
import { isDark, muted, rootClass } from "./utils";
import type { ReportsProgressProps } from "./types";

export default function ReportsProgress({ done, total, label, title = "Звітність", statusLabel, variant = "white", demo = true, animate = false, className = "" }: ReportsProgressProps) {
  const dark = isDark(variant);
  const complete = done >= total;
  const status = statusLabel ?? (complete ? "Усе вчасно" : "В роботі");
  return (
    <Card variant={variant} className={`p-5 ${rootClass("w-[17rem]", className)}`} data-widget>
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <Document className="size-4 shrink-0" />
          <p className="truncate text-[0.9375rem] font-medium">{title}</p>
        </div>
        <span className="shrink-0"><Badge tone={complete ? "success" : "neutral"} on={dark ? "dark" : "light"}>{status}</Badge></span>
      </div>
      <p className="metric mt-4 text-[2rem]">
        {done}
        <span className={muted(dark)}>/{total}</span>
      </p>
      <ProgressBar className="mt-3" value={done} max={total} label={label} valueText={`${total > 0 ? Math.round((Math.min(done, total) / total) * 100) : 0}%`} tone={dark ? "dark" : "light"} animate={animate} ariaLabel={`${label}: ${done} з ${total}`} />
      {demo && <p className="mt-3"><DemoNote on={dark ? "dark" : "light"} /></p>}
    </Card>
  );
}
