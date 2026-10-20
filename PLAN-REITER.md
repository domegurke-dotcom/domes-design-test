Auftrag für die Coding-Sitzung: Reiter-Erfahrung (Reiter-
Können)
Stand: 20.10.2026, im Projekt-Chat mit Dome geplant (Runden 1–2), Code-Stand beim Planen v577.
Etappen K1 → K2 → K3 → K4.

Kurz: Bisher steigt nur die Reiter-LK durch Turniererfolge, Training gibt pauschal +4 % je LK-Stufe,
und der Reiter verändert ein Turnierergebnis nur um −5 % … +4 %. Neu: ein Reiter-Können (0–
100) je Disziplin, das durch Training, Turniere und Reitunterricht wächst und Training und
Turnier wirklich bestimmt: Ein Reiter, der weiter ist als das Pferd, trainiert es besser; ein Pferd,
das weiter ist als der Reiter, bremst. Ein schwacher Reiter holt auch aus einem guten Pferd wenig
heraus.

Wann umsetzen: Reihenfolge frei (Themen 1–5 sind gebaut). Die Merkmale-Karte (PLAN-
MERKMALE.md) und dieses Thema ändern beide dieselben Formeln (marktwert, Turnier-Wert in
turnierNacht, Disziplin-Wert): wer später kommt, übernimmt die Faktoren des anderen in die Formel,
nichts überschreiben.

Zuerst speichern
   1. Diese Datei im Repo als PLAN-REITER.md, Anhang A als PLAN-REITER-TEXTE.md.
   2. In PROJEKT-CHAT-THEMEN.md Punkt 7 („Reiter-Erfahrung“): „geplant → PLAN-REITER.md“. Zwei
      neue Punkte anlegen:
            „Ponys: Reiter, Gewicht, Fahren“ (Dome, 20.10.2026, später planen): Erwachsene
            können Ponys und Shettys in echt nicht reiten (Gewichtsgrenze etwa 20 % des
            Pferdegewichts, Pony-Turniere sind für Kinder). Mögliche Wege: Kinder oder Jugendliche
            als Reiter, Fahren (Kutsche), beides. Bis dahin starten Ponys wie alle Pferde, daran ändert
           dieses Thema nichts.
           Zu „Aufzucht- und Ausbildungsstall außer Haus“ ergänzen (Dome, 20.10.2026): je
           Disziplin mehrere Ausbildungsställe zur Auswahl (günstig, moderat, teuer),
           das Pferd lernt je nach Stall mehr oder weniger; ein Westernpferd gehört in einen Western-
           Ausbildungsstall. Dieses Thema nimmt bis dahin Platzhalter-Können 65 / 80 / 92 (siehe
           15).
  3. In CLAUDE.md eine feste Regel: Wird eine Disziplin neu angelegt oder umgebaut (DISZ),
     muss die Reiter-Tabelle REITER_DISZ mit angepasst werden (Gruppe, Prüfanforderung je
     Klasse, Übungen, LK ja/nein).
  4. Etappe für Etappe umsetzen, abhaken, nach jeder Etappe auf main hochladen. Die Regel aus
     Thema 5 gilt: jede neue Funktion bekommt gleich Tipp- und Stufen-Eintrag.

