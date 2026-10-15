// Tests ohne Zusatzpakete: node tests/run-tests.mjs
// Prüft Schaltplan-Logik, Praxisaufgaben, Lerninhalte, die Fehlerliste und die Versionsangaben.
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// Minimale Browser-Attrappen, damit die Module in Node laden
globalThis.localStorage = { getItem: () => null, setItem() {} };
globalThis.matchMedia = () => ({ matches: false, addEventListener() {} });
globalThis.MutationObserver = class { observe() {} };
globalThis.document = { documentElement: {}, getElementById: () => null };
globalThis.getComputedStyle = () => ({ getPropertyValue: () => '' });

let failed = 0, passed = 0;
const ok = (cond, msg) => { if (cond) passed++; else { failed++; console.log('  FEHLER: ' + msg); } };
const section = t => console.log('\n' + t);

const { ENGINE } = await import('../js/practice/schaltplan.js');
const verteiler = await import('../js/practice/verteiler.js');
const zs = await import('../js/practice/zaehlerschrank.js');
const pv = await import('../js/practice/pv.js');
const er = await import('../js/practice/erdung.js');
const { ABSCHNITTE, allNodes } = await import('../js/content/kurs.js');
const { ABZEICHEN } = await import('../js/content/abzeichen.js');

// ---------- Schaltplan ----------
section('Schaltplan-Trainer');
const W = list => list.map(([a, b]) => ({ a, b }));
const preComps = L => (L.pre || []).map((c, n) => Object.assign({}, c, { pre: true, seq: n - 1000 }));
const solComps = (L, mod) => { let cs = L.solution.comps.map((c, n) => Object.assign({}, c, { seq: n + 1 })); return mod ? mod(cs) : cs; };
function run(L, comps, wires, hints = true) {
  const B = ENGINE.board(L, comps);
  const res = ENGINE.runTests(B, W(wires), { hints });
  return { pass: res.complete && res.rows.length === res.steps.length && res.rows.every(r => r.ok), bad: res.rows.find(r => !r.ok), B };
}
for (const L of ENGINE.LEVELS) {
  if (L.free) continue;
  const comps = preComps(L).concat(solComps(L));
  const wires = (L.prewired || []).concat(L.solution.wires);
  const r = run(L, comps, wires);
  ok(r.pass, `${L.id}: Musterlösung besteht nicht (${r.bad && r.bad.err})`);
  ok(L.solution.wires.length === L.min, `${L.id}: Zielanzahl Adern ${L.min} passt nicht zur Lösung (${L.solution.wires.length})`);
  for (const c of r.B.comps) if (!c.pre) ok(ENGINE.placeOk(r.B, c.type, c.x, c.y, c.uid), `${L.id}: ${c.uid} steht an einem unzulässigen Platz`);
  for (const t of Object.keys(L.bom)) ok(L.palette.includes(t), `${L.id}: ${t} fehlt im Bauteilkasten`);
  ok(!run(L, preComps(L), L.prewired || []).pass, `${L.id}: leeres Blatt besteht`);
  console.log(`  ${L.id.padEnd(8)} ${r.pass ? 'ok' : 'FEHLER'}`);
}
const byId = id => ENGINE.LEVELS.find(l => l.id === id);
const expectFail = (id, label, opts, needle) => {
  const L = byId(id);
  let wires = (L.prewired || []).concat(opts.wires || L.solution.wires);
  if (opts.drop) wires = wires.filter(w => !opts.drop.some(d => d[0] === w[0] && d[1] === w[1]));
  if (opts.add) wires = wires.concat(opts.add);
  const r = run(L, preComps(L).concat(solComps(L, opts.mod)), wires);
  ok(!r.pass && (!needle || (r.bad.err || '').includes(needle)), `${id}: „${label}“ wird nicht erkannt (${r.bad ? r.bad.err : 'bestanden'})`);
};
expectFail('aus', 'Schalter im N', { wires: [['L', 'e1.X1'], ['e1.X2', 's1.t'], ['s1.b', 'N']] }, 'Neutralleiter');
expectFail('aus', 'Kurzschluss', { wires: [['L', 's1.t'], ['s1.b', 'N']] }, 'Kurzschluss');
expectFail('aus', 'falsches Bauteil', { mod: cs => cs.map(c => c.type === 'aus' ? Object.assign({}, c, { type: 'wechsel', root: 'top' }) : c), wires: [['L', 's1.P'], ['s1.1', 'e1.X1'], ['e1.X2', 'N']] }, 'Stückliste');
expectFail('selbst', 'ohne Selbsthaltung', { drop: [['a1.b', 'a3.t'], ['a3.b', 'q1.A1'], ['h1.X1', 'a3.b']], add: [['h1.X1', 'q1.A1']] }, 'parallel');
expectFail('motor', 'Phasen vertauscht', { wires: [['pf1.2', 'm1.3'], ['pf1.4', 'm1.1'], ['pf1.6', 'm1.5'], ['m1.2', 'f2.1'], ['m1.4', 'f2.3'], ['m1.6', 'f2.5'], ['f2.2', 'mo.U1'], ['f2.4', 'mo.V1'], ['f2.6', 'mo.W1'], ['PE', 'mo.PE']] }, 'links');
expectFail('motor', 'ohne PE', { drop: [['PE', 'mo.PE']] }, 'Schutzleiter');
expectFail('wende', 'ohne Verriegelung', { drop: [['s1.b', 'b2.t'], ['b2.b', 'pq1.A1'], ['s2.b', 'b1.t'], ['b1.b', 'pq2.A1']], add: [['s1.b', 'pq1.A1'], ['s2.b', 'pq2.A1'], ['b1.t', 'b1.b'], ['b2.t', 'b2.b']] }, 'Kurzschluss');
expectFail('wende', 'Öffner im eigenen Pfad', { mod: cs => cs.map(c => c.uid === 'b2' ? Object.assign({}, c, { of: 'pq1' }) : c.uid === 'b1' ? Object.assign({}, c, { of: 'pq2' }) : c) }, 'flattert');
expectFail('wende', 'Kontakte nicht zugeordnet', { mod: cs => cs.map(c => (c.type === 'no' || c.type === 'nc') ? Object.assign({}, c, { of: undefined }) : c) }, 'zu keinem Gerät');

