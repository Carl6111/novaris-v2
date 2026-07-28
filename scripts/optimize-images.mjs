import sharp from "sharp";
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";

const OLD = "/Users/carlstaerke/Downloads/Lunakris";
const OUT = new URL("../public", import.meta.url).pathname;

// [source, outBaseName, width, formats]
const jobs = [
  [`${OLD}/Endframe.png`, "images/endframe", 1920, ["avif", "webp"]],
  // images/lunakrisfinal (die Social-Karte) kommt aus make-brand-assets.mjs —
  // sie wird aus der Logo-Masterdatei aufgebaut, nicht aus einem Foto.
  [`${OLD}/astronaut hero.png`, "images/astronaut-cutout", 800, ["webp"]],
  [`${OLD}/public/images/aidocs.png`, "images/aidocs", 1280, ["webp"]],
  [`${OLD}/public/images/crm.png`, "images/crm", 1280, ["webp"]],
  [`${OLD}/public/images/clientportal.png`, "images/clientportal", 1280, ["webp"]],
  [`${OLD}/public/images/googleseo.png`, "images/googleseo", 1280, ["webp"]],
  [`${OLD}/public/images/heart-core.png`, "images/heart-core", 900, ["webp"]],
];

const BUDGET = 400 * 1024;
let failed = false;

for (const [src, base, width, formats] of jobs) {
  await mkdir(path.join(OUT, path.dirname(base)), { recursive: true });
  for (const fmt of formats) {
    const out = path.join(OUT, `${base}.${fmt}`);
    let pipe = sharp(src).resize({ width, withoutEnlargement: true });
    pipe = fmt === "avif" ? pipe.avif({ quality: 55 }) : pipe.webp({ quality: 75 });
    await pipe.toFile(out);
    const { size } = await stat(out);
    const kb = (size / 1024).toFixed(0);
    const over = size > BUDGET;
    if (over) failed = true;
    console.log(`${over ? "OVER BUDGET " : ""}${base}.${fmt}  ${kb}KB`);
  }
}

if (failed) process.exit(1);
