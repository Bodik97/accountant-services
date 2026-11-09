import Card from "@/components/ui/Card";
import { Check } from "@/components/ui/icons";
import DemoNote from "./DemoNote";
import { Calendar } from "./icons";
import { hairline, isDark, muted, rootClass } from "./utils";
import type { PaymentsCalendarProps } from "./types";

const nf = new Intl.NumberFormat("uk-UA");

/** Календар платежів: що, до якої дати і скільки; сплачене позначене галочкою. */
export default function PaymentsCalendar({ title, items, variant = "white", demo = true, className = "" }: PaymentsCalendarProps) {
  const dark = isDark(variant);
  return (
    <Card variant={variant} className={`p-5 ${rootClass("w-[17rem]", className)}`} data-widget>
      <div className="flex items-center gap-2">
        <Calendar className="size-4 shrink-0" />
        <p className="truncate text-[0.9375rem] font-medium">{title}</p>
      </div>
      <ul className={`mt-3 divide-y ${dark ? "divide-white/10" : "divide-black/[0.06]"}`}>
        {items.map((it) => (
          <li key={it.label} className="flex items-center gap-3 py-2">
            <span
              className={`grid size-6 shrink-0 place-items-center rounded-full ${it.paid ? "bg-success text-black" : `border ${hairline(dark)}`}`}
              aria-label={it.paid ? "Сплачено" : "Очікує оплати"}
            >
              {it.paid && <Check className="size-3" />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[0.875rem] font-medium">{it.label}</p>
              <p className={`text-[0.75rem] ${muted(dark)}`}>{it.paid ? "сплачено" : `до ${it.date}`}</p>
            </div>
            <span className="shrink-0 text-[0.875rem] tabular-nums">{nf.format(it.amount)} ₴</span>
          </li>
        ))}
      </ul>
      {demo && <p className="mt-2"><DemoNote on={dark ? "dark" : "light"} /></p>}
    </Card>
  );
}
