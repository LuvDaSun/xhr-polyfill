var connect = require('connect');
var karma = require('karma');
var serverPort = 8080;

process.chdir(__dirname);

connect()
.use(connect.logger('dev'))
.use(function (req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
	next();
})
.use(function (req, res, next) {
	if(req.method === 'OPTIONS') res.send(204);
	else next();
})
.use(connect.static('src'))
.use(connect.static('test'))
.listen(serverPort)
;
console.log('server listening on port ' + serverPort);
