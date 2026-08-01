import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth, useUser } from "@clerk/react";
import PageHero from "../components/ui/PageHero";
import AdminNav from "../components/admin/AdminNav";
import ProspectTable from "../components/admin/ProspectTable";
import ProspectDetail from "../components/admin/ProspectDetail";
import { AUTH_READY } from "../lib/auth";
import {
  BUDGET_BELEGT,
  EMPTY_QUERY,
  STATUS,
  STATUS_LABEL,
  fetchProspects,
  importProspects,
  patchProspect,
  type ImportErgebnis,
  type Prospect,
  type Query,
  type SortKey,
  type Status,
} from "../lib/prospects";
import "../components/admin/admin.css";
import "../components/admin/prospects.css";

/**
 * Die Anrufliste — wen wir uns ausgesucht haben.
 *
 * Gegenstück zu `/admin`: dort steht, wer sich gemeldet hat. Die Absicherung ist
 * dieselbe. Die Prüfung hier verhindert nur, dass jemand eine leere Tabelle
 * sieht; wer den Zustand im Browser manipuliert, bekommt vom Server trotzdem
 * keine Daten.
 */

const SCHWELLEN = [
  { wert: 0, label: "Alle" },
  { wert: BUDGET_BELEGT, label: "Budget belegt" },
  { wert: 70, label: "Stark" },
];

