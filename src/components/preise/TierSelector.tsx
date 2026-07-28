import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import MagneticButton from "../ui/MagneticButton";
import { useAuthGate } from "../auth/authGateContext";
import {
  EMPTY_SELECTION,
  PROBLEMS,
  PROBLEMS_BY_ID,
  QUASAR_STEPS,
  encodeSelection,
  lockedAddonsFor,
  type Selection,
  type TierConfig,
} from "../../data/setups";
import "./tier-selector.css";

type Props = { tier: TierConfig };

/**
 * Die Auswahl innerhalb einer Paketkarte.
 *
 * Bewusst mit echten radio-/checkbox-Inputs statt nachgebauten Buttons: damit
 * kommen Pfeiltasten-Navigation, Fokus und die Screenreader-Ansage gratis und
 * korrekt — nachgebaute Varianten scheitern genau daran.
 */
export default function TierSelector({ tier }: Props) {
  const reduced = useReducedMotion();
  const gate = useAuthGate();
  const [sel, setSel] = useState<Selection>(EMPTY_SELECTION);

  // Das Zusammenstellen ist der Kaufmoment — ab hier will Lunakris wissen, mit
  // wem es spricht. Die erste Auswahl oeffnet deshalb das Anmelde-Fenster und
  // wird erst uebernommen, wenn jemand angemeldet ist.
  const REASON = "Stellen Sie Ihr Setup mit einem Konto zusammen.";

  const base = sel.baseId ? PROBLEMS_BY_ID.get(sel.baseId) : undefined;
  const maxAddons = tier.maxAddons ?? 0;
  const addonLimitReached = sel.addonIds.length >= maxAddons;

  const locked = useMemo(
    () => (sel.baseId ? lockedAddonsFor(sel.baseId) : []),
    [sel.baseId],
  );

  // Kernwechsel wirft die Add-ons weg — sie gehörten zum alten Kern.
  const chooseBase = (id: string) => {
    if (!gate.requireAuth(REASON)) return;
    setSel({ baseId: id, addonIds: [] });
  };

  const toggleAddon = (id: string) => {
    if (!gate.requireAuth(REASON)) return;
    setSel((s) => ({
      ...s,
      addonIds: s.addonIds.includes(id)
        ? s.addonIds.filter((a) => a !== id)
        : [...s.addonIds, id],
    }));
  };

  if (tier.mode === "consult") {
    return (
      <div className="tsel">
        <p className="tsel-rule">{tier.rule}</p>
        <ol className="tsel-steps">
          {QUASAR_STEPS.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
        <div className="tsel-foot">
          <p className="tsel-anchor">Statt einer Neueinstellung.</p>
          <MagneticButton to="/kontakt?setup=quasar">
            Gespräch buchen
          </MagneticButton>
        </div>
      </div>
    );
  }

  const fade = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -6 },
      };

  return (
    <div className="tsel">
      <fieldset className="tsel-group">
        <legend className="tsel-legend">
          {tier.rule}
          <span className="tsel-count">genau 1</span>
        </legend>
        <ul className="tsel-list">
          {PROBLEMS.map((p) => (
            <li key={p.id}>
              <label className="tsel-opt">
                <input
                  type="radio"
                  name={`base-${tier.id}`}
                  value={p.id}
                  checked={sel.baseId === p.id}
                  onChange={() => chooseBase(p.id)}
                />
                <span className="tsel-mark tsel-mark--radio" aria-hidden="true" />
                <span className="tsel-text">
                  <span className="tsel-label">{p.label}</span>
                  <span className="tsel-module">{p.module}</span>
                </span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      <AnimatePresence initial={false}>
        {tier.mode === "base-addons" && base && (
          <motion.fieldset
            className="tsel-group"
            key="addons"
            {...fade}
            transition={{ duration: reduced ? 0 : 0.32, ease: [0.16, 1, 0.3, 1] }}
          >
            <legend className="tsel-legend">
              Was dockt daran an?
              <span className="tsel-count">
                {sel.addonIds.length} von {maxAddons}
              </span>
            </legend>

            <ul className="tsel-list">
              {base.addons.map((a) => {
                const checked = sel.addonIds.includes(a.id);
                const blocked = !checked && addonLimitReached;
                return (
                  <li key={a.id}>
                    <label
                      className={`tsel-opt${blocked ? " tsel-opt--blocked" : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={blocked}
                        onChange={() => toggleAddon(a.id)}
                      />
                      <span className="tsel-mark" aria-hidden="true" />
                      <span className="tsel-text">
                        <span className="tsel-label">{a.label}</span>
                        <span className="tsel-module">{a.module}</span>
                      </span>
                    </label>
                  </li>
                );
              })}

              {/* Gesperrt und trotzdem sichtbar: zeigt, dass die Bausteine
                  aufeinander aufbauen statt frei kombinierbar zu sein. */}
              {locked.map(({ addon, requires }) => (
                <li key={addon.id}>
                  <span className="tsel-opt tsel-opt--locked" aria-disabled="true">
                    <span className="tsel-mark tsel-mark--locked" aria-hidden="true">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M7 11 V8 a5 5 0 0 1 10 0 v3" />
                        <rect x="5" y="11" width="14" height="9" rx="2" />
                      </svg>
                    </span>
                    <span className="tsel-text">
                      <span className="tsel-label">{addon.label}</span>
                      <span className="tsel-locked-why">
                        Braucht „{requires}" als Kern
                      </span>
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </motion.fieldset>
        )}
      </AnimatePresence>

      <div className="tsel-foot">
        {sel.baseId && (
          <MagneticButton to={`/kontakt?setup=${encodeSelection(tier.id, sel)}`}>
            Formular abschicken
          </MagneticButton>
        )}
      </div>
    </div>
  );
}
