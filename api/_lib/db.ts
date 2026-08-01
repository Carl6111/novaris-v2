import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Der Zugang zur Datenbank — und die einzige Stelle, an der der Service-Key
 * vorkommt.
 *
 * Der Key hebelt Row Level Security aus, er ist praktisch das Root-Passwort der
 * Datenbank. Deshalb zwei Regeln, die nicht verhandelbar sind:
 *
 *  1. Kein `VITE_`-Praefix. Alles mit diesem Praefix backt Vite ins
 *     Browser-Bundle. `SUPABASE_SERVICE_ROLE_KEY` bleibt damit serverseitig.
 *  2. Diese Datei wird nie aus `src/` importiert. Sie liegt unter `api/`, das
 *     Vite gar nicht erst anfasst.
 *
 * Auf der Tabelle ist RLS aktiv, aber ohne Policies: der oeffentliche
 * anon-Key kommt an gar nichts. Jeder Zugriff laeuft durch die Funktionen hier.
 */

let client: SupabaseClient | null = null;

export function db(): SupabaseClient {
  if (client) return client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    // Laut und frueh. Ein stiller Fallback wuerde bedeuten, dass Anfragen
    // scheinbar ankommen und nirgends landen.
    throw new Error("SUPABASE_URL oder SUPABASE_SERVICE_ROLE_KEY fehlt");
  }

  // Serverfunktion: keine Sitzung, kein Token-Refresh, nichts zu speichern.
  client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}

export const LEADS = "leads";

/** Recherchierte Zielkunden aus LeadScout — die Gegenrichtung zu `leads`. */
export const PROSPECTS = "prospects";
