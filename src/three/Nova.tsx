import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

// generated nova backdrop — additive blending keys out the black background
export default function Nova() {
  const ref = useRef<THREE.Mesh>(null);
  const map = useTexture("/textures/nova.webp");
  map.colorSpace = THREE.SRGBColorSpace;

  useFrame((state) => {
    const m = ref.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    // slow breathing pulse, barely perceptible rotation
    const s = 1 + Math.sin(t * 0.25) * 0.02;
    m.scale.set(56 * s, 31.5 * s, 1);
    m.rotation.z = t * 0.004;
  });

  return (
    <mesh ref={ref} position={[-6, 4, -25]} scale={[56, 31.5, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={map}
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        fog={false}
      />
    </mesh>
  );
}
