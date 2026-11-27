// Welsh-Scheckung (27.11.2026, Dome): Zuchtprogramm Welsh Ponys und Cobs (Rheinisches Pferdestammbuch 02/2025): Farben „alle Farben, ausgenommen Tobiano und Overo-Scheckung“.
// Folge im Spiel: Rassemerkmal „Scheckung“ = schwerer Verstoß; Stuten nur Anhang, Hengste nicht gekört, Marktwert × RM_ZAHL.wertSchwer.
// Start (PowerShell): $env:NODE_PATH = "C:\Users\Admin\werkzeug-node\pw\node_modules"; node tests/welsh-scheckung-test.js   ·   MOTOR=1 prüft den Motor
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : ''));
  const datei = process.env.MOTOR ? path.resolve(__dirname, '..', '..', 'zuchtstall-app', 'motor', 'index.html') : path.resolve(__dirname, '..', 'index.html');
  await pg.goto('file://' + datei); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const r = await pg.evaluate(() => {
    document.getElementById('dlg').hidden = true; spiel.tippsAus = true; spiel.admin = false; spiel.stufenAn = false; spiel.geld = 300000;
    const o = {}, mk = (id, g, alter, farbe, n) => { const p = neuesPferd({ rasse: id, geschlecht: g, alter, name: n }); p.anteile = { [id]: 100 }; p.pflege = p.pflege || erzeugePflege(p); p.werte = p.werte || erzeugeWerte(p); p.papiere = true; p.farbe = farbe; return p; };
    const rm = p => (rasseMerkmale(p).z.find(x => x.n === 'Scheckung') || {});
    o.rassen = {};
    ['welsha', 'welshpony', 'welshc', 'welshcob'].forEach(id => {
      const glatt = mk(id, 'Stute', 4, 'brauner', 'G' + id), tob = mk(id, 'Stute', 4, 'to_brauner', 'T' + id), spl = mk(id, 'Stute', 4, 'sw_brauner', 'S' + id), ove = mk(id, 'Stute', 4, 'ov_brauner', 'O' + id);
      const zi = p => { const i = zbEintragen(p, 'schau', 'Stutenschau Test', () => 0.99); return i; };
      o.rassen[id] = { glatt: [rm(glatt).st, welshSchecke(glatt), rasseWertFaktor(glatt)], tob: [rm(tob).st, welshSchecke(tob), rasseWertFaktor(tob)], spl: [rm(spl).st, welshSchecke(spl)], ove: [rm(ove).st, welshSchecke(ove)],
        ig: zi(glatt), it: zi(tob), is: zi(spl), io: zi(ove), nameT: (zuchtbuchVon(tob) || {}).n, nameG: (zuchtbuchVon(glatt) || {}).n };
    });
    // Hengst: gekört ohne Scheckung, mit Tobiano nicht
    const hg = mk('welshpony', 'Hengst', 4, 'brauner', 'HG'), ht = mk('welshpony', 'Hengst', 4, 'to_brauner', 'HT');
    hengstKoerung(hg, 'Körung Test', () => 0.99); hengstKoerung(ht, 'Körung Test', () => 0.99);
    o.hengst = { glatt: hg.hb && hg.hb.s, tob: ht.hb && ht.hb.s, zulG: !!hengstZulassung(hg), zulT: !!hengstZulassung(ht) };
    o.brief = (spiel.briefe || spiel.post || []).map(x => String(x.text || x.inhalt || '')).filter(t => /Tobiano und Overo/.test(t)).length;
    // andere Rassen unberührt (Quarter: Tobiano ist kein Verstoß-Eintrag Scheckung)
    const q = mk('quarter', 'Stute', 4, 'to_brauner', 'Q'); o.quarter = [rasseMerkmale(q).z.some(x => x.n === 'Scheckung'), welshSchecke(q)];
    // Mischling (Welsh × Araber) wird nicht geprüft
    const mi = mk('welshpony', 'Stute', 4, 'to_brauner', 'Mi'); mi.anteile = { welshpony: 60, araber: 40 }; o.misch = rasseMerkmale(mi).misch === true;
    return o;
  });
  ['welsha', 'welshpony', 'welshc', 'welshcob'].forEach(id => {
    const x = r.rassen[id];
    ok(id + ': ungeschecktes Pony – Scheckung unproblematisch, normaler Wert', x.glatt[0] === 0 && x.glatt[1] === false && x.glatt[2] === 1 || x.glatt[0] === 0 && x.glatt[1] === false, JSON.stringify(x.glatt));
    ok(id + ': Tobiano/Splash/Overo = schwerer Verstoß', x.tob[0] === 3 && x.tob[1] && x.spl[0] === 3 && x.spl[1] && x.ove[0] === 3 && x.ove[1], JSON.stringify([x.tob, x.spl, x.ove]));
    ok(id + ': Marktwert des gescheckten sinkt (×0,85)', x.tob[2] < 1, String(x.tob[2]));
    ok(id + ': ungescheckte Stute in Stutbuch I/II, gescheckte nur im Anhang', (x.ig === 0 || x.ig === 1) && x.it === 2 && x.is === 2 && x.io === 2 && x.nameT === 'Anhang', JSON.stringify([x.ig, x.it, x.is, x.io, x.nameG, x.nameT]));
  });
  ok('Hengst ohne Scheckung wird gekört, Tobiano-Hengst nicht', r.hengst.glatt !== 'nein' && r.hengst.tob === 'nein' && !r.hengst.zulT, JSON.stringify(r.hengst));
  ok('Körungsbrief nennt Begründung (Tobiano und Overo-Scheckung)', r.brief >= 1, String(r.brief));
  ok('andere Rassen (Quarter) ohne Scheckungs-Regel', r.quarter[0] === false && r.quarter[1] === false, JSON.stringify(r.quarter));
  ok('Mischlinge werden nicht geprüft', r.misch);
  ok('keine Skriptfehler', errs.length === 0, errs.join(' | '));
  console.log(out.join('\n')); await b.close(); process.exit(out.some(l => l.startsWith('✗')) ? 1 : 0);
})();
