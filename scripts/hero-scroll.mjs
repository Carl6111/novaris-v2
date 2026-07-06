import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto("http://localhost:5200/", { waitUntil: "networkidle" });
await page.waitForTimeout(3500);
const positions = [0, 0.25, 0.5, 0.75, 0.98];
for (const p of positions) {
  const y = await page.evaluate((pp) => {
    const hero = document.querySelector(".hero");
    return hero ? (hero.scrollHeight - window.innerHeight) * pp : 0;
  }, p);
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `${process.env.OUTDIR}/hero-${Math.round(p * 100)}.png` });
}
const canvases = await page.evaluate(() => document.querySelectorAll("canvas").length);
console.log("canvas count:", canvases, "| errors:", JSON.stringify(errors.slice(0, 5)));
await browser.close();
