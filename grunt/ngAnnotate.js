module.exports = {
    dist: {
        files: [{
            expand: true,
            cwd: '.tmp/concat/scripts',
            src: ['{,*/}*.js', '!oldieshim.js'],
            dest: '.tmp/concat/scripts'
        }]
    }
};
