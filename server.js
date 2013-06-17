var express = require('express');
var app = express();

var port = parseInt(process.argv[process.argv.length - 1]);
if(isNaN(port)) {
	console.log('invalid port');
	process.exit(-1);
}

process.chdir(__dirname);



app
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
.use(express.static('lab'))
;


app.listen(port);
console.log('server listening on port ' + port);


