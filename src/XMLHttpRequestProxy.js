var idSequence = 0;
function XMLHttpRequestProxy(){
	var id = (++idSequence).toString(36);
	var proxy = this;
	var origin = null;

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
			channel.iframe.contentWindow.postMessage(JSON.stringify(options), channel.origin);
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
		return;
	}
	this.getResponseHeader = function(name) {
		return;
	}

}//XMLHttpRequestProxy

if(document.documentMode && document.documentMode < 10) {
	XMLHttpRequest = XMLHttpRequestProxy;
}

