# Bei Inkscape bearbeiten

Was in `pferd kopf.svg` noch fehlt oder nicht ganz der Realität entspricht. Gesammelt von Claude für Dome, Stand v429 (18.10.2026).
Nach dem Zeichnen einfach hochladen – `werkzeuge/kopf-export.js` übernimmt neue oder geänderte Ebenen, Claude baut sie ins Spiel ein.
**Wichtig:** Jede Änderung in **allen 19 Kopfformen** machen (jede Form hat ihre eigenen Gruppen `kopfabzeichen` und `maulfärbung`). Ebenennamen genau so schreiben wie hier angegeben.

## Muss geändert werden (Fehler)

### 1. Laterne: Farbverlauf
- **Problem:** Der Verlauf blendet im unteren Gesichtsteil auf 0 % Deckkraft aus – zwischen Auge und Nase scheint das Fell durch („braun in der Mitte“).
- **In echt:** Eine Laterne ist von der Stirn bis über die Nüstern durchgehend weiß und reicht seitlich über das Auge.
- **Auch die Form:** Selbst voll weiß gefüllt bleibt zwischen Auge und Nase eine Lücke – die Form der Laterne deckt die Nasenmitte nicht ab (Test v433). Bitte die Form bis über die Nüstern schließen.
- **Ändern:** Die Fläche überall voll weiß lassen. Weich auslaufen nur am äußeren Rand zur Backe hin (z. B. nur ein schmaler Blur am Rand oder ein Verlauf, der erst ganz außen ausblendet).
- Bei **breite Blesse** und **Blesse** kurz prüfen, ob dort auch zu viel ausblendet – sie sollen ebenfalls von der Stirn bis zur Nase durchgehen.

### 1b. ✅ Rechtes Ohr / Innenohr – erledigt (v465)
- Innenohr von Dome neu gezeichnet und eingebaut. Die lange hintere Linie des vorderen Ohrs ist der Fellübergang und bleibt so (Dome).

### 1c. Keilkopf stark und Schafskopf stark überarbeiten (Dome, v462)
- Dome überarbeitet die Formen `keilkopf-stark` und `schafskopf-stark` selbst. Danach `werkzeuge/kopf-export.js` laufen lassen; dabei auch `maulfärbung` und `kopfabzeichen` dieser beiden Formen anpassen, damit sie zur neuen Form passen.

## Fehlt noch (neue Ebenen)

### 0. Glanz- und Schattenbereiche für die Köpfe (Dome plant, v467)
- Dome zeichnet eigene Licht-/Schattenflächen für die Köpfe. Sobald sie da sind: die helle Spiel-Schattierung auf dem Kopf (`sh-`-Rechteck in `zeichnePferd`) wieder entfernen (seit v490 liegt sie per Maske auch auf den Ohren – `schattOhr`).

### 0c. Kupfer um die Augen beim Schwarzbraunen (neu, Dome v481)
- Schwarzbraune (Gen At) haben neben dem Kupfermaul auch kupferfarbene, hellere Haare um die Augen (wie der graue Augenschatten beim Schimmel, Punkt 4b – nur kupferbraun und heller statt dunkel).
- **Bitte zeichnen:** unter `maulfärbung` eine Ebene `kupferaugen` (weicher Verlauf ums Auge) in allen Kopfformen. Bis dahin gibt es einen Platzhalter (weicher Kupferfleck ums Auge). Flanke und Ellbogen zeichnet das Spiel selbst.

### 0b. Alterszeichen für Senioren (neu, Dome v468)
- Im Spiel gibt es dafür vorerst einen Platzhalter (aus den alten Köpfen bis v423 übertragen): graue Haare um das Auge, eingefallene Augengrube (Bogen über dem Auge), Tränenrinne (Linie unter dem Auge), Falte vom Maulwinkel zum Nasenrücken. Bei „reif“ (ca. 10–15 J.) nur leicht: etwas Grau ums Auge und ein schwacher Bogen.
- **Bitte zeichnen**, je Kopfform eine Gruppe `alterszeichen` mit Ebenen `senior` und `reif` (Linien in Linienfarbe, graue Haare als Fläche mit Weichzeichner). Kein weißer Fleck am Maulwinkel (Dome).
- Danach ersetzt Claude den Platzhalter (`ALTERS_ZEICHEN` in pferd.js).

### 2. Milchmaul (unter `kopfabzeichen`)
- **Was ist das:** Die Lippen selbst sind weiß (Haut darunter rosa) – nicht zu verwechseln mit der Schnippe (weißer Fleck auf der Nase zwischen den Nüstern, Lippen bleiben farbig).
- **Ebenen:** `milchmaul` (Ober- und Unterlippe weiß, von der Maulspitze bis etwa zum Maulwinkel). Wenn du es genauer willst, zusätzlich `weisse oberlippe` und `weisse unterlippe` einzeln.
- Kommt oft zusammen mit Blesse/Laterne vor, aber auch allein oder mit Schnippe → wird im Spiel wie die Schnippe kombinierbar.

