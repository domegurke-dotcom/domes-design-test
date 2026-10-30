# Auswertung Aufnahme 11 (Dome, 30.10.2026, Version 891) – 74 Meldungen

Datei: `Zuchtstall_Aufnahme-11-Herbst-00-Tag-1-bis-Herbst-05-Tag-2.json` (Anfänger „Test Anfänger“, 1920×1080 bei 125 % Windows-Skalierung = PC-Zoom 1,124). Nummern = Reihenfolge in der Aufnahme (0–73).

## Erledigt (v895, v896)
| Nr. | Meldung | Lösung |
|---|---|---|
| 3 | Bürsten/Kämmen/Hufe auskratzen geht nicht mehr | **Ursache gefunden und behoben (v895):** `svgPunkt` rechnete mit `createSVGPoint`; bei PC-Zoom (125 % Skalierung) wirft das bei jeder Wischbewegung einen Fehler. Test `tests/putzen-zoom-test.js`. Das war auch der offene Fehler „Pflegen nicht möglich“ (v851). |
| 2 | „Mit Besitzer sprechen“ entfernen | Knopf im Futterfenster weg |
| 5 | Anfänger: keine Werbung für den Raritäten-Markt | Hinweistext nur noch ab Experte (Verkaufsfenster, Seltenheit-Fenster) |
| 6, 8, 16 | Anfänger sollen Sandpaddock, Roundpen, Paddockboxen bauen können | in der Anfänger-Bauliste |
| 11 | Pension: nicht gebaute/freigeschaltete Zusatzleistungen und Boxstufen ausblenden | Leistungen ohne Gebäude und Preise für Stufen ohne Box werden nicht mehr gezeigt |
| 13 | Weihnachtsgeschenk der Einsteller geht an den Hof, nie ans Team | Knopf „Ans Team weitergeben“ weg, Text „Das Geld gehört dem Hof“ |
| 15 | Preis pro Box in 10er-Schritten | Pension: 10 € statt 50 € (Stallbox und Paddockbox) |
| 20 | Weidegang-Wunsch nicht mehr zeigen, wenn erreicht | Zeile verschwindet bei Mindest-Weidegang erreicht |
| 7 | Orte → „Auf welche Weide?“: Matsch zeigen | „Matsch 12 %“ |
| 23, 24, 52 | Futterwiese: Herbst-Schnitt auch wenn der 2. im Sommer ausfiel; Textdatum | Herbst-Schnitt (Tag 1) ist jetzt auch nach ausgefallenem 2. Schnitt möglich; Hinweistexte angepasst |
| 28 | Pflicht-Lehrgang für Azubis nie im Winter | nur in Frühling/Sommer/Herbst (Winter = Berufsschule) |
| 33, 34 | Berufsschule und gleichzeitig krank | wer in Berufsschule oder Lehrgang ist, meldet sich nicht krank |
| 37, 50 | Box ausgebaut (Stufe 1 → 2): Einsteller zahlt nicht den neuen Preis, fragt nach „besserer Box“, wird umgestellt | jeden Morgen angeglichen (`einstellerList_stufeAnpassen`): neuer Stufenpreis über die Preisprüfung (Einsteller muss zustimmen, +6 Zufriedenheit), kein Wunschbrief mehr für dieselbe Box |
| 41 | Einsteller will Sandpaddock, obwohl keiner gebaut | Sandpaddock-Wunsch nur noch, wenn ein Sandpaddock existiert |
| 51 | Urlaub: alle wollen im Sommer | Sommer-Gewicht entfernt (jede Jahreszeit gleich wahrscheinlich; Azubis bleiben Sommer) |
| 59 | „ein unruhiger Hengst“ beim Besitzer des Hengstes | „mein Hengst ist nachts unruhig“ |
| 66 | Fütterungsberater bei Mitarbeiter für Anfänger ausblenden | Kachel nur noch ab Fortgeschritten |

## Antworten auf Fragen
- **1 „Anfänger haben jetzt auch das Whiteboard?“** Nein. In der echten Stufe „Anfänger“ ist das Whiteboard gesperrt (erst Fortgeschritten, `ERFAHRUNG_STUFEN.anf.whiteboard = false`); nur das Anfänger-**Tutorial** zeigt es im Testhof. → Frage unten.
- **10, 17 „Boxenstall auf Stufe 2+3 ausbaubar?“** Für Anfänger ist da nichts gesperrt. Ausbauen braucht freies Bauland und genug Geld (am Stand dieser Aufnahme: 0,36 ha Bauland frei, Geld ca. 4.000 €) – vermutlich war es vorhin eines von beiden.
- **12 „💪 Eigenschaften / 💪 Körper“** unter Interieur: Eigenschaften = die Werte des Pferdes. „💪 Körper“ sind die 10 körperlichen Werte (z. B. Ausdauer, Kraft), „🧠 Kopf“ die 5 geistigen. Der Titel „Eigenschaften“ gehört zu Charakter (💭) – wenn das verwirrt, benenne ich um (Vorschlag: „Körperwerte“ und „Geistige Werte“).
- **24 „Warum im Herbst nur der 3. Schnitt?“** Das war die alte Regel (Herbst nur nach dem 2. Schnitt). Jetzt geändert, siehe oben.
- **38 „Stall des Jahres: wo ist die Urkunde? gibt es Stufen?“** Ja, vier Stufen: Gold ab 80 Punkten (3.000 €), Silber ab 70 (1.500 €), Bronze ab 62 (500 €), Anerkennung ab 55 (nur Urkunde, Ansehen +2). Die „Urkunde“ ist bisher nur ein Wort im Brief (kein Bild, kein Gegenstand im Spiel). → Frage unten.

