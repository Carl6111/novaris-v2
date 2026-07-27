/**
 * Clerk-Anbindung.
 *
 * Der Publishable Key darf im Client-Bundle stehen — das ist seine Aufgabe.
 * Der Secret Key gehört NIE hierher; er wird auf dieser Seite auch nirgends
 * gebraucht, weil alles Sensible in Clerks eigener Infrastruktur passiert.
 *
 * Fehlt der Key, läuft die Seite ohne Anmeldung weiter statt weiß zu bleiben:
 * ein vergessener Env-Var in Vercel darf nicht die ganze Website abschießen.
 */

export const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as
  | string
  | undefined;

export const AUTH_READY = Boolean(CLERK_KEY);

/**
 * Novaris ist dauerhaft dunkel (`<html class="dark">`), also muss das Clerk-
 * Fenster es auch sein. Hex statt oklch, weil Clerk die Werte selbst
 * weiterrechnet und dabei nicht auf jede Farbsyntax vorbereitet ist.
 */
export const CLERK_APPEARANCE = {
  variables: {
    colorPrimary: "#fb2c36",
    colorBackground: "#18181b",
    colorForeground: "#fafafa",
    colorInput: "#27272a",
    colorInputForeground: "#fafafa",
    colorNeutral: "#fafafa",
    borderRadius: "0.6rem",
    fontFamily: '"Inter Variable", ui-sans-serif, sans-serif, system-ui',
  },
} as const;

/**
 * Der Zahlungslink für diesen Kunden. Wird nach dem Erstgespräch pro Nutzer im
 * Clerk-Dashboard unter Public Metadata gesetzt:
 *
 *   { "zahlungslink": "https://buy.stripe.com/…" }
 *
 * Bewusst kein eigener Stripe-Aufruf: für "Zahlung nach dem Gespräch" reicht
 * ein Payment Link aus dem Stripe-Dashboard. Ein Backend dafür zu bauen, wäre
 * Aufwand ohne Gegenwert.
 */
export function zahlungslinkOf(
  metadata: Record<string, unknown> | undefined,
): string | null {
  const value = metadata?.zahlungslink;
  return typeof value === "string" && value.startsWith("https://")
    ? value
    : null;
}
