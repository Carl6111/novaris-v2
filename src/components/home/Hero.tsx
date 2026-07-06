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
  const [videoGone, setVideoGone] = useState(false);
  const [mobile] = useState(isMobile);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // beat 1: "Hunderte Probleme. Eine Lösung."
  const b1Opacity = useTransform(scrollYProgress, [0.08, 0.16, 0.34, 0.42], [0, 1, 1, 0]);
  const b1Y = useTransform(scrollYProgress, [0.08, 0.16, 0.34, 0.42], [40, 0, 0, -40]);
  // beat 2: "Hunderte Agenten. Ein System."
  const b2Opacity = useTransform(scrollYProgress, [0.46, 0.54, 0.72, 0.8], [0, 1, 1, 0]);
  const b2Y = useTransform(scrollYProgress, [0.46, 0.54, 0.72, 0.8], [40, 0, 0, -40]);
  // intro layer fades as beats start
  const introOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);
  // veil + wordmark at the end
  const veilOpacity = useTransform(scrollYProgress, [0.82, 0.95], [0, 1]);
  const wmOpacity = useTransform(scrollYProgress, [0.86, 0.97], [0, 1]);
  const wmScale = useTransform(scrollYProgress, [0.86, 0.97], [0.92, 1]);

  if (reduced) {
    return (
      <section className="hero hero--static">
        <img
          src="/media/herovid-poster.avif"
          alt=""
          className="hero-media"
          fetchPriority="high"
        />
        <div className="hero-overlay">
          <p className="eyebrow">// Growth Engine+</p>
          <h1>
            Hunderte Probleme. <span className="accent">Eine Lösung.</span>
          </h1>
          <p className="hero-static-line">
            Hunderte Agenten. <span className="accent">Ein System.</span>
          </p>
        </div>
      </section>
    );
  }

  const showCanvas = canvasReady && !canvasDead;

  return (
    <section ref={ref} className="hero" aria-label="Novaris Intro">
      <div className="hero-sticky">
        {/* LCP layer: video paints instantly, unmounts after the crossfade to WebGL */}
        {!videoGone && (
          <video
            className={`hero-media hero-video ${showCanvas ? "hero-video--hidden" : ""}`}
            src="/media/herovid.mp4"
            poster="/media/herovid-poster.avif"
            autoPlay
            muted
            loop
            playsInline
            onTransitionEnd={() => setVideoGone(true)}
          />
        )}

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

        <motion.div className="hero-intro" style={{ opacity: introOpacity }}>
          <p className="eyebrow">// Growth Engine+</p>
          <p className="hero-cue">Scroll ↓</p>
        </motion.div>

        <motion.h1 className="hero-beat" style={{ opacity: b1Opacity, y: b1Y }}>
          Hunderte Probleme. <span className="accent">Eine Lösung.</span>
        </motion.h1>

        <motion.h2 className="hero-beat" style={{ opacity: b2Opacity, y: b2Y }}>
          Hunderte Agenten. <span className="accent">Ein System.</span>
        </motion.h2>

        <motion.div className="hero-veil" style={{ opacity: veilOpacity }} aria-hidden="true" />
        <motion.div className="hero-wordmark" style={{ opacity: wmOpacity, scale: wmScale }}>
          <img src="/logos/novaris-gold-mark.png" alt="" />
          <span>ovaris</span>
        </motion.div>
      </div>
    </section>
  );
}
