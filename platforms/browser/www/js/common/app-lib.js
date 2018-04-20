var futureIspApp = {};
var deviceType = (navigator.userAgent.match(/iPad/i))  == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i))  == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
//alert(deviceType);
var request = function (obj, callback) {
    
    if(!obj.noLoader){
        $('.maskLoader').fadeIn(50);
    }
    alert(obj.url);
    setTimeout(function () {
        $.ajax({
            headers:{
                'Accept': 'application/json, text/plain,',
                'Authorization': obj.auth ? obj.auth : ''
            },

            contentType: obj.contentType ? obj.contentType : 'application/json; charset=utf-8',
            type: obj.type ? obj.type : 'POST',
            url: obj.url,
            data: obj.query ? obj.query : '',
            complete: function (e, xhr, settings) {
                
                setTimeout(function(){$('.maskLoader').fadeOut(50)},300);
                
                if (e.status >= 200 && e.status < 400) {
                    if (callback) {
                        callback(e.responseJSON);
                    }
                } else if (e.status === 401) {
                    /*msg*/
                    
                    alertInfo('Ops!','É necessário fazer login novamente','danger');
                    
                }else if (e.status === 422) {
                    /*msg*/
                    var errorsList = (e.responseJSON.errors.email?e.responseJSON.errors.email[0]:'') +' '+
                                      (e.responseJSON.errors.name?e.responseJSON.errors.name[0]:'')+ ' '+
                                      (e.responseJSON.errors.password?e.responseJSON.errors.password[0]:'');
                    var mensage = e.responseJSON.message + '<br>' + errorsList
                    
                    alertInfo('Ops1! Algo deu errado',mensage,'danger');
                    
                }
                else if (e.status === 0) {
                    /*msg*/
                    alertInfo('Ops2!','Algo deu errado COD: <b>' + e.statusText + '</b>','danger');
                  }
                
                else {
 
                    if (obj && obj.errorType === 'login') {
                        /*msg*/
                        alertInfo('Ops3!','Algo deu errado COD: <b>' + e.statusText + '</b>','danger');
                        
                    }else{
                        /*msg*/
                        alertInfo('Ops4!','Algo deu errado COD: <b>' + e.statusText + '</b>','danger');
                        
                    }
                }
            }
        });
    }, 100);
};

var alertInfo = function (title, msg, type) {
    
    var ico = {
        danger: '<i style="font-size:16px; margin-right:5px;" class="fas fa-times-hexagon"></i>',
        warning: '<i style="font-size:16px; margin-right:5px;" class="fas fa-exclamation-circle"></i>',
        success: '<i style="font-size:16px; margin-right:5px;" class="fas fa-check-circle"></i>'
    };
    
    $.notify(ico[type] + ' ' + title + '<br>' + msg, {
        allow_dismiss: true,
        timer: 4500,
        type: type,
        animate: {
            enter: 'animated bounceInLeft',
            exit: 'animated bounceOutLeft'
        }
    });
    
};

$.event.special.scrolldelta = {
    // from http://learn.jquery.com/events/event-extensions/
    delegateType: "scroll",
    bindType: "scroll",
    handle: function (event) {
        var handleObj = event.handleObj;
        var targetData = jQuery.data(event.target);
        var ret = null;
        var elem = event.target;
        var isDoc = elem === document;
        var oldTop = targetData.top || 0;
        var oldLeft = targetData.left || 0;
        targetData.top = isDoc ? elem.documentElement.scrollTop + elem.body.scrollTop : elem.scrollTop;
        targetData.left = isDoc ? elem.documentElement.scrollLeft + elem.body.scrollLeft : elem.scrollLeft;
        event.scrollTopDelta = targetData.top - oldTop;
        event.scrollTop = targetData.top;
        event.scrollLeftDelta = targetData.left - oldLeft;
        event.scrollLeft = targetData.left;
        event.type = handleObj.origType;
        ret = handleObj.handler.apply(this, arguments);
        event.type = handleObj.type;
        return ret;
    }
};

function mascaraData(field) {
    var data = field.value;
    data = data.replace(/([A-Z]|\/)+/ig, '').split('');
    if (data.length > 2) {
        data.splice(2, 0, "/");
    }
    if (data.length > 5) {
        data.splice(5, 0, "/");
    }
    field.value = data.join('');
}

var getToday = function () {
    var d = new Date();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var output = (day < 10 ? '0' : '') + day + '/' + (month < 10 ? '0' : '') + month + '/' + d.getFullYear();
    return output;
}

function parseToForm(frm, data, callback) {
    
    $('#' + frm +' .valid').each(function(i,v){
        $(v).removeClass('is-invalid');
    });
    
    var form = $('#' + frm + ' input');
    var formSelects = $('#' + frm + ' select');
    var formtxArea = $('#' + frm + ' textarea');

    $.each(form, function (ind) {
        var dataPosition = form[ind].name;
//        if (data.birthDate) {
//            loadCbosDate(data.birthDate);
//        }
        if (form[ind].type != 'radio' && form[ind].type != 'checkbox') {
                form[ind].value = data[form[ind].name] ? data[form[ind].name] : form[ind].value;
        } else {
            if (form[ind].type == 'radio') {
                $('input:radio[name="' + form[ind].name + '"][value="' + data[form[ind].name] + '"]').prop('checked', true);
            }
            else {
                $('input:checkbox[name="' + form[ind].name + '"]').prop('checked', data[form[ind].name]);
            }
        }
    });

    if (formtxArea.length) {
        $.each(formtxArea, function (ind) {
            var dataPosition = formtxArea[ind].name;
            if (!formtxArea[ind].value) {
                formtxArea[ind].value = data[formtxArea[ind].name] || '';
            }
        });
    }

    if (formSelects.length) {
        $.each(formSelects, function (ind) {
            var dataPosition = formSelects[ind].name;
            if (!formSelects[ind].value) {
                formSelects[ind].value = data[formSelects[ind].name] || '';
            }
        });
    }
    
    if(callback){
        callback();
    }
}