import type { ElementType, HTMLAttributes, ReactNode } from "react";

/**
 * Картка. Варіанти:
 *   light — #F4F4F4, dark — #111 з білим текстом, white — біла з тінню,
 *   glass / glass-dark — напівпрозорість + розмиття + біла обводка 1px.
 * Радіус: md 24px (за замовч.), sm 20px, lg 28px.
 */
export type CardVariant = "light" | "dark" | "white" | "glass" | "glass-dark";

const variants: Record<CardVariant, string> = {
  light: "bg-surface text-black",
  dark: "bg-surface-dark text-white",
  white: "bg-white text-black shadow-[var(--shadow-card)]",
  glass: "glass text-black shadow-[var(--shadow-float)]",
  "glass-dark": "glass-dark text-white shadow-[var(--shadow-float)]",
};
const radii = { sm: "rounded-[var(--radius-card-sm)]", md: "rounded-[var(--radius-card)]", lg: "rounded-[var(--radius-card-lg)]" } as const;

type CardProps = {
  as?: ElementType;
  variant?: CardVariant;
  radius?: keyof typeof radii;
  className?: string;
  children: ReactNode;
} & Omit<HTMLAttributes<HTMLElement>, "className" | "children">;

export default function Card({ as: Tag = "div", variant = "light", radius = "md", className = "", children, ...rest }: CardProps) {
  return (
    <Tag {...rest} className={`${variants[variant]} ${radii[radius]} ${className}`}>
      {children}
    </Tag>
  );
}
