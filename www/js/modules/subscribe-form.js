$(document).ready(function () {
    $('input').on('focus', function () {
        if (deviceType == 'Android') {
            $('.formApp').addClass('focused');
        }
    });
    
    $('input').on('blur', function () {
        $('.formApp').removeClass('focused');
        $('#formAvatar').parent().css('box-shadow', 'none')
    });

    setTimeout(function () {
        $('#faceLogin').on('click', function () {
            facebookLogin();
        });

//        $('#googleLogin').on('click', function () {
//            googleLogin('1068750154326-dkcl9une855fd6k3b2jrgf1l5nh58kvv.apps.googleusercontent.com');
//        });
        $('#openForm').on('click', function () {
            toogleDiscoveryForm();
        });
        formHidShadown();
    }, 500);

});

var formHidShadown = function () {

        $('.formApp').on('scrolldelta', function (e) {

            var top = e.scrollTop;
            if (top > 5) {
                $('#formAvatar').parent().css({
                    'box-shadow': '0px 2px 2px 0px rgba(0,0,0,.2)',
                    'padding-bottom': '10px'
                });
            } else {
                $('#formAvatar').parent().css({
                    'box-shadow': 'none',
                    'padding-bottom': '0'
                });
            }
        });
    };

var toogleDiscoveryForm = function(){
    var fields = $('.commonRegister');
    var visible = $('.commonRegister:visible').length;
    $(fields).show();
//    if(visible){
//        $(fields).hide();
//    }else{
//        $(fields).show();
//    }
    $('.formApp').scrollTop(0);
    windowLogin = false;
};

var facebookLogin = function () {
    var ref = cordova.InAppBrowser.open("https://app-events.criarenet.com/login/facebook/", "_blank", "location=no");
    ref.addEventListener('loadstart', function (evt) {
        if (evt.url.substr(0, 57).indexOf("https://app-events.criarenet.com/login/facebook/callback/") !== -1) {
            ref.hide();
        }
    });
    ref.addEventListener("loadstop", function (evt) {
        ref.executeScript(
                {
                    code: "document.body.innerText"
                },
                function (values) {

                    window.jsonFace = values[0];
                    var json = JSON.parse(jsonFace);
                    setTimeout(function () {
                        if (json.avatar) {
                            $('#formAvatar').css('background-image', 'url("' + json.avatar + '"');
                            
                            $('#subscribeIcon i').css({
                                'background-image': 'url("' + json.avatar + '")',
                                'color': 'rgba(0,0,0,.0)',
                                'border': '1px solid #fad67f'
                            });
                            
                            $('#formAvatar').addClass('whImg');
                            $('#formAvatar i').hide();
                        }
                        $('input[name=name]').val(json.name);
                        $('input[name=email]').val(json.email);
                        toogleDiscoveryForm();
                        setTimeout(function () {
                            ref.close();
                        }, 200);

                    }, 100);
                });
    });
};



