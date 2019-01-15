const tap = require('tap');
const path = require('path');
const {TwingEnvironment, TwingLoaderRelativeFilesystem, TwingErrorSyntax} = require('twing');
const Vinyl = require('vinyl');

const gulpTwing = require('../src');

tap.test('plugin', function (test) {
    test.test('should support valid vinyl', function (test) {
        let actual = '';
        let env = new TwingEnvironment(new TwingLoaderRelativeFilesystem());

        let stream = gulpTwing(env, {bar: 'BAR'});

        stream.on('data', function (data) {
            actual += data.contents.toString()
        });

        stream.on('end', function () {
            test.same(actual, 'foo BAR included');

            test.end();
        });

        stream.on('error', function (e) {
            test.fail(e);
        });

        stream.end(new Vinyl({
            cwd: __dirname,
            base: path.join(__dirname, 'fixtures'),
            path: path.join(__dirname, 'fixtures', 'index.html.twig'),
            contents: Buffer.from('foo')
        }));
    });

    test.test('should support null vinyl', function (test) {
        let actual = '';

        let env = new TwingEnvironment(new TwingLoaderRelativeFilesystem());
        let stream = gulpTwing(env);

        stream.on('data', function (data) {
            if (!data.isNull()) {
                actual += data.contents.toString()
            }
        });

        stream.on('error', function (e) {
            test.fail(e);

            test.end();
        });

        stream.on('end', function () {
            test.same(actual, '');

            test.end();
        });

        stream.end(new Vinyl());
    });

    test.test('should catch Twing errors', function (test) {
        let env = new TwingEnvironment(new TwingLoaderRelativeFilesystem());
        let stream = gulpTwing(env);

        stream.on('error', function (err) {
            test.true(err instanceof TwingErrorSyntax);
            test.same(err.getMessage(), 'Unexpected "}".');

            test.end();
        });

        stream.on('end', function () {
            test.fail();

            test.end();
        });

        stream.end(new Vinyl({
            cwd: __dirname,
            base: path.join(__dirname, 'fixtures'),
            path: path.join(__dirname, 'fixtures', 'error.html.twig'),
            contents: Buffer.from('foo')
        }));
    });

    test.test('outputExt option should defaults to ".html"', function (test) {
        let actual = '';

        let env = new TwingEnvironment(new TwingLoaderRelativeFilesystem());
        let stream = gulpTwing(env, {bar: 'BAR'});

        stream.on('data', function (data) {
            actual = data.path;
        });

        stream.on('error', function (e) {
            console.warn(e)

            test.fail(e);

            test.end();
        });

        stream.on('end', function () {
            test.same(actual, path.join(__dirname, 'fixtures', 'index.html.html'));

            test.end();
        });

        stream.end(new Vinyl({
            cwd: __dirname,
            base: path.join(__dirname, 'fixtures'),
            path: path.join(__dirname, 'fixtures', 'index.html.twig'),
            contents: Buffer.from('foo')
        }));
    });

    test.test('should rename the output based on the value of outputExt option', function (test) {
        let actual = '';

        let env = new TwingEnvironment(new TwingLoaderRelativeFilesystem());
        let stream = gulpTwing(env, {bar: 'BAR'}, {outputExt: '.foo'});

        stream.on('data', function (data) {
            actual = data.path;
        });

        stream.on('error', function (e) {
            test.fail(e);

            test.end();
        });

        stream.on('end', function () {
            test.same(actual, path.join(__dirname, 'fixtures', 'index.html.foo'));

            test.end();
        });

        stream.end(new Vinyl({
            cwd: __dirname,
            base: path.join(__dirname, 'fixtures'),
            path: path.join(__dirname, 'fixtures', 'index.html.twig'),
            contents: Buffer.from('foo')
        }));
    });

    test.end();
});