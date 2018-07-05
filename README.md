# gulp-twing

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]

Compile [Twig](https://github.com/twigphp/Twig) templates with [gulp](https://github.com/gulpjs/gulp). Build upon [Twing](https://github.com/ericmorand/twing).

Requires [Node.js](https://github.com/nodejs/node) ≥ 6.0.0

## Installation

```bash
npm install twing gulp-twing --save
```

## Why do I need to install Twing?

gulp-twing declares Twing as a peer dependency. It permits using any version of Twing (starting with version 0.4.0) with gulp-twing and profits from the latest features without having to wait for gulp-twing to catch up.

## Usage

`var twing = require('gulp-twing');`

### twing(env, data, options)

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

The following examples all require importing gulp, gulp-twing, and Twing, and setting the Twing loader and env:

```javascript
// top of gulpfile.js
var gulp = require('gulp');
var twing = require('gulp-twing');
var Twing = require('twing');

var loader = new Twing.TwingLoaderFilesystem('.');
var env = new Twing.TwingEnvironment(loader);
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

#### Resolving paths

Because Twig does not support resolving relative paths, Twing also doesn't. There are three approaches you can take to handle files which refer to other files.

(Note that the following examples use an underscore prefix to distinguish partials. This makes it possible to avoid compiling partials, with `gulp.src(['src/**/*.twig','!src/**/_*.twig')`. The prefix is not strictly necessary.)

Given

```
(root)
└── src
    ├── _include-test.twig
    └── index.twig
```

1. use the basic gulpfile setup, and write out the full path:

    ```twig
    {# src/index.twig #}
    {% include 'src/_partial.twig' %}
    ```

1. or register and use a namespaced path. This is the solution officially supported by Twig. See [Twing loader documentation](https://ericmorand.github.io/twing/api.html#built-in-loaders) for details. Namespaced templates can be accessed via the special `@namespace_name/template_path` notation

    ```javascript
    // in gulpfile.js, after the basic gulp setup's `require`s

    const loader = new Twing.TwingLoaderFilesystem('.');
    loader.addPath('./src/', 'templates');// the second argument is the namespace's name
    const env = new Twing.TwingEnvironment(loader);

    gulp.task('twig', function() {
        return gulp.src(['./src/**/*.twig','!./src/**/_*.twig'])
            .pipe(twing(env))
            .pipe(gulp.dest('./dest'))
    });
    ```

    ```twig
    {# path/to/templates/index.twig #}
    {% include '@templates/_partial.twig' %}{# looks for './src/_partial.twig' #}
    ```

1. or add additional paths to the `TwingLoaderFilesystem`. See [Twing loader documentation](https://ericmorand.github.io/twing/api.html#built-in-loaders) for details.

    ```javascript
    // in gulpfile.js, after the basic gulp setup's `require`s

    const loader = new Twing.TwingLoaderFilesystem(['.', './src/']);
    const env = new Twing.TwingEnvironment(loader);

    gulp.task('twig', function() {
        return gulp.src(['./src/**/*.twig','!./src/**/_*.twig'])
            .pipe(twing(env))
            .pipe(gulp.dest('./dest'))
    });
    ```

    ```twig
    {# src/index.twig #}
    {% include '_partial.twig' %}{# looks for './_partial.twig' and then './src/_partial.twig'}
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
[daviddm-image]: https://david-dm.org/ericmorand/gulp-twing.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/ericmorand/gulp-twing
[coveralls-image]: https://coveralls.io/repos/github/ericmorand/gulp-twing/badge.svg
[coveralls-url]: https://coveralls.io/github/ericmorand/gulp-twing