import { chromium } from "playwright";

const BASE = process.env.BASE || "http://localhost:5300";
const OUTDIR = process.env.OUTDIR || "/tmp";

/**
 * Ankertexte, die auf jeder Seite stehen müssen.
 *
 * Bewusst eine Auswahl statt der vollständigen Kopie: die alte Fassung führte
 * jeden Satz wörtlich und war nach der Umstellung auf die Sie-Form komplett
 * rot, ohne dass an der Seite etwas kaputt war. Hier stehen nur die Stellen,
 * deren Verschwinden echten Schaden bedeutet — Überschriften, Kernversprechen,
 * Handlungsaufrufe, Rechtliches.
 *
 * Nicht aufnehmen: alles was animiert hochzählt (die Zähler unter
 * "Was sich ändert" starten bei 0) und alles was Clerk rendert und sich mit
 * einem Dashboard-Schalter ändern kann (etwa die Namensfelder, die nur die
 * Produktionsinstanz verlangt).
 */
const EXPECT = {
  "/": [
    "// Lunakris",
    "80 Stunden weniger Admin.",
    "Jeden Monat.",
    "Hinter jeder Galaxie steckt Ordnung.",
    "Hinter jedem erfolgreichen Unternehmen auch.",
    "Kommt Ihnen das bekannt vor?",
    "Anfragen bleiben Stunden liegen.",
    "Angebote schreiben Sie abends. Von Hand.",
    "Der Anruf um 18:40 Uhr landet auf der Mailbox.",
    "Niemand weiß, wo ein Lead gerade steht.",
    "Mehr Aufträge hieße bisher: neu einstellen.",
    "// Eine Plattform",
    "Ihr ganzer Betrieb. Ein Login.",
    "Website, CRM, AI Docs, Client Portal und Anruf-Agent",
    "// Zeitspar-Rechner",
    "Was holen Sie im Monat zurück?",
    "Teamgröße",
    "Interner Stundensatz",
    "Potenzial prüfen",
    "// Drei Klassen",
    "Wählen Sie Ihre Umlaufbahn.",
    "Pakete ansehen",
    "Plattform ansehen",
    "// Was sich ändert",
    "// Die Rechnung",
    "Neue Stelle oder ein System?",
    "Neue Einstellung",
    "// Pilotphase",
    "2 Pilotplätze.",
    "Pilotplatz sichern",
    "// Ehrlich gesagt",
    "Nicht für Sie, wenn",
    "// Unverbindlich",
    "Lassen Sie uns 15 Minuten reden.",
    "Gespräch buchen",
    "KI-Systeme, die Ihren Betrieb täglich entlasten.",
    "Monatlich kündbar",
    "DSGVO-konform",
    "Antwort in 24 h",
    "Impressum",
    "Datenschutz",
    "AGB",
  ],
  "/plattform": [
    "// Die Plattform",
    "Ihr ganzer Betrieb. Ein System.",
    "Fünf Werkzeuge, die sonst getrennt laufen, hinter einem Login.",
    "Website",
    "Gefunden, nicht gesucht.",
    "CRM",
    "Jeder Lead an einem Ort.",
    "AI Docs",
    "Angebote, die sich selbst schreiben.",
    "Client Portal",
    "Ein Zuhause für Ihre Kunden.",
    "Anruf-Agent",
    "Kein Anruf geht verloren.",
    "// Kein Tool-Chaos",
    "Keine Klick-Tools wie Make, Zapier oder n8n.",
    "Gebaut, nicht zusammengeklickt.",
    "// In der Praxis",
    "So sieht ein Agent im Alltag aus.",
    "Lead-Capture",
    "// Der Weg",
    "Von der Analyse bis zum Betrieb.",
    "Analyse",
    "Aufbau",
    "Integration",
    "Betrieb",
    "Gespräch buchen",
  ],
  "/preise": [
    "// Pakete",
    "Klein anfangen. Groß wachsen.",
    "// Drei Klassen",
    "Wählen Sie das Problem. Wir bauen das System.",
    "Klasse I",
    "Nova",
    "Klasse II",
    "Pulsar",
    "Klasse III",
    "Quasar",
    "Setup zusammenstellen",
    "// Immer dabei",
    "In jedem Paket enthalten.",
    "Eigener Code",
    "DSGVO-konform",
    "Laufende Betreuung",
    "Monatlich",
    "// Kurz beantwortet",
    "Häufige Fragen.",
    "Was kostet das?",
    "Wie lange dauert der Aufbau?",
    "Brauchen wir technisches Wissen?",
    "Warum kein Make oder Zapier?",
    "Was ist mit Datenschutz?",
    "Kann ich monatlich kündigen?",
  ],
  "/ueber": [
    "// Lunakris",
    "Mehr Output. Gleiches Team.",
    "Die meisten Agenturen verkaufen Werkzeuge.",
    "Lunakris baut KI-Systeme, die Ihren Betrieb täglich entlasten.",
    "Eigener Code",
    "Wenige, tiefe Lösungen",
    "Laufender Betrieb",
    "// Die Überzeugung",
    "Technik soll arbeiten. Nicht Sie.",
  ],
  "/kontakt": [
    "// 15 Minuten",
    "Lassen Sie uns reden.",
    "Sechs Fragen, dann bekommen Sie einen Termin-Link.",
    "// So läuft's",
    "Sechs Fragen",
    "Termin-Link per Mail",
    "15 Minuten reden",
    "01 / 06",
    "Wo geht bei Ihnen am meisten Zeit drauf?",
    "Mehrfachauswahl möglich.",
    "Weiter",
    "Monatlich kündbar",
    "DSGVO-konform",
    "Antwort in 24 h",
  ],
  // Die beiden Anmeldeflächen: geprüft wird, dass die eigene Seite steht UND
  // dass Clerk sein Formular tatsächlich geliefert hat. Fehlt "Weiter mit
  // Google", ist entweder der Key weg oder clerk.lunakris.de nicht erreichbar
  // — genau die Ausfälle, die sonst niemandem auffallen.
  "/login": [
    "// Zugang",
    "Ein System. Ein Login.",
    "Weiter mit Google",
    "E-Mail-Adresse",
    "Passwort",
    "Noch kein Konto?",
    "Registrieren",
  ],
  "/registrieren": [
    "// Zugang",
    "Konto anlegen.",
    "Weiter mit Google",
    "E-Mail-Adresse",
    "Passwort",
    "Schon ein Konto?",
    "Anmelden",
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
    // Ohne das legt sich der Intro-Film über jede Aufnahme — jeder Kontext ist
    // frisch, also hat ihn der Sitzungsspeicher noch nie gesehen.
    await ctx.addInitScript(() =>
      sessionStorage.setItem("lunakris:intro-seen", "1"),
    );
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));

    for (const [route, strings] of Object.entries(EXPECT)) {
      await page.goto(BASE + route, { waitUntil: "networkidle" });
      // Clerk holt sein Formular selbst nach. Die 700 ms des Durchlaufs mit
      // reduzierter Bewegung reichen dafür nicht — ohne dieses Warten wäre der
      // Fehlschlag ein Testfehler, kein Seitenfehler.
      if (route === "/login" || route === "/registrieren") {
        await page
          .waitForSelector(".cl-rootBox", { timeout: 15000 })
          .catch(() => {});
      }
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
