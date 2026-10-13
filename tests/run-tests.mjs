// Tests ohne Zusatzpakete: node tests/run-tests.mjs
// Prüft Schaltplan-Logik, Praxisaufgaben, Lerninhalte und die Versionsangaben.
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

// ---------- Erdung ----------
section('Erdungsmessung');
const p = { rho: 100, r: 0.9, par: 1.2 };
ok(Math.abs(er.measured(p, 40, 0.618, true) / er.trueR(p) - 1) < 0.005, '62-%-Regel trifft den wahren Wert nicht');
ok(er.measured(p, 40, 0.72, true) / er.measured(p, 40, 0.52, true) < 1.1, 'Kein Plateau bei 40 m');
ok(er.measured(p, 8, 0.72, true) / er.measured(p, 8, 0.52, true) > 1.1, 'Bei 8 m sollte es kein Plateau geben');
ok(er.measured(p, 40, 0.62, false) < er.trueR(p) / 5, 'Geschlossene Trennstelle senkt den Wert nicht');
console.log(`  wahrer Wert ${er.trueR(p).toFixed(2)} Ω`);

// ---------- Inhalte ----------
section('Lerninhalte');
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
    n.items.forEach((it, i) => {
      itemsN++;
      const where = `${n.id} Aufgabe ${i + 1}`;
      ok(typeof it.q === 'string' && it.q.length > 5, `${where}: Frage fehlt`);
      ok(typeof it.x === 'string' && it.x.length > 5, `${where}: Erklärung fehlt`);
      switch (it.t) {
        case 'choice': ok(Array.isArray(it.a) && it.a.length >= 2 && Number.isInteger(it.r) && it.r >= 0 && it.r < it.a.length, `${where}: Auswahl ungültig`); break;
        case 'multi': ok(Array.isArray(it.a) && Array.isArray(it.r) && it.r.length >= 1 && it.r.every(k => k >= 0 && k < it.a.length), `${where}: Mehrfachauswahl ungültig`); break;
        case 'tf': ok(typeof it.r === 'boolean', `${where}: richtig/falsch ohne Lösung`); break;
        case 'order': ok(Array.isArray(it.a) && it.a.length >= 3 && new Set(it.a).size === it.a.length, `${where}: Reihenfolge ungültig`); break;
        case 'match': ok(Array.isArray(it.a) && it.a.length >= 2 && it.a.every(p2 => p2.length === 2) && new Set(it.a.map(p2 => p2[1])).size === it.a.length, `${where}: Zuordnung ungültig`); break;
        case 'num': ok(Number.isFinite(it.r) && it.tol >= 0 && typeof it.unit === 'string', `${where}: Rechenaufgabe ungültig`); break;
        default: ok(false, `${where}: unbekannter Typ ${it.t}`);
      }
    });
  }
}
ok(new Set(ABZEICHEN.map(b => b.id)).size === ABZEICHEN.length, 'doppelte Abzeichen-ID');
console.log(`  ${ABSCHNITTE.length} Abschnitte, ${allNodes().length} Knoten, ${itemsN} Aufgaben`);

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
