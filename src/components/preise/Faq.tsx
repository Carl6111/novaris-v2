import Reveal from "../ui/Reveal";
import "./faq.css";

const FAQS = [
  {
    q: "Was kostet das?",
    a: "Die Pakete starten bei 500€/Monat. Der genaue Preis hängt davon ab, wie viel euer System abdecken soll — wir schnüren es auf euren Prozess.",
  },
  {
    q: "Wie lange dauert der Aufbau?",
    a: "Erste Automatisierungen laufen oft in 1–2 Wochen. Die volle Plattform bauen wir Schritt für Schritt, ohne euren Betrieb zu stören.",
  },
  {
    q: "Brauchen wir technisches Wissen?",
    a: "Nein. Wir bauen, integrieren und betreuen alles. Ihr nutzt das System — wir kümmern uns um die Technik.",
  },
  {
    q: "Warum kein Make oder Zapier?",
    a: "Klick-Tools brechen, gehören euch nicht und stoßen schnell an Grenzen. Wir bauen echten Code und echte KI-Agents, die euch gehören.",
  },
  {
    q: "Was ist mit Datenschutz?",
    a: "Eure Daten bleiben eure Daten. Wir richten das System DSGVO-konform ein und hosten dort, wo es für euch passt.",
  },
  {
    q: "Kann ich monatlich kündigen?",
    a: "Ja. Alle Pakete laufen monatlich — keine Mindestlaufzeit, keine versteckten Fristen. Ihr bleibt, weil das System liefert, nicht wegen eines Vertrags.",
  },
] as const;

export default function Faq() {
  return (
    <section id="faq" className="faq">
      <div className="wrap">
        <Reveal>
          <div className="section-head">
            <p className="eyebrow">// Kurz beantwortet</p>
            <h2>Häufige Fragen.</h2>
          </div>
        </Reveal>

        <div className="faq-list">
          {FAQS.map((f, i) => (
            <Reveal key={f.q} delay={i * 0.05}>
              <details className="faq-item">
                <summary>
                  <span>{f.q}</span>
                  <svg className="faq-chevron" viewBox="0 0 24 16" fill="none" aria-hidden="true">
                    <path
                      d="M3 4 C 7 9, 11 12, 12 12.5 C 13 12, 17 9, 21 4.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </summary>
                <p>{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
