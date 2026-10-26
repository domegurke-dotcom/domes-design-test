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

### Eimer Etappe 1 FERTIG (Claude Pro, 26.10.) – Dome: „mach nur 1, den Umbau der Boxenstufen machen wir in einem Rutsch, wenn alles gebaut ist“
- **Maßstab fürs Spiel:** `STALL.cmZuEinheit = 0,86` (1 cm = 0,86 SVG-Einheiten, Pferd = Stockmaß × 0,86). Eimer-Modell: 39,4 Blender-Einheiten Ø oben = **31 cm** (12-l-Eimer) → 1 Modelleinheit ≈ 0,79 cm ≈ **0,68 SVG-Einheiten**; Eimer wird so ≈ 27 breit × 19 hoch im Box-Bild (der alte SVG-Futtereimer war ca. 34 × 26 = zu groß). Krippe Stufe 2: 76 × 46 × 23 Einheiten (≈ 60 × 36 × 18 cm, dunkler Kunststoff, Wandhalterung); Stufe 3: 102 × 52 × 28 (≈ 80 × 41 × 22 cm, Edelstahl, Halterung).
- **Gebaut:** `koerner.glb` (28 Körner), `eimer-teile.glb`, `krippe2.glb`, `krippe3.glb` (je ~23 KB); `mischer.html` wählt Eimer / Krippe Stufe 2 / Krippe Stufe 3 (Auswahl oben im Panel), Inhalt nach Reglern gemischt, Rechteck-Streuung mit gleicher Dichte je Fläche (`PLAETZE.k2/k3`, `KRIPPE`). Blender: `blender/eimer-alle.blend` (Arbeitsdatei, jetzt mit Krippen `krippe2_*`/`krippe3_*` und Körnern `korn_*`). Voll/leer: leer = nur Behälter, voll = Mischung; Wasser wie bisher `wasser_*` an/aus.
- **Offen/Hinweise:** Dome testet die Krippen am Handy (Bilder pro Sekunde bei den größeren Flächen – im Vorschaufenster 31 B/s bei Stufe 2, auf dem Handy mit Eimer 59–60). Einbau der Stufen (E2–E4) erst „in einem Rutsch“ nach Domes Ansage. Die dunkle Scheibe `Cylinder.001` bleibt der Grund, dass der Eimer nur „voll“ geht.

### Eimer im Spiel – Domes Antworten (26.10.), Plan steht, Start wartet auf ihr „Ja“
- **Wo:** Der Eimer gibt es nur in **Boxenstufe 1** (Futter- und Wassereimer am Boden) und **auf der Weide** (`weideBildSVG`, `[data-keimer]`). In **Boxenstufe 2+3** kommt das Futter in die **Futterkrippe – die muss noch gebaut werden** (3D, im selben Stil).
- **Perspektive:** wie jetzt – schräg von oben (man schaut in die Box; der Eimer steht am Boden).
- **Größe:** **realistisch**, passend zur Pferdegröße im Bild (Pferde sind in echter Größe/Stockmaß gezeichnet). Zu prüfen: Maßstab Stockmaß ↔ SVG-Einheiten in `pferd.js`/Box; Futtereimer ca. 12 l (oben Ø ~30 cm, Höhe ~25 cm) – Eimer in Blender hat Ø ~39 Einheiten, wird skaliert.
- **Zustände:** Eimer und Futter nur **voll oder leer** (kein „halb“). Voll = Mischung nach Futterplan (Mischer), leer = nur der Eimer. Wassereimer: voll (Wasser) oder leer.
- **Zuordnung Futtersorte → Korn:** „bauen wir Stück für Stück“ (erst Hafer, Müsli, Mineralfutter, Rübenschnitzel; weitere Sorten später je ein Korn).
- **Vorgeschlagene Etappen:** E1 Maße und Blender-Anpassung (Eimer realistisch skaliert, Wasser voll/leer, Krippe Stufe 2/3 bauen) → E2 Einbau Stufe 1 (3D-Feld im Box-SVG hinter dem Pferd, Klickflächen `.sKrippe`/`.sWasser` bleiben, voll/leer aus `p.futterHeute`/Wasserstand) → E3 Krippe Stufe 2+3 → E4 Eimer auf der Weide. Modell für E2: Opus (greift in die Boxansicht ein). Boxansicht ist älteres, gut laufendes Gebiet → Dome fragt vorher, alles wie in `CLAUDE.md` (Version hochzählen, Tests in drei Ansichten, `UEBERGABE.md`).

### Eimer-Mischer (Claude Pro, 26.10.) – Testseite `werkzeuge/eimer3d-test/mischer.html`, noch nicht im Spiel
- **Fertig, so wie unten für den Spieleinsatz vorgeschlagen:** `eimer-teile.glb` (Eimer, 0,25 MB) + `koerner.glb` (28 Kornformen, 2 je Material, 0,15 MB) werden in `mischer.html` per `InstancedMesh` vielfach ausgestreut. Vier Regler (Hafer, Müsli, Mineralfutter, Rübenschnitzel, werden zu % normiert) + Voreinstellungen. Feste Zufallsplätze (`PLAETZE`, Seed 20261026), je Platz Sorte nach Anteil ÷ mittlerer Kornfläche; es wird gefüllt, bis `FLAECHE` 1300 erreicht ist; Haufenfarbe = Mittel der Sorten. Bei 61 B/s lokal. Das ist die Vorlage für „Eimer zeigt den Futterplan“.
- **Grenzen/offen:** Füllhöhe ist fest „voll bis zum Rand“ (halb voll braucht, dass die dunkle Scheibe `Cylinder.001` „innen“ bei z = 22 entfernt/tiefer gelegt wird, sonst verdeckt sie den Inhalt). Zuordnung Futterplan → Sorten (Spiel-`FUTTER`-Liste) ist noch offen; je Sorte braucht es ein Korn (Blender-Skript: Inseln aus den Haufen, Hauptachsen-Ausrichtung, 2 je Material).

