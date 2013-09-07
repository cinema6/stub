/* jshint -W106 */
(function($window){
    'use strict';
    var browserVersion = (function(){
            var N= navigator.appName, ua= navigator.userAgent, tem;
            var M= ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
            var isMobile = ua.match(/iPhone|iPod|iPad|Android/);
            var isIPhone = ua.match(/iPhone/);
            var isIPad   = ua.match(/iPad/);
            if(M && (tem= ua.match(/version\/([\.\d]+)/i))!== null){
                M[2]= tem[1];
            }

            if (M) {
                return { 'app' : M[1].toLowerCase(), 'version' : M[2],
                         'isMobile': isMobile, 'isIPad' : isIPad, 'isIPhone' : isIPhone };
            }

            return { 'app' : N, 'version' : navigator.appVersion };
        })(),
        releaseConfig = {
            'logging'           : [],
        },
        debugConfig = {
            'logging'           : ['error','warn','log','info'],
        },
        appConfig = ((__C6_APP_BASE_URL__ === 'assets') ||
                    ($window.location.search.indexOf('debug=true') !== -1)) ?
                    debugConfig : releaseConfig;

    appConfig.baseUrl           = __C6_APP_BASE_URL__;
    appConfig.makeUrl           = function(url) { return this.baseUrl + '/' + url; };
    appConfig.browser           = browserVersion;
    appConfig.buffers           = (browserVersion.isMobile ? 1 : 5);
    appConfig.runningWithKarma  = ($window.__karma__ !== undefined);

    var dependencies = [
        'ui.state',
        'c6lib.video',
        'c6.ui'
    ];

    angular.module('c6.stubApp', dependencies)
        .constant('environment', appConfig)
        .config(['$provide', 'environment', function($provide, env) {
            if (env.runningWithKarma){
                return;
            }
            $provide.decorator('$log', ['$delegate', function($delegate) {
                var logLevels = env.logging;
                angular.forEach($delegate,function(value,key){
                    if ((typeof value === 'function') && (logLevels.indexOf(key) === -1)) {
                        $delegate[key] = function(){};
                    } else {
                        $delegate[key] = function(msg) {
                            value((new Date()).toISOString() + ' [' + key + '] ' + msg);
                        };
                    }
                });

                return $delegate;
            }]);
        }])
        .config(['$stateProvider','$urlRouterProvider','environment',
                function ($stateProvider,$urlRouterProvider, env) {
            $urlRouterProvider.otherwise('/');
            $stateProvider
                .state('landing', {
                    templateUrl: env.makeUrl('views/landing.html'),
                    url: '/'
                });
        }])
        .controller('c6AppCtlr',['$scope','$state','$log','$timeout','environment',
            function($scope,$state,$log,$timeout,environment){
                $log.info('AppCtlr loaded.');
                $scope.env = environment;
         }]);
}(window));
