export const contactMethods = ["Дзвінок", "Telegram", "Viber"] as const;

/**
 * Правила полів — спільні для клієнта (підказки під полями) і сервера (zod — у lead-schema.server.ts,
 * окремо, щоб zod не потрапляв у клієнтський бандл).
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
  phoneCode: "Перевірте код оператора: такого в Україні немає",
} as const;

/** Прибирає зайві пробіли. */
export const normalizeName = (v: string) => v.normalize("NFC").trim().replace(/\s+/g, " ");

/**
 * Правило вводу імені (під час набору): лише літери, пробіл, апостроф, дефіс; без подвійних розділювачів,
 * без розділювача на початку; не довше NAME_MAX. Цифри й символи просто не друкуються.
 */
export function sanitizeNameInput(v: string): string {
  return v
    .normalize("NFC")
    .replace(/[^\p{L} '’ʼ-]/gu, "")
    .replace(/([ '’ʼ-])[ '’ʼ-]+/g, "$1")
    .replace(/^[ '’ʼ-]+/, "")
    .slice(0, NAME_MAX);
}

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

// Коди після +380: мобільні (39, 50, 63, 66–68, 73, 77, 89, 91–99) і стаціонарні областей (31–38, 41–48, 51–57, 61–69)
const UA_CODE_RE = /^(3[1-9]|4[1-8]|5[0-7]|6[1-9]|7[37]|89|9[1-9])/;

/** Текст помилки для 9 цифр номера або null. */
export function phoneError(digits: string): string | null {
  if (!digits) return leadErrors.phoneEmpty;
  if (digits.length < 9) return leadErrors.phoneShort;
  if (!UA_CODE_RE.test(digits)) return leadErrors.phoneCode;
  return null;
}

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
