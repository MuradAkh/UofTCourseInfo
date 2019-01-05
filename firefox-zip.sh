#!/usr/bin/env bash
cd ./firefox-compiled
zip -r -1 firefox.zip ./data ./images ./dependencies ./src README.md ./manifest.json
cd ..
cp ./firefox-compiled/firefox.zip .
