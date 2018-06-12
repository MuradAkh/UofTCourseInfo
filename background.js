/*Licensed under MIT  LICENSE
 * 
 * Murad Akhundov 2017
 */
var currentState = localStorage.currentState || "true";

chrome.browserAction.onClicked.addListener(function (tab) {
    if (currentState === "true") {
        localStorage.currentState = "false";
        currentState = localStorage.currentState;
        chrome.tabs.query({}, function (tabs) {
                for (var i = 0; i < tabs.length; i++) {
                    chrome.tabs.executeScript(tabs[i].id, {file: "purge.js"});
                    chrome.browserAction.setIcon({path: 'images/false.png', tabId: tabs[i].id});

                }
            }
        );


    } else if (currentState === "false") {
        localStorage.currentState = "true";
        currentState = localStorage.currentState;

        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            for (var i = 0; i < tabs.length; i++) {
                chrome.browserAction.setIcon({path: 'images/true.png', tabId: tabs[i].id});
                execute(tabs[i]);
            }
        });
    }




});



chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    //chrome.tabs.executeScript(tab.id, {file: "purge.js"});

    if (changeInfo.status === 'complete') {
        if (currentState === "true") {
            chrome.browserAction.setIcon({path: 'images/true.png', tabId: tab.id});

        } else if (currentState === "false") {
            chrome.browserAction.setIcon({path: 'images/false.png', tabId: tab.id});

        }

        //alert("is " + currentState);
        if (currentState === "true") {

            execute(tab);
        }
    }
});


function execute(tab) {
    chrome.tabs.executeScript(tab.id, {file: 'contentScript.js'});
    chrome.tabs.executeScript(tab.id, {file: 'tooltip.js'});
}
