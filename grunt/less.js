'use strict';

module.exports = {
    dev: {
        files: {
            '<%= meta.www %>/css/style.css': '<%= meta.www %>/css/style.less'
        }
    },
    dist: {
        options: {
            compress: true
        },
        files: {
            '<%= meta.www %>/css/style.css': '<%= meta.www %>/css/style.less'
        }
    }
};
