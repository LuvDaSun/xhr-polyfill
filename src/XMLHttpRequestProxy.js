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

	bindEvent(channel, 'receive', function(state) {
		var proxy;

		if(!(state.id in proxies)) return false;

		proxy = proxies[state.id]

		if(state.readyState === 4) delete proxies[state.id];

		xhrReceive(proxy, state);
	})
	return channel;
}//createChannel

function xhrReceive(proxy, state) {
	var responseHeaders;

	responseHeaders = parseHeaders(state.responseHeaders)

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
	proxy.onreadystatechange && proxy.onreadystatechange(proxy);
}//xhrReceive

function XMLHttpRequestProxy(){
	var id = (++idSequence).toString(36);
	var proxy = this;
	var origin = null;
	var localOrigin = getOrigin(location.href);;
	var channel = null;

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
		origin = getOrigin(url);

		options.method = method
		options.url = url
		options.username = username
		options.password = password	
	}
	
	this.send = function(data) {

		options.requestBody = data;

		if(localOrigin == origin) {
			xhrSend(options, function(state){
				xhrReceive(proxy, state);
			});
		}
		else {
			proxies[id] = this;

			channel = ensureChannel(origin + '/xhr-channel.html');
			
			channel.send(options);
		}
	}
	this.abort = function() {
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

