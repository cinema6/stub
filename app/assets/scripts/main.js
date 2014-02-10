(function(){
    /*jshint -W080 */
    'use strict';

    var __C6_BUILD_VERSION__ = window.__C6_BUILD_VERSION__ = undefined,
        __C6_APP_BASE_URL__ = window.__C6_APP_BASE_URL__ = __C6_BUILD_VERSION__ || 'assets',
        c6 = window.c6;

    require.config({
        baseUrl:  __C6_APP_BASE_URL__
    });

    var libUrl = function(url) {
            var libBase = (function() {
                switch (c6.kEnv) {
                case 'dev':
                case 'staging':
                    return c6.kLibUrls.dev;
                case 'release':
                    return c6.kLibUrls.release;
                }
            }());

            libUrl = function(url) {
                return libBase + url;
            };

            return libUrl(url);
        },
        appScripts = (function() {
            if (__C6_BUILD_VERSION__) {
                return [
                    'scripts/c6app.min'
                ];
            } else {
                return [
                    'scripts/app'
                ];
            }
        }()),
        libScripts = (function() {
            if (__C6_BUILD_VERSION__) {
                return [
                    libUrl('modernizr/modernizr.custom.71747.js'),
                    libUrl('jquery/2.0.3-0-gf576d00/jquery.min.js'),
                    libUrl('gsap/1.11.2-0-g79f8c87/TweenMax.min.js'),
                    libUrl('gsap/1.11.2-0-g79f8c87/TimelineMax.min.js'),
                    libUrl('angular/v1.2.12-0-g5cc5cc1/angular.min.js'),
                    libUrl('c6ui/v2.2.1-0-g89204c8/c6uilib.min.js'),
                    libUrl('c6ui/v2.2.1-0-g89204c8/c6log.min.js')
                ];
            } else {
                return [
                    libUrl('modernizr/modernizr.custom.71747.js'),
                    libUrl('jquery/2.0.3-0-gf576d00/jquery.js'),
                    libUrl('gsap/1.11.2-0-g79f8c87/TweenMax.min.js'),
                    libUrl('gsap/1.11.2-0-g79f8c87/TimelineMax.min.js'),
                    libUrl('angular/v1.2.12-0-g5cc5cc1/angular.js'),
                    libUrl('c6ui/v2.2.1-0-g89204c8/c6uilib.js'),
                    libUrl('c6ui/v2.2.1-0-g89204c8/c6log.js')
                ];
            }
        }());

    function loadScriptsInOrder(scriptsList, done) {
        var script;

        if (scriptsList) {
            script = scriptsList.shift();

            if (script) {
                require([script], function() {
                    loadScriptsInOrder(scriptsList, done);
                });
                return;
            }
        }
        done();
    }

    c6.kBaseUrl = __C6_APP_BASE_URL__;
    c6.kLocal = (c6.kBaseUrl === 'assets');
    c6.kDebug = (c6.kEnv === 'dev' || c6.kEnv === 'staging');
    c6.kHasKarma = false;
    c6.kLogFormats = c6.kDebug;
    c6.kLogLevels = (c6.kDebug) ? ['error','warn','log','info'] : [];
    c6.kVideoUrls = {
        local: c6.kBaseUrl + '/media',
        dev: 'http://s3.amazonaws.com/c6.dev/media/src/stub',
        cdn: 'http://cdn1.cinema6.com/src/stub'
    };
    c6.kModDeps = ['c6.ui', 'c6.log'];

    if (window.location.host.match(/\/\/(www\.)*cinema6.com/) !== null){
        ga('create', 'UA-44457821-2', 'cinema6.com');
    } else {
        ga('create', 'UA-44457821-1', { 'cookieDomain' : 'none' });
    }


    loadScriptsInOrder(libScripts, function() {
        var Modernizr = window.Modernizr;

        Modernizr.load({
            test: Modernizr.touch,
            yep: [
                __C6_BUILD_VERSION__ ?
                    libUrl('angular/v1.2.12-0-g5cc5cc1/angular-touch.min.js') :
                    libUrl('angular/v1.2.12-0-g5cc5cc1/angular-touch.js')
            ],
            nope: [
                libUrl('c6ui/v2.2.1-0-g89204c8/css/c6uilib--hover.min.css'),
                __C6_APP_BASE_URL__ + '/styles/main--hover.css'
            ],
            complete: function() {
                if (Modernizr.touch) { c6.kModDeps.push('ngTouch'); }

                loadScriptsInOrder(appScripts, function() {
                    angular.bootstrap(document.documentElement, ['c6.stub']);
                });
            }
        });
    });
}());
