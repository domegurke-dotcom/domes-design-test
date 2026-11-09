// v1001 (Dome 9.11.): Pferdewirtschaftsmeister: +2 Tätigkeiten für JEDEN Mitarbeiter, springt mit höchstens 4 Tätigkeiten ein, wenn kein anderer kann (nicht zuteilbar), Karte im Whiteboard.
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/stallmeister-einspringen-test.js   (Bilder: BILDER_ORDNER=<Ordner>)
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const R = await pg.evaluate(() => { const R = {}; document.getElementById('dlg').hidden = true; spiel.tippsAus = true; spiel.stufenAn = false; spiel.geld = 100000; speicherSperre = true;
    const mkP = (name, i) => { const p = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name }); p.pflege = erzeugePflege(p); p.werte = p.werte || erzeugeWerte(p); p.befunde = []; spiel.boxen[i].pferd = p; spiel.boxen[i].krippeVoll = true; return p; };
    const mkM = (typ, id) => maErgaenzen({ id: id || 'm' + typ, typ, name: 'T-' + typ, wissen: wissenStart(20, {}), eig: [], gehalt: 300, ab: 0, bis: null });
    const n = Math.min(6, spiel.boxen.length); for (let i = 0; i < n; i++) mkP('P' + i, i); R.boxen = n;
    const mei = mkM('stallmeister'), sb = mkM('stallbursche'), be = mkM('bereiter'), pf = mkM('pfleger');
    const set = l => { spiel.mitarbeiter = l; maBoxCache = null; };
    const von = (art, m) => maZuteilung(art).filter(x => x.m.typ === m).length;
    // A) Kapazität: ohne Meister / mit Meister – jeder Beruf +2
    set([sb, be, pf]); R.kapOhne = { sb: maKapazitaet(sb), be: maKapazitaet(be), pf: maKapazitaet(pf) };
    set([mei, sb, be, pf]); R.kapMit = { sb: maKapazitaet(sb), be: maKapazitaet(be), pf: maKapazitaet(pf), mei: maKapazitaet(mei) };
    // B) niemand sonst da: Meister springt ein – Füttern/Misten und Putzen zusammen höchstens 4
    set([mei]); R.nurMeister = { stall: von('stall', 'stallmeister'), pfleger: von('pfleger', 'stallmeister') };
    // C) Stallbursche (5 mit Meister) + Pfleger (5): bei 6 Boxen schafft der Pfleger 5, 1 bleibt → Meister nimmt sie
    set([mei, sb, pf]); R.mitTeam = { sb: von('stall', 'stallbursche'), mStall: von('stall', 'stallmeister'), pf: von('pfleger', 'pfleger'), mPf: von('pfleger', 'stallmeister') };
    // D) Meister nicht zuteilbar: Whiteboard-Karte da, ohne Zuteilungs-Attribut
    set([mei, sb]); wbSicht = 'boxen'; zeigeWhiteboard();
    R.karte = (() => { const k = [...document.querySelectorAll('.wb-ma-info')].find(x => /Pferdewirtschaftsmeister/.test(x.textContent)); return k ? { text: k.textContent.replace(/\s+/g, ' ').trim(), zuteilbar: k.hasAttribute('data-wbq') } : null; })();
    // E) echter Tageswechsel mit Meister als Einspringer: keine Fehler, Krippe gefüllt
    set([mei]); spiel.boxen.forEach(x => { x.krippeVoll = false; }); spiel.mitarbeiter = [mei]; maBoxCache = null; const t0 = spiel.tag; naechsteNacht(); document.getElementById('dlg').hidden = true;
    R.nacht = { tag: spiel.tag - t0, gefuettert: spiel.boxen.slice(0, n).filter(x => x.krippeVoll).length };
    return R; });
  const out = [], ok = (nm, c, x) => out.push((c ? '✓ ' : '✗ ') + nm + (x !== undefined ? ' – ' + x : ''));
  ok('Kapazität: jeder Beruf +2 mit Meister (Stallbursche, Bereiter, Pfleger)', R.kapMit.sb === R.kapOhne.sb + 2 && R.kapMit.be === R.kapOhne.be + 2 && R.kapMit.pf === R.kapOhne.pf + 2 && R.kapMit.mei === 0, JSON.stringify([R.kapOhne, R.kapMit]));
  ok('allein im Stall: Meister macht höchstens 4 Tätigkeiten (Füttern/Misten + Putzen zusammen)', R.nurMeister.stall + R.nurMeister.pfleger <= 4 && R.nurMeister.stall + R.nurMeister.pfleger >= 1 && R.nurMeister.stall === Math.min(4, R.boxen), JSON.stringify(R.nurMeister));
  ok('mit Team: er springt nur für den Rest ein (Stallbursche 5 + Meister 1; Pfleger 5 + Meister höchstens 3)', R.mitTeam.sb === 5 && R.mitTeam.mStall === Math.max(0, R.boxen - 5) && R.mitTeam.pf === 5 && R.mitTeam.mStall + R.mitTeam.mPf <= 4, JSON.stringify(R.mitTeam));
  ok('Whiteboard: Karte des Meisters da, nicht zuteilbar', !!R.karte && !R.karte.zuteilbar && /von 4 Tätigkeiten/.test(R.karte.text), JSON.stringify(R.karte));
  ok('Tageswechsel: läuft ohne Fehler, Meister füttert', R.nacht.tag === 1 && R.nacht.gefuettert >= 1, JSON.stringify(R.nacht));
  ok('keine Skriptfehler', errs.length === 0, errs.join(' | '));
  console.log(out.join('\n')); await b.close(); process.exit(out.some(l => l.startsWith('✗')) ? 1 : 0);
})();
