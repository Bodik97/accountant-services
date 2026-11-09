import type { Metadata, Viewport } from "next";
import { Wix_Madefor_Display, Wix_Madefor_Text } from "next/font/google";
import { buildJsonLd, siteMetadata } from "@/content/seo";
import "./globals.css";

// Заголовки — Wix Madefor Display, текст — Wix Madefor Text: одна родина, сучасний «фінтех»-гротеск з кирилицею.
const heading = Wix_Madefor_Display({ subsets: ["latin", "cyrillic"], weight: ["500", "600", "700"], variable: "--font-heading", display: "swap" });
const body = Wix_Madefor_Text({ subsets: ["latin", "cyrillic"], weight: ["400", "500", "600"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = siteMetadata;

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  viewportFit: "cover",
};

const jsonLd = buildJsonLd();

// Режим сторінки до першого відмалювання:
//   full — 3D і scroll-анімації; lite — без 3D і без scroll-анімацій
//   (reduced motion, економія трафіку, слабкий пристрій). Наявність WebGL перевіряє Scene3D перед монтуванням.
// Клас .motion ховає заголовки до розбиття на рядки (SplitText), щоб не було «блимання».
const modeScript = `(function(){var d=document.documentElement,m="full";try{var n=navigator;if(matchMedia("(prefers-reduced-motion: reduce)").matches||(n.connection&&n.connection.saveData)||(n.deviceMemory&&n.deviceMemory<4))m="lite"}catch(e){m="lite"}d.dataset.mode=m;if(m==="full")d.classList.add("motion")})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="uk" suppressHydrationWarning className={`${heading.variable} ${body.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: modeScript }} />
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
