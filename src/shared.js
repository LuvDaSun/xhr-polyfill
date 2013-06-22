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