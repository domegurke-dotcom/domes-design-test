#!/bin/bash
# Baut die Einstreu-Böden (Stroh, Hanf, Späne) neu und alles, was daraus folgt. Aufruf: bash werkzeuge/einstreu-bauen.sh [a b c d e]   (Standard: a b c d e)
# Reihenfolge ist wichtig: erst Stroh (liefert Haufen-Positionen), dann Hanf und Späne, dann Ansichtsdaten, Mistigkeit-Stufen und gemessene Oberfläche.
B="/c/Program Files/Blender Foundation/Blender 5.2/blender.exe"; P="$(cd "$(dirname "$0")/.." && pwd -W 2>/dev/null || pwd)"; G="${@:-a b c d e}"
cd "$P"
"$B" -b --python blender/stroh-struktur-speichern.py -- "$P" $G
"$B" -b --python blender/hanfboxenboden-speichern.py -- "$P" $G
"$B" -b --python blender/spaeneboxenboden-speichern.py -- "$P" $G
"$B" -b --python blender/boxenboden-viewer-export.py -- "$P" $G
"$B" -b --python blender/mistigkeit-dicht-hanf-speichern.py -- "$P" $G
"$B" -b --python blender/oberflaeche-speichern.py -- "$P" $G ebene1
echo EINSTREU-FERTIG
