module.exports = {
    dist: {
        files: [{
            dot: true,
            src: ['.sass-cache', '.tmp', '<%= meta.dist %>/{,*/}*', '!<%= meta.dist %>/.git*']
        }]
    }
};
