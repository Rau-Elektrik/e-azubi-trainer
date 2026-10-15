// E-Azubi Trainer: App-Hülle mit Lernpfad, Werkstatt, Fortschritt und Profil.
import { store } from './store.js';
import { h, esc, icon, readColors, toast, sfx, announce, boltsSVG } from './ui.js';
import { ABSCHNITTE, findNode, sectionItems, XP } from './content/kurs.js';
import { ABZEICHEN } from './content/abzeichen.js';
import { BLOECKE, WISO, JAHRE, FAECHER, findFach, findBlock, findLektion, lernfelderOfYear, blockItems, lektionItems, fachItems,
  PRUEFUNGEN, findPruefung, PRUEF_NEED, pruefDoneId, XP_SCHULE, TEST_COUNT } from './content/schule/index.js';
import { runLesson } from './lesson.js';
import { APP_VERSION, REPO_URL } from './version.js';

// Praxis-Module werden erst geladen, wenn sie gebraucht werden
const MODULES = {
  schaltplan: () => import('./practice/schaltplan.js'),
  verteiler: () => import('./practice/verteiler.js'),
  zaehlerschrank: () => import('./practice/zaehlerschrank.js'),
  erdung: () => import('./practice/erdung.js'),
  pv: () => import('./practice/pv.js'),
  netz: () => import('./practice/netz.js')
};

const view = document.getElementById('view');
let mounted = null;      // aktives Praxis-Modul
let installEvt = null;   // gespeichertes Installationsangebot des Browsers

// ---------- Kopfzeile ----------
function renderTop() {
  const s = store.state, today = store.todayXP(), goal = s.goal;
  const pct = Math.min(100, Math.round(today / goal * 100));
  document.getElementById('top-streak').textContent = store.streakNow();
  document.getElementById('top-xp').textContent = `${s.xp.toLocaleString('de-DE')} XP`;
  const ring = document.getElementById('top-goal');
  ring.style.setProperty('--pct', pct);
  ring.querySelector('span').textContent = today >= goal ? '✓' : today;
  ring.setAttribute('aria-label', `Tagesziel: ${today} von ${goal} XP`);
}
store.subscribe(renderTop);

// ---------- Fortschritt im Lernpfad ----------
const isUnlocked = n => n.index === 0 || store.isDone(n.section.nodes[n.index - 1].id);
const currentOf = s => s.nodes.find(n => !store.isDone(n.id) && isUnlocked(n));
function activeSection() {
  const last = store.state.lastSection && ABSCHNITTE.find(s => s.id === store.state.lastSection);
  if (last && currentOf(last)) return last;
  return ABSCHNITTE.find(s => currentOf(s)) || ABSCHNITTE[0];
}
const kindIcon = n => n.kind === 'praxis' ? 'tool' : n.kind === 'test' ? 'shield' : 'book';
const kindName = n => n.kind === 'praxis' ? 'Praxis' : n.kind === 'test' ? 'Abschnittstest' : 'Lektion';

function checkBadges() {
  const s = store.state;
  for (const b of ABZEICHEN) if (b.test(s) && store.grantBadge(b.id)) setTimeout(() => toast(`Neues Abzeichen: ${b.title}`), 900);
}
function reward(xp, text) {
  const before = store.todayXP();
  store.addXP(xp);
  checkBadges();
  const goal = store.state.goal;
  toast(`+${xp} XP · ${text}`);
  if (before < goal && store.todayXP() >= goal) setTimeout(() => { toast('Tagesziel erreicht!'); sfx.win(); }, 1600);
}

