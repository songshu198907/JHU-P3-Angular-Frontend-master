module.exports = {
    dist: {
        options: {
            collapseWhitespace: true,
            conservativeCollapse: true,
            collapseBooleanAttributes: true,
            removeCommentsFromCDATA: true,
            removeOptionalTags: true
        },
        files: [{
            expand: true,
            cwd: '<%= meta.dist %>',
            src: ['*.html', 'www/templates/{,*/}*.html'],
            dest: '<%= meta.dist %>'
        }]
    }
};