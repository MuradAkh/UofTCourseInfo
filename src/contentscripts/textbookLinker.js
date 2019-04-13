$(document).ready(function () {
    $('#settings-link').attr('href', getSettingsUrl());
    $('#about-link').attr('href', getAboutUrl());
    $('.installed').removeAttr('hidden');
    $('.not-installed').attr('hidden', '');
});