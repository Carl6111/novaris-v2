import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto("http://localhost:5300/preise", { waitUntil: "networkidle" });
await page.waitForTimeout(2000);
const info = await page.evaluate(() => {
  const el = document.querySelector(".price-badge");
  if (!el) return "NO ELEMENT";
  const cs = getComputedStyle(el);
  const r = el.getBoundingClientRect();
  return { text: el.textContent, innerText: el.innerText, display: cs.display, vis: cs.visibility, opacity: cs.opacity, rect: [r.width, r.height], parentOpacity: getComputedStyle(el.parentElement).opacity };
});
console.log(JSON.stringify(info));
await browser.close();
