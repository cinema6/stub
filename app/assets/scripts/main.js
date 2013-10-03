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
        appScripts = [
            'scripts/c6app.min'
        ];
    } else {
        appScripts = [
            'lib/c6ui/browser/browser',
            'lib/c6ui/mouseactivity/mouseactivity',
            'lib/c6ui/computed/computed',
            'lib/c6ui/controls/controls',
            'lib/c6ui/anicache/anicache',
            'lib/c6ui/videos/video',
            'lib/c6ui/sfx/sfx',
            'scripts/app',
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
                require(['lib/c6ui/c6ui'],function(){
                    loadScriptsInOrder(appScripts,function(){
                        angular.bootstrap(document, ['c6.stubApp']);
                    });
                });
            });
        });
    });

}());
