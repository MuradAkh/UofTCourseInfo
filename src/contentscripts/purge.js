$(document).ready(function () {
    $('.corInf').each(function () {
        $(this).replaceWith($(this).data('title'));
    })
});