Ist-Stand (v577)
  1. lkVon(g), spiel.lk[g] (7 → 1) für die Gruppen dressur, springen, vielseitigkeit, western (LK_GRUPPE,
     LK_NAME); Startrechte LK_STUFEN; Aufstieg lkErfolg(g, stufe, platz) mit LK_REGEL und
     spiel.lkErfolge.
  2. Training selbst: reiterFaktor(k) = 1 + 0,04 × (7 − LK) über UEB_LK (nur Dressur/Springen/
     Vielseitigkeit/Western-Übungen); im Faktor F der Trainingsberechnung (trainieren, Zeile mit
     trainerFaktor(m) : reiterFaktor(k)). Mitarbeiter: trainerFaktor(m) = 0,8 + 0,4 × wissen.ruecken /
     100.
  3. Turnier: in turnierNacht reiterF = profi ? 1,04 : 0,95 + 0,015 × (7 − LK) im Produkt des
     Turnierwerts; profi = Ausbildungsstall stellt das Pferd vor („reitet wie LK 2“). Rennen: Jockey
     (REITGELD 80 €, P.jockey), Distanz/Tölt/Pass ohne LK.
  4. Reiterprofil: reiterHTML() in Hofverwaltung - Reiter (Avatar, LK-Tabelle, Turnierbilanz).
     spielerBereiter() (LK ≤ SPIELER_BEREITER_LK in allen vier Gruppen) erlaubt es, Pensionspferde zu
     bewegen. BEREITER_EINHEIT 35 € je Reiteinheit; fester Bereiter nur im Ausbildungsstall, sonst
     „Bereiter nach Bedarf“ (festerBereiter()).
  5. Das Pferd hat Ausbildungsstand je Disziplin (ausbildungsKlasse, klasseIndex, KLASSEN, Disziplin-
     Stand U.d).
  6. Erfahrungsstufen: frei(f) / STUFE() / STUFE_NEU; Anfänger trainiert über festen Pfad (ANF_WEG).

Entscheidungen (Dome, 20.10.2026)
K1 – Reiter-Können (Daten, Wachstum)
  1. Können 0–100 je Disziplin-Gruppe in spiel.reiter.koennen[gruppe], Gruppen laut Tabelle
     REITER_DISZ (Anhang A, Abschnitt 1): dressur, springen, vielseitigkeit, western (Reining, Pleasure,
     Trail), rennen (Galopp-, Trab-, Passrennen), distanz, gangpferde (Tölt). LK gibt es weiter nur für
     die ersten vier (Startrecht, Aufstieg wie bisher). Das Können gilt je Spielstand, nicht je Hof.
  2. Wachstum (alle Zuwächse × (1 − Können / 120), also langsamer je höher das Können):
           Training selbst geritten: +0,15 je Einheit. Ist das Pferd in der Disziplin weniger als 10
           Punkte unter deinem Können (Prüfanforderung der Ausbildungsklasse, Punkt 5), voller
           Zuwachs, sonst ein Drittel (zu leichte Pferde bringen dich nicht weiter).
           Turnier selbst geritten: Start +0,3, Platzierung +0,8, Sieg +1,5, mal Klassenfaktor
           (Wettbewerb/Hofturnier 0,5 · E 1,0 · A 1,25 · L 1,5 · M 1,75 · S 2,0, Western entsprechend).
           Reitunterricht: +0,8, bei Können unter 30 doppelt, wirkt nur bis Können 60 (Punkt 9).
           Verlernen gibt es nicht (nur Wachstum).
  3. Übungen → Gruppe über UEB_LK erweitern: Dressur-/Springen-/Vielseitigkeit-/Western-
     Übungen wie bisher, dazu Trail-Arbeit → western, Galopp- und Konditionsarbeit im Gelände →
     rennen, Ausritt und Kondition → distanz, Tölt-/Passübungen → gangpferde. Die genauen Schlüssel
     in UEBUNG selbst prüfen; was keiner Gruppe zugeordnet ist, zählt nicht.
  4. Alte Spielstände: einmal beim Laden (reiterErgaenzen()): Können der vier LK-Gruppen aus
     der LK: LK 7 = 10, 6 = 22, 5 = 38, 4 = 52, 3 = 66, 2 = 80, 1 = 92; Rennen, Distanz, Gangpferde =
     10. Ohne Brief, danach fest.
  5. Prüfanforderung je Klasse (Tabelle in Anhang A, Abschnitt 2): englische Klassen E 10 · A 30 ·
     L 50 · M 70 · S 85, Western Einsteiger 10 · Rookie 30 · Novice 50 · Intermediate 70 · Open 85;
     Wettbewerb/Hofturnier und Aufbauprüfungen 10; Rennen, Distanz und Tölt Anforderung nach
    Klasse bzw. Länge (Anhang A). Stand des Pferdes in einer Disziplin = Prüfanforderung der
    Klasse, die es dort erreicht hat (Ausbildungsklasse bzw. Disziplin-Stand); junge oder
    unausgebildete Pferde 0.

