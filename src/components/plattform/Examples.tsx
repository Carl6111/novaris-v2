import { useRef } from "react";
import Reveal from "../ui/Reveal";
import "./examples.css";

const EXAMPLES = [
  {
    name: "Lead-Capture",
    flow: ["Anfrage rein", "qualifizierte Antwort", "Eintrag im CRM"],
    desc: "Die Erstantwort geht raus, bevor jemand das Postfach öffnet.",
  },
  {
    name: "Anruf-Agent",
    flow: ["Anruf um 21:47", "Gespräch zusammengefasst", "Lead im CRM"],
    desc: "Nimmt ab, wenn niemand kann, und übergibt das Ergebnis an die Pipeline.",
  },
  {
    name: "AI Docs",
    flow: ["Lead qualifiziert", "Angebot erzeugt", "Im Portal bereit"],
    desc: "Das Angebot entsteht aus den Daten, die schon im System liegen.",
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
