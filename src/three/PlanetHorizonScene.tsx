import { Suspense } from "react";
import Starfield from "./Starfield";
import Planet from "./Planet";

// camera skims low over the planet so it fills the bottom as a horizon
export default function PlanetHorizonScene({ mobile = false }: { mobile?: boolean }) {
  return (
    <>
      <directionalLight position={[3, 3, 4]} intensity={2} color="#ff8a63" />
      <directionalLight position={[-5, 1, -1]} intensity={0.4} color="#7aa7ff" />
      <ambientLight intensity={0.25} />

      <Suspense fallback={null}>
        <Starfield />
        <Planet
          position={[0, -5.4, -2]}
          radius={5}
          atmosphereIntensity={1.5}
          textureSize={mobile ? "1k" : "2k"}
        />
      </Suspense>
    </>
  );
}
