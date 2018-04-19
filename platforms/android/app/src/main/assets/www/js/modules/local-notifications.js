var setMessage = function () {

    var jaja = new Date().getTime() + 10000;
    cordova.plugins.notification.local.schedule({
        title: 'The big survey',
        text: 'Are you a fan of RB Leipzig?',
        at: jaja
    });
    cordova.plugins.notification.local.on("click", function (notification) {
        //if (notification.id == 10) {
            joinMeeting(notification.data.meetingId);
        //}
    });
    cordova.plugins.notification.local.on("trigger", function (notification) {
//        if (notification.id != 10)
//            return;

        // After 10 minutes update notification's title 
        setTimeout(function () {
            cordova.plugins.notification.local.update({
                id: 10,
                title: "Meeting in 5 minutes!"
            });
        }, 30000);
    });

};