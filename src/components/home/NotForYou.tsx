import Reveal from "../ui/Reveal";
import TiltCard from "../ui/TiltCard";
import { ScribbleX } from "../doodles/Doodles";
import "./not-for-you.css";

const ITEMS = [
  "Ihr sucht ein einmaliges Skript und danach nie wieder Kontakt.",
  "Ihr wollt Klick-Tools wie Make oder Zapier zusammenstecken.",
  "„Läuft schon irgendwie“ reicht euch — kein Bedarf, Zeit zurückzuholen.",
  "Ihr wollt den billigsten Anbieter, nicht das System, das euch gehört.",
];

export default function NotForYou() {
  return (
    <section className="nfy">
      <div className="wrap">
        <Reveal>
          <div className="section-head">
            <p className="eyebrow">// Ehrlich gesagt</p>
            <h2>
              Nicht für euch, <span className="accent">wenn…</span>
            </h2>
          </div>
        </Reveal>
        <ul className="nfy-list">
          {ITEMS.map((t, i) => (
            <Reveal key={t} delay={i * 0.06} className="nfy-item">
              <TiltCard maxTilt={3} lift={false}>
                <span className="nfy-x" aria-hidden="true">
                  <ScribbleX delay={0.2} />
                </span>
                <p>{t}</p>
              </TiltCard>
            </Reveal>
          ))}
        </ul>
        <Reveal delay={0.2}>
          <p className="nfy-foot">
            Passt nichts davon? Dann sind wir wahrscheinlich ein guter Fit.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
