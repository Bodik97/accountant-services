"use server";

import { z } from "zod";
import { leadSchema, type LeadState } from "@/lib/lead-schema";
import { sendLead } from "@/lib/telegram";

export async function submitLead(_prev: LeadState, formData: FormData): Promise<LeadState> {
  const raw = Object.fromEntries(formData);
  const values = { name: String(raw.name ?? ""), phone: String(raw.phone ?? "") };
  const parsed = leadSchema.safeParse(raw);
  if (!parsed.success) {
    const { fieldErrors } = z.flattenError(parsed.error);
    // Заповнене приховане поле = бот: удаємо успіх, нічого не надсилаємо
    if (fieldErrors.website) return { status: "success" };
    return { status: "error", values, fieldErrors: { name: fieldErrors.name, phone: fieldErrors.phone } };
  }
  if (parsed.data.ts && Date.now() - parsed.data.ts < 3000) return { status: "success" };

  const ok = await sendLead(parsed.data);
  return ok
    ? { status: "success" }
    : { status: "error", values, message: "Не вдалося надіслати заявку. Подзвоніть нам або напишіть у Telegram." };
}
