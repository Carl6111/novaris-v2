import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth, useUser } from "@clerk/react";
import PageHero from "../components/ui/PageHero";
import LeadTable from "../components/admin/LeadTable";
import LeadDetail from "../components/admin/LeadDetail";
import { AUTH_READY } from "../lib/auth";
import {
  EMPTY_QUERY,
  STATUS,
  STATUS_LABEL,
  downloadCsv,
  fetchLeads,
  isDieseWoche,
  patchLead,
  type Lead,
  type Query,
  type SortKey,
  type Status,
} from "../lib/admin";
import "../components/admin/admin.css";

/**
 * Der Posteingang für Anfragen.
 *
 * Die Prüfung hier ist Bequemlichkeit — sie verhindert, dass ein angemeldeter
 * Kunde eine leere Tabelle sieht. Die eigentliche Absicherung sitzt im Server
 * (`api/_lib/auth.ts`), der ohne Admin-Rolle mit 404 antwortet. Wer hier den
 * Zustand im Browser manipuliert, bekommt trotzdem keine Daten.
 */

function AdminInhalt() {
  const { getToken } = useAuth();
  const [query, setQuery] = useState<Query>(EMPTY_QUERY);
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [fehler, setFehler] = useState<string | null>(null);
  const [offen, setOffen] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [suche, setSuche] = useState("");

  // Tippen soll nicht jede Taste zum Server schicken.
  useEffect(() => {
    const id = window.setTimeout(
      () => setQuery((q) => (q.q === suche ? q : { ...q, q: suche })),
      300,
    );
    return () => window.clearTimeout(id);
  }, [suche]);

  const laden = useCallback(async () => {
    setFehler(null);
    try {
      setLeads(await fetchLeads(getToken, query));
    } catch (e) {
      setFehler(e instanceof Error ? e.message : "Unbekannter Fehler");
    }
  }, [getToken, query]);

  useEffect(() => {
    void laden();
  }, [laden]);

  const zahlen = useMemo(() => {
    const l = leads ?? [];
    return {
      neu: l.filter((x) => x.status === "neu").length,
      woche: l.filter((x) => isDieseWoche(x.created_at)).length,
      gesamt: l.length,
    };
  }, [leads]);

  const aktiv = leads?.find((l) => l.id === offen) ?? null;

  const sortieren = (key: SortKey) =>
    setQuery((q) => ({
      ...q,
      sort: key,
      dir: q.sort === key && q.dir === "desc" ? "asc" : "desc",
    }));

  // Optimistisch: der Status springt sofort um. Geht das Speichern schief,
  // wird zurückgedreht und der Fehler steht da — kein stiller Verlust.
  const aendern = async (
    id: string,
    change: { status?: Status; notiz?: string | null },
  ) => {
    const vorher = leads;
    setBusy(true);
    setLeads((ls) =>
      ls ? ls.map((l) => (l.id === id ? { ...l, ...change } : l)) : ls,
    );
    try {
      const neu = await patchLead(getToken, id, change);
      setLeads((ls) => (ls ? ls.map((l) => (l.id === id ? neu : l)) : ls));
      setFehler(null);
    } catch (e) {
      setLeads(vorher);
      setFehler(e instanceof Error ? e.message : "Änderung fehlgeschlagen");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="adm">
      <div className="wrap">
        <div className="adm-zahlen">
          <p>
            <span className="adm-zahl adm-num">{zahlen.neu}</span>
            <span className="adm-zahl-label">unbearbeitet</span>
          </p>
          <p>
            <span className="adm-zahl adm-num">{zahlen.woche}</span>
            <span className="adm-zahl-label">diese Woche</span>
          </p>
          <p>
            <span className="adm-zahl adm-num">{zahlen.gesamt}</span>
            <span className="adm-zahl-label">im Blick</span>
          </p>
        </div>

        <div className="adm-tools">
          <div className="adm-suchfeld">
            <label className="visually-hidden" htmlFor="adm-q">
              Suche in Name, Firma und E-Mail
            </label>
            <input
              id="adm-q"
              type="search"
              placeholder="Name, Firma, E-Mail…"
              value={suche}
              onChange={(e) => setSuche(e.target.value)}
            />
          </div>

          <div className="adm-filter" role="group" aria-label="Nach Status filtern">
            <button
              type="button"
              className={`adm-chip${query.status === "alle" ? " is-on" : ""}`}
              aria-pressed={query.status === "alle"}
              onClick={() => setQuery((q) => ({ ...q, status: "alle" }))}
            >
              Alle
            </button>
            {STATUS.map((s) => (
              <button
                key={s}
                type="button"
                className={`adm-chip adm-chip--${s}${
                  query.status === s ? " is-on" : ""
                }`}
                aria-pressed={query.status === s}
                onClick={() => setQuery((q) => ({ ...q, status: s }))}
              >
                {STATUS_LABEL[s]}
              </button>
            ))}
          </div>

          <div className="adm-rechts">
            <label className="visually-hidden" htmlFor="adm-seit">
              Nur ab diesem Datum
            </label>
            <input
              id="adm-seit"
              type="date"
              className="adm-datum"
              value={query.seit}
              onChange={(e) => setQuery((q) => ({ ...q, seit: e.target.value }))}
            />
            <button
              type="button"
              className="adm-export"
              onClick={() => void downloadCsv(getToken, query)}
            >
              CSV
            </button>
          </div>
        </div>

        {fehler && (
          <p className="adm-fehler" role="alert">
            {fehler}{" "}
            <button type="button" onClick={() => void laden()}>
              Nochmal laden
            </button>
          </p>
        )}

        {leads === null ? (
          <ul className="adm-skelett" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((i) => (
              <li key={i} />
            ))}
          </ul>
        ) : leads.length === 0 ? (
          <div className="adm-leer">
            <h2>Noch nichts hier.</h2>
            <p>
              {query.q || query.status !== "alle" || query.seit
                ? "Zu diesen Filtern gibt es keine Anfrage. Filter zurücksetzen und nochmal schauen."
                : "Sobald jemand das Formular auf der Kontaktseite abschickt, steht die Anfrage hier — mit allem, was er angeklickt hat."}
            </p>
            {(query.q || query.status !== "alle" || query.seit) && (
              <button
                type="button"
                className="adm-export"
                onClick={() => {
                  setSuche("");
                  setQuery(EMPTY_QUERY);
                }}
              >
                Filter zurücksetzen
              </button>
            )}
          </div>
        ) : (
          <div className="adm-split">
            <LeadTable
              leads={leads}
              query={query}
              offen={offen}
              onSort={sortieren}
              onOpen={(l) => setOffen(l.id === offen ? null : l.id)}
            />
            {aktiv && (
              <LeadDetail
                lead={aktiv}
                busy={busy}
                onClose={() => setOffen(null)}
                onChange={(change) => void aendern(aktiv.id, change)}
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default function Admin() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!AUTH_READY) {
    return (
      <p className="adm-state" role="status">
        Die Anmeldung ist noch nicht eingerichtet.
      </p>
    );
  }

  if (!isLoaded) {
    return (
      <p className="adm-state" role="status">
        Einen Moment…
      </p>
    );
  }

  // Nicht angemeldet und kein Admin bekommen dieselbe Antwort. Wer nicht
  // erfährt, dass es hier etwas gibt, sucht auch nicht weiter.
  if (!isSignedIn || user.publicMetadata?.role !== "admin") {
    return (
      <p className="adm-state" role="status">
        Diese Seite gibt es nicht. <Link to="/">Zurück zur Startseite →</Link>
      </p>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="// Intern"
        title={
          <>
            Wer <span className="accent">angeklopft</span> hat.
          </>
        }
        subtitle="Jede Anfrage aus dem Formular, mit allem was angeklickt wurde."
      />
      <AdminInhalt />
    </>
  );
}
