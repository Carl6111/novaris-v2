import { Suspense } from "react";
import Starfield from "./Starfield";
import Astronaut from "./Astronaut";

// small, cheap scene: astronaut drifting beside the contact form
export default function ContactScene() {
  return (
    <>
      <directionalLight position={[3, 2, 4]} intensity={2.2} color="#ff7a55" />
      <directionalLight position={[-3, 1, -2]} intensity={0.4} color="#7aa7ff" />
      <ambientLight intensity={0.3} />

      <Suspense fallback={null}>
        <Starfield />
        <Astronaut position={[0, -0.4, 0]} scale={1.1} rotation={[0.15, -0.4, 0.05]} floatSpeed={1.5} />
      </Suspense>
    </>
  );
}
