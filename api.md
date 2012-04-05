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
		// do stuff
		Frame();
	});

# Frame( path, [function] )

Load a library from the web. Path can either be local or remote. An optional callback function can be added. It runs after the library is loaded.

# Frame( number, function )

Add a number of milliseconds before a function to cause a delay before the function is run.


Library Loader
----------------

# Frame.lib( path, [function] ), Frame.load( path, [function] )

Same as Frame(path, [function]).

# Frame.libs(), Frame.library() 

Both of these functions return the list of libraries that have completed loading.

# Frame.LAB = $LAB

This is an interface to $LAB from inside Frame. 


Sequencing Functions
----------------

# Frame.begin(), Frame.start(), Frame.init()

All three of these functions do the same thing. They launch the Frame queue. After adding functions to Frame, Frame.init() is called one time to start running the functions. Mutiple calls to Frame.init() have no effect if Frame is already running.

# Frame.soon( function ), Frame.soon( number, function )

The same as Frame(function) and Frame(number, function)

# Frame.now( function ), Frame.now( number, function )

The same as soon, except that the function is prepended to the beginning of the queue. The now function is used to run a script as soon as the current queue item has completed. This approach provides better load balancing than Javascript does by itself.

# Frame.later( function ), Frame.later( number, function )

Functions added with later run after the soon queue is empty. This is used to queue up less important tasks that only need run after the main functionality has been established. For instance, Frame() functions might build an HTML page, while Frame.later() would preload images that might appear based on user interaction.

# Frame.queue()

Returns the current array of functions in Frame's queue.

# Frame.args()

Returns the corrisponding array of arguments to be passed to each function in Frame's queue.

# Frame.len(), Frame.count()

Returns the number of functions in Frame's queue.

# Frame.next()

This function is rarely used, but it an alternative to using Frame as a callback function. Frame() does not support "waterfall" properties, while Frame.next() does. Frame.next is the function called when a custom callback is named. (see examples.html for more detail)


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

Send to console if it exists and debug mode is 1 or greater.

# Frame.error( [arguments] ) 

Send to console if it exists and debug mode is 2 or greater with error formating.

# Frame.title( [arguments] ) 

Send to console if it exists and debug mode is 2 or greater with title formating.


Unit Testing Properties
----------------

# Frame.useTimeout = true

Set to false to run without timeouts. If a function fails, Frame will simply stop.

# Frame.overrideTimeoutLength = false

Set to a number of milliseconds to override the timeout number set automatically by Frame's speed test.

# Frame.testDuration = 1000

How long should the speed test last?

# Frame.machineSpeed = 3

After the speed test completes this number acts a general rating as to how well the end user's computer is keeping up with Javascript.

# Frame.timeout = 750

The current time Frame will wait for a function to complete.



Unit Testing Functions
----------------

# Frame.speedTest()

Runs a basic speed test on the end user's computer to determine how well it is performing. Resets the machineSpeed and timeout properties.

# Frame.report()

Provides an array of the speeds of the functions run by Frame. Debug version only.

