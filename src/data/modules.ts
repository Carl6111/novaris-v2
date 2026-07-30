/**
 * Die fünf Module der Plattform.
 *
 * Liegt hier statt in ModuleRows.tsx, weil dieselben Texte zweimal gebraucht
 * werden: einmal als sichtbare Zeilen auf /plattform, einmal als Service-Schema
 * im JSON-LD. Zwei Kopien würden auseinanderlaufen.
 */

export type Module = {
  tag: string;
  title: string;
  accent: string;
  desc: string;
  img?: string;
};

export const MODULES: Module[] = [
  {
    tag: "Website",
    title: "Gefunden,",
    accent: "nicht gesucht.",
    desc: "Eine Seite, die in unter zwei Sekunden steht und in Google wie in KI-Antworten auftaucht. Anfragen landen direkt in der Pipeline.",
    img: "/images/googleseo.webp",
  },
  {
    tag: "CRM",
    title: "Jeder Lead",
    accent: "an einem Ort.",
    desc: "Jeder Kontakt und jede Anfrage wird automatisch erfasst und nach Dringlichkeit sortiert. Nichts liegt mehr im Postfach von jemandem.",
    img: "/images/crm.webp",
  },
  {
    tag: "AI Docs",
    title: "Angebote, die sich",
    accent: "selbst schreiben.",
    desc: "Angebote und Doku entstehen aus den Daten, die schon im System liegen. Aus einem Abend werden ein paar Minuten.",
    img: "/images/aidocs.webp",
  },
  {
    tag: "Client Portal",
    title: "Ein Zuhause",
    accent: "für Ihre Kunden.",
    desc: "Kunden sehen Stand, Dokumente und nächste Schritte selbst. Das erspart Ihnen die Nachfragen per Mail und Telefon.",
    img: "/images/clientportal.webp",
  },
  {
    tag: "Anruf-Agent",
    title: "Kein Anruf",
    accent: "geht verloren.",
    desc: "Nimmt ab, wenn niemand kann. Das Gespräch wird zusammengefasst und liegt als Lead im CRM, bevor Sie zurückrufen.",
  },
];
