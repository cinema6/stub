(function() {
    'use strict';

    module.exports = {
        options: {
            args: {
                chromeDriver: '',
                sauceUser: '<%= settings.saucelabs.user %>',
                sauceKey: '<%= settings.saucelabs.key %>',
                specs: ['test/e2e/common/**/*.e2e.js']
            }
        },
        chrome: {
            configFile: 'test/e2e/chrome/config.js'
        },
        firefox: {
            configFile: 'test/e2e/firefox/config.js'
        },
        safari: {
            configFile: 'test/e2e/safari/config.js'
        },
        ie: {
            configFile: 'test/e2e/ie/config.js'
        },
        ipad: {
            configFile: 'test/e2e/ipad/config.js'
        },
        iphone: {
            configFile: 'test/e2e/iphone/config.js'
        }
    };
})();
