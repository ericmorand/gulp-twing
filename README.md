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

### gulpTwing(env, data)

Return an object transform stream that expects entry filenames.

* env

  A Twing environment. See [Twing documentation](https://ericmorand.github.io/twing/api.html) for details.

* data
 
  A hash of data passed to the render function of the template. See [Twing documentation](https://ericmorand.github.io/twing/api.html#rendering-templates) for details.

### Example

```javascript
let gulpTwing = require('gulp-twing');

let Twing = require('twing');
let loader = new Twing.TwingLoaderFilesystem('src');
let env = new Twing.TwingEnvironment(loader, {
    debug: true
});

gulp
    .src('src')
    .pipe(gulpTwing(env, {foo: 'bar'}))
    .dest('dest')
;
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