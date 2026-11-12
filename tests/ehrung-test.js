// v1009 (Dome 13.11.): Auszeichnungen der Zuchtverbände – Hannoveraner Leistungsstute, Trakehner Elitestute, Quarter/Appaloosa Performance (ROM) und Superior mit echten Punkten (AQHA/ApHC)
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
const ORD = process.env.BILDER_ORDNER || null; if (ORD) fs.mkdirSync(ORD, { recursive: true });
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 900 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (c ? '' : ' – ' + (x == null ? '' : x)));
  let nr = 0; const bild = async name => { if (!ORD) return; nr++; await pg.waitForTimeout(250); await pg.screenshot({ path: path.join(ORD, String(nr).padStart(2, '0') + '-' + name + '.png') }); };
  const ev = (f, a) => pg.evaluate(f, a);
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(500);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('[data-stufe="exp"]'); await pg.click('#chLos'); await pg.waitForTimeout(250); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'W'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  await ev(() => { document.getElementById('dlg').hidden = true; spiel.stufenAn = false; spiel.tippsAus = true; spiel.geld = 100000;
    window.mk = (n, rasse, g, alter, i) => { const P = neuesPferd({ rasse, geschlecht: g, alter, name: n }); P.anteile = { [rasse]: 100 }; P.pflege = erzeugePflege(P); P.werte = P.werte || erzeugeWerte(P); werteErgaenzen(P); P.pflege.gesundheit = 100; if (i != null) spiel.boxen[i].pferd = P; return P; };
    window.erf = (p, disz, stufe, platz, von) => { (p.erfolge = p.erfolge || []).unshift({ tag: spiel.tag, turnier: 'T', art: 'regional', disz, stufe, platz, von, plaziert: platz <= Math.max(3, Math.ceil(von / 4)) }); zbZaehlNeu(p, p.erfolge[0]); };
    const H = mk('Hanna', 'hannoveraner', 'Stute', 9, 0); H.zb = { i: 0, gesamt: 7.0, tag: 1 };
    const F = mk('Fohli', 'hannoveraner', 'Hengst', 1, 1); F.papiere = true; H.kinder = [{ id: F.id }];
    const T = mk('Tara', 'trakehner', 'Stute', 10, 2); T.zb = { i: 0, gesamt: 7.2, tag: 1 };
    const K1 = mk('Kind1', 'trakehner', 'Stute', 2, 3), K2 = mk('Kind2', 'trakehner', 'Wallach', 1, null); T.kinder = [{ id: K1.id }, { id: K2.id }];
    const Q = mk('Queenie', 'quarter', 'Stute', 6, 4); Q.zb = { i: 0, gesamt: null, tag: 1, lg: 1 };
    const A = mk('Apple', 'appaloosa', 'Stute', 6, 5); A.zb = { i: 0, gesamt: null, tag: 1, lg: 1 };
    speichern(); });
  const dlg = () => ev(() => document.getElementById('dlg').hidden ? '' : document.getElementById('dlgInhalt').innerText);
  const fenster = async box => { await ev(b => { document.getElementById('dlg').hidden = true; zuchtverbandDialog(spiel.boxen[b].pferd, () => {}); }, box); await pg.waitForTimeout(300); };

  // Punkte-Tabellen
  const P = await ev(() => ({ aqha: [2, 4, 5, 10, 20, 45, 60].map(n => westernPunkte(1, n)), aqha10: [1, 2, 3, 4].map(p => westernPunkte(p, 10)), aphc: [2, 3, 8, 13, 28, 40].map(n => westernPunkte(1, n, true)) }));
  ok('AQHA-Punkte 1. Platz (2/4/5/10/20/45/60 Pferde) = 0/½/1/2/4/9/9', JSON.stringify(P.aqha) === '[0,0.5,1,2,4,9,9]', JSON.stringify(P.aqha));
  ok('AQHA 10 Pferde: 2/1/½/0', JSON.stringify(P.aqha10) === '[2,1,0.5,0]', JSON.stringify(P.aqha10));
  ok('ApHC-Punkte 1. Platz (2/3/8/13/28/40) = ½/1/2/3/6/6', JSON.stringify(P.aphc) === '[0.5,1,2,3,6,6]', JSON.stringify(P.aphc));

  // 1. Hannoveraner: erst ohne Sport → kein Knopf
  await fenster(0); let t = await dlg(); await bild('hanna-ohne-sport');
  ok('Hannoveraner: Abschnitt Auszeichnungen mit Leistungsstute', /Auszeichnungen/.test(t) && /Leistungsstute/.test(t), t.slice(-500));
  ok('Ohne Sporterfolge kein Knopf „Beantragen“', !(await pg.$('[data-zbehre]')));
  await ev(() => { const H = spiel.boxen[0].pferd; for (let i = 0; i < 4; i++) erf(H, 'dressur', 3, 2, 12); erf(H, 'dressur', 2, 1, 12); });
  await fenster(0); ok('4 M-Platzierungen + 1 L reichen nicht', !(await pg.$('[data-zbehre]')));
  await ev(() => erf(spiel.boxen[0].pferd, 'springen', 4, 3, 15));
  await fenster(0); await bild('hanna-erfuellt');
  const mw0 = await ev(() => marktwert(spiel.boxen[0].pferd));
  const k = await pg.$('[data-zbehre="leist"]'); ok('5 Platzierungen ab M: Knopf „Beantragen“', !!k);
  if (k) { await k.click(); await pg.waitForTimeout(300); }
  const h = await ev(() => { const p = spiel.boxen[0].pferd; return { titel: zuchtbuchVon(p).titel, brief: (spiel.post || []).some(x => /Auszeichnung: Hanna/.test(x.betreff || '')), mw: marktwert(p) }; });
  ok('Hanna ist Leistungsstute, Brief kam', /Leistungsstute/.test(h.titel) && h.brief, JSON.stringify(h));
  ok('Marktwert steigt (Leistungsstute ×1,08)', h.mw > mw0, mw0 + ' → ' + h.mw);
  ok('Fenster zeigt „verliehen“, kein zweiter Knopf', /verliehen/.test(await dlg()) && !(await pg.$('[data-zbehre]')));
  await bild('hanna-verliehen');

  // 2. Trakehner Elitestute
  await fenster(2); ok('Trakehner: Elitestute ohne Sport noch nicht', /Elitestute/.test(await dlg()) && !(await pg.$('[data-zbehre]')));
  await ev(() => { const T = spiel.boxen[2].pferd; erf(T, 'springen', 3, 1, 20); erf(T, 'dressur', 3, 4, 20); erf(T, 'springen', 4, 2, 10); });
  await fenster(2); await bild('tara-erfuellt'); const ke = await pg.$('[data-zbehre="elite"]'); ok('3 M-Platzierungen, Note 7,2, 2 Fohlen: Knopf Elitestute', !!ke);
  if (ke) { await ke.click(); await pg.waitForTimeout(300); }
  ok('Tara ist Elitestute', await ev(() => /Elitestute/.test(zuchtbuchVon(spiel.boxen[2].pferd).titel)));
  await ev(() => { const T = spiel.boxen[2].pferd; T.zb.gesamt = 6.8; delete T.zb.elite; }); await fenster(2);
  ok('Note 6,8: keine Elitestute', !(await pg.$('[data-zbehre="elite"]')));

  // 3. Quarter: AQHA-Punkte (20 Pferde: Sieg = 4 Punkte)
  await ev(() => { const Q = spiel.boxen[4].pferd; erf(Q, 'reining', 1, 1, 20); erf(Q, 'reining', 1, 1, 20); erf(Q, 'pleasure', 1, 2, 10); });
  await fenster(4); t = await dlg(); await bild('queenie-9-punkte');
  ok('Quarter: Westernpunkte werden gezeigt (Reining 8, Pleasure 1)', /Reining 8/.test(t) && /Pleasure 1/.test(t), t.slice(-400));
  ok('9 Punkte: noch kein ROM', !(await pg.$('[data-zbehre="perf"]')));
  await ev(() => erf(spiel.boxen[4].pferd, 'trail', 1, 1, 5));
  await fenster(4); const kp = await pg.$('[data-zbehre="perf"]'); ok('10 Punkte: Performance (ROM) beantragbar', !!kp); ok('Superior noch nicht', !(await pg.$('[data-zbehre="sup"]')));
  if (kp) { await kp.click(); await pg.waitForTimeout(300); }
  ok('Queenie trägt „Performance“', await ev(() => /Performance/.test(zuchtbuchVon(spiel.boxen[4].pferd).titel)));
  await ev(() => { const Q = spiel.boxen[4].pferd; for (let i = 0; i < 6; i++) erf(Q, 'reining', 3, 1, 50); });
  await fenster(4); await bild('queenie-superior'); ok('Reining 8 + 6 × 9 = 62 Punkte: Superior beantragbar', !!(await pg.$('[data-zbehre="sup"]')), (await dlg()).slice(-400));
  await ev(() => { spiel.boxen[4].pferd.geburt && 0; });

  // 4. Appaloosa: ApHC-Tabelle, Altersgrenze 5 Jahre
  await ev(() => { const A = spiel.boxen[5].pferd; for (let i = 0; i < 5; i++) erf(A, 'pleasure', 1, 1, 8); });
  await fenster(5); ok('Appaloosa: 5 Siege bei 8 Pferden = 10 ApHC-Punkte → ROM', /Pleasure 10/.test(await dlg()) && !!(await pg.$('[data-zbehre="perf"]')), (await dlg()).slice(-300));
  const jung = await ev(() => { const A = mk('Junior', 'appaloosa', 'Stute', 4, null); A.zb = { i: 0, tag: 1, lg: 1 }; for (let i = 0; i < 5; i++) erf(A, 'pleasure', 1, 1, 8); return zbEhren(A).map(x => x.k + ':' + x.ok).join(','); });
  ok('Unter 5 Jahren: noch keine Auszeichnung', /perf:false/.test(jung), jung);

  // 5. Alter Spielstand: Zähler aus den Erfolgen nachrechnen
  const alt = await ev(() => { const H = mk('Altstute', 'hannoveraner', 'Stute', 12, null); H.zb = { i: 0, gesamt: 7, tag: 1 }; for (let i = 0; i < 5; i++) H.erfolge = [...(H.erfolge || []), { disz: 'dressur', stufe: 3, platz: 1, von: 10, plaziert: true }]; delete H.zbZ; return zbZaehlStand(H).m; });
  ok('Alter Spielstand: Zähler aus p.erfolge (5)', alt === 5, alt);

  // 6. Neuladen
  await ev(() => { speichernJetzt(); }); await pg.reload(); await pg.waitForTimeout(800);
  const wl = pg.locator('button', { hasText: /Weiter|Fortsetzen/ }).first(); if (await wl.count()) { await wl.click(); await pg.waitForTimeout(500); }
  ok('Nach Neuladen: Titel bleiben', await ev(() => /Leistungsstute/.test((zuchtbuchVon(spiel.boxen[0].pferd) || {}).titel || '') && /Elitestute/.test((zuchtbuchVon(spiel.boxen[2].pferd) || {}).titel || '') === false));
  out.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(out.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
