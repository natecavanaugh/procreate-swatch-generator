'use strict';

var path = require('path');
var _ = require('lodash');
var superb = require('superb');
var filenamify = _.partialRight(require('filenamify'), {replacement: '_'});
var Promise = require('bluebird');
var isDir = Promise.promisify(require('is-dir'));
var color = require('onecolor');
var yazl = require('yazl');

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

var validateColors = function(colors) {
	if (!_.isArray(colors) || !colors.length) {
		throw new TypeError('Expected an array of colors with at least 1 valid color');
	}

	return colors;
};

var filterValidColors = function(colors) {
	colors = validateColors(colors);

	colors = colors.map(color).filter(_.isObject).slice(0, 30);

	return validateColors(colors);
};

var createJSON = function(colors, name) {
	var swatches = colors.map(
		function(item) {
			var hsv = item.hsv();

			return {
				hue: hsv.h(),
				brightness: hsv.v(),
				saturation: hsv.s()
			};
		}
	);

	return [
		{
			name: name,
			swatches: swatches
		}
	];
};

var createZip = function(filePath, obj) {
	var zip = new yazl.ZipFile();

	var buffer = new Buffer(JSON.stringify(obj, null, 2));

	zip.addBuffer(buffer, 'Swatches.json');

	zip.outputStream.pipe(fs.createWriteStream(filePath));

	zip.end();
};

module.exports = function(colors, options) {
	colors = filterValidColors(colors);

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
				var obj = createJSON(colors, path.basename(filePath, '.swatches'));

				filename = path.basename(filePath);

				createZip(filePath, obj);

				return filePath;
			}
		);
};