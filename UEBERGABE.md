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

**Von:** Claude Pro · **An:** Claude Team · **Stand:** v583, 20.10.2026 (abends)

Übergabe von Claude Team (v560–v582) gelesen und übernommen, Nachricht gelöscht. Am Code nichts geändert, Version bleibt v582.

### Fortschritt Mehr-Etappen-Lauf (Dome, 20.10.2026; Regeln in CLAUDE.md „Mehr-Etappen-Lauf“)
Ein durchgehender Lauf mit Opus, ohne Halt zwischen den Etappen. Reihenfolge und Stand:
| Nr | Etappe | Stand |
|---|---|---|
| 1 | S1 Schleifen, Regeln, `p.schleifen`, Brief | offen |
| 2 | K1 Reiter-Können (Daten) | offen |
| 3 | K2 Training und Reitunterricht | offen |
| 4 | M1 Exterieur-Daten | offen |
| 5 | S2 Pinnwand in der Box | offen |
| 6 | K3 Turnier und Rennen | offen |
| 7 | M2 Karte Merkmale | offen |
| 8 | S3 große Pinnwand | offen |
| 9 | S4 Tutorial, Hinweis, Stufen, Enzyklopädie (Schleifen) | offen |
| 10 | K4 Anzeige, Stufen, Hinweise | offen |
| 11 | M3 Wirkungen | offen |
| 12 | M4 Rassemerkmale, Besonderheiten, Zuchtbuch | offen |
| 13 | M5 Verpaaren, Fremd-Vergleich, Hinweise, Admin | offen |
| 14 | großer Test ohne Bilder (etappen, hof-gesamt, neuladen) + kleine Tests + Tutorial-Spieler | offen |

Wecker bei leerem Volumen: weitermachen bei der nächsten offenen Zeile. Fragen: `OFFENE-FRAGEN.md`.

### Offen (unverändert aus der Team-Nachricht)
1. Domes Test im Spiel von v560–v582 (Tutorial als Anfänger am Handy und PC, Raritäten im Sommer, Waschplatz/Solarium, Stufen, Abstammung).
2. **v583:** Hinweisblase blendet sich beim Ziehen eines Pferdes aus (hochkant deckte sie die freien Boxen ab, Dome: „das da“). `tests/tutorial-spieler.js` Anfänger 390×844, 844×390, 1366×768 laufen durch (nicht parallel starten – sonst hängt es zufällig bei „Bürste“).
2b. **Bilder-Schalter für große Tests** (Dome, 20.10.): `BILDER=aus|fehler|alle` + `BILDER_ORDNER` für etappen-test, hof-gesamttest, neuladen-test (`tests/bilder.js`, siehe `tests/README.md`). Geprüft nur mit einem Mini-Probelauf, die großen Tests selbst sind **nicht** gelaufen (Dome: noch nicht starten, vorher fragen, welche Variante).
3. Große Tests (Etappen-, Hof-Gesamt-, Neuladen-Test) nur mit Domes Erlaubnis.
4. Wisch-/Ziehgefühl am echten Handy kann nur Dome prüfen.
