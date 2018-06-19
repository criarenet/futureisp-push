var pictureSource, myAvatar;   // picture source
var destinationType; // sets the format of returned value

$(document).ready(function () {
    //var db = window.openDatabase("dbAppFutureIsp", "1.0", "FutureIsp app DB", 200000);
    //db.transaction(createDB, errorCB, successCB);
    getAppToken(getEvents);
    getUser(userTrue);
    //pushStart();
});
//document.addEventListener("deviceready", myActions, false);

function myActions() {
    
//    var db = window.openDatabase("dbAppFutureIsp", "1.0", "FutureIsp app DB", 200000);
//    db.transaction(createDB, errorCB, successCB);
//    
//    getAppToken(function(){
//        getEvents();
//        getUser(userTrue);
//    });
//    
//    pictureSource = navigator.camera.PictureSourceType;
//    destinationType = navigator.camera.DestinationType;
//    setScreenOrientation('portrait');
//    StatusBar.hide();
    //pushStart();
}

function onPhotoDataSuccess(imageData) {
    myAvatar = 'data:image/jpeg;base64,' + imageData + '"';
    $('#formAvatar').css('background-image', 'url("data:image/jpeg;base64,' + imageData + '"');
    $('#formAvatar').addClass('whImg');
    $('#formAvatar i').hide();
}

function capturePhotoEdit() {
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, {quality: 5, allowEdit: true,
        destinationType: destinationType.DATA_URL});
}
function getPhoto(source) {
    navigator.camera.getPicture(onPhotoURISuccess, onFail, {quality: 50,
        destinationType: destinationType.FILE_URI,
        sourceType: source});
}

function onFail(message) {
    alertInfo('Ops!', message, 'warning');
}


var startComponents = function () {

    Waves.init();
    initSliders();

    $('#home').show(function () {
        window.hPag = 'home';
        setTimeout(function () {
            setEventListHeight(function () {
                $('#home').addClass('activeView');
                mainMenuFlaying();
                $('#hamburgMenu ul li').on('click', navigateApp);
                $('#eventInfoHome').on('click', navigateApp);
                $('#scheduleIcon').on('click', navigateApp);
                $('#subscribeIcon').on('click', navigateApp);
                $('#btSubscribeForm').on('click', showHideSubscribeForm);
                $('#btSessionDetails').on('click', showHideSessionDetails);
                
                $('#btHosts').on('click', showHideHosts);
                $('#btExhibitors').on('click', showHideExhibitors);
                $('#btExhibitorDetails').on('click', showHideExhibitorsDetails);
                
                $('#btMapArea').on('click', function(){
                    showHideMapArea();
//                    setTimeout(function(){$('#map').removeClass('opened');},250);
                    setTimeout(function(){$('.hideLoadMap').css('opacity', '0');},250);
                });
                
                $('#btBluePrintDetail').on('click', function(){
                    $('.zoomContainer').hide();
                    showHideBluePrintDetail()
                });
                
                $('#btBluePrint').on('click', showHideBluePrint);
                
                $('#exhibitorsIcon').on('click', navigateApp);
                $('#hostsIcon').on('click', navigateApp);
                $('#btHostsDetails').on('click', showHideHostsDetails);
                $('#btExhibitorsDetails').on('click', showHideExhibitorsDetails);
                                
                $('#mapIcon').on('click', navigateApp);
                $('#bluePrintIcon').on('click', navigateApp);
                
                $("#realTimeButton i").click(function(){
                    setTimeout(function(){
                        getCalendar(showHideCalendar);
                        //alert('ha')  
                    }, 250)
                });
                
                $('#btCalendar').on('click', showHideCalendar);
                //$('#btCalendar').on('click', setMessage);
                $('.btRegister').on('click', registerUser);
                
                
                $('#notificationsIcon').on('click', navigateApp);
                
                $('.systemVersion').on('click', function(){
                    cordova.InAppBrowser.open("http://www.criarenet.com/", "_blank", "location=no");
                });
                
                setSessionContentHeight();
                sethostHeight();
                sethostDetailsHeight();
                setExhibitorHeight();
                setExhibitorDetailsHeight();
                
                slideMenuSize = 20;
                $('#wrapperHeader').removeClass('menuOff');
                
            });
        }, 500);
    });

//    setTimeout(function(){
//        StatusBar.hide();
//        setScreenOrientation('portrait');
//    },2000);

};

var setScreenOrientation = function (position, callback) {
    screen.orientation.lock(position);
    if (callback) {
        setTimeout(function () {
            callback();
        }, 600);
    }
};

