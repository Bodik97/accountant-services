import { financesWidgets as w } from "@/content/demo";
import { finances } from "@/content/site";

const uah = new Intl.NumberFormat("uk-UA");
const money = (v: number) => `${uah.format(v)} ₴`;

const tax = w.paymentsSplit.segments.reduce((s, x) => s + x.value, 0);
const shades = ["bg-black", "bg-[#8a8a8a]", "bg-[#d9d9d9]"];

/** Блок звіту на екрані телефона. data-phone-section — індекс кроку «Фінансів». */
function Block({ i, title, icon, children }: { i: number; title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section data-phone-section={i} className="rounded-[18px] bg-white p-3.5 shadow-[0_1px_2px_rgb(10_10_10/0.06),0_6px_16px_-10px_rgb(10_10_10/0.25)] transition-shadow">
      <p className="flex items-center gap-1.5 text-[10px] font-medium text-[#5e5e5e]">
        <span className="grid size-5 place-items-center rounded-md bg-[#f4f4f4] text-black">{icon}</span>
        {title}
      </p>
      {children}
    </section>
  );
}

// Мікроіконки інтерфейсу (декор)
const ic = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, className: "size-3" };
const IconIn = () => <svg {...ic}><path d="M12 19V5M5 12l7 7 7-7" /></svg>;
const IconPct = () => <svg {...ic}><path d="M19 5 5 19" /><circle cx="7" cy="7" r="2.5" /><circle cx="17" cy="17" r="2.5" /></svg>;
const IconPay = () => <svg {...ic}><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M3 10h18" /></svg>;
const IconWallet = () => <svg {...ic}><path d="M4 7h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a1 1 0 0 1-1-1z" /><path d="M4 7l11-3v3M16 13.5h.01" /></svg>;

/** Статус-бар: час, «острівець», мережа, Wi-Fi, батарея. */
function StatusBar() {
  return (
    <div className="absolute inset-x-0 top-0 z-20 flex h-10 items-center justify-between bg-[#f4f4f4]/85 px-6 text-[10.5px] font-semibold backdrop-blur">
      <span className="tabular-nums">9:41</span>
      <span className="absolute left-1/2 top-2 h-[20px] w-[76px] -translate-x-1/2 rounded-full bg-black" />
      <span className="flex items-center gap-1.5">
        <span className="flex items-end gap-[1.5px]">{[4, 6, 8, 10].map((h) => <span key={h} className="w-[2.5px] rounded-[1px] bg-black" style={{ height: h }} />)}</span>
        <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round"><path d="M2 9a15 15 0 0 1 20 0M5.5 12.5a10 10 0 0 1 13 0M9 16a5 5 0 0 1 6 0" /><circle cx="12" cy="19.5" r="0.6" fill="currentColor" /></svg>
        <span className="relative flex h-[10px] w-[20px] items-center rounded-[3px] border border-black/60 p-[1.5px]"><span className="h-full w-[75%] rounded-[1.5px] bg-black" /><span className="absolute -right-[3px] h-[4px] w-[1.5px] rounded-r bg-black/60" /></span>
      </span>
    </div>
  );
}

/**
 * Смартфон зі щомісячним звітом бухгалтера (центр секції «Фінанси»).
 * Реалістичний корпус (металева рамка, бічні кнопки, відблиск на склі), статус-бар, нижнє меню застосунку.
 * Екран — довга «сторінка» [data-phone-scroll]; GSAP гортає її до блоку активного кроку
 * і приглушує інші блоки (animations/scroll.ts). Без JS видно початок звіту.
 * Декоративний макет: суть передають кроки поруч, тому для читачів екрана — короткий опис.
 */
