const {Transform} = require('stream');
const replaceExt = require('replace-ext');

/**
 * @param {TwingEnvironment} env
 * @param {*} data
 * @param {*} options
 * @returns {module:stream.internal.Transform}
 */
let gulpTwing = function (env, data = {}, options = {}) {
    const defaults = {
        outputExt: '.html',
        templatePaths: '.'
    };

    const mergedOptions = Object.assign({}, defaults, options);

    let stream = new Transform({objectMode: true});

    stream._transform = function (file, encoding, callback) {
        let template;

        if (file.isNull()) {
            callback(null, file);

            return;
        } else {
            template = file.path;
        }

        try {
            let binary = env.render(template, data);

            file.contents = Buffer.from(binary);
            file.path = replaceExt(file.path, mergedOptions.outputExt);

            callback(null, file);
        } catch (err) {
            callback(err, file);
        }
    };

    return stream;
};

module.exports = gulpTwing;