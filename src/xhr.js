function xhr(options, statechange){

	var xhr = new (window.XMLHttpRequest || function() {
		try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); } catch (e1) {}
		try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); } catch (e2) {}
		try { return new ActiveXObject("Msxml2.XMLHTTP"); } catch (e3) {}
		throw new Error("This browser does not support XMLHttpRequest.");
	})()

	xhr.open(options.method, options.url, true, options.username, options.password);
	if(options.headers) {
		Object.keys(options.headers).forEach(function(key){
			xhr.setRequestHeader(key, options.headers[key]);
		});
	}
	xhr.onreadystatechange = function(){
		var state = {};
		state.readyState = this.readyState;
		switch(this.readyState){

			case 1:
			break;

			case 2:
			case 3:
			case 4:
			state.body = this.responseText;
			state.statusCode = this.statusCode;
			state.statusText = this.statusText;
			state.head = this.getAllResponseHeaders();
			break;

			default:
			throw 'invalid state'
		}
		statechange(state)
	}
	xhr.send(options.body);
}
