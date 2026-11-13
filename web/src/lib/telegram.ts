import type { Lead } from "./lead-schema.server";

const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * Надсилає заявку в Telegram. Потрібні змінні середовища TELEGRAM_BOT_TOKEN і TELEGRAM_CHAT_ID.
 * Без них у розробці заявка лише пишеться в лог; у продакшені це помилка (заявка не має губитися мовчки).
 * Повертає false, якщо надіслати не вдалося (немає налаштувань, мережа, відповідь Telegram).
 */
export async function sendLead(lead: Lead): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const text = [
    "<b>Нова заявка з сайту</b>",
    `Ім'я: ${escape(lead.name)}`,
    `Телефон: +${lead.phone}`,
    `Зв'язок: ${lead.method}`,
    lead.plan ? `Пакет: ${escape(lead.plan)}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  if (!token || !chatId) {
    if (process.env.NODE_ENV === "production") {
      console.error("[lead] TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID не задані — заявку не доставлено");
      return false;
    }
    console.warn("[lead] (dev) Telegram не налаштовано. Заявка:\n" + text);
    return true;
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error("[lead] Telegram error", res.status, await res.text());
    return res.ok;
  } catch (e) {
    console.error("[lead] Telegram недоступний", e);
    return false;
  }
}
