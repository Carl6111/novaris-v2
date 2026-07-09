import Reveal from "../ui/Reveal";
import MagneticButton from "../ui/MagneticButton";
import "./packages.css";

const TIERS = [
  { name: "Nova", klasse: "Klasse I", img: "/images/tier-nova.webp" },
  { name: "Pulsar", klasse: "Klasse II", img: "/images/tier-pulsar.webp" },
  { name: "Quasar", klasse: "Klasse III", img: "/images/tier-quasar.webp" },
];

// coral nerve lines with traveling pulses — same aesthetic as the old organism
const NERVES = [
  { top: "18%", delay: "0s", w: "62%" },
  { top: "34%", delay: "0.9s", w: "48%" },
  { top: "52%", delay: "0.4s", w: "70%" },
  { top: "68%", delay: "1.4s", w: "54%" },
  { top: "82%", delay: "0.7s", w: "44%" },
];

export default function Packages() {
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
            Von der ersten Automatisierung bis zur vollautonomen Operations-Ebene —
            ein Paket, das mit euch aufsteigt.
          </p>
        </Reveal>

        <Reveal delay={0.18}>
          <ul className="pkg-tiers">
            {TIERS.map((t, i) => (
              <li
                key={t.name}
                className="pkg-tier"
                style={{ ["--i" as string]: String(i) }}
              >
                <span className="pkg-tier-orb">
                  <img src={t.img} alt="" loading="lazy" width="120" height="120" />
                </span>
                <span className="pkg-tier-name">{t.name}</span>
                <span className="pkg-tier-klasse">{t.klasse}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.26}>
          <div className="pkg-cta">
            <MagneticButton to="/preise">Pakete ansehen</MagneticButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