// ---------- Verteiler ----------
section('Verteiler');
const T = verteiler.TASKS;
const items = task => Object.fromEntries(((task.preItems || []).concat(task.items)).map(x => [x.uid, x]));
const rowsOf = (task, layout) => { const it = items(task); return layout.map(r => r.map(u => it[u])); };
const good = rowsOf(T.wohnung, [['hs', 'spd'], ['fi1', 'l1', 'l2', 'l3', 'l4'], ['fi2', 'l5', 'l6', 'l7', 'herd'], []]);
ok(verteiler.checkBoard(T.wohnung, good).length === 0, 'Wohnungsverteiler: richtige Belegung meldet Fehler: ' + verteiler.checkBoard(T.wohnung, good).join(' | '));
const noRcd = rowsOf(T.wohnung, [['hs', 'spd', 'l1', 'l2'], ['fi1', 'l3', 'l4'], ['fi2', 'l5', 'l6', 'l7', 'herd'], []]);
ok(verteiler.checkBoard(T.wohnung, noRcd).some(e => e.includes('durch keinen FI')), 'Wohnung: LS ohne FI wird nicht erkannt');
const acUsed = rowsOf(T.wohnung, [['hs', 'spd'], ['x1', 'l1', 'l2', 'l3', 'l4'], ['fi2', 'l5', 'l6', 'l7', 'herd'], ['fi1']]);
ok(verteiler.checkBoard(T.wohnung, acUsed).some(e => e.includes('Typ AC')), 'Wohnung: FI Typ AC wird nicht erkannt');
const wbGood = rowsOf(T.wallbox, [['hs', 'spd'], ['fi1', 'l1', 'l2', 'l3', 'l4'], ['fi2', 'l5', 'l6', 'l7', 'herd'], ['wfi', 'wls']]);
ok(verteiler.checkBoard(T.wallbox, wbGood).length === 0, 'Wallbox: richtige Belegung meldet Fehler: ' + verteiler.checkBoard(T.wallbox, wbGood).join(' | '));
const wbShared = rowsOf(T.wallbox, [['hs', 'spd'], ['fi1', 'l1', 'l2', 'l3', 'l4'], ['fi2', 'l5', 'l6', 'l7', 'herd', 'wls'], ['wfi']]);
ok(verteiler.checkBoard(T.wallbox, wbShared).some(e => e.includes('eigenen FI')), 'Wallbox: geteilter FI wird nicht erkannt');
console.log('  Prüfungen erledigt');

