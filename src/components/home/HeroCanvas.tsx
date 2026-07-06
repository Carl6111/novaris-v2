import type { MotionValue } from "motion/react";
import SceneCanvas from "../../three/SceneCanvas";
import HeroScene from "../../three/HeroScene";

type Props = {
  progress: MotionValue<number>;
  mobile: boolean;
  visible: boolean;
  onReady: () => void;
  onContextLost: () => void;
};

export default function HeroCanvas({
  progress,
  mobile,
  visible,
  onReady,
  onContextLost,
}: Props) {
  return (
    <SceneCanvas
      className={`hero-canvas ${visible ? "hero-canvas--visible" : ""}`}
      onReady={onReady}
      onContextLost={onContextLost}
    >
      <HeroScene progress={progress} mobile={mobile} />
    </SceneCanvas>
  );
}
