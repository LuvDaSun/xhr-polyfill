var reOrigin = /^(?:\w+\:)?(?:\/\/)([^\/]*)/;
var channels = {};

function resolveUrl(url) {
	var a = document.createElement('a');
	a.href = url;
	return a.href;
}

function registerChannel(iframeUrl) {
	iframeUrl = resolveUrl(iframeUrl);
	var match = reOrigin.exec(iframeUrl);
	if(!match) throw 'invalid iframeUrl';

	var channel = {
		origin: match[0]
		, iframeUrl: iframeUrl
		, proxies: {}
	}

	channel.messageHandlers = {
		"xhr-ready": function(){
			var cb;

			channel.ready = true;
			while(cb = channel.callbackQueue.shift()) {
				cb(null, channel);
			}
		}
		, "xhr-statechange": function(state){
			if(!(state.id in channel.proxies)) return;

			var proxy = channel.proxies[state.id];

			if(state.readyState === 4) delete channel.proxies[state.id];

			proxy.readyState = state.readyState;
			proxy.status = state.statusCode;
			proxy.statusText = state.statusText;
			proxy.responseText = state.responseBody;
			proxy.getAllResponseHeaders = function() {
				return state.responseHead;
			}
			proxy.onreadystatechange.apply(proxy);
		}
	}
	channels[channel.origin] = channel;
}//registerChannel

window.openChannel = function(origin, cb){
	if(!(origin in channels)) return cb('unknown origin', null);

	var channel = channels[origin];

	if(channel.ready) return cb(null, channel);

	if('callbackQueue' in channel) return channel.callbackQueue.push(cb);

	channel.callbackQueue = [cb];

	channel.iframe = document.createElement('iframe');
	channel.iframe.src = channel.iframeUrl;
	channel.iframe.style.display = 'none';
	document.scripts[0].parentNode.insertBefore(channel.iframe, document.scripts[0]);	

}//openChannel

if(window.attachEvent) window.attachEvent("onmessage", window_onmessage);
else window.addEventListener("message", window_onmessage, false);

function window_onmessage(e){
	var message;

	if(!(e.origin in channels)) return;

	var channel = channels[e.origin];

	try {
		message = JSON.parse(e.data);
	}
	catch(err) {
		return;
	}
	
	if(!(message.type in channel.messageHandlers)) return;

	channel.messageHandlers[message.type].apply(null, message.arguments);
}



var idSequence = 0;
function XMLHttpRequestProxy(){
	var id = (++idSequence).toString(36);
	var proxy = this;
	var origin = null;
	var responseHeaders = null;

	var options = {
		id: id
		, requestHeaders: {}
	}

	this.onreadystatechange = null
	this.readyState = 0;
	this.responseText = null;
	//this.responseXML = null;
	this.status = null;
	this.statusText = null;


	this.open = function(method, url, async, username, password){
		if(async === false) throw 'only asynchronous behavior is supported';

		url = resolveUrl(url);
		var match = reOrigin.exec(url);
		if(!match) throw 'invalid url';

		origin = match[0];

		options.method = method
		options.url = url
		options.username = username
		options.password = password	
	}
	
	this.send = function(data) {
		options.requestBody = data;
		
		window.openChannel(origin, function(err, channel){
			if(err) throw err;
			
			channel.proxies[id] = proxy;
			channel.iframe.contentWindow.postMessage(JSON.stringify({
				type: 'xhr-call'
				, arguments: [options]
			}), '*');
		})
	}
	this.abort = function() {
		getXhr(function(err, xhr){
			xhr.abort();
		});
	}


	this.setRequestHeader = function(name, value) {
		options.requestHeaders[name] = value;
	}
	this.getAllResponseHeaders = function() {
		return '';
	}
	this.getResponseHeader = function(name) {
		var parts, partCount, partIndex, part;
		var match;

		if(!responseHeaders) {
			parts = this.getAllResponseHeaders().split(/\r\n/);
			partCount = parts.length;

			responseHeaders = {};

			for(partIndex = 0; partIndex < partCount; partIndex++) {
				part = parts[partIndex];
				match = /^(.+?)\:\s*(.+)$/.exec(part);
				if(!match) continue;

				responseHeaders[match[1].toLowerCase()] = match[2];
			}
		}

		return responseHeaders[name.toLowerCase()];
	}

}//XMLHttpRequestProxy

if(document.documentMode && document.documentMode < 10) {
	XMLHttpRequest = XMLHttpRequestProxy;
}

