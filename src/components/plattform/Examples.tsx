import { useRef } from "react";
import Reveal from "../ui/Reveal";
import "./examples.css";

const EXAMPLES = [
  {
    name: "Lead-Capture",
    flow: ["Anfrage rein", "qualifizierte Antwort", "Eintrag im CRM"],
    desc: "In Minuten statt Stunden. Kein Lead bleibt liegen.",
  },
  {
    name: "Support-Agent",
    flow: ["Frage rein", "Antwort rund um die Uhr", "Eskalation nur bei Bedarf"],
    desc: "Beantwortet Kundenfragen 24/7, eskaliert nur das Komplexe.",
  },
  {
    name: "Reporting-Agent",
    flow: ["Woche endet", "Bericht raus", "Klarheit am Montag"],
    desc: "Conversion, Antwortzeit, Lead-Qualität — automatisch.",
  },
] as const;

function FlowDiagram({ steps }: { steps: readonly string[] }) {
  return (
    <div className="flow">
      <svg className="flow-line" viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden="true">
        <path d="M8 12 C 60 6, 120 16, 150 10 S 250 6, 292 11" className="flow-path" />
        <circle r="3" className="flow-pulse">
          <animateMotion
            dur="3.2s"
            repeatCount="indefinite"
            path="M8 12 C 60 6, 120 16, 150 10 S 250 6, 292 11"
          />
        </circle>
      </svg>
      <ol className="flow-steps">
        {steps.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
    </div>
  );
}

function SpotCard({ children, delay }: { children: React.ReactNode; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <Reveal delay={delay}>
      <div ref={ref} className="example-card starlit-card" onPointerMove={onMove}>
        {children}
      </div>
    </Reveal>
  );
}

export default function Examples() {
  return (
    <section className="examples">
      <div className="wrap">
        <Reveal>
          <div className="section-head">
            <p className="eyebrow">// In der Praxis</p>
            <h2>So sieht ein Agent im Alltag aus.</h2>
          </div>
        </Reveal>

        <div className="examples-grid">
          {EXAMPLES.map((e, i) => (
            <SpotCard key={e.name} delay={i * 0.08}>
              <h3>{e.name}</h3>
              <FlowDiagram steps={e.flow} />
              <p className="example-desc">{e.desc}</p>
            </SpotCard>
          ))}
        </div>
      </div>
    </section>
  );
}
