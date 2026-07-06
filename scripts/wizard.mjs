import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs=[]; p.on("pageerror",e=>errs.push(e.message));
await p.goto("http://localhost:5200/kontakt", { waitUntil: "networkidle" });
await p.waitForTimeout(1200);
await p.screenshot({ path: process.env.O + "/wiz-1.png" });
// step1 multi: pick two, weiter
await p.click("text=Anfragen automatisieren");
await p.click("text=Rechnungen");
await p.click(".wizard-next");
await p.waitForTimeout(600);
await p.screenshot({ path: process.env.O + "/wiz-2.png" });
// step2 single: pick -> auto advance
await p.click("text=11–50");
await p.waitForTimeout(700);
await p.screenshot({ path: process.env.O + "/wiz-3.png" });
// step3 text
await p.fill(".wizard-input", "Angebote dauern ewig.");
await p.click(".wizard-next");
await p.waitForTimeout(500);
// step4 name
await p.fill(".wizard-input", "Max Mustermann");
await p.click(".wizard-next");
await p.waitForTimeout(400);
// step5 firma
await p.fill(".wizard-input", "Muster GmbH");
await p.click(".wizard-next");
await p.waitForTimeout(400);
// step6 email
await p.fill(".wizard-input", "max@muster.de");
await p.screenshot({ path: process.env.O + "/wiz-6.png" });
await p.click(".wizard-next");  // absenden (no web3 key -> done)
await p.waitForTimeout(900);
await p.screenshot({ path: process.env.O + "/wiz-done.png" });
const done = await p.$(".wizard--done");
console.log("done screen:", !!done, "| errors:", errs.slice(0,3));
await b.close();
