# Auswertung der Aufnahmen „großer test 1 und 2“ (Dome, 23.10.2026, Version v648)

Sortiert von Claude Team. Nichts davon ist geändert (außer was bei „Behoben“ steht). Nummern = Zeitpunkt `t` in der Aufnahme.

## A) Wahrscheinlich schon behoben (v651)
- t57, t78 „Jahreszeit hängt“, kein Mitarbeiter hat gearbeitet, keine Post, kein Jahresbericht: passt zum Fehler in `pensionJahreszeit` (Kommentar verschluckte `if (!k) return;`), seit v651 behoben. Bitte beim nächsten Jahreswechsel gegenprüfen.
- t41/t48/t77 „Bauer hat nicht gemäht“: kann an demselben Hänger liegen (kein Jahreszeitwechsel → kein Mähtag). Danach noch einmal beobachten.

## B) Klare Fehler (kann ich beheben, sag „ja“)
1. t29 Jahresbericht „Gezüchtete Fohlen 3“: die 3 Start-Fohlen (Susi, Ronja, Nanni) zählen als „Fohlen geboren“ (Zähler in `geburt`), obwohl sie vom Tierschutz kamen.
2. t18/t88 Besitzer-Rückmeldung widerspricht sich („wird nach meinem Wunsch gefüttert“ unter 👍 UND „wird nicht nach meinem Wunsch gefüttert“ unter 👎); „kein Weidegang“ beschwert sich auch bei Quarantäne/Boxenruhe/Klinik (t86, t88).
3. t103 / t82 Beschwerde „Reitplatz zu voll“ im Winter ohne Betrieb und trotz 2 Reitplätzen.
4. t40 Azubi krank gemeldet + Urlaub und hat trotzdem versorgt.
5. t56 Versorgung zeigt „Heute: ✓ Futter nach Wunsch“, obwohl noch nicht gefüttert.
6. t80 Mitarbeiter und ich konnten Heu füttern, obwohl das Lager leer war.
7. t81 Futterplan-Anzeige Theresa: „würde abnehmen“, aber zu viel Energie.
8. t9 zwei Besitzer mit demselben Nachnamen „Zimmermann“.
9. t8 Weide muss abgeäppelt werden, obwohl nie ein Pferd drauf war.
10. t65 Einstreu-Frage für das neue Pferd kam, während ich im Stall-Menü war (Fenster-Zeitpunkt).
11. t76 Pferd in der Paddockbox braucht keinen Sandpaddock (Paddockbox ersetzt ihn).
12. t87 Sandpaddock hat 2 Pferde vom Stallburschen und ich kann trotzdem meins dazustellen (Kapazität wird nicht geprüft).
13. t88 Wassereimer steht vor dem Pferd, muss dahinter (Ebenenreihenfolge im Box-Bild).
14. t89 Schleife: die Platznummer sitzt nicht mittig in der Höhe.
15. t99 „Waschen buchen (0 € je Jahreszeit)“: Preis „0 €“ verwirrt, weil Waschen nach Nutzung abgerechnet wird; außerdem hat nie jemand eine Anwendung gewollt.
16. t99 Boxenruhe beendet → Tür geht nicht wieder auf; t104 Boxenruhe schaltet sich bei gesundem Pferd nicht aus.
17. t103 „Box nicht sauber machen und kein Futter geben“ (Wasser ging) – genauer Zustand klären.
18. t104 Wassereimer füllen, wenn das Pferd in der Klinik ist.
19. t4 beim Streicheln der Stute ändert sich das Fell (Schecken-Muster) des Fohlens.
20. t46/t77 Sprechblasen der Pferde zu hoch (an Körpergröße anpassen).
21. t59 Azubi schlägt eine Krankheit vor, die nicht in meinen 4 Möglichkeiten steht → verrät, dass er falsch liegt (Folge von v646: sein Vorschlag muss in der Auswahl stehen).
22. t71 kein Popup bei rotem Futterbedarf des EIGENEN Pferdes (nur Einsteller sollen keins bekommen).
23. t90 beim „Auswählen“ in der Post sind ⭐ und Jahresberichte nicht mehr zu sehen/geschützt (Löschgefahr).
24. t102 Fehler ohne Text (nichts auszuwerten).
25. t87 Pinnwand lässt sich nicht anklicken (unklar, in welcher Boxstufe) und soll ins Tutorial.