// ---------- Zählerschrank ----------
section('Zählerschrank');
const right = { schiene: 'nar', sls: 'nar', kombi: 'aar', hs: 'aar', abzweig: 'aar', ehz: 'zf', smgw: 'rfz', steuer: 'rfz', router: 'apz', rcd: 'vf', ls: 'vf' };
ok(zs.checkCabinet(right).length === 0, 'richtige Bestückung meldet Fehler: ' + zs.checkCabinet(right).map(e => e.text).join(' | '));
ok(zs.checkCabinet(Object.assign({}, right, { nh: 'nar' })).some(e => e.id === 'nh'), 'Hausanschlusssicherung im Schrank wird nicht erkannt');
ok(zs.checkCabinet(Object.assign({}, right, { smgw: 'aar' })).some(e => e.id === 'smgw'), 'Gateway im AAR wird nicht erkannt');
ok(zs.checkCabinet(Object.assign({}, right, { ls: 'aar' })).some(e => e.id === 'ls'), 'LS im AAR wird nicht erkannt');
console.log('  Prüfungen erledigt');

// ---------- PV ----------
section('PV-Dachplanung');
const R = pv.ROOF, mods = [];
for (let r = 0; r < 3; r++) for (let c = 0; c < 8; c++) {
  const m = { x: R.margin + c * (R.module.a + 0.02), y: R.margin + r * (R.module.b + 0.02), w: R.module.a, h: R.module.b };
  mods.push(m);
}
const valid = mods.filter(m => !pv.moduleIssue(m, []));
ok(valid.length === 20, `Raster ergibt ${valid.length} gültige Module statt 20`);
ok(valid.every(m => !pv.moduleIssue(m, valid)), 'Gültige Module stören sich gegenseitig');
ok(pv.kWp(valid) >= R.targetKWp, 'Ziel-kWp mit dem Raster nicht erreichbar');
ok(!!pv.moduleIssue({ x: 7.5, y: 0.6, w: R.module.a, h: R.module.b }, []), 'Modul auf dem Schornstein wird nicht erkannt');
ok(!!pv.moduleIssue({ x: 0.1, y: 0.3, w: R.module.a, h: R.module.b }, []), 'Randabstand wird nicht erkannt');
console.log(`  ${valid.length} Module, ${pv.kWp(valid).toFixed(2)} kWp`);

