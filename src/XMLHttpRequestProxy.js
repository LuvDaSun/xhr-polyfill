var reHost = /^(?:\w+\:)?(?:\/\/)?([^\/]*)/;
var channels = {};

function registerChannel(iframeUrl) {
	var match = reHost.exec(iframeUrl);
	if(!match) throw 'invalid iframeUrl';

	var channel = {
		host: match[1]
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

	channels[channel.host] = channel;
}//registerChannel

window.openChannel = function(host, cb){
	if(!(host in channels)) return cb('unknown host', null);

	var channel = channels[host];

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

	try {
		message = JSON.parse(e.data);
	}
	catch(err) {
		return;
	}
	
	if(!(message.host in channels)) return;

	var channel = channels[message.host];
	if(!(message.type in channel.messageHandlers)) return;

	channel.messageHandlers[message.type].apply(null, message.arguments);
}



var idSequence = 0;
function XMLHttpRequestProxy(){
	var id = (++idSequence).toString(36);
	var proxy = this;
	var host = null;

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

		var match = reHost.exec(url);
		if(!match) throw 'invalid url';

		host = match[1];

		options.method = method
		options.url = url
		options.username = username
		options.password = password	
	}
	
	this.send = function(data) {
		options.requestBody = data;
		
		window.openChannel(host, function(err, channel){
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
		var re = new RegExp('^' + name + '\\:\\s*(.*)$', 'gim');
		var match = re.exec(this.getAllresponseHeaders());
		if(!match) return '';
		else return match[1];
	}

}//XMLHttpRequestProxy

if(document.documentMode && document.documentMode < 10) {
	XMLHttpRequest = XMLHttpRequestProxy;
}

