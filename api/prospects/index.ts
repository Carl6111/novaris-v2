import type { VercelRequest, VercelResponse } from "@vercel/node";
import { PROSPECTS, db } from "../_lib/db.js";
import { requireAdmin } from "../_lib/auth.js";
import {
  MIN_BUDGET_SCORE,
  isSortable,
  isStatus,
  parseProspect,
} from "../_lib/prospect.js";

/**
 * `GET  /api/prospects` — Liste, nur Admin
 * `POST /api/prospects` — Import aus LeadScout, nur Admin
 *
 * Anders als bei `/api/leads` gibt es hier **keinen** oeffentlichen Zweig. Diese
 * Daten hat niemand von aussen eingetragen; es gibt keinen Grund, warum ein
 * Fremder hier schreiben koennen sollte.
 */

const LIMIT = 1000;
const MAX_IMPORT = 2000;

async function get(req: VercelRequest, res: VercelResponse) {
  if (!(await requireAdmin(req, res))) return;

  const q = req.query;
  const sort = isSortable(q.sort) ? q.sort : "budget_score";
  const auf = q.dir === "asc";

  let frage = db()
    .from(PROSPECTS)
    .select("*")
    .order(sort, { ascending: auf, nullsFirst: false });

  if (isStatus(q.status)) frage = frage.eq("status", q.status);
  if (typeof q.segment === "string" && q.segment.trim()) {
    frage = frage.eq("segment", q.segment.trim().slice(0, 40));
  }

  const min = Number(q.min_budget);
  if (Number.isFinite(min) && min > 0) frage = frage.gte("budget_score", min);

  if (q.nur_stellen === "1") frage = frage.gt("offene_stellen", 0);

  if (typeof q.q === "string" && q.q.trim().length > 0) {
    // Komma und Klammern wuerden den or()-Ausdruck von PostgREST zerlegen.
    const suche = q.q.trim().slice(0, 120).replace(/[,()]/g, " ");
    frage = frage.or(
      `firma.ilike.%${suche}%,ort.ilike.%${suche}%,entscheider.ilike.%${suche}%`,
    );
  }

  const { data, error } = await frage.limit(LIMIT);
  if (error) {
    console.error("Prospects konnten nicht gelesen werden:", error.message);
    return res.status(500).json({ error: "Lesen fehlgeschlagen" });
  }

  return res.status(200).json({ prospects: data ?? [] });
}

/**
 * Import aus einer LeadScout-JSON-Datei.
 *
 * Zwei Entscheidungen, die hier fallen:
 *
 * 1. Schwache Leads kommen gar nicht erst rein. Carl will sie nicht sehen, und
 *    was nicht in der Datenbank steht, muss auch nicht spaeter weggefiltert
 *    werden. Die Schwelle ist ueberschreibbar, aber nie unter 1.
 * 2. `extern_id` ist eindeutig. Ein zweiter Import derselben Datei aktualisiert
 *    die Datensaetze, statt sie zu verdoppeln — Status und Notiz bleiben dabei
 *    stehen, denn die hat Carl von Hand gesetzt.
 */
async function post(req: VercelRequest, res: VercelResponse) {
  if (!(await requireAdmin(req, res))) return;

  const body = req.body as { prospects?: unknown; min_budget?: unknown };
  const roh = body?.prospects;
  if (!Array.isArray(roh)) {
    return res.status(400).json({ error: "Feld 'prospects' fehlt oder ist keine Liste" });
  }
  if (roh.length > MAX_IMPORT) {
    return res.status(400).json({ error: `Mehr als ${MAX_IMPORT} Eintraege auf einmal` });
  }

  const gewuenscht = Number(body?.min_budget);
  const schwelle = Number.isFinite(gewuenscht)
    ? Math.max(1, Math.trunc(gewuenscht))
    : MIN_BUDGET_SCORE;

  const zeilen = [];
  let verworfen = 0;
  let zuSchwach = 0;

  for (const eintrag of roh) {
    const parsed = parseProspect(eintrag);
    if (!parsed.ok) {
      verworfen += 1;
      continue;
    }
    if (parsed.wert.budget_score < schwelle) {
      zuSchwach += 1;
      continue;
    }
    zeilen.push(parsed.wert);
  }

  if (zeilen.length === 0) {
    return res.status(200).json({
      importiert: 0,
      zu_schwach: zuSchwach,
      verworfen,
      schwelle,
    });
  }

  const { data, error } = await db()
    .from(PROSPECTS)
    .upsert(zeilen, { onConflict: "extern_id", ignoreDuplicates: false })
    .select("id");

  if (error) {
    console.error("Import fehlgeschlagen:", error.message);
    return res.status(500).json({ error: "Import fehlgeschlagen" });
  }

  return res.status(200).json({
    importiert: data?.length ?? zeilen.length,
    zu_schwach: zuSchwach,
    verworfen,
    schwelle,
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") return get(req, res);
  if (req.method === "POST") return post(req, res);
  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "Method not allowed" });
}
