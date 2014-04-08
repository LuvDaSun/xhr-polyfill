/* jshint browser: true */

window.xhrPolyfill = window.xhrPolyfill || {};

window.xhrPolyfill.bindEvent(window, 'message', function (e) {
    var message;

    if (!(message = window.xhrPolyfill.receiveMessage(e, window.parent))) return;

    window.xhrPolyfill.xhrSend(message, function (state) {
        window.parent.postMessage(JSON.stringify(state), '*');
    });
});