/*Licensed under MIT  LICENSE
 * 
 * Murad Akhundov 2017
 */
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    gsearch(tab);
    execute(tab);
  }
});


function execute(tab) {
  chrome.storage.local.get({
    globoption: true,
    urloptions: {}
  }, function (items) {
    if (!tab.url.includes('https://') && !tab.url.includes('http://')) return;
    if (items.urloptions[new URL(tab.url).hostname] !== false && items.globoption) {
      if (!/.*google\....?\/search\?.*/.test(tab.url)) {
        chrome.tabs.executeScript(tab.id, {file: '/src/contentscripts/contentScript.js'});
        chrome.tabs.executeScript(tab.id, {file: '/dependencies/tippy/tippy.all.min.js'});
        chrome.tabs.insertCSS(tab.id, {file: 'dependencies/bootstrap/bootstrapcustom.min.css'});
        chrome.tabs.insertCSS(tab.id, {file: 'dependencies/tippy/light.css'});
        chrome.tabs.executeScript(tab.id, {file: '/src/contentscripts/tooltip.js'});
        chrome.tabs.executeScript(tab.id, {file: '/src/contentscripts/infiniteScroll.js'});
      }


    } else {
      chrome.tabs.executeScript(tab.id, {file: "/src/contentscripts/purge.js"});
    }
  });
}

function gsearch(tab) {
  if (/.*google\....?\/search\?.*/.test(tab.url)) {
    chrome.tabs.insertCSS(tab.id, {file: 'dependencies/bootstrap/bootstrapcustom.min.css'});
    chrome.tabs.executeScript(tab.id, {file: 'dependencies/bootstrap/bootstrap.bundle.min.js'});
    chrome.tabs.executeScript(tab.id, {file: 'src/contentscripts/tooltip.js'});
    chrome.tabs.executeScript(tab.id, {file: 'src/contentscripts/google.js'});
  }
}

chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.msg === 'TMN')
      createNotification().then(sendResponse);
    return true;
  });

async function createNotification() {
  const buttons = [
    {
      "title": "Ignore"
    }, {
      "title": "Settings"
    }
  ];

  chrome.notifications.create('limit', {
    "type": "basic",
    "iconUrl": chrome.extension.getURL("/images/Acorn_128.png"),
    "title": "UofT Course Info",
    "message": "Could not load tooltips. Too many courses mentioned, you can change this limit in the settings or ignore on this page",
    "buttons": buttons
  }, (id) => {
  });

  return new Promise((resolve, reject) => {

    chrome.notifications.onButtonClicked.addListener((id, index) => {
      chrome.notifications.clear(id);
      switch (buttons[index].title) {
        case "Settings":
          resolve({'msg': 'SETTINGS'});
          break;
        case "Ignore":
          resolve({'msg': 'DISABLE'})
      }
    });

    chrome.notifications.onClosed.addListener(() => resolve({msg: 'NOTHING'}))
  })
}


chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason === "update") {
    let first_run = false;
    if (!localStorage['ranb']) {
      first_run = true;
      localStorage['ranb'] = '1';
    }

    if (first_run) chrome.tabs.create({url: "http://courseinfo.murad-akh.ca/feedback/index.html"});
  }
});


