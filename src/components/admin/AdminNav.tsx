import { NavLink } from "react-router-dom";

/**
 * Umschalter zwischen den beiden Richtungen: wer sich gemeldet hat (`/admin`)
 * und wen wir uns ausgesucht haben (`/admin/prospects`).
 */
export default function AdminNav() {
  return (
    <nav className="adm-nav" aria-label="Interne Bereiche">
      <NavLink to="/admin" end className={({ isActive }) => (isActive ? "is-on" : "")}>
        Anfragen
      </NavLink>
      <NavLink
        to="/admin/prospects"
        className={({ isActive }) => (isActive ? "is-on" : "")}
      >
        Zielkunden
      </NavLink>
    </nav>
  );
}
