// v763–v768 (Domes Aufnahme 24.10., Etappe 1+2): Fressdauer, Pinnwand größer, Weide im Ort-Plan anklickbar, Büro = Labor, Tutorials-Liste, Schalter „Spielumfang“ weg
// Aufruf: NODE_PATH=/opt/node22/lib/node_modules node tests/orte-test.js [BxH] [Ordner für Bilder]
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
const [bw, bh] = (process.argv[2] || '1366x768').split('x').map(Number), ordner = process.argv[3];
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: bw, height: bh }, hasTouch: bw < 900 }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Plan'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  let r2; const out = []; const ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x != null && !c ? ' – ' + x : ''));
  const bild = async n => { if (ordner) { fs.mkdirSync(ordner, { recursive: true }); await pg.screenshot({ path: path.join(ordner, `orte-${bw}x${bh}-${n}.png`) }); } };
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.geld = 90000; });
  await pg.evaluate(() => { const mk = (n, r, i) => { const P = neuesPferd({ rasse: r, geschlecht: 'Stute', alter: 8, name: n }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); spiel.boxen[i].pferd = P; spiel.boxen[i].krippeVoll = true; return P; }; mk('Anna', 'haflinger', 0); });
  ok('Fressen: 5 Sekunden in der Fressposition', await pg.evaluate(() => FRESS.box === 5000));
  // Ort-Plan: Weide
  const pferd = await pg.evaluate(() => { const i = spiel.boxen.findIndex(x => x.pferd); return i; });
  ok('ein Pferd im Stall zum Testen', pferd >= 0);
  if (pferd >= 0) {
    await pg.evaluate(i => { spiel.aktBox = i; aktBox = i; aktenModus = 'pflege'; aktenReiter = 'platz'; ortModus = null; weiden().forEach(w => { if (!w.wiese) w.gesperrt = { bis: spiel.tag + 3 }; }); zeigeAkte(); }, pferd);
    await pg.waitForTimeout(300);
    ok('Weide-Pfeil im Plan ist anklickbar, auch wenn alle Weiden ruhen', await pg.locator('.pl-pfeil[data-ort="weide"]').count() === 1);
    await pg.locator('.pl-pfeil[data-ort="weide"]').dispatchEvent('click'); await pg.waitForTimeout(300);
    ok('… und sagt, warum es nicht geht', await pg.evaluate(() => /gesperrt|Weide/.test(document.getElementById('dlgInhalt').textContent) && !document.getElementById('dlg').hidden), await pg.evaluate(() => document.getElementById('dlgInhalt').textContent.slice(0, 80)));
    await pg.evaluate(() => { document.getElementById('dlg').hidden = true; });
    // Büro
    const buero = await pg.evaluate(() => !!document.querySelector('#planSvg [data-ort="labor"], .plan-scroll.ort [data-ort="labor"]'));
    ok('Büro im Plan öffnet das Labor (data-ort="labor")', buero);
    await pg.evaluate(() => { const e = document.querySelector('.plan-scroll.ort [data-ort="labor"]'); if (e) e.dispatchEvent(new MouseEvent('click', { bubbles: true })); }); await pg.waitForTimeout(300);
    ok('… Fenster „Büro“ mit den Gentests', await pg.evaluate(() => ortModus === 'labor' && /Büro/.test(document.body.textContent)));
    await bild('buero');
  }
  // Einstellungen
  await pg.evaluate(() => { zeigeHof('einst'); }); await pg.waitForTimeout(300);
  ok('Schalter „Spielumfang je Stufe“ ist weg', await pg.locator('#hfStufenAn').count() === 0);
  ok('Knopf heißt „Tutorials“', await pg.evaluate(() => /Tutorials/.test(document.getElementById('hfTutorial').textContent) && !/wiederholen/.test(document.getElementById('hfTutorial').textContent)));
  await pg.click('#hfTutorial'); await pg.waitForTimeout(200);
  ok('Tutorials-Fenster hat „Alle Tutorials ansehen“', await pg.evaluate(() => /Alle Tutorials ansehen/.test(document.getElementById('dlgKnoepfe').textContent)));
  await pg.click('#dlgKnoepfe button:has-text("Alle Tutorials ansehen")'); await pg.waitForTimeout(200);
  const anz = await pg.evaluate(() => [document.querySelectorAll('#dlgInhalt [data-tset]').length, TUT_SETS.anf().length + TUT_SETS.fort().length + TUT_SETS.exp().length]);
  ok('Liste zeigt alle Kapitel aller Tutorials', anz[0] === anz[1] && anz[0] > 20, JSON.stringify(anz));
  await bild('tutorials');
  // einzelnes Kapitel → zurück zur Liste
  await pg.click('#dlgInhalt [data-tset="fort"][data-tkap="1"]'); await pg.waitForTimeout(1500);
  const r = await pg.evaluate(() => ({ e: !!(spiel.tutorial && spiel.tutorial.einzel), k: spiel.tutorial && spiel.tutorial.kap, s: spiel.tutorial && spiel.tutorial.set }));
  ok('Einzelkapitel startet (Fortgeschritten, Kapitel 2)', r.e && r.k === 1 && r.s === 'fort', JSON.stringify(r));
  await pg.evaluate(() => tutKapitelFertig(true)); await pg.waitForTimeout(2000);
  const liste = await pg.evaluate(() => /Alle Tutorials/.test(document.getElementById('dlgInhalt').textContent) && !document.getElementById('dlg').hidden);
  ok('nach dem Kapitel zurück zur Tutorial-Liste (ohne Abschlussfrage)', liste);
  ok('Tutorial-Band ist weg, echtes Spiel läuft', await pg.evaluate(() => !spiel.tutorial && !document.getElementById('tutBand')));

  // ===== Etappe 2 (v764): Orte, Umstellen mit Rückfrage, Whiteboard-Abgleich =====
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; weiden().forEach(w => { delete w.gesperrt; }); spiel.spieler.stufe = 'exp'; spiel.boxen.forEach(b => { if (b.pferd) b.pferd.reheOk = spiel.tag; });
    const B = x => Object.assign({ pferd: null, krippeVoll: false, mistig: false, mistStufe: 0 }, x); spiel.boxen.push(B({ paddock: true }), B({ abfohl: true }), B({ quar: true }), B({ offen: true }));
    const i = spiel.boxen.findIndex(x => x.pferd); const b = spiel.boxen[i]; b.einstreu = 'spaene'; b.krippeVoll = true; b.kraftVoll = true; b.wasserTag = spiel.tag; });
  const orte = async () => { await pg.evaluate(() => { document.getElementById('dlg').hidden = true; zeigeSchirm(null); const i = spiel.boxen.findIndex(x => x.pferd && x.pferd.name === 'Anna'); aktBox = i; spiel.aktBox = i; aktenModus = 'pflege'; aktenReiter = 'platz'; ortModus = null; zeigeAkte(); }); await pg.waitForTimeout(200); };
  const box = () => pg.evaluate(() => { const b = spiel.boxen.find(x => x.pferd && x.pferd.name === 'Anna'); return { i: spiel.boxen.indexOf(b), art: b.offen ? 'offen' : b.quar ? 'quar' : b.abfohl ? 'abfohl' : b.paddock ? 'paddock' : 'stall', e: b.einstreu, k: !!b.krippeVoll, kr: !!b.kraftVoll, w: b.wasserTag === spiel.tag }; });
  const klick = sel => pg.evaluate(sel => { const e = document.querySelector(sel); if (!e) return false; e.dispatchEvent(new MouseEvent('click', { bubbles: true })); return true; }, sel);
  await orte();
  ok('Reiter heißt „Orte“', await pg.evaluate(() => /^Orte$/.test((document.querySelector('[data-r="platz"]') || {}).textContent || '')));
  ok('keine Kacheln „Box wechseln“, „Training“, „Koppel“, „Büro“ unter dem Plan', await pg.evaluate(() => !document.querySelector('.kachel[data-ort="box"], .kachel[data-ort="training"], .kachel[data-ort="koppel"], .kachel[data-ort="labor"]')));
  await bild('orte');
  ok('Reitplatz im Plan → Zurück führt zu „Orte“', await (async () => { await klick('.plan-scroll.ort [data-ort="tr-reitplatz"]'); await pg.waitForTimeout(150); const a = await pg.evaluate(() => ortModus); await klick('#ortZurueck'); await pg.waitForTimeout(150); return a === 'tr-reitplatz' && await pg.evaluate(() => ortModus === null); })());
  const e0 = await box();
  const um = async (sel, art, name) => { await orte(); const da = await klick(sel); await pg.waitForTimeout(150);
    const frage = await pg.evaluate(() => /umstellen\?/.test(document.getElementById('dlgInhalt').textContent) && !document.getElementById('dlg').hidden);
    if (frage) { await pg.click('#dlgKnoepfe button:has-text("Umstellen")'); await pg.waitForTimeout(150); }
    const b = await box(); ok(`${name}: Rückfrage, dann ${art}, Einstreu/Futter/Wasser dabei`, da && frage && b.art === art && b.e === e0.e && b.k && b.kr && b.w, JSON.stringify({ da, frage, b })); };
  await um('[data-ort="zuPaddock"]', 'paddock', 'Stall → Paddockbox');
  await um('[data-ort="zuAbfohl"]', 'abfohl', 'Paddockbox → Abfohlbox');
  await um('[data-ort="zuQuar"]', 'quar', 'Abfohlbox → Quarantäne');
  await orte(); await klick('.plan-scroll.ort [data-ort="zuStall"]'); await pg.waitForTimeout(150);
  ok('Quarantäne: raus erst nach Ablauf', await pg.evaluate(() => /Quarantäne/.test(document.getElementById('dlgInhalt').textContent) && !/umstellen\?/.test(document.getElementById('dlgInhalt').textContent)));
  await pg.evaluate(() => { spiel.boxen.find(x => x.pferd && x.pferd.name === 'Anna').pferd.quarantaene = -999; });
  await um('.plan-scroll.ort [data-ort="zuStall"]', 'stall', 'Quarantäne → Stallbox (Plan)');
  await um('[data-ort="offenstall"]', 'offen', 'Stallbox → Offenstall');
  await um('.plan-scroll.ort [data-ort="zuStall"]', 'stall', 'Offenstall → Stallbox (Plan)');
  await um('[data-ort="zuQuar"]', 'quar', 'Stallbox → Quarantäne');
  await pg.evaluate(() => { spiel.boxen.find(x => x.pferd && x.pferd.name === 'Anna').pferd.quarantaene = -999; });
  await um('[data-ort="zuPaddock"]', 'paddock', 'Quarantäne → Paddockbox');
  await um('.plan-scroll.ort [data-ort="zuStall"]', 'stall', 'Paddockbox → Stallbox (Plan)');
  // Box wechseln (Liste): Einstreu zieht mit
  await pg.evaluate(() => { const b = spiel.boxen.find(x => x.pferd && x.pferd.name === 'Anna'); const z = spiel.boxen.findIndex(x => x !== b && boxFrei(x) && !x.paddock && !x.quar && !x.abfohl); aktenModus = 'pflege'; aktenReiter = 'platz'; ortModus = 'box'; zeigeAkte(); const k = document.querySelector(`[data-zielbox="${z}"]`); k.click(); });
  { const b = await box(); ok('Box wechseln (Liste): Einstreu und Futter ziehen mit', b.e === e0.e && b.k && b.kr, JSON.stringify(b)); }
  // Whiteboard-Abgleich
  const pd = await pg.evaluate(() => { ['gpa', 'gpb'].forEach(gid => gebaeude().push({ gid, typ: 'sandpaddock', stufe: 1, zustand: 100 })); spiel.anlage.paddock = true; planAutoSetzen(); return ['gpa', 'gpb'].map(g => !!hofPlan().pos[g]); });
  ok('zwei Sandpaddocks im Plan', pd[0] && pd[1], JSON.stringify(pd));
  await pg.evaluate(() => { const p = spiel.boxen.find(x => x.pferd && x.pferd.name === 'Anna').pferd; wbIstSetzen(p, 'gpa'); });
  await orte(); await klick('.plan-scroll.ort [data-pdgid="gpb"]'); await pg.waitForTimeout(200);
  ok('Sandpaddock B angetippt, Plan sagt A → kommt auf A', await pg.evaluate(() => { const p = spiel.boxen.find(x => x.pferd && x.pferd.name === 'Anna').pferd; return !!(p.paddock && p.paddock.pid === 'gpa'); }));
  await pg.evaluate(() => { const b = spiel.boxen.find(x => x.pferd && x.pferd.name === 'Anna'); delete b.pferd.paddock; zurueckInBox(b); });
  await orte(); await klick('.pl-pfeil[data-ort="weide"]'); await pg.waitForTimeout(200);
  ok('Weide angetippt, Plan sagt Sandpaddock → Rückfrage', await pg.evaluate(() => /Laut Plan ist Anna für den „/.test(document.getElementById('dlgInhalt').textContent)), await pg.evaluate(() => document.getElementById('dlgInhalt').textContent.slice(0, 120)));
  await bild('frage');
  await pg.click('#dlgKnoepfe button:has-text("Ja")'); await pg.waitForTimeout(200);
  ok('… Ja → Weideauswahl', await pg.evaluate(() => /Auf welche Weide/.test(document.getElementById('dlgInhalt').textContent)));
  await pg.click('[data-wziel]'); await pg.waitForTimeout(200);
  r2 = await pg.evaluate(() => { const p = spiel.boxen.find(x => x.pferd && x.pferd.name === 'Anna').pferd, pl = wbPlanJetzt(p); return { w: !!p.weide, pd: pl && pl.pd, z: pl && pl.ziel, wid: p.weide && p.weide.wid }; });
  ok('… Pferd auf der Weide, Whiteboard zeigt jetzt diese Weide', r2.w && r2.pd === false && r2.z === r2.wid, JSON.stringify(r2));
  await pg.evaluate(() => { const b = spiel.boxen.find(x => x.pferd && x.pferd.name === 'Anna'); vonWeideHolen(b); });
  await orte(); await klick('.plan-scroll.ort [data-pdgid="gpb"]'); await pg.waitForTimeout(200);
  ok('Sandpaddock angetippt, Plan sagt Weide → Rückfrage', await pg.evaluate(() => /lieber auf den Sandpaddock/.test(document.getElementById('dlgInhalt').textContent)));
  await pg.click('#dlgKnoepfe button:has-text("Ja")'); await pg.waitForTimeout(200);
  ok('… Ja → Sandpaddock-Auswahl', await pg.evaluate(() => /In welchen Sandpaddock/.test(document.getElementById('dlgInhalt').textContent)));
  await pg.click('[data-pziel="gpb"]'); await pg.waitForTimeout(200);
  r2 = await pg.evaluate(() => { const p = spiel.boxen.find(x => x.pferd && x.pferd.name === 'Anna').pferd, pl = wbPlanJetzt(p); return { pd: p.paddock && p.paddock.pid, plpd: pl && pl.pd, z: pl && pl.ziel }; });
  ok('… Pferd auf Sandpaddock B, Whiteboard zeigt Sandpaddock B', r2.pd === 'gpb' && r2.plpd === true && r2.z === 'gpb', JSON.stringify(r2));
  await pg.evaluate(() => { const b = spiel.boxen.find(x => x.pferd && x.pferd.name === 'Anna'); delete b.pferd.paddock; zurueckInBox(b); });
  await orte(); await klick('.plan-scroll.ort [data-pdgid="gpa"]'); await pg.waitForTimeout(200);
  ok('passt zum Plan → keine Rückfrage, Pferd kommt auf den geplanten Sandpaddock B', await pg.evaluate(() => { const p = spiel.boxen.find(x => x.pferd && x.pferd.name === 'Anna').pferd; return !!(p.paddock && p.paddock.pid === 'gpb'); }));

  // ===== v765: Titel „Stall“ im Whiteboard → alte Stallansicht (Pferde ziehen), zurück zum Whiteboard =====
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; const b = spiel.boxen.find(x => x.pferd && x.pferd.name === 'Anna'); if (b.pferd.paddock) { delete b.pferd.paddock; zurueckInBox(b); } stallAlt = false; wbSicht = 'uebersicht'; zeigeBoxen(); }); await pg.waitForTimeout(200);
  ok('Stall öffnet das Whiteboard', await pg.evaluate(() => /Whiteboard/.test(document.querySelector('#nebenSchirm .hf-kopf').textContent)));
  await pg.click('#stallTitel'); await pg.waitForTimeout(200);
  ok('Titel „Stall“ antippen → Stallansicht mit Boxen', await pg.evaluate(() => !!document.querySelector('#nebenSchirm .boxen-liste [data-zubox]') && !!document.getElementById('wbUmschalt')));
  await bild('stallansicht');
  { const z = await pg.evaluate(() => { const vi = spiel.boxen.findIndex(b => b.pferd && b.pferd.name === 'Anna'), von = spiel.boxen[vi]; const zi = spiel.boxen.findIndex(b => b !== von && boxZielOk(von, b) && boxGruppe(b) === boxGruppe(von)); boxenGruppe = boxGruppe(von); zeigeBoxen(); return [vi, zi]; });
    await pg.evaluate(i => document.querySelector(`.boxen-liste [data-zubox="${i}"]`).scrollIntoView({ block: 'center' }), z[0]); await pg.waitForTimeout(200);
    const a = await pg.locator(`.boxen-liste [data-zubox="${z[0]}"]`).boundingBox(), c = await pg.locator(`.boxen-liste [data-zubox="${z[1]}"]`).boundingBox();
    await pg.mouse.move(a.x + a.width / 2, a.y + a.height / 2); await pg.mouse.down(); await pg.waitForTimeout(300); await pg.mouse.move(c.x + c.width / 2, c.y + c.height / 2, { steps: 8 }); await pg.waitForTimeout(100); await pg.mouse.up(); await pg.waitForTimeout(300);
    const nb = await pg.evaluate(() => spiel.boxen.findIndex(b => b.pferd && b.pferd.name === 'Anna'));
    ok('Pferd per Ziehen in eine andere Box umgestellt', nb === z[1], JSON.stringify({ z, nb }));
    await pg.click('#stallTitel'); await pg.waitForTimeout(200);
    ok('Titel nochmal antippen → zurück zum Whiteboard', await pg.evaluate(() => /Whiteboard/.test(document.querySelector('#nebenSchirm .hf-kopf').textContent) && !document.querySelector('#nebenSchirm .boxen-liste')));
    ok('Whiteboard kennt die neue Box', await pg.evaluate(i => /Anna/.test(whiteboardHTML()) && spiel.boxen[i].pferd.name === 'Anna', nb)); }

  // ===== v766: Stall – auch Pferde draußen lassen sich umstellen; Wünsche nur mit passendem Mitarbeiter =====
  await pg.evaluate(() => { stallAlt = true; const b = spiel.boxen.find(x => x.pferd && x.pferd.name === 'Anna'); const g = paddocks()[0]; b.pferd.paddock = { seit: spiel.tag, pid: g.gid }; rausAusBox(b); boxenGruppe = boxGruppe(b); zeigeBoxen(); });
  { const z = await pg.evaluate(() => { const von = spiel.boxen.find(x => x.pferd && x.pferd.name === 'Anna'); return [spiel.boxen.indexOf(von), spiel.boxen.findIndex(b => b !== von && boxZielOk(von, b) && boxGruppe(b) === boxGruppe(von))]; });
    ok('Pferd auf dem Sandpaddock ist ziehbar', await pg.evaluate(i => boxZiehbar(spiel.boxen[i]) && boxZiehSperre(spiel.boxen[i]) === '', z[0]) && z[1] >= 0, JSON.stringify(z));
    await pg.evaluate(i => document.querySelector(`.boxen-liste [data-zubox="${i}"]`).scrollIntoView({ block: 'center' }), z[0]); await pg.waitForTimeout(200);
    const a = await pg.locator(`.boxen-liste [data-zubox="${z[0]}"]`).boundingBox(), c = await pg.locator(`.boxen-liste [data-zubox="${z[1]}"]`).boundingBox();
    await pg.mouse.move(a.x + a.width / 2, a.y + a.height / 2); await pg.mouse.down(); await pg.waitForTimeout(300); await pg.mouse.move(c.x + c.width / 2, c.y + c.height / 2, { steps: 8 }); await pg.waitForTimeout(100); await pg.mouse.up(); await pg.waitForTimeout(300);
    const r = await pg.evaluate(() => { const i = spiel.boxen.findIndex(b => b.pferd && b.pferd.name === 'Anna'); return { i, pd: !!spiel.boxen[i].pferd.paddock }; });
    ok('… in eine andere Box gezogen, bleibt draußen auf dem Sandpaddock', r.i === z[1] && r.pd, JSON.stringify({ z, r }));
    await pg.evaluate(() => { const b = spiel.boxen.find(x => x.pferd && x.pferd.name === 'Anna'); delete b.pferd.paddock; zurueckInBox(b); }); }

  // ===== v768 (Etappe 3): Kreis-Menü im Hofplan, Reiterköpfe auf den Plätzen, roter Rahmen im Whiteboard =====
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; zeigeSchirm(null); hofBereich = 'plan'; planWahl = null; planVorschau = null; planLand = null; zeigeHof('hof'); }); await pg.waitForTimeout(300);
  const gid = await pg.evaluate(() => planItems().find(it => it.typ === 'reitplatz').id);
  ok('Hofplan: ohne Auswahl kein Kreis-Menü', await pg.locator('.plan-radial').count() === 0);
  await pg.evaluate(id => { planWahl = id; planNeu(); }, gid); await pg.waitForTimeout(200);
  const rm = await pg.evaluate(() => ({ n: document.querySelectorAll('.plan-radial [data-ri]').length, mitte: !!document.querySelector('.plan-radial .mitte'), leiste: getComputedStyle(document.querySelector('.plan-leiste.radial .plan-kn') || document.body).display, txt: [...document.querySelectorAll('.plan-radial .rl')].map(x => x.textContent).join('|') }));
  ok('Gebäude angetippt: Kreis mit ✕ und Symbolen ringsum', rm.mitte && rm.n >= 4, JSON.stringify(rm));
  ok('… die Leiste mit den Knöpfen unter dem Plan ist weg', rm.leiste === 'none', rm.leiste);
  await bild('radial');
  const pos0 = await pg.evaluate(id => JSON.stringify(hofPlan().pos[id]), gid);
  await pg.evaluate(() => { const b = [...document.querySelectorAll('.plan-radial [data-ri]')].find(x => /Drehen/.test(x.getAttribute('aria-label'))); if (b) b.click(); }); await pg.waitForTimeout(150);
  ok('Symbol „Drehen“ dreht wirklich', await pg.evaluate(([id, p0]) => JSON.stringify(hofPlan().pos[id]) !== p0, [gid, pos0]));
  await pg.evaluate(() => { const b = [...document.querySelectorAll('.plan-radial [data-ri]')].find(x => /Namen/.test(x.getAttribute('aria-label'))); if (b) b.click(); }); await pg.waitForTimeout(200);
  ok('Symbol „Namen“ öffnet das Namensfenster', await pg.evaluate(() => !document.getElementById('dlg').hidden && /Name/i.test(document.getElementById('dlgInhalt').textContent)));
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; }); 
  await pg.evaluate(() => { const b = [...document.querySelectorAll('.plan-radial [data-ri]')].find(x => /Abreißen/.test(x.getAttribute('aria-label'))); if (b) b.click(); }); await pg.waitForTimeout(200);
  ok('Symbol „Abreißen“ öffnet die Sicherheitsfrage', await pg.evaluate(() => !document.getElementById('dlg').hidden && /abreiß|Abriss/i.test(document.getElementById('dlgInhalt').textContent)));
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; });
  await pg.click('.plan-radial .mitte'); await pg.waitForTimeout(150);
  ok('✕ in der Mitte bricht ab, die Symbole verschwinden', await pg.evaluate(() => planWahl === null && !document.querySelector('.plan-radial')));
  // Reiterköpfe
  await pg.evaluate(() => { const mk = (n, i) => { const P = neuesPferd({ rasse: 'haflinger', geschlecht: 'Wallach', alter: 8, name: n }); P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); P.einsteller = 'ex' + i; const b = spiel.boxen.find(x => !x.pferd && boxFrei(x) && !x.paddock && !x.quar && !x.abfohl && !x.offen); b.pferd = P; einstellerListe().push({ eid: 'ex' + i, vn: ['Anja', 'Bert'][i], nn: 'X' }); return P; }; mk('Rex', 0); mk('Rio', 1);
    spiel.pensionHeute = { tag: spiel.tag, reiter: [{ eid: 'ex0', ort: 'reitplatz' }, { eid: 'ex1', ort: 'reitplatz' }] }; planNeu(); });
  await pg.waitForTimeout(300);
  ok('Reitplatz im Plan zeigt 2 Pferdeköpfe für 2 Reiter', await pg.evaluate(() => document.querySelectorAll('#planBox .plan-kopf').length === 2), await pg.evaluate(() => document.querySelectorAll('#planBox .plan-kopf').length));
  await bild('reiterkoepfe');
  ok('eigenes Pferd, das heute auf dem Reitplatz trainiert hat, zeigt auch einen Kopf', await pg.evaluate(() => { const p = spiel.boxen.find(x => x.pferd && x.pferd.name === 'Anna').pferd; p.trainHeute = { tag: spiel.tag, liste: [], verbraucht: 0, orte: ['reitplatz'] }; planNeu(); return document.querySelectorAll('#planBox .plan-kopf').length === 3; }));
  await pg.evaluate(() => { spiel.pensionHeute = null; spiel.boxen.forEach(b => { if (b.pferd) delete b.pferd.trainHeute; }); spiel.boxen.forEach(b => { if (b.pferd && b.pferd.einsteller && /^ex\d$/.test(b.pferd.einsteller)) b.pferd = null; }); spiel.einsteller = (spiel.einsteller || []).filter(e => !/^ex\d$/.test(e.eid)); planNeu(); });
  // Whiteboard: roter Rahmen
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; spiel.boxen.forEach(b => { if (b.pferd) b.pferd.reheOk = spiel.tag; });
    const p = spiel.boxen.find(x => x.pferd && x.pferd.name === 'Anna').pferd; const g = paddocks()[0]; wbIstSetzen(p, g.gid); const w = weiden().find(x => !x.wiese); p.weide = { seit: spiel.tag, wid: w.wid }; stallAlt = false; wbSicht = 'weiden'; zeigeWhiteboard(); });
  await pg.waitForTimeout(200);
  ok('Whiteboard: Sandpaddock geplant, Pferd steht auf der Weide → roter gepunkteter Rahmen', await pg.evaluate(() => !![...document.querySelectorAll('#nebenSchirm .wb-chip.rehe')].find(x => /Anna/.test(x.textContent)) || /Anna soll laut Plan/.test(document.querySelector('#nebenSchirm').innerHTML)));
  await bild('rahmen');
  await pg.evaluate(() => { const b = spiel.boxen.find(x => x.pferd && x.pferd.name === 'Anna'); delete b.pferd.weide; zeigeWhiteboard(); });
  ok('… steht es wieder richtig (nicht draußen), verschwindet der Rahmen', await pg.evaluate(() => !/Anna soll laut Plan/.test(document.querySelector('#nebenSchirm').innerHTML)));
  // Pinnwand
  await pg.evaluate(() => { document.getElementById('dlg').hidden = true; const bx = spiel.boxen.find(x => x.pferd); const p = bx.pferd; p.schleifen = Array.from({ length: 12 }, (_, i) => ({ st: 1 + i % 3, pl: 1 + i % 6, c: false, von: 8, platz: 1 + i % 6, pruef: 'Dressur A', turnier: 'Test', tag: 5 + i })); pinnwandOeffnen(p); });
  await pg.waitForTimeout(300);
  const w = await pg.evaluate(() => ({ k: document.querySelector('.pinn-karte').getBoundingClientRect().width, s: document.querySelector('.pinn-s svg').getBoundingClientRect().width }));
  ok('Pinnwand größer (Breite, Schleifen)', w.k > 600 || bw < 700, JSON.stringify(w)); ok('Schleifen groß (≥ 60 px am PC)', w.s >= 60 || bw < 700, JSON.stringify(w));
  await bild('pinnwand');
  ok('keine Skriptfehler', errs.length === 0, errs.join(' | '));
  console.log(out.join('\n')); await b.close();
})();
