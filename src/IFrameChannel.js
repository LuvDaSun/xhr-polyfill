var channels = {};

bindEvent(window, 'message', function(e){
	var message, channel;
	
	if(!(e.origin in channels)) return;
	channel = channels[e.origin];

	if(!(message = receiveMessage(e, channel.iframe.contentWindow))) return;

	channel.onreceive(message);
});

IFrameChannel.get = function(url) {
	var origin;
	url = resolveUrl(url);
	origin = getOrigin(url);
	if(!(origin in channels)) channels[origin] = new IFrameChannel(url);

	channels[channel.origin] = channel;
}//get

function IFrameChannel(url) {
	var channel = this;

	url = resolveUrl(url);
	channel.origin = getOrigin(url);
	
	channel.send = function(message){
		var messageQueue = [message];

		channel.send = function(message){
			messageQueue.push(message);
		}//send

		var iframe = document.createElement('iframe');
		bindEvent(channel.iframe, 'load', function(e) {
			var message;

			channel.send = function(message){
				channel.iframe.contentWindow.postMessage(JSON.stringify(message), channel.origin);
			}//send

			while(message = messageQueue.shift()) {
				channel.send(message)
			}
			messageQueue = null;
		})
		
		channel.iframe.src = channel.iframeUrl;
		channel.iframe.style.display = 'none';
		document.scripts[0].parentNode.insertBefore(channel.iframe, document.scripts[0]);	

	}//send
	
	this.onreceive = function(message) {
		throw 'not implemented';
	}//onreceive

}//IFrameChannel


