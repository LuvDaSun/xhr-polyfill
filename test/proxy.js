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

		function loop() {
			var xhr = new XMLHttpRequestProxy();
			xhr.open('GET', '//' + location.hostname + ':8080/data' + (countdown % 3) + '.json', true);
			xhr.onreadystatechange = function() {
				if (xhr.readyState === 4){

					expect(xhr.status).to.be(200);
					expect(xhr.getResponseHeader('Content-Type')).to.be('application/json');
					
					if(--countdown) loop();
					else cb();
				}
			};
			xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			xhr.send(null); 
		}
		
		loop();
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


});