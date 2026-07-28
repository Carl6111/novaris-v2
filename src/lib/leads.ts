/**
 * Der einzige Weg, auf dem ein Lead das Haus verlässt.
 *
 * Vier Formulare speisen denselben Web3Forms-Endpoint: der Buchungs-Wizard auf
 * /kontakt und die drei Kurz-Captures (Intro-Video, Preis-Auswahl, /login).
 * Das `quelle`-Feld hält sie im Postfach auseinander.
 */

const WEB3_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;

export const CALENDLY_URL = import.meta.env.VITE_CALENDLY_URL as string | undefined;

// TODO(Carl): durch die echte Geschäftsadresse ersetzen. Das hier ist der
// einzige Weg, auf dem ein Lead ankommt, solange VITE_WEB3FORMS_KEY fehlt.
export const FALLBACK_EMAIL = "tafkac@icloud.com";

export type LeadResult = "ok" | "error";

export async function submitLead(
  fields: Record<string, string>,
): Promise<LeadResult> {
  // Ohne Key gibt es keinen Weg, auf dem die Antworten ankommen. Ein
  // Erfolgs-Screen wäre hier eine Lüge und der Lead wäre verloren.
  if (!WEB3_KEY) return "error";

  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: WEB3_KEY,
        from_name: "Lunakris Website",
        // Honeypot: Web3Forms verwirft die Einsendung, wenn ein Bot ihn füllt.
        botcheck: "",
        ...fields,
      }),
    });
    return res.ok ? "ok" : "error";
  } catch {
    return "error";
  }
}

/** Dieselbe Prüfung in allen Formularen — sonst verhalten sie sich unterschiedlich. */
export function isEmail(value: string): boolean {
  return /.+@.+\..+/.test(value);
}
