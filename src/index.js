const Transform = require('stream').Transform;
const Twing = require('twing');

let gulpTwing = function(options) {
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

        let twing = new Twing.TwingEnvironment(options.loader, options.options || {});

        twing.render(template, options.data).then(
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