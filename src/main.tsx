import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/react";
import { deDE } from "@clerk/localizations";
import "@fontsource-variable/inter/index.css";
import "@fontsource-variable/jetbrains-mono/index.css";
import "@fontsource-variable/space-grotesk/index.css";
import "@fontsource/noto-serif-georgian/index.css";
import "./styles/global.css";
import App from "./App";
import { CLERK_APPEARANCE, CLERK_KEY } from "./lib/auth";

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
