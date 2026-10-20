# Übergabe zwischen den Claude-Konten

Dome arbeitet abwechselnd mit zwei Claude-Konten am Spiel: **Claude Team** und **Claude Pro**.
Diese Datei ist der Austausch zwischen beiden – damit das jeweils andere Konto beim nächsten Start weiß, was passiert ist.

## Regeln für diese Datei
1. Beim Start einer Sitzung diese Datei lesen.
2. Steht unten als Absender **das andere Konto**: Infos lesen und übernehmen (CLAUDE.md, Pläne und Code sind schon aktuell – die Datei erklärt nur, was neu ist). Danach den Abschnitt „Nachricht“ **löschen**.
3. Am Ende der eigenen Sitzung (bzw. wenn Dome wechseln will) den Abschnitt „Nachricht“ neu schreiben: Absender = eigenes Konto, was gemacht wurde, was offen ist, worauf zu achten ist. Hochladen auf `main`.
4. Steht als Absender **das eigene Konto**, hat das andere Konto noch nicht gelesen – nichts löschen, nur ergänzen.
5. Weißt du nicht, welches Konto du bist: Dome kurz fragen.
6. Bilder (z. B. Entwürfe, Screenshots) dürfen für die Übergabe in den Projektordner, wenn sie wichtig sind – sobald sie nicht mehr gebraucht werden, wieder löschen (Dome, 18.10.2026). Sonst Test-Screenshots nur im Scratchpad.

---

## Nachricht

**Von:** Claude Team · **An:** Claude Pro · **Stand:** v576, 20.10.2026 (Vormittag) · Dome wechselt jetzt zu Pro.

Alles liegt auf `main` (Branch `claude/dazzling-mccarthy-3qoghi` ist gleich). Ältere Sitzungen (v523–v572) stehen ausführlich in CLAUDE.md – dort ist alles aktuell, diese Nachricht erklärt nur das Neue.

### Nachtsitzung 19./20.10. (v560–v572)
Alle Etappen des Plans umgesetzt: B4 Spiel verloren (v560), Raritäten R2–R4 (v561/v562), Waschplatz W1–W6 (v563–v567), Hinweisblasen/Stufen/Tutorials T1–T6 (v568–v572). Je Etappe ein Test (siehe CLAUDE.md „Testen“).

### Vormittag 20.10.: Domes Antworten auf die 9 Fragen der Nacht umgesetzt (v573–v576)
| Punkt | Stand |
|---|---|
| Fragen 1, 2, 6, 7: so lassen | ✅ (7 = Dome prüft die Blasen selbst im Spiel) |
| Alte Spielstände (vor v569) werden beim Laden **Experte**, umschaltbar (Frage 8) | ✅ v573 |
| Raritäten: ohne Spieler keine Gebote; ab dem 1. eigenen Gebot läuft die Auktion `tpj()` Tage, auch übers Marktjahr hinaus (`a.endeTag`, `rarAuktionPferd`, `rarAltHTML`) (Frage 3) | ✅ v573 |
| Raritäten: eigene Auktion startet beim Raritäten-Marktwert (statt ½) | ✅ v573 |
| Raritäten: mehr „selten“ – `RAR.stufe` 0,92/0,06/0,02, „beides“ bei Ziel selten → nur Gen; Ergebnis ca. 65/31/4 % (Frage 4) | ✅ v573 |
| Anfänger: fester Futterplan (`futterFest`), Charakter-Reiter ohne Details, fester Trainingsweg (`ANF_WEG`/`anfWeg`), keine Pfändung im 1. Jahr (`pfaendSchutz`) (Frage 9) | ✅ v574 |
| Abstammungs-Zuschlag im Marktwert (`ABST`, `rufVon`, `abstFaktor`, `lebendNachNr`, Schnappschuss `ahn.ruf`) + Prämien-/Championfohlen zählen für Mutter **und** Vater (`elternGutschrift`, `p.championFohlen`) (Frage 5) | ✅ v575, Test `tests/abstammung-test.js` |
| Marktpferde mit bekannten, erfolgreichen Eltern (Dome: „anpassen“) – `MARKT_AHNEN`, `marktAhnenRuf` (Gestüt am häufigsten, Tierschutz nie) | ✅ v576 |

Tests nach v575 grün: stufen, dispo, verloren, tutorial, hinweise, spielstand, chronik, bestenliste, jahresbericht, bild, seltenheit, krankheiten, zucht, waschplatz, raritaeten, abstammung. **Neu:** `dispo-test.js` und `verloren-test.js` setzen `spiel.stufenAn = false` (sonst greift die Anfänger-Schonfrist). Große Tests nicht gelaufen (nur mit Domes Erlaubnis).

### Offen – für Claude Pro
1. **Tutorial überarbeiten (Dome 20.10.: „da sind Fehler drin“).** Dome sagt dir, welche. Dazu gehört: der Tutorial-Balken verdeckt beim Handy quer ca. 30 px vom Stall (Dome: „ja, verschieben“). Kapitel „Richtig füttern“ ist seit v574 an den festen Anfänger-Futterplan angepasst (Schritt prüft `spiel.tutorial.futterAuf`). Code: `TUT`, `TUT_FORT`, `TUT_EXP`, `tutorialStart`, `tutPruefen`; Test `tests/tutorial-test.js`; Plan `PLAN-TUTORIAL.md`.
2. Domes Test im Spiel von v560–v575 steht aus (Abnahme der Pläne BILANZ B4, RARITÄTEN, WASCHPLATZ, HINWEISE).
3. Selbst festgelegte Zahlen v573–v575 Dome nennen, falls sie fragt: Abstammung Eltern 0,25 / Großeltern 0,08 / max. 50 %, Ruf voll bei 20.000 € Erfolgswert, Alter < 3 J. voll, 3–5 J. ×0,6, ab 6 J. ×0,35, eigene Erfolge ÷(1 + Erfolgswert/5.000); Champion-Nachkomme +10 % (bis 3). Marktpferde: Chance auf erfolgreiche Ahnen (Vater/Mutter/Großelternteil) Gestüt 75/50/30 %, Züchter 50/35/20 %, Händler 25/15/10 %, Privat 15/10/5 %, Mischlinge 10/5/3 %, Erfolgswert 1.500–20.000 €.
4. Übrige Punkte wie bisher in CLAUDE.md „Offen“ und `OFFENE-FRAGEN.md` (die 9 Nachtfragen sind beantwortet und gelöscht).
