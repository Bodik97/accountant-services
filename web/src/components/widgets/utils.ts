import type { CardVariant } from "@/components/ui/Card";

/** Темна поверхня (білий текст)? */
export const isDark = (variant?: CardVariant) => variant === "dark" || variant === "glass-dark";

/** Другорядний текст: #8A8A8A на темному, #5E5E5E на світлому (обидва AA). */
export const muted = (dark: boolean) => (dark ? "text-gray-mid" : "text-gray-text");

/** Тонка лінія-розділювач. */
export const hairline = (dark: boolean) => (dark ? "border-white/10" : "border-black/[0.08]");

/**
 * Клас кореня віджета: фіксована ширина на десктопі + безпечне стискання (max-w-full, min-w-0).
 * Якщо сторінка передає власну ширину (`w-…` у className без префікса брейкпоінта) — дефолтна не додається,
 * щоб уникнути конфлікту двох width-класів.
 */
export function rootClass(defaultWidth: string, className: string) {
  const ownWidth = /(^|\s)!?w-/.test(className);
  return `${ownWidth ? "" : defaultWidth} min-w-0 max-w-full ${className}`;
}
