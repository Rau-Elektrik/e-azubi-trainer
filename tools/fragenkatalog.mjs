// Fragenkatalog zum Prüfen: alle Fragen der Berufsschule als druckbare HTML-Datei,
// nach Lehrjahr, Lernfeld und Lektion. Jede Frage mit Fach, Antworten, Lösung, Erklärung und einer Zeile für Anmerkungen.
// Aufruf: node tools/fragenkatalog.mjs [Zieldatei.html]   (ohne Ziel: Fragenkatalog-<Version>.html im aktuellen Ordner)
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { LERNFELDER, WISO, JAHRE, findFach } from '../js/content/schule/index.js';
import { APP_VERSION } from '../js/version.js';

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const fmt = v => Number(v).toLocaleString('de-DE', { maximumFractionDigits: 4 });
const TYP = { choice: 'Eine Antwort', multi: 'Mehrere Antworten', tf: 'Richtig oder falsch', order: 'Reihenfolge', match: 'Zuordnen', num: 'Rechnen' };

// Antworten je Aufgabentyp, die richtige ist markiert
function answers(it) {
  const li = (text, right) => `<li class="${right ? 'right' : ''}"><span class="mark">${right ? '✔' : '○'}</span>${esc(text)}</li>`;
  switch (it.t) {
    case 'choice': return `<ul class="opts">${it.a.map((a, i) => li(a, i === it.r)).join('')}</ul>`;
    case 'multi': return `<ul class="opts">${it.a.map((a, i) => li(a, it.r.includes(i))).join('')}</ul>`;
    case 'tf': return `<ul class="opts">${li('Richtig', it.r === true)}${li('Falsch', it.r === false)}</ul>`;
    case 'order': return `<ol class="order">${it.a.map(a => `<li>${esc(a)}</li>`).join('')}</ol><p class="hint">Richtige Reihenfolge. In der App werden die Bausteine gemischt.</p>`;
    case 'match': return `<table class="pairs">${it.a.map(p => `<tr><td>${esc(p[0])}</td><td class="arr">→</td><td>${esc(p[1])}</td></tr>`).join('')}</table>`;
    case 'num': return `<p class="num"><span class="mark">✔</span>${fmt(it.r)} ${esc(it.unit || '')}${it.tol ? ` <span class="hint">(Toleranz ± ${fmt(it.tol)})</span>` : ''}</p>`;
    default: return `<p class="hint">Unbekannter Aufgabentyp ${esc(it.t)}</p>`;
  }
}

let nr = 0;
const question = (it, l, i) => `
<article class="q">
  <p class="meta"><b>Nr. ${++nr}</b> · ${esc(l.id)} / ${i + 1} · ${esc(findFach(it.f).title)} · ${TYP[it.t] || it.t}</p>
  <h4>${esc(it.q)}</h4>
  ${it.bild ? `<figure class="fig">${it.bild}<figcaption>${esc(it.alt || '')}</figcaption></figure>` : ''}
  ${answers(it)}
  <p class="x"><b>Erklärung:</b> ${esc(it.x)}</p>
  <div class="note"><span>Anmerkung:</span><span class="box">☐ in Ordnung &nbsp; ☐ ändern</span><div class="line"></div><div class="line"></div></div>
</article>`;

const lektion = l => `
<section class="lk">
  <h3>Lektion ${l.index + 1}: ${esc(l.title)} <small>${l.items.length} Fragen</small></h3>
  ${l.items.map((it, i) => question(it, l, i)).join('')}
</section>`;

const block = b => `
<section class="lf">
  <h2>${b.nr ? `Lernfeld ${b.nr}` : 'Wirtschafts- und Sozialkunde'}: ${esc(b.title)}</h2>
  <p class="ziel">${b.nr ? `${b.stunden} Stunden · ` : ''}${esc(b.ziel)}</p>
  ${b.lektionen.map(lektion).join('')}
</section>`;

const groups = JAHRE.map(j => ({ title: j.title, text: j.text, blocks: LERNFELDER.filter(b => b.jahr === j.nr) }))
  .concat([{ title: 'Alle Lehrjahre', text: 'Wirtschafts- und Sozialkunde, eigener Prüfungsbereich in Teil 2.', blocks: [WISO] }]);
