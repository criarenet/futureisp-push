$(document).ready(function () {
    $('.cardClose').on('click', showHideCard);
});


var recSimpleTokenPush = function () {
    var query = 'token='+gPushToken;
    var obj = {
        url: futureIspApp.url.RECORD_PUSH_TOKEN,
        type: "POST",
        //noLoader: true,
        auth: gAuthorization,
        contentType: 'application/x-www-form-urlencoded',
        query: query
    };
    request(obj, function (json) {
        
    });
};

var recRegisterUserTokenPush = function(){
    
};

var recSimpleTokenPush = function(){
    
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

var showHideCard = function (callback) {
    var filters = $('.wrapperCard');
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
};