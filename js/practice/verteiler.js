// Praxis: Stromkreisverteiler bestücken. Vier Hutschienen mit je 12 Teilungseinheiten (TE).
// Ein FI schützt in seiner Reihe alle LS rechts von ihm bis zum nächsten FI (wie über die Kammschiene).
import { sfx, esc, announce } from '../ui.js';

export const DEV = {
  hs: { name: 'Hauptschalter 4-polig 63 A', short: 'Hauptschalter', te: 4, kind: 'hs' },
  spd: { name: 'Überspannungsschutz Typ 2', short: 'SPD Typ 2', te: 4, kind: 'spd' },
  rcdA: { name: 'FI-Schutzschalter 40 A, 30 mA, Typ A', short: 'FI Typ A', te: 4, kind: 'rcd', rcd: 'A' },
  rcdB: { name: 'FI-Schutzschalter 40 A, 30 mA, Typ B', short: 'FI Typ B', te: 4, kind: 'rcd', rcd: 'B' },
  rcdAC: { name: 'FI-Schutzschalter 40 A, 30 mA, Typ AC', short: 'FI Typ AC', te: 4, kind: 'rcd', rcd: 'AC' },
  ls: { name: 'LS-Schalter B16, 1-polig', short: 'B16', te: 1, kind: 'ls', poles: 1, char: 'B' },
  ls3: { name: 'LS-Schalter B16, 3-polig', short: 'B16 3p', te: 3, kind: 'ls', poles: 3, char: 'B' },
  lsC: { name: 'LS-Schalter C16, 1-polig', short: 'C16', te: 1, kind: 'ls', poles: 1, char: 'C' }
};
export const ROWS = 4, TE = 12;

const it = (uid, dev, circuit, extra) => Object.assign({ uid, dev, circuit }, extra);
const WOHNUNG = [
  it('hs', 'hs'), it('spd', 'spd'), it('fi1', 'rcdA'), it('fi2', 'rcdA'),
  it('l1', 'ls', 'Licht Wohnen und Flur'), it('l2', 'ls', 'Steckdosen Wohnen'), it('l3', 'ls', 'Steckdosen Küche'),
  it('l4', 'ls', 'Geschirrspüler'), it('l5', 'ls', 'Waschmaschine'), it('l6', 'ls', 'Bad'), it('l7', 'ls', 'Außensteckdose'),
  it('herd', 'ls3', 'Herd')
];

export const TASKS = {
  wohnung: {
    title: 'Wohnungsverteiler',
    text: 'Bestücke den Verteiler einer Wohnung. Reihe 1 beginnt mit dem Hauptschalter, danach der Überspannungsschutz. Verteile die Stromkreise auf zwei FI-Schutzschalter, damit bei einem Fehler nicht die ganze Wohnung dunkel ist.',
    items: WOHNUNG.concat([it('x1', 'rcdAC', null, { distractor: true }), it('x2', 'lsC', null, { distractor: true })]),
    pre: []
  },
  wallbox: {
    title: 'Wallbox nachrüsten',
    text: 'Die Wohnung ist fertig verteilt. Rüste eine Wallbox mit 11 kW nach. Die Wallbox hat eine eingebaute 6-mA-DC-Fehlerstromerkennung. Sie braucht einen eigenen Endstromkreis mit eigenem FI-Schutzschalter.',
    items: [it('wfi', 'rcdA'), it('wfiB', 'rcdB', null, { optional: true }), it('wls', 'ls3', 'Wallbox 11 kW'),
      it('x1', 'rcdAC', null, { distractor: true }), it('x3', 'ls', null, { distractor: true, label: 'B16 1-polig' })],
    pre: [
      ['hs', 'spd'],
      ['fi1', 'l1', 'l2', 'l3', 'l4'],
      ['fi2', 'l5', 'l6', 'l7', 'herd'],
      []
    ],
    preItems: WOHNUNG
  }
};

const teOf = row => row.reduce((s, x) => s + DEV[x.dev].te, 0);

