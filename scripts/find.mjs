import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto("http://localhost:5200/", { waitUntil: "networkidle" });
await p.waitForTimeout(2500);
const y = await p.evaluate(() => {
  const d = document.getElementById("demo");
  return d ? d.getBoundingClientRect().top + window.scrollY : -1;
});
console.log("demo top:", y);
await p.evaluate((yy) => window.scrollTo(0, yy - 40), y);
await p.waitForTimeout(1500);
await p.screenshot({ path: process.env.OUTDIR + "/r3-demo2.png" });
// constellation check: scroll into problems (transparent) area
await p.evaluate((yy) => window.scrollTo(0, yy + 700), y);
await p.waitForTimeout(1500);
await p.screenshot({ path: process.env.OUTDIR + "/r3-constellation.png" });
await b.close();
