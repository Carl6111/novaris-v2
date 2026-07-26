import Reveal from "../ui/Reveal";
import TiltCard from "../ui/TiltCard";
import "./includes.css";

const ITEMS = [
  { t: "Echter Code", d: "Keine Klick-Tools wie Make, Zapier oder n8n. Das System gehört euch." },
  { t: "DSGVO-konform", d: "Eure Daten bleiben eure Daten — sauber gehostet, sauber dokumentiert." },
  { t: "Laufende Betreuung", d: "Wir bauen nicht nur — wir optimieren und erweitern jeden Monat." },
  { t: "Monatlich", d: "Klare monatliche Pakete. Keine versteckten Setup-Fallen." },
] as const;

export default function Includes() {
  return (
    <section className="includes">
      <div className="wrap">
        <Reveal>
          <div className="section-head">
            <p className="eyebrow">// Immer dabei</p>
            <h2>
              In jedem Paket <span className="accent">enthalten.</span>
            </h2>
          </div>
        </Reveal>
        <div className="includes-grid">
          {ITEMS.map((it, i) => (
            <Reveal key={it.t} delay={i * 0.07} className="include">
              <TiltCard>
                <span className="include-check" aria-hidden="true">✓</span>
                <h3>{it.t}</h3>
                <p>{it.d}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
