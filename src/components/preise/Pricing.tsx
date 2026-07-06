import Reveal from "../ui/Reveal";
import MagneticButton from "../ui/MagneticButton";
import OrbitButton from "../ui/OrbitButton";
import { SketchCircle } from "../doodles/Doodles";
import "./pricing.css";

type Tier = {
  klasse: string;
  name: string;
  img: string;
  price: string;
  desc: string;
  features: string[];
  featured: boolean;
};

const TIERS: Tier[] = [
  {
    klasse: "Klasse I · Zündung",
    name: "Nova",
    img: "/images/tier-nova.webp",
    price: "Auf Anfrage",
    desc: "Eure erste Automatisierung, richtig gebaut.",
    features: [
      "1 Kernprozess end-to-end automatisiert",
      "Bis zu 3 Tool-Integrationen",
      "Monitoring + monatliches Tuning",
      "Async-Support",
    ],
    featured: false,
  },
  {
    klasse: "Klasse II · Rotation",
    name: "Pulsar",
    img: "/images/tier-pulsar.webp",
    price: "Auf Anfrage",
    desc: "Eine Automatisierungs-Engine über eure Abläufe.",
    features: [
      "3–5 Prozesse + 1 individueller KI-Agent",
      "Bis zu 10 Tool-Integrationen",
      "Datenpipeline + Reporting-Ebene",
      "Fester Engineer, wöchentlicher Takt",
    ],
    featured: true,
  },
  {
    klasse: "Klasse III · Leuchtkern",
    name: "Quasar",
    img: "/images/tier-quasar.webp",
    price: "Auf Anfrage",
    desc: "Eine vollautonome Operations-Ebene.",
    features: [
      "Unbegrenzte Prozesse + Agent-Flotte",
      "Firmenweites Integrations-Netz",
      "Eigene Modelle auf euren Daten",
      "Eingebettetes Team, SLA, 24/7-Überwachung",
    ],
    featured: false,
  },
];

export default function Pricing() {
  return (
    <section id="preise" className="pricing">
      <div className="wrap">
        <Reveal>
          <div className="pricing-head">
            <p className="eyebrow">// Missions-Klassen</p>
            <h2>
              Drei Größenordnungen <span className="accent">Schub.</span>
            </h2>
            <p className="pricing-lead">
              Jede Zusammenarbeit ist eine Mission mit eigener Klasse. Startet bei
              Nova und steigt auf — oder direkt in eine hellere Umlaufbahn.
            </p>
          </div>
        </Reveal>

        <div className="pricing-grid">
          {TIERS.map((t, i) => (
            <Reveal
              key={t.name}
              delay={i * 0.08}
              className={`price-card ${t.featured ? "price-card--featured" : ""}`}
            >
              {t.featured && (
                <span className="price-badge-wrap">
                  <SketchCircle delay={0.7} />
                  <span className="price-badge">Beliebt</span>
                </span>
              )}
              <div className="price-visual">
                <img
                  src={t.img}
                  alt={`${t.name} — ${t.desc}`}
                  loading="lazy"
                  width="1000"
                  height="750"
                />
                <span className="price-klasse">{t.klasse}</span>
              </div>
              <div className="price-body">
                <h3>{t.name}</h3>
                <div className="price-amount">
                  <span className="price-value">{t.price}</span>
                </div>
                <p className="price-desc">{t.desc}</p>
                <ul className="price-features">
                  {t.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <div className="price-cta">
                  {t.featured ? (
                    <MagneticButton to="/kontakt">{t.name} starten</MagneticButton>
                  ) : (
                    <OrbitButton to="/kontakt">{t.name} starten</OrbitButton>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
