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
    if(!tab.url.includes('https://') && !tab.url.includes('http://')) return;
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
  function (request, sender, sendResponse) {
    if (request.msg === 'TMN') createNotification(sendResponse);
  });

function createNotification() {
  const buttons =  [
    {
      "title": "Disable Notifications on this page"
    }, {
      "title": "Change Limit in the Settings"
    }
  ];
  chrome.notifications.create('limit', {
    "type": "basic",
    "iconUrl": chrome.extension.getURL("/images/Acorn_128.png"),
    "title": "UofT Course Info",
    "message": "Could not load tooltips. Too many courses mentioned, you can change this limit in the settings.",
    "buttons": buttons
  }, (id) => {});

  chrome.notifications.onButtonClicked.addListener((id, index) => {
    chrome.notifications.clear(id);
    switch (buttons[index].title) {
      case "Change Limit in the Settings": sendResponse({'msg': 'SETTINGS'});
      break;
      case "Disable this Notification": sendResponse({'msg': 'DISABLE'})
    }
  });


//include this line if you want to clear the notification after 5 seconds
  setTimeout(function () {
    chrome.notifications.clear("notificationName", function () {
    });
  }, 10000);
}