### Eimer: drei Beispielmischungen (Claude Pro, 26.10.) – noch nicht im Spiel
- **Dome-Wunsch:** der Eimer soll später das Futter **je nach Futterplan zusammengemischt** zeigen (Mengenverhältnis, Füllhöhe nach Gesamtmenge; Kraftfutter in der Krippe, nicht Heu). Als Vorstufe drei Beispielmischungen gebaut: `mix1` Hafer 55 / Müsli 30 / Mineral 15, `mix2` Rübenschnitzel 50 / Müsli 35 / Mineral 15, `mix3` Hafer 35 / Rübe 30 / Müsli 20 / Mineral 15 (erfundene Prozente). Verfahren: Körner aus den fertigen Inhalten per Zusammenhang herausgelöst (Hauptachsen-Ausrichtung), nach **bedeckter Fläche** (nicht Stückzahl) gewichtet und mit festem Zufall neu auf die Kuppel gestreut.
- Dateien: `blender/eimer-mischungen.blend` (Eimer + 3 Mischungen), Testseite `werkzeuge/eimer3d-test/mischungen.html` (+ `eimer-mischungen.glb`, 10,8 MB – für den Spieleinsatz viel zu groß). **Für den Einbau ins Spiel:** nicht fertige Haufen laden, sondern je Futtersorte **ein Korn (Instanzen)** und im Spiel (three.js `InstancedMesh`, fester Zufall je Pferd/Box) nach Futterplan streuen – spart Größe und erlaubt jede Mischung. Wartet weiter auf Domes Antworten: wo, Perspektive, Größe.

