describe('proxy', function(){

	it('single request should be ok', function(cb){

		var xhr = new XMLHttpRequestProxy();
		xhr.open('GET', '//' + location.hostname + ':8080/data.json', true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4){				

				expect(xhr.status).to.be(200);
				expect(xhr.getResponseHeader('Content-Type')).to.be('application/json');
				expect(xhr.responseText).to.be('["one", "two", "three"]');
				
				cb();
			}
		};
		xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		xhr.send(null); 
		
	});

	it('burst should be ok', function(cb){
		var countdown = 100;

		next();

		function next() {
			var n = (countdown % 3).toString();
			var xhr = new XMLHttpRequestProxy();
			xhr.open('GET', '//' + location.hostname + ':8080/data' + n + '.json?_' + countdown, true);
			xhr.onreadystatechange = function() {
				if (xhr.readyState === 4){

					expect(xhr.status).to.be(200);
					expect(xhr.getResponseHeader('Content-Type')).to.be('application/json');

					expect(xhr.responseText).to.be(n);
					
					if(--countdown) return next();
					
					cb();
				}
			};
			xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			xhr.send(null); 
		}
		
	});

	it('async burst should be ok', function(cb){
		var countdown = 100;
		var queue = countdown;

		while(countdown--) {
			next();
		}

		function next() {
			var n = (countdown % 3).toString();
			var xhr = new XMLHttpRequestProxy();
			xhr.open('GET', '//' + location.hostname + ':8080/data' + n + '.json?_' + countdown, true);
			xhr.onreadystatechange = function() {
				if (xhr.readyState === 4){

					expect(xhr.status).to.be(200);
					expect(xhr.getResponseHeader('Content-Type')).to.be('application/json');

					expect(xhr.responseText).to.be(n);
					
					if(--queue) return;

					cb();
				}
			};
			xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			xhr.send(null); 
		}
	
	});

	it('should be not found', function(cb){
		var xhr = new XMLHttpRequestProxy();
		xhr.open('GET', '//' + location.hostname + ':8080/notfound.json', true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4){

				expect(xhr.status).to.be(404);
				
				cb();
			}
		};
		xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		xhr.send(null); 
	});

	it('local reqeuests should not use xhr-channel', function(cb){

		/*
		http://localhost:9876/local/ is a proxy for http://localhost:8080/
		http://localhost:9876/local/xhr-channel.html will exist
		http://localhost:9876/xhr-channel.html will not exist

		a local request (http://localhost:9876/local/) should not look for the xht-channel file (http://localhost:9876/xhr-channel.html)
		*/

		var xhr = new XMLHttpRequestProxy();
		xhr.open('GET', '/local/data.json', true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4){				

				expect(xhr.status).to.be(200);
				expect(xhr.getResponseHeader('Content-Type')).to.be('application/json');
				expect(xhr.responseText).to.be('["one", "two", "three"]');
				
				cb();
			}
		};
		xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		xhr.send(null); 

	});


});