import Reveal from "../ui/Reveal";
import TiltCard from "../ui/TiltCard";
import OrbitButton from "../ui/OrbitButton";
import { SketchCircle } from "../doodles/Doodles";
import "./pilot.css";

export default function Pilot() {
  return (
    <section className="pilot">
      <div className="wrap">
        <Reveal>
          {/* TiltCard ersetzt die starlit-card: Surface + Spotlight + Tilt kommen
              aus der Card, das Grid-Layout liegt auf der inneren .tilt-card */}
          <TiltCard className="pilot-card">
            <div className="pilot-copy">
              <p className="eyebrow">// Pilotphase</p>
              <h2 className="pilot-title">
                Aktuell{" "}
                <span className="pilot-badge-wrap">
                  <SketchCircle delay={0.6} />
                  <span className="accent">2 Pilotplätze.</span>
                </span>
              </h2>
              <p className="pilot-text">
                Novaris ist neu. Die ersten Systeme bauen wir mit ausgewählten Betrieben
                zu Sonderkonditionen, im Austausch dokumentieren wir das Ergebnis offen
                als Case-Study. Referenzen haben wir noch keine. Dafür bekommen Sie die
                volle Aufmerksamkeit von dem, der es baut.
              </p>
              <ul className="pilot-points">
                <li>Sonderkonditionen für die ersten beiden Betriebe</li>
                <li>Ergebnis wird transparent dokumentiert</li>
                <li>Direkter Draht, kein Account-Manager dazwischen</li>
              </ul>
              <OrbitButton to="/kontakt" className="pilot-cta">
                Pilotplatz sichern
              </OrbitButton>
            </div>
          </TiltCard>
        </Reveal>
      </div>
    </section>
  );
}
