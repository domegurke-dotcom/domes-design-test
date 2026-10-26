# Plan: Aufzucht-Offenstall mit Ausbau – ✅ gebaut in v827 (Dome, 25.10.2026; Gruppen-Übung noch offen, siehe PROJEKT-CHAT-THEMEN.md Punkt 27)

Stand: Dome hat Plätze 10 / 25 / 50, die Preise und Variante A (Gruppen) beschlossen und sagt: „noch nicht bauen, nur planen“. Start erst nach ihrem Ja.

## Beschlossen
- **Plätze je Stufe:** 10 / 25 / 50 (heute immer 10, Stufe ändert nichts).
- **Baupreise:** 15.000 / 40.000 / 90.000 € (heute 8.000 / 15.000 / 25.000).
- **Gruppen (Variante A, das Spiel teilt automatisch ein):** Stufe 1 = 1 Gruppe, Stufe 2 = 2 Gruppen, Stufe 3 = 4 Gruppen (je etwa 12–13 Plätze). Die Einteilung 1 / 2 / 4 hat Dome mit „a ist schon gut“ gebilligt.
- **Pflege:** Einzelpflege (Putzen, Fohlen-ABC, Hufe, Tierarzt) bleibt je Pferd wie heute. **Futter, Misten und Wasser gelten je Gruppe** (einmal je Gruppe statt je Pferd) – nur in diesem Stall.
- **Später (Verbesserung, Dome 24.10.):** *Gruppen-Übung* – Fohlen-ABC mit der ganzen Gruppe auf einmal, wirkt schwächer als Einzelarbeit. Neue Spielmechanik, braucht Zahlen von Dome (siehe PROJEKT-CHAT-THEMEN.md Punkt 27).

## Gruppen-Einteilung (Vorschlag, noch nicht bestätigt)
| Stufe | Gruppen |
|---|---|
| 1 (10) | eine Herde wie heute (Junghengst muss weg, sobald Stuten da sind) |
| 2 (25) | 0 Stuten und Wallache (inkl. Hengstfohlen unter 1½ J.) · 1 Junghengste (ab 1½ J.) |
| 3 (50) | 0 Absetzer (unter 1 J.) · 1 Jährlinge Stuten/Wallache (1–2 J.) · 2 Junghengste · 3 ältere Stuten/Wallache (ab 2 J., auch Tanten/Onkel) |
Jeder Platz (`b.og`) gehört zu einer Gruppe; Kapazität = Plätze ÷ Gruppen.

## Bausteine (Code, alles in `index.html`)
1. **Daten:** `OFFEN_STUFE` {plaetze [10,25,50], gruppen [1,2,4]}, `BAUTEN.aufzucht.preis` 15.000/40.000/90.000. Grundrisse im Hofplan je Stufe (`planMassTyp`): 10 Plätze ≈ 800 m² (8×4 Kacheln, wie heute), 25 ≈ 2.000 m² (10×8), 50 ≈ 4.000 m² (16×10); `platzVon("aufzucht", …, stufe)` (`PLATZ.aufzucht` 0,08 ha → je Stufe 0,08 / 0,20 / 0,40 ha, +30 % Wege).
2. **Umbau:** `bauFertig(g, "umbau")` fügt für `aufzucht` neue Plätze hinzu (bisher ändert der Umbau nur die Stufe) und vergibt die Gruppen neu (`offenGruppenSetzen`). Prüfen, ob `umbauSperre`/`ersatzBoxen` für den Offenstall passt (heute müssen die Pferde des Umbaus in andere Boxen/auf die Weide).
3. **Gruppenlogik:** `offenGruppeVon(p)` (Regeln oben), `offenPlatz(p)` (freier Platz in der Gruppe des Pferdes), `offenSperre` rechnet je Gruppe („Gruppe voll“, Hengst/Stute nur innerhalb der Gruppe), `offenstallNacht` je Gruppe (Sozialverhalten, Tanten-Aufsicht, ungeplante Bedeckung nur innerhalb der Gruppe), `offenstallJahreszeit`: Pferde, die älter werden, ziehen in die neue Gruppe um (Sammelbrief, bei voller Gruppe Hinweis). Aufrufer von `offenPlatz()` anpassen (Box wechseln, Ort „Offenstall“, Fremdaufzucht `aufzuchtPlaetze`/Anfrage).
4. **Versorgung je Gruppe:** Knöpfe „Ganze Gruppe: Heu / Misten / Wasser“ (Offenstall-Kachel im Stall/Whiteboard und in der Box-Ansicht eines Offenstall-Pferdes), ruft je Platz der Gruppe die vorhandenen Funktionen auf (`fuetternAusLager`, Misten, `wasserTag`); Stallbursche/Pfleger: `boxAufwand` im Offenstall (heute 0,5 je Platz) prüfen, ob je Gruppe gerechnet werden soll.
5. **Anzeige:** Stall-Kachel „Aufzucht-Offenstall“ zeigt die Gruppen („Absetzer · 11 von 12“), ← → blättert im Offenstall durch die Pferde der Gruppe; Whiteboard (Boxen) mit Gruppenüberschriften.
6. **Alte Spielstände:** haben 10 Plätze in Stufe 1 oder höher gebaut – Stufe 2/3 geben **nicht** rückwirkend mehr Plätze; beim Laden `b.og` = 0, Umbau fügt Plätze hinzu. Hofplan: Gebäude mit größerem Grundriss können mit anderen kollidieren (Prüfung `planUmbauPruefen`, vorher Vorschau wie bei anderen Ausbauten).
7. **Fremdaufzucht:** `AUFZ_FREMD` 250 €/Waise 120 € bleibt; bei 50 Plätzen sind bis zu 12.500 € je Jahreszeit möglich – Nachfrage (`chance` 0,6, `aufzuchtPlaetze`) prüfen, damit der Stall nicht zu leicht voll wird (Frage an Dome).
8. **Dazu:** Enzyklopädie/bzn-Absatz, Einsteiger-Hinweis, `PREISE-VERGLEICH.md`, Tutorial-Info (Fortgeschrittene), Update-Fenster nur auf Domes Ansage. Tests: neuer `tests/offenstall-test.js` (Plätze je Stufe, Gruppeneinteilung, Umzug bei Alter, Gruppe voll, Gruppen-Versorgung, alte Spielstände), `hofplan-test`, `etappen-test` (H7a) und Tutorial-Spieler nur mit dem großen Test.

