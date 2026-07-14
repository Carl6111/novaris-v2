# Responsive pass — progress

Server: `npm run dev -- --port 5300 --strictPort`
Audit: `node scripts/responsive-audit.mjs --route=<r> --widths=320,375,390,430 [--section=.x] [--hero] [--taps]`
Konvention: clamp-Floor senken > bestehende Query anpassen > neue `@media (max-width: 480px)`. Bestehende 720–900px-Queries nicht anfassen.

## Queue (Iteration = eine Sektion)

### Phase 1 — Global + Shared UI
- [x] global: .wrap / .eyebrow @320–430 — ok, nur Konventions-Kommentar ergänzt
- [x] ui: MagneticButton (~51px) / OrbitButton (~46px) / PageHero / Statement — alle ok, keine Änderung

### Phase 2 — Hero (Priorität)
- [x] home/Hero: Cue-Extrapolations-Bug gefixt, Beat-Scrim @480px, svh-Gap-Background, safe-area Cue, static Fallback entclippt. Typo-Floors @320 verifiziert gut — unverändert. dpr [1,2] ✓

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
- 2026-07-15 Hero: (1) cueOpacity 2-Punkt-Range [0,0.05] extrapolierte — "Scroll ↓" blieb den ganzen Hero sichtbar (alle Viewports, auch Desktop). Fix: [0,0.05,1]→[1,0,0]. (2) Beat-Text über hellem Planeten @≤480px kaum lesbar (accent-rot auf rot) → radialer Scrim hinter .hero-beat. (3) hero--static clippte Content @320x568 (100svh+overflow hidden, h1 unter Nav) → height auto + min-height 100svh + relative Overlay mit 6.5rem Top-Padding. (4) .hero background #000 gegen svh/lvh-Gap. (5) Cue + safe-area-inset-bottom.
