import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { atmosphereVertex, atmosphereFragment } from "./shaders/atmosphere";

type Props = {
  position?: [number, number, number];
  radius?: number;
  atmosphereIntensity?: number;
  textureSize?: "1k" | "2k";
};

const CORAL = new THREE.Color("#f5522d");

export default function Planet({
  position = [0, 0, 0],
  radius = 2.2,
  atmosphereIntensity = 1.1,
  textureSize = "2k",
}: Props) {
  const planetRef = useRef<THREE.Mesh>(null);
  const [map, bumpMap] = useTexture([
    `/textures/mars-${textureSize}.webp`,
    "/textures/mars-bump-2k.webp",
  ]);
  map.colorSpace = THREE.SRGBColorSpace;

  const atmosphereUniforms = useMemo(
    () => ({
      uColor: { value: CORAL },
      uIntensity: { value: atmosphereIntensity },
    }),
    [atmosphereIntensity]
  );

  useFrame((_, delta) => {
    if (planetRef.current) planetRef.current.rotation.y += delta * 0.02;
  });

  return (
    <group position={position}>
      <mesh ref={planetRef}>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial
          map={map}
          bumpMap={bumpMap}
          bumpScale={0.6}
          roughness={0.95}
          metalness={0}
        />
      </mesh>
      <mesh scale={1.06}>
        <sphereGeometry args={[radius, 48, 48]} />
        <shaderMaterial
          vertexShader={atmosphereVertex}
          fragmentShader={atmosphereFragment}
          uniforms={atmosphereUniforms}
          transparent
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
