import Reveal from "../ui/Reveal";
import { OrbitDoodle, ScribbleUnderline } from "../doodles/Doodles";
import "./payoff.css";

const MODULES = ["Website", "CRM", "AI Docs", "Client Portal", "Anruf-Agent"];

export default function Payoff() {
  return (
    <section className="platform">
      <div className="wrap platform-grid">
        <div className="platform-copy">
          <Reveal>
            <p className="eyebrow">// Eine Plattform</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="platform-title">
              Euer ganzer Betrieb.{" "}
              <span className="accent">
                Ein Login.
                <ScribbleUnderline delay={0.5} />
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="platform-sub">
              Website, CRM, AI Docs, Client Portal und Anruf-Agent hinter einem
              Login. Ein Anruf um 21:47 Uhr liegt am nächsten Morgen als Lead in
              der Pipeline, mit Zusammenfassung und fertigem Angebotsentwurf.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="platform-chipwrap">
              <OrbitDoodle delay={0.4} />
              <ul className="platform-chips">
                {MODULES.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
