// Schaltzeichen und kleine Pläne als SVG für Bildfragen (Feld bild, dazu alt als Beschreibung).
// Gezeichnet nach DIN EN 60617, Stromlaufpläne senkrecht von oben nach unten.
// Alles in currentColor, damit die Bilder im hellen und dunklen Design lesbar bleiben.

const svg = (w, h, body) =>
  `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" style="max-width:${Math.round(w * 1.6)}px" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
const L = (x1, y1, x2, y2, extra = '') => `<path d="M${x1} ${y1}L${x2} ${y2}"${extra}/>`;
const T = (x, y, s, anchor = 'start', size = 13) =>
  `<text x="${x}" y="${y}" fill="currentColor" stroke="none" font-family="Barlow, Arial, sans-serif" font-size="${size}" font-weight="600" text-anchor="${anchor}">${s}</text>`;
const R = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}"/>`;
const C = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}"/>`;
const dot = (x, y) => `<circle cx="${x}" cy="${y}" r="3" fill="currentColor" stroke="none"/>`;
const dash = ' stroke-dasharray="4 3"';

// ---------- Einzelne Schaltzeichen (oberer Anschluss bei x, y) ----------
const schliesser = (x, y) => L(x, y, x, y + 13) + L(x, y + 27, x, y + 40) + L(x, y + 27, x - 10, y + 11);
const oeffner = (x, y) => L(x, y, x, y + 13) + L(x, y + 13, x + 8, y + 13) + L(x, y + 27, x, y + 40) + L(x, y + 27, x + 11, y + 10);
const betaetiger = (x, y) => L(x - 22, y + 19, x - 4, y + 19, dash) + L(x - 22, y + 14, x - 22, y + 24) + L(x - 22, y + 14, x - 19, y + 14) + L(x - 22, y + 24, x - 19, y + 24);
const spule = (x, y) => L(x, y, x, y + 8) + R(x - 13, y + 8, 26, 16) + L(x, y + 24, x, y + 32);
const leuchte = (x, y) => L(x, y, x, y + 6) + C(x, y + 16, 10) + L(x - 7, y + 9, x + 7, y + 23) + L(x + 7, y + 9, x - 7, y + 23) + L(x, y + 26, x, y + 32);
const sicherung = (x, y) => L(x, y, x, y + 32) + R(x - 6, y + 6, 12, 20);
const widerstandV = (x, y) => L(x, y, x, y + 8) + R(x - 7, y + 8, 14, 28) + L(x, y + 36, x, y + 44);
const widerstandH = (x, y) => R(x, y - 7, 28, 14);
const kondensator = (x, y) => L(x, y, x, y + 16) + L(x - 12, y + 16, x + 12, y + 16) + L(x - 12, y + 24, x + 12, y + 24) + L(x, y + 24, x, y + 40);
const diodeRunter = (x, y) => L(x, y, x, y + 10) + `<path d="M${x - 9} ${y + 10}H${x + 9}L${x} ${y + 25}Z"/>` + L(x - 9, y + 25, x + 9, y + 25) + L(x, y + 25, x, y + 36);
const diodeHoch = (x, y) => L(x, y, x, y + 11) + L(x - 9, y + 11, x + 9, y + 11) + `<path d="M${x - 9} ${y + 26}H${x + 9}L${x} ${y + 11}Z"/>` + L(x, y + 26, x, y + 36);
const ledPfeile = (x, y) => L(x + 13, y + 14, x + 22, y + 6) + L(x + 22, y + 6, x + 17, y + 7) + L(x + 22, y + 6, x + 21, y + 11) +
  L(x + 13, y + 22, x + 22, y + 14) + L(x + 22, y + 14, x + 17, y + 15) + L(x + 22, y + 14, x + 21, y + 19);
const trafo = (x, y) => L(x, y, x, y + 8) + C(x, y + 20, 12) + C(x, y + 36, 12) + L(x, y + 48, x, y + 56);
const motor3 = (x, y) => L(x, y, x, y + 6) + C(x, y + 24, 18) + T(x, y + 24, 'M', 'middle', 15) + T(x, y + 37, '3~', 'middle', 11);
const batterie = (x, y) => L(x, y, x, y + 14) + L(x - 14, y + 14, x + 14, y + 14) + `<path d="M${x - 7} ${y + 22}H${x + 7}" stroke-width="4"/>` + L(x, y + 22, x, y + 36);
const gatter = (x, y, zeichen, neg = false) => R(x, y, 44, 56) + T(x + 22, y + 22, zeichen, 'middle', 15) + (neg ? C(x + 49, y + 28, 5) : '');

