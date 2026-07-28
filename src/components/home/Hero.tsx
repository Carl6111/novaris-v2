import { lazy, Suspense, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";
import OrbitButton from "../ui/OrbitButton";
import "./hero.css";

const HeroCanvas = lazy(() => import("./HeroCanvas"));

const isMobile = () =>
  typeof window !== "undefined" &&
  (window.innerWidth < 768 || navigator.hardwareConcurrency <= 4);

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [canvasReady, setCanvasReady] = useState(false);
  const [canvasDead, setCanvasDead] = useState(false);
  const [mobile] = useState(isMobile);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // opening headline: "48h weniger Admin pro Woche." — visible at the top, fades on scrub
  const openOpacity = useTransform(scrollYProgress, [0, 0.07, 0.12, 1], [1, 1, 0, 0]);
  const openY = useTransform(scrollYProgress, [0, 0.12], [0, -30]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.05, 1], [1, 0, 0]);

  // beat A: "Hinter jeder Galaxie steckt Ordnung."
  const aOpacity = useTransform(scrollYProgress, [0.14, 0.22, 0.34, 0.44], [0, 1, 1, 0]);
  const aY = useTransform(scrollYProgress, [0.14, 0.22, 0.34, 0.44], [40, 0, 0, -40]);
  // beat B: "Hinter jedem erfolgreichen Unternehmen auch."
  const bOpacity = useTransform(scrollYProgress, [0.48, 0.56, 0.66, 0.76], [0, 1, 1, 0]);
  const bY = useTransform(scrollYProgress, [0.48, 0.56, 0.66, 0.76], [40, 0, 0, -40]);

  // finale: veil rises, Lunakris wordmark + tagline
  // explicit head/tail keyframes so values stay pinned (framer extrapolates 2-point ranges)
  // the whole finale runs early enough that it holds fully assembled over the last ~5% of
  // the scroll — otherwise the CTA flashes past in the moment the hero unsticks
  const veilOpacity = useTransform(scrollYProgress, [0, 0.76, 0.85, 1], [0, 0, 1, 1]);
  const markOpacity = useTransform(scrollYProgress, [0, 0.79, 0.86, 1], [0, 0, 1, 1]);
  const markScale = useTransform(scrollYProgress, [0, 0.79, 0.86, 1], [0.9, 0.9, 1, 1]);
  const nameOpacity = useTransform(scrollYProgress, [0, 0.83, 0.89, 1], [0, 0, 1, 1]);
  const nameY = useTransform(scrollYProgress, [0, 0.83, 0.89, 1], [16, 16, 0, 0]);
  const tagOpacity = useTransform(scrollYProgress, [0, 0.86, 0.92, 1], [0, 0, 1, 1]);
  const ctaOpacity = useTransform(scrollYProgress, [0, 0.9, 0.95, 1], [0, 0, 1, 1]);
  const ctaY = useTransform(scrollYProgress, [0, 0.9, 0.95, 1], [14, 14, 0, 0]);
  // visibility, not just opacity: keeps the link out of tab order while it sits invisible
  // over the opening headline
  const ctaVisibility = useTransform(scrollYProgress, (v) =>
    v > 0.89 ? "visible" : "hidden",
  );

  if (reduced) {
    return (
      <section className="hero hero--static">
        <div className="hero-fallback" aria-hidden="true" />
        <div className="hero-overlay">
          <p className="eyebrow">// Lunakris</p>
          <h1>
            80 Stunden weniger Admin. <span className="accent">Jeden Monat.</span>
          </h1>
          <p className="hero-static-line">Hinter jeder Galaxie steckt Ordnung.</p>
          <p className="hero-static-line">Hinter jedem erfolgreichen Unternehmen auch.</p>
          <div className="hero-final hero-final--static">
            <img className="hero-final-mark" src="/logos/lunakris-l.png" alt="Lunakris" />
            <span className="hero-final-name">Lunakris</span>
            <p className="hero-tagline">
              KI-Systeme, die Ihren Betrieb täglich entlasten.
            </p>
            <div className="hero-final-cta">
              <OrbitButton to="/preise" className="orbitbtn--solid">
              Angebote ansehen
            </OrbitButton>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const showCanvas = canvasReady && !canvasDead;

  return (
    <section ref={ref} className="hero" aria-label="Lunakris Intro">
      <div className="hero-sticky">
        {/* solid black base paints instantly; the WebGL scene fades in over it */}
        <div className="hero-fallback" aria-hidden="true" />

        {!canvasDead && (
          <Suspense fallback={null}>
            <HeroCanvas
              progress={scrollYProgress}
              mobile={mobile}
              visible={showCanvas}
              onReady={() => setCanvasReady(true)}
              onContextLost={() => setCanvasDead(true)}
            />
          </Suspense>
        )}

        <div className="hero-shade" aria-hidden="true" />

        {/* opening: concrete benefit above the fold */}
        <motion.div className="hero-open" style={{ opacity: openOpacity, y: openY }}>
          <p className="eyebrow">// Lunakris</p>
          <h1 className="hero-open-title">
            80 Stunden weniger Admin. <span className="accent">Jeden Monat.</span>
          </h1>
        </motion.div>
        <motion.p className="hero-cue" style={{ opacity: cueOpacity }}>
          Scroll ↓
        </motion.p>

        {/* scrubbed intro lines, one clean beat after another */}
        <motion.div className="hero-beat" style={{ opacity: aOpacity, y: aY }}>
          <p>
            Hinter jeder Galaxie steckt <span className="accent">Ordnung.</span>
          </p>
        </motion.div>
        <motion.div className="hero-beat" style={{ opacity: bOpacity, y: bY }}>
          <p>
            Hinter jedem erfolgreichen Unternehmen <span className="accent">auch.</span>
          </p>
        </motion.div>

        {/* finale */}
        <motion.div className="hero-veil" style={{ opacity: veilOpacity }} aria-hidden="true" />
        <div className="hero-final">
          <motion.img
            className="hero-final-mark"
            src="/logos/lunakris-l.png"
            alt="Lunakris"
            style={{ opacity: markOpacity, scale: markScale }}
          />
          <motion.span
            className="hero-final-name"
            style={{ opacity: nameOpacity, y: nameY }}
          >
            Lunakris
          </motion.span>
          <motion.p className="hero-tagline" style={{ opacity: tagOpacity }}>
            KI-Systeme, die Ihren Betrieb täglich entlasten.
          </motion.p>
          <motion.div
            className="hero-final-cta"
            style={{ opacity: ctaOpacity, y: ctaY, visibility: ctaVisibility }}
          >
            <OrbitButton to="/preise" className="orbitbtn--solid">
              Angebote ansehen
            </OrbitButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
