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
            'lib/c6ui/c6ui',
            'lib/c6ui/events/journal',
            'lib/c6ui/events/emitter',
            'lib/c6ui/anicache/anicache',
            'lib/c6ui/browser/browser',
            'lib/c6ui/mouseactivity/mouseactivity',
            'lib/c6ui/computed/computed',
            'lib/c6ui/controls/controls',
            'lib/c6ui/resize/resize',
            'lib/c6ui/visible/visible',
            'lib/c6ui/panels/panels',
            'lib/c6ui/bar/c6bar',
            'lib/c6ui/anicache/anicache',
            'lib/c6ui/videos/video',
            'lib/c6ui/videos/playlist',
            'lib/c6ui/videos/playlist_history',
            'lib/c6ui/format/format',
            'lib/c6ui/url/urlmaker',
            'lib/c6ui/sfx/sfx',
            'scripts/app'
        ];
    }

    require([   'lib/modernizr/modernizr.custom.72138',
                'lib/jquery/jquery.min',
                'lib/hammer.js/hammer.min',
                'lib/gsap/TimelineMax.min',
                'lib/gsap/TweenMax.min'], function(){

        var Modernizr = window.Modernizr;

        // Load more stuff with Modernizr
        Modernizr.load({
            test: Modernizr.touch,
            nope: [ __C6_APP_BASE_URL__ + '/styles/main--hover.css' ,
                    __C6_APP_BASE_URL__ + '/lib/c6ui/style/css/c6__main--hover.css']
        });

        require(['lib/angular/angular.min'],function(){
            require(['lib/ui-router/angular-ui-router.min'],function(){
                loadScriptsInOrder(appScripts,function(){
                    angular.bootstrap(document, ['c6.stubApp']);
                });
            });
        });
    });

}());
