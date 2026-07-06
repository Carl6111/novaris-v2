import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useScroll, useMotionValueEvent, AnimatePresence, motion } from "motion/react";
import "./nav.css";

const LINKS = [
  { to: "/plattform", label: "Plattform" },
  { to: "/preise", label: "Preise" },
  { to: "/ueber", label: "Über" },
  { to: "/kontakt", label: "Kontakt" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 80));

  return (
    <header className={`nav ${scrolled ? "nav--solid" : ""}`}>
      <div className="nav-pill">
        <Link to="/" className="nav-logo" aria-label="Novaris Startseite">
          <img src="/logos/novaris-mark.png" alt="" className="nav-mark" />
          <span>OVARIS</span>
        </Link>

        <nav className="nav-links" aria-label="Hauptnavigation">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => (isActive ? "is-active" : "")}
            >
              <span className="nav-link-label">{l.label}</span>
              <svg className="nav-underline" viewBox="0 0 60 6" preserveAspectRatio="none" aria-hidden="true">
                <path d="M2 4 C 14 1.5, 30 5, 44 3 S 56 2.5, 58 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </NavLink>
          ))}
        </nav>

        <Link to="/kontakt" className="nav-cta">
          Gespräch buchen
        </Link>

        <button
          className="nav-burger"
          aria-label="Menü öffnen"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <span />
          <span />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="nav-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="css-stars" aria-hidden="true" />
            <button
              className="nav-close"
              aria-label="Menü schließen"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
            <nav className="nav-overlay-links">
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link to={l.to} onClick={() => setOpen(false)}>
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
