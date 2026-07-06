import { chromium } from "playwright";
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:390,height:844}});
await p.goto("http://localhost:5200/kontakt",{waitUntil:"networkidle"});
await p.waitForTimeout(1200);
await p.screenshot({path:process.env.O+"/wiz-mobile.png"});
await b.close();
