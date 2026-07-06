import { chromium } from "playwright";

const BASE = process.env.BASE || "http://localhost:5300";
const OUTDIR = process.env.OUTDIR || "/tmp";

// copy verbatim from old repo — every string must appear in the rendered page
const EXPECT = {
  "/": [
    "// Growth Engine+",
    "// Sieh es in Aktion",
    "90 Sekunden.",
    "Ein System bei der Arbeit.",
    "Erkennen Sie sich",
    "Anfragen bleiben Stunden liegen.",
    "Angebote schreibst du abends. Von Hand.",
    "Rechnungen gehen zu spät raus.",
    "Niemand weiß, wo ein Lead gerade steht.",
    "Das Team ertrinkt im Kleinkram.",
    "Wachstum hieße bisher: neu einstellen.",
    "Euer ganzer Betrieb.",
    "Ein Login.",
    "Website, CRM, AI Docs, Client Portal und Invoicing — kein Tool-Chaos mehr. Alles greift ineinander, alles in eurer Hand.",
    "Plattform ansehen",
    "Dein Betrieb —",
    "ein Organismus.",
    "Sechs Teile, ein Herzschlag. Alles verbunden, alles automatisch — wie ein lebendiger Körper.",
    "// Was sich ändert",
    "bis Anfragen beantwortet sind — nicht Stunden.",
    "läuft euer Betrieb. Auch nachts und am Wochenende.",
    "für Website, CRM, Docs, Portal & Rechnungen.",
    "Gebaut auf bewährter Technik — keine Klick-Tools.",
    "Lass uns",
    "15 Minuten",
    "Wir schauen gemeinsam, wo euer System am meisten Zeit spart",
    "Gespräch buchen",
    "KI-Systeme, die euren Betrieb täglich entlasten.",
    "Gebaut mit echtem Code & echter KI.",
    "Monatlich kündbar",
    "Keine Kreditkarte nötig",
  ],
  "/plattform": [
    "// Die Plattform",
    "Euer ganzer Betrieb.",
    "Ein System.",
    "Fünf Werkzeuge, die sonst getrennt laufen — gebündelt, automatisiert, in eurer Hand.",
    "Gefunden,",
    "nicht gesucht.",
    "Eine schnelle, moderne Seite — sichtbar auf Google und in KI-Suchen. Euer erster Eindruck arbeitet für euch.",
    "Jeder Lead",
    "an einem Ort.",
    "Kontakte, Anfragen und Status — automatisch erfasst, sortiert und nie wieder vergessen.",
    "Angebote, die sich",
    "selbst schreiben.",
    "Doku und Angebote entstehen aus euren Daten — in Minuten statt Abenden.",
    "Ein Zuhause",
    "für eure Kunden.",
    "Status, Dateien, Rechnungen — alles auf einen Blick. Weniger Rückfragen, mehr Vertrauen.",
    "Rechnungen,",
    "die rausgehen.",
    "Automatisch erstellt und versendet — niemand muss mehr dran denken.",
    "Gebaut, nicht",
    "zusammengeklickt.",
    "Keine Klick-Tools wie Make, Zapier oder n8n. Echter Code, echte KI-Agents — und alles gehört euch.",
    "So sieht ein Agent im Alltag aus.",
    "Lead-Capture",
    "Anfrage rein",
    "qualifizierte Antwort",
    "Eintrag im CRM",
    "In Minuten statt Stunden. Kein Lead bleibt liegen.",
    "Support-Agent",
    "Beantwortet Kundenfragen 24/7, eskaliert nur das Komplexe.",
    "Reporting-Agent",
    "Conversion, Antwortzeit, Lead-Qualität — automatisch.",
    "Von der Analyse bis zum Betrieb.",
    "Wir schauen, wo Zeit und Anfragen verloren gehen.",
    "Wir bauen euer System auf eurem echten Prozess.",
    "Es läuft mit euren Tools und eurem Team.",
    "Wir betreuen, optimieren und erweitern — monatlich.",
  ],
  "/preise": [
    "// Pakete",
    "Klein anfangen.",
    "Groß wachsen.",
    "Alle Preise sind Richtwerte. Wir schnüren das Paket auf euren echten Prozess.",
    "// Missions-Klassen",
    "Drei Größenordnungen",
    "Schub.",
    "Nova",
    "Klasse I · Zündung",
    "Auf Anfrage",
    "Eure erste Automatisierung, richtig gebaut.",
    "1 Kernprozess end-to-end automatisiert",
    "Bis zu 3 Tool-Integrationen",
    "Pulsar",
    "Klasse II · Rotation",
    "Beliebt",
    "Eine Automatisierungs-Engine über eure Abläufe.",
    "3–5 Prozesse + 1 individueller KI-Agent",
    "Datenpipeline + Reporting-Ebene",
    "Quasar",
    "Klasse III · Leuchtkern",
    "Eine vollautonome Operations-Ebene.",
    "Unbegrenzte Prozesse + Agent-Flotte",
    "Eigene Modelle auf euren Daten",
    "Eingebettetes Team, SLA, 24/7-Überwachung",
    "In jedem Paket",
    "enthalten.",
    "Echter Code",
    "Keine Klick-Tools wie Make, Zapier oder n8n. Das System gehört euch.",
    "DSGVO-konform",
    "Eure Daten bleiben eure Daten — sauber gehostet, sauber dokumentiert.",
    "Laufende Betreuung",
    "Wir bauen nicht nur — wir optimieren und erweitern jeden Monat.",
    "Monatlich",
    "Klare monatliche Pakete. Keine versteckten Setup-Fallen.",
    "Häufige Fragen.",
    "Was kostet das?",
    "Wie lange dauert der Aufbau?",
    "Brauchen wir technisches Wissen?",
    "Warum kein Make oder Zapier?",
    "Was ist mit Datenschutz?",
    "Kann ich monatlich kündigen?",
  ],
  "/ueber": [
    "// Novaris",
    "Mehr Output.",
    "Gleiches Team.",
    "Wir bringen ambitionierte Betriebe aufs nächste Level — mit KI-Agents, die echte Arbeit übernehmen.",
    "Die meisten Agenturen verkaufen Werkzeuge. Wir bauen",
    "Novaris baut KI-Systeme, die Arbeit wirklich abnehmen",
    "Echt statt Schein",
    "Echter Code und echte KI-Agents — keine Klick-Tools, die beim ersten Update brechen.",
    "Wenige, tiefe Lösungen",
    "Wir bauen nicht alles. Wir bauen das Richtige — und das richtig.",
    "Partner, kein Lieferant",
    "Wir betreuen, optimieren und wachsen mit eurem Betrieb. Jeden Monat.",
    "Technik soll arbeiten.",
    "Nicht ihr.",
  ],
  "/kontakt": [
    "// 15 Minuten",
    "Lass uns",
    "reden.",
    "Kurzes Gespräch",
    "15 Minuten. Wir hören zu, wo bei euch Zeit verloren geht.",
    "Klarer Vorschlag",
    "Ihr bekommt einen konkreten Plan — kein Verkaufsgerede.",
    "Wir bauen",
    "Schritt für Schritt, ohne euren Betrieb zu stören.",
    "Name",
    "E-Mail oder Telefon",
    "Worum geht's?",
    "Gespräch anfragen",
    "Antwort in 24 h",
  ],
};

