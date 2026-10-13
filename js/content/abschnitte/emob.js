// Abschnitt 8: E-Mobilität
export default {
  id: 'emob',
  title: 'E-Mobilität',
  short: 'E-Mobilität',
  icon: 'plug',
  intro: 'Wallbox anmelden, Schutz nach DIN VDE 0100-722, Ladebetriebsarten und Steuerbarkeit nach § 14a.',
  karte: [
    'Jede Ladeeinrichtung wird beim Netzbetreiber angemeldet. Über 12 kVA, zum Beispiel bei 22 kW, braucht es seine Zustimmung (§ 19 NAV).',
    'DIN VDE 0100-722: Jeder Ladepunkt hat einen eigenen Endstromkreis, einen eigenen FI mindestens Typ A mit 30 mA und einen eigenen Überstromschutz.',
    'Schutz bei glatten DC-Fehlerströmen ab 6 mA: FI Typ B, FI Typ A mit RDC-DD oder eine DC-Erkennung in der Wallbox.',
    '11 kW entsprechen 3 × 16 A, 22 kW entsprechen 3 × 32 A.',
    'Ladebetriebsarten: Mode 2 mit Ladekabel an der Steckdose, Mode 3 an Wallbox oder Ladesäule mit Typ-2-Stecker, Mode 4 Laden mit Gleichstrom, zum Beispiel über CCS.',
    'Neue Wallboxen über 4,2 kW sind steuerbare Verbrauchseinrichtungen nach § 14a EnWG.'
  ],
  nodes: [
    {
      kind: 'lektion', title: 'Wallbox planen',
      items: [
        { t: 'choice', q: 'Was gilt für eine Wallbox mit 11 kW?',
          a: ['Sie muss beim Netzbetreiber angemeldet werden', 'Sie braucht immer eine Genehmigung', 'Sie muss nicht gemeldet werden', 'Nur der Netzbetreiber darf sie anschließen'], r: 0,
          x: 'Zustimmungspflichtig sind Ladeeinrichtungen über 12 kVA, also zum Beispiel 22 kW.' },
        { t: 'choice', q: 'Die Wallbox hat eine eingebaute 6-mA-DC-Fehlerstromerkennung. Welcher FI ist mindestens nötig?',
          a: ['FI Typ A, 30 mA', 'FI Typ AC, 300 mA', 'Kein FI', 'Nur ein LS-Schalter'], r: 0,
          x: 'Ohne eingebaute DC-Erkennung braucht es Typ B oder Typ A mit RDC-DD.' },
        { t: 'multi', q: 'Womit lässt sich der Schutz bei glatten DC-Fehlerströmen ab 6 mA umsetzen?',
          a: ['FI Typ B', 'FI Typ A mit RDC-DD', 'Eine DC-Erkennung in der Wallbox', 'Ein LS-Schalter C32'], r: [0, 1, 2],
          x: 'Ein LS-Schalter erkennt keine Fehlerströme.' },
        { t: 'num', q: 'Welcher Strom fließt je Außenleiter bei einer 22-kW-Wallbox? Rechne mit 230 V je Außenleiter.', r: 32, tol: 0.6, unit: 'A',
          x: '22.000 W / (3 · 230 V) ≈ 31,9 A, also 3 × 32 A.' },
        { t: 'match', q: 'Ordne die Ladebetriebsarten zu.',
          a: [['Mode 2', 'Ladekabel mit Steuerbox an der Steckdose'], ['Mode 3', 'Wallbox oder Ladesäule mit Typ-2-Stecker'], ['Mode 4', 'Laden mit Gleichstrom über CCS']],
          x: 'Zu Hause ist Mode 3 mit Wallbox der Normalfall.' },
        { t: 'tf', q: 'Jeder Ladepunkt braucht einen eigenen Endstromkreis.', r: true, x: 'So fordert es DIN VDE 0100-722.' },
        { t: 'num', q: 'Ein Akku mit 60 kWh lädt an 11 kW. Wie viele Stunden dauert eine volle Ladung ohne Verluste?', r: 5.45, tol: 0.1, unit: 'h',
          x: '60 kWh / 11 kW ≈ 5,5 h. In echt kommen Ladeverluste dazu.' },
        { t: 'tf', q: 'Eine neue 11-kW-Wallbox ist eine steuerbare Verbrauchseinrichtung nach § 14a EnWG.', r: true,
          x: 'Der Netzbetreiber darf sie im Notfall auf 4,2 kW drosseln.' }
      ]
    },
    {
      kind: 'lektion', title: 'Stecker und Kommunikation',
      items: [
        { t: 'choice', q: 'Wozu dient der Kontakt CP (Control Pilot) im Typ-2-Stecker?',
          a: ['Zur Kommunikation zwischen Wallbox und Auto, zum Beispiel über den erlaubten Ladestrom', 'Er ist der Schutzleiter', 'Er führt den Ladestrom', 'Für die Beleuchtung'], r: 0,
          x: 'Über ein Signal auf CP teilt die Wallbox dem Auto mit, wie viel Strom es ziehen darf.' },
        { t: 'choice', q: 'Was erkennt die Ladeeinrichtung über den Kontakt PP (Proximity Pilot)?',
          a: ['Die Strombelastbarkeit des Ladekabels', 'Die Uhrzeit', 'Den Akkustand', 'Die Außentemperatur'], r: 0,
          x: 'Ein Widerstand im Stecker codiert, für wie viel Ampere das Kabel ausgelegt ist.' },
        { t: 'tf', q: 'Eine Haushaltssteckdose eignet sich für stundenlanges Laden mit hoher Dauerlast schlechter als eine Wallbox.', r: true,
          x: 'Dauerlast erwärmt Kontakte und Leitung. Die Wallbox ist dafür gebaut.' },
        { t: 'choice', q: 'Welche Angabe gehört zur Anmeldung einer Wallbox beim Netzbetreiber?',
          a: ['Die Leistung der Ladeeinrichtung', 'Die Farbe des Autos', 'Die Reichweite', 'Der Hersteller des Akkus'], r: 0,
          x: 'Der Netzbetreiber prüft damit, ob sein Netz die Last trägt.' }
      ]
    },
    { kind: 'praxis', title: 'Wallbox im Verteiler nachrüsten', module: 'verteiler', task: 'wallbox' },
    { kind: 'test', title: 'Abschnittstest E-Mobilität' }
  ]
};
