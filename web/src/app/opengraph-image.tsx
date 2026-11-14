import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { brand, hero } from "@/content/site";
import { LOGO_PATH, LOGO_VIEWBOX } from "@/components/ui/Logo";

const logo = `data:image/svg+xml;base64,${Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${LOGO_VIEWBOX}"><path fill="#fff" d="${LOGO_PATH}"/></svg>`).toString("base64")}`;

// Превʼю посилання в Telegram, Viber, Facebook, LinkedIn і Google (1200×630). Генерується під час збірки.
export const alt = `${brand.name} — ${brand.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const font = await readFile(join(process.cwd(), "src/assets/fonts/WixMadeforDisplay-SemiBold.ttf"));
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 80, background: "#0A0A0A", color: "#fff", fontFamily: "Wix" }}>
        <img src={logo} width={159} height={50} alt={brand.name} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          {hero.titleLines.map((line) => (
            <div key={line} style={{ fontSize: 88, lineHeight: 1.05, letterSpacing: -2 }}>{line}</div>
          ))}
          <div style={{ marginTop: 32, fontSize: 32, color: "#9a9a9a" }}>{brand.tagline}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, color: "#9a9a9a", borderTop: "1px solid #2a2a2a", paddingTop: 28 }}>
          <span>Онлайн по всій Україні</span>
          <span style={{ color: "#fff" }}>{brand.phone}</span>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Wix", data: font, weight: 600, style: "normal" }] },
  );
}
