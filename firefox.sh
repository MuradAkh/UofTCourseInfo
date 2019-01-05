#!/usr/bin/env bash
# remove old "binaries"
rm -rf ./firefox-compiled > /dev/null # ignore the warning

# make compiled dir
mkdir ./firefox-compiled

cp -r ./data ./images ./dependencies ./src ./README.md ./firefox-compiled

# filter the manifest requires jq
# will add firefox extras and remove stuff only needed for chrome
jq -s add ./manifest.json ./firefox-extras.json | jq 'del(.key, .update_url, .options_page)'> ./firefox-compiled/manifest.json


#rm -rf ./firefox-compiled