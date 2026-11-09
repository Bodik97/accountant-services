/**
 * Контракт для агента «Віджети» (components/widgets/).
 *
 * Віджет — картка-фрагмент «фінансового застосунку» на базі ui/Card + charts/*.
 * Усі цифри у віджетах — ДЕМО-дані. Кожен віджет із цифрами показує підпис «Приклад інтерфейсу»
 * (проп demo, за замовч. true). Реальні показники компанії — лише через [ДАНІ] з content/site.ts.
 * Віджет приймає дані через props, нічого не імпортує з content/ сам.
 * Атрибут data-widget на корені — для GSAP (поява blur → sharp, parallax, tilt).
 */
import type { CardVariant } from "@/components/ui/Card";

export interface WidgetBase {
  variant?: CardVariant;
  demo?: boolean;
  animate?: boolean;
  className?: string;
}

export interface TaxesPaidProps extends WidgetBase {
  items: readonly { label: string; amount: number }[];
  statusLabel: string;
  /** Заголовок (за замовч. «Податки сплачено») */
  title?: string;
  /** Підпис періоду, напр. «III квартал 2026» */
  periodLabel?: string;
}

export interface IncomeProps extends WidgetBase {
  title: string;
  data: readonly number[];
  growthPercent: number;
  periodLabel: string;
}

export interface ToastProps extends WidgetBase {
  title: string;
  time: string;
}

export interface NextPaymentProps extends WidgetBase {
  title: string;
  date: string;
  amount?: number;
  /** Додатковий підпис, напр. «через 5 днів» */
  caption?: string;
}

export interface StatProps extends WidgetBase {
  /** Значення може бути заглушкою «[ДАНІ]» */
  value: string;
  label: string;
  avatars?: number;
}

export interface ReportsProgressProps extends WidgetBase {
  done: number;
  total: number;
  label: string;
  /** Заголовок картки (за замовч. «Звітність») */
  title?: string;
  /** Текст бейджа; за замовч. «Усе вчасно» (done ≥ total) або «В роботі» */
  statusLabel?: string;
}

export interface QuarterTaxesProps extends WidgetBase {
  title: string;
  quarters: readonly { label: string; value: number }[];
}

export interface ReceiptsCounterProps extends WidgetBase {
  title: string;
  count: number;
  deltaLabel: string;
  /** Підпис періоду, напр. «за жовтень» */
  periodLabel?: string;
}

export interface PaymentsSplitProps extends WidgetBase {
  title: string;
  segments: readonly { label: string; value: number }[];
}

export interface AccountCardProps extends WidgetBase {
  owner: string;
  ibanMasked: string;
  balance: number;
  /** Підпис картки (за замовч. «Рахунок ФОП») */
  label?: string;
}

export interface MonthIncomeProps extends WidgetBase {
  title: string;
  amount: number;
  /** Точки спарклайна (напр. дохід по днях/тижнях) */
  data: readonly number[];
  /** Зміна до попереднього місяця, % */
  deltaPercent?: number;
  periodLabel?: string;
}

export interface TaxLoadProps extends WidgetBase {
  title: string;
  /** Частка податків від доходу, % (0–100) */
  percent: number;
  /** Підпис під прогресом, напр. «ЄП 5% + ЄСВ» */
  caption: string;
}

export interface IncomeLimitProps extends WidgetBase {
  title: string;
  /** Дохід з початку року, ₴ */
  used: number;
  /** Річний ліміт групи, ₴ */
  limit: number;
  caption: string;
}

export interface PaymentsCalendarProps extends WidgetBase {
  title: string;
  items: readonly { label: string; date: string; amount: number; paid?: boolean }[];
}
