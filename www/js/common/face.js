var facebookLogin = function (appId, appSecret, successCb, errCb) {
alert('aaaa')

    $.get("https://graph.facebook.com/oauth/access_token?client_id=" + appId + "&client_secret=" + appSecret + "&grant_type=client_credentials", function (res) {
        if (res.access_token) {
            //successCb(res.access_token);
        } else {
            errCb(res);
        }
    });


                                        /*https://www.facebook.com/v2.10/dialog/oauth?*/
    //var ref = cordova.InAppBrowser.open("https://www.facebook.com/dialog/oauth?display=popup&response_type=code&client_id=" + appId + "&redirect_uri=" + "https://app-events.criarenet.com/login/facebook/callback/", "_blank", "location=no");
    var ref = cordova.InAppBrowser.open("https://app-events.criarenet.com/login/facebook/", "_blank", "location=no");
    ref.addEventListener('loadstart', function (evt) {
        if (evt.url.substr(0, 57).indexOf("https://app-events.criarenet.com/login/facebook/callback/") !== -1) {
            ref.hide();
        }
    });


    ref.addEventListener("loadstop", function (evt) {
        //alert(JSON.stringify(evt))
        //ref.insertCSS({file: "/inapp.css"});
        ref.executeScript(
                {
                    code: "document.body.innerText"
                },
                function (values) {
                    //ref.close();
                    //alert(values[0])
                    window.jsonFace = values[0];
                    var json = JSON.parse(jsonFace);
                    setTimeout(function(){
                        if (json.avatar) {
                        //alert(jsonFace.avatar)
                        $('#formAvatar').css('background-image', 'url("' + json.avatar + '"');
                        $('#formAvatar').addClass('whImg');
                        $('#formAvatar i').hide();
                    }
                    $('input[name=name]').val(json.name);
                    $('input[name=email]').val(json.email);
                    
                    setTimeout(function(){
                        ref.close();
                    },200);
                    
                    },100);

                });
   })

}

var linkedinLogin = function (appId, appSecret, successCb, errCb) {

    var ref = window.open("https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=" + appId + "&redirect_uri=" + (encodeURI("http://anyurlhere.com")) + "&state=987654321&scope=r_basicprofile", "_blank", "location=no");
    ref.addEventListener("loadstop", function (evt) {

        if (evt.url.indexOf("anyurlhere.com") !== -1) {
            if (evt.url.indexOf("code=") !== -1) {
                var code = evt.url.split("code=")[1];
                code = code.split("&")[0];

                //TODO:  get actual token to access user profile
                $.post("https://www.linkedin.com/oauth/v2/accessToken", {"grant_type": "authorization_code", "code": code, "redirect_uri": encodeURI("http://anyurlhere.com"), "client_id": appId, "client_secret": appSecret}, function (data) {
                    for (key in data) {
                        if (key == 'access_token') {

                            localStorage.linkedinToken = data[key];
                            ref.close();
                            ref.addEventListener("exit", function () {
                                successCb(localStorage.linkedinToken);
                            })
                        }


                    }
                })

            }

        }
    })

}

var googleLogin = function (appId, appSecret, successCb, errCb) {

    var ref = window.open("https://accounts.google.com/o/oauth2/v2/auth?response_type=token&client_id=" + appId + "&redirect_uri=" + encodeURI("http://anyurlhere.com") + "&scope=" + encodeURIComponent("email profile") + "&state=profile", "_blank", "location=no");
    ref.addEventListener("loadstop", function (evt) {
        if (evt.url.indexOf("anyurlhere.com") !== -1) {

            if (evt.url.indexOf("access_token=") !== -1) {
                var accessToken = evt.url.split("access_token=")[1];
                accessToken = accessToken.split("&")[0];

                localStorage.gToken = accessToken;

                ref.close();
                ref.addEventListener("exit", function () {
                    successCb(localStorage.gToken);
                })
            }
        }
    })

}

var getGoogleInfo = function (successCb, errCb) {
    //get basic user profile
    $.get("https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=" + localStorage.gToken, function (userInfo) {
        successCb(userInfo);
    })
}

var getFacebookInfo = function (successCb, errCb) {
    //get basic user profile-name
    $.get("https://graph.facebook.com/me?fields=email,name,picture&access_token=" + localStorage.fbToken, function (userInfo) {



        var myInfo = {};
        if (userInfo.name) {
            myInfo.name = userInfo.name;
        }
        if (userInfo.email) {
            myInfo.email = userinfo.email;
        }

        if (userInfo.picture) {
            myInfo.picture = userInfo.picture.data.url;
        }

        localStorage.myInfo = JSON.stringify(myInfo);
        successCb(myInfo);
        // localStorage.myInfo = myInfo;
    })
}

//get basic data for linked in

var getLinkedinInfo = function (successCb, errCb) {

    $.ajax({
        url: "https://api.linkedin.com/v1/people/~?format=json",
        headers: {
            "Authorization": "Bearer " + localStorage.linkedinToken
        },
        success: function (userInfo) {



            var myInfo = {};
            if (userInfo.firstName && userInfo.lastName) {
                myInfo.name = userInfo.firstName + " " + userInfo.lastName;

            }
            if (userInfo.headline) {
                myInfo.linkedinHeadline = userInfo.headline;

            }
            localStorage.myInfo = JSON.stringify(myInfo);

            successCb(myInfo);

        },
        fail: function (err) {
            alert(err);
            for (key in err) {
                alert(key);
                alert(err[key]);
            }
        }


    })



}

//example of logging in the user with Google + and getting his/her data

//googleLogin("93-54932-423-fkfew.apps.googleusercontent.com", "", function (accessToken) {
//    getGoogleInfo(function (userInfo) {
//
//        var myInfo = {};
//        alert(userInfo.name);
//        if (userInfo.email) {
//            myInfo.email = userInfo.email;
//        }
//        if (userInfo.name) {
//            myInfo.name = userInfo.name;
//        }
//        if (userInfo.given_name) {
//            myInfo.firstName = userInfo.given_name;
//        }
//        if (userInfo.familyName) {
//            myInfo.familyName = userInfo.family_name;
//        }
//        if (userInfo.picture) {
//            myInfo.picture = userInfo.picture;
//        }
//    })
//})