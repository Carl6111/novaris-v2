/**
 * Häufige Fragen auf /preise.
 *
 * Liegt hier statt in Faq.tsx, weil dieselben Q/A doppelt gebraucht werden:
 * einmal als Accordion, einmal als FAQPage-Schema im JSON-LD. Google verlangt,
 * dass die Antwort im Schema wörtlich der sichtbaren Antwort entspricht — mit
 * zwei Kopien wäre das nach der ersten Textänderung verletzt.
 */

export type FaqItem = {
  q: string;
  a: string;
};

export const FAQS: FaqItem[] = [
  {
    q: "Was kostet das?",
    a: "Das hängt davon ab, welcher Prozess automatisiert wird. Wählen Sie auf der Preisseite Ihr Problem aus und schicken Sie das Formular ab. Ein verbindliches Angebot gibt es im Gespräch.",
  },
  {
    q: "Wie lange dauert der Aufbau?",
    a: "Die erste Automatisierung läuft meist nach ein bis zwei Wochen. Weitere Module kommen danach dazu, während der Betrieb weiterläuft.",
  },
  {
    q: "Brauchen wir technisches Wissen?",
    a: "Nein. Aufbau, Anbindung und Betrieb liegen bei uns. Sie bekommen eine Oberfläche, die sich bedient wie jede andere Software.",
  },
  {
    q: "Warum kein Make oder Zapier?",
    a: "Klick-Tools gehören dem Anbieter, nicht Ihnen. Sobald ein Ablauf komplexer wird oder eine API sich ändert, stehen Sie still. Ihr System läuft auf eigenem Code, den Sie behalten.",
  },
  {
    q: "Was ist mit Datenschutz?",
    a: "Ihre Daten bleiben Ihre Daten. Wir richten das System DSGVO-konform ein und hosten dort, wo es für Sie passt.",
  },
  {
    q: "Kann ich monatlich kündigen?",
    a: "Ja, alle Pakete laufen monatlich. Keine Mindestlaufzeit und keine Kündigungsfrist im Kleingedruckten.",
  },
  {
    q: "Was, wenn ich Make oder Zapier schon nutze?",
    a: "Dann läuft beides parallel, bis der neue Weg steht. Ihre bestehenden Abläufe werden nacheinander in eigenen Code überführt, damit nichts stehen bleibt.",
  },
];