function ProspectsInhalt() {
  const { getToken } = useAuth();
  const [query, setQuery] = useState<Query>(EMPTY_QUERY);
  const [prospects, setProspects] = useState<Prospect[] | null>(null);
  const [fehler, setFehler] = useState<string | null>(null);
  const [offen, setOffen] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [suche, setSuche] = useState("");
  const [importInfo, setImportInfo] = useState<ImportErgebnis | null>(null);
  const dateiFeld = useRef<HTMLInputElement>(null);

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
      setProspects(await fetchProspects(getToken, query));
    } catch (e) {
      setFehler(e instanceof Error ? e.message : "Unbekannter Fehler");
    }
  }, [getToken, query]);

  useEffect(() => {
    void laden();
  }, [laden]);

  const zahlen = useMemo(() => {
    const p = prospects ?? [];
    return {
      offen: p.filter((x) => x.status === "offen").length,
      stellen: p.filter((x) => (x.offene_stellen ?? 0) > 0).length,
      gesamt: p.length,
    };
  }, [prospects]);

  const segmente = useMemo(() => {
    const set = new Set<string>();
    for (const p of prospects ?? []) if (p.segment) set.add(p.segment);
    return [...set].sort();
  }, [prospects]);

  const aktiv = prospects?.find((p) => p.id === offen) ?? null;

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
    const vorher = prospects;
    setBusy(true);
    setProspects((ps) =>
      ps ? ps.map((p) => (p.id === id ? { ...p, ...change } : p)) : ps,
    );
    try {
      const neu = await patchProspect(getToken, id, change);
      setProspects((ps) => (ps ? ps.map((p) => (p.id === id ? neu : p)) : ps));
      setFehler(null);
    } catch (e) {
      setProspects(vorher);
      setFehler(e instanceof Error ? e.message : "Änderung fehlgeschlagen");
    } finally {
      setBusy(false);
    }
  };

  const hochladen = async (datei: File) => {
    setBusy(true);
    setFehler(null);
    setImportInfo(null);
    try {
      const ergebnis = await importProspects(getToken, datei, query.minBudget);
      setImportInfo(ergebnis);
      await laden();
    } catch (e) {
      setFehler(e instanceof Error ? e.message : "Import fehlgeschlagen");
    } finally {
      setBusy(false);
      if (dateiFeld.current) dateiFeld.current.value = "";
    }
  };

  return (
    <section className="adm">
      <div className="wrap">
        <AdminNav />

        <div className="adm-zahlen">
          <p>
            <span className="adm-zahl adm-num">{zahlen.offen}</span>
            <span className="adm-zahl-label">noch nicht angerufen</span>
          </p>
          <p>
            <span className="adm-zahl adm-num">{zahlen.stellen}</span>
            <span className="adm-zahl-label">stellen gerade ein</span>
          </p>
          <p>
            <span className="adm-zahl adm-num">{zahlen.gesamt}</span>
            <span className="adm-zahl-label">in der Liste</span>
          </p>
        </div>

        <div className="adm-tools">
          <div className="adm-suchfeld">
            <label className="visually-hidden" htmlFor="pro-q">
              Suche in Firma, Ort und Entscheider
            </label>
            <input
              id="pro-q"
              type="search"
              placeholder="Firma, Ort, Entscheider…"
              value={suche}
              onChange={(e) => setSuche(e.target.value)}
            />
          </div>

          <div className="adm-filter" role="group" aria-label="Nach Budget filtern">
            {SCHWELLEN.map((s) => (
              <button
                key={s.wert}
                type="button"
                className={`adm-chip${query.minBudget === s.wert ? " is-on" : ""}`}
                aria-pressed={query.minBudget === s.wert}
                onClick={() => setQuery((q) => ({ ...q, minBudget: s.wert }))}
              >
                {s.label}
              </button>
            ))}
            <button
              type="button"
              className={`adm-chip${query.nurStellen ? " is-on" : ""}`}
              aria-pressed={query.nurStellen}
              onClick={() => setQuery((q) => ({ ...q, nurStellen: !q.nurStellen }))}
            >
              Stellt ein
            </button>
          </div>

          <div className="adm-rechts">
            {segmente.length > 1 && (
              <>
                <label className="visually-hidden" htmlFor="pro-segment">
                  Segment
                </label>
                <select
                  id="pro-segment"
                  className="adm-datum"
                  value={query.segment}
                  onChange={(e) =>
                    setQuery((q) => ({ ...q, segment: e.target.value }))
                  }
                >
                  <option value="">Alle Segmente</option>
                  {segmente.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </>
            )}
            <input
              ref={dateiFeld}
              id="pro-datei"
              type="file"
              accept="application/json,.json"
              className="visually-hidden"
              onChange={(e) => {
                const datei = e.target.files?.[0];
                if (datei) void hochladen(datei);
              }}
            />
            <label className="adm-export pro-upload" htmlFor="pro-datei">
              LeadScout-JSON
            </label>
          </div>
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
              className={`adm-chip pro-chip--${s}${
                query.status === s ? " is-on" : ""
              }`}
              aria-pressed={query.status === s}
              onClick={() => setQuery((q) => ({ ...q, status: s }))}
            >
              {STATUS_LABEL[s]}
            </button>
          ))}
        </div>

        {importInfo && (
          <p className="pro-import" role="status">
            <strong>{importInfo.importiert}</strong> übernommen
            {importInfo.zu_schwach > 0 && (
              <>
                {" · "}
                {importInfo.zu_schwach} unter Budget-Score {importInfo.schwelle}{" "}
                aussortiert
              </>
            )}
            {importInfo.verworfen > 0 && <> · {importInfo.verworfen} unbrauchbar</>}
            <button type="button" onClick={() => setImportInfo(null)}>
              ok
            </button>
          </p>
        )}

        {fehler && (
          <p className="adm-fehler" role="alert">
            {fehler}{" "}
            <button type="button" onClick={() => void laden()}>
              Nochmal laden
            </button>
          </p>
        )}

        {prospects === null ? (
          <ul className="adm-skelett" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((i) => (
              <li key={i} />
            ))}
          </ul>
        ) : prospects.length === 0 ? (
          <div className="adm-leer">
            <h2>Noch keine Zielkunden.</h2>
            <p>
              {query.q || query.status !== "alle" || query.nurStellen
                ? "Zu diesen Filtern gibt es keinen Treffer. Filter lockern und nochmal schauen."
                : "Lade die .json aus einem LeadScout-Lauf hoch — sie liegt in leadscout/leads/. Alles unter dem gewählten Budget-Score bleibt draußen."}
            </p>
          </div>
        ) : (
          <div className="adm-split">
            <ProspectTable
              prospects={prospects}
              query={query}
              offen={offen}
              onSort={sortieren}
              onOpen={(p) => setOffen(p.id === offen ? null : p.id)}
            />
            {aktiv && (
              <ProspectDetail
                prospect={aktiv}
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

export default function Prospects() {
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

  // Nicht angemeldet und kein Admin bekommen dieselbe Antwort.
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
            Wen wir <span className="accent">anrufen</span>.
          </>
        }
        subtitle="Recherchierte Zielkunden, sortiert nach belegtem Budget."
      />
      <ProspectsInhalt />
    </>
  );
}
