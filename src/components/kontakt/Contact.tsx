import Reveal from "../ui/Reveal";
import ContactSceneMount from "./ContactSceneMount";
import BookingWizard from "./BookingWizard";
import "./contact.css";

const STEPS = [
  { n: "01", t: "Kurz ausfüllen", d: "Ein paar Fragen — dauert unter einer Minute." },
  { n: "02", t: "Buchungslink per Mail", d: "Ihr bekommt direkt euren persönlichen Termin-Link." },
  { n: "03", t: "15 Minuten reden", d: "Wir schauen, wo euer System am meisten Zeit spart." },
] as const;

export default function Contact() {
  return (
    <section className="contact">
      <div className="wrap contact-grid">
        <div className="contact-info">
          <Reveal>
            <p className="eyebrow">// So läuft's</p>
          </Reveal>
          <ol className="contact-steps">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.08} className="contact-step">
                <span className="contact-step-n">{s.n}</span>
                <div>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </div>
              </Reveal>
            ))}
          </ol>
          <div className="contact-scene">
            <ContactSceneMount />
          </div>
        </div>

        <Reveal delay={0.1}>
          <BookingWizard />
          <ul className="contact-badges">
            <li>Monatlich kündbar</li>
            <li>DSGVO-konform</li>
            <li>Antwort in 24 h</li>
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
