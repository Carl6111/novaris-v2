import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs=[]; p.on("pageerror",e=>errs.push(e.message));
await p.goto("http://localhost:5200/", { waitUntil: "networkidle" });
await p.waitForTimeout(2500);
const ids = ["calc","compare","pilot","nfy"];
// scroll through and shoot each new section by class
for (const cls of [".calc",".compare",".pilot",".nfy"]) {
  const el = await p.$(cls);
  if(!el){ console.log("MISSING",cls); continue; }
  await el.scrollIntoViewIfNeeded();
  await p.waitForTimeout(900);
  await p.screenshot({ path: process.env.O + "/sec-"+cls.slice(1)+".png" });
}
// legal
await p.goto("http://localhost:5200/impressum", { waitUntil:"networkidle" });
await p.waitForTimeout(600);
await p.screenshot({ path: process.env.O + "/sec-impressum.png" });
// footer
await p.goto("http://localhost:5200/", { waitUntil:"networkidle" });
await p.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));
await p.waitForTimeout(900);
await p.screenshot({ path: process.env.O + "/sec-footer.png" });
console.log("errors:", errs.slice(0,4));
await b.close();
