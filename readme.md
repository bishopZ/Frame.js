Frame.js
============

Frame.js is a ...  

Why?
----------------

Despite the benefits of non-blocking asynchronous code execution in Javascript, endless chains of callback functions make for unreadable code and difficult to control applications.

Synchronizing code execution not only becomes a useful tool in JS application design, but also provides a framework for debugging, unit testing and script modularity.


Library Loader
----------------

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


Delay functions:

	Frame(100, function(){
		// function runs after 100ms
		Frame(); // callback to move to next function in queue
	});


Custom Callback name:

	Frame(function(next){
		// do stuff
		next(); // pass in a custom callback name
	});



Debug vs Production Versions
----------------

The debug version provides a basic unit testing and debugging suite. All of which is disabled from the production version.





License
----------------
Licensed under the Creative Commons BY-SA 3.0  
http://creativecommons.org/licenses/by-sa/3.0/nl/


Version
-----------------
0.1  
+ nothing yet