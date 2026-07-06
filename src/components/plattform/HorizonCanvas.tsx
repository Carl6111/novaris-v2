import SceneCanvas from "../../three/SceneCanvas";
import PlanetHorizonScene from "../../three/PlanetHorizonScene";

type Props = {
  mobile: boolean;
  onContextLost: () => void;
};

export default function HorizonCanvas({ mobile, onContextLost }: Props) {
  return (
    <SceneCanvas
      className="horizon-canvas"
      camera={{ position: [0, 0.6, 7], fov: 48 }}
      onContextLost={onContextLost}
    >
      <PlanetHorizonScene mobile={mobile} />
    </SceneCanvas>
  );
}
