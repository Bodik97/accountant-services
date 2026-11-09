import { services, servicesShowcase, type ServiceWidgetKey } from "@/content/site";
import { servicesWidgets } from "@/content/demo";
import SectionHead from "@/components/ui/SectionHead";
import Card from "@/components/ui/Card";
import T from "@/components/ui/T";
import ServiceCard from "./ServiceCard";
import { serviceIcons } from "./serviceIcons";
import ReportsProgress from "@/components/widgets/ReportsProgress";
import QuarterTaxes from "@/components/widgets/QuarterTaxes";
import IncomeLimit from "@/components/widgets/IncomeLimit";
import PaymentsCalendar from "@/components/widgets/PaymentsCalendar";

// Усі 4 віджети однакового розміру і стилю — картки читаються як один ряд «екранів застосунку»
const SIZE = "w-[19rem] h-[16.5rem] flex flex-col justify-between";

function Widget({ k }: { k: ServiceWidgetKey }) {
  const w = servicesWidgets;
  if (k === "reports") return <ReportsProgress {...w.reports} variant="white" animate className={SIZE} />;
  if (k === "quarterTaxes") return <QuarterTaxes {...w.quarterTaxes} variant="white" animate className={SIZE} />;
  if (k === "limit") return <IncomeLimit {...w.limit} variant="white" animate className={SIZE} />;
  return <PaymentsCalendar {...w.calendar} variant="white" className={SIZE} />;
}

/** «Що я роблю»: кожна основна задача в парі з дашборд-карткою; нижче — усі послуги з цінами. */
export default function Services() {
  return (
    <section id="services" className="section-y bg-surface">
      <div className="container-x">
        <SectionHead label={servicesShowcase.label} title={servicesShowcase.title} intro={servicesShowcase.intro} />

        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {servicesShowcase.items.map((it) => (
            <Card key={it.serviceTitle} variant="white" radius="lg" className="flex flex-col overflow-hidden" data-tilt data-svc-card>
              <div className="relative min-h-[9.5rem] p-6 sm:p-8">
                <h3 className="pr-12">{it.serviceTitle}</h3>
                <p className="mt-2 max-w-[44ch] text-gray-text">{it.text}</p>
                {/* Телефон/планшет (лише з анімаціями): кнопка «акордеона» — розкривається сама при прокрутці або тапом */}
                <button type="button" data-svc-toggle aria-expanded="false" aria-label={`Показати приклад: ${it.serviceTitle}`} className="absolute right-4 top-4 hidden size-11 place-items-center rounded-full bg-black text-white [.motion_&]:max-lg:grid">
                  <svg data-svc-chevron viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
                </button>
              </div>
              <div data-svc-body className="mt-auto overflow-hidden">
                <div className="grid h-[21rem] grid-cols-1 place-items-center bg-surface p-6 sm:p-8">
                  <div data-parallax="0.35"><Widget k={it.widget} /></div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-24 flex flex-wrap items-end justify-between gap-4">
          <h3 className="text-[length:var(--text-h3)]">Усі послуги</h3>
          <p className="inline-flex items-center gap-2 text-[0.9375rem] text-gray-text">
            <svg viewBox="0 0 24 24" className="size-5 shrink-0 text-black" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V11m0-1.5a1.5 1.5 0 0 1 3 0V11m0-.5a1.5 1.5 0 0 1 3 0v3.5a6 6 0 0 1-6 6h-.6a6 6 0 0 1-4.6-2.2L4.6 14.4a1.5 1.5 0 0 1 2.3-1.9L9 15" /></svg>
            Натисніть на картку — покажу, що входить і скільки коштує
          </p>
        </div>
        <ul className="mt-6 grid grid-cols-1 items-start gap-3 md:grid-cols-2 lg:grid-cols-3" data-services-grid>
          {services.map((s, i) => (
            <li key={s.title} className="[perspective:900px]">
              <ServiceCard title={s.title} text={s.text} price={<T>{s.price}</T>} includes={s.includes} icon={serviceIcons[i]} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
