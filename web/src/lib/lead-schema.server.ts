import { z } from "zod";
import { contactMethods, leadErrors, nameError, normalizeName } from "./lead-schema";

// Серверна валідація заявки. Окремий файл, щоб zod не потрапляв у клієнтський бандл форми.
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