Prüfung der Übungsschlüssel gegen den Code (Claude Pro, 20.10.2026, Code v583)
  Alle im Plan genannten Übungen gibt es in UEBUNG: longieren, doppellonge, dressur, stangen, springen,
  gelaendesprung, kondition, western, trailarbeit, ausritt, galopptraining, toeltarbeit, passtraining.
  UEB_LK kennt heute nur longieren, doppellonge, dressur, stangen, springen, gelaendesprung, kondition,
  western. Neu zuordnen: trailarbeit → western · galopptraining → rennen · ausritt → distanz ·
  toeltarbeit, passtraining → gangpferde. Zählt nicht fürs Können (nur Reitunterricht und Turniere):
  bodenarbeit, freiarbeit, spazieren.
  OFFEN (Dome): kondition steht im Plan bei vielseitigkeit, rennen und distanz, UEB_LK ordnet je Übung
  aber nur EINE Gruppe zu. Vorschlag: UEB_LK darf eine Liste von Gruppen enthalten, voller Zuwachs in
  jeder Gruppe (Kondition hilft in allen dreien). Ohne Antwort baut Claude diese Variante und trägt sie
  in OFFENE-FRAGEN.md ein.
  Hinweis: galopptraining braucht die Rennbahn (UEBUNG wo: „bahn“, Gebäude aus H7). Ohne Rennbahn wächst
  das Können „rennen“ nur über kondition, Turniere und Unterricht; das Startrecht für Rennen selbst
  reiten (Können 30, Punkt 12) ist dann ein langer Weg.

K2 – Training und Reitunterricht
  6. Abstandsfaktor beim Training v = (Können − Stand des Pferdes) / 20 (eine Klasse ≈ 20
     Punkte). Faktor nach v (zwischen den Punkten linear): v ≥ 2 → ×1,2 · v = 1 → ×1,1 · v = 0 → ×1,0
     · v = −1 → ×0,8 · v = −2 → ×0,5 · v ≤ −3 → ×0,25. Bei v ≤ −1 sinkt das Vertrauen des Pferdes um
     0,1 je Einheit, bei v ≤ −2 um 0,3. Ersetzt reiterFaktor (+4 % je LK). Für Mitarbeiter (m):
     trainerFaktor(m) bleibt, der Abstandsfaktor kommt dazu; das Können des Mitarbeiters ist sein
     wissen.ruecken (0–100), im Ausbildungsstall plus 10, höchstens 95. Ein Bereiter bildet also kein
     Pferd aus, das viel weiter ist als er.
  7. Reitunterricht: Aktion in Hofverwaltung - Reiter (Knopf „         Reitunterricht“, Disziplin
     wählen). Extern 60 € je Stunde; beim eigenen Bereiter oder Ausbilder (fest angestellt)
     kostenlos, aber seine Trainingseinheit dieses Tages entfällt. Höchstens 1 Stunde je Tag und
     Disziplin, wirkt bis Können 60 (darüber: Hinweis „Mehr lernst du jetzt auf Turnieren und mit
     schwierigeren Pferden“). Ab Anfänger freigeschaltet (Dome: Anfänger brauchen ihn am
     meisten). Buchen über buchen(...), Eintrag im Spielprotokoll prot("Reitunterricht", …).
  8. Hinweis „Dein Pferd ist besser als du“ (Dome, 20.10.): Bedingung v ≤ −1 für das Pferd in
     der Disziplin. Einmal je Pferd und Disziplin (Merker p.hinw.besser[gruppe], nie bei jedem
     Turnier neu), an diesen Stellen: a) Anfänger-Tutorial, Kapitel Training (Satz und Blase, Anhang
     A); b) beim Kauf (Pferdemarkt, Händler, Tierschutz) als Zeile im Steckbrief „Dieses Pferd ist
     weiter als du“, Kaufen bleibt erlaubt; c) Brief vom Bereiter oder Ausbildungsstall, wenn das Pferd
     von dort zurückkommt (Anhang A); d) Blase beim ersten Training mit diesem Pferd; e)
     Warnfenster beim Turnier-Nennen. Dauerhafte Zeilen (Ort-Reiter beim Pferd, Nennen-Zeile mit
     Können) sind keine Hinweise und bleiben immer sichtbar.

