# Offene Fragen an Dome

Nur noch Fragen, die **nicht** beantwortet sind. Beantwortete Fragen werden entfernt (Domes Antworten stehen dann im jeweiligen Plan als Aufgabe).
Zu jeder Frage steht die Lösung, die Claude vorerst gewählt hat.

## Noch offen – bitte entscheiden
Zeichen-Aufgaben stehen in `BEI-INKSCAPE-BEARBEITEN.md`, große Themen in `PROJEKT-CHAT-THEMEN.md`.

1. **Selbst gesetzte Zahlen im Veterinäramt-/Speicher-Auftrag (v599–v605)** – bitte ansehen, alles leicht änderbar:
   - Meldechance bei Einsteller, Tierarzt und Hufschmied: **50 % je Besuch**, wenn sie einen Mangel sehen (`VET2.melde`). Anonym: 5 % je Mangel, höchstens 25 % am Tag (aus dem Auftrag).
   - Beschlagnahme-Klinik: Behandlung **20 € je Krankheit und Tag** (`KLINIK_BEFUND`), Tod in der Klinik **4 % je Tag**, nur bei chronisch schwer kranken (Grad ≥ 4) oder sehr alten Pferden (Altersgrenze ≤ 25 %) und solange sie unter 50 % sind (`KLINIK_TOD`). Ziel = Minimum aus 75 %, Altersgrenze und Krankheitsdecke.
   - „Keine Heilung mehr möglich“ (für Erlösen): Röhrbeinbruch, Megaösophagus, Aortenwandschwäche, HERDA, Ataxie ab Grad 4 (schwer), alle anderen chronischen Krankheiten erst bei Grad 5 (`KEINE_HEILUNG`).
   - Alt-Ausnahme: Gesundheit höchstens 10 Punkte unter der Altersgrenze **und** höchstens 30 % (`VET.altNah`).
   - Hufe überfällig als Mangel: mehr als 4 Wochen = 4/13 Jahreszeit über dem Hufschmied-Intervall.
2. **Hinweise zum Auftrag:** (a) Die „Rücksicherung“ gibt es seit v522 nicht mehr; statt dessen kann der Platz „Verloren“ aufgeräumt werden. (b) Der Stammbaum eines Pferdes speichert die Eltern-Daten selbst – Details eines gelöschten Vorfahren gehen dort nicht verloren, nur sein Steckbrief; die Warnung beim Aufräumen sagt das so. (c) Pferde mit Erfolgen und die 3 wertvollsten Pferde kommen beim Tod automatisch in die Bestenliste – dafür fragt das Aufräumen zusätzlich. (d) Experten sehen die neuen Blasen nur, wenn „Tipps“ in den Einstellungen an sind (Experten haben Tipps standardmäßig aus).

_Reitunterricht (Dome 20.10., v606): auch der feste Bereiter kostet 60 € (Zusatzleistung), trainiert aber am nächsten Morgen normal. Frühere Antworten (Dome, 20.10.2026): Fragen 1–12 der Nachtsitzung beantwortet („so lassen“); Nachbau v598: Fremd-Vergleich (Interieur nur grob), Blasen merkVorschau/merkFohlenschau, Pferdebild und Kryptorchismus im Admin, Reiter-Test-Toleranz. Offen vermerkt: Zeilen Behang/Ohren in den Rassemerkmalen (siehe PLAN-MERKMALE.md und BEI-INKSCAPE-BEARBEITEN.md)._


## Nachtrag 23.10.2026 (Claude Team)
- **Thema Spieltempo abstimmen (Dome 23.10.):** Tempo 4/7/10 muss insgesamt besser aufeinander abgestimmt werden – Krankheitsrisiko und Heilzeit (Studie: bei Tempo 10 ≈ 2,8 Befunde/Pferd/Jahr gegen ≈ 1,8 bei Tempo 7, Heilung 7 statt 3,5 Tage, 2 von 6 Läufen mit Tierhalteverbot), außerdem Pensionseinnahmen usw. Noch nichts geändert; gemeinsam mit Dome durchgehen (Zahlen: `STUDIE`-Läufe `TEMPO=… EXPERTE=1 STUFEN=2 tests/gesundheit-studie.js`).

