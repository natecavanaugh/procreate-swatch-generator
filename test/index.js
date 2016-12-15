'use strict';
var procreateSwatchGenerator = require('../');

var fs = require('fs');
var sinon = require('sinon');
var chai = require('chai');
var path = require('path');

var mockFS = require('mock-fs');

var MemoryStream = require('memorystream');

chai.use(require('chai-string'));

var assert = chai.assert;

describe(
	'swatch generator',
	function() {
		var sandbox;
		var mock;

		beforeEach(
			function() {
				sandbox = sinon.sandbox.create();
			}
		);

		afterEach(
			function() {
				sandbox.restore();
			}
		);

		it(
			'should only accept an array of colors',
			function() {
				assert.throws(
					function() {
						return procreateSwatchGenerator('red');
					},
					'Expected an array of colors with at least 1 valid color'
				);
			}
		);
	}
);