import sharp from "sharp";
import { readFileSync } from "node:fs";

const svg = readFileSync(new URL("../public/favicon.svg", import.meta.url));

for (const size of [192, 512]) {
  const out = new URL(`../public/pwa-${size}x${size}.png`, import.meta.url);
  await sharp(svg).resize(size, size).png().toFile(out);
  console.log(`wrote pwa-${size}x${size}.png`);
}
