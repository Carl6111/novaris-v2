import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useLocation, useNavigate } from "react-router-dom";
import { getLenis } from "../../lib/lenis";
import { useAuthGate } from "../auth/authGateContext";
import "./intro-overlay.css";

/**
 * Entry bulletin. Takes over the viewport once per session, plays the film on
 * loop, and hands the visitor to the site. Everything about it is an escape
 * route: Escape key, backdrop, close button, skip link — a takeover that traps
 * people is a takeover that gets hated.
 */

const SESSION_KEY = "lunakris:intro-seen";

/**
 * Ab wie viel gesehenem Film das Anmelde-Fenster von selbst aufgeht.
 * 0.6 = nach ~46 der 77 Sekunden. Eine Zahl, eine Entscheidung — wer frueher
 * oder spaeter fragen will, aendert nur diesen Wert.
 */
const AUTH_AT = 0.6;

/**
 * Routen, auf denen der Film nichts zu suchen hat. Wer hier landet, kommt zum
 * Arbeiten, nicht um beworben zu werden — /admin ist Carls Posteingang.
 */
const INTERN = ["/admin"];

export default function IntroOverlay() {
  const reduced = useReducedMotion();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const gate = useAuthGate();
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const restoreFocus = useRef<Element | null>(null);
  // Nur einmal pro Session fragen. Ohne die Sperre feuert `timeupdate`
  // viermal pro Sekunde weiter, sobald die Schwelle ueberschritten ist.
  const asked = useRef(false);

  useEffect(() => {
    // Auf einer internen Seite gestartet: der Film gilt fuer diese Sitzung als
    // gesehen. Sonst poppt er beim ersten Klick zurueck auf die Website auf —
    // mitten in der Arbeit, was noch stoerender waere als am Anfang.
    if (INTERN.some((p) => pathname.startsWith(p))) {
      sessionStorage.setItem(SESSION_KEY, "1");
      return;
    }
    if (sessionStorage.getItem(SESSION_KEY)) return;
    restoreFocus.current = document.activeElement;
    setOpen(true);
  }, [pathname]);

  const close = useCallback(() => {
    sessionStorage.setItem(SESSION_KEY, "1");
    setOpen(false);
    (restoreFocus.current as HTMLElement | null)?.focus?.();
  }, []);

  // Same exit as closing — the overlay animates out while the route swaps
  // underneath, so the visitor never sees a bare white frame.
  const goToPricing = useCallback(() => {
    close();
    navigate("/preise");
  }, [close, navigate]);

  /**
   * Wer den Film weit genug gesehen hat, hat Interesse bewiesen. Erst dann
   * geht das Anmelde-Fenster auf — davor bleibt der Weg reibungsfrei.
   * Der Film macht dabei Platz, statt sich zwei Fenster zu stapeln.
   */
  const askForAccount = useCallback(() => {
    if (asked.current || gate.allowed) return;
    asked.current = true;
    close();
    gate.open("Sie haben gesehen, was Lunakris macht.");
  }, [close, gate]);

  const onProgress = useCallback(() => {
    const v = videoRef.current;
    if (!v || !v.duration || Number.isNaN(v.duration)) return;
    if (v.currentTime / v.duration >= AUTH_AT) askForAccount();
  }, [askForAccount]);

  // Lock the page behind the overlay, trap Tab inside it, close on Escape.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // overflow alone doesn't stop Lenis — it drives scroll itself.
    getLenis()?.stop();
    // Focus the dialog rather than the close button: a screen reader gets the
    // title, and no control opens wearing a focus ring.
    document.getElementById("intro-dialog")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const root = document.getElementById("intro-dialog");
      if (!root) return;
      const items = root.querySelectorAll<HTMLElement>(
        'button, [href], input, video[controls], [tabindex]:not([tabindex="-1"])',
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      getLenis()?.start();
    };
  }, [open, close]);

  // Nothing plays until the visitor asks for it. Muted to start; the native
  // control bar carries the timeline, the timestamps and the volume from there.
  const start = () => {
    const v = videoRef.current;
    if (!v) return;
    void v.play();
    setPlaying(true);
  };

  // Staggered entrance — one orchestrated load beats scattered micro-motion.
  const rise = (delay: number) =>
    reduced
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.2 } }
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration: 0.62, ease: [0.16, 1, 0.3, 1] as const },
        };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="intro"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.32, ease: "easeIn" } }}
          transition={{ duration: 0.5 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          {/* Fixed to the viewport corner, not to the content — the only way out
              the visitor has to find, so it stays in the same place regardless
              of how tall the film block ends up. */}
          <button
            type="button"
            className="intro-close"
            onClick={close}
            aria-label="Schließen"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6 L18 18 M18 6 L6 18" />
            </svg>
          </button>

          <motion.div
            id="intro-dialog"
            className="intro-block"
            role="dialog"
            aria-modal="true"
            aria-labelledby="intro-title"
            tabIndex={-1}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.975 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.985 }}
            transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Kein h1 — die Seite dahinter bringt ihre eigene Überschrift mit. */}
            <motion.p id="intro-title" className="intro-title" {...rise(0.14)}>
              Das ist <span className="intro-brand">Lunakris</span>
            </motion.p>

            <motion.p className="intro-sub" {...rise(0.2)}>
              77 Sekunden: Anruf-Agent, Website, CRM, AI Docs und Client Portal
              in einem System.
            </motion.p>

            <motion.div className="intro-stage" {...rise(0.26)}>
              <video
                ref={videoRef}
                className="intro-video"
                src="/videos/lunakris-intro.mp4"
                poster="/images/lunakris-intro-poster.webp"
                muted
                controls
                playsInline
                preload="metadata"
                aria-label="Lunakris Demo-Film"
                onPlay={() => setPlaying(true)}
                onTimeUpdate={onProgress}
                // Sicherheitsnetz: wer vorspult, ueberspringt die Schwelle.
                onEnded={askForAccount}
              />
              {!playing && (
                <button
                  type="button"
                  className="intro-play"
                  onClick={start}
                  aria-label="Demo-Video abspielen"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    {/* Bounding box 7..17 on a 24 grid — dead centre, no optical nudge. */}
                    <path d="M7 5 L17 12 L7 19 Z" />
                  </svg>
                </button>
              )}
            </motion.div>

            <motion.div className="intro-actions" {...rise(0.34)}>
              <button type="button" className="intro-cta" onClick={goToPricing}>
                Angebote ansehen
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 12 H18 M12.5 6.5 L18 12 L12.5 17.5" />
                </svg>
              </button>
              <button type="button" className="intro-skip" onClick={close}>
                Weiter zur Seite
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
