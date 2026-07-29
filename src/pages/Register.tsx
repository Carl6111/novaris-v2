import { Link } from "react-router-dom";
import { SignUp } from "@clerk/react";
import PageHero from "../components/ui/PageHero";
import { AUTH_READY } from "../lib/auth";
import "./login.css";

/**
 * Die eigene Registrierung.
 *
 * Das Anmeldefenster trägt mit `withSignUp` beides in einem Formular — wer
 * eine unbekannte Adresse eingibt, legt dabei ein Konto an. Diese Seite ist
 * der sichtbare Weg dorthin: ohne sie gibt es nirgends auf der Website das
 * Wort "Registrieren", und Clerk zeigt seinen eigenen Wechsel-Link nur, wenn
 * eine signUpUrl gesetzt ist (siehe main.tsx).
 */

export default function Register() {
  return (
    <>
      <PageHero
        eyebrow="// Zugang"
        title={
          <>
            Konto <span className="accent">anlegen</span>.
          </>
        }
        subtitle="Ein Zugang für Website, CRM, AI Docs, Client Portal und Anruf-Agent."
      />

      <section className="login">
        <div className="wrap login-inner">
          {AUTH_READY ? (
            <SignUp routing="hash" fallbackRedirectUrl="/portal" />
          ) : (
            <p className="login-note" role="status">
              Die Anmeldung ist noch nicht eingerichtet. Bis dahin läuft alles
              über das Erstgespräch.
            </p>
          )}

          <p className="login-alt">
            Schon ein Konto? <Link to="/login">Anmelden →</Link>
          </p>
        </div>
      </section>
    </>
  );
}