### Lokale Sitzung auf Domes PC (Claude Pro, 25.10.) – keine Code-Änderung, Stand v850
- Blender-Verbindung geprüft: erreichbar (Standardszene Kamera/Cube/Licht, Datei noch nicht gespeichert). Leerer Ordner `blender/` im Projektordner angelegt (Git zeigt ihn erst, wenn eine Datei drin liegt). Noch nichts committet oder gepusht.
- **Eimer in Blender gebaut (Dome, 25.10.):** `blender/eimer.blend` (leerer schwarzer Eimer, Bügel an den Ankern verankert, nach unten geklappt und berührt die Wand nur leicht, Form so, dass er mit Abstand am Rand entlangläuft) und `blender/eimer-hafer.blend` (Eimer mit Hafer: Haufen + 700 Körner, Objekte `hafer_*`). Stil: flache Farben, Kontur über Solidify „kontur“ mit Material `tinte`. Original von Dome: `eimer2.blend` (Downloads, unverändert). **Noch nicht im Spiel verwendet.**
- **Neuer Wunsch (Dome, 26.10., Volumen war fast leer): Müsli als dritter Inhalt im Eimer**, im Spielstil wie Hafer/Wasser (flache Farben, schwarze Kontur, bis unter den Rand gefüllt, in `eimer-alle.blend` als eigene Objekte `muesli_*`, in der Testseite dritter Schalter „Müsli“). Dome schickte zwei Beispielfotos (Pferdemüsli): bunte Mischung aus **Haferflocken** (flache, helle, ovale Plättchen), **Pellets** (kleine dunkelbraune Zylinder), **gelben/orangen Stückchen** (Mais/Erbsenflocken, eckig), **roten Kugeln/Pressstücken** (Apfel/Rote Bete), **Heu-/Grashalmen** (dünne grüne/gelbe Streifen), einzelne **orange Möhren-Stückchen** und dunkle Brocken. Vorgehen wie beim Hafer: Haufen (Kuppel, Radius 16,4, unter den Rand) + mehrere Kornformen als gejointe Meshes je Sorte mit Solidify-Kontur (`tinte`, 0,1), je Sorte ein Material (Farben im Spielstil gedeckt). Hafer-Code steht in dieser Datei beschrieben (Haufen `zf(r) = 28,6 − 2 (r/15,9)²`, Körner in Kuppel gestreut, Lage tangential + Zufallsneigung).
- **Stand 26.10.:** `blender/eimer-alle.blend` (Eimer + Hafer + Wasser, Arbeitsdatei), `eimer-hafer.blend` (ohne Wasser), `eimer-wasser.blend` (ohne Hafer) – alle mit neuen Metall-Ösen für den Bügel und durchgehender Kontur am Boden; Hafer und Wasser sind bis unter den Eimerrand gefüllt (sonst schwarzer Konturstreifen). Wasser: dunkel/trüb (#3f6f8a), weiche Wellenringe, ohne eigene Kontur.
- **Fertig (Auftrag eimer-muesli-bauen, 26.10.):** in `blender/eimer-alle.blend` jetzt auch **Müsli** (`muesli_*`, 6 Objekte, ~660 Teile), **Mineralfutter** (`mineral_*`, olivgrüne Pellets, ~1000) und **Rübenschnitzel** (`ruebe_*`, knubbelige rotbraune Stücke, ~960). Einzeldateien `eimer-muesli.blend`, `eimer-mineral.blend`, `eimer-ruebe.blend`. Testseite `werkzeuge/eimer3d-test/` hat Schalter Hafer, Wasser, Müsli, Mineralfutter, Rübenschnitzel (GLB jetzt ca. 12 MB – für den Spieleinbau ausdünnen). **Dome: bitte auf dem Handy ansehen** (https://domegurke-dotcom.github.io/domes-design-test-git/werkzeuge/eimer3d-test/). Einbau ins Spiel wartet auf Domes Antworten (wo, Perspektive, Größe).
- **Dome will den Eimer als echtes 3D im Spiel (nicht als Bild), im Aussehen genau wie in Blender (nicht flach).** Testseite `werkzeuge/eimer3d-test/` (three.js 0.160 lokal in `lib/`, `eimer-alle.glb`, Schalter Hafer/Wasser; auf Domes Handy 60 B/s). Aufbau: GLB-Export aus Blender (Modifier angewendet), Farben der Materialien `stahl/rand/gummi/innen/tinte` fehlen im Export und werden in `index.html` gesetzt, Materialnamen ohne „.001“ lesen; Kontur = umgestülpte Hülle (nur FrontSide, Material `tinte`). Nächster Schritt (wartet auf Dome): Einbau als Futter-/Wassereimer in die Boxansicht – Fragen an Dome offen: wo (Boxstufen), Perspektive, Größe; Reihenfolge vor/hinter Pferd im SVG ist der knifflige Teil. Lokaler Testserver: in Blender per Python gestartet (Port 8765), kein Python/Node auf Domes PC.
- Blender-Tools gibt es nur in lokalen Sitzungen auf Domes PC, nicht in der Cloud-Sitzung. Wer abwechselnd lokal und in der Cloud arbeitet: vorher `git pull`.

### v850 (Claude Pro, 25.10.)
- **Ursache „Text ragt rechts über den Rand“ gefunden:** Domes Bildschirm ist größer als 1366 px, der PC-Zoom (v831) rechnet `innerWidth` um, `document.documentElement.clientWidth` aber nicht – die Tutorial-Blase und die Blasen-Funktionen (`blasePosition`, Zeilen 4397/4414) nutzten clientWidth und setzten die Blase 70 px zu weit rechts. Jetzt `Math.min(clientWidth, innerWidth)`; geprüft mit PC-Zoom 1920×1080 (Blase vorher bis 1439, jetzt bis 1351 bei 1366). **Neuer Code: nie `clientWidth`/`clientHeight` von `documentElement` für die Fensterbreite nehmen, `innerWidth` nutzen.**
- Grüner Tutorial-Haken bleibt links an seinem Kopfleisten-Platz (`#tutHaken.fest` bekommt left/top aus der ursprünglichen Lage).
- Nicht nachgestellt: Bürste in Tutorial 1.8 (mit PC-Zoom-Test unklar, Test-Maus bewegt sich dort nicht), blauer Rahmen 5.2 (Ring sitzt im Test passend), blauer Strich oben.

### v849 (Claude Pro, 25.10.)
- Fellmuster (Tigerschecke, Overo-Linien, Sabino-Rand, Birdcatcher …) rutschen nicht mehr, wenn das Pferd den Kopf senkt: `sMinX`/`sMinY` in pferd.js (fester Rahmen statt Pferde-Box, die am Kopf hing; auch die Zufallsfolge hing daran). Tiger-Punkte ×1,25 (größerer Rahmen).

### v848 (Claude Pro, 25.10.)
- Beim Putzen/Waschen kein Hinweisfeld und kein „✋ aufhören“ mehr (`#bxUnten`/Kreis); beendet wird über die Mitte des Kreises (✕). Der Erklärtext, der entfiel: „👆 <Werkzeug> – mit dem Finger / gedrückter linker Maustaste über das Pferd wischen“. Fortschrittsbalken im Bild bleibt.

### v847 (Claude Pro, 25.10.) – Zwischenstand Aufnahmen 9 und 1
- **Fertig:** Neuer Hof startet immer mit Reitplatz und Gelände (`neuesSpielAnlegen`: `anlage` fest, vorher erbte er die Anlagen des Tutorials); „Futterexperte fragen“ bei Anfängern weg; Erklärtext beim Putzen/Waschen weg (nur „✋ aufhören“, Fortschrittsbalken bleibt); „Mir geht’s nicht gut“-Blasen aus (`BX_DENKBLASE = false`, Tests angepasst); Tutorial: Mitarbeiter versorgen auch Pferde, die mitten am Tag einziehen (`tutPersonalVersorgt`); Whiteboard/Boxnummern: Anbauten zählen zum Hauptstall (`gebWurzel`).
- **Noch offen:** Tutorial-Texte kürzen (alle drei Tutorials, Schlüsselwörter fett – Dome 25.10.: „alle“); Plan Tutorial-Umbau („erst tippe auf xy, dann Erklärung“, Hofplan-Bedienung mit Kreissymbolen erklären – Dome: „plane ihn“, noch nicht geschrieben); Blasen ragen rechts über den Rand (Tutorial 1.6/1.8/11.1, nicht nachgestellt); Bürste im Tutorial 1.8 registriert nicht; blauer Rahmen zu groß (5.2); grüner Haken rechts statt links (Kap. 10); Fellmuster (Tigerschecke/Appaloosa) wandern beim Kopfsenken (in pferd.js: Punkte hängen an der Körper-Box, `punkte(minX, maxX, minY …)`); blauer Strich oben zwischen Box und Kopfzeile; Kapitel wiederholen setzt Box/Lager zurück; „Sarkoid“-Text mit ⚠️ im Tierschutz (Anzeichen erklären); Hinweis „zur Box?“ nach Kauf außerhalb des Tutorials; „Ich kann mein Pferd nicht putzen“ (Fips, nicht nachgestellt).

### v846 (Claude Pro, 25.10.)
- Hälse normaler Länge (Rassen mit `neck` ≥ 0,52) 10 % kürzer (`HALS_KURZ` in pferd.js, Dome wählte die Mitte der Vergleichsbilder); kurze Hälse, Fohlen-Faktoren, Fress-Animation und Müde-Haltung unverändert; Enzyklopädie-Halsformen (eigener `k.neck`) unverändert.
- **Offen aus Aufnahme 9 (Trollhof) und Aufnahme 1 (Ponny-Pension):** Fragen an Dome: Start-Reitplatz, Tutorial-Texte kürzen (Schlüsselwörter fett), „Futterexperten fragen“ bei Anfängern, Putz-Hinweisbalken weg; eindeutige Fehler (Text über dem Rand in Tutorial 1.6/1.8/11.1, blaue Rahmen zu groß 5.2, grüner Haken rechts statt links Kap. 10, Stallbursche fehlt Kap. 7/11, Fellmuster rutscht beim Kopfbewegen, blauer Strich oben, „Mir geht’s nicht gut“-Blasen entfernen, Anbau-Ställe in der Whiteboard-Liste als eigene Boxenställe, Kapitel wiederholen ändert die Box).

### v845 (Claude Pro, 25.10.)
- Leckerli (Domes Vorschlag 2): Tüte mit Möhre am rechten Boxrand (`#leckTuete`, alle Boxstufen), antippen → Fenster `leckFenster` (Möhre/Leckerli mit Vorrat, Zähler, bleibt nach dem Geben offen). Regeln unverändert (3 am Tag, Betteln). Alte Leckerli-Karte nur noch in der alten Ansicht. Test `tests/leckerli-test.js` (3 Ansichten grün). Offen: Dome fragen, ob Möhre und Leckerli verschieden wirken sollen (wirken gleich).

### v844 (Claude Pro, 25.10.)
- Klemmbrett: jeder Klick führt dorthin, wo man die Aufgabe erledigt (getestet, auch die leuchtende Stelle im Bild). Termine kurz mit Info-Knopf.

## v843 (Claude Pro, 25.10.)
- Versorgung · Heute aufgeräumt (doppelte Zeilen raus), Termine auf dem Klemmbrett. Offen: Platz für Leckerli (Vorschläge an Dome), Tierarzt-Symbol (Dome überlegt noch). Tutorial-Spieler nicht gelaufen (Regel: nur mit großem Test) – Schritt „Fütterung heute“ geändert.

## v842 (Claude Pro, 25.10.)
- Pferdeköpfe im Plan (Orte und Hofplan) immer 2 × 2 Kacheln groß.

## v841 (Claude Pro, 25.10.)
- Ringe oben öffnen draußen dasselbe wie in der Box, mit „Zurück in die Box“ oben im Fenster. Klemmbrett ohne Bildcode bei „Pflege“.

## v840 (Claude Pro, 25.10.)
- Whiteboard: „heute vergessen“ verschwindet, sobald die Box versorgt ist.

## v839 (Claude Pro, 25.10.)
- Weiden werden täglich abgeäppelt (Dome: „mach das“): je Mitarbeiter eine Weide am Tag in der Morgenrunde, vorher höchstens alle halbe Jahreszeit und nachts.
- Offen: Antwort zum Tierarzt-Symbol (direkt „Tierarzt rufen?“), Hals von Paul (Aufnahme mit „Fehler melden“ erbeten).

## v838 (Claude Pro, 25.10., Domes Aufnahme 8)
- Whiteboard-Übersicht meldet nicht versorgte Boxen (Heu, Futter, Wasser, Misten) jetzt auch bei Pensionspferden.
- Sandpaddocks werden morgens gemistet (vorher nachts, danach kam neuer Mist dazu). Weiterhin je Stallbursche/Azubi ein Sandpaddock am Tag (Domes Regel v664).

## v835/v836 (Claude Pro, 25.10.)
- v835 Hals-Verlängerung bei müder Haltung entfernt → Dome: war richtig, in v836 zurückgenommen. Stehend ist der Hals seit v723 unverändert (Vergleich v722/heute); was Dome bei Paul als zu lang sieht, ist noch unklar (Aufnahme mit „Fehler melden“ erbeten).
- **Offen, Antwort von Dome nötig:** (1) ~~Denkblase bei chronischen Befunden~~ → **erledigt v837** (Dome: ja). (2) Tierarzt-Symbol, Befund-Plakette und Gesundheits-Ring öffnen dasselbe Fenster – Vorschlag: Tierarzt-Symbol fragt direkt „Tierarzt rufen?“.

## Sitzung 25.10. Nachmittag (Claude Pro) – Auftrag Dome, Stand v834, alles auf `main`
| Teil | Stand |
|---|---|
| Hals bei Fress-Animation nicht mehr länger | ✅ v830 (kurze Hälse erreichen den Boden nicht ganz) |
| PC-Ansicht fest (ab 1366×768 als Ganzes vergrößert) | ✅ v831 |
| Box → Orte: Karte zoombar (Mausrad, zwei Finger, + / − / Ganz) | ✅ v832 (hochkant bleibt Kacheln – Dome: so lassen) |
| Tutorial auf die neue Box-Ansicht (alle drei Tutorials, Schritt „Karte zoomen“) | ✅ v833/v834 |
| Großer Test (`BILDER=fehler`) | ✅ etappen-test „alles ok“, hof-gesamttest Fehler [], neuladen-test „alles ok“, 0 Fehlerbilder |
| Tutorial-Spieler | ✅ anf 1366×768 / 844×390 / 390×844 (Bilder nur anf, Scratchpad), fort 1366×768 + 390×844 + 844×390, exp 1366×768 + 844×390 + 390×844 – alle drei Tutorials in allen drei Ansichten grün |

**Behoben nebenbei:** in `tutKapitel` verschluckte ein Kommentar mitten in der Zeile das Zurücksetzen zu Kapitelbeginn (Box 1, Reiter, Putzen) – seit v639.
**Offen / zu fragen:** Update-Fenster (Änderungen ab v829 unveröffentlicht, nur auf Domes Ansage); Optik der Fress-Haltung bei Shetty/Haflinger (Kopf zwischen den Vorderbeinen, Maul nicht ganz am Boden) – Dome ansehen lassen.
**Autostart 15:05** hat gefeuert und ist erledigt (kein weiterer Wecker).

### Sitzung 25.10. (Claude Pro, Opus) – Auftrag von Dome, Start 10:05
Die Nachrichten von Claude Team (v805–v824) sind übernommen und hier gelöscht – Details stehen je Version in `CLAUDE.md`.
**Auftrag:** (1) Boxansicht mobil, alle Etappen · (2) Weihnachtsgeld · (3) Aufzucht-Offenstall · danach testen: neue Symbole am PC (auch Pferde/Pensionspferde auf Weide/Sandpaddock), Krankheitsmeldungen bei Pensions- und eigenen Pferden. Fragen sammeln, am Ende gesammelt geben (`OFFENE-FRAGEN.md`, Abschnitt „Sitzung 25.10.“).

| Teil | Stand |
|---|---|
| Boxansicht mobil (hochkant + quer, Fenster, Kreise, Putzkiste, Orte-Kacheln) | ✅ v825 |
| Weihnachtsgeld (`PLAN-WEIHNACHTEN.md` D) | ✅ v826 (A–C nicht beauftragt) |
| Aufzucht-Offenstall (`PLAN-OFFENSTALL.md` 1–3) | ✅ v827 |
| Test Symbole PC (Weide/Sandpaddock, Pension) | ✅ v828 – 105 ✓; Fehler gefunden und behoben: Plaketten öffneten am PC nichts |
| Domes Antworten 25.10. (v829) | ✅ Admin „Test“ im Ausrüstungs-Kreis · Offenstall-Gruppe je angefangene 5 Pferde = 1 Box · Brief: Knopf „Besitzer informieren“ + Ort statt Box bei Pferd draußen · Denkblase auch draußen · Update-Fenster 25.10. |
| **Als Nächstes** | Tutorial auf die neue Box-Ansicht umstellen (Dome: danach großer Test mit **alle Bilder** + Tutorial-Spieler – erst auf ihr „Los“) |
| Test Krankheitsmeldungen (Pension/eigene) | ✅ v828 – `krankmeldung-test` 17 ✓ in PC, hochkant, quer |
| Tutorial-Etappe der Boxansicht | wartet auf Domes Ja (nur mit großem Test) |

**Nicht gelaufen:** große Tests (etappen-, hof-gesamt-, neuladen-test) und Tutorial-Spieler – nur mit Domes Ja und Bilder-Variante. Kleine Tests dieser Sitzung grün: boxmobil (5 Größen), boxfenster, boxfenster-alle, boxansicht, weihnachtsgeld, offenstall, krankmeldung, pension-krank, krankheiten, hofplan, flaeche, bauen-komfort, anbau, orte, kamm, hinweise, whiteboard, berufe-popup.
**Offene Fragen:** `OFFENE-FRAGEN.md`, Abschnitt „Sitzung 25.10.“. Update-Fenster vom 25.10. (v828-Stufe) ist veröffentlicht (Box-Ansicht, Namensschilder, Weihnachtsgeld, Hufrehe, Schulden, Whiteboard kopieren, Pferd holen).
**Start der nächsten Sitzung (Stand v829, alles auf `main`, nichts uncommittet):**
1. Nächste Aufgabe: **Tutorial auf die neue Box-Ansicht umstellen** (Tutorial läuft noch mit der alten Ansicht: `boxNeuAn()` ist im Tutorial aus, Ziele wie `[data-r="merkmale"]`, `[data-putz=…]`, Reiter unter dem Bild). Sie wird erst gebaut, wenn Dome es ausdrücklich sagt (sie hat mit „Ja, alle Bilder“ für den großen Test geantwortet, aber noch kein „Los“).
2. Danach, ebenfalls erst auf Domes „Los“: großer Test (`etappen-test`, `hof-gesamttest`, `neuladen-test`) mit `BILDER=alle BILDER_ORDNER=<Scratchpad-Ordner>` und Tutorial-Spieler (anf 390×844, 844×390, 1366×768, nie parallel).
3. Update-Fenster: `NEUES_STAND` = 828, nächste Änderungen ab v829 sind unveröffentlicht (nur auf Domes Ansage).
4. Fragen von Dome in dieser Sitzung sind alle beantwortet und umgesetzt (siehe `OFFENE-FRAGEN.md`).
5. Version hochzählen mit 5 Stellen (`SPIEL_VERSION`, 6× `?v=`, `version.json`); jede Skriptänderung mit `new Function` prüfen; Kommentare nie mitten in einer Zeile.
**Achtung:** Handy-Tests der Box brauchen `localStorage["zuchtstall-boxfenster"]` (sonst alte Ansicht unter Playwright) – `tests/boxmobil-test.js`.

---

### (Ältere Nachricht, Stand v722)

**Von:** Claude Team · **An:** Claude Pro (oder neue Team-Sitzung) · **Stand:** v722, 23.10.2026

### Sitzung 23.10. (Abend) – v708–v722, alles auf `main`
Domes Wünsche zu Whiteboard, Mitarbeitern, Waschplatz/Solarium sind umgesetzt (Details je Version in `CLAUDE.md`):
| Thema | Version |
|---|---|
| Seitenrand ⅓ kleiner, Pacht-Zäune verschmelzen, Weide-Tritt/Matsch | v708–v713 |
| Whiteboard: Boxen/Weiden-Plan je Jahreszeit, Holzrahmen, Geschlecht, Chips mit ✕ (auch Pension), Übersicht als Bildschirmfoto/„Noch offen“-Liste | v703–v722 |
| Mitarbeiter-Avatare (Dome-Blatt `avatare.js`) in hvw, Whiteboard, Briefen | v715/v716 |
| Pension Waschen/Solarium geprüft + Fehler behoben (Aufgaben, Abrechnung, Pfleger nötig), Pferdeshampoo mit Glanz, Wäsche vergessen ärgert Besitzer | v716–v718 |
| Wünsche an die Mitarbeiter je eigenem Pferd (Haken im Whiteboard), Shampoo-Kauf in der Futterkammer | v719 |
| Box-Ansicht Weide aufgeräumt, Weide/Sandpaddock nur per Whiteboard (ab Fortgeschritten), Mitarbeiterfotos nach Platz | v720 |
| Sattelkammer ausgegraut, Whiteboard-Navigation (Stall → immer Übersicht, „‹ Whiteboard Übersicht“) | v721/v722 |
| Rahmenfarbe verrät die versteckte Chemie nicht mehr (orange = gestern gestritten, rot = 3× gestritten) | v722 |

**Offene Fragen an Dome:** alle beantwortet (Dome, 25.10.).

**Nachtrag (gleiches Konto, Sitzung 23.10. spät) – v723:** Fress-Animation (Heu → Kopf zum Boden mit Grasestellung der Beine, Kraftfutter → Kopf zur Krippe, nacheinander; Weide: Pferde grasen ab und zu ~30 s), Whiteboard-Weiden mit größerer Schrift. Test `tests/fress-test.js` grün in 3 Ansichten. Offen/zu fragen: Animation auch bei matten Pferden (waagerecht/tief)? Grasen am Hofplan/Ort-Koppel? v724: matte Pferde fressen aus ihrer Haltung, 40+40 Mitarbeiter-Namen. **Offen:** Dome will die Schimmel-Anlagen (`ex.grauTempo`, `kurve`, `maehne`) in Seltenheit und Raritäten-Markt – Vorschlag mit Zahlen liegt bei ihr, Antwort abwarten.

**Nachtrag v729:** Scheckung „fast weiß“ ist eine Seltenheit und kommt auf den Raritäten-Markt (Details bei v729 in CLAUDE.md). **Nachtrag v726:** Schimmel-Anlagen als Seltenheit + Raritäten-Markt (Kombination „weiß mit 18 J. / bleibt dunkelgrau / Mähne früh weiß“, ab v728 nur noch die komplette Kombination, ≈ 1,6× pro Marktjahr, `RAR.schimmel` regelt es; Fellfarben-Test zeigt die Anlagen; Anteile selbst gesetzt), Zaun-Abgleich (Weide 5 ha vs. Bauen 4 ha), Whiteboard-Schrift, „Noch offen“ bei überlasteten Mitarbeitern. Projekt-Chat-Thema 25 (Hofplan als Raster) eingetragen, Dome erklärt noch. Update-Fenster: für v726 nichts veröffentlicht (nächste Auswahl ab v726).

**Hinweise für die nächste Sitzung:** `NEUES_STAND` ist jetzt 724 (drittes Update-Fenster nach Domes Auswahl, v725). Nicht ausgewählte Punkte nie wieder anbieten (Liste in CLAUDE.md bei v725), nächste Auswahl erst ab v725. Große Tests liefen heute nicht (nur kleine Tests + Tutorial-Spieler fort 390×844 grün). `version.json` war seit v708 leer (behoben v716) – beim Hochzählen immer `echo '{ "version": "NNN" }' > version.json` benutzen, nie `open(..., 'w')` vor dem Lesen.

---
### Protokoll (Details je Version, chronologisch)
**Tutorial-Überarbeitung nach Domes Test von v597 (Etappen A–D inzwischen alle fertig, siehe oben; Einzelheiten):**
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
- **Fertig in v612:** leeres Heunetz in der Stufe-3-Box wird durchsichtig und schlaff gezeichnet (CSS `#stall.leer .sHeunetz`, Screenshot geprüft in 844×390). **Noch offen:** Kraftfutter-Krippe Stufe 3 „wie Stufe 2“ (Dome) – unklar, welches Aussehen gemeint ist (Stufe 3 hat einen hängenden Futtereimer); Pferde-Sprechblase im Tutorial bleibt bis gelesen; Infofeld nach Turnier-Nennen; Steckbrief/Daten/Merkmale im Tutorial erklären.
- **Fertig in v613:** Kraftfutter in der Stufe-3-Krippe als exakt dieselbe Futter-Ebene wie in Stufe 2 (`heuBerg` aus index.html in `boxstufen.js` kopiert, Klasse `sFutter`, Krippe unverändert, v614, verschwindet bei `kraftLeer`). Damit ist der Punkt „Krippe/Heunetz Stufe 3“ erledigt.
- **Fertig in v617:** Anfänger-Kapitel 1: Steckbrief-Schritte erklärt (neue Info-Schritte „Daten“ und „Was steht in Merkmale?“, „Merkmale“-Schritt gibt beide Reiter `steckbrief`/`merkmale` frei). Tutorial-Spieler anf 390×844 und `tutorial-test` grün. **Noch offen (klein):** Pferde-Sprechblase im Tutorial bleibt bis gelesen (unklar, welche Blase gemeint ist – Stall-Sprechblasen sind im Tutorial seit v577 aus), Infofeld nach Turnier-Nennen, Kamm-Auslöser.
- **Fertig in v618–v620:** Husten-Sprechblase im Tutorial-Kapitel „Krankes Pony“ bleibt, bis sie angetippt wird (`reaktionZeigen`, nur in diesem Kapitel; `#sprechblase` in `TUT_IMMER`; Kapitelstart zeigt „hustet ab und zu“). Kamm zählt nur über Mähne (`.maehnePfad`, neu in pferd.js) und Schweif (`.schweif`) plus 14 px Rand, sonst alte Zonen als Rückfall (`wischBewegen`). Tutorial-Spieler anf 390×844 grün. **Zurückgestellt (Dome 20.10.):** „Infofeld nach dem Turnier-Nennen, das immer wiederkommt“ – keiner der vier Kandidaten (Reiter-LK-Text, „Prüfungen ausgeblendet“, Einsteiger-Tipp, Nennen-Warnung) ist das gemeinte Feld; Dome liefert später einen Screenshot, Kamm-Zone auf dem Handy gegenprüfen.
- **Fertig in v621 (Etappe B, Teil 1):** Tutorial-Pferde in Kap. 3 und 4 zu Kapitelbeginn versorgt (`tutVersorgt`: Heu, Futter, Wasser, Mist, Einstreu Späne); `tutLagerFuellen` füllt auch Späne (30 kg) und legt die Einstreu der Boxen fest (sonst öffnete sich das Einstreu-Auswahlfenster schon in Kap. 1); Kap. 2 „Richtig füttern“: neuer Schritt „Einstreu in den Korb“ (20 kg Späne, Lager hat nur 3 kg für eine Nacht, Schritt VOR „Einkaufskorb“). Tutorial-Spieler anf 390×844 grün. **Etappe B noch offen:** Kap. 3 über zwei Tage mit Hustensaft (Pferd lehnt einmal ab), Bereiter-Satz Kap. 4, Kap. 5 Pferdevorschau im Brief + „Zwei Pferde“ + volle Versorgung, neues Hauptmenü-Kapitel, Mitarbeiter ohne Einschränkung, Boxstufen nach Dritteln (Dome: alle Schritte mit sichtbarer Box in drei gleiche aufsteigende Drittel).
- **Fertig in v622 (Etappe B, Teil 2):** Kap. 3 „Krankes Pony“ läuft jetzt über zwei Tage: Tierarzt → Brief → „Nächster Tag“ (Husten heilt nicht von selbst, `heilt` wird per Schritt-Hook gehalten) → Versorgung → Fütterung heute → Futterkammer → Hustensaft kaufen (Stallapotheke in der Futterkammer; Medizinkiste ist im Ausrüstungs-Reiter nicht erreichbar) → zurück → Geben (Medikamente geben → Hustensaft → Dosis; beim ersten Mal wehrt sich Krümel: `p.tutWehr` in `behandeln`) → Info „Wenn sich das Pferd wehrt“. `fertig: () => false`. Tutorial-Spieler wartet bei mehrstufigen Schritten länger (`gleich > 9`). Tutorial-Spieler anf 390×844 grün (nicht getestet: fort, 844×390, 1366×768). **Etappe B noch offen:** Bereiter-Satz Kap. 4, Kap. 5 Pferdevorschau im Brief + „Zwei Pferde“ + volle Versorgung, neues Hauptmenü-Kapitel, Mitarbeiter ohne Einschränkung, Boxstufen nach Dritteln.
- **Fertig in v623:** Überbleibsel „Medizinkiste“ im Ausrüstungs-Reiter entfernt (Dome: kann weg; Stallapotheke ist seit v259–v267 in der Futterkammer): Programmzweig `medModus`, `apothekeHTML`, Klick-Handler `#medKachel`/`#medZurueck`/`[data-apokauf]` in der Akte. Stallapotheke in der Futterkammer (`apothekeKammerHTML`) unverändert. Tutorial-Spieler anf 390×844 grün.
- **Fertig in v624–v626 (Etappe B, Teil 3):** Anfänger-Kap. 4 „Training“: Texte „Du und dein Pferd“ und „Bereiter“ verständlicher (Bereiter = Mitarbeiter, den man später einstellt). Kap. 5 „Pension“: Stern im Brief anklickbar (S[5] `[data-stern]`), neuer Info-Schritt „Pferd vorab ansehen“, Schritte „Zur Box“ und „Was du für den Einsteller tust“ (Klickschritte Heu/Futter/Wasser/Misten gingen nicht: bei Pensionspferden macht der Besitzer alles Ungebuchte, `pensionDarf`), `fertig: () => false`. Tutorial-Spieler anf 390×844 grün. **Etappe B noch offen:** „Zwei Pferde“ ins Pension-Kapitel (Dome: Tut 11 kann bei Tut 5 mit rein), neues Hauptmenü-Kapitel zwischen Pension und Mitarbeiter (Gnadenhof, Friedhof, alle Hofverwaltungs-Karten), Mitarbeiter ohne Einschränkung auf einen Stallburschen/anderen Mitarbeiter anschauen, Boxstufen nach Dritteln (alle Schritte mit sichtbarer Box in drei gleiche aufsteigende Drittel).
- **v627 / Fund beim Pension-Kapitel:** Dome: Heu, Kraftfutter und Wasser füllt sie bei Pensionspferden selbst auf (stimmt: `#heuhaufen`-Handler hat keine `fremd`-Sperre) – der Text im Info-Schritt „Was du für den Einsteller tust“ ist korrigiert. **Warum die Klickschritte hingen:** Im Tutorial bleiben Pferde früherer Kapitel in den Boxen stehen (beim Pension-Kapitel: Flocke in Box 1 Stufe 3, Krümel in Box 2), `tutPensionBox()` fand Flocke statt des Einstellers und der Einsteller stand ggf. in einer anderen Box. Für Klickschritte beim Einsteller müssen die Boxen zu Kapitelbeginn geleert werden (`spiel.boxen` zurücksetzen) und `[data-zubox]` die Einsteller-Box treffen. Tests: `tests/tutorial-spieler.js` hat bei `LAUT=1` nun eine Zusatzausgabe „Heu-Zustand“ beim Schritt „Heu“.
- **v628 (Dome-Spielstand: Pensionsanfrage angenommen, Box „reserviert“, Pferd zog nie ein, nicht kündbar, nicht sichtbar):** Ursache unbekannt (Spielstand nicht vorhanden – Dome schickt ggf. „Spielstand downloaden“-Datei). Verdacht: Reservierung `b.reserviert` ohne passende `spiel.pensionAnfragen`-Eintrag (`angenommen`) bzw. ohne Pferd in `spiel.extern`. Reparatur: `pensionAnfragenTag()` (nachts) gibt verwaiste Reservierungen frei. Test `tests/reservierung-test.js`. Falls die Anfrage noch existiert, aber nie einzieht: `pensionEinzug` (Bedingung `a.angenommen && a.tag < spiel.tag`, `pensionZielBox`, Ausnahme im forEach) mit dem Spielstand untersuchen.
- **Entscheidung Dome (20.10.):** Boxen zu Kapitelbeginn im Tutorial NICHT leeren – bleibt so (Pferde früherer Kapitel stehen weiter in den Boxen). Daher keine Klickschritte für das Pensionspferd; der Info-Schritt im Pension-Kapitel reicht.
- **v629 (Dome-Spielstand, Fortsetzung):** Nachtliche Bereinigung (v628) hat nicht geholfen → die Anfrage existiert noch, zieht aber nicht ein. Neuer Knopf „🔓 Reservierung aufheben“ in der leeren reservierten Box (`reservierungHaengt`: keine angenommene Anfrage dazu oder seit > 2 Tagen angenommen; löscht Anfrage + Reservierung). Ursache weiterhin unbekannt – Spielstand/Box-Text von Dome erbeten (siehe `pensionEinzug`). Test `tests/reservierung-test.js` (9 Prüfungen).
- Hinweis: `tests/tutorial-test.js` erwartet, dass nach der ersten Blase Schritt „Heu geben“ kommt – Reihenfolge der ersten Kapitel-1-Schritte nicht verschieben. Phase D (großer Test) wartet weiter auf Domes „weiter“.

---

**v809 (Claude Team, 24.10.):** Mietpreise (Abfohlbox, Beritt, Aufzucht fremd) wie von Dome angenommen. Großer Test mit BILDER=fehler: Etappen-Test 351 ✓, Neuladen-Test 7 ✓. Offen: Makler-Bauland-Anteil bleibt vorerst, Zeitmaßstab/Löhne/Pension = Projekt-Chat, Update-Fenster nur auf Domes Ansage.

**Zeitmaßstäbe (Dome 24.10.):** Idee, Kredit/Unterhalt/Pacht auf 7 Tage umzurechnen, abgelehnt. Alles bleibt wie es ist.

**v810 (Claude Team, 24.10.):** Sandpaddock-Preise auf echte Werte (6.000/15.000/30.000 €). sandpaddock-test grün.

**v811 (Claude Team, 24.10.):** Sandpaddock-Preise halbiert (3.000/7.500/15.000 €). sandpaddock-test grün.

**v812 (Claude Team, 24.10.):** Pension-Richtwerte 200/400/1.000 (Paddockbox 250/500/1.250); alte Spielstände stille Anhebung (`R.anpassV` 2) + Update-Fenster Stufe 7 (NEUES_STAND 811). Tests neues-popup, pension-paddock angepasst.

**v813 (Claude Team, 24.10.):** Zeile „Einnahmen“ in hvw – Hof – Pension entfernt. Offen: Aufzucht-Offenstall mit 10/25/50 Plätzen (Vorschlag Preise 15.000/40.000/90.000 €) wartet auf Domes Ja.

**Plan Offenstall (Claude Team, 24.10.):** `PLAN-OFFENSTALL.md` geschrieben (nur Plan, nichts gebaut). Nächster Schritt: Dome beantwortet die 4 offenen Fragen und sagt Ja, dann Etappe 1.

**Plan Offenstall (24.10.):** Dome-Antworten eingetragen (Nachfrage gleich, Arbeit je Gruppe, keine alten Spielstände betroffen). Noch kein Bau-Ja.

**Plan Offenstall (24.10.):** Gruppeneinteilung von Dome bestätigt, Bau auf später verschoben – nicht anfangen, bis Dome Ja sagt.

**Plan Boxansicht (Claude Team, 24.10.):** `PLAN-BOXANSICHT.md` + Bilder `entwuerfe-boxansicht/` (Gesamtentwurf 9.x, wo steckt was 10.x). Dome hat die Entwürfe gebilligt („ja“), Bau aber noch nicht freigegeben. Nächster Schritt: Dome klärt Punkte 1–3 im Plan und sagt Ja zu B1.

**Plan Boxansicht (24.10.):** Beschlüsse ergänzt: Besitzerwünsche ohne Hufschmied, mit Zusatzleistungen; Fenster dürfen scrollen; **Bau-Reihenfolge PC → mobil → Tutorial**; Reitplatz mit 5 Besitzern (Bild 11); Stufen-Tabelle als Vorschlag.

**Plan Boxansicht (24.10.):** Reitplatz-Darstellung 11.1/11.3 gebilligt, 11.2 (Liste beim Antippen) abgelehnt. Dome hat auf Opus gestellt; Bau-Ja für B1 (PC) und Antworten zur Stufen-Tabelle stehen noch aus.

**v814 (Claude Team, 24.10.):** Frühling + Hufrehe-Gefahr → Pensionswunsch Sandpaddock statt Weide (Anzeige, Plan, Stallbursche, Whiteboard-Hinweise). Test rehe-wunsch-test grün. Als Nächstes: B1 Boxansicht am PC (Dome-Ja).

**v815 (Claude Team, 24.10.):** Boxansicht B1 am PC (Symbole am Rand, Ringe, Plaketten, Denkblase). Test boxansicht-test grün in 3 PC-Größen; kleine Tests stichprobenartig grün (reiter-/spielstand-test je einmal zufällig rot, Wiederholung grün). Wartet auf Domes Test, dann B2.

**v816 (Claude Team, 24.10.):** Offene Pensionsrechnung bleibt nach dem Auszug bestehen (Mahnungen, dann Inkasso). Zahlen selbst gesetzt: 50 % Zahlung je Mahntermin, Inkasso 60 % Erfolg × ½ Betrag.

**v817 (Claude Team, 24.10.):** Whiteboard-Kopieren der Jahreszeit-Einteilung. Plan `PLAN-WEIHNACHTEN.md` (A–D) geschrieben, wartet auf Domes Ja. Offene Frage v816 erledigt (Dome: passt).
