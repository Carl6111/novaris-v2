import { useState } from "react";
import Reveal from "../ui/Reveal";
import MagneticButton from "../ui/MagneticButton";
import "./save-calculator.css";

// grobe, ehrliche Schätzung: ein Teil der Admin-Zeit lässt sich automatisieren
const AUTOMATABLE_SHARE = 0.4;

export default function SaveCalculator() {
  const [team, setTeam] = useState(8);
  const [hours, setHours] = useState(6);
  const [rate, setRate] = useState(45);

  const savedHours = Math.round(team * hours * AUTOMATABLE_SHARE * 4.33);
  const savedEuro = Math.round(savedHours * rate);

  return (
    <section className="calc">
      <div className="wrap">
        <Reveal>
          <div className="section-head">
            <p className="eyebrow">// Zeitspar-Rechner</p>
            <h2>
              Was holt ihr <span className="accent">im Monat zurück?</span>
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="calc-card starlit-card">
            <div className="calc-inputs">
              <Slider
                label="Teamgröße"
                value={team}
                min={1}
                max={100}
                step={1}
                suffix=" Personen"
                onChange={setTeam}
              />
              <Slider
                label="Admin-Stunden pro Person / Woche"
                value={hours}
                min={1}
                max={30}
                step={1}
                suffix=" Std."
                onChange={setHours}
              />
              <Slider
                label="Interner Stundensatz"
                value={rate}
                min={20}
                max={150}
                step={5}
                suffix=" €"
                onChange={setRate}
              />
            </div>

            <div className="calc-result">
              <p className="calc-result-label">Geschätzt zurückgeholt / Monat</p>
              <p className="calc-hours">
                {savedHours.toLocaleString("de-DE")}
                <span> Std.</span>
              </p>
              <p className="calc-euro">
                ≈ {savedEuro.toLocaleString("de-DE")} €
              </p>
              <p className="calc-note">
                Schätzung — angenommen, ~40 % der Admin-Zeit sind automatisierbar.
              </p>
              <MagneticButton to="/kontakt" className="calc-cta">
                Potenzial prüfen
              </MagneticButton>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix: string;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <label className="calc-slider">
      <span className="calc-slider-top">
        <span>{label}</span>
        <span className="calc-slider-val">
          {value}
          {suffix}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ "--pct": `${pct}%` } as React.CSSProperties}
      />
    </label>
  );
}
