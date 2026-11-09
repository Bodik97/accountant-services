import { finances, type FinanceWidgetKey } from "@/content/site";
import { financesWidgets } from "@/content/demo";
import SectionHead from "@/components/ui/SectionHead";
import MonthIncome from "@/components/widgets/MonthIncome";
import TaxLoad from "@/components/widgets/TaxLoad";
import PaymentsSplit from "@/components/widgets/PaymentsSplit";
import AccountCard from "@/components/widgets/AccountCard";
import PhoneReport from "./PhoneReport";
import FinancesCarousel from "./FinancesCarousel";

function Widget({ k, className = "" }: { k: FinanceWidgetKey; className?: string }) {
  const w = financesWidgets;
  if (k === "monthIncome") return <MonthIncome {...w.monthIncome} variant="white" animate className={className} />;
  if (k === "taxLoad") return <TaxLoad {...w.taxLoad} variant="glass" animate className={className} />;
  if (k === "paymentsSplit") return <PaymentsSplit {...w.paymentsSplit} variant="white" animate className={className || "w-[22rem]"} />;
  return <AccountCard {...w.account} animate className={className} />;
}

/** Пояснення простими словами: «що означає ця цифра для вас». */
function Hint({ text, className = "", ...rest }: { text: string; className?: string } & Record<`data-${string}`, boolean | string>) {
  return (
    <p {...rest} className={`flex gap-2.5 rounded-[var(--radius-card-sm)] bg-black p-3.5 text-[0.875rem] leading-snug text-white shadow-[var(--shadow-float)] ${className}`}>
      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-white text-[0.75rem] font-semibold text-black" aria-hidden="true">i</span>
      <span>{text}</span>
    </p>
  );
}

/**
 * «Ваші фінанси прозоро». Десктоп (lg): ліворуч кроки, праворуч телефон зі звітом і підказка (sticky).
 * Секція закріплюється (pin): екран телефона гортається до блоку кроку, поруч — підказка цього кроку:
 * [data-finance-step] ↔ [data-finance-widget] (обгортка підказки) з тим самим індексом.
 * Телефон/планшет: телефона немає (дрібний текст на екрані не читається) — звіт показано картками:
 * свайп-карусель із перемикачем «Дохід / Податки / Платежі / Залишок», на планшеті — сітка 2×2.
 */
export default function Finances() {
  return (
    <section id="finances" className="relative bg-surface" data-finances>
      <div className="container-x section-y grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-10">
        <div className="lg:py-10">
          <SectionHead label={finances.label} title={finances.title} intro={finances.intro} />
          <ol className="mt-10 hidden grid-cols-1 gap-3 lg:grid">
            {finances.steps.map((s, i) => (
              <li key={s.title} data-finance-step={i} className="min-w-0 rounded-[var(--radius-card-sm)] border border-black/[0.08] bg-white p-5 transition-colors duration-300">
                <div className="flex items-baseline gap-3">
                  <span className="text-[0.8125rem] tabular-nums text-gray-text">0{i + 1}</span>
                  <h3 className="text-[1.125rem]">{s.title}</h3>
                </div>
                <p className="mt-1.5 pl-8 text-[0.9375rem] text-gray-text">{s.text}</p>
              </li>
            ))}
          </ol>

          {/* Телефон і планшет: щомісячний звіт картками */}
          <div className="mt-10 lg:hidden" data-reveal>
            <div className="mb-5 flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-black text-[0.875rem] font-semibold text-white" aria-hidden="true">Б</span>
              <div className="min-w-0">
                <p className="text-[1rem] font-semibold leading-tight">{finances.report.title}</p>
                <p className="text-[0.875rem] text-gray-text">{finances.report.from}</p>
              </div>
            </div>
            <FinancesCarousel label={`Приклад звіту: ${finances.report.title.toLowerCase()}`} tabs={finances.steps.map((s) => s.short)}>
              {finances.steps.map((s, i) => (
                // Кожен крок — окрема картка: заголовок, пояснення, віджет у «вікні», підказка
                <article key={s.title} className="flex h-full flex-col rounded-[var(--radius-card)] border border-black/[0.07] bg-white p-4 shadow-[0_1px_2px_rgb(10_10_10/0.04),0_16px_36px_-20px_rgb(10_10_10/0.3)] sm:p-5">
                  <div className="flex items-center gap-3">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-black text-[0.8125rem] font-semibold tabular-nums text-white" aria-hidden="true">{i + 1}</span>
                    <h3 className="text-[1.125rem] leading-tight">{s.title}</h3>
                  </div>
                  <p className="mt-2 text-[0.9375rem] text-gray-text">{s.text}</p>
                  <div className="mt-4 rounded-[var(--radius-card-sm)] bg-surface p-2.5">
                    <Widget k={s.widget} className="w-full shadow-none" />
                  </div>
                  <Hint text={s.hint} className="mt-3 shadow-none" />
                </article>
              ))}
            </FinancesCarousel>
            <p className="mt-6 flex items-start gap-2.5 text-[0.9375rem]">
              <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-success text-[0.75rem] text-black" aria-hidden="true">✓</span>
              {finances.report.note}
            </p>
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="relative lg:sticky lg:top-24 lg:h-[calc(100svh-8rem)] lg:min-h-[36rem]">
            <div className="flex h-full items-center justify-center gap-6 xl:gap-10">
              <PhoneReport className="h-full shrink-0 justify-center" />
              {/* Підказка активного кроку поруч із телефоном (десктоп, по одній — GSAP) */}
              <div className="hidden w-[15rem] shrink-0 lg:grid xl:w-[18rem]">
                {finances.steps.map((s, i) => (
                  <div key={s.title} className="[grid-area:1/1]" data-finance-widget={i} data-depth="0.3">
                    <Hint text={s.hint} data-finance-hint className="text-[0.9375rem]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
