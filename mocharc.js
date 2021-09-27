'use strict';

const path = require('path');

require('ts-node').register({
	project: path.join(__dirname, 'tsconfig.spec.json'),
	transpileOnly: true,
});

module.exports = {
	diff: true,
	extension: ['ts'],
	reporter: 'spec',
	slow: 75,
	spec: path.join(__dirname, 'src', '**', '*.ts'),
	'watch-files': ['src/**/*.ts'],
};

if (process.argv.includes('--report')) {
	module.exports.reporter = 'mochawesome';
}
