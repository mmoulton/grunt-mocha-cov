# Grunt Mocha Test Coverage [![Build Status][travis-image]][travis] [![Coverage Status][coveralls-image]][coveralls]

Use [Grunt][] to execute server-side [Mocha][] tests with optional code coverage using [Blanket][]. You can also use this to send coverage data to [Coveralls][].

This is based on [grunt-mocha-cli][] and can be used in place of this library with support for running code coverage reports or integration into [Coveralls][].


Getting Started
---------------
You can install this plugin with this command:

```bash
npm install grunt-mocha-cov --save-dev
```

Note: This is a grunt plugin. If you haven't used [Grunt][] before, check out their [Getting Started][] guide, as it explains how to create a Gruntfile as well as install and use Grunt plugins.

Usage
-----

### Options ###
All of the Mocha command line options are supported, plus some extras.

The list of test files to run can be specified using either the standard Grunt format or by using the `files` option. If neither is specified, the Mocha default will be used (`test/*.js`).

#### Mocha Options ####
* `invert` (boolean) - inverts `grep` matches.
* `colors` (boolean) - force enabling of colors.
* `no-colors` (boolean) - force disabling of colors.
* `growl` (boolean) - enable growl notification support.
* `debug` (boolean) - enable node's debugger, synonym for node --debug.
* `bail` (boolean) - bail after first test failure.
* `recursive` (boolean) - include sub directories.
* `debug-brk` (boolean) - enable node's debugger breaking on the first line.
* `ignore-leaks` (boolean) - ignore global variable leaks.
* `reporter` (string) - specify the reporter to use.
* `ui` (string) - specify user-interface (bdd|tdd|exports).
* `grep` (string) - only run tests matching pattern.
* `timeout` (string) - set test-case timeout in milliseconds [2000].
* `slow` (string) - "slow" test threshold in milliseconds [75].
* `globals` (array) - allow the given comma-delimited global names.
* `compilers` (array) - use the given module(s) to compile files.

#### Coverage Options ####
* `instrument` (boolean) - instrument the source using blanket. Defaults to true when you setup `coveralls`, or use specify a `*-cov` reporter, otherwise false.

#### Coveralls Options ####
* `coveralls` (Boolean|Object) - Indicate you wish to send a coverage report to coveralls.io. ***Generally*** you can get away with seting this to `true` and letting [node-coveralls](https://github.com/cainus/node-coveralls) pick the necessary values out of the environment.
  * `serviceName` (string) - name of the CI service for coveralls to integrate with (options are `travis-ci`, `jenkins`, `circleci`, or `codeship`).
  * `serviceJobId` (string) - The job id used by coveralls (default based on service).
  * `repoToken` (string) - repository identifier as provided by coveralls (defaults to the `COVERALLS_REPO_TOKEN` environment variable).

#### Extras ####
* `quiet` (boolean) - disable printing of Mocha's output to the terminal.
* `files` (string|array) - glob(s) of test files to run.
* `output` (string) - path to save report to disk.


### Examples ###

#### Standard Mocha Test ####

Define test files using the standard Grunt format:

```javascript
grunt.initConfig({
  mochacov: {
    options: {
      reporter: 'spec',
      require: ['should']
    },
    all: ['test/*.js']
  }
});

grunt.registerTask('test', ['mochacov']);
```

#### Built in HTML Coverage Report ####

If you use one of the built in coverage reports your code will automaticaly be instrumented by blanket:

```javascript
grunt.initConfig({
  mochacov: {
    options: {
      reporter: 'html-cov',
      require: ['should']
    },
    all: ['test/*.js']
  }
});

grunt.registerTask('test', ['mochacov']);
```

For this to work properly you will also need to inform [Blanket][] about what needs to be instrumented. The best way to do so is adding a block to your `package.json` such as:

```json
"config": {
  "blanket": {
    "pattern": [
      "src"
    ]
  }
}
```
This would instrument any .js files found under `src`.

#### Coveralls.io Integration with Travis CI ####

It's easy to send coverage data to coveralls.io from the most popular CI serivces (like Travis CI). Simply set the `coveralls` option to true:

```javascript
grunt.initConfig({
  mochacov: {
    coverage: {
      options: {
        coveralls: true
      }
    },
    test: {
      options: {
        reporter: 'spec'
      }
    },
    options: {
      files: 'test/*.js'
    }
  }
});

grunt.registerTask('travis', ['mochacov:coverage']);
grunt.registerTask('test', ['mochacov:test']);
```

#### Keep your Coveralls repo token out of the environment ####

Don't want to keep your repo token in the environment where anyone could access it? Pass it in via the `coveralls.repoToken` option:

```js
grunt.initConfig({
  mochacov: {
    options: {
      coveralls: {
        repoToken: 'YOURREPOTOKEN'
      }
    },
    coverage: ['test/*.js']
  }
})
```

#### Setup intrumentation yourself ####

If you want to start blanket yourself, as in [this example](https://github.com/alex-seville/blanket/blob/master/docs/intermediate_node.md), just set the `instrument` option to false.

```javascript
grunt.initConfig({
  mochacov: {
    options: {
      coveralls: true,
      instrument: false
    },
    all: ['test/*.js']
  }
});

grunt.registerTask('json_coverage', ['mochacov']);
```

License
-------
Grunt Mocha Coveralls is based on original works by Gregg Caines and Roland Warmerdam.
Modifications and new works by Mike Moulton released under the MIT license.

Copyright © 2013 Mike Moulton


[Mocha]: http://visionmedia.github.com/mocha/
[Grunt]: http://gruntjs.com/
[Blanket]: http://blanketjs.org/
[Coveralls]: https://coveralls.io
[Getting Started]: http://gruntjs.com/getting-started
[grunt-mocha-cli]: https://github.com/Rowno/grunt-mocha-cli
[travis]: http://travis-ci.org/mmoulton/grunt-mocha-cov
[travis-image]: https://secure.travis-ci.org/mmoulton/grunt-mocha-cov.png?branch=master
[coveralls]: https://coveralls.io/r/mmoulton/grunt-mocha-cov
[coveralls-image]: https://coveralls.io/repos/mmoulton/grunt-mocha-cov/badge.png?branch=master
