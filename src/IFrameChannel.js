/* jshint browser: true */

window.xhrPolyfill = window.xhrPolyfill || {};

window.xhrPolyfill.bindEvent(window, 'message', function (e) {
    var message, channel;

    if (!(e.origin in window.xhrPolyfill.channels)) return;
    channel = window.xhrPolyfill.channels[e.origin];

    if (!(message = window.xhrPolyfill.receiveMessage(e, channel.iframe.contentWindow))) return;

    channel.onreceive && channel.onreceive(message);
});

window.xhrPolyfill.IFrameChannel = function (url) {
    var channel = this;

    url = window.xhrPolyfill.resolveUrl(url);
    channel.origin = window.xhrPolyfill.getOrigin(url);

    channel.send = function (message) {
        var messageQueue = [message];

        channel.send = function (message) {
            messageQueue.push(message);
        }; //send

        channel.iframe = document.createElement('iframe');
        window.xhrPolyfill.bindEvent(channel.iframe, 'load', function (e) {
            var message;

            channel.send = function (message) {
                channel.iframe.contentWindow.postMessage(JSON.stringify(message), channel.origin);
            }; //send

            while ( !! (message = messageQueue.shift())) {
                channel.send(message);
            }
            messageQueue = null;
        });

        channel.iframe.src = url;
        channel.iframe.style.display = 'none';
        document.scripts[0].parentNode.insertBefore(channel.iframe, document.scripts[0]);

    }; //send

    this.onreceive = null;

}; //IFrameChannel