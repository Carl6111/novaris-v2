import sharp from "sharp";
import { mkdir } from "node:fs/promises";

/**
 * Leitet alle Markenbilder aus der einen Master-Datei ab.
 *
 * Carl liefert das Logo als weiße Zeichnung auf schwarzem Grund, Bildzeichen
 * und Wortmarke in einem Bild, ohne Alphakanal. Gebraucht werden daraus zwei
 * freigestellte Bildzeichen in unterschiedlichen Farben:
 *
 *   Website  — weiß,  weil die Seite dunkel ist (#07070C)
 *   Video    — Tinte, weil der Film cremefarben ist (#F6F1E7)
 *
 * Ein weißes Bildzeichen auf cremefarbenem Grund wäre unsichtbar. Genau daran
 * hing der Vorgänger: lunakris-n.png war rgb(241,239,234), logoasset.png war
 * rgb(7,7,7) — dieselbe Zeichnung, zwei Dateien.
 *
 * Freigestellt wird über die Luminanz als Alphakanal, nicht über einen harten
 * Schwellwert: nur so bleiben die Kanten geglättet.
 */

const MASTER = "/Users/carlstaerke/Downloads/Lunakris/bild lunakrisfinal.png";

/** Von Hand am Master ausgemessen (Zeilen ohne Inhalt trennen die Bänder). */
const MARK = { left: 275, top: 241, width: 546, height: 610 };
const PAD = 8;

const INK = { r: 0x17, g: 0x14, b: 0x0f };
const WHITE = { r: 255, g: 255, b: 255 };

const SITE = "/Users/carlstaerke/Downloads/lunakris-v2/public";
const VIDEO = "/Users/carlstaerke/Downloads/Lunakris/video/public";

/**
 * Schwarz raus, Wunschfarbe rein. Die Helligkeit des Originals wird zur
 * Deckkraft — schwarzer Grund ergibt 0, die weiße Zeichnung ergibt 255.
 */
async function keyed(buffer, color) {
  const { data, info } = await sharp(buffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const out = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i += 4) {
    const lum = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
    out[i] = color.r;
    out[i + 1] = color.g;
    out[i + 2] = color.b;
    // Leichte Anhebung, sonst wirken die dünnen Platinenbahnen ausgewaschen.
    out[i + 3] = Math.min(255, Math.round(lum * 1.05));
  }

  // Rand wegschneiden, damit der Rahmen die Zeichnung eng umschließt. Sonst
  // trägt jede Einbaustelle unsichtbares Polster mit sich herum — in der
  // Navigation las sich das als "L UNAKRIS" statt "LUNAKRIS".
  return sharp(out, {
    raw: { width: info.width, height: info.height, channels: 4 },
  }).trim({ threshold: 1 });
}

const master = sharp(MASTER);

const markRaw = await master
  .clone()
  .extract({
    left: MARK.left - PAD,
    top: MARK.top - PAD,
    width: MARK.width + PAD * 2,
    height: MARK.height + PAD * 2,
  })
  .png()
  .toBuffer();

await mkdir(`${SITE}/logos`, { recursive: true });
await mkdir(`${SITE}/images`, { recursive: true });
await mkdir(VIDEO, { recursive: true });

// 1. Website — weiß auf transparent.
await (await keyed(markRaw, WHITE))
  .png({ compressionLevel: 9 })
  .toFile(`${SITE}/logos/lunakris-l.png`);

// 2. Video — Tinte auf transparent. Ersetzt logoasset.png an Ort und Stelle,
//    LetterBrand lädt die Datei über staticFile() unter genau diesem Namen.
await (await keyed(markRaw, INK))
  .png({ compressionLevel: 9 })
  .toFile(`${VIDEO}/logoasset.png`);

// 3. Social-Karte — volle Sperrschrift auf dem Seitenhintergrund, 1920x1080
//    wie bisher. Der Master ist quadratisch, also mittig einbetten.
const lockup = await (
  await keyed(await master.clone().png().toBuffer(), WHITE)
)
  .resize({ height: 760, fit: "inside" })
  .png()
  .toBuffer();

await sharp({
  create: { width: 1920, height: 1080, channels: 4, background: "#07070C" },
})
  .composite([{ input: lockup, gravity: "center" }])
  .webp({ quality: 82 })
  .toFile(`${SITE}/images/lunakrisfinal.webp`);

console.log("Bildzeichen abgeleitet:");
console.log("  ", `${SITE}/logos/lunakris-l.png`, "(weiß)");
console.log("  ", `${VIDEO}/logoasset.png`, "(Tinte)");
console.log("  ", `${SITE}/images/lunakrisfinal.webp`, "(Social-Karte)");
