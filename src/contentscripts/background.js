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
        if (items.urloptions[new URL(tab.url).hostname] !== false && items.globoption) {
            if (!/.*google\....?\/search\?.*/.test(tab.url)) {
                chrome.tabs.executeScript(tab.id, {file: '/src/contentscripts/contentScript.js'});
                chrome.tabs.executeScript(tab.id, {file: '/dependencies/tippy/tippy.all.min.js'});
                chrome.tabs.insertCSS(tab.id, {file: 'dependencies/bootstrap/bootstrapcustom.min.css'});
                chrome.tabs.insertCSS(tab.id, {file: 'dependencies/tippy/light.css'});
                chrome.tabs.executeScript(tab.id, {file: '/src/contentscripts/tooltip.js'});
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
