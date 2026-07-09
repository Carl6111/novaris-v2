import { chromium } from "playwright";
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:1440,height:900}});
const errs=[]; p.on("pageerror",e=>errs.push(e.message));
await p.goto("http://localhost:5200/",{waitUntil:"networkidle"});
await p.waitForTimeout(2000);
const el=await p.$(".pkg");
if(!el){console.log("MISSING .pkg");}else{await el.scrollIntoViewIfNeeded();await p.waitForTimeout(1000);await p.screenshot({path:process.env.O+"/pkg.png"});}
console.log("errors:",errs.slice(0,3));
await b.close();
