/* jshint browser: true */

window.xhrPolyfill = window.xhrPolyfill || {};

window.xhrPolyfill.channels = {};
window.xhrPolyfill.proxies = {};
window.xhrPolyfill.idSequence = 0;
window.xhrPolyfill.xhrChannelPath = '/xhr-channel.html';

window.xhrPolyfill.ensureChannel = function (url) {
    var origin;
    url = window.xhrPolyfill.resolveUrl(url);
    origin = window.xhrPolyfill.getOrigin(url);
    if (!(origin in window.xhrPolyfill.channels)) window.xhrPolyfill.channels[origin] = window.xhrPolyfill.createChannel(url);

    return window.xhrPolyfill.channels[origin];
}; //ensureChannel

window.xhrPolyfill.createChannel = function (url) {
    var channel = new window.xhrPolyfill.IFrameChannel(url);

    window.xhrPolyfill.bindEvent(channel, 'receive', function (state) {
        var proxy;

        if (!(state.id in window.xhrPolyfill.proxies)) return false;

        proxy = window.xhrPolyfill.proxies[state.id];

        if (state.readyState === 4) delete window.xhrPolyfill.proxies[state.id];

        window.xhrPolyfill.xhrReceive(proxy, state);
    });
    return channel;
}; //createChannel

window.xhrPolyfill.xhrReceive = function (proxy, state) {
    var responseHeaders;

    responseHeaders = window.xhrPolyfill.parseHeaders(state.responseHeaders);

    proxy.readyState = state.readyState;
    proxy.status = state.statusCode;
    proxy.statusText = state.statusText;
    proxy.responseText = state.responseBody;

    proxy.getAllResponseHeaders = function () {
        return state.responseHeaders;
    };
    proxy.getResponseHeader = function (name) {
        name = name.toLowerCase();
        if (!(name in responseHeaders)) return undefined;
        return responseHeaders[name];
    };
    proxy.onreadystatechange && proxy.onreadystatechange(proxy);
}; //xhrReceive

window.xhrPolyfill.XMLHttpRequestProxy = function () {
    var id = (++window.xhrPolyfill.idSequence).toString(36);
    var proxy = this;
    var origin = null;
    var localOrigin = window.xhrPolyfill.getOrigin(location.href);
    var channel = null;

    var options = {
        id: id,
        requestHeaders: {}
    };

    this.onreadystatechange = null;
    this.readyState = 0;
    this.responseText = null;
    //this.responseXML = null;
    this.status = null;
    this.statusText = null;


    this.open = function (method, url, async, username, password) {
        if (async === false) throw 'only asynchronous behavior is supported';

        url = window.xhrPolyfill.resolveUrl(url);
        origin = window.xhrPolyfill.getOrigin(url);

        options.method = method;
        options.url = url;
        options.username = username;
        options.password = password;
    };

    this.send = function (data) {

        options.requestBody = data;

        if (localOrigin == origin) {
            window.xhrPolyfill.xhrSend(options, function (state) {
                window.xhrPolyfill.xhrReceive(proxy, state);
            });
        } else {
            window.xhrPolyfill.proxies[id] = this;

            channel = window.xhrPolyfill.ensureChannel(origin + window.xhrPolyfill.xhrChannelPath);

            channel.send(options);
        }
    };
    this.abort = function () {};

    this.setRequestHeader = function (name, value) {
        name = name.toLowerCase();
        options.requestHeaders[name] = value;
    };
    this.getAllResponseHeaders = function () {
        return;
    };
    this.getResponseHeader = function (name) {
        return;
    };

}; //XMLHttpRequestProxy

/*
use the proxy in ie < 10
*/
if (document.documentMode && document.documentMode < 10) {
    window.XMLHttpRequest = window.xhrPolyfill.XMLHttpRequestProxy;
}