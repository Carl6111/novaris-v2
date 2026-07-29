import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import MagneticButton from "../ui/MagneticButton";
import { useAuthGate } from "../auth/authGateContext";
import {
  PROBLEMS,
  PROBLEMS_BY_ID,
  describeSelection,
  isTierId,
} from "../../data/setups";
import { CALENDLY_URL, FALLBACK_EMAIL, isEmail, submitLead } from "../../lib/leads";
import "./booking-wizard.css";

type StepBase = { id: string; title: string; hint?: string };
type ChoiceStep = StepBase & {
  type: "multi" | "single";
  options: string[];
};
type TextStep = StepBase & {
  type: "text";
  placeholder: string;
  input?: "text" | "email";
};
type Step = ChoiceStep | TextStep;

const STEPS: Step[] = [
  {
    id: "topic",
    type: "multi",
    title: "Wo geht bei Ihnen am meisten Zeit drauf?",
    hint: "Mehrfachauswahl möglich.",
    options: [...PROBLEMS.map((p) => p.label), "Etwas anderes"],
  },
  {
    id: "team",
    type: "single",
    title: "Wie groß ist Ihr Team?",
    options: ["1–10", "11–50", "51–100", "100+"],
  },
  {
    id: "leak",
    type: "text",
    title: "Wie sieht das bei Ihnen konkret aus?",
    placeholder: "Ein, zwei Sätze reichen.",
  },
  {
    id: "name",
    type: "text",
    title: "Wie heißen Sie?",
    placeholder: "Vor- und Nachname",
  },
  {
    id: "company",
    type: "text",
    title: "Und Ihre Firma?",
    placeholder: "Firmenname",
  },
  {
    id: "email",
    type: "text",
    title: "Wohin schicken wir den Buchungslink?",
    hint: "Sie bekommen eine E-Mail mit dem Termin-Link.",
    placeholder: "name@firma.de",
    input: "email",
  },
];

type Answers = Record<string, string | string[]>;

/**
 * `?setup=pulsar,calls,calls-crm` — die Auswahl aus der Preise-Seite.
 * Sie befüllt den ersten Schritt vor, damit niemand zweimal dieselbe Frage
 * beantwortet.
 *
 * Zurück kommt beides: der lesbare Satz für Anzeige und Mail, **und** die
 * Struktur. Vorher ging nur der Satz mit — in der Datenbank stand danach
 * „Pulsar: Anrufe · CRM-Anbindung" und nichts, wonach man filtern könnte.
 */
function readSetup(raw: string | null) {
  if (!raw) return null;
  const [tierId, baseId, ...addonIds] = raw.split(",").filter(Boolean);
  if (!isTierId(tierId)) return null;

  const base = baseId ? PROBLEMS_BY_ID.get(baseId) : undefined;
  const gueltigeAddons = base
    ? addonIds.filter((id) => base.addons.some((a) => a.id === id))
    : [];

  return {
    tierId,
    baseId: base ? baseId : null,
    addonIds: gueltigeAddons,
    baseLabel: base?.label ?? null,
    summary: describeSelection(tierId, {
      baseId: base ? baseId : null,
      addonIds: gueltigeAddons,
    }).join(" · "),
  };
}

// Der Wizard sammelt Name, Firma und Zeitleck — dafuer will Lunakris wissen,
// mit wem es spricht. Die erste Antwort oeffnet das Anmelde-Fenster.
const GATE_REASON = "Ihr Gespräch buchen Sie mit einem Konto.";

