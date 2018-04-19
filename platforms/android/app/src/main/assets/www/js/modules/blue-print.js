var getBluePrints = function(callback){

    var bluePrintsData = gMainEvent.blueprints;
    if (bluePrintsData.length) {

        $('#mainBluePrintImage').css('background-image', 'url("'+buildImgPath(gMainEvent.lead.path)+'")');
        listBluePrints('#bluePrintsList', bluePrintsData, callback);
        
    } else {
        alertInfo('Ops!', 'Não encontramos nenhum conteúdo cadastrado.<br>Tente novamente mais tarde.', 'warning');
    }
};

var listBluePrints = function (id, data, callback) {
    
    $(id).html('');
    
    $.each(data, function (i, v) {
        var imgUrl = v.icon ? buildImgPath(v.icon.path) : 'img/layouts/calendar-evt.jpg';
        var firstExhibition = '1ª apresentações - ' + moment(v.start_at).format('DD/MM/YYYY - HH:mm');
        var item = '<li data-mainimg="'+(v.main.path).toString()+'" onclick="showBluePrintDetail(this)">\n\
                    <div style="background-image:url(' + imgUrl + '); background-size: cover;" class="iconList col-xs-4 col-sm-4 col-md-4 col-lg-4">\n\
                    </div><div class="sectionInfo col-xs-8 col-sm-8 col-md-8 col-lg-8">\n\
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 textsSections">\n\
                    <h3>'+v.name+'</h3>\n\
                    <p style="margin-top:0; padding-top:0;" class="descriptionSection">' + (v.description ? v.description.substring(0, 150) : '-') + '</p>\n\
                    </div></div></li>' ;
        
        $(id).append(item);
        
    });
    if(callback){
        callback();
    }
};

var showBluePrintDetail = function(imgContainer){
    var img = $(imgContainer).attr('data-mainimg')
    
    showHideBluePrintDetail();
    
    setTimeout(function(){
        $('#wrapperBluePrintDetail').css('background-image', 'url("'+buildImgPath(img)+'")');
    });
    
};

var showHideBluePrint = function (callback) {
    var filters = $('#wrapperBluePrint');
    var classOpen = 'slideInLeft animated';
    var classClose = 'slideOutLeft animated';

    if (filters.hasClass('slideInLeft')) {
        filters.addClass(classClose);
        setTimeout(function () {
            filters.hide();
            filters.attr('class', 'row');
        }, 300);
    } else {
        filters.show();
        filters.addClass(classOpen);

    }
//    if(callback){
//        setTimeout(function(){
//            callback();
//        },350);
//    }
};
var showHideBluePrintDetail = function (callback) {
    var filters = $('#wrapperBluePrintDetail');
    var classOpen = 'zoomIn animated';
    var classClose = 'zoomOut zoomIn';

    if (filters.hasClass('zoomIn')) {
        filters.addClass(classClose);
        setTimeout(function () {
            filters.hide();
            filters.attr('class', 'row');
        }, 300);
    } else {
        filters.show();
        filters.addClass(classOpen);

    }
//    if(callback){
//        setTimeout(function(){
//            callback();
//        },350);
//    }
};