## Nachtsitzung 23.10.2026 (Claude Team, Rest der Wunschliste) – selbst gesetzt, bitte ansehen
- **Pension Paddockbox (v680):** Aufpreis je Stufe startet bei 50 € (wie bisher), einstellbar 0–300 €; teurer = seltener gewünscht (Faktor 50 € ÷ Aufpreis, zwischen 0,25 und 1,5). Neuer Aufpreis gilt nur für neue Verträge. (Plätze in Paddockboxen: Dome entschieden v684 – neu 0, alte Stände mit Paddockboxen „alle“.)
- **Sandpaddock (v681):** Fläche 150 m² je Großpferd wie bisher, Bedarf nach Größe = 150 m² × (Stockmaß ÷ 160 cm)², begrenzt 68–195 m² (Shetty ≈ 68, Haflinger ≈ 128, Warmblut ≈ 165, Shire ≈ 190 m²). Vergrößern je Platz 150/250/450 € (Stufenpreis ÷ Plätze). Zu voll (nur von Hand möglich): Wohlbefinden −2 je Nacht und Verletzungen ×1,5, ab 150 % −4 und ×2,2. (Dome v684: Stufen jetzt 400/600/800 m², 2 Kaltblüter passen auf Stufe 1.)
- **Hinweis:** `tests/weiden-oberflaeche-test.js` hängt (Zeitüberschreitung) – auch schon vor dieser Sitzung, der Test ist veraltet. `tests/tutorial-test.js` hat einen roten Punkt („Danach Immobilienmenü, Testhof weg …“), ebenfalls schon vorher.
- **Pflichttest/Quarantäne für Kontaktpferde (v686):** Ich habe das als Hilfe gebaut (Liste der Kontaktpferde, ein Knopf für Quarantäne, ein Knopf fürs Blutbild aller), nicht als Pflicht. Soll es zusätzlich eine Pflicht geben (z. B. das Veterinäramt verlangt nach einem Ausbruch Tests/Quarantäne, sonst Mangel bei der Kontrolle)? Das wäre neue Spielmechanik – deshalb offen.
- **Futterwarnung (v688):** Warnbrief jetzt ab weniger als 4 Tagen Vorrat (Dome 23.10.: 4; vorher 3), damit nach der 1-Tages-Lieferzeit noch Luft bleibt. Zahl selbst gesetzt (`FUTTER_WARN_TAGE`).
- **Mähne/Schopf beim Pensionspferd (v690):** Wenn die Pflege gebucht ist und die Mähne/der Schopf länger ist als die Wunschlänge, sinkt die Zufriedenheit des Besitzers um 0,5 je Tag, bis jemand schneidet (selbst gesetzt, `MAEHNE_AERGER`). Der Pfleger schneidet weiter von selbst.

## Stand nach Domes Antworten 23.10.2026
- Veterinäramt-/Speicher-Zahlen und Paddock-/Sandpaddock-Zahlen: so lassen (Dome). Mähne-Ärger passt, Futterwarnung 4 Tage (v692), Quarantäne 2–4 Wochen (v692, `quarTage`).
- Quarantäne 2/3/5 Tage (Tempo 4/7/10), auch im Quarantänestall (v693, Dome).
- **Offen:** Spieltempo 4/7/10 abstimmen – erst mit der Studie gemeinsam durchgehen (Dome).

## Seltene Farben: Spielzahlen gegen echte Häufigkeit (Claude Team, 23.10.2026, wartet auf Dome)
Stichprobe 500 Pferde je Rasse (`neuesPferd` mit Markt-Farbverteilung). **Zu häufig gegenüber echt (Vorschlag: senken, Dome entscheidet):** Dominant White (Vollblut 1,4 %, Araber 0,4 % – echt weit unter 0,05 %, Vorschlag W ≈ 0,0005), Brindle (Quarter 0,8 % – echt < 0,1 %), Splashed White (Paint 8,4 %, Quarter 3,4 % – echt etwa 3–5 % bzw. ≈ 1 %), „fast weiß“ (Tinker 11 %, Paint 9 %, Clydesdale 8 %, Lewitzer 9 % – echt wohl 1–3 %), Silber bei Isländer 10 % und Shetty 16 % (echt wenige %), Fjord-Hellfalbe 22 % (echt etwa 7–10 %), Bend-Or Vollblut 1,6 % (echt weit seltener). **Passt:** Doppel-Cream (Tekkiner 2,2 %), Birdcatcher (Araber 3,8 %), Leopard-Muster (Appaloosa 28 %), Rabicano (Araber 6,6 %), Roan, Rußfalbe, Glanzäpfel, Tekkiner-Glanz. Folge: Die Seltenheitsstufen hängen an diesen Zahlen. **Raritäten-Markt:** In 40 Marktjahren (2.240 Angebote) kam Dominant White 4× vor, Brindle 0×, Leopard 1× – die meisten Angebote sind „unscheinbare“ Gene (Sooty, Flachsmähne, At/At). Vorschlag: eine feste Liste „Traumfarben“ wie bei Schimmel/„fast weiß“ (Dominant White, Brindle, Leopard, Splash + Doppel-Cream …) mit eigener Rate.

