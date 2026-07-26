import Reveal from "../ui/Reveal";
import TiltCard from "../ui/TiltCard";
import "./includes.css";

const ITEMS = [
  { t: "Eigener Code", d: "Das System läuft auf eurer Infrastruktur. Ihr könnt es mitnehmen." },
  { t: "DSGVO-konform", d: "Gehostet in der EU, dokumentiert, mit Auftragsverarbeitungsvertrag." },
  { t: "Laufende Betreuung", d: "Jeden Monat wird gemessen, nachgeschärft und erweitert." },
  { t: "Monatlich", d: "Keine Mindestlaufzeit, kein Setup-Aufschlag." },
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
