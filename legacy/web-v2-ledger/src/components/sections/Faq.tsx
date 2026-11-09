import { faq } from "@/content/site";
import Section from "@/components/ui/Section";
import T from "@/components/ui/T";

export default function Faq() {
  return (
    <Section id="faq" index="07" label="Питання" tone="paper">
      <h2 data-split>Часті питання</h2>
      <div className="mt-10 max-w-3xl border-t border-paper-line">
        {faq.map((f) => (
          <details key={f.q} data-faq className="faq-item border-b border-paper-line">
            <summary className="relative flex min-h-16 cursor-pointer items-center py-5 pr-12 text-[length:var(--text-lead)] font-medium">
              {f.q}
              <span className="faq-icon absolute right-1 top-1/2 size-4 -translate-y-1/2" aria-hidden="true">
                <span className="absolute left-0 top-1/2 h-px w-4 bg-brass-deep" />
                <span className="faq-icon-v absolute left-1/2 top-0 h-4 w-px bg-brass-deep transition-transform duration-200" />
              </span>
            </summary>
            <div data-faq-body className="overflow-hidden">
              <p className="max-w-[62ch] pb-6 pr-12 text-paper-dim"><T>{f.a}</T></p>
            </div>
          </details>
        ))}
      </div>
    </Section>
  );
}
