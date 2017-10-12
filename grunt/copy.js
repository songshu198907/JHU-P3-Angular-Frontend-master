module.exports = {
    dist: {
        files: [{
            expand: true,
            dot: true,
            cwd: '<%= meta.www %>',
            dest: '<%= meta.dist %>',
            src: ['*.{ico,png,txt}',
                '*.html',
                'html/{,*/}*.html',
                'img/*',
                'styles/fonts/*'
            ]
        }]
    }
};
