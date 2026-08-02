/**
 * Zentrale Geschäftsdaten — die EINZIGE Stelle, die gepflegt wird.
 *
 * Organization-Schema (src/lib/schema.ts), Footer-Social-Links und das
 * Lead-Formular (src/lib/leads.ts) lesen von hier. Bisher standen die
 * Platzhalter an vier Stellen (Impressum, Schema-Kommentar, Footer, leads.ts).
 *
 * TODO(Carl): echte Angaben eintragen (Pflicht nach § 5 DDG, siehe Impressum).
 * Leere Werte bleiben bewusst leer: Schema und Footer lassen die Felder dann
 * weg, statt Platzhalter oder erfundene NAP-Daten auszuspielen — Entity-
 * Konsistenz hängt genau daran, dass nichts Erfundenes im Umlauf ist.
 */
export const BUSINESS = {
  name: "Lunakris",
  inhaber: "", // TODO(Carl): Name / Firma, exakt wie im Impressum
  strasse: "", // TODO(Carl): Straße + Hausnummer
  plz: "", // TODO(Carl)
  ort: "", // TODO(Carl)
  telefon: "", // TODO(Carl)
  email: "", // TODO(Carl): Geschäftsadresse — ersetzt dann den Fallback in leads.ts
  ustId: "", // TODO(Carl): USt-IdNr., falls vorhanden
  social: [] as { label: string; href: string }[], // TODO(Carl): z. B. { label: "LinkedIn", href: "https://…" }
};

/** Vollständige Adresse vorhanden? Steuert, ob das Schema `address` ausspielt. */
export const HAT_ADRESSE = Boolean(BUSINESS.strasse && BUSINESS.plz && BUSINESS.ort);
