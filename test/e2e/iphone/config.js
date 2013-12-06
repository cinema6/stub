(function() {
    'use strict';

    var grunt = require('grunt'),
        pkg = grunt.file.readJSON('package.json');

    module.exports.config = {
        capabilities: {
            name: pkg.name,
            tags: pkg.keywords,
            browserName: 'iphone',
            version: '6.1'
        },
        specs: ['test/e2e/iphone/**/*.e2e.js']
    };
}());
