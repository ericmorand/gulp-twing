const tap = require('tap');
const path = require('path');
const Twing = require('twing');
const Vinyl = require('vinyl');

const gulpTwing = require('../src');

tap.test('plugin', function(test) {
    test.test('should support valid vinyl', function(test) {
        let actual = '';

        let loader = new Twing.TwingLoaderFilesystem('./test/fixtures');
        let twing = new Twing.TwingEnvironment(loader);

        let stream = gulpTwing(twing, {bar: 'BAR'});

        stream.on('data', function(data) {
            actual += data.contents.toString()
        });

        stream.on('end', function() {
            test.same(actual, 'foo BAR included');

            test.end();
        });

        stream.end(new Vinyl({
            cwd: __dirname,
            base: path.join(__dirname, 'fixtures'),
            path: path.join(__dirname, 'fixtures', 'index.html.twig'),
            contents: new Buffer('foo')
        }));
    });

    test.test('should support null vinyl', function(test) {
        let actual = '';

        let loader = new Twing.TwingLoaderFilesystem('./test/fixtures');
        let twing = new Twing.TwingEnvironment(loader);

        let stream = gulpTwing(twing);

        stream.on('data', function(data) {
            if (!data.isNull()) {
                actual += data.contents.toString()
            }
        });

        stream.on('end', function() {
            test.same(actual, '');

            test.end();
        });

        stream.end(new Vinyl());
    });

    test.test('should catch Twing errors', function(test) {
        let loader = new Twing.TwingLoaderFilesystem('./test/fixtures');
        let twing = new Twing.TwingEnvironment(loader);

        let stream = gulpTwing(twing);

        stream.on('error', function(err) {
            test.true(err instanceof Twing.TwingErrorSyntax);
            test.same(err.getMessage(), 'Unexpected "}"');

            test.end();
        });

        stream.on('end', function() {
            test.fail();

            test.end();
        });

        stream.end(new Vinyl({
            cwd: __dirname,
            base: path.join(__dirname, 'fixtures'),
            path: path.join(__dirname, 'fixtures', 'error.html.twig'),
            contents: new Buffer('foo')
        }));
    });

    test.test('should throw an error when passed anything but a valid Twing environment', function(test) {
        test.throws(function() {
            gulpTwing('foo');
        }, new Error('First parameter of gulp-twing must be an instance of TwingEnvironment, received string.'));

        test.end();
    });

    test.end();
});