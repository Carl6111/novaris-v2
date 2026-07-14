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
- [x] nav: Overlay @320/390 sauber; overflow-y auto + flex-start @max-height 480px für Landscape
- [x] home/DemoVideo — ✓ ohne Änderung
- [x] home/Problems — static Variante auf Mobile, Cards ok
- [x] home/Payoff — ✓ (doodle-orbit Overshoot intentional)
- [x] home/SaveCalculator — ✓ Slider + Result-Card gut @320
- [x] home/Packages — ✓ Orbs 3-spaltig passt @320
- [x] home/Stats — ✓
- [x] home/Compare — ✓ gestackte Tabelle sauber @320
- [x] home/Pilot — ✓
- [x] home/NotForYou — ✓
- [x] home/Integrations — ✓ Marquee whitelisted
- [x] home/Cta — ✓
- [x] footer — Social-Links (X 8x19px) auf 44px Tap-Target gefixt

### Phase 4 — Seiten
- [x] kontakt/Contact + BookingWizard: Steps @390 durchgeklickt; .wizard-back 61x19→81x46 Tap-Target; .wizard Padding 1.4/1.25rem @480px
- [x] plattform: Examples / ModuleRows / Process — ✓ ohne Änderung
- [x] preise: Pricing / Includes / Faq — ✓ ohne Änderung (Fullpage @320 sauber)
- [x] ueber: About — ✓ ohne Änderung
- [x] legal: Impressum / Datenschutz / AGB — ✓ Overflow-PASS, Prose

### Phase 5 — Regression
- [ ] Matrix 768/1024/1440/1920 sauber
- [ ] qa.mjs grün (normal + reduced-motion)
- [ ] npm run build + npm run lint grün

## Findings log
- 2026-07-15 Baseline 320/375/390/430 alle Routen: null Overflow-FAILs. Einziger Treffer war .doodle-orbit (Payoff-Chips) — intentionaler Overshoot, gewhitelistet. Verbleibende Arbeit = visueller Polish (Typo-Floors, Spacing, Tap-Targets), nicht Layout-Breakage.
- 2026-07-15 Hero: (1) cueOpacity 2-Punkt-Range [0,0.05] extrapolierte — "Scroll ↓" blieb den ganzen Hero sichtbar (alle Viewports, auch Desktop). Fix: [0,0.05,1]→[1,0,0]. (2) Beat-Text über hellem Planeten @≤480px kaum lesbar (accent-rot auf rot) → radialer Scrim hinter .hero-beat. (3) hero--static clippte Content @320x568 (100svh+overflow hidden, h1 unter Nav) → height auto + min-height 100svh + relative Overlay mit 6.5rem Top-Padding. (4) .hero background #000 gegen svh/lvh-Gap. (5) Cue + safe-area-inset-bottom.
