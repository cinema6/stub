(function() {
    'use strict';

    var grunt = require('grunt'),
        pkg = grunt.file.readJSON('package.json');

    module.exports.config = {
        capabilities: {
            name: pkg.name,
            tags: pkg.keywords,
            browserName: 'internet explorer'
        },
        specs: ['test/e2e/ie/**/*.e2e.js'],
        jasmineNodeOpts: {
            defaultTimeoutInterval: 30000
        }
    };
}());
