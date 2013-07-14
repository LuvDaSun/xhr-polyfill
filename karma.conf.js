basePath = '';

files = [
	MOCHA, MOCHA_ADAPTER
	, 'mocha_setup.js'
	, 'components/expect/expect.js'
	, 'components/jquery/jquery.js'
	, 'src/shared.js', 'src/IFrameChannel.js', 'src/XMLHttpRequestProxy.js'
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
