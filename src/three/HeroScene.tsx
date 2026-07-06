import { Suspense } from "react";
import type { MotionValue } from "motion/react";
import Starfield from "./Starfield";
import Planet from "./Planet";
import Nebula from "./Nebula";
import Astronaut from "./Astronaut";
import Effects from "./Effects";
import CameraRig from "./CameraRig";

type Props = {
  progress: MotionValue<number>;
  mobile?: boolean;
};

export default function HeroScene({ progress, mobile = false }: Props) {
  return (
    <>
      <color attach="background" args={["#0a0605"]} />
      <fog attach="fog" args={["#0a0605", 26, 60]} />

      {/* coral key light */}
      <directionalLight position={[4, 2, 3]} intensity={2.1} color="#ff7a55" />
      {/* cool fill */}
      <directionalLight position={[-4, 1, -2]} intensity={0.5} color="#7aa7ff" />
      {/* faint rim from behind the planet */}
      <pointLight position={[3.4, -1.6, -6]} intensity={1.4} color="#ffb59e" distance={18} />
      <ambientLight intensity={0.22} />

      <Suspense fallback={null}>
        <Starfield />
        <Nebula opacity={0.15} />
        <Planet
          position={[2.8, -2.6, -4]}
          radius={2.2}
          textureSize={mobile ? "1k" : "2k"}
        />
        {!mobile && (
          <Astronaut position={[-2, 0.2, 1]} scale={0.85} rotation={[0.1, 0.5, 0]} />
        )}
      </Suspense>

      <CameraRig progress={progress} />
      {!mobile && <Effects />}
    </>
  );
}
