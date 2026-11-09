# Віджети «Сальдо»

Картки-фрагменти фінансового застосунку (монохром, акцент лише `#22C55E` для статусу).
Контракт пропсів — `types.ts`. Усі віджети:

- приймають `WidgetBase`: `variant` (`light | dark | white | glass | glass-dark`), `demo` (за замовч. `true`), `animate` (за замовч. `false`), `className`;
- мають `data-widget` на корені (GSAP: blur→sharp, parallax, tilt);
- при `demo` показують підпис «Приклад інтерфейсу»;
- мають фіксовану ширину на десктопі + `max-w-full min-w-0`. Передайте `w-…` у `className`, щоб замінити ширину (дефолтна тоді не додається);
- `animate` прокидується у charts/* та Counter (лише data-атрибути, фінальний стан рендериться завжди).

Імпорт: `import TaxesPaid from "@/components/widgets/TaxesPaid"` або `import { TaxesPaid } from "@/components/widgets"`.

| Віджет | Пропси | Діаграми | Ширина |
|---|---|---|---|
| TaxesPaid | `items[{label,amount}]`, `statusLabel`, `title?`, `periodLabel?` | Counter | 17rem |
| Income | `title`, `data[]`, `growthPercent`, `periodLabel` | AreaChart, Counter | 19rem |
| Toast | `title`, `time` (`без role (декоративний приклад, з підписом «Приклад інтерфейсу»)`) | — | 18.5rem |
| NextPayment | `title`, `date`, `amount?`, `caption?` | Counter | 14rem |
| Stat | `value` (може бути `[ДАНІ]`), `label`, `avatars?` (0–5) | — | 15rem |
| ReportsProgress | `done`, `total`, `label`, `title?`, `statusLabel?` | ProgressBar | 17rem |
| QuarterTaxes | `title`, `quarters[{label,value}]` | BarChart, Counter | 19rem |
| ReceiptsCounter | `title`, `count`, `deltaLabel`, `periodLabel?` | Counter | 15rem |
| PaymentsSplit | `title`, `segments[{label,value}]` (≤4) | DonutChart | 19rem |
| MonthIncome | `title`, `amount`, `data[]`, `deltaPercent?`, `periodLabel?` | AreaChart, Counter | 16rem |
| TaxLoad | `title`, `percent`, `caption` | ProgressBar, Counter | 15rem |
| AccountCard | `owner`, `ibanMasked`, `balance`, `label?` (лише темна) | Counter | 20rem |

## Приклади (ДЕМО-дані)

```tsx
<TaxesPaid
  items={[{ label: "ЄП, 3 група", amount: 12400 }, { label: "ЄСВ", amount: 5280 }]}
  statusLabel="Вчасно"
  periodLabel="III квартал 2026"
  animate
/>

<Income title="Дохід ФОП" data={[42, 48, 45, 56, 61, 58, 72]} growthPercent={12} periodLabel="за 6 місяців" />

<Toast title="Декларацію ФОП подано до ДПС" time="Сьогодні, 10:24" />

<NextPayment title="ЄСВ за жовтень" date="20.11" amount={1760} caption="через 12 днів" />

{/* Реальні показники компанії — demo={false} і заглушка [ДАНІ] */}
<Stat value="[ДАНІ]" label="клієнтів на супроводі" avatars={4} demo={false} />
<Stat value="[ДАНІ]" label="років досвіду" variant="light" demo={false} />

<ReportsProgress done={12} total={12} label="Звітів подано" title="Звітність 2026" />

<QuarterTaxes
  title="ЄП за квартали"
  quarters={[{ label: "I", value: 9800 }, { label: "II", value: 11200 }, { label: "III", value: 12400 }, { label: "IV", value: 13100 }]}
/>

<ReceiptsCounter title="Чеки ПРРО" count={1284} deltaLabel="+8% до вересня" periodLabel="за жовтень" />

<PaymentsSplit
  title="Структура платежів"
  segments={[{ label: "ЄП", value: 12400 }, { label: "ЄСВ", value: 5280 }, { label: "Військовий збір", value: 2480 }]}
/>

<MonthIncome title="Дохід за місяць" amount={248000} data={[30, 34, 31, 40, 44, 52]} deltaPercent={6} periodLabel="Жовтень 2026" />

<TaxLoad title="Податкове навантаження" percent={7} caption="ЄП 5% + ЄСВ + ВЗ" />

<AccountCard owner="ФОП Коваленко О. В." ibanMasked="UA·· ···· 4521" balance={184250} className="rotate-[-6deg]" />
```

## Примітки

- `PaymentsSplit`: легенда бере непрозорість з `donutOpacity(i)` (`charts/DonutChart`), тож завжди збігається з сегментами. >4 сегментів згорніть в «Інше».
- `TaxLoad`: Counter анімує лише цілі значення; дробові (напр. 5.5) показуються статично.
- `Stat` не має Counter: значення — рядок (у т.ч. `[ДАНІ]` через `<T>`).
