import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { MotionValue } from "motion/react";

type Props = {
  progress: MotionValue<number>;
};

// scroll-keyed camera path through the hero scene
const POSITIONS = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 0.4, 8),
  new THREE.Vector3(1.4, -0.5, 5.6),
  new THREE.Vector3(0.2, 0.2, 3.9),
  new THREE.Vector3(-3.2, 0.6, 3.3),
  new THREE.Vector3(-1.2, 0.7, 6.2),
]);

const TARGETS = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(2.4, -2.2, -3.4),
  new THREE.Vector3(-1.6, 0.2, 0.8),
  new THREE.Vector3(-2, 0.2, 1),
  new THREE.Vector3(0, 0.2, 0),
]);

export default function CameraRig({ progress }: Props) {
  const posTmp = useRef(new THREE.Vector3());
  const tgtTmp = useRef(new THREE.Vector3());
  const smoothTarget = useRef(new THREE.Vector3(0, 0, 0));
  const smoothPos = useRef(new THREE.Vector3(0, 0.4, 8));
  const initialized = useRef(false);
  const up = useMemo(() => new THREE.Vector3(0, 1, 0), []);

  useFrame((state, delta) => {
    const t = THREE.MathUtils.clamp(progress.get(), 0, 1);
    POSITIONS.getPointAt(t, posTmp.current);
    TARGETS.getPointAt(t, tgtTmp.current);

    if (!initialized.current) {
      smoothPos.current.copy(posTmp.current);
      smoothTarget.current.copy(tgtTmp.current);
      initialized.current = true;
    }

    const d = Math.min(delta, 0.05);
    smoothPos.current.lerp(posTmp.current, 1 - Math.exp(-5 * d));
    smoothTarget.current.lerp(tgtTmp.current, 1 - Math.exp(-5 * d));

    // gentle pointer sway on top of the path
    const swayX = state.pointer.x * 0.25;
    const swayY = state.pointer.y * 0.15;

    state.camera.position.set(
      smoothPos.current.x + swayX,
      smoothPos.current.y + swayY,
      smoothPos.current.z
    );
    state.camera.up.copy(up);
    state.camera.lookAt(smoothTarget.current);
  });

  return null;
}
