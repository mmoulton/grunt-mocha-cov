'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    mochacov: {
      overage: {
        options: {
          coveralls: {
            repo_token: 'xyz123',
            serviceJobId: 12345678,
            serviceName: 'travis-ci',
            files: [__dirname + '/pass.js']
          }
        }
      }
    }
  });

  grunt.loadTasks(__dirname + '/../../tasks');

  grunt.registerTask('default', 'mochacov');
};