K3 – Turnier und Rennen
  9. Turnier-Reiterfaktor reiterF mit q = Können des Reiters / Prüfanforderung der Klasse
     (Anforderung mindestens 10): reiterF = 0,80 + 0,20 × min(1, q) + 0,08 × min(1, max(0, q − 1)),
     also ×0,80 (Können fehlt stark) bis ×1,08 (Können doppelt so hoch wie verlangt). Ersetzt 0,95 +
     0,015 × (7 − LK) und profi ? 1,04. Im Nennen-Dialog zeigt eine Zeile: „Dein Können reicht für
     diese Klasse“ / „knapp (−x %)“ / „fehlt: du holst deutlich weniger aus {Name} heraus“.
 10. Reiter wählen beim Nennen (Claude-Vorschlag, Dome hat nicht widersprochen, ab
     Fortgeschritten; Anfänger reitet selbst): du selbst · dein Bereiter (Name, sein Können; fest
     angestellt kostenlos, aber er trainiert an dem Tag nicht; „Bereiter nach Bedarf“ 2 Einheiten = 70
     €) · Profi von außen (Können 85, 150 € Reitgeld). Es zählen Können und Startrecht des
     gewählten Reiters (Startrecht für Bereiter/Profi: Anforderung der Klasse ≤ Können + 10; deine
     LK-Grenze gilt nur, wenn du selbst reitest). Erfolge zählen für das Pferd (p.erfolge,
     Marktwert), nicht für deine LK und dein Können.
 11. Ausbildungsstall außer Haus (Pferd wird dort ausgebildet und stellt sich vor, profi):
     Platzhalter-Können je Stall günstig 65 · moderat 80 · teuer 92 (der heutige eine
     Ausbildungsstall = moderat, 80), Spezialisten in ihrer Disziplin, unabhängig von deinem Können
     (deren Training läuft nach den bisherigen Regeln des Ausbildungsstalls). Beim Anmelden
     erscheint eine Warnung, wenn das Ziel weiter ist als du: „Du reitest erst L. Kommt {Name} mit M
     zurück, bremst dein Training, und du darfst es erst mit LK 3 in M starten.“ Dazu der Brief aus 8c
     bei der Rückkehr. Die Tabelle der Ställe füllt später das Thema „Ausbildungsstall außer Haus“.
 12. Rennen selbst reiten: Galopp-, Trab- und Passrennen kann der Spieler selbst reiten (Können
     rennen, ohne LK). Startrecht ab Können 30 (wie eine Amateurlizenz). Selbst reiten spart das
     Reitgeld (REITGELD 80 €), den Jockey kann man jederzeit weiter nehmen. Kein Sturzrisiko für den
     Reiter und keine Gewichtsgrenzen (eigenes Thema, falls gewünscht). Distanz und Tölt/Pass:
     Können zählt über den reiterF, kein Startrecht gesperrt.
 13. LK-Aufstieg zusätzlich zur Erfolgsregel (LK_REGEL): nur wenn das Können der Gruppe die
     Schwelle erreicht hat: LK 6 ab 15 · LK 5 ab 30 · LK 4 ab 45 · LK 3 ab 60 · LK 2 ab 75 · LK 1 ab 90.
     Reichen die Erfolge, fehlt aber Können, sammeln sie sich weiter und eine Blase (Anhang A)
     erklärt es.
