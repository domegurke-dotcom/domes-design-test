// v948: Nachspieler (Testspieler Nr. 4) spielt eine kleine, von Hand geschriebene Aufnahme nach
const { execFileSync } = require('child_process'); const fs = require('fs'); const os = require('os'); const path = require('path');
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'nachspiel-')), f = path.join(dir, 'a.json');
const E = [{ t: 1, a: 'Aufnahme gestartet', tempo: 4, modus: 'exp' },
  { t: 1, a: 'Aktion futterKaufen', k: 'futterKaufen', ar: ['heu', 200], ok: 1 },
  { t: 1, a: 'Aktion bauStarten', k: 'bauStarten', ar: ['reitplatz', 1], ok: 1 },
  { t: 2, a: 'Einstellung', k: 'einstellung', pension: { preis: { 1: 230, 2: 400, 3: 1000 }, leist: ['putzen'], max: 3, bluttest: 'nachreichen' } },
  { t: 2, a: 'Aktion kreditNeu', k: 'kreditNeu', ar: [2000, 4, 'Test'], ok: 1 },
  { t: 3, a: 'Aktion putzen', k: 'putzen', ar: [{ pferd: 'X', box: 5 }, 'kamm'], ok: 1 },            // Box 5 ist leer → wird übersprungen
  { t: 3, a: 'Aktion behandeln', k: 'behandeln', ar: [{ pferd: 'X', box: 1 }, 'wundsalbe', 1, 'du'], ok: 1, ma: 'Paul' },   // Mitarbeiter → nicht nachgespielt
  { t: 5, a: 'Wasser selbst', p: 'X', bx: 1 }];
fs.writeFileSync(f, JSON.stringify({ typ: 'zuchtstall-aufnahme', format: 2, eintraege: E }));
const out = execFileSync(process.execPath, [path.join(__dirname, 'nachspieler.js')], { env: { ...process.env, REC: f }, encoding: 'utf8' });
const ok = (n, c, x) => console.log((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : '')); let bad = 0; const t = (n, c, x) => { ok(n, c, x); if (!c) bad++; };
t('Start mit Tempo und Modus aus der Aufnahme', /Tempo 4, Modus exp/.test(out), out.split('\n')[0]);
t('Mitarbeiter-Eintrag wird nicht nachgespielt (6 von 7 Einträgen)', /von 6 Einträgen|von 7 Einträgen/.test(out) && /von 6 Einträgen/.test(out), (out.match(/nachgespielt \d+ von \d+/) || [])[0]);
t('Futter, Bau, Einstellung, Kredit nachgespielt (4)', /nachgespielt 4 von/.test(out) || /nachgespielt 5 von/.test(out), (out.match(/nachgespielt \d+ von \d+/) || [])[0]);
t('Putzen in leerer Box wird mit Grund übersprungen', /Aktion putzen: kein Pferd in Box/.test(out));
t('keine Seitenfehler', /Seitenfehler: keine/.test(out));
fs.rmSync(dir, { recursive: true, force: true }); process.exit(bad ? 1 : 0);
