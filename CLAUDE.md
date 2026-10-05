# Pferdezucht-Spiel („Zuchtstall“) – Notizen für Claude

Browser-Pferdezuchtspiel auf Deutsch, läuft auf Handy und PC.
Live: https://domegurke-dotcom.github.io/domes-design-test/ (GitHub Pages, Branch `main`).
Spielerin/Auftraggeberin: **Dome** – zeichnet Teile selbst in Krita/Inkscape (Pferdeköpfe, Schöpfe, Fell-SVGs).
Mit Dome immer **auf Deutsch** sprechen, freundlich, knapp; am Ende kurz sagen, was sich geändert hat.

## Feste Regeln von Dome (immer beachten)
- **Bei Unstimmigkeiten, Unrealistischem oder falschen Infos erst nachfragen**, ob weitergemacht werden soll („mir ist xy aufgefallen …“). Nicht eigenmächtig Spielmechanik ändern, die nicht verlangt wurde – vorschlagen und fragen.
- **Jede Änderung testen.** Screenshots in allen Ansichten (PC, Handy quer, Handy hochkant, z. B. 1366×768, 844×390, 390×844) nur bei Änderungen am Aussehen oder Layout – reine Logik-Änderungen per Test-Skript prüfen.
- **Enzyklopädie immer aktuell halten** (Reiter „Vererbung“ und „Weitere Daten“ sind nur im Adminmodus sichtbar – dort Zahlen/Regeln eintragen).
- Versteckte Genetik **nie** in Akte/Abstammungsschein zeigen – nur über Labortests.
- Rassen einstellen (Pferde aus der Rassenliste) nur im Adminmodus.
- Kamera-Aussparung (safe-area) in allen Layouts beachten.
- Anzeige-/Interaktionsboxen dürfen sich nicht überdecken.
- Nach Aktionen nicht aus der Ansicht werfen (z. B. Schere bleibt offen, Bieten aus Brief → zurück zum Brief).
- **Noch warten, bis Dome es sagt:** weitere Rassen (Knabstrupper, Appaloosa, Noriker, Paint Horse), Inzucht-Auswirkungen, Vererbung von Abzeichen/Kopfform/Kopfgröße, Fohlenschau (Wertnote steigert Fohlenpreis stark).

## Dateien
- `index.html` – gesamte Oberfläche und Spiellogik (ein großer `<script>`-Block + `<style>`).
- `pferd.js` – SVG-Pferdezeichnung (`zeichnePferd`), `FARBEN` (Proxy, baut Muster-IDs wie `ov_`, `tv_`, `tg_`, `fs_`, `sb_`, `sk_`), `RASSEN`, `KLASSEN`, `FARBBESCHREIBUNG`.
- `kopfteile.js`, `kopfalter.js` – Domes gezeichnete Köpfe/Schöpfe (`RASSE_KOPF` in pferd.js ordnet Rassen zu; Andalusier, Marwari, Tinker haben noch den Spielkopf).
- `version.json` – aktuelle Version.
- Speicherstand: `localStorage["zuchtstall-v2"]` → Objekt `spiel`.

## Versionierung (bei JEDER Auslieferung)
- `SPIEL_VERSION = "NNN"` in index.html, `?v=NNN` (3 Stellen in index.html) und `version.json` gemeinsam hochzählen.
- Letzte Version bei Aktualisierung dieser Datei: **157**.

## Testen
- Playwright (Chromium vorinstalliert) – Skript lädt `index.html` per `file://`, Spiel starten: `#smNeu` → `#chName`, `#chHof` ausfüllen → `#chLos`. Admin: `spiel.admin = true`.
- Vor dem Ausliefern Syntax prüfen (jeden `<script>`-Block mit `new Function(...)`, `node --check pferd.js`) und Screenshots in den drei Ansichten ansehen.

## Wichtige Spielsysteme (Stand v157)
- **Zeit:** Jahreszeiten (Frühling, Sommer, Herbst, Winter), `tpj()` Tage pro Jahreszeit (3/4/5). `naechsteNacht()` ist der Tageswechsel; bei `datum().t === 1` laufen die Jahreszeit-Funktionen.
- **Zucht:** Tragzeit 4 Jahreszeiten. Deckstation (Gestütshengste) nur Frühling/Sommer, eigene Hengste immer. Zuchtalter Stuten bis 20, Hengste bis 25.
- **Genetik:** E, A (A>At>a), F, Sty, Cr, D, Z, Rn, To, O, Lp, Patn, G, Dm (DMRT3). Versteckte Veranlagungen `ex` (grauTempo, apfel, fliegen, fliegenAb, maehne, ton, ow, sonne, kurve). Gefährliche Gene in `GEFAHR_GENE` (O, Lp) – Warnung nur, wenn mind. ein Partner positiv getestet ist.
- **Overo-Namen:** ohne Gentest „Braunschecke“ usw., mit Test „(Overo)“/„(Tovero)“ (`farbName`).
- **Labor:** Fellfarben 120 €, Erbkrankheiten 60 €, Gangpferde 50 €, Abstammung 80 €. Gemachte Tests erhöhen den Marktwert um ihre Kosten (`testWert`).
- **Pferdemarkt:** Privatanzeigen, Pferdehändler, Auktionshaus, Fohlenauktion (Sommer/Herbst), Gestüte, Tierschutz (inkl. Notfallpferde). Saisonpreise Frühling ×1,1 · Sommer ×1,05 · Herbst ×1 · Winter ×0,9.
  - Auktionshaus: Höchstgebot wie eBay (`duMax`), Gegenbieter-Limits über `npcLimit` (65 % 0,7–1,3×, 22 % 1,3–2×, 9 % 2–3,5×, 4 % 3,5–6× Marktwert). Gebote nur bis zum frei verfügbaren Geld (`gebundenesGeld`).
  - Eigener Verkauf: Festpreis (`festChance`, Regler 50–160 %, nie unter 4 %, Preisvorschläge per Brief) oder Auktion (Start ½ Marktwert, 2 Jahreszeiten, Abbruchstrafe ½ letztes Gebot). Dome will die eigene Auktion so lassen (nicht an Auktionshaus angleichen).
  - Notfallpferde: im ersten Jahr kein Verkauf/Gnadenhof, nur Rückgabe an den Tierschutz ohne Erstattung.
