# Auftrag: Waschplatz mit Wirkung und Pferdesolarium

**Stand:** 19.10.2026, im Projekt-Chat mit Dome geplant (Fragen 1–38), Code-Stand beim Planen v546–v548. Reihenfolge: W1 → W2 → W3 → W4 → W5 → W6. Bilder: siehe Abschnitt „Bilder“ (noch nicht einbauen, bis Dome sie freigibt).

**Wann umsetzen (Dome, 20.10.2026):** Nicht mitten in einer laufenden Etappe beginnen. Reihenfolge der Themen = wie sie hereinkamen: erst Bilanz (B4), Raritäten (R2–R4), dann **Waschplatz (dieser Plan)**, dann Hinweise/Stufen/Tutorials (`PLAN-HINWEISE.md`). Waschplatz/Solarium überschneidet sich kaum mit Bilanz und Raritäten. Je Etappe Sonnet reicht.

## Ist-Stand
1. Waschplatz ist baubar (`BAUTEN.waschplatz`, 300 / 500 / 800 €, `zeit: "kurz"`, `einmal: true`, 0,002 ha = 20 m², Pension-Bonus `AUSSTATTUNG.waschplatz` .02 / .03 / .05). Kachel „Waschplatz – Abspritzen“ steht in `plaetze` (Pferdepflege - Ort), **hat aber keine Funktion**.
2. Schmutz: `p.dreck = { fell, maehne, seit }`, `schmutzen(p, mistig)` jede Nacht, `putzen(p, womit)` (Bürste/Kamm), `dreckWert`, `wohlbefinden`, Marktwert −15 % (`dreckF`), nach einer Jahreszeit Dreck −3 % Gesundheit/Tag (`zuLangeDreckig`).
3. Krankheitsrisiken in der Nachtberechnung (um `index.html` Zeile 5110–5130, Stand v546): `mauke` (Schmutz ×1,5, Mist ×1,5, Matsch), `strahlfaeule` (`ausgekratztGestern` ×0,3), `hautpilz` (`dreck` ×2), `erkaeltung`/`husten` hängen an Jahreszeit.
4. Wetter: `wetterHeute()` (sonnig, wolkig, regen, nebel, schnee, klar), Jahreszeit `datum().s` (0 Frühling, 1 Sommer, 2 Herbst, 3 Winter).
5. Es gibt **keinen** Zustand „nass“ oder „verschwitzt“. Training verbraucht Energie (`T.verbraucht`), macht das Pferd aber nicht schmutzig.
6. Putzkiste (`putzen` mit Werkzeugen Bürste, Kamm, Hufkratzer, Streicheln) wird per Wischen mit dem Finger bedient (`w.tool`). Die Waschplatz-Ansicht soll genauso funktionieren.
7. Fohlenschau ist gebaut (`fohlenNoten`, Eindrucksnote), Fohlen-ABC ist gebaut (`fohlenABC`, `FOHLEN_ABC_MAX`).
8. Pferdepfleger: putzt jeden Morgen seine 3 Boxen; Einsteller buchen Bereiter-Tage (Muster für das Buchen).

