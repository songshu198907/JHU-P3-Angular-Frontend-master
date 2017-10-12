module.exports = {
  dist: {
    src: ['<%= meta.dist %>/scripts/{,*/}*.js',
      '<%= meta.dist %>/styles/css/{,*/}*.css',
      '<%= meta.dist %>/styles/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
      '<%= meta.dist %>/styles/fonts/*'
    ]
  }
};
