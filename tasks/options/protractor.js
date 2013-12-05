(function() {
    'use strict';

    module.exports = {
        options: {
            args: {
                specs: ['test/e2e/**/*.e2e.js'],
                chromeDriver: '',
                sauceUser: '<%= settings.saucelabs.user %>',
                sauceKey: '<%= settings.saucelabs.key %>'
            }
        },
        e2e: {}
    };
})();
