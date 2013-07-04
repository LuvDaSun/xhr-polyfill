var channels = {};
var proxies = {};
var idSequence = 0;

function ensureChannel(url) {
	var origin;
	url = resolveUrl(url);
	origin = getOrigin(url);
	if(!(origin in channels)) channels[origin] = createChannel(url);

	return channels[origin];
}//ensureChannel

function createChannel(url){
	var channel = new IFrameChannel(url);

	bindEvent(channel, 'receive', function(e){
		var proxy;
		var responseHeaders;

		if(!(e.id in proxies)) return false;

		proxy = proxies[e.id]
		responseHeaders = parseHeaders(e.responseHeaders)

		if(e.readyState === 4) delete proxies[e.id];

		proxy.readyState = e.readyState;
		proxy.status = e.statusCode;
		proxy.statusText = e.statusText;
		proxy.responseText = e.responseBody;

		proxy.getAllResponseHeaders = function() {
			return e.responseHeaders;
		}
		proxy.getResponseHeader = function(name) {
			name = name.toLowerCase();
			if(!(name in responseHeaders)) return undefined
			return responseHeaders[name];
		}
		proxy.onreadystatechange && proxy.onreadystatechange.apply(proxy);

	})
	return channel;
}//createChannel

function XMLHttpRequestProxy(){
	var id = (++idSequence).toString(36);
	var proxy = this;
	var origin = null;
	var channel = null;

	var options = {
		id: id
		, requestHeaders: {}
	}

	proxies[id] = this;

	this.onreadystatechange = null
	this.readyState = 0;
	this.responseText = null;
	//this.responseXML = null;
	this.status = null;
	this.statusText = null;


	this.open = function(method, url, async, username, password){
		if(async === false) throw 'only asynchronous behavior is supported';

		url = resolveUrl(url);
		origin = getOrigin(url);

		options.method = method
		options.url = url
		options.username = username
		options.password = password	
	}
	
	this.send = function(data) {

		channel = ensureChannel(origin + '/xhr-channel.html');

		options.requestBody = data;
		
		channel.send(options);
	}
	this.abort = function() {
		delete proxies[id];
	}

	this.setRequestHeader = function(name, value) {
		name = name.toLowerCase();
		options.requestHeaders[name] = value;
	}
	this.getAllResponseHeaders = function() {
		return;
	}
	this.getResponseHeader = function(name) {
		return;
	}

}//XMLHttpRequestProxy

if(document.documentMode && document.documentMode < 10) {
	XMLHttpRequest = XMLHttpRequestProxy;
}

