// Bildschirmfotos der App für die README: npm run screenshots
// Einzelne Bilder: npm run screenshots -- pv-strings schaltplan
// Startet den Testserver und ein unsichtbares Chrome, setzt einen Beispiel-Fortschritt und legt die Bilder in docs/screenshots/ ab.
// Chrome wird gesucht, ein anderer Pfad geht über die Umgebungsvariable CHROME.
import { spawn } from 'node:child_process';
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { start } from './serve.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'docs', 'screenshots');
const PHONE = { width: 390, height: 844, deviceScaleFactor: 2, mobile: true };
const desk = (width, height) => ({ width, height, deviceScaleFactor: 1, mobile: false });

// Beispiel-Fortschritt: Sicherheit bestanden, mitten in den Installationsschaltungen
const DEMO = `(() => {
  const pad = v => String(v).padStart(2, '0');
  const key = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const day = n => { const d = new Date(); d.setDate(d.getDate() - n); return key(d); };
  const done = {};
  ['sicherheit-1', 'sicherheit-2', 'sicherheit-3', 'sicherheit-4', 'installation-1', 'installation-2', 'installation-3', 'installation-4', 'installation-5']
    .forEach((id, i) => { done[id] = { at: day(Math.max(0, 4 - Math.floor(i / 2))), best: 90, stars: 3, times: 1 }; });
  localStorage.setItem('eazubi.v1', JSON.stringify({
    v: 1, xp: 485, goal: 30,
    days: { [day(4)]: 60, [day(3)]: 110, [day(2)]: 95, [day(1)]: 200, [day(0)]: 20 },
    streak: { count: 5, last: day(0) },
    done,
    badges: { start: day(4), serie3: day(2), 'ab-sicherheit': day(3) },
    stats: { lessons: 4, perfect: 3, practice: 4, tests: 1 },
    settings: { sound: false }
  }));
})()`;

// PV: 20 Module setzen und zu zwei Strings verschalten
const PV = `(() => {
  const svg = document.querySelector('.pv-roof'), r = svg.getBoundingClientRect(), S = r.width / 10;
  const a = 1.134, b = 1.722, m = 0.3, g = 0.02;
  const pos = (row, col) => [m + col * (a + g), m + row * (b + g)];
  for (let row = 0; row < 3; row++) for (let col = 0; col < 8; col++) {
    if ((row === 0 && col >= 6) || (row === 2 && col <= 1)) continue;
    const [x, y] = pos(row, col);
    svg.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: r.left + (x + a / 2) * S, clientY: r.top + (y + b / 2) * S }));
  }
  const tap = (row, col) => {
    const [x, y] = pos(row, col);
    [...svg.querySelectorAll('.pv-mod')].find(e => Math.abs(+e.getAttribute('x') - x * 34) < 0.5 && Math.abs(+e.getAttribute('y') - y * 34) < 0.5)
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
  };
  document.querySelector('[data-step="2"]').click();
  [[1,0],[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[1,5],[1,4],[1,3]].forEach(p => tap(...p));
  document.querySelector('[data-string="1"]').click();
  [[1,1],[1,2],[2,2],[2,3],[2,4],[2,5],[2,6],[2,7],[1,7],[1,6]].forEach(p => tap(...p));
  document.querySelector('.pv-data').open = true;
})()`;

// Lernpfad: den aktuellen Knoten in die Mitte holen
const CURRENT = async p => { await p.wait(400); await p.eval(`document.querySelector('.node.current').scrollIntoView({ block: 'center' })`); };
// Für die Lektion zu den Strings die beiden PV-Lektionen davor als erledigt eintragen
const OPEN_PV = `(() => { const s = JSON.parse(localStorage.getItem('eazubi.v1')); s.done['pv-1'] = s.done['pv-2'] = { at: s.streak.last, best: 100, stars: 3, times: 1 }; localStorage.setItem('eazubi.v1', JSON.stringify(s)); })()`;

const SHOTS = [
  { file: 'lernpfad.png', route: '#/pfad', size: PHONE, run: CURRENT },
  { file: 'lektion.png', route: '#/lektion/pv-strings', size: PHONE, prep: OPEN_PV },
  { file: 'fortschritt.png', route: '#/fortschritt', size: PHONE },
  { file: 'lernpfad-dunkel.png', route: '#/pfad', size: PHONE, dark: true, run: CURRENT },
  { file: 'pv-strings.png', route: '#/werkstatt/pv', size: desk(1100, 1240), run: async p => {
    await p.eval(PV);
    await p.eval(`window.scrollTo(0, document.querySelector('.pv-steps').getBoundingClientRect().top + scrollY - 70)`);
  } },
  { file: 'pv-handy.png', route: '#/werkstatt/pv', size: PHONE, run: async p => {
    await p.eval(PV);
    await p.eval(`window.scrollTo(0, document.querySelector('.pv-hint').getBoundingClientRect().top + scrollY - 70)`);
  } },
  { file: 'schaltplan.png', route: '#/werkstatt/schaltplan', size: desk(1280, 1480), run: async p => {
    await p.eval(`[...document.querySelectorAll('.chip')].find(c => /Wechsel/.test(c.textContent)).click()`);
    for (let i = 0; i < 2; i++) {
      await p.eval(`document.getElementById('c-test').click()`);
      await p.wait(200);
      await p.eval(`document.getElementById('c-skip').click()`);
      await p.until(`document.getElementById('c-verdict').textContent !== 'läuft'`);
    }
    await p.eval(`[...document.querySelectorAll('#c-foot button')].find(b => b.textContent === 'Lösung zeigen').click()`);
    await p.wait(300);
    await p.eval(`document.getElementById('c-protocol').hidden = true; document.getElementById('c-msg').textContent = ''`);
    await p.eval(`window.scrollTo(0, 0)`);
  } },
  { file: 'zaehlerschrank.png', route: '#/werkstatt/zaehlerschrank', size: desk(1280, 1000), run: async p => {
    // Richtig bestückt: Teil antippen, dann den Raum
    await p.eval(`(() => {
      const right = { schiene: 'nar', sls: 'nar', kombi: 'aar', hs: 'aar', abzweig: 'aar', ehz: 'zf', smgw: 'rfz', steuer: 'rfz', router: 'apz', rcd: 'vf', ls: 'vf' };
      for (const [part, zone] of Object.entries(right)) {
        document.querySelector('.zs-chip[data-part="' + part + '"]').click();
        document.querySelector('.zs-zone[data-zone="' + zone + '"]').click();
      }
      document.querySelector('[data-act="check"]').click();
    })()`);
    await p.eval(`window.scrollTo(0, document.querySelector('.prax-task').getBoundingClientRect().top + scrollY - 70)`);
  } }
];

