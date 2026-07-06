import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";

export default function Effects() {
  return (
    <EffectComposer>
      <Bloom mipmapBlur intensity={0.7} luminanceThreshold={0.75} luminanceSmoothing={0.2} />
      <Vignette eskil={false} offset={0.25} darkness={0.75} />
    </EffectComposer>
  );
}
