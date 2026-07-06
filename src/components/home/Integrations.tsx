import { motion } from "motion/react";
import "./integrations.css";

const LOGOS = [
  { src: "/logos/claude.svg", alt: "Anthropic Claude" },
  { src: "/logos/openai.svg", alt: "OpenAI" },
  { src: "/logos/supabase.svg", alt: "Supabase" },
  { src: "/logos/stripe.svg", alt: "Stripe" },
];
const WORDS = ["Next.js", "HubSpot"];

export default function Integrations() {
  return (
    <section className="integrations">
      <span className="shooting-star" aria-hidden="true" />
      <div className="wrap">
        <motion.p
          className="integrations-label"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          Gebaut auf bewährter Technik — keine Klick-Tools.
        </motion.p>
        <div className="integrations-row">
          {LOGOS.map((l, i) => (
            <motion.img
              key={l.alt}
              src={l.src}
              alt={l.alt}
              className="integrations-logo"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            />
          ))}
          {WORDS.map((w, i) => (
            <motion.span
              key={w}
              className="integrations-word"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.55,
                delay: (LOGOS.length + i) * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {w}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
