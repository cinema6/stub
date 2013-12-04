(function() {
    'use strict';

    var grunt = require('grunt');

    module.exports = {
        myIP: function() {
            var os = require('os'),
                ifaces = os.networkInterfaces(),
                result;

            function findIP(details) {
                if (details.family==='IPv4') {
                    result = details.address;
                    grunt.log.writeln('Found IP: ' + result);
                }
            }

            grunt.log.subhead('Finding IP Address');

            for (var dev in ifaces) {
                if (dev.substr(0,3).toLowerCase() === 'loo') {
                    grunt.log.writeln('Skipping interface: ' + dev);
                    continue;
                }

                ifaces[dev].forEach(findIP);
            }

            if (!result) {
                result = 'localhost';
                grunt.log.error('Could not find IP. Using "localhost".');
            } else {
                grunt.log.ok('Using IP: ' + result);
            }

            return result;
        },

        mountFolder: function(connect, dir) {
            return connect.static(require('path').resolve(dir));
        }
    };
})();