K4 – Anzeige, Stufen, Hinweise
 14. Hofverwaltung - Reiter (reiterHTML): je Gruppe Zeile mit LK (nur vier), Können-Balken,
     Schwelle zur nächsten LK, Wirkung („Training bei Pferden auf deinem Stand +10 %“), Knopf
     Reitunterricht. Im Ort-Reiter (Training) beim Pferd ein Satz: „Du bist eine Klasse weiter: gutes
     Training“ / „Dieses Pferd ist weiter als du: das bremst“ (bei Mitarbeiter-Training: der Satz zum
     Mitarbeiter).
 15. Stufen (frei(), neue Schlüssel reiterBalken, reiterZahlen, STUFE_NEU ergänzen): Anfänger: nur
     LK und der Satz im Training, Reitunterricht freigeschaltet. Fortgeschritten: Können-Balken,
     Schwellen, Reiter wählen beim Nennen. Experte: zusätzlich die genauen Zuwächse (Tooltip)
     und Zahlen. Adminmodus: zusätzlich Zahlen und die Rechenwerte.
 16. Texte (Blasen, Briefe, Tutorial, Enzyklopädie, bzn): Anhang A. Hinweise und Tutorial werden
     gerade vom Claude-Team überarbeitet: Einträge so in das jeweils aktuelle System einbauen; bei
     Widerspruch gewinnt der neue Stand, die Texte und Auslöser bleiben.
 17. Spätere Überarbeitung der Disziplinen: Alle Zahlen zum Reiter (Gruppe, Anforderung je
     Klasse, Übungen, LK ja/nein) stehen in einer Tabelle REITER_DISZ (Anhang A, Abschnitt 1–2).
     Eine neue oder umgebaute Disziplin braucht nur eine Zeile; die Formeln bleiben.

Etappen
  1. K1 Können (mittel): spiel.reiter.koennen, REITER_DISZ, Wachstum, reiterErgaenzen (alte
     Spielstände), Anzeige der Zahlen im Adminmodus.
  2. K2 Training und Unterricht (mittel): Abstandsfaktor statt reiterFaktor, Mitarbeiter,
     Vertrauen, Reitunterricht, Hinweis 8a/8b/8d, Ort-Reiter-Satz.
  3. K3 Turnier und Rennen (mittel/groß): reiterF, Reiter wählen, Profi-Können je
     Ausbildungsstall, Warnung beim Anmelden, Rennen selbst reiten, LK-Schwellen, Brief 8c und
     Nennen-Warnung 8e.
  4. K4 Anzeige, Stufen, Hinweise, Tutorial (mittel): Reiter-Seite, Stufen, Blasen, Tutorial-
     Ergänzungen, Enzyklopädie, bzn.

Testen
  1. tests/reiter-test.js: alter Spielstand → Können aus LK; Wachstum (Training, Turnier,
     Unterricht, Abnahme bei hohem Können, Deckel Unterricht bei 60); Abstandsfaktor (Reiter 2
     Klassen weiter, gleich, Pferd 1, 2, 3 weiter, Vertrauen sinkt); Mitarbeiter-Training mit niedrigem
     und hohem Können; Turnier-Reiterfaktor (q = 0,2 / 1 / 2); Reiter wählen (Bereiter, Profi, Kosten,
     Erfolge nur beim Pferd); Rennen selbst reiten (Startrecht ab 30, Reitgeld gespart); LK-Aufstieg
     wartet auf Können; Hinweis 8 nur einmal je Pferd und Disziplin.
  2. Oberfläche in PC (1366×768), Handy quer (844×390) und hochkant (390×844): Hofverwaltung -
     Reiter, Reitunterricht-Fenster, Ort-Reiter-Satz, Nennen-Dialog mit Reiterwahl und Warnzeile,
     Kauf-Zeile „weiter als du“.
  3. Stufen: Anfänger sieht LK, Satz und Unterricht, keine Balken; Fortgeschritten Balken und
     Reiterwahl; Experte Zuwächse.
  4. Spielprotokoll (prot) und CLAUDE.md, Enzyklopädie und bzn aktuell halten.