## Entscheidungen (Dome, 19.10.2026)
### Abspritzen und Zustände
1. **Abspritzen:** Fell sofort sauber (wie Bürste), Mähne um die Hälfte besser, im Sommer Wohlbefinden +5. Das Wohlbefinden gibt es **nur einmal am Tag** zusammen für Putzen und Waschen (nicht doppelt).
2. **Zustand „verschwitzt“** (`p.schweiss`): nach Training, wenn an dem Tag mindestens 40 Energie verbraucht wurden; bei Hitze (Sommer, sonnig) und bei nervösen Pferden schon ab 30. Ohne Abspritzen/Abschwitzen: im Herbst/Winter Erkältungsrisiko ×1,5 über Nacht, sonst Fell zusätzlich +10 schmutziger. Schwellen sind Vorschlag, im Test feinjustieren.
3. **Jahreszeit und Wetter:** Sommer immer; Frühling/Herbst nur bei Sonne oder Wolken; Winter kein Abspritzen des ganzen Pferdes. Im Winter nur Beine und Hufe mit warmem Wasser (ab Waschplatz Stufe 2).
4. **Abtrocknen** nötig (Handtuch, Schweißmesser oder Solarium). Bleibt das Pferd nass: Mauke ×2 über Nacht, im Herbst/Winter Erkältung ×1,5. Im Sommer trocknet es von selbst. **Wird das Pferd abgetrocknet, ist es nicht mehr nass** (Dome).
5. **Hufe waschen:** entfernt Dreck, ersetzt nicht das Auskratzen. Waschen + Auskratzen am selben Tag: Strahlfäule ×0,3 wie bisher. Nur Waschen: keine Wirkung. Öfter als jeden zweiten Tag: Strahlfäule ×1,3.
6. **Mauke:** „Beine waschen“ löst die Krusten, danach wirkt die Wundsalbe besser (Heilung +0,2), aber nur wenn die Beine abgetrocknet werden. Ohne Trocknen schadet es.
7. **Hautpilz:** die Pilzwaschung (`APO.pilzmittel`) wird am Waschplatz angewendet, danach abtrocknen. Putzzeug bleibt Ansteckungsweg.
8. **Shampoo:** Wasser kostenlos, Shampoo optional (6 € je Flasche, 10 Anwendungen); Fell glänzt eine Jahreszeit, +2 % Marktwert wie Öl (`p.fellGlanz`).
9. **Wasserscheu:** hängt an Mut und Nerven. Gewöhnung (`p.wasserGewohnt`) braucht 3 Wäschen (ängstliche 5, also Mut oder Nerven tief); Wohlbefinden beim Waschen −3, −2, −1, dann 0. **Die Gewöhnung geht nie verloren** (Dome). Die Wäschen zählen **insgesamt**, sie müssen nicht hintereinander sein (Dome).
10. **Pro Tag nur 1× Waschen nötig.** Bei Kälte (Herbst/Winter) wird nach dem Waschen nur abgetrocknet „versorgt“, sonst Risiko wie in Punkt 4.

### Sperren
11. Nicht waschen bei Fieber, Erkältung, Husten, offener Wunde (Verletzung), Hufabszess (Verband), Kolik, Hufrehe im Schub, Klinik, auf Weide/Paddock (erst in die Box holen), außer Haus (Klinik, Aufzucht, Ausbildung). Meldung wie die anderen Sperren im Ort-Menü.

### Fohlen
12. Ab 1 Jahr voll. Fohlen bei Fuß nur Beine/Hufe. Im Fohlen-ABC kommt **„Duschen üben“** als Schritt dazu; es macht das Fohlen weniger scheu (Vertrauen/Nerven wie die anderen ABC-Schritte).
13. **Fohlenschau:** am Vortag gewaschen (Fell unter 20 = sauber) und „Duschen üben“ geübt: **+0,3 auf die Eindrucksnote** (`fohlenNoten`); schmutziges Fohlen **−0,3**. Am Turniertag selbst kann man nicht putzen/waschen, deshalb zählt der Zustand vom Vortag (über Nacht wird das Fell nur 9–15 Punkte schmutziger, bleibt also unter 20). Gilt für Schau und Championat.
14. Turniere und Verkauf: **kein Extra und kein Abzug** (am Turniertag kann man nicht putzen).

### Pferdepfleger, Einsteller
15. **Pferdepfleger wäscht deine Pferde mit:** nur in seinen 3 Boxen, nur bei verschwitzt oder Fell ab 50, nur mit Waschplatz, so viele Pferde pro Nacht wie Plätze (1 / 2 / 3), zuerst die verschwitzten. Pro Box ein- und ausschaltbar wie beim Putzen.
16. **Einsteller buchen Waschen (und Solarium) dazu** wie die Bereiter-Tage (Tage je Jahreszeit, Rechnung zu Beginn der nächsten Jahreszeit). **Preis pro Nutzung nach Stufe: Waschen 6 / 8 / 10 €, Solarium 3 / 4 / 5 €** (Stufe 1 / 2 / 3). Dome selbst zahlt nichts für Wasser und Strom.

