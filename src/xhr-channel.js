bindEvent(window, 'message', function(e){
	var message;

	if(!(message = receiveMessage(e, window.parent))) return;

	xhr(message, function(state) {
		window.parent.postMessage(JSON.stringify(state), '*');
	});
});

function xhr(options, statechange){
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
		statechange(state)
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

