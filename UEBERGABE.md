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

**Von:** Claude Team · **An:** Claude Pro · **Stand:** v489, 19.10.2026

Hallo Claude Pro! Riesige Sitzung mit Dome (v458–v489), alles auf `main`, Details in CLAUDE.md (je Version ein Punkt).

### Wichtigste Änderungen
- **Zoom:** Handy = Standbild (Canvas) + CSS-Zoom in Rassenansicht und allen Steckbrief-Bildern; PC = Rassenansicht sofort scharf (Vektor), Steckbrief CSS ohne dauerhaftes will-change. Dome: läuft jetzt gut.
- **Rassenansicht:** Farbliste ergänzt sich automatisch aus den Genen (`ansichtFarben`, ab 0,25 %); Schimmel/Apfel-/Fliegenschimmel sind **Muster** über der Grundfarbe (je 3 Stufen, ans Alter angepasst); ohne Abzeichen/Mehlmaul (außer Scheckungs-Weiß); Alter 1 Tag, ½, 1, 1½, 2, 3 …; Varianten durchschalten (Sommerrappe Sommer-/Winterfell, Glanz, Glanzäpfel, Birdcatcher-Stufen …).
- **Rappen (Dome):** Sommerrappe im Sommer schwarz, im Winterfell ausgeblichen; Winterrappe umgekehrt. Nicht wieder ändern!
- **Neue Farben/Merkmale:** Rußfalbe, Dunkelbrauner/-fuchs mit Ruß oben, Glanzäpfel, Tekkiner Gold/Silber/Bronze/Perl (alles vererbt), Kupfer um Augen/Flanke bei Schwarzbraunen, Alterszeichen bei Senioren (Platzhalter), Fliegentupfen auch im Gesicht.
- **Dome-Grundsatz:** Nichts auswürfeln, alles vererben (Ausnahme dunkler Brindle = Chimäre). Neue Merkmale als Anlage in `EX_GRENZEN` + `anl()`.
- **Gene korrigiert:** Friese nur Rappen, Andalusier Cr 0,02, Tekkiner ohne Falb-Gen.
- **Kopf-Übergänge:** Kopf hat dieselben Schatten-Schichten wie der Hals, Ohren +13 % Weiß (bis Dome eigene Glanz-/Schattenflächen zeichnet → dann entfernen, Inkscape-Liste Punkt 0).
- Enzyklopädie – Fellfarben enthält alle neuen Farben/Muster (`lex_*`, v485/v486) – neue Farben immer dort mit eintragen.
- `kopf-export.js` übernimmt in Inkscape ausgeblendete Ebenen (Dome lässt beim Zeichnen Ebenen aus).

### Offen – zuerst erledigen: Kante Ohr/Kopf (Dome, 19.10.)
- Dome sieht am Ohransatz noch eine Kante (Ohr heller/dunkler als der Kopf), v. a. bei Ruß-Farben (Dunkelbrauner, Rußfalbe). Ohren bekommen bisher nur eine feste Aufhellung (`farbeOhr` in pferd.js: `o.ohrFell` bzw. Fell + 13 % Weiß), der Kopf dagegen die Schicht `schatt` (sh-Verlauf, Glanz `mt-`, Rußanflug `C.russ` 0,45, Kehlschatten).
- Versuch (verworfen): `schatt` per Maske aus der Ohrform über die Ohren legen – das `sh`-Rechteck reicht oben nicht bis in die Ohrspitzen (Querstreifen) und die Ohren wurden zu dunkel. Wenn wieder: Rechteck für die Ohren nach oben erweitern (y bis ca. minY − 0,5·H) und Umrisslinien ausnehmen. Alternativ: Ohrfarbe aus denselben Schichten rechnerisch mischen (Fell → Ruß 0,45 → Weiß je nach Höhe).
- Mit Playwright an Tekkiner Rußfalbe/Dunkelbrauner/Palomino stark gezoomt prüfen.

### Offen / Inkscape (Dome)
- `BEI-INKSCAPE-BEARBEITEN.md`: 0 (Glanz-/Schattenflächen Köpfe), 0b (Alterszeichen), 0c (Kupferaugen), 1c (Keil-/Schafskopf stark), 4b (Grauaugen) …
- Dome geht Domes Test-Liste Punkte 1–7/12 je Rasse durch und meldet Fehler – weiter so je Rasse prüfen (Farben, Muster, Varianten).
- **Achtung Falle:** `//`-Kommentar mitten in Zeilen ist mir zweimal passiert – Kommentare nur ans Zeilenende oder `/* */`.
