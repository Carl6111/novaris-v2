import { useEffect, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import {
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import MagneticButton from "../ui/MagneticButton";
import AuthNav from "../auth/AuthNav";
import { AUTH_READY } from "../../lib/auth";
import "./nav.css";

const LINKS = [
  { to: "/plattform", label: "Plattform" },
  { to: "/preise", label: "Preise" },
  { to: "/ueber", label: "Über" },
  { to: "/kontakt", label: "Kontakt" },
];

const NERVES = [
  { top: "16%", w: "40%", d: "0s" },
  { top: "38%", w: "30%", d: "0.8s" },
  { top: "62%", w: "46%", d: "0.4s" },
  { top: "84%", w: "34%", d: "1.2s" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const reduced = useReducedMotion();

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 80));

  // close on route change + lock scroll while open
  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const reveal = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { clipPath: "circle(0% at calc(100% - 2.6rem) 2.4rem)" },
        animate: { clipPath: "circle(150% at calc(100% - 2.6rem) 2.4rem)" },
        exit: { clipPath: "circle(0% at calc(100% - 2.6rem) 2.4rem)" },
      };

  return (
    <header className={`nav ${scrolled ? "nav--solid" : ""}`}>
      <div className="nav-pill">
        <Link to="/" className="nav-logo" aria-label="Lunakris Startseite">
          <img src="/logos/lunakris-l.png" alt="" className="nav-mark" />
          <span>UNAKRIS</span>
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

        {/* Textlink, kein Button: der einzige laute CTA bleibt "Gespräch buchen".
            Ohne Clerk-Key führt der Weg auf die Seite statt ins Fenster — sie
            sagt dort selbst, dass die Anmeldung noch nicht eingerichtet ist. */}
        {AUTH_READY ? (
          <AuthNav variant="pill" />
        ) : (
          <Link to="/login" className="nav-login">
            Anmelden
          </Link>
        )}

        <Link to="/kontakt" className="nav-cta">
          Gespräch buchen
        </Link>

        <button
          className={`nav-burger ${open ? "is-open" : ""}`}
          aria-label={open ? "Menü schließen" : "Menü öffnen"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="nav-overlay"
            {...reveal}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="css-stars" aria-hidden="true" />
            <div className="nav-overlay-nerves" aria-hidden="true">
              {NERVES.map((n, i) => (
                <span
                  key={i}
                  className={`nav-nerve ${i % 2 ? "nav-nerve--right" : ""}`}
                  style={{ top: n.top, width: n.w, ["--nd" as string]: n.d }}
                >
                  <span className="nav-nerve-pulse" />
                </span>
              ))}
            </div>

            <nav className="nav-overlay-links" aria-label="Menü">
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.to}
                  className="nav-ol-item"
                  initial={reduced ? { opacity: 0 } : { opacity: 0, x: -50, rotate: -3 }}
                  animate={{ opacity: 1, x: 0, rotate: 0 }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, x: -30 }}
                  transition={{
                    delay: reduced ? 0 : 0.18 + i * 0.08,
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <NavLink to={l.to} onClick={() => setOpen(false)}>
                    <span className="nav-ol-num">0{i + 1}</span>
                    <span className="nav-ol-label">{l.label}</span>
                    <svg className="nav-ol-underline" viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true">
                      <path d="M4 8 C 50 3, 120 11, 196 5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                    </svg>
                    <span className="nav-ol-arrow" aria-hidden="true">→</span>
                  </NavLink>
                </motion.div>
              ))}
            </nav>

            <motion.div
              className="nav-overlay-foot"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: reduced ? 0 : 0.5, duration: 0.5 }}
            >
              <MagneticButton to="/kontakt">Gespräch buchen</MagneticButton>
              {AUTH_READY ? (
                <AuthNav variant="overlay" onNavigate={() => setOpen(false)} />
              ) : (
                <Link
                  to="/login"
                  className="nav-ol-login"
                  onClick={() => setOpen(false)}
                >
                  Anmelden
                </Link>
              )}
              <p>KI-Systeme, die Ihren Betrieb täglich entlasten.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
