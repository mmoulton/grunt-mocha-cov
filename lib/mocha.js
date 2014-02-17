/**
 * grunt-mocha-cov
 * Copyright(c) 2013 Mike Moulton <mike@meltmedia.com>
 * MIT Licensed
 */
'use strict';

var grunt = require('grunt'),
    path = require('path'),
    fs = require('fs'),
    mkdirp = require('mkdirp'),
    coveralls = require('coveralls'),
    temp = require('temp');

// delete temp files, please!
temp.track();

// expose mocha
exports = module.exports = mocha;

// expose for testability
mocha.getBaseOptions = getBaseOptions;

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
 * Apply the defaults to options
 * @param  {Object} options - Optional options, as specified by user
 * @return {Object}
 * @api private
 */
function getBaseOptions(options) {
  options = options || {};

  var defaults = require('lodash.defaults');

  if (options.coverage) {
    options.instrument = true;
  }

  if (options.coveralls) {
    if (typeof options.coveralls !== 'object') {
      options.coveralls = {};
    }

    defaults(options, {
      // For coveralls to work properly we must use the LCov format
      reporter: 'mocha-lcov-reporter',
      // Hide the raw LCov report format from stdout
      quiet: true,
      // Be sure to instrument the source
      instrument: true
    });
  }

  // Automaticaly instrument code if one of the built in coverage reports is requested
  if (options.reporter && options.reporter.match(/-cov$/)) {
    defaults(options, {
      instrument: true
    });
  }

  if (typeof options.require === 'string') {
    options.require = [options.require];
  }
  else if (!Array.isArray(options.require)) {
    options.require = [];
  }

  // Instrument the source with blanket
  if (options.instrument) {
    options.require.push(path.relative(process.cwd(), __dirname + '/instrument'));
  }

  return options;
}

/**
 * Mocha test harness
 *
 * @param {Object} options
 * @param {Function} callback
 * @api public
 */

function mocha(options, callback) {

  var args = [],
      mochaBasePath = path.dirname(require.resolve('mocha')),
      spawnOptions = { cmd: path.normalize(mochaBasePath + '/../.bin/mocha') },
      fd_out, fd_err;

  if (process.platform === 'win32') {
    spawnOptions.cmd += '.cmd';
  }

  options = getBaseOptions(options);

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

  options.require.forEach(function (module) {
    args.push('--require');
    args.push(module);
  });

  if (options.files) {
    args = args.concat(grunt.file.expand(options.files));
  }

  spawnOptions.args = args;

  if (!options.coveralls && options.output) {
    var filename = path.resolve(options.output),
        dir = path.dirname(filename);

    if (!fs.existsSync(dir)) {
      mkdirp.sync(dir);
    }
    fd_out = {
      fd: fs.openSync(filename, 'w'),
      path: filename
    };

    spawnOptions.opts = { stdio: ['ignore', fd_out.fd, fd_out.fd] };
  } else if (!options.quiet && !options.output) {
    // Redirect the Mocha output directly to the terminal to maintain colors
    spawnOptions.opts = { stdio: 'inherit' };
  } else if (process.platform === 'win32') {
    // We need to redirect to a temp file in order for everyone to be happy on Windows.

    fd_out = temp.openSync('grunt-mocha-cov');
    fd_err = temp.openSync('grunt-mocha-cov');

    spawnOptions.opts = { stdio: ['ignore', fd_out.fd, fd_err.fd] };

  }

  // Run mocha test in new process with coverage support
  grunt.util.spawn(spawnOptions, function (error, result) {
    if (fd_out) {
      fs.closeSync(fd_out.fd);
      result = {
        stdout: fs.readFileSync(fd_out.path, 'utf8')
      };

      if (fd_err) {
        fs.closeSync(fd_err.fd);
        result.stderr = fs.readFileSync(fd_err.path, 'utf8');
      }
    }

    if (error) {
      return callback(error, result.stdout + result.stderr);
    }
    // Send output to coveralls
    // Format should be LCov
    if (options.coveralls) {
      coveralls.getBaseOptions(function (err, opts) {
        if (err) {
          return callback(new Error('Unable to fetch base options: ' + err.message));
        }

        if (options.coveralls.serviceJobId) {
          opts.service_job_id = options.coveralls.serviceJobId;
        }

        if (options.coveralls.serviceName) {
          opts.service_name = options.coveralls.serviceName;
        }

        if (options.coveralls.repoToken) {
          opts.repo_token = options.coveralls.repoToken;
        }

        if (!(opts.repo_token || (opts.service_name && opts.service_job_id))) {
          return callback(new Error('Unable to send data to coveralls.io, if you are not currently running on a supported CI service \'repoToken\' or \'serviceJobId\' and \'serviceName\' are required'));
        }

        coveralls.convertLcovToCoveralls(String(result), opts, function (err, postData) {
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
      });

    // Save report to disk
    } else if (options.output) {
      //We've already saved output by redirecting spawn() to an fd
      callback();

    // Send report to stdout
    } else {
      callback(null, result.stdout + result.stderr);
    }
  });

}
