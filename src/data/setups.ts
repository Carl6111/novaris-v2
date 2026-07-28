/**
 * Die Bausteine, aus denen ein Lunakris-Setup entsteht.
 *
 * Der Kunde klickt Probleme an, keine Module. Was er technisch bekommt, steht
 * als Zweitzeile darunter — er muss nicht wissen, welches Modul sein Problem
 * löst, das ist unser Job.
 *
 * Add-ons hängen bewusst an einem konkreten Problem statt in einem globalen
 * Topf zu liegen: nur so ist sichtbar, dass am Ende ein zusammenhängendes
 * System läuft und keine Sammlung einzelner Automatisierungen.
 */

export type Addon = {
  id: string;
  label: string;
  module: string;
};

export type Problem = {
  id: string;
  label: string;
  module: string;
  addons: Addon[];
};

export const PROBLEMS: Problem[] = [
  {
    id: "calls",
    label: "Anrufe gehen abends und am Wochenende verloren",
    module: "Anruf-Agent",
    addons: [
      {
        id: "calls-crm",
        label: "Jeder Anruf landet als Lead in der Pipeline",
        module: "CRM",
      },
      {
        id: "calls-booking",
        label: "Termine werden im Gespräch direkt gebucht",
        module: "Kalender",
      },
      {
        id: "calls-summary",
        label: "Zusammenfassung des Gesprächs per Mail",
        module: "AI Docs",
      },
    ],
  },
  {
    id: "inbound",
    label: "Anfragen bleiben tagelang liegen",
    module: "Website-Formular + Pipeline",
    addons: [
      {
        id: "inbound-reply",
        label: "Erstantwort geht in Minuten raus, nicht am nächsten Tag",
        module: "Anfragen-Agent",
      },
      {
        id: "inbound-qualify",
        label: "Anfragen kommen vorsortiert nach Dringlichkeit an",
        module: "CRM",
      },
      {
        id: "inbound-offer",
        label: "Angebot entsteht direkt aus der Anfrage",
        module: "AI Docs",
      },
    ],
  },
  {
    id: "docs",
    label: "Angebote und Doku schreiben Sie von Hand",
    module: "AI Docs",
    addons: [
      {
        id: "docs-templates",
        label: "Vorlagen lernen aus Ihren bisherigen Angeboten",
        module: "AI Docs",
      },
      {
        id: "docs-followup",
        label: "Nachfassen passiert automatisch, wenn keine Antwort kommt",
        module: "CRM",
      },
      {
        id: "docs-portal",
        label: "Angebot liegt für den Kunden im Portal bereit",
        module: "Client Portal",
      },
    ],
  },
  {
    id: "leads",
    label: "Leads liegen in Excel, im Postfach und im Kopf",
    module: "CRM / Pipeline",
    addons: [
      {
        id: "leads-calls",
        label: "Anrufe schreiben sich selbst in die Pipeline",
        module: "Anruf-Agent",
      },
      {
        id: "leads-report",
        label: "Montags liegt der Wochenbericht im Postfach",
        module: "Reporting",
      },
      {
        id: "leads-offer",
        label: "Angebot startet mit einem Klick aus dem Lead",
        module: "AI Docs",
      },
    ],
  },
  {
    id: "status",
    label: "Kunden fragen ständig nach dem Stand der Dinge",
    module: "Client Portal",
    addons: [
      {
        id: "status-docs",
        label: "Dokumente liegen automatisch beim richtigen Kunden",
        module: "AI Docs",
      },
      {
        id: "status-updates",
        label: "Statuswechsel meldet sich von selbst beim Kunden",
        module: "CRM",
      },
    ],
  },
  {
    id: "website",
    label: "Ihre Seite bringt keine Anfragen",
    module: "Website",
    addons: [
      {
        id: "website-pipeline",
        label: "Anfragen laufen direkt in die Pipeline",
        module: "CRM",
      },
      {
        id: "website-reply",
        label: "Erstantwort geht automatisch raus",
        module: "Anfragen-Agent",
      },
    ],
  },
];

