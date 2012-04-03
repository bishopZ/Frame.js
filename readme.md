Frame.js
============

Frame.js is a function sequencer and library loader for larger Javascript applications  

Why?
----------------

Despite the benefits of non-blocking asynchronous code execution in Javascript, endless chains of callback functions make for unreadable code and difficult to control applications.

Synchronizing code execution not only becomes a useful tool in JS application design, but also provides a framework for debugging, unit testing and script modularity.


Library Loader
----------------

Frame includes and acts as an interface for the $LAB library loader.

Load libraries from local or remote servers:

	Frame('//path/to/some/library.js');

Add a callback:

	Frame('somelib.js', function(){
		// runs after library is loaded
	});

Get a list of loaded Libs
(only includes those loaded with Frame)

	console.log( Frame.libs() );



Sequencing
----------------

Sequence functions:

	Frame(function(){
		// function runs first
		Frame(); // callback to move to next function in queue
	});
	Frame('//load/some/library.js');
	Frame(function(){
		// function runs third, after library is loaded
		Frame(); 
	});
	Frame([
		function(){ 
			// function runs forth
			Frame();
		},
		function(){
			// function runs fifth
			Frame();
		}
	]);

Add a pause before a function runs:

	Frame(100, function(){
		// function runs after 100ms
		Frame(); // callback to move to next function in queue
	});

Add a pause after a function runs: 

	Frame(function(){
		Frame(); // callback to move to next function in queue
	}, 100);


Custom Callback name:
Sometimes in complicated Javascripts, it becomes confusing which callback is called when. To help sort out such confusions you can specify the name of the callback by naming the input property.

	Frame(function(next){
		// do stuff
		next(); // custom callback name
	});


Launch the Frame queue by calling init(). 

	Frame.init();

Frequently init() only needs to be called once, but it may need to be called again if events handler adds functions to Frame after the original Frame queue has already ended. init() will only restart the queue if the Frame queue is not already running.

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
			Frame.init(); 	// init needs to be called here 
		});
		Frame();
	});
	Frame.init();


Debug vs Production Versions
----------------

The debug version provides a basic unit testing and debugging suite. All of which is disabled from the production version.

Same as console.log, but get disabled in production version so that comments can be left in the code without being echoed to end users.

	Frame.title('Building Navigation');

A Debug level can be set in realtime 

	Frame.debug = 0; // no titles
	Frame.debug = 1; // only titles & errors
	Frame.debug = 2; // titles, logs & errors
	Frame.debug = 3; // titles, logs & errors, and additional start and stop messages



Example: Loading jQuery with Frame
----------------

	Frame('http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js'); 
	Frame(function(){
		$(function(){
			Frame.log('jQuery is loaded');
		});
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

