// Schaltplan-Trainer: Stromlaufpläne aus dem Bauteilkasten zeichnen, verdrahten, erproben und prüfen.
// ENGINE ist reine Logik ohne DOM (Bauteile, Simulation, Prüfschritte, Leitungsführung) und wird in tests/ geprüft.
import { C, onTheme, hexA, pad2, reduceMotion, FONT, announce, boltsSVG, sfx, TAU } from '../ui.js';

/*ENGINE-START*/
export const ENGINE = (() => {
  const TFULL = 10000;                     // Nachlaufzeit im Spiel (ms), angezeigt als 3 Minuten
  const PHASE = { L1: 1, L2: 2, L3: 3 };
  const EPS = 1e-6;

  // ---------- Bauteile: Klemmen relativ zur Bauteilmitte ----------
  const pin = (k, x, y, d, lab) => ({ k, x, y, d, lab: lab === undefined ? k : lab });
  const C2 = (a, b) => [pin('t', 0, -1.8, -1, a), pin('b', 0, 1.8, 1, b)];
  const POLES = () => [pin('1', -2.4, -2, -1), pin('3', 0, -2, -1), pin('5', 2.4, -2, -1), pin('2', -2.4, 2, 1), pin('4', 0, 2, 1), pin('6', 2.4, 2, 1)];
  const LAMP = () => [pin('X1', 0, -1.9, -1, ''), pin('X2', 0, 1.9, 1, '')];
  const COIL = () => [pin('A1', 0, -1.9, -1), pin('A2', 0, 1.9, 1)];
  const TYPES = {
    aus:     { name: 'Ausschalter', short: 'Ausschalter', pre: 'S', op: 'toggle', pins: () => C2('P', '1'), box: [-2.2, -1.8, 1, 1.8] },
    wechsel: { name: 'Wechselschalter', short: 'Wechselschalter', pre: 'S', op: 'toggle', flip: true,
               pins: c => c.root === 'bottom'
                 ? [pin('1', -1.2, -1.8, -1), pin('2', 1.2, -1.8, -1), pin('P', 0, 1.8, 1)]
                 : [pin('P', 0, -1.8, -1), pin('1', -1.2, 1.8, 1), pin('2', 1.2, 1.8, 1)], box: [-1.9, -1.8, 1.9, 1.8] },
    kreuz:   { name: 'Kreuzschalter', short: 'Kreuzschalter', pre: 'S', op: 'toggle', pins: () => [pin('1', -1.2, -1.8, -1), pin('2', 1.2, -1.8, -1), pin('3', -1.2, 1.8, 1), pin('4', 1.2, 1.8, 1)], box: [-1.9, -1.8, 1.9, 1.8] },
    serie:   { name: 'Serienschalter', short: 'Serienschalter', pre: 'S', op: 'serie', pins: () => [pin('P', 0, -1.8, -1), pin('1', -1.2, 1.8, 1), pin('2', 1.2, 1.8, 1)], box: [-2.4, -1.8, 2.4, 1.8] },
    taster:  { name: 'Taster', short: 'Taster', pre: 'S', op: 'hold', pins: () => C2('P', '1'), box: [-2.2, -1.8, 1, 1.8] },
    tno:     { name: 'Drucktaster Ein (Schließer)', short: 'Taster Ein', pre: 'S', op: 'hold', pins: () => C2('13', '14'), box: [-2.2, -1.8, 1, 1.8] },
    tnc:     { name: 'Drucktaster Aus (Öffner)', short: 'Taster Aus', pre: 'S', op: 'hold', pins: () => C2('11', '12'), box: [-2.2, -1.8, 1, 1.8] },
    lamp:    { name: 'Leuchte', short: 'Leuchte', pre: 'E', load: true, pins: LAMP, box: [-1.2, -1.9, 1.2, 1.9] },
    hlamp:   { name: 'Meldeleuchte', short: 'Meldeleuchte', pre: 'H', load: true, pins: LAMP, box: [-1.2, -1.9, 1.2, 1.9] },
    coil:    { name: 'Schützspule', short: 'Schützspule', pre: 'Q', load: true, dev: 'contactor', pins: COIL, box: [-1.5, -1.9, 1.5, 1.9] },
    icoil:   { name: 'Stromstoßschalter (Spule)', short: 'Stromstoß-Spule', pre: 'K', load: true, dev: 'impulse', pins: COIL, box: [-1.5, -1.9, 1.5, 1.9] },
    ttimer:  { name: 'Treppenlicht-Zeitschalter', short: 'Treppenlicht', pre: 'K', dev: 'timer', pins: () => [pin('3', -2.2, -2.3, -1), pin('L', 1.8, -2.3, -1), pin('N', -2.2, 2.3, 1), pin('U', 1.8, 2.3, 1, '↑')], box: [-3.3, -2.3, 3.3, 2.3] },
    main3:   { name: 'Hauptkontakte (Schütz)', short: 'Hauptkontakte', of: 'contactor', pins: POLES, box: [-3.3, -2, 3.3, 2] },
    no:      { name: 'Hilfsschließer (Schütz)', short: 'Schließer', of: 'contactor', aux: 'no', pins: () => C2('', ''), box: [-1.2, -1.8, 1, 1.8] },
    nc:      { name: 'Hilfsöffner (Schütz)', short: 'Öffner', of: 'contactor', aux: 'nc', pins: () => C2('', ''), box: [-1.2, -1.8, 1, 1.8] },
    ino:     { name: 'Stromstoßschalter (Kontakt)', short: 'Stromstoß-Kontakt', of: 'impulse', pins: () => C2('1', '2'), box: [-1.2, -1.8, 1, 1.8] },
    ol3:     { name: 'Motorschutzrelais', short: 'Motorschutz', pre: 'F', dev: 'overload', op: 'trip', pins: POLES, box: [-3.3, -2, 3.3, 2] },
    olc:     { name: 'Motorschutz-Öffner 95-96', short: 'Öffner 95-96', of: 'overload', pins: () => C2('95', '96'), box: [-2.4, -1.8, 1, 1.8] },
    fuse3:   { name: 'Sicherung (3-polig)', short: 'Sicherung', pre: 'F', pins: POLES, box: [-3.3, -2, 3.3, 2] },
    motor3:  { name: 'Drehstrommotor', short: 'Motor 3~', pre: 'M', pins: () => [pin('U1', -1.8, -3.4, -1), pin('V1', 0, -3.4, -1), pin('W1', 1.8, -3.4, -1), pin('PE', 3.8, 2.6, 1)], box: [-2.6, -3.4, 4.2, 2.6] }
  };
  const ALL = Object.keys(TYPES);

  // ---------- Prüfhilfen ----------
  const motorMsg = (lab, got, exp) => {
    if (exp === 'aus') return `${lab} läuft, sollte aber stehen.`;
    if (got === 'aus') return `${lab} steht, sollte aber ${exp} laufen.`;
    if (got === 'brummt') return `${lab} brummt: Ein Außenleiter fehlt oder liegt doppelt an.`;
    return `${lab} läuft ${got} statt ${exp}: Zwei Außenleiter sind vertauscht.`;
  };
  const expect = list => o => {
    for (const [c, v] of list) {
      if (c.type === 'motor3') { const g = o.motor[c.uid]; if (g !== v) return motorMsg(c.label, g, v); }
      else if (c.type === 'lamp' || c.type === 'hlamp') { if (!!o.lit[c.uid] !== !!v) return v ? `${c.label} bleibt dunkel.` : `${c.label} leuchtet, sollte aber aus sein.`; }
      else if (!!o.energ[c.uid] !== !!v) return v ? `${c.label} zieht nicht an.` : `${c.label} bleibt angezogen.`;
    }
    return null;
  };
  const flipOf = (E, S) => (o, ctx) => (ctx.prev && !!o.lit[E.uid] !== !!ctx.prev.lit[E.uid]) ? null : `${E.label} schaltet nicht um, wenn ${S.label} betätigt wird.`;
  const peStep = M => ({ group: 'Besichtigen', say: `Schutzleiter an ${M.label} angeschlossen`, check: o => o.pe[M.uid] ? null : `${M.label} hat keinen Schutzleiter. Verbinde die PE-Schiene mit der PE-Klemme des Motors.` });
  const R = (id, pot, label, y, x0, x1) => ({ id, pot, label, y, x0, x1 });

  const INST = ['aus', 'wechsel', 'kreuz', 'serie', 'taster', 'lamp'];
  const LEVELS = [
    {
      id: 'aus', title: 'Ausschaltung', short: 'Ausschaltung', kind: 'Installationsschaltung', W: 34, H: 24, min: 3,
      rails: [R('L', 'L1', 'L', 2.5, 3, 32), R('N', 'N', 'N', 17.5, 3, 32)],
      palette: ['aus', 'wechsel', 'taster', 'lamp'], bom: { aus: 1, lamp: 1 },
      solution: { comps: [{ uid: 's1', type: 'aus', x: 10, y: 7.5 }, { uid: 'e1', type: 'lamp', x: 20, y: 13.5 }],
                  wires: [['L', 's1.t'], ['s1.b', 'e1.X1'], ['e1.X2', 'N']] },
      task: 'Zeichne eine Leuchte, die von einer Stelle aus ein- und ausgeschaltet wird.',
      tip: 'Der Schalter unterbricht immer den Außenleiter L. Der Neutralleiter N geht direkt zur Leuchte.',
      learn: {
        how: 'Der Ausschalter unterbricht den Außenleiter L. Ist er offen, liegt an der Leuchte keine Spannung mehr an.',
        err: 'Schalter im Neutralleiter: Die Leuchte geht aus, steht aber weiter unter Spannung. Beim Lampenwechsel droht ein Stromschlag.',
        use: 'Raumbeleuchtung mit einer Schaltstelle. Im Stromlaufplan fehlt hier der Schutzleiter zur Leuchte. Auf der Baustelle gehört er dazu.'
      },
      plan: Q => {
        const [S] = Q.of('aus'), [E] = Q.of('lamp');
        return [
          { say: `${S.label} aus: ${E.label} ist dunkel`, do: { set: { [S.uid]: 0 } }, check: expect([[E, 0]]) },
          { say: `${S.label} ein: ${E.label} leuchtet`, do: { set: { [S.uid]: 1 } }, check: expect([[E, 1]]) },
          { say: `${S.label} aus: ${E.label} geht aus`, do: { set: { [S.uid]: 0 } }, check: expect([[E, 0]]) }
        ];
      }
    },
    {
      id: 'serie', title: 'Serienschaltung', short: 'Serienschaltung', kind: 'Installationsschaltung', W: 38, H: 25, min: 5,
      rails: [R('L', 'L1', 'L', 2.5, 3, 36), R('N', 'N', 'N', 18.5, 3, 36)],
      palette: ['aus', 'serie', 'wechsel', 'lamp'], bom: { serie: 1, lamp: 2 },
      solution: { comps: [{ uid: 's1', type: 'serie', x: 10, y: 7.5 }, { uid: 'e1', type: 'lamp', x: 20, y: 14 }, { uid: 'e2', type: 'lamp', x: 29, y: 14 }],
                  wires: [['L', 's1.P'], ['s1.1', 'e1.X1'], ['s1.2', 'e2.X1'], ['e1.X2', 'N'], ['e2.X2', 'N']] },
      task: 'Zwei Leuchten sollen von einer Stelle aus getrennt geschaltet werden. Beide Schalter sitzen in einem Gehäuse.',
      tip: 'Der Serienschalter hat einen gemeinsamen Eingang P für den Außenleiter und zwei Ausgänge 1 und 2.',
      learn: {
        how: 'Zwei Wippen in einem Gehäuse. Beide nutzen den gemeinsamen Eingang P und schalten je einen eigenen Ausgang.',
        err: 'Beide Leuchten am selben Ausgang: Dann schaltet eine Wippe alles und die andere nichts.',
        use: 'Deckenleuchte mit zwei Lampengruppen, Licht und Lüfter im Bad.'
      },
      plan: Q => {
        const [S] = Q.of('serie'), [E1, E2] = Q.of('lamp'), a = S.uid + ':a', b = S.uid + ':b';
        return [
          { say: 'Beide Wippen aus: beide Leuchten dunkel', do: { set: { [a]: 0, [b]: 0 } }, check: expect([[E1, 0], [E2, 0]]) },
          { say: 'Wippe 1 ein: eine Leuchte geht an', do: { set: { [a]: 1 } }, check: (o, ctx) => {
              const on = [E1, E2].filter(e => o.lit[e.uid]);
              if (!on.length) return 'Wippe 1 schaltet keine Leuchte.';
              if (on.length === 2) return 'Wippe 1 schaltet beide Leuchten. Jede Wippe braucht ihre eigene Leuchte.';
              ctx.mark.a = on[0]; return null;
            } },
          { say: 'Wippe 2 ein: beide Leuchten an', do: { set: { [b]: 1 } }, check: expect([[E1, 1], [E2, 1]]), hint: 'Wippe 2 muss die andere Leuchte schalten.' },
          { say: 'Wippe 1 aus: nur die zweite Leuchte bleibt an', do: { set: { [a]: 0 } }, check: (o, ctx) => {
              const A = ctx.mark.a, X = A === E1 ? E2 : E1;
              if (o.lit[A.uid]) return `${A.label} bleibt an, obwohl Wippe 1 aus ist.`;
              if (!o.lit[X.uid]) return `${X.label} geht mit aus. Wippe 2 muss ${X.label} allein schalten.`;
              return null;
            } },
          { say: 'Wippe 2 aus: beide Leuchten dunkel', do: { set: { [b]: 0 } }, check: expect([[E1, 0], [E2, 0]]) }
        ];
      }
    },
    {
      id: 'wechsel', title: 'Wechselschaltung', short: 'Wechselschaltung', kind: 'Installationsschaltung', W: 40, H: 28, min: 5,
      rails: [R('L', 'L1', 'L', 2.5, 3, 38), R('N', 'N', 'N', 22, 3, 38)],
      palette: ['aus', 'serie', 'wechsel', 'kreuz', 'lamp'], bom: { wechsel: 2, lamp: 1 },
      solution: { comps: [{ uid: 's1', type: 'wechsel', root: 'top', x: 9, y: 7 }, { uid: 's2', type: 'wechsel', root: 'bottom', x: 18, y: 13 }, { uid: 'e1', type: 'lamp', x: 27, y: 18.5 }],
                  wires: [['L', 's1.P'], ['s1.1', 's2.1'], ['s1.2', 's2.2'], ['s2.P', 'e1.X1'], ['e1.X2', 'N']] },
      task: 'Eine Leuchte soll von zwei Stellen aus schaltbar sein, zum Beispiel an beiden Enden eines Flurs.',
      tip: 'L kommt an die Wurzel P des ersten Schalters. Zwei korrespondierende Adern verbinden die Klemmen 1 und 2 beider Schalter. Von der Wurzel P des zweiten geht es zur Leuchte. Mit »Wurzel nach unten« drehst du einen Schalter um.',
      learn: {
        how: 'Jeder Wechselschalter verbindet seine Wurzel P mit Klemme 1 oder 2. Die beiden korrespondierenden Adern verbinden die Schalter. Die Leuchte brennt, wenn beide Schalter auf dieselbe Ader zeigen.',
        err: 'L an eine korrespondierende Klemme statt an die Wurzel: Dann funktioniert die Schaltung nur in einzelnen Stellungen.',
        use: 'Flur, Treppe oder Schlafzimmer mit zwei Schaltstellen.'
      },
      plan: Q => {
        const [A, B] = Q.of('wechsel'), [E] = Q.of('lamp');
        return [
          { say: `Grundstellung ${A.label} und ${B.label}`, do: { set: { [A.uid]: 0, [B.uid]: 0 } } },
          { say: `${A.label} umschalten: ${E.label} wechselt`, do: { set: { [A.uid]: 1 } }, check: flipOf(E, A) },
          { say: `${B.label} umschalten: ${E.label} wechselt`, do: { set: { [B.uid]: 1 } }, check: flipOf(E, B) },
          { say: `${A.label} zurück: ${E.label} wechselt`, do: { set: { [A.uid]: 0 } }, check: flipOf(E, A) },
          { say: `${B.label} zurück: ${E.label} wechselt`, do: { set: { [B.uid]: 0 } }, check: flipOf(E, B) }
        ];
      }
    },
    {
      id: 'kreuz', title: 'Kreuzschaltung', short: 'Kreuzschaltung', kind: 'Installationsschaltung', W: 44, H: 28, min: 7,
      rails: [R('L', 'L1', 'L', 2.5, 3, 42), R('N', 'N', 'N', 22, 3, 42)],
      palette: ['aus', 'wechsel', 'kreuz', 'taster', 'lamp'], bom: { wechsel: 2, kreuz: 1, lamp: 1 },
      solution: { comps: [{ uid: 's1', type: 'wechsel', root: 'top', x: 8, y: 7 }, { uid: 's2', type: 'kreuz', x: 16, y: 13.5 }, { uid: 's3', type: 'wechsel', root: 'top', x: 25, y: 13.5 }, { uid: 'e1', type: 'lamp', x: 33, y: 15 }],
                  wires: [['L', 's1.P'], ['s1.1', 's2.1'], ['s1.2', 's2.2'], ['s2.3', 's3.1'], ['s2.4', 's3.2'], ['s3.P', 'e1.X1'], ['e1.X2', 'N']] },
      task: 'Drei Schaltstellen für eine Leuchte, zum Beispiel in einem langen Flur mit drei Türen.',
      tip: 'Außen sitzen zwei Wechselschalter, dazwischen der Kreuzschalter in den korrespondierenden Adern. Jede weitere Schaltstelle ist ein weiterer Kreuzschalter.',
      learn: {
        how: 'Der Kreuzschalter sitzt in den korrespondierenden Adern. In der einen Stellung führt er sie gerade durch, in der anderen tauscht er sie. So wechselt jede Betätigung den Lichtzustand.',
        err: 'Kreuzschalter an eine Wurzel angeschlossen: Außen sitzen immer die beiden Wechselschalter.',
        use: 'Lange Flure mit drei oder mehr Schaltstellen. Bei vielen Schaltstellen ist eine Stromstoßschaltung meist einfacher.'
      },
      plan: Q => {
        const W = Q.of('wechsel'), [K] = Q.of('kreuz'), [E] = Q.of('lamp'), sw = [W[0], K, W[1]], st = [0, 0, 0];
        const steps = [{ say: 'Grundstellung aller Schalter', do: { set: { [sw[0].uid]: 0, [sw[1].uid]: 0, [sw[2].uid]: 0 } } }];
        for (const i of [0, 1, 0, 2, 0, 1, 0]) {
          st[i] ^= 1;
          steps.push({ say: `${sw[i].label} umschalten: ${E.label} wechselt`, do: { set: { [sw[i].uid]: st[i] } }, check: flipOf(E, sw[i]) });
        }
        return steps;
      }
    },
    {
      id: 'stoss', title: 'Stromstoßschaltung', short: 'Stromstoß', kind: 'Installationsschaltung', W: 44, H: 28, min: 10,
      rails: [R('L', 'L1', 'L', 2.5, 3, 42), R('N', 'N', 'N', 22, 3, 42)],
      palette: ['wechsel', 'kreuz', 'taster', 'icoil', 'ino', 'ttimer', 'lamp'], bom: { taster: 3, icoil: 1, ino: 1, lamp: 1 },
      solution: { comps: [{ uid: 't1', type: 'taster', x: 6, y: 7 }, { uid: 't2', type: 'taster', x: 12.5, y: 7 }, { uid: 't3', type: 'taster', x: 19, y: 7 },
                          { uid: 'k1', type: 'icoil', x: 26, y: 14 }, { uid: 'k1c', type: 'ino', x: 33, y: 7 }, { uid: 'e1', type: 'lamp', x: 37, y: 15 }],
                  wires: [['L', 't1.t'], ['L', 't2.t'], ['L', 't3.t'], ['t1.b', 'k1.A1'], ['t2.b', 'k1.A1'], ['t3.b', 'k1.A1'], ['k1.A2', 'N'], ['L', 'k1c.t'], ['k1c.b', 'e1.X1'], ['e1.X2', 'N']] },
      task: 'Drei Taster schalten eine Leuchte über einen Stromstoßschalter. Jeder Tastendruck wechselt den Schaltzustand.',
      tip: 'Die Taster liegen parallel und geben L auf die Spule A1, A2 geht an N. Die Leuchte schaltet der Kontakt 1-2 des Stromstoßschalters.',
      learn: {
        how: 'Jeder Tastendruck gibt einen kurzen Impuls auf die Spule A1. Der Stromstoßschalter wechselt dann seinen Kontakt 1-2 und hält die Stellung bis zum nächsten Impuls. Spule und Kontakt tragen dasselbe Kennzeichen, hier K1.',
        err: 'Leuchte direkt am Taster: Sie leuchtet nur, solange der Taster gedrückt ist. Spule ohne N: Der Stromstoßschalter reagiert nicht.',
        use: 'Viele Schaltstellen, zum Beispiel in Fluren oder großen Räumen. Alle Taster liegen parallel.'
      },
      plan: Q => {
        const T = Q.of('taster'), [E] = Q.of('lamp');
        const steps = [{ say: `Ruhezustand: ${E.label} aus`, check: expect([[E, 0]]) }];
        let on = 0;
        [0, 1, 2, 0].forEach((i, n) => {
          on ^= 1;
          steps.push({ say: `${T[i].label} drücken: ${E.label} geht ${on ? 'an' : 'aus'}`, do: { press: T[i].uid }, check: expect([[E, on]]),
            hint: n === 0 ? 'Die Taster geben L auf A1, A2 geht an N. Die Leuchte schaltet der Kontakt 1-2.' : undefined });
          steps.push({ say: `${T[i].label} loslassen: ${E.label} bleibt ${on ? 'an' : 'aus'}`, do: { release: T[i].uid }, check: expect([[E, on]]),
            hint: n === 0 ? 'Der Taster gibt nur den Impuls. Die Leuchte hängt am Kontakt, nicht am Taster.' : undefined });
        });
        return steps;
      }
    },
    {
      id: 'treppe', title: 'Treppenlichtschaltung', short: 'Treppenlicht', kind: 'Installationsschaltung', W: 46, H: 30, min: 12,
      rails: [R('L', 'L1', 'L', 2.5, 3, 44), R('N', 'N', 'N', 24, 3, 44)],
      palette: ['taster', 'wechsel', 'icoil', 'ino', 'ttimer', 'lamp'], bom: { taster: 3, ttimer: 1, lamp: 2 },
      solution: { comps: [{ uid: 't1', type: 'taster', x: 6, y: 7.5 }, { uid: 't2', type: 'taster', x: 12.5, y: 7.5 }, { uid: 't3', type: 'taster', x: 19, y: 7.5 },
                          { uid: 'k1', type: 'ttimer', x: 27.5, y: 14 }, { uid: 'e1', type: 'lamp', x: 35, y: 20 }, { uid: 'e2', type: 'lamp', x: 41, y: 20 }],
                  wires: [['L', 'k1.L'], ['k1.N', 'N'], ['L', 't1.t'], ['L', 't2.t'], ['L', 't3.t'], ['t1.b', 'k1.3'], ['t2.b', 'k1.3'], ['t3.b', 'k1.3'],
                          ['k1.U', 'e1.X1'], ['k1.U', 'e2.X1'], ['e1.X2', 'N'], ['e2.X2', 'N']] },
      task: 'Treppenhaus über drei Etagen: Jeder der drei Taster schaltet zwei Leuchten für eine Nachlaufzeit ein. Danach geht das Licht von selbst aus.',
      tip: 'Vierleiterschaltung: Der Zeitschalter bekommt L und N. Die Taster geben L auf Klemme 3, die Leuchten hängen am Ausgang ↑.',
      learn: {
        how: 'Ein Tastendruck gibt L auf Klemme 3 und startet die Nachlaufzeit. Der Zeitschalter schaltet die Leuchten über den Ausgang ↑ ein und nach Ablauf der Zeit wieder aus. Ein erneuter Tastendruck startet die Zeit neu.',
        err: 'Leuchten direkt an L oder am Taster. Zeitschalter ohne N: Das Gerät hat keine Versorgung und schaltet nicht.',
        use: 'Treppenhäuser in Mehrfamilienhäusern, Keller und Dachböden. Hier ist die Vierleiterschaltung gezeichnet: Die Taster haben eine eigene Steuerader zu Klemme 3.'
      },
      plan: Q => {
        const T = Q.of('taster'), Es = Q.of('lamp'), [K] = Q.of('ttimer');
        const all = v => expect(Es.map(e => [e, v]));
        const steps = [{ say: 'Ruhezustand: Licht aus', check: all(0) }];
        [0, 2, 1].forEach((i, n) => {
          steps.push({ say: `${T[i].label} drücken: Licht an`, do: { press: T[i].uid }, check: all(1), hint: n === 0 ? `${K.label} braucht L und N. Taster an Klemme 3, Leuchten an den Ausgang ↑.` : undefined });
          steps.push({ say: `${T[i].label} loslassen: Licht bleibt an`, do: { release: T[i].uid }, check: all(1), hint: n === 0 ? 'Der Taster schaltet nicht die Leuchten. Er gibt nur L auf Klemme 3.' : undefined });
          steps.push({ say: 'Nachlaufzeit abgelaufen: Licht aus', do: { timeout: K.uid }, check: all(0), hint: n === 0 ? 'Die Leuchten gehören an den Ausgang ↑, nicht direkt an L.' : undefined });
        });
        return steps;
      }
    },
    {
      id: 'selbst', title: 'Schützschaltung mit Selbsthaltung', short: 'Selbsthaltung', kind: 'Steuerstromkreis', W: 40, H: 31, min: 8,
      rails: [R('L', 'L1', 'L', 2.5, 3, 38), R('N', 'N', 'N', 25, 3, 38)],
      palette: ['tno', 'tnc', 'coil', 'no', 'nc', 'lamp', 'hlamp'], bom: { tnc: 1, tno: 1, coil: 1, no: 1, hlamp: 1 },
      solution: { comps: [{ uid: 'a1', type: 'tnc', x: 10, y: 7 }, { uid: 'a2', type: 'tno', x: 10, y: 13 }, { uid: 'q1', type: 'coil', x: 10, y: 20 },
                          { uid: 'a3', type: 'no', x: 18, y: 13 }, { uid: 'h1', type: 'hlamp', x: 26, y: 20 }],
                  wires: [['L', 'a1.t'], ['a1.b', 'a2.t'], ['a1.b', 'a3.t'], ['a2.b', 'q1.A1'], ['a3.b', 'q1.A1'], ['q1.A2', 'N'], ['h1.X1', 'a3.b'], ['h1.X2', 'N']] },
      task: 'Ein Schütz soll mit einem Ein-Taster einschalten, sich selbst halten und mit einem Aus-Taster wieder abschalten. Eine Meldeleuchte zeigt den Betrieb an.',
      tip: 'Für die Selbsthaltung liegt ein Hilfsschließer des Schützes parallel zum Ein-Taster. Der Aus-Taster liegt davor in Reihe, damit Aus immer Vorrang hat.',
      learn: {
        how: 'Der Ein-Taster bringt die Spule kurz an Spannung. Der Schütz zieht an und schließt seinen Hilfsschließer 13-14 parallel zum Taster. Darüber hält er sich selbst, bis der Aus-Taster den Strompfad unterbricht.',
        err: 'Haltekontakt parallel zu Aus- und Ein-Taster: Dann lässt sich der Schütz nicht mehr ausschalten. Aus als Schließer: Ein Drahtbruch würde nicht abschalten.',
        use: 'Aus als Öffner und Ein als Schließer sorgen für Drahtbruchsicherheit. Nach einem Spannungsausfall läuft die Anlage nicht von selbst wieder an.'
      },
      plan: Q => {
        const [Aus] = Q.of('tnc'), [Ein] = Q.of('tno'), [K] = Q.of('coil'), [H] = Q.of('hlamp');
        return [
          { say: `Ruhezustand: ${K.label} abgefallen`, check: expect([[K, 0], [H, 0]]) },
          { say: `${Ein.label} (Ein) drücken: ${K.label} zieht an`, do: { press: Ein.uid }, check: expect([[K, 1]]), hint: `L über ${Aus.label} und ${Ein.label} auf A1, A2 an N.` },
          { say: `${H.label} zeigt den Betrieb`, check: expect([[H, 1]]), hint: `${H.label} liegt parallel zur Spule, also zwischen A1 und N.` },
          { say: `${Ein.label} loslassen: ${K.label} hält sich selbst`, do: { release: Ein.uid }, check: expect([[K, 1]]), hint: `Der Schließer ${K.label} 13-14 muss parallel zu ${Ein.label} liegen.` },
          { say: `${Aus.label} (Aus) drücken: ${K.label} fällt ab`, do: { press: Aus.uid }, check: expect([[K, 0], [H, 0]]), hint: `${Aus.label} muss in Reihe vor ${Ein.label} und vor dem Haltekontakt liegen.` },
          { say: `${Aus.label} loslassen: ${K.label} bleibt aus`, do: { release: Aus.uid }, check: expect([[K, 0]]) },
          { say: `${Ein.label} drücken: ${K.label} zieht an`, do: { press: Ein.uid }, check: expect([[K, 1]]) },
          { say: `${Ein.label} loslassen: ${K.label} bleibt an`, do: { release: Ein.uid }, check: expect([[K, 1]]) },
          { say: 'Beide Taster gleichzeitig: Aus hat Vorrang', do: { press: [Aus.uid, Ein.uid] }, check: expect([[K, 0]]), hint: `${Aus.label} muss vor ${Ein.label} und vor dem Haltekontakt liegen.` },
          { say: `Beide loslassen: ${K.label} bleibt aus`, do: { release: [Aus.uid, Ein.uid] }, check: expect([[K, 0]]) }
        ];
      }
    },
    {
      id: 'motor', title: 'Drehstrommotor über Schütz', short: 'Drehstrommotor', kind: 'Motorschaltung', W: 52, H: 38, min: 10,
      rails: [R('L1', 'L1', 'L1', 2.5, 3, 23), R('L2', 'L2', 'L2', 4, 3, 23), R('L3', 'L3', 'L3', 5.5, 3, 23), R('PE', 'PE', 'PE', 32.5, 3, 23),
              R('L', 'L1', 'L1', 2.5, 27, 50), R('N', 'N', 'N', 27.5, 27, 50)],
      palette: ['main3', 'ol3', 'motor3', 'fuse3', 'no', 'nc', 'coil'], bom: { main3: 1, ol3: 1, motor3: 1 },
      pre: [
        { uid: 'pf1', type: 'fuse3', x: 12, y: 9.5 },
        { uid: 'pf2c', type: 'olc', x: 32, y: 7 },
        { uid: 'ps1', type: 'tnc', x: 32, y: 12.5 },
        { uid: 'ps2', type: 'tno', x: 32, y: 18 },
        { uid: 'pq1a', type: 'no', of: 'pq1', x: 39, y: 18 },
        { uid: 'pq1', type: 'coil', x: 32, y: 23.5 },
        { uid: 'ph1', type: 'hlamp', x: 45, y: 23.5 }
      ],
      prewired: [['L1', 'pf1.1'], ['L2', 'pf1.3'], ['L3', 'pf1.5'], ['L', 'pf2c.t'], ['pf2c.b', 'ps1.t'], ['ps1.b', 'ps2.t'], ['ps1.b', 'pq1a.t'], ['ps2.b', 'pq1.A1'],
                 ['pq1a.b', 'pq1.A1'], ['pq1.A2', 'N'], ['ph1.X1', 'pq1a.b'], ['ph1.X2', 'N']],
      solution: { comps: [{ uid: 'm1', type: 'main3', x: 12, y: 15 }, { uid: 'f2', type: 'ol3', x: 12, y: 21 }, { uid: 'mo', type: 'motor3', x: 12, y: 28.5 }],
                  wires: [['pf1.2', 'm1.1'], ['pf1.4', 'm1.3'], ['pf1.6', 'm1.5'], ['m1.2', 'f2.1'], ['m1.4', 'f2.3'], ['m1.6', 'f2.5'], ['f2.2', 'mo.U1'], ['f2.4', 'mo.V1'], ['f2.6', 'mo.W1'], ['PE', 'mo.PE']] },
      task: 'Der Steuerstromkreis rechts und die Sicherungen F1 sind fertig. Zeichne den Hauptstromkreis: Der Motor läuft über die Hauptkontakte des Schützes Q1 und über einen Motorschutz.',
      tip: 'L1 auf U1, L2 auf V1 und L3 auf W1 ergibt Rechtslauf. Der Öffner 95-96 im Steuerstromkreis gehört zum Motorschutzrelais. Der Schutzleiter PE gehört immer an den Motor.',
      learn: {
        how: 'Q1 schaltet den Motor mit seinen drei Hauptkontakten. Das Motorschutzrelais F2 überwacht den Motorstrom. Bei Überlast öffnet sein Kontakt 95-96 im Steuerstromkreis, und Q1 fällt ab.',
        err: 'Zwei Außenleiter vertauscht: Der Motor dreht links. Eine Phase fehlt: Der Motor brummt und wird heiß. Motorstrom am Motorschutz vorbei: Der Motor ist ungeschützt.',
        use: 'Reihenfolge im Hauptstromkreis: Sicherungen F1, Schütz Q1, Motorschutz F2, Motor M1. Bei Rechtsdrehfeld L1 auf U1, L2 auf V1, L3 auf W1.'
      },
      plan: Q => {
        const [Aus] = Q.of('tnc'), [Ein] = Q.of('tno'), [M] = Q.of('motor3'), [F] = Q.of('ol3'), B = Q.B;
        const viaF = o => ['U1', 'V1', 'W1'].every(p => ['2', '4', '6'].some(q => o.root[B.idx[M.uid + '.' + p]] === o.root[B.idx[F.uid + '.' + q]]))
          ? null : `Der Motorstrom fließt nicht über den Motorschutz ${F.label}.`;
        return [
          peStep(M),
          { group: 'Erproben', say: `Ruhezustand: ${M.label} steht`, check: expect([[M, 'aus']]), hint: 'Der Motor darf nur über die Hauptkontakte des Schützes am Netz liegen.' },
          { say: `${Ein.label} (Ein) drücken: ${M.label} läuft rechts`, do: { press: Ein.uid }, check: o => expect([[M, 'rechts']])(o) || viaF(o),
            hint: `Reihenfolge F1 → Q1 → ${F.label} → Motor. Pol 1 (L1) auf U1, Pol 3 (L2) auf V1, Pol 5 (L3) auf W1.` },
          { say: `${Ein.label} loslassen: ${M.label} läuft weiter`, do: { release: Ein.uid }, check: expect([[M, 'rechts']]) },
          { say: `${Aus.label} (Aus) drücken: ${M.label} steht`, do: { press: Aus.uid }, check: expect([[M, 'aus']]) },
          { say: `${Aus.label} loslassen: ${M.label} bleibt stehen`, do: { release: Aus.uid }, check: expect([[M, 'aus']]) },
          { say: `${Ein.label} drücken: ${M.label} läuft wieder`, do: { press: Ein.uid }, check: expect([[M, 'rechts']]) },
          { say: `${Ein.label} loslassen`, do: { release: Ein.uid }, check: expect([[M, 'rechts']]) },
          { say: `Überlast: ${F.label} löst aus, ${M.label} steht`, do: { trip: F.uid }, check: expect([[M, 'aus']]) },
          { say: `${F.label} zurückgesetzt: ${M.label} läuft nicht von selbst an`, do: { reset: F.uid }, check: expect([[M, 'aus']]) }
        ];
      }
    },
    {
      id: 'wende', title: 'Wendeschützschaltung', short: 'Wendeschaltung', kind: 'Motorschaltung', W: 58, H: 36, min: 11,
      rails: [R('L1', 'L1', 'L1', 2.5, 3, 27), R('L2', 'L2', 'L2', 4, 3, 27), R('L3', 'L3', 'L3', 5.5, 3, 27), R('PE', 'PE', 'PE', 31, 3, 27),
              R('L', 'L1', 'L1', 2.5, 31, 56), R('N', 'N', 'N', 29.5, 31, 56)],
      palette: ['tno', 'tnc', 'no', 'nc', 'coil', 'hlamp'], bom: { tnc: 1, tno: 2, no: 2, nc: 2 },
      pre: [
        { uid: 'pq1m', type: 'main3', of: 'pq1', x: 9, y: 11 },
        { uid: 'pq2m', type: 'main3', of: 'pq2', x: 20, y: 11 },
        { uid: 'pm1', type: 'motor3', x: 14.5, y: 25 },
        { uid: 'pq1', type: 'coil', x: 35, y: 25 },
        { uid: 'pq2', type: 'coil', x: 48, y: 25 }
      ],
      prewired: [['L1', 'pq1m.1'], ['L2', 'pq1m.3'], ['L3', 'pq1m.5'], ['L1', 'pq2m.1'], ['L2', 'pq2m.3'], ['L3', 'pq2m.5'],
                 ['pq1m.2', 'pm1.U1'], ['pq1m.4', 'pm1.V1'], ['pq1m.6', 'pm1.W1'], ['pq2m.2', 'pm1.W1'], ['pq2m.4', 'pm1.V1'], ['pq2m.6', 'pm1.U1'], ['PE', 'pm1.PE'],
                 ['pq1.A2', 'N'], ['pq2.A2', 'N']],
      solution: { comps: [{ uid: 's0', type: 'tnc', x: 35, y: 7 }, { uid: 's1', type: 'tno', x: 35, y: 13 }, { uid: 'a1', type: 'no', of: 'pq1', x: 41, y: 13 },
                          { uid: 's2', type: 'tno', x: 48, y: 13 }, { uid: 'a2', type: 'no', of: 'pq2', x: 54, y: 13 },
                          { uid: 'b2', type: 'nc', of: 'pq2', x: 35, y: 19 }, { uid: 'b1', type: 'nc', of: 'pq1', x: 48, y: 19 }],
                  wires: [['L', 's0.t'], ['s0.b', 's1.t'], ['s1.t', 's2.t'], ['s1.t', 'a1.t'], ['s1.b', 'a1.b'], ['s1.b', 'b2.t'], ['b2.b', 'pq1.A1'],
                          ['s2.t', 'a2.t'], ['s2.b', 'a2.b'], ['s2.b', 'b1.t'], ['b1.b', 'pq2.A1']] },
      hints: { short: 'Q1 und Q2 waren gleichzeitig an. Verriegle die Schütze gegenseitig über ihre Öffner.', flatter: 'Der Öffner eines Schützes gehört in den Strompfad des anderen Schützes.' },
      task: 'Hauptstromkreis und Spulen sind fertig: Q1 für Rechtslauf, Q2 tauscht L1 und L3 für Linkslauf. Zeichne den Steuerstromkreis mit einem Aus-Taster und je einem Ein-Taster für jede Drehrichtung. Q1 und Q2 dürfen nie gleichzeitig anziehen.',
      tip: 'Jeder Schütz braucht eine Selbsthaltung. Zur Verriegelung liegt ein Öffner des einen Schützes im Strompfad des anderen. Kontakte ordnest du nach dem Antippen dem richtigen Schütz zu.',
      learn: {
        how: 'Q1 schaltet den Motor für Rechtslauf. Q2 tauscht zwei Außenleiter, dann dreht der Motor links. Jeder Schütz hält sich über seinen Schließer selbst.',
        err: 'Ohne Verriegelung können beide Schütze gleichzeitig anziehen. Das ist ein Kurzschluss zwischen zwei Außenleitern.',
        use: 'Die Öffner der Schütze verriegeln sich gegenseitig (Schützverriegelung). Oft kommt eine Tasterverriegelung dazu. Zum Umsteuern erst über Aus anhalten.'
      },
      plan: Q => {
        const [Aus] = Q.of('tnc'), [A, Bt] = Q.of('tno'), Qs = Q.of('coil'), [M] = Q.of('motor3'), [Q1, Q2] = Qs;
        const dirOf = q => q === Q1 ? 'rechts' : 'links';
        const stays = (key, who) => (o, ctx) => o.energ[ctx.mark[key].uid] ? null : `${ctx.mark[key].label} fällt ab, sobald ${who.label} losgelassen wird.`;
        const lock = (key, who) => (o, ctx) => o.energ[ctx.mark[key].uid] ? `${ctx.mark[key].label} zieht an, obwohl der andere Schütz läuft.` : null;
        return [
          peStep(M),
          { group: 'Erproben', say: `Ruhezustand: ${M.label} steht`, check: expect([[M, 'aus']]) },
          { say: `${A.label} drücken: ein Schütz zieht an, ${M.label} läuft`, do: { press: A.uid }, check: (o, ctx) => {
              const on = Qs.filter(q => o.energ[q.uid]);
              if (!on.length) return `Kein Schütz zieht an, wenn ${A.label} gedrückt wird.`;
              if (on.length === 2) return 'Beide Schütze ziehen gleichzeitig an.';
              const d = dirOf(on[0]), m = o.motor[M.uid];
              if (m !== d) return motorMsg(M.label, m, d);
              ctx.mark.a = on[0]; ctx.mark.b = on[0] === Q1 ? Q2 : Q1; return null;
            }, hint: `L über den Aus-Taster und ${A.label} auf A1 eines Schützes.` },
          { say: `${A.label} loslassen: ${M.label} läuft weiter`, do: { release: A.uid }, check: stays('a', A), hint: `Selbsthaltung: Ein Schließer des Schützes liegt parallel zu ${A.label}.` },
          { say: `${Bt.label} drücken: Drehrichtung bleibt`, do: { press: Bt.uid }, check: lock('b', Bt), hint: 'Verriegelung: Ein Öffner des laufenden Schützes gehört in den Strompfad des anderen.' },
          { say: `${Bt.label} loslassen`, do: { release: Bt.uid }, check: (o, ctx) => o.energ[ctx.mark.a.uid] ? null : `${ctx.mark.a.label} ist abgefallen.` },
          { say: `${Aus.label} (Aus) drücken: ${M.label} steht`, do: { press: Aus.uid }, check: expect([[M, 'aus']]), hint: `${Aus.label} gehört vor beide Strompfade.` },
          { say: `${Aus.label} loslassen: ${M.label} bleibt stehen`, do: { release: Aus.uid }, check: expect([[M, 'aus']]) },
          { say: `${Bt.label} drücken: Gegenrichtung`, do: { press: Bt.uid }, check: (o, ctx) => {
              const q = ctx.mark.b;
              if (!o.energ[q.uid]) return `${q.label} zieht nicht an, wenn ${Bt.label} gedrückt wird.`;
              if (o.energ[ctx.mark.a.uid]) return 'Beide Schütze ziehen gleichzeitig an.';
              const d = dirOf(q), m = o.motor[M.uid];
              return m === d ? null : motorMsg(M.label, m, d);
            }, hint: `${Bt.label} muss den anderen Schütz einschalten.` },
          { say: `${Bt.label} loslassen: ${M.label} läuft weiter`, do: { release: Bt.uid }, check: stays('b', Bt), hint: `Selbsthaltung: Ein Schließer des Schützes liegt parallel zu ${Bt.label}.` },
          { say: `${A.label} drücken: Drehrichtung bleibt`, do: { press: A.uid }, check: lock('a', A), hint: 'Verriegelung: Ein Öffner des laufenden Schützes gehört in den Strompfad des anderen.' },
          { say: `${A.label} loslassen`, do: { release: A.uid } },
          { say: `${Aus.label} drücken: ${M.label} steht`, do: { press: Aus.uid }, check: expect([[M, 'aus']]) }
        ];
      }
    },
    {
      id: 'frei', title: 'Freies Zeichenblatt', short: 'Freies Blatt', kind: 'Eigene Schaltpläne', W: 60, H: 40, free: true,
      rails: [R('L1', 'L1', 'L1', 2.5, 3, 58), R('L2', 'L2', 'L2', 4, 3, 58), R('L3', 'L3', 'L3', 5.5, 3, 58), R('N', 'N', 'N', 32.5, 3, 58), R('PE', 'PE', 'PE', 34, 3, 58)],
      palette: ALL,
      task: 'Zeichne eigene Schaltpläne mit allen Bauteilen aus dem Kasten. Die Anlage läuft sofort mit. Für Lichtschaltungen nimmst du L1 als Außenleiter. Eine Prüfung gibt es hier nicht.',
      tip: 'Probiere aus, was bei falscher Verdrahtung passiert. Kurzschluss, Schalter im N oder ein Motor ohne Phase zeigen sich hier genauso wie auf den Übungsblättern.'
    }
  ];

  // ---------- Blatt aus Bauteilen aufbauen: Kennzeichen, Zuordnung, Klemmen ----------
  function board(L, comps) {
    const B = { L, W: L.W, H: L.H, rails: L.rails, railById: {}, comps: [], byUid: {}, pos: {}, dir: {}, compOf: {}, plab: {}, pinIds: [] };
    for (const r of L.rails) B.railById[r.id] = r;
    B.titleBox = [L.W - 17, L.H - 4.4, L.W - 0.5, L.H - 0.5];
    const list = comps.slice().sort((a, b) => (a.seq || 0) - (b.seq || 0));
    const counts = {};
    for (const src of list) {
      const T = TYPES[src.type];
      if (!T) continue;
      const c = Object.assign({}, src, { T });
      if (T.pre) { counts[T.pre] = (counts[T.pre] || 0) + 1; c.label = T.pre + counts[T.pre]; }
      B.comps.push(c); B.byUid[c.uid] = c;
    }
    const ords = {};
    for (const c of B.comps) {
      if (!c.T.of) continue;
      const cand = B.comps.filter(d => d.T.dev === c.T.of);
      let dev = c.of && B.byUid[c.of] && B.byUid[c.of].T.dev === c.T.of ? B.byUid[c.of] : null;
      if (!dev && cand.length === 1) dev = cand[0];
      c.dev = dev; c.cands = cand;
      c.label = dev ? dev.label : ({ contactor: 'Q', impulse: 'K', overload: 'F' }[c.T.of] + '?');
      if (c.T.aux) { const key = dev ? dev.uid : '?'; ords[key] = (ords[key] || 0) + 1; c.ord = ords[key]; }
    }
    for (const c of B.comps) {
      const pins = c.T.pins(c);
      c.pins = pins.map(p => p.k);
      for (const p of pins) {
        const id = c.uid + '.' + p.k;
        B.pos[id] = [c.x + p.x, c.y + p.y]; B.dir[id] = p.d; B.compOf[id] = c; B.pinIds.push(id);
        let lab = p.lab;
        if (c.T.aux === 'no') lab = `${c.ord}${p.k === 't' ? 3 : 4}`;
        else if (c.T.aux === 'nc') lab = `${c.ord}${p.k === 't' ? 1 : 2}`;
        B.plab[id] = lab;
      }
      if (pins.length === 2) { c.pa = pins[0].k; c.pb = pins[1].k; }
      c.bx = [c.x + c.T.box[0], c.y + c.T.box[1], c.x + c.T.box[2], c.y + c.T.box[3]];
    }
    B.nodes = L.rails.map(r => r.id).concat(B.pinIds);
    B.idx = {};
    B.nodes.forEach((n, i) => { B.idx[n] = i; });
    return B;
  }

  // ---------- Platz auf dem Blatt ----------
  function occBox(type, x, y) { const b = TYPES[type].box; return [x + b[0] - 2.4, y + b[1] - 0.6, x + b[2] + 0.6, y + b[3] + 0.6]; }
  function placeOk(B, type, x, y, ignore) {
    const T = TYPES[type];
    if (!T) return false;
    const b = T.box, o = occBox(type, x, y);
    if (o[0] < 0.7 || o[2] > B.W - 0.7 || y + b[1] < 1.4 || y + b[3] > B.H - 1.2) return false;
    const t = B.titleBox;
    if (o[2] > t[0] && o[0] < t[2] && o[3] > t[1] && o[1] < t[3]) return false;
    for (const r of B.rails) if (r.y > y + b[1] - 0.6 && r.y < y + b[3] + 0.6 && x + b[2] > r.x0 - 1.5 && x + b[0] < r.x1 + 1) return false;
    for (const c of B.comps) {
      if (c.uid === ignore) continue;
      const p = occBox(c.type, c.x, c.y);
      if (o[2] > p[0] + EPS && o[0] < p[2] - EPS && o[3] > p[1] + EPS && o[1] < p[3] - EPS) return false;
    }
    return true;
  }
  const OFFS = [];
  for (let dx = -9; dx <= 9; dx++) for (let dy = -9; dy <= 9; dy++) OFFS.push([dx, dy, dx * dx + dy * dy]);
  OFFS.sort((a, b) => a[2] - b[2]);
  function nearestOk(B, type, x, y, ignore) {
    for (const [dx, dy] of OFFS) if (placeOk(B, type, x + dx, y + dy, ignore)) return [x + dx, y + dy];
    return null;
  }

  const freshInputs = () => ({ sw: {}, pr: {}, trip: {} });
  const freshMem = () => ({ on: {}, prev: {}, t: {} });
  const P3 = [['1', '2'], ['3', '4'], ['5', '6']];

  function linksOf(c, inp, on) {
    const s = inp.sw[c.uid] ? 1 : 0, pr = !!inp.pr[c.uid], AB = [[c.pa, c.pb]];
    const act = c.dev ? !!on[c.dev.uid] : false;
    switch (c.type) {
      case 'aus': return s ? AB : [];
      case 'taster': case 'tno': return pr ? AB : [];
      case 'tnc': return pr ? [] : AB;
      case 'no': case 'ino': return act ? AB : [];
      case 'nc': return act ? [] : AB;
      case 'olc': return c.dev && inp.trip[c.dev.uid] ? [] : AB;
      case 'wechsel': return [['P', s ? '2' : '1']];
      case 'kreuz': return s ? [['1', '4'], ['2', '3']] : [['1', '3'], ['2', '4']];
      case 'serie': {
        const r = [];
        if (inp.sw[c.uid + ':a']) r.push(['P', '1']);
        if (inp.sw[c.uid + ':b']) r.push(['P', '2']);
        return r;
      }
      case 'main3': return act ? P3 : [];
      case 'ol3': case 'fuse3': return P3;
      case 'ttimer': return on[c.uid] ? [['L', 'U']] : [];
      default: return [];
    }
  }

  // ---------- Simulation: Netze bilden, Spulen und Zeitglieder bis zum Ruhezustand nachführen ----------
  function simulate(B, wires, inp, mem0, dead) {
    const mem = { on: Object.assign({}, mem0.on), prev: Object.assign({}, mem0.prev), t: Object.assign({}, mem0.t) };
    const n = B.nodes.length, par = new Int32Array(n);
    const find = i => { while (par[i] !== i) { par[i] = par[par[i]]; i = par[i]; } return i; };
    const uni = (a, b) => { a = find(a); b = find(b); if (a !== b) par[a] = b; };
    let potOf = new Map();
    const potAt = id => { const s = potOf.get(find(B.idx[id])); return s ? s.values().next().value : null; };
    const phaseAt = id => { const p = potAt(id); return p && PHASE[p] ? p : null; };
    const loadSt = (a, b) => {
      const pa = phaseAt(a), pb = phaseAt(b);
      if (pa && pb) return pa === pb ? 'off' : 'over';
      const na = potAt(a), nb = potAt(b);
      if ((pa && nb === 'N') || (pb && na === 'N')) return 'on';
      if ((pa && nb === 'PE') || (pb && na === 'PE')) return 'pe';
      return 'off';
    };
    const build = () => {
      for (let i = 0; i < n; i++) par[i] = i;
      for (const w of wires) { const a = B.idx[w.a], b = B.idx[w.b]; if (a !== undefined && b !== undefined) uni(a, b); }
      for (const c of B.comps) for (const [p, q] of linksOf(c, inp, mem.on)) uni(B.idx[c.uid + '.' + p], B.idx[c.uid + '.' + q]);
      potOf = new Map();
      if (!dead) for (const r of B.rails) {
        const k = find(B.idx[r.id]);
        if (!potOf.has(k)) potOf.set(k, new Set());
        potOf.get(k).add(r.pot);
      }
    };
    const fail = f => ({ fault: f, mem: mem0 });

    let converged = false;
    for (let iter = 0; iter < 30 && !converged; iter++) {
      build();
      for (const s of potOf.values()) if (s.size > 1) return fail({ kind: 'short', pots: [...s] });
      let changed = false;
      for (const c of B.comps) {
        if (c.type === 'coil' || c.type === 'icoil') {
          const st = loadSt(c.uid + '.A1', c.uid + '.A2');
          if (st === 'over' || st === 'pe') return fail({ kind: st, comp: c.uid });
          const e = st === 'on';
          let v = e;
          if (c.type === 'icoil') { v = !!mem.on[c.uid]; if (e && !mem.prev[c.uid]) v = !v; mem.prev[c.uid] = e; }
          if (!!mem.on[c.uid] !== v) { mem.on[c.uid] = v; changed = true; }
        } else if (c.type === 'ttimer') {
          const st = loadSt(c.uid + '.L', c.uid + '.N');
          if (st === 'over' || st === 'pe') return fail({ kind: st, comp: c.uid });
          const powered = st === 'on';
          if (powered && phaseAt(c.uid + '.3')) mem.t[c.uid] = TFULL;
          if (!powered) mem.t[c.uid] = 0;
          const v = powered && (mem.t[c.uid] || 0) > 0;
          if (!!mem.on[c.uid] !== v) { mem.on[c.uid] = v; changed = true; }
        }
      }
      if (!changed) converged = true;
    }
    if (!converged) return fail({ kind: 'flatter' });

    const lit = {}, energ = {}, motor = {}, pe = {}, trig = {}, powered = {};
    for (const c of B.comps) {
      if (c.type === 'lamp' || c.type === 'hlamp') {
        const st = loadSt(c.uid + '.X1', c.uid + '.X2');
        if (st === 'over' || st === 'pe') return fail({ kind: st, comp: c.uid });
        lit[c.uid] = st === 'on';
      } else if (c.type === 'coil' || c.type === 'icoil') {
        energ[c.uid] = loadSt(c.uid + '.A1', c.uid + '.A2') === 'on';
      } else if (c.type === 'ttimer') {
        powered[c.uid] = loadSt(c.uid + '.L', c.uid + '.N') === 'on';
        trig[c.uid] = powered[c.uid] && !!phaseAt(c.uid + '.3');
      } else if (c.type === 'motor3') {
        const nums = ['U1', 'V1', 'W1'].map(p => { const ph = phaseAt(c.uid + '.' + p); return ph ? PHASE[ph] : 0; });
        const set = new Set(nums.filter(Boolean));
        if (set.size === 3) {
          const [a, b, d] = nums;
          motor[c.uid] = ((b - a + 3) % 3 === 1 && (d - b + 3) % 3 === 1) ? 'rechts' : 'links';
        } else motor[c.uid] = set.size === 2 ? 'brummt' : 'aus';
        pe[c.uid] = potAt(c.uid + '.PE') === 'PE';
      }
    }
    const pot = new Array(n), root = new Array(n);
    for (let i = 0; i < n; i++) { root[i] = find(i); const s = potOf.get(root[i]); pot[i] = s ? s.values().next().value : null; }
    return { fault: null, mem, lit, energ, motor, pe, trig, powered, pot, root };
  }

  const potName = (B, p) => { const r = B.rails.find(x => x.pot === p); return r ? r.label : p; };
  function faultText(B, f, hints) {
    const lab = uid => (B.byUid[uid] || {}).label || uid;
    const extra = k => (hints !== false && B.L.hints && B.L.hints[k]) ? ' ' + B.L.hints[k] : '';
    if (f.kind === 'short') {
      const names = [...new Set(f.pots.map(p => potName(B, p)))].sort().join(' und ');
      if (f.pots.includes('PE')) return `${names} sind direkt verbunden: Der FI-Schutzschalter löst aus.` + extra('short');
      return `Kurzschluss zwischen ${names}: Der Leitungsschutzschalter löst aus.` + extra('short');
    }
    if (f.kind === 'over') return `${lab(f.comp)} liegt an 400 V zwischen zwei Außenleitern und brennt durch.`;
    if (f.kind === 'pe') return `Über ${lab(f.comp)} fließt Strom zum Schutzleiter: Der FI-Schutzschalter löst aus. Verbraucher gehören zwischen Außenleiter und N.`;
    return 'Die Schaltung flattert: Ein Schütz schaltet sich über seinen eigenen Öffner immer wieder ab.' + extra('flatter');
  }

  function generalCheck(B, o) {
    for (const c of B.comps) {
      if (!c.T.load) continue;
      if ((c.type === 'lamp' || c.type === 'hlamp') ? o.lit[c.uid] : o.energ[c.uid]) continue;
      const a = o.pot[B.idx[c.uid + '.' + c.pa]], b = o.pot[B.idx[c.uid + '.' + c.pb]];
      if (PHASE[a] || PHASE[b]) return `${c.label} ist aus, hat aber noch Spannung vom Außenleiter. Geschaltet wird immer der Außenleiter, nie der Neutralleiter.`;
    }
    return null;
  }

  function bomText(L, placed) {
    if (!L.bom) return null;
    const have = {};
    placed.forEach(c => { have[c.type] = (have[c.type] || 0) + 1; });
    const miss = [], extra = [];
    for (const t in L.bom) { const d = L.bom[t] - (have[t] || 0); if (d > 0) miss.push(`${d}× ${TYPES[t].name}`); }
    for (const t in have) { const d = have[t] - (L.bom[t] || 0); if (d > 0) extra.push(`${d}× ${TYPES[t].name}`); }
    if (!miss.length && !extra.length) return null;
    return [miss.length ? 'Es fehlt: ' + miss.join(', ') + '.' : '', extra.length ? 'Zu viel: ' + extra.join(', ') + '.' : ''].filter(Boolean).join(' ');
  }
  function roles(B) {
    const num = c => parseInt(String(c.label || '').replace(/\D/g, ''), 10) || 0;
    return { B, of: (...types) => B.comps.filter(c => types.includes(c.type)).sort((a, b) => num(a) - num(b) || (a.seq || 0) - (b.seq || 0)) };
  }

  const clone = o => JSON.parse(JSON.stringify(o));
  function runTests(B, wires, opts) {
    const L = B.L, hints = !(opts && opts.hints === false);
    const placed = B.comps.filter(c => !c.pre);
    const pre = [];
    if (L.bom) pre.push({ group: 'Besichtigen', say: 'Stückliste vollständig', stat: () => {
      const t = bomText(L, placed);
      if (!t) return null;
      return hints ? 'Die Stückliste stimmt nicht. ' + t : 'Die Stückliste stimmt nicht: Es fehlen Bauteile, oder es sind falsche oder zu viele gesetzt.';
    } });
    if (B.comps.some(c => c.T.of)) pre.push({ group: L.bom ? undefined : 'Besichtigen', say: 'Kontakte ihren Geräten zugeordnet', stat: () => {
      const u = B.comps.find(c => c.T.of && !c.dev);
      if (!u) return null;
      return u.cands.length ? `${u.T.name} ${u.label} gehört noch zu keinem Gerät. Tippe den Kontakt an und ordne ihn zu.` : `${u.T.name} ${u.label}: Das passende Gerät fehlt auf dem Blatt.`;
    } });
    const ok0 = pre.every(s => !s.stat());
    const plan = ok0 && L.plan ? L.plan(roles(B)) : [];
    if (plan.length && !plan[0].group) plan[0].group = 'Erproben';
    const steps = pre.concat(plan);
    const inp = freshInputs();
    let mem = freshMem();
    const ctx = { prev: null, mark: {} };
    const rows = [];
    for (const step of steps) {
      let o, err = null;
      if (step.stat) {
        err = step.stat();
        o = simulate(B, wires, inp, mem);
        if (o.fault) o = simulate(B, wires, inp, mem, true);
      } else {
        const d = step.do || {};
        if (d.set) Object.assign(inp.sw, d.set);
        if (d.press) [].concat(d.press).forEach(k => { inp.pr[k] = true; });
        if (d.release) [].concat(d.release).forEach(k => { inp.pr[k] = false; });
        if (d.trip) inp.trip[d.trip] = true;
        if (d.reset) inp.trip[d.reset] = false;
        if (d.timeout) mem = Object.assign({}, mem, { t: Object.assign({}, mem.t, { [d.timeout]: 0 }) });
        o = simulate(B, wires, inp, mem);
        if (o.fault) err = faultText(B, o.fault, hints);
        if (!err && step.check) err = step.check(o, ctx);
        if (!err) err = generalCheck(B, o);
        if (err && hints && step.hint && !o.fault) err += ' ' + step.hint;
        if (!o.fault) mem = o.mem;
      }
      rows.push({ say: step.say, group: step.group, ok: !err, err, inp: clone(inp), mem: clone(mem), o });
      if (err) break;
      if (!step.stat) ctx.prev = o;
    }
    return { steps: steps.map(s => ({ say: s.say, group: s.group })), rows, complete: ok0 };
  }

  // ---------- Leitungsführung: rechtwinklig, Gassen ohne fremde Adern ----------
  function simplify(p) {
    const out = [];
    for (const q of p) {
      const last = out[out.length - 1];
      if (last && Math.abs(last[0] - q[0]) < EPS && Math.abs(last[1] - q[1]) < EPS) continue;
      out.push([q[0], q[1]]);
    }
    for (let i = out.length - 2; i >= 1; i--) {
      const a = out[i - 1], b = out[i], c = out[i + 1];
      if ((Math.abs(a[0] - b[0]) < EPS && Math.abs(b[0] - c[0]) < EPS) || (Math.abs(a[1] - b[1]) < EPS && Math.abs(b[1] - c[1]) < EPS)) out.splice(i, 1);
    }
    return out;
  }
  const isH = (a, b) => Math.abs(a[1] - b[1]) < EPS;
  function segBox(a, b, bx) {
    const e = 0.12;
    const x0 = Math.min(a[0], b[0]), x1 = Math.max(a[0], b[0]), y0 = Math.min(a[1], b[1]), y1 = Math.max(a[1], b[1]);
    return x1 > bx[0] + e && x0 < bx[2] - e && y1 > bx[1] + e && y0 < bx[3] - e;
  }
  function nearPoint(a, b, p, r) {
    return p[0] > Math.min(a[0], b[0]) - r && p[0] < Math.max(a[0], b[0]) + r && p[1] > Math.min(a[1], b[1]) - r && p[1] < Math.max(a[1], b[1]) + r;
  }
  function overlap(a, b, c, d) {
    if (isH(a, b) && isH(c, d) && Math.abs(a[1] - c[1]) < 0.2) {
      return Math.max(0, Math.min(Math.max(a[0], b[0]), Math.max(c[0], d[0])) - Math.max(Math.min(a[0], b[0]), Math.min(c[0], d[0])));
    }
    if (!isH(a, b) && !isH(c, d) && Math.abs(a[0] - c[0]) < 0.2) {
      return Math.max(0, Math.min(Math.max(a[1], b[1]), Math.max(c[1], d[1])) - Math.max(Math.min(a[1], b[1]), Math.min(c[1], d[1])));
    }
    return 0;
  }
  function crosses(a, b, c, d) {
    let h, v;
    if (isH(a, b) && !isH(c, d)) { h = [a, b]; v = [c, d]; }
    else if (!isH(a, b) && isH(c, d)) { h = [c, d]; v = [a, b]; }
    else return false;
    const y = h[0][1], x = v[0][0];
    return x > Math.min(h[0][0], h[1][0]) + EPS && x < Math.max(h[0][0], h[1][0]) - EPS && y > Math.min(v[0][1], v[1][1]) + EPS && y < Math.max(v[0][1], v[1][1]) - EPS;
  }
  function touches(p, a, b) {
    if (isH(a, b)) return Math.abs(p[1] - a[1]) < 0.05 && p[0] > Math.min(a[0], b[0]) + 0.05 && p[0] < Math.max(a[0], b[0]) - 0.05;
    return Math.abs(p[0] - a[0]) < 0.05 && p[1] > Math.min(a[1], b[1]) + 0.05 && p[1] < Math.max(a[1], b[1]) - 0.05;
  }
  function score(B, p, segs, net, w) {
    let s = 0;
    for (let i = 1; i < p.length; i++) {
      const a = p[i - 1], b = p[i];
      s += (Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1])) * 0.08;
      if (i > 1) s += 0.6;
      for (const c of B.comps) if (segBox(a, b, c.bx)) s += 60;
      if (segBox(a, b, B.titleBox)) s += 60;
      for (const id of B.pinIds) if (id !== w.a && id !== w.b && nearPoint(a, b, B.pos[id], 0.32)) s += 40;
      if (isH(a, b)) for (const r of B.rails) if (Math.abs(a[1] - r.y) < 0.3 && Math.max(a[0], b[0]) > r.x0 && Math.min(a[0], b[0]) < r.x1) s += 50;
      for (const q of [a, b]) if (q[0] < 1 || q[0] > B.W - 1 || q[1] < 1 || q[1] > B.H - 1) s += 100;
      for (const g of segs) {
        if (g.net === net) continue;
        const ov = overlap(a, b, g.a, g.b);
        if (ov > 0.01) s += 30 + ov * 4;
        else if (crosses(a, b, g.a, g.b)) s += 2.5;
      }
    }
    for (let i = 1; i < p.length - 1; i++) for (const g of segs) if (g.net !== net && touches(p[i], g.a, g.b)) s += 20;
    return s;
  }
  function endpoint(B, id) {
    const r = B.railById[id];
    if (r) return { rail: true, y: r.y, x0: r.x0, x1: r.x1 };
    const p = B.pos[id];
    return { rail: false, x: p[0], y: p[1], d: B.dir[id] };
  }
  function routeOne(B, w, segs, net) {
    let A = endpoint(B, w.a), Bq = endpoint(B, w.b);
    if (A.rail && Bq.rail) return [];
    if (A.rail) { const t = A; A = Bq; Bq = t; }
    const S = 0.6, ay = A.y + A.d * S, cands = [];
    if (Bq.rail) {
      const ry = Bq.y, toward = (ry - A.y) * A.d > 0;
      if (toward && A.x >= Bq.x0 && A.x <= Bq.x1) cands.push({ p: [[A.x, A.y], [A.x, ry]], pref: 0 });
      const xs = [Math.min(Bq.x1 - 0.5, Math.max(Bq.x0 + 0.5, A.x))];
      for (let kx = 0.5; kx <= 10; kx += 0.5) xs.push(A.x + kx, A.x - kx);
      for (const x of xs) {
        if (x < Bq.x0 || x > Bq.x1) continue;
        cands.push({ p: [[A.x, A.y], [A.x, ay], [x, ay], [x, ry]], pref: 1 + Math.abs(x - A.x) * (toward ? 0.6 : 0.3) });
      }
    } else {
      const by = Bq.y + Bq.d * S;
      let lo = -Infinity, hi = Infinity;
      if (A.d > 0) lo = Math.max(lo, ay); else hi = Math.min(hi, ay);
      if (Bq.d > 0) lo = Math.max(lo, by); else hi = Math.min(hi, by);
      if (lo <= hi + EPS) {
        const a = isFinite(lo) ? lo : hi - 8, b = isFinite(hi) ? hi : lo + 8;
        const mid = isFinite(lo) && isFinite(hi) ? (lo + hi) / 2 : isFinite(lo) ? lo + 1 : hi - 1;
        let any = false;
        for (let m = Math.ceil(a * 2 - EPS) / 2; m <= b + EPS; m += 0.5) {
          any = true;
          cands.push({ p: [[A.x, A.y], [A.x, m], [Bq.x, m], [Bq.x, Bq.y]], pref: Math.abs(m - mid) * 0.4 });
        }
        if (!any) { const m = (a + b) / 2; cands.push({ p: [[A.x, A.y], [A.x, m], [Bq.x, m], [Bq.x, Bq.y]], pref: 0 }); }
      }
      const x0 = Math.min(A.x, Bq.x) - 8, x1 = Math.max(A.x, Bq.x) + 8;
      for (let x = Math.ceil(x0 * 2) / 2; x <= x1 + EPS; x += 0.5) {
        cands.push({ p: [[A.x, A.y], [A.x, ay], [x, ay], [x, by], [Bq.x, by], [Bq.x, Bq.y]], pref: 4 + Math.min(Math.abs(x - A.x), Math.abs(x - Bq.x)) * 0.25 });
      }
    }
    let best = null, bs = Infinity;
    for (const c of cands) {
      const p = simplify(c.p);
      if (p.length < 2) continue;
      const s = c.pref + score(B, p, segs, net, w);
      if (s < bs) { bs = s; best = p; }
    }
    return best || [[A.x, A.y], [Bq.rail ? A.x : Bq.x, Bq.y]];
  }
  function routeAll(B, wires) {
    const par = new Map();
    const find = a => { let r = a; while (par.has(r) && par.get(r) !== r) r = par.get(r); return r; };
    for (const w of wires) { const ra = find(w.a), rb = find(w.b); if (ra !== rb) par.set(ra, rb); }
    const segs = [];
    for (const w of wires) {
      w.net = find(w.a);
      w.path = routeOne(B, w, segs, w.net);
      w.railPt = (B.railById[w.a] || B.railById[w.b]) && w.path.length ? w.path[w.path.length - 1] : null;
      for (let i = 1; i < w.path.length; i++) segs.push({ a: w.path[i - 1], b: w.path[i], net: w.net, w });
    }
    for (const w of wires) {
      w.dots = [];
      for (const q of w.path.slice(1, -1)) for (const g of segs) {
        if (g.w !== w && g.net === w.net && touches(q, g.a, g.b)) { w.dots.push(q); break; }
      }
    }
    return segs;
  }

  return { TFULL, PHASE, TYPES, LEVELS, board, placeOk, nearestOk, freshInputs, freshMem, linksOf, simulate, runTests, faultText, routeAll, geo: { segBox, nearPoint, overlap, crosses } };
})();
/*ENGINE-END*/

