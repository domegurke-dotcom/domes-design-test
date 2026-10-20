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

**Von:** Claude Team · **An:** Claude Pro · **Stand:** v611, 20.10.2026 (Nacht, Wochenvolumen fast leer)

**Offen – Tutorial-Überarbeitung nach Domes Test von v597 (4 Etappen, noch nicht begonnen außer unten):**
- **Antworten von Dome:** (1) Natursprung/Besamung: Zahlen so lassen (in echt ähnliche Chance, Unterschied bei Kosten/Verletzung/Hengstwahl) – nur im Tutorial erklären. (2) Boxstufen im Tutorial: alle Schritte mit sichtbarer Box zählen, in drei gleiche, aufsteigende Drittel teilen (Stufe 1, 2, 3), für alle Erfahrungsstufen. (3) Pferd lehnt Hustensaft beim ersten Mal ab, Tutorial zeigt, was dann zu tun ist.
- **Etappe A (Opus):** Tutorial-Pferde immer versorgt (Heu, Krippe, Wasser, Einstreu), Spieler füttert/mistet/putzt selbst; Kamm-Ziel (Hinweis zeigte neben das Pferd statt auf Mähne/Schweif); Steckbrief/Daten/Merkmale erklären und freigeben; Box-1-Klick zum Stall sperren; zu früh gesetzte Haken (Anfänger Kap. 8, Fort Kap. 1); Pferde-Sprechblase bleibt bis gelesen; Blase auf Brief-Popup, Info im Brief „am besten gleich bezahlen“, Stern anklickbar; Heunetz-leer-Bild Stufe 3, Kraftfutter-Krippe wie Stufe 2; **echter Spielfehler: Turnier-Nennen-Akkordeon öffnet alle genannten Turniere, Infofeld kommt immer wieder**; Pferdebild auch verschiebbar (Zoom); einheitlicher Kaufweg (Pferd direkt anzeigen, auch bei Deckanzeigen).
- **Etappe B (Sonnet, Anfänger Kap. 1–6):** Einstreu kaufen/auffüllen; Kap. 3 über zwei Tage mit Hustensaft (Stallapotheke, Weigern); Bereiter-Satz Kap. 4 klären; Kap. 5 Pferdevorschau im Brief, „Zwei Pferde“ hinein, Ende mit voller Versorgung; neues Kapitel Hauptmenü (Gnadenhof, Friedhof, alle Hofverwaltungs-Karten); Mitarbeiter ohne Einschränkung auf einen Stallburschen.
- **Etappe C (Opus, Anfänger Kap. 7–12):** Hofausbau (+ Anbau gegen Neu bauen, Reparieren – tut7 war „nutzlos“); Turnier mit Nennen, Zeitsprung, Ergebnis-Post; **Waschen: Reihenfolge nass → Shampoo → ausspülen im Spiel erzwingen (Mechanik prüfen) und im Tutorial**; Pferdeanhänger im Hauptmenü mit Beispielpferden (2 Fohlen zur Aufzuchtstation) und echtem Hofkauf; Pferdemarkt/Tierschutz (wo beschlagnahmte Pferde stehen, Steckbrief, Abstammungsschein, Pferd unter 30 %); Bank (weiterer Kredit, vorzeitige Rückzahlung).
- **Etappe D (Sonnet, Fortgeschrittene):** Kap. 2+3 zusammenlegen (Exterieur öffnen, Hengst-Klick hängt), Decken-Infos anklickbar, Kap. 4 endet mit Gentest-Ergebnis, Futterplan erklären und beendbar (altes Infobläschen weg), Auktionshaus im Hauptmenü, Pferd ersteigern.
- **Fertig in v607:** Anzeige „seit NaN Tagen bemerkt (von undefined)“ im Kapitel „Krankes Pony“ behoben (Tutorial setzte `bemerkt = true` statt `{von, tag}`).
- **Fertig in v608:** Turnier-Nennen: Karten und Disziplin-Gruppen klappen nur noch auf, was die Spielerin selbst geöffnet bzw. gerade genannt hat (vorher öffneten sich nach jedem Nennen alle genannten Turniere). Das „Infofeld, das immer wiederkommt“ ist noch nicht untersucht (vermutlich Einsteiger-Tipp `tippMerken("turnier")`).
- **Fertig in v609:** Wasch-Reihenfolge im Spiel erzwungen (Domes Wunsch): Shampoo nur bei nassem Pferd (sonst Hinweis, nichts verbraucht) → einschäumen (`p.schaum`, 1 Anwendung) → erneut „Abspritzen“ = ausspülen, erst dann Glanz (`p.fellGlanz`). Tutorial „Waschen“ (Fort) um „Shampoo“ und „Abspülen“ erweitert, bzn-Absatz, Test `tests/shampoo-test.js`, `tutorial-spieler.js` wischt auch bei „Shampoo/Abspülen“. Offen/auffällig: Schaum bleibt über Nacht ohne Folge (nur Tagesmerker) – Dome fragen, ob Shampoo-Reste schaden sollen; Anfänger-Tutorial hat noch keinen Wasch-Teil (kommt mit Etappe C).
- **Fertig in v610:** Boxschild (Klick zur Boxenübersicht) im Tutorial nur erlaubt, wenn der Schritt es nennt (`tutErlaubt`, nicht mehr über `#stall`); Turnier-Kapitel (Anfänger) zählt nur eine Nennung des eigenen Tutorial-Pferdes; Fort-Kapitel „Reiter-Können“ war durch `fertig: () => true` sofort „geschafft“ (Info-Schritte übersprungen) → `false`. **Nicht gelöst:** Kamm-Auslöser (Dome: reagiert links/rechts neben dem Pferd statt auf Mähne/Schweif) – `wischBewegen`, Bedingung `oben || hinten` bei `w.tool === "kamm"` (Mähne = obere 45 %, Schweif/Kopf = äußere 25 % links/rechts des `#pferdPlatz`-Rahmens); braucht Blick auf das Bild, Zonen evtl. an echte Mähnen-/Schweifposition koppeln. Pferdebild verschieben (Zoom) ebenfalls offen.
- **Fertig in v611:** Pferdebild im Tutorial-Fenster (`.sb-bild`, `#leseBild`) zoomen/verschieben ist immer erlaubt (die Tutorial-Klicksperre blockierte es; Verschieben mit der Maus im normalen Spiel funktionierte schon – Dome-Fehler war wohl die Sperre, auf dem Handy bitte gegenprüfen).
- Hinweis: `tests/tutorial-test.js` erwartet, dass nach der ersten Blase Schritt „Heu geben“ kommt – Reihenfolge der ersten Kapitel-1-Schritte nicht verschieben. Phase D (großer Test) wartet weiter auf Domes „weiter“.

---