// ---------- Ansicht: Lernpfad ----------
const OFFS = [0, -64, -92, -64, 0, 64, 92, 64];
function viewPfad() {
  const act = activeSection();
  const root = h('div', { class: 'path' });
  if (installEvt && !store.state.settings.installHint) {
    const hint = h('div', { class: 'note-card' },
      h('p', null, h('b', null, 'Als App installieren: '), 'Dann startet der Trainer vom Startbildschirm und läuft auch offline.'),
      h('div', { class: 'row' },
        h('button', { type: 'button', class: 'btn small primary', onclick: install }, 'Installieren'),
        h('button', { type: 'button', class: 'btn small ghost', onclick: () => { store.setSetting('installHint', true); render(); } }, 'Später')));
    root.append(hint);
  }
  for (const s of ABSCHNITTE) {
    const done = s.nodes.filter(n => store.isDone(n.id)).length;
    const head = h('section', { class: 'sec-head' + (s === act ? ' active' : ''), id: 'sec-' + s.id, 'aria-labelledby': 'sec-t-' + s.id },
      h('div', { class: 'sec-text' },
        h('p', { class: 'sec-nr' }, `Abschnitt ${s.nr} · ${done} von ${s.nodes.length}`),
        h('h2', { class: 'sec-title', id: 'sec-t-' + s.id }, s.title),
        h('p', { class: 'sec-intro' }, s.intro)),
      h('button', { type: 'button', class: 'btn small light', onclick: () => openKarte(s) }, h('span', { html: icon('card', 18) }), 'Lernkarte'));
    root.append(head);

    const cur = currentOf(s);
    const H = 48 + s.nodes.length * 96;
    const area = h('div', { class: 'nodes', style: `height:${H}px` });
    const pts = s.nodes.map((n, i) => [160 + OFFS[i % OFFS.length], 40 + i * 96]);
    let dDone = '', dOpen = '';
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], my = (y0 + y1) / 2;
      const seg = `M${x0} ${y0} C ${x0} ${my}, ${x1} ${my}, ${x1} ${y1} `;
      if (store.isDone(s.nodes[i - 1].id)) dDone += seg; else dOpen += seg;
    }
    area.innerHTML = `<svg class="cable" width="320" height="${H}" viewBox="0 0 320 ${H}" aria-hidden="true">
      <path d="${dOpen}" class="cable-open"/><path d="${dDone}" class="cable-done"/><path d="${dDone}" class="cable-glow"/><path d="${dDone}" class="cable-core"/></svg>`;
    s.nodes.forEach((n, i) => {
      const [x, y] = pts[i];
      const dn = store.isDone(n.id), un = isUnlocked(n), isCur = n === cur;
      const state = dn ? 'done' : isCur ? 'current' : un ? 'open' : 'locked';
      const size = isCur ? 76 : n.kind === 'test' ? 70 : 60;
      const b = h('button', {
        type: 'button', class: `node ${state} k-${n.kind}`,
        style: `left:${x - size / 2}px;top:${y - size / 2}px;width:${size}px;height:${size}px`,
        'aria-label': `${kindName(n)} ${n.title}, ${dn ? 'erledigt' : isCur ? 'jetzt dran' : un ? 'offen' : 'gesperrt'}`,
        html: icon(dn ? 'check' : un ? kindIcon(n) : 'lock', isCur ? 32 : 26)
      });
      if (isCur && s === act) area.append(h('div', { class: 'node-ring', style: `left:${x - 48}px;top:${y - 48}px` }));
      b.addEventListener('click', () => openBubble(area, n, x, y, state));
      area.append(b);
      if (n.kind === 'test') area.append(h('span', { class: 'node-tag', style: `left:${x + 42}px;top:${y - 9}px` }, 'Prüfung'));
    });
    root.append(area);
    if (cur && s === act) setTimeout(() => openBubble(area, cur, pts[cur.index][0], pts[cur.index][1], 'current', true), 0);
  }
  root.append(h('p', { class: 'path-end' }, 'Den Stoff der Berufsschule nach Lehrjahr und Lernfeld findest du unter „Schule“.'));
  view.append(root);
  const target = document.getElementById('sec-' + act.id);
  if (target && store.state.done && Object.keys(store.state.done).length) setTimeout(() => target.scrollIntoView({ block: 'start' }), 30);
}

function openBubble(area, n, x, y, state, quiet) {
  area.querySelectorAll('.bubble').forEach(b => b.remove());
  const left = Math.max(0, Math.min(320 - 230, x - 115));
  const b = h('div', { class: 'bubble ' + state, style: `left:${left}px;top:${y + 46}px`, role: 'dialog', 'aria-label': n.title });
  b.append(h('p', { class: 'bubble-kind' }, `${kindName(n)} ${n.index + 1} von ${n.section.nodes.length}`), h('p', { class: 'bubble-title' }, n.title));
  if (state === 'locked') {
    const prev = n.section.nodes[n.index - 1];
    b.append(h('p', { class: 'bubble-note' }, `Erst „${prev.title}“ abschließen.`));
  } else {
    const xp = n.kind === 'praxis' ? `bis +${XP.practice(3)} XP` : n.kind === 'test' ? `+${XP.testPass} XP` : `+${XP.lesson} XP`;
    const go = h('a', { class: 'btn primary wide', href: `#/${n.kind === 'praxis' ? 'praxis' : 'lektion'}/${n.id}` }, state === 'done' ? 'Wiederholen' : `Start · ${xp}`);
    b.append(go);
    if (!quiet) setTimeout(() => go.focus({ preventScroll: true }), 20);
  }
  area.append(b);
  if (!quiet) sfx.tick();
}

function openKarte(s) {
  const dlg = document.getElementById('karte');
  dlg.querySelector('h2').textContent = `Lernkarte · ${s.title}`;
  const ul = dlg.querySelector('ul');
  ul.innerHTML = '';
  s.karte.forEach(t => ul.append(h('li', null, t)));
  dlg.showModal();
}

