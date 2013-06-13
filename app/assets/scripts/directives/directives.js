(function(){

    'use strict';
    angular.module('c6.stubApp')
    .directive('c6Stub', ['$log', function($log) {
        return function(/*$scope, $element, $attrs*/) {
            $log.info('This is a stub directive.');
        };
    }]);

}());
