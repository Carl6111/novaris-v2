import { parseLead, isStatus, isSortable } from "../api/_lib/lead";

const faelle: [string, unknown, boolean][] = [
  ["gueltig minimal", { name: "Carl", email: "a@b.de" }, true],
  ["Name fehlt", { email: "a@b.de" }, false],
  ["Mail fehlt", { name: "Carl" }, false],
  ["Mail kaputt", { name: "Carl", email: "keine-mail" }, false],
  ["Honeypot gefuellt", { name: "Bot", email: "a@b.de", botcheck: "x" }, false],
  ["Name zu lang", { name: "x".repeat(201), email: "a@b.de" }, false],
  ["kein Objekt", "hallo", false],
];
let fehler = 0;
for (const [label, body, erwartet] of faelle) {
  const r = parseLead(body);
  const ok = r.ok === erwartet;
  if (!ok) fehler++;
  console.log(`${ok ? "OK  " : "FAIL"} ${label}${r.ok ? "" : ` (${r.feld})`}`);
}

// Erfundene Ids duerfen nicht durchrutschen — sonst steht in der Tabelle
// spaeter eine Auswahl, die es nicht gibt.
const erfunden = parseLead({
  name: "Carl", email: "a@b.de",
  tier: "supernova", base_id: "gibtsnicht", addon_ids: ["auch-nicht"],
});
const sauber = erfunden.ok && erfunden.lead.tier === null
  && erfunden.lead.base_id === null && erfunden.lead.addon_ids.length === 0;
console.log(`${sauber ? "OK  " : "FAIL"} erfundene tier/base/addon-Ids werden verworfen`);
if (!sauber) fehler++;

const echt = parseLead({
  name: "Carl", email: "a@b.de",
  tier: "pulsar", base_id: "calls", addon_ids: ["calls-crm", "erfunden"],
});
const behalten = echt.ok && echt.lead.tier === "pulsar" && echt.lead.base_id === "calls"
  && echt.lead.addon_ids.length === 1 && echt.lead.addon_ids[0] === "calls-crm";
console.log(`${behalten ? "OK  " : "FAIL"} echte Auswahl bleibt, erfundenes Add-on faellt raus`);
if (!behalten) fehler++;

const wl = isStatus("neu") && !isStatus("chef") && isSortable("name") && !isSortable("email; drop");
console.log(`${wl ? "OK  " : "FAIL"} Whitelists fuer Status und Sortierspalte`);
if (!wl) fehler++;

console.log(fehler ? `\n${fehler} FEHLER` : "\nALLE GRUEN");
process.exit(fehler ? 1 : 0);
