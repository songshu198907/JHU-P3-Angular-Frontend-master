module.exports = {
    options: {
        port: 9000,
        hostname: 'localhost',
        livereload: 35729
    },
    livereload: {
        options: {
            open: true,
            base: '<%= meta.www %>'
        }
    },
    test: {
        options: {
            port: 9001
        }
    },
    dist: {
        options: {
            open: true,
            base: '<%= meta.dist %>'
        }
    }
};