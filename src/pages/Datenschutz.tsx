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
          mitteilen. Das passiert an vier Stellen:
        </p>
        <ul>
          <li>
            Buchungsformular auf <em>/kontakt</em> — Name, Firma, E-Mail und Ihre
            Angaben zum Anliegen
          </li>
          <li>
            Kurzformular am Ende des Demo-Films auf der Startseite — nur E-Mail
          </li>
          <li>
            Kurzformular auf <em>/preise</em>, sobald Sie eine Auswahl getroffen
            haben — E-Mail und die von Ihnen gewählte Zusammenstellung
          </li>
          <li>
            Zugangsanfrage auf <em>/login</em> — nur E-Mail
          </li>
        </ul>
        <p>
          Die Verarbeitung erfolgt zur Bearbeitung Ihrer Anfrage auf Grundlage von
          Art. 6 Abs. 1 lit. b DSGVO.
        </p>

        <h2>3. Formular &amp; Terminbuchung</h2>
        <p>
          Alle vier Formulare werden über
          <span className="placeholder"> [PLATZHALTER: Dienst, z. B. Web3Forms] </span>
          verarbeitet und per E-Mail an uns übermittelt. Für die Terminvereinbarung
          nutzen wir
          <span className="placeholder"> [PLATZHALTER: z. B. Calendly] </span>.
          Details siehe deren Datenschutzhinweise.
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
