import type { ReactNode } from "react";
import { Check } from "./icons";

/**
 * Бейдж статусу. success — зелена заливка з чорним текстом і галочкою (колір не єдиний носій сенсу).
 * neutral — сірий; on="dark" — для темних карток.
 */
export default function Badge({ tone = "neutral", on = "light", children }: { tone?: "success" | "neutral"; on?: "light" | "dark"; children: ReactNode }) {
  const cls =
    tone === "success"
      ? "bg-success text-black"
      : on === "dark"
        ? "bg-white/10 text-white"
        : "bg-black/[0.06] text-black";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.75rem] font-medium leading-none ${cls}`}>
      {tone === "success" && <Check className="size-3" />}
      {children}
    </span>
  );
}
