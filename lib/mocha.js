/**
 * grunt-mocha-cov
 * Copyright(c) 2013 Mike Moulton <mike@meltmedia.com>
 * MIT Licensed
 */
'use strict';

var grunt = require('grunt'),
    path = require('path'),
    coveralls = require('./coveralls');

var BOOL_OPTIONS = [
  'invert',
  'colors',
  'no-colors',
  'growl',
  'debug',
  'bail',
  'recursive',
  'debug-brk',
  'ignore-leaks'
];
var STRING_OPTIONS = [
  'reporter',
  'ui',
  'grep',
  'timeout',
  'slow'
];
var ARRAY_OPTIONS = [
  'globals',
  'compilers'
];

/**
 * Expose `Mocah`.
 */

exports = module.exports = mocha;

/**
 * Mocha test harness
 *
 * @param {Object} options
 * @param {Function} callback
 * @api public
 */

function mocha(options, callback) {
  var args = [];
  var spawnOptions = {
    cmd: __dirname + '/../node_modules/.bin/mocha'
//    cmd: 'mocha'
  };

  console.log("=============================");
  console.log(spawnOptions.cmd);

  if (process.platform === 'win32') {
    spawnOptions.cmd += '.cmd';
  }

  if (options.coveralls) {
    // For coveralls to work properly we must use the LCov format
    options.reporter = 'mocha-lcov-reporter';
    // Hide the raw LCov report format from stdout
    options.quiet = true;
    // Be sure to instrument the source
    options.coverage = true;
  }

  // Automaticaly instrument code if one of the built in coverage reports is requested
  if (options.reporter === 'json-cov' || options.reporter === 'html-cov') {
    options.coverage = true;
  }

  // Instrument the source with blanket if coverage is requested
  if (options.coverage) {
    if (!Array.isArray(options.require)) {
      options.require = [];
    }
    var instrumentModule = __dirname + '/instrument';
    options.require.push(path.relative(process.cwd(), instrumentModule));
  }

  if (!options.quiet) {
    // Redirect the Mocha output directly to the terminal to maintain colors
    spawnOptions.opts = { stdio: 'inherit' };
  }

  BOOL_OPTIONS.forEach(function (option) {
    if (options[option]) {
      args.push('--' + option);
    }
  });

  STRING_OPTIONS.forEach(function (option) {
    if (options[option]) {
      args.push('--' + option);
      args.push(options[option]);
    }
  });

  ARRAY_OPTIONS.forEach(function (option) {
    if (Array.isArray(options[option])) {
      args.push('--' + option);
      args.push(options[option].join(','));
    }
  });

  if (Array.isArray(options.require)) {
    options.require.forEach(function (module) {
      args.push('--require');
      args.push(module);
    });
  }

  if (options.files) {
    args = args.concat(grunt.file.expand(options.files));
  }

  spawnOptions.args = args;

  grunt.util.spawn(spawnOptions, function (error, result) {
    if (error) {
      return callback(error, result.stdout + result.stderr);
    }

    if (options.coveralls) {
      var coverallOptions = {
        jobId: options.coveralls.serviceJobId,
        serviceName: options.coveralls.serviceName,
        repoToken: options.coveralls.repoToken
      };

      coveralls.convertLcovToCoveralls(String(result), coverallOptions, function (err, postData) {
        if (err) {
          return callback(new Error('Unable to parse LCov coverage data: ' + err.message));
        }

        coveralls.sendToCoveralls(postData, function (err, response, body) {
          if (err) {
            return callback(new Error('Unable to send data to coveralls.io: ' + err.message));
          }
          if (response.statusCode >= 400) {
            return callback(new Error('Bad response from coveralls.io: ' + response.statusCode + ' ' + body));
          }
          callback(null);
        });
      });
    } else {
      callback(null, result.stdout + result.stderr);
    }
  });

}
