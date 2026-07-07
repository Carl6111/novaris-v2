import { lazy, Suspense, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";
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
  const cueOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  // beat A: "Hinter jeder Galaxie steckt Ordnung."
  const aOpacity = useTransform(scrollYProgress, [0.14, 0.22, 0.34, 0.44], [0, 1, 1, 0]);
  const aY = useTransform(scrollYProgress, [0.14, 0.22, 0.34, 0.44], [40, 0, 0, -40]);
  // beat B: "Hinter jedem erfolgreichen Unternehmen auch."
  const bOpacity = useTransform(scrollYProgress, [0.48, 0.56, 0.66, 0.76], [0, 1, 1, 0]);
  const bY = useTransform(scrollYProgress, [0.48, 0.56, 0.66, 0.76], [40, 0, 0, -40]);

  // finale: veil rises, Novaris wordmark + tagline
  // explicit head/tail keyframes so values stay pinned (framer extrapolates 2-point ranges)
  const veilOpacity = useTransform(scrollYProgress, [0, 0.8, 0.9, 1], [0, 0, 1, 1]);
  const markOpacity = useTransform(scrollYProgress, [0, 0.83, 0.9, 1], [0, 0, 1, 1]);
  const markScale = useTransform(scrollYProgress, [0, 0.83, 0.9, 1], [0.9, 0.9, 1, 1]);
  const nameOpacity = useTransform(scrollYProgress, [0, 0.88, 0.94, 1], [0, 0, 1, 1]);
  const nameY = useTransform(scrollYProgress, [0, 0.88, 0.94, 1], [16, 16, 0, 0]);
  const tagOpacity = useTransform(scrollYProgress, [0, 0.93, 0.99, 1], [0, 0, 1, 1]);

  if (reduced) {
    return (
      <section className="hero hero--static">
        <div className="hero-fallback" aria-hidden="true" />
        <div className="hero-overlay">
          <p className="eyebrow">// Growth Engine+</p>
          <h1>
            48h weniger Admin <span className="accent">pro Woche.</span>
          </h1>
          <p className="hero-static-line">Hinter jeder Galaxie steckt Ordnung.</p>
          <p className="hero-static-line">Hinter jedem erfolgreichen Unternehmen auch.</p>
          <div className="hero-final hero-final--static">
            <img className="hero-final-mark" src="/logos/novaris-n.png" alt="Novaris" />
            <span className="hero-final-name">Novaris</span>
            <p className="hero-tagline">
              KI-Automatisierungen, die Wachstum planbar machen.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const showCanvas = canvasReady && !canvasDead;

  return (
    <section ref={ref} className="hero" aria-label="Novaris Intro">
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
          <p className="eyebrow">// Growth Engine+</p>
          <h1 className="hero-open-title">
            48h weniger Admin <span className="accent">pro Woche.</span>
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
            src="/logos/novaris-n.png"
            alt="Novaris"
            style={{ opacity: markOpacity, scale: markScale }}
          />
          <motion.span
            className="hero-final-name"
            style={{ opacity: nameOpacity, y: nameY }}
          >
            Novaris
          </motion.span>
          <motion.p className="hero-tagline" style={{ opacity: tagOpacity }}>
            KI-Automatisierungen, die Wachstum planbar machen.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
