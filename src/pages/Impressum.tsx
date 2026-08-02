import { BUSINESS } from "../lib/business";
import "./legal.css";

export default function Impressum() {
  return (
    <section className="legal">
      <div className="wrap legal-inner">
        <h1>Impressum</h1>

        <h2>Angaben gemäß § 5 DDG</h2>
        <p>
          {BUSINESS.inhaber}
          <br />
          {BUSINESS.strasse}
          <br />
          {BUSINESS.plz} {BUSINESS.ort}
        </p>

        <h2>Kontakt</h2>
        <p>
          Telefon: <a href={`tel:${BUSINESS.telefon}`}>{BUSINESS.telefon}</a>
          <br />
          E-Mail: <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>
        </p>

        {/* § 5 DDG verlangt die USt-IdNr. nur, sofern vorhanden. Ein Abschnitt
            mit "liegt noch nicht vor" wäre keine Pflichtangabe, sondern nur
            eine Auskunft, die niemand braucht. */}
        {BUSINESS.ustId ? (
          <>
            <h2>Umsatzsteuer-ID</h2>
            <p>{BUSINESS.ustId}</p>
          </>
        ) : null}

        <h2>Verantwortlich für den Inhalt</h2>
        <p>
          {BUSINESS.inhaber}
          <br />
          {BUSINESS.strasse}
          <br />
          {BUSINESS.plz} {BUSINESS.ort}
        </p>
      </div>
    </section>
  );
}
