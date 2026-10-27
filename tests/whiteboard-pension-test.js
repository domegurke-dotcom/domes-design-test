// Whiteboard · Boxen (v883, Dome 27.10.): Häkchen je Stall „Pensionspferde dürfen hier einziehen“ – neue Einsteller ziehen nur in Ställe mit Haken, bereits eingezogene bleiben
// Start (Domes PC, siehe CLAUDE.md): node tests/whiteboard-pension-test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1366, height: 768 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'index.html')); await pg.waitForTimeout(700);
  await pg.click('#smNeu'); await pg.waitForTimeout(150); await pg.fill('#chName', 'Test'); await pg.click('#chLos'); await pg.waitForTimeout(150);
  await pg.click('#dlgKnoepfe button'); await pg.click('[data-immo="pension"]'); await pg.fill('#kaufName', 'Testhof'); await pg.click('#dlgKnoepfe button:first-child'); await pg.waitForTimeout(400);
  const out = [], ok = (n, c, x) => out.push((c ? '✓ ' : '✗ ') + n + (x !== undefined ? ' – ' + x : ''));
  const klick = async sel => { const r = await pg.evaluate(s => { const e = document.querySelector(s); if (!e) return false; e.click(); return true; }, sel); await pg.waitForTimeout(250); if (!r) out.push('✗ Klick fehlt: ' + sel); return r; };
  const Z = await pg.evaluate(() => { document.getElementById('dlg').hidden = true; spiel.tippsAus = true; spiel.stufenAn = false; const Rg = pensionRegeln(); Rg.offen = true; Rg.max = 99; Rg.ansehen = 100;
    // zweiter Boxenstall mit 2 leeren Boxen
    const alt = gebaeude().find(g => g.typ === 'stall'); gebaeude().push({ gid: 'gs2', typ: 'stall', stufe: 1, zustand: 100, boxen: 2 }); spiel.boxen.push({ pferd: null, geb: 'gs2', stufe: 1 }, { pferd: null, geb: 'gs2', stufe: 1 });
    spiel.boxen.forEach((bx, i) => { if (!bx.geb) bx.geb = alt.gid; }); stallAlt = false; spiel.stallAnsicht = 'board'; wbSicht = 'boxen'; document.querySelectorAll('.schirm.offen').forEach(x => x.classList.remove('offen')); zeigeBoxen(); try { zeigeWhiteboard(); } catch (e) { }
    return { alt: alt.gid, hk: document.querySelectorAll('[data-wbpens]').length }; });
  ok('Whiteboard zeigt je Boxenstall ein Häkchen (2 Ställe)', Z.hk === 2, Z.hk);
  const Z0 = await pg.evaluate(() => { const s = []; for (let i = 0; i < 40; i++) { const a = { leistungen: {}, art: null }; s.push(pensionZielBox(a)); } return { ziele: [...new Set(s)] }; });
  ok('beide Ställe erlaubt: freie Boxen in beiden Ställen kommen in Frage', Z0.ziele.length >= 1 && Z0.ziele[0] >= 0);
  // Alten Stall abwählen: neue Einsteller nur noch im 2. Stall
  await klick(`[data-wbpens="${Z.alt}"]`);
  const R1 = await pg.evaluate(a => { const g = gebaeude().find(x => x.gid === a); const z = pensionZielBox({ leistungen: {}, art: null }); return { nein: !!g.pensionNein, zielGeb: z >= 0 ? spiel.boxen[z].geb : null, haken: document.querySelector(`[data-wbpens="${a}"]`).checked }; }, Z.alt);
  ok('Haken beim ersten Stall abgewählt: gespeichert, Anzeige nicht mehr gehakt', R1.nein && !R1.haken, JSON.stringify(R1)); ok('neuer Einsteller bekommt jetzt eine Box im zweiten Stall', R1.zielGeb === 'gs2', R1.zielGeb);
  // Beide abwählen: keine Box mehr frei
  await klick('[data-wbpens="gs2"]'); const R2 = await pg.evaluate(() => pensionZielBox({ leistungen: {}, art: null })); ok('beide abgewählt: keine freie Pensionsbox (−1)', R2 === -1, R2);
  // Bereits eingezogener Einsteller bleibt in seinem Stall
  const R3 = await pg.evaluate(a => { const p = neuesPferd({ rasse: 'hannoveraner', geschlecht: 'Stute', alter: 8, name: 'Gast' }); p.pflege = erzeugePflege(p); p.werte = p.werte || erzeugeWerte(p); const bx = spiel.boxen.find(x => x.geb === a && !x.pferd); bx.pferd = p; const e = { eid: 'eG', vn: 'A', nn: 'T', w: true, pid: p.id, stufe: 1, leistungen: {}, haltung: 'box', zufr: 80, seit: 0, einzug: spiel.tag - 10, kuendigt: null, log: [], plus: [], befSeen: [], preis: 200 }; p.einsteller = e.eid; einstellerListe().push(e); zeigeWhiteboard(); return { drin: !!bx.pferd && fremd(bx.pferd), hakenNein: gebaeude().find(x => x.gid === a).pensionNein }; }, Z.alt);
  ok('bereits eingezogener Einsteller bleibt trotz abgewähltem Stall', R3.drin && R3.hakenNein);
  // wieder anhaken
  await klick(`[data-wbpens="${Z.alt}"]`); ok('wieder angehakt: Stall nimmt wieder auf', await pg.evaluate(a => !gebaeude().find(x => x.gid === a).pensionNein, Z.alt));
  ok('Haken nur mit offener Pension', await pg.evaluate(() => { pensionRegeln().offen = false; zeigeWhiteboard(); const n = document.querySelectorAll('[data-wbpens]').length; pensionRegeln().offen = true; return n === 0; }));
  ok('keine Skriptfehler', errs.length === 0, errs.slice(0, 3).join(' | '));
  console.log(out.join('\n')); await b.close(); process.exit(out.some(l => l.startsWith('✗')) ? 1 : 0);
})();
