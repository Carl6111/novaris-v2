import { chromium } from "playwright";
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:1440,height:900}});
await p.goto("http://localhost:5200/",{waitUntil:"networkidle"});
await p.waitForTimeout(3000);
for(const frac of [0,0.25,0.5,0.75]){
  const y = await p.evaluate((f)=>{const h=document.querySelector(".hero");return (h.scrollHeight-innerHeight)*f;},frac);
  await p.evaluate((yy)=>window.scrollTo(0,yy),y);
  await p.waitForTimeout(1200);
  const info = await p.evaluate(()=>{
    const g=(s)=>{const e=document.querySelector(s);return e?getComputedStyle(e).opacity:"NA";};
    return {scrollY:Math.round(scrollY), open:g(".hero-open"), beatA:getComputedStyle(document.querySelectorAll(".hero-beat")[0]).opacity, beatB:getComputedStyle(document.querySelectorAll(".hero-beat")[1]).opacity, final:g(".hero-final")};
  });
  console.log(frac, JSON.stringify(info));
}
await b.close();
