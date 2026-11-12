// v981/v986 (Dome 8.11.): Zuchtbuch (Symbol, Name, Marktwert) und Plaketten stehen zusammen in Steckbrief · Daten, Zeile „Ehrungen“
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const errs = []; const pg = await b.newPage({ viewport: { width: 1366, height: 900 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(500);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(250);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || ''))); document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.geld = 1e7;
    const P = neuesPferd({ rasse: 'paint', geschlecht: 'Stute', alter: 8, name: 'Doutzen' }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); werteErgaenzen(P); spiel.boxen[0].pferd = P;
    const zb = zuchtbuchVon(P); ok('Stute hat ein Zuchtbuch', !!zb);
    P.schleifen = []; P.championFohlen = 1; P.praemienFohlen = 1;
    leseAkte(P); const t = document.getElementById('leseInfo').innerHTML, txt = document.getElementById('leseInfo').textContent;
    ok('Daten: Zeile „Ehrungen“ mit Zuchtbuch und dem Namen der Klasse (keine getrennten Zeilen mehr)', /<dt>Ehrungen<\/dt>/.test(t) && txt.includes('Zuchtbuch: ' + zb.n) && !/<dt>Zuchtbuch<\/dt>/.test(t) && !/<dt>Plaketten<\/dt>/.test(t), txt.slice(0, 400));
    ok('Daten: Symbol (SVG) in der Ehrungen-Zeile', /<dt>Ehrungen<\/dt><dd>[^]*?<svg/.test(t));
    spiel.tag = 200; P.fohlenschau = { praemie: true, champion: false, gesamt: 8, schau: 'Fohlenschau', tag: 20, noten: { typ: 8, koerper: 8, schritt: 8, trab: 8, eindruck: 8 } }; P.championat = { platz: 1, von: 5, name: 'Championat Test', tag: 100 }; leseAkte(P);
    { const e = document.getElementById('leseInfo').textContent, h = document.getElementById('leseInfo').innerHTML, dd = (h.match(/<dt>Ehrungen<\/dt><dd>([^]*?)<\/dd>/) || [])[1] || '';
      ok('Ehrungen: Zuchtbuch und Prämienfohlen in einer Zeile, Zuchtbuch nicht doppelt', /Ehrungen/.test(e) && /Prämienfohlen/.test(e) && (e.match(/Zuchtbuch/g) || []).length === 1, e.slice(0, 400));
      ok('Prämienfohlen-Plakette mit „P“ als Symbol in der Zeile', /<svg[^>]*>[^]*?<text[^>]*>P<\/text>/.test(dd), dd.slice(0, 300));
      const i1 = dd.indexOf('Prämienfohlen'), i2 = dd.indexOf('Championat Test'), i3 = dd.indexOf('Zuchtbuch:');
      ok('Reihenfolge nach Erhalt: Prämienfohlen (früh), Championat (später), danach das Zuchtbuch', i1 >= 0 && i2 > i1 && i3 > i2, [i1, i2, i3].join()); }
    { spiel.admin = true; let R2 = null; for (let i = 0; i < 600 && !R2; i++) { const q = neuesPferd({ rasse: 'paint', geschlecht: 'Stute', alter: 8, name: 'Selten' }); q.pflege = erzeugePflege(q); q.werte = q.werte || erzeugeWerte(q); werteErgaenzen(q); q.id = 'r' + i + Math.random(); q.zbBestand = true; try { if (seltenheit(q).stufe > 0 && zuchtbuchVon(q)) R2 = q; } catch (e) {} }
      if (R2) { spiel.boxen[2].pferd = R2; R2.fohlenschau = { praemie: true, champion: false, gesamt: 8, schau: 'Fohlenschau', tag: 20, noten: { typ: 8, koerper: 8, schritt: 8, trab: 8, eindruck: 8 } }; const dd = ehrenZeilen(R2), a = dd.indexOf('Prämienfohlen'), s = dd.indexOf('Seltenheit'), z = dd.indexOf('Zuchtbuch:'); ok('Reihenfolge: erst Fohlen, dann Seltenheit, dann Zuchtbuch', a >= 0 && s > a && z > s, [a, s, z].join()); } else ok('Seltenes Pferd mit Zuchtbuch gefunden', false, 'keins in 600'); spiel.admin = false; }
    const Hg = neuesPferd({ rasse: 'paint', geschlecht: 'Hengst', alter: 8, name: 'Hugo' }); Hg.pflege = erzeugePflege(Hg); Hg.werte = Hg.werte || erzeugeWerte(Hg); werteErgaenzen(Hg); spiel.boxen[1].pferd = Hg; leseAkte(Hg); ok('Hengst ohne Ehrungen: keine Zeile', !/<dt>Ehrungen<\/dt>/.test(document.getElementById('leseInfo').innerHTML));
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
