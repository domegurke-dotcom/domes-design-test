// v663: Stute mit zu jungem (noch liegendem) Fohlen hat automatisch Boxenruhe, danach wieder nicht
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 844, height: 390 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : ''));
    document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; VET.verbotAb = 99;
    const mk = (name, g) => { const P = neuesPferd({ rasse: 'paint', geschlecht: g, alter: 8, name }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); return P; };
    const M = mk('Mama', 'Stute'), V = mk('Papa', 'Hengst'); const box = spiel.boxen[0]; box.pferd = M;
    const f = geburt(box, V, true); f.gebTag = spiel.tag; box.fohlen = f; delete M.boxenruhe; fohlenBoxenruhe(box);
    ok('Stute mit liegendem Fohlen hat Boxenruhe', M.boxenruhe === true && M.boxenruheFohlen === true);
    const n0 = wohlbefinden(M); naechsteNacht(); ok('Boxenruhe bleibt, solange das Fohlen liegt (und endet nicht von selbst)', fohlenNochLiegend(box) ? M.boxenruhe === true : true);
    let n = 0; while (n++ < 6 && fohlenNochLiegend(box)) naechsteNacht(); naechsteNacht();
    ok('Läuft das Fohlen, endet die Boxenruhe', !fohlenNochLiegend(box) && !M.boxenruhe && !M.boxenruheFohlen, 'Nächte: ' + n);
    // Turniernennung: Boxenruhe (nur wegen Fohlen) sperrt nicht, wenn gesund
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
