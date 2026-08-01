import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/react";
import { deDE } from "@clerk/localizations";
import "@fontsource-variable/inter/index.css";
import "@fontsource-variable/jetbrains-mono/index.css";
import "@fontsource-variable/space-grotesk/index.css";
import "./styles/global.css";
import App from "./App";
import { CLERK_APPEARANCE, CLERK_KEY } from "./lib/auth";

/**
 * Die prerenderten Seiten (scripts/prerender.ts) tragen die von React erzeugten
 * SEO-Tags bereits im <head>. createRoot ersetzt aber nur den Inhalt von #root,
 * nicht den Head — React würde also einen zweiten Satz danebenlegen. Der Browser
 * nimmt dann weiter den ersten Titel, und nach einem Routenwechsel bliebe der
 * Titel der Einstiegsseite im Tab stehen.
 *
 * index.html liefert keine dieser Tags mehr aus, alles Vorgefundene stammt
 * folglich aus dem Snapshot und kann weg.
 */
const PRERENDERED_HEAD_TAGS = [
  "title",
  'meta[name="description"]',
  'meta[name="robots"]',
  'meta[name="author"]',
  'meta[property^="og:"]',
  'meta[name^="twitter:"]',
  'link[rel="canonical"]',
  'link[rel="alternate"]',
].join(", ");

document.head.querySelectorAll(PRERENDERED_HEAD_TAGS).forEach((el) => el.remove());

// Ohne Key kein Provider — die Seite läuft dann ohne Anmeldung weiter, statt
// beim Start zu werfen und eine weiße Seite zu hinterlassen.
//
// signInUrl/signUpUrl sagen Clerk, wohin seine eigenen Wechsel-Links zeigen
// ("Noch kein Konto? Registrieren"). Ohne sie zeigt Clerk gar keinen Link auf
// die Registrierung — genau der Grund, warum auf /login nur ein Login stand.
const tree = CLERK_KEY ? (
  <ClerkProvider
    publishableKey={CLERK_KEY}
    afterSignOutUrl="/"
    appearance={CLERK_APPEARANCE}
    localization={deDE}
    signInUrl="/login"
    signUpUrl="/registrieren"
  >
    <App />
  </ClerkProvider>
) : (
  <App />
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>{tree}</StrictMode>
);
