/*jshint -W080 */
var __C6_BUILD_VERSION__ = undefined,
    __C6_APP_BASE_URL__  = (__C6_BUILD_VERSION__ ? __C6_BUILD_VERSION__ : 'assets');
(function(){
    'use strict';

    require.config({
        baseUrl:  __C6_APP_BASE_URL__
    });

    var appScripts,
        loadScriptsInOrder = function(scriptsList,done){
            if (scriptsList){
                var script = scriptsList.shift();
                if (script){
                    require([script],function(){
                        loadScriptsInOrder(scriptsList,done);
                    });
                    return;
                }
            }
            done();
        };
    if (__C6_BUILD_VERSION__) {
        appScripts = [ 'scripts/c6app.min' ];
    } else {
        appScripts = [  'scripts/app',
                        'scripts/services/services',
                        'scripts/controllers/controllers',
                        'scripts/animations/animations',
                        'scripts/directives/directives'
                        ];
    }

    require([   'lib/jquery/jquery.min',
                'lib/gsap/TimelineMax.min',
                'lib/gsap/TweenMax.min'], function(){

        require(['lib/angular/angular.min'],function(){
            require(['lib/ui-router/angular-ui-router.min'],function(){
                require(['lib/c6media/c6lib.video.min'],function(){
                    loadScriptsInOrder(appScripts,function(){
                        angular.bootstrap(document, ['c6.stubApp']);
                    });
                });
            });
        });
    });

}());
