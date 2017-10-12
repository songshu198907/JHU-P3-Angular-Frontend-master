module.exports = {
    options: {
        jshintrc: '.jshintrc'
    },
    all: {
        src: ['Gruntfile.js', '<%= meta.www %>www/js/{,*/}*.js']
    },
    test: {
        options: {
            jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
    }
};