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

    initProps.installDir = function() {
        return (this.name() + '.' +
                this.gitLastCommit.date.toISOString().replace(/\W/g,'') + '.' +
                this.gitLastCommit.commit);
    };
    initProps.installPath = function(){
        return (path.join(this.prefix, 'releases', this.installDir()));
    };
    initProps.linkPath = function(){
        return path.join(this.prefix, 'www' );
    };
    initProps.distVersionPath= function() {
        return path.join(this.dist, this.gitLastCommit.commit);
    };

    grunt.initConfig({
        settings: initProps,
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
            server: '.tmp',
            local: '/usr/local/share/nginx/demos/screenjack'
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
            },
            release:    {
                files:  [
                    {
                        expand : true,
                        dot    : true,
                        cwd    : path.join(__dirname,'dist'),
                        src    : ['**'],
                        dest   : '<%= settings.installPath() %>',
                    }
                ]
            },
            local:    {
                files:  [
                    {
                        expand : true,
                        dot    : true,
                        cwd    : path.join(__dirname,'dist'),
                        src    : ['**'],
                        dest   : '/usr/local/share/nginx/demos/stub'
                    }
                ]
            }
        },
        link : {
            options : {
                overwrite: true,
                force    : true,
                mode     : '755'
            },
            www : {
                target : '<%= settings.installPath() %>',
                link   : path.join('<%= settings.linkPath() %>','<%= settings.name() %>')
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

    grunt.registerTask('release',function(type){
        type = type ? type : 'patch';
        //grunt.task.run('test');
        grunt.task.run('build');
    });

    grunt.registerTask('default', ['build']);

    grunt.registerTask('mvbuild', 'Move the build to a release folder.', function(){
        if (grunt.config.get('moved')){
            grunt.log.writeln('Already moved!');
            return;
        }
        var settings = grunt.config.get('settings'),
            installPath = settings.installPath();
        grunt.log.writeln('Moving the module to ' + installPath);
        grunt.task.run('copy:release');
        grunt.config.set('moved',true);
    });

    grunt.registerMultiTask('link', 'Link release apps.', function(){
        var opts = grunt.config.get('link.options'),
            data = this.data;

        if (!opts) {
            opts = {};
        }

        if (!data.options){
            data.options = {};
        }

        if (!opts.mode){
            opts.mode = '0755';
        }

        if (opts){
            Object.keys(opts).forEach(function(opt){
                if (data.options[opt] === undefined){
                    data.options[opt] = opts[opt];
                }
            });
        }

        if (data.options.overwrite === true){
            if (fs.existsSync(data.link)){
                grunt.log.writelns('Removing old link: ' + data.link);
                fs.unlinkSync(data.link);
            }
        }

        if (data.options.force){
            var linkDir = path.dirname(data.link);
            if (!fs.existsSync(linkDir)){
                grunt.log.writelns('Creating linkDir: ' + linkDir);
                grunt.file.mkdir(linkDir, '0755');
            }
        }

        grunt.log.writelns('Create link: ' + data.link + ' ==> ' + data.target);
        fs.symlinkSync(data.target, data.link);

        grunt.log.writelns('Make link executable.');
        fs.chmodSync(data.link,data.options.mode);

        grunt.log.writelns(data.link + ' is ready.');
    });

    grunt.registerTask('installCheck', 'Install check', function(){
        var settings = grunt.config.get('settings'),
            installPath = settings.installPath();

        if (fs.existsSync(installPath)){
            grunt.log.errorlns('Install dir (' + installPath +
                                ') already exists.');
            return false;
        }
    });

    grunt.registerTask('install', [
        'gitLastCommit',
        'installCheck',
        'release',
        'mvbuild',
        'link',
        'installCleanup'
    ]);

    grunt.registerTask('installCleanup', [
        'gitLastCommit',
        'rmbuild'
    ]);

    grunt.registerTask('rmbuild','Remove old copies of the install',function(){
        this.requires(['gitLastCommit']);
        var settings       = grunt.config.get('settings'),
            installBase = settings.name(),
            installPath = settings.installPath(),
            installRoot = path.dirname(installPath),
            pattPart = new RegExp(installBase),
            pattFull = new RegExp(installBase +  '.(\\d{8})T(\\d{9})Z'),
            history     = grunt.config.get('rmbuild.history'),
            contents = [];

        if (history === undefined){
            history = 4;
        }
        grunt.log.writelns('Max history: ' + history);

        fs.readdirSync(installRoot).forEach(function(dir){
            if (pattPart.test(dir)){
                contents.push(dir);
            }
        });

        if (contents){
            var sorted = contents.sort(function(A,B){
                var mA = pattPart.exec(A),
                    mB = pattPart.exec(B),
                    i;
                // The version is the same
                mA = pattFull.exec(A);
                mB = pattFull.exec(B);
                if (mA === null) { return 1; }
                if (mB === null) { return -1; }
                for (i = 1; i <= 2; i++){
                    if (mA[i] !== mB[i]){
                        return mA[i] - mB[i];
                    }
                }
                return 1;
            });
            while (sorted.length > history){
                var dir = sorted.shift();
                grunt.log.writelns('remove: ' + dir);
                fs.removeSync(path.join(installRoot,dir));
            }
        }
    });

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

    grunt.registerTask('gitstatus','Make surethere are no pending commits', function(){
        var done = this.async();
        grunt.util.spawn({
            cmd     : 'git',
            args    : ['status','--porcelain']
        },function(err,result){
            if (err) {
                grunt.log.errorlns('Failed to get git status: ' + err);
                done(false);
            }
            if (result.stdout === '""'){
                grunt.log.writelns('No pending commits.');
                done(true);
            }
            grunt.log.errorlns('Please commit pending changes');
            grunt.log.errorlns(result.stdout.replace(/\"/g,''));
            done(false);
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
                    var files = grunt.file.expand({ cwd : opts.build},'*.js'),
                        cont = true,targetFile,abspath;
                    files.forEach(function(file){
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
