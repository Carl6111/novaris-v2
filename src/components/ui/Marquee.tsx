import type { CSSProperties, ReactNode } from "react";
import "./marquee.css";

type Props = {
  children: ReactNode;
  duration?: number; // Dauer eines Loops in Sekunden
  reverse?: boolean;
  className?: string;
  tiltDeg?: number; // Neigung um die X-Achse in Grad
};

// Endlos-Marquee mit leichter 3D-Neigung.
// Kinder werden zweimal gerendert (zweite Kopie aria-hidden) für den Loop.
export default function Marquee({
  children,
  duration = 32,
  reverse = false,
  className,
  tiltDeg = 5,
}: Props) {
  return (
    <div className={`marquee${className ? ` ${className}` : ""}`}>
      <div
        className="marquee-tilt"
        style={{ transform: `rotateX(${tiltDeg}deg)` } as CSSProperties}
      >
        <div
          className="marquee-track"
          style={{
            animationDuration: `${duration}s`,
            animationDirection: reverse ? "reverse" : undefined,
          }}
        >
          <div className="marquee-group">{children}</div>
          <div className="marquee-group" aria-hidden="true">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
