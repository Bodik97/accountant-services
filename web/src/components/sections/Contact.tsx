import { brand, contact } from "@/content/site";
import LeadForm from "@/components/LeadForm";
import SectionHead from "@/components/ui/SectionHead";
import T from "@/components/ui/T";

export default function Contact() {
  const links = [
    { label: contact.links.phone, value: brand.phone, href: brand.phoneHref },
    { label: contact.links.telegram, value: brand.telegram, href: brand.telegramHref, external: true },
    { label: contact.links.email, value: brand.email, href: `mailto:${brand.email}` },
  ];
  return (
    <section id="contact" className="overflow-x-clip section-y bg-black text-white">
      <div className="container-x grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,32rem)] lg:items-start lg:gap-16">
        <div>
          <SectionHead on="dark" label={contact.label} title={`${contact.titleStart} ${contact.titleAccent}`} intro={contact.lead} />
          <ol className="mt-10 grid gap-4">
            {contact.next.map((n, i) => (
              <li key={n} className="flex gap-4 text-gray-light">
                <span className="grid size-8 shrink-0 place-items-center rounded-full border border-white/25 text-[0.8125rem] tabular-nums">{i + 1}</span>
                <span className="pt-1"><T>{n}</T></span>
              </li>
            ))}
          </ol>
          {/* ЗАМІНІТЬ контакти на реальні */}
          <ul className="mt-10 grid grid-cols-1 gap-2">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  {...(l.external ? { target: "_blank", rel: "noopener" } : {})}
                  className="flex min-h-14 items-center justify-between gap-4 rounded-full border border-white/15 px-5 transition-colors duration-200 hover:border-white"
                >
                  <span className="shrink-0 text-[0.875rem] text-gray-mid">{l.label}</span>
                  <span className="min-w-0 truncate tabular-nums">{l.value}</span>
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-4 pl-5 text-[0.875rem] text-gray-mid">{contact.hoursLabel} <T>{brand.hours}</T></p>
        </div>
        {/* Форма — світла «піднята» панель із м'яким світінням, щоб відділялась від темної секції */}
        <div className="relative min-w-0" data-reveal>
          <span aria-hidden="true" className="pointer-events-none absolute -inset-6 rounded-[48px] bg-[radial-gradient(60%_50%_at_50%_40%,rgb(255_255_255/0.14),transparent_70%)] blur-2xl" />
          <div className="relative rounded-[var(--radius-card-lg)] bg-white p-5 text-black shadow-[0_0_0_6px_rgb(255_255_255/0.06),0_30px_80px_-20px_rgb(255_255_255/0.22)] sm:p-8">
            <LeadForm />
          </div>
        </div>
      </div>
    </section>
  );
}
