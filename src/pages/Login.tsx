import { Link } from "react-router-dom";
import PageHero from "../components/ui/PageHero";
import LeadCapture from "../components/lead/LeadCapture";
import "./login.css";

/**
 * Der Einstieg, den die Seite überall verspricht ("ein Login").
 *
 * Kein Passwortfeld: das Portal gehört zum Setup und wird eingerichtet, nicht
 * selbst angelegt. Ein Feld, das nichts tut, wäre schlimmer als keins.
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
          <LeadCapture
            variant="page"
            quelle="login"
            subject="Zugangsanfrage — Login-Seite"
            title="Ihre hinterlegte E-Mail-Adresse"
            cta="Zugangslink anfordern"
            doneText="Angekommen. Wir melden uns in 24 h."
          />

          <p className="login-note">
            Ihr Zugang gehört zu Ihrem Setup. Wir schicken den Link an die
            Adresse, die bei uns hinterlegt ist.
          </p>

          <p className="login-alt">
            Noch kein Zugang? <Link to="/kontakt">Gespräch buchen →</Link>
          </p>
        </div>
      </section>
    </>
  );
}
