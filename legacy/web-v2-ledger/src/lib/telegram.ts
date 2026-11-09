import type { Lead } from "./lead-schema";

const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * Надсилає заявку в Telegram. Потрібні змінні середовища TELEGRAM_BOT_TOKEN і TELEGRAM_CHAT_ID.
 * Без них заявка лише пишеться в лог сервера (зручно для розробки).
 * Повертає false, якщо Telegram відповів помилкою.
 */
export async function sendLead(lead: Lead): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const text = [
    "<b>Нова заявка з сайту</b>",
    `Ім'я: ${escape(lead.name)}`,
    `Телефон: +${lead.phone.startsWith("380") ? lead.phone : "38" + lead.phone}`,
    `Зв'язок: ${lead.method}`,
    lead.plan ? `Пакет: ${escape(lead.plan)}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  if (!token || !chatId) {
    console.warn("[lead] TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID не задані. Заявка:\n" + text);
    return true;
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
  });
  if (!res.ok) console.error("[lead] Telegram error", res.status, await res.text());
  return res.ok;
}
