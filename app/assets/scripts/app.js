(function(){
    'use strict';
    var browserVersion = (function(){
            var N= navigator.appName, ua= navigator.userAgent, tem;
            var M= ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
            var isMobile = ua.match(/iPhone|iPod|iPad|Android/);
            var isIPad   = ua.match(/iPad/);
            if(M && (tem= ua.match(/version\/([\.\d]+)/i))!== null){
                M[2]= tem[1];
            }

            if (M) {
                return { 'app' : M[1].toLowerCase(), 'version' : M[2],
                         'isMobile': isMobile, 'isIPad' : isIPad };
            }

            return { 'app' : N, 'version' : navigator.appVersion };
        })(),
        releaseConfig = {
            'browser'           : browserVersion,
            'logging'           : [],
            'showPlayerData'    : false
        },
        debugConfig = {
            'browser'           : browserVersion,
            'logging'           : ['error','warn','log','info'],
            'showPlayerData'    : true
        },
        appConfig = releaseConfig;

    if (window.location.toString().match(/\?debug$/)) {
        appConfig = debugConfig;
    }

    var dependencies = [
        'c6lib.video'
    ];

    angular.module('c6.stubApp', dependencies)
        .config(['$routeProvider', 'environment', function ($routeProvider/*, env*/) {
            $routeProvider .when('/', {
                templateUrl: __C6_APP_BASE_URL__ + '/views/landing.html'
            });
            $routeProvider.when('/experience', {
                templateUrl: __C6_APP_BASE_URL__ + '/views/experience.html'
            });
            $routeProvider.otherwise({
                redirectTo: '/'
            });
        }])
        .constant('appBaseUrl', __C6_APP_BASE_URL__)
        .constant('environment', appConfig);

}());
