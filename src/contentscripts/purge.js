$(document).ready(() => {
    $('.corInf').each(function () {
        $(this).replaceWith($(this).data('title'));
    })
});