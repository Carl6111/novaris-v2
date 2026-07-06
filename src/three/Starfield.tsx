import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { inSphere } from "maath/random";

// soft round glow sprite so stars render circular, not square
let starSprite: THREE.Texture | null = null;
function getStarSprite(): THREE.Texture {
  if (starSprite) return starSprite;
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.8)");
  g.addColorStop(0.7, "rgba(255,255,255,0.18)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  starSprite = new THREE.CanvasTexture(canvas);
  starSprite.colorSpace = THREE.SRGBColorSpace;
  return starSprite;
}

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
  const sprite = useMemo(getStarSprite, []);

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
        map={sprite}
        size={size}
        color={color}
        sizeAttenuation
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function Starfield() {
  return (
    <group>
      <StarLayer count={3000} radius={60} size={0.1} parallax={1} />
      <StarLayer count={1500} radius={40} size={0.16} parallax={1.7} />
      <StarLayer count={500} radius={26} size={0.24} parallax={2.6} color="#ffe9dd" />
    </group>
  );
}
