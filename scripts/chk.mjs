import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs=[]; p.on("pageerror",e=>errs.push(e.message)); p.on("console",m=>{if(m.type()==="error")errs.push("C:"+m.text());});
await p.goto("http://localhost:5200/", { waitUntil: "networkidle" });
await p.waitForTimeout(2000);
const counts = await p.evaluate(()=>({
  calc:document.querySelectorAll(".calc").length,
  compare:document.querySelectorAll(".compare").length,
  pilot:document.querySelectorAll(".pilot").length,
  nfy:document.querySelectorAll(".nfy").length,
  demo:document.querySelectorAll(".demo").length,
  sections:document.querySelectorAll("section").length,
}));
console.log(JSON.stringify(counts));
console.log("errors:",errs.slice(0,5));
await b.close();
