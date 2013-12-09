module.exports = function(grunt) {
    'use strict';

    var path = require('path');

    var _ = grunt.util._,
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

            this.aws = (function() {
                var configPath = path.join(process.env.HOME, settings.awsJSON),
                    configExists = grunt.file.exists(configPath);

                return configExists ? grunt.file.readJSON(configPath) : {};
            }());

            return this;
        }.call({}, pkg));

    require('load-grunt-config')(grunt, {
        configPath: path.join(__dirname, 'tasks/options'),
        config: {
            settings: c6Settings
        }
    });

    grunt.loadTasks('tasks');

    /*********************************************************************************************
     *
     * SERVER TASKS
     *
     *********************************************************************************************/

    grunt.registerTask('server', 'start a development server', [
        'connect:sandbox',
        'open:server',
        'watch:livereload'
    ]);

    /*********************************************************************************************
     *
     * TEST TASKS
     *
     *********************************************************************************************/

    grunt.registerTask('test:unit', 'run unit tests', [
        'jshint:all',
        'karma:unit'
    ]);

    grunt.registerTask('test:unit:debug', 'run unit tests whenever files change', [
        'karma:debug'
    ]);

    grunt.registerTask('test:e2e', 'run e2e tests on specified browser', function(browser) {
        var protractorTask = 'protractor' + ((browser === 'all') ? '' : (':' + browser));

        grunt.task.run('connect:development');
        grunt.task.run('connect:sandbox');
        grunt.task.run('sauceconnect:e2e');
        grunt.task.run(protractorTask);
    });

    grunt.registerTask('test:e2e:debug', 'run e2e tests whenever files change', function(browser) {
        grunt.task.run('test:e2e:' + browser);
        grunt.task.run('watch:e2e:' + browser);
    });

    /*********************************************************************************************
     *
     * BUILD TASKS
     *
     *********************************************************************************************/

    grunt.registerTask('build', 'build app into distDir', [
        'test:unit',
        'git_last_commit',
        'clean:build',
        'copy:dist',
        'ngtemplates:dist',
        'htmlmin:dist',
        'sed',
        'cssmin:dist',
        'uglify:dist'
    ]);

    /*********************************************************************************************
     *
     * UPLOAD TASKS
     *
     *********************************************************************************************/

    grunt.registerTask('publish:collateral', 'upload collateral assets to s3', function(target) {
        grunt.task.run('versionator:dist');
        grunt.task.run('s3:collateral-' + target);
    });

    grunt.registerTask('publish:app', 'build and upload the application to s3', function(target) {
        grunt.task.run('build');
        grunt.task.run('s3:' + target);
    });

    grunt.registerTask('publish', 'upload the collateral assets and app to s3', function(target) {
        grunt.task.run('publish:collateral:' + target);
        grunt.task.run('publish:app:' + target);
    });
};
