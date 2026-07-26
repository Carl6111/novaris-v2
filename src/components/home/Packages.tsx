import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Reveal from "../ui/Reveal";
import MagneticButton from "../ui/MagneticButton";
import OrbitButton from "../ui/OrbitButton";
import { TIERS, TIERS_BY_ID, type TierId } from "../../data/setups";
import "./packages.css";

// coral nerve lines with traveling pulses — same aesthetic as the old organism
const NERVES = [
  { top: "18%", delay: "0s", w: "62%" },
  { top: "34%", delay: "0.9s", w: "48%" },
  { top: "52%", delay: "0.4s", w: "70%" },
  { top: "68%", delay: "1.4s", w: "54%" },
  { top: "82%", delay: "0.7s", w: "44%" },
];

export default function Packages() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState<TierId | null>(null);
  const tier = active ? TIERS_BY_ID.get(active) : undefined;

  return (
    <section className="pkg" id="pakete">
      <div className="pkg-nerves" aria-hidden="true">
        {NERVES.map((n, i) => (
          <span
            key={i}
            className={`pkg-nerve ${i % 2 ? "pkg-nerve--right" : ""}`}
            style={{ top: n.top, width: n.w, ["--nd" as string]: n.delay }}
          >
            <span className="pkg-pulse" />
          </span>
        ))}
      </div>

      <div className="wrap pkg-inner">
        <Reveal>
          <p className="eyebrow">// Drei Klassen</p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="pkg-title">
            Wählt eure <span className="accent">Umlaufbahn.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="pkg-sub">
            Die Klassen unterscheiden sich darin, wie viel gleichzeitig läuft:
            ein Prozess, ein Prozess mit allem was daran hängt, oder der ganze
            Betrieb.
          </p>
        </Reveal>

        <Reveal delay={0.18}>
          <ul className="pkg-tiers">
            {TIERS.map((t, i) => (
              <li key={t.id} style={{ ["--i" as string]: String(i) }}>
                <button
                  type="button"
                  className={`pkg-tier${active === t.id ? " pkg-tier--active" : ""}`}
                  aria-expanded={active === t.id}
                  aria-controls="pkg-detail"
                  onClick={() => setActive(active === t.id ? null : t.id)}
                >
                  <span className="pkg-tier-orb">
                    <img src={t.img} alt="" loading="lazy" width="120" height="120" />
                  </span>
                  <span className="pkg-tier-name">{t.name}</span>
                  <span className="pkg-tier-klasse">{t.klasse}</span>
                </button>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Hier bewusst flach: was genau drinsteckt, entscheidet der Besucher
            auf der Preise-Seite, nicht mitten auf der Startseite. */}
        <AnimatePresence initial={false} mode="wait">
          {tier && (
            <motion.div
              id="pkg-detail"
              className="pkg-detail"
              key={tier.id}
              initial={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
              animate={reduced ? { opacity: 1 } : { height: "auto", opacity: 1 }}
              exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.36, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="pkg-detail-inner">
                <p className="pkg-detail-rule">{tier.rule}</p>
                <p className="pkg-detail-desc">{tier.desc}</p>
                <OrbitButton to={`/preise?tier=${tier.id}`}>
                  {tier.mode === "consult"
                    ? "Was im Gespräch passiert"
                    : "Setup zusammenstellen"}
                </OrbitButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Reveal delay={0.26}>
          <div className="pkg-cta">
            <MagneticButton to="/preise">Pakete ansehen</MagneticButton>
            <OrbitButton to="/plattform">Plattform ansehen</OrbitButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
