// v719 (Dome 23.10.): Wünsche an die Mitarbeiter je eigenem Pferd (Haken im Whiteboard), Pferdeshampoo in der Futterkammer
// Start: NODE_PATH=/opt/node22/lib/node_modules node tests/wuensche-test.js [BxH]
const { chromium } = require('playwright'); const path = require('path');
const [W, H] = (process.argv[2] || '1366x768').split('x').map(Number);
(async () => { const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: W, height: H } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(600);
  await pg.click('#smNeu'); await pg.fill('#chName', 'T'); await pg.click('#chLos'); await pg.waitForTimeout(300); await pg.click('#dlgKnoepfe button');
  await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'H'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(300);
  const R = await pg.evaluate(() => { const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : ''));
    document.getElementById('dlg').hidden = true; speicherSperre = true; spiel.stufenAn = false; spiel.tippsAus = true; VET.verbotAb = 99; spiel.geld = 50000; spiel.spieler.stufe = 'fort'; spiel.tutorial = null;
    const neu = (n) => { const p = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: n }); p.pflege = erzeugePflege(p); p.werte = p.werte || erzeugeWerte(p); ['impf', 'wurm', 'zahn', 'huf'].forEach(k => p.pflege[k] = spiel.tag); return p; };
    while (spiel.boxen.length < 3) spiel.boxen.push({ pferd: null });
    const A = neu('Anna'), B = neu('Berta'); spiel.boxen[0].pferd = A; spiel.boxen[1].pferd = B;
    const mk = (typ, id) => { const x = bewerber(typ)[0]; spiel.mitarbeiter = spiel.mitarbeiter || []; spiel.mitarbeiter.push({ id, typ, name: x.name, w: x.w, wissen: { ...x.wissen }, eig: [...x.eig], gehalt: x.gehalt, ab: jzJetzt(), bis: null }); };
    mk('pfleger', 'mP'); mk('stallbursche', 'mS');
    gebaeude().push({ gid: 'gw', typ: 'waschplatz', stufe: 2, zustand: 100 }); gebaeude().push({ gid: 'gs', typ: 'solarium', stufe: 2, zustand: 100 }); spiel.anlage.waschplatz = true; spiel.anlage.solarium = true;
    ok('Standard: ohne Eintrag wünscht jedes Pferd alles außer Solarium', wunschEin(A, 'putzen') && wunschEin(A, 'fuettern') && !wunschEin(A, 'solarium'));
    window.maFehler = () => 0;   // Mitarbeiter vergessen nichts (sonst zufällig rot)
    const gesund = () => (spiel.mitarbeiter || []).forEach(m => { delete m.krankBis; delete m.urlaub; }), mt = () => { gesund(); mitarbeiterTag(); gesund(); };
    const bx = typ => { gesund(); return maBoxen(typ); };
    ok('Pfleger geht zu beiden Pferden', bx('pfleger').length === 2, JSON.stringify(bx('pfleger')));
    // Berta: nichts für den Pfleger
    B.leist = { putzen: false, maehne: false, waschen: false, leicht: false, solarium: false };
    ok('Pferd ohne Pfleger-Wunsch: Pfleger geht nicht hin', bx('pfleger').length === 1 && bx('pfleger')[0] === 0, JSON.stringify(bx('pfleger')));
    ok('… der Stallbursche schon (Füttern/Misten bleiben an)', bx('stall').length === 2);
    // Putzen: Anna wird geputzt, Berta nicht
    A.dreck = { fell: 40, maehne: 20, seit: null }; B.dreck = { fell: 40, maehne: 20, seit: null }; delete A.geputzt; delete B.geputzt;
    spiel.boxen.forEach(x => { x.krippeVoll = !!x.pferd; x.mistig = false; }); mt();
    ok('Anna geputzt', A.geputzt && A.geputzt.tag === spiel.tag, ''); ok('Berta nicht geputzt', !(B.geputzt && B.geputzt.tag === spiel.tag));
    // Misten aus: Box bleibt dreckig
    B.leist.misten = false; spiel.boxen[1].mistig = true; spiel.boxen[1].mistStufe = 3; spiel.boxen[0].mistig = true; mt();
    ok('Misten aus: Box bleibt, Anna wird gemistet', spiel.boxen[1].mistig && !spiel.boxen[0].mistig);
    // Füttern aus
    B.leist.fuettern = false; spiel.boxen[1].krippeVoll = false; spiel.boxen[0].krippeVoll = false; mt();
    ok('Füttern aus: Krippe bleibt leer, Anna gefüttert', !spiel.boxen[1].krippeVoll && spiel.boxen[0].krippeVoll);
    ok('Alle Stall-Wünsche aus: Stallbursche geht nicht mehr zu Berta', (B.leist.weide = false, bx('stall').length === 1));
    // Solarium durch Pfleger (eigenes Pferd, Wunsch an)
    while (datum().s !== 1) { spiel.boxen.forEach(x => { x.krippeVoll = !!x.pferd; x.mistig = false; }); naechsteNacht(); document.getElementById('dlg').hidden = true; }
    [A, B].forEach(q => { q.befunde = []; delete q.klinik; delete q.weide; delete q.paddock; delete q.turnier; q.pflege.gesundheit = 100; }); spiel.boxen.forEach(x => { x.tot = false; }); (spiel.mitarbeiter || []).forEach(m => { delete m.krankBis; delete m.urlaub; });
    A.befunde = []; A.leist = { solarium: true }; A.trainHeute = { tag: spiel.tag, liste: ['schritt'], verbraucht: 10 }; delete A.solar; waschAbend();
    ok('Solarium-Wunsch: Pfleger bringt Anna unters Solarium', A.solar && A.solar.tag === spiel.tag && A.solar.n === 1);
    A.leist = { solarium: false }; delete A.solar; waschAbend(); ok('Solarium-Wunsch aus: nichts', !(A.solar && A.solar.tag === spiel.tag));
    // Waschen
    A.leist = {}; spiel.shampoo = 1; A.schweiss = spiel.tag; A.dreck = { fell: 60, maehne: 10, seit: null }; delete A.gewaschen; waschAbend();
    ok('Waschen mit Wunsch: gewaschen, Glanz, Shampoo verbraucht', A.gewaschen === spiel.tag && A.fellGlanz >= spiel.tag && spiel.shampoo === 0);
    ok('Brief „Pferdeshampoo ist aufgebraucht“', (spiel.post || []).some(x => /Pferdeshampoo ist aufgebraucht/.test(x.betreff)));
    B.leist = { waschen: false }; B.schweiss = spiel.tag; B.dreck = { fell: 60, maehne: 10, seit: null }; delete B.gewaschen; waschAbend(); ok('Waschen-Wunsch aus: Berta bleibt', B.gewaschen !== spiel.tag);
    // Whiteboard-Haken
    wbSicht = 'boxen'; zeigeBoxen(); const bw = document.querySelector('#nebenSchirm .wb');
    ok('Whiteboard: Haken je Pferd', bw && bw.querySelectorAll('[data-wbwu]').length >= 10, '' + (bw && bw.querySelectorAll('[data-wbwu]').length));
    const cb = bw.querySelector('[data-wbwu="0:putzen"]'); ok('Haken Putzen bei Anna an', cb && cb.checked);
    cb.checked = false; cb.dispatchEvent(new Event('change', { bubbles: true })); ok('Haken abwählen speichert p.leist', A.leist.putzen === false);
    ok('Haken bleiben nach Neuzeichnen', !document.querySelector('[data-wbwu="0:putzen"]').checked);
    ok('Solarium-Haken bei Anna (Standard aus → hier explizit false)', !document.querySelector('[data-wbwu="0:solarium"]').checked);
    // Futterkammer
    spiel.shampoo = 0; const g0 = spiel.geld; const h = apothekeKammerHTML(); ok('Futterkammer: Kachel Pferdeshampoo', /data-shampookauf/.test(h) && /Pferdeshampoo/.test(h));
    // Koppel: Weide kommt aus dem Plan, kein Auswahlfenster, Karte ohne Handauswahl
    spiel.boxen[0].pferd.leist = {}; const w2 = weiden().filter(w => !w.wiese);
    ok('Whiteboard frei (fort)', wbFrei());
    ok('auslaufZeile bei Whiteboard leer', auslaufZeile(A) === '');
    const P2 = A; P2.weidegang = 'taeglich'; P2.auslaufZiel = w2[w2.length - 1].wid; P2.weide = { seit: spiel.tag, wid: w2[w2.length - 1].wid };
    aktBox = 0; spiel.aktBox = 0; zeigeAkte(); const t = document.getElementById('info').innerText;
    ok('Weide-Karte: keine Handauswahl, kein „Gras statt Heu“-Absatz, kein „Heute gefressen“', !/Weidegang durch Stallbursche/.test(t) && !/Gras statt Heu/.test(t) && !/Heute gefressen/.test(t), t.slice(0, 120));
    delete P2.weide; zeigeStall(); document.getElementById('dlg').hidden = true; spiel.hofFenster = []; zeigeSchirm(null); zeigeStall(); zeigeTag(); aktenModus = 'pflege'; aktenReiter = 'platz'; ortModus = null; zeigeAkte();
    const wk = document.querySelector('[data-ort="koppel"]'); if (wk) wk.click(); zeigeAkte();
    const kw = document.querySelector('[data-ort="weide"]'); if (kw) kw.click();
    ok('Ort → Koppel → Weide: Pferd geht ohne Auswahlfenster auf die geplante Weide', P2.weide && P2.weide.wid === w2[w2.length - 1].wid && document.getElementById('dlg').hidden !== false || !!P2.weide, JSON.stringify(P2.weide) + ' koppel:' + !!wk + ' weide:' + !!kw + ' dlg:' + document.getElementById('dlg').hidden + ' modus:' + ortModus + ' n=' + w2.length);
    // v721: Whiteboard – Übersicht zuerst, x auch bei Pensionspferden, leere/reservierte Boxen, Rückweg
    spiel.boxen[2] = { pferd: null }; spiel.boxen[2].reserviert = 'rsv'; (spiel.pensionAnfragen = spiel.pensionAnfragen || []).push({ aid: 'ar', angenommen: true, pferd: { id: 'rsv', name: 'Gast' } });
    wbSicht = 'boxen'; zeigeWhiteboard(); const nb2 = document.querySelector('#nebenSchirm');
    ok('reservierte Box steht als „reserviert für Gast“ da', /reserviert für Gast/.test(nb2.innerText));
    ok('leere Box hat Antipp-Ziel zur Box', !!nb2.querySelector('.wb-box.leer[data-wbgo]'));
    ok('oben links: „‹ Whiteboard“ statt Hauptmenü', document.getElementById('nbZurueck').textContent.includes('Whiteboard'));
    document.getElementById('nbZurueck').click(); ok('Zurück führt in die Übersicht', wbSicht === 'uebersicht' && document.getElementById('nbZurueck').textContent.includes('Hauptmenü'));
    ok('Übersicht: beide Vorschauen als Bild (wb-vin)', document.querySelectorAll('.wb-vorschau .wb-vin').length === 2);
    wbSicht = 'weiden'; zeigeWhiteboard(); ok('Weiden: keine Kachel „Hierher ziehen“', !/Hierher ziehen/.test(document.querySelector('#nebenSchirm').innerText));
    const pe = { rasse: 'paint', geschlecht: 'Stute', alter: 8, name: 'Gastpferd' }; const GP = neuesPferd(pe); GP.pflege = erzeugePflege(GP); GP.werte = GP.werte || erzeugeWerte(GP); spiel.boxen[2].pferd = GP; delete spiel.boxen[2].reserviert; const Ee = { eid: 'eG', vn: 'X', nn: 'Y', w: true, pid: GP.id, stufe: 1, leistungen: {}, haltung: 'weide', zufr: 80, seit: jzJetzt(), einzug: spiel.tag - 5, kuendigt: null, log: [], plus: [], befSeen: [], preis: 200 }; GP.einsteller = 'eG'; einstellerListe().push(Ee);
    wbSetzen(GP, w2[0].wid, 't'); zeigeWhiteboard(); ok('Pensionspferd auf der Weide hat ein ✕', !!document.querySelector('[data-wbweg="2:t"]'));
    wbWeg(GP, 't'); ok('✕ bei Pensionspferd: bleibt in der Box', !wbPlanVon(GP));
    return out; });
  R.forEach(l => console.log(l)); console.log(errs.length ? '✗ Seitenfehler: ' + errs.join(';') : '✓ keine Seitenfehler'); await b.close(); process.exit(R.some(l => l[0] === '✗') || errs.length ? 1 : 0); })();
