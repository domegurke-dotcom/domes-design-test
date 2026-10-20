// Bilder-Schalter für die großen Tests (Dome, 20.10.2026): etappen-test.js, hof-gesamttest.js, neuladen-test.js.
// Wahl per Umgebungsvariable (die Skripte laufen sonst wie bisher, also ohne Bilder):
//   BILDER=aus     keine Bilder (Standard) – nur ✓/✗ der Skripte
//   BILDER=fehler  Bilder nur bei Problemen (✗ oder Seitenfehler)
//   BILDER=alle    Bilder in allen Ansichten (jeweils die Ansichten, die der Test ohnehin durchklickt)
//   BILDER_ORDNER=<Ordner>   Pflicht bei fehler/alle – nie im Projektordner, immer im Scratchpad
// Beispiel: BILDER=fehler BILDER_ORDNER=/tmp/…/scratchpad/etappen NODE_PATH=/opt/node22/lib/node_modules node tests/etappen-test.js
const fs = require('fs'), path = require('path');
const MODUS = (process.env.BILDER || 'aus').toLowerCase(), ORDNER = process.env.BILDER_ORDNER ? path.resolve(process.env.BILDER_ORDNER) : '';
if (!['aus', 'fehler', 'alle'].includes(MODUS)) { console.error('BILDER muss aus, fehler oder alle sein (ist: ' + MODUS + ')'); process.exit(2); }
if (MODUS !== 'aus') {
  if (!ORDNER) { console.error('BILDER=' + MODUS + ' braucht BILDER_ORDNER=<Ordner im Scratchpad>'); process.exit(2); }
  if (ORDNER === path.resolve(__dirname, '..') || ORDNER.startsWith(path.resolve(__dirname, '..') + path.sep)) { console.error('BILDER_ORDNER darf nicht im Projektordner liegen'); process.exit(2); }
  fs.mkdirSync(ORDNER, { recursive: true });
}
let anzahl = 0;
// ok = true, wenn an dieser Stelle alles in Ordnung war: bei „alle“ immer ein Bild, bei „fehler“ nur wenn ok === false
async function bild(pg, name, ok = true) {
  if (MODUS === 'aus' || (MODUS === 'fehler' && ok !== false)) return;
  const datei = path.join(ORDNER, String(++anzahl).padStart(3, '0') + '-' + name.replace(/[^A-Za-z0-9ÄÖÜäöüß_-]+/g, '-') + (ok === false ? '-FEHLER' : '') + '.png');
  try { await pg.screenshot({ path: datei }); } catch (e) { console.error('Bild nicht gespeichert: ' + datei + ' – ' + e.message); }
}
module.exports = { MODUS, ORDNER, bild, zusammenfassung: () => MODUS === 'aus' ? '' : `Bilder (${MODUS}): ${anzahl} in ${ORDNER}` };
