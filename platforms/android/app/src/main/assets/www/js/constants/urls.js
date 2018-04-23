if (!futureIspApp.url){
    futureIspApp.url = {};
};

/*url base do app*/
var pathApp = 'https://app-events.criarenet.com/api/';
var pathAppLogin = 'https://app-events.criarenet.com/';
//var pathApp = 'http://187.103.131.250:8086/api/';
//var pathAppLogin = 'http://187.103.131.250:8086/';

/*login*/
futureIspApp.url.LOGIN_APP = pathAppLogin + 'oauth/token';



futureIspApp.url.GET_EVENTS = pathApp + 'event/all';

futureIspApp.url.GET_SESSIONS = pathApp + 'event/';

futureIspApp.url.GET_SESSIONS_BY_ID = pathApp + 'session/';

futureIspApp.url.GET_HOSTS_BY_ID_EVENT = pathApp + 'event/idEvent/hosts';

futureIspApp.url.GET_CALENDAR = pathApp + 'event/idEvent/calendar';

futureIspApp.url.SET_SELECTED_CALENDAR = pathApp + 'session/idSession/attend';/**/

futureIspApp.url.GET_COMPANIES_BY_ID_EVENT = pathApp + 'event/idEvent/companies';

futureIspApp.url.REGISTER_USER = pathApp + 'user';

futureIspApp.url.LOGGED_USER = pathApp + 'logged';/**/

futureIspApp.url.GET_MY_CALLENDAR = pathApp + 'user/calendar';/**/

futureIspApp.url.RECORD_PUSH_TOKEN = pathApp + 'token';

futureIspApp.url.ASSOCIATE_PUSH_TOKEN = pathApp + 'token/user';/**/