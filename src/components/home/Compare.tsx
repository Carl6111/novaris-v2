import Reveal from "../ui/Reveal";
import TiltCard from "../ui/TiltCard";
import "./compare.css";

const ROWS = [
  { label: "Kosten", hire: "Gehalt + Lohnnebenkosten, jeden Monat", nova: "Monatliches Paket, klar kalkulierbar" },
  { label: "Einarbeitung", hire: "Wochen bis Monate", nova: "Läuft in 1–2 Wochen erste Automatisierung" },
  { label: "Verfügbarkeit", hire: "40 Std./Woche, Urlaub & krank", nova: "24/7, auch nachts und am Wochenende" },
  { label: "Skaliert", hire: "Nur durch weitere Einstellungen", nova: "Mehr Last = gleiches System" },
  { label: "Gehört euch", hire: "Wissen geht, wenn Person geht", nova: "Echter Code, bleibt im Betrieb" },
];

export default function Compare() {
  return (
    <section className="compare">
      <div className="wrap">
        <Reveal>
          <div className="section-head">
            <p className="eyebrow">// Die Rechnung</p>
            <h2>
              Neue Stelle oder <span className="accent">ein System?</span>
            </h2>
            <p className="compare-lead">
              Grobe Richtwerte, kein Angebot. Die Größenordnung stimmt.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="compare-grid">
            <div className="compare-col compare-col--label" aria-hidden="true" />
            <div className="compare-col compare-col--hire">
              <h3>Neue Einstellung</h3>
            </div>
            <div className="compare-col compare-col--nova">
              <h3>Novaris</h3>
            </div>

            {ROWS.map((r) => (
              <div key={r.label} className="compare-row">
                <span className="compare-rowlabel">{r.label}</span>
                <span className="compare-hire">{r.hire}</span>
                {/* Nur die Novaris-Zelle ist eine Tilt-Card — ganze Zeilen würden
                    das Grid über display:contents sprengen (Wrapper = Grid-Item) */}
                <TiltCard maxTilt={3} lift={false} className="compare-nova">
                  <span className="compare-check" aria-hidden="true">✓</span>
                  {r.nova}
                </TiltCard>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
