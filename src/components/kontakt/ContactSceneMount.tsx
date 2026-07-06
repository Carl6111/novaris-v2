import { lazy, Suspense, useState } from "react";
import { useReducedMotion } from "motion/react";

const ContactCanvas = lazy(() => import("./ContactCanvas"));

const isMobile = () =>
  typeof window !== "undefined" &&
  (window.innerWidth < 768 || navigator.hardwareConcurrency <= 4);

export default function ContactSceneMount() {
  const reduced = useReducedMotion();
  const [dead, setDead] = useState(false);
  const [mobile] = useState(isMobile);

  if (reduced || dead || mobile) {
    return (
      <img
        src="/images/astronaut-cutout.webp"
        alt=""
        className="contact-astronaut-fallback"
        loading="lazy"
        width="800"
        height="1422"
      />
    );
  }

  return (
    <Suspense fallback={null}>
      <ContactCanvas onContextLost={() => setDead(true)} />
    </Suspense>
  );
}