## Noch offen (nicht umgesetzt, Untersuchung/Entscheidung nötig)
**Brauchen deine Entscheidung (Spielmechanik):**
- **9** Reparatur zu teuer (540 € bei 77 %) und Verschleiß zu schnell → neue Zahlen besprechen (Vorschlag in der Antwort).
- **14** Stallgebäude schon ab 4 statt 6 Boxen baubar (ändert Grundriss/Preise).
- **1** Whiteboard für Anfänger freischalten?
- **38** Urkunde als Bild/Plakette? Anerkennung zu leicht?
- **54, 55, 57, 63** Zahlungsausfälle/verspätete Zahlungen zu häufig, Einsteller ändern zu oft den Futterwunsch, offene Miete bei Stufenwechsel darf nicht verfallen (Zahlen und Regeln).
- **65, 67** Azubi: nach der Ausbildung ist er „Pferdewirt Pferdehaltung und Service“ (kein Stalldienst-Beruf) – wer mistet dann? Und im 1. Jahr keine Fachrichtung nennen.
- **45** Anfänger: nie ein Einsteller im Gelände (Bereiter-Logik).
- **72, 39** Hofwert im Finanzen-Diagramm und im Jahresbericht.
- **17b** Fehler melden mit Screenshot (Bild hochladen oder automatisch vom Bildschirm).

**Fehler/Unstimmigkeiten, noch nicht untersucht oder nur teilweise:**
- **0** Pachtland ohne Zaun taucht nirgends auf (als Futterwiese nicht bearbeitbar).
- **18** Pensionspferd hufrehegefährdet: Besitzer soll im Frühling Sandpaddock wollen, mit Box nur zu 50 % weniger zufrieden.
- **19** Boxenruhe soll sich von selbst beenden, wenn nicht mehr nötig (gibt es seit v533 – hier trotzdem nicht passiert, prüfen).
- **21** Orte → Pferd auf die Weide geschickt → Fenster schließen (Rücksprung zur Box).
- **22** Heu in der Box gegeben, Pferd kommt auf die Weide → Heu ging fälschlich zurück in die Futterkammer.
- **25** Beim Wechsel in Fees Box ist das Steckbrief-/Orte-Fenster offen.
- **26, 27, 43, 44, 62, 70, 71** Azubi-Gruppe: füttert Heu auf der Weide trotz genug Gras; bringt 3 Pferde raus, äppelt Weide 2 nie ab; krank gemeldet und trotzdem gearbeitet; schafft er eine Box mehr, fehlt die Weide; „vergessen“-Meldung obwohl der Mitarbeiter es nachholt; wie können 6 Boxen fertig sein.
- **29, 30, 35, 36** Einstreu-Briefe widersprechen sich (Besitzer kündigt „Bessere Einstreu“ und will trotzdem nicht ändern; zahlt nicht mehr, Anzeige zeigt es aber noch).
- **40** Roter Punkt am Tierarzt bei bekanntem chronischem Melanom.
- **42, 58** Hengst beschwert sich nicht / Brief „unruhig“ kam spät.
- **46, 47** Einsteller mit Zahlungsausfall-Kündigung schreibt trotzdem „bessere Box“ (zwei Briefe widersprechen sich).
- **48** „Weidegang (3/2)“ obwohl das Pferd nur 1× draußen war (Zählung prüfen).
- **53, 61** Beschwerde „wurde nicht bewegt / nicht nach Wunsch gefüttert“ trifft Anfänger zu Unrecht (Bereiter-Qualifikation fehlt, Futterumstellung).
- **56** Pferd, das immer auf die Weide kommt, löst nie die Einstreu-Frage aus.
- **60** Brief → Steckbrief → Rücksprung zum Brief.
- **64** „Einstreu ändern“ auch als Kreissymbol unter „Füttern“ (und im Tutorial erklären).
- **68** Urlaub von Merle (noch nicht bestätigt) bearbeitbar machen.
- **69** Postfach: Pfeile beim Durchblättern auf gleicher Höhe lassen.
- **73** Roan-Schecke in der Enzyklopädie sieht wie Lackschimmel mit Scheckung aus.
- **4, 31, 32, 49, 63** Meldungen ohne Text (Fehler-Kästchen ohne Eintrag).
