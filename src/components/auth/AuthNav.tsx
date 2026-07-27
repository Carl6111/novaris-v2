import { Link } from "react-router-dom";
import { useClerk, useUser, UserButton } from "@clerk/react";
import "./auth-nav.css";

/**
 * Der Anmelde-Bereich der Navigation.
 *
 * Ausgeloggt: ein stiller Textlink, der das Clerk-Fenster öffnet — kein
 * zweiter lauter Knopf neben "Gespräch buchen".
 * Eingeloggt: Weg ins Portal plus das Konto-Menü von Clerk.
 *
 * Bewusst `openSignIn()` statt `<SignInButton mode="modal">` in einem
 * `<Show>`: Clerk schließt sein Fenster, sobald der auslösende Knopf
 * ausgehängt wird, und `<Show>` liefert `null`, solange der Auth-Zustand
 * lädt. Beim Absenden des Formulars flackert genau dieser Zustand — das
 * Fenster ging dabei mitten in der Registrierung zu. Der Trigger hier bleibt
 * deshalb dauerhaft gemountet, und das Fenster gehört Clerk allein.
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
  const clerk = useClerk();
  const { isSignedIn } = useUser();
  const linkClass = variant === "pill" ? "nav-login" : "nav-ol-login";

  // Nur ein bestätigtes `true` schaltet um. Während `isSignedIn` noch
  // undefined ist, bleibt der Trigger stehen statt kurz zu verschwinden.
  if (isSignedIn === true) {
    return (
      <span className={`authnav authnav--${variant}`}>
        <Link to="/portal" className={linkClass} onClick={onNavigate}>
          Portal
        </Link>
        <UserButton />
      </span>
    );
  }

  return (
    <span className={`authnav authnav--${variant}`}>
      <button
        type="button"
        className={linkClass}
        onClick={() => {
          onNavigate?.();
          void clerk.openSignIn({ withSignUp: true });
        }}
      >
        Anmelden
      </button>
    </span>
  );
}
