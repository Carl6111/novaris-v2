import { useLocation } from "react-router-dom";
import { canonicalFor, seoFor, OG_IMAGE, SITE } from "../../lib/seo";

/**
 * React 19 hebt <title>, <meta> und <link> selbstständig in den <head> — ein
 * Helmet-Paket ist dafür nicht mehr nötig. Weil die Komponente innerhalb der
 * Routes sitzt, läuft sie bei jedem Pfadwechsel neu und tauscht die Tags aus.
 *
 * Wichtig: index.html darf deshalb keinen eigenen <title> und keine eigene
 * Description mehr enthalten, sonst stehen nach dem Render zwei davon im Dokument.
 */
export default function Seo() {
  const { pathname } = useLocation();
  const route = seoFor(pathname);
  const canonical = canonicalFor(route);

  return (
    <>
      <title>{route.title}</title>
      <meta name="description" content={route.description} />
      <link rel="canonical" href={canonical} />
      {!route.index && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Lunakris" />
      <meta property="og:locale" content="de_DE" />
      <meta property="og:title" content={route.title} />
      <meta property="og:description" content={route.description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={OG_IMAGE} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={route.title} />
      <meta name="twitter:description" content={route.description} />
      <meta name="twitter:image" content={OG_IMAGE} />

      <meta name="author" content="Carl Staerke" />
      <link rel="alternate" hrefLang="de" href={canonical} />
      <link rel="alternate" hrefLang="x-default" href={`${SITE}/`} />
    </>
  );
}
