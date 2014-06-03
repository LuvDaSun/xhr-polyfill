/* jshint node:true */

var jsdom = require('jsdom');
var fs = require('fs');
var UglifyJS = require("uglify-js");

try {
    fs.mkdirSync(__dirname + '/dist');
} catch (err) {
    if (err.code !== 'EEXIST') {
        throw err;
    }
}
jsdom.env(fs.readFileSync(__dirname + '/src/xhr-channel.html', 'utf8'), [], function (err, window) {
    var scriptList = window.document.getElementsByTagName('script');
    var scriptIndex = 0;
    var scriptCount = scriptList.length;
    var scriptItem = null;

    while (scriptIndex < scriptCount) {
        scriptItem = scriptList[scriptIndex];
        scriptItem.innerHTML = UglifyJS.minify(__dirname + '/src/' + scriptItem.getAttribute('src')).code;
        scriptItem.removeAttribute('src');
        scriptIndex++;
    }

    fs.writeFileSync(__dirname + '/dist/xhr-channel.html', window.document.innerHTML, 'utf8');
});

fs.writeFileSync(__dirname + '/dist/xhr-polyfill.js', UglifyJS.minify([
    __dirname + '/src/shared.js',
    __dirname + '/src/IFrameChannel.js',
    __dirname + '/src/XMLHttpRequestProxy.js'
]).code, 'utf8');