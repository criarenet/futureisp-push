var getExhibitors = function(callback){
    
//    var idEvent = $(this).attr('data-idEvent');
    var idEvent = gMainEvent.id;
    var url = futureIspApp.url.GET_COMPANIES_BY_ID_EVENT.replace('idEvent', idEvent);
    var obj = {
        url: url,
        type: "GET",
        //noLoader: true,
        auth: gAuthorization,
        contentType:'application/x-www-form-urlencoded',
        query: ''
    };
    request(obj, function (json) {
        
        if (json.length) {
            window.actualExhibitorsList = json;
            $('#mainExhibitorsImage').css('background-image', 'url("'+buildImgPath(gMainEvent.lead.path)+'")');
            listExhibitors('#exhibitorsList', json, callback);
            
        }else{
            window.actualExhibitorsList = '';
            alertInfo('Ops!','Não encontramos nenhum conteúdo cadastrado.<br>Tente novamente mais tarde.','warning');
        }
    });
};

var listExhibitors = function (id, data, callback) {
    
    $(id).html('');
    
    $.each(data, function (i, v) {
        var imgUrl = v.icon ? buildImgPath(v.icon.path) : 'img/layouts/calendar-evt.jpg';
        //var firstExhibition = '1ª apresentações - ' + moment(v.start_at).format('DD/MM/YYYY - HH:mm');
        //var bgImgAvatar = 'style="background-image:url("'+buildImgPath(imgUrl)+'")"';
        //alert(bgImgAvatar)
        console.log(v)
        var exhibitorDetail = v //$.param(v);
        var item = '<li data-exhibitordetail="'+exhibitorDetail+'" data-idcompany="'+v.id+'" onclick="showExhibitorDetail(this)"  style="min-height:120px;"><div style=background-image:url("'+imgUrl+'") \n\
                    class="iconList col-xs-4 col-sm-4 col-md-4 col-lg-4">\n\
                    </div><div class="sectionInfo col-xs-8 col-sm-8 col-md-8 col-lg-8">\n\
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 textsSections">\n\
                    <h3 style="margin-top:10px;">'+v.name+'</h3>\n\
                    <h4 style="margin-left:10px; margin-top:15px;"><i style="font-size:16px;" \n\
                    class="fal fa-globe"></i> - ' + (v.site ? v.site : 'Não informado') + '</h4>\n\
                    <h4 style="margin-left:12px; margin-top:12px;"><i style="font-size:16px;" \n\
                    class="fal fa-phone-volume"></i> - ' + (v.phone ? v.phone : 'Não informado') + '</h4>\n\
                    </div></div></li>';
        
        $(id).append(item);
        
    });
    if(callback){
        callback();
    }
};

var getExhibitorData = function (id) {
    var idExhibitor = parseInt(id);
    for (var i = 0; i <= actualExhibitorsList.length; i++) {
        if (actualExhibitorsList[i].id === idExhibitor) {
            return actualExhibitorsList[i];
        }
    }
};

var showExhibitorDetail = function(bt){
    //alert('ss')
    var id = $(bt).attr('data-idcompany');
    var json = getExhibitorData(id);
    var schedulesList = ('#exhibitionsExhibitor ul');
    $(schedulesList).html('');
    //console.log(json);
    $('#exhibitorName h3').html(json.name);
    //$('#exhibitorTitle h5').html(json.title ? json.title : 'Convidado');
    //$('#exhibitorEmail h5').html(json.email ? json.email : 'Email não informado');
    $('#descriptionExhibitor p').html(json.description ? json.description : 'Biografia não cadastrada');
    //var imgUrl = buildImgPath(json.lead.path);
    var imgUrl = json.lead ? buildImgPath(json.lead.path) : 'img/layouts/calendar-evt.jpg';
    $('#mainExhibitorImage').css('background-image', 'url("'+imgUrl+'")');

//    if(json.avatar){
//        imgUrl = buildImgPath(json.leed.path);
//        $('#mainExhibitorImage').css('background-image', 'url("'+imgUrl+'")');
//        $('#avatarExhibitor').show();
//        $('#mainExhibitorAvatarImage i').hide();
//    }else{
//        $('#avatarExhibitor').hide();
//        $('#mainExhibitorAvatarImage i').show();
//    }
    
    setTimeout(function(){showHideExhibitorsDetails();},200);
};

var showHideExhibitors = function (callback) {
    var filters = $('#wrapperExhibitors');
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
var showHideExhibitorsDetails = function (callback) {
    
    var filters = $('#wrapperExhibitorsDetails');
    var classOpen = 'slideInRight animated';
    var classClose = 'slideOutRight animated';

    if (filters.hasClass('slideInRight')) {
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

setExhibitorHeight = function (callback) {

    var allHeight = $(window).height();
    
    var hEvt = allHeight - 90 - 101;
    $('#exhibitorContent').height(hEvt);
    if (callback) {
        callback();
    }
};

setExhibitorDetailsHeight = function (callback) {

    var allHeight = $(window).height();
    
    var hEvt = allHeight - 90 - 101 - 15;
    $('#exhibitorsDetailsScroll').height(hEvt);
    if (callback) {
        callback();
    }
};
