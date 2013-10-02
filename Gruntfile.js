/* jshint -W097 */
'use strict';
var path        = require('path'),
    fs          = require('fs-extra'),
    lrSnippet   = require('grunt-contrib-livereload/lib/utils').livereloadSnippet,
    mountFolder = function (connect, dir) {
            return connect.static(require('path').resolve(dir));
        };

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    var initProps = {
            prefix      : process.env.HOME,
            app         : path.join(__dirname,'app'),
            dist        : path.join(__dirname,'dist'),
            packageInfo : grunt.file.readJSON('package.json')
        };

    initProps.version     = function(){
        return this.gitLastCommit.commit;
    };

    initProps.name        = function() {
        return this.packageInfo.name;
    };

    initProps.distVersionPath= function() {
        return path.join(this.dist, this.gitLastCommit.commit);
    };

    if ((process.env.HOME) && (fs.existsSync(path.join(process.env.HOME,'.aws.json')))){
        initProps.aws = grunt.file.readJSON(
                path.join(process.env.HOME,'.aws.json')
        );
    }


    grunt.initConfig({
        settings: initProps,
        smadd : {
            angular  : { git : 'git@github.com:cinema6/angular.js.git' },
            jquery   : { git : 'git@github.com:cinema6/jquery.git' },
            gsap     : { git : 'git@github.com:cinema6/GreenSock-JS.git' },
            c6ui     : { git : 'git@github.com:cinema6/c6ui.git' },
            'hammer.js' : { git : 'git@github.com:cinema6/hammer.js.git' },
            'ui-router' : { git : 'git@github.com:cinema6/ui-router.git' }
        },
        smbuild : {
            angular : { options : { args : ['package'], buildDir : 'build'  } },
            jquery  : { options : { args : [],          buildDir : 'dist' } },
            c6ui    : { options : { args : ['build'],   buildDir : 'dist' } },
            gsap    : { options : { args : [],          buildDir : 'src/minified',
                             npm : false, grunt : false } } ,
            'hammer.js' : { options : { args : ['build'],   buildDir : 'dist' } },
            'ui-router' : { options : { args : [], buildDir : 'build'  } }
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
                            mountFolder(connect, initProps.app)
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
                            mountFolder(connect, initProps.app)
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
            server: '.tmp'
        },
        sed: {
            index: {
                pattern: 'assets',
                replacement: '<%= settings.version() %>',
                path: '<%= settings.dist %>/index.html'
            },
            index2: {
                pattern: 'body ng-app="e2e"',
                replacement: 'body',
                path: '<%= settings.dist %>/index.html'
            },
            index3: {
                pattern: '<script type="text/javascript"> angular.module\\("e2e",\\[\\]\\); </script>',
                replacement: '',
                path: '<%= settings.dist %>/index.html'
            },
            main: {
                pattern: 'undefined',
                replacement: '\'<%= settings.version() %>\'',
                path: '<%= settings.distVersionPath() %>/scripts/main.js'
            },
            scripts: {
                pattern: 'assets',
                replacement: '<%= settings.version() %>',
                path: '<%= settings.distVersionPath() %>/scripts/',
                recursive : true,
            },
            views: {
                pattern: 'assets',
                replacement: '<%= settings.version() %>',
                path: '<%= settings.distVersionPath() %>/views/',
                recursive : true,
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
            debug: {
                configFile: 'test/karma.conf.js',
                singleRun: false
            },
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
                        '<%= settings.app %>/assets/lib/c6ui/c6ui.js',
                        '<%= settings.app %>/assets/lib/c6ui/browser/browser.js',
                        '<%= settings.app %>/assets/lib/c6ui/mouseactivity/mouseactivity.js',
                        '<%= settings.app %>/assets/lib/c6ui/computed/computed.js',
                        '<%= settings.app %>/assets/lib/c6ui/controls/controls.js',
                        '<%= settings.app %>/assets/lib/c6ui/anicache/anicache.js',
                        '<%= settings.app %>/assets/lib/c6ui/sfx/sfx.js',
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
                dest:   '<%= settings.distVersionPath() %>/styles/'
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
                        dest: '<%= settings.distVersionPath() %>'
                    }
                ]
            }
        },
        uglify: {
            dist: {
                files: {
                    '<%= settings.distVersionPath() %>/scripts/c6app.min.js': [
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
                        dest: '<%= settings.distVersionPath() %>',
                        src: [
                            'views/**',
                            'data/**',
                            'img/**',
                            'media/**',
                            'lib/**',
                            'scripts/main.js',
                            'scripts/ext/**'
                        ]
                    }
                ]
            }
        },
        s3: {
            options: {
                key:    '<%= settings.aws.accessKeyId %>',
                secret: '<%= settings.aws.secretAccessKey %>',
                bucket: 'demos.cinema6.com',
                access: 'public-read',
                maxOperations: 4
            },
            demo: {
                upload: [
                    {
                        src: 'dist/**',
                        dest: 'stub/',
                        rel : 'dist/'
                    },
                    {
                        src: 'dist/index.html',
                        dest: 'stub/<%= settings.version() %>/index.html',
                        headers : { 'cache-control' : 'max-age=0' }
                    },
                    {
                        src: 'dist/index.html',
                        dest: 'stub/index.html',
                        headers : { 'cache-control' : 'max-age=0' }
                    }
                ]
            },
            test: {
                options: {
                    bucket: 'c6.dev'
                },
                upload: [
                    {
                        src: 'dist/**',
                        dest: 'www/stub/',
                        rel : 'dist/'
                    },
                    {
                        src: 'dist/index.html',
                        dest: 'www/stub/<%= settings.version() %>/index.html',
                        headers : { 'cache-control' : 'max-age=0' }
                    },
                    {
                        src: 'dist/index.html',
                        dest: 'www/stub/index.html',
                        headers : { 'cache-control' : 'max-age=0' }
                    }
                ]
            }
        }
    });

    grunt.renameTask('regarde', 'watch');

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
        'gitLastCommit',
        'clean:dist',
        'cssmin',
        'htmlmin',
        'concat',
        'copy:dist',
        'uglify',
        'sed'
    ]);

    grunt.registerTask('publish-test',function(){
        grunt.task.run('build');
        grunt.task.run('s3:test');
    });

    grunt.registerTask('publish-prod',function(){
        grunt.task.run('build');
        grunt.task.run('s3:demo');
    });

    grunt.registerTask('default', ['build']);

    grunt.registerTask('gitLastCommit','Get a version number using git commit', function(){
        var settings = grunt.config.get('settings'),
            done = this.async(),
            handleVersionData = function(data){
                if ((data.commit === undefined) || (data.date === undefined)){
                    grunt.log.errorlns('Failed to parse version.');
                    return done(false);
                }
                data.date = new Date(data.date * 1000);
                settings.gitLastCommit = data;
                grunt.log.writelns('Last git Commit: ' +
                    JSON.stringify(settings.gitLastCommit,null,3));
                grunt.config.set('settings',settings);
                return done(true);
            };

        if (settings.gitLastCommit){
            return done(true);
        }

        if (grunt.file.isFile('version.json')){
            return handleVersionData(grunt.file.readJSON('version.json'));
        }

        grunt.util.spawn({
            cmd     : 'git',
            args    : ['log','-n1','--format={ "commit" : "%h", "date" : "%ct" , "subject" : "%s" }']
        },function(err,result){
            if (err) {
                grunt.log.errorlns('Failed to get gitLastCommit: ' + err);
                return done(false);
            }
            handleVersionData(JSON.parse(result.stdout));
        });
    });

    grunt.registerMultiTask('smadd','Add submodules',function(){
        var target  = this.target,
            data    = this.data,
            opts    = this.options({
                rootDir : 'vendor',
                alias   : this.target
            }),
            done    = this.async();
        if (!opts.subDir){
            opts.subDir = path.join(opts.rootDir,opts.alias);
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
                    var files = grunt.file.expand({ cwd : opts.build},'**/*.*'),
                        cont = true,targetFile,abspath;
                    files.forEach(function(file){
                        //grunt.log.writelns('FILE: ' + file);
                        if (cont){
                            abspath     = path.join(opts.build,file);
                            targetFile  = path.join(opts.target,file);
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
            opts.source = path.join(opts.rootDir,opts.alias);
        }

        if (!opts.target){
            opts.target = path.join(opts.libDir,opts.alias);
        }

        if (!opts.build){
            opts.build = path.join(opts.rootDir,opts.alias,opts.buildDir);
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
