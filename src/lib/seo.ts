/**
 * Eine Tabelle für vier Verbraucher: die <Seo>-Komponente (Title, Description,
 * Canonical, robots), scripts/prerender.ts (welche Routen als statisches HTML
 * gebaut werden), die Sitemap und die BreadcrumbList im JSON-LD.
 *
 * Getrennte Flags, weil die drei Fragen nicht dieselbe Antwort haben: das
 * Impressum darf indexiert werden (Entity-Signal), gehört aber nicht in die
 * Sitemap. /portal und /admin dürfen weder indexiert noch prerendert werden —
 * hinter dem Login steht ohnehin nur eine leere Hülle.
 */

export const SITE = "https://lunakris.de";
export const OG_IMAGE = `${SITE}/images/lunakrisfinal.webp`;

export type RouteSeo = {
  path: string;
  /** Kurzlabel für die BreadcrumbList. */
  label: string;
  title: string;
  description: string;
  index: boolean;
  sitemap: boolean;
  prerender: boolean;
  priority?: string;
  changefreq?: string;
};

export const ROUTES: RouteSeo[] = [
  {
    path: "/",
    label: "Start",
    title: "KI-Automatisierung für den Mittelstand — Lunakris",
    description:
      "Website, CRM, AI Docs, Client Portal und Anruf-Agent in einem System, mit einem Login. Mehr Output mit dem gleichen Team, rund 80 Stunden weniger Admin im Monat.",
    index: true,
    sitemap: true,
    prerender: true,
    priority: "1.0",
    changefreq: "weekly",
  },
  {
    path: "/plattform",
    label: "Plattform",
    title: "Die Plattform: fünf Module, ein Login — Lunakris",
    description:
      "Website, CRM, AI Docs, Client Portal und Anruf-Agent greifen ineinander statt nebeneinander zu laufen. Kein Tool-Chaos, kein Klick-Tool — eigener Code, der Ihnen gehört.",
    index: true,
    sitemap: true,
    prerender: true,
    priority: "0.9",
    changefreq: "monthly",
  },
  {
    path: "/preise",
    label: "Preise",
    title: "Preise und Pakete für KI-Systeme — Lunakris",
    description:
      "Klein anfangen, groß wachsen: Sie wählen das Problem, das am meisten Zeit kostet, wir bauen das System dazu. Monatlich kündbar, keine Mindestlaufzeit, keine versteckten Kosten.",
    index: true,
    sitemap: true,
    prerender: true,
    priority: "0.9",
    changefreq: "monthly",
  },
  {
    path: "/ueber",
    label: "Über uns",
    title: "Über Lunakris — mehr Output, gleiches Team",
    description:
      "Lunakris baut KI-Systeme für Betriebe, die wachsen wollen, ohne für jede zusätzliche Aufgabe jemanden einzustellen. Technik soll arbeiten, nicht Sie.",
    index: true,
    sitemap: true,
    prerender: true,
    priority: "0.7",
    changefreq: "monthly",
  },
  {
    path: "/kontakt",
    label: "Kontakt",
    title: "Kontakt — 15 Minuten Erstgespräch bei Lunakris",
    description:
      "Sechs Fragen, dann bekommen Sie einen Termin-Link für ein 15-minütiges Gespräch. Kein Vertrieb dazwischen, kein Verkaufsdruck und keine Verpflichtung danach.",
    index: true,
    sitemap: true,
    prerender: true,
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    path: "/impressum",
    label: "Impressum",
    title: "Impressum — Lunakris",
    description:
      "Anbieterkennzeichnung nach § 5 DDG: Firmenangaben, Kontaktdaten und inhaltlich Verantwortlicher für lunakris.de.",
    index: true,
    sitemap: false,
    prerender: true,
  },
  {
    path: "/datenschutz",
    label: "Datenschutz",
    title: "Datenschutzerklärung — Lunakris",
    description:
      "Wie Lunakris personenbezogene Daten auf lunakris.de verarbeitet: Zwecke, Rechtsgrundlagen, Speicherdauer und Ihre Rechte nach DSGVO.",
    index: true,
    sitemap: false,
    prerender: true,
  },
  {
    path: "/agb",
    label: "AGB",
    title: "Allgemeine Geschäftsbedingungen — Lunakris",
    description:
      "Allgemeine Geschäftsbedingungen für die Leistungen von Lunakris: Vertragsschluss, Laufzeit, Kündigung, Vergütung und Mitwirkungspflichten.",
    index: true,
    sitemap: false,
    prerender: true,
  },
  {
    path: "/login",
    label: "Anmelden",
    title: "Anmelden — Lunakris",
    description: "Zugang zum Lunakris Client Portal.",
    index: false,
    sitemap: false,
    prerender: false,
  },
  {
    path: "/registrieren",
    label: "Registrieren",
    title: "Registrieren — Lunakris",
    description: "Konto für das Lunakris Client Portal anlegen.",
    index: false,
    sitemap: false,
    prerender: false,
  },
  {
    path: "/portal",
    label: "Portal",
    title: "Client Portal — Lunakris",
    description: "Stand, Dokumente und nächste Schritte Ihres Projekts.",
    index: false,
    sitemap: false,
    prerender: false,
  },
  {
    path: "/admin",
    label: "Admin",
    title: "Admin — Lunakris",
    description: "Interner Bereich.",
    index: false,
    sitemap: false,
    prerender: false,
  },
];

const FALLBACK = ROUTES[0];

/** Unbekannte Pfade rendert App.tsx als Home — die bekommen deshalb auch dessen Meta. */
export function seoFor(pathname: string): RouteSeo {
  const clean =
    pathname.length > 1 && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;
  return ROUTES.find((r) => r.path === clean) ?? FALLBACK;
}

export function canonicalFor(route: RouteSeo): string {
  return route.path === "/" ? `${SITE}/` : `${SITE}${route.path}`;
}
