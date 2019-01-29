$(document).ready(function () {
    $('#settings-link').attr('href', getSettingsUrl());
    $('#about-link').attr('href', getAboutUrl());
    $('#installed').forEach(() => this.removeAttr('hidden'));
    $('#not-installed').forEach(() => this.attr('hidden'))
});