// W20 (schwache Dominant-White-Form, 26.11.2026): Gen, Häufigkeiten je Rasse (Avila et al. 2022), Wirkung auf Abzeichen, Vererbung, KIT-Regel, Anzeige, alte Spielstände
// Start: $env:NODE_PATH = "C:\Users\Admin\werkzeug-node\pw\node_modules"; node tests/w20-test.js   ·   MOTOR=1 prüft den Motor
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
    const o = {};
    o.gen = GEN.W20 && GEN.W20.slice(0, 4).join('|'); o.kit = KIT.join();
    // Häufigkeiten: Allelanteil in 4000 Pferden je Rasse
    o.freq = {}; const soll = { hannoveraner: .24, oldenburger: .26, welshpony: .26, connemara: .12, quarter: .14, paint: .21, vollblut: .34, araber: 0, isi: 0, fjord: 0, friese: 0 };
    Object.keys(soll).forEach(rs => { let n = 0, a = 0; for (let i = 0; i < 2500; i++) { const g = genAusFarbe('brauner', 'f' + rs + i, rs); a += anzahl(g, 'W20'); n += 2; } o.freq[rs] = Math.round(a / n * 1000) / 1000; });
    o.soll = soll;
    // Wirkung auf das Kopfabzeichen und die Beine
    const mk = (w, i) => { const p = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 7, name: 'W' + w + i }); p.gen = genNorm(Object.fromEntries(GENE.map(([k, , , rez]) => [k, [rez, rez]]))); p.gen.E = ['E', 'E']; p.gen.A = ['A', 'A']; p.gen.W20 = w === 0 ? ['n', 'n'] : w === 1 ? ['W20', 'n'] : ['W20', 'W20']; p.farbe = phaenotyp(p.gen); p.ex = Object.assign({}, exVon(p), { weiss: ((i * 0.6180339) % 1) * 0.98 + 0.01, bvl: ((i * 0.3819) % 1), bvr: ((i * 0.2236) % 1), bhl: ((i * 0.7071) % 1), bhr: ((i * 0.4142) % 1) }); return p; };
    const stufe = p => ABZ_STUFEN.findIndex(([, a]) => (kopfZeichen(p).abz.filter(x => x !== 'schnippe')[0] || null) === a), bein = p => { const b = beinZeichen(p); return BEINE.reduce((s, [k]) => s + (b[k] ? BEIN_STUFEN.findIndex(([, a]) => a === b[k]) : 0), 0); };
    o.mittel = [0, 1, 2].map(w => { let s = 0, bs = 0; for (let i = 1; i <= 300; i++) { const p = mk(w, i); s += stufe(p); bs += bein(p); } return [Math.round(s / 3) / 100, Math.round(bs / 3) / 100]; });
    // harmlos: Farbe ändert sich nicht, kein Lethal
    const pw = mk(2, 5), p0 = mk(0, 5); o.farbeGleich = phaenotyp(pw.gen) === phaenotyp(p0.gen);
    // Vererbung: W20/n × W20/n → ca. 25 % reinerbig, keine toten Fohlen
    let hom = 0, het = 0, nn = 0; const a = mk(1, 1).gen, c = mk(1, 2).gen; for (let i = 0; i < 2000; i++) { const f = genVererben(a, c), n = anzahl(f, 'W20'); if (n === 2) hom++; else if (n === 1) het++; else nn++; } o.erb = [hom / 2000, het / 2000, nn / 2000].map(x => Math.round(x * 100) / 100);
    // Geburt mit W20-Eltern
    const M = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'M' }), V = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Hengst', alter: 9, name: 'V' });
    [M, V].forEach(x => { x.anteile = { hannoveraner: 100 }; x.pflege = erzeugePflege(x); x.werte = x.werte || erzeugeWerte(x); genVon(x); x.gen.W20 = ['W20', 'W20']; });
    while (spiel.boxen.length < 2) spiel.boxen.push({ pferd: null });
    let gb = 0, fehler = null, allW = true; for (let i = 0; i < 20; i++) { M.traechtig = { vater: V }; try { const f = geburt({ pferd: M }, V, true); gb++; if (anzahl(f.gen, 'W20') !== 2) allW = false; } catch (e) { fehler = String(e); break; } } o.geburt = [gb, fehler, allW];
    // KIT-Regel: W20/W20 + To → höchstens zwei Anlagen, W20 fällt zuerst weg
    const g3 = genNorm(Object.fromEntries(GENE.map(([k, , , rez]) => [k, [rez, rez]]))); g3.To = ['To', 'n']; g3.Sb = ['n', 'Sb']; g3.W20 = ['W20', 'W20']; const ver = kitFix(g3); o.kit3 = [ver, KIT.map(k => anzahl(g3, k)).join(), kitOk(g3)];
    const g4 = genNorm(Object.fromEntries(GENE.map(([k, , , rez]) => [k, [rez, rez]]))); g4.To = ['To', 'n']; g4.W20 = ['n', 'W20']; o.kit4 = [kitFix(g4), kitOk(g4), anzahl(g4, 'To'), anzahl(g4, 'W20')];
    // Verstärker: W20 allein zählt nicht als Weiß-Gen, mit Tobiano eine Stufe mehr
    const gA = genNorm(Object.fromEntries(GENE.map(([k, , , rez]) => [k, [rez, rez]]))); gA.W20 = ['W20', 'n']; const gB = genNorm(Object.fromEntries(GENE.map(([k, , , rez]) => [k, [rez, rez]]))); gB.To = ['To', 'n']; const gC = genNorm(Object.fromEntries(GENE.map(([k, , , rez]) => [k, [rez, rez]]))); gC.To = ['To', 'n']; gC.W20 = ['n', 'W20']; o.zahl = [weissGeneZahl(gA, {}), weissGeneZahl(gB, {}), weissGeneZahl(gC, {})];
    // alte Pferde ohne W20-Gen werden neutral ergänzt
    const alt = { Sw: ['n', 'n'] }; genNorm(alt); o.alt = alt.W20;
    // Anzeige: Fellfarben-Test und Genetik-Karte
    const pt = mk(1, 9); pt.gen.W20 = ['W20', 'n']; pt.id = pt.id || 'pt9'; spiel.boxen[0].pferd = pt; pt.tests = { farbe: true }; pt.gentest = true;
    o.html = gentestHTML(pt); o.labor = laborErgebnis(pt, 'farbe');
    // Rassenansicht: kein Fehler beim Gene-Wählen (GL_OPT)
    o.rassen = { araber: genFreq('araber', 'W20'), hann: genFreq('hannoveraner', 'W20') };
    return o;
  });
  ok('Gen W20 ist eingetragen (dominant W20, rezessiv n) und liegt am KIT-Gen', r.gen && /^W20\|Dominant White 20/.test(r.gen) && r.kit.split(',').includes('W20') && r.kit.split(',').pop() === 'W20', r.gen + ' · ' + r.kit);
  const abw = Object.entries(r.soll).map(([k, v]) => [k, v, r.freq[k]]).filter(([, s, f]) => Math.abs(s - f) > Math.max(0.03, s * 0.15));
  ok('Allelhäufigkeiten wie bei Avila et al. 2022 (Hann. 0,24 · Old. 0,26 · Welsh Pony 0,26 · Connemara 0,12 · QH 0,14 · Paint 0,21 · Vollblut 0,34; Araber/Isländer/Fjord/Friese 0)', abw.length === 0, JSON.stringify(r.freq));
  ok('Wirkung: mehr Weiß am Kopf und an den Beinen (keine Anlage < eine < zwei)', r.mittel[0][0] < r.mittel[1][0] && r.mittel[1][0] < r.mittel[2][0] && r.mittel[0][1] < r.mittel[1][1] && r.mittel[1][1] < r.mittel[2][1], JSON.stringify(r.mittel));
  ok('Wirkung nur „etwas“: eine Anlage hebt den Kopf im Schnitt um weniger als zwei Stufen', r.mittel[1][0] - r.mittel[0][0] < 2, JSON.stringify(r.mittel));
  ok('Fellfarbe bleibt gleich (harmlos)', r.farbeGleich === true);
  ok('Vererbung W20/n × W20/n: etwa ¼ reinerbig, ½ einfach, ¼ ohne – alle lebensfähig', Math.abs(r.erb[0] - .25) < .04 && Math.abs(r.erb[1] - .5) < .05, JSON.stringify(r.erb));
  ok('Geburt W20/W20 × W20/W20: 20 Fohlen, alle W20/W20, kein Fehler', r.geburt[0] === 20 && !r.geburt[1] && r.geburt[2] === true, JSON.stringify(r.geburt));
  ok('KIT-Regel: To + Sb + W20/W20 → höchstens zwei Anlagen, W20 fällt zuerst weg', r.kit3[0] === true && r.kit3[2] === true && r.kit3[1] === '0,1,1,0,0', JSON.stringify(r.kit3));
  ok('KIT-Regel: To und W20 auf getrennten Plätzen bleiben beide', r.kit4[0] === false && r.kit4[1] === true && r.kit4[2] === 1 && r.kit4[3] === 1, JSON.stringify(r.kit4));
  ok('Weiß-Gene: W20 allein zählt 0, Tobiano 1, Tobiano + W20 verstärkt auf 2', r.zahl.join() === '0,1,2', r.zahl.join());
  ok('Alte Spielstände: fehlendes W20 wird neutral ergänzt', r.alt && r.alt.join() === 'n,n');
  ok('Genetik-Karte nennt W20', /W20/.test(r.html) && /schwaches Dominant White/.test(r.html));
  ok('Fellfarben-Test zeigt W20', /W20/.test(r.labor));
  ok('Araber: Häufigkeit 0, Hannoveraner 0,24', r.rassen.araber === 0 && r.rassen.hann === 0.24);
  ok('keine Skriptfehler', errs.length === 0, errs.join(' | '));
  console.log(out.join('\n')); await b.close(); process.exit(out.some(l => l.startsWith('✗')) ? 1 : 0);
})();
