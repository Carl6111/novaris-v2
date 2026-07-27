import { useRef } from "react";
import { motion } from "motion/react";
import { HandArrow } from "../doodles/Doodles";
import "./module-rows.css";

type Module = {
  tag: string;
  title: string;
  accent: string;
  desc: string;
  img?: string;
};

const MODULES: Module[] = [
  {
    tag: "Website",
    title: "Gefunden,",
    accent: "nicht gesucht.",
    desc: "Eine Seite, die in unter zwei Sekunden steht und in Google wie in KI-Antworten auftaucht. Anfragen landen direkt in der Pipeline.",
    img: "/images/googleseo.webp",
  },
  {
    tag: "CRM",
    title: "Jeder Lead",
    accent: "an einem Ort.",
    desc: "Jeder Kontakt und jede Anfrage wird automatisch erfasst und nach Dringlichkeit sortiert. Nichts liegt mehr im Postfach von jemandem.",
    img: "/images/crm.webp",
  },
  {
    tag: "AI Docs",
    title: "Angebote, die sich",
    accent: "selbst schreiben.",
    desc: "Angebote und Doku entstehen aus den Daten, die schon im System liegen. Aus einem Abend werden ein paar Minuten.",
    img: "/images/aidocs.webp",
  },
  {
    tag: "Client Portal",
    title: "Ein Zuhause",
    accent: "für Ihre Kunden.",
    desc: "Kunden sehen Stand, Dokumente und nächste Schritte selbst. Das erspart Ihnen die Nachfragen per Mail und Telefon.",
    img: "/images/clientportal.webp",
  },
  {
    tag: "Anruf-Agent",
    title: "Kein Anruf",
    accent: "geht verloren.",
    desc: "Nimmt ab, wenn niemand kann. Das Gespräch wird zusammengefasst und liegt als Lead im CRM, bevor Sie zurückrufen.",
  },
];

function TiltFrame({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType === "touch") return;
    const r = el.getBoundingClientRect();
    const rx = ((e.clientY - r.top) / r.height - 0.5) * -8;
    const ry = ((e.clientX - r.left) / r.width - 0.5) * 10;
    el.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  };
  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg)";
  };

  return (
    <div ref={ref} className="mrow-frame" onPointerMove={onMove} onPointerLeave={onLeave}>
      {children}
    </div>
  );
}

function ModuleRow({ m, index }: { m: Module; index: number }) {
  const flipped = index % 2 === 1;
  return (
    <div className={`mrow ${flipped ? "mrow--flip" : ""}`}>
      <motion.div
        className="mrow-copy"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="mrow-num">{String(index + 1).padStart(2, "0")}</span>
        <p className="mrow-tag">{m.tag}</p>
        <h3 className="mrow-title">
          {m.title} <span className="accent">{m.accent}</span>
        </h3>
        <p className="mrow-desc">{m.desc}</p>
        <HandArrow
          variant={index % 3 === 0 ? "curve" : index % 3 === 1 ? "loop" : "straight"}
          className={`mrow-arrow ${flipped ? "mrow-arrow--flip" : ""}`}
          delay={0.4}
        />
      </motion.div>

      <motion.div
        className="mrow-visual"
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
      >
        <TiltFrame>
          <div className="mrow-bar">
            <span /><span /><span />
          </div>
          {m.img ? (
            <img src={m.img} alt={`${m.tag} Ansicht`} loading="lazy" width="1280" height="800" />
          ) : (
            <div className="mrow-mock" aria-hidden="true">
              <div className="mrow-mock-call">
                <span className="mrow-mock-dot" /> Anruf · 02:14 · aufgezeichnet
              </div>
              <div className="mrow-mock-row" />
              <div className="mrow-mock-row short" />
              <div className="mrow-mock-row" />
              <div className="mrow-mock-cta">→ Lead im CRM angelegt</div>
            </div>
          )}
        </TiltFrame>
      </motion.div>
    </div>
  );
}

export default function ModuleRows() {
  return (
    <section id="system" className="module-rows">
      <div className="wrap">
        {MODULES.map((m, i) => (
          <ModuleRow key={m.tag} m={m} index={i} />
        ))}
      </div>
    </section>
  );
}