- **Briefe:** immer „Sie“; Du-Angebot nach 6 Briefen eines Absenders, aber nur ab 180 Punkten geheimem Ansehen (`ruf`, Start 100, Skala 0–200, ±5 je positivem/negativem Kontakt); fällt es bei Duz-Partnern auf 100 oder darunter, wird das „Du“ beleidigt zurückgezogen. Das Ansehen nie dem Spieler zeigen (nur Admin-Enzyklopädie). Wichtige Briefe mit Stern markierbar (Ordner „Wichtig“). Texte mit `{du-Form|Sie-Form}`. Pferdenamen in Briefen anklickbar (`briefLinks`, `pferdePool`, `archivieren`). Briefe können Aktions-Knöpfe haben (`aktion`: duzen, bieten, kaufangebot, rechnung).
- **Rechnungen** (`rechnungStellen`, `rechnungenTag`, `externJahreszeit`): Klinik bei Entlassung, Aufzucht/Ausbildung zu Beginn jeder Jahreszeit (mit Zwischenbericht) und bei Rückkehr (Abschlussbericht mit Kostenübersicht). Bezahlen im Brief oder unter Finanzen. Zahlungsziel 2 Tage → Mahnung (alle offenen Beträge des Absenders + 10 %, mind. 20 €; Aufzucht/Ausbildung brechen ab) → nach 5 Tagen Abbuchung + 20 % (mind. 50 €), Konto darf ins Minus. Neue Rechnung ersetzt alte. Kein Tierschutz mehr wegen offener Rechnungen.
- **Klinik:** stationär bis 75 %; bei ≤ 30 % hilft weder Medizin noch Pflege in der Box. Fohlen bei Fuß wird mitbehandelt; braucht es seine eigene Box: gesund → nach Hause, unter 75 % → bleibt mit eigener Box und Rechnung. Kastration (Hengste ab 1 Jahr, 450 € inkl. 2 Tage) → Wallach, Abstammungsschein bleibt Hengst (`geburtsGeschlecht`).
- **Pflege:** Schmutz (`p.dreck` fell/maehne, jede Nacht mehr, im Bild sichtbar), Putzkiste (Bürste/Kamm), Pferdepfleger putzt. Folgen: bis −15 % Marktwert, > 1 Jahreszeit verdreckt −3 % Gesundheit/Tag. Wohlbefinden (`pflege.wohl`, Anzeige minus Schmutz): Weide +15/Tag, Putzen +5, ab 3. Tag am Stück in der Box −6/Tag, hungrig −8, Mist −5. Wirkt auf Lerntempo (`wohlFaktor`) im Ausbildungsstall und später auch beim Training daheim, außerdem auf die Fruchtbarkeit (Trächtigkeitschance 40 % + 55 % × Wohlbefinden). Fohlen bei Fuß haben eigene Gesundheit (wie die Mutter versorgt, min. 1 %).
- **Weide** (Ort → Weide, `p.weide`): Box bleibt leer (Anzeige wie Klinik), kein Füttern/Misten, Gesundheit/Tag Frühling +10, Sommer +12, Herbst +7, Winter +5 (Box +8).
- **Pferdeanhänger im Hauptmenü:** mehrere Pferde auf einmal in Klinik (stationär oder Kastration), Aufzucht, Ausbildung, Gnadenhof; Verkaufen einzeln, danach zurück zum Anhänger.
- **Mitarbeiter (Hofverwaltung):** Stallbursche (füttert/mistet 3 Boxen) und Pferdepfleger (putzt und hält Mähne/Schopf auf Wunschlänge, 3 Boxen), je 300 €/Jahreszeit, Beginn nächste Jahreszeit, Kündigung zum Ende der Jahreszeit, im Adminmodus kostenlos. Weitere Kacheln (Stallmeister, Futterexperte, Osteopath, Hufschmied, Bereiter) noch „bald“.
- **Hofverwaltung-Reiter:** Hof, Finanzen (nach Jahreszeit gruppiert), Außer Haus, Mitarbeiter, Postfach, Einstellungen. Boxen bauen/entfernen mit + / − in der Boxenübersicht im Stall.

## Zusammenarbeit
- Dome testet im Browser auf dem Handy und am PC und schickt Screenshots mit Wünschen.
- Änderungen klein und nachvollziehbar halten, alte Funktionen nicht kaputt machen, Speicherstände abwärtskompatibel lassen (fehlende Felder mit Standardwerten auffüllen).
- Änderungen direkt auf den Branch `main` hochladen (kein extra Branch, kein Pull Request) – Dome möchte das so.
- Vor dem Start Aufwand jeder Aufgabe kurz einschätzen (klein/mittel/groß). Nennt Dome ihr Restvolumen, sagen, was davon reinpasst, und mit dem Wichtigsten anfangen. Nach jeder fertigen Teilaufgabe auf `main` hochladen, am Ende sagen, was offen ist.
