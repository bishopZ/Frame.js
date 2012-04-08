/*! LAB.js (LABjs :: Loading And Blocking JavaScript)
    v2.0.3 (c) Kyle Simpson
    MIT License
*/
(function(o){var K=o.$LAB,y="UseLocalXHR",z="AlwaysPreserveOrder",u="AllowDuplicates",A="CacheBust",B="BasePath",C=/^[^?#]*\//.exec(location.href)[0],D=/^\w+\:\/\/\/?[^\/]+/.exec(C)[0],i=document.head||document.getElementsByTagName("head"),L=(o.opera&&Object.prototype.toString.call(o.opera)=="[object Opera]")||("MozAppearance"in document.documentElement.style),q=document.createElement("script"),E=typeof q.preload=="boolean",r=E||(q.readyState&&q.readyState=="uninitialized"),F=!r&&q.async===true,M=!r&&!F&&!L;function G(a){return Object.prototype.toString.call(a)=="[object Function]"}function H(a){return Object.prototype.toString.call(a)=="[object Array]"}function N(a,c){var b=/^\w+\:\/\//;if(/^\/\/\/?/.test(a)){a=location.protocol+a}else if(!b.test(a)&&a.charAt(0)!="/"){a=(c||"")+a}return b.test(a)?a:((a.charAt(0)=="/"?D:C)+a)}function s(a,c){for(var b in a){if(a.hasOwnProperty(b)){c[b]=a[b]}}return c}function O(a){var c=false;for(var b=0;b<a.scripts.length;b++){if(a.scripts[b].ready&&a.scripts[b].exec_trigger){c=true;a.scripts[b].exec_trigger();a.scripts[b].exec_trigger=null}}return c}function t(a,c,b,d){a.onload=a.onreadystatechange=function(){if((a.readyState&&a.readyState!="complete"&&a.readyState!="loaded")||c[b])return;a.onload=a.onreadystatechange=null;d()}}function I(a){a.ready=a.finished=true;for(var c=0;c<a.finished_listeners.length;c++){a.finished_listeners[c]()}a.ready_listeners=[];a.finished_listeners=[]}function P(d,f,e,g,h){setTimeout(function(){var a,c=f.real_src,b;if("item"in i){if(!i[0]){setTimeout(arguments.callee,25);return}i=i[0]}a=document.createElement("script");if(f.type)a.type=f.type;if(f.charset)a.charset=f.charset;if(h){if(r){e.elem=a;if(E){a.preload=true;a.onpreload=g}else{a.onreadystatechange=function(){if(a.readyState=="loaded")g()}}a.src=c}else if(h&&c.indexOf(D)==0&&d[y]){b=new XMLHttpRequest();b.onreadystatechange=function(){if(b.readyState==4){b.onreadystatechange=function(){};e.text=b.responseText+"\n//@ sourceURL="+c;g()}};b.open("GET",c);b.send()}else{a.type="text/cache-script";t(a,e,"ready",function(){i.removeChild(a);g()});a.src=c;i.insertBefore(a,i.firstChild)}}else if(F){a.async=false;t(a,e,"finished",g);a.src=c;i.insertBefore(a,i.firstChild)}else{t(a,e,"finished",g);a.src=c;i.insertBefore(a,i.firstChild)}},0)}function J(){var l={},Q=r||M,n=[],p={},m;l[y]=true;l[z]=false;l[u]=false;l[A]=false;l[B]="";function R(a,c,b){var d;function f(){if(d!=null){d=null;I(b)}}if(p[c.src].finished)return;if(!a[u])p[c.src].finished=true;d=b.elem||document.createElement("script");if(c.type)d.type=c.type;if(c.charset)d.charset=c.charset;t(d,b,"finished",f);if(b.elem){b.elem=null}else if(b.text){d.onload=d.onreadystatechange=null;d.text=b.text}else{d.src=c.real_src}i.insertBefore(d,i.firstChild);if(b.text){f()}}function S(c,b,d,f){var e,g,h=function(){b.ready_cb(b,function(){R(c,b,e)})},j=function(){b.finished_cb(b,d)};b.src=N(b.src,c[B]);b.real_src=b.src+(c[A]?((/\?.*$/.test(b.src)?"&_":"?_")+~~(Math.random()*1E9)+"="):"");if(!p[b.src])p[b.src]={items:[],finished:false};g=p[b.src].items;if(c[u]||g.length==0){e=g[g.length]={ready:false,finished:false,ready_listeners:[h],finished_listeners:[j]};P(c,b,e,((f)?function(){e.ready=true;for(var a=0;a<e.ready_listeners.length;a++){e.ready_listeners[a]()}e.ready_listeners=[]}:function(){I(e)}),f)}else{e=g[0];if(e.finished){j()}else{e.finished_listeners.push(j)}}}function v(){var e,g=s(l,{}),h=[],j=0,w=false,k;function T(a,c){a.ready=true;a.exec_trigger=c;x()}function U(a,c){a.ready=a.finished=true;a.exec_trigger=null;for(var b=0;b<c.scripts.length;b++){if(!c.scripts[b].finished)return}c.finished=true;x()}function x(){while(j<h.length){if(G(h[j])){try{h[j++]()}catch(err){}continue}else if(!h[j].finished){if(O(h[j]))continue;break}j++}if(j==h.length){w=false;k=false}}function V(){if(!k||!k.scripts){h.push(k={scripts:[],finished:true})}}e={script:function(){for(var f=0;f<arguments.length;f++){(function(a,c){var b;if(!H(a)){c=[a]}for(var d=0;d<c.length;d++){V();a=c[d];if(G(a))a=a();if(!a)continue;if(H(a)){b=[].slice.call(a);b.unshift(d,1);[].splice.apply(c,b);d--;continue}if(typeof a=="string")a={src:a};a=s(a,{ready:false,ready_cb:T,finished:false,finished_cb:U});k.finished=false;k.scripts.push(a);S(g,a,k,(Q&&w));w=true;if(g[z])e.wait()}})(arguments[f],arguments[f])}return e},wait:function(){if(arguments.length>0){for(var a=0;a<arguments.length;a++){h.push(arguments[a])}k=h[h.length-1]}else k=false;x();return e}};return{script:e.script,wait:e.wait,setOptions:function(a){s(a,g);return e}}}m={setGlobalDefaults:function(a){s(a,l);return m},setOptions:function(){return v().setOptions.apply(null,arguments)},script:function(){return v().script.apply(null,arguments)},wait:function(){return v().wait.apply(null,arguments)},queueScript:function(){n[n.length]={type:"script",args:[].slice.call(arguments)};return m},queueWait:function(){n[n.length]={type:"wait",args:[].slice.call(arguments)};return m},runQueue:function(){var a=m,c=n.length,b=c,d;for(;--b>=0;){d=n.shift();a=a[d.type].apply(null,d.args)}return a},noConflict:function(){o.$LAB=K;return m},sandbox:function(){return J()}};return m}o.$LAB=J();(function(a,c,b){if(document.readyState==null&&document[a]){document.readyState="loading";document[a](c,b=function(){document.removeEventListener(c,b,false);document.readyState="complete"},false)}})("addEventListener","DOMContentLoaded")})(this);

/* Fn.js (Javascript Job Manager)
	v1. (c) Bishop Zareh
	MIT License
*/
(function(global){

	///////////////////////////////////////////////////////
	// Main interface

	global.Frame = function(a, b){
		var args = _makeArray(arguments);
		if (a instanceof Array){ 
			for(var v in a) { args[0] = a[v]; Fn.apply(null, args); }; 
		} else {
			switch(typeof a){
				case 'string': return Fn.lib.apply(null, args); break;
				case 'number': return Fn.soon.apply(null, _rewrap.apply(null, args)); break;
				case 'function': return Fn.soon.apply(null, args);  break;
				case 'undefined': return Fn.next.apply(null, args);  break; 
				default: 
					return args; 
				break;
			}
		}
	};

	var Fn = Frame;
	var no = function(){}; 

	// helper for arrays
	var _makeArray = function(a) { return [].slice.call(a, 0); };
	Frame.array = _makeArray;

	// helper for setTimeouts
	var _rewrap = function(){ 
		var props = _makeArray(arguments),
			delay = props.shift(),
			fn = props.shift();

		props.unshift(function(){
			var args = _makeArray(arguments);
			setTimeout(function() { 
				fn.apply(null, args);
			}, delay); 
		});
		return props;
	};

	// TODO: parallels
	// TODO: yepnope

	// for production version 
	
	///////////////////////////////////////////////////////
	// Library loader

	var _libs = [];

	// Init Lib Loader
	// add existing script tags to the list of libraries 
	var existing = document.getElementsByTagName( "script" );
	for(i in existing){
		if(typeof existing[i].hasAttribute !== 'undefined'){
			if (existing[i].hasAttribute("src")){
				_libs.push(existing[i].getAttribute('src')); 
			}
		}
	};

	Fn.script = $LAB.script;

	Fn.libs = 
	Fn.library = function(){ return _libs; }; // return list of loaded libs
	Fn.lib = function(a, b){  // explicitly run $LAB
		var args = _makeArray(arguments);
		var _loaded = false;
		// process the input types differently
		if (typeof a === 'string'){
			for(var v in _libs){ if (_libs[v] === a) { _loaded = true; } }
		} else if (a instanceof Array){
			var all = 0;
			for(var l in a){ 
				for(var v in _libs){ 
					if (_libs[v] === a[l]) { all++; } 
			} }
			if(all === a.length){ _loaded = true; }
		} else if (typeof a === 'object' && typeof a.src !== 'undefined'){
			for(var v in _libs){ if (_libs[v] === a.src) { _loaded = true; } }
		}
		if (!_loaded) {
			Fn(function(){ 
				$LAB.script(a).wait( function(){ 
					if (typeof a ==='string'){
						_libs.push(a); 
					} else if (a instanceof Array){
						for(var l in a){ _libs.push(a[l]); }
					} else if (typeof a === 'object' && typeof a.src !== 'undefined'){
						_libs.push(a.src); 
					}
					Fn.log('Library loaded: '+ a); 
					if (typeof b == 'function') {
						args[0] = Fn.next; 
						b.apply(null, args); 
					} else { Fn(); } 
				});
			}); 
		} else { 
			//Fn.log('Library already loaded, skipping: '+ a);  
			if (typeof b == 'function') { b(function(){}, a); }
		}
		return args;
	}; 
	
	
	
	///////////////////////////////////////////////////////
	// Unit testing
	
	var _keeper = false, // promise keeper, sort of, TODO: make a real promise keeper
		_timer	= false, // unit test
		_speed	= false, // unit test
		_speeds	= []; 	
	
	Fn.running               = false;
	Fn.last                  = false;
	Fn.useTimeout            = true;
	Fn.overrideTimeoutLength = false;
	Fn.baseTimeout           = 265;
	Fn.testDuration          = 1250;
	Fn.machineSpeed          = 3; // higher is slower
	Fn.timeout               = Fn.baseTimeout * Fn.machineSpeed;
	Fn.keeperSteps           = 5;
	Fn.keeperDuration        = Fn.timeout / Fn.keeperSteps;
	
	Fn.resetTimeout = function(){
		Fn.timeout = (Fn.overrideTimeoutLength) 
			? Fn.overrideTimeoutLength 
			: Fn.baseTimeout * Fn.machineSpeed;
		Fn.keeperDuration = Fn.timeout / Fn.keeperSteps;
		return Fn.timeout;
	};

	// Machine Speed Test
	Fn.speedTest = function (a){
		if (Fn.useTimeout) {
			var _ticks = 1;
			var _ticker = setInterval(function(){ _ticks++; }, 1);
			setTimeout(function(){
				_ticker = clearInterval(_ticker); _ticker = false;
				Fn.machineSpeed = Math.ceil(Fn.testDuration/_ticks);
				if (Fn.machineSpeed < 1) { Fn.machineSpeed = 1; }
				Fn.resetTimeout();
				//Fn.log('Speed test complete, Speed Rating: '+ Fn.machineSpeed + ', Timeout set to: '+ Fn.timeout);
				if (typeof a === 'function') { a.apply(Fn, _makeArray(arguments).splice(1)) }
			}, Fn.testDuration);
			return 'Speed Test running...';
		}
	};

	// Speed report
	Fn.report = no;

	//////////////////
	/////  Internals

	// Start a unit
	var _start = function(){
		Fn.running = true; // update global
		

		// speed test
		_speeds.push(_speed);
		_speed = 0; 
		_clear();

		// promise keeper
		if (Fn.useTimeout) {
			_timer = setInterval(function(){_speed++;}, 1);
			_keeper = setInterval(function(){
				if (_speed > Fn.timeout){
					//Fn.error('Timed out after '+_speed, Fn.last);
					Fn();
				}
			}, Fn.keeperDuration );
		}
	};

	// Unit is done!
	var _stop = function(){
		//if(Fn.debug > 3) { Fn.log('---- Fn done ----'); } // debug
		_clear();
		Fn.running = false; 
	};
	
	// Clear intervals
	var _clear = function(){
		_keeper = clearInterval(_keeper); _keeper = false; // oddly this seems like the best way to clear an interval
		_timer = clearInterval(_timer); _timer = false;
	};


	///////////////////////////////////////////////////////
	// Queue functions

	var _queue = [],
		_qArgs = [],
		_later = [],
		_lArgs = [];

	Fn.queue = function(){ return _queue.concat(_later); } // returns the existing queue
	Fn.args = function(){ return _qArgs.concat(_lArgs); } // returns the existing queue
	Fn.len = 
	Fn.count = function(){ return (_queue.length + _later.length); } // returns length of the queue

	Fn.soon = function(a){ // add function to queue
		var args = _makeArray(arguments);
		if (typeof a === 'number') { return Fn.apply(null, args); } 
		else if (typeof a ==='function'){ 
			_qArgs.push(args.splice(1));
			//if (Fn.debug > 4){ Fn.log('Fn added soon', Fn.count()); }
			return _queue.push(a); 
		} 
		return false;
	};

	Fn.bump = 
	Fn.double = function(){ // add function to queue
		var args = _makeArray(arguments);
		//if (Fn.debug > 4){ Fn.log('Fn doubled', args); };
		Fn(function(next){
			Fn.apply(null, args);
			next();
		});
		return args;
	};

	Fn.now = function(a){ // prepend to queue
		var args = _makeArray(arguments);
		if (typeof a === 'number') { return Fn.now.apply(null, _rewrap.apply(null, args)); } 
		else if(typeof a ==='function'){ 
			_qArgs.unshift(args.splice(1));
			//if (Fn.debug > 4){ Fn.log('Fn added now', Fn.count()); }
			return _queue.unshift(a); 
		}
		return false;
	};

	Fn.later = function(a){ // run when main queue is empty
		var args = _makeArray(arguments);
		if (typeof a === 'number') { return Fn.later.apply(null, _rewrap.apply(null, args)); } 
		else if(typeof a ==='function'){ 
			_lArgs.push(args.splice(1));
			//if (Fn.debug > 4){ Fn.log('Fn added later', Fn.count()); } 
			return _later.push(a); 			
		}
		return false;
	};

	Fn.next = function(a){ // go to next item in queue
		var args = _makeArray(arguments);

		if(_queue.length > 0){
			Fn.last = _qArgs.shift();
			Fn.last.unshift( _queue.shift() ); 
			Fn.last = Fn.last.concat(args); // add any waterfall arguments
			Fn.stack.push(Fn.last);
			return _run.apply(null, Fn.last);
		} else if (_later.length > 0){
			Fn.last = _lArgs.shift();
			Fn.last.unshift( _later.shift() ); 
			Fn.last = Fn.last.concat(args); 
			Fn.stack.push(Fn.last);
			return _run.apply(null, Fn.last);
		} else {
			_stop();
			return false;
		}
	}; 
	
	Fn.go =
	Fn.begin =
	Fn.start =
	Fn.init = function(){ // start Fn queue
		if (Fn.running === false){  Fn.next(); return true; } 
		else { return false; }
	};

	var _run = function(fn){ // the magic
		var args = _makeArray(arguments);
		if (typeof fn === 'function') { 
			_start();
			try { // only catches some errors, but has minimal speed impact and adds safety
				// replace the first argument with the callback function
				// callback is next() instead of Fn(), so waterfall args can be passed in
	 			args[0] = Fn.next; 
	 			return fn.apply(null, args);
	 		} catch(e) {
	 			_clear();
	 			//Fn.error(e, Fn.last);
	 			Fn(); // move on
	 			return e;
	 		}
	 		return true;
		} else {
			_stop(); // doubled up here for safety
			return false;
		}
	}; 

	///////////////////////////////////////////////////////
	// Debug suite (debug version only)
	// Fn.debug = 0; // silent
	// Fn.debug = 1; // log only
	// Fn.debug = 2; // logs & errors
	// Fn.debug = 3; // titles, logs & errors
	// Fn.debug = 4; // titles, logs & errors, and additional start and stop messages
	
	Fn.debug = 0; // default debug level
	Fn.errors = [];
	Fn.stack = [];
	
	Fn.log = no;

	Fn.title = no; 
	
	Fn.error =  no;

	
	///////////////////////////////////////////////////////
	// Start it up!
	
	Fn.resetTimeout();
	
	// queue a speed test in the later queue
	Fn.later(function(){
		Fn.speedTest(Fn.next);
	});

	//Fn.title('Fn Finished Loading');

})(exports = this.exports || this || {});