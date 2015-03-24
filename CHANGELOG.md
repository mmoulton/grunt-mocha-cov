### 0.0.1 (April 15, 2013)

* Initial release

### 0.0.2 (April 16, 2013)

* Bug fixes

### 0.0.3 (April 16, 2013)

* Bug fixes

### 0.0.4 (April 26, 2013)

* Modifications to the params sent to coveralls.io (pull request #3)

### 0.0.5 (May 3, 2013)

* Fixed regressions introduced in 0.0.4 where the coveralls REST API requires the repo_token for all request (resolved #5)
* Fixed the on disk locating of mocha. Caused failures when mocha was a dependency of a project including this library. (resolved #4)

### 0.0.6 (May 4, 2013)

* Adding ability to save report output to disk using `output` option

### 0.0.7 (May 5, 2013)

* Updated test suite to use this plugin (resolved #10)
* Bug in regex for coveralls service name. (resolved #9)
* More robust handling of coveralls.io API options (resolved #8)

### 0.1.0 (Dec 5, 2013)

* Updating all dependencies, this includes:
  * mocha 0.14.x
  * blanket 1.1.6
* Changed search location for `mocha` (resolved #17)

### 0.1.1 (Dec 6, 2013)

* Will now create any missing directories when writing output to a file (resolved #19)

### 0.2.0 (Jan 22, 2014)

* Switched to official `node-coveralls` module for interfacing with coveralls.io.
  Special thanks to @spenceralger for the pull request. (resolved #25)
* Updating all dependencies to latest versions and shrinkwrapping using `npm shrinkwrap`

### 0.2.1 (Feb 5, 2014)

* Updated coffeescript dependency for mocha tests to use 1.7.x where you now must explicitly register the compiler
* Fixed typos

### 0.3.0 (Aug 4, 2014)

* Updating all dependencies, this includes:
  * mocha 1.21.3
  * blanket 1.1.6
  * coveralls 2.11.1
* Support for latest mocha options, including Harmony mode (Thanks @jan-molak)

### 0.4.0 (Mar 24, 2015)

* Node 0.12.x / io 1.x support
* Updating dependencies
  * mocha 2.2.1
  * coveralls 2.11.2
* Fix #38

** Thanks to @xhmikosr for the PR that made this possible
