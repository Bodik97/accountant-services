import { z } from "zod";
import { plans, services } from "@/content/site";
import { contactMethods, nameError, normalizeName, phoneDigits, phoneError } from "./lead-schema";

// Пакет у заявці — лише з переліку на сайті (тарифи і послуги), щоб у Telegram не потрапляв довільний текст
const allowedPlans = new Set<string>(["", ...plans.map((p) => p.name), ...services.map((s) => s.title)]);

// Серверна валідація заявки. Окремий файл, щоб zod не потрапляв у клієнтський бандл форми.
export const leadSchema = z.object({
  name: z.string().max(200).transform(normalizeName).superRefine((v, ctx) => {
    const e = nameError(v);
    if (e) ctx.addIssue({ code: "custom", message: e });
  }),
  // Ті самі правила, що й на клієнті: +380 / 0 / 9 цифр → 9 цифр національного номера з дійсним кодом
  phone: z
    .string()
    .max(30)
    .transform((v) => phoneDigits(v))
    .superRefine((d, ctx) => {
      const e = phoneError(d);
      if (e) ctx.addIssue({ code: "custom", message: e });
    })
    .transform((d) => `380${d}`),
  method: z.enum(contactMethods).default("Дзвінок"),
  plan: z
    .string()
    .optional()
    .default("")
    .refine((v) => allowedPlans.has(v)),
  // Захист від ботів: приховане поле має бути порожнім; ts — час відкриття форми (обов'язковий)
  hp_extra: z.string().max(0).optional(),
  ts: z.coerce.number().int().positive(),
});

export type Lead = z.infer<typeof leadSchema>;
