import type { ReactNode } from "react";
import Reveal from "./Reveal";
import "./pagehero.css";

type Props = {
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
  children?: ReactNode;
  background?: ReactNode;
};

export default function PageHero({ eyebrow, title, subtitle, children, background }: Props) {
  return (
    <section className="pagehero">
      {background ?? <div className="css-stars" aria-hidden="true" />}
      <div className="wrap pagehero-inner">
        <Reveal>
          <p className="eyebrow">{eyebrow}</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="pagehero-title">{title}</h1>
        </Reveal>
        {subtitle && (
          <Reveal delay={0.16}>
            <p className="pagehero-sub">{subtitle}</p>
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}
