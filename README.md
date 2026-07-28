# Lunakris v2

Marketing-Website für Lunakris — KI-Systeme für ambitionierte Betriebe.
Dark Space-Theme, echtes WebGL 3D (react-three-fiber), Coral-Palette.

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS v4 (Token-basiert, `src/styles/theme.css`)
- three.js + @react-three/fiber 9 + drei 10 + postprocessing
- motion (Framer Motion) + Lenis Smooth Scroll

## Entwicklung

```bash
npm install
npm run dev      # Dev-Server
npm run build    # Production Build
npm run preview  # Build lokal testen
node scripts/qa.mjs  # QA-Matrix (Copy-Diff + Screenshots, braucht laufenden Server via BASE=)
```

## Assets

- `public/models/astronaut.min.glb` — generiert aus eigenem Brand-Artwork (Higgsfield image-to-3D), optimiert mit gltf-transform
- `public/textures/mars-*.webp` — Mars-Texturen von [Solar System Scope](https://www.solarsystemscope.com/textures/), CC-BY 4.0
- `scripts/optimize-images.mjs` — sharp-Pipeline für alle Bilder (Budget: max 400KB pro Rasterbild)

## Buchung konfigurieren (Wizard → Calendly-Mail)

Der Kontakt-Wizard (`src/components/kontakt/BookingWizard.tsx`) schickt die
Antworten per [Web3Forms](https://web3forms.com) und lässt dem Lead automatisch
eine E-Mail mit dem Calendly-Link zukommen. Setup:

1. Auf web3forms.com mit E-Mail den kostenlosen Access Key holen.
2. Im Web3Forms-Dashboard den **Autoresponder** aktivieren und den
   **Calendly-Link** in die Antwort-Mail an den Absender einbauen.
3. `.env.example` → `.env` kopieren und ausfüllen:
   - `VITE_WEB3FORMS_KEY` = der Access Key
   - `VITE_CALENDLY_URL` = dein Buchungslink (Direkt-Button auf dem Erfolgs-Screen)
4. In Vercel dieselben Variablen unter Project → Settings → Environment Variables
   eintragen, dann neu deployen.

Ohne diese Werte bleibt der Wizard funktional (Fallback: Erfolgs-Screen mit
`mailto:`), verschickt aber keine automatische Mail.

## Anmeldung konfigurieren (Clerk)

Das Anmelde-Fenster (Nav → „Anmelden") ist [Clerk](https://clerk.com). Ohne
Key läuft die Seite normal weiter — nur `/login` und `/portal` sagen dann, dass
die Anmeldung noch nicht eingerichtet ist. Nichts stürzt ab.

1. Auf clerk.com eine Application anlegen, **Publishable Key** kopieren.
   Er gehört ins Frontend, das ist seine Aufgabe. Den **Secret Key nie** in
   dieses Projekt kopieren — er wird hier nirgends gebraucht.
2. Dashboard → **User & Authentication → Email, Phone, Username**:
   - `Email address` an
   - `Password` an
   - `Email verification code` an (= Magic Link)
3. Dashboard → **SSO Connections**:
   - **Google** an. Für Entwicklung reichen Clerks Shared Credentials; vor dem
     Livegang eine eigene OAuth-Client-ID in der Google Cloud Console anlegen.
   - **Apple** an. Braucht das **Apple Developer Program (99 €/Jahr)** —
     ohne den Account geht Apple Sign In nicht, das ist nicht umgehbar.
4. Dashboard → **Domains**: die Vercel-Domain eintragen.
5. `VITE_CLERK_PUBLISHABLE_KEY` in `.env` **und** in Vercel unter
   Settings → Environment Variables setzen, dann neu deployen.

## Zahlung nach dem Gespräch (Stripe)

Bewusst **kein Stripe-Key im Projekt**. Für „Zahlung nach dem Erstgespräch"
reicht ein Payment Link — ein eigener Stripe-Aufruf bräuchte einen Secret Key
und damit eine Serverseite, also Aufwand ohne Gegenwert.

1. Stripe Dashboard → **Payment Links** → Link für das vereinbarte Paket.
2. Clerk Dashboard → **Users** → Kunde öffnen → **Public Metadata**:
   ```json
   { "zahlungslink": "https://buy.stripe.com/..." }
   ```
3. Der Kunde sieht den Knopf danach in `/portal`.

Solange nichts hinterlegt ist, steht dort „Noch nichts offen".

> **Hinweis:** `.env.example` ist über `.gitignore` (`.env.*`) ausgeschlossen und
> liegt nur lokal. Die Einrichtung steht deshalb hier im README.

## Deployment

Vercel SPA (siehe `vercel.json`, Rewrite schließt `/api` aus).
