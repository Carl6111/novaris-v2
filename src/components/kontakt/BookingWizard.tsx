import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import MagneticButton from "../ui/MagneticButton";
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
    title: "Worum geht's?",
    hint: "Mehrfachauswahl möglich.",
    options: [
      "Anfragen automatisieren",
      "Angebote & Docs",
      "Rechnungen",
      "Lead-Pipeline",
      "Ganze Plattform",
      "Anderes",
    ],
  },
  {
    id: "team",
    type: "single",
    title: "Wie groß ist euer Team?",
    options: ["1–10", "11–50", "51–100", "100+"],
  },
  {
    id: "leak",
    type: "text",
    title: "Wo geht am meisten Zeit verloren?",
    placeholder: "Ein, zwei Sätze reichen.",
  },
  {
    id: "name",
    type: "text",
    title: "Wie heißt du?",
    placeholder: "Vor- und Nachname",
  },
  {
    id: "company",
    type: "text",
    title: "Und deine Firma?",
    placeholder: "Firmenname",
  },
  {
    id: "email",
    type: "text",
    title: "Wohin schicken wir den Buchungslink?",
    hint: "Du bekommst direkt eine E-Mail mit dem Termin-Link.",
    placeholder: "name@firma.de",
    input: "email",
  },
];

const WEB3_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;
const CALENDLY_URL = import.meta.env.VITE_CALENDLY_URL as string | undefined;
const FALLBACK_EMAIL = "[PLATZHALTER-EMAIL]";

type Answers = Record<string, string | string[]>;

export default function BookingWizard() {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [answers, setAnswers] = useState<Answers>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  const current = STEPS[step];
  const total = STEPS.length;

  const go = (next: number) => {
    setDir(next > step ? 1 : -1);
    setStep(Math.max(0, Math.min(total - 1, next)));
  };

  const setAnswer = (id: string, value: string | string[]) =>
    setAnswers((a) => ({ ...a, [id]: value }));

  const toggleMulti = (id: string, opt: string) => {
    const cur = (answers[id] as string[]) ?? [];
    setAnswer(id, cur.includes(opt) ? cur.filter((o) => o !== opt) : [...cur, opt]);
  };

  const chooseSingle = (id: string, opt: string) => {
    setAnswer(id, opt);
    window.setTimeout(() => go(step + 1), reduced ? 0 : 260);
  };

  const canAdvance = () => {
    const v = answers[current.id];
    if (current.type === "multi") return Array.isArray(v) && v.length > 0;
    if (current.type === "text") {
      const s = (v as string) ?? "";
      if (current.input === "email") return /.+@.+\..+/.test(s);
      return s.trim().length > 0;
    }
    return true;
  };

  const submit = async () => {
    setStatus("sending");
    const payload = {
      access_key: WEB3_KEY ?? "",
      subject: `Neue Buchungsanfrage — ${answers.name || "—"}`,
      from_name: "Novaris Website",
      name: answers.name || "",
      email: answers.email || "",
      firma: answers.company || "",
      thema: Array.isArray(answers.topic) ? answers.topic.join(", ") : "",
      teamgroesse: answers.team || "",
      zeitleck: answers.leak || "",
    };

    if (!WEB3_KEY) {
      // no service configured yet — still show success, book via link/mail
      setStatus("done");
      return;
    }
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  };

  const onLast = step === total - 1;

  if (status === "done") {
    return (
      <div className="wizard wizard--done">
        <div className="wizard-check" aria-hidden="true">✓</div>
        <h3>Fast geschafft.</h3>
        <p>
          {WEB3_KEY
            ? "Check deine Mails — dein persönlicher Buchungslink ist unterwegs."
            : "Danke! Wir melden uns mit einem Terminvorschlag."}
        </p>
        {CALENDLY_URL && (
          <a className="wizard-book" href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
            Direkt Termin wählen →
          </a>
        )}
        {!WEB3_KEY && !CALENDLY_URL && (
          <a className="wizard-book" href={`mailto:${FALLBACK_EMAIL}`}>
            Schreib uns direkt →
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
              className="wizard-input"
              type={current.input === "email" ? "email" : "text"}
              placeholder={current.placeholder}
              value={(answers[current.id] as string) ?? ""}
              onChange={(e) => setAnswer(current.id, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && canAdvance()) {
                  onLast ? submit() : go(step + 1);
                }
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
                className={`wizard-next ${!canAdvance() ? "is-disabled" : ""}`}
                disabled={!canAdvance() || status === "sending"}
                onClick={() => (onLast ? submit() : go(step + 1))}
              >
                {onLast ? (status === "sending" ? "Senden…" : "Absenden") : "Weiter"}
              </MagneticButton>
            )}
          </div>

          {status === "error" && (
            <p className="wizard-error">
              Da lief was schief. Schreib uns direkt:{" "}
              <a href={`mailto:${FALLBACK_EMAIL}`}>{FALLBACK_EMAIL}</a>
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
