'use strict';
module.exports = function(str) {
	if (typeof str !== 'string') {
		throw new TypeError('Expected a string');
	}

	var MAP = {
		belgian: 'BEST BEER EVAR!',
		ipa: 'WORST BEER EVAR!'
	}

	return MAP[str] || '';
};