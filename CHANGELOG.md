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