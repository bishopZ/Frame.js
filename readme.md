Frame.js
============

Frame.js is a function sequencer and library loader for larger Javascript applications  

Why?
----------------

Despite the benefits of non-blocking asynchronous code execution in Javascript, endless chains of callback functions make for unreadable code and difficult to control applications.

Synchronizing code execution not only becomes a useful tool in JS application design, but also provides a framework for debugging, unit testing and script modularity.


Library Loader
----------------

Frame includes and acts as an interface for the $LAB library loader. https://github.com/getify/LABjs

Load libraries from local or remote servers:

	Frame('//path/to/some/library.js');

Add a callback:

	Frame('somelib.js', function(){
		// runs after library is loaded
		// ...
		Frame();
	});

Get a list of loaded Libs (only includes those loaded with Frame)

	console.log( Frame.libs() );

TODO: make a scan of the &lt;head&gt; and see what &lt;script&lt; are already loaded.


Sequencing
----------------

Sequence functions:

	Frame(function(){
		// function runs first
		// ...
		Frame(); // callback to move to next function in queue
	});
	Frame('//load/some/library.js');
	Frame(function(){
		// function runs third, after library is loaded
		// ...
		Frame(); 
	});
	Frame([
		function(){ 
			// function runs forth
			// ...
			Frame();
		},
		function(){
			// function runs fifth
			// ...
			Frame();
		}
	]);

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

Load Frame in debug mode by calling the debug version:

	<script type="text/javascript" src="/js/Frame_debug.js" />

Load Frame in production mode by calling the production version:

	<script type="text/javascript" src="/js/Frame.js" />

The debug version provides basic unit testing and debugging tools. All of which is disabled or silenced in the production version (replaced with empty functions). 

	Frame.title('Building Navigation'); // announces major application steps in console
	Frame.log('Building Navigation', someVariable); // same as console.log
	Frame.error('Building Navigation'); // announces errors in console

These are similar to console.log, but are silent in production mode so that logged developer comments can be left in the code without being echoed to end users. 

A Debug Level can be set in realtime.

	Frame.debug = 0; // no titles
	Frame.debug = 1; // only titles & errors
	Frame.debug = 2; // titles, logs & errors
	Frame.debug = 3; // titles, logs & errors, and additional start and stop messages



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


Example: Debug only one Frame
----------------
	
	Frame(function(){
		Frame.debug = 3; // increase the debug level at the beginning of the Frame
			// script you want to debug
			// ...
		Frame.debug = 0; // reset the level at the end
		Frame();
	});



FAQ: How is Frame different that $(document).ready()?
----------------

JQuery's document queue is non-blocking. Frame is designed to handle multiple asynchronous events such as AJAX requests, sequence multi-element page updates, and html animation.


FAQ: How is Frame different that $().queue()?
----------------

Actually Frame is very close to jQuery's queue in usage and purpose, but different in several specific ways. Better error handling, automatic queue recovery on script failures, and built-in unit testing mechanisms are a few examples.


A Note about Naming
----------------

A capitalized first letter in Javascript often indicates a class rather than an object. While Frame is an object, it works much like a class, and plays an important enough role that we elected for the name Frame() rather than frame(). 



License
----------------
Licensed under the Creative Commons BY-SA 3.0  
http://creativecommons.org/licenses/by-sa/3.0/nl/



Version
-----------------
0.1  
+ nothing yet

