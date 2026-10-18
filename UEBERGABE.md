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

**Von:** Claude Pro · **An:** Claude Team · **Stand:** v457, 18.10.2026

Hallo Claude Team! Dome macht bei dir in einer **neuen Sitzung** weiter (bei mir später auch in einer neuen). Mein Volumen ist fast leer.

### Als Erstes bitte tun
1. **Gib Dome die Test-Liste unten als Nummernliste im Chat aus** (genau so, 1–13), damit sie sie dort abarbeiten kann. Danach auf ihre Rückmeldungen zu den Punkten eingehen.
2. Zusammenarbeit wie bisher: erst Aufwand + Modell-Empfehlung (Sonnet/Opus) sagen, bei Bildern erst Entwurf zeigen, **bei Zeichnungen erst in `pferd kopf.svg` nachsehen, ob Dome es schon gezeichnet hat**, Selbstgewähltes (Zahlen) nennen, kurze Antworten auf Deutsch.

### Test-Liste für Dome (alles ist auf `main`, v440–v457)
1. **Scheckmuster Schritt 2 (v440):** Adminmodus → Enzyklopädie → Rassen → z. B. Quarter → „Gene selbst wählen“. Dort: Rabicano, Bend-Or, Birdcatcher, Brindle dunkel, Muster-Ausprägung bis „fast weiß“. Beim Araber mit Gen W/n kommt Dominant White.
2. **Leopard-Komplex (v441):** beim Appaloosa in der Genwahl Lackschimmel, Snowflake, Frost ansehen. Mit Alter 12 ist der Lackschimmel voll ausgeprägt.
3. **Neue Rassen (v442, v445):** Appaloosa, Knabstrupper, Paint Horse, Noriker, Lewitzer, Barock Pinto in der Enzyklopädie ansehen. Beim Noriker den „Mohrenkopf“ (Blue Roan) suchen.
4. **Mondblindheit:** im Adminmodus einem Appaloosa die Krankheit zuweisen. Prüfen: Tierarzt-Verdacht, Augenuntersuchung, Behandlung, Glaskörper-OP.
5. **Achal-Tekkiner (v443–v446):** Buckskin, Palomino, Isabell ansehen. Nicht jeder Tekkiner glänzt gleich stark.
6. **Schimmel (v447–v450):** ab etwa 30 % Ausschimmelung Graumaul nur an der Nasenspitze (Domes Ebene) und grauer Schatten um die Augen.
7. **Kopf–Hals-Übergang (v454):** Tobiano, Roan, Tiger, Tovero, Schimmel ansehen – der Übergang soll weich sein.
8. **Scheckungs-Spalte in der Rassenansicht (v451):** links neben den Fellfarben. Muster wählen, dann andere Farbe wählen – das Muster bleibt. Am Handy hochkant als Knopfzeile unter der Fellfarbe.
9. **Zoomen (v451–v457):** Handy zwei Finger aufziehen, mit einem Finger verschieben. PC Mausrad + gedrückte Maustaste (mehrmals hintereinander verschieben). In der Rassenansicht und beim Steckbrief-Bild. **Bekanntes Problem: siehe unten.**
10. **Steckbrief-Breite (v451):** am PC ist der Steckbrief bei Kauf und Deckanzeigen so breit wie die Menüs.
11. **Sortieren nach Kontinent (v455):** Umschalter „Alle / Nach Kontinent“ in der Enzyklopädie, allen Kaufrubriken im Pferdemarkt und bei den Deckanzeigen. (Dome: Vollblut = Europa ist okay, Tierschutz-Rückkäufe werden nicht sortiert.)
12. **Varianten durchschalten (v456):** in der Rassenansicht mehrmals auf Rappe tippen → Sommerrappe, Winterrappe im Winter, Winterrappe im Sommer. Auch bei Brauner/Fuchs (Winter/Sommer, Hellbrauner), Falben (Zebrastreifen, Hellfalbe), Roan und Scheckstufen; Muster-Spalte schaltet die Ausprägung durch. Ein Hinweis oben im Bild nennt die Variante. **Frage an Dome: passt die Reihenfolge?**
13. **Domes Inkscape-Aufgabe:** Ebene `grauaugen` (grauer Verlauf um die Augen beim Schimmel), siehe `BEI-INKSCAPE-BEARBEITEN.md` Punkt 4b – bis dahin gibt es einen Platzhalter.

### Bekanntes Problem: Zoom ruckelt auf dem Handy (Dome, Samsung Galaxy S10)
- **Wo:** besonders in der **Rassenansicht** (`#gross`), beim **Zoomen und beim Verschieben** im Zoom. Am PC okay.
- **Was ich schon gemacht habe (v453/v457):** Vorschau per CSS-Transform auf dem fertigen SVG (`vorschau()`/`scharf()` in `zoomInit`), Hülle `.gross-huelle` mit `overflow:hidden`, dauerhaft `will-change: transform`, Layout nur 1× je Geste messen, Änderungen per `requestAnimationFrame`, scharf neu zeichnen erst nach 350 ms Ruhe. Im Headless-Test fließt es, auf dem echten S10 offenbar nicht.
- **Vermutung:** Das SVG ist sehr aufwendig (viele Pfade, Filter, Masken, Muster). Auch als Ebene mit `will-change` rendert Chrome auf dem S10 zu langsam. **Vorschlag (Opus-Aufgabe, mittel–groß):** zu Beginn einer Geste das SVG einmal in ein **Bild/Canvas-Bitmap** umwandeln (z. B. SVG als Blob → `Image` → `<canvas>`, in doppelter Auflösung) und nur dieses Bitmap per CSS verschieben/skalieren; erst nach der Geste das echte SVG scharf zeichnen. Alternativ während der Geste die Filter/Masken ausblenden.
- Beim Steckbrief-Bild (`.sb-bild`) ruckelt es laut Dome weniger.

### Sonstiges / offen
- **Projekt-Chat-Themen** (nicht eigenmächtig umsetzen): Rassetypen (Knabstrupper Pony/Sport/Barock, Friese, Welsh A–D, Haflinger, Shetty, Quarter, Araber, Tinker) und Rote-Liste-Rassen (z. B. Alt-Oldenburger) – steht in `PROJEKT-CHAT-THEMEN.md`.
- Noriker/Lewitzer/Barock Pinto sind drin; Barock Pinto veredelt mit Friese, Tinker, Paint.
- Neue Rassen immer auch in `KONTINENT` (index.html) eintragen (sonst Europa), außerdem `KOPF_REAL`, `OHR_RASSE` usw. (siehe CLAUDE.md, „Neue Rassen“).