// ---------- Ansicht: Lektion oder Abschnittstest ----------
function viewLektion(id) {
  const n = findNode(id);
  if (!n || n.kind === 'praxis') { location.hash = '#/pfad'; return; }
  if (!isUnlocked(n)) { toast('Diese Lektion ist noch gesperrt.'); location.hash = '#/pfad'; return; }
  document.body.classList.add('focus');
  const test = n.kind === 'test';
  const pool = test ? sectionItems(n.section) : n.items;
  const items = test ? shuffleTake(pool, XP.testCount) : pool;
  runLesson(view, {
    title: n.title, section: n.section, items, mode: test ? 'test' : 'lesson',
    onExit: () => { location.hash = '#/pfad'; },
    onDone: res => {
      const st = store.state;
      st.lastSection = n.section.id;
      if (test) {
        st.stats.tests++;
        if (res.passed) {
          store.complete(n.id, { score: res.score });
          reward(XP.testPass + (res.perfect ? XP.perfect : 0), 'Abschnitt gemeistert');
        } else store.save();
      } else {
        st.stats.lessons++;
        if (res.perfect) st.stats.perfect++;
        store.complete(n.id, { score: res.score });
        reward(XP.lesson + (res.perfect ? XP.perfect : 0), res.perfect ? 'fehlerfrei' : 'Lektion geschafft');
      }
      location.hash = '#/pfad';
    }
  });
}
function shuffleTake(arr, k) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; }
  return a.slice(0, Math.min(k, a.length));
}

// ---------- Ansicht: Praxis (aus dem Lernpfad oder aus der Werkstatt) ----------
async function viewPraxis({ module, task, title, sub, onDone, single = true }) {
  document.body.classList.add('focus');
  const box = h('div', { class: 'prax-body' });
  const back = h('a', { class: 'icon-btn plain', href: onDone ? '#/pfad' : '#/werkstatt', 'aria-label': 'Zurück', html: icon('back', 22) });
  view.append(h('header', { class: 'prax-head' }, back, h('div', null, h('p', { class: 'eyebrow' }, sub), h('h1', null, title))), box);
  const mod = await MODULES[module]();
  if (!view.contains(box)) return;
  mounted = mod.mount(box, { task, single, onDone });
}
function viewPraxisNode(id) {
  const n = findNode(id);
  if (!n || n.kind !== 'praxis') { location.hash = '#/pfad'; return; }
  if (!isUnlocked(n)) { toast('Diese Praxisaufgabe ist noch gesperrt.'); location.hash = '#/pfad'; return; }
  viewPraxis({
    module: n.module, task: n.task, title: n.title, sub: `Praxis · ${n.section.short}`,
    onDone: ({ stars = 1 } = {}) => {
      const st = store.state;
      st.lastSection = n.section.id;
      st.stats.practice++;
      store.complete(n.id, { stars });
      reward(XP.practice(stars), `${stars} von 3 Blitzen`);
      location.hash = '#/pfad';
    }
  });
}

// ---------- Ansicht: Werkstatt ----------
const TOOLS = [
  { id: 'schaltplan', title: 'Schaltplan-Trainer', text: 'Alle Schaltpläne von der Ausschaltung bis zur Wendeschaltung, frei wählbar.', icon: 'bolt', module: 'schaltplan', single: false },
  { id: 'frei', title: 'Freies Zeichenblatt', text: 'Eigene Stromlaufpläne mit allen 20 Bauteilen zeichnen. Die Anlage läuft sofort mit.', icon: 'grid', module: 'schaltplan', task: 'frei', single: false },
  { id: 'verteiler', title: 'Verteiler bestücken', text: 'Wohnungsverteiler mit Hauptschalter, Überspannungsschutz, FI und LS.', icon: 'cabinet', module: 'verteiler', task: 'wohnung' },
  { id: 'wallbox', title: 'Wallbox nachrüsten', text: 'Eigener Endstromkreis mit eigenem FI für 11 kW.', icon: 'plug', module: 'verteiler', task: 'wallbox' },
  { id: 'zaehlerschrank', title: 'Zählerschrank bestücken', text: 'NAR, Zählerfeld, RfZ, AAR und APZ nach VDE-AR-N 4100.', icon: 'meter', module: 'zaehlerschrank', task: 'standard' },
  { id: 'erdung', title: 'Erdungsmessung', text: 'Sondenmethode mit Hilfserder: Plateau finden und R_A bestimmen.', icon: 'earth', module: 'erdung', task: 'standard' },
  { id: 'pv', title: 'PV-Dachplanung', text: 'Module auf ein Süddach setzen und zu Strings für den Wechselrichter verschalten.', icon: 'sun', module: 'pv', task: 'standard' },
  { id: 'netz', title: 'Netz-Puzzle', text: 'Kacheln drehen, bis jede Lampe Strom hat. Zum Abschalten zwischendurch.', icon: 'path', module: 'netz' }
];
function viewWerkstatt(tool) {
  if (tool) {
    const t = TOOLS.find(x => x.id === tool);
    if (!t) { location.hash = '#/werkstatt'; return; }
    viewPraxis({
      module: t.module, task: t.task, title: t.title, sub: 'Werkstatt', single: t.single === undefined ? true : t.single,
      onDone: t.module === 'netz' || t.single === false ? undefined : () => { reward(5, 'Übung in der Werkstatt'); location.hash = '#/werkstatt'; }
    });
    return;
  }
  const root = h('div', { class: 'page-pad' },
    h('h1', { class: 'page-title' }, 'Werkstatt'),
    h('p', { class: 'page-lead' }, 'Hier übst du frei, ohne Reihenfolge. Jede gelöste Aufgabe bringt 5 XP.'));
  const grid = h('div', { class: 'tool-grid' });
  TOOLS.forEach(t => grid.append(h('a', { class: 'tool-card', href: `#/werkstatt/${t.id}` },
    h('span', { class: 'tool-ico', html: icon(t.icon, 26) }), h('span', { class: 'tool-title' }, t.title), h('span', { class: 'tool-text' }, t.text))));
  root.append(grid);
  view.append(root);
}

