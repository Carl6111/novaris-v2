import { Link } from "react-router-dom";
import { useUser } from "@clerk/react";
import PageHero from "../components/ui/PageHero";
import { AUTH_READY, zahlungslinkOf } from "../lib/auth";
import "./portal.css";

/**
 * Was ein angemeldeter Kunde sieht.
 *
 * Noch keine Module — die Plattform selbst wird gebaut. Was hier steht, ist
 * ehrlich: der Stand des Setups und, sobald nach dem Erstgespräch hinterlegt,
 * der Zahlungslink. Eine Attrappe mit leeren Kacheln wäre schlimmer als eine
 * kurze Seite, die sagt, woran gerade gearbeitet wird.
 */

function PortalInner() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return <p className="portal-state">Einen Moment…</p>;
  }

  if (!isSignedIn) {
    return (
      <p className="portal-state" role="status">
        Bitte melden Sie sich an. <Link to="/login">Zur Anmeldung →</Link>
      </p>
    );
  }

  const zahlungslink = zahlungslinkOf(user.publicMetadata);
  const anrede = user.firstName ?? user.primaryEmailAddress?.emailAddress ?? "";

  return (
    <>
      <p className="portal-hello">
        Willkommen{anrede ? `, ${anrede}` : ""}.
      </p>

      <div className="portal-card">
        <h2>Ihr Setup</h2>
        <p>
          Wir richten Ihre Module ein. Sobald ein Modul live geht, erscheint es
          hier — Sie müssen nichts installieren und nichts freischalten.
        </p>
      </div>

      {zahlungslink ? (
        <div className="portal-card portal-card--pay">
          <h2>Zahlung</h2>
          <p>Ihr Paket aus dem Erstgespräch liegt bereit.</p>
          <a
            className="portal-pay"
            href={zahlungslink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Zahlung einrichten →
          </a>
        </div>
      ) : (
        <div className="portal-card">
          <h2>Zahlung</h2>
          <p>
            Noch nichts offen. Nach dem Erstgespräch liegt der Zahlungslink für
            Ihr Paket an dieser Stelle.
          </p>
        </div>
      )}
    </>
  );
}

export default function Portal() {
  return (
    <>
      <PageHero
        eyebrow="// Portal"
        title={
          <>
            Ihr <span className="accent">Betrieb.</span>
          </>
        }
        subtitle="Der Stand Ihres Setups, an einer Stelle."
      />

      <section className="portal">
        <div className="wrap portal-inner">
          {AUTH_READY ? (
            <PortalInner />
          ) : (
            <p className="portal-state" role="status">
              Das Portal ist noch nicht eingerichtet.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
