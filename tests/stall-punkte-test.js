// Stall des Jahres (v888, Dome 27.10.): Turniererfolge zählen nur, wenn sie zum Stall passen; Fohlenschau zählt beim Zuchtstall
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message)); const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x !== undefined ? ' – ' + x : ''));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.waitForTimeout(120); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(120);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(350);
  const R = await pg.evaluate(() => {
    document.getElementById('dlg').hidden = true; spiel.stufenAn = false;
    const g = d => stallGruppe(d);
    const grp = { renn: g('galopprennen'), pass: g('passrennen'), toelt: g('toelt'), dress: g('dressur'), spring: g('springen'), rein: g('reining'), dist: g('distanz') };
    const z = jahr => { const h = aktivHid(); spiel.chronik = spiel.chronik || {}; const Z = spiel.chronik[h] = spiel.chronik[h] || {}; const k = datum().j + '-0'; Z[k] = Z[k] || { k: {} }; return Z[k].k; };
    const K = z(); Object.keys(K).forEach(x => delete K[x]);
    K['Turniersieg'] = 2; K['Stallpunkt Sieg: renn'] = 2;           // 2 Rennsiege
    K['Stallpunkt Sieg: schau'] = 1; K['Stallpunkt Platz: gang'] = 1;  // 1 Fohlenchampion, 1 Tölt-Platz
    const pt = art => { spiel.hof.art = art; return stallPunkte().pkt; };
    const erg = { renn: pt('renn'), gang: pt('gang'), western: pt('western'), ausbildung: pt('ausbildung'), zucht: pt('zucht'), pension: pt('pension') };
    return { grp, erg };
  });
  ok('Disziplin-Gruppen (Rennen, Passrennen=Gang, Tölt=Gang, Englisch, Western, Distanz)', R.grp.renn === 'renn' && R.grp.pass === 'gang' && R.grp.toelt === 'gang' && R.grp.dress === 'eng' && R.grp.spring === 'eng' && R.grp.rein === 'west' && R.grp.dist === 'dist', JSON.stringify(R.grp));
  ok('Rennstall: 2 Rennsiege = 6 Punkte', R.erg.renn === 6, R.erg.renn);
  ok('Gangpferdestall: nur der Tölt-Platz = 1 Punkt', R.erg.gang === 1, R.erg.gang);
  ok('Westernstall: nichts passt = 0', R.erg.western === 0, R.erg.western);
  ok('Ausbildungsstall: Rennen und Tölt zählen nicht = 0', R.erg.ausbildung === 0, R.erg.ausbildung);
  ok('Zuchtstall: Fohlenchampion zählt = 3', R.erg.zucht === 3, R.erg.zucht);
  ok('Pensionsstall: alle Turniere (2 Siege = 6)', R.erg.pension === 6, R.erg.pension);
  ok('keine Skriptfehler', errs.length === 0, errs.slice(0, 3).join(' | '));
  console.log(out.join('\n')); await b.close(); process.exit(out.some(l => l.startsWith('✗')) ? 1 : 0);
})();
