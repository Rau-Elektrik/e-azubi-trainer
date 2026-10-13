// Abschnitt 5: Zählerschrank nach VDE-AR-N 4100 (Fassung 2026-04)
export default {
  id: 'zaehler',
  title: 'Zählerschrank nach VDE-AR-N 4100',
  short: 'Zählerschrank',
  icon: 'meter',
  intro: 'Aufbau des Zählerplatzes nach der aktuellen Fassung 2026-04: NAR, Zählerfeld, RfZ, AAR und APZ.',
  karte: [
    'Es gilt die VDE-AR-N 4100 in der Fassung 2026-04. Dazu kommen die Technischen Anschlussbedingungen (TAB) des Netzbetreibers.',
    'NAR unten: 5-polige Sammelschiene und SLS als Trennvorrichtung vor dem Zähler, sperr- und plombierbar. Die Hauptleitung kommt nie von oben.',
    'Zählerfeld 450 mm: 300 mm für den eHZ auf der BKE, 150 mm für den RfZ mit 12 TE.',
    'RfZ: nur Betriebsmittel des Messstellenbetreibers wie Smart-Meter-Gateway und Steuerbox. Kein Stromkreisverteiler.',
    'AAR 300 mm: Hauptschalter, Hauptleitungsabzweigklemmen, Überspannungsschutz Typ 1 oder 2, bis zu drei Wechselstromkreise. Kein Stromkreisverteiler.',
    'APZ: mindestens 300 mm hoch, ganz oben oder ganz unten im Schrank, für Kommunikationsgeräte des Netzbetreibers. Datenleitung mindestens Cat. 5.',
    'Im ungezählten Bereich arbeiten nur der Netzbetreiber oder Betriebe aus dem Installateurverzeichnis.'
  ],
  nodes: [
    {
      kind: 'lektion', title: 'Aufbau des Zählerplatzes',
      items: [
        { t: 'match', q: 'Ordne die Abkürzungen zu.',
          a: [['NAR', 'netzseitiger Anschlussraum'], ['AAR', 'anlagenseitiger Anschlussraum'], ['RfZ', 'Raum für Zusatzanwendungen'], ['APZ', 'Abschlusspunkt Zählerplatz']],
          x: 'Der NAR liegt vor dem Zähler, der AAR dahinter.' },
        { t: 'choice', q: 'Was sitzt im netzseitigen Anschlussraum als Trennvorrichtung vor dem Zähler?',
          a: ['Ein selektiver Hauptleitungsschutzschalter (SLS)', 'Der FI der Wohnung', 'Der Hauptschalter der Kundenanlage', 'Das Smart-Meter-Gateway'], r: 0,
          x: 'Der SLS ist laienbedienbar, sperrbar und plombierbar.' },
        { t: 'choice', q: 'Wie hoch ist der anlagenseitige Anschlussraum (AAR)?',
          a: ['300 mm', '150 mm', '450 mm', '600 mm'], r: 0, x: 'Darin sitzen Hauptschalter, Abzweigklemmen und Überspannungsschutz.' },
        { t: 'tf', q: 'Der AAR darf als Stromkreisverteiler für die Wohnung genutzt werden.', r: false,
          x: 'Bis zu drei Wechselstromkreise sind erlaubt, ein Stromkreisverteiler ist er aber nicht.' },
        { t: 'choice', q: 'Wofür ist der Raum für Zusatzanwendungen (RfZ) gedacht?',
          a: ['Für Geräte des Messstellenbetreibers, zum Beispiel das Smart-Meter-Gateway', 'Für die Stromkreise der Wohnung', 'Für den Hausanschlusskasten', 'Als Reserve für LS-Schalter'], r: 0,
          x: 'Kundeneigene Schaltgeräte haben im RfZ nichts zu suchen.' },
        { t: 'choice', q: 'Woher kommt die Spannungsversorgung für APZ und RfZ?',
          a: ['Aus dem netzseitigen Anschlussraum', 'Aus dem Verteilerfeld', 'Aus dem AAR', 'Aus einer Steckdose der Wohnung'], r: 0,
          x: 'Sie wird vor dem Zähler abgegriffen, damit die Geräte des Netzbetreibers unabhängig von der Kundenanlage laufen.' },
        { t: 'tf', q: 'Die Hauptleitung darf von oben in den netzseitigen Anschlussraum geführt werden.', r: false,
          x: 'Sie wird von unten, hinten oder seitlich eingeführt.' }
      ]
    },
    {
      kind: 'lektion', title: 'Regeln und Zuständigkeit',
      items: [
        { t: 'choice', q: 'Wer darf im ungezählten Bereich vor dem Zähler arbeiten?',
          a: ['Der Netzbetreiber oder ein Betrieb aus dem Installateurverzeichnis', 'Jeder Elektriker', 'Der Hausbesitzer', 'Der Messstellenbetreiber allein'], r: 0,
          x: 'So regelt es § 13 der Niederspannungsanschlussverordnung (NAV).' },
        { t: 'choice', q: 'Wie hoch ist das Zählerfeld für einen eHZ mit RfZ nach der Fassung 2026-04?',
          a: ['450 mm', '300 mm', '600 mm', '900 mm'], r: 0, x: '300 mm für den eHZ, 150 mm für den RfZ.' },
        { t: 'choice', q: 'Welcher Überspannungsschutz darf in den AAR?',
          a: ['Typ 1 oder Typ 2', 'Nur Typ 3', 'Gar keiner', 'Nur ein Feinschutz für Steckdosen'], r: 0,
          x: 'Im NAR ist ein Kombiableiter nach DIN VDE 0100-443 möglich.' },
        { t: 'tf', q: 'Ein eHZ wird auf eine BKE gesteckt.', r: true, x: 'BKE heißt Befestigungs- und Kontaktiereinrichtung.' },
        { t: 'choice', q: 'Wo sitzt die Hausanschlusssicherung?',
          a: ['Im Hausanschlusskasten', 'Im NAR', 'Im AAR', 'Im RfZ'], r: 0, x: 'Der Hausanschlusskasten gehört dem Netzbetreiber.' },
        { t: 'choice', q: 'Welche Datenleitung verbindet den Zählerplatz mindestens mit dem APZ?',
          a: ['Cat. 5 mit RJ45-Buchsen', 'Eine Telefonleitung', 'Ein Koaxialkabel', 'Gar keine'], r: 0, x: 'Besser ist Cat. 7.' },
        { t: 'tf', q: 'Für die genaue Ausführung gelten zusätzlich die TAB des jeweiligen Netzbetreibers.', r: true,
          x: 'Viele Netzbetreiber haben eigene Merkblätter zum Zählerplatz.' }
      ]
    },
    { kind: 'praxis', title: 'Zählerschrank bestücken', module: 'zaehlerschrank', task: 'standard' },
    { kind: 'test', title: 'Abschnittstest Zählerschrank' }
  ]
};
