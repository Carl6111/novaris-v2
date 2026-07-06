import Reveal from "../ui/Reveal";
import MagneticButton from "../ui/MagneticButton";
import "./cta.css";

export default function Cta() {
  return (
    <section className="cta">
      <div className="cta-bg" aria-hidden="true" />
      <div className="cta-glow" aria-hidden="true" />
      <div className="wrap cta-inner">
        <Reveal>
          <p className="eyebrow">// Unverbindlich</p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="cta-title">
            Lass uns <span className="accent">15 Minuten</span> reden.
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="cta-sub">
            Wir schauen gemeinsam, wo euer System am meisten Zeit spart —
            unverbindlich.
          </p>
        </Reveal>
        <Reveal delay={0.18}>
          <div className="cta-actions">
            <MagneticButton to="/kontakt">Gespräch buchen</MagneticButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
