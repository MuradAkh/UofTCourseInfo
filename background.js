/*Licensed under MIT  LICENSE
 * 
 * Murad Akhundov 2017
 */
var currentState = localStorage.currentState || "true";

chrome.browserAction.onClicked.addListener(function (tab) {
    if (currentState === "true") {
        chrome.browserAction.setIcon({path: 'false.png', tabId: tab.id});
        localStorage.currentState = "false";
        currentState = localStorage.currentState;
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.reload(tabs[0].id);
        });



    } else if (currentState === "false") {
        chrome.browserAction.setIcon({path: 'true.png', tabId: tab.id});
        localStorage.currentState = "true";
        currentState = localStorage.currentState;
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.reload(tabs[0].id);
        });
    }




});



chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
        if (currentState === "true") {
            chrome.browserAction.setIcon({path: 'true.png', tabId: tab.id});

        } else if (currentState === "false") {
            chrome.browserAction.setIcon({path: 'false.png', tabId: tab.id});

        }

        //alert("is " + currentState);
        if (currentState === "true") {
            chrome.tabs.executeScript(tab.id, {file: 'contentScript.js'});
            chrome.tabs.executeScript(tab.id, {file: 'tooltip.js'});
        }
    }
});
