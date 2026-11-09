import { brand } from "@/content/site";
import LeadForm from "@/components/LeadForm";
import Section from "@/components/ui/Section";
import T from "@/components/ui/T";

export default function Contact() {
  const links = [
    { label: "Телефон", value: brand.phone, href: brand.phoneHref },
    { label: "Telegram", value: brand.telegram, href: brand.telegramHref, external: true },
    { label: "Email", value: brand.email, href: `mailto:${brand.email}` },
  ];
  return (
    <Section id="contact" index="08" label="Заявка">
      <div className="grid gap-12 lg:grid-cols-10">
        <div className="lg:col-span-5">
          <h2 data-split>
            Безкоштовна перевірка вашої <em>звітності</em>
          </h2>
          <p className="mt-5 max-w-[46ch] text-[length:var(--text-lead)] text-bone-dim" data-reveal>
            Залиште контакти. Розберемо вашу ситуацію і назвемо точну вартість супроводу.
          </p>
          {/* ЗАМІНІТЬ контакти на реальні */}
          <ul className="mt-10">
            {links.map((l) => (
              <li key={l.label} data-row className="relative">
                <a
                  href={l.href}
                  {...(l.external ? { target: "_blank", rel: "noopener" } : {})}
                  className="grid min-h-14 grid-cols-[6.5rem_1fr] items-center gap-4 py-3 transition-colors duration-200 hover:text-brass"
                >
                  <span className="caption uppercase tracking-[0.12em] text-bone-dim">{l.label}</span>
                  <span className="truncate tabular-nums">{l.value}</span>
                </a>
                <span data-rule className="absolute inset-x-0 bottom-0 h-px origin-left bg-line" aria-hidden="true" />
              </li>
            ))}
          </ul>
          <p className="caption mt-4 text-bone-dim">Години роботи: <T>{brand.hours}</T></p>
        </div>
        <div className="lg:col-span-5" data-reveal>
          <LeadForm />
        </div>
      </div>
    </Section>
  );
}
