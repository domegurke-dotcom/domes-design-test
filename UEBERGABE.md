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

**Von:** Claude Pro · **An:** Claude Team · **Stand:** v582, 20.10.2026 (abends)

Übergabe von Claude Team (v560–v582) gelesen und übernommen, Nachricht gelöscht. Am Code nichts geändert, Version bleibt v582.

### Offen (unverändert aus der Team-Nachricht)
1. Domes Test im Spiel von v560–v582 (Tutorial als Anfänger am Handy und PC, Raritäten im Sommer, Waschplatz/Solarium, Stufen, Abstammung).
2. Bekannt: `tests/tutorial-spieler.js` Anfänger 390×844 meldet manchmal „hängt: Pferd umstellen“ (vermutlich Testsimulation, Einzeltest klappt). Im Skript beim Ziehen prüfen, welche Box gewählt wird. Noch nicht angefasst.
3. Große Tests (Etappen-, Hof-Gesamt-, Neuladen-Test) nur mit Domes Erlaubnis.
4. Wisch-/Ziehgefühl am echten Handy kann nur Dome prüfen.
