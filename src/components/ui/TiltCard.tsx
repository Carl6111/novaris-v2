import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import type { PointerEvent, ReactNode } from "react";
import "./tilt-card.css";

type Props = {
  children: ReactNode;
  className?: string;
  maxTilt?: number; // maximale Neigung in Grad
  glare?: boolean; // Glanzlicht, das dem Cursor folgt
  lift?: boolean; // leichtes Hochskalieren beim Hover
};

// Pointer-getrackte 3D-Tilt-Card mit starlit-card-Spotlight.
// Der onPointerMove-Handler setzt die CSS-Vars --mx/--my (in %) auf der Card,
// sodass der Spotlight-Gradient dem Cursor folgt.
// Konsumenten können Kinder via CSS `transform: translateZ(30px)` in die
// Tiefe staffeln — die Card rendert mit `transform-style: preserve-3d`.
export default function TiltCard({
  children,
  className,
  maxTilt = 8,
  glare = true,
  lift = true,
}: Props) {
  const reduceMotion = useReducedMotion();

  // Rohe Pointer-MotionValues (relative Position in % für das Glare)
  const px = useMotionValue(50);
  const py = useMotionValue(50);

  // Federnde Rotation für weiches Nachschwingen
  const rotateX = useSpring(0, { stiffness: 260, damping: 22 });
  const rotateY = useSpring(0, { stiffness: 260, damping: 22 });

  // Helles Highlight über --primary-foreground (in beiden Modi annähernd weiß)
  const glareBackground = useMotionTemplate`radial-gradient(320px circle at ${px}% ${py}%, color-mix(in oklab, var(--primary-foreground) 10%, transparent), transparent 60%)`;

  if (reduceMotion) {
    // Statische Variante ohne Listener und Springs
    return (
      <div className={`tilt-wrap${className ? ` ${className}` : ""}`}>
        <div className="tilt-card">{children}</div>
      </div>
    );
  }

  const handleMove = (e: PointerEvent<HTMLDivElement>) => {
    // Touch-Geräte: kein Tilt (wie TiltFrame in ModuleRows)
    if (e.pointerType === "touch") return;
    const rect = e.currentTarget.getBoundingClientRect();
    // Relative Position im Bereich -0.5..0.5
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(relX * maxTilt);
    rotateX.set(-relY * maxTilt);
    const xPct = (relX + 0.5) * 100;
    const yPct = (relY + 0.5) * 100;
    px.set(xPct);
    py.set(yPct);
    // Spotlight-Position für den ::before-Gradienten (starlit-card-Konvention)
    e.currentTarget.style.setProperty("--mx", `${xPct}%`);
    e.currentTarget.style.setProperty("--my", `${yPct}%`);
  };

  const handleLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    px.set(50);
    py.set(50);
  };

  return (
    <div className={`tilt-wrap${className ? ` ${className}` : ""}`}>
      <motion.div
        className="tilt-card"
        style={{ rotateX, rotateY }}
        whileHover={lift ? { scale: 1.02 } : undefined}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
      >
        {glare && (
          <motion.div
            className="tilt-glare"
            aria-hidden="true"
            style={{ background: glareBackground }}
          />
        )}
        {children}
      </motion.div>
    </div>
  );
}
