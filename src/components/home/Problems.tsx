import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { Constellation } from "../doodles/Doodles";
import "./problems.css";

const PROBLEMS = [
  "Anfragen bleiben Stunden liegen.",
  "Angebote schreibt ihr abends. Von Hand.",
  "Der Anruf um 18:40 Uhr landet auf der Mailbox.",
  "Niemand weiß, wo ein Lead gerade steht.",
  "Kunden fragen nach, weil sie den Stand nicht sehen.",
  "Mehr Aufträge hieße bisher: neu einstellen.",
] as const;

function clampRange(
  raw: [number, number, number, number]
): [number, number, number, number] {
  const out = raw.map((v) => Math.min(1, Math.max(0, v)));
  for (let i = 1; i < out.length; i++) {
    if (out[i] <= out[i - 1]) out[i] = Math.min(1, out[i - 1] + 0.0001);
  }
  return out as [number, number, number, number];
}

interface LineProps {
  progress: MotionValue<number>;
  index: number;
  total: number;
  text: string;
}

function ProblemLine({ progress, index, total, text }: LineProps) {
  const side = index % 2 === 0 ? "left" : "right";
  const center = (index + 0.5) / total;
  const span = 0.5 / total;
  const r = clampRange([
    center - span * 1.5,
    center - span * 0.55,
    center + span * 0.55,
    center + span * 1.5,
  ]);

  const opacity = useTransform(progress, r, [0, 1, 1, 0]);
  const y = useTransform(progress, r, [80, 0, 0, -80]);
  const blurPx = useTransform(progress, r, [12, 0, 0, 12]);
  const filter = useMotionTemplate`blur(${blurPx}px)`;

  return (
    <motion.p
      className={`problem-line problem-line--${side}`}
      style={{ opacity, y, filter }}
    >
      <span className="problem-num">{String(index + 1).padStart(2, "0")}</span>
      {text}
    </motion.p>
  );
}

export default function Problems() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  if (reduce) {
    return (
      <section className="problems problems--static">
        <div className="wrap">
          <p className="eyebrow">// Der ganz normale Tag</p>
          <h2 className="problems-thesis-text">
            Kommt euch das <span className="accent">bekannt vor?</span>
          </h2>
          <ul className="problems-list">
            {PROBLEMS.map((t, i) => (
              <li key={i}>
                <span className="problem-num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="problems" aria-label="Probleme im Betrieb">
      <div className="problems-sticky">
        <Constellation
          points={[
            [8, 22],
            [24, 62],
            [42, 34],
            [60, 70],
            [78, 28],
            [93, 55],
          ]}
          className="problems-constellation"
        />
        <h2 className="problems-thesis-text">
          Kommt euch das <span className="accent">bekannt vor?</span>
        </h2>
        <div className="problems-stage">
          {PROBLEMS.map((t, i) => (
            <ProblemLine
              key={i}
              progress={scrollYProgress}
              index={i}
              total={PROBLEMS.length}
              text={t}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
