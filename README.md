# xhr-polyfill

* Master: [![Build Status](https://travis-ci.org/elmerbulthuis/xhr-polyfill.png?branch=master)](https://travis-ci.org/elmerbulthuis/xhr-polyfill)
* Develop: [![Build Status](https://travis-ci.org/elmerbulthuis/xhr-polyfill.png?branch=develop)](https://travis-ci.org/elmerbulthuis/xhr-polyfill)


## What is it?

xhr-polyfill is a polyfill that allows you to make cross domain request in ie8 / ie9. Here's what you need to do:

- include the client script in your website;
- add the server html file tou your server(s);
- configure the client script.

After you have done that you may usr the XMLHttpRequest object for making cross domain requests.


## How does it work?

The server html file contains a script that will make the actual request. This file should be placed on the same domain as the server you are going to make your requests to. This wat the requests are not cross domain, so ie8 / ie9 will have no problem.

The client script will load the server html file in an iframe. And when there is a request to the domain of that iframe, it will ask the XMLHttpRequest object in that iframe to make the request. The response will be send back to the parent frame. All this communication is asynchronous and serialized.

The client script wraps all the code in a proxy (XMLHttpRequestProxy) that may be used instead of XMLHttpRequest. Due to the asynchronous and serialized nature of the iframe communication there are a few things that differ from the 'real' XMLHttpRequest object.

- the responseXML property of the object will always be empty;
- getting or setting any property will not result in an error (on a 'real' XMLHttpRequest object you may nog set any property at any time);
- ...


## How do i install it?

xhr-polyfill can be installed useing bower
	
	bower install xhr-polyfill

Also, you will need to place the xhr-channel.html file on your server.

