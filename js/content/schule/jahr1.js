// Berufsschule, 1. Ausbildungsjahr: Lernfelder 1 bis 4 nach KMK-Rahmenlehrplan Elektroniker/-in (2020/2021).
// Diese Lernfelder sind für alle handwerklichen Elektroberufe gleich.
// Aufgaben wie im Lernpfad: t = Typ, q = Frage, a = Antworten, r = Lösung, x = Erklärung.
// fach gilt für alle Aufgaben der Lektion, f an einer Aufgabe überschreibt es.
export default [
  {
    id: 'lf1', nr: 1, jahr: 1, stunden: 80,
    title: 'Elektrotechnische Systeme analysieren, Funktionen prüfen und Fehler beheben',
    ziel: 'Grundgrößen, ohmsches Gesetz, Grundschaltungen, Leistung, Messen und die Gefahren des Stroms.',
    karte: [
      'Ohmsches Gesetz: U = R · I. Leistung: P = U · I = I² · R = U² / R. Arbeit: W = P · t.',
      'Leiterwiderstand: R = l / (κ · A). Kupfer κ = 56 m/(Ω·mm²), Aluminium κ = 35 m/(Ω·mm²).',
      'Reihenschaltung: R = R1 + R2, der Strom ist überall gleich. Parallelschaltung: 1/R = 1/R1 + 1/R2, die Spannung ist überall gleich.',
      'Strommesser in Reihe, Spannungsmesser parallel. Widerstände nur im spannungsfreien Zustand messen.',
      'Dauernd zulässige Berührungsspannung: 50 V Wechselspannung, 120 V Gleichspannung.',
      'Erste Hilfe beim Stromunfall: zuerst den Strom abschalten, dann prüfen, rufen (112), drücken.'
    ],
    lektionen: [
      {
        title: 'Elektrische Grundgrößen', fach: 'fk',
        items: [
          { t: 'choice', q: 'Was ist elektrischer Strom?',
            a: ['Die gerichtete Bewegung von Ladungsträgern', 'Der Druck in einer Leitung', 'Die gespeicherte Energie in einer Batterie', 'Der Widerstand eines Leiters'], r: 0,
            x: 'In Metallen bewegen sich freie Elektronen. Die Spannung ist der Antrieb dafür.' },
          { t: 'tf', q: 'Ohne Spannung fließt in einem geschlossenen Stromkreis kein Strom.', r: true,
            x: 'Die Spannung ist die Ursache des Stroms. Zum Stromfluss braucht es außerdem einen geschlossenen Stromkreis.' },
          { t: 'match', q: 'Ordne die Größen ihren Formelzeichen zu.',
            a: [['Spannung', 'U'], ['Stromstärke', 'I'], ['Widerstand', 'R'], ['Ladung', 'Q']],
            x: 'Einheiten: Volt (V), Ampere (A), Ohm (Ω) und Coulomb (C = A·s).' },
          { t: 'match', q: 'Ordne die Vorsätze ihrem Faktor zu.',
            a: [['k (Kilo)', '10³'], ['M (Mega)', '10⁶'], ['m (Milli)', '10⁻³'], ['µ (Mikro)', '10⁻⁶']],
            x: 'Beispiele: 1 kW = 1.000 W, 30 mA = 0,03 A, 10 µF = 0,000 01 F.' },
          { t: 'num', q: 'Wie viele Milliampere sind 0,25 A?', r: 250, tol: 0, unit: 'mA',
            x: '0,25 A · 1.000 = 250 mA.' },
          { t: 'num', q: 'Ein Akku liefert 30 Sekunden lang 2 A. Welche Ladung ist geflossen?', r: 60, tol: 0, unit: 'As',
            x: 'Q = I · t = 2 A · 30 s = 60 As, also 60 Coulomb.' },
          { t: 'choice', q: 'Wie ist die technische Stromrichtung festgelegt?',
            a: ['Vom Pluspol über den Verbraucher zum Minuspol', 'Vom Minuspol zum Pluspol', 'Immer vom Verbraucher zur Quelle', 'Sie wechselt bei Gleichstrom ständig'], r: 0,
            x: 'Die Elektronen fließen tatsächlich von minus nach plus. Die technische Stromrichtung wurde früher festgelegt und gilt bis heute in allen Schaltplänen.' },
          { t: 'match', f: 'en', q: 'Ordne die englischen Begriffe zu.',
            a: [['voltage', 'Spannung'], ['current', 'Strom'], ['resistance', 'Widerstand'], ['power', 'Leistung']],
            x: 'So stehen die Größen in englischen Datenblättern, etwa „rated voltage“ für Bemessungsspannung.' }
        ]
      },
      {
        title: 'Ohmsches Gesetz und Leiterwiderstand', fach: 'fr',
        items: [
          { t: 'num', q: 'An einem Widerstand liegen 12 V, es fließen 0,5 A. Wie groß ist der Widerstand?', r: 24, tol: 0, unit: 'Ω',
            x: 'R = U / I = 12 V / 0,5 A = 24 Ω.' },
          { t: 'num', q: 'Ein Heizstab hat 26,45 Ω und liegt an 230 V. Welcher Strom fließt?', r: 8.7, tol: 0.05, unit: 'A',
            x: 'I = U / R = 230 V / 26,45 Ω ≈ 8,7 A.' },
          { t: 'num', q: 'Eine Kupferader ist 50 m lang und hat 1,5 mm² Querschnitt. Wie groß ist ihr Widerstand? Rechne mit κ = 56 m/(Ω·mm²).', r: 0.595, tol: 0.01, unit: 'Ω',
            x: 'R = l / (κ · A) = 50 m / (56 · 1,5 mm²) ≈ 0,595 Ω.' },
          { t: 'choice', q: 'Wie ändert sich der Widerstand einer Leitung, wenn du den Querschnitt verdoppelst?',
            a: ['Er halbiert sich', 'Er verdoppelt sich', 'Er bleibt gleich', 'Er vervierfacht sich'], r: 0,
            x: 'Der Querschnitt steht im Nenner: doppelter Querschnitt, halber Widerstand. Die Länge steht im Zähler.' },
          { t: 'num', q: 'Ein Widerstand hat 20 Ω. Wie groß ist sein Leitwert in Millisiemens?', r: 50, tol: 0, unit: 'mS',
            x: 'G = 1 / R = 1 / 20 Ω = 0,05 S = 50 mS.' },
          { t: 'num', q: 'Eine Kupferwicklung hat bei 20 °C einen Widerstand von 10 Ω. Wie groß ist er bei 70 °C? α = 0,0039 1/K.', r: 11.95, tol: 0.03, unit: 'Ω',
            x: 'R = R20 · (1 + α · Δϑ) = 10 Ω · (1 + 0,0039 · 50) = 11,95 Ω.' },
          { t: 'tf', q: 'Aluminium leitet den Strom besser als Kupfer.', r: false,
            x: 'Kupfer hat κ = 56, Aluminium nur 35 m/(Ω·mm²). Für denselben Widerstand braucht Aluminium einen größeren Querschnitt.' },
          { t: 'choice', q: 'Bei Metallen steigt der Widerstand mit der Temperatur. Wie nennt man solche Leiter?',
            a: ['Kaltleiter', 'Heißleiter', 'Halbleiter', 'Supraleiter'], r: 0,
            x: 'Kaltleiter leiten im kalten Zustand besser. Heißleiter (NTC) leiten warm besser.' }
        ]
      },
      {
        title: 'Reihen- und Parallelschaltung', fach: 'fr',
        items: [
          { t: 'num', q: 'Drei Widerstände mit 100 Ω, 220 Ω und 680 Ω sind in Reihe geschaltet. Wie groß ist der Gesamtwiderstand?', r: 1000, tol: 0, unit: 'Ω',
            x: 'In Reihe werden die Widerstände addiert: 100 + 220 + 680 = 1.000 Ω.' },
          { t: 'num', q: 'Zwei Widerstände mit 60 Ω und 30 Ω sind parallel geschaltet. Wie groß ist der Gesamtwiderstand?', r: 20, tol: 0, unit: 'Ω',
            x: 'R = R1 · R2 / (R1 + R2) = 1.800 / 90 = 20 Ω.' },
          { t: 'num', q: 'Ein Spannungsteiler aus R1 = 1 kΩ und R2 = 2 kΩ liegt an 12 V. Welche Spannung liegt an R2?', r: 8, tol: 0.01, unit: 'V',
            x: 'U2 = U · R2 / (R1 + R2) = 12 V · 2 / 3 = 8 V.' },
          { t: 'num', q: 'R1 = 40 Ω und R2 = 60 Ω liegen in Reihe an 230 V. Welcher Strom fließt?', r: 2.3, tol: 0.01, unit: 'A',
            x: 'R = 100 Ω, I = 230 V / 100 Ω = 2,3 A.' },
          { t: 'num', q: 'Drei Leuchten mit je 60 W sind parallel an 230 V angeschlossen. Wie groß ist der Gesamtstrom?', r: 0.78, tol: 0.02, unit: 'A',
            x: 'P = 180 W, I = P / U = 180 W / 230 V ≈ 0,78 A.' },
          { t: 'tf', q: 'In einer Parallelschaltung liegt an jedem Zweig dieselbe Spannung.', r: true,
            x: 'Deshalb sind die Verbraucher im Haus parallel geschaltet: Jeder bekommt 230 V.' },
          { t: 'choice', q: 'Was gilt für den Gesamtwiderstand einer Parallelschaltung?',
            a: ['Er ist kleiner als der kleinste Einzelwiderstand', 'Er ist größer als der größte Einzelwiderstand', 'Er ist die Summe aller Widerstände', 'Er ist immer null'], r: 0,
            x: 'Jeder weitere Zweig schafft einen zusätzlichen Weg für den Strom.' },
          { t: 'choice', f: 'fk', q: 'Was sagt die Knotenregel (1. kirchhoffsches Gesetz)?',
            a: ['Die Summe der zufließenden Ströme ist gleich der Summe der abfließenden Ströme', 'In einer Masche ist die Summe aller Spannungen null', 'Der Widerstand steigt mit der Temperatur', 'Strom und Spannung sind immer gleich groß'], r: 0,
            x: 'Die Aussage über die Spannungen in einer Masche ist die Maschenregel, das 2. kirchhoffsche Gesetz.' }
        ]
      },
      {
        title: 'Leistung, Arbeit und Energiekosten', fach: 'fr',
        items: [
          { t: 'num', q: 'Ein Heizwiderstand hat 52,9 Ω und liegt an 230 V. Welche Leistung nimmt er auf?', r: 1000, tol: 2, unit: 'W',
            x: 'P = U² / R = 52.900 V² / 52,9 Ω = 1.000 W.' },
          { t: 'num', q: 'Durch einen Widerstand von 2 Ω fließen 5 A. Wie groß ist die Verlustleistung?', r: 50, tol: 0, unit: 'W',
            x: 'P = I² · R = 25 A² · 2 Ω = 50 W.' },
          { t: 'num', q: 'Ein Heizlüfter mit 2.000 W läuft 1,5 Stunden. Wie viel Energie verbraucht er?', r: 3, tol: 0, unit: 'kWh',
            x: 'W = P · t = 2 kW · 1,5 h = 3 kWh.' },
          { t: 'num', q: 'Was kosten 3 kWh bei einem Preis von 0,32 € je kWh?', r: 0.96, tol: 0.005, unit: '€',
            x: '3 kWh · 0,32 €/kWh = 0,96 €.' },
          { t: 'num', q: 'Ein Gerät braucht im Standby dauerhaft 5 W. Wie viele kWh sind das im Jahr (8.760 h)?', r: 43.8, tol: 0.1, unit: 'kWh',
            x: 'W = 5 W · 8.760 h = 43.800 Wh = 43,8 kWh.' },
          { t: 'num', q: 'Ein Motor nimmt 1,8 kW auf und gibt 1,5 kW ab. Wie groß ist der Wirkungsgrad?', r: 83.3, tol: 0.2, unit: '%',
            x: 'η = P_ab / P_zu = 1,5 / 1,8 ≈ 0,833, also 83,3 %.' },
          { t: 'tf', q: '1 kWh entspricht 3,6 Megajoule.', r: true,
            x: '1 kWh = 1.000 W · 3.600 s = 3.600.000 Ws = 3,6 MJ.' },
          { t: 'choice', f: 'fk', q: 'In welcher Einheit rechnet der Energieversorger die elektrische Arbeit ab?',
            a: ['Kilowattstunde (kWh)', 'Kilowatt (kW)', 'Kilovoltampere (kVA)', 'Amperestunde (Ah)'], r: 0,
            x: 'kW ist eine Leistung. Abgerechnet wird die Arbeit, also Leistung mal Zeit.' }
        ]
      },
      {
        title: 'Messen und Bauelemente', fach: 'fk',
        items: [
          { t: 'choice', q: 'Wie schließt du einen Strommesser an?',
            a: ['In Reihe zum Verbraucher', 'Parallel zum Verbraucher', 'Zwischen Außenleiter und Schutzleiter', 'Direkt an die Steckdose'], r: 0,
            x: 'Der Strom muss durch das Messgerät fließen. Parallel geschaltet entsteht über den kleinen Innenwiderstand ein Kurzschluss.' },
          { t: 'choice', q: 'Wie schließt du einen Spannungsmesser an?',
            a: ['Parallel zum Bauteil', 'In Reihe zum Bauteil', 'Nur an den Schutzleiter', 'Über einen Vorwiderstand in Reihe'], r: 0,
            x: 'Spannung ist ein Unterschied zwischen zwei Punkten. Der Spannungsmesser hat einen hohen Innenwiderstand.' },
          { t: 'tf', q: 'Widerstände misst du nur an spannungsfreien Bauteilen.', r: true,
            x: 'Das Ohmmeter speist selbst einen kleinen Messstrom ein. Fremdspannung verfälscht den Wert und kann das Gerät zerstören.' },
          { t: 'choice', q: 'Du misst in einer Unterverteilung einer Wohnung. Welche Messkategorie muss dein Messgerät mindestens haben?',
            a: ['CAT III', 'CAT I', 'CAT II', 'Die Kategorie spielt keine Rolle'], r: 0,
            x: 'CAT III gilt für die feste Installation im Gebäude, CAT IV für den Hausanschluss und den Zählerplatz, CAT II für Geräte an der Steckdose.' },
          { t: 'num', f: 'fr', q: 'Eine LED (U_F = 2 V, I_F = 20 mA) soll an 12 V betrieben werden. Wie groß muss der Vorwiderstand sein?', r: 500, tol: 1, unit: 'Ω',
            x: 'R = (U − U_F) / I_F = (12 V − 2 V) / 0,02 A = 500 Ω. Gewählt wird der nächste Normwert, etwa 510 Ω.' },
          { t: 'choice', q: 'Was macht eine Diode?',
            a: ['Sie lässt den Strom nur in einer Richtung durch', 'Sie speichert elektrische Ladung', 'Sie erhöht die Spannung', 'Sie begrenzt die Temperatur'], r: 0,
            x: 'In Durchlassrichtung fällt an einer Siliziumdiode etwa 0,7 V ab. In Sperrrichtung fließt praktisch kein Strom.' },
          { t: 'choice', q: 'Welches Bauteil speichert elektrische Ladung und hat die Einheit Farad?',
            a: ['Kondensator', 'Spule', 'Widerstand', 'Diode'], r: 0,
            x: 'C = Q / U. Die Spule speichert Energie im Magnetfeld, ihre Einheit ist Henry.' },
          { t: 'match', f: 'en', q: 'Ordne die englischen Bauteilnamen zu.',
            a: [['resistor', 'Widerstand'], ['capacitor', 'Kondensator'], ['diode', 'Diode'], ['fuse', 'Schmelzsicherung']],
            x: 'Die Spule heißt „inductor“ oder „coil“, der Transformator „transformer“.' }
        ]
      },
      {
        title: 'Gefahren des elektrischen Stroms', fach: 'fk',
        items: [
          { t: 'multi', q: 'Wovon hängt die Gefahr bei einer Körperdurchströmung ab?',
            a: ['Von der Stromstärke', 'Von der Einwirkdauer', 'Vom Weg des Stroms durch den Körper', 'Von der Farbe der Leitung'], r: [0, 1, 2],
            x: 'Besonders gefährlich ist der Weg über das Herz, etwa von Hand zu Hand oder von Hand zu Fuß.' },
          { t: 'choice', q: 'Ab welcher Stromstärke kann man einen umfassten Leiter meist nicht mehr loslassen?',
            a: ['Ab etwa 10 mA', 'Ab etwa 0,5 mA', 'Ab etwa 1 A', 'Ab etwa 10 A'], r: 0,
            x: 'Das ist die Loslassschwelle. Die Muskeln verkrampfen, die Einwirkdauer wird länger.' },
          { t: 'choice', q: 'Ab welcher Stromstärke droht bei längerer Einwirkung Herzkammerflimmern?',
            a: ['Ab etwa 50 mA', 'Ab etwa 1 mA', 'Erst ab 1 A', 'Erst ab 16 A'], r: 0,
            x: 'Deshalb schaltet der FI für den zusätzlichen Schutz schon bei höchstens 30 mA ab.' },
          { t: 'choice', q: 'Wie hoch darf eine Berührungsspannung bei Wechselspannung dauernd sein?',
            a: ['50 V', '230 V', '12 V', '120 V'], r: 0,
            x: 'Für Gleichspannung (oberschwingungsfrei) gilt 120 V.' },
          { t: 'order', q: 'Bring die Erste Hilfe bei einem Stromunfall in die richtige Reihenfolge.',
            a: ['Strom abschalten, ohne dich selbst zu gefährden', 'Bewusstsein und Atmung prüfen', 'Notruf 112 absetzen', 'Bei fehlender Atmung Herzdruckmassage beginnen'],
            x: 'Prüfen, rufen, drücken. Eigenschutz geht vor: Erst wenn kein Strom mehr fließt, fasst du die Person an.' },
          { t: 'tf', q: 'Wer nach einem Stromunfall wieder ansprechbar ist und sich gut fühlt, muss nicht zum Arzt.', r: false,
            x: 'Herzrhythmusstörungen können noch Stunden später auftreten. Jeder Stromunfall gehört ärztlich untersucht und gemeldet.' },
          { t: 'choice', q: 'Was bedeutet die erste der fünf Sicherheitsregeln „Freischalten“?',
            a: ['Die Anlage allpolig von allen Spannungsquellen trennen', 'Den Arbeitsbereich aufräumen', 'Die Schutzbrille aufsetzen', 'Den Kunden informieren'], r: 0,
            x: 'Allpolig heißt: alle Außenleiter und der Neutralleiter. Danach folgt: gegen Wiedereinschalten sichern.' }
        ]
      }
    ]
  },
  {
    id: 'lf2', nr: 2, jahr: 1, stunden: 80,
    title: 'Elektrische Systeme planen und installieren',
    ziel: 'Installationsschaltungen, Leitungen und Installationszonen, Leitungsschutz, Schutzklassen, Brandschutz und Kosten.',
    karte: [
      'Ab zwei Schaltstellen: Wechselschaltung. Jede weitere Schaltstelle braucht einen Kreuzschalter. Viele Taster: Stromstoßschaltung.',
      'Der Schalter liegt immer im Außenleiter, nie im Neutralleiter.',
      'Installationszonen nach DIN 18015-3: waagerecht 15–45 cm unter der Decke und über dem Fußboden, senkrecht 10–30 cm neben Türen, Fenstern und Ecken.',
      'Leitungsschutz: I_b ≤ I_n ≤ I_z. Spannungsfall vom Zähler bis zum Verbraucher höchstens 3 % (DIN 18015-1).',
      'Schutzklasse I: Schutzleiter. II: doppelte Isolierung. III: Schutzkleinspannung.',
      'Angebot: Material + Lohn + Zuschläge + 19 % Umsatzsteuer. Das Aufmaß ist die Grundlage der Rechnung.'
    ],
    lektionen: [
      {
        title: 'Installationsschaltungen', fach: 'sp',
        items: [
          { t: 'choice', q: 'Eine Leuchte soll von zwei Stellen aus geschaltet werden. Welche Schaltung brauchst du?',
            a: ['Wechselschaltung', 'Ausschaltung', 'Serienschaltung', 'Kreuzschaltung allein'], r: 0,
            x: 'Zwei Wechselschalter, verbunden über zwei korrespondierende Adern.' },
          { t: 'choice', q: 'Ein Flur hat drei Schaltstellen. Welche Schalter setzt du ein?',
            a: ['Zwei Wechselschalter und einen Kreuzschalter', 'Drei Wechselschalter', 'Drei Kreuzschalter', 'Einen Serienschalter und zwei Ausschalter'], r: 0,
            x: 'Die Wechselschalter sitzen am Anfang und am Ende, dazwischen jeder Kreuzschalter.' },
          { t: 'num', q: 'Wie viele Kreuzschalter brauchst du für eine Kreuzschaltung mit fünf Schaltstellen?', r: 3, tol: 0, unit: 'Stück',
            x: 'Anzahl der Schaltstellen minus zwei Wechselschalter: 5 − 2 = 3 Kreuzschalter.' },
          { t: 'choice', q: 'Woran erkennst du eine Stromstoßschaltung?',
            a: ['Parallel geschaltete Taster steuern einen Stromstoßschalter', 'Zwei Wechselschalter sind in Reihe geschaltet', 'Ein Schalter schaltet zwei Leuchtengruppen', 'Ein Dimmer ersetzt den Schalter'], r: 0,
            x: 'Jeder Tastendruck wechselt den Schaltzustand. Weitere Taster werden einfach parallel dazugeklemmt.' },
          { t: 'tf', q: 'Der Schalter einer Leuchte muss im Außenleiter liegen, nicht im Neutralleiter.', r: true,
            x: 'Liegt der Schalter im N, steht die Leuchte bei ausgeschaltetem Licht weiter unter Spannung.' },
          { t: 'choice', q: 'Mit welcher Schaltung schaltest du zwei Leuchtengruppen eines Kronleuchters getrennt von einer Stelle aus?',
            a: ['Serienschaltung', 'Wechselschaltung', 'Kreuzschaltung', 'Sparwechselschaltung'], r: 0,
            x: 'Der Serienschalter hat zwei Wippen und einen gemeinsamen Zuleiter.' },
          { t: 'match', q: 'Ordne den Schaltern die Zahl ihrer Anschlussklemmen zu.',
            a: [['Ausschalter', '2 Klemmen'], ['Wechselschalter', '3 Klemmen'], ['Kreuzschalter', '4 Klemmen']],
            x: 'Der Wechselschalter hat eine Wurzel (P oder L) und zwei korrespondierende Klemmen, der Kreuzschalter zwei Ein- und zwei Ausgänge.' },
          { t: 'choice', q: 'Im Treppenhaus soll das Licht nach einer eingestellten Zeit selbst ausgehen. Was setzt du ein?',
            a: ['Einen Treppenlichtzeitschalter mit Tastern', 'Eine Kreuzschaltung', 'Einen Serienschalter', 'Einen Dimmer'], r: 0,
            x: 'Der Treppenlichtzeitschalter sitzt im Verteiler. Moderne Geräte warnen vor dem Ausschalten durch kurzes Flackern.' }
        ]
      },
      {
        title: 'Leitungen und Installationszonen', fach: 'fk',
        items: [
          { t: 'match', q: 'Ordne die Leitung ihrem typischen Einsatz zu.',
            a: [['NYM-J', 'Mantelleitung für Innenräume'], ['NYY-J', 'Kabel für die Erdverlegung'], ['H07V-U', 'Eindrähtige Aderleitung im Rohr oder Verteiler'], ['H07RN-F', 'Gummischlauchleitung für die Baustelle']],
            x: 'Kabel (NYY) dürfen in die Erde, Mantelleitungen (NYM) nicht.' },
          { t: 'choice', q: 'Was bedeutet das „J“ in NYM-J 3×1,5?',
            a: ['Die Leitung hat eine grün-gelbe Ader', 'Die Leitung ist für Erdverlegung zugelassen', 'Die Leitung ist halogenfrei', 'Die Leitung ist feindrähtig'], r: 0,
            x: 'Mit „O“ gekennzeichnete Leitungen haben keine grün-gelbe Ader.' },
          { t: 'choice', q: 'Was gibt „07“ in der Bezeichnung H07V-U an?',
            a: ['Die Nennspannung 450/750 V', 'Den Querschnitt 0,7 mm²', 'Das Baujahr 2007', 'Die Zahl der Adern'], r: 0,
            x: '05 steht für 300/500 V, 07 für 450/750 V. H heißt harmonisierte Leitung, V ist PVC, U eindrähtig.' },
          { t: 'choice', q: 'Wo liegt die obere waagerechte Installationszone nach DIN 18015-3?',
            a: ['15 bis 45 cm unter der Decke', '0 bis 15 cm unter der Decke', '50 bis 80 cm unter der Decke', 'Direkt in der Decke'], r: 0,
            x: 'Vorzugsmaß ist 30 cm unter der Decke. Die untere Zone liegt 15 bis 45 cm über dem fertigen Fußboden.' },
          { t: 'choice', q: 'Wie weit von der Rohbaukante einer Tür liegt die senkrechte Installationszone?',
            a: ['10 bis 30 cm', '0 bis 5 cm', '40 bis 60 cm', 'Beliebig'], r: 0,
            x: 'Vorzugsmaß ist 15 cm. Dasselbe gilt neben Fenstern und Raumecken.' },
          { t: 'tf', q: 'Die mittlere waagerechte Installationszone (90 bis 120 cm) gibt es nur in Räumen mit Arbeitsflächen, etwa in der Küche.', r: true,
            x: 'Sie ist für die Steckdosen über der Arbeitsplatte gedacht. Vorzugsmaß ist 100 cm über dem fertigen Fußboden.' },
          { t: 'tf', q: 'Leitungen dürfen in der Wand schräg verlegt werden, wenn der Weg dadurch kürzer wird.', r: false,
            x: 'In Wänden nur waagerecht und senkrecht innerhalb der Zonen. Sonst trifft später jemand beim Bohren die Leitung.' },
          { t: 'choice', f: 'en', q: 'Was bedeutet „conduit“ auf einer englischen Baustelle?',
            a: ['Installationsrohr', 'Abzweigdose', 'Kabelbinder', 'Leitungsschutzschalter'], r: 0,
            x: 'Die Abzweigdose heißt „junction box“, der Kabelbinder „cable tie“.' }
        ]
      },
      {
        title: 'Leitungsschutz und Spannungsfall', fach: 'fr',
        items: [
          { t: 'choice', f: 'fk', q: 'Welche Bedingung gilt für den Schutz bei Überlast?',
            a: ['I_b ≤ I_n ≤ I_z', 'I_z ≤ I_n ≤ I_b', 'I_n ≤ I_b ≤ I_z', 'I_b = I_n = I_z'], r: 0,
            x: 'Betriebsstrom ≤ Nennstrom der Schutzeinrichtung ≤ zulässige Strombelastbarkeit der Leitung.' },
          { t: 'num', q: 'Ein Heizgerät mit 3,5 kW hängt an 230 V. Wie groß ist der Betriebsstrom?', r: 15.2, tol: 0.1, unit: 'A',
            x: 'I_b = P / U = 3.500 W / 230 V ≈ 15,2 A. Ein B16 passt, wenn die Leitung mindestens 16 A verträgt.' },
          { t: 'num', q: 'Eine Wechselstromleitung NYM-J 3×2,5 ist 25 m lang und führt 16 A. Wie groß ist der Spannungsfall? κ = 56 m/(Ω·mm²).', r: 5.71, tol: 0.05, unit: 'V',
            x: 'ΔU = 2 · l · I / (κ · A) = 2 · 25 · 16 / (56 · 2,5) ≈ 5,71 V. Der Faktor 2 steht für Hin- und Rückleiter.' },
          { t: 'num', q: 'Wie viel Prozent von 230 V sind 5,71 V Spannungsfall?', r: 2.48, tol: 0.05, unit: '%',
            x: '5,71 V / 230 V · 100 % ≈ 2,48 %. Das liegt unter den empfohlenen 3 %.' },
          { t: 'choice', f: 'fk', q: 'Wie viel Spannungsfall empfiehlt DIN 18015-1 höchstens zwischen Messeinrichtung und Verbraucher?',
            a: ['3 %', '0,5 %', '10 %', '15 %'], r: 0,
            x: 'Zwischen Hausanschluss und Zähler sind nach VDE-AR-N 4100 nur 0,5 % vorgesehen.' },
          { t: 'match', f: 'fk', q: 'Ordne die Auslösecharakteristik dem magnetischen Auslösebereich zu.',
            a: [['B', '3- bis 5-facher Nennstrom'], ['C', '5- bis 10-facher Nennstrom'], ['D', '10- bis 20-facher Nennstrom']],
            x: 'In Wohnungen ist B üblich. C und D vertragen höhere Einschaltströme, etwa von Motoren und Trafos.' },
          { t: 'multi', f: 'fk', q: 'Welche Umstände verringern die zulässige Strombelastbarkeit einer Leitung?',
            a: ['Häufung mit anderen belasteten Leitungen', 'Hohe Umgebungstemperatur', 'Verlegung in Wärmedämmung', 'Eine kurze Leitungslänge'], r: [0, 1, 2],
            x: 'Die Wärme kann schlechter abgeführt werden. Dafür gibt es Umrechnungsfaktoren in DIN VDE 0298-4.' },
          { t: 'num', q: 'Drei Leitungen liegen gehäuft, Faktor 0,7. Die Leitung trägt ohne Häufung 24 A. Wie viel darf sie jetzt tragen?', r: 16.8, tol: 0.05, unit: 'A',
            x: 'I_z = 24 A · 0,7 = 16,8 A.' }
        ]
      },
      {
        title: 'Schutzklassen, Schutzarten und Brandschutz', fach: 'fk',
        items: [
          { t: 'match', q: 'Ordne die Schutzklasse ihrer Schutzmaßnahme zu.',
            a: [['Schutzklasse I', 'Anschluss an den Schutzleiter'], ['Schutzklasse II', 'Doppelte oder verstärkte Isolierung'], ['Schutzklasse III', 'Betrieb mit Schutzkleinspannung']],
            x: 'Geräte der Schutzklasse II haben keinen Schutzleiteranschluss. Ihr Zeichen sind zwei ineinander liegende Quadrate.' },
          { t: 'choice', q: 'Was bedeutet die zweite Ziffer 4 in IP44?',
            a: ['Schutz gegen Spritzwasser aus allen Richtungen', 'Schutz gegen dauerndes Untertauchen', 'Schutz gegen Fremdkörper ab 1 mm', 'Staubdicht'], r: 0,
            x: 'Die erste Ziffer beschreibt Berührungs- und Fremdkörperschutz, die zweite den Wasserschutz.' },
          { t: 'choice', q: 'Bei einer Altbausanierung findest du eine Nachtspeicherheizung aus den 1970er-Jahren. Was tust du?',
            a: ['Nicht öffnen: Sie kann Asbest enthalten. Ausbau nur durch Fachkundige nach TRGS 519.', 'Öffnen und die Steine selbst entsorgen', 'Mit dem Staubsauger reinigen', 'Einfach abklemmen und in den Container werfen'], r: 0,
            x: 'Asbestfasern lösen Krebs aus. Für Arbeiten daran braucht es Sachkunde und Schutzmaßnahmen.' },
          { t: 'tf', q: 'Führst du Leitungen durch eine Brandwand, musst du die Öffnung mit einem zugelassenen Abschottungssystem verschließen.', r: true,
            x: 'Sonst breitet sich Feuer und Rauch durch die Öffnung aus. Die Abschottung wird dokumentiert und gekennzeichnet.' },
          { t: 'choice', q: 'Welche Schutzeinrichtung erkennt gefährliche Fehlerlichtbögen, etwa an einer gequetschten Leitung?',
            a: ['Brandschutzschalter (AFDD)', 'FI-Schutzschalter', 'Überspannungsschutz', 'Treppenlichtzeitschalter'], r: 0,
            x: 'Ein serieller Lichtbogen erzeugt keinen Fehlerstrom. Der FI erkennt ihn deshalb nicht, der AFDD schon.' },
          { t: 'tf', q: 'Ein Gerät der Schutzklasse II darfst du nachträglich an den Schutzleiter anschließen, um es sicherer zu machen.', r: false,
            x: 'Schutzklasse II hat keinen Schutzleiteranschluss. Ein angeklemmter PE ist nicht vorgesehen und kann die Isolierung schwächen.' },
          { t: 'choice', f: 'en', q: 'Was ist ein „residual current device (RCD)“?',
            a: ['Fehlerstrom-Schutzschalter (FI)', 'Leitungsschutzschalter', 'Überspannungsableiter', 'Stromzähler'], r: 0,
            x: 'Der Leitungsschutzschalter heißt „miniature circuit breaker (MCB)“.' }
        ]
      },
      {
        title: 'Aufmaß, Angebot und Kosten', fach: 'fr',
        items: [
          { t: 'num', q: 'Beim Aufmaß misst du in drei Räumen 18 m, 22,5 m und 14 m Leitung. Wie viel ist das zusammen?', r: 54.5, tol: 0, unit: 'm',
            x: '18 + 22,5 + 14 = 54,5 m.' },
          { t: 'num', q: '54,5 m Leitung kosten je Meter 0,92 €. Wie hoch sind die Materialkosten?', r: 50.14, tol: 0.01, unit: '€',
            x: '54,5 m · 0,92 €/m = 50,14 €.' },
          { t: 'num', q: 'Ein Monteur arbeitet 6,5 Stunden zu einem Stundensatz von 58 €. Wie hoch sind die Lohnkosten?', r: 377, tol: 0, unit: '€',
            x: '6,5 h · 58 €/h = 377 €.' },
          { t: 'num', q: 'Ein Angebot ergibt netto 1.250 €. Wie hoch ist der Bruttobetrag mit 19 % Umsatzsteuer?', r: 1487.5, tol: 0.01, unit: '€',
            x: '1.250 € · 1,19 = 1.487,50 €.' },
          { t: 'num', q: 'Ein Gerät kostet laut Liste 120 €. Du bekommst 30 % Rabatt. Was zahlst du?', r: 84, tol: 0, unit: '€',
            x: '120 € · (1 − 0,30) = 84 €.' },
          { t: 'choice', f: 'fk', q: 'Wozu dient das Aufmaß nach der Arbeit?',
            a: ['Es ist die Grundlage für die Rechnung', 'Es ersetzt das Prüfprotokoll', 'Es ist die Bestellung beim Großhandel', 'Es ist der Arbeitsvertrag'], r: 0,
            x: 'Im Aufmaß steht, was wirklich verbaut wurde: Längen, Stückzahlen und Stunden.' },
          { t: 'tf', f: 'wiso', q: 'Zeigt sich, dass ein Kostenvoranschlag wesentlich überschritten wird, musst du den Kunden sofort informieren.', r: true,
            x: 'So regelt es das BGB. Der Kunde kann den Auftrag dann kündigen und zahlt nur die bisher erbrachte Leistung.' }
        ]
      }
    ]
  },
  {
    id: 'lf3', nr: 3, jahr: 1, stunden: 80,
    title: 'Steuerungen und Regelungen analysieren und realisieren',
    ziel: 'Steuern und Regeln, EVA-Prinzip, Logik, Schützschaltungen, Sensoren, Aktoren und Zeitrelais.',
    karte: [
      'Steuern: offener Wirkungsablauf. Regeln: geschlossener Kreis mit Rückführung der Regelgröße.',
      'EVA: Eingabe (Sensoren), Verarbeitung (Steuerung), Ausgabe (Aktoren).',
      'UND = Reihenschaltung von Schließern, ODER = Parallelschaltung, NICHT = Öffner.',
      'Schütz: Spule A1–A2, Hauptkontakte 1–2, 3–4, 5–6, Schließer 13–14, Öffner 21–22.',
      'Kennbuchstaben: Q Schütz, K Hilfsschütz oder Relais, S Taster, P Meldeleuchte, F Schutzeinrichtung, M Motor.',
      'Ansprechverzögert: schaltet verzögert ein. Abfallverzögert: schaltet verzögert aus.'
    ],
    lektionen: [
      {
        title: 'Steuern oder Regeln', fach: 'fk',
        items: [
          { t: 'choice', q: 'Was unterscheidet eine Regelung von einer Steuerung?',
            a: ['Die Regelung misst die Größe und führt sie zurück', 'Die Regelung arbeitet immer mit Druckluft', 'Die Steuerung braucht immer einen Computer', 'Es gibt keinen Unterschied'], r: 0,
            x: 'Die Regelung vergleicht laufend Soll und Ist. Die Steuerung erfährt nicht, ob ihr Ziel erreicht wurde.' },
          { t: 'match', q: 'Ordne die Teile dem EVA-Prinzip zu.',
            a: [['Taster', 'Eingabe'], ['Kleinsteuerung', 'Verarbeitung'], ['Schütz mit Motor', 'Ausgabe']],
            x: 'Sensoren geben Signale ein, die Steuerung verarbeitet sie, Aktoren setzen sie um.' },
          { t: 'match', q: 'Ordne die Formelzeichen des Regelkreises zu.',
            a: [['w', 'Führungsgröße (Sollwert)'], ['x', 'Regelgröße (Istwert)'], ['y', 'Stellgröße'], ['z', 'Störgröße']],
            x: 'Die Regeldifferenz ist e = w − x.' },
          { t: 'num', f: 'fr', q: 'Der Sollwert ist 21 °C, gemessen werden 19,5 °C. Wie groß ist die Regeldifferenz?', r: 1.5, tol: 0, unit: 'K',
            x: 'e = w − x = 21 °C − 19,5 °C = 1,5 K. Temperaturunterschiede gibt man in Kelvin an.' },
          { t: 'tf', q: 'Ein Treppenlichtzeitschalter ist eine Steuerung.', r: true,
            x: 'Er schaltet nach der eingestellten Zeit aus, ohne zu messen, ob noch jemand im Treppenhaus ist.' },
          { t: 'choice', q: 'Ein Heizkörperthermostat öffnet das Ventil, wenn es im Raum zu kalt wird. Was ist das?',
            a: ['Eine Regelung', 'Eine Steuerung', 'Eine Verknüpfungssteuerung', 'Eine Zeitsteuerung'], r: 0,
            x: 'Der Fühler misst die Raumtemperatur und gibt sie zurück: ein geschlossener Regelkreis.' },
          { t: 'choice', q: 'Warum hat ein Zweipunktregler eine Schaltdifferenz (Hysterese)?',
            a: ['Damit er nicht ständig ein- und ausschaltet', 'Damit er genauer regelt', 'Damit er weniger Strom braucht', 'Damit er schneller reagiert'], r: 0,
            x: 'Ohne Hysterese würde ein Heizungsrelais am Sollwert im Sekundentakt flattern.' }
        ]
      },
      {
        title: 'Logische Grundverknüpfungen', fach: 'sp',
        items: [
          { t: 'choice', q: 'Wann ist der Ausgang einer UND-Verknüpfung 1?',
            a: ['Wenn alle Eingänge 1 sind', 'Wenn mindestens ein Eingang 1 ist', 'Wenn alle Eingänge 0 sind', 'Wenn die Eingänge verschieden sind'], r: 0,
            x: 'Im Stromlaufplan entspricht UND zwei Schließern in Reihe.' },
          { t: 'match', q: 'Ordne die Verknüpfung ihrem Zeichen im Schaltsymbol zu.',
            a: [['UND', '&'], ['ODER', '≥1'], ['Exklusiv-ODER', '=1'], ['NICHT', '1 mit Kreis am Ausgang']],
            x: 'Der Kreis am Ausgang steht für die Negation, so entstehen auch NAND und NOR.' },
          { t: 'choice', q: 'Zwei Schließer sind parallel geschaltet. Welcher Verknüpfung entspricht das?',
            a: ['ODER', 'UND', 'NICHT', 'NAND'], r: 0,
            x: 'Der Strom kommt durch, sobald einer der beiden Schließer betätigt ist.' },
          { t: 'tf', q: 'Ein NAND liefert nur dann 0, wenn alle Eingänge 1 sind.', r: true,
            x: 'NAND ist ein UND mit negiertem Ausgang.' },
          { t: 'num', q: 'Wie viele Zeilen hat die Wahrheitstabelle einer Verknüpfung mit drei Eingängen?', r: 8, tol: 0, unit: 'Zeilen',
            x: '2³ = 8 mögliche Kombinationen.' },
          { t: 'choice', q: 'Bei einem NOR ist E1 = 1 und E2 = 0. Was liegt am Ausgang?',
            a: ['0', '1', 'Das hängt vom Takt ab', 'Undefiniert'], r: 0,
            x: 'Das ODER ergibt 1, die Negation macht daraus 0. Ein NOR gibt nur 1 aus, wenn alle Eingänge 0 sind.' },
          { t: 'choice', q: 'Wann gibt ein Exklusiv-ODER mit zwei Eingängen eine 1 aus?',
            a: ['Wenn die Eingänge verschieden sind', 'Wenn beide Eingänge 1 sind', 'Wenn beide Eingänge 0 sind', 'Immer'], r: 0,
            x: 'Die Wechselschaltung arbeitet genau so: Ändert einer der Schalter seine Stellung, wechselt das Licht.' },
          { t: 'choice', q: 'Welcher Verknüpfung entspricht ein Öffner im Stromlaufplan?',
            a: ['NICHT', 'UND', 'ODER', 'Speicher'], r: 0,
            x: 'Unbetätigt leitet er, betätigt nicht: Das Signal wird umgekehrt.' }
        ]
      },
      {
        title: 'Schützschaltungen', fach: 'sp',
        items: [
          { t: 'choice', q: 'Wie entsteht die Selbsthaltung eines Schützes?',
            a: ['Ein Schließer des Schützes liegt parallel zum Ein-Taster', 'Ein Öffner des Schützes liegt in Reihe zur Spule', 'Der Aus-Taster liegt parallel zum Ein-Taster', 'Die Spule wird mit 400 V betrieben'], r: 0,
            x: 'Nach dem Loslassen des Ein-Tasters hält der eigene Schließer den Stromkreis der Spule geschlossen.' },
          { t: 'match', q: 'Ordne die Anschlussbezeichnungen am Schütz zu.',
            a: [['A1–A2', 'Spule'], ['13–14', 'Schließer (Hilfskontakt)'], ['21–22', 'Öffner (Hilfskontakt)'], ['1–2, 3–4, 5–6', 'Hauptkontakte']],
            x: 'Bei Hilfskontakten ist die erste Ziffer die Ordnungsziffer, die zweite die Funktion: 3–4 Schließer, 1–2 Öffner.' },
          { t: 'match', q: 'Ordne die Kennbuchstaben nach DIN EN 81346-2 zu.',
            a: [['Q', 'Schütz für den Motor'], ['S', 'Taster'], ['P', 'Meldeleuchte'], ['F', 'Motorschutzrelais']],
            x: 'K ist ein Hilfsschütz oder Relais, M der Motor, X eine Klemmleiste.' },
          { t: 'tf', q: 'Der Aus-Taster ist ein Öffner und liegt in Reihe vor der Selbsthaltung.', r: true,
            x: 'Er unterbricht den ganzen Steuerstromkreis. Ein Drahtbruch wirkt dann wie Aus: Das ist sicher.' },
          { t: 'choice', q: 'Wie verhinderst du bei einer Wendeschaltung, dass beide Schütze gleichzeitig anziehen?',
            a: ['Je ein Öffner des anderen Schützes im Spulenkreis (Schützverriegelung)', 'Beide Schütze an einen gemeinsamen Taster', 'Ein größerer Motorschutz', 'Eine längere Leitung zum Motor'], r: 0,
            x: 'Zögen beide an, wären zwei Außenleiter kurzgeschlossen. Oft kommt noch eine Tasterverriegelung dazu.' },
          { t: 'choice', q: 'Welche Spannung haben Steuerstromkreise oft, damit sie sicherer sind?',
            a: ['24 V über einen Steuertransformator oder ein Netzteil', '400 V direkt vom Netz', '690 V', '1.000 V Gleichspannung'], r: 0,
            x: 'Kleinspannung schützt bei Berührung. Der Steuertransformator trennt den Steuerkreis zudem vom Netz.' },
          { t: 'choice', f: 'en', q: 'Was bedeutet „contactor“ in einem englischen Schaltplan?',
            a: ['Schütz', 'Kontaktspray', 'Steckverbinder', 'Zähler'], r: 0,
            x: 'Das Motorschutzrelais heißt „overload relay“, der Taster „push button“.' }
        ]
      },
      {
        title: 'Sensoren, Aktoren und Zeitrelais', fach: 'fk',
        items: [
          { t: 'match', q: 'Ordne den Sensor dem zu, was er erkennt.',
            a: [['Induktiver Näherungsschalter', 'Metall'], ['Kapazitiver Näherungsschalter', 'Auch Holz, Kunststoff und Flüssigkeiten'], ['Reedkontakt', 'Ein Magnetfeld'], ['Lichtschranke', 'Die Unterbrechung eines Lichtstrahls']],
            x: 'Reedkontakte stecken etwa in Fensterkontakten von Alarmanlagen.' },
          { t: 'choice', q: 'Was macht ein ansprechverzögertes Zeitrelais?',
            a: ['Es schaltet erst eine eingestellte Zeit nach dem Ansteuern', 'Es schaltet sofort ein und verzögert aus', 'Es blinkt im Takt', 'Es schaltet nur bei Spannungsausfall'], r: 0,
            x: 'Ein Beispiel ist die Umschaltung von Stern auf Dreieck beim Motoranlauf.' },
          { t: 'choice', q: 'Was macht ein abfallverzögertes Zeitrelais?',
            a: ['Es schaltet sofort ein und erst nach der eingestellten Zeit wieder aus', 'Es schaltet nach der Zeit ein', 'Es schaltet nie aus', 'Es misst die Zeit bis zum Fehler'], r: 0,
            x: 'Beispiel: Ein Badlüfter läuft nach dem Ausschalten des Lichts noch einige Minuten nach.' },
          { t: 'choice', q: 'Welches Bauteil ist ein Aktor?',
            a: ['Magnetventil', 'Temperaturfühler', 'Endschalter', 'Bewegungsmelder'], r: 0,
            x: 'Aktoren setzen Signale in Bewegung, Licht, Wärme oder Druck um. Die anderen sind Sensoren.' },
          { t: 'tf', q: 'Bei einer verbindungsprogrammierten Steuerung legt die Verdrahtung die Funktion fest.', r: true,
            x: 'Bei einer speicherprogrammierten Steuerung (SPS, LOGO!) steht die Funktion im Programm. Ändern geht ohne Umverdrahten.' },
          { t: 'choice', q: 'Ein PNP-Sensor mit drei Adern wird betätigt. Was liegt dann am schwarzen Ausgang?',
            a: ['+24 V', '0 V', '230 V', 'Eine Wechselspannung'], r: 0,
            x: 'Braun ist +24 V, blau 0 V, schwarz der Schaltausgang. PNP schaltet plus durch.' },
          { t: 'choice', q: 'Was ist ein Vorteil einer Kleinsteuerung gegenüber einer Schützsteuerung?',
            a: ['Funktionen lassen sich ohne Umverdrahten ändern', 'Sie braucht keine Spannung', 'Sie schaltet große Motoren direkt', 'Sie braucht keine Eingänge'], r: 0,
            x: 'Große Lasten schaltet die Kleinsteuerung trotzdem über Schütze.' }
        ]
      }
    ]
  },
  {
    id: 'lf4', nr: 4, jahr: 1, stunden: 80,
    title: 'Informationstechnische Systeme bereitstellen',
    ziel: 'Zahlensysteme, Hardware, Netzwerke mit IPv4, Datenschutz, Datensicherheit und Arbeitsplatz.',
    karte: [
      '1 Byte = 8 Bit, damit lassen sich 256 Werte darstellen. Dualzahl 1011 = 8 + 2 + 1 = 11.',
      'IPv4-Adresse: 32 Bit in vier Oktetten. /24 = 255.255.255.0 mit 254 nutzbaren Adressen.',
      'DHCP vergibt Adressen, DNS übersetzt Namen in Adressen, der Router verbindet Netze, der Switch Geräte im selben Netz.',
      'Twisted-Pair-Strecken sind höchstens 100 m lang.',
      'Schutzziele: Vertraulichkeit, Integrität, Verfügbarkeit. Datensicherung nach der 3-2-1-Regel.',
      'Lastenheft: Was will der Kunde? Pflichtenheft: Wie setzt der Auftragnehmer es um?'
    ],
    lektionen: [
      {
        title: 'Zahlensysteme und Hardware', fach: 'fr',
        items: [
          { t: 'num', q: 'Welche Dezimalzahl ist die Dualzahl 1011?', r: 11, tol: 0, unit: '',
            x: '1 · 8 + 0 · 4 + 1 · 2 + 1 · 1 = 11.' },
          { t: 'num', q: 'Wie viele verschiedene Werte lassen sich mit einem Byte darstellen?', r: 256, tol: 0, unit: 'Werte',
            x: '1 Byte = 8 Bit, 2⁸ = 256. Das sind die Werte 0 bis 255.' },
          { t: 'choice', q: 'Welche Hexadezimalzahl entspricht der Dezimalzahl 255?',
            a: ['FF', 'F0', '100', 'AA'], r: 0,
            x: 'F = 15. 15 · 16 + 15 = 255.' },
          { t: 'num', q: 'Eine Leitung überträgt 100 Mbit/s. Wie viele Megabyte sind das pro Sekunde?', r: 12.5, tol: 0, unit: 'MB/s',
            x: '100 Mbit/s / 8 = 12,5 MB/s.' },
          { t: 'num', q: 'Wie lange dauert der Download von 500 MB bei 50 Mbit/s?', r: 80, tol: 0, unit: 's',
            x: '500 MB = 4.000 Mbit. 4.000 Mbit / 50 Mbit/s = 80 s.' },
          { t: 'match', f: 'fk', q: 'Ordne die Bauteile ihrer Aufgabe zu.',
            a: [['CPU', 'Führt die Befehle aus'], ['RAM', 'Arbeitsspeicher, verliert Daten ohne Spannung'], ['SSD', 'Speichert Daten dauerhaft'], ['Netzwerkkarte', 'Verbindet den Rechner mit dem Netz']],
            x: 'Englisch: processor, memory, solid state drive, network interface card (NIC).' },
          { t: 'tf', f: 'fk', q: 'Daten im Arbeitsspeicher (RAM) bleiben nach dem Ausschalten erhalten.', r: false,
            x: 'RAM ist flüchtig. Was nicht gespeichert wurde, ist nach einem Stromausfall weg.' }
        ]
      },
      {
        title: 'Netzwerke', fach: 'fk',
        items: [
          { t: 'choice', q: 'Wie viele Bit hat eine IPv4-Adresse?',
            a: ['32 Bit', '8 Bit', '48 Bit', '128 Bit'], r: 0,
            x: 'Vier Oktette mit je 8 Bit. 48 Bit hat die MAC-Adresse, 128 Bit eine IPv6-Adresse.' },
          { t: 'choice', q: 'Welche Subnetzmaske gehört zu /24?',
            a: ['255.255.255.0', '255.255.0.0', '255.0.0.0', '255.255.255.255'], r: 0,
            x: '24 Bit sind Einsen: dreimal 255, dann 0.' },
          { t: 'num', f: 'fr', q: 'Wie viele Geräte kannst du in einem /24-Netz adressieren?', r: 254, tol: 0, unit: 'Geräte',
            x: '2⁸ = 256 Adressen. Die Netzadresse und die Broadcastadresse fallen weg: 254.' },
          { t: 'match', q: 'Ordne die Dienste und Geräte ihrer Aufgabe zu.',
            a: [['DHCP', 'Vergibt IP-Adressen automatisch'], ['DNS', 'Übersetzt Namen in IP-Adressen'], ['Router', 'Verbindet verschiedene Netze'], ['Switch', 'Verbindet Geräte im selben Netz']],
            x: 'Im Heimnetz stecken oft alle vier Funktionen in einem Gerät.' },
          { t: 'choice', q: 'Wie lang darf eine Twisted-Pair-Übertragungsstrecke höchstens sein?',
            a: ['100 m', '10 m', '500 m', '2 km'], r: 0,
            x: '90 m fest verlegte Leitung und zusammen 10 m Patchkabel. Längere Strecken gehen über Glasfaser.' },
          { t: 'tf', q: 'Die Adresse 192.168.1.20 ist eine private Adresse und wird im Internet nicht geroutet.', r: true,
            x: 'Private Bereiche sind 10.0.0.0/8, 172.16.0.0/12 und 192.168.0.0/16.' },
          { t: 'choice', q: 'Ein Netzwerkgerät bekommt die Adresse 169.254.12.7. Was ist wahrscheinlich los?',
            a: ['Es hat keine Adresse vom DHCP-Server erhalten', 'Es ist richtig eingestellt', 'Es ist ein Router', 'Es nutzt IPv6'], r: 0,
            x: '169.254.x.x vergibt sich das Gerät selbst, wenn kein DHCP antwortet. Prüfe Kabel, Switch und DHCP.' },
          { t: 'choice', f: 'en', q: 'Was ist das „default gateway“ in den Netzwerkeinstellungen?',
            a: ['Der Router, über den das Gerät andere Netze erreicht', 'Der Name des WLANs', 'Das Passwort', 'Die MAC-Adresse'], r: 0,
            x: 'Im Heimnetz ist das meist die Adresse des Routers, etwa 192.168.178.1.' }
        ]
      },
      {
        title: 'Datenschutz und Datensicherheit', fach: 'fk',
        items: [
          { t: 'multi', q: 'Welche gehören zu den Schutzzielen der Informationssicherheit?',
            a: ['Vertraulichkeit', 'Integrität', 'Verfügbarkeit', 'Lautstärke'], r: [0, 1, 2],
            x: 'Oft kommt die Authentizität dazu: Die Daten stammen wirklich vom angegebenen Absender.' },
          { t: 'choice', q: 'Was sind personenbezogene Daten nach der DSGVO?',
            a: ['Name und Adresse eines Kunden', 'Die Nennspannung eines Geräts', 'Der Querschnitt einer Leitung', 'Die Normnummer DIN VDE 0100'], r: 0,
            x: 'Personenbezogen ist alles, was sich einer Person zuordnen lässt: auch Telefonnummer, Zählernummer oder Kamerabilder.' },
          { t: 'choice', q: 'Was besagt die 3-2-1-Regel der Datensicherung?',
            a: ['3 Kopien, auf 2 verschiedenen Medien, 1 davon an einem anderen Ort', '3 Passwörter, 2 Nutzer, 1 Rechner', '3 Tage, 2 Wochen, 1 Monat aufbewahren', '3 Festplatten im selben Gehäuse'], r: 0,
            x: 'So überstehen die Daten auch Brand, Diebstahl oder einen Verschlüsselungstrojaner.' },
          { t: 'tf', q: 'Das Standardpasswort eines Routers oder einer Kamera änderst du bei der Inbetriebnahme.', r: true,
            x: 'Standardpasswörter sind öffentlich bekannt. Ein Angreifer probiert sie zuerst.' },
          { t: 'choice', q: 'Du bekommst eine E-Mail, angeblich vom Großhandel, mit einem Link zur „dringenden Passwortbestätigung“. Was tust du?',
            a: ['Nicht klicken, Absender prüfen und die Mail dem Chef oder der IT melden', 'Sofort klicken und das Passwort eingeben', 'Die Mail an alle Kollegen weiterleiten', 'Antworten und nachfragen, ob es echt ist'], r: 0,
            x: 'Das ist typisches Phishing. Echte Firmen fragen keine Passwörter per E-Mail ab.' },
          { t: 'tf', q: 'Fotos einer Kundenanlage, auf denen Personen zu sehen sind, darfst du ohne Einwilligung auf Social Media stellen.', r: false,
            x: 'Dafür brauchst du die Einwilligung der Personen und des Kunden. Das gilt auch für erkennbare Adressen.' },
          { t: 'choice', q: 'Warum spielst du Firmware-Updates auf Smart-Home-Geräte ein?',
            a: ['Sie schließen bekannte Sicherheitslücken', 'Sie erhöhen die Nennspannung', 'Sie sind für den FI vorgeschrieben', 'Sie verlängern das Kabel'], r: 0,
            x: 'Ein Gerät ohne Updates ist ein offenes Tor ins Kundennetz.' }
        ]
      },
      {
        title: 'Auftrag, Pflichtenheft und Arbeitsplatz', fach: 'fk',
        items: [
          { t: 'choice', q: 'Wer schreibt das Lastenheft?',
            a: ['Der Auftraggeber: Er beschreibt, was er will', 'Der Auftragnehmer: Er beschreibt, wie er es umsetzt', 'Der Netzbetreiber', 'Die Handwerkskammer'], r: 0,
            x: 'Das Pflichtenheft schreibt der Auftragnehmer als Antwort darauf.' },
          { t: 'choice', q: 'Was steht im Pflichtenheft?',
            a: ['Wie der Auftragnehmer die Anforderungen umsetzt', 'Die Wünsche des Kunden in seinen eigenen Worten', 'Die Lohnabrechnung', 'Die Unfallverhütungsvorschriften'], r: 0,
            x: 'Es ist die Grundlage für Angebot, Umsetzung und Abnahme.' },
          { t: 'choice', q: 'Wie weit sollten die Augen am Bildschirmarbeitsplatz vom Bildschirm entfernt sein?',
            a: ['Etwa 50 bis 70 cm', 'Etwa 10 bis 20 cm', 'Etwa 1,5 bis 2 m', 'So nah wie möglich'], r: 0,
            x: 'Die oberste Zeile liegt etwas unter Augenhöhe. Der Bildschirm steht quer zum Fenster, damit nichts blendet.' },
          { t: 'tf', q: 'Software ohne gültige Lizenz darfst du auf Firmenrechnern installieren, wenn sie nur kurz gebraucht wird.', r: false,
            x: 'Das verletzt das Urheberrecht. Haften muss dafür auch der Betrieb.' },
          { t: 'match', f: 'en', q: 'Ordne die englischen Begriffe aus Herstellerunterlagen zu.',
            a: [['user manual', 'Bedienungsanleitung'], ['data sheet', 'Datenblatt'], ['wiring diagram', 'Verdrahtungsplan'], ['troubleshooting', 'Fehlersuche']],
            x: 'In der Anleitung steht „troubleshooting“ meist hinten: eine Tabelle mit Fehlerbild, Ursache und Abhilfe.' },
          { t: 'choice', f: 'en', q: 'Was bedeutet „Disconnect the device from the mains before opening“?',
            a: ['Trenne das Gerät vor dem Öffnen vom Netz', 'Verbinde das Gerät vor dem Öffnen mit dem Netz', 'Öffne das Gerät nur im Netzbetrieb', 'Schließe das Gerät an die Hauptleitung an'], r: 0,
            x: '„Mains“ ist im britischen Englisch das Stromnetz, „disconnect“ heißt trennen.' },
          { t: 'choice', q: 'Bevor du ein IT-System beim Kunden in Betrieb nimmst, was klärst du?',
            a: ['Anforderungen, vorhandenes Netz, Zugangsdaten und wer die Daten verantwortet', 'Nur die Farbe des Gehäuses', 'Nichts, das ergibt sich vor Ort', 'Nur den Preis'], r: 0,
            x: 'Ohne diese Angaben gibt es später Streit über Umfang, Sicherheit und Haftung.' }
        ]
      }
    ]
  }
];
