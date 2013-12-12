(function() {
    'use strict';

    module.exports = {
        options: {
            envs: {
                local: {
                    config: {}
                },
                saucelabs: {
                    config: {
                        sauceUser: '<%= settings.saucelabs.user %>',
                        sauceKey: '<%= settings.saucelabs.key %>'
                    }
                }
            },
            config: {
                capabilities: {
                    name: '<%= package.name %>',
                },
                specs: [
                    'test/e2e/setup.js',
                    'test/e2e/common/**/*.e2e.js'
                ]
            }
        },
        chrome: {
            config: {
                specs: ['test/e2e/chrome/**/*.e2e.js'],
                capabilities: {
                    browserName: 'chrome'
                }
            }
        },
        firefox: {
            config: {
                specs: ['test/e2e/firefox/**/*.e2e.js'],
                capabilities: {
                    browserName: 'firefox'
                }
            }
        },
        safari: {
            config: {
                specs: ['test/e2e/safari/**/*.e2e.js'],
                capabilities: {
                    browserName: 'safari'
                }
            }
        },
        ie: {
            config: {
                specs: ['test/e2e/ie/**/*.e2e.js'],
                capabilities: {
                    browserName: 'internet explorer'
                }
            }
        },
        ipad: {
            config: {
                specs: ['test/e2e/ipad/**/*.e2e.js'],
                capabilities: {
                    platform: 'OS X 10.8',
                    browserName: 'ipad',
                    version: '6.1'
                }
            }
        },
        iphone: {
            config: {
                specs: ['test/e2e/iphone/**/*.e2e.js'],
                capabilities: {
                    platform: 'OS X 10.8',
                    browserName: 'iphone',
                    version: '6.1'
                }
            }
        }
    };
})();
