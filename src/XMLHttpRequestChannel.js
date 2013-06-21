var messageHandlers = {
	"xhr-call": function(request) {
		xhr(request, function(state) {

			window.parent.postMessage(JSON.stringify({
				type: 'xhr-statechange'
				, host: location.host
				, arguments: [state]
			}), '*');

		});
	}
}

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
	
	if(!(message.type in messageHandlers)) return;

	messageHandlers[message.type].apply(null, message.arguments);
}

if(window.attachEvent) window.attachEvent("onload", window_load);
else window.addEventListener("load", window_load, false);

function window_load(e){

	window.parent.postMessage(JSON.stringify({
		type: 'xhr-ready'
		, arguments: []
	}), '*');

}



function xhr(options, statechange){

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
			break;

			case 2:
			case 3:
			case 4:
			state.responseBody = this.responseText;
			state.responseHead = this.getAllResponseHeaders();
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
		for(var headerName in options.requestHeaders) {
			xhr.setRequestHeader(headerName, options.requestHeaders[headerName]);
		}
	}
	xhr.send(options.requestBody);
}
