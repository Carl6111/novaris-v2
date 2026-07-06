import { motion, useReducedMotion } from "motion/react";
import "./doodles.css";

const draw = (delay = 0, duration = 0.9) => ({
  initial: { pathLength: 0, opacity: 0 },
  whileInView: { pathLength: 1, opacity: 1 },
  viewport: { once: true, amount: 0.6 },
  transition: { delay, duration, ease: [0.65, 0, 0.35, 1] as const },
});

function useDrawProps(delay?: number, duration?: number) {
  const reduced = useReducedMotion();
  if (reduced) return { initial: { pathLength: 1, opacity: 1 } };
  return draw(delay, duration);
}

/* two-pass hand-drawn underline */
export function ScribbleUnderline({ delay = 0.15 }: { delay?: number }) {
  const p1 = useDrawProps(delay, 0.55);
  const p2 = useDrawProps(delay + 0.4, 0.45);
  return (
    <svg className="doodle doodle-underline" viewBox="0 0 220 16" preserveAspectRatio="none" aria-hidden="true">
      <motion.path d="M4 9 C 50 4, 120 12, 216 6" {...p1} />
      <motion.path d="M14 13 C 70 9, 150 14, 206 10" {...p2} />
    </svg>
  );
}

/* curved hand-drawn arrow, 3 variants */
export function HandArrow({
  variant = "curve",
  delay = 0.2,
  className = "",
}: {
  variant?: "curve" | "loop" | "straight";
  delay?: number;
  className?: string;
}) {
  const p = useDrawProps(delay, 0.8);
  const head = useDrawProps(delay + 0.6, 0.3);
  const paths = {
    curve: "M6 10 C 30 60, 80 70, 112 38",
    loop: "M6 30 C 30 6, 58 6, 56 28 C 54 46, 28 44, 34 26 C 40 10, 80 12, 112 32",
    straight: "M6 24 C 40 20, 80 30, 112 26",
  };
  const heads = {
    curve: "M100 28 L 114 39 L 98 46",
    loop: "M102 22 L 114 32 L 100 40",
    straight: "M100 17 L 114 26 L 100 35",
  };
  return (
    <svg className={`doodle doodle-arrow ${className}`} viewBox="0 0 120 80" fill="none" aria-hidden="true">
      <motion.path d={paths[variant]} {...p} />
      <motion.path d={heads[variant]} {...head} />
    </svg>
  );
}

/* open hand-drawn ellipse orbit */
export function OrbitDoodle({ delay = 0.1, className = "" }: { delay?: number; className?: string }) {
  const p = useDrawProps(delay, 1.4);
  return (
    <svg className={`doodle doodle-orbit ${className}`} viewBox="0 0 400 160" fill="none" preserveAspectRatio="none" aria-hidden="true">
      <motion.path
        d="M 322 24 C 392 52, 400 96, 322 126 C 244 156, 92 152, 38 116 C -16 80, 30 24, 130 12 C 190 5, 260 6, 306 18"
        {...p}
      />
    </svg>
  );
}

/* hand-drawn ring around a badge */
export function SketchCircle({ delay = 0.2, className = "" }: { delay?: number; className?: string }) {
  const p1 = useDrawProps(delay, 0.7);
  const p2 = useDrawProps(delay + 0.5, 0.6);
  return (
    <svg className={`doodle doodle-sketchcircle ${className}`} viewBox="0 0 140 60" fill="none" preserveAspectRatio="none" aria-hidden="true">
      <motion.path d="M 112 10 C 138 20, 136 44, 84 52 C 32 60, 4 46, 8 30 C 12 12, 60 4, 104 9" {...p1} />
      <motion.path d="M 116 16 C 132 26, 124 44, 88 48" {...p2} />
    </svg>
  );
}

/* small hand-drawn X scribble */
export function ScribbleX({ delay = 0.1 }: { delay?: number }) {
  const p1 = useDrawProps(delay, 0.35);
  const p2 = useDrawProps(delay + 0.25, 0.35);
  return (
    <svg className="doodle doodle-x" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <motion.path d="M6 7 C 12 13, 20 21, 27 26" {...p1} />
      <motion.path d="M26 6 C 19 14, 12 20, 5 27" {...p2} />
    </svg>
  );
}

/* constellation: dots + connecting lines drawn on scroll */
export function Constellation({
  points,
  className = "",
  delay = 0.1,
}: {
  points: [number, number][];
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  const d = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`)
    .join(" ");
  return (
    <svg className={`doodle doodle-constellation ${className}`} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <motion.path
        d={d}
        fill="none"
        {...(reduced
          ? { initial: { pathLength: 1, opacity: 0.5 } }
          : {
              initial: { pathLength: 0, opacity: 0 },
              whileInView: { pathLength: 1, opacity: 0.5 },
              viewport: { once: true, amount: 0.4 },
              transition: { delay, duration: 1.6, ease: [0.65, 0, 0.35, 1] },
            })}
      />
      {points.map(([x, y], i) => (
        <motion.circle
          key={i}
          cx={x}
          cy={y}
          r="1.1"
          {...(reduced
            ? { initial: { opacity: 1 } }
            : {
                initial: { opacity: 0, scale: 0 },
                whileInView: { opacity: 1, scale: 1 },
                viewport: { once: true, amount: 0.4 },
                transition: { delay: delay + i * 0.12, duration: 0.4 },
              })}
          className="doodle-star"
        />
      ))}
    </svg>
  );
}
