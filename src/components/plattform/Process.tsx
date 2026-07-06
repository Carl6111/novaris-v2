import Reveal from "../ui/Reveal";
import "./process.css";

const STEPS = [
  {
    n: "01",
    title: "Analyse",
    desc: "Wir schauen, wo Zeit und Anfragen verloren gehen.",
  },
  {
    n: "02",
    title: "Aufbau",
    desc: "Wir bauen euer System auf eurem echten Prozess.",
  },
  {
    n: "03",
    title: "Integration",
    desc: "Es läuft mit euren Tools und eurem Team.",
  },
  {
    n: "04",
    title: "Betrieb",
    desc: "Wir betreuen, optimieren und erweitern — monatlich.",
  },
] as const;

export default function Process() {
  return (
    <section id="ablauf" className="process">
      <div className="wrap">
        <Reveal>
          <div className="section-head">
            <p className="eyebrow">// Der Weg</p>
            <h2>Von der Analyse bis zum Betrieb.</h2>
          </div>
        </Reveal>

        <div className="process-orbit-wrap">
          <svg className="process-orbit" viewBox="0 0 1000 120" preserveAspectRatio="none" aria-hidden="true">
            <path
              d="M10 95 C 220 30, 480 116, 660 60 S 930 34, 990 58"
              fill="none"
              className="process-orbit-path"
            />
          </svg>
          <ol className="process-track">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.08} className="process-step">
                <span className="process-star" aria-hidden="true">
                  <svg viewBox="0 0 20 20">
                    <path d="M10 1 l2 6.2 6.5 0.3 -5.2 4 1.9 6.3 -5.2-3.8 -5.2 3.8 1.9-6.3 -5.2-4 6.5-0.3z" />
                  </svg>
                </span>
                <span className="process-num">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
