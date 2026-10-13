// Abschnitt 1: Sicherheit und Grundlagen
// Aufgabentypen: choice (eine Antwort), multi (mehrere), tf (richtig/falsch), order (Reihenfolge),
// match (Paare zuordnen), num (Zahl mit Toleranz). r = richtige Lösung, x = Erklärung.
export default {
  id: 'sicherheit',
  title: 'Sicherheit und Grundlagen',
  short: 'Sicherheit',
  icon: 'shield',
  intro: 'Die fünf Sicherheitsregeln, das ohmsche Gesetz, Leistung, Aderfarben und Schutzmaßnahmen.',
  karte: [
    'Die fünf Sicherheitsregeln: Freischalten. Gegen Wiedereinschalten sichern. Spannungsfreiheit allpolig feststellen. Erden und kurzschließen. Benachbarte, unter Spannung stehende Teile abdecken oder abschranken.',
    'Nach der Arbeit werden die Regeln in umgekehrter Reihenfolge aufgehoben.',
    'Spannungsfreiheit stellst du nur mit einem zweipoligen Spannungsprüfer fest. Prüfe ihn vorher und nachher an einer bekannten Spannung.',
    'Ohmsches Gesetz: U = R · I. Leistung: P = U · I. Drehstrom: P = √3 · U · I · cos φ.',
    'Aderfarben: L1 braun, L2 schwarz, L3 grau, N blau, PE grün-gelb.',
    'Steckdosen bis 32 A für Laien bekommen zusätzlichen Schutz durch einen FI mit höchstens 30 mA.'
  ],
  nodes: [
    {
      kind: 'lektion', title: 'Die fünf Sicherheitsregeln',
      items: [
        { t: 'order', q: 'Bringe die fünf Sicherheitsregeln in die richtige Reihenfolge.',
          a: ['Freischalten', 'Gegen Wiedereinschalten sichern', 'Spannungsfreiheit allpolig feststellen', 'Erden und kurzschließen', 'Benachbarte, unter Spannung stehende Teile abdecken oder abschranken'],
          x: 'So steht es in DIN VDE 0105-100. Nach der Arbeit hebst du die Maßnahmen in umgekehrter Reihenfolge auf.' },
        { t: 'choice', q: 'Welche Regel kommt direkt nach dem Freischalten?',
          a: ['Gegen Wiedereinschalten sichern', 'Spannungsfreiheit feststellen', 'Erden und kurzschließen', 'Benachbarte Teile abdecken'], r: 0,
          x: 'Erst wenn niemand wieder einschalten kann, prüfst du die Spannungsfreiheit.' },
        { t: 'choice', q: 'Womit stellst du die Spannungsfreiheit fest?',
          a: ['Mit einem zweipoligen Spannungsprüfer', 'Mit einem einpoligen Phasenprüfer', 'Mit dem Multimeter im Ohm-Bereich', 'Durch vorsichtiges Antippen'], r: 0,
          x: 'Ein einpoliger Phasenprüfer ist dafür nicht zugelassen. Den zweipoligen Prüfer testest du vor und nach der Messung an einer bekannten Spannung.' },
        { t: 'tf', q: 'Nach der Arbeit werden die Sicherheitsregeln in derselben Reihenfolge aufgehoben.', r: false,
          x: 'Aufgehoben wird in umgekehrter Reihenfolge: Abdeckungen weg, Erdung entfernen, dann einschalten.' },
        { t: 'choice', q: 'Wie sicherst du einen LS-Schalter gegen Wiedereinschalten?',
          a: ['Mit Sperrelement, Schloss und Hinweisschild', 'Mit einem Streifen Klebeband', 'Durch Abnehmen der Abdeckung', 'Gar nicht, er ist ja aus'], r: 0,
          x: 'Sperrelement und Schloss verhindern das Einschalten, das Schild sagt, wer arbeitet.' },
        { t: 'tf', q: 'In Niederspannungsanlagen darf man auf Erden und Kurzschließen verzichten, wenn keine Rückspeisung droht, etwa durch PV-Anlagen oder Notstromaggregate.', r: true,
          x: 'Bei Freileitungen und bei möglicher Rückspeisung wird immer geerdet und kurzgeschlossen.' },
        { t: 'choice', q: 'Wer darf elektrische Anlagen errichten und ändern?',
          a: ['Elektrofachkräfte oder Personen unter deren Leitung und Aufsicht', 'Jeder mit passendem Werkzeug', 'Nur der Netzbetreiber', 'Der Hausbesitzer selbst'], r: 0,
          x: 'So regelt es die DGUV Vorschrift 3.' }
      ]
    },
    {
      kind: 'lektion', title: 'Ohmsches Gesetz und Leistung',
      items: [
        { t: 'num', q: 'Ein Heizwiderstand mit 46 Ω liegt an 230 V. Welcher Strom fließt?', r: 5, tol: 0.05, unit: 'A',
          x: 'I = U / R = 230 V / 46 Ω = 5 A.' },
        { t: 'num', q: 'Ein Wasserkocher nimmt bei 230 V einen Strom von 8,7 A auf. Welche Leistung hat er etwa?', r: 2001, tol: 30, unit: 'W',
          x: 'P = U · I = 230 V · 8,7 A ≈ 2.000 W.' },
        { t: 'num', q: 'Eine Wallbox lädt mit 16 A je Außenleiter auf allen drei Außenleitern, je 230 V gegen N. Wie viele kW sind das?', r: 11.04, tol: 0.15, unit: 'kW',
          x: 'P = 3 · 230 V · 16 A = 11.040 W, also rund 11 kW.' },
        { t: 'choice', q: 'Welche Formel gilt für die Wirkleistung im Drehstromnetz?',
          a: ['P = √3 · U · I · cos φ', 'P = 3 · U · I', 'P = U · I / √3', 'P = U² · R'], r: 0,
          x: 'U ist hier die Spannung zwischen zwei Außenleitern, also 400 V.' },
        { t: 'choice', q: 'Welche Spannung liegt im Niederspannungsnetz zwischen zwei Außenleitern an?',
          a: ['400 V', '230 V', '690 V', '110 V'], r: 0,
          x: 'Zwischen Außenleiter und N sind es 230 V, zwischen zwei Außenleitern 400 V.' },
        { t: 'num', q: 'Ein Durchlauferhitzer hat 21 kW an 400 V Drehstrom, cos φ = 1. Welcher Strom fließt je Außenleiter?', r: 30.3, tol: 0.5, unit: 'A',
          x: 'I = P / (√3 · U) = 21.000 W / (1,73 · 400 V) ≈ 30,3 A.' },
        { t: 'match', q: 'Ordne die Größen ihren Einheiten zu.',
          a: [['Spannung', 'Volt'], ['Strom', 'Ampere'], ['Widerstand', 'Ohm'], ['Leistung', 'Watt']],
          x: 'Formelzeichen: U, I, R und P.' }
      ]
    },
    {
      kind: 'lektion', title: 'Aderfarben und Schutzmaßnahmen',
      items: [
        { t: 'match', q: 'Ordne die Leiter ihren Aderfarben zu.',
          a: [['L1', 'braun'], ['L2', 'schwarz'], ['L3', 'grau'], ['N', 'blau'], ['PE', 'grün-gelb']],
          x: 'Die Farben sind in DIN EN 60445 festgelegt.' },
        { t: 'choice', q: 'Welchen Bemessungsfehlerstrom hat ein FI für den zusätzlichen Schutz von Steckdosen?',
          a: ['Höchstens 30 mA', '300 mA', '500 mA', '10 A'], r: 0,
          x: 'DIN VDE 0100-410 fordert ihn für Steckdosen bis 32 A, die von Laien benutzt werden.' },
        { t: 'choice', q: 'Wovor schützt ein LS-Schalter in erster Linie?',
          a: ['Die Leitung vor Überlast und Kurzschluss', 'Menschen vor Fehlerströmen', 'Geräte vor Überspannung', 'Vor Fehlerlichtbögen'], r: 0,
          x: 'Menschen schützt vor allem der FI. Der LS schützt die Leitung.' },
        { t: 'tf', q: 'Der grün-gelbe Schutzleiter darf auch als Neutralleiter verwendet werden.', r: false,
          x: 'Grün-gelb ist allein für den Schutzleiter da. Ein PEN-Leiter trägt zusätzlich eine blaue Kennzeichnung an den Enden.' },
        { t: 'choice', q: 'Wie hoch muss der Isolationswiderstand in einer 230/400-V-Anlage mindestens sein? Die Prüfspannung ist 500 V DC.',
          a: ['1 MΩ', '0,5 MΩ', '1 kΩ', '100 MΩ'], r: 0,
          x: 'So steht es in DIN VDE 0100-600 für Stromkreise bis 500 V.' },
        { t: 'choice', q: 'In welchem Netzsystem führt der Netzbetreiber einen PEN-Leiter bis zum Haus, der dort in N und PE aufgeteilt wird?',
          a: ['TN-C-S', 'TT', 'IT', 'TN-S'], r: 0,
          x: 'Ab der Aufteilung dürfen N und PE nicht wieder verbunden werden.' },
        { t: 'tf', q: 'Im TT-System gilt für den Fehlerschutz mit FI: R_A · I_Δn ≤ 50 V.', r: true,
          x: 'R_A ist der Widerstand von Erder und Schutzleiter, I_Δn der Bemessungsfehlerstrom des FI.' }
      ]
    },
    { kind: 'test', title: 'Abschnittstest Sicherheit' }
  ]
};
