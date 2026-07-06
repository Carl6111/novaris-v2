# Novaris v2

Marketing-Website für Novaris — KI-Systeme für ambitionierte Betriebe.
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

## Deployment

Vercel SPA (siehe `vercel.json`, Rewrite schließt `/api` aus).
