$(document).ready(function () {
    initTabs();
});

var initTabs = function () {
    var bts = $('.btTab');
    var contentTab = $('.panelTab');
    $('.btTab').on('click', chageTabOnClick);
    $.each(bts, function (i, v) {
        if ($(v).hasClass('selected')) {
            $(contentTab[i]).addClass('selected');
        }
    });
};

var chageTabOnClick = function () {
    var bt = $(this);
    $('.btTab').removeClass('selected');
    $(bt).addClass('selected');
    $('.panelTab').removeClass('selected');
    $($('.panelTab')[bt.index()]).addClass('selected');
};

