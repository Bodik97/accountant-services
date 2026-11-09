import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowRight } from "./icons";

/**
 * Кнопка-pill. variant: primary (суцільна) | outline (контур).
 * surface — фон, на якому стоїть кнопка: на чорному primary стає білою, щоб лишатись головною дією.
 * arrow — кругла іконка-стрілка праворуч (зміщується при наведенні).
 * З href рендериться як <a>, без href — як <button>.
 */
type Common = {
  variant?: "primary" | "outline";
  surface?: "light" | "dark";
  arrow?: boolean;
  size?: "md" | "sm";
  className?: string;
  children: ReactNode;
};
type AsLink = Common & { href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children">;
type AsButton = Common & { href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

const styles = {
  primary: {
    light: "bg-black text-white hover:bg-[#262626]",
    dark: "bg-white text-black hover:bg-gray-light",
  },
  outline: {
    light: "border border-black/25 text-black hover:border-black",
    dark: "border border-white/35 text-white hover:border-white",
  },
} as const;

export default function Button(props: AsLink | AsButton) {
  const { variant = "primary", surface = "light", arrow = false, size = "md", className = "", children, ...rest } = props;
  const sizing = size === "sm" ? "min-h-11 px-5 text-[0.9375rem]" : "min-h-12 px-6 text-base md:min-h-14 md:px-7";
  const cls = `group inline-flex items-center justify-center gap-3 rounded-full font-medium whitespace-nowrap transition-[background-color,border-color,color,transform] duration-200 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 ${sizing} ${arrow ? "pr-2 md:pr-2" : ""} ${styles[variant][surface]} ${className}`;
  const inner = (
    <>
      <span>{children}</span>
      {arrow && (
        <span
          className={`grid size-8 place-items-center rounded-full transition-transform duration-200 group-hover:translate-x-0.5 md:size-10 ${
            variant === "primary" ? (surface === "dark" ? "bg-black text-white" : "bg-white text-black") : surface === "dark" ? "bg-white text-black" : "bg-black text-white"
          }`}
        >
          <ArrowRight />
        </span>
      )}
    </>
  );
  if ("href" in rest && rest.href !== undefined) {
    return <a {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)} className={cls}>{inner}</a>;
  }
  return <button type="button" {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)} className={cls}>{inner}</button>;
}
