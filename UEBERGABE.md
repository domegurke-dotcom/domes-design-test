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

**Von:** Claude Pro · **An:** Claude Team · **Stand:** v587, 20.10.2026 (abends)

Übergabe von Claude Team (v560–v582) gelesen und übernommen, Nachricht gelöscht. Phase A läuft (Dome: „starte Phase A“): S1 (v584), K1 (v585), K2 (v586) und M1 (v587) sind fertig, je ein eigener Commit.

### Fortschritt Mehr-Etappen-Lauf (Dome, 20.10.2026; Regeln in CLAUDE.md „Mehr-Etappen-Lauf“)
Vier Phasen (A, B, C, D = großer Test), am Phasenende hält Claude an; Dome schaltet das Modell um und sagt „weiter“.
| Phase | Modell | Etappe | Stand |
|---|---|---|---|
| A | Sonnet | S1 Schleifen, Regeln, `p.schleifen`, Brief | **fertig (v584)** |
| A | Sonnet | K1 Reiter-Können (Daten) | **fertig (v585)** |
| A | Sonnet | K2 Training und Reitunterricht | **fertig (v586)** |
| A | Sonnet | M1 Exterieur-Daten | **fertig (v587)** |
| B | Opus | S2 Pinnwand in der Box | offen |
| B | Opus | K3 Turnier und Rennen | offen |
| B | Opus | M2 Karte Merkmale | offen |
| C | Sonnet | S3 große Pinnwand | offen |
| C | Sonnet | S4 Tutorial, Hinweis, Stufen, Enzyklopädie (Schleifen) | offen |
| C | Sonnet | K4 Anzeige, Stufen, Hinweise | offen |
| C | Sonnet | M3 Wirkungen | offen |
| C | Sonnet | M4 Rassemerkmale, Besonderheiten, Zuchtbuch | offen |
| C | Sonnet | M5 Verpaaren, Fremd-Vergleich, Hinweise, Admin | offen |
| D | Sonnet | großer Test ohne Bilder (etappen, hof-gesamt, neuladen) + neue kleine Tests + Tutorial-Spieler – erst nach Domes „weiter“ | offen |

Wecker nur innerhalb einer Phase. Zwischen den Phasen: „Phase X fertig – bitte umschalten“ hier eintragen und aufhören. Fragen: `OFFENE-FRAGEN.md`.

### Offen (unverändert aus der Team-Nachricht)
1. Domes Test im Spiel von v560–v582 (Tutorial als Anfänger am Handy und PC, Raritäten im Sommer, Waschplatz/Solarium, Stufen, Abstammung).
2. **v583:** Hinweisblase blendet sich beim Ziehen eines Pferdes aus (hochkant deckte sie die freien Boxen ab, Dome: „das da“). `tests/tutorial-spieler.js` Anfänger 390×844, 844×390, 1366×768 laufen durch (nicht parallel starten – sonst hängt es zufällig bei „Bürste“).
2b. **Bilder-Schalter für große Tests** (Dome, 20.10.): `BILDER=aus|fehler|alle` + `BILDER_ORDNER` für etappen-test, hof-gesamttest, neuladen-test (`tests/bilder.js`, siehe `tests/README.md`). Geprüft nur mit einem Mini-Probelauf, die großen Tests selbst sind **nicht** gelaufen (Dome: noch nicht starten, vorher fragen, welche Variante).
3. Große Tests (Etappen-, Hof-Gesamt-, Neuladen-Test) nur mit Domes Erlaubnis.
4. Wisch-/Ziehgefühl am echten Handy kann nur Dome prüfen.
