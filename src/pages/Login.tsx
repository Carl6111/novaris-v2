import { Link } from "react-router-dom";
import { SignIn } from "@clerk/react";
import PageHero from "../components/ui/PageHero";
import { AUTH_READY } from "../lib/auth";
import "./login.css";

/**
 * Der Einstieg, den die Seite überall verspricht ("ein Login").
 *
 * Der Hauptweg ist das Fenster aus der Navigation. Diese Seite fängt ab, wer
 * die Adresse direkt eintippt oder aus einer alten Mail kommt.
 *
 * `routing="hash"` statt "path": die Zwischenschritte von Clerk (Code
 * eingeben, Passwort zurücksetzen) laufen damit hinter dem #, ohne dass die
 * Catch-all-Route in App.tsx sie auf die Startseite wirft.
 */

export default function Login() {
  return (
    <>
      <PageHero
        eyebrow="// Zugang"
        title={
          <>
            Ein System. <span className="accent">Ein Login.</span>
          </>
        }
        subtitle="Website, CRM, AI Docs, Client Portal und Anruf-Agent — hinter einer Anmeldung."
      />

      <section className="login">
        <div className="wrap login-inner">
          {AUTH_READY ? (
            <SignIn routing="hash" signUpUrl="/login" fallbackRedirectUrl="/portal" />
          ) : (
            <p className="login-note" role="status">
              Die Anmeldung ist noch nicht eingerichtet. Bis dahin läuft alles
              über das Erstgespräch.
            </p>
          )}

          <p className="login-alt">
            Noch kein Zugang? <Link to="/kontakt">Gespräch buchen →</Link>
          </p>
        </div>
      </section>
    </>
  );
}
