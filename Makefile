FILES= $(shell find src -type f) $(shell find data -type f) $(shell find lib -type f) $(shell find images -type f)

all: chrome.zip

chrome.zip: manifest.json README.md $(FILES)
	zip -r $@ ./data ./images ./lib ./src manifest.json README.md

clean:
	rm chrome.zip