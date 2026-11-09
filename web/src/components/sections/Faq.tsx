import { faq } from "@/content/site";
import SectionHead from "@/components/ui/SectionHead";
import T from "@/components/ui/T";

export default function Faq() {
  return (
    <section id="faq" className="section-y bg-surface">
      <div className="container-x grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <SectionHead label="Питання" title="Часті питання" />
        <div className="grid gap-3">
          {faq.map((f) => (
            <details key={f.q} data-faq className="faq-item group rounded-[var(--radius-card)] bg-white px-6 shadow-[var(--shadow-card)]">
              <summary className="relative flex min-h-16 cursor-pointer items-center py-5 pr-14 font-medium outline-none">
                {f.q}
                <span className="faq-icon absolute right-0 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full" aria-hidden="true">
                  <span className="faq-cross relative size-3.5">
                    <span className="absolute left-0 top-1/2 h-[1.5px] w-3.5 -translate-y-1/2 rounded-full bg-current" />
                    <span className="faq-icon-v absolute left-1/2 top-0 h-3.5 w-[1.5px] -translate-x-1/2 rounded-full bg-current" />
                  </span>
                </span>
              </summary>
              <div data-faq-body className="overflow-hidden">
                <p className="max-w-[62ch] pb-6 pr-6 text-gray-text"><T>{f.a}</T></p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