// Strings: Spannungen und Verschaltung
const [smin, smax] = pv.stringRange();
ok(smin === 8 && smax === 22, `Stringlänge ${smin} bis ${smax} statt 8 bis 22`);
ok(Math.abs(pv.vocCold(1) - 42.25) < 0.01, `Uoc bei Kälte ${pv.vocCold(1).toFixed(2)} V statt 42,25 V`);
ok(Math.abs(pv.vmppHot(1) - 27.94) < 0.01, `Umpp bei Hitze ${pv.vmppHot(1).toFixed(2)} V statt 27,94 V`);
ok(!!pv.stringIssue(7) && !pv.stringIssue(8) && !pv.stringIssue(22) && !!pv.stringIssue(23) && !!pv.stringIssue(24), 'Grenzen der Stringlänge falsch');
ok(/1\.0\d\d V/.test(pv.stringIssue(24)), 'Überspannung wird nicht mit Spannung erklärt');
const at = (r, c) => mods.indexOf(mods.find(m => Math.abs(m.y - (R.margin + r * (R.module.b + 0.02))) < 1e-6 && Math.abs(m.x - (R.margin + c * (R.module.a + 0.02))) < 1e-6));
valid.forEach(m => { m.id = mods.indexOf(m) + 1; });
const id = (r, c) => at(r, c) + 1;
const sA = [id(1, 0), id(0, 0), id(0, 1), id(0, 2), id(0, 3), id(0, 4), id(0, 5), id(1, 5), id(1, 4), id(1, 3)];
const sB = [id(1, 1), id(1, 2), id(2, 2), id(2, 3), id(2, 4), id(2, 5), id(2, 6), id(2, 7), id(1, 7), id(1, 6)];
ok(sA.concat(sB).every(i => valid.some(m => m.id === i)), 'Teststrings enthalten ungültige Module');
let se = pv.checkStrings(valid, [sA, sB]);
ok(se.length === 0, `Gültige Verschaltung abgelehnt: ${se.join(' | ')}`);
ok(pv.checkStrings(valid, [sB.slice().reverse().concat(sA), []]).length === 0, 'Ein String mit 20 Modulen wird abgelehnt');
ok(pv.checkStrings(valid, [[], []]).length === 1, 'Fehlende Verschaltung wird nicht gemeldet');
ok(pv.checkStrings(valid, [sA, sB.slice(0, 9)]).some(e => /keinem String/.test(e)), 'Freies Modul wird nicht erkannt');
ok(pv.checkStrings(valid, [sA, [id(1, 1), id(2, 7), ...sB.slice(2, 7), id(1, 2), id(1, 7), id(1, 6)]]).some(e => /nicht nebeneinander/.test(e)), 'Sprung im String wird nicht erkannt');
ok(pv.checkStrings(valid, [sA.slice(0, 5), sA.slice(5), sB]).some(e => /MPP-Tracker/.test(e)), 'Zu viele Strings werden nicht erkannt');
ok(pv.checkStrings(valid, [sA.slice(0, 4), sA.slice(4).concat(sB)]).some(e => /String 1 mit 4 Modulen/.test(e)), 'Zu kurzer String wird nicht erkannt');
ok(pv.checkStrings(valid, [sA, sB.concat([sA[0]])]).some(e => /zwei Strings/.test(e)), 'Doppelt verschaltetes Modul wird nicht erkannt');
ok(pv.neighbors(valid.find(m => m.id === id(0, 0)), valid.find(m => m.id === id(0, 1))) && !pv.neighbors(valid.find(m => m.id === id(0, 0)), valid.find(m => m.id === id(1, 1))), 'Nachbarschaft falsch erkannt');
console.log(`  Strings ${smin} bis ${smax} Module, Verschaltung geprüft`);

// ---------- Erdung ----------
section('Erdungsmessung');
const p = { rho: 100, r: 0.9, par: 1.2 };
ok(Math.abs(er.measured(p, 40, 0.618, true) / er.trueR(p) - 1) < 0.005, '62-%-Regel trifft den wahren Wert nicht');
ok(er.measured(p, 40, 0.72, true) / er.measured(p, 40, 0.52, true) < 1.1, 'Kein Plateau bei 40 m');
ok(er.measured(p, 8, 0.72, true) / er.measured(p, 8, 0.52, true) > 1.1, 'Bei 8 m sollte es kein Plateau geben');
ok(er.measured(p, 40, 0.62, false) < er.trueR(p) / 5, 'Geschlossene Trennstelle senkt den Wert nicht');
console.log(`  wahrer Wert ${er.trueR(p).toFixed(2)} Ω`);

// Prüft eine Aufgabe aus Lernpfad oder Berufsschule auf vollständige, gültige Angaben
function checkItem(it, where) {
  ok(typeof it.q === 'string' && it.q.length > 5, `${where}: Frage fehlt`);
  ok(typeof it.x === 'string' && it.x.length > 5, `${where}: Erklärung fehlt`);
  switch (it.t) {
    case 'choice': ok(Array.isArray(it.a) && it.a.length >= 2 && new Set(it.a).size === it.a.length && Number.isInteger(it.r) && it.r >= 0 && it.r < it.a.length, `${where}: Auswahl ungültig`); break;
    case 'multi': ok(Array.isArray(it.a) && Array.isArray(it.r) && it.r.length >= 1 && it.r.every(k => k >= 0 && k < it.a.length), `${where}: Mehrfachauswahl ungültig`); break;
    case 'tf': ok(typeof it.r === 'boolean', `${where}: richtig/falsch ohne Lösung`); break;
    case 'order': ok(Array.isArray(it.a) && it.a.length >= 3 && new Set(it.a).size === it.a.length, `${where}: Reihenfolge ungültig`); break;
    case 'match': ok(Array.isArray(it.a) && it.a.length >= 2 && it.a.every(p2 => p2.length === 2) && new Set(it.a.map(p2 => p2[1])).size === it.a.length, `${where}: Zuordnung ungültig`); break;
    case 'num': ok(Number.isFinite(it.r) && it.tol >= 0 && typeof it.unit === 'string', `${where}: Rechenaufgabe ungültig`); break;
    default: ok(false, `${where}: unbekannter Typ ${it.t}`);
  }
}

