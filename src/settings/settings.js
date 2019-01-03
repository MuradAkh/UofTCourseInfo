$(document).ready(function () {

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
        illegal:''

    }, function (items) {
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
        $('#illegal').val(items.illegal);
    });

    $('input').change(function () {
        apply();
    });

    $('select').change(function () {
        apply();
    });

    // $('#apply').click(function () {
    //     apply();
    //
    //     alert("UofT Course Info: Settings applied successfully");
    // });

    function apply() {
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
            illegal: $('#illegal').val()
        });
    }
});