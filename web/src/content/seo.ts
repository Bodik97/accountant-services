// SEO: метадані сторінки і структуровані дані (JSON-LD).
// Підключається в app/layout.tsx: `export const metadata = siteMetadata` і <script type="application/ld+json"> з buildJsonLd().
import type { Metadata } from "next";
import { brand, faq, services } from "./site";

// [ДАНІ: домен] — замініть на реальний домен сайту (з https://, без слеша в кінці).
// Від нього залежать canonical, og:url і url у JSON-LD.
export const SITE_URL = "https://example.com";

const title = `${brand.name} — бухгалтерський супровід ФОП і ТОВ`;
const description =
  "Облік, звітність і податки для ФОП і ТОВ по всій Україні. Закріплений бухгалтер, фіксована ціна в договорі. Перша консультація безкоштовна.";

export const siteMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
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

/** Контакти-заглушки (нулі в номері, example.com) не публікуємо в JSON-LD */
const hasRealPhone = !/0{6,}/.test(brand.phoneHref);
const hasRealEmail = !brand.email.endsWith("@example.com");

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
      ...(hasRealPhone ? { telephone: brand.phoneHref.replace("tel:", "") } : {}),
      ...(hasRealEmail ? { email: brand.email } : {}),
      areaServed: { "@type": "Country", name: "Україна" },
      availableLanguage: "uk",
      priceRange: "₴₴",
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
