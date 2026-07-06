import { chromium } from "playwright";

// captures rapid frames at a fixed scroll position and reports how much
// consecutive frames differ — big jumps = visible flicker
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 900, height: 640 } });
await page.goto("http://localhost:5200/", { waitUntil: "networkidle" });
await page.waitForTimeout(3500);
const y = Number(process.env.SCROLL_Y || 0);
if (y) {
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(1500);
}

const frames = [];
for (let i = 0; i < 14; i++) {
  frames.push(await page.screenshot({ type: "png" }));
  await page.waitForTimeout(90);
}
await browser.close();

// decode PNGs via sharp and diff raw pixels
const { default: sharp } = await import("sharp");
let prev = null;
const diffs = [];
for (const f of frames) {
  const raw = await sharp(f).raw().toBuffer();
  if (prev) {
    let acc = 0;
    // sample every 16th byte for speed
    for (let i = 0; i < raw.length; i += 16) acc += Math.abs(raw[i] - prev[i]);
    diffs.push(Math.round(acc / (raw.length / 16)));
  }
  prev = raw;
}
console.log("mean-abs-diff per frame pair:", diffs.join(" "));
console.log("avg:", Math.round(diffs.reduce((a, b) => a + b, 0) / diffs.length));
