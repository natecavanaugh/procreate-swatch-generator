#!/usr/bin/env node
'use strict';
var meow = require('meow');
var procreateSwatchGenerator = require('./');

var cli = meow({
	help: [
		'Usage',
		'  $ procreate-swatch-generator [input]',
		'',
		'Options',
		'  --foo Lorem ipsum. Default: false',
		'Examples',
		'  $ procreate-swatch-generator',
		'  BEER!',
		'',
		'  $ procreate-swatch-generator belgian',
		'  BEST BEER EVAR!',
		''
	]
});

console.log(procreateSwatchGenerator(cli.input[0] || 'BEER!'));