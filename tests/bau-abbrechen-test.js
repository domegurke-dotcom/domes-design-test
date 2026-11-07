// v951 (Dome 8.11.): laufenden Bau abbrechen – am Anfang 80 % zurück, je weiter der Bau, desto weniger; Umbau abbrechen gibt die Boxen frei
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const R = await pg.evaluate(() => { const zu = () => { document.getElementById('dlg').hidden = true; }, out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x !== undefined ? ' – ' + x : '')); document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.tippsAus = true; spiel.stufenAn = false; spiel.geld = 100000;
    // 1. frischer Neubau
    const g0 = spiel.geld; const gl = gebaeude().length; ok('Roundpen bauen', bauStarten('roundpen', 1)); const g = bauLetzt; zu(); const preis = g.preis, ausgabe = g0 - spiel.geld;
    ok('Baustelle hat Gesamtdauer', g.bau && g.bau.gesamt === g.bau.rest, JSON.stringify(g.bau));
    const w = bauAbbruchWert(g); ok('Frisch: 80 % zurück', w.zurueck === Math.round(preis * 0.8), JSON.stringify(w) + ' Preis ' + preis);
    const geld1 = spiel.geld; ok('Abbrechen klappt', bauAbbrechen(g)); ok('Geld kommt zurück', spiel.geld - geld1 === Math.round(preis * 0.8), spiel.geld - geld1);
    ok('Gebäude ist weg', gebaeude().length === gl && !gebaeude().some(x => x.gid === g.gid));
    // 2. halb fertig → halb so viel
    bauStarten('roundpen', 1); const h = bauLetzt; zu(); h.bau.gesamt = 10; h.bau.rest = 5; const w2 = bauAbbruchWert(h); ok('Halb fertig: 40 % zurück', w2.zurueck === Math.round(h.preis * 0.4), w2.zurueck); const g2 = spiel.geld; bauAbbrechen(h); ok('Rückzahlung halb', spiel.geld - g2 === Math.round(h.preis * 0.4));
    // 3. fast fertig → fast nichts
    bauStarten('roundpen', 1); const f = bauLetzt; zu(); f.bau.gesamt = 10; f.bau.rest = 1; ok('Fast fertig: 8 % zurück', bauAbbruchWert(f).zurueck === Math.round(f.preis * 0.08)); bauAbbrechen(f);
    // 4. Umbau abbrechen: Boxen wieder frei
    const st = gebaeude().find(x => x.typ === 'stall'); st.zustand = 100; const geldU = spiel.geld; ok('Umbau starten', umbauStarten(st)); zu();
    ok('Boxen gesperrt im Umbau', spiel.boxen.some(x => x.gesperrt)); const wU = bauAbbruchWert(st); ok('Umbau: 80 % der Umbaukosten', wU && wU.zurueck === Math.round(st.bau.kosten * 0.8), JSON.stringify(wU));
    const g3 = spiel.geld; bauAbbrechen(st); ok('Umbau abgebrochen: kein Bau mehr, Boxen frei, Stufe unverändert', !st.bau && !spiel.boxen.some(x => x.gesperrt) && st.stufe === 1, st.stufe);
    ok('Geld zurück', spiel.geld - g3 === Math.round((geldU - g3) * -0.8) || spiel.geld > g3, spiel.geld - g3);
    // 5. Oberfläche: Hof → Bauen zeigt den Knopf, Rückfrage, Abbrechen
    bauStarten('roundpen', 1); const u = bauLetzt; zu(); zeigeHof('hof'); hofBereich = 'bauen'; zeigeHof('hof');
    const knopf = document.querySelector('[data-bauab="' + u.gid + '"]'); ok('Knopf „Bau abbrechen“ in der Liste Im Bau', !!knopf, knopf && knopf.textContent);
    if (knopf) { knopf.click(); ok('Rückfrage nennt den Betrag', !document.getElementById('dlg').hidden && /zurück/.test(document.getElementById('dlg').innerText) && /20 %/.test(document.getElementById('dlg').innerText)); const bt = [...document.querySelectorAll('#dlgKnoepfe button')].find(x => /Bau abbrechen/.test(x.textContent)); bt.click(); ok('Nach der Bestätigung ist die Baustelle weg', !gebaeude().some(x => x.gid === u.gid)); }
    ok('Fertige Gebäude haben keinen Abbruch', bauAbbruchWert(gebaeude().find(x => !x.bau)) === null);
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
