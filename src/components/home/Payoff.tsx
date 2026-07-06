import Reveal from "../ui/Reveal";
import OrbitButton from "../ui/OrbitButton";
import { OrbitDoodle, ScribbleUnderline } from "../doodles/Doodles";
import "./payoff.css";

const MODULES = ["Website", "CRM", "AI Docs", "Client Portal", "Invoicing"];

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
              Website, CRM, AI Docs, Client Portal und Invoicing — kein
              Tool-Chaos mehr. Alles greift ineinander, alles in eurer Hand.
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
          <Reveal delay={0.2}>
            <OrbitButton to="/plattform" className="platform-cta">
              Plattform ansehen
            </OrbitButton>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="platform-visual">
          <div className="platform-frame">
            <img
              src="/images/googleseo.webp"
              alt="Novaris Plattform-Dashboard"
              className="platform-dash"
              loading="lazy"
              width="1280"
              height="800"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
