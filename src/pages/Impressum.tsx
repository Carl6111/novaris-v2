import "./legal.css";

export default function Impressum() {
  return (
    <section className="legal">
      <div className="wrap legal-inner">
        <h1>Impressum</h1>
        <p className="legal-note">
          Platzhalter — bitte mit den echten Angaben ersetzen. In Deutschland
          nach § 5 DDG (TMG) Pflicht.
        </p>

        <h2>Angaben gemäß § 5 DDG</h2>
        <p>
          <span className="placeholder">[PLATZHALTER: Name / Firma]</span>
          <br />
          <span className="placeholder">[PLATZHALTER: Straße Hausnummer]</span>
          <br />
          <span className="placeholder">[PLATZHALTER: PLZ Ort]</span>
        </p>

        <h2>Kontakt</h2>
        <p>
          Telefon: <span className="placeholder">[PLATZHALTER]</span>
          <br />
          E-Mail: <span className="placeholder">[PLATZHALTER-EMAIL]</span>
        </p>

        <h2>Umsatzsteuer-ID</h2>
        <p>
          <span className="placeholder">[PLATZHALTER: USt-IdNr. oder „Kleinunternehmer nach § 19 UStG"]</span>
        </p>

        <h2>Verantwortlich für den Inhalt</h2>
        <p>
          <span className="placeholder">[PLATZHALTER: Name, Anschrift]</span>
        </p>
      </div>
    </section>
  );
}
