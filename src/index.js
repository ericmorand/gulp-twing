const Transform = require('stream').Transform;
const Twing = require('twing');
const replaceExt = require('replace-ext');
const path = require('path');

let gulpTwing = function(data = {}, options = {}) {

    const defaults = {
        outputExt: '.html',
        templatePaths: '.'
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

        var env = new Twing.TwingEnvironment(
            new Twing.TwingLoaderFilesystem(options.templatePaths)
        )

        try {
            let binary = env.render(template, data);

            file.contents = Buffer.from(binary);
            file.path = replaceExt(file.path, options.outputExt);

            callback(null, file);
        }
        catch(err) {
            callback(err, file);
        }
    };

    return stream;
};

module.exports = gulpTwing;