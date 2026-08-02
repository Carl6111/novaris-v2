/**
 * Prerender-Snapshot nach dem Vite-Build.
 *
 * Die Seite ist eine Client-Side-SPA: das ausgelieferte index.html enthält
 * sieben Wörter und kein <h1>. AI-Crawler (GPTBot, OAI-SearchBot,
 * PerplexityBot, ClaudeBot) führen kein JavaScript aus und sehen deshalb nichts.
 *
 * Dieses Skript fährt jede öffentliche Route mit einem echten Browser an und
 * legt das fertig gerenderte DOM als dist/<route>/index.html ab. Vercel bedient
 * statische Dateien vor den Rewrites, also liefert /plattform danach echtes
 * HTML statt der leeren Shell. React bootet im Browser unverändert darüber.
 *
 * Der Browser läuft mit prefers-reduced-motion: reduce. Der App-Code fragt das
 * an 38 Stellen ab — unter anderem in Reveal, das sonst allen Inhalt unterhalb
 * des Viewports mit opacity: 0 einfriert, und im IntroOverlay. Damit entsteht
 * ohne einen einzigen Eingriff in den App-Code statisches, voll sichtbares Markup.
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sparticuz from "@sparticuz/chromium";
import { chromium } from "playwright";
import { preview } from "vite";
import { ROUTES } from "../src/lib/seo";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const SITE = "https://lunakris.de";

/** Assets, die für das gerenderte Markup nichts beitragen und den Snapshot nur bremsen. */
const SKIP_ASSET = /\.(mp4|webm|glb|gltf|hdr|bin|ktx2)(\?|$)/i;

const RENDER_TIMEOUT_MS = 30_000;

function outFileFor(routePath: string): string {
  return routePath === "/"
    ? path.join(DIST, "index.html")
    : path.join(DIST, routePath.slice(1), "index.html");
}

function sitemapXml(): string {
  const today = new Date().toISOString().slice(0, 10);
  const urls = ROUTES.filter((r) => r.sitemap)
    .map((r) => {
      const loc = r.path === "/" ? `${SITE}/` : `${SITE}${r.path}`;
      return [
        "  <url>",
        `    <loc>${loc}</loc>`,
        `    <lastmod>${today}</lastmod>`,
        r.changefreq ? `    <changefreq>${r.changefreq}</changefreq>` : null,
        r.priority ? `    <priority>${r.priority}</priority>` : null,
        "  </url>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

/**
 * Ohne passenden Rewrite in vercel.json fängt der SPA-Catch-All die Route ab und
 * liefert wieder die Home-Shell — die Datei läge da, würde aber nie ausgeliefert.
 * Das fiele sonst erst auf, wenn Wochen später kein Ranking entsteht.
 */
async function assertRewrites(paths: string[]) {
  const raw = await readFile(path.join(ROOT, "vercel.json"), "utf8");
  const config = JSON.parse(raw) as {
    rewrites?: { source: string; destination: string }[];
  };
  const sources = new Set((config.rewrites ?? []).map((r) => r.source));
  const missing = paths.filter((p) => p !== "/" && !sources.has(p));
  if (missing.length > 0) {
    throw new Error(
      `vercel.json fehlt ein Rewrite für: ${missing.join(", ")} — ` +
        `je Route { "source": "<pfad>", "destination": "<pfad>/index.html" } vor dem Catch-All eintragen.`,
    );
  }
}

async function main() {
  const targets = ROUTES.filter((r) => r.prerender);
  await assertRewrites(targets.map((r) => r.path));

  const server = await preview({
    root: ROOT,
    preview: { port: 4180, strictPort: true, open: false },
    logLevel: "warn",
  });
  const origin = server.resolvedUrls?.local[0]?.replace(/\/$/, "");
  if (!origin) throw new Error("Preview-Server hat keine lokale URL gemeldet.");

  // Auf Vercel fehlen die Systembibliotheken fuer das Playwright-Chromium
  // (libnspr4 & Co.). @sparticuz/chromium bringt einen Build mit, der die
  // Bibliotheken mitliefert — dafuer ist er gemacht.
  const browser = process.env.VERCEL
    ? await chromium.launch({
        args: sparticuz.args,
        executablePath: await sparticuz.executablePath(),
      })
    : await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route(SKIP_ASSET, (route) => route.abort());

  // Erst alle Snapshots sammeln, dann schreiben — sonst würde der laufende
  // Preview-Server ab der zweiten Route bereits die eigenen Ausgaben ausliefern.
  const snapshots = new Map<string, string>();

  try {
    for (const route of targets) {
      await page.goto(`${origin}${route.path}`, {
        waitUntil: "domcontentloaded",
        timeout: RENDER_TIMEOUT_MS,
      });
      await page.waitForFunction(
        () => (document.querySelector("#root")?.textContent?.length ?? 0) > 400,
        undefined,
        { timeout: RENDER_TIMEOUT_MS },
      );
      await page.waitForLoadState("networkidle", { timeout: RENDER_TIMEOUT_MS });

      const html = await page.evaluate(() => document.documentElement.outerHTML);
      snapshots.set(route.path, `<!doctype html>\n${html}\n`);

      // Reine Plausibilitätsschwelle gegen "React hat gar nicht gerendert" — die
      // Rechtsseiten sind von Natur aus kurz, die leere Shell hat sieben Wörter.
      const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
      if (words < 80) {
        throw new Error(
          `${route.path} hat nur ${words} Wörter im Snapshot — Render vermutlich unvollständig.`,
        );
      }
      process.stdout.write(`prerender ${route.path.padEnd(14)} ${words} Wörter\n`);
    }
  } finally {
    await browser.close();
    await server.close();
  }

  for (const [routePath, html] of snapshots) {
    const file = outFileFor(routePath);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, html, "utf8");
  }

  await writeFile(path.join(DIST, "sitemap.xml"), sitemapXml(), "utf8");
  process.stdout.write(
    `sitemap.xml  ${ROUTES.filter((r) => r.sitemap).length} URLs\n`,
  );
}

main().catch((err: unknown) => {
  process.stderr.write(`${err instanceof Error ? err.stack : String(err)}\n`);
  process.exit(1);
});
