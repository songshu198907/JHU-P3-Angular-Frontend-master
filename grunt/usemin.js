module.exports = {
    html: ['<%= meta.dist %>/templates/{,*/}*.html'],
    css: ['<%= meta.dist %>/css/{,*/}*.css'],
    options: {
        assetsDirs: ['<%= meta.dist %>', '<%= meta.dist %>/img']
    }
};
