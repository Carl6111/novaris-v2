import { Link } from "react-router-dom";
import "./footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="css-stars" aria-hidden="true" />
      <div className="wrap footer-inner">
        <div className="footer-brand">
          <Link to="/" className="footer-logo" aria-label="Novaris Startseite">
            <img src="/logos/novaris-mark.png" alt="" className="footer-mark" />
            <span>OVARIS</span>
          </Link>
          <p>KI-Systeme, die euren Betrieb täglich entlasten.</p>
        </div>
        <nav className="footer-links" aria-label="Footer">
          <Link to="/plattform">Plattform</Link>
          <Link to="/preise">Preise</Link>
          <Link to="/ueber">Über</Link>
          <Link to="/kontakt">Kontakt</Link>
        </nav>
      </div>
      <div className="wrap footer-bottom">
        <span>© {new Date().getFullYear()} Novaris</span>
        <span>Gebaut mit echtem Code &amp; echter KI.</span>
      </div>
    </footer>
  );
}
