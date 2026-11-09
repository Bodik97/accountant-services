# charts/

Монохромні діаграми на чистому SVG/HTML, server-component сумісні. Контракт — `types.ts`.
Загальні props: `ariaLabel` (обов'язково, має містити ключові числа), `tone` (`"light"` | `"dark"`), `animate` (лише додає `data-anim`), `className`.
Фінальний стан малюється завжди; кольори — `TONES` у `shared.ts`.

| Компонент | Props | data-anim |
|---|---|---|
| `AreaChart` | `data`, `highlightIndex?` (default: остання), `height?` = 72, `grid?` = true | `draw` (лінія), `area` (заливка), `dot` (HTML-точка) |
| `BarChart` | `data: {label, value}[]`, `highlightIndex?` (default: останній), `height?` = 96, `valueLabel?` | `grow-y` на кожному стовпчику (origin bottom) |
| `DonutChart` | `segments: {label, value}[]` (≤ 4), `centerLabel?`, `size?` = 160 | `donut` на кожному сегменті |
| `ProgressBar` | `value`, `max`, `label`, `valueText?` | `progress` на заповненні (origin left) |
| `Counter` | `value`, `format?` (`uah` / `int` / `percent`) | `data-counter data-to data-format` |

```tsx
<AreaChart data={[8, 12, 10, 15, 14, 19]} tone="dark" animate ariaLabel="Виручка за 6 міс.: від 8 до 19 тис. ₴" />
<BarChart data={[{ label: "Січ", value: 8 }, { label: "Лют", value: 12 }]} valueLabel="12 тис. ₴" ariaLabel="Січень 8, лютий 12 тис. ₴" />
<DonutChart segments={[{ label: "ЄП", value: 60 }, { label: "ЄСВ", value: 40 }]} centerLabel="12 400 ₴" ariaLabel="Податки: ЄП 60%, ЄСВ 40%" />
<ProgressBar value={12} max={12} label="Звітів подано" ariaLabel="Звітів подано: 12 з 12" />
<Counter value={12400} format="uah" animate />
```

Легенда для `DonutChart` — у віджеті: квадратик `background: TONES[tone].mark; opacity: donutOpacity(i)` (`DONUT_OPACITIES = [1, .55, .3, .15]`) + назва + значення текстом.

Анімація лінії: у `draw` стоїть `vector-effect: non-scaling-stroke`, тож використовуйте DrawSVGPlugin (він це враховує) або clip-reveal, а не ручний `getTotalLength()`.
