import { chromium } from "playwright";
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:1440,height:900}});
await p.goto("http://localhost:5200/",{waitUntil:"networkidle"});
await p.waitForTimeout(3000);
// nav logo closeup
await p.screenshot({ path: process.env.O+"/fin-nav.png", clip:{x:400,y:0,width:640,height:70} });
// hero finale ~98%
const y=await p.evaluate(()=>{const h=document.querySelector(".hero");return (h.scrollHeight-innerHeight)*0.99;});
await p.evaluate((yy)=>window.scrollTo(0,yy),y);
await p.waitForTimeout(1400);
await p.screenshot({ path: process.env.O+"/fin-hero.png" });
// footer
await p.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));
await p.waitForTimeout(1000);
await p.screenshot({ path: process.env.O+"/fin-footer.png", clip:{x:0,y:520,width:720,height:380} });
await b.close();
