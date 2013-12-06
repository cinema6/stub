(function() {
    'use strict';

    var grunt = require('grunt'),
        pkg = grunt.file.readJSON('package.json');

    module.exports.config = {
        capabilities: {
            name: pkg.name,
            tags: pkg.keywords,
            browserName: 'firefox'
        },
        specs: ['test/e2e/firefox/**/*.e2e.js']
    };
}());
