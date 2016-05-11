# Thing.js

A javascript library for working with things! Inspired by [W3C web of things framework](), a thing is an object that has:

[See how they actually word it...]

* Properties
* Actions
* Events

More about what this is....


# Example





# es6-library-starter
[![Build Status](https://travis-ci.org/UWFosterIT/es6-library-starter.svg?branch=master)](https://travis-ci.org/UWFosterIT/es6-library-starter)
[![Code Climate](https://codeclimate.com/github/UWFosterIT/es6-library-starter/badges/gpa.svg)](https://codeclimate.com/github/UWFosterIT/es6-library-starter)
[![Test Coverage](https://codeclimate.com/github/UWFosterIT/es6-library-starter/badges/coverage.svg)](https://codeclimate.com/github/UWFosterIT/es6-library-starter)
[![Dependency Status](https://david-dm.org/UWFosterIT/es6-library-starter.svg)](https://david-dm.org/UWFosterIT/es6-library-starter)
[![devDependency Status](https://david-dm.org/UWFosterIT/es6-library-starter/dev-status.svg)](https://david-dm.org/UWFosterIT/es6-library-starter#info=devDependencies)

Author libraries in ES6 for Node. By design this does not include browser support. If you also need browser support use the [starter](https://www.npmjs.com/package/6to5-library-boilerplate) that inspired this one.

### Features

- Author in ES6 (even the unit tests)
- Export as ES5 & UMD
- Mocha-Chai-Sinon testing stack
- Code Coverage with istanbul

### Getting Started

Update the metadata about the project, including the name in the `LICENSE`
and the `package.json` information.

Write your code in `src`. The primary file is `index.js` ([although the filename
can be changed](https://github.com/UWFosterIT/es6-library-starter#i-want-to-change-the-primary-source-file)).

Run `gulp build` to compile the source into a distributable format.

Put your unit tests in `test/unit`. The `gulp` command runs the tests.

### Gulp tasks

- `gulp` - Lint the library and tests, then run the unit tests
- `gulp build` - Lint then build the library
- `gulp coverage` - Checks your code for quality, style, security and test coverage.

### Code Climate

This library is set up to integrate with Code Climate. If you've never used Code Climate, then you might be wondering why it's useful. There are two reasons:

1. It consumes code coverage reports, and provides a coverage badge for the README
2. It provides interesting stats on your library, if you're into that kinda thing

Either of these items on the list can simply be ignored if you're uninterested in them. Or you can pull Code Climate out entirely from the starter and not worry about it. To do that, update the relevant Gulp tasks and the Travis build.

#### Setup

Follow these steps to set up Code Climate in your new repository.

- Create an account at Code Climate, then login
- Go to `https://codeclimate.com/github/{{ github_user }}/{{ repo_name }}`. Click add.
- Next, head to the homepage of `https://codeclimate.com`. Hover over the name of the newly-added repository and click 'Settings' (it appears on hover)
- Grab your token from the `Test Coverage` section. The token in the example code that they provide **is** your token.
- Go to `https://travis-ci.org/{{ github_user }}/{{ repo_name }}/settings/env_vars`
- Add your token as an environment variable

That's it! Reports are generated from the master branch, so the first report will be generated after your next commit to master.

### Linting

This starter eslint to lint your source and tests. To change the rules, edit the `.eslintrc` and `test/.eslintrc `.

### Consuming

An example of how to consume this module as is would be something like the following.

    npm install es6-library-starter --save
    touch consumer.js

Now edit consumer.js to include the following code

    var MyLibrary = require('es6-library-starter');
    console.log(MyLibrary.mainFn());
    console.log(MyLibrary.multiply(5,5));

Now run it

    node consumer.js

And output should be the following

    hello
    25

### FAQ

#### When should I consider using this starter?

You're authoring a library that exports a single file, and that one file
exports a single variable.

#### When might I not want to use this starter?

You can always use this starter as inspiration, but it works best for smaller libraries. If you're building a full-scale webapp, you will likely need many more changes to the build system.

### Customizing

This starter is, to a certain extent, easily customizable. To make changes,
find what you're looking to do below and follow the instructions.

#### I want to change the primary source file

The primary source file for the library is `src/index.js`. Only the files that this file imports will be included in the final build. To change the name of this entry file:

1. Rename the file
2. Update the value of `entryFileName` in `package.json` under `to5BoilerplateOptions`

#### I want to change the exported file name

1. Update `main` in `package.json`

#### I want to change the destination directory

1. Update `main` in `package.json`

#### I want to change what variable my module exports

`MyLibrary` is the name of the variable exported from this starter. You can change this by following these steps:

1. Ensure that the variable you're exporting exists in your scripts
2. Update the value of `exportVarName` in `package.json` under `to5BoilerplateOptions`
3. Update the globals array in the `test/.jshintrc` file
4. Check that the unit tests have been updated to reference the new value

#### I don't want to export a variable

1. Ensure that your entry file does not export anything
2. Set the property of `exportVarName` in `package.json` to be `null`
3. Remove the variable name from the globals array in `test/.jshintrc`

#### My library depends on an external module

In the simplest case, you just need to install the module and use it in your scripts. If you want to access the module itself in your unit test files, you will need to set up the test environment to support the module. To do this:

1. Load the module in the [test setup file](https://github.com/UWFosterIT/es6-library-starter/blob/master/test/setup/setup.js).
  Attach any exported variables to global object if you'll be using them in your tests.
2. Update both `.jshintrc` files to include any new global variable that you have added
3. Add those same global variables to the `mochaGlobals` array in `package.json` under
  `to5BoilerplateOptions`
