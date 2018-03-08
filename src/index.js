const Transform = require('stream').Transform;
const Twing = require('twing');

let gulpTwing = function(env, data = {}) {
    if (!(env instanceof Twing.TwingEnvironment)) {
        throw new Error(`First parameter of gulp-twing must be an instance of TwingEnvironment, received ${typeof env}.`);
    }

    let stream = new Transform({objectMode: true});

    stream._transform = function(file, encoding, callback) {
        let template;

        if (file.isNull()) {
            callback(null, file);

            return;
        }
        else {
            template = file.path;
        }

        env.render(template, data).then(
            function(binary) {
                file.contents = Buffer.from(binary);

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