import type { VercelRequest, VercelResponse } from "@vercel/node";
import { verifyToken } from "@clerk/backend";

/**
 * Die einzige Stelle, die entscheidet, wer die internen Daten zu sehen bekommt.
 *
 * Drei Huerden, alle drei muessen bestehen:
 *
 *  1. gueltiger Clerk-Session-Token aus dem Authorization-Header
 *  2. Nutzer-Id steht in `ADMIN_USER_IDS` (Umgebungsvariable)
 *  3. `publicMetadata.role === "admin"`, frisch bei Clerk nachgefragt
 *
 * Warum zwei Freigaben statt einer: die Rolle laesst sich ueber das
 * Clerk-Dashboard vergeben, die Umgebungsvariable nur ueber das Vercel-Projekt.
 * Wer nur eine der beiden Stellen kontrolliert, kommt nicht rein. Punkt 3 bleibt
 * dabei der schnelle Notausschalter — Rolle wegnehmen wirkt sofort, ohne Deploy.
 *
 * Abgelehnt wird mit **404, nicht 403**: wer nicht bestaetigt bekommt, dass es
 * die Route ueberhaupt gibt, klopft sie auch nicht weiter ab.
 */

type Claims = { sub?: string; [k: string]: unknown };

/**
 * Die namentliche Gaesteliste.
 *
 * Die Rolle allein reicht nicht mehr: wer immer in Zukunft Clerk-Metadaten
 * setzen kann — ein zweiter Admin im Dashboard, ein Skript mit dem Secret Key,
 * ein Fehlgriff beim Einladen — koennte sich damit selbst freischalten. Diese
 * Liste haengt dagegen an der Umgebungsvariable, und die aendert nur, wer
 * Zugriff auf das Vercel-Projekt hat.
 *
 * Beide Pruefungen muessen bestehen. Fehlt die Variable, kommt niemand rein:
 * eine vergessene Konfiguration darf nie zu offenem Zugang werden.
 */
function erlaubteIds(): string[] {
  return (process.env.ADMIN_USER_IDS ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter((id) => id.length > 0);
}

function bearer(req: VercelRequest): string | null {
  const header = req.headers.authorization;
  if (typeof header !== "string" || !header.startsWith("Bearer ")) return null;
  const token = header.slice(7).trim();
  return token.length > 0 ? token : null;
}

/**
 * Gibt die Clerk-User-Id zurueck, wenn der Aufrufer Admin ist. Sonst wird die
 * Antwort hier fertig geschrieben und `null` zurueckgegeben — der Aufrufer
 * muss dann nur noch `return`.
 */
export async function requireAdmin(
  req: VercelRequest,
  res: VercelResponse,
): Promise<string | null> {
  const secret = process.env.CLERK_SECRET_KEY;
  if (!secret) {
    // Fehlkonfiguration darf nie zu offenem Zugang werden.
    console.error("CLERK_SECRET_KEY fehlt — Zugriff verweigert");
    res.status(404).json({ error: "Not found" });
    return null;
  }

  const token = bearer(req);
  if (!token) {
    res.status(404).json({ error: "Not found" });
    return null;
  }

  let claims: Claims;
  try {
    claims = (await verifyToken(token, { secretKey: secret })) as Claims;
  } catch {
    res.status(404).json({ error: "Not found" });
    return null;
  }

  const userId = typeof claims.sub === "string" ? claims.sub : null;
  if (!userId) {
    res.status(404).json({ error: "Not found" });
    return null;
  }

  // Erste Huerde: steht diese Nutzer-Id auf der Liste? Das ist billiger als der
  // Clerk-Abruf und schliesst alle anderen aus, bevor ueberhaupt gefragt wird.
  const erlaubt = erlaubteIds();
  if (erlaubt.length === 0) {
    console.error(
      "ADMIN_USER_IDS ist nicht gesetzt — Zugriff auf /admin verweigert. " +
        "Clerk-Nutzer-Id (user_...) als Umgebungsvariable hinterlegen.",
    );
    res.status(404).json({ error: "Not found" });
    return null;
  }
  if (!erlaubt.includes(userId)) {
    res.status(404).json({ error: "Not found" });
    return null;
  }

  // Zweite Huerde: die Rolle steht nicht im Token, sondern am Nutzer. Ein Token,
  // das gestern Admin war, soll heute keiner mehr sein — deshalb frisch
  // nachgefragt. So laesst sich der Zugang auch ueber Clerk allein entziehen,
  // ohne neu auszurollen.
  type ClerkUser = { public_metadata?: { role?: unknown } };
  const user = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
    headers: { Authorization: `Bearer ${secret}` },
  })
    .then((r) => (r.ok ? (r.json() as Promise<ClerkUser>) : null))
    .catch(() => null);

  if (user?.public_metadata?.role !== "admin") {
    res.status(404).json({ error: "Not found" });
    return null;
  }

  return userId;
}

/**
 * Fuer den oeffentlichen POST: wenn ein gueltiger Token dabei ist, haengen wir
 * die Nutzer-Id an den Lead. Ohne Token laeuft es trotzdem durch — das
 * Anmelde-Fenster hat einen Gast-Ausweg, und ein Lead ohne Konto ist immer
 * noch ein Lead.
 */
export async function optionalUserId(
  req: VercelRequest,
): Promise<string | null> {
  const secret = process.env.CLERK_SECRET_KEY;
  const token = bearer(req);
  if (!secret || !token) return null;
  try {
    const claims = (await verifyToken(token, { secretKey: secret })) as Claims;
    return typeof claims.sub === "string" ? claims.sub : null;
  } catch {
    return null;
  }
}
