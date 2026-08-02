import { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { HandArrow } from "../doodles/Doodles";
import { MODULES, type Module } from "../../data/modules";
import "./module-rows.css";

function TiltFrame({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType === "touch") return;
    const r = el.getBoundingClientRect();
    const rx = ((e.clientY - r.top) / r.height - 0.5) * -8;
    const ry = ((e.clientX - r.left) / r.width - 0.5) * 10;
    el.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  };
  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg)";
  };

  return (
    <div ref={ref} className="mrow-frame" onPointerMove={onMove} onPointerLeave={onLeave}>
      {children}
    </div>
  );
}

const EASE = [0.16, 1, 0.3, 1] as const;

function ModuleRow({ m, index }: { m: Module; index: number }) {
  const flipped = index % 2 === 1;
  // Motion setzt transform per Inline-Style, an der CSS-Regel für Reduced
  // Motion vorbei. Ohne Bewegung bleiben die Reihen einfach stehen.
  const reduce = useReducedMotion();

  return (
    <div className={`mrow ${flipped ? "mrow--flip" : ""}`}>
      <motion.div
        className="mrow-copy"
        {...(reduce
          ? {}
          : {
              initial: { opacity: 0, y: 30 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, margin: "-100px" },
              transition: { duration: 0.7, ease: EASE },
            })}
      >
        <span className="mrow-num">{String(index + 1).padStart(2, "0")}</span>
        <p className="mrow-tag">{m.tag}</p>
        <h3 className="mrow-title">
          {m.title} <span className="accent">{m.accent}</span>
        </h3>
        <p className="mrow-desc">{m.desc}</p>
        <HandArrow
          variant={index % 3 === 0 ? "curve" : index % 3 === 1 ? "loop" : "straight"}
          className={`mrow-arrow ${flipped ? "mrow-arrow--flip" : ""}`}
          delay={0.4}
        />
      </motion.div>

      <motion.div
        className="mrow-visual"
        {...(reduce
          ? {}
          : {
              initial: { opacity: 0, y: 40, scale: 0.97 },
              whileInView: { opacity: 1, y: 0, scale: 1 },
              viewport: { once: true, margin: "-100px" },
              transition: { duration: 0.8, delay: 0.08, ease: EASE },
            })}
      >
        <TiltFrame>
          <div className="mrow-bar">
            <span /><span /><span />
          </div>
          {m.img ? (
            <img src={m.img} alt={`${m.tag} Ansicht`} loading="lazy" width="1280" height="800" />
          ) : (
            <div className="mrow-mock" aria-hidden="true">
              <div className="mrow-mock-call">
                <span className="mrow-mock-dot" /> Anruf · 02:14 · aufgezeichnet
              </div>
              <div className="mrow-mock-row" />
              <div className="mrow-mock-row short" />
              <div className="mrow-mock-row" />
              <div className="mrow-mock-cta">→ Lead im CRM angelegt</div>
            </div>
          )}
        </TiltFrame>
      </motion.div>
    </div>
  );
}

export default function ModuleRows() {
  return (
    <section id="system" className="module-rows">
      <div className="wrap">
        {MODULES.map((m, i) => (
          <ModuleRow key={m.tag} m={m} index={i} />
        ))}
      </div>
    </section>
  );
}
