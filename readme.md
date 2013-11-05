Version History
============

Nov 5th, 2013 - Version 2.0

- Complete ground up re-write.
- Greatly simplified syntax.
- Added the ability to have mutiple Frame ques.
- Added multi-threaded Frame execution, running on top of Javascripts single-threaded processer.
- Added "tail-call optimization" to prevent increased call stacks sizes.
- Replaced LAB.js with Require.js and made Frame fully AMD-compliant
- Removed all console masking including Frame.log() and Frame.title() for increased compatibility and better separation of concerns.
- Added the ability to load CSS and TEXT files inline.
- Added ability to run any set of functions in parallel as well as series.
- Prevented callback functions from being called twice.
- Removed frame delay functionality.
- Frame is no longer "stand-alone", it requires require.js, typecast.js and underscore.js.


Dec 28th, 2012 - Version 1.1

- Removed console masking. Console is now unaltered by Frame. Full access to Frame.log() and Frame.title() are still in place.
- Resolved IE bug by changing all splice() to slice().
- Changed useTimeout default to false rather than true.
- Renamed Frame.double() to Frame.bump().
- Fixed speedTest to not fail when useTimeout is set to false.




Quickstart
-------------

Frame.js is a function sequencer, job manager and library loader for large Javascript applications. 

Despite the benefits of non-blocking asynchronous code execution in Javascript, endless chains of callback functions make for unreadable code and difficult to control applications. 

While many function sequencers exist, such as <a href="https://github.com/caolan/async">async</a>, <a href="https://github.com/substack/node-seq">Seq</a>, and <a href="https://github.com/it-ony/flow.js/blob/master/lib/flow.js">flow.js</a>, Frame.js is focused on application-level synchronous function management, includes a library loader to mix-and-match between remote scripts, local scripts, and functions. 

Frame is a wrapper of require.js, making the sytax far easier to use and providing a host of new and essential features.

"looks cool, nice job :)" *-Kyle Simpson, author of LABjs*

"lookin' good! Async control flow is a beast." *-Alex Sexton, Modernizr contributor, author of YepNope*

"It looks pretty neat :) Asynchronous control flow is never easy to get right, but this certainly seems like it would help!" *- Addy Osmani, jQuery contributor, http://addyosmani.com*


Frame() acts like define() but with some extras
----------------

Frame is a wrapper of require.js that makes the library easier to use and provides a host of new and essential features.

Frame works exactly like require's define() except it places a callback as the first argument.

	// with require.js
	define('moduleName', ['dep1', 'dep2'], function(dep1, dep2){
	    // your code
	    return module;
	});
	 
	// with Frame
	Frame('moduleName', ['dep1', 'dep2'], function(callback, dep1, dep2){
	    // your code
	    callback(module);
	});


Since Frame uses callback functions instead of return and creates modules as a series of functions.

	Frame('moduleName', ['dep1', 'dep2'], function(callback, dep1, dep2){
	        // runs first
	        callback(dep1);
	    }, 
	    function(callback, dep1){
	        // runs second
	        callback();
	});
 

Frame waterfalls anything passed to the callback functions.

	Frame('moduleName', 
	    [ // arrays run in parallel
	        'dep1', 
	        'dep2', 
	        function(callback){ callback( 'foo' ); }
	    ],[ // but the groups of parallel activities run in series
	        'dep3',
	        function(callback, dep1, dep2, 'foo'){ callback(1); },
	        function(callback, dep1, dep2, 'foo'){ callback(2); },
	        function(callback, dep1, dep2, 'foo'){ callback(3); },
	    ], // or just pass in a function
	    function(callback, dep3, 1,2,3){ callback(); }
	);
 

Frame can also cache the module as a variable.

	var module = Frame('moduleName');
	 
	module.add('dependencyName'); // a module name
	module.add(function(callback){ callback(); }); // a function to run
	module.add({ name: "joe" }); // an object of data to pass on
	module.add([ function, function, 'dependency', function ]); // in parallel
	 
	module.start(); // start the module directly instead of having to call require()
	 

Not having a return value, causes Frame() to work a little different than define() when used with require:

	// if you do this
	define('moduleName', ['dep1', 'dep2'], function(dep1, dep2){
	    // your code
	    return module;
	});
	// and then this
	require(['moduleName'], function(module){ });

The module argument of require() will equal the returned module from define() and require is providing access to that object throughout the application.

However in Frame, you need to specify a context to get the same response object.

	var moduleQue = Frame('moduleName').start();
	moduleQue(['dep1', 'dep2'], function(callback, dep1, dep2){
	    var module = {};
	    moduleQue.context(module);
	    callback();
	});
	moduleQue(function(callback){ 
	    var module = this;
	    callback(); 
	});
	require(['moduleName'], function(module){ 
	    // module === the context
	    // not the moduleQue object
	});

