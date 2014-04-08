/* jshint node: true */

module.exports = function (config) {

    config.set({
        basePath: '.',
        frameworks: ['mocha'],
        files: [
            'mocha_setup.js',
            'bower_components/expect/expect.js',
            'bower_components/jquery/dist/jquery.js',
            'src/shared.js',
            'src/IFrameChannel.js',
            'src/XMLHttpRequestProxy.js',
            'test/**.js', {
                pattern: 'src/**/*',
                watched: true,
                included: false,
                served: false
            }
        ],


        reporters: ['dots', 'coverage'],
        preprocessors: {
            'src/**/*.js': 'coverage'
        },

        coverageReporter: {
            reporters: [{
                type: 'html',
                dir: 'coverage/'
            }, {
                type: 'text-summary'
            }]
        },

        autoWatch: false,
        singleRun: true,
        browsers: ['PhantomJS']
    });

};