// Smudge capture: drag the cursor across the (low) orbs on the hero and grab
// frames mid-drag, just after, and once healed. Usage: node scripts/shoot-smudge.mjs [label]
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const label = process.argv[2] || "smudge";
const outDir = `screenshots/${label}`;
mkdirSync(outDir, { recursive: true });
const URL = process.env.SHOOT_URL || "http://localhost:3000";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
page.on("pageerror", (e) => console.log("PAGEERROR:", e.message));
page.on("console", (m) => {
  const t = m.type();
  if (t === "error") console.log(`CONSOLE.${t}:`, m.text());
});

await page.goto(URL, { waitUntil: "networkidle" });
await page.waitForTimeout(2500);
await page.screenshot({ path: `${outDir}/00-before.png` });

// The orbs sit low on the hero — their visible tops are around y=700.
// Drag left -> right straight through them.
const y = 705;
await page.mouse.move(480, y);
const steps = 60;
for (let i = 0; i <= steps; i++) {
  const x = 480 + (1340 - 480) * (i / steps);
  await page.mouse.move(x, y - Math.sin((i / steps) * Math.PI) * 25);
  await page.waitForTimeout(12);
}
await page.screenshot({ path: `${outDir}/01-during.png` });

// A second, slower swirl back through the left orbs.
for (let i = 0; i <= steps; i++) {
  const x = 1340 - (1340 - 700) * (i / steps);
  await page.mouse.move(x, y + Math.sin((i / steps) * Math.PI) * 30);
  await page.waitForTimeout(16);
}
await page.screenshot({ path: `${outDir}/02-during2.png` });

await page.waitForTimeout(700);
await page.screenshot({ path: `${outDir}/03-healing.png` });
await page.waitForTimeout(2200);
await page.screenshot({ path: `${outDir}/04-healed.png` });

// Now scroll the orbs up to full view and drag across them so the smear is
// clearly readable on whole orbs (not just their tops).
await page.evaluate(() => window.scrollTo({ top: window.innerHeight * 0.72, behavior: "instant" }));
await page.waitForTimeout(1400);
await page.screenshot({ path: `${outDir}/05-risen-before.png` });
const y2 = 440;
await page.mouse.move(360, y2);
for (let i = 0; i <= 70; i++) {
  const x = 360 + (1340 - 360) * (i / 70);
  await page.mouse.move(x, y2 - Math.sin((i / 70) * Math.PI) * 35);
  await page.waitForTimeout(13);
  if (i === 30) await page.screenshot({ path: `${outDir}/06a-risen-mid.png` });
}
await page.screenshot({ path: `${outDir}/06-risen-during.png` });
await page.waitForTimeout(2600);
await page.screenshot({ path: `${outDir}/07-risen-healed.png` });

await browser.close();
console.log(`Shot ${outDir}`);