**Erledigt in v731 (Dome: „pass alles der Realität entsprechend an“):** Zahlen siehe `CLAUDE.md` v731. Noch offen: Traumfarben-Liste für den Raritäten-Markt (Dominant White, Brindle, Leopard, Splash + Doppel-Cream …) – Dome nennt Kombinationen und Rate.

## Aufnahme 24.10. – Etappe 2 (Claude Team, v764) – selbst entschieden, bitte ansehen
- **Whiteboard nach Hand-Änderung in „Orte“:** die Änderung gilt für die **laufende Jahreszeit** und läuft weiter, bis für eine spätere Jahreszeit ein eigener Plan steht (so plant das Whiteboard ohnehin). War das Pferd „alle 2 Tage“ eingeteilt, bleibt sein Tag (A/B), sonst wird es „täglich“.
- **Plan sagt „bleibt in der Box“** und man stellt das Pferd von Hand auf Weide/Sandpaddock: keine Rückfrage, aber das Whiteboard übernimmt es sofort (Dome 24.10.: immer synchron) – als Plan „täglich“, d. h. Stallbursche/Azubi bringen das Pferd danach jeden Morgen dorthin, bis du es im Whiteboard änderst. (Dome 24.10.: dabei fragen, ob täglich oder alle 2 Tage – gebaut in v772, dazu „Nur heute“.)
- **Pferd zurück in die Box holen** ändert das Whiteboard nicht (das ist nur für heute).
- **Quarantäne:** solange die Quarantäne läuft, kann man das Pferd nicht aus dem Quarantänestall umstellen (wie schon beim Ziehen in der Boxenübersicht).
- **Kacheln unter dem Plan:** sie erscheinen nur noch für Ziele, die (noch) nicht im Hofplan stehen (z. B. Gebäude im Feld „Zum Bauen“) – sonst gäbe es keinen Weg dorthin. Fohlen-ABC und „Duschen üben“ bleiben als Kacheln (das sind keine Orte).

## Hofplan (Claude Team, 24.10.2026) – Domes Antworten sind eingebaut (v758), noch offen:
- **Dome 24.10. (Antworten):** Büro-Maße so lassen; Start-Hof bleibt 0,5 ha Bauland + 1 ha Weide; im Hofplan bleiben die Weiden als Streifen (Pfeile nur in Box → Ort); **alle Preise werden noch einmal angeschaut** (Büro, Bauland, Bauten – `PROJEKT-CHAT-THEMEN.md` Punkt 12).
- **Dome 24.10.:** selbst gesetzte Zahlen für Verwaltung (+4/+8 Ansehen, +1/+2 Zufriedenheit), Futterkammer (200/350/600 kg + 30 kg je Box) und Büro (Maße, Preise) bleiben so; Luzerne im Heu- und Strohlager (v761). Preise nur noch in der Gesamt-Preisdurchsicht.
- **Start-Hof 1,5 statt 2 ha:** Der „Alte Pensionsstall“ hatte 2 ha = 1 ha Bauland + 1 ha Weide. Neu hat er 0,5 ha Bauland; damit die Weide 1 ha bleibt, sind es 1,5 ha insgesamt. Alternative: 2 ha lassen, dann hätte die Weide 1,5 ha (mehr Weide geschenkt, Zaun 1,5 ha). Jetzt so gelassen.
- **Bauland alter Spielstände** ist jetzt aus 0,5-ha-Rechtecken (20 × 10 Kacheln) in einem Raster; ein alter einteiliger Plan (v752–v757) wird beim Laden geteilt, was dann nicht mehr auf dem Land liegt, kommt ins Feld „Zum Bauen“ (Ort bleibt gesperrt, bis alles aufgestellt ist).
- **Ort:** Sandpaddock antippen wählt genau diesen; Weide und Gelände sind Pfeile außerhalb des Hofs (unten/rechts). In der Hofverwaltung (Hofplan) stehen die Weiden weiter als Streifen unter dem Plan, damit man sie pflegen kann – soll das auch ein Pfeil werden?
- **Grundrisse:** Stall 6 Boxen jetzt 20 × 10 m (3 Boxen je Reihe + Futterkammer), Paddockboxenstall 25 m tief, Quarantäne eine Reihe + Futterkammer, Abfohlstall 4,5 m je Box + Futterkammer; weiter Reitplatz 20 × 40 / 20 × 60 / 40 × 80 m, Roundpen 20 × 20, Trail 40 × 20, Rennbahn 200 × 100, Sandpaddock 20 m breit nach Fläche, Lager 20 × 10, Waschplatz/Solarium/Sattelkammer 5 × 5, Parkplatz 15 × 10 m.
- **Anbau (v753):** wächst am Ende des Gebäudes (Knopf „↔️ andere Seite“ für den Anfang); der Teil-Umbau auf höhere Stufe ändert den Grundriss nicht.
- **Bauland (v754):** 0,5 ha kosten 1.500 € (3.000 €/ha), Verkauf 90 % (1.350 €); Stücke rechts, links oder unten ansetzen; Verschieben über Antippen → „Verschieben“.
- **Nicht gemacht:** Beinabzeichen in der Enzyklopädie haben weiter 6 Spalten (du hattest sie nicht genannt).


