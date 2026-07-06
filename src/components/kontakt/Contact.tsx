import { useState } from "react";
import Reveal from "../ui/Reveal";
import MagneticButton from "../ui/MagneticButton";
import ContactSceneMount from "./ContactSceneMount";
import "./contact.css";

const STEPS = [
  { n: "01", t: "Kurzes Gespräch", d: "15 Minuten. Wir hören zu, wo bei euch Zeit verloren geht." },
  { n: "02", t: "Klarer Vorschlag", d: "Ihr bekommt einen konkreten Plan — kein Verkaufsgerede." },
  { n: "03", t: "Wir bauen", d: "Schritt für Schritt, ohne euren Betrieb zu stören." },
] as const;

const EMAIL = "[PLATZHALTER-EMAIL]";

export default function Contact() {
  const [name, setName] = useState("");
  const [from, setFrom] = useState("");
  const [msg, setMsg] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Anfrage von ${name || "—"}`);
    const body = encodeURIComponent(`${msg}\n\nKontakt: ${from}`);
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  };

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

        <Reveal delay={0.1} className="contact-card">
          <form onSubmit={onSubmit}>
            <label className="contact-field">
              Name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Vor- und Nachname"
                required
              />
              <span className="contact-corners" aria-hidden="true" />
            </label>
            <label className="contact-field">
              E-Mail oder Telefon
              <input
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="So erreichen wir euch"
                required
              />
              <span className="contact-corners" aria-hidden="true" />
            </label>
            <label className="contact-field">
              Worum geht's?
              <textarea
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                rows={4}
                placeholder="Ein, zwei Sätze reichen."
              />
              <span className="contact-corners" aria-hidden="true" />
            </label>
            <MagneticButton type="submit" className="contact-submit">
              Gespräch anfragen
            </MagneticButton>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