const TEMPLATE = `
<nav class="sheets" id="c-sheets" aria-label="Blätter"></nav>

    <article class="task">
      <div class="task-head">
        <p class="eyebrow" id="c-eyebrow">Blatt 01 von 09 · Installationsschaltung</p>
        <button class="switch" id="c-helpmode" type="button" aria-pressed="true"><span class="switch-knob" aria-hidden="true"></span><span id="c-helpmode-text">Lernhilfen an</span></button>
      </div>
      <h2 id="c-title">Ausschaltung</h2>
      <p id="c-task">Zeichne die Schaltung.</p>
      <div class="aids" id="c-aids">
        <p class="tip"><b>Merke:</b> <span id="c-tip"></span></p>
        <div id="c-bomwrap"><p class="lbl">Stückliste</p><ul class="bom" id="c-bom"></ul></div>
        <details class="learn" id="c-learn">
          <summary id="c-learn-sum">So funktioniert es</summary>
          <dl id="c-learn-body"></dl>
        </details>
      </div>
      <p class="exam-note" id="c-examnote" hidden>Prüfungsmodus: keine Stückliste, keine Tipps, die Adern zeigen keine Spannung. Drei Blitze gibt es nur so.</p>
      <p class="task-meta" id="c-meta">
        <span>Bauteile <b id="c-parts-n">0</b></span>
        <span>Adern <b id="c-wires">0</b> · Ziel <b id="c-min">0</b></span>
        <span>Fehlversuche <b id="c-fails">0</b></span>
        <span>Bestwert <span class="mini-bolts" id="c-best"></span></span>
      </p>
    </article>

    <section class="kit" aria-labelledby="c-kit-title">
      <div class="kit-head">
        <h3 class="lbl" id="c-kit-title">Bauteilkasten</h3>
        <p>Bauteil aufs Blatt ziehen, oder antippen und dann auf eine freie Stelle tippen.</p>
      </div>
      <div class="parts" id="c-parts"></div>
    </section>

    <div class="banner" id="c-banner" role="alert" hidden>
      <p id="c-banner-text"></p>
      <button class="btn" id="c-reset" type="button">Wieder einschalten</button>
    </div>

    <div class="sheet-wrap" id="c-wrap">
      <canvas id="sheet" tabindex="0" aria-label="Schaltplanblatt. Bauteile setzen und Klemmen verbinden." aria-describedby="c-help"></canvas>
    </div>

    <div class="selbar" id="c-selbar" hidden></div>

    <div class="ops">
      <div class="ops-group" id="c-devices" role="group" aria-label="Bedienung der Schaltgeräte"></div>
      <div class="ops-group" role="group" aria-label="Werkzeuge">
        <button class="btn" id="c-undo" type="button">Rückgängig</button>
        <button class="btn" id="c-del" type="button">Entfernen</button>
        <button class="btn" id="c-clear" type="button">Alles löschen</button>
        <button class="btn primary" id="c-test" type="button">Prüfen</button>
      </div>
    </div>
    <p class="msg" id="c-msg" aria-live="polite"></p>

    <section class="protocol" id="c-protocol" aria-labelledby="c-proto-title" hidden>
      <div class="protocol-head">
        <h3 id="c-proto-title">Prüfprotokoll</h3>
        <span class="verdict" id="c-verdict">läuft</span>
        <button class="btn ghost" id="c-skip" type="button">Überspringen</button>
      </div>
      <ol class="steps" id="c-steps"></ol>
      <div class="protocol-foot" id="c-foot" hidden></div>
    </section>

    <div class="help" id="c-help">
      <p><b>Bauteile setzen:</b> Zieh ein Bauteil aus dem Kasten aufs Blatt. Oder tippe es an und dann auf eine freie Stelle. Gesetzte Bauteile lassen sich verschieben. Antippen zeigt, was du mit ihnen machen kannst: umdrehen, zuordnen, entfernen.</p>
      <p><b>Verdrahten:</b> Tippe eine Klemme an, dann eine zweite. Dazwischen entsteht eine Ader. Die Schienen L, N und PE kannst du an jeder Stelle antippen. Ziehen von Klemme zu Klemme geht auch.</p>
      <p><b>Kontakte:</b> Hilfskontakte und Hauptkontakte gehören zu einem Schütz. Gibt es mehrere Schütze, ordnest du den Kontakt nach dem Antippen zu. Er trägt dann dessen Kennzeichen, zum Beispiel Q1.</p>
      <p><b>Ausprobieren und Prüfen:</b> Mit den Knöpfen unter dem Plan schaltest du die Anlage. Mit Lernhilfen zeigt jede Ader ihr Potential in der Aderfarbe: braun L, blau N, grün-gelb PE. »Prüfen« besichtigt und erprobt die Anlage Schritt für Schritt.</p>
    </div>
`;

