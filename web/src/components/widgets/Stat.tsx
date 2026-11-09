import Card from "@/components/ui/Card";
import T from "@/components/ui/T";
import DemoNote from "./DemoNote";
import { isDark, muted, rootClass } from "./utils";
import type { StatProps } from "./types";

/** Абстрактні «аватари»: монохромні градієнти + ініціали, без облич. */
const AVATARS = [
  { i: "ОК", bg: "bg-[linear-gradient(135deg,#0a0a0a,#5e5e5e)]", fg: "text-white" },
  { i: "ІМ", bg: "bg-[linear-gradient(135deg,#d9d9d9,#ffffff)]", fg: "text-black" },
  { i: "ВС", bg: "bg-[linear-gradient(135deg,#5e5e5e,#111111)]", fg: "text-white" },
  { i: "ТП", bg: "bg-[linear-gradient(135deg,#8a8a8a,#d9d9d9)]", fg: "text-black" },
  { i: "НД", bg: "bg-[linear-gradient(135deg,#111111,#8a8a8a)]", fg: "text-white" },
] as const;

export default function Stat({ value, label, avatars = 0, variant = "white", demo = true, className = "" }: StatProps) {
  const dark = isDark(variant);
  const ring = dark ? "ring-surface-dark" : variant === "light" ? "ring-surface" : "ring-white";
  const shown = Math.min(Math.max(0, Math.floor(avatars)), AVATARS.length);
  return (
    <Card variant={variant} className={`p-5 ${rootClass("w-[15rem]", className)}`} data-widget>
      {shown > 0 && (
        <div className="mb-4 flex -space-x-2" aria-hidden="true">
          {AVATARS.slice(0, shown).map((a) => (
            <span key={a.i} className={`grid size-8 place-items-center rounded-full text-[0.625rem] font-semibold ring-2 ${ring} ${a.bg} ${a.fg}`}>
              {a.i}
            </span>
          ))}
        </div>
      )}
      <p className="metric text-[2.25rem] break-words"><T>{value}</T></p>
      <p className={`mt-2 text-[0.875rem] leading-snug ${muted(dark)}`}>{label}</p>
      {demo && <p className="mt-3"><DemoNote on={dark ? "dark" : "light"} /></p>}
    </Card>
  );
}
