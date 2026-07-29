import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Reveal from "../ui/Reveal";
import TiltCard from "../ui/TiltCard";
import TierSelector from "./TierSelector";
import { getLenis } from "../../lib/lenis";
import { TIERS, isTierId, type TierId } from "../../data/setups";
import "./pricing.css";

export default function Pricing() {
  const reduceMotion = useReducedMotion();
  const [searchParams] = useSearchParams();
  const [openTier, setOpenTier] = useState<TierId | null>(null);
  const cardRefs = useRef<Partial<Record<TierId, HTMLDivElement | null>>>({});

  // ?tier=pulsar öffnet die passende Karte und holt sie in den Blick — der
  // Einstieg von der Startseite landet damit nicht oben auf einer fremden Seite.
  const tierParam = searchParams.get("tier");
  useEffect(() => {
    if (!isTierId(tierParam)) return;
    setOpenTier(tierParam);
    const el = cardRefs.current[tierParam];
    if (!el) return;
    const lenis = getLenis();
    // Ein Tick Verzögerung: die Karte muss erst aufgeklappt sein, sonst
    // scrollen wir auf die alte Höhe.
    const id = window.setTimeout(() => {
      if (lenis) lenis.scrollTo(el, { offset: -110 });
      else el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
    return () => window.clearTimeout(id);
  }, [tierParam]);

  // Am Handy stehen die Karten untereinander: die aufgeklappte Auswahl liegt
  // sonst komplett unter der Falz. Am Desktop stehen alle drei nebeneinander,
  // dort waere das Wegscrollen aufdringlich. Beim Schliessen wird nicht
  // gescrollt — die Seite wird kuerzer, das ist bei einem Akkordeon richtig so.
  const toggleTier = (id: TierId, isOpen: boolean) => {
    setOpenTier(isOpen ? null : id);
    if (isOpen || !window.matchMedia("(max-width: 900px)").matches) return;
    const el = cardRefs.current[id];
    if (!el) return;
    const lenis = getLenis();
    window.setTimeout(() => {
      if (lenis) lenis.scrollTo(el, { offset: -90 });
      else el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  };

  return (
    <section id="preise" className="pricing">
      <div className="wrap">
        <Reveal>
          <div className="pricing-head">
            <p className="eyebrow">// Drei Klassen</p>
            <h2>
              Wählen Sie das Problem. Wir bauen das <span className="accent">System.</span>
            </h2>
            <p className="pricing-lead">
              Sie klicken an, was Ihnen am meisten Zeit kostet. Was Sie dafür
              brauchen, setzen wir zusammen.
            </p>
          </div>
        </Reveal>

        <div className="pricing-grid">
          {TIERS.map((t, i) => {
            const open = openTier === t.id;
            return (
              <motion.div
                key={t.id}
                ref={(el) => {
                  cardRefs.current[t.id] = el;
                }}
                className={`price-card${t.id === "pulsar" ? " price-card--featured" : ""}${
                  open ? " price-card--open" : ""
                }`}
                initial={
                  reduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, rotateX: -18, y: 40 }
                }
                whileInView={
                  reduceMotion ? { opacity: 1 } : { opacity: 1, rotateX: 0, y: 0 }
                }
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Offen ist die Karte ein Formular — Tilt und Glanzlicht
                    würden beim Anklicken der Optionen im Weg stehen. */}
                <TiltCard maxTilt={open ? 0 : 6} lift={!open} glare={!open}>
                  <div className="price-visual">
                    <img
                      src={t.img}
                      alt=""
                      loading="lazy"
                      width="1000"
                      height="750"
                    />
                    <span className="price-klasse">{t.klasse}</span>
                  </div>

                  <div className="price-body">
                    <h3>{t.name}</h3>
                    <p className="price-desc">{t.desc}</p>

                    <button
                      type="button"
                      className="price-toggle"
                      aria-expanded={open}
                      aria-controls={`tier-panel-${t.id}`}
                      onClick={() => toggleTier(t.id, open)}
                    >
                      <span>
                        {open
                          ? "Auswahl schließen"
                          : t.mode === "consult"
                            ? "Wie das läuft"
                            : "Setup zusammenstellen"}
                      </span>
                      <svg
                        className="price-toggle-chevron"
                        viewBox="0 0 24 16"
                        aria-hidden="true"
                      >
                        <path
                          d="M3 4 C 7 9, 11 12, 12 12.5 C 13 12, 17 9, 21 4.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          fill="none"
                        />
                      </svg>
                    </button>
                  </div>

                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        id={`tier-panel-${t.id}`}
                        role="region"
                        className="price-panel"
                        initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          duration: reduceMotion ? 0 : 0.38,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      >
                        <TierSelector tier={t} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
