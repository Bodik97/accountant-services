"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { type LeadState } from "@/lib/lead-schema";
import { leadSchema } from "@/lib/lead-schema.server";
import { sendLead } from "@/lib/telegram";

const SEND_FAILED = "Не вдалося надіслати заявку. Подзвоніть або напишіть у Telegram.";
const TOO_FAST = "Заявку не відправлено — спробуйте ще раз за кілька секунд.";

// Просте обмеження частоти: не більше 5 заявок з однієї IP за 10 хвилин.
// Працює в межах одного процесу сервера; для кількох інстансів потрібне спільне сховище (напр. Redis).
// IP береться з x-forwarded-for — на хостингу (Vercel тощо) цей заголовок виставляє проксі.
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 5;
const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  // Прибираємо протухлі записи, щоб Map не росла безмежно
  if (hits.size > 1000) for (const [k, v] of hits) if (now - v[v.length - 1] > WINDOW_MS) hits.delete(k);
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > LIMIT;
}

export async function submitLead(_prev: LeadState, formData: FormData): Promise<LeadState> {
  const raw = Object.fromEntries(formData);
  const values = { name: String(raw.name ?? ""), phone: String(raw.phone ?? ""), method: String(raw.method ?? "") };
  const parsed = leadSchema.safeParse(raw);
  if (!parsed.success) {
    const { fieldErrors } = z.flattenError(parsed.error);
    // Заповнене приховане поле = бот: удаємо успіх, нічого не надсилаємо
    if (fieldErrors.hp_extra) return { status: "success" };
    // Немає позначки часу (наприклад, форму надіслали до завантаження скриптів) — просимо повторити
    if (!fieldErrors.name && !fieldErrors.phone) return { status: "error", values, message: TOO_FAST };
    return { status: "error", values, fieldErrors: { name: fieldErrors.name, phone: fieldErrors.phone } };
  }
  // Занадто швидка відправка (< 1 с від відкриття форми) — швидше за все бот. Людині показуємо помилку, а не фальшивий успіх.
  // Час «з майбутнього» (підроблене поле ts) дає від'ємну різницю і теж відсікається.
  if (Date.now() - parsed.data.ts < 1000) return { status: "error", values, message: TOO_FAST };

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  if (rateLimited(ip)) return { status: "error", values, message: SEND_FAILED };

  const ok = await sendLead(parsed.data);
  return ok ? { status: "success" } : { status: "error", values, message: SEND_FAILED };
}
