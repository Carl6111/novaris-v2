import {
  PROBLEMS_BY_ID,
  isTierId,
  type TierId,
} from "../../src/data/setups";

/**
 * Form und Pruefung eines Leads.
 *
 * Bewusst von Hand statt mit einer Schema-Bibliothek: es sind neun Felder, und
 * die Pruefung gegen `PROBLEMS_BY_ID` koennte ein generisches Schema ohnehin
 * nicht leisten. Eine Abhaengigkeit weniger, die niemand pflegt.
 *
 * Alles, was von aussen kommt, ist verdaechtig — auch das, was unser eigenes
 * Formular schickt. Der Endpunkt ist oeffentlich.
 */

export const STATUS = [
  "neu",
  "kontaktiert",
  "gespraech",
  "kunde",
  "abgesagt",
] as const;

export type Status = (typeof STATUS)[number];

export function isStatus(v: unknown): v is Status {
  return typeof v === "string" && (STATUS as readonly string[]).includes(v);
}

export type LeadInput = {
  quelle: string;
  name: string;
  email: string;
  firma: string | null;
  thema: string[];
  teamgroesse: string | null;
  zeitleck: string | null;
  tier: TierId | null;
  base_id: string | null;
  addon_ids: string[];
  setup_text: string | null;
};

const MAX = { kurz: 200, lang: 4000, liste: 12 };

const str = (v: unknown, max: number): string | null => {
  if (typeof v !== "string") return null;
  const s = v.trim();
  return s.length === 0 || s.length > max ? null : s;
};

const list = (v: unknown, max: number): string[] =>
  Array.isArray(v)
    ? v.filter((x): x is string => typeof x === "string" && x.length <= 200)
        .slice(0, max)
    : [];

/** Dieselbe Regel wie im Frontend (`src/lib/leads.ts`). */
export function isEmail(value: string): boolean {
  return /.+@.+\..+/.test(value);
}

export type ParseResult =
  | { ok: true; lead: LeadInput }
  | { ok: false; feld: string };

export function parseLead(body: unknown): ParseResult {
  if (typeof body !== "object" || body === null) return { ok: false, feld: "body" };
  const b = body as Record<string, unknown>;

  // Honeypot: echte Menschen fuellen ein unsichtbares Feld nicht aus.
  if (typeof b.botcheck === "string" && b.botcheck.length > 0) {
    return { ok: false, feld: "botcheck" };
  }

  const name = str(b.name, MAX.kurz);
  if (!name) return { ok: false, feld: "name" };

  const email = str(b.email, MAX.kurz);
  if (!email || !isEmail(email)) return { ok: false, feld: "email" };

  const quelle = str(b.quelle, 40) ?? "wizard";

  // Tier und Kern kommen aus der Preis-Auswahl und muessen existieren —
  // sonst steht spaeter in der Tabelle eine Id, die zu nichts gehoert.
  const tier = isTierId(typeof b.tier === "string" ? b.tier : null)
    ? (b.tier as TierId)
    : null;

  const baseRaw = str(b.base_id, 60);
  const base_id = baseRaw && PROBLEMS_BY_ID.has(baseRaw) ? baseRaw : null;

  const base = base_id ? PROBLEMS_BY_ID.get(base_id) : undefined;
  const erlaubt = new Set(base?.addons.map((a) => a.id) ?? []);
  const addon_ids = list(b.addon_ids, MAX.liste).filter((id) => erlaubt.has(id));

  return {
    ok: true,
    lead: {
      quelle,
      name,
      email,
      firma: str(b.firma, MAX.kurz),
      thema: list(b.thema, MAX.liste),
      teamgroesse: str(b.teamgroesse, 40),
      zeitleck: str(b.zeitleck, MAX.lang),
      tier,
      base_id,
      addon_ids,
      setup_text: str(b.setup_text, MAX.kurz * 2),
    },
  };
}

/** Spalten, nach denen sortiert werden darf. Alles andere waere ein Einfallstor. */
export const SORTABLE = [
  "created_at",
  "name",
  "firma",
  "teamgroesse",
  "status",
] as const;

export function isSortable(v: unknown): v is (typeof SORTABLE)[number] {
  return typeof v === "string" && (SORTABLE as readonly string[]).includes(v);
}
