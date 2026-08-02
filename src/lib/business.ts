/**
 * Zentrale Geschäftsdaten — die EINZIGE Stelle, die gepflegt wird.
 *
 * Organization-Schema (src/lib/schema.ts), Footer-Social-Links und das
 * Lead-Formular (src/lib/leads.ts) lesen von hier. Bisher standen die
 * Platzhalter an vier Stellen (Impressum, Schema-Kommentar, Footer, leads.ts).
 *
 * Leere Werte bleiben bewusst leer: Schema und Footer lassen die Felder dann
 * weg, statt Platzhalter oder erfundene NAP-Daten auszuspielen — Entity-
 * Konsistenz hängt genau daran, dass nichts Erfundenes im Umlauf ist.
 */
export const BUSINESS = {
  name: "Lunakris",
  inhaber: "Carl Stärke",
  strasse: "Am Schroteanger 32",
  plz: "39110",
  ort: "Magdeburg",
  telefon: "015165165159",
  email: "tafkac@icloud.com",
  // § 5 DDG verlangt die USt-IdNr. nur, sofern vorhanden. Solange keine da
  // ist, bleibt das Feld leer und das Impressum nennt es gar nicht.
  ustId: "",
  // TODO(Carl): Profil-URLs, sobald es sie gibt — z. B.
  // { label: "LinkedIn", href: "https://www.linkedin.com/in/…" }.
  // Sie landen als sameAs im Organization-Schema und in der Footer-Leiste.
  social: [] as { label: string; href: string }[],
};

/** Vollständige Adresse vorhanden? Steuert, ob das Schema `address` ausspielt. */
export const HAT_ADRESSE = Boolean(BUSINESS.strasse && BUSINESS.plz && BUSINESS.ort);
