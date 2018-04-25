var getSessions = function(idEvent, callback){
    
//    var idEvent = $(this).attr('data-idEvent');
    var idEvent = idEvent;
    
    var obj = {
        url: futureIspApp.url.GET_SESSIONS + idEvent,
        type: "GET",
        //noLoader: true,
        auth: gAuthorization,
        contentType:'application/x-www-form-urlencoded',
        query: ''
    };
    request(obj, function (json) {
        if (json.sessions.length) {

            var imgUrl = json.lead ? buildImgPath(json.lead.path) : 'img/layouts/calendar-evt.jpg';
            $('#bannerLeed').attr('src', imgUrl);
            $('.mainEventOnSection').html(json.name ? (json.name).substring(0, 25) : '-');
            $('.dateEevntOnSection').html(json.subtitle ? (json.subtitle).substring(0, 25) : '-');
            listSessions('#sessionsList', json.sessions, callback);
        }else{
            gMainEvent = gEvents[0];
            alertInfo('Ops!','Não encontramos nenhum conteúdo cadastrado.<br>Tente novamente mais tarde.','warning');
        }
    });
};

var listSessions = function (id, data, callback) {
    
    $(id).html('');
    
    $.each(data, function (i, v) {
        if (v.featured) {
            var subTitle = v.subtitle ? v.subtitle.substring(0, 35) : '';
            var title = v.title ? v.title.substring(0, 30) : '';
            var imgUrl = v.icon ? buildImgPath(v.icon.path) : 'img/layouts/calendar-evt.jpg';
            var firstExhibition = v.dates[0] ? '1ª apresentação - ' + moment(v.dates[0].start_at).format('DD/MM/YYYY - HH:mm') : 'Não há nenhuma data ou hora definida';
            var item = '<li onclick="getSessionById(this)" data-idsession="' + v.id + '">\n\
                    <div style="background-image:url(' + imgUrl + '); background-size: cover;" class="iconList col-xs-4 col-sm-4 col-md-4 col-lg-4">\n\
                    </div><div class="sectionInfo col-xs-8 col-sm-8 col-md-8 col-lg-8">\n\
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 textsSections">\n\
                    <h3>' + title + '</h3>\n\
                    <h4 style="margin-left:10px;">' + subTitle + '</h4>\n\
                    <p class="descriptionSection">' + firstExhibition + '</p>\n\
                    <p style="margin-top:10px;" class="descriptionSection"><i style="font-size:16px;" class="fal fa-street-view"></i> - ' + v.local + '</p>\n\
                    </div></div></li>';
//'<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 waves-effect waves-grey">\n\
//<span data-idsession="'+v.id+'">PARTICIPAR</span>\n\
//</div>'
            $(id).append(item);
        }
    });
    if(callback){
        callback();
    }
};

var showHideSessionDetails = function (callback) {
    var filters = $('#wrapperSessionDetails');
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
//        },100);
//    }
};

var getSessionById = function (btClicked) {

    var idSession = $(btClicked).attr('data-idsession');

    var obj = {
        url: futureIspApp.url.GET_SESSIONS_BY_ID + idSession,
        type: "GET",
        //noLoader: true,
        auth: gAuthorization,
        contentType: 'application/x-www-form-urlencoded',
        query: ''
    };
    request(obj, function (json) {
        $('#personality ul').html('');
        printSessionDetails(json, showHideSessionDetails);
    });
};

var printSessionDetails = function(data, callback){
    var img = data.lead ? buildImgPath(data.lead.path) : 'img/layouts/calendar-evt.jpg'
    $('#mainSessionImage').css('background-image', 'url("'+img+'")');
    $('#sessionName h3').html(data.title);
    $('#sessionSubTitle h5').html(data.subtitle);
    $('#descriptionSession p').html(data.long_abstract);
    listDatesSessions('#exhibitions ul', data.dates, callback);
    
    
//    if(callback){
//        setTimeout(function(){callback();},150);
//    }
    
};

var setPersonalities = function (arr, callback) {
    //console.log(arr);
    
    if(!arr.length){
        var item = '<li class="col-xs-12 col-sm-12 col-md-12 col-lg-12">Não há convidados para este evento</li>';
        $('#personality ul').append(item);
        return;
    }
    
    var controlArr = [];
    $.each(arr, function (i, v) {
        $.each(v, function (ind, val) {
            if ($.inArray(val.id, controlArr) == -1) {
                controlArr.push(val.id);
                var item = '<li class="col-xs-12 col-sm-12 col-md-12 col-lg-12"><span><b>' + (val.name ? val.name : '') + '</b>\n\
                </span> - ' + (val.title ? val.title : '') + '</li>';
                $('#personality ul').append(item);
            }
        });
    });

    if (callback) {
        setTimeout(function () {
            callback();
        }, 400)
    }
};



var listDatesSessions = function (id, data, callback) {

    $(id).html('');
    
    if (!data.length) {
        
        var personalityItem = '<li class="col-xs-12 col-sm-12 col-md-12 col-lg-12">Não há convidados para este evento</li>';
        $('#personality ul').append(personalityItem);
        
        var emptyItem = '<li class="col-xs-12 col-sm-12 col-md-12 col-lg-12">Não há horários definidos para o evento.</li>';
        $(id).append(emptyItem);
        if (callback) {
            setTimeout(function () {
                callback();
            }, 400);
        }
    }
    else {
        var arr = [];
        $.each(data, function (i, v) {
            if(v.start_at){
                var exhibition = moment(v.start_at).format('DD/MM/YYYY - HH:mm');
                var endExhibition = moment(v.end_at).format('DD/MM/YYYY - HH:mm');

                var item = '<li class="col-xs-6 col-sm-6 col-md-6 col-lg-6"><b class="startBall">• </b>' + exhibition + '</li>\n\
                <li class="col-xs-6 col-sm-6 col-md-6 col-lg-6"><b class="endBall">• </b>' + endExhibition + '</li>';

                $(id).append(item);
            }
            arr.push(v.hosts);
        });
        setPersonalities(arr, callback);
    }
};

setSessionContentHeight = function (callback) {

    var allHeight = $(window).height();
    
    var hEvt = allHeight - 44 - 101;
    $('#sessionContent').height(hEvt);
    if (callback) {
        callback();
    }
};