// Lektionsablauf: Aufgaben nacheinander, sofortige Rückmeldung mit Erklärung.
// In Lektionen kommen falsch beantwortete Aufgaben am Ende noch einmal. Im Abschnittstest nicht.
import { h, esc, icon, shuffle, sfx, announce } from './ui.js';

const parseNum = s => parseFloat(String(s).trim().replace(/\s/g, '').replace(/\.(?=\d{3}(\D|$))/g, '').replace(',', '.'));
const fmtNum = v => Number(v).toLocaleString('de-DE', { maximumFractionDigits: 3 });

// ---------- Aufgabentypen: jeder liefert { el, ready(), check() } ----------
const TYPES = {
  choice(item, onChange) {
    const opts = shuffle(item.a.map((text, i) => ({ text, i })));
    let pick = null;
    const el = h('div', { class: 'ex-options', role: 'radiogroup', 'aria-label': 'Antworten' });
    opts.forEach((o, n) => {
      const b = h('button', { type: 'button', class: 'ex-opt', role: 'radio', 'aria-checked': 'false' },
        h('span', { class: 'ex-key', 'aria-hidden': 'true' }, String.fromCharCode(65 + n)), h('span', { class: 'ex-txt' }, o.text));
      b.addEventListener('click', () => {
        pick = o.i;
        el.querySelectorAll('.ex-opt').forEach(x => { x.classList.toggle('sel', x === b); x.setAttribute('aria-checked', String(x === b)); });
        sfx.tick(); onChange();
      });
      o.btn = b;
      el.append(b);
    });
    return {
      el, ready: () => pick !== null,
      check() {
        const ok = pick === item.r;
        opts.forEach(o => { if (o.i === item.r) o.btn.classList.add('right'); else if (o.i === pick) o.btn.classList.add('wrong'); o.btn.disabled = true; });
        return { ok, solution: item.a[item.r] };
      }
    };
  },
  multi(item, onChange) {
    const opts = shuffle(item.a.map((text, i) => ({ text, i })));
    const picked = new Set();
    const el = h('div', { class: 'ex-options', role: 'group', 'aria-label': 'Mehrere Antworten möglich' });
    el.append(h('p', { class: 'ex-hint' }, 'Mehrere Antworten können richtig sein.'));
    opts.forEach(o => {
      const b = h('button', { type: 'button', class: 'ex-opt', 'aria-pressed': 'false' },
        h('span', { class: 'ex-box', 'aria-hidden': 'true' }), h('span', { class: 'ex-txt' }, o.text));
      b.addEventListener('click', () => {
        if (picked.has(o.i)) picked.delete(o.i); else picked.add(o.i);
        b.classList.toggle('sel', picked.has(o.i)); b.setAttribute('aria-pressed', String(picked.has(o.i)));
        sfx.tick(); onChange();
      });
      o.btn = b; el.append(b);
    });
    return {
      el, ready: () => picked.size > 0,
      check() {
        const want = new Set(item.r);
        const ok = picked.size === want.size && [...picked].every(i => want.has(i));
        opts.forEach(o => { if (want.has(o.i)) o.btn.classList.add('right'); else if (picked.has(o.i)) o.btn.classList.add('wrong'); o.btn.disabled = true; });
        return { ok, solution: item.r.map(i => item.a[i]).join(' · ') };
      }
    };
  },
  tf(item, onChange) {
    let pick = null;
    const el = h('div', { class: 'ex-tf', role: 'radiogroup', 'aria-label': 'Richtig oder falsch' });
    const mk = (val, label) => {
      const b = h('button', { type: 'button', class: 'ex-opt big', role: 'radio', 'aria-checked': 'false' }, label);
      b.addEventListener('click', () => {
        pick = val;
        el.querySelectorAll('.ex-opt').forEach(x => { x.classList.toggle('sel', x === b); x.setAttribute('aria-checked', String(x === b)); });
        sfx.tick(); onChange();
      });
      b.dataset.val = String(val);
      return b;
    };
    el.append(mk(true, 'Richtig'), mk(false, 'Falsch'));
    return {
      el, ready: () => pick !== null,
      check() {
        const ok = pick === item.r;
        el.querySelectorAll('.ex-opt').forEach(b => { const v = b.dataset.val === 'true'; if (v === item.r) b.classList.add('right'); else if (v === pick) b.classList.add('wrong'); b.disabled = true; });
        return { ok, solution: item.r ? 'Die Aussage ist richtig.' : 'Die Aussage ist falsch.' };
      }
    };
  },
  order(item, onChange) {
    let bank = shuffle(item.a.map((text, i) => ({ text, i })));
    if (bank.every((b, n) => b.i === n)) bank = bank.slice(1).concat(bank[0]);
    const line = [];
    const el = h('div', { class: 'ex-order' });
    const lineEl = h('ol', { class: 'ex-line', 'aria-label': 'Deine Reihenfolge' });
    const bankEl = h('div', { class: 'ex-bank', 'aria-label': 'Bausteine' });
    el.append(lineEl, bankEl);
    let locked = false;
    function render() {
      lineEl.innerHTML = ''; bankEl.innerHTML = '';
      line.forEach((o, n) => {
        const b = h('button', { type: 'button', class: 'ex-chip in' }, h('span', { class: 'ex-n' }, `${n + 1}.`), o.text);
        b.disabled = locked;
        b.addEventListener('click', () => { line.splice(n, 1); bank.push(o); sfx.tick(); render(); onChange(); });
        o.btn = b;
        lineEl.append(h('li', null, b));
      });
      if (!line.length) lineEl.append(h('li', { class: 'ex-empty' }, 'Tippe die Bausteine unten in der richtigen Reihenfolge an.'));
      bank.forEach(o => {
        const b = h('button', { type: 'button', class: 'ex-chip' }, o.text);
        b.disabled = locked;
        b.addEventListener('click', () => { bank = bank.filter(x => x !== o); line.push(o); sfx.tick(); render(); onChange(); });
        bankEl.append(b);
      });
    }
    render();
    return {
      el, ready: () => line.length === item.a.length,
      check() {
        locked = true;
        const ok = line.every((o, n) => o.i === n);
        render();
        line.forEach((o, n) => o.btn.classList.add(o.i === n ? 'right' : 'wrong'));
        return { ok, solution: item.a.map((t, n) => `${n + 1}. ${t}`).join('\n') };
      }
    };
  },
  match(item, onChange) {
    const left = item.a.map((p, i) => ({ text: p[0], i }));
    const right = shuffle(item.a.map((p, i) => ({ text: p[1], i })));
    let selL = null, done = 0, misses = 0;
    const el = h('div', { class: 'ex-match' });
    const colL = h('div', { class: 'ex-col', role: 'group', 'aria-label': 'Begriffe' });
    const colR = h('div', { class: 'ex-col', role: 'group', 'aria-label': 'Zuordnungen' });
    el.append(colL, colR);
    const tryPair = r => {
      if (selL === null) return;
      if (selL.i === r.i) {
        selL.btn.classList.add('right'); r.btn.classList.add('right');
        selL.btn.disabled = true; r.btn.disabled = true;
        selL.btn.classList.remove('sel');
        done++; selL = null; sfx.right();
        if (done === left.length) onChange(true);
      } else {
        misses++; sfx.wrong();
        r.btn.classList.add('shake'); setTimeout(() => r.btn.classList.remove('shake'), 400);
      }
    };
    left.forEach(o => {
      o.btn = h('button', { type: 'button', class: 'ex-opt small' }, o.text);
      o.btn.addEventListener('click', () => {
        left.forEach(x => x.btn.classList.remove('sel'));
        selL = o; o.btn.classList.add('sel'); sfx.tick();
      });
      colL.append(o.btn);
    });
    right.forEach(o => {
      o.btn = h('button', { type: 'button', class: 'ex-opt small' }, o.text);
      o.btn.addEventListener('click', () => tryPair(o));
      colR.append(o.btn);
    });
    return {
      el, ready: () => done === left.length, auto: true,
      check() { return { ok: misses === 0, partial: misses > 0, solution: item.a.map(p => `${p[0]} → ${p[1]}`).join('\n') }; }
    };
  },
  num(item, onChange) {
    const id = 'num-' + Math.random().toString(36).slice(2, 8);
    const input = h('input', { id, class: 'ex-input', inputmode: 'decimal', autocomplete: 'off', placeholder: 'Ergebnis' });
    const el = h('div', { class: 'ex-num' },
      h('label', { for: id, class: 'sr-only' }, 'Ergebnis'),
      h('div', { class: 'num-row' }, input, h('span', { class: 'ex-unit' }, item.unit || '')));
    input.addEventListener('input', onChange);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); el.dispatchEvent(new CustomEvent('submit-answer', { bubbles: true })); } });
    return {
      el, ready: () => isFinite(parseNum(input.value)), focus: () => input.focus(),
      check() {
        const v = parseNum(input.value);
        const ok = Math.abs(v - item.r) <= (item.tol || 0) + 1e-9;
        input.disabled = true;
        input.classList.add(ok ? 'right' : 'wrong');
        return { ok, solution: `${fmtNum(item.r)} ${item.unit || ''}`.trim() };
      }
    };
  }
};