// ---------- Ansicht: Berufsschule ----------
// Lernfelder sind frei wählbar: Jede Berufsschule legt die Reihenfolge selbst fest.
const lehrjahr = () => store.state.settings.lehrjahr || 1;
const blockDone = b => b.lektionen.filter(l => store.isDone(l.id)).length + (store.isDone(b.testId) ? 1 : 0);
const blockPct = b => Math.round(blockDone(b) / (b.lektionen.length + 1) * 100);
const countItems = b => b.lektionen.reduce((n, l) => n + l.items.length, 0);

function lfCard(b) {
  const pct = blockPct(b);
  const meta = b.nr ? `${b.stunden} Stunden · ${countItems(b)} Aufgaben` : `Alle Lehrjahre · ${countItems(b)} Aufgaben`;
  return h('a', { class: 'lf-card' + (pct === 100 ? ' done' : ''), href: `#/schule/lf/${b.id}` },
    h('span', { class: 'lf-nr', 'aria-hidden': 'true' }, b.nr ? `LF ${b.nr}` : 'WiSo'),
    h('span', { class: 'lf-name' }, b.title),
    h('span', { class: 'lf-meta' }, meta,
      h('span', { class: 'topic-bar', role: 'img', 'aria-label': `${pct} Prozent erledigt` }, h('div', { class: pct === 100 ? 'full' : '', style: `width:${pct}%` })),
      `${pct} %`));
}

function viewSchule(parts) {
  const [sub, id] = parts;
  if (sub === 'lf') return viewSchulLF(id);
  if (sub === 'lektion') return viewSchulLektion(id);
  if (sub === 'test') return viewSchulTest(id);
  if (sub === 'fach') return viewSchulFach(id);
  if (sub === 'pruefung') return viewSchulPruefung(id);

  const jahr = lehrjahr();
  const J = JAHRE.find(j => j.nr === jahr);
  const root = h('div', { class: 'page-pad' },
    h('h1', { class: 'page-title' }, 'Berufsschule'),
    h('p', { class: 'page-lead' }, 'Elektroniker/-in für Energie- und Gebäudetechnik. Der Stoff folgt dem Rahmenlehrplan der KMK und der Ausbildungsordnung von 2021, sortiert nach Lehrjahr, Lernfeld und Fach.'));

  const seg = h('div', { class: 'seg year-seg', role: 'group', 'aria-label': 'Lehrjahr wählen' });
  JAHRE.forEach(j => seg.append(h('button', { type: 'button', class: 'btn small', 'aria-pressed': String(j.nr === jahr), 'aria-label': j.title,
    onclick: () => { store.setSetting('lehrjahr', j.nr); render(); } }, `${j.nr}.`)));
  root.append(h('section', { class: 'card' }, h('h2', { class: 'lbl' }, 'Dein Lehrjahr'), seg, h('p', { class: 'year-note' }, J.text)));

  root.append(h('h2', { class: 'lbl lbl-head' }, `Lernfelder im ${J.title}`));
  const list = h('div', { class: 'lf-list' });
  lernfelderOfYear(jahr).forEach(b => list.append(lfCard(b)));
  list.append(lfCard(WISO));
  root.append(list);
  root.append(h('p', { class: 'year-note' }, 'Welches Lernfeld gerade dran ist, legt deine Berufsschule fest. Du kannst jedes frei wählen, auch aus anderen Lehrjahren.'));

  root.append(h('h2', { class: 'lbl lbl-head' }, 'Training nach Fach'));
  const fg = h('div', { class: 'tool-grid' });
  FAECHER.forEach(f => {
    const n = fachItems(f.id, jahr).length;
    fg.append(h('a', { class: 'tool-card', href: `#/schule/fach/${f.id}` },
      h('span', { class: 'tool-ico', html: icon(f.icon, 26) }), h('span', { class: 'tool-title' }, f.title), h('span', { class: 'tool-text' }, f.text),
      h('span', { class: 'tool-count' }, `${n} Aufgaben bis ${jahr}. Lehrjahr`)));
  });
  root.append(fg);

  root.append(h('h2', { class: 'lbl lbl-head' }, 'Prüfungstraining'));
  const pg = h('div', { class: 'tool-grid' });
  PRUEFUNGEN.forEach(p => {
    const best = store.state.done[pruefDoneId(p)];
    pg.append(h('a', { class: 'tool-card', href: `#/schule/pruefung/${p.id}` },
      h('span', { class: 'tool-ico', html: icon('shield', 26) }), h('span', { class: 'tool-title' }, p.title), h('span', { class: 'tool-text' }, p.text),
      h('span', { class: 'tool-count' }, `${p.count} Aufgaben · ab ${p.ab}. Lehrjahr${best ? ` · bestes Ergebnis ${Math.round(best.best * 100)} %` : ''}`)));
  });
  root.append(pg);
  root.append(h('p', { class: 'year-note' }, 'Das Prüfungstraining übt den schriftlichen Teil. Bestanden ist es wie in der Gesellenprüfung ab 50 %. Die Arbeitsaufgabe und das Fachgespräch übst du im Betrieb.'));
  view.append(root);
}

