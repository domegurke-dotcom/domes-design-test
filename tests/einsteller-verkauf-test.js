// v937: Einsteller bieten ihr Pferd zum Kauf an – Auslöser, Brief, Gegenangebot (echte Klicks), Kauf, Absage, Ablauf
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  const out = []; const ok = (n, c, x) => { out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : '')); };
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.stufenAn = false; spiel.tippsAus = true; VET.verbotAb = 99; pensionRegeln().offen = true; gebaeude();
    window.neuerEinsteller = (id, zufr, seit) => { const P = neuesPferd({ rasse: 'paint', geschlecht: 'Wallach', alter: 8, name: 'Gast' + id }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P);
      const e = { eid: 'e' + id, vn: 'Anna', nn: 'Test' + id, w: true, pid: P.id, stufe: 1, leistungen: {}, haltung: 'box', preis: pensionRegeln().preis[1], zufr, seit, einzug: spiel.tag, kuendigt: null, log: [], befSeen: [] };
      P.einsteller = e.eid; einstellerListe().push(e); const bx = spiel.boxen.find(x => !x.pferd); bx.pferd = P; return e; };
    window.letzterBrief = () => (spiel.post || []).filter(x => x.aktion && x.aktion.typ === 'einstVerkauf')[0]; });
  const klick = async s => { if (!(await pg.$(s))) console.log('FEHLT', s, await pg.evaluate(() => document.body.innerText.slice(0, 600).split('\n').join(' ') + ' POST ' + spiel.post.length)); await pg.click(s); await pg.waitForTimeout(200); };
  const oeffne = async () => { await pg.evaluate(() => { document.getElementById("dlg").hidden = true; offenerBrief = letzterBrief().id; zeigeHof("post"); }); await pg.waitForTimeout(250); };
  const info = () => pg.evaluate(() => { const br = letzterBrief(); return { A: br.aktion, geld: spiel.geld, e: einstellerListe().length, text: document.querySelector('#dlgInhalt, .brief-papier, .lese-innen') ? document.body.innerText : '' }; });

  // 1. Auslöser
  const T = await pg.evaluate(() => { const r = {}; const e1 = neuerEinsteller('1', 50, jzJetzt() - 5), e2 = neuerEinsteller('2', 80, jzJetzt()), e3 = neuerEinsteller('3', 80, jzJetzt() - 5);
    const r0 = Math.random; Math.random = () => 0; einstellerVerkaufBriefe(); Math.random = r0;
    r.briefe = (spiel.post || []).filter(x => x.aktion && x.aktion.typ === 'einstVerkauf').map(x => x.aktion.eid); r.e1 = !!e1.verkauf; r.e2 = !!e2.verkauf; r.e3 = !!e3.verkauf;
    // Häufigkeit: 4000 Jahreszeiten für einen zufriedenen Stammkunden (Erwartung 1/60)
    let n = 0; const sicher = spiel.post.length; for (let i = 0; i < 4000; i++) { e3.verkauf = null; const vorher = spiel.post.length; einstellerVerkaufBriefe(); if (e3.verkauf) n++; } r.haeufig = n; spiel.post.length = sicher; e3.verkauf = null; return r; });
  ok('Nur der zufriedene Stammkunde (nicht 50 % Zufriedenheit, nicht neu) bietet an', JSON.stringify(T.briefe) === '["e3"]' && !T.e1 && !T.e2, JSON.stringify(T.briefe));
  ok('Häufigkeit etwa 1/40 je Jahreszeit (= 1/10 im Jahr)', T.haeufig > 60 && T.haeufig < 150, T.haeufig + ' von 4000');

  // 2. Brief
  await pg.evaluate(() => { const L = einstellerListe(); L.forEach(e => { if (e.eid !== 'e3') { const bx = pensionBox(e); bx.pferd = null; } }); spiel.einsteller = L.filter(e => e.eid === 'e3'); spiel.post = (spiel.post || []).filter(x => !(x.aktion && x.aktion.typ === 'einstVerkauf')); const e = einstellerListe()[0]; e.verkauf = null; einstellerVerkaufBrief(e); });
  let I = await info(); const mw = await pg.evaluate(() => marktwert(pensionBox(einstellerListe()[0]).pferd));
  ok('Brief mit Wunschpreis über dem Marktwert, Mindestpreis darunter', I.A.preis >= mw * 1.03 && I.A.min < I.A.preis && I.A.min >= mw * 0.7, `Marktwert ${Math.round(mw)}, Wunsch ${I.A.preis}, Mindest ${I.A.min}`);
  await oeffne(); const sicht = await pg.evaluate(() => document.body.innerText);
  ok('Brief zeigt Knöpfe Kaufen / Gegenangebot / Ablehnen und nennt nicht den Mindestpreis', /Kaufen/.test(sicht) && /Gegenangebot/.test(sicht) && /Ablehnen/.test(sicht) && !sicht.includes(String(I.A.min)));

  // 3. Gegenangebot weit unter dem Mindestpreis → Absage
  await pg.evaluate(() => { const A = letzterBrief().aktion; A.min = A.preis * 0.97; });
  await oeffne(); await klick('[data-baktion="ev-gegen"]'); const gebote = await pg.$$eval('[data-evgeb]', l => l.map(x => +x.dataset.evgeb)); ok('Fenster bietet fünf Gegenangebote', gebote.length === 5, gebote.join(','));
  await klick('[data-evgeb]:last-child'); I = await info(); const e3zufr = await pg.evaluate(() => einstellerListe()[0].zufr);
  ok('70 % bei Mindestpreis 97 % → Absage, Angebot erlischt, Sperre gesetzt, Zufriedenheit sinkt (unfair niedrig)', /lehnt ab/.test(I.A.antwort || '') && await pg.evaluate(() => !einstellerListe()[0].verkauf && einstellerListe()[0].verkaufSperre > jzJetzt()) && e3zufr < 80, `Zufr ${e3zufr}`);
  ok('Kein neues Angebot während der Sperre', await pg.evaluate(() => { const e = einstellerListe()[0], r0 = Math.random; Math.random = () => 0; einstellerVerkaufBriefe(); Math.random = r0; return !e.verkauf; }));

  // 4. Zwei Runden: 85 % (Gegenvorschlag), dann 80 % (zu wenig → Absage)
  await pg.evaluate(() => { const e = einstellerListe()[0]; e.verkaufSperre = 0; e.verkauf = null; e.zufr = 80; einstellerVerkaufBrief(e); const A = letzterBrief().aktion; A.min = A.preis * 0.9; });
  const p0 = (await info()).A.preis; await oeffne(); await klick('[data-baktion="ev-gegen"]'); await klick('[data-evgeb]:nth-child(3)'); I = await info();
  ok('85 % → Gegenvorschlag (Preis sinkt, aber nicht unter den Mindestpreis, Brief noch offen)', !I.A.antwort && I.A.preis < p0 && I.A.preis >= I.A.min && I.A.runde === 1, `${p0} → ${I.A.preis}, Runde ${I.A.runde}`);
  await oeffne(); await klick('[data-baktion="ev-gegen"]'); await klick('[data-evgeb]:nth-child(4)'); I = await info();
  ok('Zweite Runde, wieder zu wenig → Absage', /lehnt ab/.test(I.A.antwort || ''));

  // 5. Einverstanden und Kauf
  await pg.evaluate(() => { const e = einstellerListe()[0]; e.verkaufSperre = 0; e.verkauf = null; e.zufr = 80; einstellerVerkaufBrief(e); const A = letzterBrief().aktion; A.min = A.preis * 0.9; spiel.geld = 100000; });
  const p1 = (await info()); await oeffne(); await klick('[data-baktion="ev-gegen"]'); await klick('[data-evgeb]:nth-child(2)'); I = await info();
  ok('90 % ≥ Mindestpreis → „Einverstanden“, Preis steht fest, Gegenangebot-Knopf weg', I.A.fest && I.A.preis === Math.max(50, Math.round(p1.A.preis * 0.9 / 50) * 50) && !(I.A.antwort), I.A.preis);
  await oeffne(); ok('Kein Gegenangebot-Knopf mehr', !(await pg.$('[data-baktion="ev-gegen"]'))); const geld0 = (await info()).geld; const pid = I.A.pid;
  await klick('[data-baktion="ev-ja"]'); I = await info();
  const R = await pg.evaluate(pid => { const x = alleEigenenPferde().find(y => y.p.id === pid); return { eigen: !!x, fremd: x ? fremd(x.p) : null, box: spiel.boxen.some(b => b.pferd && b.pferd.id === pid), einsteller: einstellerListe().length, brief: (spiel.post || []).some(b => /ist jetzt bei/.test(b.betreff)) }; }, pid);
  ok('Kauf: Geld abgebucht', Math.abs((geld0 - I.geld) - I.A.preis) < 1, `${geld0} → ${I.geld}`);
  ok('Pferd gehört dir (nicht mehr Einsteller-Pferd), bleibt in der Box, Einsteller ist ausgezogen, Dankesbrief', R.eigen && R.fremd === false && R.box && R.einsteller === 0 && R.brief, JSON.stringify(R));

  // 6. Ablehnen, Ablauf, zu wenig Geld
  await pg.evaluate(() => { const e = neuerEinsteller('4', 80, jzJetzt() - 5); einstellerVerkaufBrief(e); }); await oeffne(); await klick('[data-baktion="ev-nein"]'); I = await info();
  ok('Ablehnen: Einsteller bleibt, Sperre gesetzt', /Abgelehnt/.test(I.A.antwort || '') && I.e === 1 && await pg.evaluate(() => einstellerListe()[0].verkaufSperre > jzJetzt()));
  await pg.evaluate(() => { const e = einstellerListe()[0]; e.verkaufSperre = 0; e.verkauf = null; einstellerVerkaufBrief(e); spiel.tag += 10; }); await oeffne();
  ok('Nach 5 Tagen gilt das Angebot nicht mehr', /nicht mehr/.test(await pg.evaluate(() => document.body.innerText)) && !(await pg.$('[data-baktion="ev-ja"]')));
  await pg.evaluate(() => { const e = einstellerListe()[0]; e.verkaufSperre = 0; e.verkauf = null; einstellerVerkaufBrief(e); spiel.geld = -1900; }); await oeffne(); await klick('[data-baktion="ev-ja"]');
  ok('Zu wenig Geld: Hinweis, nichts gekauft', /Nicht genug Geld/.test(await pg.evaluate(() => document.getElementById('dlg').innerText)) && (await info()).e === 1 && (await info()).geld === -1900);
  // 7. AKU-Knopf: Untersuchung aus dem Brief, danach zurück zum Brief
  await pg.evaluate(() => { const e = einstellerListe()[0]; e.verkaufSperre = 0; e.verkauf = null; e.zufr = 80; spiel.tag = 1; einstellerVerkaufBrief(e); spiel.geld = 100000; });
  await oeffne(); ok('Brief hat den Knopf „Untersuchen (AKU)“', !!(await pg.$('[data-baktion="ev-aku"]')));
  const rechn0 = await pg.evaluate(() => (spiel.post || []).filter(x => /Untersuchung .* Rechnung/.test(x.betreff)).length);
  await klick('[data-baktion="ev-aku"]'); const stufen = await pg.$$eval('[data-uk]', l => l.map(x => x.dataset.uk));
  ok('Untersuchungs-Fenster zeigt die AKU-Stufen', stufen.length === 3, stufen.join(','));
  await klick('[data-uk="klein"]'); const erg = await pg.evaluate(() => document.getElementById('dlg').innerText);
  ok('Ergebnis der Untersuchung erscheint, die Rechnung kommt', /Ergebnis/.test(erg) && await pg.evaluate(r => (spiel.post || []).filter(x => /Untersuchung .* Rechnung/.test(x.betreff)).length === r + 1, rechn0));
  await klick('#dlgKnoepfe button'); ok('OK führt zurück zum Brief (Kaufen-Knopf wieder da)', !!(await pg.$('[data-baktion="ev-ja"]')) && await pg.evaluate(() => document.getElementById('dlg').hidden));
  console.log(out.join('\n')); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(out.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
