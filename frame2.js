/**
	Frame 2.0
	http://framejs.tumblr.com
	Distributed with the MIT License
	built as an AMD Module
	requires: require.js, underscore.js, and typecast.js
*/
define('Frame', 
	// require the libraries
	[ 'underscore', 'typecast', 'modernizr' ], 
	// the libraries are returned
	function( _, type ){

	// A simple way to do Classes in JS
	var Factory = function(a,b){ 
		return (type.fn(a)) // if the first argument is a function
			? function(){ return a.apply({}, type.arr.to(arguments)); } // make a factory 
			: function(){ return b.apply(a, _.rest(type.arr.to(arguments)) ); }; // otherwise use the first argument as an injected context 
	};

	// A simple way to do data models in JS
	var Model = function(schema){

		schema = type.obj.to(schema); // ensure that it is an object

		var typeSchema = _.reduce(schema, function(m, v, k) {
			if (type.def(type[v])) { m[k] = v; } // if v is a type, then use v
			else { m[k] = type(v); } // else get the type of v and use that
			return m;
		}, {});

		var valueSchema = _.reduce(schema, function(m, v, k) {
			if (type.def(type[v])) { m[k] = type[v].a(); } // if v is a type, then use type.a()
			else if (type(v) === 'object') { m[k] = $.extend(true, {}, v); }
			else if (type(v) === 'array') { m[k] = $.extend(true, [], v); }
			else { m[k] = v; } // else use v
			return m;
		}, {});

		// interface
		var model = function(arr) { // produces an object that follows the schema
			if (type.obj(arr)) return $.extend(true, {}, valueSchema, arr);
			if (!type.arr(arr)) return $.extend(true, {}, valueSchema);
			return _.map(arr, function(obj){ 
				return $.extend(true, {}, valueSchema, obj);
			});
		}; 
		
		model.is = function(canidate) { // tests to see if model is valid
			return _.all(canidate, function(val, key){ return type(val) === typeSchema[key]; });
		};

		model.has = function(canidate){
			return type.def(model[canidate]);
		}
		
		model.schema = function() { // gives produces an object with default values
			return typeSchema;
		}
		model.defaults = function() { // gives produces an object with default values
			return valueSchema;
		}
		
		return model;
	};


	// Begin Frame 2.0 \\

	var VERSION = '2.0';

	// the main library of all threads
	var ThreadLibrary = {};

	// the data model of a thread	
	var ThreadModel = Model({
		name: 'string',
		context: 'object',
		args: 'array',
		que: 'array',
		response: [],
		animation: true,
		running: false,
		ready: false,
		complete: false,
		feature: true
	});

	// like a class, allows private variables
	var ThreadFactory = Factory(function(name, thread){

		// enforce the model
		var thread = ThreadModel({ name: name });

		// add the thread to the library of all threads
		ThreadLibrary[name] = thread;

		// integrate with require.js
		// if module is already defined, require ignores this line
		define(name, [], function(){ return thread.context; });

		// build the facade
		var facade = thread.facade = function(){ return facade.add.apply(this, arguments); };

		// add a function to the que
		facade.add = function(){
			_.each(arguments, function(unit){ 
				if (type.def(unit)) {
					thread.que.push(unit);
				}
			});
			thread.complete = false;
			start();
			return facade;
		};

		facade.start = function(){
			thread.running = true;
			start();
			return facade;
		};

		facade.stop = function(){
			thread.running = false;
			return facade;
		};

		facade.running = function(){
			return thread.running;
		}

		facade.len = function(){
			return thread.que.length;
		}
		
		facade.context = function(ctx){
			if (type.def(ctx)) {
				thread.context = ctx;
				return facade;
			}
			return thread.context;
		};

		facade.animation = function(){ 
			thread.animation = !thread.animation; 
			return facade; 
		};

		facade.feature = function(feature){
			var tag = document.getElementsByTagName('html')[0]
			if (type.def(tag)) {
				var classes = tag.className;
				if (classes.indexOf(feature) === -1) {
					thread.feature = false;
				}
			}
			return facade;
		};

		thread.ready = true;

		return facade;
	});

	// main interface
	var Frame = function(name){

		var isExists = type.def(ThreadLibrary[name]);
		var isName = type.arr.to(arguments).length === 1;

		if (isName && isExists) { return ThreadLibrary[name].facade; };
		if (isName && !isExists) { return ThreadFactory(name); }

		var qued,
			args = _.rest(arguments); // all except the first
		
		if (!isExists) { qued = ThreadFactory(name); }
		else { qued = ThreadLibrary[name].facade; }

		_.each(args, function(unit){ qued.add(unit); });

		return qued;
	};

	// undocumented debuggin tool
	Frame.report = function(){ 
		return _.extend({}, ThreadLibrary); 
	};


	// the engine

	var fps = 60; // frames per second max, 1000 is max
	var interval = false;
	var running = false;
	var concurrency = 12;

    Frame.fps = function(num){
 		if (type.num(num)) { 
 			if (num > 1000) num = 1000;
 			fps = num; 
 		}
    };
    // concurency = 0 is run the shit as fast as possible
    Frame.concurrency = function(num){
 		if (type.num(num)) concurrency = num; 
    };
    Frame.start = function(){
    	running = true;
    };
    Frame.stop = function(){
    	running = false;
    };


	var run = function(){
	 	// sort by priority?
		// if any thread is in a ready state
		var count = 0;
		if(_.all(ThreadLibrary, function(thread){ 
			if(
				thread.ready 
				&& thread.running 
				&& !thread.complete
				&& thread.feature
			) {
				if (concurrency > count || concurrency < 0) {
					advance(thread); // do it
					count ++;
				}
				return false;
			} 
			return true;
		})){
			done();
		};
	};

	
	var advance = function(thread){

		thread.ready = false;

		var finished = 0;
		var group = prepareGroup(thread);

        var pastResponse = _.flatten(thread.response);
        thread.response = [];
        
        _.each(group, function(operation, i){ 
        	var context = thread.context;
        	var promise = function(){
        	
        		thread.response[i] = arguments;

	            finished ++; 
	            if (finished === group.length){
	            	resolve(thread);            	
				};
	        }
			var args = _.union([promise], pastResponse, thread.args);
        	operation.apply(context, args);
        });

    };

	var prepareGroup = function(thread){

		var unit = thread.que[0];
		var group = type.arr(unit) ? unit : [ unit ]; // force an array

		// fault-tolerance
		group = _.flatten(group);
		
		// string or function
		group = _.map(group, function(item){
			// if a string 
			if (type.str(item)){
				return function(cb){ require([item], function(item){ cb(item); }); }
			}
			// if a function 
			else if (type.fn(item)) {
				return function(){ item.apply(this, arguments); }
			}
			// if a object 
			else if (type.obj(item)) {
				return function(){ return item; }
			}
		});

		// fault-tolerance
		group = _.reject(group, function(fn){ return !(type.fn(fn) || type.str(fn)); });
		
		// if animation, add requestAnimationFrame
		if (thread.animation) { group.push(function(cb){ requestAnimationFrame(function(){ cb(); }); }); };

		return group;
	};

    var resolve = function(thread){
    	thread.que.shift();
    	if (thread.que.length < 1) { 
    		thread.complete = true;
    		clean(); 
    	}
    	thread.ready = true;
    	start();
	};

    var start = function(){
    	if (!interval){
			interval = setInterval(run, 1000/fps);
    	}
	};

    var done = function(){
    	if(_.all(ThreadLibrary, function(thread){
    		return (!thread.running || !thread.ready || thread.complete)
    	})){
    		interval = clearInterval(interval);
    		interval = false;
    	}
    };

	var clean = Frame.clean = function(){
		ThreadLibrary = _.reduce(ThreadLibrary, function(m,v,k){
			m[k] = v; 
			if (v.complete === true || !v.feature) { 
				m[k].que = []; // force garbage collection
			}
			return m;
		}, {});
    };


	Frame.VERSION = VERSION;

	window.Frame = Frame;
	return Frame;

});