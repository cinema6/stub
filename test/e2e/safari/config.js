(function() {
    'use strict';

    var grunt = require('grunt'),
        pkg = grunt.file.readJSON('package.json');

    module.exports.config = {
        capabilities: {
            name: pkg.name,
            tags: pkg.keywords,
            browserName: 'safari',
            version: '6'
        },
        specs: ['test/e2e/safari/**/*.e2e.js'],
        allScriptsTimeout: 30000,
        jasmineNodeOpts: {
            defaultTimeoutInterval: 30000
        }
    };
}());
