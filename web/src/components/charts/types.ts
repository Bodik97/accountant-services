/**
 * Контракт для агента «Діаграми» (components/charts/).
 *
 * Правила:
 * - Чистий SVG, без сторонніх chart-бібліотек. Монохром: білі лінії на темному (tone="dark"), чорні на світлому.
 * - Компонент завжди малює ФІНАЛЬНИЙ стан (працює без JS і з reduced motion).
 * - animate=true лише додає data-атрибути, за якими GSAP-агент анімує з нуля:
 *     data-anim="draw"     — <path>/<polyline> лінії (stroke-dashoffset / DrawSVG)
 *     data-anim="area"     — заливка під лінією (opacity / clip)
 *     data-anim="grow-y"   — стовпчик (scaleY від низу), transform-origin задає компонент
 *     data-anim="donut"    — сегмент кільця (DrawSVG)
 *     data-anim="progress" — заповнення прогрес-бару (scaleX від лівого краю)
 *     data-anim="dot"      — точка на лінії (з'являється наприкінці)
 *   Counter: <span data-counter data-to={value} data-format={format}> зі ФІНАЛЬНИМ текстом усередині.
 * - Доступність: <svg role="img" aria-label={ariaLabel}>; числа, важливі для розуміння, дублюються текстом поза SVG.
 */
export type Tone = "light" | "dark";

export interface ChartBaseProps {
  ariaLabel: string;
  tone?: Tone;
  animate?: boolean;
  className?: string;
}

export interface AreaChartProps extends ChartBaseProps {
  data: readonly number[];
  /** Індекс точки, яку підсвітити (за замовч. остання) */
  highlightIndex?: number;
  /** Висота в px; ширина — 100% контейнера (viewBox + preserveAspectRatio="none" для області) */
  height?: number;
}

export interface BarChartProps extends ChartBaseProps {
  data: readonly { label: string; value: number }[];
  /** Індекс стовпчика, виділеного суцільною заливкою (інші — приглушені) */
  highlightIndex?: number;
  height?: number;
}

export interface DonutChartProps extends ChartBaseProps {
  segments: readonly { label: string; value: number }[];
  /** Текст у центрі кільця, напр. «12 400 ₴» */
  centerLabel?: string;
  size?: number;
}

export interface ProgressBarProps extends ChartBaseProps {
  value: number;
  max: number;
  /** Видимий підпис, напр. «Звітів подано» */
  label: string;
}

export type CounterFormat = "uah" | "int" | "percent";

export interface CounterProps {
  value: number;
  format?: CounterFormat;
  animate?: boolean;
  className?: string;
}
