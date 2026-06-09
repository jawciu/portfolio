// Screenshot harness for the hero. Captures the hero at several scroll
// positions so the Creative Director + 3D reviewer can judge motion/composition.
// Usage: node scripts/shoot.mjs [label]
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const label = process.argv[2] || "round";
const outDir = `screenshots/${label}`;
mkdirSync(outDir, { recursive: true });

const URL = process.env.SHOOT_URL || "http://localhost:3000";

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});

page.on("pageerror", (e) => console.log("PAGEERROR:", e.message));
page.on("console", (m) => {
  const t = m.type();
  if (t === "error" || t === "warning") console.log(`CONSOLE.${t}:`, m.text());
});

await page.goto(URL, { waitUntil: "networkidle" });
// Let the WebGL scene warm up + animations settle into motion.
await page.waitForTimeout(2500);

// Top of page.
await page.screenshot({ path: `${outDir}/01-top.png` });

// A couple of seconds later to catch animation in a different phase.
await page.waitForTimeout(1800);
await page.screenshot({ path: `${outDir}/02-top-later.png` });

// Scroll progress samples (drives glass morph + canvas fade).
for (const [i, frac] of [0.25, 0.5, 0.85].entries()) {
  await page.evaluate((f) => {
    window.scrollTo({ top: window.innerHeight * f, behavior: "instant" });
  }, frac);
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `${outDir}/0${i + 3}-scroll-${Math.round(frac * 100)}.png` });
}

await browser.close();
console.log(`Shot ${outDir}`);
