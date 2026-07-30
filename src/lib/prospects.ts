/**
 * Der Draht zwischen /admin/prospects und den Serverfunktionen.
 *
 * Wie bei `admin.ts`: was hier steht, ist Bequemlichkeit fuer die Anzeige. Ob
 * jemand die Daten sehen darf, entscheidet allein der Server.
 */

export const STATUS = [
  "offen",
  "angerufen",
  "termin",
  "kunde",
  "kein_interesse",
] as const;

export type Status = (typeof STATUS)[number];

export const STATUS_LABEL: Record<Status, string> = {
  offen: "Offen",
  angerufen: "Angerufen",
  termin: "Termin",
  kunde: "Kunde",
  kein_interesse: "Kein Interesse",
};

export type Prospect = {
  id: string;
  created_at: string;
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
  status: Status;
  notiz: string | null;
};

export type SortKey =
  | "budget_score"
  | "lead_score"
  | "firma"
  | "ort"
  | "offene_stellen"
  | "created_at";

export type Query = {
  sort: SortKey;
  dir: "asc" | "desc";
  status: Status | "alle";
  segment: string;
  q: string;
  /** Untergrenze fuer den Budget-Score. */
  minBudget: number;
  /** Nur Firmen, die gerade Stellen ausgeschrieben haben. */
  nurStellen: boolean;
};

/** Ab hier gilt das Budget laut LeadScout als durch Fakten gestuetzt. */
export const BUDGET_BELEGT = 50;

export const EMPTY_QUERY: Query = {
  sort: "budget_score",
  dir: "desc",
  status: "alle",
  segment: "",
  q: "",
  minBudget: BUDGET_BELEGT,
  nurStellen: false,
};

export function queryString(query: Query): string {
  const p = new URLSearchParams({ sort: query.sort, dir: query.dir });
  if (query.status !== "alle") p.set("status", query.status);
  if (query.segment) p.set("segment", query.segment);
  if (query.q.trim()) p.set("q", query.q.trim());
  if (query.minBudget > 0) p.set("min_budget", String(query.minBudget));
  if (query.nurStellen) p.set("nur_stellen", "1");
  return p.toString();
}

type Token = () => Promise<string | null>;

async function auth(getToken: Token): Promise<HeadersInit> {
  const token = await getToken();
  if (!token) throw new Error("Nicht angemeldet");
  return { Authorization: `Bearer ${token}` };
}

export async function fetchProspects(
  getToken: Token,
  query: Query,
): Promise<Prospect[]> {
  const res = await fetch(`/api/prospects?${queryString(query)}`, {
    headers: await auth(getToken),
  });
  if (!res.ok) throw new Error(`Laden fehlgeschlagen (${res.status})`);
  const data = (await res.json()) as { prospects: Prospect[] };
  return data.prospects;
}

export async function patchProspect(
  getToken: Token,
  id: string,
  change: { status?: Status; notiz?: string | null },
): Promise<Prospect> {
  const res = await fetch(`/api/prospects/${id}`, {
    method: "PATCH",
    headers: { ...(await auth(getToken)), "Content-Type": "application/json" },
    body: JSON.stringify(change),
  });
  if (!res.ok) throw new Error(`Speichern fehlgeschlagen (${res.status})`);
  const data = (await res.json()) as { prospect: Prospect };
  return data.prospect;
}

export type ImportErgebnis = {
  importiert: number;
  zu_schwach: number;
  verworfen: number;
  schwelle: number;
};

/**
 * Eine LeadScout-JSON-Datei hochladen.
 *
 * Geparst wird im Browser, damit eine kaputte Datei sofort auffaellt statt erst
 * nach dem Netzweg. Die eigentliche Pruefung macht trotzdem der Server nochmal —
 * was hier passiert, ist nur eine schnelle Rueckmeldung.
 */
export async function importProspects(
  getToken: Token,
  datei: File,
  minBudget: number,
): Promise<ImportErgebnis> {
  const text = await datei.text();

  let roh: unknown;
  try {
    roh = JSON.parse(text);
  } catch {
    throw new Error("Das ist keine gültige JSON-Datei.");
  }
  if (!Array.isArray(roh)) {
    throw new Error("Die Datei enthält keine Liste. Erwartet wird die .json aus LeadScout.");
  }

  const res = await fetch("/api/prospects", {
    method: "POST",
    headers: { ...(await auth(getToken)), "Content-Type": "application/json" },
    body: JSON.stringify({ prospects: roh, min_budget: minBudget }),
  });
  if (!res.ok) {
    const info = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(info?.error ?? `Import fehlgeschlagen (${res.status})`);
  }
  return (await res.json()) as ImportErgebnis;
}

const DATUM = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "2-digit",
  year: "2-digit",
});

export function formatDatum(iso: string | null): string {
  return iso ? DATUM.format(new Date(iso)) : "—";
}

/** Grobe Einordnung fuer die Farbgebung — dieselben Schwellen wie in LeadScout. */
export function budgetStufe(score: number): "hoch" | "mittel" | "niedrig" {
  if (score >= 70) return "hoch";
  return score >= BUDGET_BELEGT ? "mittel" : "niedrig";
}

/**
 * Die Telefonnummer, die man tatsaechlich waehlt: Durchwahl des Entscheiders,
 * sonst die Zentrale.
 */
export function waehlnummer(p: Prospect): string | null {
  return p.entscheider_telefon ?? p.telefon ?? null;
}

/**
 * Nur http und https in ein href lassen.
 *
 * Beim Import prueft `url()` in api/_lib/prospect.ts bereits das Schema. Diese
 * zweite Pruefung greift fuer Datensaetze, die vor dieser Pruefung importiert
 * wurden und unveraendert in der Datenbank liegen: dort koennte in einem
 * URL-Feld `javascript:...` stehen, das beim Klick in der angemeldeten
 * Admin-Sitzung ausgefuehrt wuerde.
 */
export function sichereUrl(u: string | null): string | undefined {
  if (!u) return undefined;
  try {
    const parsed = new URL(u);
    return parsed.protocol === "https:" || parsed.protocol === "http:" ? u : undefined;
  } catch {
    return undefined;
  }
}
