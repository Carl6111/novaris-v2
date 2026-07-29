/**
 * Der Draht zwischen /admin und den Serverfunktionen.
 *
 * Jede Anfrage traegt den Clerk-Session-Token. Ob jemand Admin ist, entscheidet
 * ausschliesslich der Server (`api/_lib/auth.ts`) — was hier steht, ist
 * Bequemlichkeit fuer die Anzeige, keine Absicherung. Wer das Frontend
 * austrickst, bekommt vom Server trotzdem nur ein 404.
 */

export const STATUS = [
  "neu",
  "kontaktiert",
  "gespraech",
  "kunde",
  "abgesagt",
] as const;

export type Status = (typeof STATUS)[number];

export const STATUS_LABEL: Record<Status, string> = {
  neu: "Neu",
  kontaktiert: "Kontaktiert",
  gespraech: "Gespräch",
  kunde: "Kunde",
  abgesagt: "Abgesagt",
};

export type Lead = {
  id: string;
  created_at: string;
  quelle: string;
  name: string;
  email: string;
  firma: string | null;
  thema: string[];
  teamgroesse: string | null;
  zeitleck: string | null;
  tier: string | null;
  base_id: string | null;
  addon_ids: string[];
  setup_text: string | null;
  clerk_user_id: string | null;
  status: Status;
  notiz: string | null;
};

export type SortKey = "created_at" | "name" | "firma" | "teamgroesse" | "status";

export type Query = {
  sort: SortKey;
  dir: "asc" | "desc";
  status: Status | "alle";
  q: string;
  /** ISO-Datum; leer heisst: alles. */
  seit: string;
};

export const EMPTY_QUERY: Query = {
  sort: "created_at",
  dir: "desc",
  status: "alle",
  q: "",
  seit: "",
};

export function queryString(query: Query): string {
  const p = new URLSearchParams({ sort: query.sort, dir: query.dir });
  if (query.status !== "alle") p.set("status", query.status);
  if (query.q.trim()) p.set("q", query.q.trim());
  if (query.seit) p.set("seit", query.seit);
  return p.toString();
}

type Token = () => Promise<string | null>;

async function auth(getToken: Token): Promise<HeadersInit> {
  const token = await getToken();
  if (!token) throw new Error("Nicht angemeldet");
  return { Authorization: `Bearer ${token}` };
}

export async function fetchLeads(
  getToken: Token,
  query: Query,
): Promise<Lead[]> {
  const res = await fetch(`/api/leads?${queryString(query)}`, {
    headers: await auth(getToken),
  });
  if (!res.ok) throw new Error(`Laden fehlgeschlagen (${res.status})`);
  const data = (await res.json()) as { leads: Lead[] };
  return data.leads;
}

export async function patchLead(
  getToken: Token,
  id: string,
  change: { status?: Status; notiz?: string | null },
): Promise<Lead> {
  const res = await fetch(`/api/leads/${id}`, {
    method: "PATCH",
    headers: { ...(await auth(getToken)), "Content-Type": "application/json" },
    body: JSON.stringify(change),
  });
  if (!res.ok) throw new Error(`Speichern fehlgeschlagen (${res.status})`);
  const data = (await res.json()) as { lead: Lead };
  return data.lead;
}

/**
 * CSV laden und als Datei anbieten. Bewusst ueber fetch statt ueber einen
 * direkten Link: ein `<a href>` traegt keinen Authorization-Header, der Server
 * wuerde mit 404 antworten.
 */
export async function downloadCsv(getToken: Token, query: Query): Promise<void> {
  const res = await fetch(`/api/leads?${queryString(query)}&format=csv`, {
    headers: await auth(getToken),
  });
  if (!res.ok) throw new Error(`Export fehlgeschlagen (${res.status})`);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `lunakris-leads-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

const DATUM = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "2-digit",
  year: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDatum(iso: string): string {
  return DATUM.format(new Date(iso));
}

export function isDieseWoche(iso: string): boolean {
  return Date.now() - new Date(iso).getTime() < 7 * 24 * 60 * 60 * 1000;
}
