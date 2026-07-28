import Reveal from "../ui/Reveal";
import TiltCard from "../ui/TiltCard";
import "./about.css";

const VALUES = [
  { t: "Eigener Code", d: "Das System läuft auf Ihrer Infrastruktur und gehört Ihnen, auch wenn Sie uns nicht mehr brauchen." },
  { t: "Wenige, tiefe Lösungen", d: "Lieber ein Prozess, der wirklich läuft, als fünf, die halb funktionieren." },
  { t: "Laufender Betrieb", d: "Wir übergeben nicht und verschwinden. Jeden Monat wird nachgeschärft." },
] as const;

export default function About() {
  return (
    <section className="about">
      <div className="wrap about-grid">
        <div className="about-copy">
          <Reveal>
            <p className="about-lead">
              Die meisten Agenturen verkaufen Werkzeuge. Wir bauen{" "}
              <span className="accent">Systeme</span>, die Teil Ihres Betriebs
              werden.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="about-para">
              Lunakris baut KI-Systeme, die Ihren Betrieb täglich entlasten. Sie
              schaffen mehr, ohne neu einzustellen. Und die Plattform gehört
              Ihnen, nicht uns.
            </p>
          </Reveal>

          <div className="about-values">
            {VALUES.map((v, i) => (
              <Reveal key={v.t} delay={0.12 + i * 0.08} className="about-value">
                <TiltCard maxTilt={3} lift={false}>
                  <h3>{v.t}</h3>
                  <p>{v.d}</p>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.15} className="about-visual">
          <div className="about-astronaut-wrap">
            <img
              src="/images/astronaut-cutout.webp"
              alt=""
              className="about-astronaut"
              loading="lazy"
              width="800"
              height="1422"
            />
            <span className="about-astronaut-glow" aria-hidden="true" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
