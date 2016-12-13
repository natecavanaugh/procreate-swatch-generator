#!/usr/bin/env node
'use strict';
var _ = require('lodash');
var meow = require('meow');
var procreateSwatchGenerator = require('./');

var cli = meow(
	{
		help: [
			'Usage',
			'  $ procreate-swatch-generator [...colors]',
			'',
			'Options',
			'  --foo Lorem ipsum. Default: false',
			'Examples',
			'  $ procreate-swatch-generator #000 "rgb(128, 128, 128)"',
			'  Successfully wrote ./My Awesome Swatch.swatches',
			'',
			'  $ procreate-swatch-generator #000 "rgb(128, 128, 128)" -f "/Users/me/Dropbox/Goth Drab"',
			'  Successfully wrote /Users/me/Dropbox/Goth Drab.swatches',
			'',
			'  $ procreate-swatch-generator #000 "rgb(128, 128, 128)" -f "Goth Drab" -o "/Users/me/Dropbox/"',
			'  Successfully wrote /Users/me/Dropbox/Goth Drab.swatches',
			''
		]
	},
	{
		alias: {
			f: 'filename',
			o: 'outputDirectory',
		}
	}
);

procreateSwatchGenerator(cli.input, cli.flags).then(
	function(filePath) {
		console.log('Wrote swatch file "%s"!', filePath);
	}
)
.catch(
	function(err) {
		console.error(err.message);
	}
);