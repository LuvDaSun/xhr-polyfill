bindEvent(window, 'message', function(e){
	var message;

	if(!(message = receiveMessage(e, window.parent))) return;

	xhrSend(message, function(state) {
		window.parent.postMessage(JSON.stringify(state), '*');
	});
});

