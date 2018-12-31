FILES= $(shell find src -type f) $(shell find data -type f) $(shell find dependencies -type f) $(shell find images -type f)

all: chrome.zip firefox.zip

# Package for chrome
chrome.zip: manifest.json README.md $(FILES)
	zip -r $@ ./data ./images ./dependencies ./src manifest.json README.md

# Convert to firefox
firefox.zip: manifest.json README.md $(FILES)
	sh firefox.sh

#firefox.xpi: firefox.zip
#	cp $^ $@

clean:
	rm chrome.zip firefox.zip