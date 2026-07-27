import { Link } from "react-router-dom";
import { Show, SignInButton, UserButton } from "@clerk/react";
import "./auth-nav.css";

/**
 * Der Anmelde-Bereich der Navigation.
 *
 * Ausgeloggt: ein stiller Textlink, der das Clerk-Fenster öffnet — kein
 * zweiter lauter Knopf neben "Gespräch buchen".
 * Eingeloggt: Weg ins Portal plus das Konto-Menü von Clerk.
 *
 * `withSignUp` heißt: dasselbe Fenster trägt Anmeldung und Registrierung.
 * Wer noch kein Konto hat, muss nicht erst den richtigen Knopf finden.
 *
 * Wird nur gerendert, wenn ein Clerk-Key gesetzt ist — die Hooks darin
 * brauchen den Provider aus main.tsx.
 */

type Props = {
  variant: "pill" | "overlay";
  /** Schließt im Burger-Menü die Überlagerung, sobald hier etwas passiert. */
  onNavigate?: () => void;
};

export default function AuthNav({ variant, onNavigate }: Props) {
  const linkClass = variant === "pill" ? "nav-login" : "nav-ol-login";

  return (
    // Der Klick-Handler sitzt auf der Hülle statt auf den Kindern: Clerk
    // ersetzt den onClick des Trigger-Elements durch seinen eigenen.
    <span className={`authnav authnav--${variant}`} onClick={onNavigate}>
      <Show
        when="signed-in"
        fallback={
          <SignInButton mode="modal" withSignUp>
            <button type="button" className={linkClass}>
              Anmelden
            </button>
          </SignInButton>
        }
      >
        <Link to="/portal" className={linkClass}>
          Portal
        </Link>
        <UserButton />
      </Show>
    </span>
  );
}