### 3. Krötenmaul (unter `maulfärbung`) – ✅ nicht mehr nötig: zeichnet das Spiel seit v441/v444 selbst (`lpHautSVG`, Tiger und Doppel-Cream). Eigene Zeichnung nur, wenn Dome es schöner haben möchte.
- **Was ist das:** Rosa Haut mit dunklen Flecken/Sprenkeln um Maul und Nüstern (oft auch um die Augen).
- **Wann:** bei Tigerschecken (Leopard), Champagne und Cream (Cremello/Perlino). Champagne gibt es im Spiel noch nicht – kommt später als Gen.
- **Ebene:** `kroetenmaul`. Optional für die Augenpartie `kroetenaugen` (gesprenkelte Haut rund ums Auge).

### 4. Aufhellung um die Augen (optional, unter `maulfärbung`)
- **In echt:** Pangaré (Mehlmaul) hellt nicht nur das Maul auf, sondern auch einen Ring um die Augen. Schwarzbraune haben ebenfalls hellere Augenpartien.
- **Ebene:** `mehlaugen` (heller, weicher Ring ums Auge). Das Spiel zeigt sie dann zusammen mit dem Mehlmaul bzw. Kupfermaul.

### 4b. Graue Augenpartie beim Schimmel (neu, unter `maulfärbung`)
- **In echt:** Schimmel haben unter dem weißen Fell schwarze Haut – ums Auge sind die Haare dünn, darum sieht die Augenpartie dunkelgrau aus (wie beim Graumaul).
- **Im Spiel bisher:** ein weicher, verschwommener grauer Fleck ums Auge (von Claude als Platzhalter, ab 30 % Ausschimmelung).
- **Ebene:** `grauaugen` (weicher grauer Verlauf rund ums Auge, Farbe #656565 wie beim Graumaul). Wenn sie da ist, nimmt das Spiel deine Zeichnung statt des Platzhalters (Claude stellt dann das Skript um).

### 5. Weitere Kopfabzeichen (optional, unter `kopfabzeichen`)
- `strich`: schmaler weißer Streifen nur auf dem Nasenrücken, ohne Verbindung zur Stirn.
- `unterbrochene blesse`: Stern oben + Strich unten, dazwischen farbig.
- Beides gibt es in echt häufig, im Pass wird es so eingetragen.

### 6. Teilweise blaues Auge (optional, unter `auge`)
- **In echt:** Bei Splash, Overo und viel Weiß ist das Auge oft nur zum Teil blau (z. B. blauer Sektor oder blauer Ring in einem braunen Auge).
- **Ebene:** `teilblaues auge`.

## Prüfen / im Auge behalten

### 7. Dunkles Maul (bisher Ebene `graumaul`)
- Ebene darf umbenannt werden in `dunkles maul` (das Skript versteht beide Namen). Die Farbe mischt das Spiel aus der Fellfarbe.
- Die Fläche ist recht klein und auf hellen Falben nur schwach zu sehen. In echt (siehe Fjordpferde) ist die ganze Nasenspitze bis über die Nüstern dunkel → etwas größer zeichnen.

### 8. Flocke und Stern
- Sitzen ganz vorn an der Stirnkante und sind im Spiel sehr klein (auf der Handy-Kachel in der Enzyklopädie kaum zu sehen). In der Seitenansicht sieht man in echt auch nur den Rand – aber etwas weiter zur Stirnmitte hin und etwas größer wäre deutlicher.

### 9. Blaues Auge
- Im Spiel ist von der Iris nur wenig zu sehen, das Blau fällt kaum auf. Eventuell die blaue Iris etwas größer/heller zeichnen.

### 10. Schöpfe (Etappe 3)
- **Aalstrich im Schopf** fehlt noch: bei Falben (Fjord usw.) ist die Mitte des Schopfs dunkel, außen hell. Eigene Ebene je Schopflänge, z. B. `aalstrich kurz`, `aalstrich mittel` usw. (Platzhalterfarbe #f8baba ist im Skript schon vorgesehen).
- Fohlen haben in echt einen kurzen, wuscheligen Schopf (der im Spiel erst wächst) – passt so.

## Hinweise (keine Fehler, nur zur Info)
- ✅ **Wimpern** (bleibt, Cartoon-Stil): In echt haben Hengste, Wallache und Stuten gleich lange Wimpern. Die Zusatz-Wimper für Stuten und Fohlen ist eine schöne Spiel-Idee und darf bleiben – nur zur Info.
- ✅ **Pupille** (bleibt rund): Echte Pferde haben eine waagerecht-längliche Pupille. Im Comic-Stil ist rund völlig in Ordnung.
- ✅ **Ohrgröße:** ist in echt je Rasse verschieden – macht jetzt das Spiel (v430, `OHR_RASSE`), nichts zu zeichnen.
- **Hängeohren** (Schlappohren) gibt es in echt bei manchen alten Pferden und bei einzelnen Rassen-Linien – du hast entschieden: keine Hängeohren mehr. Bleibt so.

## Neu seit v430 (optional)
- **Zebrastreifen und Schulterstreifen** zeichnet das Spiel selbst (dunkle Querstreifen an Unterarm/Unterschenkel, Streifen über die Schulter). Wenn du eine eigene Zeichnung möchtest: ein SVG mit Ebenen `zebra vorne`, `zebra hinten`, `schulterstreifen` – dann baue ich sie ein.
- **Beinabzeichen** (weißer Ballen bis hochweißer Fuß) zeichnet das Spiel ebenfalls selbst mit glattem, leicht welligem Rand. Für echte Abzeichen typisch wäre ein unregelmäßigerer Rand – falls du Vorlagen zeichnen magst, gern.
