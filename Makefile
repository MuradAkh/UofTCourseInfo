FILES= $(shell find src -type f) $(shell find data -type f) $(shell find lib -type f) $(shell find images -type f)

all: chrome.zip firefox.zip

chrome.zip: manifest.json README.md $(FILES)
	zip -r $@ ./data ./images ./lib ./src manifest.json README.md

firefox.zip: manifest.json README.md $(FILES)
	sh firefox.sh

clean:
	rm chrome.zip firefox.zip