// ---------- Installationsplan (DIN EN 60617-11) ----------
const flagge = (x1, y1, x2, y2) => {
  // kurzer Querstrich am Ende einer Schalterlinie
  const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy), nx = -dy / len * 5, ny = dx / len * 5;
  return L(x2, y2, x2 + nx, y2 + ny);
};
const arm = (x, y, ang, flags = 1) => {
  const a = ang * Math.PI / 180, x1 = x + Math.cos(a) * 6, y1 = y - Math.sin(a) * 6, x2 = x + Math.cos(a) * 24, y2 = y - Math.sin(a) * 24;
  let s = L(x1, y1, x2, y2) + flagge(x1, y1, x2, y2);
  if (flags === 2) { const x3 = x + Math.cos(a) * 18, y3 = y - Math.sin(a) * 18; s += flagge(x1, y1, x3, y3); }
  return s;
};
const iAus = (x, y) => C(x, y, 6) + arm(x, y, 45);
const iSerie = (x, y) => C(x, y, 6) + arm(x, y, 45, 2);
const iWechsel = (x, y) => C(x, y, 6) + arm(x, y, 45) + arm(x, y, 225);
const iKreuz = (x, y) => C(x, y, 6) + arm(x, y, 45) + arm(x, y, 225) + arm(x, y, 135) + arm(x, y, 315);
const iSteckdose = (x, y, pe = true) => `<path d="M${x - 12} ${y}A12 12 0 0 0 ${x + 12} ${y}"/>` + L(x, y + 12, x, y + 22) + (pe ? L(x - 15, y, x + 15, y) : '');
const iLeuchte = (x, y) => C(x, y, 10) + L(x - 7, y - 7, x + 7, y + 7) + L(x + 7, y - 7, x - 7, y + 7);

