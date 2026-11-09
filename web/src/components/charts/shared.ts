import type { Tone } from "./types";

/**
 * Монохромні токени діаграм (дзеркало src/app/globals.css).
 * light — чорні мітки на світлих картках; dark — білі мітки на #111.
 */
export interface ToneTokens {
  /** Колір міток (лінія, стовпчик, сегмент) */
  mark: string;
  /** Основний текст */
  text: string;
  /** Другорядний текст (підписи) */
  muted: string;
  /** Сітка й трек */
  grid: string;
  /** Непрозорість приглушених стовпчиків */
  dimOpacity: number;
}

export const TONES = {
  light: { mark: "#0a0a0a", text: "#0a0a0a", muted: "#5e5e5e", grid: "rgb(10 10 10 / 0.08)", dimOpacity: 0.18 },
  dark: { mark: "#ffffff", text: "#ffffff", muted: "#8a8a8a", grid: "rgb(255 255 255 / 0.12)", dimOpacity: 0.24 },
} as const satisfies Record<Tone, ToneTokens>;

export type AnimName = "draw" | "area" | "grow-y" | "donut" | "progress" | "dot";

/** data-anim лише коли animate=true — фінальний стан малюється завжди. */
export function anim(animate: boolean, name: AnimName): { "data-anim"?: AnimName } {
  return animate ? { "data-anim": name } : {};
}

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