## Aufwand und Reihenfolge (Vorschlag, Modell Opus)
- **Etappe 1 (mittel):** Plätze, Preise, Grundrisse, Umbau mit neuen Plätzen (Bausteine 1–2, 6).
- **Etappe 2 (mittel):** Gruppen und Einteilung (3, 5).
- **Etappe 3 (klein–mittel):** Versorgung je Gruppe (4), Texte/Enzyklopädie/Tests (8).
Nach jeder Etappe testen, hochladen, Test-Anleitung, auf Rückmeldung warten.

## Antworten von Dome (24.10.2026)
1. Gruppeneinteilung Stufe 3: Dome fragte „wäre es so real?“ – Antwort von Claude: im Wesentlichen ja (Vereinfachungen: Junghengste 1½–3 J. in einer Gruppe, Hengste 1–1½ J. noch bei den Jährlingen); **Dome 24.10.: „es passt so“ – bestätigt**.
2. Fremdaufzucht-Nachfrage: **gleichbleiben**.
3. Stallbursche/Azubi: Arbeit im Offenstall **je Gruppe** statt je Platz rechnen – **ja**.
4. Alte Spielstände: **keine betroffen** (niemand hat einen Offenstall) – Punkt 6 oben entfällt, kein Umbau-Sonderfall nötig.

**Stand: gebaut in v827 (Claude Pro, Dome 25.10.: „dann das mit dem Aufzuchtsoffenstall“) – Etappen 1–3 in einem Schritt.** Plätze/Preise/Grundriss/Bauland je Stufe, Umbau fügt Plätze hinzu (`offenPlaetzeAuffuellen`), Gruppen `b.og` (`offenGruppenSetzen`, `offenGruppeVon`, Namen `OFFEN_GRUPPEN_NAME`), freier Platz nur in der eigenen Gruppe (`offenPlatz(p)`), Sperren je Gruppe inkl. „Gruppe … ist voll“, Herde je Gruppe (`offenstallNacht`), Umzug in die neue Gruppe zu Beginn der Jahreszeit mit Sammelbrief (`offenNeuEinteilen`), Versorgung je Gruppe (Karte in Versorgung · Heute: Heu, Kraftfutter, Misten, Wasser – `offenGruppeHTML`), Stallbursche/Azubi: eine Gruppe = 1 Box, ganze Gruppe derselbe Mitarbeiter (`maZuteilung`). Fertig-Fenster nennt Plätze und Gruppen, bzn-Absatz, Hinweis `offenGruppe`, `PREISE-VERGLEICH.md`. Test `tests/offenstall-test.js`. **Nicht gebaut:** Gruppen-Übung (Thema 27), eigene Gruppen-Kachel/Blättern in der Stallansicht und Gruppenüberschriften im Whiteboard (dort stehen Offenstall-Pferde ohnehin nicht), Tutorial-Info.
