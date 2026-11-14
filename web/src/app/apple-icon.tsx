import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Іконка для «На початковий екран» на iPhone (180×180). iOS сам заокруглює кути, тому — повний квадрат.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const svg = (await readFile(join(process.cwd(), "src/app/icon.svg"), "utf8")).replace(' rx="224"', "");
  return new ImageResponse(
    <img src={`data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`} width={180} height={180} alt="" />,
    size,
  );
}
