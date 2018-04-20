$(document).ready(function () {
    setMapAreaHeight();
});

function initMap(zoom, eventAddress) {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: zoom ? zoom : 10,
        center: {lat: -34.397, lng: 150.644},
        disableDefaultUI: true
    });
    var geocoder = new google.maps.Geocoder();
    geocodeAddress(geocoder, map, eventAddress);
}

function geocodeAddress(geocoder, resultsMap, eventAddress) {
    var address = eventAddress;
    geocoder.geocode({'address': address}, function (results, status) {
        if (status === 'OK') {
            resultsMap.setCenter(results[0].geometry.location);
            
            var contentString = eventAddress;

            var infowindow = new google.maps.InfoWindow({
                content: contentString,
                maxWidth: 250
            });
            
            var marker = new google.maps.Marker({
                map: resultsMap,
                position: results[0].geometry.location,
                title: 'Evento'
            });
            
            marker.addListener('click', function () {
                infowindow.open(resultsMap, marker);
            });
            
        } else {
            alertInfo('Ops!','Algo deu errado COD: <b>' + status + '</b>','danger');
            //alert('Geocode was not successful for the following reason: ' + status);
        }
     });
}

var showHideMapArea = function (callback) {
    var filters = $('#wrapperMapArea');
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
    if(callback){
        setTimeout(function(){
            callback();
        },350);
    }
};


setMapAreaHeight = function (callback) {

    var allHeight = $(window).height();
    
    var hEvt = allHeight - 44 - 101 - 91 - 22;
    $('#map').height(hEvt);
    if (callback) {
        callback();
    }
};