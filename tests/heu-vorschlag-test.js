// v662: Heu-Verkaufskorb (sehen, bestätigen, gleicher Preis wie beim Bauern); Preisvorschlag gilt 3 Tage
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 844, height: 390 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; const F = futterkammer(); F.lager.heu = 600; window.__g0 = spiel.geld; heuVerkaufDialog(() => { }); });
  const R = [], ok = (n, c, x) => R.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : ''));
  await pg.click('[data-hvk^="heu:100"]'); await pg.click('[data-hvk^="heu:100"]');
  let t = await pg.evaluate(() => document.getElementById('dlgInhalt').textContent.replace(/\s+/g, ' '));
  ok('Korb zeigt Menge und Erlös, noch nichts verkauft', /Verkaufskorb/.test(t) && /200 kg/.test(t) && /Erlös 24 €/.test(t) && (await pg.evaluate(() => futterkammer().lager.heu)) === 600, t.slice(-160));
  await pg.click('#dlgKnoepfe button:first-child');
  const nach = await pg.evaluate(() => ({ heu: futterkammer().lager.heu, geld: spiel.geld - window.__g0 }));
  ok('Nach „Verkaufen“: 200 kg weg, 24 € Erlös', nach.heu === 400 && Math.abs(nach.geld - 24) < 0.01, JSON.stringify(nach));
  // Preisvorschlag 3 Tage
  const v = await pg.evaluate(() => { const P = neuesPferd({ rasse: 'paint', geschlecht: 'Stute', alter: 8, name: 'Zora' }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); spiel.boxen[0].pferd = P;
    spiel.angebote = [{ id: P.id, art: 'fest', preis: 5000, wert: 6000, startTag: spiel.tag - 1, endeTag: spiel.tag + 20, vorschlag: { id: 'x', betrag: 4500, bis: spiel.tag + PREISVORSCHLAG_TAGE } }];
    angeboteNacht(); const noch = !!spiel.angebote[0].vorschlag; spiel.tag += PREISVORSCHLAG_TAGE + 1; angeboteNacht(); return { noch, danach: !!(spiel.angebote[0] && spiel.angebote[0].vorschlag), tage: PREISVORSCHLAG_TAGE }; });
  ok('Preisvorschlag gilt 3 Tage, danach verfallen', v.tage === 3 && v.noch && !v.danach, JSON.stringify(v));
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
