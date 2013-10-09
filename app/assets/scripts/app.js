/* jshint -W106 */
(function(window$){
    'use strict';

    if (window$.location.toString().match(/cinema6\.com/) !== null){
        ga('create', 'UA-44457821-1', 'cinema6.com');
    } else {
        ga('create', 'UA-44457821-1', { 'cookieDomain' : 'none' });
    }

    //Some application defines that are outside the scope of angular
    (function(win$){
        var c6 = {};
        c6.kBaseUrl   = __C6_APP_BASE_URL__;
        c6.kLocal     = (c6.kBaseUrl === 'assets');
        c6.kDebug     = ( c6.kLocal || (win$.location.toString().match(/debug=true/) !== null));
        c6.kHasKarma  = (win$.__karma__ !== undefined);
        c6.kLogLevels = (c6.kDebug) ? ['error','warn','log','info'] : [];
        c6.makeUrl    = function(url) { return this.kBaseUrl + '/' + url; };
        c6.kVideoUrls = {
            'local'  : c6.kBaseUrl + '/media',
            'cdn'    : 'http://cdn1.cinema6.com/src/stub'
        };
        win$.c6 = c6;
    }(window$));

    angular.module('c6.stubApp', ['ui.state','c6.ui'])
        .constant('c6Defines', window$.c6)
        .config(['$provide', 'c6Defines', function($provide, c6Defines ) {
            if (c6Defines.kHasKarma){
                return;
            }
            $provide.decorator('$log', ['$delegate', function($delegate) {
                var logLevels = c6Defines.kLogLevels;
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
        .config(['c6UrlMakerProvider','c6Defines',function(c6UrlMakerProvider,c6Defines){
            c6UrlMakerProvider.location(c6Defines.kBaseUrl,'default');
            if (c6Defines.kLocal){
                c6UrlMakerProvider.location(c6Defines.kVideoUrls.local ,'video');
            } else {
                c6UrlMakerProvider.location(c6Defines.kVideoUrls.cdn ,'video');
            }
        }])
        .config(['$stateProvider','$urlRouterProvider','c6UrlMakerProvider',
                function ($stateProvider,$urlRouterProvider, c6UrlMakerProvider) {
            $urlRouterProvider.otherwise('/');
            $stateProvider
                .state('landing', {
                    templateUrl: c6UrlMakerProvider.makeUrl('views/landing.html'),
                    url: '/'
                });
        }])
        .controller('c6AppCtlr',['$scope','$state','$log','$location',
            function($scope,$state,$log,$location){
                $log.info('AppCtlr loaded.');

                $scope.$on('$stateChangeSuccess',
                    function(event,toState,toParams,fromState/*,fromParams*/){
                    $log.info('State Change Success: ' + fromState.name +
                                            ' ===> ' + toState.name);

                    ga('send','pageview', {
                        'page'  : $location.absUrl(),
                        'title' : 'stub ' + toState.name
                    });
                });
            }
         ]);
}(window));
