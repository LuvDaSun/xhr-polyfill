var connect = require('connect');
var port = 8080;

process.chdir(__dirname);

var app = connect()
//.use(connect.logger('dev'))
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



notify('starting server on port ' + port);
var server = app.listen(port, function(){
	notify('server started');
});

process.on('SIGINT', function(){
	notify('stopping server on port ' + port);
	server.close(function(){
		notify('server stopped');
	});
});

function notify(message){
	console.log(message);
	process.send && process.send(message);
}
