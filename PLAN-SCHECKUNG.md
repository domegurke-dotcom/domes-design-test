# Plan: Scheckmuster in 3 Stufen + neue Muster

Mit Dome abgestimmt am 18.10.2026 (Entwürfe als Bilder gezeigt und freigegeben). Vorlagen: Domes Bilder „Minimal/General/Maximal“ und „Tobiano/Overo/Tovero je Grundfarbe“.

## Grundsätze (Dome)
- Keine harten, geraden Kanten: weiße Flächen mit weichem, unregelmäßigem Rand (Turbulenz + leichte Unschärfe), Tobiano als runde unregelmäßige Platten, Splash mit geschwungener Grenze, Beinabzeichen mit unruhiger, leicht schräger Oberkante.
- Bei viel Weiß: Mähne und Schweif teilweise weiß/zweifarbig.
- Roan bleibt die heutige Zeichnung – nur in 3 Stufen (wenig: dunkler, Grundfarbe scheint durch · typisch: wie bisher · viel: sehr hell). Kopf und Beine bleiben beim Roan dunkel.
- „Blesi“ (Domes Vorlage) ist isländisch für Blesse – kein eigenes Muster.

## Schritt 1 – drei Stufen für die vorhandenen Muster (Claude Team, v439) – ✅ fertig
- Versteckte, vererbte Veranlagung `ex.muster` (0–1) = Muster-Ausprägung: wenig < 0,3 · typisch bis 0,8 · viel ab 0,8 (Marktpferde 30 / 50 / 20 %). Rassen-Verschiebung (Logit) `MUSTER_RASSE`: Tinker +0,8, Clydesdale +0,8.
- Gilt für Tobiano, Overo, Tovero (viel = „Medicine Hat“), Splashed White, Sabino (viel = „Max-Sabino“), Roan, Tiger (Schabracke klein/groß, Punkte locker/dicht).
- Admin „Gene selbst wählen“: Zeile „Muster-Ausprägung“ (nur bei Mustern).
- Umsetzung: `index.html` – `ex.muster` in `EX_GRENZEN`/`exVon`, `MUSTER_STUFEN` [0,3 / 0,8], `musterZufall`, `musterStufeVon`, `kopfOpt` gibt `musterStufe` weiter, bzn-Eintrag „Muster-Ausprägung (v439)“. `pferd.js` – `opt.musterStufe` (0/1/2, Standard 1) skaliert die Flecken im Musterblock von `zeichnePferd` (Tobiano/Overo/Tovero/Sabino/Splash/Leopard/Blanket), `musterStufeFarbe` für Roan (nicht beim Ausgrauen, `roanDeck`), `viel` → Mähne/Schweif heller. Beinabzeichen: `beinWeiss` mit unruhigem Rand.
- Mögliche Verbesserung: bei dunkler Mähne wirkt „teilweise weiß“ eher grau – echte zweifarbige Strähnen wären schöner.

## Schritt 2 – neue Muster (Claude Pro, v440) – ✅ fertig
**Umgesetzt (v440, mit Dome abgestimmt 18.10.2026):** 4. Stufe „fast weiß“ (Medicine Hat; `MUSTER_STUFEN` [.3,.8,.95], Marktpferde 30/50/15/5 %; nicht bei Frame Overo/Roan/Tiger – wie in echt), Sabino mit Stichelhaar-Rand (`stichel` in pferd.js), Mähne abschnittsweise/Schweif in Strähnen weiß (`maehneWeiss`, `schweifWeiss`), Kopfabzeichen bei viel/fast weiß größer (`MUSTER_KOPF`, nur Sw/O/Sb/W), Splash mit klarem, geschwungenem Rand, Tovero-Stufen deutlich verschieden. Neue Muster: Rabicano `ex.rabi`, Bend-Or `ex.bendor` (Flecken fast schwarz, je Pferd Vorhand/Hinterhand/Rumpf/überall), Birdcatcher (Zufall, `ex.bird` nur Admin), Brindle dunkel (Chimäre 0,2 %, `ex.brin` nur Admin) und weiß (Gen `Br1`, X-chromosomal, nur Quarter), Gen `W` (W/W → Stute bleibt leer, `wwLeer`, Warnung in `GEFAHR_GENE`), Roan beim Islandpferd (Rn 3 %). Anzeige: `zeichenVon`, `zeichenListe`, `zeichnungText`, `kopfOpt` → `opt.rabi/birdcatcher/bendor/brindle/dw`. Ursprünglicher Plan:

Entwürfe als Overlay im Körper wie in Schritt 1, Einbau in `pferd.js` (Musterzeichnung) und `index.html` (Genetik/Vererbung/Steckbrief/bzn/Admin):

| Muster | Vererbung | Häufigkeit Marktpferde | Zeichnung |
|---|---|---|---|
| Rabicano | Veranlagung `ex.rabi`, vererbt (ab 0,5 sichtbar) | Araber 8 %, Vollblut/Quarter/Anglo-Araber/Shagya je 5 %, Tekke 3 %, sonst 1 % | weiße Stichelhaare an Flanke und Bauch, heller Schweifansatz; 3 Stufen über `ex.muster` |
| Birdcatcher-Tupfen | nicht vererbt (Zufall je Pferd), Tupfen nehmen mit dem Alter zu | 2 % (Araber 3 %) | kleine weiße Tupfen verstreut |
| Bend-Or-Flecken | Veranlagung, vererbt, nur sichtbar bei Füchsen/Palominos | Vollblut 8 %, Anglo-Araber 4 %, Quarter 3 %, sonst 1 % | dunkle Flecken (Farbe aus dem Fell, dunkler) |
| Brindle (gestromt) | nicht vererbt (Chimäre) | 0,2 % alle Rassen | feine dunkle senkrechte Streifen |
| Dominant White | neues Gen **W** (dominant) in `GENE`, Fellfarben-Test zeigt es | Araber 0,5 %, Vollblut 0,5 %, sonst 0 | wenig: viel Weiß an Kopf/Beinen/Bauch · typisch: großflächig · viel: ganz weiß; rosa Haut, dunkle Augen |

- **W/W:** kein lebensfähiger Embryo → die Stute bleibt bei ¼ dieser Paarungen leer. Warnung beim Decken nur, wenn beide positiv getestet sind (wie `GEFAHR_GENE` O/Lp).
- Steckbrief (Daten) – Zeile „Zeichnung“ ergänzen (z. B. „Rabicano“, „Birdcatcher-Tupfen“); bzn-Eintrag mit allen Zahlen; Admin „Gene selbst wählen“: nur bei Rassen, wo es vorkommt (`rasseZeichen`-Prinzip).
- Danach Screenshots in allen drei Ansichten, CLAUDE.md und `UEBERGABE.md` aktualisieren.
- Vorschau-Skript der Entwürfe: siehe Beschreibung in `UEBERGABE.md` (Überlagerung direkt nach `<g clip-path="url(#cl-UID)">` in das SVG von `zeichnePferd` einsetzen).

## Schritt 3 – Leopard-Komplex vervollständigen – ✅ fertig (v441), Rassen Appaloosa, Knabstrupper, Paint Horse in v442
- Lp ohne PATN1 nicht immer Schabracke: auch nur Lackschimmel, Frost oder fast ohne Muster.
- Neu: Lackschimmel (Varnish Roan, wird mit dem Alter heller, dunkel über Knochen), Snowflake, Frost.
- Merkmale aller Lp-Pferde: gefleckte Haut (Maul, Augen), weiße Lederhaut, gestreifte Hufe.
