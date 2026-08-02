import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion, animate } from "motion/react";
import Reveal from "../ui/Reveal";
import { ScribbleUnderline } from "../doodles/Doodles";
import "./stats.css";

const STATS = [
  { value: 24, suffix: "/7", label: "nimmt der Anruf-Agent ab. Auch nachts und am Wochenende." },
  { value: 5, suffix: " Module", label: "Website, CRM, AI Docs, Client Portal, Anruf-Agent." },
  { value: 1, suffix: " Login", label: "für alles davon. Kein Tool-Wechsel, keine doppelte Pflege." },
] as const;

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? value : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, value, {
      duration: 1.1,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, reduce]);

  return (
    <span ref={ref} className="stat-value">
      {n}
      <span className="stat-suffix">{suffix}</span>
    </span>
  );
}

export default function Stats() {
  // Motion setzt transform und opacity per Inline-Style — die CSS-Regel für
  // Reduced Motion greift dort nicht. Der Wunsch wird deshalb hier gelesen.
  const reduce = useReducedMotion();

  return (
    <section className="stats">
      <div className="wrap">
        <Reveal>
          <p className="eyebrow">// Was sich ändert</p>
        </Reveal>
        <div className="stats-grid">
          {STATS.map((s, i) => {
            const inhalt = (
              <>
                <Counter value={s.value} suffix={s.suffix} />
                <ScribbleUnderline delay={0.4 + i * 0.15} />
                <p className="stat-label">{s.label}</p>
              </>
            );

            if (reduce) {
              return (
                <div key={s.label} className="stat">
                  {inhalt}
                </div>
              );
            }

            return (
              <motion.div
                key={s.label}
                className="stat"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                {inhalt}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
