# Lunakris Website

## Stack

- React 19, TypeScript 6, Vite 8
- Plain CSS with shared tokens in `src/styles/theme.css` and global primitives in `src/styles/global.css`
- Motion for React for purposeful transitions; React Three Fiber is lazy-loaded on the public hero
- Playwright scripts in `scripts/` provide responsive and visual checks

## Working rules

- Preserve the homepage order: evidence and cost framing (`Stats`, `Compare`) must remain before `Packages`.
- Preserve lazy Three.js loading; do not statically import hero canvas or Three.js scene modules into `Home.tsx`.
- Extend shared color, type, radius, elevation, and rhythm tokens instead of adding one-off values.
- Keep the dark hierarchy: primary copy, muted copy, surfaces, and background must remain visually distinct.
- Use asymmetry or bento spans only where content importance justifies them; never add empty decoration to break the grid.
- Reduced motion stops spatial, parallax, marquee, and decorative movement. Keep short non-spatial state feedback such as color, opacity, and focus indication.
- Keep homepage changes inside `src/pages/Home.tsx`, `src/components/home/`, and shared style tokens unless a task explicitly widens ownership.

## Verification

Run before completion:

```sh
node --test tests/design-contracts.test.mjs
npm run lint
npm run build
npm run test:api
```

For homepage visual work, also run `scripts/responsive-audit.mjs` at mobile and desktop widths and retain before/after screenshots.
