import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import "./orbit-button.css";

type Props = {
  to: string;
  children: ReactNode;
  className?: string;
};

export default function OrbitButton({ to, children, className = "" }: Props) {
  return (
    <Link to={to} className={`orbitbtn ${className}`}>
      <svg className="orbitbtn-ring" aria-hidden="true">
        <rect
          x="1"
          y="1"
          width="calc(100% - 2px)"
          height="calc(100% - 2px)"
          rx="24"
          pathLength="100"
        />
      </svg>
      <span className="orbitbtn-fill" aria-hidden="true" />
      <span className="orbitbtn-label">{children}</span>
      <span className="orbitbtn-arrow" aria-hidden="true">
        <svg viewBox="0 0 24 12" fill="none">
          <path
            d="M1 8 C 7 4, 13 9, 18 6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M15 2.5 L 19 5.8 L 14.5 8.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </span>
    </Link>
  );
}