function viewSchulLF(id) {
  const b = findBlock(id);
  if (!b) { location.hash = '#/schule'; return; }
  const sub = b.nr ? `${b.short} · ${b.jahr}. Lehrjahr · ${b.stunden} Stunden` : 'Begleitend in allen Lehrjahren · Prüfungsbereich in Teil 2';
  const root = h('div', { class: 'page-pad' });
  root.append(h('div', { class: 'lf-head' },
    h('a', { class: 'btn small ghost', href: '#/schule', style: 'justify-self:start' }, h('span', { html: icon('back', 18) }), 'Berufsschule'),
    h('p', { class: 'eyebrow' }, sub),
    h('h1', { class: 'lf-title' }, b.title),
    h('p', { class: 'page-lead' }, b.ziel),
    h('div', { class: 'row' }, h('button', { type: 'button', class: 'btn small', onclick: () => openKarte(b) }, h('span', { html: icon('card', 18) }), 'Lernkarte'))));

  const ul = h('ol', { class: 'lk-list' });
  b.lektionen.forEach((l, i) => {
    const dn = store.isDone(l.id);
    const counts = {};
    l.items.forEach(it => { counts[it.f] = (counts[it.f] || 0) + 1; });
    const tags = h('span', { class: 'fach-tags' }, Object.entries(counts).map(([f, n]) => h('span', { class: 'fach-tag' }, `${findFach(f).title} ${n}`)));
    ul.append(h('li', { class: 'lk' + (dn ? ' done' : '') },
      h('span', { class: 'lk-state', html: dn ? icon('check', 18) : String(i + 1), 'aria-label': dn ? 'erledigt' : `Lektion ${i + 1}` }),
      h('span', { class: 'lk-name' }, l.title, h('span', { class: 'lk-sub' }, `${l.items.length} Aufgaben`), tags),
      h('a', { class: 'btn small' + (dn ? '' : ' primary'), href: `#/schule/lektion/${l.id}` }, dn ? 'Wiederholen' : `Start · +${XP_SCHULE.lesson} XP`)));
  });
  const tdn = store.isDone(b.testId);
  ul.append(h('li', { class: 'lk test' + (tdn ? ' done' : '') },
    h('span', { class: 'lk-state', html: icon(tdn ? 'check' : 'shield', 18), 'aria-label': tdn ? 'bestanden' : 'Test' }),
    h('span', { class: 'lk-name' }, b.nr ? 'Lernfeldtest' : 'WiSo-Test', h('span', { class: 'lk-sub' }, `${TEST_COUNT} zufällige Aufgaben aus allen Lektionen, 80 % zum Bestehen`)),
    h('a', { class: 'btn small' + (tdn ? '' : ' primary'), href: `#/schule/test/${b.id}` }, tdn ? 'Nochmal' : `Test · +${XP_SCHULE.test} XP`)));
  root.append(ul);
  view.append(root);
}

function viewSchulLektion(id) {
  const l = findLektion(id);
  if (!l) { location.hash = '#/schule'; return; }
  const back = `#/schule/lf/${l.block.id}`;
  document.body.classList.add('focus');
  runLesson(view, {
    title: l.title, section: l.block, items: lektionItems(l), mode: 'lesson',
    onExit: () => { location.hash = back; },
    onDone: res => {
      const st = store.state;
      st.stats.lessons++;
      if (res.perfect) st.stats.perfect++;
      store.complete(l.id, { score: res.score });
      reward(XP_SCHULE.lesson + (res.perfect ? XP_SCHULE.perfect : 0), res.perfect ? 'fehlerfrei' : 'Lektion geschafft');
      location.hash = back;
    }
  });
}