// ---------- Fertige Bilder ----------
const einzeln = body => svg(140, 110, body);
export const BILD = {
  schliesser: einzeln(schliesser(80, 35) + L(80, 15, 80, 35) + L(80, 75, 80, 95)),
  oeffner: einzeln(oeffner(70, 35) + L(70, 15, 70, 35) + L(70, 75, 70, 95)),
  taster: einzeln(schliesser(90, 35) + betaetiger(90, 35) + L(90, 15, 90, 35) + L(90, 75, 90, 95)),
  spule: einzeln(spule(70, 30) + L(70, 12, 70, 30) + L(70, 62, 70, 98) + T(90, 38, 'A1') + T(90, 62, 'A2')),
  leuchte: einzeln(leuchte(70, 30) + L(70, 12, 70, 30) + L(70, 62, 70, 98)),
  sicherung: einzeln(sicherung(70, 30) + L(70, 12, 70, 30) + L(70, 62, 70, 98)),
  widerstand: einzeln(widerstandV(70, 25) + L(70, 10, 70, 25) + L(70, 69, 70, 100)),
  kondensator: einzeln(kondensator(70, 30) + L(70, 12, 70, 30) + L(70, 70, 70, 98)),
  diode: einzeln(diodeRunter(70, 30) + L(70, 12, 70, 30) + L(70, 66, 70, 98)),
  led: einzeln(diodeRunter(60, 30) + ledPfeile(60, 30) + L(60, 12, 60, 30) + L(60, 66, 60, 98)),
  trafo: einzeln(trafo(70, 25) + L(70, 8, 70, 25) + L(70, 81, 70, 102)),
  motor: einzeln(motor3(70, 25) + L(55, 8, 62, 27) + L(70, 8, 70, 25) + L(85, 8, 78, 27)),
  nor: svg(180, 100, gatter(60, 20, '≥1', true) + L(20, 34, 60, 34) + L(20, 62, 60, 62) + L(109, 48, 150, 48) + T(14, 38, 'E1', 'end') + T(14, 66, 'E2', 'end') + T(156, 52, 'A')),

  iAus: einzeln(iAus(70, 60)), iSerie: einzeln(iSerie(70, 60)), iWechsel: einzeln(iWechsel(70, 55)), iKreuz: einzeln(iKreuz(70, 55)),
  iSteckdose: einzeln(iSteckdose(70, 45)), iLeuchte: einzeln(iLeuchte(70, 55)),

  // Raum mit zwei Türen, je ein Wechselschalter und eine Deckenleuchte
  raumWechsel: svg(300, 190,
    `<path d="M20 120V20H280V40M280 80V170H20V160"/>` +
    `<path d="M20 120A40 40 0 0 1 60 160" stroke-width="1.5"/>` + `<path d="M280 40A40 40 0 0 1 240 80" stroke-width="1.5"/>` +
    iWechsel(42, 104) + iWechsel(258, 96) + iLeuchte(150, 95) +
    L(42, 98, 140, 95, dash) + L(160, 95, 258, 96, dash) + T(150, 186, 'Grundriss mit zwei Türen', 'middle', 12)),
  // Raum mit drei Schutzkontaktsteckdosen und einem Ausschalter
  raumDosen: svg(300, 190,
    `<path d="M20 120V20H280V170H20V160"/>` + `<path d="M20 120A40 40 0 0 1 60 160" stroke-width="1.5"/>` +
    iAus(44, 104) + iLeuchte(150, 95) + L(50, 102, 140, 95, dash) +
    `<g transform="rotate(180 110 42)">${iSteckdose(110, 42)}</g>` + `<g transform="rotate(180 200 42)">${iSteckdose(200, 42)}</g>` +
    `<g transform="rotate(-90 258 130)">${iSteckdose(258, 130)}</g>` + T(150, 186, 'Grundriss', 'middle', 12)),

  // Selbsthaltung: S1 Aus (Öffner), S2 Ein (Schließer), Q1 hält sich über 13–14
  selbsthaltung: svg(260, 250,
    L(30, 20, 230, 20) + T(22, 24, 'L', 'end') + L(30, 230, 230, 230) + T(22, 234, 'N', 'end') +
    L(100, 20, 100, 30) + oeffner(100, 30) + betaetiger(100, 30) + T(52, 54, 'S1', 'end') +
    L(100, 70, 100, 85) + dot(100, 85) + L(100, 85, 180, 85) +
    schliesser(100, 85) + betaetiger(100, 85) + T(52, 109, 'S2', 'end') +
    schliesser(180, 85) + T(196, 109, 'Q1') + T(186, 98, '13', 'start', 10) + T(186, 124, '14', 'start', 10) +
    L(100, 125, 100, 140) + L(180, 125, 180, 140) + L(100, 140, 180, 140) + dot(100, 140) +
    L(100, 140, 100, 160) + spule(100, 160) + T(120, 180, 'Q1') + T(78, 172, 'A1', 'end', 10) + T(78, 190, 'A2', 'end', 10) +
    L(100, 192, 100, 230)),

  // Gemischte Schaltung: R1 in Reihe zu R2 parallel R3 an 24 V
  netz: svg(360, 170,
    L(40, 30, 40, 70) + batterie(40, 70) + L(40, 106, 40, 140) + T(58, 92, 'U = 24 V') + T(24, 84, '+', 'middle', 14) +
    L(40, 30, 110, 30) + widerstandH(110, 30) + T(124, 16, 'R1 = 8 Ω', 'middle') + L(138, 30, 300, 30) + dot(190, 30) +
    L(190, 30, 190, 55) + widerstandV(190, 55) + L(190, 99, 190, 140) + T(204, 82, 'R2 = 12 Ω') +
    L(300, 30, 300, 55) + widerstandV(300, 55) + L(300, 99, 300, 140) + T(314, 82, 'R3') + T(314, 98, '24 Ω') +
    L(40, 140, 300, 140) + dot(190, 140)),

  // LED mit Vorwiderstand an 9 V, einmal in Durchlass-, einmal in Sperrrichtung
  ledRichtig: svg(260, 170,
    L(40, 30, 40, 65) + batterie(40, 65) + L(40, 101, 40, 140) + T(24, 80, '+', 'middle', 14) + T(58, 90, '9 V') +
    L(40, 30, 120, 30) + widerstandH(120, 30) + T(134, 16, 'R', 'middle') + L(148, 30, 200, 30) +
    L(200, 30, 200, 60) + diodeRunter(200, 60) + ledPfeile(200, 60) + L(200, 96, 200, 140) + L(40, 140, 200, 140)),
  ledFalsch: svg(260, 170,
    L(40, 30, 40, 65) + batterie(40, 65) + L(40, 101, 40, 140) + T(24, 80, '+', 'middle', 14) + T(58, 90, '9 V') +
    L(40, 30, 120, 30) + widerstandH(120, 30) + T(134, 16, 'R', 'middle') + L(148, 30, 200, 30) +
    L(200, 30, 200, 60) + diodeHoch(200, 60) + ledPfeile(200, 60) + L(200, 96, 200, 140) + L(40, 140, 200, 140)),

  // UND und ODER hintereinander
  logik: svg(320, 150,
    gatter(90, 18, '&') + L(36, 32, 90, 32) + L(36, 60, 90, 60) + T(28, 36, 'E1', 'end') + T(28, 64, 'E2', 'end') +
    L(134, 46, 170, 46) + L(170, 46, 170, 74) + L(170, 74, 196, 74) +
    gatter(196, 60, '≥1') + L(36, 102, 196, 102) + T(28, 106, 'E3', 'end') +
    L(240, 88, 284, 88) + T(292, 92, 'A')),

  // Klemmbrett eines Drehstrommotors
  stern: klemmbrett(false),
  dreieck: klemmbrett(true),

  // Netzsysteme, vereinfacht
  tncs: netzsystem('tncs'),
  tt: netzsystem('tt'),
  tns: netzsystem('tns')
};

