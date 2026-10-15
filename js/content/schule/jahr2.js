// Berufsschule, 2. Ausbildungsjahr: Lernfelder 5 bis 8. Die Lernfelder 1 bis 6 sind die Grundlage
// für Teil 1 der Gesellenprüfung (Prüfungsbereich Elektrotechnische Anlagen und Betriebsmittel).
export default [
  {
    id: 'lf5', nr: 5, jahr: 2, stunden: 80,
    title: 'Elektroenergieversorgung und Sicherheit von Anlagen und Geräten konzipieren',
    ziel: 'Wechsel- und Drehstrom, Netzsysteme, Schutz gegen elektrischen Schlag und Prüfen von Geräten.',
    karte: [
      'Bei 50 Hz dauert eine Periode 20 ms. Scheitelwert û = √2 · U, also 325 V bei 230 V.',
      'Stern: U = √3 · U_Str, I = I_Str. Dreieck: U = U_Str, I = √3 · I_Str. P = √3 · U · I · cos φ.',
      'Netzsysteme: TN-S, TN-C, TN-C-S, TT, IT. Erster Buchstabe: Erdung der Quelle. Zweiter: Erdung der Körper.',
      'Abschaltzeiten im TN-System bei 230 V: Endstromkreise bis 32 A 0,4 s, Verteilerstromkreise 5 s.',
      'Abschaltbedingung: Z_s · I_a ≤ U_0. Beim B16 ist I_a = 80 A.',
      'Geräteprüfung DIN VDE 0701-0702: Schutzleiterwiderstand ≤ 0,3 Ω, Isolationswiderstand SK I ≥ 1 MΩ, SK II ≥ 2 MΩ.'
    ],
    lektionen: [
      {
        title: 'Wechsel- und Drehstrom', fach: 'fr',
        items: [
          { t: 'num', q: 'Wie lange dauert eine Periode bei 50 Hz?', r: 20, tol: 0, unit: 'ms',
            x: 'T = 1 / f = 1 / 50 Hz = 0,02 s = 20 ms.' },
          { t: 'num', q: 'Wie groß ist der Scheitelwert einer Wechselspannung von 230 V?', r: 325, tol: 1, unit: 'V',
            x: 'û = √2 · U = 1,414 · 230 V ≈ 325 V. Die 230 V sind der Effektivwert.' },
          { t: 'num', q: 'Zwischen zwei Außenleitern liegen 400 V. Wie groß ist die Strangspannung in Sternschaltung?', r: 231, tol: 1.5, unit: 'V',
            x: 'U_Str = U / √3 = 400 V / 1,732 ≈ 231 V. Im Netz rechnet man mit 230 V.' },
          { t: 'num', q: 'Ein Verbraucher in Dreieckschaltung zieht je Außenleiter 17,3 A. Wie groß ist der Strangstrom?', r: 10, tol: 0.05, unit: 'A',
            x: 'I_Str = I / √3 = 17,3 A / 1,732 ≈ 10 A.' },
          { t: 'num', q: 'Ein Drehstromverbraucher an 400 V nimmt 10 A bei cos φ = 0,85 auf. Wie groß ist die Wirkleistung?', r: 5.89, tol: 0.03, unit: 'kW',
            x: 'P = √3 · U · I · cos φ = 1,732 · 400 V · 10 A · 0,85 ≈ 5.889 W.' },
          { t: 'num', q: 'Ein Gerät an 230 V nimmt 5 A bei cos φ = 0,8 auf. Wie groß ist die Wirkleistung?', r: 920, tol: 1, unit: 'W',
            x: 'S = U · I = 1.150 VA. P = S · cos φ = 1.150 VA · 0,8 = 920 W.' },
          { t: 'num', q: 'Eine Spule hat 0,1 H. Wie groß ist ihr induktiver Blindwiderstand bei 50 Hz?', r: 31.4, tol: 0.1, unit: 'Ω',
            x: 'X_L = 2 · π · f · L = 2 · 3,14 · 50 Hz · 0,1 H ≈ 31,4 Ω.' },
          { t: 'choice', f: 'fk', q: 'Drei gleiche Heizwiderstände werden von Stern auf Dreieck umgeklemmt. Wie ändert sich die Leistung?',
            a: ['Sie wird dreimal so groß', 'Sie bleibt gleich', 'Sie halbiert sich', 'Sie wird √3-mal so groß'], r: 0,
            x: 'Jeder Widerstand bekommt √3-mal so viel Spannung. Die Leistung steigt mit U², also auf das Dreifache.' }
        ]
      },
      {
        title: 'Netzsysteme und Spannungsebenen', fach: 'fk',
        items: [
          { t: 'match', q: 'Ordne die Spannungsebene ihrer typischen Spannung zu.',
            a: [['Höchstspannung', '380 kV'], ['Hochspannung', '110 kV'], ['Mittelspannung', '20 kV'], ['Niederspannung', '400/230 V']],
            x: 'Der Ortsnetztransformator setzt 20 kV auf 400/230 V um.' },
          { t: 'choice', q: 'Was bedeutet das „T“ als erster Buchstabe in TN oder TT?',
            a: ['Der Sternpunkt der Stromquelle ist direkt geerdet', 'Die Anlage ist zweipolig', 'Es gibt einen Transformator', 'Die Körper sind isoliert'], r: 0,
            x: 'I als erster Buchstabe heißt: Die Quelle ist nicht oder nur über eine hohe Impedanz geerdet.' },
          { t: 'choice', q: 'Wie sind im TT-System die Körper der Betriebsmittel geerdet?',
            a: ['Über einen eigenen Anlagenerder', 'Über den PEN-Leiter des Netzbetreibers', 'Gar nicht', 'Über den Neutralleiter'], r: 0,
            x: 'Im TN-System führt der Schutzleiter zum geerdeten Sternpunkt der Quelle.' },
          { t: 'choice', q: 'Wo setzt man ein IT-System ein?',
            a: ['Wo ein erster Fehler nicht abschalten darf, etwa im OP-Saal', 'In jeder Wohnung', 'Nur bei Freileitungen', 'Nur bei Gleichstrom'], r: 0,
            x: 'Beim ersten Körperschluss fließt kaum Strom. Ein Isolationswächter meldet den Fehler.' },
          { t: 'tf', q: 'Nach der Aufteilung des PEN-Leiters in N und PE dürfen N und PE nicht wieder verbunden werden.', r: true,
            x: 'Sonst fließt Betriebsstrom über den Schutzleiter und FI-Schutzschalter lösen aus oder wirken nicht.' },
          { t: 'choice', q: 'Welchen Querschnitt muss ein fest verlegter PEN-Leiter aus Kupfer mindestens haben?',
            a: ['10 mm²', '1,5 mm²', '4 mm²', '50 mm²'], r: 0,
            x: 'Bei Aluminium sind es 16 mm². Kleinere Querschnitte dürfen nicht als PEN dienen.' },
          { t: 'choice', q: 'Beim Einschalten des Wasserkochers werden Leuchten im Haus heller, andere dunkler. Was vermutest du?',
            a: ['Einen unterbrochenen oder hochohmigen Neutralleiter', 'Einen defekten Wasserkocher', 'Einen zu großen LS-Schalter', 'Ein normales Verhalten'], r: 0,
            x: 'Fehlt der N, verschiebt sich der Sternpunkt. An einem Außenleiter steigt die Spannung bis Richtung 400 V. Das zerstört Geräte.' },
          { t: 'choice', f: 'en', q: 'Was heißt „earthing system“ auf Deutsch?',
            a: ['Netzsystem nach Art der Erdverbindung', 'Erdkabel', 'Blitzableiter', 'Erdungsmessgerät'], r: 0,
            x: 'TN, TT und IT heißen in der IEC-Norm „earthing arrangements“ oder „system earthing“.' }
        ]
      },
      {
        title: 'Schutz gegen elektrischen Schlag', fach: 'fk',
        items: [
          { t: 'match', q: 'Ordne die Schutzvorkehrung ihrer Aufgabe zu.',
            a: [['Basisschutz', 'Verhindert das Berühren aktiver Teile im Normalbetrieb'], ['Fehlerschutz', 'Wirkt, wenn die Basisisolierung versagt'], ['Zusätzlicher Schutz', 'FI mit höchstens 30 mA, falls die anderen versagen']],
            x: 'Basisschutz: Isolierung und Abdeckung. Fehlerschutz: meist automatische Abschaltung mit Schutzleiter.' },
          { t: 'choice', q: 'Wie schnell muss im TN-System ein Endstromkreis bis 32 A bei 230 V abschalten?',
            a: ['In 0,4 s', 'In 5 s', 'In 0,04 s', 'In 1 Minute'], r: 0,
            x: 'Verteilerstromkreise und Stromkreise über 32 A dürfen 5 s brauchen.' },
          { t: 'choice', q: 'Was erfasst ein FI-Schutzschalter?',
            a: ['Den Unterschied zwischen hin- und zurückfließendem Strom', 'Die Höhe des Betriebsstroms', 'Die Spannung zwischen L und N', 'Die Temperatur der Leitung'], r: 0,
            x: 'Fließt ein Teil des Stroms über einen Menschen oder den Schutzleiter ab, fehlt er im Rückleiter.' },
          { t: 'tf', q: 'Ein FI-Schutzschalter schützt die Leitung vor Überlast.', r: false,
            x: 'Gegen Überlast und Kurzschluss braucht es den LS. Ein FI/LS-Schalter vereint beides.' },
          { t: 'multi', q: 'Wofür fordert DIN VDE 0100-410 einen FI mit höchstens 30 mA?',
            a: ['Steckdosen bis 32 A, die von Laien benutzt werden', 'Endstromkreise für Leuchten in Wohnungen', 'Endstromkreise im Freien für ortsveränderliche Geräte bis 32 A', 'Die Hauptleitung vor dem Zähler'], r: [0, 1, 2],
            x: 'Vor dem Zähler sitzt kein FI. Die Hauptleitung ist durch die Hausanschlusssicherung geschützt.' },
          { t: 'choice', q: 'Welchen FI-Typ setzt du in Wohnungen mindestens ein?',
            a: ['Typ A', 'Typ AC', 'Typ S mit 300 mA', 'Gar keinen'], r: 0,
            x: 'Typ AC erkennt nur sinusförmige Fehlerströme und ist in Deutschland nicht zulässig. Viele Geräte erzeugen pulsierende Gleichfehlerströme.' },
          { t: 'choice', q: 'Was unterscheidet PELV von SELV?',
            a: ['PELV darf geerdet sein, SELV nicht', 'PELV hat eine höhere Spannung', 'SELV braucht einen Schutzleiter', 'Es gibt keinen Unterschied'], r: 0,
            x: 'Beide nutzen Kleinspannung bis 50 V AC aus einer sicheren Quelle, etwa einem Sicherheitstransformator.' }
        ]
      },
      {
        title: 'Geräte prüfen nach DIN VDE 0701-0702', fach: 'fk',
        items: [
          { t: 'order', q: 'Bring die Prüfung eines Geräts in die richtige Reihenfolge.',
            a: ['Besichtigen', 'Schutzleiterwiderstand messen', 'Isolationswiderstand messen', 'Schutzleiter- oder Berührungsstrom messen', 'Funktion prüfen', 'Ergebnis dokumentieren'],
            x: 'Erst besichtigen, dann den Schutzleiter, dann die Isolation. Erst wenn alles passt, kommt das Gerät unter Spannung.' },
          { t: 'choice', q: 'Wie hoch darf der Schutzleiterwiderstand einer Anschlussleitung bis 5 m Länge sein?',
            a: ['0,3 Ω', '3 Ω', '1 MΩ', '30 Ω'], r: 0,
            x: 'Für je weitere 7,5 m kommen 0,1 Ω dazu, höchstens bis 1 Ω.' },
          { t: 'match', q: 'Ordne den Mindestwert des Isolationswiderstands zu.',
            a: [['Schutzklasse I', '1 MΩ'], ['Schutzklasse II', '2 MΩ'], ['Schutzklasse I mit Heizelementen', '0,3 MΩ']],
            x: 'Gemessen wird mit 500 V Gleichspannung zwischen den aktiven Leitern und dem Schutzleiter oder berührbaren Teilen.' },
          { t: 'choice', q: 'Wie groß darf der Schutzleiterstrom eines Geräts der Schutzklasse I im Allgemeinen sein?',
            a: ['3,5 mA', '30 mA', '0,05 mA', '1 A'], r: 0,
            x: 'Für Geräte mit Heizelementen über 3,5 kW gelten 1 mA je kW, höchstens 10 mA.' },
          { t: 'choice', q: 'Wie groß darf der Berührungsstrom an einem Gerät der Schutzklasse II sein?',
            a: ['0,5 mA', '3,5 mA', '30 mA', '10 mA'], r: 0,
            x: 'Gemessen an berührbaren leitfähigen Teilen ohne Schutzleiteranschluss.' },
          { t: 'tf', q: 'Fällt ein Gerät bei der Prüfung durch, kennzeichnest du es als defekt und nimmst es außer Betrieb.', r: true,
            x: 'Der Betreiber erfährt das schriftlich. Ein defektes Gerät darf nicht weiter benutzt werden.' },
          { t: 'choice', q: 'Wer darf ortsveränderliche Geräte prüfen?',
            a: ['Eine Elektrofachkraft oder eine unterwiesene Person unter deren Leitung und Aufsicht', 'Jeder Mitarbeiter', 'Nur der Gerätehersteller', 'Nur der TÜV'], r: 0,
            x: 'Die Verantwortung für die Prüfung trägt die Elektrofachkraft.' }
        ]
      },
      {
        title: 'Abschaltbedingung rechnen', fach: 'fr',
        items: [
          { t: 'num', q: 'Ein LS B16 löst magnetisch sicher beim 5-fachen Nennstrom aus. Wie groß ist I_a?', r: 80, tol: 0, unit: 'A',
            x: 'I_a = 5 · 16 A = 80 A. Dieser Strom löst den LS sofort aus.' },
          { t: 'num', q: 'Wie groß darf die Schleifenimpedanz für einen B16 bei U_0 = 230 V höchstens sein?', r: 2.875, tol: 0.01, unit: 'Ω',
            x: 'Z_s ≤ U_0 / I_a = 230 V / 80 A = 2,875 Ω. In der Praxis rechnet man mit Sicherheitsabschlag oft 2/3 davon.' },
          { t: 'num', q: 'Wie groß darf die Schleifenimpedanz für einen C16 bei 230 V höchstens sein? I_a = 10 · I_n.', r: 1.44, tol: 0.01, unit: 'Ω',
            x: 'I_a = 160 A. Z_s ≤ 230 V / 160 A ≈ 1,44 Ω.' },
          { t: 'num', q: 'Gemessen wird eine Schleifenimpedanz von 0,8 Ω. Wie groß ist der Kurzschlussstrom bei 230 V?', r: 287.5, tol: 0.5, unit: 'A',
            x: 'I_k = U_0 / Z_s = 230 V / 0,8 Ω = 287,5 A.' },
          { t: 'tf', q: 'Bei einer Schleifenimpedanz von 1,2 Ω schaltet ein B16 rechtzeitig ab.', r: true,
            x: 'I_k = 230 V / 1,2 Ω ≈ 192 A. Das ist mehr als die nötigen 80 A.' },
          { t: 'num', q: 'Im TT-System gilt R_A · I_Δn ≤ 50 V. Wie groß darf R_A mit einem 30-mA-FI höchstens sein?', r: 1667, tol: 2, unit: 'Ω',
            x: 'R_A ≤ 50 V / 0,03 A ≈ 1.667 Ω. Praktisch strebt man viel kleinere Werte an.' },
          { t: 'choice', f: 'fk', q: 'Was gehört zur Fehlerschleife im TN-System?',
            a: ['Trafowicklung, Außenleiter bis zur Fehlerstelle und Schutzleiter zurück', 'Nur der Schutzleiter', 'Nur der Außenleiter', 'Der Erder des Kunden und das Erdreich'], r: 0,
            x: 'Das Messgerät erfasst die ganze Schleife, die Impedanz des Netzes eingeschlossen.' }
        ]
      }
    ]
  },
  {
    id: 'lf6', nr: 6, jahr: 2, stunden: 60,
    title: 'Elektrotechnische Systeme analysieren und prüfen',
    ziel: 'Fehlersuche mit System, Oszilloskop und Stromzange, Erstprüfung nach DIN VDE 0100-600 und Sensoren.',
    karte: [
      'Fehlersuche: Symptome aufnehmen, Unterlagen lesen, eingrenzen, beheben, prüfen, dokumentieren.',
      'Halbierungsmethode: Den Stromkreis in der Mitte trennen und die fehlerhafte Hälfte weiter teilen.',
      'Erstprüfung nach DIN VDE 0100-600: Besichtigen, Erproben, Messen, Dokumentieren.',
      'Isolationswiderstand bis 500 V: Prüfspannung 500 V DC, mindestens 1 MΩ. SELV/PELV: 250 V DC, mindestens 0,5 MΩ.',
      'FI-Prüfung: Auslösung spätestens bei I_Δn, allgemeiner Typ in höchstens 300 ms, Berührungsspannung höchstens 50 V.',
      'PT100 hat 100 Ω bei 0 °C. Normsignal 4–20 mA erkennt Drahtbruch.'
    ],
    lektionen: [
      {
        title: 'Fehlersuche mit System', fach: 'fk',
        items: [
          { t: 'order', q: 'Bring die Schritte einer systematischen Fehlersuche in die richtige Reihenfolge.',
            a: ['Mit dem Kunden die Symptome klären', 'Schaltpläne und Unterlagen auswerten', 'Den Fehler durch Messen eingrenzen', 'Den Fehler beheben', 'Die Funktion prüfen', 'Dokumentieren und den Kunden informieren'],
            x: 'Wer sofort Teile tauscht, ohne einzugrenzen, verschwendet Zeit und Geld des Kunden.' },
          { t: 'choice', q: 'Der FI löst nur aus, wenn es regnet. Wo suchst du zuerst?',
            a: ['An Betriebsmitteln im Freien, etwa Außensteckdosen und Außenleuchten', 'Am Herd', 'Am LS-Schalter des Bads', 'Am Hausanschlusskasten'], r: 0,
            x: 'Feuchtigkeit senkt den Isolationswiderstand. Die Isolationsmessung der Außenstromkreise zeigt den Fehler.' },
          { t: 'choice', q: 'Der LS-Schalter löst sofort aus, sobald jemand das Licht einschaltet. Was liegt wahrscheinlich vor?',
            a: ['Ein Kurzschluss hinter dem Schalter, etwa in der Leuchte', 'Eine Überlast durch zu viele Steckdosen', 'Ein zu kleiner FI', 'Ein Fehler im Zähler'], r: 0,
            x: 'Der magnetische Auslöser spricht ohne Verzögerung an. Bei Überlast würde es länger dauern.' },
          { t: 'choice', q: 'Was ist die Halbierungsmethode?',
            a: ['Den Stromkreis in der Mitte trennen und in der fehlerhaften Hälfte weitersuchen', 'Die Spannung halbieren', 'Nur die Hälfte der Klemmen prüfen', 'Zwei Monteure teilen sich die Arbeit'], r: 0,
            x: 'Mit wenigen Schritten findest du so den Fehler auch in langen Stromkreisen mit vielen Dosen.' },
          { t: 'choice', q: 'Ein Kunde meldet: „Die Steckdose im Flur ist tot.“ Was prüfst du zuerst?',
            a: ['Ob der zugehörige LS oder FI ausgelöst hat', 'Ob die Steckdose die richtige Farbe hat', 'Ob der Zähler läuft', 'Ob das Haus geerdet ist'], r: 0,
            x: 'Erst das Einfache: Schutzeinrichtung, dann Spannung an der Dose, dann Klemmstellen dazwischen.' },
          { t: 'tf', q: 'Bei einer Leuchte mit Bewegungsmelder schaltet das Licht ständig von selbst. Eine mögliche Ursache ist eine Wärmequelle im Erfassungsbereich.', r: true,
            x: 'PIR-Melder reagieren auf Änderungen der Wärmestrahlung, etwa durch Heizungen, Abluft oder sich bewegende Äste in der Sonne.' },
          { t: 'choice', f: 'en', q: 'Was bedeutet „fault“ in einer englischen Fehlermeldung?',
            a: ['Fehler oder Störung', 'Sicherung', 'Erdung', 'Lüfter'], r: 0,
            x: '„Earth fault“ ist ein Erdschluss, „short circuit“ ein Kurzschluss.' }
        ]
      },
      {
        title: 'Oszilloskop, Stromzange und Signale', fach: 'fk',
        items: [
          { t: 'choice', q: 'Was zeigt ein Oszilloskop an?',
            a: ['Den Verlauf einer Spannung über der Zeit', 'Nur den Effektivwert', 'Den Isolationswiderstand', 'Die Temperatur'], r: 0,
            x: 'So erkennst du Kurvenform, Frequenz, Spitzenwerte und Störungen.' },
          { t: 'num', f: 'fr', q: 'Eine Periode ist auf dem Bildschirm 4 Kästchen breit, die Zeitbasis steht auf 5 ms/Kästchen. Welche Frequenz hat das Signal?', r: 50, tol: 0, unit: 'Hz',
            x: 'T = 4 · 5 ms = 20 ms. f = 1 / T = 50 Hz.' },
          { t: 'num', f: 'fr', q: 'Der Scheitelwert reicht 3,25 Kästchen hoch, eingestellt sind 100 V/Kästchen. Wie groß ist der Scheitelwert?', r: 325, tol: 0, unit: 'V',
            x: '3,25 · 100 V = 325 V. Das ist der Scheitelwert der 230-V-Netzspannung.' },
          { t: 'match', q: 'Ordne die Signalart ihrer Beschreibung zu.',
            a: [['Analog', 'Stufenlos veränderlicher Wert'], ['Digital', 'Nur die Zustände 0 und 1'], ['PWM', 'Rechteck mit veränderlicher Einschaltdauer']],
            x: 'PWM nutzen etwa LED-Dimmer und Frequenzumrichter.' },
          { t: 'choice', q: 'Wann brauchst du ein Messgerät mit Echteffektivwert (TRMS)?',
            a: ['Bei nicht sinusförmigen Strömen, etwa hinter LED-Treibern oder Umrichtern', 'Nur bei Gleichspannung', 'Nur bei Widerstandsmessung', 'Nie, alle Geräte messen gleich'], r: 0,
            x: 'Einfache Geräte rechnen mit Sinus und zeigen bei verzerrten Kurven falsche Werte.' },
          { t: 'tf', q: 'Legst du die Stromzange um eine ganze Mantelleitung mit L und N, zeigt sie bei einem fehlerfreien Verbraucher etwa 0 A.', r: true,
            x: 'Hin- und Rückstrom heben sich auf. Für den Betriebsstrom umfasst die Zange nur eine Ader. So kannst du aber Fehlerströme aufspüren.' },
          { t: 'choice', q: 'Warum ist die Stromzange auf der Baustelle praktisch?',
            a: ['Sie misst den Strom, ohne den Stromkreis aufzutrennen', 'Sie misst den Isolationswiderstand', 'Sie ersetzt den Spannungsprüfer', 'Sie misst nur Gleichstrom'], r: 0,
            x: 'Das Magnetfeld um den Leiter wird ausgewertet. Für Gleichstrom brauchst du eine Zange mit Hallsensor.' }
        ]
      },
      {
        title: 'Erstprüfung nach DIN VDE 0100-600', fach: 'fk',
        items: [
          { t: 'order', q: 'Bring die Erstprüfung einer neuen Anlage in eine sinnvolle Reihenfolge.',
            a: ['Besichtigen', 'Durchgängigkeit der Schutzleiter messen', 'Isolationswiderstand messen', 'Schleifenimpedanz und FI prüfen', 'Funktion prüfen und Protokoll erstellen'],
            x: 'Isolation und Schutzleiter werden vor dem Einschalten gemessen. Erst dann kommt Spannung auf die Anlage.' },
          { t: 'choice', q: 'Mit welcher Prüfspannung misst du den Isolationswiderstand eines 230/400-V-Stromkreises?',
            a: ['500 V Gleichspannung', '230 V Wechselspannung', '50 V Gleichspannung', '1.000 V Wechselspannung'], r: 0,
            x: 'Grenzwert ist 1 MΩ. Empfindliche Geräte vorher abklemmen, damit sie nicht beschädigt werden.' },
          { t: 'choice', q: 'Welcher Grenzwert gilt für den Isolationswiderstand bei SELV und PELV?',
            a: ['0,5 MΩ bei 250 V DC', '1 MΩ bei 500 V DC', '2 MΩ bei 1.000 V DC', '0,3 Ω'], r: 0,
            x: 'Kleinspannungsstromkreise werden mit der kleineren Prüfspannung gemessen.' },
          { t: 'choice', q: 'Mit welchem Messstrom wird die Durchgängigkeit der Schutzleiter mindestens geprüft?',
            a: ['200 mA', '1 mA', '30 mA', '16 A'], r: 0,
            x: 'Ein kleiner Messstrom würde schlechte Kontakte nicht zeigen.' },
          { t: 'choice', q: 'Wie schnell muss ein allgemeiner FI beim Bemessungsfehlerstrom I_Δn auslösen?',
            a: ['In höchstens 300 ms', 'In höchstens 5 s', 'In höchstens 3 s', 'In höchstens 1 Minute'], r: 0,
            x: 'Beim fünffachen I_Δn sind es höchstens 40 ms. Selektive FI (Typ S) dürfen verzögert auslösen.' },
          { t: 'tf', q: 'Der Errichter übergibt dem Kunden ein Prüfprotokoll der Erstprüfung.', r: true,
            x: 'Das Protokoll belegt, dass die Anlage den Normen entspricht. Viele Netzbetreiber verlangen es bei der Inbetriebsetzung.' },
          { t: 'choice', q: 'Woran musst du bei einer CEE-Drehstromsteckdose zusätzlich denken?',
            a: ['An die Prüfung des Rechtsdrehfelds', 'An die Messung der Leuchtdichte', 'An eine Prüfung mit 1.000 V Wechselspannung', 'An nichts weiter'], r: 0,
            x: 'Mit falschem Drehfeld laufen angeschlossene Motoren rückwärts.' }
        ]
      },
      {
        title: 'Sensoren für nichtelektrische Größen', fach: 'fk',
        items: [
          { t: 'match', q: 'Ordne den Sensor seinem Verhalten zu.',
            a: [['PT100', '100 Ω bei 0 °C'], ['NTC (Heißleiter)', 'Widerstand sinkt bei Wärme'], ['PTC (Kaltleiter)', 'Widerstand steigt ab der Nenntemperatur stark'], ['LDR', 'Widerstand sinkt bei Licht']],
            x: 'PTC-Fühler sitzen als Motorvollschutz in der Wicklung.' },
          { t: 'num', f: 'fr', q: 'Wie groß ist der Widerstand eines PT100 bei 100 °C? Rechne mit α = 0,00385 1/K.', r: 138.5, tol: 0.5, unit: 'Ω',
            x: 'R = 100 Ω · (1 + 0,00385 · 100) = 138,5 Ω.' },
          { t: 'choice', q: 'Warum nutzt man das Normsignal 4–20 mA statt 0–20 mA?',
            a: ['Weil 0 mA dann einen Drahtbruch anzeigt', 'Weil es weniger Strom braucht', 'Weil es genauer ist', 'Weil es eine Wechselgröße ist'], r: 0,
            x: 'Der kleinste Messwert entspricht 4 mA. Fließt gar nichts, stimmt etwas nicht.' },
          { t: 'num', f: 'fr', q: 'Ein Temperaturfühler liefert 4–20 mA für 0–100 °C. Er gibt 12 mA aus. Welche Temperatur ist das?', r: 50, tol: 0, unit: '°C',
            x: '12 mA − 4 mA = 8 mA von 16 mA Bereich, also die Hälfte: 50 °C.' },
          { t: 'choice', q: 'Worauf reagiert ein passiver Infrarot-Bewegungsmelder (PIR)?',
            a: ['Auf Änderungen der Wärmestrahlung im Erfassungsbereich', 'Auf Geräusche', 'Auf Metall', 'Auf Funkwellen'], r: 0,
            x: 'Deshalb erfasst er Bewegungen quer zum Melder besser als direkt auf ihn zu.' },
          { t: 'tf', q: 'Ein Kaltleiterfühler in der Motorwicklung braucht ein passendes Auslösegerät.', r: true,
            x: 'Das Auslösegerät wertet den Widerstand aus und schaltet über das Schütz ab, wenn die Wicklung zu heiß wird.' },
          { t: 'match', f: 'en', q: 'Ordne die englischen Begriffe zu.',
            a: [['sensor', 'Sensor'], ['actuator', 'Aktor'], ['motion detector', 'Bewegungsmelder'], ['temperature probe', 'Temperaturfühler']],
            x: 'Der Rauchwarnmelder heißt „smoke alarm“, der Rauchmelder einer Anlage „smoke detector“.' }
        ]
      },
      {
        title: 'Englische Unterlagen lesen', fach: 'en',
        items: [
          { t: 'choice', q: 'Was bedeutet „rated current“ auf einem Typenschild?',
            a: ['Bemessungsstrom', 'Kurzschlussstrom', 'Fehlerstrom', 'Anlaufstrom'], r: 0,
            x: '„Rated“ heißt bemessen. Ebenso „rated voltage“ für die Bemessungsspannung.' },
          { t: 'match', q: 'Ordne die Leiterbezeichnungen zu.',
            a: [['live conductor', 'Außenleiter'], ['neutral conductor', 'Neutralleiter'], ['protective earth (PE)', 'Schutzleiter'], ['short circuit', 'Kurzschluss']],
            x: 'Im amerikanischen Englisch heißt Erde „ground“ statt „earth“.' },
          { t: 'match', q: 'Ordne die Werkzeuge zu.',
            a: [['wire stripper', 'Abisolierzange'], ['side cutter', 'Seitenschneider'], ['screwdriver', 'Schraubendreher'], ['voltage tester', 'Spannungsprüfer']],
            x: 'Die Crimpzange heißt „crimping tool“.' },
          { t: 'choice', q: 'Was heißt „The installation must be carried out by a qualified electrician“?',
            a: ['Die Installation muss eine Elektrofachkraft ausführen', 'Die Installation darf jeder ausführen', 'Die Installation ist schon fertig', 'Der Elektriker muss das Gerät tragen'], r: 0,
            x: '„To carry out“ heißt ausführen, „qualified“ heißt fachlich ausgebildet.' },
          { t: 'choice', q: 'Was bedeutet „ambient temperature“ im Datenblatt?',
            a: ['Umgebungstemperatur', 'Betriebstemperatur der Wicklung', 'Lagertemperatur', 'Schmelztemperatur'], r: 0,
            x: 'Sie ist wichtig für die Strombelastbarkeit und die Lebensdauer von Geräten.' },
          { t: 'choice', q: 'Was ist mit „cross-section“ bei einer Leitung gemeint?',
            a: ['Der Querschnitt', 'Die Länge', 'Die Farbe', 'Die Kreuzung zweier Leitungen'], r: 0,
            x: 'Angegeben in mm², in Nordamerika oft in AWG.' },
          { t: 'tf', q: '„Mains voltage“ ist die Netzspannung.', r: true,
            x: '„Mains“ ist im britischen Englisch das öffentliche Stromnetz.' },
          { t: 'choice', q: 'Was bedeutet „Do not operate the device with wet hands“?',
            a: ['Bediene das Gerät nicht mit nassen Händen', 'Reinige das Gerät mit nassen Händen', 'Das Gerät ist wasserdicht', 'Trockne das Gerät mit den Händen'], r: 0,
            x: '„To operate“ heißt bedienen oder betreiben.' }
        ]
      }
    ]
  },
  {
    id: 'lf7', nr: 7, jahr: 2, stunden: 80,
    title: 'Steuerungen und Regelungen für Systeme programmieren und realisieren',
    ziel: 'SPS-Grundlagen, Speicher, Zeiten und Zähler, Bussysteme wie KNX und DALI sowie Regler.',
    karte: [
      'SPS-Zyklus: Eingänge lesen, Programm abarbeiten, Ausgänge schreiben.',
      'Aus-Taster und NOT-HALT als Öffner anschließen: Ein Drahtbruch wirkt wie Aus.',
      'TON: Einschaltverzögerung. TOF: Ausschaltverzögerung. TP: Impuls.',
      'KNX TP: 30 V DC, bis 64 Teilnehmer je Linie, physikalische Adresse Bereich.Linie.Teilnehmer, Gruppenadresse etwa 1/2/3.',
      'KNX-Leitung: rot plus, schwarz minus, gelb und weiß als Reserve. Programmiert wird mit der ETS.',
      'P-Regler: schnell, aber bleibende Regelabweichung. I-Anteil beseitigt sie.'
    ],
    lektionen: [
      {
        title: 'SPS-Grundlagen', fach: 'fk',
        items: [
          { t: 'order', q: 'Bring den Zyklus einer SPS in die richtige Reihenfolge.',
            a: ['Eingänge ins Prozessabbild lesen', 'Programm abarbeiten', 'Ausgänge aus dem Prozessabbild schreiben'],
            x: 'Dieser Zyklus wiederholt sich ständig, meist in wenigen Millisekunden.' },
          { t: 'match', q: 'Ordne die Programmiersprache ihrer Darstellung zu.',
            a: [['KOP', 'Kontaktplan, ähnlich einem Stromlaufplan'], ['FUP', 'Funktionsplan mit Logikbausteinen'], ['ST', 'Strukturierter Text, ähnlich einer Hochsprache'], ['AS', 'Ablaufsprache mit Schritten und Übergängen']],
            x: 'Die Sprachen sind in IEC 61131-3 festgelegt.' },
          { t: 'choice', q: 'Wie schließt du einen Aus-Taster an einen SPS-Eingang an?',
            a: ['Als Öffner, damit ein Drahtbruch wie Aus wirkt', 'Als Schließer, das spart Strom', 'Gar nicht, Aus wird nur im Programm gemacht', 'Parallel zum Ein-Taster'], r: 0,
            x: 'Im Programm wird der Eingang auf 1 abgefragt. Fällt er auf 0, schaltet die Anlage ab.' },
          { t: 'tf', q: 'Ein NOT-HALT darf allein über das normale SPS-Programm abschalten.', r: false,
            x: 'NOT-HALT ist eine Sicherheitsfunktion. Er wirkt über ein Sicherheitsschaltgerät oder eine Sicherheitssteuerung.' },
          { t: 'match', q: 'Ordne die Operanden nach IEC 61131 zu.',
            a: [['%I0.0', 'Eingang'], ['%Q0.0', 'Ausgang'], ['%M0.0', 'Merker']],
            x: 'Ein Merker ist ein internes Speicherbit ohne Anschlussklemme.' },
          { t: 'choice', q: 'Mit welcher Spannung arbeiten digitale SPS-Eingänge meistens?',
            a: ['24 V DC', '230 V AC', '400 V AC', '5 V AC'], r: 0,
            x: 'Es gibt auch 230-V-Varianten, etwa bei Kleinsteuerungen. Standard in Schaltschränken sind 24 V DC.' },
          { t: 'choice', f: 'en', q: 'Was ist eine „PLC“?',
            a: ['Eine speicherprogrammierbare Steuerung', 'Ein Leistungsschalter', 'Ein Netzwerkkabel', 'Ein Prüfprotokoll'], r: 0,
            x: 'PLC steht für „programmable logic controller“.' }
        ]
      },
      {
        title: 'Speicher, Zeiten und Zähler', fach: 'sp',
        items: [
          { t: 'choice', q: 'Ein- und Aus-Befehl kommen gleichzeitig. Wie soll sich der Speicher für einen Motor verhalten?',
            a: ['Rücksetzdominant: Der Motor bleibt aus', 'Setzdominant: Der Motor läuft an', 'Er soll zufällig reagieren', 'Er soll blinken'], r: 0,
            x: 'Aus hat bei Maschinen immer Vorrang. Das ist sicher.' },
          { t: 'match', q: 'Ordne die Zeitfunktionen zu.',
            a: [['TON', 'Einschaltverzögerung'], ['TOF', 'Ausschaltverzögerung'], ['TP', 'Impuls fester Länge']],
            x: 'TON nutzt man etwa für Stern-Dreieck, TOF für Nachlauf von Lüftern.' },
          { t: 'choice', q: 'Was macht eine Auswertung der steigenden Flanke?',
            a: ['Sie meldet nur den Moment, in dem das Signal von 0 auf 1 wechselt', 'Sie meldet, solange das Signal 1 ist', 'Sie meldet den Wechsel von 1 auf 0', 'Sie verdoppelt das Signal'], r: 0,
            x: 'So zählt ein gedrückt gehaltener Taster nur einmal.' },
          { t: 'tf', q: 'Ein Taster bleibt gedrückt. Mit Flankenauswertung entsteht dabei nur ein Zählimpuls.', r: true,
            x: 'Ohne Flanke würde der Zähler in jedem SPS-Zyklus weiterzählen.' },
          { t: 'num', q: 'Ein Vorwärtszähler hat den Vorgabewert 5. Nach wie vielen steigenden Flanken wird sein Ausgang 1?', r: 5, tol: 0, unit: 'Flanken',
            x: 'Der Ausgang schaltet, sobald der Zählwert den Vorgabewert erreicht.' },
          { t: 'num', f: 'fr', q: 'Ein Blinktakt ist 0,5 s an und 0,5 s aus. Welche Frequenz hat er?', r: 1, tol: 0, unit: 'Hz',
            x: 'T = 1 s, f = 1 / T = 1 Hz.' },
          { t: 'choice', q: 'Was gilt in einer Schrittkette?',
            a: ['Es ist immer nur ein Schritt aktiv, weiter geht es, wenn die Übergangsbedingung erfüllt ist', 'Alle Schritte laufen gleichzeitig', 'Die Schritte laufen zufällig', 'Es gibt keine Bedingungen'], r: 0,
            x: 'Ablaufsteuerungen wie Rolltor oder Waschanlage sind so übersichtlich und leicht zu ändern.' }
        ]
      },
      {
        title: 'Bussysteme im Gebäude', fach: 'fk',
        items: [
          { t: 'choice', q: 'Mit welcher Spannung arbeitet der KNX-Bus über Zweidrahtleitung?',
            a: ['Etwa 30 V DC', '230 V AC', '12 V AC', '400 V AC'], r: 0,
            x: 'Die Busspannung ist eine Schutzkleinspannung. Eine eigene Spannungsversorgung mit Drossel speist jede Linie.' },
          { t: 'choice', q: 'Wie viele Teilnehmer passen ohne Linienverstärker auf eine KNX-Linie?',
            a: ['64', '8', '1.024', 'Beliebig viele'], r: 0,
            x: 'Mit Linienverstärkern geht es weiter, über Linien- und Bereichskoppler wächst die Anlage.' },
          { t: 'choice', q: 'Was bedeutet die physikalische Adresse 1.1.5?',
            a: ['Bereich 1, Linie 1, Teilnehmer 5', 'Gruppe 1, Untergruppe 1, Funktion 5', 'Etage 1, Raum 1, Steckdose 5', 'Version 1.1.5 der Firmware'], r: 0,
            x: 'Funktionen werden dagegen über Gruppenadressen wie 1/2/3 verknüpft.' },
          { t: 'choice', q: 'Wozu dient eine KNX-Gruppenadresse?',
            a: ['Sie verbindet Sensoren und Aktoren einer Funktion, etwa „Licht Küche“', 'Sie benennt das Gerät im Netz', 'Sie gibt den Montageort an', 'Sie ist das Passwort'], r: 0,
            x: 'Ein Taster sendet an die Gruppenadresse, alle zugeordneten Aktoren reagieren.' },
          { t: 'match', q: 'Ordne die Adern der KNX-Busleitung zu.',
            a: [['rot', 'Bus plus'], ['schwarz', 'Bus minus'], ['gelb und weiß', 'Reserve']],
            x: 'Üblich ist J-Y(St)Y 2×2×0,8 oder eine zertifizierte KNX-Leitung.' },
          { t: 'choice', q: 'Mit welcher Software programmierst du KNX-Geräte herstellerübergreifend?',
            a: ['ETS', 'Excel', 'TIA Portal', 'AutoCAD'], r: 0,
            x: 'Die ETS kommt von der KNX Association. Die Produktdaten liefern die Hersteller.' },
          { t: 'choice', q: 'Wie viele Betriebsgeräte lassen sich an einer DALI-Linie einzeln adressieren?',
            a: ['64', '16', '512', '2'], r: 0,
            x: 'Dazu kommen 16 Gruppen und 16 Szenen. DALI ist für Beleuchtung gemacht.' },
          { t: 'tf', q: 'Liegen KNX-Leitung und 230-V-Leitung in einer gemeinsamen Dose, müssen ihre Adern sicher getrennt sein, etwa durch einen Trennsteg.', r: true,
            x: 'Die Kleinspannung muss sicher von der Netzspannung getrennt bleiben, sonst ist der Schutz durch SELV weg.' }
        ]
      },
      {
        title: 'Regler und Regelkreise', fach: 'fk',
        items: [
          { t: 'match', q: 'Ordne den Reglertyp seinem Verhalten zu.',
            a: [['Zweipunktregler', 'Kennt nur Ein und Aus'], ['P-Regler', 'Schnell, aber mit bleibender Regelabweichung'], ['I-Regler', 'Beseitigt die Regelabweichung, reagiert langsam'], ['PI-Regler', 'Schnell und ohne bleibende Abweichung']],
            x: 'Raumthermostate sind oft Zweipunktregler, Heizkreise und Lüftungen oft PI-Regler.' },
          { t: 'num', f: 'fr', q: 'Ein P-Regler hat die Verstärkung 5 % je Kelvin. Die Regeldifferenz beträgt 4 K. Welche Stellgröße gibt er aus?', r: 20, tol: 0, unit: '%',
            x: 'y = K_P · e = 5 %/K · 4 K = 20 % Ventilöffnung.' },
          { t: 'tf', q: 'Ein reiner P-Regler behält nach einer Störung eine bleibende Regelabweichung.', r: true,
            x: 'Er braucht eine Abweichung, um überhaupt eine Stellgröße auszugeben.' },
          { t: 'choice', q: 'Was gibt die Heizkurve einer witterungsgeführten Heizungsregelung vor?',
            a: ['Die Vorlauftemperatur abhängig von der Außentemperatur', 'Die Uhrzeit der Nachtabsenkung', 'Den Gaspreis', 'Die Pumpenfarbe'], r: 0,
            x: 'Je kälter es draußen ist, desto wärmer wird das Heizwasser.' },
          { t: 'choice', q: 'Was passiert, wenn du die Verstärkung eines Reglers zu groß einstellst?',
            a: ['Der Regelkreis kann schwingen', 'Der Regler wird langsamer', 'Die Regelabweichung wird größer', 'Es passiert nichts'], r: 0,
            x: 'Die Stellgröße schießt über das Ziel hinaus, die Regelgröße pendelt.' },
          { t: 'choice', f: 'en', q: 'Was bedeutet „setpoint“ in der Bedienungsanleitung eines Reglers?',
            a: ['Sollwert', 'Istwert', 'Störgröße', 'Schaltpunkt des LS'], r: 0,
            x: 'Der Istwert heißt „actual value“ oder „process value“.' }
        ]
      }
    ]
  },
  {
    id: 'lf8', nr: 8, jahr: 2, stunden: 60,
    title: 'Energiewandlungssysteme auswählen und integrieren',
    ziel: 'Drehstrommotor, Anschluss und Anlauf, Motorschutz, Frequenzumrichter, EMV und Transformator.',
    karte: [
      'Synchrondrehzahl: n_s = f · 60 / p mit p = Polpaarzahl. 4-poliger Motor an 50 Hz: 1.500/min.',
      'Schlupf: s = (n_s − n) / n_s. Nennleistung auf dem Typenschild ist die mechanische Leistung an der Welle.',
      'Motor 230/400 V am 400-V-Netz: Stern. Motor 400/690 V am 400-V-Netz: Dreieck, Stern-Dreieck-Anlauf möglich.',
      'Drehrichtung umkehren: zwei Außenleiter tauschen.',
      'Frequenzumrichter: Gleichrichter, Zwischenkreis, Wechselrichter. Drehstrom-FU braucht einen FI Typ B.',
      'Transformator: U1 / U2 = N1 / N2 = I2 / I1.'
    ],
    lektionen: [
      {
        title: 'Drehstrom-Asynchronmotor', fach: 'fr',
        items: [
          { t: 'num', q: 'Welche Synchrondrehzahl hat ein 4-poliger Motor an 50 Hz?', r: 1500, tol: 0, unit: '1/min',
            x: '4 Pole sind 2 Polpaare. n_s = 50 Hz · 60 / 2 = 1.500/min.' },
          { t: 'num', q: 'Ein Motor mit n_s = 1.500/min dreht mit 1.440/min. Wie groß ist der Schlupf?', r: 4, tol: 0.01, unit: '%',
            x: 's = (1.500 − 1.440) / 1.500 = 0,04 = 4 %.' },
          { t: 'num', q: 'Auf dem Typenschild stehen 2.880/min bei 50 Hz. Wie viele Pole hat der Motor?', r: 2, tol: 0, unit: 'Pole',
            x: 'Die nächsthöhere Synchrondrehzahl ist 3.000/min. Das ist ein Polpaar, also 2 Pole.' },
          { t: 'num', q: 'Ein Motor nimmt an 400 V 7,5 A bei cos φ = 0,82 auf. Wie groß ist die aufgenommene Leistung?', r: 4.26, tol: 0.03, unit: 'kW',
            x: 'P_zu = √3 · 400 V · 7,5 A · 0,82 ≈ 4.261 W.' },
          { t: 'num', q: 'Derselbe Motor gibt 3,7 kW ab und nimmt 4,26 kW auf. Wie groß ist sein Wirkungsgrad?', r: 86.9, tol: 0.5, unit: '%',
            x: 'η = 3,7 / 4,26 ≈ 0,869, also rund 87 %.' },
          { t: 'num', q: 'Ein Motor gibt 4 kW bei 1.440/min ab. Wie groß ist sein Drehmoment?', r: 26.5, tol: 0.2, unit: 'Nm',
            x: 'M = 9.550 · P / n = 9.550 · 4 / 1.440 ≈ 26,5 Nm. P in kW, n in 1/min.' },
          { t: 'choice', f: 'fk', q: 'Was gibt die Nennleistung auf dem Motortypenschild an?',
            a: ['Die mechanische Leistung an der Welle', 'Die aufgenommene elektrische Leistung', 'Die Blindleistung', 'Die Leistung beim Anlauf'], r: 0,
            x: 'Die aufgenommene Leistung ist um die Verluste größer.' },
          { t: 'choice', f: 'fk', q: 'Wodurch entsteht im Ständer eines Drehstrommotors das Drehfeld?',
            a: ['Durch drei um 120° versetzte Wicklungen an den drei Außenleitern', 'Durch einen Permanentmagneten', 'Durch einen Kondensator', 'Durch den Schlupf'], r: 0,
            x: 'Der Läufer folgt dem Drehfeld etwas langsamer. Daher der Name Asynchronmotor.' }
        ]
      },
      {
        title: 'Anschluss und Anlauf', fach: 'sp',
        items: [
          { t: 'choice', q: 'Ein Motor hat 230/400 V auf dem Typenschild. Wie schließt du ihn am 400-V-Netz an?',
            a: ['In Stern', 'In Dreieck', 'In Stern-Dreieck-Anlauf', 'Gar nicht'], r: 0,
            x: 'Jede Wicklung verträgt 230 V. In Stern bekommt sie genau 400 V / √3 = 230 V.' },
          { t: 'choice', q: 'Ein Motor hat 400/690 V auf dem Typenschild. Wie betreibst du ihn am 400-V-Netz?',
            a: ['In Dreieck, Stern-Dreieck-Anlauf ist möglich', 'Nur in Stern', 'Nur an 690 V', 'Mit einem Kondensator'], r: 0,
            x: 'Jede Wicklung verträgt 400 V. Im Anlauf in Stern bekommt sie nur 230 V.' },
          { t: 'choice', q: 'Welche Brücken setzt du am Klemmbrett für Dreieckschaltung?',
            a: ['U1–W2, V1–U2, W1–V2', 'U2–V2–W2 miteinander', 'U1–V1–W1 miteinander', 'Keine'], r: 0,
            x: 'Drei senkrechte Brücken. Für Stern verbindest du die untere Reihe W2, U2 und V2.' },
          { t: 'choice', q: 'Wie kehrst du die Drehrichtung eines Drehstrommotors um?',
            a: ['Zwei Außenleiter tauschen', 'Alle drei Außenleiter tauschen', 'N und PE tauschen', 'Den Motor in Stern statt Dreieck schalten'], r: 0,
            x: 'Werden alle drei zyklisch vertauscht, bleibt das Drehfeld gleich.' },
          { t: 'choice', q: 'Wozu dient der Stern-Dreieck-Anlauf?',
            a: ['Er senkt Anlaufstrom und Anlaufmoment auf ein Drittel', 'Er erhöht die Drehzahl', 'Er spart den Motorschutz', 'Er kehrt die Drehrichtung um'], r: 0,
            x: 'So bleibt der Spannungseinbruch im Netz klein. Der Motor darf dabei nur leicht belastet anlaufen.' },
          { t: 'tf', q: 'Einen Motor mit 230/400 V kannst du am 400-V-Netz im Stern-Dreieck-Anlauf betreiben.', r: false,
            x: 'Im Dreieck bekäme jede Wicklung 400 V statt 230 V. Der Motor würde überlastet.' },
          { t: 'choice', q: 'Was macht ein Sanftanlasser (Softstarter)?',
            a: ['Er fährt die Spannung beim Anlauf langsam hoch', 'Er ändert die Frequenz dauerhaft', 'Er kehrt die Drehrichtung um', 'Er ersetzt den Motorschutz'], r: 0,
            x: 'Anders als ein Frequenzumrichter regelt er im Betrieb nicht die Drehzahl.' }
        ]
      },
      {
        title: 'Motorschutz und Auswahl', fach: 'fk',
        items: [
          { t: 'choice', q: 'Auf welchen Wert stellst du das Motorschutzrelais ein?',
            a: ['Auf den Nennstrom des Motors vom Typenschild', 'Auf den doppelten Nennstrom', 'Auf den Anlaufstrom', 'Auf den Nennstrom des LS'], r: 0,
            x: 'Passend zur Schaltung: Bei Stern-Dreieck sitzt das Relais im Strang und wird auf I_N / √3 eingestellt.' },
          { t: 'match', q: 'Ordne die Betriebsart zu.',
            a: [['S1', 'Dauerbetrieb'], ['S2', 'Kurzzeitbetrieb'], ['S3', 'Aussetzbetrieb']],
            x: 'Ein Rolltormotor läuft im Kurzzeitbetrieb, ein Lüfter im Dauerbetrieb.' },
          { t: 'choice', q: 'Was gibt „IE3“ auf einem Motortypenschild an?',
            a: ['Die Energieeffizienzklasse', 'Die Schutzart', 'Die Bauform', 'Die Isolierstoffklasse'], r: 0,
            x: 'IE3 heißt „Premium Efficiency“. Höhere Zahlen sind effizienter.' },
          { t: 'choice', q: 'Was beschreibt die Bauform IM B3?',
            a: ['Fußmotor mit waagerechter Welle', 'Flanschmotor mit senkrechter Welle', 'Motor für Unterwasser', 'Motor ohne Lager'], r: 0,
            x: 'B5 ist ein Flanschmotor, V1 ein senkrechter Flanschmotor mit Welle nach unten.' },
          { t: 'choice', q: 'Welchen Vorteil hat ein Motorvollschutz mit Kaltleitern gegenüber einem Motorschutzrelais?',
            a: ['Er erkennt auch Überhitzung bei ausgefallener Kühlung', 'Er ist billiger', 'Er braucht keine Leitung', 'Er schützt vor Kurzschluss'], r: 0,
            x: 'Das Bimetallrelais misst nur den Strom, der Kaltleiter die echte Wicklungstemperatur.' },
          { t: 'choice', q: 'Ein Motor steht im Freien und wird mit dem Schlauch gereinigt. Welche Schutzart passt mindestens?',
            a: ['IP55', 'IP20', 'IP40', 'IP00'], r: 0,
            x: 'Die zweite Ziffer 5 bedeutet Schutz gegen Strahlwasser.' },
          { t: 'match', f: 'en', q: 'Ordne die englischen Begriffe vom Typenschild zu.',
            a: [['rated power', 'Nennleistung'], ['rated speed', 'Nenndrehzahl'], ['duty type', 'Betriebsart'], ['efficiency', 'Wirkungsgrad']],
            x: 'Auf vielen Typenschildern stehen Deutsch und Englisch nebeneinander.' }
        ]
      },
      {
        title: 'Frequenzumrichter, Stromrichter und EMV', fach: 'fk',
        items: [
          { t: 'order', q: 'Bring die Baugruppen eines Frequenzumrichters in die Reihenfolge des Energieflusses.',
            a: ['Gleichrichter', 'Gleichspannungszwischenkreis', 'Wechselrichter', 'Motor'],
            x: 'Der Wechselrichter erzeugt per Pulsweitenmodulation eine Spannung mit einstellbarer Frequenz.' },
          { t: 'choice', q: 'Wie verändert ein Frequenzumrichter die Drehzahl eines Asynchronmotors?',
            a: ['Er ändert Frequenz und Spannung gemeinsam', 'Er ändert nur den Strom', 'Er schaltet Pole um', 'Er ändert die Drehrichtung'], r: 0,
            x: 'Bei U/f-Steuerung bleibt das Verhältnis von Spannung zu Frequenz gleich, damit der Motor sein Moment behält.' },
          { t: 'num', f: 'fr', q: 'Ein 4-poliger Motor wird mit 25 Hz betrieben. Wie groß ist die Synchrondrehzahl?', r: 750, tol: 0, unit: '1/min',
            x: 'n_s = 25 Hz · 60 / 2 = 750/min.' },
          { t: 'choice', q: 'Welchen FI-Typ brauchst du vor einem Frequenzumrichter mit Drehstromanschluss?',
            a: ['Typ B', 'Typ AC', 'Typ A', 'Keinen'], r: 0,
            x: 'Der Drehstrom-FU kann glatte Gleichfehlerströme erzeugen. Typ A würde dadurch blind.' },
          { t: 'choice', q: 'Wie verlegst du die Motorleitung hinter einem Frequenzumrichter EMV-gerecht?',
            a: ['Geschirmt, den Schirm beidseitig großflächig aufgelegt', 'Ungeschirmt und möglichst lang', 'Zusammen mit Datenleitungen gebündelt', 'Den Schirm nur verdrillt angeklemmt'], r: 0,
            x: 'Ein „Pigtail“ wirkt bei hohen Frequenzen wie eine Spule. Die Schirmklemme muss rundum aufliegen.' },
          { t: 'tf', q: 'Gleich nach dem Abschalten eines Frequenzumrichters darfst du an seinen Klemmen arbeiten.', r: false,
            x: 'Die Kondensatoren im Zwischenkreis halten noch gefährliche Spannung. Die Wartezeit steht auf dem Gerät, oft 5 Minuten oder mehr.' },
          { t: 'choice', q: 'Wie viele Dioden hat ein Brückengleichrichter für Wechselstrom (B2)?',
            a: ['4', '2', '6', '1'], r: 0,
            x: 'Die Drehstrombrücke B6 hat sechs Dioden.' },
          { t: 'choice', f: 'en', q: 'Was ist ein „variable frequency drive (VFD)“?',
            a: ['Ein Frequenzumrichter', 'Ein Motorschutzschalter', 'Ein Drehzahlmesser', 'Ein Transformator'], r: 0,
            x: 'Auch „inverter“ oder „frequency converter“ ist üblich.' }
        ]
      },
      {
        title: 'Transformator', fach: 'fr',
        items: [
          { t: 'num', q: 'Ein Transformator setzt 230 V auf 12 V herab. Wie groß ist das Übersetzungsverhältnis?', r: 19.17, tol: 0.05, unit: '',
            x: 'ü = U1 / U2 = 230 V / 12 V ≈ 19,17.' },
          { t: 'num', q: 'Die Primärwicklung hat 920 Windungen. Wie viele Windungen braucht die Sekundärseite für 12 V bei 230 V Eingang?', r: 48, tol: 0, unit: 'Windungen',
            x: 'N2 = N1 · U2 / U1 = 920 · 12 / 230 = 48.' },
          { t: 'num', q: 'Auf der 12-V-Seite hängen 60 W. Welcher Strom fließt dort?', r: 5, tol: 0, unit: 'A',
            x: 'I2 = P / U2 = 60 W / 12 V = 5 A.' },
          { t: 'num', q: 'Wie groß ist der Primärstrom bei 60 W an 230 V, wenn der Trafo verlustfrei ist?', r: 0.26, tol: 0.01, unit: 'A',
            x: 'I1 = 60 W / 230 V ≈ 0,26 A. Die Ströme verhalten sich umgekehrt wie die Spannungen.' },
          { t: 'num', q: 'Ein Ortsnetztrafo hat 630 kVA und 400 V Sekundärspannung. Wie groß ist sein Nennstrom?', r: 909, tol: 3, unit: 'A',
            x: 'I = S / (√3 · U) = 630.000 VA / (1,732 · 400 V) ≈ 909 A.' },
          { t: 'tf', f: 'fk', q: 'Ein Transformator kann auch Gleichspannung übertragen.', r: false,
            x: 'Er braucht ein sich änderndes Magnetfeld. An Gleichspannung fließt nur ein hoher Strom durch den Wicklungswiderstand.' },
          { t: 'choice', f: 'fk', q: 'Was zeichnet einen Sicherheitstransformator aus?',
            a: ['Primär- und Sekundärwicklung sind sicher getrennt, die Ausgangsspannung ist Kleinspannung', 'Er hat nur eine Wicklung', 'Er hat einen eingebauten FI', 'Er arbeitet ohne Eisenkern'], r: 0,
            x: 'Er speist SELV- und PELV-Stromkreise. Ein Spartransformator ist dafür nicht zulässig.' }
        ]
      }
    ]
  }
];
