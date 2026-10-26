// Mitarbeiter S1 (v860, PLAN-MITARBEITER.md): Stallhygiene, Stufen-Wörter, Stärken (Gleichstand ohne Stern), 8. Bereich Einsteller, Anzeige, Spieler lernt in allen Bereichen
// Start (Domes PC, siehe CLAUDE.md): node tests/mitarbeiter-s1-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const R = await pg.evaluate(() => { const R = {}; document.getElementById('dlg').hidden = true; spiel.tippsAus = true; spiel.stufenAn = false; spiel.admin = true;
    R.name = WISSEN.find(w => w[0] === 'klima').slice(2).join('|');
    R.stufen = [0, 19, 20, 45, 60, 85].map(wissenStufe).join(',');
    R.gleich = staerken(wissenStart(10, {})).length; R.stall = staerken(wissenStart(5, { futter: 30, klima: 25 })).join(',');
    R.pfleger = staerken(wissenStart(10, { haut: 35, huf: 25, verhalten: 25 })).join(',');
    spiel.hof.art = 'pension'; const bw = bewerber('pferdewirtHS'); R.einBw = bw.length ? bw.every(x => x.wissen.einsteller > 0) : 'keine Bewerber'; const bb = bewerber('stallbursche'); R.einSb = bb.every(x => x.wissen.einsteller == null);
    const m = maErgaenzen({ id: 'mT', typ: 'pferdewirtHS', name: 'Lena', wissen: wissenStart(10, { haut: 35 }), eig: [], gehalt: 340, ab: 0, bis: null }); R.einAlt = m.wissen.einsteller;
    spiel.mitarbeiter = [m]; mitarbeiterDialog('pferdewirtHS'); const t = document.getElementById('dlgInhalt'); R.stark = /Stark in:/.test(t.textContent) && !!t.querySelector('.ma-wissen span.stark'); R.erster = (t.querySelector('.ma-wissen span') || {}).className; R.einBalken = /Einsteller/.test(t.querySelector('.ma-wissen').textContent);
    const s = t.querySelector('.ma-wissen [data-wst]'); s.click(); R.wort = s.classList.contains('offen') && /Grundkenntnisse|erfahren|Anfänger|Experte/.test(s.textContent);
    document.getElementById('dlg').hidden = true;
    const w0 = (spiel.wissen || {}).ruecken || 10; const p = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Nixe' }); p.pflege = erzeugePflege(p); p.werte = p.werte || erzeugeWerte(p); spiel.boxen[0].pferd = p; p.energie = 100;
    const reit = Object.keys(UEBUNG).find(k => UEBUNG[k].reiten && UEBUNG[k].wo === 'platz'); try { trainieren(p, reit, 'reitplatz'); } catch (e) { R.trainFehler = e.message; } R.ruecken = (spiel.wissen.ruecken || 0) > w0;
    R.spielerGleich = /noch keine Stärke/.test(staerkeHTML(wissenStart(10, {})));
    return R; });
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x !== undefined ? ' – ' + x : ''));
  ok('Stallklima heißt Stallhygiene mit Besen', R.name === '🧹|Stallhygiene', R.name);
  ok('Stufen-Wörter', R.stufen === 'Anfänger,Anfänger,Grundkenntnisse,erfahren,sehr erfahren,Experte', R.stufen);
  ok('Gleichstand: keine Stärke', R.gleich === 0); ok('Stallbursche stark in Fütterung, Stallhygiene', R.stall === 'futter,klima', R.stall); ok('Pfleger stark in Haut', R.pfleger === 'haut', R.pfleger);
  ok('Pferdewirt HS (Bewerber) hat Einsteller-Bereich, Stallbursche nicht', R.einBw === true && R.einSb, R.einBw); ok('alter Pferdewirt HS bekommt Einsteller 40', R.einAlt === 40, R.einAlt);
  ok('Dialog: Stark in, goldener Balken zuerst, Einsteller-Balken', R.stark && /stark/.test(R.erster) && R.einBalken, R.erster);
  ok('Balken antippen zeigt das Stufen-Wort', R.wort); ok('Spieler lernt Rücken beim Training', R.ruecken, R.trainFehler); ok('Spieler bei Gleichstand: „noch keine Stärke“', R.spielerGleich);
  ok('keine Skriptfehler', errs.length === 0, errs.join(' | '));
  console.log(out.join('\n')); await b.close(); process.exit(out.some(l => l.startsWith('✗')) ? 1 : 0);
})();
