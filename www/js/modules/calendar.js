var getCalendar = function(callback){
    
    var idEvent = gMainEvent.id;
    var url = futureIspApp.url.GET_CALENDAR.replace('idEvent', idEvent);
    var obj = {
        url: url,
        type: "GET",
        //noLoader: true,
        auth: gAuthorization,
        contentType:'application/x-www-form-urlencoded',
        query: ''
    };
    request(obj, function (json) {
        
        if (json) {
            $('#calendarImage').css('background-image', 'url("'+buildImgPath(gMainEvent.lead.path)+'")');
            window.eventDays = [];
            
            $.each(json, function (dayI, day) {
                eventDays.push(dayI)
            });
            window.actualCalendarList = json;
            //$('#mainHostsImage').css('background-image', 'url("'+buildImgPath(gMainEvent.lead.path)+'")');
            buildCalendar('#listCalendarItem', actualCalendarList[eventDays[0]], eventDays[0], callback);
            
        }else{
            window.actualCalendarList = '';
            alertInfo('Ops!','Não encontramos nenhum conteúdo cadastrado.<br>Tente novamente mais tarde.','warning');
        }
//        if(callback){
//            callback();
//        }
    });
};

var buildCalendar = function (id, data, listDate, callback) {

    $(id).html('');
    var initDivisions = '<section class="year">\n\
                    <h3>&nbsp;</h3>\n\
                    </section>\n\
                    <section class="year">\n\
                    <h3>Horário</h3>\n\
                    </section>\n\
                    <section class="year">\n\
                    <h3>&nbsp;</h3>\n\
                    </section>';

    $(id).append(initDivisions);
//    console.log(data)
        var html = '';
        $.each(data, function (hourI, hour) {

            $.each(hour, function (sessionI, session) {
//                console.log(sessionI)
                var openYear, closeYear;
                
                if(sessionI == 0){
                    openYear= '<section class="year"><h3 data-day="'+listDate+'">'+hourI.substring(0, 5)+'</h3>';
                }else{
                    openYear='';
                }
                //console.log(sessionI, (hour.length-1));
                if(sessionI == (hour.length-1)){
                   closeYear= '</section>';
                }else{
                   closeYear=''; 
                }
                //<li class="calendDesription">' + (session.short_abstract ? session.short_abstract : 'Em breve traremos mais detalhes.') + '</li>
                var item = openYear+'<section>\n\
                    <ul data-idsession="' + session.id + '" onclick="getSessionById(this)">\n\
                    <li class="calendTitle">' + (session.title).substring(0, 35) + '</li>\n\
                    <li data-idcalendaritem="' + session.id + '" class="btRegisterSession" onclick="registeSession(this)"><i class="fal fa-plus-circle"></i></li>\n\
                    <li class="calendSubTitle">' + (session.subtitle).substring(0, 35) + '</li>\n\
                    <li class="calendLocale"><i style="font-size:16px;" class="fal fa-street-view"></i> - ' + session.local + '</li>\n\
                    </ul>\n\
                    </section>'+closeYear;
                html = html + item;
            });

    });
    $(id).append(html);

    if (callback) {
        checkMyevents(callback);
        setInterval(function(){
            setActualHour();
        },10000);
    }
};

var checkMyevents = function(callback){
    
    if(!gTokenSessions){
        if(callback){
            callback();
        }
        return;
    }
    
    var obj = {
        url: futureIspApp.url.GET_MY_CALLENDAR,
        type: "GET",
        //noLoader: true,
        auth: gTokenSessions,
        contentType:'application/x-www-form-urlencoded',
        query: ''
    };
    request(obj, function (json) {
        $.each(json, function(i, v){
            
            var btsCheckeds = $("[data-idcalendaritem="+v.id+"]");
            if(btsCheckeds){
                $(btsCheckeds).html('<i style="font-size:22px;" class="fas fa-check-circle"></i>');
            }
        });
        //$(bt).html('<i style="font-size:22px;" class="fas fa-check-circle"></i>');
        if(callback){
            callback();
        }
    });
};

var setActualHour = function(){
    //var time = (moment().hour() < 10) ? ('0' + moment().hour()) : moment().hour() + ':' + moment().minute();
    var now = new Date().getTime();
    
    $.each($('[data-day]'), function (i, v) {
        var date = $(v).attr('data-day')+' '+$(v).text();
        //$.merge(date, $(v).text().split(':'));
        //var long = moment(date).unix();
        
        var long = new Date(date).getTime();
        console.log(now, long);
        if(now >= long){
            //console.log(now, long);
            $('section.year').removeClass('selected');
            $(v).parent().addClass('selected');
            $(v).removeAttr("data-day");
            setTimeout(function () {
                $('.itemTmline').scrollTop($('section.year.selected').offset().top - 180);
            }, 100);
        }
        
        //console.log(long)
    });
    
    
    //$( "section.year:contains('"+time+"')" ).addClass('selected');
    //console.log($('section.year.selected').offset().top);
   
    
};

var registeSession = function (bt) {
//    console.log(bt)
    event.stopPropagation();
    if (!gTokenSessions) {
        showHideSubscribeForm();
        setTimeout(function(){
            alertInfo('Ops!', 'É necessário registrar-se para participar.', 'warning')
        },200);
        return;
    }

    
    var idSession = $(bt).attr('data-idcalendaritem');
    var url = futureIspApp.url.SET_SELECTED_CALENDAR.replace('idSession', idSession);
    var obj = {
        url: url,
        type: "GET",
        //noLoader: true,
        auth: gTokenSessions,
        contentType: 'application/x-www-form-urlencoded',
        query: ''
    };
    request(obj, function (json) {
        
        $(bt).children('i').addClass('rotateIn animated');
        if ($(bt).children('i').hasClass('fa-check-circle')) {
            setTimeout(function () {
                $(bt).html('<i class="fal fal fa-plus-circle"></i>');
            }, 350);

        } else {
            setTimeout(function () {
                $(bt).html('<i style="font-size:22px;" class="fas fa-check-circle"></i>');
            }, 350);
        }
        var msg;
        if(json.error){
            alertInfo('Ops!','Não há mais vagas para o evento','danger');
            return;
        }
        if(json.success == 'User unregistered.'){
            msg = 'Você não esta mais inscrito no evento.';
        }else{
            msg = 'Você esta inscrito no evento.';
        }
        alertInfo('Sucesso',msg,'success')
        
    });
};

var showHideCalendar = function (callback) {
    var filters = $('#wrapperCalendar');
    var classOpen = 'slideInUp animated';
    var classClose = 'slideOutDown animated';

    if (filters.hasClass('slideInUp')) {
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

