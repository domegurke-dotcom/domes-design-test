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

**Von:** Claude Pro · **An:** Claude Team · **Stand:** v522, 19.10.2026

Hallo Claude Team! Lange Pro-Sitzung, alles auf `main`, Details je Version in CLAUDE.md (v514–v522).

### Neue feste Regel (Dome)
- **Auffälliges immer sagen** – steht ganz oben in CLAUDE.md bei den festen Regeln. Am Ende jeder Antwort ausdrücklich nennen, was dir aufgefallen ist (Lücken, Vergessenes, Unrealistisches), nicht eigenmächtig ändern, aber nie verschweigen.

### Was gemacht wurde
- **v514–v518 Krankheiten:** alle echten Rassekrankheiten (LFS, OAAM, MH, Leberfibrose Haflinger/Noriker, Sarkoid, Sonnenbrand/Augenlid-Krebs, EMS, Hyperlipämie, Kissing Spines, Hufrolle, Spat, Sehne, Lungenblutung, Röhrbeinbruch inkl. Renntag, Darmstein, Aorta/Megaösophagus, Shivers, Hodenhochstand, Gebiss, MCOA), Zahlen nach Quellen geprüft (v515), Kopfform-Neigung je Rasse (`KOPF_NEIGUNG`), Shire leichtfuttrig, AKU findet die neuen Befunde, Händler verdecken Spat/Sehne/Hufrolle/Kissing mit Schmerzmittel. Test `tests/krankheiten-test.js` (inkl. Behandlung/Heilverlauf). Hof-Gesamttest und 4-Jahres-Simulation ohne Fehler.
- **v519–v522 Spielstand (`PLAN-SPIELSTAND.md`):** S1 Autospeicher + Speicherplatz 1/2 (gepackt, lz-string im Repo), S2 Datei speichern (Teilen am Handy), S3 Datei laden. Domes Änderungen danach: **keine Rücksicherung**, **neues Spiel legt keinen Speicherstand an** (Tipp erinnert, erstes Speichern fragt den Speicherplatz), **„Speicherplatz 1/2“**. Test `tests/spielstand-test.js`.
- Waschplatz → `PROJEKT-CHAT-THEMEN.md` Punkt 14, Speicherplatz-Thema Punkt 15, OFFENE-FRAGEN.md ist leer.

### Offen
- **S4 Spielprotokoll** (`PLAN-SPIELSTAND.md`) – noch nicht begonnen. Danach Enzyklopädie-Eintrag „Spielstand und Speicherplätze“ (öffentlich; bzn-Eintrag gibt es schon).
- **Mit Dome klären:** (1) Alte Spielstände (vor v519) werden beim ersten Laden einmal auf Speicherplatz 1 gelegt – passt das zu „kein automatischer Speicherstand“? (2) Dateiname mit Umlaut („Frühling“) – im Test-Chromium ging der Name verloren, auf Domes Handy prüfen. (3) EMS bessert sich bisher nur über „Schritt führen“, nicht über Abnehmen – Vorschlag: Abnehmen (Futterzustand ≤ 5) als Behandlung zählen.
- Araber-Zuchtrichtungen kommen bald → LFS je Richtung (ägyptisch ≈ 10 %, andere ≈ 2 %).
- Domes Inkscape-Liste wie bisher.

### Achtung
- Speichern ist jetzt **verzögert** (0,4 s): vor dem Lesen aus localStorage `speichernJetzt()` aufrufen, nie `JSON.parse(localStorage…)` – immer `lesen()`. In Tests vor dem Umschreiben von localStorage `speicherSperre = true`.
- `//`-Kommentare nur am Zeilenende.
