import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion, animate } from "motion/react";
import Reveal from "../ui/Reveal";
import { ScribbleUnderline } from "../doodles/Doodles";
import "./stats.css";

const STATS = [
  { value: 5, suffix: " Min", label: "bis Anfragen beantwortet sind — nicht Stunden." },
  { value: 24, suffix: "/7", label: "läuft euer Betrieb. Auch nachts und am Wochenende." },
  { value: 1, suffix: " System", label: "für Anrufe, Website, CRM, Docs & Portal — ein Login." },
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
  return (
    <section className="stats">
      <div className="wrap">
        <Reveal>
          <p className="eyebrow">// Was sich ändert</p>
        </Reveal>
        <div className="stats-grid">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              className="stat"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <Counter value={s.value} suffix={s.suffix} />
              <ScribbleUnderline delay={0.4 + i * 0.15} />
              <p className="stat-label">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
