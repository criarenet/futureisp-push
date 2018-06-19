$(document).ready(function () {
    
    var hMessagegBox = ($(window).height() - 30);
    window.initPositionMessageBox = ((-hMessagegBox)+30);
    $('.wrapperCard').height(hMessagegBox);
    $('.wrapperCard ul').height(hMessagegBox-80);
    $('.wrapperCard').css('bottom', initPositionMessageBox + 'px');
    
    getMessagePushList();
    loadPushs;
    
    
    
    $('.cardClose').on('click', function(e){
        //e.preventDefault();
        if(parseInt($('.wrapperCard').css('bottom')) === initPositionMessageBox){
            $('.wrapperCard').css('bottom', initPositionMessageBox + 35 + 'px');
            setTimeout(function(){
                $('.wrapperCard').hide();
            },100);
        }else{
            $('.wrapperCard').css('bottom', initPositionMessageBox + 'px');
        }
        
        
//        if($('.cardClose i.fa-times').length){
//            $('.wrapperCard').css('bottom', 0);
//            $('.cardClose i.fa-times').removeClass('fa-arrow-from-bottom');
//            $('.cardClose i.fa-times').addClass('fa-times');
//        }else{
//            $('.cardClose i.fa-times').removeClass('fa-times');
//            $('.cardClose i.fa-times').addClass('fa-arrow-from-bottom');
//            $('.wrapperCard').css('bottom', initPositionMessageBox + 'px');
//        }
        
        
    });
});

var loadPushs = setInterval(function(){
        getMessagePushList();
    },30000);



var setPushsRead = function(){
   
    if(!window.gTokenSessions){
        return;
    }
//    if(!$('#recivedPushList li.visualized').length){
//        return;
//    }
    var query;
    
    $.each($('#recivedPushList li'), function(i, v){
        if(!$(v).hasClass('visualized')){
            var id = $(v).attr('data-pudhid');
            if(!query){
                query = '&ids[]=' + id;
            }else{
                query += '&ids[]=' + id;
            }
        }
    });
    
    if(!query){
        return;
    }
    
    var obj = {
        url: futureIspApp.url.SET_PUSHS_READ,
        type: "POST",
        noLoader: true,
        auth: gTokenSessions,
        contentType: 'application/x-www-form-urlencoded',
        query: query
    };
    
    request(obj, function (json) {
        
    });
};

var getMessagePushList = function(){

    if(!window.gTokenSessions){
        return;
    }
    
    var obj = {
        url: futureIspApp.url.GET_USER_PUSHS,
        type: "GET",
        noLoader: true,
        auth: gTokenSessions,
        contentType: 'application/x-www-form-urlencoded',
        query: ''
    };
    
    request(obj, function (json) {
        
        buildMessagePushList('#recivedPushList', json, function(){
            if(!json[0].pivot.received_at){
             setTimeout(function () {
                $('.wrapperCard').fadeIn(200);
            }, 300);   
            }
            
        });
    });
};

var buildMessagePushList = function (id, data, callback) {
    console.log(data[0].pivot.received_at);
    if ($('#recivedPushList li').length && data[0].pivot.received_at) {
        return;
    }

    $(id).html('');
    $.each(data, function (i, v) {
        var sended = 'Enviada: ' + moment(v.start_at).format('DD/MM/YYYY - HH:mm');
        var readMsg = v.pivot.received_at ? 'visualized' : '';

        var item = '<li data-pudhid="' + v.id + '" class="card-text col-xs-12 col-sm-12 col-md-12 col-lg-12 ' + readMsg + '">\n\
        <h4 class="col-xs-12 col-sm-12 col-md-12 col-lg-12">' + (readMsg ? v.title : '•' + v.title) + '</h4>\n\
        <p class="details col-xs-12 col-sm-12 col-md-12 col-lg-12">\n\
        <i class="fal fa-bell newMessages"></i>' + sended + '</p>\n\
        <p class="col-xs-12 col-sm-12 col-md-12 col-lg-12">' + v.body + '</p>\n\
        <span class="delMsg" onclick="delMessage(this)"><i class="fal fa-trash-alt"></i></span>\n\
        </li>';

        $(id).append(item);
    });

    if (callback) {
        sliderDelEvent();
        callback();
    }
};

var delMessage = function (bt) {

    var message = $(bt).parent();
    var id = $(message).attr('data-pudhid');
    var obj = {
        url: futureIspApp.url.HIDE_MESSAGE,
        type: "POST",
        //noLoader: true,
        auth: gTokenSessions,
        contentType: 'application/x-www-form-urlencoded',
        query: 'id=' + id
    };
    request(obj, function (json) {
        $(message).addClass('fadeOutLeft animated');
        setTimeout(function () {
            $(message).remove();
            alertInfo('Sucesso', 'Mensagem apagada com sucesso.', 'success');
        }, 350);
     });
    
};

var recSimpleTokenPush = function () {
    var query = 'token='+gPushToken;
    //alert(query)
    var obj = {
        url: futureIspApp.url.RECORD_PUSH_TOKEN,
        type: "POST",
        //noLoader: true,
        auth: gAuthorization,
        contentType: 'application/x-www-form-urlencoded',
        query: query
        
    };
    request(obj, function (json) {
        //alertInfo('Sucesso', json, 'success');
    });
};

var recRegisterUserTokenPush = function(){
    
};

var buildPushMessage = function(obj){

//$('.card-title').html(obj.title);
//$('.card-text').html(obj.message);

setTimeout(function(){
    alertInfo(obj.title,obj.message,'success');
},300)
//var card = '<div class="card" style="width: 18rem;"><div class="card-body">\n\
//<h5 class="card-title">Card title</h5>\n\
//<h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6>\n\
//<p class="card-text">Some quick example text to build on the card title and make up the bulk of the cards content.</p>\n\
//<a href="#" class="card-link">Card link</a>\n\
//<a href="#" class="card-link">Another link</a>\n\
//</div>\n\
//</div>';
    
};

$('#headerCardMsg')[0].addEventListener('touchstart', function(e) {
    e.preventDefault();
    console.log(e.touches);
    var touch = e.touches[0];
    window.initY = touch.pageY;
});

$('#headerCardMsg')[0].addEventListener('touchmove', function(e) {
    
    var card = $('.wrapperCard')[0];
    e.preventDefault();
    var touch = e.touches[0];
    
    if(touch.pageY > initY){
        $(card).css('bottom', initPositionMessageBox + 'px');
    }else{
        $(card).css('bottom', 0);
        setPushsRead();
    }
    
}, false);


var showHideCard = function (callback) {
    var filters = $('.wrapperCard');
    var classOpen = 'slideInRight animated';
    var classClose = 'slideOutRight animated';

};


var sliderDelEvent = function () {

    $.each($('#recivedPushList li'), function (i, v) {
        v.addEventListener('touchstart', function (e) {
            //e.preventDefault();
            console.log(e.touches);
            var touch = e.touches[0];
            window.initX = touch.pageX;
        });
    });

    $.each($('#recivedPushList li'), function (i, v) {
        v.addEventListener('touchmove', function (e) {

            var card = $('.wrapperCard')[0];
            var _this = $(this)
            //e.preventDefault();
            var touch = e.touches[0];
//            var str = parseInt(initX) + '---' + parseInt(touch.pageX)
            if (touch.pageX + 50 < initX) {
                $('#recivedPushList li').removeClass('deleting');
                _this.addClass('deleting');
                _this.children('.delMsg').addClass('fadeInRight animated');
                
            } else if(touch.pageX - 50 > initX){
                _this.removeClass('deleting');
            }

        });
    });

}