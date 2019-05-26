$(document).ready(() => {
    let url;
    let urloptions;
    let globoption;

    // Standard Google Universal Analytics code
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga'); // Note: https protocol here

    ga('create', 'UA-140776274-1\n', 'auto'); // Enter your GA identifier
    ga('set', 'checkProtocolTask', function(){}); // Removes failing protocol check. @see: http://stackoverflow.com/a/22152353/1958200
    ga('require', 'displayfeatures');
    ga('send','pageview', 'popup.html');

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

        ga('send', 'event', {
            'eventCategory': 'Settings',
            'eventAction': 'this-dom',
            'eventLabel': url
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

        ga('send', 'event', {
            'eventCategory': 'Settings',
            'eventAction': 'all-dom',
        });

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



