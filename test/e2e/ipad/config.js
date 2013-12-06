(function() {
    'use strict';

    var grunt = require('grunt'),
        pkg = grunt.file.readJSON('package.json');

    module.exports.config = {
        capabilities: {
            name: pkg.name,
            tags: pkg.keywords,
            browserName: 'ipad',
            version: '6.1'
        },
        specs: ['test/e2e/ipad/**/*.e2e.js']
    };
}());
