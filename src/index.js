const Transform = require('stream').Transform;
const Twing = require('twing');
const replaceExt = require('replace-ext');
const path = require('path');

let gulpTwing = function(env, data = {}, options = {}) {
    if (!(env instanceof Twing.TwingEnvironment)) {
        throw new Error(`First parameter of gulp-twing must be an instance of TwingEnvironment, received ${typeof env}.`);
    }

    const defaults = {
        outputExt: '.html'
    };

    options = Object.assign({}, defaults, options);

    let stream = new Transform({objectMode: true});

    stream._transform = function(file, encoding, callback) {
        let template;

        if (file.isNull()) {
            callback(null, file);

            return;
        }
        else {
            template = path.relative(process.cwd(), file.path);
        }

        env.render(template, data).then(
            function(binary) {
                file.contents = Buffer.from(binary);
                file.path = replaceExt(file.path, options.outputExt);

                callback(null, file);
            },
            function(err) {
                callback(err, file);
            }
        );
    };

    return stream;
};

module.exports = gulpTwing;