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

**Von:** Claude Team · **An:** Claude Pro · **Stand:** v582, 20.10.2026 (Nachmittag) · Dome wechselt jetzt zu Pro.

Alles liegt auf `main` (Branch `claude/dazzling-mccarthy-3qoghi` ist gleich). Details zu jeder Version in CLAUDE.md (v560–v582), Zahlen in der Enzyklopädie (bzn, nur Admin).

### Was heute passiert ist
- **Nachtsitzung (v560–v572):** alle Etappen der Pläne BILANZ B4, RARITÄTEN R2–R4, WASCHPLATZ W1–W6, HINWEISE T1–T6.
- **Domes Antworten auf die 9 Nachtfragen (v573–v576):** alte Spielstände → Experte; Raritäten-Auktion läuft ab dem 1. eigenen Gebot eine Jahreszeit (auch übers Marktjahr), eigene Rarität startet beim Raritäten-Marktwert, mehr „selten“; Anfänger: fester Futterplan, Charakter ohne Details, fester Trainingsweg, keine Pfändung im 1. Jahr; Abstammungs-Zuschlag im Marktwert (Eltern/Großeltern, Prämien-/Championfohlen für beide Eltern, Marktpferde mit bekannten Eltern je Herkunft). `OFFENE-FRAGEN.md` ist leer.
- **Tutorial überarbeitet (v577–v582, Dome):** nur das Gefragte antippbar (+ Gelerntes), eine Aufgabe nach der anderen, „✅ Geschafft“-Blase statt Sofort-Weiter, Post nur im Pension-Kapitel, Box-Stufe je Kapitel (1–2: Stufe 1, 3–4: Stufe 2, ab Training Stufe 3), Raritäten-Kapitel im Sommer, neues Kapitel **„Waschen“** (Fortgeschrittene, 7 Kapitel) und **„Zwei Pferde“** (Anfänger, jetzt 13 Kapitel: Box wechseln + Pferd umstellen). Technik siehe CLAUDE.md „v577–v582“.
- **Hinweise je Gerät (v582, Dome):** `TOUCH`, `UMSTELLEN_TXT`, `BOXWECHSEL_TXT`; neue Blasen `boxUmstellen` (Boxenübersicht ab 2 Pferden) und `boxWechsel` (Box ab 2 Pferden); **PC: Pfeiltasten ← → blättern durch die Boxen** (`pfeilTasten`, nicht in Fenstern/Menüs/Eingabefeldern).
- **Fehler im normalen Spiel behoben:** Reiter „Ort“ war seit v569 kaputt (lokales `frei` überdeckte die Stufen-Funktion → überall `freiStufe(...)`), Waschplatz/Solarium-Kachel unter „Ort“ seit v563 nicht antippbar, Heu nicht antippbar wenn der Pferdekopf darüber lag (`#pferdPlatz rect { pointer-events: none }`).

### Tests
Grün: alle kleinen Tests (u. a. tutorial, stufen, hinweise, spielstand, waschplatz, raritaeten, abstammung, dispo, verloren). **Neu: `tests/tutorial-spieler.js`** (spielt Tutorials mit echten Klicks): Anfänger ✓ 844×390 und 1366×768, Fortgeschrittene ✓ und Experten ✓ in allen drei Ansichten. **Bekannt:** Anfänger 390×844 meldet manchmal „hängt: Pferd umstellen“ – das Ziehen selbst klappt per Einzeltest auch hochkant (Tutti → Box 3); vermutlich trifft die Testsimulation die falsche Kachel. Wenn Zeit ist: im Skript beim Ziehen prüfen, welche Box gewählt wird. Große Tests (Etappen-, Hof-Gesamt-, Neuladen-Test) **nicht** gelaufen – nach den zwei Ort-Fehlern sinnvoll, nur mit Domes Erlaubnis.

### Offen
1. Domes Test im Spiel von v560–v582 (Tutorial als Anfänger am Handy und PC, Raritäten im Sommer, Waschplatz/Solarium, Stufen, Abstammung).
2. Gefühl beim Wischen/Ziehen am echten Handy kann nur Dome prüfen.
3. Im Tutorial sind Fenster meist ganz freigegeben (streng nur Pensionsbrief und Stallbursche einstellen) – Dome war einverstanden („ok“).
4. Übrige Punkte wie in CLAUDE.md „Offen“.
