// Berufsschule, 4. Ausbildungsjahr (bis Monat 42), Fachrichtung Energie- und Gebäudetechnik: Lernfelder 12 und 13.
// Danach folgt Teil 2 der Gesellenprüfung: Kundenauftrag, Systementwurf, Funktions- und Systemanalyse, WiSo.
export default [
  {
    id: 'lf12', nr: 12, jahr: 4, stunden: 80,
    title: 'Energie- und gebäudetechnische Anlagen planen und realisieren',
    ziel: 'Projekte planen, Wohngebäude nach DIN 18015 und RAL-RG 678 ausstatten, Leitungen dimensionieren, übergeben.',
    karte: [
      'Projektphasen: Auftrag klären, planen, durchführen, abschließen und übergeben. Meilensteine sind Zwischenziele ohne Dauer.',
      'Der kritische Pfad ist die Kette von Vorgängen ohne Puffer: Jede Verzögerung verschiebt das Projektende.',
      'RAL-RG 678 beschreibt Ausstattungswerte der Elektroinstallation, DIN 18015-2 die Mindestausstattung.',
      'Bedienelemente im barrierefreien Wohnen nach DIN 18040-2 in 85 cm Höhe.',
      'Spannungsfall Drehstrom: ΔU = √3 · l · I · cos φ / (κ · A). Wechselstrom: ΔU = 2 · l · I · cos φ / (κ · A).',
      'Zur Übergabe gehören Prüfprotokoll, Stromkreisliste, Pläne, Anleitungen und die Einweisung des Kunden.'
    ],
    lektionen: [
      {
        title: 'Projekte planen', fach: 'fk',
        items: [
          { t: 'order', q: 'Bring die Phasen eines Projekts in die richtige Reihenfolge.',
            a: ['Auftrag und Ziele klären', 'Planen: Umfang, Termine, Material, Personal', 'Durchführen und überwachen', 'Abschließen, übergeben und auswerten'],
            x: 'Am Ende steht die Auswertung: Was lief gut, was machen wir beim nächsten Projekt anders?' },
          { t: 'choice', q: 'Was ist ein Meilenstein?',
            a: ['Ein wichtiges Zwischenziel ohne eigene Dauer', 'Der längste Vorgang im Projekt', 'Die Rechnung', 'Ein Werkzeug'], r: 0,
            x: 'Beispiel: „Rohinstallation fertig, Putzer kann kommen“.' },
          { t: 'choice', q: 'Was zeigt ein Balkenplan (Gantt-Diagramm)?',
            a: ['Die Vorgänge eines Projekts mit Anfang, Dauer und Ende über der Zeit', 'Den Stromlauf einer Steuerung', 'Die Lohnabrechnung', 'Den Grundriss'], r: 0,
            x: 'Auf der Baustelle ist der Bauzeitenplan mit allen Gewerken meist ein Balkenplan.' },
          { t: 'choice', q: 'Was ist der kritische Pfad?',
            a: ['Die Kette von Vorgängen ohne Puffer', 'Der gefährlichste Arbeitsschritt', 'Der Weg des Fehlerstroms', 'Die längste Leitung'], r: 0,
            x: 'Verzögert sich ein Vorgang auf dem kritischen Pfad, verschiebt sich das ganze Projekt.' },
          { t: 'num', f: 'fr', q: 'Für die Montage sind 120 Stunden geplant. Zwei Monteure arbeiten je 8 Stunden am Tag. Wie viele Arbeitstage dauert es?', r: 7.5, tol: 0, unit: 'Tage',
            x: '120 h / (2 · 8 h) = 7,5 Arbeitstage.' },
          { t: 'choice', q: 'Was ist BIM (Building Information Modeling)?',
            a: ['Ein digitales Gebäudemodell, in dem alle Gewerke ihre Daten pflegen', 'Eine Bohrmaschine', 'Eine Norm für Steckdosen', 'Ein Prüfgerät'], r: 0,
            x: 'Kollisionen zwischen Leitungen, Rohren und Lüftung fallen so schon in der Planung auf.' },
          { t: 'choice', q: 'Der Trockenbauer will morgen die Wände schließen, deine Leitungen sind aber noch nicht geprüft. Was tust du?',
            a: ['Sofort mit Bauleitung und Trockenbauer abstimmen', 'Nichts sagen und später die Wand aufschneiden', 'Die Leitungen weglassen', 'Den Trockenbauer am Arbeiten hindern'], r: 0,
            x: 'Abstimmung zwischen den Gewerken spart allen Zeit und Geld. Dafür gibt es Baubesprechungen.' }
        ]
      },
      {
        title: 'Elektroplanung im Wohngebäude', fach: 'fk',
        items: [
          { t: 'choice', q: 'Was beschreibt die RAL-RG 678?',
            a: ['Ausstattungswerte der Elektroinstallation in Wohnungen', 'Die Farben von Leitungen', 'Die Prüffristen nach DGUV V3', 'Den Zählerschrank'], r: 0,
            x: 'Sie gibt für jeden Raum die Zahl der Steckdosen, Auslässe und Stromkreise je Ausstattungswert an.' },
          { t: 'choice', q: 'Welche Norm legt die Mindestausstattung der Elektroinstallation in Wohngebäuden fest?',
            a: ['DIN 18015-2', 'DIN VDE 0100-410', 'DIN 14676-1', 'DIN EN 12464-1'], r: 0,
            x: 'DIN 18015-1 regelt die Planungsgrundlagen, Teil 3 die Leitungsführung, Teil 4 die Gebäudesystemtechnik.' },
          { t: 'choice', q: 'In welcher Höhe sitzen Schalter und Bedienelemente in einer barrierefreien Wohnung nach DIN 18040-2?',
            a: ['85 cm', '105 cm', '130 cm', '30 cm'], r: 0,
            x: 'So erreichen auch Menschen im Rollstuhl die Bedienelemente. Üblich sind sonst etwa 105 cm.' },
          { t: 'choice', q: 'Wo planst du die Steckdosen über der Küchenarbeitsplatte?',
            a: ['In der mittleren Installationszone bei etwa 100 cm über dem fertigen Fußboden', 'In der oberen Installationszone', 'Direkt über dem Kochfeld', 'Auf der Arbeitsplatte liegend'], r: 0,
            x: 'Die mittlere Zone von 90 bis 120 cm gibt es genau für solche Arbeitsflächen.' },
          { t: 'choice', q: 'Wofür ist der Raum für Zusatzanwendungen (RfZ) im Zählerschrank nach VDE-AR-N 4100 gedacht?',
            a: ['Für Smart-Meter-Gateway und Steuerbox', 'Für die Hausanschlusssicherung', 'Für die Stromkreise der Wohnung', 'Als Ablage für Werkzeug'], r: 0,
            x: 'Der Netzbetreiber oder Messstellenbetreiber nutzt ihn für Kommunikation und Steuerung nach § 14a EnWG.' },
          { t: 'multi', q: 'Was prüfst du, bevor du eine Wallbox und eine Wärmepumpe in einem Bestandshaus einplanst?',
            a: ['Die Leistung des Hausanschlusses', 'Den Platz und Zustand des Zählerschranks', 'Die Hauptleitung', 'Die Farbe der Fassade'], r: [0, 1, 2],
            x: 'Oft reicht der Anschluss nur mit Lastmanagement. Ein veralteter Zählerschrank muss beim Umbau erneuert werden.' },
          { t: 'tf', q: 'Für die Datenverkabelung ist eine sternförmige Verlegung von einem zentralen Verteiler zu jedem Raum sinnvoll.', r: true,
            x: 'So lassen sich Räume später frei nutzen. Leerrohre erleichtern Nachrüstungen.' }
        ]
      },
      {
        title: 'Leitungen dimensionieren', fach: 'fr',
        items: [
          { t: 'num', q: 'Eine Drehstromleitung mit 6 mm² ist 40 m lang und führt 25 A bei cos φ = 1. Wie groß ist der Spannungsfall? κ = 56.', r: 5.15, tol: 0.05, unit: 'V',
            x: 'ΔU = √3 · l · I · cos φ / (κ · A) = 1,732 · 40 · 25 / (56 · 6) ≈ 5,15 V.' },
          { t: 'num', q: 'Wie viel Prozent von 400 V sind 5,15 V?', r: 1.29, tol: 0.02, unit: '%',
            x: '5,15 V / 400 V · 100 % ≈ 1,29 %.' },
          { t: 'num', q: 'Eine Leitung trägt 32 A. Umgebungstemperatur (Faktor 0,87) und Häufung (Faktor 0,8) mindern das. Wie viel bleibt?', r: 22.3, tol: 0.1, unit: 'A',
            x: 'I_z = 32 A · 0,87 · 0,8 ≈ 22,3 A. Die Faktoren werden multipliziert.' },
          { t: 'num', q: 'Eine Wechselstromleitung ist 30 m lang, I = 16 A. Es dürfen höchstens 6,9 V abfallen. Welchen Querschnitt braucht sie rechnerisch? κ = 56.', r: 2.48, tol: 0.03, unit: 'mm²',
            x: 'A = 2 · l · I / (κ · ΔU) = 2 · 30 · 16 / (56 · 6,9) ≈ 2,48 mm².' },
          { t: 'choice', q: 'Welchen Normquerschnitt wählst du für rechnerisch 2,48 mm²?',
            a: ['2,5 mm²', '1,5 mm²', '2 mm²', '4 mm², weil man immer zwei Stufen höher geht'], r: 0,
            x: 'Der nächsthöhere Normquerschnitt reicht, wenn auch Strombelastbarkeit und Abschaltbedingung passen.' },
          { t: 'num', q: 'Eine Unterverteilung wird mit 3 × 32 A über 30 m Leitung mit 10 mm² versorgt, cos φ = 0,9. Wie groß ist der Spannungsfall?', r: 2.67, tol: 0.03, unit: 'V',
            x: 'ΔU = 1,732 · 30 · 32 · 0,9 / (56 · 10) ≈ 2,67 V, also etwa 0,67 %.' },
          { t: 'choice', f: 'fk', q: 'Was begrenzt neben Strombelastbarkeit und Spannungsfall die zulässige Länge einer Leitung?',
            a: ['Die Abschaltbedingung: Die Schleifenimpedanz darf nicht zu groß werden', 'Die Farbe der Isolierung', 'Die Anzahl der Dosen', 'Die Raumhöhe'], r: 0,
            x: 'Lange, dünne Leitungen erhöhen Z_s. Dann löst der LS im Fehlerfall nicht schnell genug aus.' }
        ]
      },
      {
        title: 'Übergabe, Dokumentation und Qualität', fach: 'fk',
        items: [
          { t: 'multi', q: 'Was gehört zur Anlagendokumentation, die der Kunde bekommt?',
            a: ['Prüfprotokoll', 'Stromkreisliste und Verteilerplan', 'Installationspläne und Bedienungsanleitungen', 'Die Lohnabrechnung des Monteurs'], r: [0, 1, 2],
            x: 'Mit dieser Dokumentation kann auch eine andere Fachfirma später sicher arbeiten.' },
          { t: 'choice', q: 'Was erklärst du dem Kunden bei der Übergabe zum FI-Schutzschalter?',
            a: ['Die Prüftaste regelmäßig zu drücken, etwa halbjährlich', 'Ihn nie anzufassen', 'Ihn jährlich auszutauschen', 'Ihn bei Gewitter auszuschalten'], r: 0,
            x: 'Die Prüftaste zeigt, ob die Mechanik noch auslöst. Sie ersetzt keine Messung.' },
          { t: 'choice', q: 'Wohin gehören ausgebaute Leuchtstofflampen?',
            a: ['Zur Rücknahme oder Sammelstelle, sie enthalten Quecksilber', 'In den Glascontainer', 'In den Restmüll', 'In den Bauschutt'], r: 0,
            x: 'Entsorgung wird mit Nachweisen dokumentiert, auf Baustellen oft über den Großhandel.' },
          { t: 'choice', f: 'wiso', q: 'Was bewirkt die Abnahme der fertigen Anlage durch den Kunden?',
            a: ['Die Gewährleistungsfrist beginnt und die Vergütung wird fällig', 'Der Kunde verliert alle Rechte', 'Die Anlage muss neu geprüft werden', 'Nichts, sie ist nur eine Formsache'], r: 0,
            x: 'Mit der Abnahme geht auch die Gefahr auf den Kunden über. Halte sie schriftlich fest.' },
          { t: 'tf', q: 'Checklisten und Prüfprotokolle sind Teil der Qualitätssicherung.', r: true,
            x: 'Sie sorgen dafür, dass nichts vergessen wird, und belegen später, was geprüft wurde.' },
          { t: 'match', f: 'en', q: 'Ordne die englischen Begriffe zu.',
            a: [['handover', 'Übergabe'], ['commissioning', 'Inbetriebnahme'], ['as-built drawings', 'Revisionspläne'], ['acceptance', 'Abnahme']],
            x: 'Auf internationalen Baustellen ist das „handover“ mit Abnahmeprotokoll ein fester Termin.' }
        ]
      }
    ]
  },
  {
    id: 'lf13', nr: 13, jahr: 4, stunden: 60,
    title: 'Energie- und gebäudetechnische Systeme anpassen und dokumentieren',
    ziel: 'Bestandsanlagen ändern, Wiederholungsprüfungen, Fehlerbaum, Kennzeichnung und Prüfungstraining Rechnen.',
    karte: [
      'Bestandsschutz gilt für unveränderte Altanlagen ohne Gefahr. Was du änderst oder erweiterst, muss den aktuellen Normen entsprechen.',
      'Ein FI ersetzt keinen fehlenden Schutzleiter. Klassische Nullung nicht erweitern.',
      'DGUV Vorschrift 3: ortsfeste Anlagen alle 4 Jahre, ortsveränderliche Geräte auf Baustellen alle 3 Monate.',
      'Sicherheitsbeleuchtung: monatliche Funktionsprüfung, jährlich Prüfung der vollen Nennbetriebsdauer.',
      'Kennzeichnung nach DIN EN 81346: = Funktion, + Ort, − Produkt, etwa −Q1.',
      'Im Fehlerbaum steht das unerwünschte Ereignis oben, die Ursachen darunter über UND und ODER verknüpft.'
    ],
    lektionen: [
      {
        title: 'Bestandsanlagen ändern', fach: 'fk',
        items: [
          { t: 'choice', q: 'Was bedeutet Bestandsschutz bei einer alten Elektroanlage?',
            a: ['Sie darf weiter betrieben werden, solange keine Gefahr besteht. Geänderte Teile müssen den aktuellen Normen entsprechen.', 'Sie darf nie verändert werden', 'Sie muss sofort komplett erneuert werden', 'Normen gelten für sie gar nicht'], r: 0,
            x: 'Wer eine Anlage ändert, ist für den geänderten Teil und seine Rückwirkung auf die Anlage verantwortlich.' },
          { t: 'choice', q: 'In einer Altbausteckdose ist der Schutzkontakt mit dem Neutralleiter gebrückt. Was ist das?',
            a: ['Klassische Nullung, sie darf nicht erweitert werden', 'Eine normale TN-S-Installation', 'Ein Fehler, den man ignorieren kann', 'Eine moderne Schutzmaßnahme'], r: 0,
            x: 'Reißt der N, liegt das Gehäuse über den Verbraucher an Spannung. Neue Stromkreise bekommen eine Leitung mit eigenem Schutzleiter.' },
          { t: 'tf', q: 'Ein FI-Schutzschalter ersetzt in einem Altbau ohne Schutzleiter den Schutzleiter.', r: false,
            x: 'Der FI ist zusätzlicher Schutz. Ohne Schutzleiter fehlt der Fehlerschutz für Geräte der Schutzklasse I.' },
          { t: 'choice', q: 'Du erweiterst einen Altbau mit Aluminiumleitungen. Was beachtest du an den Klemmstellen?',
            a: ['Für Aluminium zugelassene Klemmen, Oxidschicht entfernen, Kontaktpaste nutzen', 'Aluminium und Kupfer direkt verdrillen', 'Nichts Besonderes', 'Die Klemme mit Lötzinn füllen'], r: 0,
            x: 'Aluminium fließt unter Druck und oxidiert. Falsche Klemmen werden locker und heiß.' },
          { t: 'tf', q: 'Erweiterst du einen Stromkreis mit Steckdosen, schützt du die neuen Steckdosen mit einem FI mit höchstens 30 mA.', r: true,
            x: 'Für den geänderten Teil gelten die aktuellen Normen. Oft ist es sinnvoll, den ganzen Stromkreis umzurüsten.' },
          { t: 'choice', q: 'Beim Öffnen einer Dose zerbröselt die Isolierung der Adern. Was tust du?',
            a: ['Den Kunden informieren und den Austausch der Leitung anbieten', 'Mit Isolierband umwickeln und schließen', 'Die Adern mit Heißkleber fixieren', 'Nichts, das ist normal'], r: 0,
            x: 'Gealterte Gummi- oder Stoffisolierung ist eine echte Gefahr. Dokumentiere den Hinweis an den Kunden.' }
        ]
      },
      {
        title: 'Wiederholungsprüfungen', fach: 'fk',
        items: [
          { t: 'choice', q: 'In welchem Abstand werden ortsfeste elektrische Anlagen nach DGUV Vorschrift 3 in der Regel geprüft?',
            a: ['Alle 4 Jahre', 'Jeden Monat', 'Alle 10 Jahre', 'Nur einmal bei der Errichtung'], r: 0,
            x: 'In Räumen besonderer Art, etwa feuchten Räumen, und auf Baustellen sind die Fristen kürzer.' },
          { t: 'choice', q: 'Wie oft werden ortsveränderliche Geräte auf Baustellen geprüft?',
            a: ['Alle 3 Monate', 'Alle 4 Jahre', 'Jedes Jahr', 'Nie'], r: 0,
            x: 'Liegt die Fehlerquote unter 2 %, darf die Frist verlängert werden, höchstens auf ein Jahr.' },
          { t: 'order', q: 'Bring eine Wiederholungsprüfung in die richtige Reihenfolge.',
            a: ['Unterlagen und letztes Prüfprotokoll sichten', 'Besichtigen', 'Erproben und Messen', 'Ergebnisse bewerten', 'Prüfbericht übergeben und Mängel benennen'],
            x: 'Wiederholungsprüfungen laufen nach DIN VDE 0105-100. Der Vergleich mit alten Messwerten zeigt schleichende Veränderungen.' },
          { t: 'choice', q: 'Wie oft wird bei einer Sicherheitsbeleuchtung die volle Nennbetriebsdauer geprüft?',
            a: ['Jährlich', 'Täglich', 'Alle 10 Jahre', 'Nur bei der Abnahme'], r: 0,
            x: 'Monatlich wird die Funktion kurz geprüft. Alles wird im Prüfbuch eingetragen.' },
          { t: 'choice', q: 'Was ist der E-CHECK?',
            a: ['Eine freiwillige Prüfung der Anlage durch einen Innungsbetrieb mit Prüfprotokoll und Plakette', 'Eine Pflichtprüfung des Netzbetreibers', 'Ein Gerät zum Spannungsprüfen', 'Die Gesellenprüfung'], r: 0,
            x: 'Für private Anlagen gibt es keine gesetzliche Prüfpflicht. Versicherungen und Vermieter fragen aber oft danach.' },
          { t: 'tf', q: 'Prüfergebnisse und festgestellte Mängel werden schriftlich dokumentiert.', r: true,
            x: 'Der Betreiber muss die Mängel beheben lassen. Das Protokoll ist sein Nachweis.' }
        ]
      },
      {
        title: 'Fehlerbaum, Kennzeichnung und Pläne', fach: 'sp',
        items: [
          { t: 'choice', q: 'Wie ist ein Fehlerbaum aufgebaut?',
            a: ['Oben das unerwünschte Ereignis, darunter die möglichen Ursachen über UND und ODER verknüpft', 'Wie ein Stromlaufplan von links nach rechts', 'Als Liste der Ersatzteile', 'Als Grundriss'], r: 0,
            x: 'Beispiel: „Licht im Flur geht nicht“ – ODER – Leuchtmittel defekt, Stromstoßschalter defekt, LS ausgelöst.' },
          { t: 'choice', q: 'Was bedeutet ein UND-Gatter im Fehlerbaum?',
            a: ['Das Ereignis tritt nur ein, wenn alle Ursachen darunter gleichzeitig vorliegen', 'Eine Ursache reicht aus', 'Die Ursachen schließen sich aus', 'Es gibt keine Ursache'], r: 0,
            x: 'Beispiel: Gefahr durch Berührung entsteht nur bei Isolationsfehler UND fehlendem Schutzleiter.' },
          { t: 'match', q: 'Ordne die Vorzeichen der Kennzeichnung nach DIN EN 81346 zu.',
            a: [['=', 'Funktion oder Anlage'], ['+', 'Ort'], ['−', 'Produkt']],
            x: 'Beispiel: =Lüftung+UV2−Q1 ist das Schütz Q1 der Lüftung in der Unterverteilung 2.' },
          { t: 'choice', q: 'Was zeigt ein Revisionsplan?',
            a: ['Den tatsächlich ausgeführten Zustand der Anlage', 'Die erste Idee des Planers', 'Nur die Kosten', 'Die Prüffristen'], r: 0,
            x: 'Nach Änderungen auf der Baustelle wird der Plan nachgeführt. Sonst sucht der Nächste an der falschen Stelle.' },
          { t: 'choice', q: 'Was steht in einer Stromkreisliste?',
            a: ['Bezeichnung, Schutzeinrichtung, Leitung und versorgte Räume jedes Stromkreises', 'Nur die Zählernummer', 'Die Arbeitszeiten', 'Die Telefonnummer des Kunden'], r: 0,
            x: 'Sie hängt im Verteiler. So findet jeder schnell den richtigen LS.' },
          { t: 'choice', q: 'Was zeigt ein Übersichtsschaltplan?',
            a: ['Die Anlage vereinfacht, meist einpolig', 'Jede einzelne Ader mit Klemmennummer', 'Die Lage der Dosen im Grundriss', 'Den Programmablauf einer SPS'], r: 0,
            x: 'Der Stromlaufplan zeigt alle Leiter und Kontakte, der Installationsplan die Lage im Gebäude.' },
          { t: 'tf', q: 'Änderungen im Verteiler trägst du auch in Stromkreisliste und Plan nach.', r: true,
            x: 'Eine falsche Dokumentation ist gefährlich: Jemand schaltet den falschen Stromkreis frei.' }
        ]
      },
      {
        title: 'Prüfungstraining Rechnen', fach: 'fr',
        items: [
          { t: 'num', q: 'Ein Lüfter (230 V, 0,4 A, cos φ = 0,9) läuft 12 Stunden am Tag, das ganze Jahr. Was kostet das bei 0,30 € je kWh?', r: 108.8, tol: 0.5, unit: '€',
            x: 'P = 230 V · 0,4 A · 0,9 = 82,8 W. W = 82,8 W · 12 h · 365 ≈ 362,7 kWh. Kosten ≈ 108,80 €.' },
          { t: 'num', q: 'Eine Wärmepumpe nimmt an 400 V 6 kW bei cos φ = 0,9 auf. Welcher Strom fließt je Außenleiter?', r: 9.62, tol: 0.05, unit: 'A',
            x: 'I = P / (√3 · U · cos φ) = 6.000 W / (1,732 · 400 V · 0,9) ≈ 9,62 A.' },
          { t: 'num', q: '20 Leuchten mit 58 W werden durch LED-Leuchten mit 25 W ersetzt. Sie brennen 2.500 Stunden im Jahr. Wie viel spart das bei 0,30 € je kWh?', r: 495, tol: 0, unit: '€',
            x: '20 · 33 W = 660 W weniger. 0,66 kW · 2.500 h = 1.650 kWh · 0,30 € = 495 € im Jahr.' },
          { t: 'num', q: 'Der Umbau kostet 2.475 €. Nach wie vielen Jahren hat er sich bei 495 € Ersparnis im Jahr bezahlt gemacht?', r: 5, tol: 0, unit: 'Jahre',
            x: 'Amortisationszeit = 2.475 € / 495 €/Jahr = 5 Jahre.' },
          { t: 'num', q: 'Am Verbraucher misst du 224 V statt 230 V. Wie groß ist der Spannungsfall in Prozent?', r: 2.61, tol: 0.02, unit: '%',
            x: '6 V / 230 V · 100 % ≈ 2,61 %.' },
          { t: 'num', q: 'Im TT-System hat der Anlagenerder 120 Ω. Ein Fehlerstrom von 30 mA fließt. Welche Berührungsspannung entsteht?', r: 3.6, tol: 0, unit: 'V',
            x: 'U_B = R_A · I_Δn = 120 Ω · 0,03 A = 3,6 V. Weit unter 50 V.' },
          { t: 'num', q: 'Gemessen wird eine Schleifenimpedanz von 0,6 Ω. Wie groß ist der Kurzschlussstrom bei 230 V?', r: 383, tol: 1, unit: 'A',
            x: 'I_k = 230 V / 0,6 Ω ≈ 383 A. Ein B16 braucht 80 A, ein C16 160 A: beide lösen rechtzeitig aus.' }
        ]
      }
    ]
  }
];