export const PROBLEMS_BY_ID = new Map(PROBLEMS.map((p) => [p.id, p]));

/**
 * Add-ons, die zu diesem Kern *nicht* passen — sie bleiben sichtbar und
 * gesperrt. Das ist Absicht: der Kunde soll sehen, dass die Bausteine
 * aufeinander aufbauen, statt sich zu fragen, wo der Rest hin ist.
 */
export function lockedAddonsFor(
  baseId: string,
  limit = 2,
): { addon: Addon; requires: string }[] {
  const base = PROBLEMS_BY_ID.get(baseId);
  if (!base) return [];
  const ownModules = new Set(base.addons.map((a) => a.module));

  return PROBLEMS.filter((p) => p.id !== baseId)
    .flatMap((p) => p.addons.map((addon) => ({ addon, requires: p.label })))
    .filter(({ addon }) => !ownModules.has(addon.module))
    .slice(0, limit);
}

export type TierId = "nova" | "pulsar" | "quasar";
export type TierMode = "single" | "base-addons" | "consult";

export type TierConfig = {
  id: TierId;
  name: string;
  klasse: string;
  img: string;
  mode: TierMode;
  /** Ein Satz, der sagt, wofür diese Klasse gedacht ist. */
  desc: string;
  /** Was die Interaktion verlangt — steht über der Auswahl. */
  rule: string;
  /** Nur für "base-addons": wie viele Andockungen erlaubt sind. */
  maxAddons?: number;
};

export const TIERS: TierConfig[] = [
  {
    id: "nova",
    name: "Nova",
    klasse: "Klasse I",
    img: "/images/tier-nova.webp",
    mode: "single",
    desc: "Ein Prozess, der Ihnen täglich Zeit frisst. Automatisiert und laufend betreut.",
    rule: "Wählen Sie den Prozess, der am meisten kostet.",
  },
  {
    id: "pulsar",
    name: "Pulsar",
    klasse: "Klasse II",
    img: "/images/tier-pulsar.webp",
    mode: "base-addons",
    desc: "Ein Kernprozess und alles, was daran hängt. Läuft als ein zusammenhängendes System.",
    rule: "Erst der Kern, dann was daran andockt.",
    maxAddons: 2,
  },
  {
    id: "quasar",
    name: "Quasar",
    klasse: "Klasse III",
    img: "/images/tier-quasar.webp",
    mode: "consult",
    desc: "Die Plattform über Ihrem ganzen Betrieb, zugeschnitten auf Ihre Abläufe.",
    rule: "Auf dieser Größe stellt man nichts zusammen.",
  },
];

export const TIERS_BY_ID = new Map(TIERS.map((t) => [t.id, t]));

export function isTierId(value: string | null): value is TierId {
  return value === "nova" || value === "pulsar" || value === "quasar";
}

/** Was im Erstgespräch für Quasar passiert — ersetzt dort die Auswahl. */
export const QUASAR_STEPS = [
  "Wir gehen Ihren Betrieb durch und suchen die Stellen, an denen Arbeit liegen bleibt.",
  "Sie bekommen einen Vorschlag, welche Prozesse in welcher Reihenfolge laufen sollten.",
  "Der Preis steht danach fest — nicht vorher.",
];

export type Selection = {
  baseId: string | null;
  addonIds: string[];
};

export const EMPTY_SELECTION: Selection = { baseId: null, addonIds: [] };

/** Kompakte, lesbare Zusammenfassung — geht per URL an den Buchungs-Wizard. */
export function encodeSelection(tier: TierId, sel: Selection): string {
  return [tier, sel.baseId, ...sel.addonIds].filter(Boolean).join(",");
}

export function describeSelection(tier: TierId, sel: Selection): string[] {
  const tierName = TIERS_BY_ID.get(tier)?.name ?? tier;
  if (!sel.baseId) return [tierName];
  const base = PROBLEMS_BY_ID.get(sel.baseId);
  if (!base) return [tierName];
  const addons = base.addons
    .filter((a) => sel.addonIds.includes(a.id))
    .map((a) => a.label);
  return [`${tierName}: ${base.label}`, ...addons];
}