Also cacheing a que and starting a que is slightly different between define() and Frame().

	// in require.js
	define('moduleName', ['dep1', 'dep2'], function(dep1, dep2){
	    // module is defined, ie the code is loaded into the browser
	    return module;
	});
	require(['moduleName'], function(module){ 
	    // module is run, ie the code is executed
	});
	 
	// in Frame
	Frame('moduleName', ['dep1', 'dep2'], function(callback, dep1, dep2){
	    // module is defined
	    callback(module);
	}).start(); // module is run
	 
	// and you can stop it...
	Frame('moduleName').stop();
	 
	// and start it again
	Frame('moduleName').start();





Creating a simple Module with Frame()
-------------


	/// Simple Module \\\\
	 
	var myWidget = Frame('myWidget').start();
	myWidget([ 
	    'text!html/widgets/calculator.html', // load an html file
	    'css!styles/widgets/calculator.css',  // load a css file
	    { speed: 400 }
	]);
	myWidget(function(complete, template, options) {
	    myWidget.context($('#mySelector'));
	    $('#mySelector').html(template);
	    $('#mySelector').fadeIn(complete, options.speed);
	});
	myWidget(function(complete) {
	    this.slideRight(complete);  
	});


Accessing one Module from another
-------------

	/// Another Widget that adds to myWidget's que \\\
	 
	var another = Frame('anotherWidget').start();
	 
	another( [ 'myWidget', 'jquery'] );
	 
	another(function(outerDone, myWidget, $){
	    myWidget.add(function(innerDone){ 
	        innerDone();
	        outerDone();
	    });
	});


Creating a Backbone View Module
-------------

	/// Backbone Module \\\\
	var module = Frame('CLO.widgets.calculator').start();
	 
	calcModule([ 'pageData', 'jquery', 'backbone', 'mustache' ]);
	calcModule(function(complete, pageData, $, backbone, mustache) {
	    calcModule.context( backbone.View.extend({
	        el : '#widgets.calculator',
	        initialize: function(template){
	            // grab the data you need
	            this.render(template);
	        },
	        render: function(template){
	            // transform the template how you want
	            this.$el.html( mustache(template, pageData) );
	        },
	        events: {
	            // backbone events
	            '.equals click': 'equals'
	        },
	        equals: function(e){
	            // do the stuff...
	            var _this = this;
	            _this.$el.find('.value').html(_this.calc());
	        },
	        calc: function(){} //...
	    }));
	    // always call the callback
	    complete();
	});
	calcModule([
	    'tmpl.calculator', 
	    'css!css/widgets/calculator.css',
	]);
	calcModule(function(complete, calculatorView, template, css){
	    // intantiate the view
	    var calculator = new this(template);
	    // always call the callback
	    complete();
	});


A More Complex Example
-------------

	// in library.js the path to ajax.js is set
	paths: {
	    // ...
	    'ajax':         'app/ajax',
	    // ...
	}
	 
	// ajax.js, a module is defined using Frame
	(function(){
	    var module = Frame('ajax').start();
	    module(['jquery', 'underscore', 'typecast', 'app.data'], 
	        function(done, $, _, type, appData){
	         
	        log('setting ajax');
	        module.context($.ajax); // setting the value of 'this'
	        done();
	    });
	    return module;
	})();
	 
	// application.js, inside the 'app' Frame, the 'ajax' Frame is accessed
	Frame('app', ['ajax'], // ensure that 'ajax' module has been loaded
	    function(done){
	        Frame('ajax', function(cb){ // add to the 'ajax' Frame
	            log(this); // === $.ajax
	            cb();
	        });
	        done();
	    }
	).start();
	 


Function by Function Documentation
------------

##### Frame( string, [functional unit, ...] )

Returns: thread object
Description: create a new thread, also defined as a module name with require

string: the name of the new thread

functional unit: (optional) any number of functional units to add to the thread


### Functional Units
Frame uses functional units. Functional units can be a function, a string or an array.

string: the name of a module to load using require()

object: some data to pass on to the next unit

function: a function that receives a callback function as the first argument. the callback function must be called for the thread to continue.
array: an array of strings or functions to run in parallel (multiple array levels are not supported and get collapsed to a single array)


### Thread Objects
all thread objects return a reference to the thread so that they can be chained together.

##### thread( functional unit [, ...] )

Description: one or more new functional units to add to the thread

##### thread.add( functional unit [, ...] )

Description: same as thread()

##### thread.start(), thread.stop()

Description: start and stop a particular thread. Stopping a thread does not mark it for deletion. 

##### thread.context( value )

Description: set both the value of "this" inside future functional units, and set the return value of the module's definition in require()

##### thread.animation( boolean )

Default: true

Description: set to false if this thread should not be throttled by requestAnimationFrame

##### thread.feature( string )

Description: require a browser feature necessary for the thread to continue. the string can be the name of any class that Modernizr places on the HTML tag. if that class/feature is not present the thread is halted and marked for deletion.

### Helpers & Settings

##### Frame.report()

Returns: an object containing a copy of the currently active threads

##### Frame.fps( number )

Default: 60

Description: sets the times per second that Frame restarts threads that are ready

##### Frame.concurrency( number ) 

Default: 12

Description: the number of simultaneous threads to run

##### Frame.stop(), Frame.start()

Description: start and stop Frame entirely

##### Frame.clean()

Description: delete any threads that have been marked for deletion. must be called manually.
