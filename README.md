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

## Deployment

Vercel SPA (siehe `vercel.json`).
