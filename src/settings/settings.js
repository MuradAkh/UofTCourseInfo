$(document).ready(function () {

    chrome.storage.local.get({
        size: 'medium',
        link: 'website',
        breadths: true,
        highlight: false,
        prereq: true,
        inst: true,
        sess: true,
        descript: true,
        maxtt: 300,
        illegal:''

    }, function (items) {
        $('#size').val(items.size);
        $('#link').val(items.link);
        $('#breadths').prop('checked', items.breadths);
        $('#highlight').prop('checked', items.highlight);
        $('#prerequisites').prop('checked', items.prereq);
        $('#sessions').prop('checked', items.sess);
        $('#maxtt').val(items.maxtt);
        $('#instructors').prop('checked', items.inst);
        $('#description').prop('checked', items.descript);
        $('#illegal').val(items.illegal);
    });


    $('#apply').click(function () {

        chrome.storage.local.set({
            link: $('#link').val(),
            size: $('#size').val(),
            breadths: $('#breadths').prop('checked'),
            highlight: $('#highlight').prop('checked'),
            prereq: $('#prerequisites').prop('checked'),
            inst: $('#instructors').prop('checked'),
            sess: $('#sessions').prop('checked'),
            maxtt: $('#maxtt').val(),
            descript: $('#description').prop('checked'),
            illegal: $('#illegal').val()
        });

        alert("UofT Course Info: Settings applied successfully");
    })
});