### Waschplatz-Stufen
17. **Stufe 1:** 1 Platz, kaltes Wasser, im Winter gesperrt (Leitung eingefroren), Handtuch zum Abtrocknen.
18. **Stufe 2:** 2 Plätze, warmes Wasser (Boiler), frostsicher (im Winter Beine/Hufe), **Schweißmesser**.
19. **Stufe 3:** 3 Plätze, warmes Wasser, Schweißmesser-Station mit Heizlampen, Regendusche, **Beinkühlung (Kaltwasser-Gang)**: Aktion „Kühlen“ (gibt es schon) hilft gegen Sehnen-/Gelenkprobleme. **Wasserlaufband/Aqua-Training kommt hier nicht rein**, es wird später ein eigenes Gebäude (Dome): Punkt in `PROJEKT-CHAT-THEMEN.md`.
20. Plätze = Kapazität für Pferdepfleger und Einsteller pro Nacht (1 / 2 / 3). Dome wäscht immer eines nach dem anderen.
21. **Gummimatten auch am Waschplatz** (Dome: „gute Idee“): extra zu kaufen wie in den Boxen, **350 €, ab Stufe 2, einmal je Waschplatz** (Konstante wie `BODEN_WIRKUNG.GUMMI_PREIS`). Ohne Matten (nasser Boden) 1 % Chance je Wäsche, dass das Pferd ausrutscht und sich leicht verletzt (Verletzung klein, Risiko Vorschlag); mit Matten 0 % und Wohlbefinden +1 beim Waschen. Bilder mit Matten: `stufe2-gummi.svg`, `stufe3-gummi.svg`. Vorschlag, noch nicht von Dome bestätigt.
22. **Verfall:** wie andere Bauten; Zustand unter 40 % nur kaltes Wasser, bei 0 % gesperrt. Pension-Bonus wie bisher (Zustand unter 80 % mindert).
23. Stufen-Preise und Bauzeit bleiben (300 / 500 / 800 €, 2–3 Tage).

### Pferdesolarium (eigenes Gebäude, nicht Teil des Waschplatzes)
24. **Neues Gebäude `solarium`** in `BAUTEN`/`BAU_REIHE`/`BAU_WICHTIG`/`ANLAGE_NAME`/`PLATZ`/`AUSSTATTUNG`: 3 Stufen, **1.200 / 2.000 / 3.200 €**, 12 m² (0,0012 ha), Bauzeit 2–3 Tage (wie Waschplatz). Pension-Bonus Vorschlag .02 / .03 / .04. Stufe = Anzahl Pferde pro Nacht für Pfleger/Einsteller (1 / 2 / 3). **Dome kann es selbst nutzen.**
25. Kachel „Solarium“ steht neben „Waschplatz“ in Hauptmenü - Stall - Box - Pferdepflege - Ort (nur sichtbar, wenn gebaut, Admin immer).
26. **Wirkung:** trocknet nasse und verschwitzte Pferde sofort; 10 Minuten am Tag. **Winter 2× am Tag erlaubt** (vor dem Reiten zum Aufwärmen, nach dem Reiten): das Aufwärmen ersetzt Bodenarbeit/Longieren (kein −20 % „nicht aufgewärmt“, kein −3 Wohlbefinden). **Sommer 1× nach dem Training.** Zu oft schadet der Haut (mehr als 2× am Tag gesperrt).
27. **Je Anwendung Wohlbefinden +3.** Wurden an einem Tag **beide** Anwendungen (vor und nach dem Reiten) gemacht: Überlastungs-Lahmheit ×0,7 und Kreuzverschlag-Risiko ×0,5 (gegen Muskelkater und Verspannungen). Diese Zahlen sind Vorschlag.
28. Gleiche Sperren wie beim Waschplatz (außer Wetter und Jahreszeit); Fohlen bei Fuß nicht.

## Bedienung und Bild
1. Waschplatz-Ansicht **wie die Putzkiste** (Wischen mit dem Finger/der Maus), Werkzeuge: Schlauch/Brause, Schwamm, Schweißmesser (ab Stufe 2) bzw. Handtuch, Hufe, Shampoo. Rücksprung nach Pferdepflege - Ort. Das Pferd steht im Bild am Platz.
2. **Wassertropfen-Animation** beim Abspritzen; danach Fell dunkler und glänzend, **nur bis zum Abtrocknen** (Dome). Solarium: warmes Licht und etwas Dampf.
3. Alte Spielstände: neue Felder (`schweiss`, `nassBis`, `wasserGewohnt`, Solarium-Gebäude) fehlen = Standardwert, nichts geht kaputt.
4. Hinweisblase beim ersten Bau (siehe `PLAN-HINWEISE.md`, später), Enzyklopädie-Eintrag unter Berechnungen zum Nachschlagen (nur Admin; Zahlen dort ablegen).

## Bilder (noch nicht einbauen)
1. Entwürfe als SVG im Stil der Stallboxen (`boxstufen.js`, 400 × 300, Blick von vorne, Boden in Perspektive, Wand je Stufe). Das Pferd zeichnet das Spiel davor, die Räume sind leer.
2. **Wo die Bilder liegen:** im Repo auf dem Branch `entwurf-waschplatz-bilder`, Ordner `entwuerfe/waschplatz-bilder/` (je SVG plus PNG-Vorschau). Holen mit `git fetch origin entwurf-waschplatz-bilder` und `git checkout origin/entwurf-waschplatz-bilder -- entwuerfe/waschplatz-bilder`, dann mit auf `main` nehmen. Dateien:
   1. Waschplatz: `stufe1.svg`, `stufe2.svg`, `stufe2-gummi.svg`, `stufe3.svg`, `stufe3-gummi.svg`.
   2. Solarium: `solarium-stufe1.svg`, `solarium-stufe2.svg`, `solarium-stufe2-gummi.svg`, `solarium-stufe3.svg`, `solarium-stufe3-gummi.svg`.
