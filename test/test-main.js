(function($window){
    'use strict';

    var tests = Object.keys($window.__karma__.files).filter(function(file){
        return /\.(ut|it)\.js$/.test(file);
    });

    requirejs({
        baseUrl: '/base/app/assets/scripts',

        paths : {
            "angular"       : "../lib/angular/angular",
            "angularMocks"  : "../lib/angular/angular-mocks",
            "jquery"        : "../lib/jquery/jquery",
            "c6libVideo"    : "../lib/c6media/c6lib.video"//,
//            "c6Resize"      : "ext/resize/resize",
//            "panels.html"   : "../views/panels.html",
//            "player.html"   : "../views/player.html"
        },

        shim : {
            //"jQuery" : { "exports" : "jQuery" },
            "angular"   : {
                "deps"  : ["jquery"],
                "exports" : "angular"
            },
            "angularMocks" : {
                "deps" : [ "angular" ]
            },
            "c6libVideo" : {
                "deps" : [ "angular" ]
            },
            /*
            "c6Resize" : {
                "deps" : [ "angular" ]
            },
            */
            "app" : {
                "deps" : [ "angular", "angularMocks", "c6libVideo"/*, "c6Resize" */]
            },
            /*
            "panels.html" : {
                "deps" : [ "angular", "angularMocks" ]
            },
            "player.html" : {
                "deps" : [ "angular", "angularMocks" ]
            },
            */
            "controllers/controllers" : {
                "deps" : [ "app" ]
            },
            "directives/directives" : {
                "deps" : [ "app" ]
            },
            "services/services" : {
                "deps" : [ "app" ]
            }
        },

        priority : [
            "angular"
        ],

        deps : tests ,

        callback: $window.__karma__.start
    });

}(window));
