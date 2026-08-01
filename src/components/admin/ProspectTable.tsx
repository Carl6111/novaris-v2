import {
  STATUS_LABEL,
  budgetStufe,
  waehlnummer,
  type Prospect,
  type Query,
  type SortKey,
} from "../../lib/prospects";

type Props = {
  prospects: Prospect[];
  query: Query;
  onSort: (key: SortKey) => void;
  onOpen: (prospect: Prospect) => void;
  offen: string | null;
};

const SPALTEN: { key: SortKey | null; label: string }[] = [
  { key: "budget_score", label: "Budget" },
  { key: "firma", label: "Firma" },
  { key: "ort", label: "Ort" },
  { key: null, label: "Entscheider" },
  { key: "offene_stellen", label: "Stellen" },
  { key: null, label: "Status" },
];

/**
 * Die Anrufliste. Sortiert nach Budget-Score, weil das die Reihenfolge ist, in
 * der angerufen wird.
 *
 * Am Handy Karten statt Tabelle — gleiche Begruendung wie bei den Anfragen.
 */
export default function ProspectTable({
  prospects,
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
      <table className="adm-table pro-table">
        <caption className="visually-hidden">
          Zielkunden, sortiert nach{" "}
          {SPALTEN.find((s) => s.key === query.sort)?.label ?? "Budget"}
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
          {prospects.map((p) => (
            <tr
              key={p.id}
              className={offen === p.id ? "is-open" : ""}
              onClick={() => onOpen(p)}
            >
              <td>
                <span
                  className={`pro-score pro-score--${budgetStufe(p.budget_score)}`}
                  title={p.budget_begruendung ?? undefined}
                >
                  {p.budget_score}
                </span>
              </td>
              <td>
                {/* Der Knopf traegt die Tastaturbedienung — eine anklickbare
                    Zeile allein ist mit Tab nicht erreichbar. */}
                <button type="button" className="adm-rowbtn">
                  {p.firma}
                </button>
                {p.mitarbeiter && (
                  <span className="pro-sub">{p.mitarbeiter} Mitarbeiter</span>
                )}
              </td>
              <td>{p.ort ?? "—"}</td>
              <td>
                {p.entscheider ? (
                  <>
                    {p.entscheider}
                    {p.entscheider_rolle && (
                      <span className="pro-sub">{p.entscheider_rolle}</span>
                    )}
                  </>
                ) : (
                  <span className="pro-leer">über Zentrale</span>
                )}
              </td>
              <td className="adm-num">
                {p.offene_stellen ? (
                  <span className="pro-stellen">{p.offene_stellen}</span>
                ) : (
                  "—"
                )}
              </td>
              <td>
                <span className={`adm-chip pro-chip--${p.status} is-on`}>
                  {STATUS_LABEL[p.status]}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="adm-cards">
        {prospects.map((p) => {
          const nummer = waehlnummer(p);
          return (
            <li key={p.id}>
              <button
                type="button"
                className={`adm-card${offen === p.id ? " is-open" : ""}`}
                onClick={() => onOpen(p)}
              >
                <span className="adm-card-top">
                  <span className="adm-card-name">{p.firma}</span>
                  <span
                    className={`pro-score pro-score--${budgetStufe(p.budget_score)}`}
                  >
                    {p.budget_score}
                  </span>
                </span>
                <span className="adm-card-firma">
                  {p.entscheider ?? "Ansprechpartner unbekannt"}
                  {p.entscheider_rolle ? ` · ${p.entscheider_rolle}` : ""}
                </span>
                <span className="adm-card-meta">
                  {p.ort && <span>{p.ort}</span>}
                  {p.mitarbeiter && <span>· {p.mitarbeiter} MA</span>}
                  {p.offene_stellen ? <span>· {p.offene_stellen} Stellen</span> : null}
                  {nummer && <span className="adm-num">· {nummer}</span>}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
}
