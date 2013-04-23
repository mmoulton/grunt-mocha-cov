'use strict';

var grunt = require('grunt');


exports['grunt pass'] = function (test) {
  test.expect(1);

  grunt.util.spawn({
    cmd: 'grunt',
    args: ['--gruntfile', __dirname + '/fixture/pass-gruntfile.js']
  }, function (error, output, code) {
    test.strictEqual(code, 0, 'grunt should pass');
    test.done();
  });
};

exports['grunt fail'] = function (test) {
  test.expect(1);

  grunt.util.spawn({
    cmd: 'grunt',
    args: ['--gruntfile', __dirname + '/fixture/fail-gruntfile.js']
  }, function (error, output, code) {
    test.notStrictEqual(code, 0, 'grunt should fail');
    test.done();
  });
};

exports['grunt fail missing repo_token or service_job_id + service_name'] = function (test) {
  test.expect(1);

  grunt.util.spawn({
    cmd: 'grunt',
    args: ['--gruntfile', __dirname + '/fixture/fail-gruntfile2.js']
  }, function (error, output, code) {
    test.notStrictEqual(code, 0, 'grunt should fail');
    test.done();
  });
};

exports['grunt glob'] = function (test) {
  test.expect(2);

  grunt.util.spawn({
    cmd: 'grunt',
    args: ['--gruntfile', __dirname + '/fixture/glob-gruntfile.js']
  }, function (error, output, code) {
    test.notStrictEqual(output.stdout.indexOf('2 tests complete'), -1, 'should run 2 tests');
    test.strictEqual(code, 0, 'grunt should pass');
    test.done();
  });
};

exports['grunt options'] = function (test) {
  test.expect(1);

  grunt.util.spawn({
    cmd: 'grunt',
    args: ['--gruntfile', __dirname + '/fixture/options-gruntfile.js']
  }, function (error, output, code) {
    test.strictEqual(code, 0, 'grunt should pass');
    test.done();
  });
};

exports['grunt coverage'] = function (test) {
  test.expect(2);
  grunt.util.spawn({
    cmd: 'grunt',
    args: ['--gruntfile', __dirname + '/fixture/coverage-gruntfile.js']
  }, function (error, output, code) {
    test.notStrictEqual(output.stdout.indexOf('"coverage": 100'), -1, 'coverage should be 100 percent');
    test.strictEqual(code, 0, 'grunt should pass');
    test.done();
  });
};