var reOrigin = /^(?:\w+\:)?(?:\/\/)([^\/]*)/;
var channels = {};

bindEvent(window, 'message', function(e){
	var message, channel;
	
	if(!(e.origin in channels)) return;
	channel = channels[e.origin];

	if(!(message = receiveMessage(e, channel.iframe.contentWindow))) return;

	channel.statechange(message);
});



function registerChannel(iframeUrl) {
	iframeUrl = resolveUrl(iframeUrl);
	var match = reOrigin.exec(iframeUrl);
	if(!match) throw 'invalid iframeUrl';

	var channel = {
		origin: match[0]
		, iframeUrl: iframeUrl
		, proxies: {}
	}

	channel.statechange = function(state){
		var proxy;
		var responseHeaders;

		if(!(state.id in channel.proxies)) return;

		proxy = channel.proxies[state.id];
		responseHeaders = parseHeaders(state.responseHeaders)

		if(state.readyState === 4) delete channel.proxies[state.id];

		proxy.readyState = state.readyState;
		proxy.status = state.statusCode;
		proxy.statusText = state.statusText;
		proxy.responseText = state.responseBody;

		proxy.getAllResponseHeaders = function() {
			return state.responseHeaders;
		}
		proxy.getResponseHeader = function(name) {
			name = name.toLowerCase();
			if(!(name in responseHeaders)) return undefined
			return responseHeaders[name];
		}
		proxy.onreadystatechange.apply(proxy);
	}

	channels[channel.origin] = channel;
}//registerChannel

function openChannel(origin, cb){
	if(!(origin in channels)) registerChannel(origin + '/xhr-channel.html');	

	var channel = channels[origin];

	if(channel.ready) return cb(null, channel);

	if('callbackQueue' in channel) return channel.callbackQueue.push(cb);

	channel.callbackQueue = [cb];

	channel.iframe = document.createElement('iframe');

	bindEvent(channel.iframe, 'load', function(e) {
		var cb;

		channel.ready = true;
		while(cb = channel.callbackQueue.shift()) {
			cb(null, channel);
		}
	})
	
	channel.iframe.src = channel.iframeUrl;
	channel.iframe.style.display = 'none';
	document.scripts[0].parentNode.insertBefore(channel.iframe, document.scripts[0]);	

}//openChannel