// Prüft die Belegung: rows = [[item, ...], ...] (Reihenfolge links nach rechts)
export function checkBoard(task, rows) {
  const errors = [];
  const placed = new Set(rows.flat().map(x => x.uid));
  const all = (task.preItems || []).concat(task.items);
  for (const x of all) {
    if (x.distractor && placed.has(x.uid)) {
      const d = DEV[x.dev];
      errors.push(d.rcd === 'AC' ? 'Ein FI Typ AC ist in Deutschland für neue Anlagen nicht zulässig. Nimm mindestens Typ A.'
        : d.char === 'C' ? 'Für den Leitungsschutz in Wohnungen nimmt man Charakteristik B. Der C16 bleibt im Kasten.'
          : `${x.label || d.name} wird nicht gebraucht.`);
    } else if (!x.distractor && !x.optional && !placed.has(x.uid)) {
      errors.push(`${x.circuit ? 'LS für ' + x.circuit : DEV[x.dev].name} fehlt noch.`);
    }
  }
  rows.forEach((row, r) => { if (teOf(row) > TE) errors.push(`Reihe ${r + 1} ist zu voll: höchstens ${TE} TE.`); });
  const r1 = rows[0] || [];
  if (!r1.length || r1[0].dev !== 'hs') errors.push('Reihe 1 beginnt mit dem Hauptschalter.');
  else if (!r1[1] || r1[1].dev !== 'spd') errors.push('Der Überspannungsschutz sitzt direkt hinter dem Hauptschalter, vor den FI-Schutzschaltern.');
  rows.forEach((row, r) => row.forEach((x, i) => {
    const k = DEV[x.dev].kind;
    if ((k === 'hs' || k === 'spd') && !(r === 0 && i === (k === 'hs' ? 0 : 1))) errors.push(`${DEV[x.dev].short} steht an der falschen Stelle.`);
  }));
  // Schutzbereiche der FI
  const groups = [];
  rows.forEach(row => {
    let g = null;
    for (const x of row) {
      const d = DEV[x.dev];
      if (d.kind === 'rcd') { g = { rcd: x, ls: [] }; groups.push(g); }
      else if (d.kind === 'ls') {
        if (!g) errors.push(`${x.circuit || d.short} ist durch keinen FI-Schutzschalter geschützt. Setze den LS rechts hinter einen FI.`);
        else g.ls.push(x);
      }
    }
  });
  for (const g of groups) {
    if (!g.ls.length) errors.push(`Hinter dem ${DEV[g.rcd.dev].short} liegt kein Stromkreis.`);
    if (g.ls.length > 6) errors.push(`Ein FI schützt hier ${g.ls.length} Stromkreise. Verteile sie besser, höchstens 6 je FI.`);
    const wb = g.ls.find(x => /Wallbox/.test(x.circuit || ''));
    if (wb && g.ls.length > 1) errors.push('Die Wallbox braucht einen eigenen FI-Schutzschalter. Kein anderer Stromkreis darf dahinter liegen.');
  }
  const used = groups.filter(g => g.ls.length && !/Wallbox/.test(g.ls[0].circuit || ''));
  if (task === TASKS.wohnung && used.length < 2) errors.push('Verteile die Stromkreise auf zwei FI-Schutzschalter.');
  return [...new Set(errors)];
}

