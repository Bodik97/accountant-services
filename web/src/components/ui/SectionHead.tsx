import type { ReactNode } from "react";

/** Заголовок секції: короткий підпис, великий H2 (SplitText у хвилі 2), вступ. */
export default function SectionHead({ label, title, intro, on = "light", align = "left", className = "" }: {
  label: string;
  title: ReactNode;
  intro?: ReactNode;
  on?: "light" | "dark";
  align?: "left" | "center";
  className?: string;
}) {
  const muted = on === "dark" ? "text-gray-mid" : "text-gray-text";
  return (
    <header data-parallax="0.3" className={`${align === "center" ? "mx-auto text-center" : ""} max-w-3xl ${className}`}>
      <p className={`flex items-center gap-2 text-[0.9375rem] font-medium ${align === "center" ? "justify-center" : ""} ${muted}`}>
        <span className={`size-1.5 rounded-full ${on === "dark" ? "bg-white" : "bg-black"}`} aria-hidden="true" />
        {label}
      </p>
      <h2 data-split className="mt-4">{title}</h2>
      {intro && <p className={`mt-5 max-w-[56ch] text-[length:var(--text-lead)] ${align === "center" ? "mx-auto" : ""} ${muted}`} data-reveal>{intro}</p>}
    </header>
  );
}
