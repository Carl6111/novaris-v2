import { chromium } from "playwright";
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:390,height:844}});
const errs=[]; p.on("pageerror",e=>errs.push(e.message));
await p.goto("http://localhost:5200/",{waitUntil:"networkidle"});
await p.waitForTimeout(1500);
await p.screenshot({path:process.env.O+"/burger-closed.png",clip:{x:250,y:0,width:140,height:70}});
await p.click(".nav-burger");
await p.waitForTimeout(700);
await p.screenshot({path:process.env.O+"/burger-menu.png"});
// hover second link
const links=await p.$$(".nav-overlay-links a");
await links[1].hover();
await p.waitForTimeout(600);
await p.screenshot({path:process.env.O+"/burger-hover.png"});
// nav to preise
await links[1].click();
await p.waitForTimeout(900);
console.log("url:",p.url(),"| errors:",errs.slice(0,3));
await b.close();
