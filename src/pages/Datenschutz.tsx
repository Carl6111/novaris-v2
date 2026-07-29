import "./legal.css";

export default function Datenschutz() {
  return (
    <section className="legal">
      <div className="wrap legal-inner">
        <h1>Datenschutzerklärung</h1>
        <p className="legal-note">
          Platzhalter-Gerüst — vor Live-Gang durch eine geprüfte, vollständige
          DSGVO-Datenschutzerklärung ersetzen (z. B. per Generator + anwaltlicher
          Prüfung).
        </p>

        <h2>1. Verantwortlicher</h2>
        <p>
          <span className="placeholder">[PLATZHALTER: Name / Firma, Anschrift, E-Mail]</span>
        </p>

        <h2>2. Erhebung und Verarbeitung von Daten</h2>
        <p>
          Diese Website erhebt personenbezogene Daten nur, wenn Sie sie uns aktiv
          mitteilen. Das passiert an zwei Stellen:
        </p>
        <ul>
          <li>
            <strong>Buchungsformular auf <em>/kontakt</em></strong> — Name, Firma,
            E-Mail, Teamgröße, Ihre Angaben zum Anliegen sowie die auf{" "}
            <em>/preise</em> getroffene Auswahl, falls Sie von dort kommen
          </li>
          <li>
            <strong>Anmeldung und Registrierung</strong> — Vor- und Nachname sowie
            E-Mail-Adresse. Melden Sie sich mit Google an, übermittelt Google
            zusätzlich Ihr Profilbild und Ihre bestätigte Adresse.
          </li>
        </ul>
        <p>
          Die Verarbeitung erfolgt zur Bearbeitung Ihrer Anfrage auf Grundlage von
          Art. 6 Abs. 1 lit. b DSGVO.
        </p>

        <h2>3. Speicherung, Formular &amp; Terminbuchung</h2>
        <p>
          Die Angaben aus dem Buchungsformular werden <strong>gespeichert</strong>,
          nicht nur per E-Mail weitergeleitet. Sie liegen in einer Datenbank bei
          Supabase (Rechenzentrum Frankfurt am Main, Region EU) und sind
          ausschließlich für uns zugänglich. Wir bewahren sie so lange auf, wie
          das Anliegen bearbeitet wird, und löschen sie danach spätestens nach{" "}
          <span className="placeholder">[PLATZHALTER: Frist, z. B. 24 Monate]</span>.
        </p>
        <p>
          Zusätzlich benachrichtigt uns
          <span className="placeholder"> [PLATZHALTER: Dienst, z. B. Web3Forms] </span>
          per E-Mail über neue Anfragen. Die Anmeldung läuft über
          <span className="placeholder"> [PLATZHALTER: Clerk Inc.] </span>, für die
          Terminvereinbarung nutzen wir
          <span className="placeholder"> [PLATZHALTER: z. B. Calendly] </span>.
          Details siehe deren Datenschutzhinweise.
        </p>
        <p>
          Sie können jederzeit Auskunft über die zu Ihnen gespeicherten Daten
          verlangen und ihre Löschung fordern. Eine formlose Nachricht an die oben
          genannte Adresse genügt.
        </p>

        <h2>4. Hosting</h2>
        <p>
          Gehostet bei <span className="placeholder">[PLATZHALTER: Vercel Inc.]</span>.
          Beim Aufruf werden technisch notwendige Server-Logs verarbeitet.
        </p>

        <h2>5. Ihre Rechte</h2>
        <ul>
          <li>Auskunft, Berichtigung, Löschung, Einschränkung</li>
          <li>Datenübertragbarkeit und Widerspruch</li>
          <li>Beschwerde bei einer Aufsichtsbehörde</li>
        </ul>
      </div>
    </section>
  );
}
