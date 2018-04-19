/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        //app.receivedEvent('deviceready');

        var db = window.openDatabase("dbAppFutureIsp", "1.0", "FutureIsp app DB", 200000);
        db.transaction(createDB, errorCB, successCB);

        getAppToken(function () {
            getEvents();
            getUser(userTrue);
        });

        pictureSource = navigator.camera.PictureSourceType;
        destinationType = navigator.camera.DestinationType;
        setScreenOrientation('portrait');
        StatusBar.hide();

        var push = PushNotification.init({
            android: {
                "senderID": "558917165307"
            },
            browser: {
                pushServiceURL: 'http://push.api.phonegap.com/v1/push'
            },
            ios: {
                alert: "true",
                badge: "true",
                sound: "true"
            },
            windows: {}
        });
        push.on('registration', function (data) {
//                    alert(data.registrationId);
//                    document.getElementById('d').value = data.registrationId;
            window.gPushToken = data.registrationId;
        });
        push.on('notification', function (data) {
            
            var obj = {};
            obj.message = data.message;
            obj.title = data.title;
            obj.count = data.count;
            obj.sound = data.sound;
            obj.img = data.image;
            obj.additionalData = data.additionalData;
            buildPushMessage(obj);

        });
        push.on('error', function (e) {
            // e.message
        });
    },
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};
app.initialize();
