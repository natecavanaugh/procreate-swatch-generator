'use strict';
var procreateSwatchGenerator = require('../cli');

var fs = require('fs');
var sinon = require('sinon');
var chai = require('chai');
var path = require('path');

var mockFS = require('mock-fs');

var MemoryStream = require('memorystream');

chai.use(require('chai-string'));

var assert = chai.assert;

var CWD = process.cwd();

var config = {};

config[CWD] = mockFS.directory(
	{
		mode: parseInt('0400', 8)
	}
);

config[path.join(CWD, 'test/fixtures')] = {
	'Test Swatch.swatches': 'Fooo'
};

describe(
	'CLI',
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
			'should not overwrite a file',
			function(done) {
				mockFS(config);

				sandbox.stub(fs, 'createWriteStream', MemoryStream.createWriteStream);

				var fixtureSwatchPath = './test/fixtures/Test Swatch';

				procreateSwatchGenerator(['red'], path.join(CWD, fixtureSwatchPath))
				.then(
					function(filePath) {
						assert.isString(filePath);
						assert.notEqual(filePath, path.join(process.cwd(), fixtureSwatchPath + '.swatches'));

						assert.isTrue(fs.createWriteStream.called);
						assert.equal(fs.createWriteStream.args[0][0], filePath);

						done();
					}
				)
				.catch(
					function() {
						done();
					}
				)
				.finally(mockFS.restore);
			}
		);

		it(
			'should write a swatches file',
			function(done) {
				sandbox.stub(fs, 'createWriteStream', MemoryStream.createWriteStream);

				procreateSwatchGenerator(['red'])
				.then(
					function(filePath) {
						assert.isString(filePath);

						assert.isTrue(fs.createWriteStream.called);
						assert.equal(fs.createWriteStream.args[0][0], filePath);

						done();
					}
				).catch(
					function() {
						done();
					}
				);
			}
		);

		it(
			'should fallback to writing to the current working directory',
			function(done) {
				sandbox.stub(fs, 'createWriteStream', MemoryStream.createWriteStream);

				procreateSwatchGenerator(
					['red'],
					{
						filename: 'Test',
						outputDirectory: './tests/'
					}
				)
				.then(
					function(filePath) {
						assert.isString(filePath);

						assert.equal(filePath, path.join(process.cwd(), 'Test.swatches'));

						done();
					}
				)
				.catch(
					function() {
						done();
					}
				);
			}
		);

		it(
			'should throw if we cant determine a writable directory',
			function(done) {
				mockFS(
					config,
					{
						createCwd: false
					}
				);

				procreateSwatchGenerator(
					['red'],
					{
						filename: 'Test',
						outputDirectory: path.join(CWD, 'tests')
					}
				)
				.catch(
					function(err) {
						assert.equal(err.code, 'EACCES');

						done();
					}
				).finally(mockFS.restore);
			}
		);
	}
);