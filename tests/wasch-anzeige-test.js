// v983 (Dome 8.11.): Versorgung heute zeigt Waschen/Solarium mit Grund; Bereiter-Training macht verschwitzt, Pfleger wäscht nachts (Shampoo → Glanz); Zuchtbuch-Plakette neben dem Box-Schild
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const errs = []; const pg = await b.newPage({ viewport: { width: 1366, height: 900 } }); pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(500);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(250);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x || ''))); document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.geld = 1e7; Math.random = () => 0.99;
    const P = neuesPferd({ rasse: 'paint', geschlecht: 'Stute', alter: 8, name: 'Anna' }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); werteErgaenzen(P); P.pflege.gesundheit = 100; spiel.boxen[0].pferd = P;
    const mk = (typ, id, name) => { const x0 = bewerber(typ)[0]; return { id, typ, name, w: true, wissen: { ...x0.wissen }, eig: [], gehalt: x0.gehalt, ab: jzJetzt() - 2, bis: null }; };
    spiel.mitarbeiter = [mk('bereiter', 'be1', 'Bert'), mk('stallbursche', 'sb1', 'Paul')]; gebaeude().push({ gid: 'gw', typ: 'waschplatz', stufe: 1, zustand: 100 }, { gid: 'gs', typ: 'solarium', stufe: 1, zustand: 100 }); spiel.shampoo = 5; P.leist = { solarium: true };
    const vers = () => { wbSicht = 'boxen'; wbWahl = null; zeigeWhiteboard(); const e = document.querySelector('.wb-vers'); return e ? e.textContent.replace(/\s+/g, ' ') : ''; };
    let v = vers(); ok('Ohne Pfleger: „Waschen (kein Pfleger …)“ und „Solarium (kein Pfleger …)“', /Waschen \(kein Pfleger/.test(v) && /Solarium \(kein Pfleger/.test(v), v);
    spiel.mitarbeiter.push(mk('pfleger', 'pf1', 'Jonas')); v = vers(); ok('Mit Pfleger, sauber: Waschen „nicht nötig“, Solarium „nur nach Training“', /Waschen \(nicht nötig/.test(v) && /Solarium \(nur nach Training/.test(v), v);
    mitarbeiterTag(); ok('Bereiter-Training macht das Pferd verschwitzt', P.schweiss === spiel.tag, JSON.stringify(P.trainHeute && P.trainHeute.verbraucht));
    v = vers(); ok('Nach dem Training: Waschen und Solarium „heute Abend“', /Waschen \(heute Abend\)/.test(v) && /Solarium \(heute Abend\)/.test(v), v);
    naechsteNacht(); v = vers(); ok('Nacht: Pfleger hat gewaschen, Fell glänzt (Shampoo)', P.gewaschen === spiel.tag - 1 && P.fellGlanz >= spiel.tag - 1 && /gestern Abend gewaschen, Fell glänzt/.test(v), v + ' glanz ' + P.fellGlanz);
    ok('Solarium: im Solarium gewesen', solarHeute(P).n === 0 && P.solar && P.solar.n > 0 && /Solarium \(im Solarium gewesen/.test(v), v);
    // Zuchtbuch-Plakette
    const Q = neuesPferd({ rasse: 'paint', geschlecht: 'Stute', alter: 8, name: 'Doutzen' }); Q.pflege = erzeugePflege(Q); Q.werte = Q.werte || erzeugeWerte(Q); werteErgaenzen(Q); spiel.boxen[1].pferd = Q;
    const pl = plakettenVon(Q); ok('Zuchtbuch ist eine Plakette', pl.some(x => x.zb), JSON.stringify(pl));
    ok('Zuchtbuch nicht doppelt in „Plaketten“ der Daten und nicht in der Pferdeliste', !/Zuchtbuch/.test(plakettenText(Q)) && !/Zuchtbuch/.test(praemienMarke(Q)));
    aktBox = 1; spiel.aktBox = 1; zeigeStall(); zeigeSchirm(null); const g = document.querySelector('#plaketten [data-plak]'); ok('Plakette neben dem Box-Schild antippbar', !!g && /<svg/.test(g.innerHTML));
    g.dispatchEvent(new MouseEvent('click', { bubbles: true })); const dt = document.getElementById('dlgInhalt').textContent; ok('Tipp: Erklärung mit Notengrenzen und Marktwert', !document.getElementById('dlg').hidden && /Hauptstutbuch.*ab Gesamtnote 8/.test(dt) && /Marktwert/.test(dt), dt);
    return out; });
  if (process.env.BILD) { await pg.evaluate(() => { document.getElementById('dlg').hidden = true; }); await pg.screenshot({ path: process.env.BILD }); await pg.evaluate(() => { spiel.boxen[1].pferd = null; wbSicht = 'boxen'; wbWahl = null; zeigeWhiteboard(); }); await pg.screenshot({ path: process.env.BILD.replace('.png', '2.png'), fullPage: true }); }
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
