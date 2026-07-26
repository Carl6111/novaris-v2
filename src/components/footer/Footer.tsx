import { Link } from "react-router-dom";
import "./footer.css";

// TODO(Carl): echte Profil-URLs eintragen. Bis dahin bleibt die Zeile leer —
// tote Links auf "#" sind schlimmer als gar keine Social-Leiste.
const SOCIAL: { label: string; href: string }[] = [];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="css-stars" aria-hidden="true" />
      <div className="wrap footer-inner">
        <div className="footer-brand">
          <Link to="/" className="footer-logo" aria-label="Novaris Startseite">
            <img src="/logos/novaris-n.png" alt="" className="footer-mark" />
            <span>OVARIS</span>
          </Link>
          <p>KI-Systeme, die euren Betrieb täglich entlasten.</p>
          <div className="footer-social">
            {SOCIAL.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
                {s.label}
              </a>
            ))}
          </div>
        </div>
        <nav className="footer-links" aria-label="Seiten">
          <span className="footer-col-title">Seiten</span>
          <Link to="/plattform">Plattform</Link>
          <Link to="/preise">Preise</Link>
          <Link to="/ueber">Über</Link>
          <Link to="/kontakt">Kontakt</Link>
        </nav>
        <nav className="footer-links" aria-label="Rechtliches">
          <span className="footer-col-title">Rechtliches</span>
          <Link to="/impressum">Impressum</Link>
          <Link to="/datenschutz">Datenschutz</Link>
          <Link to="/agb">AGB</Link>
        </nav>
      </div>
      <div className="wrap footer-bottom">
        <span>© {new Date().getFullYear()} Novaris</span>
        <span>Gebaut in Deutschland.</span>
      </div>
    </footer>
  );
}
