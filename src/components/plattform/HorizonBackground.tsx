import { lazy, Suspense, useState } from "react";
import { useReducedMotion } from "motion/react";
import "./horizon.css";

const HorizonCanvas = lazy(() => import("./HorizonCanvas"));

const isMobile = () =>
  typeof window !== "undefined" &&
  (window.innerWidth < 768 || navigator.hardwareConcurrency <= 4);

export default function HorizonBackground() {
  const reduced = useReducedMotion();
  const [dead, setDead] = useState(false);
  const [mobile] = useState(isMobile);

  if (reduced || dead) {
    return <div className="css-stars" aria-hidden="true" />;
  }

  return (
    <Suspense fallback={<div className="css-stars" aria-hidden="true" />}>
      <HorizonCanvas mobile={mobile} onContextLost={() => setDead(true)} />
    </Suspense>
  );
}
