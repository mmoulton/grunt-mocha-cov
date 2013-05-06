/*jshint -W068 */

'use strict';

var mocha = require('../lib/mocha'),
    path = require('path'),
    fs = require('fs'),
    chai = require('chai'),
    should = chai.should();

describe('Unit Tests', function () {

  it('should pass a sanity chack', function (done) {
    mocha({
      files: [__dirname + '/fixture/pass.js'],
      quiet: true
    }, function (error, output) {
      should.not.exist(error);
      output.should.include('1 test complete');
      done();
    });
  });

  it('should test when mocha passes', function (done) {
    mocha({
      files: [__dirname + '/fixture/pass.js'],
      quiet: true
    }, function (error) {
      should.not.exist(error);
      done();
    });
  });

  it('should test when mocha fails', function (done) {
    mocha({
      files: [__dirname + '/fixture/fail.js'],
      quiet: true
    }, function (error) {
      should.exist(error);
      done();
    });
  });

  it('should test setting string options', function (done) {
    mocha({
      files: [__dirname + '/fixture/pass.js'],
      quiet: true,
      reporter: 'json'
    }, function (error, output) {
      should.not.exist(error);
      (function () {
        JSON.parse(output);
      }).should.not.throw();
      done();
    });
  });

  it('should test setting boolean options', function (done) {

    mocha({
      files: [__dirname + '/fixture/fail.js'],
      quiet: true,
      reporter: 'json',
      bail: true
    }, function (error, output) {
      should.exist(error);
      output = JSON.parse(output);
      output.stats.tests.should.equal(1);
      done();
    });
  });

  it('should test setting array options', function (done) {

    mocha({
      files: [__dirname + '/fixture/coffeescript.coffee'],
      quiet: true,
      reporter: 'json',
      compilers: ['coffee:coffee-script']
    }, function (error) {
      should.not.exist(error);
      done();
    });
  });

  it('should test requiring modules', function (done) {

    mocha({
      files: [__dirname + '/fixture/require.js'],
      quiet: true,
      reporter: 'json',
      require: ['should']
    }, function (error, output) {
      should.not.exist(error);
      output = JSON.parse(output);
      output.stats.passes.should.equal(1);
      done();
    });
  });

  it('should test file globbing', function (done) {

    mocha({
      files: [__dirname + '/fixture/pass*.js'],
      quiet: true,
      reporter: 'json'
    }, function (error, output) {
      should.not.exist(error);
      output = JSON.parse(output);
      output.stats.suites.should.equal(2);
      done();
    });
  });

  it('should test coverage', function (done) {

    mocha({
      files: [__dirname + '/fixture/pass.js'],
      quiet: true,
      reporter: 'json-cov',
      coverage: true
    }, function (error, output) {
      should.not.exist(error);
      output.should.include('"coverage": 100');
      done();
    });
  });

  it('should test coverage output', function (done) {

    mocha({
      files: [__dirname + '/fixture/pass.js'],
      quiet: true,
      reporter: 'json-cov',
      output: 'test/out.json'
    }, function (error) {
      should.not.exist(error);
      var filename = path.resolve('test/out.json');
      var jsonOutput = JSON.parse(fs.readFileSync(filename));
      fs.unlinkSync(filename);
      jsonOutput.coverage.should.equals(100);
      done();
    });
  });

  it('should test coveralls integration', function (done) {

    mocha({
      files: [__dirname + '/fixture/pass.js'],
      coveralls: {
        repoToken: 'bad-token',
        serviceName: 'bad-name',
        serviceJobId: 'bad-job-id'
      }
    }, function (error) {
      // expect a bad response as we intentionaly give coveralls a bad token
      should.exist(error);
      done();
    });
  });

});
