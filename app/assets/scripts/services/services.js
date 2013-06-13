(function(){

    'use strict';

    angular.module('c6.stubApp')
    .factory('c6StubService',['$log','appBaseUrl',function($log/*,baseUrl*/){
        $log.log('This is a stub service');
        return {};
    }]);

}());
