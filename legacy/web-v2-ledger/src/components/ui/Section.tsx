import type { ReactNode } from "react";

/**
 * Секція у стилі облікової книги: зліва «поля» з номером розділу (закріплені при прокрутці)
 * і латунна вертикальна лінія полів, зверху — горизонтальна лінія, що прокреслюється (GSAP).
 */
export default function Section({
  id,
  index,
  label,
  tone = "ink",
  children,
}: {
  id: string;
  index: string;
  label: string;
  tone?: "ink" | "paper";
  children: ReactNode;
}) {
  const paper = tone === "paper";
  return (
    <section id={id} data-section className={`relative ${paper ? "on-paper bg-paper text-paper-ink" : ""}`}>
      <div className="container-x">
        <span data-rule className={`block h-px w-full origin-left ${paper ? "bg-paper-line" : "bg-line"}`} aria-hidden="true" />
        <div className="section-y grid gap-x-8 gap-y-10 lg:grid-cols-12">
          <aside className="relative lg:col-span-2">
            <p className="caption flex items-baseline gap-3 uppercase tracking-[0.14em] lg:sticky lg:top-28">
              <span className={`tabular-nums ${paper ? "text-brass-deep" : "text-brass"}`}>{index}</span>
              <span className={paper ? "text-paper-dim" : "text-bone-dim"}>{label}</span>
            </p>
            {/* Лінія полів: росте разом із прокруткою секції */}
            <span
              data-margin-line
              className={`absolute -right-4 top-0 hidden h-full w-px origin-top lg:block ${paper ? "bg-brass-deep/40" : "bg-brass/40"}`}
              aria-hidden="true"
            />
          </aside>
          <div className="min-w-0 lg:col-span-10">{children}</div>
        </div>
      </div>
    </section>
  );
}
