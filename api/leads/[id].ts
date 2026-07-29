import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db, LEADS } from "../_lib/db";
import { requireAdmin } from "../_lib/auth";
import { isStatus } from "../_lib/lead";

/**
 * `PATCH /api/leads/:id` — nur Admin. Aendert Status und Notiz, sonst nichts.
 *
 * Bewusst kein allgemeines Update: die Antworten des Kunden sind das, was er
 * gesagt hat. Die duerfen sich nachtraeglich nicht aendern lassen.
 */

const NOTIZ_MAX = 4000;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== "PATCH") {
      res.setHeader("Allow", "PATCH");
      return res.status(405).json({ error: "Method not allowed" });
    }

    if (!(await requireAdmin(req, res))) return;

    const id = req.query.id;
    if (typeof id !== "string" || id.length === 0) {
      return res.status(400).json({ error: "Id fehlt" });
    }

    const body = (req.body ?? {}) as Record<string, unknown>;
    const aenderung: { status?: string; notiz?: string | null } = {};

    if ("status" in body) {
      if (!isStatus(body.status)) {
        return res.status(400).json({ error: "Status ungültig" });
      }
      aenderung.status = body.status;
    }

    if ("notiz" in body) {
      const n = body.notiz;
      if (n !== null && typeof n !== "string") {
        return res.status(400).json({ error: "Notiz ungültig" });
      }
      if (typeof n === "string" && n.length > NOTIZ_MAX) {
        return res.status(400).json({ error: "Notiz zu lang" });
      }
      aenderung.notiz = typeof n === "string" && n.trim() === "" ? null : n;
    }

    if (Object.keys(aenderung).length === 0) {
      return res.status(400).json({ error: "Nichts zu ändern" });
    }

    const { data, error } = await db()
      .from(LEADS)
      .update(aenderung)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error("Lead konnte nicht geändert werden:", error.message);
      return res.status(404).json({ error: "Not found" });
    }

    return res.status(200).json({ lead: data });
  } catch (e) {
    console.error("Unerwarteter Fehler in /api/leads/[id]:", e);
    return res.status(500).json({ error: "Serverfehler" });
  }
}
