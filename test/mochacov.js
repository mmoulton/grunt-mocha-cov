'use strict';

var grunt = require('grunt'),
    path = require('path'),
    fs = require('fs'),
    chai = require('chai'),
    should = chai.should(),
    temp = require('temp');

temp.track();

describe('Integration Tests', function () {

  it('should test grunt passing', function (done) {

    grunt.util.spawn({
      cmd: 'grunt',
      args: ['--gruntfile', __dirname + '/fixture/pass-gruntfile.js']
    }, function (error, output, code) {
      should.not.exist(error);
      code.should.equals(0);
      done();
    });
  });

  it('should test when grunt fails', function (done) {

    grunt.util.spawn({
      cmd: 'grunt',
      args: ['--gruntfile', __dirname + '/fixture/fail-gruntfile.js']
    }, function (error, output, code) {
      code.should.not.equals(0);
      done();
    });
  });

  it('should test missing repo_token or service_job_id + service_name', function (done) {

    grunt.util.spawn({
      cmd: 'grunt',
      args: ['--gruntfile', __dirname + '/fixture/fail-gruntfile2.js']
    }, function (error, output, code) {
      code.should.not.equals(0);
      done();
    });
  });

  it('should test grunt file glob', function (done) {
    var fd_out = temp.openSync('grunt-mocha-cov-test');
    grunt.util.spawn({
      cmd: 'grunt',
      args: ['--gruntfile', __dirname + '/fixture/glob-gruntfile.js'],
      opts: {
        stdio: ['ignore', fd_out.fd, 'ignore'],
      },
    }, function (error, output, code) {
      should.not.exist(error);
      code.should.equals(0);
      fs.closeSync(fd_out.fd);
      fs.readFileSync(fd_out.path, 'utf8').should.include('2 passing');
      done();
    });
  });

  it('should test grunt options', function (done) {

    grunt.util.spawn({
      cmd: 'grunt',
      args: ['--gruntfile', __dirname + '/fixture/options-gruntfile.js']
    }, function (error, output, code) {
      should.not.exist(error);
      code.should.equals(0);
      done();
    });
  });

  it('should test grunt coverage', function (done) {
    var fd_out = temp.openSync('grunt-mocha-cov-test');

    grunt.util.spawn({
      cmd: 'grunt',
      args: ['--gruntfile', __dirname + '/fixture/coverage-gruntfile.js'],
      opts: {
        stdio: ['ignore', fd_out.fd, 'ignore'],
      },
    }, function (error, output, code) {
      should.not.exist(error);
      code.should.equals(0);
      fs.closeSync(fd_out.fd);
      fs.readFileSync(fd_out.path, 'utf8').toString().should.include('"coverage": 100');
      done();
    });
  });

  it('should test grunt coverage output', function (done) {

    grunt.util.spawn({
      cmd: 'grunt',
      args: ['--gruntfile', __dirname + '/fixture/coverage-gruntfile-out.js']
    }, function (error, output, code) {
      should.not.exist(error);
      code.should.equals(0);

      var filename = path.resolve('test/fixture/out.json');
      var jsonOutput = JSON.parse(fs.readFileSync(filename));
      fs.unlinkSync(filename);
      jsonOutput.coverage.should.equals(100);
      done();
    });
  });

  it('should test grunt coverage to coveralls', function (done) {

    grunt.util.spawn({
      cmd: 'grunt',
      args: ['--gruntfile', __dirname + '/fixture/coverage-gruntfile-coveralls.js']
    }, function (error, output, code) {
//      console.log(error.stack);
      should.exist(error);
      code.should.not.equals(0);
      done();
    });
  });

});
