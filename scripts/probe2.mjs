import { chromium } from "playwright";
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:1440,height:900}});
await p.goto("http://localhost:5200/",{waitUntil:"networkidle"});
await p.waitForTimeout(3000);
for(const frac of [0.5,0.85,0.98]){
  const y=await p.evaluate((f)=>{const h=document.querySelector(".hero");return (h.scrollHeight-innerHeight)*f;},frac);
  await p.evaluate((yy)=>window.scrollTo(0,yy),y);
  await p.waitForTimeout(1200);
  const info=await p.evaluate(()=>{
    const veil=document.querySelector(".hero-veil");
    const wm=document.querySelector(".hero-wordmark");
    const tag=document.querySelector(".hero-tagline");
    return {veil:getComputedStyle(veil).opacity, wm:getComputedStyle(wm).opacity, tag:getComputedStyle(tag).opacity};
  });
  console.log(frac, JSON.stringify(info));
}
await b.close();
