(function(){
    'use strict';

    angular.module('c6.stubApp')
    .controller('C6AppCtrl', ['$log', '$scope', '$location', '$routeParams',
                                        function($log/*, $scope, $location, $routeParams*/) {
        $log.log('This is a stub controller');
    }]);

}());
