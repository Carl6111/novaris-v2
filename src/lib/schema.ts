/**
 * JSON-LD-Bausteine. Getrennt von den Komponenten, damit die Schemata aus
 * denselben Daten entstehen wie die sichtbaren Texte (src/data/*) und nicht
 * daneben herlaufen.
 *
 * NAP-Daten und Social-Profile kommen aus src/lib/business.ts — die einzige
 * Stelle, die gepflegt wird. Solange dort nichts steht, lässt das Schema die
 * Felder weg: erfundene NAP-Daten wären schlimmer als keine, weil Entity-
 * Konsistenz genau daran hängt. Leere `sameAs` wären ein wertloses Feld.
 *
 * Bewusst weggelassen:
 * - `price` / `priceSpecification` an den Offers: "Auf Anfrage" ist kein
 *   gültiger Preiswert und riskiert eine Abwertung der Rich Results.
 */

import { MODULES } from "../data/modules";
import { FAQS } from "../data/faq";
import { BUSINESS, HAT_ADRESSE } from "./business";
import { ROUTES, SITE, canonicalFor, seoFor } from "./seo";

export type JsonLdNode = Record<string, unknown>;

const ORG_ID = `${SITE}/#organization`;
const SITE_ID = `${SITE}/#website`;

export function organizationSchema(): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: "Lunakris",
    url: `${SITE}/`,
    logo: {
      "@type": "ImageObject",
      url: `${SITE}/logos/lunakris-l.png`,
    },
    description:
      "Lunakris baut KI-Systeme für mittelständische Betriebe: Website, CRM, AI Docs, Client Portal und Anruf-Agent in einem System mit einem Login.",
    founder: {
      "@type": "Person",
      name: "Carl Staerke",
    },
    areaServed: {
      "@type": "Country",
      name: "Deutschland",
    },
    knowsAbout: [
      "KI-Automatisierung",
      "AI Agents",
      "CRM für den Mittelstand",
      "Prozessautomatisierung",
      "Anruf-Agent",
    ],
    // NAP + Social nur, sobald business.ts gepflegt ist — siehe Dateikopf.
    ...(HAT_ADRESSE
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: BUSINESS.strasse,
            postalCode: BUSINESS.plz,
            addressLocality: BUSINESS.ort,
            addressCountry: "DE",
          },
        }
      : {}),
    ...(BUSINESS.telefon ? { telephone: BUSINESS.telefon } : {}),
    ...(BUSINESS.email ? { email: BUSINESS.email } : {}),
    ...(BUSINESS.social.length > 0
      ? { sameAs: BUSINESS.social.map((s) => s.href) }
      : {}),
  };
}

export function websiteSchema(): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": SITE_ID,
    url: `${SITE}/`,
    name: "Lunakris",
    inLanguage: "de-DE",
    publisher: { "@id": ORG_ID },
  };
}

/** Zweistufig: Start → aktuelle Seite. Tiefer ist die Navigation nicht. */
export function breadcrumbSchema(pathname: string): JsonLdNode | null {
  const route = seoFor(pathname);
  if (route.path === "/") return null;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Start",
        item: `${SITE}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: route.label,
        item: canonicalFor(route),
      },
    ],
  };
}

/** Ein Service je Modul — die fünf Module sind das, was tatsächlich verkauft wird. */
export function servicesSchema(): JsonLdNode {
  const plattform = ROUTES.find((r) => r.path === "/plattform");
  const plattformUrl = plattform ? canonicalFor(plattform) : `${SITE}/plattform`;

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Module der Lunakris-Plattform",
    itemListElement: MODULES.map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: `Lunakris ${m.tag}`,
        serviceType: m.tag,
        description: m.desc,
        provider: { "@id": ORG_ID },
        areaServed: { "@type": "Country", name: "Deutschland" },
        url: plattformUrl,
        offers: {
          "@type": "Offer",
          url: `${SITE}/preise`,
          availability: "https://schema.org/InStock",
        },
      },
    })),
  };
}

export function faqSchema(): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };
}