function viewSchulTest(id) {
  const b = findBlock(id);
  if (!b) { location.hash = '#/schule'; return; }
  const back = `#/schule/lf/${b.id}`;
  document.body.classList.add('focus');
  runLesson(view, {
    title: `Test ${b.short}`, section: b, items: shuffleTake(blockItems(b), TEST_COUNT), mode: 'test',
    winText: b.nr ? 'Lernfeld bestanden!' : 'WiSo bestanden!', backText: 'Zurück zum Lernfeld',
    onExit: () => { location.hash = back; },
    onDone: res => {
      store.state.stats.tests++;
      if (res.passed) {
        store.complete(b.testId, { score: res.score });
        reward(XP_SCHULE.test + (res.perfect ? XP_SCHULE.perfect : 0), `${b.short} bestanden`);
      } else store.save();
      location.hash = back;
    }
  });
}

function viewSchulFach(id) {
  const f = findFach(id);
  const pool = f ? fachItems(f.id, lehrjahr()) : [];
  if (!pool.length) { location.hash = '#/schule'; return; }
  document.body.classList.add('focus');
  runLesson(view, {
    title: f.title, items: shuffleTake(pool, TEST_COUNT), mode: 'lesson',
    onExit: () => { location.hash = '#/schule'; },
    onDone: res => {
      const st = store.state;
      st.stats.lessons++;
      if (res.perfect) st.stats.perfect++;
      store.save();
      reward(XP_SCHULE.fach + (res.perfect ? XP_SCHULE.perfect : 0), `Training ${f.title}`);
      location.hash = '#/schule';
    }
  });
}

function viewSchulPruefung(id) {
  const p = findPruefung(id);
  if (!p) { location.hash = '#/schule'; return; }
  document.body.classList.add('focus');
  runLesson(view, {
    title: p.title, items: shuffleTake(p.blocks().flatMap(blockItems), p.count), mode: 'test', need: PRUEF_NEED,
    winText: 'Prüfung bestanden!', backText: 'Zurück zur Berufsschule',
    onExit: () => { location.hash = '#/schule'; },
    onDone: res => {
      store.state.stats.tests++;
      if (res.passed) {
        store.complete(pruefDoneId(p), { score: res.score });
        reward(XP_SCHULE.pruefung + (res.perfect ? XP_SCHULE.perfect : 0), `${p.title} bestanden`);
      } else store.save();
      location.hash = '#/schule';
    }
  });
}

// ---------- Ansicht: Fortschritt ----------
function viewFortschritt() {
  const s = store.state;
  const week = store.week();
  const max = Math.max(s.goal, ...week.map(d => d.xp));
  const names = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  const lessonsDone = Object.keys(s.done).length;
  const root = h('div', { class: 'page-pad' }, h('h1', { class: 'page-title' }, 'Fortschritt'));
  root.append(h('div', { class: 'tiles' },
    h('div', { class: 'tile' }, h('span', { class: 'lbl' }, 'Tagesserie'), h('b', { class: 'live' }, `${store.streakNow()} ${store.streakNow() === 1 ? 'Tag' : 'Tage'}`)),
    h('div', { class: 'tile' }, h('span', { class: 'lbl' }, 'XP gesamt'), h('b', null, s.xp.toLocaleString('de-DE'))),
    h('div', { class: 'tile' }, h('span', { class: 'lbl' }, 'Erledigt'), h('b', null, String(lessonsDone)))));
  const wk = week.reduce((a, d) => a + d.xp, 0);
  const chart = h('section', { class: 'card' },
    h('div', { class: 'card-head' }, h('h2', { class: 'lbl' }, 'Diese Woche'), h('b', null, `${wk} XP`)));
  const bars = h('div', { class: 'week', role: 'img', 'aria-label': 'XP der letzten sieben Tage: ' + week.map(d => `${names[new Date(d.key + 'T12:00').getDay()]} ${d.xp}`).join(', ') });
  week.forEach((d, i) => {
    const pct = d.xp ? Math.max(4, d.xp / max * 100) : 0;
    bars.append(h('div', { class: 'wk-col' },
      h('div', { class: 'wk-bar' + (i === 6 ? ' today' : ''), style: `height:${pct}%` }),
      h('span', null, names[new Date(d.key + 'T12:00').getDay()])));
  });
  chart.append(bars, h('p', { class: 'wk-goal' }, `Tagesziel: ${s.goal} XP`));
  root.append(chart);
  const topics = h('section', { class: 'card' }, h('h2', { class: 'lbl' }, 'Themen'));
  ABSCHNITTE.forEach(a => {
    const d = a.nodes.filter(n => store.isDone(n.id)).length, pct = Math.round(d / a.nodes.length * 100);
    topics.append(h('div', { class: 'topic' }, h('span', null, a.short),
      h('div', { class: 'topic-bar', role: 'img', 'aria-label': `${a.short}: ${pct} Prozent` }, h('div', { class: pct === 100 ? 'full' : '', style: `width:${pct}%` })),
      h('b', null, `${pct} %`)));
  });
  root.append(topics);
  const school = h('section', { class: 'card' }, h('h2', { class: 'lbl' }, 'Berufsschule'));
  BLOECKE.forEach(b => {
    const pct = blockPct(b);
    school.append(h('div', { class: 'topic' }, h('span', null, b.short),
      h('div', { class: 'topic-bar', role: 'img', 'aria-label': `${b.short}: ${pct} Prozent` }, h('div', { class: pct === 100 ? 'full' : '', style: `width:${pct}%` })),
      h('b', null, `${pct} %`)));
  });
  root.append(school);
  const badges = h('section', { class: 'card' }, h('h2', { class: 'lbl' }, 'Abzeichen'));
  const bg = h('div', { class: 'badges' });
  ABZEICHEN.forEach(b => {
    const got = !!s.badges[b.id];
    bg.append(h('div', { class: 'badge' + (got ? ' got' : ''), title: b.text },
      h('span', { class: 'badge-ico', html: icon(got ? b.icon : 'lock', 26) }), h('span', null, b.title)));
  });
  badges.append(bg);
  root.append(badges);
  view.append(root);
}

