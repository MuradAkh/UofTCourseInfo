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

$(document).ready(function () {
    let url;
    let urloptions;
    let globoption;

    chrome.storage.local.get({
        globoption: true,
        urloptions: {}
    }, function (items) {
        urloptions = items.urloptions;
        globoption = items.globoption;
        $("#all-dom").attr('checked', globoption);
        setURL();
    });


    $("#this-dom").change(function () {
        urloptions[url] = $("#this-dom").is(":checked");
        chrome.storage.local.set({
            urloptions: urloptions
        });

        updateTabs();
    });

    $("#all-dom").change(function () {
        globoption = $("#all-dom").is(":checked");
        chrome.storage.local.set({
            globoption: globoption
        });

        if (globoption) chrome.browserAction.setIcon(on);
        else chrome.browserAction.setIcon(off);

        updateTabs();
    });


    function setURL() {
        chrome.tabs.query({'active': true, 'currentWindow': true}, function (tabs) {
            url = (new URL(tabs[0].url)).hostname;
            $("#curr-domain").text(url);
            $("#this-dom").attr('checked', urloptions[url] !== false);
        });
    }


    function updateTabs() {
        chrome.tabs.query({}, function (tabs) {
                for (let i = 0; i < tabs.length; i++) {
                    if ((urloptions[new URL(tabs[i].url).hostname] !== false) && globoption) {
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
    }
});



