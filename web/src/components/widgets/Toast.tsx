import Card from "@/components/ui/Card";
import { Check } from "@/components/ui/icons";
import { isDark, muted, rootClass } from "./utils";
import DemoNote from "./DemoNote";
import type { ToastProps } from "./types";

/** Сповіщення «як у застосунку» — декоративний приклад інтерфейсу (не live-подія, тому без role="status"). */
export default function Toast({ title, time, variant = "glass", demo = true, className = "" }: ToastProps) {
  const dark = isDark(variant);
  return (
    <Card variant={variant} radius="sm" className={`flex items-center gap-3 p-3 pr-4 ${rootClass("w-[18.5rem]", className)}`} data-widget>
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-success text-black">
        <Check className="size-4" />
        <span className="sr-only">Виконано:</span>
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[0.875rem] font-medium" title={title}>{title}</p>
        <p className={`truncate text-[0.75rem] ${muted(dark)}`}>{time}</p>
        {demo && <p className="mt-1"><DemoNote on={dark ? "dark" : "light"} /></p>}
      </div>
    </Card>
  );
}