// ---------- Ansicht: Profil und Einstellungen ----------
function viewProfil() {
  const s = store.state;
  const root = h('div', { class: 'page-pad' }, h('h1', { class: 'page-title' }, 'Profil'));
  const goals = h('div', { class: 'seg', role: 'group', 'aria-label': 'Tagesziel' });
  [10, 30, 50, 100].forEach(g => goals.append(h('button', { type: 'button', class: 'btn small', 'aria-pressed': String(s.goal === g), onclick: () => { store.setGoal(g); render(); } }, `${g} XP`)));
  const sound = h('button', { type: 'button', class: 'switch', 'aria-pressed': String(s.settings.sound), onclick: () => { store.setSetting('sound', !store.state.settings.sound); render(); } },
    h('span', { class: 'switch-knob', 'aria-hidden': 'true' }), s.settings.sound ? 'Ton an' : 'Ton aus');
  root.append(h('section', { class: 'card' }, h('h2', { class: 'lbl' }, 'Tagesziel'), h('p', null, 'Wie viele XP willst du jeden Tag sammeln?'), goals));
  root.append(h('section', { class: 'card' }, h('h2', { class: 'lbl' }, 'Ton'), sound));

  const inst = h('section', { class: 'card' }, h('h2', { class: 'lbl' }, 'App installieren'));
  if (matchMedia('(display-mode: standalone)').matches) inst.append(h('p', null, 'Der Trainer läuft schon als installierte App.'));
  else if (installEvt) inst.append(h('p', null, 'Leg den Trainer auf deinen Startbildschirm. Er läuft dann auch offline.'), h('button', { type: 'button', class: 'btn primary', onclick: install }, 'Jetzt installieren'));
  else inst.append(h('p', null, 'iPhone und iPad: In Safari auf Teilen tippen, dann „Zum Home-Bildschirm“. Android und PC: im Browsermenü „App installieren“ oder „Zum Startbildschirm hinzufügen“ wählen.'));
  root.append(inst);

  const file = h('input', { type: 'file', accept: 'application/json,.json', class: 'sr-only', id: 'imp-file' });
  file.addEventListener('change', async () => {
    const f = file.files[0];
    if (!f) return;
    try { store.importJSON(await f.text()); toast('Fortschritt geladen.'); render(); }
    catch (e) { toast(e.message || 'Die Datei ließ sich nicht lesen.'); }
  });
  root.append(h('section', { class: 'card' }, h('h2', { class: 'lbl' }, 'Fortschritt sichern'),
    h('p', null, 'Dein Fortschritt liegt nur auf diesem Gerät. Mit einer Sicherung nimmst du ihn auf ein anderes Gerät mit.'),
    h('div', { class: 'row' },
      h('button', { type: 'button', class: 'btn', onclick: exportProgress }, h('span', { html: icon('download', 18) }), 'Sicherung speichern'),
      h('label', { class: 'btn', for: 'imp-file' }, h('span', { html: icon('upload', 18) }), 'Sicherung laden'), file)));

  const reset = h('div', { class: 'row' });
  const askReset = () => {
    reset.innerHTML = '';
    reset.append(h('p', { class: 'warn-text' }, 'Wirklich alles löschen? XP, Serie und erledigte Lektionen sind dann weg.'),
      h('button', { type: 'button', class: 'btn', onclick: () => { reset.innerHTML = ''; reset.append(resetBtn()); } }, 'Behalten'),
      h('button', { type: 'button', class: 'btn danger', onclick: () => { store.reset(); toast('Fortschritt gelöscht.'); render(); } }, 'Alles löschen'));
  };
  const resetBtn = () => h('button', { type: 'button', class: 'btn ghost', onclick: askReset }, 'Fortschritt zurücksetzen');
  reset.append(resetBtn());
  root.append(h('section', { class: 'card' }, h('h2', { class: 'lbl' }, 'Zurücksetzen'), reset));

  root.append(h('section', { class: 'card about' }, h('h2', { class: 'lbl' }, 'Über die App'),
    h('p', null, `E-Azubi Trainer, Version ${APP_VERSION}. Lern-App für Auszubildende im Elektrohandwerk.`),
    h('p', null, 'Der Bereich Berufsschule folgt dem KMK-Rahmenlehrplan für Elektroniker/-innen vom 18.12.2020 und der Elektroniker-Ausbildungsverordnung von 2021, Fachrichtung Energie- und Gebäudetechnik.'),
    h('p', null, 'Die Inhalte folgen unter anderem DIN VDE 0100, VDE-AR-N 4100 (Fassung 2026-04), DIN 18014, dem Messstellenbetriebsgesetz und § 14a EnWG. Verbindlich sind immer der Normtext und die TAB deines Netzbetreibers.'),
    h('p', null, 'Quellcode und Updates: ', h('a', { href: REPO_URL, target: '_blank', rel: 'noopener' }, REPO_URL.replace('https://', '')))));
  view.append(root);
}
function exportProgress() {
  const blob = new Blob([store.exportJSON()], { type: 'application/json' });
  const a = h('a', { href: URL.createObjectURL(blob), download: `e-azubi-fortschritt-${new Date().toISOString().slice(0, 10)}.json` });
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  toast('Sicherung gespeichert.');
}
async function install() {
  if (!installEvt) return;
  installEvt.prompt();
  const choice = await installEvt.userChoice.catch(() => null);
  installEvt = null;
  store.setSetting('installHint', true);
  if (choice && choice.outcome === 'accepted') toast('Installiert.');
  render();
}

