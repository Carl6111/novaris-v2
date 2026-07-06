import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  useMotionValueEvent,
  type MotionValue,
} from "motion/react";
import "./organism.css";

// Scroll progress off the section's own rect via rAF (Lenis-proof).
function useSectionProgress(ref: React.RefObject<HTMLElement | null>): MotionValue<number> {
  const progress = useMotionValue(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;
      progress.set(p);
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [ref, progress]);
  return progress;
}

type Organ = {
  name: string;
  line: string;
  tag: string;
  benefits: string[];
  fx: number;
  fy: number;
  angle: number;
  icon: React.ReactNode;
};

// organic ring — slightly irregular angles for a living feel
const ORGANS: Organ[] = [
  {
    name: "Website",
    line: "Dein Aushängeschild, das verkauft.",
    tag: "Sichtbar",
    benefits: ["SEO-ready", "mobil top", "Lead-Capture eingebaut"],
    angle: -90,
    fx: 0, fy: -1,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" />
      </svg>
    ),
  },
  {
    name: "CRM",
    line: "Jeder Lead landet automatisch am richtigen Ort.",
    tag: "Leads",
    benefits: ["keine verlorenen Anfragen", "Status-Pipeline", "Follow-up automatisch"],
    angle: -32,
    fx: 0.848, fy: -0.53,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="6" cy="6" r="2.4" /><circle cx="18" cy="9" r="2.4" /><circle cx="9" cy="18" r="2.4" />
        <path d="M8 7l8 1.6M8 8l1 8" />
      </svg>
    ),
  },
  {
    name: "AI Docs",
    line: "Angebote und Doku schreiben sich von selbst.",
    tag: "Doku",
    benefits: ["Minuten statt Stunden", "immer konsistent", "auf Knopfdruck"],
    angle: 30,
    fx: 0.866, fy: 0.5,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M6 3h7l5 5v13H6z" /><path d="M13 3v5h5" />
        <path d="M11 13l1.1 2.4L14.5 16.5 12.1 17.6 11 20l-1.1-2.4L7.5 16.5 9.9 15.4z" />
      </svg>
    ),
  },
  {
    name: "Client Portal",
    line: "Kunden sehen alles auf einen Blick.",
    tag: "Kunden",
    benefits: ["alles an einem Ort", "transparent", "weniger Rückfragen"],
    angle: 92,
    fx: -0.035, fy: 1,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18" />
        <circle cx="6" cy="6.5" r=".6" fill="currentColor" /><path d="M7 14h6" />
      </svg>
    ),
  },
  {
    name: "Invoicing",
    line: "Rechnungen raus, ohne dran zu denken.",
    tag: "Umsatz",
    benefits: ["Zahlungs-Tracking", "keine Mahn-Arbeit", "pünktlich raus"],
    angle: 150,
    fx: -0.866, fy: 0.5,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" /><path d="M9 8h6M9 12h6" />
      </svg>
    ),
  },
  {
    name: "Sichtbarkeit",
    line: "Lokal gefunden werden — SEO + Google.",
    tag: "Gefunden",
    benefits: ["lokal gefunden werden", "Top-Rankings", "Profil gepflegt"],
    angle: 212,
    fx: -0.848, fy: -0.53,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 21c4-4.5 6-7.7 6-11a6 6 0 0 0-12 0c0 3.3 2 6.5 6 11z" />
        <path d="M12 6.5l1 2 2.2.2-1.7 1.5.6 2.1L12 12.2 9.9 12.3l.6-2.1L8.8 8.7 11 8.5z" />
      </svg>
    ),
  },
];

type NerveProps = { index: number; angle: number; progress: MotionValue<number>; reduced: boolean };

function Nerve({ index, angle, progress, reduced }: NerveProps) {
  const s0 = 0.2 + index * 0.06;
  const e0 = Math.min(s0 + 0.22, 1);
  const grow = useTransform(progress, [s0, e0], [0, 1]);
  return (
    <div className="nerve" style={{ "--a": `${angle}deg`, "--nd": `${index * 0.5}s` } as React.CSSProperties}>
      <motion.div className="nerve-line" style={reduced ? undefined : { scaleX: grow }}>
        <svg viewBox="0 0 100 24" preserveAspectRatio="none">
          <path d="M0,12 Q22,5 44,12 T100,12" fill="none" stroke="url(#nerveg)" strokeWidth="2.2" />
        </svg>
      </motion.div>
      <span className="nerve-pulse" />
      <span className="nerve-pulse nerve-pulse-2" />
    </div>
  );
}

type OrganProps = {
  organ: Organ;
  index: number;
  progress: MotionValue<number>;
  reduced: boolean;
  active: boolean;
  onOpen: (i: number) => void;
};

