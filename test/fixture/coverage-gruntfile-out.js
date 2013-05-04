'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    mochacov: {
      options: {
        reporter: 'json-cov',
        output: 'out.json'
      },
      all: [__dirname + '/pass.js']
    }
  });

  grunt.loadTasks(__dirname + '/../../tasks');

  grunt.registerTask('default', 'mochacov');
};
