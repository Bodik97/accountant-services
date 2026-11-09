// Спільні дані історії «хаос → порядок → папка → захищено» для 3D і 2D (SVG) версій.
// Одиниці — ширина документа (1). Висота документа — 1.414 (A4).

export const DOC_W = 1;
export const DOC_H = 1.414;

export type StoryDoc = { title: string; sub: string; deadline?: string };

// Перші 5 документів відповідають «болям» у блоці «Знайомо?» (той самий порядок)
export const STORY_DOCS: StoryDoc[] = [
  { title: "Декларація ФОП", sub: "Податкова звітність", deadline: "ТЕРМІН 09.02" },
  { title: "Зміни до ПКУ", sub: "Податковий кодекс" },
  { title: "Лист ДПС", sub: "Запит пояснень" },
  { title: "ЄСВ", sub: "Єдиний внесок" },
  { title: "Книга обліку", sub: "Доходи 2026" },
  { title: "Акт робіт", sub: "Первинні документи" },
];

/** Заголовок у два рядки: перше слово + решта (крупний шрифт читається навіть на 375px) */
export function titleLines(title: string): string[] {
  const words = title.split(" ");
  if (words.length < 2 || title.length <= 9) return [title];
  if (words[0].length <= 5) return [words.slice(0, 2).join(" "), words.slice(2).join(" ")].filter(Boolean);
  return [words[0], words.slice(1).join(" ")];
}

export type Pose = { x: number; y: number; r: number };

/** Етап 0: документи лежать невпорядковано — ледь помітний нахил і накладання */
export const CHAOS: Pose[] = [
  { x: -0.95, y: 0.6, r: 0.07 },
  { x: 0.12, y: 0.8, r: -0.05 },
  { x: 1.02, y: 0.48, r: 0.09 },
  { x: -0.85, y: -0.68, r: -0.08 },
  { x: 0.2, y: -0.5, r: 0.04 },
  { x: 1.08, y: -0.8, r: -0.06 },
];

/** Етап 1: рівна сітка 3×2 */
export const GRID: Pose[] = STORY_DOCS.map((_, i) => ({
  x: ((i % 3) - 1) * 1.08,
  y: i < 3 ? 0.78 : -0.78,
  r: 0,
}));

/** Етап 2: документи в кишені папки, над кишенею видно назви — як закладки */
export const FOLDER: Pose[] = STORY_DOCS.map((_, i) => ({ x: 0, y: 0.6 - i * 0.2, r: 0 }));

export const FOLDER_BACK = { w: 1.34, h: 2.42, y: 0.06 };
export const POCKET = { w: 1.34, h: 1.05, y: -0.62 };

/** Розміри вмісту кожного етапу (для вписування в зону) */
export const BOX = [
  { w: 3.3, h: 3.5, cy: 0 },
  { w: 3.25, h: 3.1, cy: 0 },
  { w: 1.5, h: 2.6, cy: 0.08 },
  { w: 1.5, h: 2.6, cy: 0.08 },
] as const;

export const CAPTIONS = [
  "Так виглядає облік без бухгалтера",
  "Кожен документ — на своєму місці",
  "Усе зібрано в одній папці",
  "Відповідальність закріплено договором",
] as const;
