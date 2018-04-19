var getHosts = function(callback){
    
//    var idEvent = $(this).attr('data-idEvent');
    var idEvent = gMainEvent.id;
    var url = futureIspApp.url.GET_HOSTS_BY_ID_EVENT.replace('idEvent', idEvent);
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
            window.actualHostsList = json;
            $('#mainHostsImage').css('background-image', 'url("'+buildImgPath(gMainEvent.lead.path)+'")');
            listHosts('#hostsList', json, callback);
            
        }else{
            window.actualHostsList = '';
            alertInfo('Ops!','Não encontramos nenhum conteúdo cadastrado.<br>Tente novamente mais tarde.','warning');
        }
    });
};

var listHosts = function (id, data, callback) {
    
    $(id).html('');
    
    $.each(data, function (i, v) {
        var imgUrl = v.avatar ? buildImgPath(v.avatar.path) : 'img/layouts/calendar-evt.jpg';
        //var firstExhibition = '1ª apresentações - ' + moment(v.start_at).format('DD/MM/YYYY - HH:mm');
        //var bgImgAvatar = 'style="background-image:url("'+buildImgPath(imgUrl)+'")"';
        //alert(bgImgAvatar)
        var hostDetail = v //$.param(v);
        var firstExhibition = v.datas[0] ? '1ª apresentação - ' + moment(v.datas[0].start_at).format('DD/MM/YYYY - HH:mm') : 'Não há nenhuma data ou hora definida';
        var item = '<li data-hostdetail="'+hostDetail+'" data-idsession="'+v.id+'" onclick="showHostDetail(this)">\n\
                    <div style=background-image:url("'+imgUrl+'") \n\
                    class="iconList col-xs-4 col-sm-4 col-md-4 col-lg-4">\n\
                    </div><div class="sectionInfo col-xs-8 col-sm-8 col-md-8 col-lg-8">\n\
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 textsSections">\n\
                    <h3 style="margin-top:10px;">'+v.name+'</h3>\n\
                    <h4 style="margin-left:10px; margin-top:3px;">' + (v.title ? v.title : 'Convidado') + '</h4>\n\
                    <p style="margin-top:7px;" class="descriptionSection">' + firstExhibition + '</p>\n\
                    <p style="margin-top:5px;" class="descriptionSection">' + (v.email ? v.email : 'Email não informado.') + '</p>\n\
                    </div></div></li>';
        
        $(id).append(item);
        
    });
    if(callback){
        callback();
    }
};

var getHostData = function (id) {
    var idHost = parseInt(id);
    for (var i = 0; i <= actualHostsList.length; i++) {
        if (actualHostsList[i].id === idHost) {
            return actualHostsList[i];
        }
    }
};

var showHostDetail = function(bt){
    var id = $(bt).attr('data-idsession');
    var json = getHostData(id);
    var schedulesList = ('#exhibitionsHost ul');
    $(schedulesList).html('');
    console.log(json);
    $('#hostName h3').html(json.name);
    $('#hostTitle h5').html(json.title ? json.title : 'Convidado');
    $('#hostEmail h5').html(json.email ? json.email : 'Email não informado');
    $('#descriptionHost p').html(json.bio ? json.bio : 'Biografia não cadastrada');
    var imgUrl;
    
    if(json.avatar){
        imgUrl = buildImgPath(json.avatar.path);
        $('#avatarHost').css('background-image', 'url("'+imgUrl+'")');
        $('#avatarHost').show();
        $('#mainHostAvatarImage i').hide();
    }else{
        $('#avatarHost').hide();
        $('#mainHostAvatarImage i').show();
    }
    
    $.each(json.datas, function (i, v) {
        console.log(v)
        if (v.start_at) {
            var exhibition = moment(v.start_at).format('DD/MM/YYYY - HH:mm');
            var item = '<li class="col-xs-12 col-sm-12 col-md-12 col-lg-12">Dia - <b>'+exhibition+'</b></li>';
            $(schedulesList).append(item);
        }
    });
    setTimeout(function(){showHideHostsDetails();},200);
};

var showHideHosts = function (callback) {
    var filters = $('#wrapperHosts');
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
var showHideHostsDetails = function (callback) {
    var filters = $('#wrapperHostsDetails');
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

sethostHeight = function (callback) {

    var allHeight = $(window).height();
    
    var hEvt = allHeight - 90 - 101;
    $('#hostContent').height(hEvt);
    if (callback) {
        callback();
    }
};

sethostDetailsHeight = function (callback) {

    var allHeight = $(window).height();
    
    var hEvt = allHeight - 90 - 101 - 60;
    $('#hostsDetailsScroll').height(hEvt);
    if (callback) {
        callback();
    }
};
