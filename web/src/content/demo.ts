// ДЕМО-дані для віджетів «як фрагменти фінансового застосунку».
// Це приклад інтерфейсу, а не статистика компанії. На сайті кожен такий віджет підписаний «Приклад інтерфейсу».

import type {
  AccountCardProps,
  MonthIncomeProps,
  PaymentsSplitProps,
  TaxLoadProps,
  IncomeLimitProps,
  PaymentsCalendarProps,
  QuarterTaxesProps,
  ReportsProgressProps,
  StatProps,
} from "@/components/widgets/types";
import { about } from "./site";

export const heroWidgets = {
  taxesPaid: {
    items: [
      { label: "ЄСВ", amount: 1902 },
      { label: "Єдиний податок", amount: 4750 },
    ],
    statusLabel: "Сплачено",
  },
  income: {
    title: "Дохід за рік",
    data: [52, 58, 55, 61, 66, 63, 70, 74, 72, 79, 83, 88].map((v) => v * 1000),
    growthPercent: 18,
    periodLabel: "Січень — грудень",
  },
  toast: { title: "Декларацію подано в ДПС", time: "2 хв тому" },
  nextPayment: { title: "ЄСВ за IV квартал", date: "19.01", amount: 1902 },
} as const;

// Розрахунки нижче — для умовного ФОП 3 групи (5%) у 2026 році:
// ЄСВ мінімальний = 22% × 8 647 ₴ = 1 902,34 ₴/міс; військовий збір для 3 групи = 1% доходу.
// Усі суми умовні й ілюстративні.

// «Про мене»: реальні показники — НЕ демо, тому demo: false і значення-заглушки [ДАНІ]
export const aboutWidgets = {
  clients: { value: about.stats[0].value, label: about.stats[0].label, avatars: 3, demo: false },
} as const satisfies { clients: StatProps };

// «Що я роблю»: ключі збігаються з ServiceWidgetKey у site.ts. Реалістичний приклад ФОП 3 групи, листопад 2026.
// Ліміт 3 групи на 2026 рік = 1167 мінімальних зарплат × 8 647 ₴ = 10 091 049 ₴.
// ЄСВ мінімальний за квартал = 1 902,34 × 3 ≈ 5 707 ₴; ЄП 5% за IV кв. при доході ~285 000 ₴ = 14 250 ₴.
export const servicesWidgets = {
  reports: { done: 3, total: 4, title: "Декларації 2026", label: "Подано за I–III кв. · IV кв. до 09.02" },
  quarterTaxes: {
    title: "Єдиний податок 5%, 2026",
    quarters: [
      { label: "I кв.", value: 11850 },
      { label: "II кв.", value: 12900 },
      { label: "III кв.", value: 13650 },
      { label: "IV кв.", value: 14250 },
    ],
  },
  limit: { title: "Ліміт доходу, 3 група", used: 950000, limit: 10091049, caption: "Дохід з початку 2026 року" },
  calendar: {
    title: "Платежі ФОП",
    items: [
      { label: "ЄСВ за III квартал", date: "20.10", amount: 5707, paid: true },
      { label: "ЄСВ за IV квартал", date: "19.01", amount: 5707 },
      { label: "Єдиний податок за IV кв.", date: "19.02", amount: 14250 },
    ],
  },
} as const satisfies {
  reports: ReportsProgressProps;
  quarterTaxes: QuarterTaxesProps;
  limit: IncomeLimitProps;
  calendar: PaymentsCalendarProps;
};

// «Ваші фінанси прозоро»: дохід 95 000 ₴ за місяць
// ЄП 5% = 4 750 ₴, ВЗ 1% = 950 ₴, ЄСВ = 1 902 ₴ → разом 7 602 ₴ ≈ 8,0% доходу
export const financesWidgets = {
  monthIncome: {
    title: "Дохід за жовтень",
    amount: 95000,
    data: [21500, 23800, 22400, 27300],
    deltaPercent: 6,
    periodLabel: "По тижнях",
  },
  taxLoad: { title: "Податкове навантаження", percent: 8, caption: "ЄП 5% + ЄСВ + військовий збір 1%" },
  paymentsSplit: {
    title: "Платежі за жовтень",
    segments: [
      { label: "Єдиний податок", value: 4750 },
      { label: "ЄСВ", value: 1902 },
      { label: "Військовий збір", value: 950 },
    ],
  },
  account: { owner: "ФОП Олена К.", ibanMasked: "UA•• •••• •••• •••• 4821", balance: 87398 },
} as const satisfies {
  monthIncome: MonthIncomeProps;
  taxLoad: TaxLoadProps;
  paymentsSplit: PaymentsSplitProps;
  account: AccountCardProps;
};
