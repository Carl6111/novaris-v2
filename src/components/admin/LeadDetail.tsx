import { useEffect, useRef, useState } from "react";
import {
  STATUS,
  STATUS_LABEL,
  formatDatum,
  type Lead,
  type Status,
} from "../../lib/admin";

type Props = {
  lead: Lead;
  onClose: () => void;
  onChange: (change: { status?: Status; notiz?: string | null }) => void;
  /** Steht an, solange eine Änderung noch nicht bestätigt ist. */
  busy: boolean;
};

/**
 * Alles, was zu einem Lead gehört, plus die beiden Dinge, die man nachträglich
 * ändern darf: Status und Notiz. Die Antworten des Kunden sind bewusst nicht
 * editierbar — was er gesagt hat, soll stehen bleiben.
 */
export default function LeadDetail({ lead, onClose, onChange, busy }: Props) {
  const [notiz, setNotiz] = useState(lead.notiz ?? "");
  const kopf = useRef<HTMLHeadingElement>(null);

  // Beim Wechsel auf einen anderen Lead: Feld neu füllen und den Blick
  // hierher holen, sonst liest ein Screenreader weiter die Tabelle vor.
  useEffect(() => {
    setNotiz(lead.notiz ?? "");
    kopf.current?.focus();
  }, [lead.id, lead.notiz]);

  const notizGeaendert = notiz !== (lead.notiz ?? "");

  const zeilen: [string, string | null][] = [
    ["Eingegangen", formatDatum(lead.created_at)],
    ["E-Mail", lead.email],
    ["Firma", lead.firma],
    ["Teamgröße", lead.teamgroesse],
    ["Auswahl", lead.setup_text],
    ["Konto", lead.clerk_user_id ? "angemeldet" : "als Gast"],
  ];

  return (
    <aside className="adm-detail" aria-label={`Anfrage von ${lead.name}`}>
      <div className="adm-detail-head">
        <h3 ref={kopf} tabIndex={-1}>
          {lead.name}
        </h3>
        <button type="button" className="adm-close" onClick={onClose}>
          Schließen
        </button>
      </div>

      <dl className="adm-facts">
        {zeilen.map(([label, wert]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{wert ?? "—"}</dd>
          </div>
        ))}
      </dl>

      {lead.thema.length > 0 && (
        <section className="adm-block">
          <h4>Wo Zeit draufgeht</h4>
          <ul className="adm-themen">
            {lead.thema.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </section>
      )}

      {lead.zeitleck && (
        <section className="adm-block">
          <h4>Mit eigenen Worten</h4>
          <p className="adm-quote">{lead.zeitleck}</p>
        </section>
      )}

      <section className="adm-block">
        <h4 id={`status-${lead.id}`}>Status</h4>
        <div
          className="adm-status-set"
          role="radiogroup"
          aria-labelledby={`status-${lead.id}`}
        >
          {STATUS.map((s) => (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={lead.status === s}
              className={`adm-chip adm-chip--${s}${
                lead.status === s ? " is-on" : ""
              }`}
              disabled={busy}
              onClick={() => onChange({ status: s })}
            >
              {STATUS_LABEL[s]}
            </button>
          ))}
        </div>
      </section>

      <section className="adm-block">
        <label className="adm-label" htmlFor={`notiz-${lead.id}`}>
          Notiz
        </label>
        <textarea
          id={`notiz-${lead.id}`}
          className="adm-notiz"
          rows={4}
          value={notiz}
          placeholder="Was besprochen wurde, was als Nächstes ansteht…"
          onChange={(e) => setNotiz(e.target.value)}
        />
        <button
          type="button"
          className="adm-save"
          disabled={!notizGeaendert || busy}
          onClick={() => onChange({ notiz })}
        >
          {busy ? "Speichert…" : "Notiz speichern"}
        </button>
      </section>
    </aside>
  );
}
