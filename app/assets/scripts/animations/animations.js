(function() {
    'use strict';

    angular.module('c6.stubApp')
        .animation('stub-anim', ['$log', function($log) {
            return {
                start: function(element, done) {
                    $log.info('This is a stub animation');
                    done();
                }
            };
        }]);

}());
