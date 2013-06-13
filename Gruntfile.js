/* jshint -W097 */
'use strict';
var _path       = require('path'),
    lrSnippet   = require('grunt-contrib-livereload/lib/utils').livereloadSnippet,
    mountFolder = function (connect, dir) {
            return connect.static(require('path').resolve(dir));
        };

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // configurable paths
    var getPackageVersion = function() {
            var pkg       = grunt.file.readJSON(_path.join(__dirname,'package.json'));
            return 'v' + pkg.version.replace(/\./g,'_');
        },
        initConfig = {
            app:    _path.join(__dirname,'app'),
            dist:   _path.join(__dirname,'dist'),
            version: getPackageVersion(),
            distVer: function() { return _path.join(this.dist, this.version); }
        };

    grunt.initConfig({
        settings: initConfig,
        smadd : {
            angular : { git : 'git@github.com:cinema6/angular.js.git' },
            jquery  : { git : 'git@github.com:cinema6/jquery.git' },
            gsap    : { git : 'git@github.com:cinema6/GreenSock-JS.git' },
            c6media : { git : 'git@github.com:cinema6/c6Media.git' }
        },
        smbuild : {
            angular : { options : { args : ['package'], buildDir : 'build'  } },
            jquery  : { options : { args : [],          buildDir : 'dist' } },
            c6media : { options : { args : ['build'],   buildDir : 'dist' } },
            gsap    : { options : { args : [],          buildDir : 'src/minified',
                             npm : false, grunt : false } } ,
        },
        watch: {
            livereload: {
                files: [
                    '<%= settings.app %>/{,*/}*.html',
                    '<%= settings.app %>/assets/views/{,*/}*.html',
                    '{.tmp,<%= settings.app %>}/assets/styles/{,*/}*.css',
                    '{.tmp,<%= settings.app %>}/assets/scripts/{,*/}*.js',
                    '<%= settings.app %>/assets/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ],
                tasks: ['livereload']
            }
        },
        connect: {
            options: {
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: '0.0.0.0'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, initConfig.app)
                        ];
                    }
                }
            },
            test: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, 'test'),
                            mountFolder(connect, initConfig.app)
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                url: 'http://localhost:<%= connect.options.port %>'
            }
        },
        bumpup: 'package.json',
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= settings.dist %>/*',
                        '!<%= settings.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp',
            local: '/usr/local/share/nginx/demos/screenjack'
        },
        sed: {
            index: {
                pattern: 'assets',
                replacement: '<%= settings.version %>',
                path: '<%= settings.dist %>/index.html'
            },
            main: {
                pattern: 'undefined',
                replacement: '\'<%= settings.version %>\'',
                path: '<%= settings.distVer() %>/scripts/main.js'
            }
        },
        jshint: {
            options: {
                jshintrc: 'jshint.json'
            },
            all: [
                'Gruntfile.js',
                '<%= settings.app %>/assets/scripts/{,*/}*.js'
            ]
        },
        karma: {
            unit: {
                configFile: 'test/karma.conf.js',
                singleRun: true
            },
            e2e: {
                configFile: 'test/karma-e2e.conf.js',
                singleRun: true
            }
        },
        concat: {
            dist: {
                files: {
                    '.tmp/scripts/c6app.js' : [
                        '<%= settings.app %>/assets/scripts/app.js',
                        '<%= settings.app %>/assets/scripts/services/services.js',
                        '<%= settings.app %>/assets/scripts/controllers/controllers.js',
                        '<%= settings.app %>/assets/scripts/directives/directives.js',
                        '<%= settings.app %>/assets/scripts/animations/animations.js'
                    ]
                }
            }
        },
        cssmin: {
            dist: {
                expand: true,
                flatten: true,
                src:    ['<%= settings.app %>/assets/styles/{,*/}*.css'],
                dest: '<%= settings.distVer() %>/styles/'
            }
        },
        htmlmin: {
            dist: {
                options: {
                    /*removeCommentsFromCDATA: true,
                    // https://github.com/settings/grunt-usemin/issues/44
                    //collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true*/
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= settings.app %>',
                        src: ['*.html'],
                        dest: '<%= settings.dist %>'
                    },
                    {
                        expand: true,
                        cwd: '<%= settings.app %>/assets',
                        src: ['views/*.html'],
                        dest: '<%= settings.distVer() %>'
                    }
                ]
            }
        },
        uglify: {
            dist: {
                files: {
                    '<%= settings.distVer() %>/scripts/c6app.min.js': [
                        '.tmp/scripts/c6app.js'
                    ],
                }
            }
        },
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= settings.app %>',
                        dest: '<%= settings.dist %>',
                        src: [
                            '*.{ico,txt}',
                            '.htaccess'
                        ]
                    },
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= settings.app %>/assets',
                        dest: '<%= settings.distVer() %>',
                        src: [
                            'img/**',
                            'media/**',
                            'lib/**',
                            'scripts/main.js'
                        ]
                    }
                ]
            },
            local:    {
                files:  [
                    {
                        expand : true,
                        dot    : true,
                        cwd    : _path.join(__dirname,'dist'),
                        src    : ['**'],
                        dest   : '/usr/local/share/nginx/demos/stub'
                    }
                ]
            }
        }
    });

    grunt.renameTask('regarde', 'watch');

    grunt.registerTask('updatePackageVersion', function(){
        var settings     = grunt.config.get('settings');
        settings.version = getPackageVersion();
        grunt.config.set('settings',settings);
        grunt.log.writeln('Package Version is: ' + settings.version);
    });

    grunt.registerTask('server', [
        'clean:server',
        'livereload-start',
        'connect:livereload',
        'open',
        'watch'
    ]);

    grunt.registerTask('test', [
        'jshint',
        'clean:server',
        'livereload-start',
        'connect:livereload',
        'karma'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'test',
        'cssmin',
        'htmlmin',
        'concat',
        'copy:dist',
        'uglify'
    ]);

    grunt.registerTask('release',function(type){
        type = type ? type : 'patch';
        grunt.task.run('clean:dist');
        grunt.task.run('test');
        grunt.task.run('bumpup:' + type);
        grunt.task.run('updatePackageVersion');
        grunt.task.run('cssmin');
        grunt.task.run('htmlmin');
        grunt.task.run('concat');
        grunt.task.run('copy:dist');
        grunt.task.run('uglify');
        grunt.task.run('sed');
        grunt.task.run('clean:local');
        grunt.task.run('copy:local');
    });

    grunt.registerTask('default', ['build']);

    grunt.registerMultiTask('smadd','Add submodules',function(){
        var target  = this.target,
            data    = this.data,
            opts    = this.options({
                rootDir : 'vendor',
                alias   : this.target
            }),
            done    = this.async();
        if (!opts.subDir){
            opts.subDir = _path.join(opts.rootDir,opts.alias);
        }

        grunt.log.writelns('Add submodule for: ' + target);
        grunt.util.spawn({
            cmd : 'git',
            args : ['submodule','add',data.git,opts.subDir]
        },function(error/*,result,code*/){
            if (error) {
                grunt.log.errorlns('submodule add failed: ' + error);
                done(false);
                return;
            }

            grunt.util.spawn({ cmd : 'git', args : ['init'] },function(err/*,result,code*/){
                if (err) {
                    grunt.log.errorlns('submodule init failed: ' + err);
                    done(false);
                } else {
                    done(true);
                }
            });
        });
    });

    grunt.registerMultiTask('smbuild','Build submodules',function(){
        var opts = this.options({
                rootDir  : 'vendor',
                buildDir : 'dist',
                libDir  : 'app/assets/lib',
                alias   : this.target,
                npm     : true,
                grunt   : true,
                copy    : true
            }),
              done     = this.async(),
              subTasks = [],
              npmInstall = function(next){
                    var spawnOpts = { cmd : 'npm', args : ['install'],
                      opts : { cwd : opts.source, env : process.env }
                    };

                    grunt.util.spawn( spawnOpts, function(error, result, code) {
                        next(error,code);
                    });
                },
              gruntInstall = function(next){
                    var spawnOpts = { cmd : 'grunt', args : opts.args,
                      opts : { cwd : opts.source, env : process.env }
                    };
                    grunt.util.spawn( spawnOpts, function(error, result, code) {
                        next(error,code);
                    });
                },
              clean = function(next){
                    grunt.file.delete(opts.build);
                    next();
                },
              copy= function(next){
                    var files = grunt.file.expand({ cwd : opts.build},'*.js'),
                        cont = true,targetFile,abspath;
                    files.forEach(function(file){
                        if (cont){
                            abspath     = _path.join(opts.build,file);
                            targetFile  = _path.join(opts.target,file);
                            grunt.file.copy(abspath,targetFile);
                            if (!grunt.file.exists(targetFile)) {
                                next( new Error('Failed to copy ' + abspath +
                                                    ' ==> ' + targetFile));
                                cont = false;
                                return;
                            }
                        }
                    });
                    next();
                    return ;
                },
              run = function(jobs,callback){
                    if (!jobs) {
                        callback();
                        return;
                    }

                    var job = jobs.shift();
                    if (!job){
                        callback();
                        return;
                    }

                    grunt.log.writelns('Attempt : ' + job.name);
                    job.func(function(error,code){
                        if (error){
                            callback(error,code,job.name);
                            return;
                        }

                        run(jobs,callback);
                    });
                };

        if (!opts.source){
            opts.source = _path.join(opts.rootDir,opts.alias);
        }

        if (!opts.target){
            opts.target = _path.join(opts.libDir,opts.alias);
        }

        if (!opts.build){
            opts.build = _path.join(opts.rootDir,opts.alias,opts.buildDir);
        }

        if (opts.npm){
            subTasks.push({ name : 'npm install', func : npmInstall });
        }

        if (opts.grunt) {
            subTasks.push({ name : 'clean', func : clean });
            subTasks.push({ name : 'grunt', func : gruntInstall });
        }

        if (opts.copy) {
            subTasks.push({ name : 'copy', func : copy });
        }

        run(subTasks,function(error,code,subTask){
            if (error){
                grunt.log.errorlns('Failed on ' + subTask + ': ' + error);
                done(false);
                return;
            }
            done(true);
        });
    });
};
