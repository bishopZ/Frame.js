Frame.js API Reference
============

Namespace
----------------

Since LABjs is included, both $LAB and Frame are claimed in the document.


Main interface
----------------

# Frame( function )

Add a frame to the queue.

# Frame()

Triggers the next frame in the queue, used as a callback.

	Frame(function(){
		// runs first
		Frame();
	});
	Frame(function(){
		// runs after the previous function
		Frame();
	});

# Frame( path, [function] )

Load a library from the web. Path can either be local or remote. An optional callback function can be added. It runs after the library is loaded.

# Frame( number, function )

Add a number of milliseconds before a function to cause a delay before the function is run. Sometimes necissary, occasionally crucial. Easier than wrapping the whole thing in a setTimeout.


Library Loader
----------------

# Frame.lib( path, [function] ), Frame.lib( array of paths, [function] )

Same as Frame(path, [function]) for strings. Loads a library from a path, with an optional callback function.

If you pass in an array or object, Frame.lib loads them in parallel and afterwards either calls the optional callback property or moves to the next Frame. Frame.lib only works with remote libraries and can not be used to sequence functions.

	Frame.lib([ // three libraries loaded asynchronously
	    '/lib/src/jquery-ui-1.8.18.custom.min.js', 
	    '/lib/src/jquery.tmpl.js',
	    '/lib/framework.js'
	]);
	Frame(function(){
		// runs after all three libraries have loaded
	});


# Frame.libs(), Frame.library() 

These functions return the list of libraries that have completed loading, including those added as &lt;script&gt; tags.

# Frame.script([ array of strings ])

Frame.script() can be used to load scripts in parallel like require.js. Unlike most of Frame's other functions, Frame.script does not automatically continue the to the next Frame, so it must be wrapped in a Frame() with a custom callback name.

	Frame(function(callback){
	    Frame.script([
	        'http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js',
	        '/lib/src/jquery-ui-1.8.18.custom.min.js', 
	        '/lib/src/jquery.tmpl.js',
	        '/lib/framework.js'
	    ]).wait(callback);
	});


Sequencing Functions
----------------

# Frame.begin(), Frame.start(), Frame.init(), Frame.go()

All of these functions do the same thing. They launch the Frame queue. After adding functions to Frame, Frame.init() is called one time to start running the functions. Calls to Frame.init() have no effect if Frame is already running.

# Frame.soon( function ), Frame.soon( number, function )

The same as Frame(function) and Frame(number, function), adds a function to the queue.

# Frame.now( function ), Frame.now( number, function )

The same as Frame.soon, except that the function is prepended to the beginning of the queue. Frame.now is used to run a script as quickly as possible, right after the current Frame function has completed. This approach provides better load balancing than Javascript does if you called the function outright.

For instance, this will cause most browsers to hang:

	for(var i=0; i<1000; i++){
		$.ajax('myserver.api', { data:i, type:'post' });
	}

While this will not:

	for(var i=0; i<1000; i++){
		Frame(function(callback){
			$.ajax('myserver.api', { data:i, type:'post', complete:callback });
		});
	}
	Frame.start();

# Frame.later( function ), Frame.later( number, function )

Functions added with Frame.later run after the "soon" queue is empty. This is used to queue up less important tasks that only need run after the main functionality has been established. For instance, Frame() functions might build an HTML page, while Frame.later() would preload images that might appear based on user interaction.

# Frame.bump( [arguments] ), Frame.double( [arguments] )

Basically, Frame.double adds the function to the end of the soon queue twice, but still before the later queue. It's really only useful in nested Frame sequences.

# Frame.queue()

Returns the current array of functions in Frame's queue.

# Frame.args()

Returns the an array of arguments to be passed to each function in Frame's queue.

# Frame.len(), Frame.count()

Returns the number of functions in Frame's queue.

# Frame.next()

This function is rarely used, but it an alternative to using Frame as a callback function. Frame() does not support "waterfall" properties, while Frame.next() does. Frame.next is the function called when a custom callback is named. (see examples.html for more detail)

# Frame.array()

Helper that converts an arguments object into an array.


Debug Properties
----------------

# Frame.running = false

Will be true if Frame is currently running scripts.

# Frame.debug = 0

This sets the main debug level and affects what information is automatically sent to console while Frame is running.

	Frame.debug = 0; // silent
	Frame.debug = 1; // log only
	Frame.debug = 2; // logs & errors
	Frame.debug = 3; // titles, logs & errors
	Frame.debug = 4; // titles, logs & errors, and additional start and stop messages
	Frame.debug = 5; // outputs each function as it runs

# Frame.last = []

An array of the function currently running and arguments passed to it.

# Frame.errors = []

Frame's internal list of errors that occured while running. Debug version only.

# Frame.stack = []

Frame's internal list of messages that occured while running. Debug version only.


Debug Functions
----------------

# Frame.log( [arguments] ) 

Send to console if it exists and debug mode is 1 or greater. Debug version only.

# Frame.error( [arguments] ) 

Send to console if it exists and debug mode is 2 or greater with error formating. Debug version only.

# Frame.title( [arguments] ) 

Send to console if it exists and debug mode is 2 or greater with title formating. Debug version only.


Unit Testing Properties
----------------

# Frame.useTimeout = true

Set to false to run without timeouts. If a function fails, Frame will simply stop.

# Frame.overrideTimeoutLength = false

Set to a number of milliseconds to override the timeout number set automatically by Frame's speed test.

# Frame.testDuration = 1000

How long should the speed test last?

# Frame.machineSpeed = 3

After the speed test completes this number acts a general rating as to how well the end user's computer is keeping up with Javascript. Run Frame.speedTest again to recalculate this indicator.

# Frame.timeout = 750

The current time Frame will wait for a function to complete. Run Frame.speedTest again to recalculate this indicator.



Unit Testing Functions
----------------

# Frame.speedTest()

Runs a basic speed test on the end user's computer to determine how well it is performing. Resets the machineSpeed and timeout properties.

# Frame.report()

Provides an array of the speeds of the functions run by Frame. Debug version only.

