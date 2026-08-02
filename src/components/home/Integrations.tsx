import { motion, useReducedMotion } from "motion/react";
import Marquee from "../ui/Marquee";
import "./integrations.css";

const LOGOS = [
  { src: "/logos/claude.svg", alt: "Anthropic Claude" },
  { src: "/logos/openai.svg", alt: "OpenAI" },
  { src: "/logos/supabase.svg", alt: "Supabase" },
  { src: "/logos/stripe.svg", alt: "Stripe" },
];
const WORDS = ["Next.js", "HubSpot"];

const LABEL = "Gebaut auf der Technik, mit der auch die Anbieter selbst arbeiten.";

export default function Integrations() {
  // Motion steuert transform per Inline-Style, an der CSS-Regel für Reduced
  // Motion vorbei — der Wunsch wird deshalb hier gelesen.
  const reduce = useReducedMotion();

  return (
    <section className="integrations">
      <span className="shooting-star" aria-hidden="true" />
      <div className="wrap">
        {reduce ? (
          <p className="integrations-label">{LABEL}</p>
        ) : (
          <motion.p
            className="integrations-label"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {LABEL}
          </motion.p>
        )}
        {/* Endlos-Loop statt statischer Reihe. Marquee rendert die Kopie
            für den Loop selbst (aria-hidden) und fällt bei Reduced Motion
            auf ein Umbruch-Grid zurück — daher hier nur einmal übergeben. */}
        <Marquee duration={28} className="integrations-marquee">
          {LOGOS.map((l) => (
            <img
              key={l.alt}
              src={l.src}
              alt={l.alt}
              className="integrations-logo"
            />
          ))}
          {WORDS.map((w) => (
            <span key={w} className="integrations-word">
              {w}
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
