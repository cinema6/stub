module.exports = function(grunt) {
    'use strict';

    var path = require('path');

    var _ = grunt.util._,
        Helpers = require('./tasks/helpers'),
        pkg = grunt.file.readJSON('package.json'),
        c6Settings = (function(pkg) {
            var settings = pkg.c6Settings;

            _.extend(this, settings);

            this.openBrowser = process.env.GRUNT_BROWSER;

            this.saucelabs = (function() {
                var configPath = path.join(process.env.HOME, settings.saucelabsJSON),
                    configExists = grunt.file.exists(configPath);

                return configExists ? grunt.file.readJSON(configPath) : {};
            }());

            return this;
        }.call({}, pkg));

    require('load-grunt-config')(grunt, {
        configPath: path.join(__dirname, 'tasks/options'),
        config: {
            env: {
                myIP: Helpers.myIP()
            },
            settings: c6Settings
        }
    });

    grunt.loadTasks('tasks');

    grunt.registerTask('server', 'start a development server', [
        'connect:development',
        'connect:sandbox',
        'open:server',
        'watch:livereload'
    ]);

    grunt.registerTask('test:unit', 'run unit tests', [
        'jshint:all',
        'karma:unit'
    ]);

    grunt.registerTask('test:unit:debug', 'run unit tests whenever files change', [
        'karma:debug'
    ]);

    grunt.registerTask('test:e2e', 'run e2e tests', [
        'connect:development',
        'connect:sandbox',
        'sauceconnect:e2e',
        'protractor:e2e'
    ]);

    grunt.registerTask('test:e2e:debug', 'run e2e tests whenever files change', [
        'test:e2e',
        'watch:e2e'
    ]);
};
