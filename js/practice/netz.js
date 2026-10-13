// Netz-Puzzle: Kacheln drehen, bis jede Lampe Strom von der Einspeisung bekommt.
import { C, hexA, pad2, fmt, reduceMotion, announce, boltsSVG, sfx, TAU } from '../ui.js';

const TEMPLATE = `
<div class="net-wrap">
      <div class="plate">
        <div class="plate-top">
          <div>
            <p class="eyebrow">Netz-Puzzle</p>
            <p class="rating" id="grid-label">Raster 4×4 · 230 V ~ 50 Hz</p>
          </div>
          <div class="level" role="group" aria-label="Level wählen">
            <button class="icon-btn" id="level-prev" type="button" aria-label="Vorheriges Level">‹</button>
            <div class="level-read"><span class="lbl">Level</span><output id="level-out">01</output></div>
            <button class="icon-btn" id="level-next" type="button" aria-label="Nächstes Level">›</button>
          </div>
        </div>
        <dl class="specs">
          <div class="spec"><dt>Lampen</dt><dd id="stat-lamps">0/0</dd></div>
          <div class="spec"><dt>Züge</dt><dd id="stat-moves">0</dd></div>
          <div class="spec"><dt>Par</dt><dd id="stat-par">0</dd></div>
          <div class="spec"><dt>Zeit</dt><dd id="stat-time">0:00</dd></div>
        </dl>
      </div>

      <section class="board" aria-label="Spielfeld">
        <canvas id="board" tabindex="0" aria-label="Spielfeld. Kacheln drehen, bis alle Lampen Strom haben." aria-describedby="help"></canvas>
        <div class="win" id="win" hidden>
          <div class="win-card" role="dialog" aria-labelledby="win-title">
            <p class="eyebrow" id="win-level">Level 01 gelöst</p>
            <h2 id="win-title">Strom fließt.</h2>
            <p id="win-sub">Alle Lampen leuchten.</p>
            <div class="bolts" id="win-bolts" role="img" aria-label="3 von 3 Blitzen"></div>
            <dl class="win-stats">
              <div><dt>Züge</dt><dd id="win-moves">0</dd></div>
              <div><dt>Zeit</dt><dd id="win-time">0:00</dd></div>
            </dl>
            <p class="win-note" id="win-note" hidden></p>
            <div class="win-actions">
              <button class="btn primary" id="win-next" type="button">Weiter zu Level 2</button>
              <button class="btn" id="win-again" type="button">Neues Netz</button>
              <button class="btn ghost" id="win-close" type="button">Ansehen</button>
            </div>
          </div>
        </div>
      </section>

      <div class="controls">
        <button class="btn" id="btn-new" type="button">Neues Netz</button>
        <button class="btn" id="btn-hint" type="button">Hinweis</button>
      </div>

      <div class="help" id="help">
        <p class="legend">
          <span><svg class="sym" viewBox="0 0 20 20" aria-hidden="true"><circle class="sym-src" cx="10" cy="10" r="8"/><path class="sym-wave" d="M5 10c1.6-3.2 3.4-3.2 5 0s3.4 3.2 5 0"/></svg>Einspeisung</span>
          <span><svg class="sym" viewBox="0 0 20 20" aria-hidden="true"><circle class="sym-lamp" cx="10" cy="10" r="7.5"/><path class="sym-x" d="M4.7 4.7l10.6 10.6M15.3 4.7 4.7 15.3"/></svg>Lampe</span>
          <span><svg class="sym" viewBox="0 0 20 20" aria-hidden="true"><path class="sym-wire" d="M1 10h18M10 10v9"/><circle class="sym-dot" cx="10" cy="10" r="3"/></svg>Abzweig</span>
        </p>
        <p>Tippe auf eine Kachel, um sie zu drehen. Führe den Strom von der Einspeisung zu allen Lampen. Das Netz ist fertig, wenn keine Ader mehr ins Leere zeigt. Par ist die kleinste Zahl an Drehungen für dieses Netz.</p>
        <p>Kachel festschrauben: Rechtsklick oder lange drücken. Tastatur: <kbd>Pfeile</kbd> wählen, <kbd>Leertaste</kbd> dreht, <kbd>L</kbd> schraubt fest.</p>
      </div>
    </div>
`;

