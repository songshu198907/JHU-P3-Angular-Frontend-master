'use strict';

module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    // set up app config
    var options = {
        config: {
            src: 'grunt/*.js'
        },
        meta: {
            app: require('./bower.json').appPath || 'app',
            dist: 'dist',
            stylePreCompiler: 'less'
        }
    };

    // load configs
    var configs = require('load-grunt-configs')(grunt, options);
    grunt.initConfig(configs);


    grunt.registerTask('dev', 'Compile then start a connect web server', function(target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'concurrent:server',
            'connect:livereload',
            'watch'
        ]);
    });

    // grunt.registerTask('test', [
    //     'clean:server',
    //     'concurrent:test',
    //     'connect:test',
    //     'karma'
    // ]);
    

    grunt.registerTask('dist', [
        'clean:dist',
        'useminPrepare',
        'concurrent:dist',
        'ngAnnotate',
        'copy:dist',
        'filerev',
        'usemin',
        'htmlmin'
    ]);

};
