import Card from "@/components/ui/Card";
import Counter from "@/components/charts/Counter";
import DemoNote from "./DemoNote";
import { Contactless } from "./icons";
import { rootClass } from "./utils";
import type { AccountCardProps } from "./types";

/**
 * Чорна «преміум-картка» рахунку ФОП. Пропорції банківської картки (1.586:1).
 * Нахил задає сторінка через className (напр. rotate-[-6deg]) або GSAP tilt за data-widget.
 * Завжди темна: variant приймає лише "dark" | "glass-dark" (інші трактуються як "dark").
 */
export default function AccountCard({ owner, ibanMasked, balance, label = "Рахунок ФОП", variant = "dark", demo = true, animate = false, className = "" }: AccountCardProps) {
  const v = variant === "glass-dark" ? "glass-dark" : "dark";
  return (
    <Card
      variant={v}
      radius="lg"
      className={`relative isolate flex aspect-[1.586/1] flex-col justify-between overflow-hidden p-5 shadow-[var(--shadow-float)] ${rootClass("w-[20rem]", className)}`}
      data-widget
    >
      {/* Тонкий монохромний відблиск */}
      <span className="pointer-events-none absolute -right-16 -top-20 -z-10 size-56 rounded-full bg-[radial-gradient(closest-side,rgb(255_255_255/0.14),transparent)]" aria-hidden="true" />
      <span className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgb(255_255_255/0.06),transparent_45%)]" aria-hidden="true" />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[0.8125rem] text-gray-mid">{label}</p>
          <p className="mt-0.5 truncate text-[0.9375rem] font-medium">{owner}</p>
        </div>
        <Contactless className="size-5 shrink-0 text-gray-light" />
      </div>

      <div className="flex items-center gap-3" aria-hidden="true">
        <span className="h-7 w-9 shrink-0 rounded-md bg-[linear-gradient(135deg,#d9d9d9,#8a8a8a)] opacity-90" />
      </div>

      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[0.75rem] tracking-[0.12em] text-gray-light">
            <span className="sr-only">IBAN: </span>
            {ibanMasked}
          </p>
          <p className="metric mt-1.5 truncate text-[1.5rem]">
            <span className="sr-only">Баланс: </span>
            <Counter value={balance} format="uah" animate={animate} />
          </p>
        </div>
        {demo && <span className="shrink-0"><DemoNote on="dark" /></span>}
      </div>
    </Card>
  );
}
