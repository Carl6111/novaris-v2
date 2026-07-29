import type { TierId } from "../data/setups";

/**
 * Der einzige Weg, auf dem ein Lead das Haus verlässt.
 *
 * Gespeist wird das vom Buchungs-Wizard auf /kontakt — die drei früheren
 * Kurz-Captures (Intro-Video, Preis-Auswahl, /login) sind seit dem Umbau auf
 * Clerk weg, `quelle` hat deshalb aktuell genau einen Wert.
 *
 * Zwei Empfänger, in dieser Reihenfolge:
 *
 *  1. `/api/leads` — die Datenbank. Das ist der Datensatz.
 *  2. Web3Forms — die Benachrichtigung. Das ist Bequemlichkeit.
 *
 * Deshalb gilt: Datenbank fehlgeschlagen → "error", auch wenn die Mail
 * durchging. Mail fehlgeschlagen, Datenbank ok → "ok", der Lead ist da.
 */

const WEB3_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;

export const CALENDLY_URL = import.meta.env.VITE_CALENDLY_URL as string | undefined;

// TODO(Carl): durch die echte Geschäftsadresse ersetzen. Das hier ist die
// Adresse, die im Fehlerfall im Formular steht.
export const FALLBACK_EMAIL = "tafkac@icloud.com";

export type LeadResult = "ok" | "error";

/**
 * Was ein Lead ist. Vorher ein `Record<string, string>` — damit wurde jede
 * Liste zu einem zusammengeklebten Text und die Auswahl aus der Preiskarte
 * verlor ihre Struktur, bevor sie das Haus verließ.
 */
export type LeadInput = {
  name: string;
  email: string;
  firma: string;
  thema: string[];
  teamgroesse: string;
  zeitleck: string;
  /** Die Auswahl aus der Preiskarte, strukturiert. */
  tier: TierId | null;
  baseId: string | null;
  addonIds: string[];
  /** Dieselbe Auswahl als lesbarer Satz — für Mail und Tabellenübersicht. */
  setupText: string;
};

async function speichern(lead: LeadInput): Promise<boolean> {
  try {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quelle: "wizard",
        name: lead.name,
        email: lead.email,
        firma: lead.firma,
        thema: lead.thema,
        teamgroesse: lead.teamgroesse,
        zeitleck: lead.zeitleck,
        tier: lead.tier,
        base_id: lead.baseId,
        addon_ids: lead.addonIds,
        setup_text: lead.setupText,
        botcheck: "",
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function benachrichtigen(lead: LeadInput): Promise<void> {
  if (!WEB3_KEY) return;
  try {
    await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: WEB3_KEY,
        from_name: "Lunakris Website",
        subject: `Neue Buchungsanfrage — ${lead.name}`,
        botcheck: "",
        quelle: "wizard",
        name: lead.name,
        email: lead.email,
        firma: lead.firma,
        thema: lead.thema.join(", "),
        teamgroesse: lead.teamgroesse,
        zeitleck: lead.zeitleck,
        setup: lead.setupText,
      }),
    });
  } catch {
    // Bewusst geschluckt: der Lead liegt zu diesem Zeitpunkt schon in der
    // Datenbank. Eine ausgefallene Benachrichtigung darf dem Absender nicht
    // als Fehler angezeigt werden — seine Anfrage ist angekommen.
  }
}

export async function submitLead(lead: LeadInput): Promise<LeadResult> {
  const gespeichert = await speichern(lead);
  if (!gespeichert) return "error";
  await benachrichtigen(lead);
  return "ok";
}

/** Dieselbe Prüfung in allen Formularen — sonst verhalten sie sich unterschiedlich. */
export function isEmail(value: string): boolean {
  return /.+@.+\..+/.test(value);
}
