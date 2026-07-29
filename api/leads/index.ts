import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db, LEADS } from "../_lib/db";
import { optionalUserId, requireAdmin } from "../_lib/auth";
import { isSortable, isStatus, parseLead } from "../_lib/lead";

/**
 * `POST /api/leads`  — oeffentlich, legt einen Lead an
 * `GET  /api/leads`  — nur Admin, Liste mit sort/dir/status/q/format
 *
 * Sortiert, gefiltert und gesucht wird in der Datenbank, nicht im Browser.
 * Bei zwanzig Leads ist das egal, bei zweitausend nicht — und der Umbau
 * spaeter waere teurer, als es jetzt richtig zu machen.
 */

const LIMIT = 500;

/** Zwei identische Absendungen kurz hintereinander sind ein Doppelklick. */
const DEDUPE_MINUTEN = 10;

const CSV_SPALTEN = [
  "created_at",
  "status",
  "name",
  "email",
  "firma",
  "teamgroesse",
  "thema",
  "tier",
  "setup_text",
  "zeitleck",
  "notiz",
] as const;

function csv(rows: Record<string, unknown>[]): string {
  const zelle = (v: unknown): string => {
    const s = Array.isArray(v) ? v.join(" | ") : v == null ? "" : String(v);
    // Excel und Numbers lesen nur dann zuverlaessig, wenn Anfuehrungszeichen
    // verdoppelt und das ganze Feld eingefasst ist.
    return `"${s.replace(/"/g, '""')}"`;
  };
  const kopf = CSV_SPALTEN.join(",");
  const zeilen = rows.map((r) => CSV_SPALTEN.map((c) => zelle(r[c])).join(","));
  // BOM, sonst zerlegt Excel unter Windows die Umlaute.
  return "﻿" + [kopf, ...zeilen].join("\r\n");
}

async function post(req: VercelRequest, res: VercelResponse) {
  const parsed = parseLead(req.body);
  if (!parsed.ok) {
    // Der Honeypot bekommt eine Erfolgsantwort: ein Bot, der merkt, dass er
    // aufgeflogen ist, versucht es anders. Gespeichert wird nichts.
    if (parsed.feld === "botcheck") return res.status(201).json({ id: null });
    return res.status(400).json({ error: `Feld ungültig: ${parsed.feld}` });
  }

  const supabase = db();
  const seit = new Date(Date.now() - DEDUPE_MINUTEN * 60_000).toISOString();

  const { data: schonDa } = await supabase
    .from(LEADS)
    .select("id")
    .eq("email", parsed.lead.email)
    .gte("created_at", seit)
    .limit(1);

  if (schonDa && schonDa.length > 0) {
    return res.status(200).json({ id: schonDa[0].id, doppelt: true });
  }

  const clerk_user_id = await optionalUserId(req);

  const { data, error } = await supabase
    .from(LEADS)
    .insert({ ...parsed.lead, clerk_user_id })
    .select("id")
    .single();

  if (error) {
    console.error("Lead konnte nicht gespeichert werden:", error.message);
    return res.status(500).json({ error: "Speichern fehlgeschlagen" });
  }

  return res.status(201).json({ id: data.id });
}

async function get(req: VercelRequest, res: VercelResponse) {
  if (!(await requireAdmin(req, res))) return;

  const q = req.query;
  const sort = isSortable(q.sort) ? q.sort : "created_at";
  const auf = q.dir === "asc";

  let frage = db().from(LEADS).select("*").order(sort, { ascending: auf });

  if (isStatus(q.status)) frage = frage.eq("status", q.status);

  if (typeof q.seit === "string" && !Number.isNaN(Date.parse(q.seit))) {
    frage = frage.gte("created_at", new Date(q.seit).toISOString());
  }

  if (typeof q.q === "string" && q.q.trim().length > 0) {
    // Komma und Klammern wuerden den or()-Ausdruck von PostgREST zerlegen.
    const suche = q.q.trim().slice(0, 120).replace(/[,()]/g, " ");
    frage = frage.or(
      `name.ilike.%${suche}%,firma.ilike.%${suche}%,email.ilike.%${suche}%`,
    );
  }

  const { data, error } = await frage.limit(LIMIT);
  if (error) {
    console.error("Leads konnten nicht gelesen werden:", error.message);
    return res.status(500).json({ error: "Lesen fehlgeschlagen" });
  }

  if (q.format === "csv") {
    const datum = new Date().toISOString().slice(0, 10);
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="lunakris-leads-${datum}.csv"`,
    );
    return res.status(200).send(csv(data ?? []));
  }

  return res.status(200).json({ leads: data ?? [] });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === "POST") return await post(req, res);
    if (req.method === "GET") return await get(req, res);
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (e) {
    console.error("Unerwarteter Fehler in /api/leads:", e);
    return res.status(500).json({ error: "Serverfehler" });
  }
}
