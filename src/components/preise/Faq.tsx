import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Reveal from "../ui/Reveal";
import { FAQS } from "../../data/faq";
import "./faq.css";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();

  return (
    <section id="faq" className="faq">
      <div className="wrap">
        <Reveal>
          <div className="section-head">
            <p className="eyebrow">// Kurz beantwortet</p>
            <h2>Häufige Fragen.</h2>
          </div>
        </Reveal>

        <div className="faq-list">
          {FAQS.map((f, i) => {
            const open = openIndex === i;
            return (
              <Reveal key={f.q} delay={i * 0.05}>
                <div className={`faq-item${open ? " faq-item--open" : ""}`}>
                  <button
                    type="button"
                    className="faq-trigger"
                    aria-expanded={open}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-trigger-${i}`}
                    onClick={() => setOpenIndex(open ? null : i)}
                  >
                    <span>{f.q}</span>
                    <svg className="faq-chevron" viewBox="0 0 24 16" fill="none" aria-hidden="true">
                      <path
                        d="M3 4 C 7 9, 11 12, 12 12.5 C 13 12, 17 9, 21 4.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        id={`faq-panel-${i}`}
                        role="region"
                        aria-labelledby={`faq-trigger-${i}`}
                        className="faq-panel"
                        initial={
                          reduceMotion ? false : { height: 0, opacity: 0 }
                        }
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          duration: reduceMotion ? 0 : 0.35,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      >
                        {/* Padding auf separatem Inner-Div, damit die Höhen-Animation nicht springt */}
                        <div className="faq-panel-inner">
                          <p>{f.a}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
