module.exports = function(grunt) {
    'use strict';

    var crypto = require('crypto');

    grunt.registerTask('genid', 'Generate UUIDs for Cinema6 database objects', function(type) {
        var hash = crypto.createHash('sha1');
        var txt =   process.env.host                    +
                    process.pid.toString()              +
                    process.uptime().toString()         +
                    (new Date()).valueOf().toString()   +
                    (Math.random() * 999999999).toString();

        hash.update(txt);
        grunt.log.ok(type + '-' + hash.digest('hex').substr(0,14));
    });
};
