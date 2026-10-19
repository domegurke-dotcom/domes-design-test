// Auswertung der Gesundheits-Studie: node tests/gesundheit-auswertung.js <Ordner> [rasse …] [--json]
const fs = require('fs'), path = require('path');
const [dir, ...rest] = process.argv.slice(2), alsJson = rest.includes('--json'), nur = rest.filter(x => x !== '--json');
const dateien = fs.readdirSync(dir).filter(f => f.endsWith('.json') && !f.startsWith('_')).filter(f => !nur.length || nur.includes(f.replace('.json', '')));
const TPJ = 7, JAHR = 4 * TPJ, KL = ['Fohlen', 'Jungpferd', 'Erwachsen', 'Senior'], NAME = { 3: 'gut', 2: 'mittel', 1: 'schlecht', 4: 'selbst' };
const r1 = x => Math.round(x * 10) / 10, r0 = Math.round;
function werte(L) {   // L = Läufe einer Pflegestufe
  const sum = f => L.reduce((a, M) => a + f(M), 0);
  const pjahre = sum(M => Object.values(M.lebendTage).reduce((a, b) => a + b, 0)) / JAHR;
  const B = L.flatMap(M => M.befunde), geheilt = B.filter(b => b.ende != null), namen = L[0].krankNamen, chron = L[0].chron;
  const art = {}; B.forEach(b => { art[b.art] = (art[b.art] || 0) + 1; });
  const kl = {}; KL.forEach(k => { const pj = sum(M => M.lebendTage[k] || 0) / JAHR; kl[k] = { proJahr: pj ? r1(B.filter(b => b.kl === k).length / pj) : 0, krank: r0(sum(M => M.krankTage[k] || 0) / Math.max(1, sum(M => M.lebendTage[k] || 0)) * 100) }; });
  const heil = geheilt.filter(b => !chron[b.art]).map(b => b.ende - b.start), bis = B.filter(b => b.bemerkt != null).map(b => b.bemerkt - b.start);
  const tod = {}; L.flatMap(M => M.tod).forEach(t => { const u = t.ursache.replace(/ –.*/, '').slice(0, 40); tod[u] = (tod[u] || 0) + 1; });
  const pferde = 40 * L.length, tot = sum(M => M.tod.length), weg = sum(M => 40 - M.lebendAmEnde - M.tod.length);
  return { pjahre: r0(pjahre), proJahr: r1(B.length / pjahre), krank: r0(sum(M => Object.values(M.krankTage).reduce((a, b) => a + b, 0)) / Math.max(1, sum(M => Object.values(M.lebendTage).reduce((a, b) => a + b, 0))) * 100),
    grad: r1(B.reduce((a, b) => a + b.max, 0) / Math.max(1, B.length)), schwer: r0(B.filter(b => b.max >= 4).length / Math.max(1, B.length) * 100),
    heilTage: heil.length ? r1(heil.reduce((a, b) => a + b, 0) / heil.length) : null, bemerktNach: bis.length ? r1(bis.reduce((a, b) => a + b, 0) / bis.length) : null,
    offen: r0(sum(M => M.offenAmEnde) / L.length), chronisch: r1(B.filter(b => chron[b.art]).length / pjahre),
    tot: r0(tot / pferde * 100), weg: r0(weg / pferde * 100), tod,
    tierarzt: r1(sum(M => M.tierarzt + M.kontrolle) / pjahre), kosten: r0(sum(M => M.kosten.tierarzt + M.kosten.klinik) / pjahre), huf: r0(sum(M => M.kosten.hufschmied) / pjahre),
    krankArbeit: r1(sum(M => M.krankArbeit) / sum(M => M.tage) / (pjahre * JAHR / sum(M => M.tage)) * 10), routine: r1(sum(M => M.routine) / sum(M => M.tage) / (pjahre * JAHR / sum(M => M.tage)) * 10),
    ges: L[0].ges, kl, top: Object.entries(art).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([k, n]) => [namen[k] || k, r1(n / pjahre * 100)]),
    fehler: [...new Set(L.flatMap(M => Object.keys(M.fehler)))] };
}
const alle = {};
dateien.forEach(f => { const e = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); alle[e.rasse] = Object.fromEntries(Object.entries(e.stufen).map(([st, L]) => [st, werte(Array.isArray(L) ? L : [L])])); });
if (alsJson) { console.log(JSON.stringify(alle)); process.exit(0); }
Object.entries(alle).forEach(([rasse, S]) => {
  console.log(`\n== ${rasse} ==`);
  [3, 2, 1].forEach(st => { const W = S[st]; if (!W) return;
    console.log(`${NAME[st].padEnd(8)} Befunde/Pferd/Jahr ${W.proJahr} · krank ${W.krank} % der Tage · Ø Grad ${W.grad} (schwer ${W.schwer} %) · Heilung Ø ${W.heilTage} T · bemerkt nach ${W.bemerktNach} T · chronisch ${W.chronisch}/PJ · tot ${W.tot} % · Tierschutz ${W.weg} % · Tierarzt ${W.tierarzt}/PJ · ${W.kosten} €/PJ Tierarzt + ${W.huf} € Huf · Arbeit/Tag je 10 Pferde: krank ${W.krankArbeit}, Routine ${W.routine}`);
    console.log(`         Alter: ${KL.map(k => `${k} ${W.kl[k].proJahr}/J ${W.kl[k].krank}%`).join(' · ')} | Tod: ${JSON.stringify(W.tod)} | Top (je 100 PJ): ${W.top.map(([n, x]) => `${n} ${x}`).join(', ')}${W.fehler.length ? ' | FEHLER ' + W.fehler.join('; ') : ''}`); });
});
