import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 } });
await p.goto("http://localhost:5200/", { waitUntil: "networkidle" });
await p.waitForTimeout(1200);
await p.click(".nav-burger");
await p.waitForTimeout(500);
// pointer-events of overlay?
const pe = await p.evaluate(() => {
  const o = document.querySelector(".nav-overlay");
  return o ? getComputedStyle(o).pointerEvents : "no-overlay";
});
console.log("overlay pointer-events:", pe);
// what's at the Preise link position
const link = await p.$(".nav-overlay-links a:nth-child(1)");
// try clicking Preise (2nd link)
const preise = (await p.$$(".nav-overlay-links a"))[1];
const box = preise ? await preise.boundingBox() : null;
let hit="none";
if(box){ hit = await p.evaluate(({x,y})=>{const e=document.elementFromPoint(x,y);return e?e.className+" <"+e.tagName+">":"none";},{x:box.x+box.width/2,y:box.y+box.height/2}); }
console.log("element at Preise link:", hit);
await b.close();
