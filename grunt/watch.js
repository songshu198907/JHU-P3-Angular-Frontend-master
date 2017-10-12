module.exports = {
    bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
    },
    js: {
        files: ['<%= meta.www %>www/js/{,*/}*.js'],
        tasks: ['newer:jshint:all'],
        options: {
            livereload: '<%= connect.options.livereload %>'
        }
    },
    // jsTest: {
    //     files: ['test/spec/{,*/}*.js'],
    //     tasks: ['newer:jshint:test', 'karma']
    // },
    styles: {
        files: ['<%= meta.www %>www/css/{,*/}*.css'],
        tasks: ['newer:css:dev']
    },
    less: {
        files: ['<%= meta.www %>/css/less/{,*/}*.less'],
        tasks: ['newer:less:dev']
    },
    gruntfile: {
        files: ['Gruntfile.js']
    },
    livereload: {
        options: {
            livereload: '<%= connect.options.livereload %>'
        },
        files: ['<%= meta.www %>www/templates/desktop/{,*/}*.html',
            '<%= meta.www %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
    }
};