export function mount(container, opts = {}) {
  container.innerHTML = TEMPLATE;
  const $ = id => container.querySelector('#' + id);
  const ac = new AbortController();
  const sig = { signal: ac.signal };
  const canvas = $('board');
  const ctx = canvas.getContext('2d');

  // Richtungen als Bitmaske: N=1, O=2, S=4, W=8
  const DIRS = [1, 2, 4, 8];
  const DX = { 1: 0, 2: 1, 4: 0, 8: -1 };
  const DY = { 1: -1, 2: 0, 4: 1, 8: 0 };
  const OPP = { 1: 4, 2: 8, 4: 1, 8: 2 };
  const rotCW = m => ((m << 1) | (m >> 3)) & 15;
  const rotN = (m, r) => { for (let q = 0; q < r; q++) m = rotCW(m); return m; };
  const mod4 = v => ((v % 4) + 4) % 4;
  const degree = m => (m & 1) + ((m >> 1) & 1) + ((m >> 2) & 1) + ((m >> 3) & 1);
  const period = m => (m === 15 || m === 0) ? 1 : (m === 5 || m === 10) ? 2 : 4;
  const sizeFor = lvl => Math.min(4 + Math.floor(lvl / 2), 10);

  const KEY = 'eazubi.netz.v1';
  const saved = { level: 1, unlocked: 1, best: {} };
  try { Object.assign(saved, JSON.parse(localStorage.getItem(KEY)) || {}); } catch (e) {}
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch (e) {} };

  const ui = {
    lamps: $('stat-lamps'), moves: $('stat-moves'), par: $('stat-par'), time: $('stat-time'),
    level: $('level-out'), prev: $('level-prev'), next: $('level-next'), grid: $('grid-label'),
    win: $('win'), hint: $('btn-hint'), fresh: $('btn-new')
  };

  function generate(n) {
    const N = n * n, src = Math.floor(n / 2) * n + Math.floor(n / 2);
    for (let attempt = 0; attempt < 80; attempt++) {
      const cap = attempt < 60 ? 3 : 4;
      const base = new Array(N).fill(0), inTree = new Uint8Array(N), frontier = [];
      const push = a => {
        const x = a % n, y = (a / n) | 0;
        for (const d of DIRS) {
          const nx = x + DX[d], ny = y + DY[d];
          if (nx >= 0 && ny >= 0 && nx < n && ny < n && !inTree[ny * n + nx]) frontier.push([a, d]);
        }
      };
      inTree[src] = 1; push(src);
      let count = 1;
      while (frontier.length && count < N) {
        const q = (Math.random() * frontier.length) | 0;
        const [a, d] = frontier[q];
        frontier[q] = frontier[frontier.length - 1]; frontier.pop();
        const b = a + DX[d] + DY[d] * n;
        if (inTree[b] || degree(base[a]) >= cap) continue;
        base[a] |= d; base[b] |= OPP[d]; inTree[b] = 1; count++; push(b);
      }
      if (count === N) return { base, src };
    }
    throw new Error('Netz konnte nicht erzeugt werden');
  }
  const lampsOf = (base, src) => base.reduce((acc, b, i) => { if (i !== src && degree(b) === 1) acc.push(i); return acc; }, []);

  let S = null;
  let lastSec = -1;

  function computePower() {
    const { n, base, turns, src } = S, N = n * n;
    const cur = base.map((b, i) => rotN(b, mod4(turns[i])));
    const depth = new Int16Array(N).fill(-1);
    depth[src] = 0;
    const q = [src];
    for (let h = 0; h < q.length; h++) {
      const a = q[h], x = a % n, y = (a / n) | 0;
      for (const d of DIRS) {
        if (!(cur[a] & d)) continue;
        const nx = x + DX[d], ny = y + DY[d];
        if (nx < 0 || ny < 0 || nx >= n || ny >= n) continue;
        const b = ny * n + nx;
        if (depth[b] < 0 && (cur[b] & OPP[d])) { depth[b] = depth[a] + 1; q.push(b); }
      }
    }
    S.depth = depth;
    S.lit = S.lamps.reduce((c, i) => c + (depth[i] >= 0 ? 1 : 0), 0);
    // Alle Kacheln versorgt heißt hier zugleich: keine offene Ader, denn die Adern reichen genau für einen Baum.
    return q.length === N;
  }

  function newGame(level, quiet) {
    level = Math.max(1, Math.min(level, saved.unlocked));
    const n = sizeFor(level), N = n * n;
    for (let tries = 0; tries < 30; tries++) {
      const { base, src } = generate(n);
      let turns;
      do { turns = base.map(b => period(b) === 1 ? 0 : (Math.random() * 4) | 0); }
      while (turns.filter((t, i) => t % period(base[i]) !== 0).length < Math.ceil(N * 0.5));
      S = {
        level, n, src, base, turns,
        disp: reduceMotion.matches ? turns.slice() : turns.map(t => t - 1),
        lock: new Array(N).fill(false), moves: 0, hints: 0,
        par: turns.reduce((sum, t, i) => { const p = period(base[i]); return sum + (p - t % p) % p; }, 0),
        startAt: 0, elapsed: 0, won: false, wonAt: 0, cursor: src, flash: {}, shake: {}
      };
      S.lamps = lampsOf(base, src);
      if (!computePower()) break;
    }
    saved.level = level; persist();
    hideWin(); updateUI(); lastSec = -1;
    if (!quiet) announce(`Level ${level}: ${S.lamps.length} Lampen auf ${n} mal ${n} Kacheln.`);
  }

  function restore(g) {
    const N = g.n * g.n;
    if (!(g.n >= 4 && g.n <= 10 && g.base.length === N && g.turns.length === N && g.lock.length === N)) throw new Error('Snapshot ungültig');
    const now = performance.now();
    S = {
      level: g.level, n: g.n, src: g.src, base: g.base.slice(), turns: g.turns.slice(), disp: g.turns.slice(),
      lock: g.lock.slice(), moves: g.moves | 0, hints: g.hints | 0, par: g.par | 0,
      startAt: g.started && !g.won ? now - g.elapsed : 0, elapsed: g.elapsed || 0,
      won: false, wonAt: now - 60000, cursor: g.cursor | 0, flash: {}, shake: {}
    };
    S.lamps = lampsOf(S.base, S.src);
    S.won = computePower();
    updateUI();
  }

  const elapsedNow = () => S.won ? S.elapsed : (S.startAt ? performance.now() - S.startAt : 0);
  function serialize() {
    return {
      level: S.level, n: S.n, src: S.src, base: S.base, turns: S.turns, lock: S.lock,
      moves: S.moves, hints: S.hints, par: S.par, elapsed: elapsedNow(), started: !!S.startAt,
      won: S.won, cursor: S.cursor
    };
  }
  const rating = () => {
    const st = S.moves <= S.par ? 3 : S.moves <= Math.ceil(S.par * 1.5) + 2 ? 2 : 1;
    return S.hints ? Math.min(st, 2) : st;
  };

  function afterChange() {
    const before = S.lit;
    const done = computePower();
    if (S.lit > before && !done) sfx.ping(S.lit);
    updateUI();
    if (done) onWin();
  }
  function rotateTile(i, dir) {
    if (S.won || i < 0) return;
    if (S.lock[i]) { sfx.thunk(); S.shake[i] = performance.now(); return; }
    S.turns[i] += dir; S.moves++;
    if (!S.startAt) S.startAt = performance.now();
    if (reduceMotion.matches) S.disp[i] = S.turns[i];
    sfx.click();
    afterChange();
  }
  function toggleLock(i) {
    if (S.won || i < 0) return;
    S.lock[i] = !S.lock[i];
    sfx.lock();
  }
  function hint() {
    if (S.won) return;
    const all = S.base.map((_, i) => i);
    const wrong = i => mod4(S.turns[i]) % period(S.base[i]) !== 0;
    let pool = all.filter(i => !S.lock[i] && wrong(i));
    if (!pool.length) pool = all.filter(wrong);
    if (!pool.length) return;
    const i = pool[(Math.random() * pool.length) | 0];
    const p = period(S.base[i]);
    S.turns[i] += (p - mod4(S.turns[i]) % p) % p;
    if (reduceMotion.matches) S.disp[i] = S.turns[i];
    S.lock[i] = true; S.hints++; S.cursor = i;
    S.flash[i] = performance.now();
    if (!S.startAt) S.startAt = performance.now();
    sfx.lock();
    afterChange();
  }
  function onWin() {
    S.won = true;
    S.wonAt = performance.now();
    S.elapsed = S.startAt ? S.wonAt - S.startAt : 0;
    const stars = rating();
    const secs = Math.round(S.elapsed / 1000);
    const prev = saved.best[S.level] || {};
    const prevTime = typeof prev.time === 'number' ? prev.time : null;
    const record = prevTime === null || secs < prevTime;
    saved.best[S.level] = { time: prevTime === null ? secs : Math.min(prevTime, secs), stars: Math.max(prev.stars || 0, stars) };
    saved.unlocked = Math.max(saved.unlocked, S.level + 1);
    persist();
    sfx.win();
    updateUI();
    announce(`Gelöst in ${S.moves} Zügen und ${fmt(S.elapsed)}. ${stars} von 3 Blitzen.`);
    const game = S;
    setTimeout(() => { if (S === game && S.won) showWin(stars, record, prevTime); }, reduceMotion.matches ? 250 : 1300);
  }

  function updateUI() {
    ui.lamps.textContent = `${S.lit}/${S.lamps.length}`;
    ui.moves.textContent = S.moves;
    ui.par.textContent = S.par;
    ui.level.textContent = pad2(S.level);
    ui.grid.textContent = `Raster ${S.n}×${S.n} · 230 V ~ 50 Hz`;
    ui.prev.disabled = S.level <= 1;
    ui.next.disabled = S.level >= saved.unlocked;
    ui.hint.disabled = S.won;
  }
  function showWin(stars, record, prevTime) {
    if (!$('win-level')) return;   // Puzzle wurde inzwischen verlassen
    $('win-level').textContent = `Level ${pad2(S.level)} gelöst`;
    $('win-sub').textContent = `Alle ${S.lamps.length} Lampen leuchten.`;
    const bolts = $('win-bolts');
    bolts.innerHTML = boltsSVG(stars);
    bolts.setAttribute('aria-label', `${stars} von 3 Blitzen`);
    $('win-moves').textContent = `${S.moves} / Par ${S.par}`;
    $('win-time').textContent = fmt(S.elapsed);
    const notes = [];
    if (prevTime !== null) notes.push(record ? 'Neue Bestzeit für dieses Level.' : `Bestzeit: ${fmt(prevTime * 1000)}`);
    if (stars < 3) notes.push(S.hints ? 'Mit Hinweis gibt es höchstens zwei Blitze.' : `Drei Blitze gibt es mit höchstens ${S.par} Zügen.`);
    const note = $('win-note');
    note.textContent = notes.join(' ');
    note.hidden = !notes.length;
    $('win-next').textContent = `Weiter zu Level ${S.level + 1}`;
    ui.win.hidden = false;
    $('win-next').focus({ preventScroll: true });
  }
  function hideWin() { ui.win.hidden = true; }

  ui.prev.addEventListener('click', () => { if (S.level > 1) newGame(S.level - 1); });
  ui.next.addEventListener('click', () => { if (S.level < saved.unlocked) newGame(S.level + 1); });
  ui.fresh.addEventListener('click', () => newGame(S.level));
  ui.hint.addEventListener('click', hint);
  $('win-next').addEventListener('click', () => newGame(S.level + 1));
  $('win-again').addEventListener('click', () => newGame(S.level));
  $('win-close').addEventListener('click', () => { hideWin(); canvas.focus({ preventScroll: true }); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !ui.win.hidden) hideWin(); }, sig);

  let press = null, lastPointer = 'mouse', keyNav = false, lastInputKey = false;
  function cellAt(e) {
    const r = canvas.getBoundingClientRect(), n = S.n;
    const cx = Math.floor((e.clientX - r.left) / (r.width / n));
    const cy = Math.floor((e.clientY - r.top) / (r.height / n));
    return (cx < 0 || cy < 0 || cx >= n || cy >= n) ? -1 : cy * n + cx;
  }
  document.addEventListener('keydown', () => { lastInputKey = true; }, { capture: true, signal: ac.signal });
  document.addEventListener('pointerdown', () => { lastInputKey = false; }, { capture: true, signal: ac.signal });
  canvas.addEventListener('focus', () => { keyNav = lastInputKey; });
  canvas.addEventListener('blur', () => { keyNav = false; });
  canvas.addEventListener('pointerdown', e => {
    keyNav = false; lastPointer = e.pointerType;
    const i = cellAt(e);
    if (i < 0) return;
    S.cursor = i;
    if (e.pointerType === 'mouse') {
      if (e.button === 0) rotateTile(i, e.shiftKey ? -1 : 1);
      return;
    }
    press = { i, x: e.clientX, y: e.clientY, done: false };
    press.timer = setTimeout(() => {
      if (!press) return;
      press.done = true;
      toggleLock(press.i);
      try { if (navigator.vibrate) navigator.vibrate(12); } catch (err) {}
    }, 430);
  });
  const endPress = rotate => {
    if (!press) return;
    clearTimeout(press.timer);
    if (rotate && !press.done) rotateTile(press.i, 1);
    press = null;
  };
  canvas.addEventListener('pointerup', () => endPress(true));
  canvas.addEventListener('pointercancel', () => endPress(false));
  canvas.addEventListener('pointermove', e => {
    if (press && Math.hypot(e.clientX - press.x, e.clientY - press.y) > 12) endPress(false);
  });
  canvas.addEventListener('contextmenu', e => {
    e.preventDefault();
    if (lastPointer === 'mouse') toggleLock(cellAt(e));
  });
  canvas.addEventListener('keydown', e => {
    const n = S.n;
    let x = S.cursor % n, y = (S.cursor / n) | 0;
    switch (e.key) {
      case 'ArrowUp': y = Math.max(0, y - 1); break;
      case 'ArrowDown': y = Math.min(n - 1, y + 1); break;
      case 'ArrowLeft': x = Math.max(0, x - 1); break;
      case 'ArrowRight': x = Math.min(n - 1, x + 1); break;
      case ' ': case 'Enter': rotateTile(S.cursor, e.shiftKey ? -1 : 1); break;
      case 'l': case 'L': toggleLock(S.cursor); break;
      default: return;
    }
    e.preventDefault();
    keyNav = true;
    S.cursor = y * n + x;
  });

  let hiddenAt = 0;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { hiddenAt = performance.now(); return; }
    if (hiddenAt && S && S.startAt && !S.won) S.startAt += performance.now() - hiddenAt;
    hiddenAt = 0;
  }, sig);

  let cssSize = 0, dpr = 1;
  function resize() {
    const r = canvas.getBoundingClientRect();
    cssSize = r.width;
    dpr = Math.min(window.devicePixelRatio || 1, 3);
    canvas.width = Math.max(1, Math.round(r.width * dpr));
    canvas.height = Math.max(1, Math.round(r.height * dpr));
  }
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
  function pulse(now, d) {
    let a = Math.pow((Math.sin(now * 0.0032 - d * 0.8) + 1) / 2, 8) * 0.7;
    if (S.won) { const e = (now - S.wonAt) - d * 55; a += Math.exp(-(e * e) / (2 * 130 * 130)); }
    return Math.min(1, a);
  }
  function drawTile(i, now, s, w, g, motion) {
    const n = S.n, b = S.base[i];
    const cx = (i % n) * s + s / 2, cy = ((i / n) | 0) * s + s / 2;
    const powered = S.depth[i] >= 0;
    const isSrc = i === S.src, isLamp = !isSrc && degree(b) === 1;
    const boost = motion && powered ? pulse(now, S.depth[i]) : 0;

    ctx.save();
    ctx.beginPath(); ctx.rect(cx - s / 2, cy - s / 2, s, s); ctx.clip();
    ctx.translate(cx, cy);
    roundRect(-s / 2 + g, -s / 2 + g, s - 2 * g, s - 2 * g, s * 0.14);
    ctx.fillStyle = S.lock[i] ? C['tile-lock'] : C.tile;
    ctx.fill();
    const fl = S.flash[i];
    if (fl) {
      const t = (now - fl) / 900;
      if (t < 1) { ctx.fillStyle = hexA(C.lamp, 0.5 * (1 - t)); ctx.fill(); } else delete S.flash[i];
    }
    if (S.lock[i]) {
      const off = s / 2 - g - Math.max(4, s * 0.1), rr = Math.max(1.7, s * 0.042);
      for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
        ctx.beginPath(); ctx.arc(sx * off, sy * off, rr, 0, TAU);
        ctx.fillStyle = C.line; ctx.fill();
        ctx.beginPath(); ctx.moveTo(sx * off - rr * 0.6, sy * off + rr * 0.6); ctx.lineTo(sx * off + rr * 0.6, sy * off - rr * 0.6);
        ctx.strokeStyle = C['tile-lock']; ctx.lineWidth = Math.max(0.8, rr * 0.45); ctx.stroke();
      }
    }
    let ang = S.disp[i] * Math.PI / 2;
    const sh = S.shake[i];
    if (sh) {
      const t = (now - sh) / 280;
      if (t < 1) ang += Math.sin(t * Math.PI * 5) * 0.08 * (1 - t); else delete S.shake[i];
    }
    ctx.rotate(ang);
    const Lr = s / 2 + w;
    ctx.beginPath();
    for (const d of DIRS) if (b & d) { ctx.moveTo(0, 0); ctx.lineTo(DX[d] * Lr, DY[d] * Lr); }
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (powered) {
      ctx.strokeStyle = C.glow; ctx.lineWidth = w * 2.7; ctx.stroke();
      ctx.strokeStyle = C.live; ctx.lineWidth = w; ctx.stroke();
      if (boost > 0.01) {
        ctx.globalAlpha = boost; ctx.strokeStyle = C['live-hot']; ctx.lineWidth = w * 0.5; ctx.stroke();
        ctx.globalAlpha = 1;
      }
    } else {
      ctx.strokeStyle = C.wire; ctx.lineWidth = w; ctx.stroke();
    }
    if (degree(b) >= 3) {
      ctx.beginPath(); ctx.arc(0, 0, w * 1.05, 0, TAU);
      ctx.fillStyle = powered ? C.live : C.wire; ctx.fill();
    }
    ctx.rotate(-ang);
    if (isLamp) {
      const r = s * 0.25;
      if (powered) {
        const winB = S.won && motion ? Math.max(0, 1 - (now - S.wonAt - S.depth[i] * 55) / 900) : 0;
        const haloR = s * (0.5 + 0.08 * winB);
        const halo = ctx.createRadialGradient(0, 0, r * 0.5, 0, 0, haloR);
        halo.addColorStop(0, hexA(C.lamp, Math.min(0.9, 0.55 + 0.3 * boost + 0.35 * winB)));
        halo.addColorStop(1, hexA(C.lamp, 0));
        ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(0, 0, haloR, 0, TAU); ctx.fill();
        const body = ctx.createRadialGradient(-r * 0.3, -r * 0.35, r * 0.1, 0, 0, r);
        body.addColorStop(0, C['live-hot']); body.addColorStop(1, C.lamp);
        ctx.fillStyle = body;
      } else {
        ctx.fillStyle = C.tile;
      }
      ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
      ctx.lineWidth = Math.max(1.4, w * 0.6);
      ctx.strokeStyle = powered ? C.live : C.wire; ctx.stroke();
      const q = r * Math.SQRT1_2;
      ctx.beginPath(); ctx.moveTo(-q, -q); ctx.lineTo(q, q); ctx.moveTo(q, -q); ctx.lineTo(-q, q);
      ctx.strokeStyle = powered ? C.filament : C.wire; ctx.lineWidth = Math.max(1.2, w * 0.5); ctx.stroke();
    } else if (isSrc) {
      const r = s * 0.3;
      if (motion) {
        const p = (now % 2400) / 2400;
        ctx.beginPath(); ctx.arc(0, 0, r + p * s * 0.17, 0, TAU);
        ctx.strokeStyle = hexA(C.live, 0.55 * (1 - p)); ctx.lineWidth = Math.max(1.2, w * 0.4); ctx.stroke();
      }
      ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU);
      ctx.fillStyle = C.live; ctx.fill();
      ctx.strokeStyle = C['on-live']; ctx.lineWidth = Math.max(1.4, w * 0.45); ctx.stroke();
      const A = r * 0.55, Bh = r * 0.24;
      ctx.beginPath();
      for (let q = 0; q <= 28; q++) {
        const x = -A + 2 * A * q / 28, y = -Math.sin(q / 28 * TAU) * Bh;
        if (q) ctx.lineTo(x, y); else ctx.moveTo(x, y);
      }
      ctx.lineWidth = Math.max(1.5, w * 0.5); ctx.lineCap = 'round'; ctx.stroke();
    }
    ctx.restore();
  }
  function draw(now) {
    if (cssSize <= 0) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssSize, cssSize);
    const n = S.n, s = cssSize / n;
    const w = Math.max(2.5, s * 0.13), g = Math.max(1.5, s * 0.035);
    const motion = !reduceMotion.matches;
    for (let i = 0; i < n * n; i++) drawTile(i, now, s, w, g, motion);
    if (keyNav && document.activeElement === canvas) {
      const x = (S.cursor % n) * s, y = ((S.cursor / n) | 0) * s;
      roundRect(x + g + 1, y + g + 1, s - 2 * g - 2, s - 2 * g - 2, s * 0.14);
      ctx.strokeStyle = C.ink; ctx.lineWidth = 2.5; ctx.stroke();
    }
  }

  let last = performance.now(), active = false, running = false;
  function frame(now) {
    if (!active) { running = false; return; }
    const dt = Math.min(64, now - last); last = now;
    const kk = 1 - Math.exp(-dt / 55);
    for (let i = 0; i < S.disp.length; i++) {
      const d = S.turns[i] - S.disp[i];
      if (d) S.disp[i] = Math.abs(d) < 0.002 ? S.turns[i] : S.disp[i] + d * kk;
    }
    const sec = Math.floor(elapsedNow() / 1000);
    if (sec !== lastSec) { lastSec = sec; ui.time.textContent = fmt(sec * 1000); }
    draw(now);
    requestAnimationFrame(frame);
  }
  function setActive(v) {
    active = v;
    if (v && S && !running) { running = true; last = performance.now(); resize(); requestAnimationFrame(frame); }
  }
  // ---------- Start ----------
  saved.unlocked = Math.max(1, saved.unlocked | 0);
  try { newGame(saved.level | 0 || 1, true); } catch (e) { newGame(1, true); }
  setActive(true);
  return {
    unmount() {
      active = false;
      ac.abort(); ro.disconnect();
      container.innerHTML = '';
    }
  };
}
