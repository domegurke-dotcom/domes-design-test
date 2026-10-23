// v659: Zustandsprotokoll in der Aufnahme (Schnappschuss je Nacht, Fehler mit sichtbarem Text, Plausibilitätsprüfungen), Veterinäramt-Hinweis nennt den Anlass
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 844, height: 390 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : ''));
    document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; VET.verbotAb = 99;
    const P = neuesPferd({ rasse: 'paint', geschlecht: 'Stute', alter: 8, name: 'Zora' }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); spiel.boxen[0].pferd = P; aktBox = 0;
    aufnahmeStart(); const A = AUF.laufend;
    zeigeSchirm(null); zeigeStall(); naechsteNacht();
    const Z = A.eintraege.filter(e => e.a === 'Zustand'); ok('Nach der Nacht steht ein Zustand in der Aufnahme', Z.length === 1);
    const z = Z[0] && Z[0].z; ok('Zustand: Pferd mit Box, Gesundheit, Wohlbefinden, Ort', !!z && z.pferde.some(o => o.n === 'Zora' && o.b === 1 && o.ort === 'box' && o.ges >= 0 && o.wohl >= 0), JSON.stringify(z && z.pferde[0]));
    ok('Zustand: Geld, Lager, Mitarbeiter-Liste, Weiden, Post', !!z && typeof z.geld === 'number' && !!z.lager && Array.isArray(z.ma) && Array.isArray(z.weiden) && typeof z.post === 'number');
    // Plausibilitätsprüfung: Sandpaddock überfüllt
    gebaeude().push({ gid: 'gpdT', typ: 'sandpaddock', stufe: 1, zustand: 100 });
    const g = paddocks()[0]; for (let i = 1; i <= 3; i++) { const q = neuesPferd({ rasse: 'paint', geschlecht: 'Wallach', alter: 8, name: 'W' + i }); q.pflege = erzeugePflege(q); q.werte = q.werte || erzeugeWerte(q); spiel.boxen[i].pferd = q; q.paddock = { seit: spiel.tag, pid: g.gid }; }
    zustandNacht(); ok('WARNUNG bei überfülltem Sandpaddock', A.eintraege.some(e => e.a === 'WARNUNG' && /überfüllt/.test(e.x)));
    // Mitarbeiter krank, arbeitet trotzdem: Warnung
    // Fehler melden: Kontext mit sichtbarem Text und Zustand
    const k = aufFehlerKontext(); ok('Fehler-Kontext: sichtbarer Text, Pferd, Box, Zustand', 'sicht' in k && k.pferd === 'Zora' && k.box === 1 && !!k.z && !!k.z.pferde);
    aufnahmeEnde('t'); const Lst = AUF.liste[AUF.liste.length - 1]; ok('Aufnahme speicherbar und Zustandseinträge bleiben', Lst.eintraege.some(e => e.a === 'Zustand'));
    // Veterinäramt: Brief nennt Anlass und sagt „keine Strafe“
    const V = vetDaten(); delete V.meldung; P.pflege.gesundheit = 10; spiel.boxen[0].mistig = true; spiel.boxen[0].mistStufe = 4;
    const n0 = (spiel.post || []).length; vetMeldung('anonym'); const br = (spiel.post || [])[0];
    ok('Hinweis-Brief nennt den Anlass', !!br && /betrifft/.test(br.text) && /Zora/.test(br.text), br && br.text.slice(0, 160));
    ok('Hinweis-Brief sagt: nur eine Ankündigung, keine Strafe', !!br && /keine Strafe/.test(br.text));
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
