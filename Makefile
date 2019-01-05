FILES= $(shell find src -type f) $(shell find data -type f) $(shell find dependencies -type f) $(shell find images -type f)
FIREFOX_FILES= $(shell find firefox-compiled -type f)

all: chrome.zip firefox.zip

# Package for chrome
chrome.zip: manifest.json README.md $(FILES)
	zip -r $@ ./data ./images ./dependencies ./src manifest.json README.md

# Convert to firefox
firefox-compiled: manifest.json README.md $(FILES)
	sh firefox.sh

# zip converted
firefox.zip: firefox-compiled $(FIREFOX_FILES)
	sh firefox-zip.sh

#firefox.xpi: firefox.zip
#	cp $^ $@

clean:
	rm -f chrome.zip firefox.zip
	rm -rf ./firefox-compiled