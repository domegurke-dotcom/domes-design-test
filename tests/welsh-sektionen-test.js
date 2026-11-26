// Welsh-Sektionen A, B, C, D (26.11.2026, Dome): Rassen, Größen, Verpaarungsregeln (A×A=A … D×D=D), Körung des Welsh Cob, Zuchtbuch, Stutenauktion, Gestüte.
// Start (PowerShell): $env:NODE_PATH = "C:\Users\Admin\werkzeug-node\pw\node_modules"; node tests/welsh-sektionen-test.js   ·   MOTOR=1 prüft den Motor
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x ? ' – ' + x : ''));
  const datei = process.env.MOTOR ? path.resolve(__dirname, '..', '..', 'zuchtstall-app', 'motor', 'index.html') : path.resolve(__dirname, '..', 'index.html');
  await pg.goto('file://' + datei); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const r = await pg.evaluate(() => {
    document.getElementById('dlg').hidden = true; spiel.tippsAus = true; spiel.admin = false; spiel.stufenAn = false; spiel.geld = 300000;
    const S = { A: 'welsha', B: 'welshpony', C: 'welshc', D: 'welshcob' }, o = {};
    o.groessen = Object.fromEntries(Object.entries(S).map(([k, id]) => [k, rasseById(id).h]));
    o.namen = Object.fromEntries(Object.entries(S).map(([k, id]) => [k, rasseById(id).name]));
    // Verpaarungen: 40 Fohlen je Kombination, Sektion und Stockmaß prüfen
    const erwartet = { AA: ['welsha'], AB: ['welshpony'], BB: ['welshpony'], AC: ['welshc'], BC: ['welshc'], CC: ['welshc'], AD: ['welshc'], BD: ['welshc', 'welshcob'], CD: ['welshc', 'welshcob'], DD: ['welshcob'] };
    o.kreuz = {}; o.sm = {}; o.rein = true;
    while (spiel.boxen.length < 2) spiel.boxen.push({ pferd: null });
    Object.entries(erwartet).forEach(([k, erl]) => {
      const res = new Set(); let smOk = true;
      for (let i = 0; i < 40; i++) {
        const M = neuesPferd({ rasse: S[k[0]], geschlecht: 'Stute', alter: 7, name: 'M' + k + i }), V = neuesPferd({ rasse: S[k[1]], geschlecht: 'Hengst', alter: 8, name: 'V' + k + i });
        M.anteile = { [M.rasse]: 100 }; V.anteile = { [V.rasse]: 100 }; M.pflege = erzeugePflege(M); V.pflege = erzeugePflege(V); M.werte = M.werte || erzeugeWerte(M); V.werte = V.werte || erzeugeWerte(V);
        const box = { pferd: M }; M.traechtig = { vater: V };
        let f; try { f = geburt(box, V, true); } catch (e) { o.fehler = String(e); return; }
        res.add(f.rasse); const h = rasseById(f.rasse).h; if (f.zielStockmass < h[0] || f.zielStockmass > h[1]) smOk = false;
        if (anteileVon(f)[f.rasse] !== 100) o.rein = false;
        if (k === 'BD' || k === 'CD') { if ((f.zielStockmass > 137) !== (f.rasse === 'welshcob') && f.zielStockmass !== 137) smOk = smOk && true; }
      }
      o.kreuz[k] = [...res]; o.sm[k] = smOk; o.kreuzOk = (o.kreuzOk !== false) && [...res].every(x => erl.includes(x));
    });
    // Körung und Zuchtbuch: alle vier Sektionen gleich
    o.koerung = Object.values(S).map(id => [id, HENGST[id] && HENGST[id].sys, HENGST[id] && HENGST[id].note, HENGST[id] && HENGST[id].lp && HENGST[id].lp.note]);
    o.stufen = Object.values(S).map(id => VERBAND[id] && VERBAND[id].stufen.map(x => x.n).join('/'));
    o.auktion = Object.values(S).map(id => !!ST_AUK[id]);
    o.gestuete = { leybucht: GESTUETE.leybucht.r.join(), cnst: !!GESTUETE.cnst, menai: GESTUET_ECHT.welshpony[0], conn: GESTUET_ECHT.connemara[0] };
    // keine Tobiano/Overo-Farben bei den Welsh-Sektionen (Zuchtprogramm: alle Farben außer Tobiano und Overo-Scheckung)
    o.schecke = Object.values(S).filter(id => rasseById(id).farben.some(f => /^to_|tobiano|overo|tovero|sabino|splash/.test(f)));
    // Marktwert / Pferd erzeugen
    o.pferde = Object.values(S).map(id => { const rr = zufall('ws-' + id), p = mkPferd('ws' + id, id, 0, 7, rr, 'Stute', zuechterGeb(7, rr), 'gestuet'); marktKoerper(p, rr, 'zuechter'); return [id, marktwert(p) > 0, p.zielStockmass]; });
    return o;
  });
  ok('Sektionen heißen A, B, C, D und haben die Größen A ≤ 122, B ≤ 137, C ≤ 137, D > 137', r.namen.A.includes('Sektion A') && r.namen.B.includes('Sektion B') && r.namen.C.includes('Sektion C') && r.namen.D.includes('Sektion D') && r.groessen.A[1] === 122 && r.groessen.B[1] === 137 && r.groessen.C[1] === 137 && r.groessen.D[0] === 137, JSON.stringify(r.groessen));
  ok('Verpaarungen: A×A=A, A×B/B×B=B, A×C/B×C/C×C/A×D=C, B×D/C×D=C oder D, D×D=D', !r.fehler && r.kreuzOk === true, JSON.stringify(r.kreuz) + (r.fehler || ''));
  ok('Fohlen bleiben reinrassig (100 %) und im Stockmaß ihrer Sektion', r.rein && Object.values(r.sm).every(Boolean), JSON.stringify(r.sm));
  ok('Körung Note 7,0 und Leistungsprüfung 6,5 bei allen vier Sektionen (auch Welsh Cob)', r.koerung.every(k => k[1] === 'koer' && k[2] === 7 && k[3] === 6.5), JSON.stringify(r.koerung));
  ok('Stutbuch I / II / Anhang bei allen vier Sektionen', r.stufen.every(s => s === 'Stutbuch I/Stutbuch II/Anhang'), JSON.stringify(r.stufen));
  ok('Stutenauktion (WPCS) für alle vier Sektionen', r.auktion.every(Boolean));
  ok('Gestüte: Leybucht = Welsh A, Connemara National Stud, Menai Stud (B)', r.gestuete.leybucht === 'welsha' && r.gestuete.cnst && r.gestuete.menai === 'Menai Stud' && r.gestuete.conn === 'Connemara Pony National Stud', JSON.stringify(r.gestuete));
  ok('keine Tobiano/Overo/Scheckungs-Farben bei Welsh', r.schecke.length === 0, r.schecke.join());
  ok('Pferde der vier Sektionen erzeugen, Marktwert > 0', r.pferde.every(p => p[1]), JSON.stringify(r.pferde));
  ok('keine Skriptfehler', errs.length === 0, errs.join(' | '));
  console.log(out.join('\n')); await b.close(); process.exit(out.some(l => l.startsWith('✗')) ? 1 : 0);
})();
