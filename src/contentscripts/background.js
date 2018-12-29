/*Licensed under MIT  LICENSE
 * 
 * Murad Akhundov 2017
 */
let currentState = localStorage.currentState || "true";
const on = {
    path: {
        "128": "images/Acorn_128.png",
        "48": "images/Acorn_48.png",
        "16": "images/Acorn_16.png"
    }
};

const off = {
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
                for (let i = 0; i < tabs.length; i++) {
                    chrome.tabs.executeScript(tabs[i].id, {file: "src/contentscripts/purge.js"});
                    chrome.browserAction.setIcon(off);

                }
            }
        );


    } else if (currentState === "false") {
        localStorage.currentState = "true";
        currentState = localStorage.currentState;

        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            for (let i = 0; i < tabs.length; i++) {
                chrome.browserAction.setIcon(on);
                execute(tabs[i]);
            }
        });
    }
});


chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
        gsearch(tab);
        if (currentState === "true") {
            execute(tab);
        }
    }
});


function execute(tab) {
    if (!/.*google\....?\/search\?.*/.test(tab.url)) {
        chrome.tabs.executeScript(tab.id, {file: 'src/contentscripts/contentScript.js'});
        chrome.tabs.executeScript(tab.id, {file: 'src/contentscripts/tooltip.js'});
    }

}

function gsearch(tab) {
    if (/.*google\....?\/search\?.*/.test(tab.url)) {
        chrome.tabs.insertCSS(tab.id, {file: 'lib/bootstrap/bootstrapcustom.min.css'});
        chrome.tabs.executeScript(tab.id, {file: 'lib/bootstrap/bootstrap.bundle.js'});
        chrome.tabs.executeScript(tab.id, {file: 'src/contentscripts/google.js'});
    }
}
