import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { inSphere } from "maath/random";

type LayerProps = {
  count: number;
  radius: number;
  size: number;
  parallax: number;
  color?: string;
};

function StarLayer({ count, radius, size, parallax, color = "#ffffff" }: LayerProps) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(
    () => inSphere(new Float32Array(count * 3), { radius }) as Float32Array,
    [count, radius]
  );

  useFrame((state, delta) => {
    const p = ref.current;
    if (!p) return;
    p.rotation.y += delta * 0.008 * parallax;
    // gentle pointer parallax
    const px = state.pointer.x * 0.06 * parallax;
    const py = state.pointer.y * 0.04 * parallax;
    p.rotation.x = THREE.MathUtils.damp(p.rotation.x, py, 2, delta);
    p.rotation.z = THREE.MathUtils.damp(p.rotation.z, px, 2, delta);
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        sizeAttenuation
        transparent
        opacity={0.9}
        depthWrite={false}
      />
    </points>
  );
}

export default function Starfield() {
  return (
    <group>
      <StarLayer count={3000} radius={60} size={0.06} parallax={1} />
      <StarLayer count={1500} radius={40} size={0.1} parallax={1.7} />
      <StarLayer count={500} radius={26} size={0.16} parallax={2.6} color="#ffe9dd" />
    </group>
  );
}
