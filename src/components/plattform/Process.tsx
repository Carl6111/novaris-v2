import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
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

const ORBIT_D = "M10 95 C 220 30, 480 116, 660 60 S 930 34, 990 58";

export default function Process() {
  const reduceMotion = useReducedMotion();
  const orbitRef = useRef<HTMLDivElement>(null);

  // Scroll-Fortschritt über dem Orbit-Block: startet, wenn der Block bei 80%
  // der Viewport-Höhe auftaucht, endet bei 50% — damit ist die Kurve beim
  // Durchscrollen spürbar, aber früh fertig gezeichnet.
  const { scrollYProgress } = useScroll({
    target: orbitRef,
    offset: ["start 0.8", "end 0.5"],
  });
  const progress = useTransform(scrollYProgress, [0, 1], [0, 1], {
    clamp: true,
  });

  return (
    <section id="ablauf" className="process">
      <div className="wrap">
        <Reveal>
          <div className="section-head">
            <p className="eyebrow">// Der Weg</p>
            <h2>Von der Analyse bis zum Betrieb.</h2>
          </div>
        </Reveal>

        <div className="process-orbit-wrap" ref={orbitRef}>
          <svg className="process-orbit" viewBox="0 0 1000 120" preserveAspectRatio="none" aria-hidden="true">
            {/* Dimme Rail darunter, damit die Zeichnung sichtbar wird */}
            <path d={ORBIT_D} fill="none" className="process-orbit-path" />
            {/* Gefärbte Kopie, die per pathLength mit dem Scroll mitzeichnet */}
            <motion.path
              d={ORBIT_D}
              fill="none"
              className="process-orbit-draw"
              style={{ pathLength: reduceMotion ? 1 : progress }}
            />
          </svg>
          <ol className="process-track">
            {STEPS.map((s, i) => {
              const content = (
                <>
                  <span className="process-star" aria-hidden="true">
                    <svg viewBox="0 0 20 20">
                      <path d="M10 1 l2 6.2 6.5 0.3 -5.2 4 1.9 6.3 -5.2-3.8 -5.2 3.8 1.9-6.3 -5.2-4 6.5-0.3z" />
                    </svg>
                  </span>
                  <span className="process-num">{s.n}</span>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </>
              );
              // Reduced Motion: statische Liste ohne Pop-Animation
              if (reduceMotion) {
                return (
                  <li key={s.n} className="process-step">
                    {content}
                  </li>
                );
              }
              return (
                <motion.li
                  key={s.n}
                  className="process-step"
                  initial={{ opacity: 0, scale: 0.7 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    delay: i * 0.12,
                    duration: 0.55,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {content}
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
