// Clipped time sequence of a region. usage: node shoot-clip.mjs label x y w h startT stepMs count
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
const [label,x,y,w,h,stepMs,count] = process.argv.slice(2);
const outDir = `screenshots/${label}`;
mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(2000);
const clip = { x: +x, y: +y, width: +w, height: +h };
for (let i = 0; i < +count; i++) {
  await page.screenshot({ path: `${outDir}/c${String(i).padStart(2,"0")}.png`, clip });
  await page.waitForTimeout(+stepMs);
}
await browser.close();
console.log("done", outDir);
