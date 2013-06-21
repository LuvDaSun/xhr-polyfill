basePath = '';

files = [
	MOCHA, MOCHA_ADAPTER
	, 'components/expect/expect.js'
	, 'components/jquery/jquery.js'
	, 'src/XMLHttpRequestChannel.js', 'src/XMLHttpRequestProxy.js'
	, 'test/**.js'
];

// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = ['PhantomJS'];
