/*Licensed under MIT  LICENSE
 * 
 * Murad Akhundov 2017
 */
var currentState = localStorage.currentState || "true";
var on = {
    path: {
        "128": "images/Acorn_128.png",
        "48": "images/Acorn_48.png",
        "16": "images/Acorn_16.png"
    }
};

var off = {
    path: {
        "128": "images/Acorn_red_128.png",
        "48": "images/Acorn_red_48.png",
        "16": "images/Acorn_red_16.png"
    }
};


chrome.browserAction.onClicked.addListener(function (tab) {
    if (currentState === "true") {
        localStorage.currentState = "false";
        currentState = localStorage.currentState;
        chrome.tabs.query({}, function (tabs) {
                for (var i = 0; i < tabs.length; i++) {
                    chrome.tabs.executeScript(tabs[i].id, {file: "purge.js"});
                    chrome.browserAction.setIcon(off);

                }
            }
        );


    } else if (currentState === "false") {
        localStorage.currentState = "true";
        currentState = localStorage.currentState;

        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            for (var i = 0; i < tabs.length; i++) {
                chrome.browserAction.setIcon(on);
                execute(tabs[i]);
            }
        });
    }


});


chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
        if (currentState === "true") {
            execute(tab);
        }
    }
});


function execute(tab) {
    chrome.tabs.executeScript(tab.id, {file: 'contentScript.js'});
    chrome.tabs.executeScript(tab.id, {file: 'tooltip.js'});
}
