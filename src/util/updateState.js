
const on = {
  path: {
    "128": "/images/Acorn_128.png",
    "48": "/images/Acorn_48.png",
    "16": "/images/Acorn_16.png"
  }
};

const off = {
  path: {
    "128": "/images/Acorn_red_128.png",
    "48": "/images/Acorn_red_48.png",
    "16": "/images/Acorn_red_16.png"
  }
};

function updateTabs() {
  chrome.storage.local.get({
    globoption: true,
    urloptions: {}
  }, items => {
    chrome.tabs.query({}, tabs => {
        for (let i = 0; i < tabs.length; i++) {
          if ((items.urloptions[new URL(tabs[i].url).hostname] !== false) && items.globoption) {
            if (!/.*google\....?\/search\?.*/.test(tabs[i].url)) {
              chrome.tabs.executeScript(tabs[i].id, {file: '/src/contentscripts/contentScript.js'});
              chrome.tabs.executeScript(tabs[i].id, {file: '/dependencies/tippy/tippy.all.min.js'});
              chrome.tabs.insertCSS(tabs[i].id, {file: 'dependencies/bootstrap/bootstrapcustom.min.css'});
              chrome.tabs.insertCSS(tabs[i].id, {file: 'dependencies/tippy/light.css'});
              chrome.tabs.executeScript(tabs[i].id, {file: '/src/contentscripts/tooltip.js'});
            }
          } else {
            chrome.tabs.executeScript(tabs[i].id, {file: "/src/contentscripts/purge.js"});
          }
        }
      }
    );

  });


}