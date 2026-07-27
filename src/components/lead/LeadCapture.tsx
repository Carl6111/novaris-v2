import { useId, useState } from "react";
import { Link } from "react-router-dom";
import { FALLBACK_EMAIL, isEmail, submitLead } from "../../lib/leads";
import "./lead-capture.css";

/**
 * Ein Feld, ein Knopf. Steht an den drei Stellen, an denen jemand warm ist:
 * nach dem Intro-Film, in der Preiskarte mit getroffener Auswahl und auf
 * /login. Der lange Weg (Buchungs-Wizard) bleibt daneben erreichbar — das hier
 * ist die kurze Tür, nicht die einzige.
 */

type Props = {
  /** Landet als eigenes Feld in der Mail: "intro" | "preise" | "login". */
  quelle: string;
  subject: string;
  /** Zusatzangaben, die schon bekannt sind — z. B. die Setup-Auswahl. */
  extraFields?: Record<string, string>;
  title: string;
  cta: string;
  doneText: string;
  variant?: "overlay" | "card" | "page";
};

export default function LeadCapture({
  quelle,
  subject,
  extraFields,
  title,
  cta,
  doneText,
  variant = "page",
}: Props) {
  const inputId = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );

  const valid = isEmail(email);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || status === "sending") return;
    setStatus("sending");
    setStatus(
      (await submitLead({ subject, email, quelle, ...extraFields })) === "ok"
        ? "done"
        : "error",
    );
  };

  if (status === "done") {
    return (
      <p className={`lead lead--${variant} lead--done`} role="status">
        <span className="lead-check" aria-hidden="true">
          ✓
        </span>
        {doneText}
      </p>
    );
  }

  return (
    <form className={`lead lead--${variant}`} onSubmit={onSubmit} noValidate>
      <p className="lead-title">{title}</p>

      <div className="lead-row">
        <label className="lead-label" htmlFor={inputId}>
          E-Mail-Adresse
        </label>
        <input
          id={inputId}
          className="lead-input"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="name@firma.de"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="submit"
          className="lead-send"
          disabled={!valid || status === "sending"}
        >
          {status === "sending" ? "Senden…" : cta}
        </button>
      </div>

      <p className="lead-note">
        Antwort in 24 h. Wir nutzen Ihre Adresse nur dafür —{" "}
        <Link to="/datenschutz">Datenschutz</Link>.
      </p>

      {status === "error" && (
        <p className="lead-error" role="alert">
          Das Formular kam nicht durch. Schreiben Sie uns direkt an{" "}
          <a href={`mailto:${FALLBACK_EMAIL}`}>{FALLBACK_EMAIL}</a>.
        </p>
      )}
    </form>
  );
}
