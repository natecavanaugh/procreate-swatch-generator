var path = require('path');
var _ = require('lodash');
var filenamify = _.partialRight(require('filenamify'), {replacement: '_'});
var superb = require('superb');
var procreateSwatchGenerator = require('./');
// var filenamify = _.partialRight(require('filenamify'), {replacement: '_'});
var Promise = require('bluebird');
var isDir = Promise.promisify(require('is-dir'));

var fs = Promise.promisifyAll(require('fs'));

var randomFilename = function() {
	return filenamify(_.startCase('My ' + superb() + ' Swatch'));
};

var validateDirectory = function(directory) {
	var originalVal = _.constant(directory);

	return Promise.resolve(directory)
		.then(isDir)
		.then(originalVal)
		.catch(
			function(err) {
				originalVal = process.cwd;

				return originalVal();
			}
		)
		.then(
			function(directory) {
				return fs.accessAsync(directory, fs.constants.W_OK);
			}
		)
		.then(
			function() {
				return originalVal();
			}
		);
};

var validateFilename = function(filename, directory) {
	var filePath = path.join(directory, filenamify(filename + '.swatches'));

	return fs.accessAsync(filePath)
			.then(
				function() {
					// There was no error, which means the file exists
					// so we'll need to keep trying
					return validateFilename(randomFilename(), directory);
				}
			)
			// if there is an error, it means the name doesn't exist
			// so let's use that
			.catch(_.constant(filePath));
};

module.exports = function(input, options) {
	if (_.isString(options)) {
		options = {
			filename: options
		};
	}

	options = options || {};

	var filename = options.filename;
	var outputDirectory = options.outputDirectory;

	if (filename && !outputDirectory) {
		outputDirectory = path.dirname(filename);
		filename = path.basename(filename, '.swatches');
	}

	if (!filename) {
		filename = randomFilename();
	}

	return validateDirectory(outputDirectory)
		.then(_.partial(validateFilename, filename))
		.then(
			function(filePath) {
				var name = path.basename(filePath, '.swatches');

				return {
					stream: procreateSwatchGenerator(input, name),
					filePath: filePath
				};
			}
		);
};