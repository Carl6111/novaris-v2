import type { ReactNode } from "react";
import Reveal from "./Reveal";
import { ScribbleUnderline } from "../doodles/Doodles";
import "./statement.css";

type Props = {
  eyebrow?: string;
  subtitle?: string;
  children: ReactNode;
  underline?: boolean;
};

export default function Statement({ eyebrow, subtitle, children, underline }: Props) {
  return (
    <section className="statement">
      <div className="css-stars" aria-hidden="true" />
      <div className="wrap statement-inner">
        {eyebrow && (
          <Reveal>
            <p className="eyebrow">{eyebrow}</p>
          </Reveal>
        )}
        {subtitle && (
          <Reveal delay={0.06}>
            <p className="statement-sub">{subtitle}</p>
          </Reveal>
        )}
        <Reveal delay={0.12}>
          <p className="statement-text">
            {children}
            {underline && <ScribbleUnderline delay={0.5} />}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