// ---------- Inhalte ----------
section('Lerninhalte');
// Gespeicherter Fortschritt hängt an den Knoten-IDs: eingefügte Knoten dürfen die alten Nummern nicht verschieben
const pvSec = ABSCHNITTE.find(s => s.id === 'pv');
ok(pvSec.nodes.map(n => n.id).join() === 'pv-1,pv-2,pv-strings,pv-3,pv-4', `PV-Knoten-IDs verschoben: ${pvSec.nodes.map(n => n.id).join()}`);
const levelIds = new Set(ENGINE.LEVELS.map(l => l.id));
const ids = new Set();
let itemsN = 0;
for (const s of ABSCHNITTE) {
  ok(s.id && s.title && s.short && Array.isArray(s.karte) && s.karte.length >= 3, `${s.id}: Kopfdaten oder Lernkarte unvollständig`);
  ok(s.nodes.length >= 3 && s.nodes[s.nodes.length - 1].kind === 'test', `${s.id}: muss mit einem Abschnittstest enden`);
  for (const n of s.nodes) {
    ok(!ids.has(n.id), `doppelte Knoten-ID ${n.id}`); ids.add(n.id);
    ok(!!n.title, `${n.id}: Titel fehlt`);
    if (n.kind === 'praxis') {
      const known = n.module === 'schaltplan' ? levelIds.has(n.task) : n.module === 'verteiler' ? !!T[n.task] : ['zaehlerschrank', 'erdung', 'pv'].includes(n.module);
      ok(known, `${n.id}: Praxisaufgabe ${n.module}/${n.task} gibt es nicht`);
    }
    if (n.kind !== 'lektion') continue;
    ok(n.items.length >= 4, `${n.id}: zu wenige Aufgaben`);
    n.items.forEach((it, i) => { itemsN++; checkItem(it, `${n.id} Aufgabe ${i + 1}`); });
  }
}
ok(new Set(ABZEICHEN.map(b => b.id)).size === ABZEICHEN.length, 'doppelte Abzeichen-ID');
console.log(`  ${ABSCHNITTE.length} Abschnitte, ${allNodes().length} Knoten, ${itemsN} Aufgaben`);

