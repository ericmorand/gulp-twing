# gulp-twing

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage percentage][coveralls-image]][coveralls-url]

Compile [Twig](https://github.com/twigphp/Twig) templates with [gulp](https://github.com/gulpjs/gulp). Build upon [Twing](https://github.com/ericmorand/twing).

Requires [Node.js](https://github.com/nodejs/node) ≥ 6.0.0

## Installation

```bash
npm install twing gulp-twing --save
```

## Usage

`var twing = require('gulp-twing');`

### twing(env, data = {}, options = {})

Return an object transform stream that expects entry filenames.

* env

  A [TwingEnvironment](https://ericmorand.github.io/twing/api.html#basics) instance.

* data

  A hash of data passed to the render function of the template. See [Twing documentation](https://ericmorand.github.io/twing/api.html#rendering-templates) for details.

* options

  An optional hash of options. The following options are supported:

  * outputExt

    The output file extension including the `.`. Defaults to `.html`.

  * templatePaths

    A path string or an array of path strings to pass to [TwingLoaderFilesystem](https://ericmorand.github.io/twing/api.html#twingloaderfilesystem). Defaults to ` '.'`.

### Examples

The following examples all require importing gulp, gulp-twing and instantiating a Twing environment:

```javascript
// top of gulpfile.js
var gulp = require('gulp');
var twing = require('gulp-twing');
var {TwingEnvironment, TwingLoaderRelativeFilesystem} = require('twing');

let env = new TwingEnvironment(new TwingLoaderRelativeFilesystem());
```

#### Basic usage

To compile all `.twig` files in the source directory `src/` saving the output as `.html` in the destination directory `dest/`, use

```javascript
// in gulpfile.js
function twig() {    
    return gulp.src('src/**/*.twig')
        .pipe(twing(env))
        .pipe(gulp.dest('dest'))
}
```

#### CLI usage

To expose the above function to the command line in gulp 3 or gulp 4, use `gulp.task`:

```javascript
// in twig()
gulp.task('twig', twig);
```

Call the function with the command `gulp twing`.

If you don't need to support gulp 3, you can use the more terse gulp 4 syntax

```javascript
// in twig()
gulp.task(twig);
```

#### Classic gulp syntax

It may be convenient to use the classic syntax, for example when migrating an older gulp project's Twig compilation to Twing. This is not recommended for new projects as it is not supported by gulp 4.

```javascript
// in gulpfile.js
gulp.task('twig', function() {
    return gulp.src('src/**/*.twig')
        .pipe(twing(env))
        .pipe(gulp.dest('dest'))
});
```

#### Passing data

You can pass data to Twig templates during compilation with the gulp-twing's data hash.

For example, to compile the template

```twig
{# src/example.twig #}
{{ foo }}
```

to

```html
<!-- dest/example.twig -->
bar
```

use

```javascript
// in gulpfile.js
function twig() {
    return gulp.src('src/**/*.twig')
        .pipe(twing(env, {foo: 'bar'}))
        .pipe(gulp.dest('dest'))
}
```

#### Renaming files

By default, gulp-twing appends `.html` to compiled files. Changing this behavior is easy.

##### Strictly named templates

Use gulp-twing's `outputExt` option when applying the same file extension change to all source files. For example, use `outputExt: '.ext'` to compile example.twig as example.ext. Or use `outputExt: ''` to compile example.ext.twig as example.ext.

```javascript
// in gulpfile.js

// src contains only *.css.twig and *.html.twig templates

function twig() {
    return gulp.src('src/**/*.twig')
        .pipe(twing(env, {}, {outputExt: ''}))
        .pipe(gulp.dest('dest'))
}

// dest will contain *.css and *.html files
```

#### Loosely named templates

If you need more control on the name of the ouput, use [gulp-rename](https://www.npmjs.com/package/gulp-rename).

To compile index.css.twig, index.html.twig, and foo.twig saving the output to index.css, index.html, and foo.html, use

```javascript
// in gulpfile.js
var rename = require('gulp-rename');

// src contains foo.twig, index.css.twig and index.html.twig

function twig() {
    gulp.src('src/**/*.twig')
        .pipe(twing(env))
        .pipe(rename(function(path) {
            if (path.basename.indexOf('.') > -1) {
                path.extname = '';
            }
        }))
        .pipe(gulp.dest('dest'))
}

// dest will contain foo.html, index.css and index.html
```

By combining `gulp-rename` and `outputExt`, you can compile index.css.twig, index.html.twig, foo.twig saving the output to index.css, index.html, and foo.ext:

```javascript
// in gulpfile.js
var rename = require('gulp-rename');

// src contains foo.twig, index.css.twig and index.html.twig

function twig() {
    gulp.src('src/**/*.twig')
        .pipe(twing(env, {}, {outputExt: '.ext'}))
        .pipe(rename(function(path) {
            if (path.basename.indexOf('.') > -1) {
                path.extname = '';
            }
        }))
        .pipe(gulp.dest('dest'))
}

// dest will contain foo.ext, index.css and index.html
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
[coveralls-image]: https://coveralls.io/repos/github/ericmorand/gulp-twing/badge.svg
[coveralls-url]: https://coveralls.io/github/ericmorand/gulp-twing