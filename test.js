var karma = require('karma');
var child_process = require('child_process');

process.chdir(__dirname);

child_process.spawn('node', ['server'], {});

karma.server.start({
	configFile: 'karma.conf.js'
	, singleRun: true
});