export default function PhoneReport({ className = "" }: { className?: string }) {
  const weeks = w.monthIncome.data;
  const max = Math.max(...weeks);
  const min = Math.min(...weeks);
  const tags = ["ЄП", "ЄСВ", "ВЗ"];
  return (
    <figure className={`relative flex flex-col items-center ${className}`}>
      {/* Тінь «на столі» під телефоном */}
      <span aria-hidden="true" className="absolute bottom-6 left-1/2 h-8 w-[60%] -translate-x-1/2 rounded-[50%] bg-black/25 blur-2xl" />
      <div
        role="img"
        aria-label={`Приклад звіту в телефоні: дохід ${money(w.monthIncome.amount)}, податки ${w.taxLoad.percent}% (${money(tax)}), залишок ${money(w.account.balance)}`}
        className="relative aspect-[9/19] h-[calc(100%-2rem)] max-h-[38rem] rounded-[2.9rem] bg-[linear-gradient(140deg,#5a5a5a,#1a1a1a_22%,#0a0a0a_50%,#2a2a2a_78%,#6a6a6a)] p-[3px] shadow-[0_2px_4px_rgb(10_10_10/0.1),0_50px_90px_-30px_rgb(10_10_10/0.55)] max-xl:max-h-[32rem]"
      >
        {/* Бічні кнопки (металеві) */}
        <span aria-hidden="true" className="absolute -left-[3px] top-[18%] h-7 w-[3px] rounded-l bg-[linear-gradient(90deg,#6a6a6a,#2a2a2a)]" />
        <span aria-hidden="true" className="absolute -left-[3px] top-[26%] h-12 w-[3px] rounded-l bg-[linear-gradient(90deg,#6a6a6a,#2a2a2a)]" />
        <span aria-hidden="true" className="absolute -right-[3px] top-[24%] h-16 w-[3px] rounded-r bg-[linear-gradient(270deg,#6a6a6a,#2a2a2a)]" />

        <div className="h-full rounded-[2.75rem] bg-black p-[0.5rem]">
          <div aria-hidden="true" className="relative h-full overflow-hidden rounded-[2.25rem] bg-[#f4f4f4]">
            <StatusBar />

            <div data-phone-scroll className="relative px-3 pb-20 pt-12">
              {/* Шапка звіту */}
              <div className="flex items-center gap-2.5 px-1 pb-3">
                <span className="relative grid size-9 place-items-center rounded-full bg-black text-[12px] font-semibold text-white">
                  Б<span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-[#f4f4f4] bg-success" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[12.5px] font-semibold leading-tight">{finances.report.title}</p>
                  <p className="truncate text-[9.5px] text-[#5e5e5e]">{finances.report.from}</p>
                </div>
                <span className="rounded-full border border-black/10 bg-white px-2 py-1 text-[9px] font-semibold">PDF</span>
              </div>

              <div className="grid gap-2.5">
                <Block i={0} title="Дохід за місяць" icon={<IconIn />}>
                  <div className="mt-1.5 flex items-end justify-between">
                    <p className="font-display text-[22px] font-semibold tracking-[-0.03em] tabular-nums">{money(w.monthIncome.amount)}</p>
                    <span className="mb-1 rounded-full bg-success px-1.5 py-0.5 text-[9px] font-semibold text-black">+{w.monthIncome.deltaPercent}%</span>
                  </div>
                  <div className="mt-2.5 flex h-14 items-end gap-2">
                    {weeks.map((v, j) => (
                      <span key={j} className="flex flex-1 flex-col items-center gap-1">
                        <span className={`w-full rounded-t-[6px] rounded-b-[2px] ${j === weeks.length - 1 ? "bg-black" : "bg-[#d9d9d9]"}`} style={{ height: `${12 + ((v - min) / (max - min || 1)) * 28}px` }} />
                        <span className="text-[8px] text-[#8a8a8a]">{j + 1} тиж</span>
                      </span>
                    ))}
                  </div>
                  <div className="mt-2.5 flex items-center gap-2 text-[9px] text-[#5e5e5e]">
                    <span className="h-1 flex-1 overflow-hidden rounded-full bg-[#ececec]"><span className="block h-full w-[9%] rounded-full bg-black" /></span>
                    Ліміт 3 групи · 9%
                  </div>
                </Block>

                <Block i={1} title="Податкове навантаження" icon={<IconPct />}>
                  <div className="mt-1.5 flex items-end justify-between">
                    <p className="font-display text-[22px] font-semibold tracking-[-0.03em] tabular-nums">{w.taxLoad.percent}%</p>
                    <p className="mb-1 text-[9.5px] text-[#5e5e5e]">з кожних 100 ₴ — {w.taxLoad.percent} ₴</p>
                  </div>
                  <div className="mt-2 flex h-2.5 gap-[2px] overflow-hidden rounded-full">
                    <span className="rounded-l-full bg-black" style={{ width: `${w.taxLoad.percent}%` }} />
                    <span className="flex-1 rounded-r-full bg-success" />
                  </div>
                  <div className="mt-1.5 flex justify-between text-[9.5px] text-[#5e5e5e]">
                    <span>Податки {money(tax)}</span>
                    <span>Ваше {100 - w.taxLoad.percent}%</span>
                  </div>
                </Block>

                <Block i={2} title="Що сплатити" icon={<IconPay />}>
                  <ul className="mt-2 grid gap-1.5">
                    {w.paymentsSplit.segments.map((s, j) => (
                      <li key={s.label} className="flex items-center gap-2 rounded-xl bg-[#f4f4f4] px-2 py-1.5 text-[10.5px]">
                        <span className={`grid h-5 min-w-7 place-items-center rounded-md px-1 text-[8px] font-bold ${j === 0 ? "bg-black text-white" : j === 1 ? "bg-[#8a8a8a] text-white" : "bg-[#d9d9d9] text-black"}`}>{tags[j]}</span>
                        <span className="min-w-0 flex-1 truncate">{s.label}</span>
                        <span className="font-semibold tabular-nums">{money(s.value)}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-success/15 px-2 py-1 text-[9px] font-medium text-[#15803d]">
                    <span className="grid size-3 place-items-center rounded-full bg-success text-[7px] text-black">✓</span>
                    Реквізити надіслано
                  </p>
                </Block>

                <Block i={3} title="Залишається вам" icon={<IconWallet />}>
                  <p className="mt-1.5 font-display text-[22px] font-semibold tracking-[-0.03em] tabular-nums text-[#15803d]">{money(w.account.balance)}</p>
                  <div className="mt-2 flex items-center justify-between rounded-xl bg-black px-3 py-2 text-[9px] text-white/70">
                    <span>Рахунок ФОП</span>
                    <span className="tabular-nums">•• 4821</span>
                  </div>
                </Block>

                {/* Повідомлення від бухгалтера */}
                <div className="ml-6 rounded-2xl rounded-br-md bg-black p-3 text-[10.5px] leading-snug text-white">
                  {finances.report.note}
                </div>
              </div>
            </div>

            {/* Нижнє меню застосунку */}
            <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-around border-t border-black/5 bg-white/85 px-4 pb-5 pt-2 text-[8.5px] text-[#8a8a8a] backdrop-blur">
              {[["Звіт", true], ["Платежі", false], ["Чат", false]].map(([t, on]) => (
                <span key={t as string} className={`flex flex-col items-center gap-0.5 ${on ? "font-semibold text-black" : ""}`}>
                  <span className={`size-1.5 rounded-full ${on ? "bg-black" : "bg-transparent"}`} />
                  {t}
                </span>
              ))}
            </div>
            {/* Індикатор «додому» */}
            <span className="absolute bottom-1.5 left-1/2 z-30 h-1 w-24 -translate-x-1/2 rounded-full bg-black/80" />
            {/* Відблиск на склі */}
            <span className="pointer-events-none absolute inset-0 z-30 bg-[linear-gradient(115deg,rgb(255_255_255/0.35)_0%,rgb(255_255_255/0.05)_22%,transparent_38%)]" />
          </div>
        </div>
      </div>
      <figcaption className="caption mt-3 text-gray-text">Приклад інтерфейсу</figcaption>
    </figure>
  );
}