// ---------- Berufsschule ----------
section('Berufsschule');
const BS = await import('../js/content/schule/index.js');
ok(BS.LERNFELDER.map(b => b.nr).join() === '1,2,3,4,5,6,7,8,9,10,11,12,13', 'Lernfelder 1 bis 13 fehlen oder sind nicht in Reihenfolge');
ok([1, 2, 3, 4].every(j => BS.lernfelderOfYear(j).length >= 2), 'Ein Lehrjahr hat weniger als zwei Lernfelder');
ok(BS.LERNFELDER.reduce((n, b) => n + b.stunden, 0) === 1020, 'Zeitrichtwerte ergeben nicht 1.020 Stunden wie im Rahmenlehrplan');
const fachIds = new Set(BS.FAECHER.map(f => f.id));
const bsIds = new Set();
let bsItems = 0;
const perFach = {};
for (const b of BS.BLOECKE) {
  ok(b.id && b.title && b.ziel && Array.isArray(b.karte) && b.karte.length >= 3, `${b.id}: Kopfdaten oder Lernkarte unvollständig`);
  ok(b.lektionen.length >= 3, `${b.id}: zu wenige Lektionen`);
  ok(!ids.has(b.testId) && !bsIds.has(b.testId), `doppelte Test-ID ${b.testId}`); bsIds.add(b.testId);
  for (const l of b.lektionen) {
    ok(!ids.has(l.id) && !bsIds.has(l.id), `doppelte Lektions-ID ${l.id}`); bsIds.add(l.id);
    ok(!!l.title && fachIds.has(l.fach), `${l.id}: Titel oder Fach fehlt`);
    ok(l.items.length >= 5, `${l.id}: zu wenige Aufgaben`);
    l.items.forEach((it, i) => {
      bsItems++;
      const where = `${l.id} Aufgabe ${i + 1}`;
      ok(fachIds.has(it.f), `${where}: unbekanntes Fach ${it.f}`);
      perFach[it.f] = (perFach[it.f] || 0) + 1;
      checkItem(it, where);
    });
  }
  ok(BS.blockItems(b).length >= BS.TEST_COUNT, `${b.id}: zu wenige Aufgaben für den Test`);
}
for (const f of BS.FAECHER) ok((perFach[f.id] || 0) >= 20, `Fach ${f.title} hat nur ${perFach[f.id] || 0} Aufgaben`);
ok(BS.fachItems('fr', 1).every(it => !/^LF (5|6|7|8|9|10|11|12|13) /.test(it.tag)), 'Fachtraining 1. Lehrjahr enthält Stoff späterer Jahre');
for (const p of BS.PRUEFUNGEN) ok(p.blocks().flatMap(BS.blockItems).length >= p.count * 3, `${p.id}: zu kleiner Aufgabenpool`);
ok(BS.findLektion('lf5-1').block.id === 'lf5' && BS.lektionItems(BS.findLektion('lf5-1'))[0].tag.startsWith('LF 5 · '), 'Lektion lf5-1 oder ihre Kennzeichnung fehlt');
console.log(`  ${BS.LERNFELDER.length} Lernfelder und WiSo, ${bsIds.size - BS.BLOECKE.length} Lektionen, ${bsItems} Aufgaben`);
console.log('  ' + BS.FAECHER.map(f => `${f.title} ${perFach[f.id] || 0}`).join(', '));

// ---------- Fehler wiederholen ----------
section('Fehler wiederholen');
const FE = await import('../js/fehler.js');
const allItems = ABSCHNITTE.flatMap(s => s.nodes.filter(n => n.kind === 'lektion').flatMap(n => n.items))
  .concat(BS.BLOECKE.flatMap(b => b.lektionen.flatMap(l => l.items)));
const keys = new Set(allItems.map(FE.itemKey));
ok(keys.size === allItems.length, `Fragen-Schlüssel nicht eindeutig: ${allItems.length} Fragen, ${keys.size} Schlüssel`);
const q1 = BS.LERNFELDER[0].lektionen[0].items[0];
ok(FE.itemKey(q1) === FE.itemKey(BS.lektionItems(BS.LERNFELDER[0].lektionen[0])[0]), 'Kennzeichnung über der Frage ändert den Schlüssel');
ok(FE.itemKey(q1) !== FE.itemKey(Object.assign({}, q1, { q: q1.q + ' ' })), 'Geänderte Frage behält den alten Schlüssel');

// Liste: falsch hinein, zweimal hintereinander richtig wieder heraus
const L0 = {};
ok(!FE.noteAnswer(L0, 'a', true, '2026-10-01') && !L0.a, 'Richtige Antwort ohne Fehler landet in der Liste');
FE.noteAnswer(L0, 'a', false, '2026-10-01');
FE.noteAnswer(L0, 'a', false, '2026-10-02');
ok(L0.a && L0.a.n === 2 && L0.a.at === '2026-10-02' && L0.a.ok === 0, 'Fehlerzahl oder Datum falsch: ' + JSON.stringify(L0.a));
FE.noteAnswer(L0, 'a', true, '2026-10-03');
ok(L0.a && L0.a.ok === 1, 'Nach einmal richtig schon erledigt');
FE.noteAnswer(L0, 'a', false, '2026-10-04');
ok(L0.a && L0.a.ok === 0 && L0.a.n === 3, 'Fehler nach einmal richtig setzt die Folge nicht zurück');
FE.noteAnswer(L0, 'a', true, '2026-10-05');
FE.noteAnswer(L0, 'a', true, '2026-10-05');
ok(!L0.a, 'Nach zweimal hintereinander richtig nicht erledigt');