const TYPE_LABEL = { choice: 'Wähle die richtige Antwort', multi: 'Wähle alle richtigen Antworten', tf: 'Richtig oder falsch?', order: 'Bring in die richtige Reihenfolge', match: 'Ordne richtig zu', num: 'Rechne' };

export function runLesson(container, { title, section, items, mode = 'lesson', need = 0.8, winText = 'Abschnitt gemeistert!', backText = 'Zurück zum Lernpfad', onExit, onDone }) {
  const test = mode === 'test';
  const queue = items.map((item, n) => ({ item, key: n }));
  const total = queue.length;
  let solved = 0, firstWrong = new Set(), correctFirst = 0, cur = null, comp = null, answered = false;

  container.innerHTML = '';
  const root = h('div', { class: 'lesson' });
  const closeBtn = h('button', { type: 'button', class: 'icon-btn plain', 'aria-label': 'Lektion beenden', html: icon('close', 22) });
  const bar = h('div', { class: 'lp-bar', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': String(total), 'aria-label': 'Fortschritt der Lektion' }, h('div', { class: 'lp-fill' }));
  const count = h('span', { class: 'lp-count' });
  const head = h('header', { class: 'lp-head' }, closeBtn, bar, count);
  const body = h('main', { class: 'lp-body' });
  const foot = h('footer', { class: 'lp-foot' });
  root.append(head, body, foot);
  container.append(root);

  const updateBar = () => {
    bar.querySelector('.lp-fill').style.width = `${(solved / total) * 100}%`;
    bar.setAttribute('aria-valuenow', String(solved));
    count.textContent = `${Math.min(solved + 1, total)}/${total}`;
  };

  closeBtn.addEventListener('click', () => {
    if (solved === 0) { onExit(); return; }
    foot.innerHTML = '';
    foot.className = 'lp-foot ask';
    foot.append(
      h('p', null, 'Lektion abbrechen? Der Fortschritt dieser Lektion geht verloren.'),
      h('div', { class: 'lp-actions' },
        h('button', { type: 'button', class: 'btn', onclick: () => (answered ? next() : showCheckBar()) }, 'Weiterlernen'),
        h('button', { type: 'button', class: 'btn danger', onclick: () => onExit() }, 'Abbrechen'))
    );
  });

  function next() {
    if (!queue.length) { finish(); return; }
    cur = queue.shift();
    answered = false;
    updateBar();
    body.innerHTML = '';
    const it = cur.item;
    const card = h('section', { class: 'ex', 'aria-live': 'polite' },
      h('p', { class: 'ex-type' }, (it.tag ? it.tag + ' · ' : section ? section.short + ' · ' : '') + TYPE_LABEL[it.t]),
      h('h1', { class: 'ex-q' }, it.q));
    comp = TYPES[it.t](it, auto => { syncCheck(); if (auto === true && comp.auto) submit(); });
    card.append(comp.el);
    body.append(card);
    card.addEventListener('submit-answer', () => { if (comp.ready()) submit(); });
    showCheckBar();
    if (comp.focus) setTimeout(() => comp.focus(), 50);
    body.scrollTop = 0;
  }
  let checkBtn = null;
  function showCheckBar() {
    foot.className = 'lp-foot';
    foot.innerHTML = '';
    checkBtn = h('button', { type: 'button', class: 'btn primary wide' }, comp && comp.auto ? 'Alle Paare zuordnen' : 'Prüfen');
    checkBtn.addEventListener('click', submit);
    foot.append(checkBtn);
    syncCheck();
  }
  function syncCheck() { if (checkBtn) checkBtn.disabled = !comp || !comp.ready(); }

  function submit() {
    if (answered || !comp || !comp.ready()) return;
    answered = true;
    const res = comp.check();
    const it = cur.item;
    if (res.ok) {
      solved++;
      if (!firstWrong.has(cur.key)) correctFirst++;
      sfx.right();
    } else {
      sfx.wrong();
      firstWrong.add(cur.key);
      if (!test) queue.push(cur); else solved++;
      if (res.partial && !test) { /* Zuordnen mit Fehlgriffen: kommt am Ende noch einmal */ }
    }
    updateBar();
    foot.className = 'lp-foot ' + (res.ok ? 'good' : 'bad');
    foot.innerHTML = '';
    const msg = res.ok ? (firstWrong.has(cur.key) ? 'Jetzt sitzt es.' : 'Richtig!') : (res.partial ? 'Fast. Ein paar Fehlgriffe waren dabei.' : 'Nicht ganz.');
    const box = h('div', { class: 'lp-feedback', role: 'status' },
      h('p', { class: 'lp-verdict' }, h('span', { html: icon(res.ok ? 'check' : 'close', 22) }), msg),
      !res.ok ? h('p', { class: 'lp-solution' }, h('b', null, 'Lösung: '), h('span', { class: 'pre' }, res.solution)) : null,
      it.x ? h('p', { class: 'lp-explain' }, it.x) : null);
    const go = h('button', { type: 'button', class: 'btn wide ' + (res.ok ? 'ok' : 'warn') }, 'Weiter');
    go.addEventListener('click', next);
    foot.append(box, go);
    announce(msg + (it.x ? ' ' + it.x : ''));
    setTimeout(() => go.focus({ preventScroll: true }), 30);
  }

  function finish() {
    updateBar();
    const score = correctFirst / total;
    const perfect = firstWrong.size === 0;
    body.innerHTML = '';
    foot.innerHTML = '';
    foot.className = 'lp-foot';
    const passed = !test || score >= need;
    const card = h('section', { class: 'lp-end' },
      h('div', { class: 'lp-end-icon ' + (passed ? 'ok' : 'bad'), html: icon(passed ? (test ? 'shield' : 'bolt') : 'refresh', 44) }),
      h('h1', null, test ? (passed ? winText : 'Noch nicht bestanden') : (perfect ? 'Fehlerfrei!' : 'Lektion geschafft!')),
      h('p', null, test
        ? `${Math.round(score * 100)} % richtig. ${passed ? `Mindestens ${Math.round(need * 100)} % waren nötig.` : `Du brauchst mindestens ${Math.round(need * 100)} %. Wiederhole die Lektionen und versuch es noch einmal.`}`
        : `${correctFirst} von ${total} Aufgaben beim ersten Versuch richtig.`));
    body.append(card);
    const go = h('button', { type: 'button', class: 'btn primary wide' }, passed ? 'Weiter' : backText);
    go.addEventListener('click', () => onDone({ passed, score, perfect, correctFirst, total }));
    foot.append(go);
    if (passed) sfx.win(); else sfx.fail();
    setTimeout(() => go.focus({ preventScroll: true }), 30);
  }

  next();
}
