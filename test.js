var karma = require('karma');
var child_process = require('child_process');

process.chdir(__dirname);

var cp_server = child_process.fork('./server', [], { silent: false });
cp_server.on('message', messageListener);

var finalExitCode = 0;

function messageListener(message){
	switch(message) {
		case 'server started':
		karma.server.start(
			{
				configFile: 'karma.conf.js'
				, singleRun: true
				, autoWatch: false
			}
			, function(exitCode) {
				finalExitCode = exitCode;
				cp_server.kill('SIGINT');
			}
		);
		break;

		case 'server stopped':
		process.exit(finalExitCode);
		break;
	}


}

