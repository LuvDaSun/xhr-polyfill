(function(){

	var reHost = /^(?:\w+\:)?(?:\/\/)?([^\/]*)/;
	var hosts = {};
	
	window.registerXMLHttpRequestProxy = function(iframeUrl) {
		var match = reHost.exec(iframeUrl);
		if(!match) throw 'invalid iframeUrl';

		var host = {
			host: match[1]
			, iframeUrl: iframeUrl
		}
		hosts[host.host] = host;
	}//registerXMLHttpRequestProxy

	window.getXMLHttpRequest = function(hostname, cb){
		if(!(hostname in hosts)) cb('unknown host', null);

		var host = hosts[hostname];

		if('XMLHttpRequest' in host) return cb(null, host.XMLHttpRequest);

		if('callbackQueue' in host) return host.callbackQueue.push(function(err, host){
			cb(err, host.XMLHttpRequest);
		});

		host.callbackQueue = [function(err, host){
			cb(err, host.XMLHttpRequest);
		}];

		var iframe = document.createElement('iframe');
		//iframe.style.display = 'none';
		document.body.appendChild(iframe);

		iframe.contentWindow.onload = function(){
			var cb;

			host.XMLHttpRequest = this.XMLHttpRequest || function() {
				try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); } catch (e1) {}
				try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); } catch (e2) {}
				try { return new ActiveXObject("Msxml2.XMLHTTP"); } catch (e3) {}
				throw new Error("This browser does not support XMLHttpRequest.");
			};


			while(cb = host.callbackQueue.shift()) {
				cb(null, host);
			}
		}
		iframe.src = host.iframeUrl;

	}//getXMLHttpRequest

	window.XMLHttpRequestProxy_load = function(err, newHost) {
		// var host = hosts[newHost.host];
		// var cb;
		// host.XMLHttpRequest = newHost.XMLHttpRequest;
		// hosts[host.host] = host;

		// while(cb = host.callbackQueue.shift()) {
		// 	cb(null, host);
		// }
	}
	

	window.XMLHttpRequestProxy = function(){

		var xhr = null;
		var hostname = null;
		var proxy = this;

		function getXhr(cb){

			window.getXMLHttpRequest(hostname, function(err, XMLHttpRequest){
				if(!xhr) {
					xhr = new XMLHttpRequest();
					xhr.onreadystatechange = function() {
						proxy.readyState = this.readyState;
						switch(this.readyState){

							case 1:
							break;

							case 2:
							case 3:
							case 4:
							proxy.responseText = this.responseText;
							proxy.responseXML = this.responseXML;
							proxy.status = this.status;
							proxy.statusText = this.statusText;
							break;

							default:
							throw 'invalid state'
						}

						proxy.onreadystatechange && proxy.onreadystatechange.apply(this, arguments);
					
					}//onreadystatechange
				}
				
				cb.call(proxy, null, xhr);
			});

		}//getXhr


		this.onreadystatechange = null
		this.readyState = 0;
		this.responseText = null;
		this.responseXML = null;
		this.status = null;
		this.statusText = null;


		this.open = function(method, url, async, username, password){
			if(async === false) throw 'only asynchronous behavior is supported';

			var match = reHost.exec(url);
			if(!match) throw 'invalid url';

			hostname = match[1];

			getXhr(function(err, xhr){
				xhr.open(method, url, async, username, password);
			});
		}
		
		this.send = function(data) {
			getXhr(function(err, xhr){
				xhr.send(data);
			});
		}
		this.abort = function() {
			getXhr(function(err, xhr){
				xhr.abort();
			});
		}


		this.setRequestHeader = function(name, value) {
			getXhr(function(err, xhr){
				xhr.setRequestHeader(name, value);
			});
		}
		this.getAllresponseHeaders = function() {
			var passArguments = arguments;

			return xhr.getAllresponseHeaders();
		}
		this.getRepsonseHeader = function(name) {
			var passArguments = arguments;

			return xhr.getRepsonseHeader(name);
		}

	}//XMLHttpRequestProxy


})();
