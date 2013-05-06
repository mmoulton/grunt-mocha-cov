'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    mochacov: {
      options: {
        coveralls: {
          repoToken: 'bad-token'
        }
      },
      all: [__dirname + '/pass.js']
    }
  });

  grunt.loadTasks(__dirname + '/../../tasks');

  grunt.registerTask('default', 'mochacov');
};
