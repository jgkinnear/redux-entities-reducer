// setup file
module.exports = {
	'collectCoverage': false,
	'collectCoverageFrom': [
		'src/**/*.{js,jsx}',
	],
	'testPathIgnorePatterns': [
		'<rootDir>/.git/',
		'<rootDir>/coverage/',
		'<rootDir>/dist/',
		'<rootDir>/node_modules/',
	],
	'testEnvironment': 'node',
	'testURL': 'http://localhost',
	'transformIgnorePatterns': [
		'[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'
	],
};