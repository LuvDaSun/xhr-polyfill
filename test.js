var karma = require('karma');
var child_process = require('child_process');

process.chdir(__dirname);

child_process.execFile('server.js');

karma.server.start({
	configFile: 'karma.conf.js'
	, singleRun: true
});
