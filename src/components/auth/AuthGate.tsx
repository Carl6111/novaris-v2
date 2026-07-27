import { useCallback, useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { SignIn, useUser } from "@clerk/react";
import { getLenis } from "../../lib/lenis";
import "./auth-gate.css";

/**
 * Das Anmelde-Fenster.
 *
 * Bewusst ein eigenes Fenster statt `clerk.openSignIn()`: nur so passt der
 * Ausweg "Als Gast fortfahren" mit hinein. Clerks eigenes Fenster laesst sich
 * nicht um eigene Knoepfe erweitern, und ohne sichtbaren Ausweg ist ein
 * Takeover eine Falle.
 *
 * `routing="hash"` statt "path": die Zwischenschritte von Clerk (Code
 * eingeben, Passwort zuruecksetzen) laufen hinter dem #, ohne dass die
 * Catch-all-Route in App.tsx sie auf die Startseite wirft. Beim Schliessen
 * raeumen wir den Hash wieder weg.
 */

type Props = {
  open: boolean;
  /** Steht ueber dem Formular — sagt, warum das Fenster gerade aufging. */
  title: string;
  onGuest: () => void;
};

export default function AuthGate({ open, title, onGuest }: Props) {
  const reduced = useReducedMotion();
  const { isSignedIn } = useUser();
  const restoreFocus = useRef<Element | null>(null);

  const close = useCallback(() => {
    // Clerk hinterlaesst seinen Schritt im Hash — sonst klebt "#/factor-one"
    // in der Adresszeile, nachdem das Fenster laengst zu ist.
    if (window.location.hash) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    (restoreFocus.current as HTMLElement | null)?.focus?.();
    onGuest();
  }, [onGuest]);

  // Erfolgreiche Anmeldung schliesst das Fenster von selbst.
  useEffect(() => {
    if (open && isSignedIn) close();
  }, [open, isSignedIn, close]);

  // Seite hinter dem Fenster festhalten, Tab darin einsperren, Escape raus.
  useEffect(() => {
    if (!open) return;
    restoreFocus.current = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // overflow allein stoppt Lenis nicht — es scrollt selbst.
    getLenis()?.stop();
    document.getElementById("authgate-dialog")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const root = document.getElementById("authgate-dialog");
      if (!root) return;
      const items = root.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const visible = Array.from(items).filter(
        (el) => el.offsetParent !== null && !el.hasAttribute("disabled"),
      );
      if (visible.length === 0) return;
      const first = visible[0];
      const last = visible[visible.length - 1];
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

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="authgate"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.28, ease: "easeIn" } }}
          transition={{ duration: 0.4 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <motion.div
            id="authgate-dialog"
            className="authgate-block"
            role="dialog"
            aria-modal="true"
            aria-labelledby="authgate-title"
            tabIndex={-1}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 26, scale: 0.98 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.99 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <p id="authgate-title" className="authgate-title">
              {title}
            </p>

            <div className="authgate-form">
              <SignIn routing="hash" fallbackRedirectUrl="/portal" />
            </div>

            {/* Der Ausweg. Immer sichtbar — ein Fenster, das niemanden
                rauslaesst, ist ein Fenster, das gehasst wird. */}
            <button type="button" className="authgate-guest" onClick={close}>
              Als Gast fortfahren
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
