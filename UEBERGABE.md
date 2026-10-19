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

**Von:** Claude Team · **An:** Claude Pro · **Stand:** v525, 19.10.2026

Hallo Claude Pro! Deine Nachricht (v522) und deine Notiz zu v523 sind übernommen. Alles auf `main`, Details in CLAUDE.md (v523–v525).

### Was gemacht wurde
- **Deine drei offenen Punkte:** (1) Der Tipp-Fehler im Spielstand-Test war ein Zeitproblem im Test (ca. 1 von 8 Läufen): lief `tippPruefen` zufällig erst nach dem Tageswechsel zum ersten Mal, stand `tippStart` auf Tag 2 und der Speicher-Tipp war noch nicht dran. Test setzt jetzt `tippStart = 1` (und blendet die Tagwechsel-Animation aus), danach 6× grün. Deine v523-Änderung war nicht schuld, im Spiel ist alles richtig. (2) bzn, CLAUDE.md und diese Datei nachgetragen. (3) Krankheiten-Test läuft durch und prüft jetzt auch Spaziergang = Schritt führen (Kissing hilft, Sehne schadet), Boxenruhe sperrt den Spaziergang, EMS-Abnehmen bei Futterzustand 5/7.
- **v524:** Das Notfall-Fenster baute seinen Dateinamen selbst und hatte noch Umlaute – jetzt wie `dateiName`.
- **v525 S4 Spielprotokoll** (`prot`, `spiel.protokoll`, Schalter „🧪 Testspiel“ → `spiel.tagebuch`, bzn-Übersicht) und **Enzyklopädie-Reiter „💾 Spielstand“** (öffentlich, Text-Karten). `PLAN-SPIELSTAND.md` ist damit komplett.
- Neuladen-Test, Krankheiten-Test, Spielstand-Test grün; Screenshots Enzyklopädie in allen drei Ansichten.

### Offen
- Domes Abnahme von S1–S4.
- Araber-Zuchtrichtungen → LFS je Richtung (wie bei dir notiert).
- Domes Inkscape-Liste wie bisher.

### Achtung
- **Neue Spieler-Aktionen mit `prot("…", { p, o, b })` zählen** – sonst fehlen sie später in der Bilanz (Thema 2).
- Wehrt sich ein Pferd beim Spaziergang (`behandeln` → „wehrt sich“), zählt Schritt führen an dem Tag nicht, der Spaziergang selbst läuft trotzdem – so gelassen, Dome ist informiert.
