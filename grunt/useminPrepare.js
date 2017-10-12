module.exports = {
    html: '<%= meta.www %>/index.html',
    options: {
        dest: '<%= meta.dist %>',
        assetDirs: ['styles/fonts', 'img']
    }
};
