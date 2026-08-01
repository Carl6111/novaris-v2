import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("homepage keeps proof and cost framing before pricing", async () => {
  const home = await read("src/pages/Home.tsx");
  assert.ok(home.indexOf("<Stats") < home.indexOf("<Packages"));
  assert.ok(home.indexOf("<Compare") < home.indexOf("<Packages"));
});

test("theme exposes semantic information, typography, radius, and elevation tokens", async () => {
  const theme = await read("src/styles/theme.css");
  for (const token of [
    "--information:",
    "--information-surface:",
    "--text-display:",
    "--text-heading:",
    "--radius-control:",
    "--radius-card:",
    "--radius-feature:",
    "--elevation-1:",
    "--elevation-2:",
  ]) {
    assert.match(theme, new RegExp(token));
  }
});

test("homepage proof blocks use a semantic bento layout", async () => {
  const home = await read("src/pages/Home.tsx");
  const css = await read("src/components/home/proof-bento.css");
  assert.match(home, /className="home-proof-bento"/);
  assert.match(css, /grid-template-areas:/);
  assert.match(css, /var\(--information\)/);
  assert.match(css, /@media \(max-width: 768px\)/);
});

test("reduced motion stops spatial effects without deleting all state feedback", async () => {
  const global = await read("src/styles/global.css");
  const reducedBlock = global.slice(global.indexOf("@media (prefers-reduced-motion: reduce)"));
  assert.doesNotMatch(reducedBlock, /transition-duration:\s*0\.01ms\s*!important/);
  assert.match(reducedBlock, /transform:\s*none\s*!important/);
  assert.match(reducedBlock, /transition-property:\s*(?:color|opacity|background-color|border-color)/);
});