3. Waschplatz-Bilder hat Dome gut bewertet; die Solarium-Bilder prüft Dome noch. **Erst nach Freigabe** in `boxstufen.js` (oder neue Datei `waschplatz.js`) übernehmen; bis dahin Platzhalter.
4. Solarium: Stufe 1 **eine Hängelampe wie in der Abfohlbox Stufe 3**, Stufe 2 **3 Hängelampen in einer Reihe** auf Kalkstein, Stufe 3 das große Lampenfeld mit 3 Reihen, Goldrand und Goldleiste. **Boden wie bei den Stallboxen** (`BOXSTUFE.boden`): Stufe 1 Sand, Stufe 2 Pflaster, Stufe 3 Beton. **Gummimatten müssen extra gekauft werden** (wie bei den Boxen, `gummiDialog`, `b.gummi`, ab Stufe 2). Matten im Solarium: **350 €, ab Stufe 2, einmal je Solarium, Wohlbefinden +4 statt +3 je Anwendung** (Dome 19.10.).

## Etappen
1. **W1 Zustände und Wirkung (mittel):** `p.schweiss`, `p.nassBis`, Abspritzen/Abtrocknen, Hufe/Beine waschen, Shampoo, Sperren, Risiken in der Nachtberechnung (Punkte 1–11), Wassergewöhnung.
2. **W2 Ansicht (mittel):** Waschplatz-Ansicht wie Putzkiste, Tropfen-Animation, nasses Fell als Filter, Stufenregeln (17–21), Platzhalterbilder.
3. **W3 Solarium (mittel):** Gebäude, Kachel, Wirkung (24–28).
4. **W4 Pfleger und Einsteller (mittel):** Punkte 15–16, Plätze als Kapazität, Rechnung.
5. **W5 Fohlen (klein):** „Duschen üben“, Fohlenschau ±0,3.
6. **W6 Enzyklopädie, Tests, Bilder (klein):** Berechnungen zum Nachschlagen, Bilder nach Freigabe einbauen.

## Testen
1. Abspritzen: Sommer ja, Winter ganzer Körper nein, Frühling/Herbst bei Regen nein; Winter Beine/Hufe ab Stufe 2; Stufe 1 im Winter gesperrt; ohne Waschplatz keine Kachel (Admin schon).
2. Abtrocknen: ohne → nass, Mauke ×2, Herbst/Winter Erkältung ×1,5; mit → nicht nass. Hufe: Waschen + Auskratzen ×0,3; öfter als jeden zweiten Tag ×1,3.
3. Verschwitzt nach 40 Energie (30 bei Hitze/nervös), Solarium und Abspritzen heben es auf.
4. Gewöhnung 3 / 5 Wäschen, Wohlbefinden −3, −2, −1, 0; bleibt dauerhaft.
5. Sperren (Fieber, Wunde, Weide, außer Haus …) zeigen eine Meldung.
6. Pfleger: wäscht nur mit Waschplatz, nur Plätze-viele Pferde, zuerst verschwitzte; Einsteller-Buchung und Rechnung nach Stufe.
7. Solarium: Winter 2× am Tag, 3. Mal gesperrt; Aufwärmen ersetzt das −20 %; Lahmheit ×0,7 / Kreuzverschlag ×0,5 nur bei beiden Anwendungen.
8. Fohlen: Duschen üben, Fohlenschau ±0,3 (Vortag gewaschen / schmutzig).
9. Alte Spielstände laden, keine Fehler. Screenshots in 1366×768, 844×390, 390×844 für Waschplatz-Ansicht und Solarium.

## Von Projekt-Chat ergänzt (Dome hat nicht ausdrücklich geantwortet, bitte nach den Etappen bestätigen lassen)
1. Zahlen unter Entscheidung 2 und 27 (Schwellen 40/30 Energie, ×0,7, ×0,5) und Pension-Bonus Solarium.
2. Waschplatz-Matten (Entscheidung 21: 1 % Ausrutschen ohne Matten). Handtuch in Stufe 1, Schweißmesser ab Stufe 2 (Winter nur Beine/Hufe hat Dome bestätigt).
3. 2×/Tag-Grenze beim Solarium.

## Fortschritt
Alle Etappen offen (Stand v559).