var navigateApp = function (el, list) {
    var waveTime = 250;
    var _this, idEvent, menuClicked;

    if (list) {
        _this = $(el).attr('data-navigate');
        idEvent = $(el).attr('data-idEvent');
        menuClicked = $(el).attr('data-notMenu');
        gMainEvent = getEventData(idEvent);
    } else {
        _this = $(this).attr('data-navigate');
        idEvent = $(this).attr('data-idEvent');
        menuClicked = $(this).attr('data-notMenu');
    }

    window.hPag = _this;
    var actual = $('.evtsSections.activeView').attr('id');

    if (actual == _this) {
        if (menuClicked !== 'pagAction') {
            slideout.toggle();
        }
        return;
    }

    switch (_this) {
        case 'home':
            gMainEvent = gEvents[0];
            setAppArea(menuClicked, _this, waveTime);
            break;
            
        case 'eventSchedule':
            var idEvent = gMainEvent.id;
            getSessions(idEvent, function () {
                setAppArea(menuClicked, _this, waveTime);
            });
            break;
            
        case 'subscribe':
            var time;
            if (menuClicked !== 'pagAction') {
                slideout.toggle();
                time = 250;
            } else {
                time = 0;
            }
            setTimeout(function () {
                showHideSubscribeForm();
            }, time);
            break;
            
        case 'mapArea':
            var time;
            
            if(!gMainEvent.location){
                alertInfo('Ops!', 'Desculpe, mas não encontramos o endereço do evento.', 'warning');
                return;
            }
            
            if (menuClicked !== 'pagAction') {
                slideout.toggle();
                time = 250;
            } else {
                time = 0;
            }
            setTimeout(function () {
                $('.maskLoader').fadeIn(50);
                setTimeout(function(){
                    var googleAddress = gMainEvent.location.address.address + ', ' + 
                    gMainEvent.location.address.number + ' ' + gMainEvent.location.address.district + ' - ' + 
                    gMainEvent.location.address.city + ' ' + gMainEvent.location.address.province + '<br>CEP: '+gMainEvent.location.address.cep;
                    
                    $('#locationName h3').html(gMainEvent.location.name);
                    $('#locationAddress').html(googleAddress);
                    $('#mainMapAreaImage').css('background-image', 'url("'+buildImgPath(gMainEvent.lead.path)+'")');
                    
                    setTimeout(function(){
                        $('.maskLoader').fadeOut(50);
                        setTimeout(function(){
                            showHideMapArea(
                                function(){$('.hideLoadMap').css('opacity', '1');
                                initMap(15, googleAddress);
                            });
                        },150);
                    },1500);
                    
                },250);
            }, time);
            break;
            
        case 'bluePrint':
            if (menuClicked !== 'pagAction') {
                slideout.toggle();
                time = 250;
            } else {
                time = 0;
            }
            getBluePrints(function () {
                setTimeout(function () {
                    showHideBluePrint();
                }, time);
            });
            break;
            
        case 'hosts':
            if (menuClicked !== 'pagAction') {
                slideout.toggle();
                time = 250;
            } else {
                time = 0;
            }
            sethostHeight()
            setTimeout(function () {
                getHosts(function(){
                    showHideHosts();
                });
            }, time);
            break;
            
            case 'exhibitors':
            if (menuClicked !== 'pagAction') {
                slideout.toggle();
                time = 250;
            } else {
                time = 0;
            }
            setExhibitorHeight();
            setTimeout(function () {
                getExhibitors(function(){
                    showHideExhibitors();
                });
            }, time);
            break;
            
        case 'notifications':
            $('.wrapperCard').css('bottom', initPositionMessageBox + 'px');
            
            if(menuClicked !== 'pagAction'){
                slideout.toggle();
                setTimeout(function () {
                    $('.wrapperCard').show();
                }, 350);
            }else{
                setTimeout(function () {
                    $('.wrapperCard').show();
                }, 100);
            }
            
            break;
        case 'calendar':
            slideout.toggle();
            setTimeout(function(){
                getCalendar(showHideCalendar);
            },250);
            break;
    };
};

var setAppArea = function (menuClicked, _this, waveTime) {
    setTimeout(function () {
        if (menuClicked !== 'pagAction') {
            slideout.toggle();
        }
        setTimeout(function () {
            $('.evtsSections').removeClass('activeView');
            setTimeout(function () {
                $('.evtsSections').hide(1, function () {
                    setTimeout(function () {
                        $('#' + _this).show(1, function () {
                            setEventListHeight(function () {
                                if (_this == 'home') {
//                                    slideMenuSize = 0;
//                                    $('#wrapperHeader').addClass('menuOff');

                                    slideMenuSize = 20;
                                    $('#wrapperHeader').removeClass('menuOff');
                                } else {
                                    slideMenuSize = 20;
                                    $('#wrapperHeader').removeClass('menuOff');
                                }
                                $('#' + _this).addClass('activeView');
                            });
                        });
                    }, 100);
                });
            }, 500);
        }, 300);
    }, waveTime);
};

var mainMenuFlaying = function () {

    $('.eventList').on('scrolldelta', function (e) {

        var tagShadown, classFly;
        if ($('#menuHome:visible').length) {
            tagShadown = $('#menuHome');
            classFly = 'flying';
        } else {
            tagShadown = $('.divisionOnSection:visible');
            classFly = 'shadowning';
        }

        var top = e.scrollTop;
        if (top > 2) {
            tagShadown.addClass(classFly);
            //$('.divisionOnSection:visible').addClass('shadowning');
        } else {
            tagShadown.removeClass(classFly);
            //$('.divisionOnSection:visible').removeClass('shadowning');
        }
    });
};

setEventListHeight = function (callback) {

    var allHeight = $(window).height();
    var h;
    if (hPag == 'home') {
        h = $('#mainBanner').height();
    } else {
        h = $('.mainSections').height() - 10;
    }
    var hEvt = allHeight - 131 - h;
    $('.eventList').height(hEvt);
    if (callback) {
        callback();
    }
};

var initSliders = function () {
    var owl = $('.owl-carousel');
    owl.owlCarousel({
        loop: false,
        margin: 10,
        dots: false,
        //navRewind: false,
        responsive: {
            0: {
                items: 1
            }
        }
    });
};

var showHideSubscribeForm = function (callback) {
    var filters = $('#wrapperSubscribeForm');
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
//        },100);
//    }
};

var buildImgPath = function (str) {
    str = str.toString();
    if (str.substring(0, 6) == 'public') {
        //return 'http://187.103.131.250:8086/storage/' + str.substring(6);
        return 'https://app-events.criarenet.com/storage/' + str.substring(6);
    } else {
        return str;
    }
};