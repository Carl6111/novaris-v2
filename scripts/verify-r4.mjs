import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
// capture EARLY paint to check no grass video flashes
await p.goto("http://localhost:5200/", { waitUntil: "domcontentloaded" });
await p.waitForTimeout(400);
await p.screenshot({ path: process.env.O + "/r4-hero-early.png" });
await p.waitForTimeout(3500);
await p.screenshot({ path: process.env.O + "/r4-hero-ready.png" });
// cta badges: scroll to bottom of home
await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await p.waitForTimeout(1500);
await p.screenshot({ path: process.env.O + "/r4-cta.png" });
// kontakt
await p.goto("http://localhost:5200/kontakt", { waitUntil: "networkidle" });
await p.waitForTimeout(1500);
await p.screenshot({ path: process.env.O + "/r4-kontakt.png" });
await b.close();