const total = groups.reduce((n, g) => n + g.blocks.reduce((m, b) => m + b.lektionen.reduce((k, l) => k + l.items.length, 0), 0), 0);
const lessons = groups.reduce((n, g) => n + g.blocks.reduce((m, b) => m + b.lektionen.length, 0), 0);
const today = new Date().toLocaleDateString('de-DE');

const body = groups.map(g => `
<section class="jahr">
  <h1>${esc(g.title)}</h1>
  <p class="ziel">${esc(g.text)}</p>
  ${g.blocks.map(block).join('')}
</section>`).join('');

const html = `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Fragenkatalog Berufsschule ${APP_VERSION}</title>
<style>
  @page { size: A4; margin: 16mm 14mm; }
  body { font: 11pt/1.4 system-ui, "Segoe UI", Arial, sans-serif; color: #111; background: #fff; max-width: 190mm; margin: 0 auto; padding: 12px; }
  header.top { border-bottom: 2px solid #111; padding-bottom: 8px; margin-bottom: 12px; }
  header.top h1 { margin: 0; font-size: 20pt; }
  header.top p { margin: 4px 0 0; }
  .ziel, .hint, .meta, small { color: #555; }
  h1 { font-size: 17pt; margin: 18px 0 2px; }
  h2 { font-size: 14pt; margin: 16px 0 2px; border-bottom: 1px solid #999; padding-bottom: 2px; }
  h3 { font-size: 12pt; margin: 12px 0 4px; }
  h3 small { font-weight: normal; font-size: 9pt; }
  .jahr + .jahr { break-before: page; }
  .fig { margin: 4px 0 6px; color: #000; }
  .fig svg { width: auto; height: auto; max-width: 300px; max-height: 170px; display: block; }
  .fig figcaption { font-size: 10px; color: #555; }
  .q { border: 1px solid #bbb; border-radius: 4px; padding: 6px 10px 8px; margin: 8px 0; break-inside: avoid; }
  .meta { margin: 0; font-size: 9pt; }
  h4 { font-size: 11pt; margin: 4px 0; }
  ul.opts { list-style: none; padding: 0; margin: 4px 0; }
  ul.opts li { padding: 1px 0; }
  ul.opts li.right, .num { font-weight: 600; }
  .mark { display: inline-block; width: 1.4em; }
  ol.order { margin: 4px 0; padding-left: 1.6em; }
  table.pairs { border-collapse: collapse; margin: 4px 0; }
  table.pairs td { padding: 1px 6px 1px 0; vertical-align: top; }
  table.pairs .arr { color: #555; }
  .num { margin: 4px 0; }
  .hint { font-size: 9pt; font-weight: normal; margin: 2px 0; }
  .x { margin: 4px 0; font-size: 10pt; }
  .note { margin-top: 6px; font-size: 10pt; display: grid; grid-template-columns: auto 1fr; column-gap: 8px; row-gap: 12px; align-items: end; }
  .note .box { justify-self: end; color: #333; }
  .note .line { grid-column: 1 / -1; border-bottom: 1px solid #777; height: 14px; }
  @media print { body { padding: 0; max-width: none; } a { color: inherit; } }
</style>
</head>
<body>
<header class="top">
  <h1>E-Azubi Trainer · Fragenkatalog Berufsschule</h1>
  <p>Version ${APP_VERSION} · erstellt am ${today} · ${LERNFELDER.length} Lernfelder und WiSo · ${lessons} Lektionen · ${total} Fragen</p>
  <p class="hint">Zur fachlichen Prüfung durch den Meister. Die richtige Antwort ist mit ✔ markiert. Bitte jede Frage abhaken und Änderungen in die Zeile „Anmerkung“ schreiben. Die Kennung (etwa lf1-1 / 3) findet die Frage im Quelltext wieder.</p>
  <p>Geprüft von: ______________________ &nbsp; Datum: ____________ &nbsp; Unterschrift: ______________________</p>
</header>
${body}
</body>
</html>
`;

const out = resolve(process.argv[2] || `Fragenkatalog-${APP_VERSION}.html`);
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, html, 'utf8');
console.log(`${total} Fragen in ${lessons} Lektionen geschrieben: ${out}`);
