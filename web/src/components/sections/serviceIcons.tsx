/** Іконки послуг (лінійні, товщина 1.75), у порядку services з content/site.ts. */
const p = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.75, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export const serviceIcons = [
  // ФОП — людина
  <svg key="fop" {...p}><circle cx="12" cy="8" r="3.5" /><path d="M5 20c1.2-3.6 3.8-5.5 7-5.5s5.8 1.9 7 5.5" /></svg>,
  // ТОВ — будівля
  <svg key="tov" {...p}><path d="M4 20V6l8-3 8 3v14" /><path d="M9 20v-4h6v4M8 9h.01M12 9h.01M16 9h.01M8 13h.01M12 13h.01M16 13h.01" /></svg>,
  // Зарплата — люди
  <svg key="pay" {...p}><circle cx="9" cy="8" r="3" /><path d="M3 19c.9-3 3.1-4.5 6-4.5s5.1 1.5 6 4.5" /><path d="M16 5.5a3 3 0 0 1 0 5M18 14.8c1.4.6 2.4 2 3 4.2" /></svg>,
  // Консультації — повідомлення
  <svg key="tax" {...p}><path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.2A8 8 0 1 1 20 12z" /><path d="M9 11h6M9 14h4" /></svg>,
  // Відновлення — оновлення
  <svg key="fix" {...p}><path d="M20 11a8 8 0 0 0-14.6-4.5M4 4v4h4" /><path d="M4 13a8 8 0 0 0 14.6 4.5M20 20v-4h-4" /></svg>,
  // Реєстрація — документ із плюсом
  <svg key="reg" {...p}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5M12 11v6M9 14h6" /></svg>,
];