export default function BookingWizard() {
  const reduced = useReducedMotion();
  const gate = useAuthGate();
  const [searchParams] = useSearchParams();
  const setup = useMemo(
    () => readSetup(searchParams.get("setup")),
    [searchParams],
  );

  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [answers, setAnswers] = useState<Answers>(() => {
    const seeded: Answers = {};
    if (setup?.baseLabel) seeded.topic = [setup.baseLabel];
    return seeded;
  });
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  const current = STEPS[step];
  const total = STEPS.length;

  const go = (next: number) => {
    setDir(next > step ? 1 : -1);
    setStep(Math.max(0, Math.min(total - 1, next)));
  };

  const setAnswer = (id: string, value: string | string[]) =>
    setAnswers((a) => ({ ...a, [id]: value }));

  const toggleMulti = (id: string, opt: string) => {
    if (!gate.requireAuth(GATE_REASON)) return;
    const cur = (answers[id] as string[]) ?? [];
    setAnswer(id, cur.includes(opt) ? cur.filter((o) => o !== opt) : [...cur, opt]);
  };

  const chooseSingle = (id: string, opt: string) => {
    if (!gate.requireAuth(GATE_REASON)) return;
    setAnswer(id, opt);
    window.setTimeout(() => go(step + 1), reduced ? 0 : 260);
  };

  const canAdvance = () => {
    const v = answers[current.id];
    if (current.type === "multi") return Array.isArray(v) && v.length > 0;
    if (current.type === "text") {
      const s = (v as string) ?? "";
      if (current.input === "email") return isEmail(s);
      return s.trim().length > 0;
    }
    return true;
  };

  // Eigener Riegel neben `status`: React fasst Zustandsänderungen zusammen,
  // zwei Enter-Anschläge im selben Tick sähen beide noch "idle". Mit Datenbank
  // wären das zwei Datensätze statt zweier Mails.
  const sending = useRef(false);

  const submit = async () => {
    if (sending.current) return;
    sending.current = true;
    setStatus("sending");
    const result = await submitLead({
      name: String(answers.name ?? ""),
      email: String(answers.email ?? ""),
      firma: String(answers.company ?? ""),
      thema: Array.isArray(answers.topic) ? answers.topic : [],
      teamgroesse: String(answers.team ?? ""),
      zeitleck: String(answers.leak ?? ""),
      tier: setup?.tierId ?? null,
      baseId: setup?.baseId ?? null,
      addonIds: setup?.addonIds ?? [],
      setupText: setup?.summary ?? "",
    });
    sending.current = false;
    setStatus(result === "ok" ? "done" : "error");
    if (result === "error") inputRef.current?.focus();
  };

  const onLast = step === total - 1;

  if (status === "done") {
    return (
      <div className="wizard wizard--done">
        {/* Gezeichnet statt eingeblendet: die Linie laeuft in die Richtung,
            in die man einen Haken selbst zoege. Einmal, 400ms. */}
        <svg className="wizard-check" viewBox="0 0 52 52" aria-hidden="true">
          <circle cx="26" cy="26" r="24" />
          <path d="M15 27 l8 8 l15 -16" />
        </svg>
        <h3>Angekommen.</h3>
        <p>Der Termin-Link liegt gleich in Ihrem Postfach.</p>
        {CALENDLY_URL && (
          <a className="wizard-book" href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
            Direkt Termin wählen →
          </a>
        )}
      </div>
    );
  }

  const variants = reduced
    ? { initial: {}, animate: {}, exit: {} }
    : {
        initial: (d: number) => ({ opacity: 0, x: d * 70, rotate: d * 2 }),
        animate: { opacity: 1, x: 0, rotate: 0 },
        exit: (d: number) => ({ opacity: 0, x: d * -90, rotate: d * -3 }),
      };

  return (
    <div className="wizard">
      {setup && (
        <p className="wizard-setup">
          <span className="wizard-setup-label">Aus Ihrer Auswahl</span>
          {setup.summary}
        </p>
      )}

      <div className="wizard-progress" aria-hidden="true">
        {STEPS.map((s, i) => (
          <span key={s.id} className={i <= step ? "is-on" : ""} />
        ))}
      </div>

      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={current.id}
          className="wizard-card"
          custom={dir}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="wizard-count">
            {String(step + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <h3 className="wizard-q">{current.title}</h3>
          {current.hint && <p className="wizard-hint">{current.hint}</p>}

          {current.type === "text" ? (
            <input
              ref={inputRef}
              className="wizard-input"
              type={current.input === "email" ? "email" : "text"}
              autoComplete={
                current.input === "email"
                  ? "email"
                  : current.id === "name"
                    ? "name"
                    : current.id === "company"
                      ? "organization"
                      : "off"
              }
              placeholder={current.placeholder}
              value={(answers[current.id] as string) ?? ""}
              onChange={(e) => {
                // Beim ersten Tastendruck geht das Fenster auf; getippt wird
                // erst uebernommen, wenn jemand angemeldet ist.
                if (!gate.requireAuth(GATE_REASON)) return;
                setAnswer(current.id, e.target.value);
              }}
              onKeyDown={(e) => {
                // `status` muss hier mit rein: sonst schickt jeder weitere
                // Enter-Anschlag waehrend des Sendens noch einen Datensatz.
                if (e.key !== "Enter" || !canAdvance() || status === "sending") {
                  return;
                }
                if (onLast) void submit();
                else go(step + 1);
              }}
              autoFocus
            />
          ) : (
            <div className="wizard-options">
              {current.options.map((opt) => {
                const sel =
                  current.type === "multi"
                    ? ((answers[current.id] as string[]) ?? []).includes(opt)
                    : answers[current.id] === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    className={`wizard-opt ${sel ? "is-sel" : ""}`}
                    onClick={() =>
                      current.type === "multi"
                        ? toggleMulti(current.id, opt)
                        : chooseSingle(current.id, opt)
                    }
                  >
                    <span className="wizard-opt-box" aria-hidden="true">
                      {sel ? "✓" : ""}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
          )}

          <div className="wizard-nav">
            {step > 0 && (
              <button type="button" className="wizard-back" onClick={() => go(step - 1)}>
                ← Zurück
              </button>
            )}
            {(current.type !== "single" || onLast) && (
              <MagneticButton
                type="button"
                // `is-disabled` deckte vorher nur !canAdvance() ab — der Knopf
                // sah waehrend des Sendens aktiv aus, war es aber nicht.
                className={`wizard-next ${
                  !canAdvance() || status === "sending" ? "is-disabled" : ""
                }`}
                disabled={!canAdvance() || status === "sending"}
                aria-busy={status === "sending"}
                onClick={() => {
                  if (onLast) void submit();
                  else go(step + 1);
                }}
              >
                {status === "sending" && (
                  <span className="wizard-spinner" aria-hidden="true" />
                )}
                {onLast ? (status === "sending" ? "Senden…" : "Absenden") : "Weiter"}
              </MagneticButton>
            )}
          </div>

          {status === "error" && (
            <div className="wizard-error" role="alert">
              <p>
                Das Formular kam nicht durch. Ihre Angaben stehen noch oben, sie
                gehen nicht verloren.
              </p>
              <div className="wizard-error-actions">
                <button
                  type="button"
                  className="wizard-retry"
                  onClick={() => void submit()}
                >
                  Nochmal senden
                </button>
                <a href={`mailto:${FALLBACK_EMAIL}`}>
                  Oder direkt an {FALLBACK_EMAIL}
                </a>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