// Auswahl: höchstens 10, neueste zuerst, am selben Tag die häufigsten zuerst, unbekannte Schlüssel weg
const idx = new Map(allItems.slice(0, 15).map(it => [FE.itemKey(it), it]));
const ks = [...idx.keys()];
const L1 = { gibtsnicht: { at: '2026-10-09', n: 9, ok: 0 } };
ks.forEach((k, i) => { L1[k] = { at: i < 5 ? '2026-10-01' : '2026-10-05', n: i % 4 + 1, ok: 0 }; });
const pick = FE.pickFehler(L1, idx);
ok(pick.length === FE.FEHLER_MAX, `Runde hat ${pick.length} statt ${FE.FEHLER_MAX} Fragen`);
ok(FE.countFehler(L1, idx) === 15, 'Unbekannter Schlüssel wird mitgezählt');
const pk = pick.map(FE.itemKey);
ok(pk.slice(0, 10).every(k => L1[k].at === '2026-10-05'), 'Neueste Fehler kommen nicht zuerst');
ok(pk.every((k, i) => i === 0 || L1[pk[i - 1]].at > L1[k].at || L1[pk[i - 1]].n >= L1[k].n), 'Häufigste Fehler am selben Tag kommen nicht zuerst');
ok(FE.pickFehler({}, idx).length === 0 && FE.countFehler({}, idx) === 0, 'Leere Liste liefert Fragen');

// Gespeicherter Stand: alter Stand ohne Liste lädt weiter, neue Fehler werden gespeichert
const old = { v: 1, xp: 120, days: {}, streak: { count: 2, last: null }, goal: 30, done: { 'sicherheit-1': { at: '2026-10-13', best: 1, stars: 0, times: 1 } }, badges: {}, stats: { lessons: 1 }, settings: { sound: false } };
let saved = JSON.stringify(old);
globalThis.localStorage = { getItem: () => saved, setItem(k, v) { saved = v; } };
const { store: st2 } = await import('../js/store.js?fehler');
ok(st2.state.xp === 120 && st2.isDone('sicherheit-1') && st2.state.settings.sound === false, 'Alter Stand lädt nicht vollständig');
ok(st2.state.fehler && typeof st2.state.fehler === 'object' && Object.keys(st2.state.fehler).length === 0, 'Alter Stand bekommt keine leere Fehlerliste');
const kq = FE.itemKey(q1);
st2.noteAnswer(kq, false);
ok(JSON.parse(saved).fehler[kq].n === 1, 'Fehler wird nicht gespeichert');
st2.noteAnswer(kq, true); st2.noteAnswer(kq, true);
ok(!JSON.parse(saved).fehler[kq], 'Erledigter Fehler bleibt gespeichert');
st2.importJSON(JSON.stringify(Object.assign({}, old, { fehler: [1, 2] })));
ok(!Array.isArray(st2.state.fehler) && Object.keys(st2.state.fehler).length === 0, 'Kaputte Fehlerliste beim Laden einer Sicherung nicht ersetzt');
st2.importJSON(JSON.stringify(old));
ok(st2.state.xp === 120 && Object.keys(st2.state.fehler).length === 0, 'Sicherung ohne Fehlerliste lädt nicht');
console.log(`  ${keys.size} eindeutige Schlüssel, Liste und Speicher geprüft`);

// ---------- Version und Offline-Liste ----------
section('Version und Service Worker');
const sw = readFileSync(join(root, 'sw.js'), 'utf8');
const ver = readFileSync(join(root, 'js/version.js'), 'utf8');
const swV = /VERSION = '([^']+)'/.exec(sw)[1], appV = /APP_VERSION = '([^']+)'/.exec(ver)[1];
ok(swV === appV, `Version in sw.js (${swV}) und js/version.js (${appV}) unterscheiden sich`);
const core = /const CORE = \[([\s\S]*?)\];/.exec(sw)[1].match(/'([^']+)'/g).map(s => s.slice(1, -1));
for (const f of core) if (f !== './') ok(existsSync(join(root, f)), `sw.js nennt fehlende Datei ${f}`);
console.log(`  Version ${appV}, ${core.length} Dateien offline`);

console.log(`\n${passed} Prüfungen bestanden, ${failed} fehlgeschlagen.`);
process.exit(failed ? 1 : 0);
