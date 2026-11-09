import type { Metadata, Viewport } from "next";
import { Literata, Onest } from "next/font/google";
import { brand, faq } from "@/content/site";
import "./globals.css";

const literata = Literata({
  subsets: ["latin", "cyrillic"],
  axes: ["opsz"],
  style: ["normal", "italic"],
  variable: "--font-literata",
  display: "swap",
});
const onest = Onest({ subsets: ["latin", "cyrillic"], variable: "--font-onest", display: "swap" });

export const metadata: Metadata = {
  title: `${brand.name} — бухгалтерський супровід ФОП і ТОВ`,
  description:
    "Ведемо бухгалтерію ФОП і ТОВ під ключ: облік, звітність, зарплата, захист від штрафів. Безкоштовна консультація та перевірка звітності.",
  openGraph: {
    title: `${brand.name} — бухгалтерія без хаосу і штрафів`,
    description: "Облік, звітність і податки для ФОП і ТОВ. Перша консультація безкоштовно.",
    locale: "uk_UA",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A1714",
  viewportFit: "cover",
};

// ЗАМІНІТЬ дані на реальні
const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "AccountingService",
    name: brand.name,
    description: brand.tagline,
    telephone: brand.phoneHref.replace("tel:", ""),
    email: brand.email,
    areaServed: "UA",
    priceRange: "₴₴",
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  },
];

// 2D (SVG) історія з анімацією; при prefers-reduced-motion — статична версія без руху
// Клас .motion ховає заголовки до розбиття на рядки (SplitText), щоб не було «блимання»
const sceneModeScript = `(function(){var d=document.documentElement,m="2d";try{if(matchMedia("(prefers-reduced-motion: reduce)").matches)m="static"}catch(e){}d.dataset.scene=m;if(m!=="static")d.classList.add("motion")})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="uk" suppressHydrationWarning className={`${literata.variable} ${onest.variable}`}>
      <head>
        {/* Режим історії обираємо до першого відмалювання, щоб не було «стрибка» */}
        <script dangerouslySetInnerHTML={{ __html: sceneModeScript }} />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        {children}
      </body>
    </html>
  );
}
