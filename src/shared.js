function getOrigin(url) {
	var match;
	match = /^(?:\w+\:)?(?:\/\/)([^\/]*)/.exec(url);
	if(!match) throw 'invalid url';
	return match[0];
}//getOrigin

function parseHeaders(headers) {
	var headerIndex, headerName, parseHeaders;
	var match;

	if(!headers) return {};

	if(typeof headers === 'string') {
		headers = headers.split(/\r\n/);
	}


  	if(Object.prototype.toString.apply(headers) === '[object Array]') {
		parseHeaders = {};
		for(headerIndex = headers.length - 1; headerIndex >= 0; headerIndex--) {
			match = /^(.+?)\:\s*(.+)$/.exec(headers[headerIndex]);
			match && (parseHeaders[match[1]] = match[2]);
		}
		
		headers = parseHeaders;
		parseHeaders = null;
	}

	if(typeof headers === 'object') {
		parseHeaders = {};
		for(headerName in headers) {
			parseHeaders[headerName.toLowerCase()] = headers[headerName];
		}
		headers = parseHeaders;
		parseHeaders = null;
	}

	return headers;
}//parseHeaders

function bindEvent(target, eventName, handler) {
	var onEventName = 'on' + eventName;
	var previousHandler;
	if('addEventListener' in target) return target.addEventListener(eventName, handler, false);
	if('attachEvent' in target) return target.attachEvent(onEventName, handler);

	if(onEventName in target) {
		previousHandler = target[onEventName];
		target[onEventName] = previousHandler
		? function() {
			previousHandler.apply(this, arguments);
			handler.apply(this, arguments);
		}
		: handler
		;

		return;
	}

	throw "could not bind to event '" + eventName + "'";
}//bindEvent

function resolveUrl(url) {
	var a = document.createElement('a');
	a.href = url;
	return a.href;
}//resolveUrl

function receiveMessage(e, source) {
	var message;

	if(e.source !== source) return null;

	message = e.data;
	
	if(typeof message === 'string') {
		if(message[0] !== '{') return null;
		
		message = JSON.parse(message);
	}

	if(typeof message !== 'object') return null;
	
	return message;
}//receiveMessage

function xhrSend(options, statechange){
	var headerName;
	var headers;

	var xhr = new (window.XMLHttpRequest || function() {
		try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); } catch (e1) {}
		try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); } catch (e2) {}
		try { return new ActiveXObject("Msxml2.XMLHTTP"); } catch (e3) {}
		throw new Error("This browser does not support XMLHttpRequest.");
	})()

	xhr.onreadystatechange = function(){
		var state = {};
		state.id = options.id
		state.readyState = this.readyState;
		switch(this.readyState){

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
			throw 'invalid state'
		}
		statechange(state);
	}

	xhr.open(options.method, options.url, true, options.username, options.password);

	if(options.requestHeaders) {
		headers = parseHeaders(options.requestHeaders);
		for(headerName in headers) {
			xhr.setRequestHeader(headerName, headers[headerName]);
		}
	}

	xhr.send(options.requestBody);
}//xhr