function klemmbrett(dreieck) {
  const xs = [70, 140, 210], oben = ['W2', 'U2', 'V2'], unten = ['U1', 'V1', 'W1'], netz = ['L1', 'L2', 'L3'];
  let b = `<rect x="30" y="30" width="230" height="110" rx="8" stroke-width="1.5"/>`;
  xs.forEach((x, i) => {
    b += C(x, 60, 9) + C(x, 110, 9) + T(x + 13, 52, oben[i], 'start', 12) + T(x + 13, 128, unten[i], 'start', 12);
    b += L(x, 119, x, 170) + T(x, 186, netz[i], 'middle', 12);
    if (dreieck) b += `<path d="M${x} 60V110" stroke-width="6"/>`;
  });
  if (!dreieck) b += `<path d="M70 60H210" stroke-width="6"/>`;
  return svg(290, 194, b);
}

function netzsystem(art) {
  const erde = (x, y) => L(x, y, x, y + 10) + L(x - 10, y + 10, x + 10, y + 10) + L(x - 6, y + 14, x + 6, y + 14) + L(x - 2, y + 18, x + 2, y + 18);
  const ys = [36, 52, 68];
  let b = R(14, 26, 44, 74) + T(36, 18, 'Trafo', 'middle', 11) + L(36, 100, 36, 130) + erde(36, 130);
  ys.forEach((y, i) => { b += L(58, y, 300, y) + T(306, y + 4, 'L' + (i + 1)); });
  b += L(150, 14, 150, 160, ' stroke-width="1.5" stroke-dasharray="5 4"') + T(150, 174, 'Hausanschluss', 'middle', 11);
  // Verbraucher rechts mit Gehäuse am PE
  b += R(232, 126, 44, 26) + T(254, 144, 'Gerät', 'middle', 11);
  if (art === 'tncs') {
    b += L(58, 84, 190, 84) + T(100, 80, 'PEN', 'middle', 11) + dot(190, 84) + L(190, 84, 300, 84) + T(306, 88, 'N') +
      L(190, 84, 190, 100) + L(190, 100, 300, 100) + T(306, 104, 'PE') + L(254, 100, 254, 126) + dot(254, 100);
  } else if (art === 'tns') {
    b += L(58, 84, 300, 84) + T(306, 88, 'N') + L(36, 100, 300, 100) + T(306, 104, 'PE') + dot(36, 100) + L(254, 100, 254, 126) + dot(254, 100);
  } else {
    b += L(58, 84, 300, 84) + T(306, 88, 'N') + L(254, 152, 254, 162) + erde(254, 162) + T(272, 182, 'Anlagenerder', 'start', 11);
  }
  return svg(350, 196, b);
}
