// Abschnitt 6: Messsysteme (mME, iMSys, Smart-Meter-Gateway, § 14a EnWG)
export default {
  id: 'messsysteme',
  title: 'Messsysteme',
  short: 'Messsysteme',
  icon: 'chart',
  intro: 'Moderne Messeinrichtung, intelligentes Messsystem, Pflichtfälle nach Messstellenbetriebsgesetz und steuerbare Verbraucher.',
  karte: [
    'Moderne Messeinrichtung (mME): digitaler Zähler ohne Kommunikationsmodul.',
    'Intelligentes Messsystem (iMSys): moderne Messeinrichtung plus Smart-Meter-Gateway.',
    'Pflichteinbau nach § 29 MsbG: Jahresverbrauch über 6.000 kWh, Erzeugungsanlagen über 7 kW, steuerbare Verbrauchseinrichtungen nach § 14a EnWG.',
    '§ 14a EnWG: Wallboxen, Wärmepumpen, Klimaanlagen und Speicher über 4,2 kW sind steuerbar. Der Netzbetreiber darf drosseln, 4,2 kW bleiben aber immer. Dafür sinkt das Netzentgelt.',
    'OBIS-Kennzahlen am Zweirichtungszähler: 1.8.0 Bezug, 2.8.0 Einspeisung.',
    'Der Zähler gehört dem Messstellenbetreiber. Beim Wechsel Zählernummern und Zählerstände dokumentieren.'
  ],
  nodes: [
    {
      kind: 'lektion', title: 'Zähler und Gateway',
      items: [
        { t: 'choice', q: 'Woraus besteht ein intelligentes Messsystem?',
          a: ['Moderne Messeinrichtung plus Smart-Meter-Gateway', 'Ferraris-Zähler plus Router', 'Zwei Zähler in Reihe', 'Nur aus einem Gateway'], r: 0,
          x: 'Das Gateway ist die sichere Kommunikationseinheit.' },
        { t: 'multi', q: 'Wann ist ein intelligentes Messsystem Pflicht?',
          a: ['Jahresverbrauch über 6.000 kWh', 'PV-Anlage über 7 kW', 'Wallbox als steuerbare Verbrauchseinrichtung nach § 14a', 'Wohnung mit 2.000 kWh Verbrauch ohne Erzeugung'], r: [0, 1, 2],
          x: 'Geregelt in § 29 Messstellenbetriebsgesetz.' },
        { t: 'choice', q: 'Was ist eine moderne Messeinrichtung (mME)?',
          a: ['Ein digitaler Zähler ohne Kommunikationsmodul', 'Ein Zähler mit Gateway', 'Ein Ferraris-Zähler mit Rollenzählwerk', 'Ein Stromwandler'], r: 0,
          x: 'Mit Gateway wird daraus ein intelligentes Messsystem.' },
        { t: 'choice', q: 'Welche Leistung muss einer steuerbaren Verbrauchseinrichtung nach § 14a EnWG beim Drosseln immer bleiben?',
          a: ['4,2 kW', '0 kW', '11 kW', '1 kW'], r: 0, x: 'Laden und Heizen bleiben so immer möglich, nur langsamer.' },
        { t: 'match', q: 'Ordne die Begriffe zu.',
          a: [['1.8.0', 'Bezug aus dem Netz'], ['2.8.0', 'Einspeisung ins Netz'], ['mME', 'digitaler Zähler ohne Kommunikation'], ['SMGW', 'Kommunikationseinheit']],
          x: '1.8.0 und 2.8.0 sind OBIS-Kennzahlen für die Wirkarbeit.' },
        { t: 'tf', q: 'Der Stromzähler gehört dem Kunden.', r: false, x: 'Er gehört dem Messstellenbetreiber.' },
        { t: 'choice', q: 'Was dokumentierst du beim Zählerwechsel?',
          a: ['Zählernummern und Zählerstände von altem und neuem Zähler', 'Nur die Uhrzeit', 'Nichts', 'Die Farbe des Gehäuses'], r: 0,
          x: 'Ohne Zählerstände lässt sich nicht richtig abrechnen.' },
        { t: 'tf', q: 'Für steuerbare Verbrauchseinrichtungen nach § 14a EnWG gibt es ein reduziertes Netzentgelt.', r: true,
          x: 'Das ist der Ausgleich dafür, dass der Netzbetreiber im Notfall drosseln darf.' }
      ]
    },
    {
      kind: 'lektion', title: 'Ablesen und Pflichtfälle',
      items: [
        { t: 'num', q: '1.8.0 zeigt am 1. Januar 12.480 kWh und am 31. Dezember 16.380 kWh. Wie hoch ist der Jahresverbrauch?', r: 3900, tol: 1, unit: 'kWh',
          x: '16.380 kWh − 12.480 kWh = 3.900 kWh.' },
        { t: 'choice', q: 'Ist bei diesem Verbrauch ein intelligentes Messsystem Pflicht, wenn es keine PV und keine steuerbaren Geräte gibt?',
          a: ['Nein, unter 6.000 kWh reicht eine moderne Messeinrichtung', 'Ja, immer', 'Ja, ab 3.000 kWh', 'Nur im Winter'], r: 0,
          x: 'Der Messstellenbetreiber darf trotzdem freiwillig eines einbauen.' },
        { t: 'num', q: 'Eine PV-Anlage hat 22 Module mit je 410 Wp. Wie groß ist die installierte Leistung?', r: 9.02, tol: 0.02, unit: 'kWp',
          x: '22 × 410 Wp = 9.020 Wp. Über 7 kW ist ein intelligentes Messsystem Pflicht.' },
        { t: 'tf', q: 'Eine 6-kW-Wärmepumpe, die nach 2024 neu angeschlossen wird, ist eine steuerbare Verbrauchseinrichtung nach § 14a.', r: true,
          x: 'Steuerbar sind solche Geräte mit mehr als 4,2 kW.' },
        { t: 'choice', q: 'Wo sitzt das Smart-Meter-Gateway im Zählerschrank?',
          a: ['Im Raum für Zusatzanwendungen (RfZ)', 'Im Verteilerfeld', 'Im NAR', 'Im AAR'], r: 0, x: 'Der RfZ ist genau für solche Geräte des Messstellenbetreibers da.' }
      ]
    },
    { kind: 'test', title: 'Abschnittstest Messsysteme' }
  ]
};
