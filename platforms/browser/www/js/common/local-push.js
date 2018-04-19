
    var jaja = new Date().getTime() + 10000;
    
    // Schedule notification for tomorrow to remember about the meeting
    cordova.plugins.notification.local.schedule({
        id: 10,
        title: "Meeting in 15 minutes!",
        text: "Jour fixe Produktionsbesprechung",
        at: jaja,
        data: {meetingId: "#123FG8"}
    });

    // Join BBM Meeting when user has clicked on the notification 
    cordova.plugins.notification.local.on("click", function (notification) {
        if (notification.id == 10) {
            joinMeeting(notification.data.meetingId);
        }
    });

    // Notification has reached its trigger time (Tomorrow at 8:45 AM)
    cordova.plugins.notification.local.on("trigger", function (notification) {
        if (notification.id != 10)
            return;

        // After 10 minutes update notification's title 
        setTimeout(function () {
            cordova.plugins.notification.local.update({
                id: 10,
                title: "Meeting in 5 minutes!"
            });
        }, 30000);
    });


var buildMessage = function () {
    var jaja = new Date().getTime() + 50000;
    var dataPush = {
        id: 10,
        title: "Meeting in 15 minutes!",
        text: "Jour fixe Produktionsbesprechung",
        at: jaja,
        data: {meetingId: "#123FG8"}
    };
    //alert(dataPush);
    cordova.plugins.notification.local.schedule(dataPush);

    // Join BBM Meeting when user has clicked on the notification 
    cordova.plugins.notification.local.on("click", function (notification) {
        alert('clk');
        if (notification.id == 10) {
            joinMeeting(notification.data.meetingId);
        }
    });
    // Notification has reached its trigger time (Tomorrow at 8:45 AM)
    cordova.plugins.notification.local.on("trigger", function (notification) {
        
        alert('trigger');
        
        if (notification.id != 10)return;
        // After 10 minutes update notification's title 
        setTimeout(function () {
            cordova.plugins.notification.local.update({
                id: 10,
                title: "Meeting in 5 minutes!"
            });
        }, 30000);
    });
};
