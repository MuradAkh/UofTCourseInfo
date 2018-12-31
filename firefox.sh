#!/usr/bin/env bash
mkdir ./temp
cp -r ./data ./images ./dependencies ./src ./README.md ./temp
jq -s add ./manifest.json ./firefox-extras.json | jq 'del(.key, .update_url, .options_page)'> ./temp/manifest.json
cd ./temp
zip -r -1 firefox.zip ./data ./images ./dependencies ./src README.md ./manifest.json
cd ..
cp ./temp/firefox.zip .
rm -rf ./temp