$(document).ready(() => {
    // Standard Google Universal Analytics code
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga'); // Note: https protocol here

    ga('create', 'UA-140776274-1\n', 'auto'); // Enter your GA identifier
    ga('set', 'checkProtocolTask', function(){}); // Removes failing protocol check. @see: http://stackoverflow.com/a/22152353/1958200
    ga('require', 'displayfeatures');
    ga('send', 'pageview', '/setting.html');

    chrome.storage.local.get({
        // size: 'medium',
        link: 'website',
        breadths: true,
        highlight: false,
        prereq: true,
        inst: true,
        sess: true,
        descript: true,
        gsearch: true,
        maxtt: 1000,
        illegal: '',
        globoption: true

    }, items => {
        // $('#size').val(items.size);
        $('#link').val(items.link);
        $('#breadths').prop('checked', items.breadths);
        $('#highlight').prop('checked', items.highlight);
        $('#prerequisites').prop('checked', items.prereq);
        $('#sessions').prop('checked', items.sess);
        $('#gsearch').prop('checked', items.gsearch);
        $('#maxtt').val(items.maxtt);
        $('#instructors').prop('checked', items.inst);
        $('#description').prop('checked', items.descript);
        $('#enablepops').prop('checked', items.globoption);
        $('#illegal').val(items.illegal);
    });

    $('input').change(apply);
    $('select').change(apply);
    $('#enablepops').change(() => {
        if ($("#enablepops").is(":checked")) chrome.browserAction.setIcon(on);
        else chrome.browserAction.setIcon(off);
        updateTabs()
    });

    // $('#apply').click(function () {
    //     apply();
    //
    //     alert("UofT Course Info: Settings applied successfully");
    // });

    function apply() {
        ga('send', 'event', {
            'eventCategory': "Settings",
            'eventAction': "Applied",
        });

        chrome.storage.local.set({
            link: $('#link').val(),
            // size: $('#size').val(),
            breadths: $('#breadths').prop('checked'),
            highlight: $('#highlight').prop('checked'),
            prereq: $('#prerequisites').prop('checked'),
            inst: $('#instructors').prop('checked'),
            sess: $('#sessions').prop('checked'),
            gsearch: $('#gsearch').prop('checked'),
            maxtt: $('#maxtt').val(),
            descript: $('#description').prop('checked'),
            illegal: $('#illegal').val(),
            globoption: $('#enablepops').prop('checked'),
        });
    }
});