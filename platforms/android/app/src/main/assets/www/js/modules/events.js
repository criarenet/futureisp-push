var getEvents = function(callback){
    var obj = {
        url: futureIspApp.url.GET_EVENTS,
        type: "GET",
        //noLoader: true,
        auth: gAuthorization,
        contentType:'application/x-www-form-urlencoded',
        query: ''
    };
    request(obj, function (json) {
        if (json) {
            window.gEvents = json;
            listEvents('#eventsList', json, function () {
                //callback();
                setTimeout(function () {
                    $('#splashScreen').fadeOut(300);
                }, 400);
            });
            if (callback) {
                callback();
            }
        }

    });
};

var getEventData = function (id) {
    var idEvent = parseInt(id);
    for (var i = 0; i <= gEvents.length; i++) {
        if (gEvents[i].id === idEvent) {
            return gEvents[i];
        }
    }
};

var listEvents = function (id, data, callback) {
    $.each(data, function (i, v) {
        var year = v.start_at.split('-')[0];
        var nameMaxSize = v.name.substring(0, 25);
        var descriptionMaxSize = v.subtitle.substring(0, 25);
        var src = v.main ? buildImgPath(v.main.path) : 'img/layouts/calendar-evt.jpg';
        if (i) {
            var item = '<li style="background-image:url('+src+');" data-notMenu="pagAction" data-idEvent="' + v.id + '" data-navigate="eventSchedule"\n\
                 onclick="navigateApp(this, true)"><div class="eventInfo">\n\
                <div class="col-xs-9 col-sm-9 col-md-9 col-lg-9 maxContent">\n\
                <div class="evtLocale">' + nameMaxSize + '</div>\n\
                <div class="evtDays"><span>' + descriptionMaxSize + '</span></div></div>\n\
                <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3 maxContent">\n\
                <div class="rotateYear">' + year + '</div></div></div>'
            $(id).append(item);
        } else {
            window.gMainEvent = v;
            $('#mainLocale').html(nameMaxSize);
            $('#mainDays').html(descriptionMaxSize);
            $('#rotateYear').html(year);
            $('#eventInfoHome').attr('data-idEvent', v.id);
            $('#scheduleIcon').attr('data-idEvent', v.id);
            $('#mainBanner').css('background-image', 'url("'+src+'")');
            //$('#mainBanner img').attr('src', src);
        }
    });
    if (callback) {
        callback();
    }
};