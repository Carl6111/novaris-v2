/**
 * Prospects sind die andere Richtung als Leads.
 *
 * `leads` = wer sich bei uns gemeldet hat. `prospects` = wen wir uns ausgesucht
 * haben. Deshalb eine eigene Tabelle statt einer Spalte: die Felder ueberschneiden
 * sich kaum, und ein Statuswechsel bedeutet hier etwas anderes.
 *
 * Die Daten kommen aus LeadScout. Jedes Feld traegt dort seine Quelle mit, und
 * genau das wird hier uebernommen — ohne Herkunft ist ein Geschaeftsfuehrername
 * vor einem Kaltanruf nichts wert.
 */

export const STATUS = [
  "offen",
  "angerufen",
  "termin",
  "kunde",
  "kein_interesse",
] as const;

export type Status = (typeof STATUS)[number];

export function isStatus(v: unknown): v is Status {
  return typeof v === "string" && (STATUS as readonly string[]).includes(v);
}

export const SORTABLE = [
  "budget_score",
  "lead_score",
  "firma",
  "ort",
  "offene_stellen",
  "created_at",
] as const;

export function isSortable(v: unknown): v is (typeof SORTABLE)[number] {
  return typeof v === "string" && (SORTABLE as readonly string[]).includes(v);
}

/** Unterhalb davon wird gar nicht erst importiert. */
export const MIN_BUDGET_SCORE = 50;

export type ProspectInput = {
  extern_id: string;
  segment: string | null;
  firma: string;
  rechtsform: string | null;
  strasse: string | null;
  plz: string | null;
  ort: string | null;
  telefon: string | null;
  telefon_e164: string | null;
  email: string | null;
  website: string | null;
  entscheider: string | null;
  entscheider_rolle: string | null;
  entscheider_telefon: string | null;
  entscheider_email: string | null;
  entscheider_quelle: string | null;
  mitarbeiter: string | null;
  linkedin_mitglieder: number | null;
  offene_stellen: number | null;
  karriereseite: string | null;
  hrb: string | null;
  linkedin: string | null;
  maps_url: string | null;
  branche: string | null;
  lead_score: number;
  budget_score: number;
  budget_begruendung: string | null;
  score_begruendung: string | null;
  quellen: string | null;
  erhoben_am: string | null;
};

function text(v: unknown, max = 500): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim().slice(0, max);
  return s.length > 0 ? s : null;
}

/**
 * Wie `text`, prueft zusaetzlich das Schema.
 *
 * Die URL-Felder stammen aus LeadScout und damit mittelbar aus fremden
 * Webseiten. Landet dort `javascript:...`, wird daraus im Admin-Panel ein
 * anklickbarer Link, der Code in der angemeldeten Sitzung ausfuehrt. Die
 * Pruefung gehoert an den Eingang: dann ist jeder spaetere Verwender gedeckt,
 * nicht nur die Anchors, die es heute gibt.
 */
function url(v: unknown, max = 300): string | null {
  const s = text(v, max);
  if (!s) return null;
  try {
    const parsed = new URL(s);
    return parsed.protocol === "https:" || parsed.protocol === "http:" ? s : null;
  } catch {
    return null;
  }
}

function zahl(v: unknown): number | null {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

/** Ein `Sourced`-Feld aus LeadScout: `{value, source, confidence}`. */
function wert(v: unknown): unknown {
  if (v && typeof v === "object" && "value" in v) {
    return (v as { value: unknown }).value;
  }
  return v;
}


export type ParseResult =
  | { ok: true; wert: ProspectInput }
  | { ok: false; grund: string };

/**
 * Ein LeadScout-JSON-Objekt in einen Prospect uebersetzen.
 *
 * Bewusst tolerant: fehlt ein Feld, bleibt es leer. Nur ohne Firmennamen oder
 * ohne stabile Kennung waere der Datensatz wertlos — das sind die einzigen
 * beiden Pflichtangaben.
 */
export function parseProspect(raw: unknown): ParseResult {
  if (!raw || typeof raw !== "object") return { ok: false, grund: "kein Objekt" };
  const o = raw as Record<string, unknown>;

  const firma = text(o.name, 200);
  const extern = text(o.place_id, 200);
  if (!firma) return { ok: false, grund: "kein Firmenname" };
  if (!extern) return { ok: false, grund: "keine place_id" };

  const person =
    Array.isArray(o.people) && o.people.length > 0
      ? (o.people[0] as Record<string, unknown>)
      : null;

  const budget = zahl(o.budget_score) ?? 0;
  const lead = zahl(o.lead_score) ?? 0;

  const gruende = (v: unknown): string | null =>
    Array.isArray(v) ? text(v.join(" | "), 1200) : null;

  return {
    ok: true,
    wert: {
      extern_id: extern,
      segment: text(o.segment, 40),
      firma,
      rechtsform: text(wert(o.legal_form), 60),
      strasse: text(o.street, 200),
      plz: text(o.postal_code, 20),
      ort: text(o.city, 120),
      telefon: text(wert(o.phone), 60),
      telefon_e164: text(o.phone_e164, 30),
      email: text(wert(o.email), 200),
      website: url(o.website, 300),
      entscheider: person ? text(person.name, 120) : null,
      entscheider_rolle: person ? text(person.role, 120) : null,
      entscheider_telefon: person ? text(wert(person.phone), 60) : null,
      entscheider_email: person ? text(wert(person.email), 200) : null,
      entscheider_quelle: person ? text(person.source, 60) : null,
      mitarbeiter:
        text(wert(o.employee_count) == null ? null : String(wert(o.employee_count)), 40) ??
        text(wert(o.employee_range), 40),
      linkedin_mitglieder: zahl(wert(o.linkedin_members)),
      offene_stellen: zahl(wert(o.open_positions)),
      karriereseite: url(o.career_page, 300),
      hrb: text(wert(o.hrb), 60),
      linkedin: url(o.linkedin_url, 300),
      maps_url: url(o.maps_url, 500),
      branche: text(wert(o.industry), 120) ?? text(o.category, 120),
      lead_score: lead,
      budget_score: budget,
      budget_begruendung: gruende(o.budget_reasons),
      score_begruendung: gruende(o.score_reasons),
      quellen: Array.isArray(o.sources_used)
        ? text(o.sources_used.join(", "), 200)
        : null,
      erhoben_am: text(o.scraped_at, 40),
    },
  };
}
