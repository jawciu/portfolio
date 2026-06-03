// Capture a time sequence to inspect animation extremes (merge breathing, orb-1 wax/wane).
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
const label = process.argv[2] || "seq";
const outDir = `screenshots/${label}`;
mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(2000);
// merge cycle ~ 2pi/0.28 ~ 22s; sample 8 frames ~3s apart to span it
for (let i = 0; i < 8; i++) {
  await page.screenshot({ path: `${outDir}/f${i}.png` });
  await page.waitForTimeout(2900);
}
await browser.close();
console.log("done", outDir);
