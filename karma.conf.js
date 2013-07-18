files = [
	MOCHA, MOCHA_ADAPTER
	, 'mocha_setup.js'
	, 'components/expect/expect.js'
	, 'components/jquery/jquery.js'
	, 'src/shared.js', 'src/IFrameChannel.js', 'src/XMLHttpRequestProxy.js'
	, 'test/**.js'
	,  {pattern: 'src/**/*', watched: true, included: false, served: false}
];

preprocessors = {
  'src/**/*.js': 'coverage'
};

reporters = ['progress', 'coverage'];

proxies = {
  '/local/': 'http://localhost:8080/'
};

// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = ['PhantomJS'];

autoWatch = true;