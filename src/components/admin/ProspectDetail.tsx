import { useEffect, useRef, useState } from "react";
import {
  STATUS,
  STATUS_LABEL,
  budgetStufe,
  formatDatum,
  sichereUrl,
  waehlnummer,
  type Prospect,
  type Status,
} from "../../lib/prospects";

type Props = {
  prospect: Prospect;
  onClose: () => void;
  onChange: (change: { status?: Status; notiz?: string | null }) => void;
  /** Steht an, solange eine Änderung noch nicht bestätigt ist. */
  busy: boolean;
};

/**
 * Die Gesprächsvorbereitung für einen Anruf.
 *
 * Oben steht, was man zum Wählen braucht. Darunter die Begründung des
 * Budget-Scores — sie nennt die Fakten, auf denen er beruht, und liefert damit
 * gleich den Aufhänger fürs Gespräch: "Sie suchen gerade fünf Leute…".
 *
 * Die recherchierten Felder sind nicht editierbar. Sie stehen für das, was zu
 * einem Zeitpunkt öffentlich auffindbar war — wer sie überschreiben kann,
 * verliert den Beleg, der sie brauchbar macht.
 */
export default function ProspectDetail({
  prospect,
  onClose,
  onChange,
  busy,
}: Props) {
  const [notiz, setNotiz] = useState(prospect.notiz ?? "");
  const kopf = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    setNotiz(prospect.notiz ?? "");
    kopf.current?.focus();
  }, [prospect.id, prospect.notiz]);

  const notizGeaendert = notiz !== (prospect.notiz ?? "");
  const nummer = waehlnummer(prospect);
  const gruende = prospect.budget_begruendung?.split(" | ").filter(Boolean) ?? [];

  const stamm: [string, string | null][] = [
    ["Adresse", [prospect.strasse, [prospect.plz, prospect.ort].filter(Boolean).join(" ")].filter(Boolean).join(", ") || null],
    ["Rechtsform", prospect.rechtsform],
    ["Handelsregister", prospect.hrb],
    ["Mitarbeiter", prospect.mitarbeiter],
    ["LinkedIn-Mitglieder", prospect.linkedin_mitglieder?.toString() ?? null],
    ["Branche", prospect.branche],
    ["Segment", prospect.segment],
    ["Erhoben am", formatDatum(prospect.erhoben_am)],
    ["Quellen", prospect.quellen],
  ];

  return (
    <aside className="adm-detail" aria-label={`Zielkunde ${prospect.firma}`}>
      <div className="adm-detail-head">
        <h3 ref={kopf} tabIndex={-1}>
          {prospect.firma}
        </h3>
        <button type="button" className="adm-close" onClick={onClose}>
          Schließen
        </button>
      </div>

      <div className="pro-anruf">
        <p className="pro-anruf-label">
          {prospect.entscheider_telefon ? "Durchwahl" : "Zentrale"}
        </p>
        {nummer ? (
          <a className="pro-nummer" href={`tel:${prospect.telefon_e164 ?? nummer}`}>
            {nummer}
          </a>
        ) : (
          <p className="pro-leer">Keine Nummer gefunden</p>
        )}
        {prospect.entscheider && (
          <p className="pro-anruf-person">
            Verlangen nach: <strong>{prospect.entscheider}</strong>
            {prospect.entscheider_rolle && ` (${prospect.entscheider_rolle})`}
            {prospect.entscheider_quelle && (
              <span className="pro-sub">Quelle: {prospect.entscheider_quelle}</span>
            )}
          </p>
        )}
      </div>

      <section className="adm-block">
        <h4>
          Budget-Score
          <span
            className={`pro-score pro-score--${budgetStufe(prospect.budget_score)}`}
          >
            {prospect.budget_score}
          </span>
        </h4>
        {gruende.length > 0 ? (
          <ul className="pro-gruende">
            {gruende.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        ) : (
          <p className="pro-leer">Keine Begründung hinterlegt.</p>
        )}
      </section>

      <dl className="adm-facts">
        {stamm.map(([label, wert]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{wert ?? "—"}</dd>
          </div>
        ))}
      </dl>

      <section className="adm-block">
        <h4>Links</h4>
        <ul className="pro-links">
          {sichereUrl(prospect.website) && (
            <li>
              <a
                href={sichereUrl(prospect.website)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Website
              </a>
            </li>
          )}
          {sichereUrl(prospect.karriereseite) && (
            <li>
              <a
                href={sichereUrl(prospect.karriereseite)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Karriereseite
                {prospect.offene_stellen ? ` (${prospect.offene_stellen})` : ""}
              </a>
            </li>
          )}
          {sichereUrl(prospect.linkedin) && (
            <li>
              <a
                href={sichereUrl(prospect.linkedin)}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </li>
          )}
          {sichereUrl(prospect.maps_url) && (
            <li>
              <a
                href={sichereUrl(prospect.maps_url)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Maps
              </a>
            </li>
          )}
          {prospect.email && (
            <li>
              <a href={`mailto:${prospect.email}`}>{prospect.email}</a>
            </li>
          )}
        </ul>
      </section>

      <section className="adm-block">
        <h4>Status</h4>
        <div className="adm-status-set" role="group" aria-label="Status setzen">
          {STATUS.map((s) => (
            <button
              key={s}
              type="button"
              disabled={busy}
              className={`adm-chip pro-chip--${s}${
                prospect.status === s ? " is-on" : ""
              }`}
              aria-pressed={prospect.status === s}
              onClick={() => onChange({ status: s })}
            >
              {STATUS_LABEL[s]}
            </button>
          ))}
        </div>
      </section>

      <section className="adm-block">
        <h4>
          <label htmlFor="pro-notiz">Notiz</label>
        </h4>
        <textarea
          id="pro-notiz"
          className="adm-notiz"
          rows={4}
          value={notiz}
          placeholder="Was im Gespräch herauskam…"
          onChange={(e) => setNotiz(e.target.value)}
        />
        <button
          type="button"
          className="adm-save"
          disabled={busy || !notizGeaendert}
          onClick={() => onChange({ notiz })}
        >
          {notizGeaendert ? "Notiz speichern" : "Gespeichert"}
        </button>
      </section>
    </aside>
  );
}
