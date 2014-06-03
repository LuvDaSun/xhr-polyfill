# xhr-polyfill

[![Build Status](https://travis-ci.org/LuvDaSun/xhr-polyfill.svg)](https://travis-ci.org/LuvDaSun/xhr-polyfill)


## What is it?

xhr-polyfill is a polyfill that allows you to make cross domain request in ie8 / ie9 (and other old browsers that do not support cross-domain xhr). It is a drop in replacement for the original XMLHttpRequest so you do not have to change any of your code.


## Wow, really! So what do I need to do?

Here's what you need to do:

- Install xhr-polyfill via bower
	"bower install xhr-polyfill"

- Include the following files in the webpages that make cross-domain requests:
	"src/shared.js"
	"src/IFrameChannel.js"
	"src/XMLHttpRequestProxy.js"

- Server the following files from the root of the server that will receive the cross-domain requests:
	"src/shared.js"
	"src/xhr-channel.js"
	"src/xhr-channel.html"	


## example

https://goabout.com is a web application that uses an api at https://api.goabout.com . This web application is also supposed to work on ie8, so xhr-polyfill is used.

The xhr-channel.html file is included in the root of the server. You may take a look at it here: https://api.goabout.com/xhr-channel.html . The javascript files are included and iminified right in the html for better performance.

The client scripts ("src/shared.js", "src/IFrameChannel.js", "src/XMLHttpRequestProxy.js") are included in the web application at https://goabout.com . They may not be visible in the soure-code because they are concatenated and minified together with a lot of other scripts.

The result is an angularjs app that is able to use an api that is located on another domain, even in ie8.


## This seems complicated / I don't get it

xhr-polyfill is not a really developer friendly solution (yet). Simply beause I do not have a lot of time to work on it and also because browsers that are unable to make cross-domain requests are a dying breed (finally). If you wish to use this solution in a production environment, don't hesitate to conctact me!


## How does it work?

The server html file contains a script that will make the actual request. This file should be placed on the same domain as the server you are going to make your requests to. This wat the requests are not cross domain, so ie8 / ie9 will have no problem.

The client script will load the server html file in an iframe. And when there is a request to the domain of that iframe, it will ask the XMLHttpRequest object in that iframe to make the request. The response will be send back to the parent frame. All this communication is asynchronous and serialized.

The client script wraps all the code in a proxy (XMLHttpRequestProxy) that may be used instead of XMLHttpRequest. Due to the asynchronous and serialized nature of the iframe communication there are a few things that differ from the 'real' XMLHttpRequest object.

- It is not possible to make a synchronous request;
- the responseXML property of the object will always be empty;
- getting or setting any property will not result in an error (on a 'real' XMLHttpRequest object you may nog set any property at any time);
- ...









