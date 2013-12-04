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

            return this;
        }.call({}, pkg)),
        config = require('load-grunt-config')(grunt, {
            configPath: path.join(__dirname, 'tasks/options'),
            init: false,
            config: {
                env: {
                    myIP: Helpers.myIP()
                },
                settings: c6Settings
            }
        });

    grunt.loadTasks('tasks');

    grunt.registerTask('server', [
        'connect:development',
        'connect:sandbox',
        'open:server',
        'watch:livereload'
    ]);

    grunt.initConfig(config);
};