function findChrome() {
  const list = [process.env.CHROME,
    'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'];
  const hit = list.find(p => p && existsSync(p));
  if (!hit) throw new Error('Kein Chrome gefunden. Pfad mit CHROME=... angeben.');
  return hit;
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

// Minimale Verbindung zum Chrome DevTools Protocol über WebSocket
function connect(url) {
  const ws = new WebSocket(url);
  let id = 0;
  const wait = new Map(), events = [];
  ws.addEventListener('message', e => {
    const msg = JSON.parse(e.data);
    if (msg.id && wait.has(msg.id)) {
      const { ok, fail } = wait.get(msg.id); wait.delete(msg.id);
      msg.error ? fail(new Error(msg.error.message)) : ok(msg.result);
    } else if (msg.method) events.forEach(fn => fn(msg));
  });
  const send = (method, params = {}) => new Promise((ok, fail) => { wait.set(++id, { ok, fail }); ws.send(JSON.stringify({ id, method, params })); });
  const once = method => new Promise(ok => { const fn = m => { if (m.method === method) { events.splice(events.indexOf(fn), 1); ok(m.params); } }; events.push(fn); });
  return new Promise((ok, fail) => {
    ws.addEventListener('open', () => ok({ send, once, close: () => ws.close() }));
    ws.addEventListener('error', () => fail(new Error('Keine Verbindung zu Chrome')));
  });
}

const server = await start(0);
const base = `http://localhost:${server.address().port}/`;
const profile = await mkdtemp(join(tmpdir(), 'eazubi-shots-'));
const chrome = spawn(findChrome(), ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`, '--no-first-run', '--no-default-browser-check',
  '--hide-scrollbars', '--mute-audio', '--disable-extensions', 'about:blank'], { stdio: 'ignore' });

try {
  // Chrome schreibt seinen Debug-Port in die Datei DevToolsActivePort
  let port = null;
  for (let i = 0; i < 100 && !port; i++) {
    await sleep(100);
    try { port = (await readFile(join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0].trim(); } catch { /* noch nicht da */ }
  }
  if (!port) throw new Error('Chrome hat keinen Debug-Port geöffnet.');
  const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const cdp = await connect(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');

  const page = {
    async eval(expr) {
      const r = await cdp.send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
      if (r.exceptionDetails) throw new Error(`${expr.slice(0, 80)}…: ${r.exceptionDetails.exception?.description || r.exceptionDetails.text}`);
      return r.result.value;
    },
    wait: sleep,
    async until(expr, ms = 8000) {
      for (let t = 0; t < ms; t += 100) { if (await page.eval(expr)) return; await sleep(100); }
      throw new Error('Zeitüberschreitung: ' + expr);
    }
  };
  const go = async url => { const load = cdp.once('Page.loadEventFired'); await cdp.send('Page.navigate', { url }); await load; };

  await mkdir(out, { recursive: true });
  await go(base);
  const only = process.argv.slice(2).map(a => a.replace(/\.png$/, ''));
  for (const [n, s] of SHOTS.entries()) {
    if (only.length && !only.includes(s.file.replace(/\.png$/, ''))) continue;
    await cdp.send('Emulation.setDeviceMetricsOverride', s.size);
    await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: s.size.mobile });
    await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: s.dark ? 'dark' : 'light' }, { name: 'prefers-reduced-motion', value: 'reduce' }] });
    await page.eval(`localStorage.clear(); ${DEMO}; ${s.prep || ''}`);
    await go(`${base}?bild=${n + 1}${s.route}`);   // eigener Query-Teil erzwingt ein echtes Neuladen
    await page.eval('document.fonts.ready.then(() => true)');
    await sleep(600);
    if (s.run) await s.run(page);
    await sleep(500);
    const shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
    await writeFile(join(out, s.file), Buffer.from(shot.data, 'base64'));
    console.log('  ' + s.file);
  }
  cdp.close();
} finally {
  chrome.kill();
  server.close();
  await sleep(300);
  await rm(profile, { recursive: true, force: true }).catch(() => {});
}
console.log('Bilder liegen in docs/screenshots/');
