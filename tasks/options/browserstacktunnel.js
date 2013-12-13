(function() {
    'use strict';

    module.exports = {
        options: {
            jar: 'tasks/BrowserStackTunnel.jar',
            key: '<%= settings.browserstack.key %>',
            servers: [
                {
                    host: 'localhost',
                    port: '<%= settings.sandboxPort %>',
                    ssl: false
                }
            ]
        },
        e2e: {}
    };
}());
