var express = require('express');
var karma = require('karma');
var serverPort = 9877;

process.chdir(__dirname);

express()
.use(express.logger('dev'))
.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
})
.options('*', function (req, res, next) {
	res.send(204);
})
.use(express.static('src'))
.use(express.static('test'))
.listen(serverPort)
;
console.log('server listening on port ' + serverPort);

karma.server.start({
	configFile: 'karma.conf.js'
	, singleRun: true
});