export function mount(container, opts = {}) {
  const task = TASKS[opts.task] || TASKS.wohnung;
  const ac = new AbortController();
  const byUid = {};
  (task.preItems || []).forEach(x => { byUid[x.uid] = Object.assign({ pre: true }, x); });
  task.items.forEach(x => { byUid[x.uid] = Object.assign({}, x); });
  const rows = Array.from({ length: ROWS }, (_, r) => (task.pre[r] || []).map(u => byUid[u]));
  let selected = null, tries = 0, solved = false;

  container.innerHTML = `
    <div class="prax vt">
      <p class="prax-task">${esc(task.text)}</p>
      <p class="lbl">Geräte im Kasten · antippen, dann eine Reihe antippen</p>
      <div class="vt-tray" role="group" aria-label="Geräte"></div>
      <div class="vt-tools" hidden>
        <span class="vt-selname"></span>
        <button class="btn small" type="button" data-act="left" aria-label="Nach links">◀</button>
        <button class="btn small" type="button" data-act="right" aria-label="Nach rechts">▶</button>
        <button class="btn small" type="button" data-act="back">In den Kasten</button>
      </div>
      <div class="vt-board" aria-label="Verteiler mit vier Hutschienen"></div>
      <div class="prax-actions">
        <button class="btn primary" type="button" data-act="check">Prüfen</button>
      </div>
      <div class="prax-result" aria-live="polite"></div>
    </div>`;
  const root = container.querySelector('.vt');
  const board = root.querySelector('.vt-board'), tray = root.querySelector('.vt-tray'), tools = root.querySelector('.vt-tools');
  const result = root.querySelector('.prax-result');

  const where = uid => { for (let r = 0; r < ROWS; r++) { const i = rows[r].findIndex(x => x.uid === uid); if (i >= 0) return [r, i]; } return null; };
  const devFace = (x, inTray) => {
    const d = DEV[x.dev];
    const b = document.createElement('button');
    b.type = 'button';
    b.className = `vt-dev k-${d.kind}${selected === x.uid ? ' sel' : ''}${x.pre ? ' pre' : ''}`;
    b.dataset.uid = x.uid;
    if (!inTray) b.style.gridColumn = `span ${d.te}`;
    b.setAttribute('aria-label', `${d.name}${x.circuit ? ', ' + x.circuit : ''}${x.pre ? ', vorgegeben' : ''}`);
    b.innerHTML = `<span class="vt-short">${esc(x.label || d.short)}</span>${x.circuit ? `<span class="vt-circ">${esc(x.circuit)}</span>` : ''}${inTray ? `<span class="vt-te">${d.te} TE</span>` : ''}`;
    return b;
  };
  function render() {
    board.innerHTML = '';
    rows.forEach((row, r) => {
      const rail = document.createElement('div');
      rail.className = 'vt-row' + (selected ? ' target' : '');
      rail.dataset.row = r;
      rail.setAttribute('role', 'button');
      rail.tabIndex = 0;
      rail.setAttribute('aria-label', `Reihe ${r + 1}, ${teOf(row)} von ${TE} TE belegt`);
      rail.innerHTML = `<span class="vt-rlabel">${r + 1}</span>`;
      const grid = document.createElement('div');
      grid.className = 'vt-grid';
      row.forEach(x => grid.append(devFace(x, false)));
      rail.append(grid);
      board.append(rail);
    });
    tray.innerHTML = '';
    const placed = new Set(rows.flat().map(x => x.uid));
    task.items.filter(x => !placed.has(x.uid)).forEach(x => tray.append(devFace(x, true)));
    const s = selected && byUid[selected];
    const pos = s && where(s.uid);
    tools.hidden = !(s && pos && !s.pre);
    if (s) tools.querySelector('.vt-selname').textContent = DEV[s.dev].short + (s.circuit ? ' · ' + s.circuit : '');
  }
  function clearResult() { result.innerHTML = ''; }

  root.addEventListener('click', e => {
    if (solved) return;
    const devB = e.target.closest('.vt-dev');
    const act = e.target.closest('[data-act]');
    if (act) {
      const a = act.dataset.act;
      if (a === 'check') { check(); return; }
      const pos = selected && where(selected);
      if (!pos) return;
      const [r, i] = pos, row = rows[r];
      if (a === 'left' && i > 0 && !row[i - 1].pre) { [row[i - 1], row[i]] = [row[i], row[i - 1]]; }
      if (a === 'right' && i < row.length - 1) { [row[i + 1], row[i]] = [row[i], row[i + 1]]; }
      if (a === 'back') { row.splice(i, 1); selected = null; }
      sfx.tick(); clearResult(); render();
      return;
    }
    if (devB) {
      const x = byUid[devB.dataset.uid];
      if (x.pre) { sfx.thunk(); announce('Dieses Gerät ist vorgegeben.'); return; }
      selected = selected === x.uid ? null : x.uid;
      sfx.tick(); render();
      e.stopPropagation();
      return;
    }
    const rail = e.target.closest('.vt-row');
    if (rail && selected) placeIn(+rail.dataset.row);
  });
  root.addEventListener('keydown', e => {
    const rail = e.target.closest('.vt-row');
    if (rail && e.target === rail && (e.key === 'Enter' || e.key === ' ') && selected) { e.preventDefault(); placeIn(+rail.dataset.row); }
  });
  function placeIn(r) {
    const x = byUid[selected];
    const pos = where(x.uid);
    const row = rows[r];
    const free = TE - teOf(row) + (pos && pos[0] === r ? DEV[x.dev].te : 0);
    if (DEV[x.dev].te > free) { sfx.thunk(); announce(`In Reihe ${r + 1} ist kein Platz mehr.`); result.innerHTML = `<div class="prax-bad">In Reihe ${r + 1} ist nicht genug Platz für ${esc(DEV[x.dev].short)} (${DEV[x.dev].te} TE).</div>`; return; }
    if (pos) rows[pos[0]].splice(pos[1], 1);
    row.push(x);
    selected = null;
    sfx.place(); clearResult(); render();
  }
  function check() {
    const errors = checkBoard(task, rows);
    if (errors.length) {
      tries++;
      sfx.fail();
      result.innerHTML = `<div class="prax-bad"><b>Noch ${errors.length} Fehler.</b><ul>${errors.slice(0, 5).map(t => `<li>${esc(t)}</li>`).join('')}</ul></div>`;
      announce(`Noch ${errors.length} Fehler.`);
      return;
    }
    solved = true; selected = null; render();
    const stars = tries === 0 ? 3 : tries <= 2 ? 2 : 1;
    sfx.win();
    result.innerHTML = `<div class="prax-ok"><b>Verteiler richtig bestückt.</b><p>${task === TASKS.wallbox ? 'Die Wallbox hat ihren eigenen Endstromkreis mit eigenem FI und 3-poligem LS.' : 'Hauptschalter, Überspannungsschutz, dann die Stromkreise aufgeteilt auf zwei FI.'} Vergiss in echt die Beschriftung nicht.</p>${opts.onDone ? '<button class="btn primary" type="button" data-done>Weiter</button>' : ''}</div>`;
    const done = result.querySelector('[data-done]');
    if (done) { done.addEventListener('click', () => opts.onDone({ stars })); done.focus(); }
    announce('Verteiler richtig bestückt.');
  }
  render();
  return { unmount() { ac.abort(); container.innerHTML = ''; } };
}
