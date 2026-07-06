import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 } });
const errs=[]; p.on("pageerror",e=>errs.push(e.message));
await p.goto("http://localhost:5200/", { waitUntil: "networkidle" });
await p.waitForTimeout(1500);
const burger = await p.$(".nav-burger");
console.log("burger found:", !!burger);
const box = burger ? await burger.boundingBox() : null;
console.log("burger box:", JSON.stringify(box));
// what element is at the burger's center?
if (box) {
  const hit = await p.evaluate(({x,y}) => {
    const el = document.elementFromPoint(x,y);
    return el ? el.className + " <" + el.tagName + ">" : "none";
  }, {x: box.x+box.width/2, y: box.y+box.height/2});
  console.log("element at burger center:", hit);
}
await burger?.click({force:false}).catch(e=>console.log("click err:",e.message));
await p.waitForTimeout(600);
const overlay = await p.$(".nav-overlay");
console.log("overlay after click:", !!overlay);
await p.screenshot({ path: process.env.O + "/burger-open.png" });
console.log("errors:", errs.slice(0,3));
await b.close();
