import SceneCanvas from "../../three/SceneCanvas";
import ContactScene from "../../three/ContactScene";

export default function ContactCanvas({ onContextLost }: { onContextLost: () => void }) {
  return (
    <SceneCanvas
      className="contact-canvas"
      camera={{ position: [0, 0.2, 4.2], fov: 45 }}
      onContextLost={onContextLost}
    >
      <ContactScene />
    </SceneCanvas>
  );
}
