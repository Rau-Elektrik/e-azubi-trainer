// Abschnitt 7: Erdung und Messen
export default {
  id: 'erdung',
  title: 'Erdung und Messen',
  short: 'Erdung',
  icon: 'earth',
  intro: 'Fundamenterder und Ringerder nach DIN 18014, Potentialausgleich und die Messung des Erdungswiderstands.',
  karte: [
    'Fundamenterder nach DIN 18014: geschlossener Ring, Maschen höchstens 20 m × 20 m, allseitig mindestens 5 cm Beton.',
    'Werkstoff im Beton: Rundstahl mindestens 10 mm Durchmesser oder Bandstahl 30 × 3,5 mm.',
    'Bei Perimeterdämmung oder WU-Beton kommt außen ein Ringerder aus Edelstahl V4A (1.4571) hin, im Fundament ein Funktionspotentialausgleichsleiter.',
    'Die Anschlussfahnen führen zur Haupterdungsschiene. Dort treffen Schutzleiter, Erdungsleiter und der Schutzpotentialausgleich von Wasser-, Gas- und Heizungsrohren zusammen.',
    'Erdungsmessung mit Sondenmethode: Trennstelle öffnen, Hilfserder mindestens 20 m entfernt, Sonde bei rund 62 % der Strecke, an mehreren Stellen kontrollieren.',
    'TT-System mit FI: R_A · I_Δn ≤ 50 V. Bei 30 mA darf R_A höchstens 1.667 Ω betragen.'
  ],
  nodes: [
    {
      kind: 'lektion', title: 'Erder verlegen',
      items: [
        { t: 'choice', q: 'Wie groß dürfen die Maschen eines Fundamenterders höchstens sein?',
          a: ['20 m × 20 m', '50 m × 50 m', '5 m × 5 m', 'Egal, Hauptsache ein Ring'], r: 0,
          x: 'Größere Gebäude bekommen Querverbindungen.' },
        { t: 'choice', q: 'Wie dick muss die Betonüberdeckung des Fundamenterders allseitig mindestens sein?',
          a: ['5 cm', '1 cm', '20 cm', '50 cm'], r: 0, x: 'Der Beton schützt den Stahl vor Korrosion.' },
        { t: 'choice', q: 'Welcher Werkstoff gehört für einen Ringerder direkt ins Erdreich?',
          a: ['Edelstahl V4A (1.4571)', 'Verzinkter Bandstahl', 'Aluminium', 'Kupferlackdraht'], r: 0,
          x: 'Verzinkter Stahl korrodiert im Erdreich zu schnell.' },
        { t: 'tf', q: 'Bei einer Perimeterdämmung unter der Bodenplatte wirkt ein Fundamenterder darin nicht mehr als Erder.', r: true,
          x: 'Die Dämmung trennt den Beton vom Erdreich. Deshalb kommt außen ein Ringerder hin.' },
        { t: 'multi', q: 'Was wird an der Haupterdungsschiene zusammengeführt?',
          a: ['Der Schutzleiter der Anlage', 'Der Erdungsleiter vom Fundamenterder', 'Metallene Wasser-, Gas- und Heizungsrohre', 'Der Neutralleiter jedes einzelnen Stromkreises'], r: [0, 1, 2],
          x: 'Das ist der Schutzpotentialausgleich nach DIN VDE 0100-410 und -540.' },
        { t: 'choice', q: 'Wozu dienen die Anschlussfahnen des Fundamenterders?',
          a: ['Zur Verbindung mit der Haupterdungsschiene und dem Blitzschutz', 'Als Halter für die Bewehrung', 'Zum Messen der Temperatur', 'Für die Antenne'], r: 0,
          x: 'Bei Blitzschutz braucht jede Ableitung eine eigene Anschlussfahne.' },
        { t: 'num', q: 'Wie groß ist der Querschnitt von Bandstahl 30 mm × 3,5 mm?', r: 105, tol: 0.5, unit: 'mm²',
          x: '30 mm · 3,5 mm = 105 mm².' }
      ]
    },
    {
      kind: 'lektion', title: 'Erdungswiderstand messen',
      items: [
        { t: 'order', q: 'Bringe die Schritte der Erdungsmessung mit Sondenmethode in die richtige Reihenfolge.',
          a: ['Trennstelle an der Haupterdungsschiene öffnen', 'Hilfserder mindestens 20 m entfernt setzen', 'Sonde bei rund 62 % der Strecke setzen', 'Messen und an weiteren Sondenpositionen kontrollieren', 'Trennstelle wieder schließen'],
          x: 'Bleibt der Wert beim Verschieben der Sonde gleich, ist die Messung gültig.' },
        { t: 'choice', q: 'Warum wird der Erder vor der Messung aufgetrennt?',
          a: ['Sonst misst man parallele Erdungen über PEN und Rohre mit', 'Damit der Erder abkühlt', 'Weil das Messgerät sonst kaputt geht', 'Damit der FI nicht auslöst'], r: 0,
          x: 'Der Messwert wäre dann viel zu klein.' },
        { t: 'choice', q: 'Bei welchem Anteil der Strecke Erder–Hilfserder setzt man die Sonde?',
          a: ['Bei rund 62 %', 'Bei 10 %', 'Bei 50 %', 'Bei 95 %'], r: 0,
          x: 'Dort liegt die Sonde außerhalb beider Spannungstrichter.' },
        { t: 'num', q: 'TT-System mit FI 30 mA: Wie groß darf R_A höchstens sein? Runde auf ganze Ohm.', r: 1667, tol: 1, unit: 'Ω',
          x: 'R_A ≤ 50 V / 0,03 A = 1.666,7 Ω.' },
        { t: 'tf', q: 'Mit der Zangenmethode lässt sich ein Erder messen, ohne ihn aufzutrennen.', r: true,
          x: 'Das geht in vermaschten Erdungsanlagen. Die Sondenmethode bleibt die Standardmessung.' },
        { t: 'choice', q: 'Woran erkennst du eine gültige Messung?',
          a: ['Der Wert bleibt fast gleich, wenn die Sonde etwas verschoben wird', 'Der Wert ist möglichst klein', 'Das Gerät piept', 'Der Wert ändert sich stark'], r: 0,
          x: 'Dieses Plateau zeigt, dass sich die Spannungstrichter nicht überlappen.' }
      ]
    },
    { kind: 'praxis', title: 'Erdungswiderstand messen', module: 'erdung', task: 'standard' },
    { kind: 'test', title: 'Abschnittstest Erdung' }
  ]
};
