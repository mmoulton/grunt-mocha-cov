/**
 * grunt-mocha-cov
 * Copyright(c) 2013 Mike Moulton <mike@meltmedia.com>
 * MIT Licensed
 */
'use strict';

var fs = require('fs'),
    lcovParse = require('lcov-parse'),
    request = require('request');


/**
 * Expose `Coveralls`.
 */

exports = module.exports = coveralls();

/**
 * Coveralls Handlers
 *
 * @api public
 */

function coveralls() {
  return {
    convertLcovToCoveralls: function (input, options, callback) {

      if (!options.repoToken) {
        throw new Error('Can\'t send data to coveralls.io, \'repoToken\' and optionaly \'serviceJobId\' and \'serviceName\' should be provided');
      }

      var jobId = options.serviceJobId,
          serviceName = options.serviceName,
          postJson = { source_files : [] };

      // We use the API to submit to coveralls so the repo token is always required
      postJson.repo_token = options.repoToken;

      if (serviceName && /^travis-(ci|pro)$/.match(serviceName)) {
        jobId = process.env.TRAVIS_JOB_ID || jobId;
      }

      if (jobId && options.serviceName) {
        postJson.service_job_id = jobId;
        postJson.service_name = options.serviceName;
      }

      var detailsToCoverage = function (length, details) {
        var coverage = new Array(length);
        details.forEach(function (obj) {
          coverage[obj.line - 1] = obj.hit;
        });
        return coverage;
      };

      var convertLcovFileObject = function (file) {
        var source = fs.readFileSync(file.file, 'utf8');
        var lines = source.split('\n');
        var coverage = detailsToCoverage(lines.length, file.lines.details);
        return {
          name: file.file.replace(process.cwd(), ''),
          source: source,
          coverage: coverage
        };
      };

      lcovParse(input, function (err, parsed) {
        if (err) {
          return callback(err);
        }

        parsed.forEach(function (file) {
          postJson.source_files.push(convertLcovFileObject(file));
        });

        return callback(null, postJson);
      });
    },

    sendToCoveralls: function (payload, callback) {
      var req = {
        url: 'https://coveralls.io/api/v1/jobs',
        method: 'POST',
        form: {
          json: JSON.stringify(payload)
        }
      };

      request(req, function (err, response, body) {
        callback(err, response, body);
      });
    }

  };
}
