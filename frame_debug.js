/*! LAB.js (LABjs :: Loading And Blocking JavaScript)
    v2.0.3 (c) Kyle Simpson
    MIT License
*/
(function(o){var K=o.$LAB,y="UseLocalXHR",z="AlwaysPreserveOrder",u="AllowDuplicates",A="CacheBust",B="BasePath",C=/^[^?#]*\//.exec(location.href)[0],D=/^\w+\:\/\/\/?[^\/]+/.exec(C)[0],i=document.head||document.getElementsByTagName("head"),L=(o.opera&&Object.prototype.toString.call(o.opera)=="[object Opera]")||("MozAppearance"in document.documentElement.style),q=document.createElement("script"),E=typeof q.preload=="boolean",r=E||(q.readyState&&q.readyState=="uninitialized"),F=!r&&q.async===true,M=!r&&!F&&!L;function G(a){return Object.prototype.toString.call(a)=="[object Function]"}function H(a){return Object.prototype.toString.call(a)=="[object Array]"}function N(a,c){var b=/^\w+\:\/\//;if(/^\/\/\/?/.test(a)){a=location.protocol+a}else if(!b.test(a)&&a.charAt(0)!="/"){a=(c||"")+a}return b.test(a)?a:((a.charAt(0)=="/"?D:C)+a)}function s(a,c){for(var b in a){if(a.hasOwnProperty(b)){c[b]=a[b]}}return c}function O(a){var c=false;for(var b=0;b<a.scripts.length;b++){if(a.scripts[b].ready&&a.scripts[b].exec_trigger){c=true;a.scripts[b].exec_trigger();a.scripts[b].exec_trigger=null}}return c}function t(a,c,b,d){a.onload=a.onreadystatechange=function(){if((a.readyState&&a.readyState!="complete"&&a.readyState!="loaded")||c[b])return;a.onload=a.onreadystatechange=null;d()}}function I(a){a.ready=a.finished=true;for(var c=0;c<a.finished_listeners.length;c++){a.finished_listeners[c]()}a.ready_listeners=[];a.finished_listeners=[]}function P(d,f,e,g,h){setTimeout(function(){var a,c=f.real_src,b;if("item"in i){if(!i[0]){setTimeout(arguments.callee,25);return}i=i[0]}a=document.createElement("script");if(f.type)a.type=f.type;if(f.charset)a.charset=f.charset;if(h){if(r){e.elem=a;if(E){a.preload=true;a.onpreload=g}else{a.onreadystatechange=function(){if(a.readyState=="loaded")g()}}a.src=c}else if(h&&c.indexOf(D)==0&&d[y]){b=new XMLHttpRequest();b.onreadystatechange=function(){if(b.readyState==4){b.onreadystatechange=function(){};e.text=b.responseText+"\n//@ sourceURL="+c;g()}};b.open("GET",c);b.send()}else{a.type="text/cache-script";t(a,e,"ready",function(){i.removeChild(a);g()});a.src=c;i.insertBefore(a,i.firstChild)}}else if(F){a.async=false;t(a,e,"finished",g);a.src=c;i.insertBefore(a,i.firstChild)}else{t(a,e,"finished",g);a.src=c;i.insertBefore(a,i.firstChild)}},0)}function J(){var l={},Q=r||M,n=[],p={},m;l[y]=true;l[z]=false;l[u]=false;l[A]=false;l[B]="";function R(a,c,b){var d;function f(){if(d!=null){d=null;I(b)}}if(p[c.src].finished)return;if(!a[u])p[c.src].finished=true;d=b.elem||document.createElement("script");if(c.type)d.type=c.type;if(c.charset)d.charset=c.charset;t(d,b,"finished",f);if(b.elem){b.elem=null}else if(b.text){d.onload=d.onreadystatechange=null;d.text=b.text}else{d.src=c.real_src}i.insertBefore(d,i.firstChild);if(b.text){f()}}function S(c,b,d,f){var e,g,h=function(){b.ready_cb(b,function(){R(c,b,e)})},j=function(){b.finished_cb(b,d)};b.src=N(b.src,c[B]);b.real_src=b.src+(c[A]?((/\?.*$/.test(b.src)?"&_":"?_")+~~(Math.random()*1E9)+"="):"");if(!p[b.src])p[b.src]={items:[],finished:false};g=p[b.src].items;if(c[u]||g.length==0){e=g[g.length]={ready:false,finished:false,ready_listeners:[h],finished_listeners:[j]};P(c,b,e,((f)?function(){e.ready=true;for(var a=0;a<e.ready_listeners.length;a++){e.ready_listeners[a]()}e.ready_listeners=[]}:function(){I(e)}),f)}else{e=g[0];if(e.finished){j()}else{e.finished_listeners.push(j)}}}function v(){var e,g=s(l,{}),h=[],j=0,w=false,k;function T(a,c){a.ready=true;a.exec_trigger=c;x()}function U(a,c){a.ready=a.finished=true;a.exec_trigger=null;for(var b=0;b<c.scripts.length;b++){if(!c.scripts[b].finished)return}c.finished=true;x()}function x(){while(j<h.length){if(G(h[j])){try{h[j++]()}catch(err){}continue}else if(!h[j].finished){if(O(h[j]))continue;break}j++}if(j==h.length){w=false;k=false}}function V(){if(!k||!k.scripts){h.push(k={scripts:[],finished:true})}}e={script:function(){for(var f=0;f<arguments.length;f++){(function(a,c){var b;if(!H(a)){c=[a]}for(var d=0;d<c.length;d++){V();a=c[d];if(G(a))a=a();if(!a)continue;if(H(a)){b=[].slice.call(a);b.unshift(d,1);[].splice.apply(c,b);d--;continue}if(typeof a=="string")a={src:a};a=s(a,{ready:false,ready_cb:T,finished:false,finished_cb:U});k.finished=false;k.scripts.push(a);S(g,a,k,(Q&&w));w=true;if(g[z])e.wait()}})(arguments[f],arguments[f])}return e},wait:function(){if(arguments.length>0){for(var a=0;a<arguments.length;a++){h.push(arguments[a])}k=h[h.length-1]}else k=false;x();return e}};return{script:e.script,wait:e.wait,setOptions:function(a){s(a,g);return e}}}m={setGlobalDefaults:function(a){s(a,l);return m},setOptions:function(){return v().setOptions.apply(null,arguments)},script:function(){return v().script.apply(null,arguments)},wait:function(){return v().wait.apply(null,arguments)},queueScript:function(){n[n.length]={type:"script",args:[].slice.call(arguments)};return m},queueWait:function(){n[n.length]={type:"wait",args:[].slice.call(arguments)};return m},runQueue:function(){var a=m,c=n.length,b=c,d;for(;--b>=0;){d=n.shift();a=a[d.type].apply(null,d.args)}return a},noConflict:function(){o.$LAB=K;return m},sandbox:function(){return J()}};return m}o.$LAB=J();(function(a,c,b){if(document.readyState==null&&document[a]){document.readyState="loading";document[a](c,b=function(){document.removeEventListener(c,b,false);document.readyState="complete"},false)}})("addEventListener","DOMContentLoaded")})(this);


/* Frame.js (Javascript Job Manager)
	v0.1 (c) Bishop Zareh
	MIT License
*/
(function(global){

	var noop = function(){}; // used for production version

	///////////////////////////////////////////////////////
	// Main interface

	global.Frame = function(a, b){
		if (typeof a === 'string') { 
			Frame.lib.apply(null, arguments); 
		}
		else if (typeof a === 'number') { 
			setTimeout( function() { Frame.apply(null, arguments); }, a); 
		}
		else if (typeof a === 'function') { 
			Frame.soon.apply(null, arguments); 
		}
		else if (a instanceof Array){ 
			for(var v in a) { arguments[0] = a[v]; Frame.apply(null, arguments); }; 
		} 
		else if (typeof a === 'undefined') { 
			Frame.next.apply(null, arguments); 
		}
		else { 
			arguments.unshift('Unidentified input: '); 
			Frame.error.apply(null, arguments); 
			return false;
		}
		return true;
	}

	///////////////////////////////////////////////////////
	// Library loader

	var _libs = [];
	Frame.LAB = 		$LAB // direct access to $LAB, for convenience
	Frame.libs = 
	Frame.library = 	function(){ return _libs; }; // return list of loaded libs
	Frame.lib =
	Frame.load = 		function(a, b){  // explicitly run $LAB
		var _loaded = false;
		for(var v in Frame._libs){ if (Frame._libs[v] === a) { _loaded = true; } }
		if (!_loaded) {
			Frame(function(){ 
				$LAB.script(a).wait( function(){ 
					Frame._libs.push(a); 
					Frame.log('Library loaded: '+ a); 
					if (typeof b == 'function') { b(Frame, a); } else { Frame(); } 
				});
			}); 
		} else { 
			Frame.log('Library already loaded, skipping: '+ a);  
			if (typeof b == 'function') { b(function(){}, a); }
		}
	} 
	
	///////////////////////////////////////////////////////
	// Unit testing
	
	Frame.useTimeout 			= true;
	Frame.overrideTimeoutLength = false;
	Frame.initialTimeout 		= 250;
	Frame.testDuration 			= 1000;
	Frame.machineSpeed 			= 3; // higher is slower
	Frame.timeout 				= Frame.initialTimeout * Frame.machineSpeed;
	Frame.keeperSteps 			= 5;
	Frame.keeperDuration  		= Frame.timeout / Frame.keeperSteps;
	
	Frame.resetTimeout = function(){
		Frame.timeout = (Frame.overrideTimeoutLength) 
			? Frame.overrideTimeoutLength 
			: Frame.initialTimeout * Frame.machineSpeed;
		Frame.keeperDuration = Frame.timeout / Frame.keeperSteps;
		return Frame.timeout;
	}

	// Machine Speed Test
	Frame.speedTest = function (){
		var _ticks = 1;
		var _ticker = setInterval(function(){ _ticks++; }, 1);
		setTimeout(function(){
			_ticker = clearInterval(_ticker); _ticker = false;
			Frame.machineSpeed = Math.ceil(Frame.testDuration/_ticks);
			if (Frame.machineSpeed < 1) { Frame.machineSpeed = 1; }
			Frame.resetTimeout();
			console.log('Speed test complete, Machine Speed: '+ Frame.machineSpeed + ', Timeout: '+ Frame.timeout);
		}, Frame.testDuration);
	}

	Frame.resetTimeout();
	

	///////////////////////////////////////////////////////
	// Queue functions

	var _queue = [];
	var _keeper = false; // promise keeper
	var _timer	= false; // unit test
	var _speed	= false; // unit test
	
	Frame.started = false;
	Frame.last = false;

	var start = function(){
		Frame.started = true; 
		_speed = 0; 
		_timer = clearInterval(_timer); _timer = false;
		_keeper = clearInterval(_keeper); _keeper = false;
		_keeper = setInterval(function(){
			if (_speed > Frame.timeout){
				Frame.error('Timed out, skipping ahead ', Frame.last);
				Frame();
			}
		}, Frame.keeperDuration );
	}

	//...

	var stop = function(){}


	Frame.now = 	function(){} // prepend to queue
	Frame.soon = 	function(){} // add function to queue

	Frame.end =
	Frame.after =
	Frame.later = 	function(){} // run when main queue is empty

	Frame.next = 	function(){} // go to next item in queue
	
	Frame.begin =
	Frame.start =
	Frame.init = 	function(){} // start Frame queue

	Frame.q =
	Frame.queue =	function(){ return _queue; } // returns the existing queue
	Frame.length = 	function(){ return _queue.length; } // returns length of the queue


	///////////////////////////////////////////////////////
	// Debug suite (debug version only)
	Frame.debug = 0; // debug level
	Frame.title = console.log; 
	Frame.log = console.log; 
	Frame.error = console.log; 

	// Frame.debug = 0; // no titles
	// Frame.debug = 1; // only titles & errors
	// Frame.debug = 2; // titles, logs & errors
	// Frame.debug = 3; // titles, logs & errors, and additional start and stop messages

})(this);