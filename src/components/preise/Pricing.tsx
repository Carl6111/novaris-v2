import Reveal from "../ui/Reveal";
import MagneticButton from "../ui/MagneticButton";
import OrbitButton from "../ui/OrbitButton";
import { SketchCircle } from "../doodles/Doodles";
import "./pricing.css";

const TIERS = [
  {
    name: "Automations",
    price: "ab 500€",
    period: "/ Monat",
    desc: "Einzelne KI-Lösungen für konkrete Probleme.",
    features: [
      "Lead-Capture & Auto-Reply",
      "Anbindung an euer CRM",
      "1 Agent, sauber integriert",
    ],
    featured: false,
  },
  {
    name: "Pipeline",
    price: "~2.000€",
    period: "/ Monat",
    desc: "Lead- und Sales-Pipeline plus Automatisierungen.",
    features: [
      "Lead-Qualifizierung",
      "Sales-Automatisierung",
      "Mehrere Agents im Verbund",
      "Monatliche Optimierung",
    ],
    featured: true,
  },
  {
    name: "Growth Engine Plus",
    price: "4.000€",
    period: "/ Monat",
    desc: "Die volle Plattform für euren ganzen Betrieb.",
    features: [
      "Website + CRM + AI Docs",
      "Client Portal + Invoicing",
      "Support- & Reporting-Agents",
      "Laufender Betrieb & Support",
    ],
    featured: false,
  },
] as const;

export default function Pricing() {
  return (
    <section id="preise" className="pricing">
      <div className="wrap">
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
              <h3>{t.name}</h3>
              <div className="price-amount">
                <span className="price-value">{t.price}</span>
                <span className="price-period">{t.period}</span>
              </div>
              <p className="price-desc">{t.desc}</p>
              <ul className="price-features">
                {t.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <div className="price-cta">
                {t.featured ? (
                  <MagneticButton to="/kontakt">Gespräch buchen</MagneticButton>
                ) : (
                  <OrbitButton to="/kontakt">Gespräch buchen</OrbitButton>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
