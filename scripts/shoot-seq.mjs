// Capture a time sequence to inspect animation extremes.
// usage: node scripts/shoot-seq.mjs <label> [intervalMs] [count]
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
const label = process.argv[2] || "seq";
const interval = Number(process.argv[3] || 2900);
const count = Number(process.argv[4] || 8);
const outDir = `screenshots/${label}`;
mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(2000);
for (let i = 0; i < count; i++) {
  await page.screenshot({ path: `${outDir}/f${String(i).padStart(2, "0")}.png` });
  await page.waitForTimeout(interval);
}
await browser.close();
console.log("done", outDir);
