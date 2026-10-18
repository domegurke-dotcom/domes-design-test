# Übergabe zwischen den Claude-Konten

Dome arbeitet abwechselnd mit zwei Claude-Konten am Spiel: **Claude Team** und **Claude Pro**.
Diese Datei ist der Austausch zwischen beiden – damit das jeweils andere Konto beim nächsten Start weiß, was passiert ist.

## Regeln für diese Datei
1. Beim Start einer Sitzung diese Datei lesen.
2. Steht unten als Absender **das andere Konto**: Infos lesen und übernehmen (CLAUDE.md, Pläne und Code sind schon aktuell – die Datei erklärt nur, was neu ist). Danach den Abschnitt „Nachricht“ **löschen**.
3. Am Ende der eigenen Sitzung (bzw. wenn Dome wechseln will) den Abschnitt „Nachricht“ neu schreiben: Absender = eigenes Konto, was gemacht wurde, was offen ist, worauf zu achten ist. Hochladen auf `main`.
4. Steht als Absender **das eigene Konto**, hat das andere Konto noch nicht gelesen – nichts löschen, nur ergänzen.
5. Weißt du nicht, welches Konto du bist: Dome kurz fragen.

---

## Nachricht

**Von:** Claude Team · **An:** Claude Pro · **Stand:** v434, 18.10.2026

Hallo Claude Pro! Du hattest Etappe 1 der neuen Köpfe gemacht (v424/v425). Ich habe übernommen und v426–v434 gebaut. Die CLAUDE.md ist aktuell (Stand v434) – **neu: Claude pflegt die CLAUDE.md jetzt selbst** (Dome, 18.10.), die alte Regel „darf Claude nicht ändern“ ist ersetzt.

### Was ich gemacht habe
- **v426 – Köpfe Etappe 2:** Domes Kopfabzeichen (Flocke, Stern, Keilstern, Schnippe, schmale Blesse, Blesse, breite Blesse, Laterne) und Maulfärbung aus `pferd kopf.svg` exportiert (je Kopfform, Verläufe in `KOPF_NEU.defs`, `kopfDefs`). Versteckte, vererbte Weiß-Anlage `ex.weiss` (`ABZ_STUFEN`, `WEISS_RASSE`, `kopfZeichen`), Pangaré `ex.pangare`, blaue Augen (`AUGE_BLAU`), neues Gen **Splashed White** `Sw` (Muster `sw_`). Steckbrief zeigt Abzeichen/Augen.
- **v427:** Hörtest (BAER, Labor 150 €), taube Splash-Pferde erschrecken beim Putzen bis zum Test (`TAUB_SCHRECK`). Fellfarben-Test zeigt Sabino/Splash (vorher Fehler bei `deut.Sb`). „Gene selbst wählen“ (Admin) mit Abzeichen, Schnippe, Maul, Augen.
- **v428 – Maul wie in echt:** Pangaré hellt nur rotes Pigment auf → Mehlmaul bei Braunen/Füchsen/Falben, bei Rappen/Mausfalben unsichtbar (aber vererbt). Kupfermaul nur Schwarzbraune. „graumaul“ heißt im Spiel **dunkles Maul** (Mausfalben immer, Braunfalben ohne Pangaré 70 %). Maul ist kein Abzeichen → eigene Zeile im Steckbrief.
- **v429:** Lücke zwischen Genick, Kopfhinterkante und Mähne geschlossen (`halsKopf` in pferd.js).
- **v430:** Ohrgröße je Rasse (`OHR_RASSE`), **Beinabzeichen je Bein einzeln vererbt** (`ex.bvl/bvr/bhl/bhr`, 7 Stufen weißer Ballen bis hochweißer Fuß, heller Huf ab weißer Fessel), **Zebrastreifen/Schulterstreifen** bei Falben (`ex.zebra`). Fjord: Farbschläge mit Anteilen (Braunfalbe ~90 %), Weiß-Standard (`fjordWeissFehler`: Fohlenschau −0,5, Marktwert −5 %). Neue Farbe **Dunkelfuchs** ohne Flachsmähne (`dfuchs`).
- **v431:** Admin-Auswahl nur mit Varianten, die bei der Rasse vorkommen (`rasseZeichen`). Friese/Fjord/Fell/Dales mit weniger Weiß.
- **v432/v433:** Braunfalbe/**Hellfalbe** (`falbTon`, `ex.ton` < 0,25). Etappe 3: **Aalstrich im Schopf** bei allen Falben. Admin: Kopfform + Ausprägung, Ohrstellung (Vorschau). Abschluss-Screenshots in allen drei Ansichten gemacht.
- **v434:** Form-Varianten (von Dome ausgesucht): schmale Blesse „geschwungen“, Blesse „unregelmäßiger Rand“ – je 50 %, fest je Pferd, alle Kopfformen (`ABZ_VARIANTE`).
- Abgehakt: Domes Abnahme H7-Rest/H8/Veredler, `OFFENE-FRAGEN.md` „Noch zu bauen“, Ausbilder-Nachholen per Test geprüft (funktioniert).

### Neue Dateien
- `BEI-INKSCAPE-BEARBEITEN.md` – was Dome in der SVG noch ändern/zeichnen soll (Laterne: **Form und Verlauf** decken die Nasenmitte nicht ab, Milchmaul, Krötenmaul, dunkles Maul größer …). Neue Fehler in Domes Zeichnungen dort eintragen.
- `UEBERGABE.md` – diese Datei.

### Offen
- Domes Zeichnungen laut `BEI-INKSCAPE-BEARBEITEN.md` – nach dem Hochladen `NODE_PATH=/opt/node22/lib/node_modules node werkzeuge/kopf-export.js` laufen lassen und einbauen.
- Sonst nichts offen.

### Worauf achten
- `//`-Kommentar nie mitten in einer Zeile (ist mir in v430 passiert – Syntaxfehler, sofort bemerkt).
- Neue `ex`-Werte immer in `EX_GRENZEN`/`EX_NAME` eintragen und in `exVon` für alte Spielstände auffüllen.
- Dome mag kurze Antworten, realistische Regeln („nur wenn es real so ist“) und will bei Unstimmigkeiten gefragt werden.
