import { useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";

type Props = {
  children: ReactNode;
  className?: string;
  frameloop?: "always" | "demand";
  camera?: { position: [number, number, number]; fov: number };
  onContextLost?: () => void;
  onReady?: () => void;
};

export default function SceneCanvas({
  children,
  className,
  frameloop = "always",
  camera = { position: [0, 0.4, 8], fov: 42 },
  onContextLost,
  onReady,
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [dead, setDead] = useState(false);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "160px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (dead) return null;

  return (
    <div ref={hostRef} className={className}>
      <Canvas
        dpr={[1, 1.75]}
        camera={camera}
        frameloop={inView ? frameloop : "never"}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener(
            "webglcontextlost",
            (e) => {
              e.preventDefault();
              setDead(true);
              onContextLost?.();
            },
            { once: true }
          );
          onReady?.();
        }}
      >
        {children}
      </Canvas>
    </div>
  );
}
