'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    mochacov: {
      options: {
        require: ['should']
      },
      all: [__dirname + '/require.js']
    }
  });

  grunt.loadTasks(__dirname + '/../../tasks');

  grunt.registerTask('default', 'mochacov');
};
