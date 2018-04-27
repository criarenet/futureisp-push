var windowLogin = true;

$(document).ready(function () {
    
});

var logoutFunction = function(){
    
    var db = window.openDatabase("dbAppFutureIsp", "1.0", "FutureIsp app DB", 200000);
    
    db.transaction(function (tx) {
        tx.executeSql('DROP TABLE IF EXISTS APPDATABASE');
        tx.executeSql('CREATE TABLE IF NOT EXISTS APPDATABASE (userToken)');
    }, errorCB, successCB);
    $('.isLoggedHide').show();
    $('#formAvatar i').css('color', '#fff');
    $('#subscribeIcon i').css('color', '#fad67f');
    window.gTokenSessions = false;
    toogleDiscoveryForm('close');
    
};

function createDB(tx) {
    
    //tx.executeSql('DROP TABLE IF EXISTS APPDATABASE');
    tx.executeSql('CREATE TABLE IF NOT EXISTS APPDATABASE (userToken)');
}

function errorCB(tx) {
    console.log(tx)
    alertInfo('Ops!','DB - '+tx,'danger');
}

function successCB(tx) {
    //alert('ok')
}

var updateUser = function (userToken) {
    var db = window.openDatabase("dbAppFutureIsp", "1.0", "FutureIsp app DB", 200000);
    db.transaction(function (tx) {
        tx.executeSql('SELECT userToken FROM APPDATABASE', [], function (tx, res) {
            if (res.rows.length) {
                tx.executeSql('UPDATE APPDATABASE SET userToken = ?', [userToken]);
            }
        });
    }, errorCB, successCB);
};

var addUser = function (userToken) {
    var db = window.openDatabase("dbAppFutureIsp", "1.0", "FutureIsp app DB", 200000);
    db.transaction(function (tx) {
        
        tx.executeSql('DROP TABLE IF EXISTS APPDATABASE');
        tx.executeSql('CREATE TABLE IF NOT EXISTS APPDATABASE (userToken)');

        tx.executeSql('INSERT INTO APPDATABASE (userToken) VALUES ("' + userToken + '")');
    }, errorCB, successCB);
};

var getUser = function (success) {
    var db = window.openDatabase("dbAppFutureIsp", "1.0", "FutureIsp app DB", 200000);
    db.transaction(function(tx){
        tx.executeSql('SELECT * FROM APPDATABASE', [], success, errorCB);
    }, errorCB);
};


var userTrue = function (tx, data) {
    if (data.rows.length) {
        window.gTokenSessions = data.rows.item(0).userToken;
        getLoggedUser();
        
    } else {
        window.gTokenSessions = false;
    }
};

var associatePush = function(){
    var query = 'token='+gPushToken;
    //alert(query)
    var obj = {
        url: futureIspApp.url.ASSOCIATE_PUSH_TOKEN,
        type: "POST",
        noLoader: true,
        auth: gTokenSessions,
        contentType: 'application/x-www-form-urlencoded',
        query: query
    };
   
    request(obj, function (json) {
        //alertInfo('Sucesso', json, 'success');
    });
};

var getUserToken = function (callback, data) {
    var query =  {
        'grant_type': 'password',
        'client_id': 2,
        'client_secret': 'YS7OtOoHH4waTfaXSBn6T4wh8DwthQKEiPi5ozHw',
        'username':data.email,
        'password':data.password,
        'scope': '*'
    };
    var obj = {
        url: futureIspApp.url.LOGIN_APP,
        type: "POST",
        noLoader: data.noLoader,
        contentType:'application/x-www-form-urlencoded',
        query: query
    };
    request(obj, function (json) {
        if (json) {
            window.gTokenSessions = json.token_type + ' ' + json.access_token;
            addUser(gTokenSessions);
            getLoggedUser();
            alertInfo('Sucesso', 'Obrigado por se registrar, agora você pode se inscrever nas atividades de sua preferência.', 'success');

            if(callback){
                callback();
            }
        }
    });
};

var getLoggedUser = function (callback) {
    var obj = {
        url: futureIspApp.url.LOGGED_USER,
        type: "GET",
        noLoader: true,
        auth: gTokenSessions,
        contentType: 'application/x-www-form-urlencoded',
        query: ''
    };
    
    request(obj, function (json) {
        parseToForm('userForm', json);
        $('.isLoggedHide').hide();
        if(json.avatar){
            $('#formAvatar').css('background-image', 'url("' + json.avatar + '"');
            $('#formAvatar').addClass('whImg');
            $('#formAvatar i').hide();

            $('#subscribeIcon i').css({
                'background-image': 'url("' + json.avatar + '")',
                'color': 'rgba(0,0,0,.0)',
                'border': '1px solid #fad67f'
            });
        }else{
            $('#formAvatar i').css('color', '#8ff8aa');
            $('#subscribeIcon i').css('color', '#8ff8aa');
        }
        
        windowLogin = false;
        
        toogleDiscoveryForm();
        
        setTimeout(function(){
            $('.isLoggedHide').hide();
        },100);
        
        if (gPushToken) {
            associatePush();
        }
        if (callback) {
            callback();
        }
    });
}

var getAppToken = function (callback) {
    var query =  {
        'grant_type': 'client_credentials',
        'client_id': 1,
        'client_secret': 'LGVW9uX6cWafx3qpbm8Ci0NaV96xstVGFl1x2qO0',
        'scope': '*'
    };
    var obj = {
        url: futureIspApp.url.LOGIN_APP,
        type: "POST",
        noLoader: true,
        contentType:'application/x-www-form-urlencoded',
        query: query
    };
    request(obj, function (json) {
        //alert('token')
        if (json) {
            window.gAuthorization = json.token_type + ' ' + json.access_token;
            if(callback){
                setTimeout(function(){
                    recSimpleTokenPush();
                    callback();
                },350);
            }
        }
    });
};

var registerUser = function(){
    
    //alert(windowLogin)
    
    if(windowLogin){
        var loginData = {};
        
        loginData.email = $('input[name=email]').val();
        loginData.password = $('input[name=password]').val();
        
        getUserToken('', loginData);
        return;
    }
    
    
    
    var query = $('.formApp form').serialize();
    //alert($('#formAvatar').css('background-image').match(/url\("([^)]+)\"/i)[1]);
    if($('#formAvatar').hasClass('whImg')){
        if(myAvatar){
            query += '&avatar=' + myAvatar;
        }else{
            query += '&avatar=' + $('#formAvatar').css('background-image').match(/url\("([^)]+)\"/i)[1];
        }
    }    
    var url = futureIspApp.url.REGISTER_USER;
    var obj = {
        url: url,
        type: "POST",
        //noLoader: true,
        auth: gAuthorization,
        contentType: 'application/x-www-form-urlencoded',
        query: query
    };
    //alert(query)
    request(obj, function (json) {
        //alert(json)
        var rgobj = {};
        rgobj = json;
        rgobj.password = $('input[name=password]').val();
        rgobj.noLoader = true;
        getUserToken('', rgobj);
        //console.log(json);
        //addUser();
    });
};