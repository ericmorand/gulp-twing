# gulp-twing

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]

Compile Twig templates with Gulp. Build upon [Twing](https://github.com/ericmorand/twing).

## Installation

```bash
npm install twing gulp-twing --save-dev
```

## Why do I need to install Twing?

gulp-twing declares Twing as a peer dependency. It permits using any version of Twing (starting with version 0.4.0) with gulp-twing and profit from the latest features without having to wait for gulp-twing to catch-up.

## Usage

`let gulpTwing = require('gulp-twing');`

### gulpTwing(env, data, options)

Return an object transform stream that expects entry filenames.

* env

  A Twing environment. See [Twing documentation](https://ericmorand.github.io/twing/api.html) for details.

* data
 
  A hash of data passed to the render function of the template. See [Twing documentation](https://ericmorand.github.io/twing/api.html#rendering-templates) for details.

* options

  An optional hash of options. The following options are supported:

  * outputExt
  
    The output file extension including the `.`. Defaults to `.html`.

### Examples

#### Basic usage

```javascript
let gulp = require('gulp');
let gulpTwing = require('gulp-twing');

let Twing = require('twing');
let loader = new Twing.TwingLoaderFilesystem('/');
let env = new Twing.TwingEnvironment(loader);

gulp
    .src('src/**/*.twig')
    .pipe(gulpTwing(env, {foo: 'bar'}))
    .pipe(gulp.dest('dest'))
;
```

#### Strictly named templates

```javascript
let gulp = require('gulp');
let gulpTwing = require('gulp-twing');

let Twing = require('twing');
let loader = new Twing.TwingLoaderFilesystem('/');
let env = new Twing.TwingEnvironment(loader);

// src contains only *.css.twig and *.html.twig templates

gulp
    .src('src/**/*.twig')
    .pipe(gulpTwing(env, {foo: 'bar'}, {outputExt: ''}))
    .pipe(gulp.dest('dest'))
;

// dest will contain *.css and *.html files

```

#### Loosely named templates

If you need more control on the name of the ouput, use [gulp-rename](https://www.npmjs.com/package/gulp-rename).

```javascript
let gulp = require('gulp');
let gulpTwing = require('gulp-twing');
let gulpRename = require('gulp-rename');

let Twing = require('twing');
let loader = new Twing.TwingLoaderFilesystem('/');
let env = new Twing.TwingEnvironment(loader);

// src contains foo.twig, index.css.twig and index.html.twig

gulp
    .src(['src/**/*.twig'])
    .pipe(gulpTwing(env, {foo: 'bar'}))
    .pipe(gulpRename(function(path) {
        if (path.basename.indexOf('.') > -1) {
            path.extname = '';
        }
    }))
    .pipe(gulp.dest('dest'))
;

// dest will contain foo.html, index.css and index.html

```

## Contributing

* Fork the main repository
* Code
* Implement tests using [node-tap](https://github.com/tapjs/node-tap)
* Issue a pull request keeping in mind that all pull requests must reference an issue in the issue queue

## License

Apache-2.0 © [Eric MORAND]()

[npm-image]: https://badge.fury.io/js/gulp-twing.svg
[npm-url]: https://npmjs.org/package/gulp-twing
[travis-image]: https://travis-ci.org/ericmorand/gulp-twing.svg?branch=master
[travis-url]: https://travis-ci.org/ericmorand/gulp-twing
[daviddm-image]: https://david-dm.org/ericmorand/gulp-twing.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/ericmorand/gulp-twing
[coveralls-image]: https://coveralls.io/repos/github/ericmorand/gulp-twing/badge.svg
[coveralls-url]: https://coveralls.io/github/ericmorand/gulp-twing