import { useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import "./magnetic-button.css";

type Particle = { id: number; x: number; y: number; size: number };

type Props = {
  to?: string;
  type?: "button" | "submit";
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
};

const MAGNET_RADIUS = 110;
const MAGNET_STRENGTH = 0.32;

export default function MagneticButton({ to, type, children, className = "", onClick, disabled }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  // Magnet und Partikel sind rein dekorative Bewegung und laufen über
  // Inline-Transforms — die CSS-Regel für Reduced Motion erreicht sie nicht.
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 14, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 180, damping: 14, mass: 0.4 });

  const handleMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || reduce) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    const dist = Math.hypot(dx, dy);
    if (dist < MAGNET_RADIUS + r.width / 2) {
      x.set(dx * MAGNET_STRENGTH);
      y.set(dy * MAGNET_STRENGTH);
    }
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  const burst = () => {
    if (reduce) return;
    const now = Date.now();
    const next = Array.from({ length: 12 }, (_, i) => ({
      id: now + i,
      x: Math.cos((i / 12) * Math.PI * 2) * (46 + Math.random() * 34),
      y: Math.sin((i / 12) * Math.PI * 2) * (46 + Math.random() * 34),
      size: 3 + Math.random() * 4,
    }));
    setParticles(next);
    window.setTimeout(() => setParticles([]), 650);
  };

  const inner = (
    <motion.span ref={ref} className="magbtn" style={{ x: sx, y: sy }}>
      <span className="magbtn-shimmer" aria-hidden="true" />
      <span className="magbtn-label">{children}</span>
      <span className="magbtn-particles" aria-hidden="true">
        {particles.map((p) => (
          <motion.span
            key={p.id}
            className="magbtn-particle"
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.3 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: p.size, height: p.size }}
          />
        ))}
      </span>
    </motion.span>
  );

  const shell = `magbtn-shell ${className}`;

  const handleClick = () => {
    burst();
    onClick?.();
  };

  if (to) {
    return (
      <Link
        to={to}
        className={shell}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        onClick={handleClick}
      >
        {inner}
      </Link>
    );
  }
  return (
    <button
      type={type ?? "button"}
      className={shell}
      disabled={disabled}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      onClick={handleClick}
    >
      {inner}
    </button>
  );
}
