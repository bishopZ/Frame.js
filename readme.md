Frame.js Quickstart
============

Frame.js is a function sequencer, job manager and library loader for Javascript applications. 

Despite the benefits of non-blocking asynchronous code execution in Javascript, endless chains of callback functions make for unreadable code and difficult to control applications. 

While many function sequencers exist, such as <a href="https://github.com/caolan/async">async</a>, <a href="https://github.com/substack/node-seq">Seq</a>, and <a href="https://github.com/it-ony/flow.js/blob/master/lib/flow.js">flow.js</a>, Frame.js is focused on application-level synchronous function management, and includes a library loader to mix-and-match between remote scripts, local scripts, and functions. Frame also provides a set of basic debugging and unit testing tools. 

And it clocks in at just under 10k.


Library Loader
----------------

Frame includes and acts as an interface for the $LAB library loader. https://github.com/getify/LABjs

Load libraries from local or remote servers:

	Frame('http://path/to/some/library.js');

Add a callback:

	Frame('somelib.js', function(){
		// runs after library is loaded
		// ...
		Frame();
	});

Get a list of loaded Libs (only includes those loaded with Frame)

	console.log( Frame.libs() );


Sequencing
----------------

Sequence functions:

	Frame(function(){
		// function runs first
		// ...
		Frame(); // callback to move to next function in queue
	});
	Frame('http://load/some/remote/library.js');
	Frame('/some/local/library.js');
	Frame(function(){
		// function runs forth, after both libraries are loaded
		// ...
		Frame(); 
	});

Add a pause before a function runs: (occassionally handy, sometimes crucial)

	Frame(100, function(){
		// function runs after 100ms after it is queued up
		// ...
		Frame(); 
	});


Custom Callback name:
Sometimes in complicated Javascripts, it becomes confusing which callback is called when. To help sort out such confusions you can specify the name of the callback by naming the input property.

	Frame(function(next){
		// do stuff
		next(); // custom callback name
	});


Pass in a context or other variables:

	Frame(function(next, context, someVar){
		// "this" is passed in as "context"
		// "someVar" is passed in as "someVar"
		// ...
		next(); 
	}, this, someVar);


Launch the Frame queue by calling init(). 

	Frame.init();

Frequently init() only needs to be called once, but it may need to be called again if an event handler adds functions to Frame after the original Frame queue has already ended. init() does nothing is Frame is already running.

	Frame(function(){
		// function A
		// ...
		Frame();
	});
	Frame(function(){
		// function B
		// ...
		$('#button').click(function(){
			Frame(function(){
				// Response to event
				// ...
				Frame();
			});
			Frame.init(); 	// init needs to be called here only because "click" is an event
		});
		Frame();
	});
	Frame.init();



Debug vs Production Versions
----------------

Load Frame.js in debug mode by loading the debug version:

	<script type="text/javascript" src="/js/frame_debug.js"></script>

Load Frame.js in production mode by loading the production version:

	<script type="text/javascript" src="/js/frame.js"></script>

The debug version provides basic unit testing and debugging tools. All of which is disabled or silenced in the production version (replaced with empty functions). 

	Frame.title('Building Navigation'); // announces major application steps in console
	Frame.log('Building Navigation', someVariable); // a more cross-browser version of console.log
	Frame.error('Building Navigation'); // announces errors in console

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
		Frame();
	});
	Frame.init()


Example: Sequencing a series of AJAX requests
----------------

	$.each(listOfAjaxObjects, function(i, item){
		Frame(function(){
			item.complete = Frame;
			$.ajax(item);
		});
	});
	Frame.init()



FAQ: How is Frame different than $(document).ready()?
----------------

JQuery's document queue is non-blocking. Frame is designed to handle multiple asynchronous events such as AJAX requests, sequence multi-element page updates, and html animation.


FAQ: How is Frame different than $().queue()?
----------------

Actually Frame is very close to jQuery's queue in usage and purpose, but different in several specific ways. Better error handling, automatic queue recovery on script failures, and built-in unit testing mechanisms are a few examples.


FAQ: How is Frame.lib() different than $LAB.script()?
----------------

$LAB is loaded with Frame, but using $LAB instead of Frame.lib() does not provide the advatages of Frame.lib(). $LAB is able to do pairings of synchronous and asynchronous library loading. Frame only does synchronous. $LAB does not provide a list of libraries that have been loaded, while Frame.libs() does. 


A Note about Naming
----------------

A capitalized first letter in Javascript often indicates a class rather than an object. While Frame is an object, it works much like a class, and plays an important enough role that we elected for the name Frame() rather than frame(). 


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

