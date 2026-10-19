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

**Von:** Claude Pro · **An:** Claude Team · **Stand:** v513, 19.10.2026

Hallo Claude Team! Lange Sitzung mit Dome (v490–v512), alles auf `main`, Details je Version in CLAUDE.md.

### Wichtigste Änderungen
- **Kontur immer schwarz** `#090609` (`INK`) – Domes Regel, nie wieder ändern. Farben aus Domes Zeichnungen nicht vom Spiel überschreiben.
- **Übergänge:** Ohren mit Kopf-Schattierung per Maske (`schattOhr`), Kopf-Hals-Übergang `uh-` quer zur Linie Genick–Kehle (Punktmuster lang, Scheckung kurz, Fliegenschimmel ohne), Ruß in der Kopffarbe, Lichtflecke als Verlauf. Dome: „Halsübergänge sind endlich gut“.
- **Neues Prüfskript `tests/optik-pruefung.js`** (Raster mit Ausschnitten Kopf/Ohr/Hals und Bauch/Beine für alle Farben, Muster, Köpfe, Ohren, Alter) – nach jeder Optik-Änderung laufen lassen und Bilder ansehen (Dome wünscht gründliche Prüfung!).
- **Muster:** Tobiano auf jeder Grundfarbe (`to_`-Kürzel), Bend-Or (Lage `bendorZ` 7 Zonen, Anzahl, unregelmäßige Gruppen), Brindle-Ausprägungen, Snowflake-Menge, Wenigpunkt-Stufen, Schabracke klein, Birdcatcher scharf/Snowflake weich, Birdcatcher/Brindle dunkel nur echte Rassen (`rassenRate`), Aalstrich bei gescheckten Falben, Ausbleichen auch bei gemusterten Pferden (`saisonBasis`), Sabino/Splash ohne rosa Maul, Lp-Lederhaut als Sichel.
- **Rassenansicht:** nur Grundfarben in der Farbspalte (Muster nur in der Muster-Spalte), typisches Kopfweiß je Scheckung (`MUSTER_KOPF_TYP`), Tobiano ohne Kopfweiß, Varianten-Hinweis zeigt Muster + Farbvariante.
- **Ohren:** nahes Ohr über der Mähne; Reaktion auf jede Spieler-Interaktion 10 s (Vorliebe vorn / egal seitlich / Abneigung hinten, je nach Vertrauen eins oder beide; `OHREN_REAKT`, `OHREN_DAUER`, Rückkehr per Zeitgeber); Ohrenspiel seltener (15–30 s).

### Nachtrag v513
- Handy quer im Vollbild: ☰-Menü klappte in Menüs (Pferdemarkt, Hauptmenü …) hinter der Menüfläche auf – Kopfleiste jetzt z-index 36.

### Offen
- Domes Inkscape-Liste (`BEI-INKSCAPE-BEARBEITEN.md`): Laterne bis über die Nüstern (wirkt im Spiel noch schmal), **1d neu**: Ebene `schopf-maehne-uebergang` hat harte Kante am Hals (Spiel blendet sie per `uebMaske` aus – nach Domes Änderung wieder entfernen), Glanz/Schatten, Alterszeichen, Kupfer-/Grauaugen, Keil-/Schafskopf stark.
- ~~Dome geht weiter je Rasse Farben/Muster/Varianten durch~~ → **abgeschlossen** (Dome, 19.10.2026).

### Achtung
- Bei Fragen zu Realismus (Gene je Rasse, Muster) erst nachfragen; Dome mag kurze Auswahlfragen.
- `//`-Kommentare nur am Zeilenende.

### Nachtrag 19.10.2026 (neue Pro-Sitzung, Team hat noch nicht gelesen)
- Domes Rassen-Testliste (Farben/Muster/Varianten in der Rassenansicht) ist **abgeschlossen**.
- `OFFENE-FRAGEN.md` geklärt: Flocke/Stern bleiben so (realistisch), Splash-Körper bleibt erstmal so (Dome zeichnet evtl. später ein eigenes Fell).
- Waschplatz (hat noch keine Wirkung) steht nicht in `PROJEKT-CHAT-THEMEN.md` – Dome gefragt, ob er als Punkt 14 rein soll.