// ---------- Router ----------
function render() {
  if (mounted) { try { mounted.unmount(); } catch (e) { /* schon weg */ } mounted = null; }
  document.body.classList.remove('focus');
  view.innerHTML = '';
  const parts = (location.hash.replace(/^#\/?/, '') || 'pfad').split('/');
  const [route, a] = parts;
  document.querySelectorAll('.nav a').forEach(l => l.setAttribute('aria-current', String(l.dataset.route === route)));
  switch (route) {
    case 'lektion': viewLektion(a); break;
    case 'praxis': viewPraxisNode(a); break;
    case 'werkstatt': viewWerkstatt(a); break;
    case 'schule': viewSchule(parts.slice(1)); break;
    case 'fortschritt': viewFortschritt(); break;
    case 'profil': viewProfil(); break;
    default: viewPfad();
  }
  renderTop();
  if (!document.body.classList.contains('focus')) window.scrollTo(0, 0);
}
window.addEventListener('hashchange', render);

// ---------- Installation und Updates ----------
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installEvt = e; if (!location.hash || location.hash === '#/pfad' || location.hash === '#/profil') render(); });
function showUpdate(worker) {
  const bar = document.getElementById('update');
  bar.hidden = false;
  bar.querySelector('button').onclick = () => { worker.postMessage('skipWaiting'); bar.querySelector('button').disabled = true; };
}
// Auf dem eigenen Rechner (localhost) ohne Service Worker, damit Änderungen sofort sichtbar sind. Mit ?sw testen.
const devHost = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) && !/[?&]sw\b/.test(location.search);
if ('serviceWorker' in navigator && location.protocol !== 'file:' && !devHost) {
  navigator.serviceWorker.register('sw.js').then(reg => {
    if (reg.waiting && navigator.serviceWorker.controller) showUpdate(reg.waiting);
    reg.addEventListener('updatefound', () => {
      const nw = reg.installing;
      if (!nw) return;
      nw.addEventListener('statechange', () => { if (nw.state === 'installed' && navigator.serviceWorker.controller) showUpdate(nw); });
    });
    document.addEventListener('visibilitychange', () => { if (!document.hidden) reg.update().catch(() => {}); });
  }).catch(() => { /* ohne Service Worker läuft die App trotzdem, nur nicht offline */ });
  // Nur neu laden, wenn eine ältere Version abgelöst wird, nicht beim allerersten Besuch
  const hadController = !!navigator.serviceWorker.controller;
  let reloading = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (!hadController || reloading) return; reloading = true; location.reload(); });
}

document.getElementById('karte').addEventListener('click', e => { if (e.target.closest('[data-close]') || e.target === e.currentTarget) e.currentTarget.close(); });
document.getElementById('app-version').textContent = APP_VERSION;
readColors();
render();