export function mount(container, opts = {}) {
  container.innerHTML = TEMPLATE;
  const $ = id => container.querySelector('#' + id);
  const ac = new AbortController();
  const sig = { signal: ac.signal };
  const T = ENGINE.TYPES, PHASE = ENGINE.PHASE, LV = ENGINE.LEVELS;
  const canvas = $('sheet'), mainCtx = canvas.getContext('2d');
  let ctx = mainCtx;
  const wrap = $('c-wrap');
  const KEY = 'eazubi.schaltplan.v1';
  const save = { li: 0, stars: {}, drafts: {}, help: true };
  try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && typeof s === 'object') Object.assign(save, s); } catch (e) {}
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(save)); } catch (e) {} };
  const help = () => save.help !== false;

  let L = null, B = null, li = 0;
  let comps = [], wires = [], seq = 1, undo = [];
  let sel = null, selWire = -1, selComp = null, hover = null;
  let drag = null, cdrag = null, pdrag = null, armed = null, ghost = null, ptr = null;
  let inp = ENGINE.freshInputs(), mem = ENGINE.freshMem(), out = null, trip = null;
  let fails = 0, usedSolution = false, play = null;
  let active = false, running = false, last = 0;
  let k = 10, cssW = 0, cssH = 0, dpr = 1, layer = null, lastWrapW = -1;
  let keyNav = false, lastInputKey = false, cursor = null;
  const motorAng = {};
  let msgTimer = 0;

  const playerWires = () => wires.filter(w => !w.pre);
  const placedComps = () => comps.filter(c => !c.pre);
  const epName = id => {
    const r = B.railById[id];
    if (r) return `Schiene ${r.label}`;
    const c = B.compOf[id];
    if (!c) return id;
    const lab = B.plab[id];
    return lab ? `${c.label} ${lab}` : c.label;
  };
  function say(text, ms = 4500) {
    clearTimeout(msgTimer);
    const m = $('c-msg');
    if (!m) return;
    m.textContent = text;
    if (ms) msgTimer = setTimeout(() => { const n = $('c-msg'); if (n) n.textContent = ''; }, ms);
  }

  // ---------- Zustand sichern ----------
  const snap = () => ({
    comps: placedComps().map(c => ({ uid: c.uid, type: c.type, x: c.x, y: c.y, root: c.root, of: c.of, seq: c.seq })),
    wires: playerWires().map(w => [w.a, w.b]),
    seq
  });
  function applySnap(s) {
    const okComp = c => c && T[c.type] && Number.isFinite(c.x) && Number.isFinite(c.y) && typeof c.uid === 'string' && (L.free || L.palette.includes(c.type));
    comps = comps.filter(c => c.pre).concat((s.comps || []).filter(okComp).map(c => Object.assign({}, c)));
    wires = wires.filter(w => w.pre).concat((s.wires || []).filter(p => Array.isArray(p) && p[0] !== p[1]).map(([a, b]) => ({ a, b })));
    seq = Math.max(Number(s.seq) || 1, ...comps.map(c => (c.seq || 0) + 1));
  }
  function pushUndo() { undo.push(snap()); if (undo.length > 120) undo.shift(); }
  function saveDraft() { save.drafts[L.id] = snap(); persist(); }

  function rebuild() {
    B = ENGINE.board(L, comps);
    wires = wires.filter(w => B.idx[w.a] !== undefined && B.idx[w.b] !== undefined);
    ENGINE.routeAll(B, wires);
  }
  function afterEdit() {
    rebuild();
    saveDraft();
    if (!play) $('c-protocol').hidden = true;
    resim();
    renderControls(); renderBom(); renderMeta(); renderSelbar(); syncTools();
  }

  // ---------- Blatt laden ----------
  function loadLevel(i) {
    if (play) stopPlay();
    li = Math.max(0, Math.min(LV.length - 1, i | 0));
    L = LV[li];
    save.li = li; persist();
    comps = (L.pre || []).map((c, n) => Object.assign({}, c, { pre: true, seq: n - 1000 }));
    wires = (L.prewired || []).map(([a, b]) => ({ a, b, pre: true }));
    seq = 1;
    const d = save.drafts[L.id];
    if (d && typeof d === 'object' && !Array.isArray(d)) applySnap(d);
    undo = []; sel = null; selWire = -1; selComp = null; hover = null;
    drag = cdrag = pdrag = null; armed = null; ghost = null; trip = null; cursor = null;
    inp = ENGINE.freshInputs(); mem = ENGINE.freshMem(); out = null;
    fails = 0; usedSolution = false;
    rebuild();
    resim(true);
    renderTask(); renderChips(); renderPalette(); renderControls(); renderSelbar(); syncTools();
    $('c-protocol').hidden = true; $('c-banner').hidden = true;
    say('');
    lastWrapW = -1; sizeSheet();
  }

  // ---------- Simulation ----------
  function resim(silent) {
    const prev = out;
    let o = ENGINE.simulate(B, wires, inp, mem, !!trip);
    if (o.fault && !trip) {
      trip = { text: ENGINE.faultText(B, o.fault, help()), kind: o.fault.kind };
      o = ENGINE.simulate(B, wires, inp, mem, true);
      if (!silent) sfx.spark();
      showBanner();
    }
    mem = o.mem; out = o;
    if (!silent && prev && !prev.fault) {
      for (const c of B.comps) if (c.type === 'coil' && o.energ[c.uid] && !prev.energ[c.uid]) { sfx.contactor(); break; }
      for (const c of B.comps) if (c.type === 'icoil' && !!o.mem.on[c.uid] !== !!(prev.mem.on || {})[c.uid]) { sfx.klack(); break; }
    }
    syncControls();
  }
  function showBanner() {
    const dev = trip.kind === 'short' && !/FI/.test(trip.text) ? 'Leitungsschutzschalter ausgelöst. ' : trip.kind === 'over' ? 'Achtung, Überspannung. ' : 'Schutzeinrichtung ausgelöst. ';
    $('c-banner-text').textContent = dev + trip.text;
    $('c-banner').hidden = false;
    announce(trip.text);
  }
  function resetTrip() { trip = null; $('c-banner').hidden = true; resim(); }

  // ---------- Bauteile ----------
  function newUid() { let id; do { id = 'c' + seq++; } while (comps.some(c => c.uid === id)); return id; }
  function addComp(type, x, y) {
    pushUndo();
    const uid = newUid();
    comps.push({ uid, type, x, y, seq: seq++, root: type === 'wechsel' ? 'top' : undefined });
    selComp = uid; sel = null; selWire = -1;
    afterEdit();
    sfx.place();
    const c = B.byUid[uid];
    say(c.T.of && !c.dev && c.cands.length > 1 ? `${c.T.name} gesetzt. Ordne ihn unten einem Gerät zu.` : `${c.label} gesetzt: ${c.T.name}`);
  }
  function moveComp(uid, x, y) {
    const c = comps.find(q => q.uid === uid);
    if (!c || c.pre || (c.x === x && c.y === y)) return;
    pushUndo();
    c.x = x; c.y = y;
    afterEdit();
    sfx.tick();
  }
  function removeComp(uid) {
    const c = comps.find(q => q.uid === uid);
    if (!c) return;
    if (c.pre) { sfx.thunk(); say('Dieses Bauteil gehört zur Vorgabe und bleibt stehen.'); return; }
    pushUndo();
    const lab = B.byUid[uid] ? B.byUid[uid].label : '';
    comps = comps.filter(q => q.uid !== uid);
    wires = wires.filter(w => !w.a.startsWith(uid + '.') && !w.b.startsWith(uid + '.'));
    comps.forEach(q => { if (q.of === uid) q.of = undefined; });
    if (selComp === uid) selComp = null;
    afterEdit();
    sfx.tick();
    say(`${lab} entfernt, samt seinen Adern.`);
  }
  function flipComp(uid) {
    const c = comps.find(q => q.uid === uid);
    if (!c || c.pre || !T[c.type].flip) return;
    pushUndo();
    c.root = c.root === 'bottom' ? 'top' : 'bottom';
    afterEdit();
  }
  function assignComp(uid, dev) {
    const c = comps.find(q => q.uid === uid);
    if (!c || c.pre) return;
    pushUndo();
    c.of = dev;
    afterEdit();
    sfx.tick();
  }

  // ---------- Adern ----------
  function addWire(a, b) {
    if (a === b) return;
    if (B.railById[a] && B.railById[b]) { sfx.thunk(); say('Zwei Schienen lassen sich nicht direkt verbinden.'); return; }
    if (wires.some(w => (w.a === a && w.b === b) || (w.a === b && w.b === a))) { sfx.thunk(); say('Diese Ader liegt schon.'); return; }
    pushUndo();
    wires.push({ a, b });
    sfx.wire();
    say(`Ader verlegt: ${epName(a)} – ${epName(b)}`);
    afterEdit();
  }
  function removeWire(i) {
    const w = wires[i];
    if (!w) return;
    if (w.pre) { sfx.thunk(); say('Diese Ader gehört zur Vorgabe und bleibt liegen.'); return; }
    pushUndo();
    wires.splice(i, 1);
    selWire = -1;
    sfx.tick();
    say(`Ader entfernt: ${epName(w.a)} – ${epName(w.b)}`);
    afterEdit();
  }
  function doUndo() {
    if (!undo.length || play) return;
    applySnap(undo.pop());
    sel = null; selWire = -1; selComp = null;
    afterEdit();
    say('Letzten Schritt zurückgenommen.');
  }
  function clearAll() {
    if ((!placedComps().length && !playerWires().length) || play) return;
    pushUndo();
    applySnap({ comps: [], wires: [], seq });
    sel = null; selWire = -1; selComp = null;
    afterEdit();
    say('Alles gelöscht, was du gezeichnet hast. Mit »Rückgängig« holst du es zurück.');
  }
  function showSolution() {
    if (play || !L.solution) return;
    pushUndo();
    usedSolution = true;
    applySnap({ comps: L.solution.comps.map((c, n) => Object.assign({}, c, { seq: n + 1 })), wires: L.solution.wires, seq: L.solution.comps.length + 1 });
    sel = null; selWire = -1; selComp = null;
    afterEdit();
    say('Die Musterlösung ist eingezeichnet. Prüfe sie und schau dir an, wie die Adern laufen.', 7000);
  }

  // ---------- Bedienen ----------
  function operate(c, half) {
    if (play) return;
    if (c.T.op === 'toggle') inp.sw[c.uid] = inp.sw[c.uid] ? 0 : 1;
    else if (c.T.op === 'serie') { const key = c.uid + ':' + (half || 'a'); inp.sw[key] = inp.sw[key] ? 0 : 1; }
    else if (c.T.op === 'trip') inp.trip[c.uid] = !inp.trip[c.uid];
    else return;
    sfx.klack();
    resim();
    renderSelbar();
  }
  function press(c, v) {
    if (play || !!inp.pr[c.uid] === v) return;
    inp.pr[c.uid] = v;
    if (v) sfx.klack();
    resim();
  }

  // ---------- Prüfen ----------
  function startTest() {
    if (play || L.free) return;
    sel = null; selWire = -1; selComp = null; armed = null; renderSelbar(); syncPalette();
    const res = ENGINE.runTests(B, wires, { hints: help() });
    const pass = res.complete && res.rows.length === res.steps.length && res.rows.every(r => r.ok);
    if (!pass) fails++;
    for (const r of res.rows) if (r.o.fault) r.o = ENGINE.simulate(B, wires, r.inp, r.mem, true);
    play = { res, pass, i: -1, view: null, timer: 0 };
    buildProtocol(res.steps);
    $('c-protocol').hidden = false;
    syncControls(); syncTools(); renderMeta();
    stepPlay();
  }
  function buildProtocol(steps) {
    const ol = $('c-steps');
    ol.innerHTML = '';
    let grp = null;
    steps.forEach((t, i) => {
      if (t.group && t.group !== grp) {
        grp = t.group;
        const g = document.createElement('li'); g.className = 'grp'; g.textContent = grp; ol.appendChild(g);
      }
      const item = document.createElement('li');
      item.className = 'todo'; item.dataset.i = i;
      item.innerHTML = '<span class="mark" aria-hidden="true">·</span><span class="say"></span>';
      item.querySelector('.say').textContent = t.say;
      ol.appendChild(item);
    });
    $('c-verdict').textContent = 'läuft';
    $('c-verdict').className = 'verdict';
    $('c-skip').hidden = false;
    $('c-foot').hidden = true;
  }
  function markRow(i, r) {
    const item = $('c-steps').querySelector(`li[data-i="${i}"]`);
    if (!item) return;
    item.className = r.ok ? 'ok' : 'bad';
    item.querySelector('.mark').textContent = r.ok ? '✓' : '✗';
    if (!r.ok) { const e = document.createElement('span'); e.className = 'err'; e.textContent = r.err; item.appendChild(e); }
  }
  function stepPlay() {
    if (!play) return;
    play.i++;
    const rows = play.res.rows;
    if (play.i >= rows.length) { finishPlay(); return; }
    const r = rows[play.i];
    play.view = { inp: r.inp, mem: r.mem, o: r.o };
    markRow(play.i, r);
    if (r.ok) sfx.tick();
    syncControls();
    play.timer = setTimeout(stepPlay, reduceMotion.matches ? 0 : (r.ok ? 560 : 900));
  }
  function skipPlay() {
    if (!play) return;
    clearTimeout(play.timer);
    const rows = play.res.rows;
    for (let i = play.i + 1; i < rows.length; i++) markRow(i, rows[i]);
    play.i = rows.length - 1;
    finishPlay();
  }
  function stopPlay() {
    if (!play) return;
    clearTimeout(play.timer);
    play = null;
    syncControls(); syncTools();
  }
  function finishPlay() {
    const { pass, res } = play;
    stopPlay();
    $('c-skip').hidden = true;
    const verdict = $('c-verdict'), foot = $('c-foot');
    foot.innerHTML = ''; foot.hidden = false;
    const n = playerWires().length;
    if (pass) {
      let stars = usedSolution ? 1 : (fails === 0 && n <= L.min) ? 3 : (fails <= 2 && n <= L.min + 3) ? 2 : 1;
      if (help()) stars = Math.min(stars, 2);
      save.stars[L.id] = Math.max(save.stars[L.id] || 0, stars);
      persist();
      verdict.textContent = 'Bestanden'; verdict.className = 'verdict ok';
      const b = document.createElement('div'); b.className = 'bolts'; b.setAttribute('role', 'img'); b.setAttribute('aria-label', `${stars} von 3 Blitzen`); b.innerHTML = boltsSVG(stars);
      const p = document.createElement('p');
      const notes = [`Adern: ${n}, Ziel: ${L.min}.`];
      if (usedSolution) notes.push('Mit Musterlösung gibt es einen Blitz.');
      else if (help() && stars === 2) notes.push('Mit Lernhilfen gibt es höchstens zwei Blitze. Schalte sie für die Prüfung aus.');
      else if (stars < 3) notes.push(`Drei Blitze gibt es ohne Lernhilfen, ohne Fehlversuch und mit höchstens ${L.min} Adern.`);
      p.textContent = notes.join(' ');
      foot.append(b, p);
      const nextIdx = li + 1;
      if (opts.single) {
        const nx = document.createElement('button'); nx.type = 'button'; nx.className = 'btn primary'; nx.textContent = 'Weiter';
        nx.addEventListener('click', () => { if (opts.onDone) opts.onDone({ stars, level: L.id }); });
        foot.append(nx);
        setTimeout(() => nx.focus({ preventScroll: true }), 30);
      } else if (nextIdx < LV.length && !LV[nextIdx].free) {
        const nx = document.createElement('button'); nx.type = 'button'; nx.className = 'btn primary'; nx.textContent = `Weiter zu Blatt ${pad2(nextIdx + 1)}`;
        nx.addEventListener('click', () => { loadLevel(nextIdx); container.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' }); });
        foot.append(nx);
        setTimeout(() => nx.focus({ preventScroll: true }), 30);
      } else {
        const p2 = document.createElement('p'); p2.textContent = 'Alle Übungsblätter geschafft. Auf dem freien Blatt kannst du eigene Pläne zeichnen.'; foot.append(p2);
      }
      sfx.win();
      announce(`Prüfung bestanden, ${stars} von 3 Blitzen.`);
      renderChips();
    } else {
      verdict.textContent = 'Nicht bestanden'; verdict.className = 'verdict bad';
      const p = document.createElement('p');
      p.textContent = res.complete ? 'Der markierte Schritt zeigt, was nicht stimmt. Ändere den Plan und prüfe noch einmal.' : 'Erst wenn Stückliste und Zuordnung stimmen, wird die Anlage erprobt.';
      foot.append(p);
      if (fails >= 2 && help() && L.solution) {
        const s = document.createElement('button'); s.type = 'button'; s.className = 'btn'; s.textContent = 'Lösung zeigen';
        s.addEventListener('click', showSolution);
        foot.append(s);
      }
      sfx.fail();
      const bad = res.rows.find(r => !r.ok);
      announce('Prüfung nicht bestanden. ' + (bad ? bad.err : ''));
    }
    renderMeta();
    resim(true);
  }

  // ---------- Oberfläche ----------
  function renderTask() {
    const nr = L.free ? 'Freies Blatt' : `Blatt ${pad2(li + 1)} von ${pad2(LV.filter(x => !x.free).length)}`;
    $('c-eyebrow').textContent = `${nr} · ${L.kind}`;
    $('c-title').textContent = L.title;
    $('c-task').textContent = L.task;
    $('c-tip').textContent = L.tip || '';
    const h = help();
    $('c-helpmode').setAttribute('aria-pressed', String(h));
    $('c-helpmode-text').textContent = h ? 'Lernhilfen an' : 'Lernhilfen aus';
    $('c-aids').hidden = !h;
    $('c-examnote').hidden = h || !!L.free;
    $('c-bomwrap').hidden = !L.bom;
    $('c-learn').hidden = !L.learn;
    if (L.learn) {
      $('c-learn-sum').textContent = `So funktioniert die ${L.title}`;
      const dl = $('c-learn-body');
      dl.innerHTML = '';
      [['Funktion', L.learn.how], ['Typische Fehler', L.learn.err], ['In der Praxis', L.learn.use]].forEach(([t, d]) => {
        const box = document.createElement('div');
        const dt = document.createElement('dt'); dt.textContent = t;
        const dd = document.createElement('dd'); dd.textContent = d;
        box.append(dt, dd); dl.append(box);
      });
    }
    $('c-test').disabled = !!L.free;
    $('c-test').textContent = L.free ? 'Keine Prüfung' : 'Prüfen';
    renderBom(); renderMeta();
  }
  function renderBom() {
    const ul = $('c-bom');
    if (!L.bom) { ul.innerHTML = ''; return; }
    ul.innerHTML = '';
    const have = {};
    placedComps().forEach(c => { have[c.type] = (have[c.type] || 0) + 1; });
    for (const t in L.bom) {
      const item = document.createElement('li'), h = have[t] || 0, need = L.bom[t];
      item.className = h === need ? 'done' : h > need ? 'over' : '';
      item.innerHTML = '<b></b><span></span>';
      item.querySelector('b').textContent = `${h}/${need}`;
      item.querySelector('span').textContent = T[t].name;
      ul.append(item);
    }
  }
  function renderMeta() {
    $('c-parts-n').textContent = placedComps().length;
    $('c-wires').textContent = playerWires().length;
    $('c-min').textContent = L.min || '–';
    $('c-fails').textContent = fails;
    const st = save.stars[L.id] || 0, best = $('c-best');
    best.innerHTML = boltsSVG(st);
    best.setAttribute('aria-label', `${st} von 3 Blitzen`);
    $('c-meta').hidden = !!L.free;
  }
  function renderChips() {
    const nav = $('c-sheets');
    nav.innerHTML = '';
    nav.hidden = !!opts.single;
    LV.forEach((lv, i) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'chip' + (lv.free ? ' free' : '');
      if (i === li) b.setAttribute('aria-current', 'true');
      const st = save.stars[lv.id] || 0;
      b.innerHTML = `<span class="chip-no"></span><span class="chip-name"></span><span class="chip-bolts" role="img" aria-label="${lv.free ? 'ohne Wertung' : st + ' von 3 Blitzen'}">${lv.free ? '' : boltsSVG(st)}</span>`;
      b.querySelector('.chip-no').textContent = lv.free ? 'Zeichnen' : `Blatt ${pad2(i + 1)}`;
      b.querySelector('.chip-name').textContent = lv.short;
      b.addEventListener('click', () => { if (i !== li) loadLevel(i); });
      nav.appendChild(b);
    });
    const cur = nav.children[li];
    if (cur) {
      const l = cur.offsetLeft - nav.offsetLeft, r = l + cur.offsetWidth;
      if (l < nav.scrollLeft) nav.scrollLeft = l - 8;
      else if (r > nav.scrollLeft + nav.clientWidth) nav.scrollLeft = r - nav.clientWidth + 8;
    }
  }

  // Bauteilkasten
  const THUMB_V = { inp: ENGINE.freshInputs(), mem: ENGINE.freshMem(), o: { lit: {}, energ: {}, motor: {}, pot: null } };
  function renderPalette() {
    const box = $('c-parts');
    box.innerHTML = '';
    for (const type of L.palette) {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'part'; b.dataset.type = type;
      b.setAttribute('aria-pressed', 'false');
      b.setAttribute('aria-label', `${T[type].name} setzen`);
      b.title = T[type].name;
      const cv = document.createElement('canvas');
      const sp = document.createElement('span'); sp.textContent = T[type].short;
      b.append(cv, sp);
      box.append(b);
      attachPart(b, type);
    }
    drawThumbs();
  }
  function drawThumbs() {
    const d = Math.min(window.devicePixelRatio || 1, 3);
    for (const b of $('c-parts').children) {
      const cv = b.querySelector('canvas'), type = b.dataset.type, bx = T[type].box;
      cv.width = Math.round(60 * d); cv.height = Math.round(60 * d);
      const g = cv.getContext('2d');
      const kk = Math.min(9, 54 / (bx[2] - bx[0] + 0.8), 54 / (bx[3] - bx[1] + 0.8));
      const oldCtx = ctx, oldK = k;
      ctx = g; k = kk;
      g.setTransform(d, 0, 0, d, 0, 0);
      g.clearRect(0, 0, 60, 60);
      const c = { uid: 'thumb', type, T: T[type], x: 30 / kk - (bx[0] + bx[2]) / 2, y: 30 / kk - (bx[1] + bx[3]) / 2, root: 'top', label: '' };
      ctx.save(); drawComp(c, THUMB_V, 0, true); ctx.restore();
      for (const p of T[type].pins(c)) {
        circ(c.x + p.x, c.y + p.y, 0.32);
        g.fillStyle = C.paper; g.fill(); g.strokeStyle = C.ink; g.lineWidth = 1; g.stroke();
      }
      ctx = oldCtx; k = oldK;
    }
  }
  function syncPalette() {
    for (const b of $('c-parts').children) b.setAttribute('aria-pressed', String(b.dataset.type === armed));
  }
  function arm(type) {
    armed = armed === type ? null : type;
    syncPalette();
    if (armed) say(`${T[armed].name}: Tippe auf eine freie Stelle im Blatt.`, 0); else say('');
  }
  function attachPart(b, type) {
    b.addEventListener('pointerdown', e => {
      if (play || (e.pointerType === 'mouse' && e.button !== 0)) return;
      pdrag = { type, sx: e.clientX, sy: e.clientY, moved: false, ptype: e.pointerType };
      try { b.setPointerCapture(e.pointerId); } catch (err) {}
    });
    b.addEventListener('pointermove', e => {
      if (!pdrag) return;
      if (!pdrag.moved && Math.hypot(e.clientX - pdrag.sx, e.clientY - pdrag.sy) > 8) { pdrag.moved = true; armed = null; syncPalette(); }
      if (!pdrag.moved) return;
      const r = canvas.getBoundingClientRect();
      if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
        const [px, py] = local(e);
        ghost = snapAt(type, px, py, 0, pdrag.ptype === 'mouse' ? 0 : 2.5);
      } else ghost = null;
    });
    b.addEventListener('pointerup', () => {
      const p = pdrag; pdrag = null;
      if (!p) return;
      if (p.moved) {
        const g = ghost; ghost = null;
        if (g) addComp(g.type, g.x, g.y); else say('Zum Setzen das Bauteil auf eine freie Stelle im Blatt ziehen.');
      } else arm(type);
    });
    b.addEventListener('pointercancel', () => { pdrag = null; ghost = null; });
    b.addEventListener('click', e => { if (e.detail === 0) arm(type); });
    b.addEventListener('touchmove', e => {
      if (!pdrag || !e.touches[0]) return;
      const t = e.touches[0];
      if (pdrag.moved || Math.abs(t.clientY - pdrag.sy) > Math.abs(t.clientX - pdrag.sx)) e.preventDefault();
    }, { passive: false });
    b.addEventListener('contextmenu', e => e.preventDefault());
  }

  // Bedienknöpfe
  function renderControls() {
    const box = $('c-devices');
    box.innerHTML = '';
    const mk = (c, half, sub) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'dev' + (c.T.op === 'hold' ? ' hold' : '');
      b.dataset.uid = c.uid;
      if (half) b.dataset.half = half;
      b.innerHTML = '<span class="dev-id"></span><span class="dev-state"></span>';
      b.querySelector('.dev-id').textContent = [c.label, sub || c.T.short].filter(Boolean).join(' · ');
      if (c.T.op === 'hold') {
        const up = () => { press(c, false); b.classList.remove('is-down'); };
        b.addEventListener('pointerdown', e => { e.preventDefault(); press(c, true); b.classList.add('is-down'); try { b.setPointerCapture(e.pointerId); } catch (err) {} });
        b.addEventListener('pointerup', up);
        b.addEventListener('pointercancel', up);
        b.addEventListener('lostpointercapture', up);
        b.addEventListener('keydown', e => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); press(c, true); b.classList.add('is-down'); } });
        b.addEventListener('keyup', e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); up(); } });
        b.addEventListener('blur', up);
        b.addEventListener('contextmenu', e => e.preventDefault());
      } else {
        b.addEventListener('click', () => operate(c, half));
      }
      box.appendChild(b);
    };
    const ops = B.comps.filter(c => c.T.op).sort((a, b) => a.label.localeCompare(b.label, 'de', { numeric: true }));
    for (const c of ops) {
      if (c.T.op === 'serie') { mk(c, 'a', 'Wippe 1'); mk(c, 'b', 'Wippe 2'); }
      else mk(c);
    }
    syncControls();
  }
  function syncControls() {
    const box = $('c-devices');
    if (!B || !box) return;
    const V = play && play.view ? play.view : { inp };
    for (const b of box.children) {
      const c = B.byUid[b.dataset.uid];
      if (!c) continue;
      const st = b.querySelector('.dev-state');
      let txt = '', pressed = null;
      switch (c.T.op) {
        case 'toggle':
          if (c.type === 'aus') { pressed = !!V.inp.sw[c.uid]; txt = pressed ? 'Ein' : 'Aus'; }
          else if (c.type === 'wechsel') txt = V.inp.sw[c.uid] ? 'Stellung 2' : 'Stellung 1';
          else txt = V.inp.sw[c.uid] ? 'gekreuzt' : 'Durchgang';
          break;
        case 'serie': pressed = !!V.inp.sw[c.uid + ':' + b.dataset.half]; txt = pressed ? 'Ein' : 'Aus'; break;
        case 'hold': txt = V.inp.pr[c.uid] ? 'gedrückt' : 'gedrückt halten'; b.classList.toggle('is-down', !!V.inp.pr[c.uid]); break;
        case 'trip': pressed = !!V.inp.trip[c.uid]; txt = pressed ? 'ausgelöst, antippen zum Rücksetzen' : 'Überlast auslösen'; break;
      }
      st.textContent = txt;
      if (pressed !== null) b.setAttribute('aria-pressed', String(pressed));
      b.disabled = !!play;
    }
  }
  function syncTools() {
    $('c-undo').disabled = !undo.length || !!play;
    const wsel = selWire >= 0 && wires[selWire] && !wires[selWire].pre;
    const csel = selComp && B.byUid[selComp] && !B.byUid[selComp].pre;
    $('c-del').disabled = !(wsel || csel) || !!play;
    $('c-clear').disabled = (!placedComps().length && !playerWires().length) || !!play;
    $('c-test').disabled = !!play || !!L.free;
  }

  // Auswahlleiste für ein Bauteil
  function renderSelbar() {
    const bar = $('c-selbar');
    const c = selComp && B && B.byUid[selComp];
    if (!c || play) { bar.hidden = true; bar.innerHTML = ''; return; }
    bar.hidden = false; bar.innerHTML = '';
    const name = document.createElement('span'); name.className = 'sel-name'; name.textContent = `${c.label} · ${c.T.name}`;
    bar.append(name);
    const btn = (text, fn, pressed) => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'btn small'; b.textContent = text;
      if (pressed !== undefined) b.setAttribute('aria-pressed', String(pressed));
      b.addEventListener('click', fn); bar.append(b); return b;
    };
    if (c.T.op === 'toggle') btn('Umschalten', () => operate(c));
    if (c.T.op === 'serie') { btn('Wippe 1', () => operate(c, 'a')); btn('Wippe 2', () => operate(c, 'b')); }
    if (c.T.op === 'trip') btn(inp.trip[c.uid] ? 'Zurücksetzen' : 'Überlast auslösen', () => operate(c));
    if (c.T.flip && !c.pre) btn(c.root === 'bottom' ? 'Wurzel nach oben' : 'Wurzel nach unten', () => flipComp(c.uid));
    if (c.T.of && !c.pre) {
      const lab = document.createElement('span'); lab.className = 'sel-note';
      lab.textContent = c.cands.length ? 'Gehört zu:' : 'Das passende Gerät fehlt noch auf dem Blatt.';
      bar.append(lab);
      for (const d of c.cands) btn(d.label, () => assignComp(c.uid, d.uid), c.dev === d);
    }
    if (c.pre) { const n = document.createElement('span'); n.className = 'sel-note'; n.textContent = 'Vorgabe, fest montiert.'; bar.append(n); }
    else btn('Entfernen', () => removeComp(c.uid));
  }

  $('c-undo').addEventListener('click', doUndo);
  $('c-del').addEventListener('click', () => {
    if (selWire >= 0) removeWire(selWire);
    else if (selComp) removeComp(selComp);
  });
  $('c-clear').addEventListener('click', clearAll);
  $('c-test').addEventListener('click', startTest);
  $('c-skip').addEventListener('click', skipPlay);
  $('c-reset').addEventListener('click', resetTrip);
  $('c-helpmode').addEventListener('click', () => {
    save.help = !help(); persist();
    renderTask();
    $('c-protocol').hidden = true;
    say(help() ? 'Lernhilfen an: Stückliste, Tipps und Spannungsfarben sind sichtbar.' : 'Prüfungsmodus: ohne Stückliste, Tipps und Spannungsfarben.');
  });

  // ---------- Treffer auf dem Blatt ----------
  function hitTest(px, py) {
    const x = px / k, y = py / k;
    const R = Math.max(13 / k, 1.0);
    let best = null, bd = R;
    for (const id of B.pinIds) {
      const p = B.pos[id], d = Math.hypot(p[0] - x, p[1] - y);
      if (d < bd) { bd = d; best = id; }
    }
    if (best) return { kind: 'pin', id: best };
    const tolR = Math.max(10 / k, 0.6);
    for (const r of B.rails) if (Math.abs(y - r.y) < tolR && x >= r.x0 - 2.4 && x <= r.x1 + 0.5) return { kind: 'rail', id: r.id };
    for (const c of B.comps) {
      if (x >= c.bx[0] - 0.2 && x <= c.bx[2] + 0.2 && y >= c.bx[1] + 0.2 && y <= c.bx[3] - 0.2) return { kind: 'comp', c, half: x < c.x ? 'a' : 'b' };
    }
    const tolW = Math.max(9 / k, 0.45);
    let wi = -1, wd = tolW;
    wires.forEach((w, i) => {
      for (let s = 1; s < w.path.length; s++) {
        const a = w.path[s - 1], b = w.path[s];
        const qx = Math.max(Math.min(a[0], b[0]), Math.min(Math.max(a[0], b[0]), x));
        const qy = Math.max(Math.min(a[1], b[1]), Math.min(Math.max(a[1], b[1]), y));
        const d = Math.hypot(qx - x, qy - y);
        if (d < wd) { wd = d; wi = i; }
      }
    });
    if (wi >= 0) return { kind: 'wire', i: wi };
    return null;
  }
  const local = e => {
    const r = canvas.getBoundingClientRect();
    return [(e.clientX - r.left) * cssW / r.width, (e.clientY - r.top) * cssH / r.height];
  };
  function snapAt(type, px, py, offx = 0, offy = 0, ignore) {
    const p = ENGINE.nearestOk(B, type, Math.round(px / k - offx), Math.round(py / k - offy), ignore);
    return p ? { type, x: p[0], y: p[1] } : null;
  }
  function placeArmedAt(px, py, ptype) {
    const g = snapAt(armed, px, py, 0, ptype === 'mouse' ? 0 : 0);
    const type = armed;
    armed = null; ghost = null; syncPalette();
    if (g) addComp(type, g.x, g.y); else say('Hier ist kein Platz. Such eine freie Stelle auf dem Blatt.');
  }

  function click(h) {
    if (!h) { sel = null; selWire = -1; selComp = null; renderSelbar(); syncTools(); return; }
    if (h.kind === 'pin' || h.kind === 'rail') {
      selWire = -1; selComp = null;
      if (!sel) { sel = h.id; sfx.tick(); say(`${epName(h.id)} gewählt. Jetzt die Gegenklemme antippen.`, 0); }
      else if (sel === h.id) { sel = null; say(''); }
      else { const a = sel; sel = null; addWire(a, h.id); }
    } else if (h.kind === 'wire') {
      sel = null; selComp = null;
      if (selWire === h.i) removeWire(h.i);
      else {
        selWire = h.i;
        const w = wires[h.i];
        say(w.pre ? `Vorgegebene Ader: ${epName(w.a)} – ${epName(w.b)}` : `Ader ${epName(w.a)} – ${epName(w.b)} gewählt. Noch einmal antippen entfernt sie.`, 0);
      }
    } else if (h.kind === 'comp') {
      sel = null; selWire = -1;
      if (selComp === h.c.uid && (h.c.T.op === 'toggle' || h.c.T.op === 'serie' || h.c.T.op === 'trip')) operate(h.c, h.half);
      selComp = h.c.uid;
      say('');
    }
    renderSelbar(); syncTools();
  }

  document.addEventListener('keydown', () => { lastInputKey = true; }, { capture: true, signal: ac.signal });
  document.addEventListener('pointerdown', () => { lastInputKey = false; }, { capture: true, signal: ac.signal });
  canvas.addEventListener('focus', () => { keyNav = lastInputKey; });
  canvas.addEventListener('blur', () => { keyNav = false; });

  canvas.addEventListener('pointerdown', e => {
    if (play || !L) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    keyNav = false;
    const [px, py] = local(e);
    const h = hitTest(px, py);
    ptr = { sx: e.clientX, sy: e.clientY, h, moved: false, ptype: e.pointerType };
    if (armed) return;
    if (h && (h.kind === 'pin' || h.kind === 'rail')) drag = { from: h.id, px, py };
    else if (h && h.kind === 'comp' && !h.c.pre) cdrag = { uid: h.c.uid, type: h.c.type, root: h.c.root, offx: px / k - h.c.x, offy: py / k - h.c.y };
    if (drag || cdrag) { try { canvas.setPointerCapture(e.pointerId); } catch (err) {} }
  });
  canvas.addEventListener('pointermove', e => {
    if (!L) return;
    const [px, py] = local(e);
    if (e.pointerType === 'mouse') {
      hover = hitTest(px, py);
      canvas.style.cursor = armed ? 'copy' : cdrag ? 'grabbing' : hover ? (hover.kind === 'comp' ? 'grab' : 'pointer') : 'default';
      if (armed && !ptr) ghost = snapAt(armed, px, py);
    }
    if (ptr && Math.hypot(e.clientX - ptr.sx, e.clientY - ptr.sy) > 6) ptr.moved = true;
    if (drag) { drag.px = px; drag.py = py; }
    if (cdrag && ptr && ptr.moved) {
      const g = snapAt(cdrag.type, px, py, cdrag.offx, cdrag.offy, cdrag.uid);
      ghost = g ? Object.assign(g, { root: cdrag.root, moving: cdrag.uid }) : null;
    }
  });
  const endPtr = (e, cancel) => {
    const p = ptr; ptr = null;
    if (!p) { drag = null; cdrag = null; return; }
    if (cancel) { drag = null; cdrag = null; if (!armed) ghost = null; return; }
    const [px, py] = local(e);
    if (armed) { if (!p.moved || p.ptype === 'mouse') placeArmedAt(px, py, p.ptype); return; }
    if (cdrag) {
      const cd = cdrag, g = ghost; cdrag = null; ghost = null;
      if (p.moved) { if (g) moveComp(cd.uid, g.x, g.y); else say('Dort ist kein Platz.'); return; }
    }
    if (drag) {
      const from = drag.from; drag = null;
      if (p.moved) {
        const h = hitTest(px, py);
        if (h && (h.kind === 'pin' || h.kind === 'rail') && h.id !== from) { sel = null; addWire(from, h.id); }
        return;
      }
    }
    if (p.moved) return;
    click(p.h);
  };
  canvas.addEventListener('pointerup', e => endPtr(e, false));
  canvas.addEventListener('pointercancel', e => endPtr(e, true));
  canvas.addEventListener('pointerleave', () => { hover = null; if (armed && !ptr) ghost = null; });
  canvas.addEventListener('contextmenu', e => e.preventDefault());
  canvas.addEventListener('touchmove', e => { if (drag || cdrag) e.preventDefault(); }, { passive: false });

  // Tastatur: Pfeile springen zum nächsten Ziel, Eingabe wählt, Umschalt+Pfeil verschiebt
  function keyTargets() {
    const t = B.pinIds.map(id => ({ kind: 'pin', id, x: B.pos[id][0], y: B.pos[id][1] }));
    for (const r of B.rails) t.push({ kind: 'rail', id: r.id, x: r.x0 + 0.4, y: r.y });
    for (const c of B.comps) t.push({ kind: 'comp', c, x: c.x - 0.5, y: c.y });
    return t;
  }
  canvas.addEventListener('keydown', e => {
    if (play || !L) return;
    const ts = keyTargets();
    if (!cursor || (cursor.kind === 'comp' && !B.byUid[cursor.c.uid]) || (cursor.kind === 'pin' && !B.pos[cursor.id])) cursor = ts[0] || { kind: 'none', x: L.W / 2, y: L.H / 2 };
    const dirs = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    if (dirs[e.key]) {
      e.preventDefault(); keyNav = true;
      const [dx, dy] = dirs[e.key];
      if (e.shiftKey && selComp) {
        const c = B.byUid[selComp];
        if (c && !c.pre && ENGINE.placeOk(B, c.type, c.x + dx, c.y + dy, c.uid)) { moveComp(c.uid, c.x + dx, c.y + dy); cursor = { kind: 'comp', c: B.byUid[selComp], x: c.x + dx - 0.5, y: c.y + dy }; }
        return;
      }
      let best = null, bs = Infinity;
      for (const t of ts) {
        const ax = t.x - cursor.x, ay = t.y - cursor.y, along = ax * dx + ay * dy;
        if (along <= 0.3) continue;
        const s = along + 2.5 * Math.abs(ax * dy - ay * dx);
        if (s < bs) { bs = s; best = t; }
      }
      if (best) cursor = best;
      return;
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); keyNav = true;
      if (e.repeat) return;
      if (armed) {
        const type = armed, p = ENGINE.nearestOk(B, type, Math.round(cursor.x), Math.round(cursor.y));
        armed = null; syncPalette();
        if (p) addComp(type, p[0], p[1]); else say('Kein freier Platz in der Nähe.');
        return;
      }
      click(cursor.kind === 'comp' ? { kind: 'comp', c: B.byUid[cursor.c.uid], half: 'a' } : cursor);
      return;
    }
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      if (selWire >= 0) removeWire(selWire); else if (selComp) removeComp(selComp);
      return;
    }
    if (e.key === 'Escape') { sel = null; selWire = -1; selComp = null; armed = null; ghost = null; syncPalette(); renderSelbar(); syncTools(); say(''); return; }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); doUndo(); }
  });

  // ---------- Größe ----------
  function sizeSheet() {
    if (!L) return;
    const avail = wrap.clientWidth - 16;
    if (avail <= 0) return;
    lastWrapW = wrap.clientWidth;
    const maxH = Math.max(300, window.innerHeight - 130);
    let w = Math.min(avail, maxH * L.W / L.H);
    w = Math.max(w, L.W * 8.5);
    cssW = Math.round(w); cssH = Math.round(w * L.H / L.W);
    canvas.style.width = cssW + 'px'; canvas.style.height = cssH + 'px';
    dpr = Math.min(window.devicePixelRatio || 1, 3);
    canvas.width = Math.round(cssW * dpr); canvas.height = Math.round(cssH * dpr);
    k = cssW / L.W;
    layer = null;
  }
  const ro = new ResizeObserver(() => { if (wrap.clientWidth !== lastWrapW) sizeSheet(); });
  ro.observe(wrap);
  window.addEventListener('resize', () => { lastWrapW = -1; sizeSheet(); }, sig);
  const offTheme = onTheme(() => { layer = null; if (L) drawThumbs(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { layer = null; if (L) drawThumbs(); });

  // ---------- Zeichnen ----------
  const P = v => v * k;
  const font = (u, w, min) => `${w} ${Math.max(min, u * k)}px ${FONT}`;
  function fitText(g, text, x, y, maxW, px, weight) {
    let s = px;
    g.font = `${weight} ${s}px ${FONT}`;
    while (s > 6 && g.measureText(text).width > maxW) { s -= 0.5; g.font = `${weight} ${s}px ${FONT}`; }
    g.fillText(text, x, y);
  }
  function buildLayer() {
    layer = document.createElement('canvas');
    layer.width = canvas.width; layer.height = canvas.height;
    const g = layer.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.fillStyle = C.paper; g.fillRect(0, 0, cssW, cssH);
    g.fillStyle = C.grid;
    const r = Math.max(0.8, k * 0.07);
    for (let x = 1; x < L.W; x++) for (let y = 1; y < L.H; y++) g.fillRect(x * k - r / 2, y * k - r / 2, r, r);
    g.strokeStyle = C.ink; g.lineWidth = 1;
    g.strokeRect(P(0.5), P(0.5), P(L.W - 1), P(L.H - 1));
    const [x0, y0, x1, y1] = B.titleBox;
    g.fillStyle = C.paper; g.fillRect(P(x0), P(y0), P(x1 - x0), P(y1 - y0));
    g.strokeRect(P(x0), P(y0), P(x1 - x0), P(y1 - y0));
    const r1 = y0 + 1.15, r2 = y1 - 1.0, split = x0 + 10.5;
    g.beginPath(); g.moveTo(P(x0), P(r1)); g.lineTo(P(x1), P(r1)); g.moveTo(P(x0), P(r2)); g.lineTo(P(x1), P(r2)); g.moveTo(P(split), P(y0)); g.lineTo(P(split), P(r1)); g.stroke();
    g.fillStyle = C.muted; g.textBaseline = 'middle'; g.textAlign = 'left';
    fitText(g, 'STROMLAUF · Übungsblatt', P(x0 + 0.4), P(y0 + 0.6), P(split - x0 - 0.8), Math.max(8, 0.72 * k), 600);
    fitText(g, L.free ? 'Freies Blatt' : `Blatt ${pad2(li + 1)} / ${pad2(LV.filter(x => !x.free).length)}`, P(split + 0.4), P(y0 + 0.6), P(x1 - split - 0.8), Math.max(8, 0.72 * k), 600);
    g.fillStyle = C.ink;
    fitText(g, L.title, P(x0 + 0.4), P((r1 + r2) / 2), P(x1 - x0 - 0.8), Math.max(10, 1.25 * k), 700);
    g.fillStyle = C.muted;
    fitText(g, 'Stromlaufplan · DIN EN 60617', P(x0 + 0.4), P(r2 + 0.5), P(x1 - x0 - 0.8), Math.max(8, 0.7 * k), 500);
  }

  function potColor(p) {
    if (!help()) return C.ink;
    switch (p) {
      case 'L1': return C['c-l1']; case 'L2': return C['c-l2']; case 'L3': return C['c-l3'];
      case 'N': return C['c-n']; case 'PE': return C['c-pe']; default: return C['c-dead'];
    }
  }
  function pathOf(pts) {
    ctx.beginPath();
    pts.forEach(([x, y], i) => { if (i) ctx.lineTo(P(x), P(y)); else ctx.moveTo(P(x), P(y)); });
  }
  function conductor(pts, pot, live, lw, casing) {
    pathOf(pts);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (casing) { ctx.strokeStyle = C.paper; ctx.lineWidth = lw + 3.2; ctx.stroke(); }
    const colored = help();
    if (colored && live && PHASE[pot]) { ctx.strokeStyle = C.glow; ctx.lineWidth = lw * (casing ? 3.6 : 2.2); ctx.stroke(); }
    if (colored && pot === 'L2') { ctx.strokeStyle = C.edge; ctx.lineWidth = lw + 1.6; ctx.stroke(); }
    ctx.strokeStyle = potColor(pot); ctx.lineWidth = colored ? lw : Math.max(1.4, lw * 0.75); ctx.stroke();
    if (colored && pot === 'PE') { ctx.setLineDash([P(0.55), P(0.55)]); ctx.strokeStyle = C['c-pe2']; ctx.stroke(); ctx.setLineDash([]); }
  }
  const ln = (x1, y1, x2, y2) => { ctx.beginPath(); ctx.moveTo(P(x1), P(y1)); ctx.lineTo(P(x2), P(y2)); ctx.stroke(); };
  const dashed = (x1, y1, x2, y2) => { ctx.setLineDash([P(0.3), P(0.25)]); ln(x1, y1, x2, y2); ctx.setLineDash([]); };
  const circ = (x, y, r) => { ctx.beginPath(); ctx.arc(P(x), P(y), P(r), 0, TAU); };

  function contact(x, y, closed, kind, act, span = 1.8) {
    ln(x, y - span, x, y - 0.7);
    ln(x, y + span, x, y + 0.7);
    let ex, ey;
    if (kind === 'no') { if (closed) { ex = x; ey = y - 0.8; } else { ex = x - 0.78; ey = y - 0.6; } }
    else {
      ln(x, y - 0.7, x, y - 0.55); ln(x, y - 0.55, x - 0.65, y - 0.55);
      if (closed) { ex = x - 0.85; ey = y - 0.85; } else { ex = x - 1.15; ey = y - 0.12; }
    }
    ln(x, y + 0.7, ex, ey);
    if (act) {
      const mx = (x + ex) / 2, my = (y + 0.7 + ey) / 2, ax = x - 1.8;
      dashed(mx, my, ax, my);
      if (act === 'push') { ln(ax, my - 0.45, ax, my + 0.45); ln(ax, my - 0.45, ax - 0.28, my - 0.45); ln(ax, my + 0.45, ax - 0.28, my + 0.45); }
      else if (act === 'hand') ln(ax, my - 0.42, ax, my + 0.42);
      else if (act === 'therm') {
        ctx.beginPath(); ctx.moveTo(P(ax), P(my + 0.35)); ctx.lineTo(P(ax), P(my - 0.35)); ctx.lineTo(P(ax - 0.45), P(my - 0.35)); ctx.lineTo(P(ax - 0.45), P(my + 0.35)); ctx.stroke();
      }
    }
    return [(x + ex) / 2, (y + 0.7 + ey) / 2];
  }
  function label(c, x, y, thumb) {
    if (thumb || !c.label) return;
    ctx.fillStyle = /\?$/.test(c.label) ? C.bad : C.ink;
    ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
    ctx.font = font(1.25, 700, 11);
    ctx.fillText(c.label, P(x), P(y));
  }
  function pinLabels(c, thumb) {
    if (thumb) return;
    for (const p of c.T.pins(c)) {
      const id = c.uid + '.' + p.k;
      const lab = B && B.plab[id] !== undefined ? B.plab[id] : p.lab;
      if (!lab) continue;
      ctx.fillStyle = C.muted; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.font = font(0.8, 600, 8.5);
      ctx.fillText(lab, P(c.x + p.x + 0.32), P(c.y + p.y + (p.d < 0 ? 0.62 : -0.62)));
    }
  }

  function drawComp(c, V, now, thumb) {
    const on = V.mem.on, x = c.x, y = c.y;
    const act = c.dev ? !!on[c.dev.uid] : false;
    ctx.strokeStyle = C.ink; ctx.fillStyle = C.ink;
    ctx.lineWidth = Math.max(1.3, k * 0.13); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const bx0 = x + c.T.box[0];
    switch (c.type) {
      case 'aus': contact(x, y, !!V.inp.sw[c.uid], 'no', 'hand'); label(c, bx0 - 0.3, y - 0.3, thumb); pinLabels(c, thumb); break;
      case 'taster': case 'tno': contact(x, y, !!V.inp.pr[c.uid], 'no', 'push'); label(c, bx0 - 0.3, y - 0.3, thumb); pinLabels(c, thumb); break;
      case 'tnc': contact(x, y, !V.inp.pr[c.uid], 'nc', 'push'); label(c, bx0 - 0.3, y - 0.3, thumb); pinLabels(c, thumb); break;
      case 'no': case 'ino': contact(x, y, act, 'no', null); label(c, bx0 - 0.3, y, thumb); pinLabels(c, thumb); break;
      case 'nc': contact(x, y, !act, 'nc', null); label(c, bx0 - 0.3, y, thumb); pinLabels(c, thumb); break;
      case 'olc': contact(x, y, !(c.dev && V.inp.trip[c.dev.uid]), 'nc', 'therm'); label(c, bx0 - 0.3, y - 0.3, thumb); pinLabels(c, thumb); break;
      case 'wechsel': {
        const s = V.inp.sw[c.uid] ? 1 : -1, sg = c.root === 'bottom' ? -1 : 1;
        ln(x, y - 1.8 * sg, x, y - 0.7 * sg);
        ln(x - 1.2, y + 1.8 * sg, x - 1.2, y + 0.75 * sg);
        ln(x + 1.2, y + 1.8 * sg, x + 1.2, y + 0.75 * sg);
        ln(x, y - 0.7 * sg, x + 1.15 * s, y + 0.8 * sg);
        label(c, bx0 - 0.3, y, thumb); pinLabels(c, thumb);
        break;
      }
      case 'kreuz': {
        const s = !!V.inp.sw[c.uid];
        for (const sx of [-1.2, 1.2]) { ln(x + sx, y - 1.8, x + sx, y - 0.75); ln(x + sx, y + 1.8, x + sx, y + 0.75); }
        if (s) { ln(x - 1.2, y - 0.75, x + 1.15, y + 0.72); ln(x + 1.2, y - 0.75, x - 1.15, y + 0.72); }
        else { ln(x - 1.2, y - 0.75, x - 1.05, y + 0.72); ln(x + 1.2, y - 0.75, x + 1.35, y + 0.72); }
        dashed(x - 1.6, y, x + 1.6, y);
        label(c, bx0 - 0.3, y, thumb); pinLabels(c, thumb);
        break;
      }
      case 'serie': {
        ln(x, y - 1.8, x, y - 1.0); ln(x - 1.2, y - 1.0, x + 1.2, y - 1.0);
        [['a', -1.2], ['b', 1.2]].forEach(([h, sx]) => {
          const cx = x + sx, cl = !!V.inp.sw[c.uid + ':' + h];
          ln(cx, y - 1.0, cx, y - 0.55); ln(cx, y + 1.8, cx, y + 0.7);
          ln(cx, y + 0.7, cl ? cx : cx - 0.7, cl ? y - 0.62 : y - 0.42);
        });
        label(c, bx0 - 0.3, y, thumb); pinLabels(c, thumb);
        break;
      }
      case 'lamp': case 'hlamp': {
        ln(x, y - 1.9, x, y - 1.0); ln(x, y + 1.9, x, y + 1.0);
        const litNow = !!V.o.lit[c.uid];
        if (litNow) {
          const halo = ctx.createRadialGradient(P(x), P(y), P(0.6), P(x), P(y), P(2.4));
          halo.addColorStop(0, hexA(C.lamp, 0.65)); halo.addColorStop(1, hexA(C.lamp, 0));
          ctx.fillStyle = halo; circ(x, y, 2.4); ctx.fill();
          const body = ctx.createRadialGradient(P(x - 0.3), P(y - 0.35), P(0.1), P(x), P(y), P(1));
          body.addColorStop(0, C['live-hot']); body.addColorStop(1, C.lamp);
          ctx.fillStyle = body;
        } else ctx.fillStyle = C.paper;
        circ(x, y, 1.0); ctx.fill();
        ctx.strokeStyle = litNow ? C.live : C.ink; ctx.stroke();
        const q = Math.SQRT1_2;
        ctx.strokeStyle = litNow ? C.filament : C.ink;
        ln(x - q, y - q, x + q, y + q); ln(x + q, y - q, x - q, y + q);
        label(c, bx0 - 0.3, y - 0.3, thumb);
        break;
      }
      case 'coil': case 'icoil': {
        ln(x, y - 1.9, x, y - 0.75); ln(x, y + 1.9, x, y + 0.75);
        const e = !!V.o.energ[c.uid];
        ctx.fillStyle = e ? hexA(C.live, 0.4) : C.paper;
        ctx.fillRect(P(x - 1.3), P(y - 0.75), P(2.6), P(1.5));
        ctx.strokeStyle = e ? C.live : C.ink;
        ctx.strokeRect(P(x - 1.3), P(y - 0.75), P(2.6), P(1.5));
        ctx.strokeStyle = C.ink;
        if (c.type === 'icoil') {
          ctx.beginPath();
          [[-0.75, 0.35], [-0.3, 0.35], [-0.3, -0.35], [0.3, -0.35], [0.3, 0.35], [0.75, 0.35]].forEach(([dx, dy], i) => { if (i) ctx.lineTo(P(x + dx), P(y + dy)); else ctx.moveTo(P(x + dx), P(y + dy)); });
          ctx.lineWidth = Math.max(1, k * 0.09); ctx.stroke();
        }
        label(c, bx0 - 0.3, y - 0.3, thumb); pinLabels(c, thumb);
        break;
      }
      case 'main3': {
        const mids = [-2.4, 0, 2.4].map(dx => contact(x + dx, y, act, 'no', null, 2));
        dashed(x - 3.1, mids[0][1], mids[2][0], mids[2][1]);
        label(c, bx0 - 0.3, y, thumb); pinLabels(c, thumb);
        break;
      }
      case 'ol3': {
        const tripped = !!V.inp.trip[c.uid];
        for (const dx of [-2.4, 0, 2.4]) {
          const px = x + dx;
          ctx.strokeStyle = C.ink;
          ln(px, y - 2, px, y - 0.8); ln(px, y + 2, px, y + 0.8);
          ctx.strokeStyle = tripped ? C.bad : C.ink;
          ctx.strokeRect(P(px - 0.42), P(y - 0.8), P(0.84), P(1.6));
          ctx.beginPath(); ctx.moveTo(P(px), P(y - 0.8)); ctx.lineTo(P(px), P(y - 0.35)); ctx.lineTo(P(px + 0.22), P(y - 0.35)); ctx.lineTo(P(px + 0.22), P(y + 0.35)); ctx.lineTo(P(px), P(y + 0.35)); ctx.lineTo(P(px), P(y + 0.8)); ctx.stroke();
        }
        ctx.strokeStyle = C.ink;
        label(c, bx0 - 0.3, y, thumb); pinLabels(c, thumb);
        break;
      }
      case 'fuse3': {
        for (const dx of [-2.4, 0, 2.4]) {
          const px = x + dx;
          ln(px, y - 2, px, y + 2);
          ctx.strokeRect(P(px - 0.38), P(y - 0.85), P(0.76), P(1.7));
        }
        label(c, bx0 - 0.3, y, thumb); pinLabels(c, thumb);
        break;
      }
      case 'motor3': {
        const st = V.o.motor[c.uid] || 'aus';
        let jx = 0;
        if (st === 'brummt' && !reduceMotion.matches) jx = Math.sin(now * 0.11) * 0.07;
        const R = 2.4, cx = x + jx;
        for (const dx of [-1.8, 0, 1.8]) ln(x + dx, y - 3.4, cx + dx, y - Math.sqrt(R * R - dx * dx));
        ln(cx + R, y, x + 3.8, y); ln(x + 3.8, y, x + 3.8, y + 2.6);
        const run = st === 'rechts' || st === 'links';
        ctx.fillStyle = run ? hexA(C.live, 0.18) : C.paper;
        circ(cx, y, R); ctx.fill(); ctx.strokeStyle = run ? C.live : C.ink; ctx.stroke();
        ctx.fillStyle = C.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.font = font(1.7, 700, thumb ? 8 : 13); ctx.fillText('M', P(cx), P(y - 0.35));
        ctx.font = font(0.95, 600, thumb ? 6 : 9); ctx.fillText('3~', P(cx), P(y + 1.05));
        if (run) {
          const dir = st === 'rechts' ? 1 : -1, a0 = motorAng[c.uid] || 0, a1 = a0 + dir * 1.25, RR = R + 0.55;
          ctx.strokeStyle = C.live; ctx.lineWidth = Math.max(1.6, k * 0.16);
          ctx.beginPath(); ctx.arc(P(cx), P(y), P(RR), a0, a1, dir < 0); ctx.stroke();
          const ex = cx + RR * Math.cos(a1), ey = y + RR * Math.sin(a1), tx = -Math.sin(a1) * dir, ty = Math.cos(a1) * dir;
          ctx.fillStyle = C.live; ctx.beginPath();
          ctx.moveTo(P(ex + tx * 0.6), P(ey + ty * 0.6));
          ctx.lineTo(P(ex - tx * 0.1 + ty * 0.38), P(ey - ty * 0.1 - tx * 0.38));
          ctx.lineTo(P(ex - tx * 0.1 - ty * 0.38), P(ey - ty * 0.1 + tx * 0.38));
          ctx.closePath(); ctx.fill();
        }
        label(c, bx0 - 0.4, y - 0.3, thumb);
        if (!thumb) {
          ctx.fillStyle = run ? C.live : C.muted; ctx.textAlign = 'right'; ctx.font = font(0.9, 600, 9);
          ctx.fillText(st === 'aus' ? 'steht' : st === 'brummt' ? 'brummt' : st === 'rechts' ? 'Rechtslauf' : 'Linkslauf', P(bx0 - 0.4), P(y + 2.1));
        }
        ctx.strokeStyle = C.ink; ctx.lineWidth = Math.max(1.3, k * 0.13);
        pinLabels(c, thumb);
        break;
      }
      case 'ttimer': {
        const on2 = !!on[c.uid];
        const pins = c.T.pins(c);
        for (const p of pins) ln(x + p.x, y + p.y, x + p.x, p.y < 0 ? y - 1.5 : y + 1.5);
        ctx.fillStyle = on2 ? hexA(C.live, 0.22) : C.paper;
        ctx.fillRect(P(x - 3.3), P(y - 1.5), P(6.6), P(3));
        ctx.strokeStyle = on2 ? C.live : C.ink;
        ctx.strokeRect(P(x - 3.3), P(y - 1.5), P(6.6), P(3));
        ctx.strokeStyle = C.ink;
        circ(x - 0.15, y, 0.55); ctx.stroke();
        ln(x - 0.15, y, x - 0.15, y - 0.38); ln(x - 0.15, y, x + 0.15, y);
        if (!thumb) {
          for (const p of pins) {
            ctx.fillStyle = C.muted; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = font(0.8, 600, 8.5);
            ctx.fillText(p.lab, P(x + p.x), P(p.y < 0 ? y - 0.85 : y + 0.9));
          }
          label(c, bx0 - 0.3, y - 0.3, thumb);
          ctx.fillStyle = C.muted; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.font = font(0.85, 600, 9);
          const rest = on2 ? Math.ceil((V.mem.t[c.uid] || 0) / ENGINE.TFULL * 180) : 0;
          ctx.fillText(on2 ? `Nachlauf ${Math.floor(rest / 60)}:${pad2(rest % 60)}` : 'Treppenlicht', P(x + 3.7), P(y));
        }
        break;
      }
    }
  }

  function draw(now) {
    if (!L || !B || cssW <= 0) return;
    ctx = mainCtx;
    if (!layer) buildLayer();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.drawImage(layer, 0, 0, cssW, cssH);
    const V = play && play.view ? play.view : { inp, mem, o: out };
    const o = V.o;
    const live = !trip || !!play;
    const lw = Math.max(1.8, k * 0.2);
    const potAtId = id => (o && o.pot) ? o.pot[B.idx[id]] : null;

    for (const r of B.rails) {
      const isLive = live && o && o.pot && !!PHASE[o.pot[B.idx[r.id]]];
      conductor([[r.x0, r.y], [r.x1, r.y]], r.pot, isLive, lw * 1.35, false);
      if (sel === r.id || (hover && hover.kind === 'rail' && hover.id === r.id)) {
        ctx.strokeStyle = hexA(C.pick, sel === r.id ? 0.55 : 0.3); ctx.lineWidth = lw * 4;
        pathOf([[r.x0, r.y], [r.x1, r.y]]); ctx.stroke();
      }
      ctx.fillStyle = C.ink; ctx.textAlign = 'right'; ctx.textBaseline = 'middle'; ctx.font = font(1.0, 700, 10);
      ctx.fillText(r.label, P(r.x0 - 0.45), P(r.y));
    }

    wires.forEach((w, i) => {
      if (!w.path || w.path.length < 2) return;
      const pot = potAtId(w.a);
      if (i === selWire || (hover && hover.kind === 'wire' && hover.i === i)) {
        pathOf(w.path); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.strokeStyle = hexA(C.pick, i === selWire ? 0.5 : 0.25); ctx.lineWidth = lw + 9; ctx.stroke();
      }
      conductor(w.path, pot, live, w.pre ? lw * 0.9 : lw, true);
    });
    for (const w of wires) {
      if (w.railPt) { const rp = B.railById[w.a] || B.railById[w.b]; ctx.fillStyle = potColor(rp.pot); circ(w.railPt[0], w.railPt[1], Math.max(0.28, 2.6 / k)); ctx.fill(); }
      ctx.fillStyle = potColor(potAtId(w.a));
      for (const d of w.dots) { circ(d[0], d[1], Math.max(0.24, 2.3 / k)); ctx.fill(); }
    }

    if (o) for (const c of B.comps) {
      if (ghost && ghost.moving === c.uid) ctx.globalAlpha = 0.3;
      ctx.save(); drawComp(c, V, now, false); ctx.restore();
      ctx.globalAlpha = 1;
      if (c.uid === selComp) {
        ctx.setLineDash([5, 4]); ctx.strokeStyle = C.pick; ctx.lineWidth = 2;
        ctx.strokeRect(P(c.bx[0] - 0.45), P(c.bx[1] - 0.45), P(c.bx[2] - c.bx[0] + 0.9), P(c.bx[3] - c.bx[1] + 0.9));
        ctx.setLineDash([]);
      }
    }

    const pr = Math.max(0.26, 2.8 / k);
    for (const id of B.pinIds) {
      const [x, y] = B.pos[id];
      const pot = potAtId(id);
      const connected = wires.some(w => w.a === id || w.b === id);
      circ(x, y, pr);
      ctx.fillStyle = connected && pot && help() ? potColor(pot) : C.paper; ctx.fill();
      ctx.strokeStyle = C.ink; ctx.lineWidth = 1.2; ctx.stroke();
      if (id === sel) {
        const pulse = reduceMotion.matches ? 0 : (Math.sin(now * 0.008) + 1) / 2;
        circ(x, y, pr + 0.45 + pulse * 0.25); ctx.strokeStyle = C.pick; ctx.lineWidth = 2.4; ctx.stroke();
      } else if (hover && hover.kind === 'pin' && hover.id === id) {
        circ(x, y, pr + 0.4); ctx.strokeStyle = hexA(C.pick, 0.7); ctx.lineWidth = 1.6; ctx.stroke();
      } else if (sel && !play) {
        circ(x, y, pr + 0.3); ctx.strokeStyle = hexA(C.pick, 0.25); ctx.lineWidth = 1.2; ctx.stroke();
      }
    }

    if (ghost && ghost.type) {
      const gc = { uid: 'ghost', type: ghost.type, T: T[ghost.type], x: ghost.x, y: ghost.y, root: ghost.root || 'top', label: '' };
      ctx.save(); ctx.globalAlpha = 0.6; drawComp(gc, { inp: ENGINE.freshInputs(), mem: ENGINE.freshMem(), o: { lit: {}, energ: {}, motor: {} } }, now, true); ctx.restore();
      const b = gc.T.box;
      ctx.setLineDash([5, 4]); ctx.strokeStyle = C.pick; ctx.lineWidth = 1.6;
      ctx.strokeRect(P(gc.x + b[0] - 0.4), P(gc.y + b[1] - 0.4), P(b[2] - b[0] + 0.8), P(b[3] - b[1] + 0.8));
      ctx.setLineDash([]);
    }

    if (drag && ptr && ptr.moved) {
      const from = B.pos[drag.from] || [drag.px / k, B.railById[drag.from].y];
      ctx.setLineDash([5, 4]); ctx.strokeStyle = C.pick; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(P(from[0]), P(from[1])); ctx.lineTo(drag.px, drag.py); ctx.stroke(); ctx.setLineDash([]);
    }

    if (keyNav && cursor && document.activeElement === canvas) {
      ctx.strokeStyle = C.ink; ctx.lineWidth = 2;
      if (cursor.kind === 'comp' && B.byUid[cursor.c.uid]) { const b = B.byUid[cursor.c.uid].bx; ctx.strokeRect(P(b[0] - 0.3), P(b[1] - 0.3), P(b[2] - b[0] + 0.6), P(b[3] - b[1] + 0.6)); }
      else { circ(cursor.x, cursor.y, 0.95); ctx.stroke(); }
    }
  }

  function frame(now) {
    if (!active) { running = false; return; }
    const dt = Math.min(80, now - last); last = now;
    if (B && out && !play && !trip) {
      let need = false;
      for (const c of B.comps) if (c.type === 'ttimer' && mem.on[c.uid] && !(out.trig && out.trig[c.uid])) {
        mem.t[c.uid] = Math.max(0, (mem.t[c.uid] || 0) - dt);
        if (mem.t[c.uid] === 0) need = true;
      }
      if (need) resim();
    }
    const Vo = play && play.view ? play.view.o : out;
    if (Vo && Vo.motor && !reduceMotion.matches) for (const id in Vo.motor) {
      if (Vo.motor[id] === 'rechts') motorAng[id] = ((motorAng[id] || 0) + dt * 0.006) % TAU;
      else if (Vo.motor[id] === 'links') motorAng[id] = ((motorAng[id] || 0) - dt * 0.006) % TAU;
    }
    draw(now);
    requestAnimationFrame(frame);
  }

  function setActive(v) {
    active = v;
    if (v) {
      lastWrapW = -1; sizeSheet();
      if (!running) { running = true; last = performance.now(); requestAnimationFrame(frame); }
    } else if (play) skipPlay();
  }
  // ---------- Start ----------
  const wanted = opts.task ? LV.findIndex(l => l.id === opts.task) : -1;
  loadLevel(wanted >= 0 ? wanted : save.li);
  setActive(true);
  return {
    unmount() {
      if (play) stopPlay();
      active = false;
      clearTimeout(msgTimer);
      ac.abort(); ro.disconnect(); offTheme();
      container.innerHTML = '';
    }
  };
}
