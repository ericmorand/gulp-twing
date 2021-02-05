const {Transform} = require('stream');
const replaceExt = require('replace-ext');
const {relative} = require('path');

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
            template = relative(process.cwd(), file.path);
        }

        env.render(template, data).then((binary) => {
            file.contents = Buffer.from(binary);
            file.path = replaceExt(file.path, mergedOptions.outputExt);

            callback(null, file);
        }).catch((error) => {
            callback(error, file);
        });
    };

    return stream;
};

module.exports = gulpTwing;