/* jshint browser: true */

window.xhrPolyfill = window.xhrPolyfill || {};

window.xhrPolyfill.originalXMLHttpRequest = window.XMLHttpRequest;

window.xhrPolyfill.getOrigin = function (url) {
    var match;
    match = /^(?:\w+\:)?(?:\/\/)([^\/]*)/.exec(url);
    if (!match) throw 'invalid url';
    return match[0];
}; //getOrigin

window.xhrPolyfill.parseHeaders = function (headers) {
    var headerIndex, headerName, parsedHeaders;
    var match;

    if (!headers) return {};

    if (typeof headers === 'string') {
        headers = headers.split(/\r\n/);
    }


    if (Object.prototype.toString.apply(headers) === '[object Array]') {
        parsedHeaders = {};
        for (headerIndex = headers.length - 1; headerIndex >= 0; headerIndex--) {
            match = /^(.+?)\:\s*(.+)$/.exec(headers[headerIndex]);
            match && (parsedHeaders[match[1]] = match[2]);
        }

        headers = parsedHeaders;
        parsedHeaders = null;
    }

    if (typeof headers === 'object') {
        parsedHeaders = {};
        for (headerName in headers) {
            parsedHeaders[headerName.toLowerCase()] = headers[headerName];
        }
        headers = parsedHeaders;
        parsedHeaders = null;
    }

    return headers;
}; //parseHeaders

window.xhrPolyfill.bindEvent = function (target, eventName, handler) {
    var onEventName = 'on' + eventName;
    var previousHandler;
    if ('addEventListener' in target) return target.addEventListener(eventName, handler, false);
    if ('attachEvent' in target) return target.attachEvent(onEventName, handler);

    if (onEventName in target) {
        previousHandler = target[onEventName];
        target[onEventName] = previousHandler ? function () {
            previousHandler.apply(this, arguments);
            handler.apply(this, arguments);
        } : handler;

        return;
    }

    throw "could not bind to event '" + eventName + "'";
}; //bindEvent

window.xhrPolyfill.resolveUrl = function (url) {
    var a = document.createElement('a');
    a.href = url;
    return a.href;
}; //resolveUrl

window.xhrPolyfill.receiveMessage = function (e, source) {
    var message;

    if (e.source !== source) return null;

    message = e.data;

    if (typeof message === 'string') {
        if (message[0] !== '{') return null;

        message = JSON.parse(message);
    }

    if (typeof message !== 'object') return null;

    return message;
}; //receiveMessage


window.xhrPolyfill.xhrSend = function (options, statechange) {
    var headerName;
    var headers;

    var xhr = window.xhrPolyfill.originalXMLHttpRequest ? new window.xhrPolyfill.originalXMLHttpRequest() : (function () {
        try {
            return new window.ActiveXObject("Msxml2.XMLHTTP.6.0");
        } catch (e1) {}
        try {
            return new window.ActiveXObject("Msxml2.XMLHTTP.3.0");
        } catch (e2) {}
        try {
            return new window.ActiveXObject("Msxml2.XMLHTTP");
        } catch (e3) {}
        throw new Error("This browser does not support XMLHttpRequest.");
    })();

    xhr.onreadystatechange = function () {
        var state = {};
        state.id = options.id;
        state.readyState = this.readyState;
        switch (this.readyState) {

        case 1:
        case 2:
        case 3:
            break;

        case 4:
            state.responseBody = this.responseText;
            state.responseHeaders = this.getAllResponseHeaders();
            state.statusCode = this.status;
            state.statusText = this.statusText;
            break;

        default:
            throw new Error('invalid state');
        }
        statechange(state);
    };

    xhr.open(options.method, options.url, true, options.username, options.password);

    if (options.requestHeaders) {
        headers = window.xhrPolyfill.parseHeaders(options.requestHeaders);
        for (headerName in headers) {
            xhr.setRequestHeader(headerName, headers[headerName]);
        }
    }

    xhr.send(options.requestBody);
}; //xhr