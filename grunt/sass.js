module.exports = {
    options: {
        loadPath: require('node-bourbon').includePaths,
        quiet: true,
        style: 'expanded'
    },
    dev: {
        files: {
            '<%= meta.www %>/css/style.css': '<%= meta.www %>/scss/main.scss'
        }
    },
    dist: {
        files: {
            '<%= meta.www %>/css/style.css': '<%= meta.www %>/scss/main.scss'
        }
    }
};