function OrganNode({ organ, index, progress, reduced, active, onOpen }: OrganProps) {
  const s0 = 0.26 + index * 0.06;
  const e0 = Math.min(s0 + 0.2, 1);
  const scale = useTransform(progress, [s0, e0], [0.2, 1]);
  const opacity = useTransform(progress, [s0, Math.min(s0 + 0.1, 1)], [0, 1]);
  const style = reduced
    ? undefined
    : { scale, opacity, "--hx": `calc(var(--OR) * ${organ.fx})`, "--hy": `calc(var(--OR) * ${organ.fy})` };
  const staticStyle = { "--hx": `calc(var(--OR) * ${organ.fx})`, "--hy": `calc(var(--OR) * ${organ.fy})` };

  return (
    <motion.button
      type="button"
      className={`organ${active ? " active" : ""}`}
      style={(reduced ? staticStyle : style) as React.CSSProperties}
      aria-label={`${organ.name} — Details öffnen`}
      onClick={() => onOpen(index)}
    >
      <span className="organ-cell">
        <span className="organ-ic">{organ.icon}</span>
      </span>
      <span className="organ-name">{organ.name}</span>
    </motion.button>
  );
}

export default function Organism() {
  const ref = useRef<HTMLElement>(null);
  const reducedRaw = useReducedMotion();
  const reduced = !!reducedRaw;
  const progress = useSectionProgress(ref);
  const [lit, setLit] = useState(reduced);
  const [active, setActive] = useState<number | null>(null);
  useMotionValueEvent(progress, "change", (v) => setLit(v > 0.5));

  const heartScale = useTransform(progress, [0.02, 0.18], [0.4, 1]);
  const heartOpacity = useTransform(progress, [0.02, 0.16], [0, 1]);
  const headOpacity = useTransform(progress, [0.0, 0.12], [0, 1]);
  const headY = useTransform(progress, [0.0, 0.12], [30, 0]);

  // mouse-follow parallax
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 16, mass: 0.8 });
  const sy = useSpring(py, { stiffness: 60, damping: 16, mass: 0.8 });
  const worldRotateY = useTransform(sx, [-1, 1], [-16, 16]);
  const worldRotateX = useTransform(sy, [-1, 1], [12, -6]);
  const worldX = useTransform(sx, [-1, 1], [-18, 18]);
  const worldY = useTransform(sy, [-1, 1], [-14, 14]);

  useEffect(() => {
    if (active !== null) { px.set(0); py.set(0); }
  }, [active, px, py]);

  const onMove = (e: React.PointerEvent) => {
    if (reduced || active !== null || e.pointerType === "touch") return;
    px.set((e.clientX / window.innerWidth - 0.5) * 2);
    py.set((e.clientY / window.innerHeight - 0.5) * 2);
  };
  const onLeave = () => { px.set(0); py.set(0); };

  const worldStyle = reduced ? undefined : { rotateX: worldRotateX, rotateY: worldRotateY, x: worldX, y: worldY };
  const activeOrgan = active !== null ? ORGANS[active] : null;

  return (
    <section ref={ref} className="organism-section" id="system" aria-label="Dein Betrieb als lebendiges System">
      <div
        className={`organism-pin${lit ? " lit" : ""}${active !== null ? " has-active" : ""}`}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
      >
        <motion.div className="organism-head" style={reduced ? undefined : { opacity: headOpacity, y: headY }}>
          <p className="eyebrow eyebrow-light">// Ein lebendiges System</p>
          <h2>
            Dein Betrieb — <span className="organism-accent">ein Organismus.</span>
          </h2>
          <p>Sechs Teile, ein Herzschlag. Alles verbunden, alles automatisch — wie ein lebendiger Körper.</p>
        </motion.div>

        <button
          type="button"
          className="organism-backdrop"
          aria-label="Schliessen"
          tabIndex={active !== null ? 0 : -1}
          onClick={() => setActive(null)}
        />

        <div className="organism-stage">
          <motion.div className="organism-world" style={worldStyle}>
            <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
              <defs>
                <linearGradient id="nerveg" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#ffffff" />
                  <stop offset="0.7" stopColor="#f5522d" />
                  <stop offset="1" stopColor="rgba(245,82,45,0.1)" />
                </linearGradient>
              </defs>
            </svg>

            {ORGANS.map((o, i) => (
              <Nerve key={`n-${o.name}`} index={i} angle={o.angle} progress={progress} reduced={reduced} />
            ))}

            <motion.div className="heart" style={reduced ? undefined : { scale: heartScale, opacity: heartOpacity }}>
              <span className="heart-glow" />
              <img src="/logos/novaris-gold-mark.png" alt="" className="core-img" decoding="async" />
            </motion.div>

            {ORGANS.map((o, i) => (
              <OrganNode
                key={o.name}
                organ={o}
                index={i}
                progress={progress}
                reduced={reduced}
                active={active === i}
                onOpen={setActive}
              />
            ))}
          </motion.div>
        </div>

        <AnimatePresence>
          {activeOrgan && (
            <motion.div
              className="organ-panel"
              initial={{ opacity: 0, scale: 0.86, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ type: "spring", stiffness: 220, damping: 24 }}
              role="dialog"
              aria-label={activeOrgan.name}
            >
              <span className="organ-panel-ic">{activeOrgan.icon}</span>
              <span className="organ-panel-tag">{activeOrgan.tag}</span>
              <h3>{activeOrgan.name}</h3>
              <p>{activeOrgan.line}</p>
              <ul>
                {activeOrgan.benefits.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <button type="button" className="organ-panel-close" onClick={() => setActive(null)}>
                schliessen
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="organism-tip">Tipp — tippe ein Organ an</p>
      </div>
    </section>
  );
}
