/* jshint node: true */

var express = require('express');
var port = 8080;

process.chdir(__dirname);

var server = express()
    .use(function (req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
        next();
    })
    .use(function (req, res, next) {
        if (req.method === 'OPTIONS') res.send(204);
        else next();
    })
    .use(express.static('src'))
    .use(express.static('test'));


console.log('starting server on port ' + port);
server.listen(port);