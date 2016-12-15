'use strict';

var path = require('path');
var _ = require('lodash');

var color = require('onecolor');
var yazl = require('yazl');

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

var createZip = function(obj, name) {
	var zip = new yazl.ZipFile();

	var buffer = new Buffer(JSON.stringify(obj, null, 2));

	zip.addBuffer(buffer, 'Swatches.json');

	zip.end();

	return zip.outputStream;
};

module.exports = function(colors, name) {
	colors = filterValidColors(colors);

	var obj = createJSON(colors, path.basename(name, '.swatches'));

	return createZip(obj, name);
};