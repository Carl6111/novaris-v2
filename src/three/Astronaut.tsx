import { Float, useGLTF } from "@react-three/drei";

type Props = {
  position?: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
  floatSpeed?: number;
};

export default function Astronaut({
  position = [0, 0, 0],
  scale = 1,
  rotation = [0, 0, 0],
  floatSpeed = 1.2,
}: Props) {
  const { scene } = useGLTF("/models/astronaut.min.glb");
  return (
    <Float speed={floatSpeed} rotationIntensity={0.3} floatIntensity={0.7}>
      <primitive object={scene} position={position} scale={scale} rotation={rotation} />
    </Float>
  );
}

useGLTF.preload("/models/astronaut.min.glb");
