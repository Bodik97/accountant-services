/**
 * Контракт для агента «3D» (components/three/).
 *
 * - Усі сцени вантажаться через next/dynamic({ ssr: false }) з клієнтського компонента-обгортки,
 *   ПІСЛЯ першого відмалювання тексту (LCP — заголовок, не canvas).
 * - html[data-mode="lite"] (reduced motion, Save-Data, слабкий пристрій, без WebGL) — сцена НЕ монтується,
 *   показується статичний fallback (SVG/CSS-форма того ж силуету).
 * - quality="low" на телефоні: DPR ≤ 1.5, менше сегментів, без transmission.
 * - progress (0..1) — для «Хто ми» (розкриття стосу) і pin-секції «Фінанси» (зміна форми скла):
 *   ScrollTrigger пише значення в ref, сцена читає його в useFrame (без ре-рендерів React).
 * - Після першого кадру кожного canvas: window "scene3d:ready" (для ScrollTrigger.refresh()).
 */
import type { RefObject } from "react";

export type SceneVariant = "hero-bars" | "plates" | "glass";
export type Quality = "high" | "low";

export interface SceneProps {
  variant: SceneVariant;
  quality?: Quality;
  progress?: RefObject<number>;
  className?: string;
  /** Підпис для fallback-зображення (alt) */
  label: string;
  /** Лише "glass": колір фону секції, який заломлюється у склі (за замовчуванням #f4f4f4) */
  background?: string;
}

/** Пропси, які Scene3D передає кожній сцені. */
export interface VariantProps {
  quality?: Quality;
  /** false — сцена поза екраном, рендер на паузі */
  active?: boolean;
  progress?: RefObject<number>;
  background?: string;
}