## Sitzung 25.10. (Claude Pro, Opus) – Boxansicht mobil, selbst entschieden, bitte ansehen
- **Hochkant-Symbolreihe:** Tierarzt · Füttern · Orte · Ausrüstung · Steckbrief – wie am PC (Putzen unter Ausrüstung, Versorgung über die Balken). Im Entwurf 9.1 standen noch Versorgung und Putzen in der Reihe. Füttern habe ich wie am PC mit hineingenommen.
- **Kreise:** hochkant als Bogen über dem Pferd mit ✕ unten (wie Entwurf 9.2), **quer als 2-Spalten-Raster in der Nachbarbox** – ein Bogen über dem Pferd lag quer im Weg beim Wischen, am Rand war für einen Kreis zu wenig Platz.
- **Leere Box, totes Pferd, Klinik, Turnier:** dort gibt es keine Symbole – es erscheint die alte Ansicht unter dem Bild (sonst sah man gar nichts; das war auch am PC so).
- **Tutorial** läuft noch mit der alten Ansicht (Reihenfolge PC → mobil → Tutorial). Soll ich die Tutorial-Etappe (Blasen/Ziele auf die neuen Symbole umstellen, Tutorial-Spieler) als Nächstes bauen? Das geht nur mit dem großen Test.
- **Auffällig:** der Admin-Reiter „Test“ in der Pferdepflege ist im Fenster-Modus (PC und Handy) nicht mehr erreichbar. Soll er z. B. in den Ausrüstungs-Kreis (nur Admin)?
- **Weihnachtsgeld (v826):** Zahlen aus dem Plan-Vorschlag übernommen (25 % Grundbetrag, +5 %/Jahr bis +25 %, −5 %/Krankheitstag bis −50 %, +3 %/Sonderarbeit bis +15 %). Selbst gesetzt: Zufriedenheit Vorschlag +8 · doppelt +15 · weniger anteilig (mind. +2) · keins −10, je volles Jahr −2 mehr (höchstens −16); Fenster am **vorletzten Wintertag**; nicht beantwortet bis zum Jahreswechsel → verfällt ohne Folgen; auch Azubis bekommen Weihnachtsgeld. Statt drei Knöpfen gibt es ein Eingabefeld je Mitarbeiter (Vorschlag steht schon drin). Passt das so? Sollen A–C (Einsteller-Geschenke, Stall des Jahres, Sponsor) auch gebaut werden?
- **Aufzucht-Offenstall (v827):** selbst gesetzt: eine Gruppe zählt für Stallbursche/Azubi wie **1 Box** (Dome: „je Gruppe statt je Platz“); die Gruppen sind gleich groß verteilt (Stufe 3: 4 × 12–13 Plätze, Stufe 2: 2 × 12–13) – dadurch hat z. B. die Junghengst-Gruppe genauso viele Plätze wie die Absetzer. Der Umbau des Offenstalls läuft wie bei Ställen (Plätze im Umbau gesperrt, die Pferde müssen vorher woanders hin) – passt das, oder sollen die Pferde während des Umbaus drin bleiben dürfen (in echt wird oft nur angebaut)? Nicht gebaut: Gruppen-Übung (Thema 27), Blättern nur durch die Gruppe, Tutorial-Info.
- **Krankheitsmeldungen (v828, Test):** behoben: Plaketten („Befund“, „Boxenruhe“, „Quarantäne“, „Besitzer informieren“) taten im Fenster-Modus nichts – jetzt öffnen sie Versorgung · Gesundheit. **Auffällig, nicht geändert:** (a) Der Meldebrief eines Mitarbeiters zu einem **Pensionspferd** bietet „Tierarzt rufen“ an, aber nicht „📞 Besitzer informieren“ – soll der Knopf dort auch hin? (b) Der Meldebrief nennt immer „(Box N)“, auch wenn das Pferd gerade auf der Weide/dem Sandpaddock steht. (c) Steht das Pferd draußen, gibt es keine Denkblase (nur die Plakette „Befund: unklar“) – so gewollt?
