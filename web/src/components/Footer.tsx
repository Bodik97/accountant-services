import type { ReactNode } from "react";
import { brand, footer } from "@/content/site";
import Button from "@/components/ui/Button";
import T from "@/components/ui/T";
import { ArrowRight } from "@/components/ui/icons";
import { PhoneIcon, TelegramIcon, ViberIcon } from "@/components/ui/ContactIcons";

const line = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.75, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;
const MailIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} {...line}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3.5 6.5 12 13l8.5-6.5" /></svg>
);
const ClockIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} {...line}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);

const Heading = ({ children }: { children: ReactNode }) => (
  <h2 className="font-sans text-[0.8125rem] font-medium tracking-normal text-gray-mid">{children}</h2>
);

/** Футер: бренд і заклик, контакти з іконками, навігація, реквізити, ©. На телефоні — запас знизу під MobileBar. */
export default function Footer() {
  const contacts = [
    { label: "Телефон", value: brand.phone, href: brand.phoneHref, icon: <PhoneIcon className="size-5" /> },
    { label: "Telegram", value: brand.telegram, href: brand.telegramHref, external: true, icon: <TelegramIcon className="size-6" /> },
    { label: "Viber", value: "Написати у Viber", href: brand.viberHref, icon: <ViberIcon className="size-6" /> },
    { label: "Email", value: brand.email, href: `mailto:${brand.email}`, icon: <MailIcon className="size-5" /> },
  ];
  return (
    <footer className="bg-black pb-[calc(6rem+env(safe-area-inset-bottom))] text-white lg:pb-10">
      <div className="container-x border-t border-white/10 pt-14 lg:pt-20">
        {/* Бренд + заклик */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <a href="#top" className="inline-flex min-h-11 items-center font-display text-[2.5rem] font-bold leading-none tracking-[-0.04em] lg:text-[3.5rem]">{brand.name}</a>
            <p className="mt-4 text-gray-light">{brand.tagline}.</p>
            <p className="mt-2 max-w-[48ch] text-[0.9375rem] text-gray-mid">{footer.lead}</p>
          </div>
          <Button href="#contact" surface="dark" arrow className="self-start lg:self-auto">{footer.cta}</Button>
        </div>

        <div className="mt-14 grid gap-12 border-t border-white/10 pt-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_1fr] lg:gap-16">
          {/* Контакти */}
          <div>
            <Heading>{footer.contactsTitle}</Heading>
            <ul className="mt-4 grid gap-1">
              {contacts.map((c) => (
                <li key={c.label}>
                  <a
                    href={c.href}
                    {...(c.external ? { target: "_blank", rel: "noopener" } : {})}
                    className="group flex min-h-12 items-center gap-3 rounded-2xl py-1 transition-colors duration-200 hover:text-white"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/[0.06] text-white transition-colors duration-200 group-hover:bg-white/[0.12]">{c.icon}</span>
                    <span className="min-w-0">
                      <span className="block text-[0.75rem] text-gray-mid">{c.label}</span>
                      <span className="block truncate text-[0.9375rem] tabular-nums text-gray-light group-hover:text-white">{c.value}</span>
                    </span>
                  </a>
                </li>
              ))}
              <li className="flex min-h-12 items-center gap-3 py-1">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/[0.06]"><ClockIcon className="size-5" /></span>
                <span>
                  <span className="block text-[0.75rem] text-gray-mid">Години роботи</span>
                  <span className="block text-[0.9375rem] text-gray-light"><T>{brand.hours}</T></span>
                </span>
              </li>
            </ul>
          </div>

          {/* Навігація */}
          <nav aria-label="Навігація у футері">
            <Heading>{footer.navTitle}</Heading>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 sm:grid-cols-1">
              {footer.nav.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="group inline-flex min-h-11 items-center gap-2 text-[0.9375rem] text-gray-light transition-colors duration-200 hover:text-white">
                    {l.label}
                    <ArrowRight className="size-3.5 -translate-x-1 opacity-0 transition-[opacity,translate] duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Реквізити */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Heading>{footer.legalTitle}</Heading>
            <dl className="mt-4 grid gap-4 rounded-[var(--radius-card)] border border-white/10 p-5 text-[0.875rem]">
              {brand.legal.map((r) => (
                <div key={r.label}>
                  <dt className="text-[0.75rem] text-gray-mid">{r.label}</dt>
                  <dd className="mt-0.5 text-gray-light"><T>{r.value}</T></dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="mt-12 flex flex-col-reverse gap-4 border-t border-white/10 pt-6 text-[0.8125rem] text-gray-mid sm:flex-row sm:items-center sm:justify-between">
          <p>© {brand.year} {brand.name}. Усі права захищено.</p>
          <a href="#top" className="inline-flex min-h-11 items-center gap-2 self-start transition-colors duration-200 hover:text-white sm:self-auto">
            {footer.toTop}
            <ArrowRight className="size-3.5 -rotate-90" />
          </a>
        </div>
      </div>
    </footer>
  );
}