const browser = await chromium.launch();
let failures = 0;

for (const reduced of [false, true]) {
  for (const width of [1440, 390]) {
    const ctx = await browser.newContext({
      viewport: { width, height: width < 500 ? 844 : 900 },
      reducedMotion: reduced ? "reduce" : "no-preference",
    });
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));

    for (const [route, strings] of Object.entries(EXPECT)) {
      await page.goto(BASE + route, { waitUntil: "networkidle" });
      await page.waitForTimeout(reduced ? 700 : 2200);
      const text = await page.evaluate(() => document.body.innerText);
      const lower = text.toLowerCase();
      const missing = strings.filter((s) => !lower.includes(s.toLowerCase()));
      const slug = route === "/" ? "home" : route.slice(1);
      const tag = `${slug}-${width}${reduced ? "-rm" : ""}`;
      if (missing.length) {
        failures++;
        console.log(`FAIL ${tag}: missing ${JSON.stringify(missing.slice(0, 4))}`);
      } else {
        console.log(`OK   ${tag}`);
      }
      await page.screenshot({ path: `${OUTDIR}/qa-${tag}.png` });
    }
    if (errors.length) console.log(`JS ERRORS (${width}${reduced ? " rm" : ""}):`, errors.slice(0, 3));
    await ctx.close();
  }
}

await browser.close();
console.log(failures ? `\n${failures} FAILURES` : "\nALL PASS");
process.exit(failures ? 1 : 0);
