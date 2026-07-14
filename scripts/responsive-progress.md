# Responsive pass — progress

Server: `npm run dev -- --port 5300 --strictPort`
Audit: `node scripts/responsive-audit.mjs --route=<r> --widths=320,375,390,430 [--section=.x] [--hero] [--taps]`
Konvention: clamp-Floor senken > bestehende Query anpassen > neue `@media (max-width: 480px)`. Bestehende 720–900px-Queries nicht anfassen.

## Queue (Iteration = eine Sektion)

### Phase 1 — Global + Shared UI
- [ ] global: .wrap / .eyebrow @320–430
- [ ] ui: MagneticButton / OrbitButton / PageHero / Statement Tap-Targets + Type-Floors

### Phase 2 — Hero (Priorität)
- [ ] home/Hero: Typo-Floors 320, svh-Gap-Background, Scroll-Cue safe-area, Scrub-Feel, dpr-Cap, static Fallback

### Phase 3 — Home
- [ ] nav: Burger + Overlay @320–430, kurze Viewports
- [ ] home/DemoVideo
- [ ] home/Problems (80vw-Card)
- [ ] home/Payoff
- [ ] home/SaveCalculator (Slider-Thumb, Result-Card)
- [ ] home/Packages (Orb-Row)
- [ ] home/Stats
- [ ] home/Compare (gestackte Tabelle)
- [ ] home/Pilot
- [ ] home/NotForYou
- [ ] home/Integrations (Marquee whitelisted)
- [ ] home/Cta (Glow prüfen)
- [ ] footer

### Phase 4 — Seiten
- [ ] kontakt/Contact + BookingWizard (Steps durchklicken @390)
- [ ] plattform: Examples / ModuleRows / Process / Horizon
- [ ] preise: Pricing / Includes / Faq
- [ ] ueber: About
- [ ] legal: Impressum / Datenschutz / AGB

### Phase 5 — Regression
- [ ] Matrix 768/1024/1440/1920 sauber
- [ ] qa.mjs grün (normal + reduced-motion)
- [ ] npm run build + npm run lint grün

## Findings log
- 2026-07-15 Baseline 320/375/390/430 alle Routen: null Overflow-FAILs. Einziger Treffer war .doodle-orbit (Payoff-Chips) — intentionaler Overshoot, gewhitelistet. Verbleibende Arbeit = visueller Polish (Typo-Floors, Spacing, Tap-Targets), nicht Layout-Breakage.
