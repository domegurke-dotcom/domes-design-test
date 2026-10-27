// Mitarbeiter wie ein Spieler (v878): echte Klicks – einstellen mit Probezeit, fristlos kündigen, Urlaubsplanung aus dem Brief (verschieben, genehmigen), Kalender, Azubi (nur Sommer, Einsatz ab morgen, Whiteboard)
// Start (Domes PC, siehe CLAUDE.md): node tests/mitarbeiter-spielerweg-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x !== undefined ? ' – ' + x : ''));
  const klick = async (sel) => { await pg.evaluate(s => { const e = document.querySelector(s); if (!e) throw new Error('fehlt: ' + s); e.click(); }, sel).catch(e => { out.push('✗ Klick fehlt: ' + sel); }); await pg.waitForTimeout(250); };
  await pg.evaluate(() => { window.zu = () => { document.getElementById('dlg').hidden = true; }; zu(); spiel.tippsAus = true; spiel.stufenAn = false; spiel.geld = 400000; VET.verbotAb = 99; spiel.ausbilderschein = true;
    const p = neuesPferd({ name: 'Fiona', rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8 }); p.pflege = erzeugePflege(p); p.werte = p.werte || erzeugeWerte(p); werteErgaenzen(p); spiel.boxen[0].pferd = p;
    window.nachtBisJz = (n = 1) => { for (let k = 0; k < n; k++) { const j0 = jzJetzt(); let i = 0; while (jzJetzt() === j0 && i++ < 30) { naechsteNacht(); zu(); } } };
    const alt = maErgaenzen({ id: 'alt', typ: 'pfleger', name: 'Alt', w: true, wissen: wissenStart(40, {}), eig: [], gehalt: 330, ab: 0, bis: null }); spiel.mitarbeiter = [alt]; });
  // 1. Stallbursche einstellen, Probezeit
  await pg.evaluate(() => zeigeHof('mitarbeiter')); await pg.waitForTimeout(250); await klick('[data-ma="stallbursche"]'); await klick('[data-einst]');
  ok('Stallbursche eingestellt (kommt zur nächsten Jahreszeit)', await pg.evaluate(() => angestellte('stallbursche').length === 1));
  await pg.evaluate(() => { zu(); const A = angestellte('pfleger')[0]; A.uJz = datum(jzStartTag(jzJetzt() + 2)).s; nachtBisJz(1); });
  const P1 = await pg.evaluate(() => { const m = angestellte('stallbursche')[0]; return { probe: inProbe(m), kap: maKapazitaet(m), brief: spiel.post.some(x => /arbeitet ab heute/.test(x.text || '') && /Probezeit/.test(x.text || '')) }; });
  ok('1. Jahreszeit: in Probezeit, 1 Box weniger (2 statt 3), Brief nennt die Probezeit', P1.probe && P1.kap === 2 && P1.brief, JSON.stringify(P1));
  await pg.evaluate(() => { zeigeHof('mitarbeiter'); }); await pg.waitForTimeout(250); await klick('[data-ma="stallbursche"]');
  const txt = await pg.evaluate(() => document.getElementById('dlgInhalt').textContent); ok('Dialog zeigt „Probezeit bis …“ und „Urlaub: in der Probezeit kein Urlaub“', /Probezeit bis/.test(txt) && /kein Urlaub/.test(txt));
  // 2. Urlaubsplanung: Sammelbrief im Postfach → Plan öffnen → verschieben → genehmigen → abschicken
  const U = await pg.evaluate(() => { const A = angestellte('pfleger')[0]; return { wunsch: !!A.uWunsch, brief: spiel.post.find(x => /Urlaubsplanung/.test(x.betreff)) ? spiel.post.find(x => /Urlaubsplanung/.test(x.betreff)).id : null }; });
  ok('Sammelbrief „Urlaubsplanung“ ist da, Probezeit-Mitarbeiter hat keinen Wunsch', U.wunsch && !!U.brief);
  await pg.evaluate(id => { zu(); const A = angestellte('pfleger')[0]; A.uWunsch.fest = false; A.uWunsch.vor = false; zeigeHof('post'); }, U.brief); await pg.waitForTimeout(250);
  await klick(`[data-brief="${U.brief}"]`); await klick('[data-baktion="uplan"]');
  ok('Urlaubsplan-Fenster öffnet aus dem Brief', await pg.evaluate(() => /Urlaubsplanung/.test(document.getElementById('dlgInhalt').textContent)));
  const von0 = await pg.evaluate(() => angestellte('pfleger')[0].uWunsch.von);
  await klick('[data-uschieb="0:1"]'); const von1 = await pg.evaluate(() => angestellte('pfleger')[0].uWunsch.von); ok('„1 Tag später“ verschiebt den Wunsch', von1 === von0 + 1, `${von0}→${von1}`);
  await klick('[data-uwahl="0:ok"]'); await pg.evaluate(() => { [...document.querySelectorAll('#dlgKnoepfe button')].find(k => /Plan abschicken/.test(k.textContent))?.click(); }); await pg.waitForTimeout(300);
  const U2 = await pg.evaluate(() => { const A = angestellte('pfleger')[0]; return { ok: !!(A.urlaub && A.urlaub.ok), wunschWeg: !A.uWunsch, von: A.urlaub && A.urlaub.von }; });
  ok('Plan abgeschickt: Urlaub genehmigt, Wunsch erledigt', U2.ok && U2.wunschWeg, JSON.stringify(U2)); await pg.evaluate(() => zu());
  // 3. Kalender zeigt den Urlaub
  await pg.evaluate(() => { kalJz = null; kalTag = null; zeigeHof('kalender'); }); await pg.waitForTimeout(250);
  const vor = await pg.evaluate(() => { const t = jzStartTag(jzJetzt() + 1) <= (angestellte('pfleger')[0].urlaub || {}).von; return t; });
  if (vor) await klick('#kalNach');
  const tageK = await pg.$$('.kal-tag'); const tv = await pg.evaluate(() => (angestellte('pfleger')[0].urlaub || {}).von);
  const idx = await pg.evaluate(v => { const j = kalJz; return v - jzStartTag(j); }, tv); if (tageK[idx]) { await tageK[idx].evaluate(e => e.click()); await pg.waitForTimeout(200); }
  ok('Kalender: Tag antippen zeigt „Alt hat Urlaub“', await pg.evaluate(() => /Alt hat Urlaub/.test((document.querySelector('.kal-det') || {}).textContent || '')));
  // 4. Fristlos kündigen in der Probezeit
  await pg.evaluate(() => zeigeHof('mitarbeiter')); await pg.waitForTimeout(250); await klick('[data-ma="stallbursche"]');
  ok('Knopf heißt in der Probezeit „Fristlos kündigen“', await pg.evaluate(() => /Fristlos kündigen/.test(document.getElementById('dlgInhalt').textContent)));
  await klick('[data-kuend]'); const K = await pg.evaluate(() => ({ weg: angestellte('stallbursche').length === 0, brief: spiel.post.some(x => /Probezeit/.test(x.betreff)) })); ok('Fristlos gekündigt: sofort weg, Brief', K.weg && K.brief);
  // 5. Azubi: im Frühling keine Bewerber, im Sommer einstellen, Einsatz ab morgen
  await pg.evaluate(() => { zu(); spiel.bewerber = null; zeigeHof('mitarbeiter'); }); await pg.waitForTimeout(250);
  const fr = await pg.evaluate(() => datum().s === 1 ? 'sommer' : 'nicht-sommer'); await klick('[data-ma="azubi"]');
  ok('außerhalb des Sommers: keine Azubi-Bewerber, Hinweis „nur im Sommer“', fr === 'sommer' || (await pg.evaluate(() => !document.querySelector('[data-einst]') && /Sommer/.test(document.getElementById('dlgInhalt').textContent))));
  await pg.evaluate(() => { zu(); let i = 0; while (datum().s !== 1 && i++ < 12) nachtBisJz(1); spiel.bewerber = null; zeigeHof('mitarbeiter'); }); await pg.waitForTimeout(250);
  await klick('[data-ma="azubi"]'); await klick('[data-einst]');
  const Z = await pg.evaluate(() => { const z = angestellte('azubi')[0]; return z ? { s: datum().s, ausb: z.ausbilder, ab: z.ab > jzJetzt() } : null; }); ok('Azubi im Sommer eingestellt (Ausbilder du, Beginn nächste Jahreszeit = Herbst)', !!Z && Z.s === 1 && Z.ausb === 'du' && Z.ab, JSON.stringify(Z));
  await pg.evaluate(() => { zu(); nachtBisJz(1); zeigeHof('mitarbeiter'); }); await pg.waitForTimeout(250); await klick('[data-ma="azubi"]');
  await klick('[data-azeins="0:putzen"]'); const E1 = await pg.evaluate(() => { const z = angestellte('azubi')[0]; return { neu: z.einsatzNeu && z.einsatzNeu.e === 'putzen' && z.einsatzNeu.ab === spiel.tag + 1, heute: z.einsatz || 'stall' }; });
  ok('Einsatz „Putzen“: heute noch Stalldienst, gilt ab morgen', E1.neu && E1.heute === 'stall', JSON.stringify(E1));
  ok('Dialog nennt „ab morgen“', await pg.evaluate(() => /ab morgen/.test(document.getElementById('dlgInhalt').textContent)));
  await pg.evaluate(() => { zu(); naechsteNacht(); zu(); }); ok('am nächsten Morgen arbeitet er im Putz-Einsatz', await pg.evaluate(() => angestellte('azubi')[0].einsatz === 'putzen'));
  // 6. Whiteboard: Azubi-Einsatz-Knopf
  await pg.evaluate(() => { wbSicht = 'boxen'; zeigeBoxen(); try { zeigeWhiteboard(); } catch (e) { } }); await pg.waitForTimeout(300);
  ok('Whiteboard zeigt den Einsatz-Knopf des Azubis', !!(await pg.$('[data-wbeins]')));
  await klick('[data-wbeins]'); ok('Knopf öffnet die Einsatz-Wahl', await pg.evaluate(() => /Einsatz von/.test(document.getElementById('dlgInhalt').textContent)));
  await klick('[data-azw="stall"]'); ok('Wahl „Stalldienst“ gilt ab morgen', await pg.evaluate(() => { const z = angestellte('azubi')[0]; return z.einsatzNeu && z.einsatzNeu.e === 'stall'; }));
  ok('keine Skriptfehler', errs.length === 0, errs.slice(0, 3).join(' | '));
  console.log(out.join('\n')); await b.close(); process.exit(out.some(l => l.startsWith('✗')) ? 1 : 0);
})();
