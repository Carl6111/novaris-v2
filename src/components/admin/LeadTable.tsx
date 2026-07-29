import {
  STATUS_LABEL,
  formatDatum,
  type Lead,
  type Query,
  type SortKey,
} from "../../lib/admin";

type Props = {
  leads: Lead[];
  query: Query;
  onSort: (key: SortKey) => void;
  onOpen: (lead: Lead) => void;
  offen: string | null;
};

const SPALTEN: { key: SortKey | null; label: string }[] = [
  { key: "created_at", label: "Datum" },
  { key: "name", label: "Name" },
  { key: "firma", label: "Firma" },
  { key: "teamgroesse", label: "Team" },
  { key: null, label: "Thema" },
  { key: "status", label: "Status" },
];

/**
 * Die Liste. Am Handy Karten statt Tabelle — waagerechtes Scrollen ist keine
 * Lösung, und sechs Spalten passen auf 390px nicht nebeneinander.
 *
 * Sortiert wird nicht hier, sondern in der Datenbank: `onSort` schreibt nur
 * die Anfrage um. Bei zwanzig Leads ist das egal, bei zweitausend nicht.
 */
export default function LeadTable({
  leads,
  query,
  onSort,
  onOpen,
  offen,
}: Props) {
  const sortState = (key: SortKey | null) => {
    if (key === null || query.sort !== key) return "none" as const;
    return query.dir === "asc" ? ("ascending" as const) : ("descending" as const);
  };

  return (
    <>
      <table className="adm-table">
        <caption className="visually-hidden">
          Anfragen, sortiert nach {SPALTEN.find((s) => s.key === query.sort)?.label}
        </caption>
        <thead>
          <tr>
            {SPALTEN.map((s) => (
              <th key={s.label} scope="col" aria-sort={sortState(s.key)}>
                {s.key ? (
                  <button type="button" onClick={() => onSort(s.key!)}>
                    {s.label}
                    <span className="adm-sort" aria-hidden="true">
                      {query.sort === s.key ? (query.dir === "asc" ? "↑" : "↓") : "↕"}
                    </span>
                  </button>
                ) : (
                  s.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {leads.map((l) => (
            <tr
              key={l.id}
              className={offen === l.id ? "is-open" : ""}
              onClick={() => onOpen(l)}
            >
              <td className="adm-num">{formatDatum(l.created_at)}</td>
              <td>
                {/* Der Knopf traegt die Tastaturbedienung — eine anklickbare
                    Zeile allein ist mit Tab nicht erreichbar. */}
                <button type="button" className="adm-rowbtn">
                  {l.name}
                </button>
              </td>
              <td>{l.firma ?? "—"}</td>
              <td className="adm-num">{l.teamgroesse ?? "—"}</td>
              <td className="adm-thema">{l.thema.join(", ") || "—"}</td>
              <td>
                <span className={`adm-chip adm-chip--${l.status} is-on`}>
                  {STATUS_LABEL[l.status]}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="adm-cards">
        {leads.map((l) => (
          <li key={l.id}>
            <button
              type="button"
              className={`adm-card${offen === l.id ? " is-open" : ""}`}
              onClick={() => onOpen(l)}
            >
              <span className="adm-card-top">
                <span className="adm-card-name">{l.name}</span>
                <span className={`adm-chip adm-chip--${l.status} is-on`}>
                  {STATUS_LABEL[l.status]}
                </span>
              </span>
              <span className="adm-card-firma">{l.firma ?? "Ohne Firma"}</span>
              <span className="adm-card-meta">
                <span className="adm-num">{formatDatum(l.created_at)}</span>
                {l.teamgroesse && <span>· {l.teamgroesse}</span>}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
