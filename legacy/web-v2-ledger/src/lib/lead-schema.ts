import { z } from "zod";

export const contactMethods = ["Дзвінок", "Telegram", "Viber"] as const;

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Вкажіть ім'я").max(80),
  phone: z
    .string()
    .transform((v) => v.replace(/\D/g, ""))
    .refine((d) => /^(380\d{9}|0\d{9})$/.test(d), "Вкажіть номер повністю, напр. 067 123 45 67"),
  method: z.enum(contactMethods).default("Дзвінок"),
  plan: z.string().max(40).optional().default(""),
  // Захист від ботів: приховане поле має бути порожнім, а форма — заповнена не швидше ніж за 3 с
  website: z.string().max(0).optional(),
  ts: z.coerce.number().optional(),
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
      values?: { name: string; phone: string };
    };
