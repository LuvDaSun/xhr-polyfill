describe('test', function(){
	before(function(){
		registerChannel('http://localhost:9877/xhr-channel.html');
	});

	it('should be ok', function(cb){

		var xhr = new XMLHttpRequestProxy();
		xhr.open('GET', 'http://localhost:9877/data.json', true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4){				

				expect(xhr.status).to.be(200);
				expect(xhr.status).to.be(200);
				expect(xhr.responseText).to.be('["one", "two", "three"]');
				
				cb();
			}
		};
		xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		xhr.send(null); 
		
	});


});