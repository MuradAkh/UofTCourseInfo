$(document).ready(() => {
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


    $("#this-dom").change(() => {
        urloptions[url] = $("#this-dom").is(":checked");
        chrome.storage.local.set({
            urloptions: urloptions
        });

        updateTabs();
    });

    $("#all-dom").change(() => {
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



});



