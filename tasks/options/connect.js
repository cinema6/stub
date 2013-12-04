(function() {
    'use strict';

    var helpers = require('../helpers'),
        grunt = require('grunt'),
        c6Sandbox = require('c6-sandbox'),
        mountFolder = helpers.mountFolder;

    module.exports = {
        options: {
            hostname: '0.0.0.0'
        },
        development: {
            options: {
                port: '<%= settings.appPort %>',
                middleware: function(connect) {
                    return [
                        mountFolder(connect, grunt.template.process('<%= settings.appDir %>'))
                    ];
                },
                livereload: true
            }
        },
        sandbox: {
            options: {
                port: '<%= settings.sandboxPort %>',
                middleware: function(connect) {
                    return [
                        require('connect-livereload')(),
                        c6Sandbox({
                            landingContentDir: grunt.template.process('<%= settings.collateralDir %>'),
                            experiences: grunt.config.process(
                                grunt.file.readJSON(
                                    grunt.template.process('<%= settings.experiencesJSON %>')
                                )
                            )
                        })
                    ];
                }
            }
        }
    };
})();
