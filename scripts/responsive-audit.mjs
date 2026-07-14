// responsive audit: element-rect overflow check + screenshots + tap targets + hero scrub
// usage: node scripts/responsive-audit.mjs [--route=/preise] [--widths=320,390] [--section=.calc] [--hero] [--taps]
// env: BASE (default http://localhost:5300), OUTDIR (default /tmp)
import { chromium } from "playwright";

const BASE = process.env.BASE || "http://localhost:5300";
const OUTDIR = process.env.OUTDIR || "/tmp";

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  }),
);

const ROUTES = args.route
  ? [args.route]
  : ["/", "/plattform", "/preise", "/ueber", "/kontakt", "/impressum", "/datenschutz", "/agb"];

// width -> device height
const HEIGHTS = { 320: 568, 375: 667, 390: 844, 430: 932, 768: 1024, 1024: 768, 1440: 900, 1920: 1080 };
const WIDTHS = (args.widths ? String(args.widths).split(",").map(Number) : [320, 375, 390, 430]).filter(
  (w) => HEIGHTS[w],
);

// decorative full-bleed layers that intentionally exceed the viewport
const WHITELIST = [
  ".grain",
  ".vignette",
  ".hero-shade",
  ".integrations-track",
  ".doodle-orbit", // decorative hand-drawn orbit, intentionally overshoots its anchor
  ".doodle-sketchcircle",
  "canvas",
  "[data-overflow-ok]",
];

const slug = (r) => (r === "/" ? "home" : r.replace(/\//g, ""));

// runs in page context: report elements whose rect exceeds the viewport horizontally
const overflowCheck = (whitelist) => {
  const vw = window.innerWidth;
  const offenders = [];
  for (const el of document.querySelectorAll("body *")) {
    if (whitelist.some((sel) => el.matches(sel) || el.closest(sel))) continue;
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || cs.position === "fixed") continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    if (r.right <= vw + 1 && r.left >= -1) continue;
    // skip if a real ancestor clips it (not html/body — body uses overflow-x: clip as safety net)
    let clipped = false;
    for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
      const ov = getComputedStyle(a).overflowX;
      if (ov === "hidden" || ov === "clip" || ov === "auto" || ov === "scroll") {
        clipped = true;
        break;
      }
    }
    if (clipped) continue;
    const cls = el.className && typeof el.className === "string" ? "." + el.className.split(" ")[0] : "";
    offenders.push(
      `${el.tagName.toLowerCase()}${cls} right=${Math.round(r.right)} left=${Math.round(r.left)} vw=${vw}`,
    );
  }
  return offenders.slice(0, 10);
};

// runs in page context: interactive elements smaller than 44px in both dimensions
const tapCheck = () => {
  const out = [];
  for (const el of document.querySelectorAll("a, button, input, select, textarea, [role=button]")) {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    // inline links inside paragraphs are exempt
    if (el.tagName === "A" && el.closest("p")) continue;
    if (r.width < 44 && r.height < 44) {
      const cls = el.className && typeof el.className === "string" ? "." + el.className.split(" ")[0] : "";
      out.push(`${el.tagName.toLowerCase()}${cls} ${Math.round(r.width)}x${Math.round(r.height)}`);
    }
  }
  return out.slice(0, 15);
};

const browser = await chromium.launch();
let failures = 0;

for (const width of WIDTHS) {
  const ctx = await browser.newContext({
    viewport: { width, height: HEIGHTS[width] },
    isMobile: width < 768,
    hasTouch: width < 768,
    deviceScaleFactor: width < 768 ? 2 : 1,
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));

  for (const route of ROUTES) {
    const tag = `${slug(route)}-${width}`;
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    await page.waitForTimeout(2200);

    if (args.hero && route === "/") {
      // scrub the hero like hero-scroll.mjs, at this width
      for (const p of [0, 0.25, 0.5, 0.75, 0.98]) {
        const y = await page.evaluate((pp) => {
          const hero = document.querySelector(".hero");
          return hero ? (hero.scrollHeight - window.innerHeight) * pp : 0;
        }, p);
        await page.evaluate((yy) => window.scrollTo(0, yy), y);
        await page.waitForTimeout(1400);
        await page.screenshot({ path: `${OUTDIR}/hero-${width}-${Math.round(p * 100)}.png` });
      }
      const info = await page.evaluate(() => ({
        canvases: document.querySelectorAll("canvas").length,
        dpr: window.devicePixelRatio,
      }));
      console.log(`HERO ${tag}: canvases=${info.canvases} dpr=${info.dpr}`);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(600);
    }

    // scroll through the page so lazy/Reveal content mounts before checks
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.8;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(900);

    const offenders = await page.evaluate(overflowCheck, WHITELIST);
    if (offenders.length) {
      failures++;
      console.log(`FAIL overflow ${tag}`);
      for (const o of offenders) console.log(`  ${o}`);
    } else {
      console.log(`PASS overflow ${tag}`);
    }

    if (args.taps) {
      const taps = await page.evaluate(tapCheck);
      if (taps.length) {
        console.log(`TAPS ${tag} (<44px, advisory):`);
        for (const t of taps) console.log(`  ${t}`);
      }
    }

    if (args.section) {
      const els = page.locator(String(args.section));
      const n = await els.count();
      for (let i = 0; i < n; i++) {
        await els.nth(i).scrollIntoViewIfNeeded();
        await page.waitForTimeout(900);
        await els.nth(i).screenshot({ path: `${OUTDIR}/sec-${tag}-${i}.png` }).catch(() => {});
      }
    } else {
      await page.screenshot({ path: `${OUTDIR}/full-${tag}.png`, fullPage: true });
    }
  }

  if (errors.length) console.log(`JS ERRORS (${width}):`, errors.slice(0, 3));
  await ctx.close();
}

await browser.close();
console.log(failures ? `\n${failures} OVERFLOW FAILURES` : "\nALL PASS");
process.exit(failures ? 1 : 0);
