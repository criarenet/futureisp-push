$(document).ready(function () {
    initIncludeComponents(startComponents);
});

/*
 * carrega componentes iniciais html
 * @returns {undefined}
 */
var initIncludeComponents = function (callback) {
    var componentsContainer = $('[data-initcomponents]');
    $.each(componentsContainer, function (i, v) {
        var data = $(v).attr('data-initcomponents');
        var pathComponent = 'pag-components/' + data + '.html';
        $(v).load(pathComponent, function () {
            if ((i + 1) === componentsContainer.length && callback) {
                callback();
            }
        });
    });
};

/*
 * carrega componentes html
 * @param {elemento html} conatiner
 * @returns {undefined}
 */
var loadIncludeComponents = function (conatiner) {
    var componentsContainer = conatiner;
    var data = $(componentsContainer).attr('data-component');
    var pathComponent = 'pag-components/' + data + '.html';
    $(componentsContainer).load(pathComponent);
};