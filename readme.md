Frame.js Quickstart
============

Frame.js is a function sequencer, job manager and library loader for frontend Javascript applications. 

Despite the benefits of non-blocking asynchronous code execution in Javascript, endless chains of callback functions make for unreadable code and difficult to control applications. 

While many function sequencers exist, such as <a href="https://github.com/caolan/async">async</a>, <a href="https://github.com/substack/node-seq">Seq</a>, and <a href="https://github.com/it-ony/flow.js/blob/master/lib/flow.js">flow.js</a>, Frame.js is focused on application-level synchronous function management, includes a library loader to mix-and-match between remote scripts, local scripts, and functions, and provides a basic set of debugging and unit testing tools. 

Frame is like require.js, but designed for the frontend, with debugging tools, and it clocks in at just under 11k (compared to require.js's minified 25k).

"looks cool, nice job :)" *-Kyle Simpson, Author of LABjs*

"lookin' good! Async control flow is a beast." *-Alex Sexton, Modernizr contributor, Author of YepNope*

"It looks pretty neat :) Asynchronous control flow is never easy to get right, but this certainly seems like it would help!" *- Addy Osmani, jQuery contributor, http://addyosmani.com*


Library Loader
----------------

Frame includes and acts as an interface for the LABjs library loader. https://github.com/getify/LABjs

Because of this, you can use Frame to load script libraries from both local and remote servers, cross-browser, with no cross-site scripting restrictions:

	Frame('http://path/to/some/library.js');

Add a callback:

	Frame('somelib.js', function(){
		// runs after library is loaded
		// do stuff
		Frame(); // trigger the next Frame to run 
	});

Use Frame.lib to load a list of libraries asynchronously with a single callback:

	Frame.lib([ // three libraries loaded asynchronously
	    '/lib/src/jquery-ui-1.8.18.custom.min.js', 
	    '/lib/src/jquery.tmpl.js',
	    '/lib/framework.js' 
	]);
	Frame(function(){
		// runs after all three libraries have loaded
	});

Get the list of libraries that have completed loading, including those added as &lt;script&gt; tags prior to Frame loading.

	console.log( Frame.libs() );


Sequencing
----------------

Sequence functions:

	Frame(function(){
		// function runs first ...
		Frame(); // callback to move to next function in queue
	});
	Frame('http://load/some/remote/library.js');
	Frame('/some/local/library.js');
	Frame(function(){
		// function runs forth, after both libraries are loaded ...
		Frame(); 
	});

Add a pause before a function runs: (occassionally handy, sometimes crucial)

	Frame(100, function(){
		// function runs 100ms after it is queued up
		// ...
		Frame(); 
	});

Launch the Frame queue by calling init(). 

	Frame.init();

Frequently init() only needs to be called once, but occasionally, with nested Frames it may necissary to call Frame.init again. If an event handler adds functions to Frame after the original Frame queue has already ended, Frame.init() will restart the queue. If Frame is already running, Frame.init does nothing.

	Frame(function(){
		// function A ...
		Frame();
	});
	Frame(function(){
		// function B ...
		$('#button').click(function(){
			Frame(function(){
				// Response to event ...
				Frame();
			});
			Frame.init(); 	// init needs to be called here only because "click" is an event
		});
		Frame();
	});
	Frame.init();


**Custom Callback Names**

In complicated applications, it is often confusing which callback is being called when. To help sort out such confusions you can specify the name of the callback by naming the first input property of the input function.

	Frame(function(next){
		// do stuff
		next(); // custom callback name
	});


The first input property is always the callback function, but more variables can also be passed in as additional arguments of Frame().

	Frame(function(next, context, someVar){
		// "this" is passed in as "context" (how to inject scope)
		// "someVar" is passed in as "someVar"
		// ...
		next(); 
	}, this, someVar);



Debug vs Production Versions
----------------

Load Frame.js debug version by loading the debug file:

	<script type="text/javascript" src="/js/frame_debug.js"></script>

Load Frame.js production version by loading the production file:

	<script type="text/javascript" src="/js/frame.min.js"></script>

The debug version provides basic unit testing and debugging tools. All of which is disabled or silenced in the production version (replaced with empty functions). 

	Frame.title('Building Navigation'); // announces major application steps in console
	Frame.log('nav items', navItems); // mostly the same as console.log
	Frame.error('something went wrong', error); // announces errors in console with special formatting

These are all similar to console.log, but are silent in production mode so that developer's console comments can be left in the code without being echoed to end users. This is sorely needed in large JS applications.

The Debug Level changes which debug messages are sent to console. The level can be changed as the application runs.

	Frame.debug = 0; // silent
	Frame.debug = 1; // log only
	Frame.debug = 2; // logs & errors
	Frame.debug = 3; // titles, logs & errors
	Frame.debug = 4; // titles, logs & errors, and additional start and stop messages



Example: Loading jQuery with Frame
----------------

	Frame('http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js'); 
	Frame(function(){
		Frame.log('jQuery is loaded', $(document) );
		// jQuery code...
		Frame();
	});
	Frame.init()


Example: Sequencing a series of AJAX requests
----------------

This will cause most browsers to hang, and the response objects to come back in the order they were received, not the order they were sent. 

	var responses = [];
	for(var i=0; i<1000; i++){
		$.ajax('myserver.api', { 
			data: i, 
			type: 'post', 
			complete: function(response) { 
				responses.push(response);
			} 
		});
	}

Adding Frame in the mix will avoid browser hang, and the response objects will be stored in the same order as the request objects. 
	
	var responses = [];
	for(var i=0; i<1000; i++){
		Frame(function(callback){
			$.ajax('myserver.api', { 
				data:i, 
				type:'post', 
				complete:function(response) { 
					responses.push(response);
					callback();
				}
			});
		});
	}
	Frame.start();


FAQ: Why is Frame better than require.js?
----------------

Require.js is a thorough library loader but, it does not deal with the callback problem.

Consider this script using require.js:

	var id = 123;
	require(["page.js", "nav.js"], function() {
		$.ajax({
			url:'authenticate.api',
			data: id,
			success: function(ajaxResponse){
				require(ajaxResponse.responseText.userRole, function(userModule){
					userModule.drawUser(function(){ // yet another callback
						// do more stuff after user is drawn (notice the indent level)
					});
				});
			}
		});
	});

Compared to a similar thing in Frame.js:

	var id = 123;
	var userRole = '';
	var exports = [];
	Frame.lib(["page.js", "nav.js"]);
	Frame(function(next){
		$.ajax({
			url:'authenticate.api',
			data: id,
			success: next
		});
	});
	Frame(function(next, ajaxResponse){
		userRole = ajaxResponse.responseText.userRole;
	});
	Frame(function(){
		Frame(userRole + '.js'); // a path to some js file named the same as the user role
		Frame(function(next){
			// someRole.js would have to add an object to exports with the same name as the file
			exports[userRole].drawUser(next); 
		});
	});
	Frame.later(function(next){
		// do more stuff after user is drawn (notice the indent level)
	});

The Frame version is more readable and modular in that it is easier to add to and take away pieces. The require.js version is simply not scalable in that the more callbacks you have, the more difficult the code becomes to read and use.

Require.js is great, except that it offers no support for performance management between modules. While callback functions always follow the library being loaded, two modules can both be resource intensive and they will both continue to try and run full-force at the same time.

Frame on the other hand offers a way of managing all the javascript running on a given page. Certianly a poorly written script can run wildly out of control in either, but Frame has specific ways to identify and deal with performance problems across the entire application. Frame creates a function buffer that run above Javascript's builtin function stack, and provides much better management than the browser or require.js.


FAQ: How is Frame different than $(document).ready() and $().queue()?
----------------

JQuery's document queue is non-blocking. It does not wait for callbacks. Frame on the other hand, is designed to handle multiple *asynchronous* events such as AJAX requests, sequenced multi-element DOM updates and sophisticated HTML animation.

Frame is very close to jQuery's $.queue in usage and purpose, but different in several specific ways. Better error handling, automatic queue recovery on script failures, and built-in unit testing mechanisms are a few examples.


A Note about Naming
----------------

A capitalized first letter in Javascript often indicates a class rather than an object. While Frame is an object, it works much like a class because it is a factory object. Frame can play an important enough role in JS application design that we elected for the name Frame() rather than frame(). 


License
----------------
LAB.js (LABjs :: Loading And Blocking JavaScript)
v2.0.3 (c) Kyle Simpson
MIT License, Creative Commons BY-SA 3.0  
http://creativecommons.org/licenses/by-sa/3.0/nl/

Frame.js (Javascript Job Manager)
v1.0 (c) Bishop Zareh
MIT License, Creative Commons BY-SA 3.0  
http://creativecommons.org/licenses/by-sa/3.0/nl/