## C) Fragen an Dich (Spielmechanik / „wie in echt“)
- t6/t28/t69/t78 **Rezepte:** Der Tierarzt schreibt Schmerzmittel in den Plan, aber es gibt kein Folgerezept, die Stallapotheke wirkt nicht → ich muss ihn immer wieder rufen und zahle jedes Mal den Hausbesuch. Soll das Rezept (4 Dosen) auch nach „Untersuchung/AKU“ kommen und ein Folgerezept ohne neuen Hausbesuch möglich sein? (t84 + t104 Veterinäramt-Hinweis hängt vermutlich daran: „Krankheit ohne Behandlung“.)
- t15 **Schonfrist:** Du dachtest, in der Schonfrist gibt es die Förderung trotzdem und nur die Rückzahlung entfällt. Jetzt gibt es in der Schonfrist keine Förderung. Soll die Förderung in der Schonfrist gezahlt werden?
- t12/t68 Zaun der Pachtweide muss repariert werden, der der ersten Weide nicht (und „baufällig 96–100 %“). Soll es für alle Zäune Verfall/Reparatur geben oder für keinen?
- t22 Pensionspferd „Weidegang ist ihr wichtig“ – muss es raus, wenn „Weide“ nicht gebucht ist?
- t41 Pferd kommt mit Husten aus der Klinik (Entlassung bei 75 % Gesundheit). Soll die Klinik erst bei „gesund“ entlassen?
- t50 Einsteller und Boxstufen: bewerben sich auf teurere Boxen, und was, wenn man jemanden von Stufe 1 nach Stufe 2 verlegt?
- t92 Mitarbeiter bringen Pferde nicht mehr abends in die Box, sondern lassen sie tagsüber draußen (Weiden sind sonst leer)?
- t99 Besitzer, der keine bessere Einstreu verlangt, aber sie die meiste Zeit bekommt, soll automatisch dafür zahlen?
- t92 Stute mit zu jungem Fohlen darf nicht raus → automatisch Boxenruhe?
- t103 Kolik beim Hengst wegen Stress durch Stuten im Stall: gibt es das im Spiel? (muss ich prüfen)
- t72 „Was auf 1 ha Bauland passt, wirkt nicht realistisch“ (Flächenbedarf der Gebäude).
- t94 Wie lange gilt ein Preisvorschlag (steht nicht im Brief)?
- t96 Heu verkaufen: Bauer nimmt nach der Ernte zu einem anderen Preis als im Lager-Verkauf – gleicher Preis?
- t70/t71 Du hast die Veterinäramt-/Tierschutz-Warnung für eine echte Rückgabe gehalten. Soll der Brief deutlicher „nur eine Warnung“ sagen?
- t48 „Roundpen von Anfang an?“ – im Start-Hof ist laut Code keiner; bitte prüfen, ob du ihn selbst gebaut hast.

## D) Wünsche / größere Themen (eigene Pläne, nicht jetzt)
- **Whiteboard / Mitarbeiter- und Weideplan** (t87 Seite 1+2, t81, t104): je Boxenstall ein Board mit Boxen (5 Spalten, Pferdekopf, Besitzerwünsche ✓/✗, Mitarbeiter-Bild), rechts Weiden/Sandpaddocks mit Pferden, alles verschiebbar, roter Rahmen bei Pferden, die sich nicht mögen, grüner bei Freunden (mit Wirkung).
- Pensionsboxen/Paddockboxen einstellbar (Anzahl) und eigene Preise für Paddockboxen (t75, t86, t87).
- Sandpaddock vergrößern (4 Pferde, Fläche nach Pferdegröße, Überfüllung mit Folgen) (t57).
- Gebäude und Anlagen benennen wie Weiden (t77); Anbau/Erweiterung als +x statt neuer Zeile für Weide und Stall, Stufen-Ausbau mit wählbarer Boxenzahl (t103, t72 Hofplan zeigt für Anbau neue Zeichnung).
- „Alles reparieren“-Knopf und Aufklapp-Bereiche Gebäude / Anlagen / Weiden als Kacheln mit 5 Spalten (t57); Namen anklickbar mit Steckbrief-Fenster und Rücksprung (t57, t86 auch für Pferde außer Haus).
- Handwerker-Briefe in einem Brief (t59); Besitzer-Rückmeldungen in einem Brief (t97); Futterplanänderungen der Besitzer in einem Brief mit „alle bestätigen“ (t97).
- Heilungsdauer-Schätzung beim Tierarzt (t16); Befund mit „kann noch geritten werden / heilt nicht mehr“ (t95); ganzer Behandlungsplan inkl. Longieren und Verbote in der Versorgung (t88).
- Pflichttest/Quarantäne für alle, die Kontakt mit einem ansteckenden Pferd hatten (t86).
- Info, was ein Reitplatz-Ausbau bringt (mehr Pferde) und Orientierung, wie viele ihn nutzen (t65, t82).
- Weidefarbe nach Zustand (Gras/Matsch) (t36); Rahmen um die Weide, die für Mitarbeiter gewählt ist (t72); Wetter gleich im Fenster, auf der Weide und Paddockbox (t100); sichtbarer Hinweis, wann der Bauer mäht und warum nicht (t41); Warnung rechtzeitig, bevor das Futter ausgeht (t29).
- „Wirkt lockerer“-Meldung deutlicher (t89); Dreck auf dunklen Pferden besser sichtbar (t91); nach dem Duschen Glanz sichtbar (t92).
- Mitarbeiter misten Sandpaddocks und Weiden (t84).
- Bei vergessenem Mähne/Schopf-Schneiden: ist der Besitzer sauer? (t33)
