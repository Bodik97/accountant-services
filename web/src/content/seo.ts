// SEO: метадані сторінки і структуровані дані (JSON-LD).
// Підключається в app/layout.tsx: `export const metadata = siteMetadata` і <script type="application/ld+json"> з buildJsonLd().
import type { Metadata } from "next";
import { accountant, brand, faq, services } from "./site";

// Адреса сайту (з https://, без слеша в кінці). Після купівлі власного домену — замінити тут.
// Від неї залежать canonical, og:url, robots.txt, sitemap.xml і url у JSON-LD.
export const SITE_URL = "https://accounting-services-ua.vercel.app";

// Title: спершу пошуковий запит («бухгалтер для ФОП»), потім бренд — до ~60 символів, щоб Google не обрізав
export const title = `Бухгалтер для ФОП онлайн — супровід ФОП і ТОВ | ${brand.name}`;
export const description =
  "Особистий бухгалтер для ФОП 1–3 групи онлайн по всій Україні: облік, декларації, ЄП і ЄСВ, нагадування про платежі. Перша консультація безкоштовна.";

export const siteMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  applicationName: brand.name,
  authors: [{ name: accountant.name }],
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description,
    url: "/",
    siteName: brand.name,
    locale: "uk_UA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: { index: true, follow: true },
};

/** Прибирає заглушки «[ДАНІ…]» з тексту, щоб вони не потрапили в пошук і AI-відповіді */
function clean(text: string): string {
  return text.replace(/\s*\[ДАНІ[^\]]*\]/g, "").trim();
}

/** Контакти-заглушки (нулі в номері, example.com, [ДАНІ]) не публікуємо в JSON-LD */
const hasRealPhone = !/0{6,}/.test(brand.phoneHref);
const hasRealEmail = !brand.email.endsWith("@example.com");
const hasRealName = !accountant.name.includes("[ДАНІ");

export function buildJsonLd() {
  const orgId = `${SITE_URL}/#organization`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "AccountingService",
      "@id": orgId,
      name: brand.name,
      description: clean(`${brand.tagline}. ${description}`),
      url: SITE_URL,
      image: `${SITE_URL}/opengraph-image`,
      ...(hasRealPhone ? { telephone: brand.phoneHref.replace("tel:", "") } : {}),
      ...(hasRealEmail ? { email: brand.email } : {}),
      ...(hasRealName
        ? { founder: { "@type": "Person", name: accountant.name, jobTitle: "Бухгалтер", worksFor: { "@id": orgId } } }
        : {}),
      // Має збігатися з brand.hours у site.ts
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
      areaServed: { "@type": "Country", name: "Україна" },
      availableLanguage: "uk",
      knowsAbout: ["Бухгалтерський облік ФОП", "Єдиний податок", "ЄСВ", "Декларація ФОП", "Бухгалтерія ТОВ", "Зарплата і кадри"],
      priceRange: "₴₴",
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: brand.name,
      url: SITE_URL,
      inLanguage: "uk",
      publisher: { "@id": orgId },
    },
    ...services.map((s) => ({
      "@context": "https://schema.org",
      "@type": "Service",
      name: s.title,
      description: clean(s.text),
      serviceType: "Бухгалтерські послуги",
      provider: { "@id": orgId },
      areaServed: { "@type": "Country", name: "Україна" },
    })),
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: clean(f.a) },
      })),
    },
  ];
}
