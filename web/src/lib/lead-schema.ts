import { z } from "zod";

export const contactMethods = ["Дзвінок", "Telegram", "Viber"] as const;

/**
 * Правила полів — спільні для клієнта (підказки під полями) і сервера (zod нижче).
 * Ім'я: 2–60 символів, літери (зокрема українські), пробіл, апостроф, дефіс; без цифр і символів.
 * Телефон: український номер, 9 цифр після +380 (на сервері приймаємо також 0XXXXXXXXX).
 */
export const NAME_MIN = 2;
export const NAME_MAX = 60;
const NAME_RE = /^\p{L}+(?:[ '’ʼ-]+\p{L}+)*$/u;

export const leadErrors = {
  nameEmpty: "Вкажіть ваше ім'я",
  nameShort: `Ім'я — щонайменше ${NAME_MIN} літери`,
  nameLong: `Ім'я — не довше ${NAME_MAX} символів`,
  nameChars: "Лише літери, пробіл, апостроф або дефіс",
  phoneEmpty: "Вкажіть номер телефону",
  phoneShort: "Номер неповний: потрібно 9 цифр після +380",
} as const;

/** Прибирає зайві пробіли. */
export const normalizeName = (v: string) => v.trim().replace(/\s+/g, " ");

/** Текст помилки для імені або null, якщо ім'я коректне. */
export function nameError(raw: string): string | null {
  const v = normalizeName(raw);
  if (!v) return leadErrors.nameEmpty;
  if (v.length < NAME_MIN) return leadErrors.nameShort;
  if (v.length > NAME_MAX) return leadErrors.nameLong;
  if (!NAME_RE.test(v)) return leadErrors.nameChars;
  return null;
}

/** Цифри національного номера (до 9) з будь-якого введення: «+38 067…», «067…», «67…». */
export function phoneDigits(raw: string): string {
  let d = raw.replace(/\D/g, "");
  // Код оператора в Україні ніколи не починається з «38», тож «380…» — завжди префікс країни (навіть під час набору)
  if (d.startsWith("380")) d = d.slice(3);
  d = d.replace(/^0+/, "");
  return d.slice(0, 9);
}

/** Маска XX XXX XX XX */
export function formatPhone(digits: string): string {
  const parts = [digits.slice(0, 2), digits.slice(2, 5), digits.slice(5, 7), digits.slice(7, 9)];
  return parts.filter(Boolean).join(" ");
}

/** Текст помилки для 9 цифр номера або null. */
export function phoneError(digits: string): string | null {
  if (!digits) return leadErrors.phoneEmpty;
  if (digits.length < 9) return leadErrors.phoneShort;
  return null;
}

export const leadSchema = z.object({
  name: z.string().transform(normalizeName).superRefine((v, ctx) => {
    const e = nameError(v);
    if (e) ctx.addIssue({ code: "custom", message: e });
  }),
  phone: z
    .string()
    .transform((v) => v.replace(/\D/g, ""))
    .superRefine((d, ctx) => {
      if (!d) ctx.addIssue({ code: "custom", message: leadErrors.phoneEmpty });
      else if (!/^(380(?!38)[1-9]\d{8}|0[1-9]\d{8})$/.test(d)) ctx.addIssue({ code: "custom", message: leadErrors.phoneShort });
    }),
  method: z.enum(contactMethods).default("Дзвінок"),
  plan: z.string().max(60).optional().default(""),
  // Захист від ботів: приховане поле має бути порожнім; ts — час відкриття форми (обов'язковий)
  hp_extra: z.string().max(0).optional(),
  ts: z.coerce.number().int().positive(),
});

export type Lead = z.infer<typeof leadSchema>;

export type LeadState =
  | { status: "idle" }
  | { status: "success" }
  | {
      status: "error";
      message?: string;
      fieldErrors?: Partial<Record<"name" | "phone", string[]>>;
      /** Введені значення, щоб поля не очищались після помилки */
      values?: { name: string; phone: string; method: string };
    };
