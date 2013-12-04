(function() {
    'use strict';

    module.exports = {
        livereload: {
            files: [
                '<%= settings.appDir %>/*.html',
                '<%= settings.appDir %>/assets/views/**/*.html',
                '<%= settings.appDir %>/assets/styles/**/*.css',
                '<%= settings.appDir %>/assets/scripts/**/*.js',
                '<%= settings.appDir %>/assets/img/**/*.{png,jpg,jpeg,gif,webp,svg}'
            ],
            options: {
                livereload: true
            }
        }
    };
})();
