// root around for a namespace
;(function (root, deps, factory) {
    if (typeof exports === 'object') return module.exports = factory(root._, root); // not sure this works
    if (typeof define === 'function' && define.amd) return define(deps, factory); 
    root.type = factory(root._, root);
}(window || this, ['underscore'], function (_, root) {

	var _VERSION = '0.3';

	// Let's build a little nest here...
	var undefined; // for pre-EC5 js
	var noop = function(){};
	var log = (root && root.console && root.console.log) ? root.console.log : noop;
	var value = function(v){ return function(){ return v; }; };
	var compare = function(v1){ return function(v2){ return v1 === v2; }; };
    var can = function(name){ return function(v){ 
    	var t = type[name];
    	return v === t.a() || ( v != t.a() && t.to(v) === t.a() ); }; };

	// requirements
	if (!_) { log("type requires underscore.js"); return false; };
	if (!Math) { log("type requires Math"); return false; };
	if (!JSON) { log("type requires JSON"); return false; };

	// basic interface 
    var type = function(v){
    	if (type.arr(v)) return 'array';
    	if (type.nan(v)) return 'nan';
    	if (type.nul(v)) return 'null';
    	if (type.args(v)) return 'arguments';
        return typeof v;
    };

    type.VERSION = _VERSION;

    // extending
    type.extend = function(obj){
    	var isNew = false;
    	if (!type[obj.name]) {
    		isNew = true;
    		type[obj.name] = obj.is;
    	}
    	// first inherit
    	if (obj.inherits) {
    		if (!(obj.inherits instanceof Array)) obj.inherits = [obj.inherits];
    		_.each(obj.inherits, function(name){
    			_.extend(type[obj.name], type[name]);
    		});
    	}
    	// clobber with new type methods
    	if (obj.methods) _.extend(type[obj.name], obj.methods);
    	// and if new, always clobber the base functions
    	if (isNew) {
	    	type[obj.name].a = value(obj.a);
	    	type[obj.name].to = obj.to;
	    	type[obj.name].can = obj.can;    
    	}
    };

    // #### the Types ####

    // base types
    type.extend({
		name: "nul",
		a : null,
		is: _.isNull,
		to: value(null),
		can: value(true)
	});

	type.extend({
		name: "undef",
		a : undefined,
		is: _.isUndefined,
		to: value(undefined),
		can: value(true)
	});

	type.extend({
		name: "nan",
		a : NaN,
		is: _.isNaN,
		to: value(NaN),
		can: value(true)
	});

	type.extend({
		name: 'def',
	    a: true,
	    is: function(v){ 
	        return !( type.nan(v) || type.undef(v) || type.nul(v) ); 
	    }, 
	    to: function(v){ 
	        return (type.def(v)) ? v : type.def.a();
	    },
	    can: function(v){
	    	return (type.def(v)) ? true : false;
	    }
	}); 

	// Dual Types

	type.extend({
		name:'bool',  
		a: true, 
	    is: _.isBoolean,
	    to: function(v){ 
	    	return /^true$/i.test(v);
	    },
	    can: can('bool'),
	    methods: { // obj methods
			not : function(v){ return !v; }
	    }
	});

	type.extend({
		name: 'tru',  
		inherits: 'bool',
		a: true, 
	    is: compare(true), 
	    to: type.bool.a,
	    can: value(true)
	});
	type.extend({
		name: 'fal',  
		inherits: 'bool',
		a: false, 
	    is: compare(false), 
	    to: value(false),
	    can: value(false)
	});
	type.extend({
		name: 'truy',  
		inherits: 'bool',
		a: true, 
	    is: function(v){ return v == true; }, 
	    to: function(v){ return (v) ? v : true; },
	    can: value(true)
	});
	type.extend({
		name: 'faly',  
		inherits: 'bool',
		a: false, 
	    is: function(v){ return v !== true; }, 
	    to: function(v){ return (!v) ? v : false; },
	    can: value(false)
	});
	
	// Numeric

	type.extend({
		name:'num',  
    	a: 0 ,
    	is: function(v){ 
    		return _.isNumber(v) && !type.nan(parseFloat(v)); 
    	},
	    to: function(v){
	        if(type.num(v)){ return v; };
	        if(type.bool(v)){ return v ? 1 : 0; };
	        if(type.fn(v)){ 
	            var val = v();
	            if(type.num(val)){ return val; }; 
	        }; 
	        if(type.obj(v) && type.fn(v.a)) {
	        	if (type.num(v.a())) return v.a();
	        }
	        if(type.arr(v)){ return v.length; };
	        if(type.str(v)){
	            var num = v * 1 || 0;
	            return (num === 0 && !v.match(/^0+$/)) ? type.num.a() : num;
	        }
	        return type.num.a();
	    },
	    can: can("num"),
	    
		methods : {
			random : _.random,
			range : _.range,
		    
			abs : Math.abs,
			acos : Math.acos,
			asin : Math.asin,
			atan : Math.atan,
			ceil : Math.ceil,
			cos : Math.cos,
			exp : Math.exp,
			floor : Math.floor,
			log : Math.log,
			max : Math.max,
			min : Math.min,
			pow : Math.pow,
			round : Math.round,
			sin : Math.sin,
			sqrt : Math.sqrt,
			tan : Math.tan,
			
			plus : function(a, b){ return a + b; },
			minus : function(a, b){ return a - b; },
			mod : function(a, b){ return a % b; },
			times : function(a, b){ return a * b; },
			div : function(a, b){ return a / b; },
	
			sign : function(n) { return n == 0 ? 0 : n/Math.abs(n); },
			between : function(v, low, high){ return (v >= low && v <= high); },
			eq : function(a, b){ return a === b; },
			neq : function(a, b){ return a !== b; },
			lt : function(a, b){ return a < b; },
			lte : function(a, b){ return a <= b; },
			gt : function(a, b){ return a > b; },
			gte : function(a, b){ return a >= b; },

			fixed: function(a, b){ return parseFloat(a.toFixed(type.int(b) ? b : 2), 10); },
			hex : function(a){ return a.toString(16); },
			binary : function(a){ return a.toString(2); }
		
		}

	});

	type.extend({
		name:'int',  
		a: 1,  
		inherits: "num",
		is: function(v){ return (Math.floor(v) === v); },
		to: function(v){ 
			var value = parseInt(v, 10); 
			if (!isNaN(value)) return value; 
			return type.num.a();
		},
		can: can("int"),
		methods : {
			dec: function(v){ return --v; },
			inc: function(v){ return ++v; }
		}
	});

	type.extend({
		name:'flt',  
		a: 0.1,  
		inherits: "num",
		is: function(v, p){ 
			return v === type.num.fixed(v, p); 
		}, 
		to: function(v, p){ 
			return type.num.fixed(type.num.to(v), p);
		},
		can: can("flt"),
		methods: {
			eq : function(a, b, p){
				return type.num.fixed(a, p) === type.num.fixed(b, p);
			},
			decimal : function(a){ return a % 1; }
		}
	});

	/// Strings

	type.extend({

		name:'str',  
		a: '', 
		is: _.isString,  
		to: function(v){ 
			if(type.def(v)) return String(v); return type.str.a(); 
		},
		can: can("str"),
	
		methods: {

			fromCharCode: String.fromCharCode,
			charAt: function(a, b){return a.charAt(b);},
			charCodeAt: function(a, b){return a.charCodeAt(b);},
			lower: function(a){ return a.toLowerCase(); },
		    upper: function(a){ return a.toUpperCase(); },
	    	
		    escape: _.escape,
		    unescape: _.unescape,
		    template: _.template,
		    contains: _.contains,
	 	    "array": _.toArray,
	 	    length: _.size,
			
			trim: function(a){return type.str.ltrim(type.str.rtrim(a));},
			ltrim: function(a){return a.replace(/^\s+/,'');},
			rtrim: function(a){return a.replace(/\s+$/,'');},
		    
			truncate : function(text, strLength, noDots) {
				if (text.length > strLength) {
					if (strLength && !isNaN(strLength)) {
						if(type.faly(noDots)){
							return text.substr(0, strLength);
						} 
						return text.substr(0, strLength) + '&hellip;';
					}
				} return text;
			}
	 		
	 	    // not sure about these
	 	    //split: function(){return this.a().split.apply(this, arguments);},
		    //replace: function(a){return a.replace.apply(this, arguments);},
	 	    //replaceAll: function(a,b){ return this.a().replace( //...// )}

		}
	});


	type.extend({
		name:'plain',  
		a: "", 
		inherits: "str",
		is: function(v){ return  type.plain.to(v).length === v.length; },
		to: function(v){ 
			if(type.str(v)) return v.replace(/^[^a-zA-Z0-9@!#\$\^%&*()+=\-\[\]\\\';,\.\/\{\}\|\":<>\? ]+$/, '' ); return type.plain.a(); 
		},
		can: function(v){
			return type.str.can(v);
		}
	});

	type.extend({
		name:'email',  
		a: 'test@test.com', 
		inherits: "str",
		is: function(v){ 
			var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    		return re.test(v); 
    	},
    	to: function(v,w,x){ 
    		if (type.email(v)) return v;
    		if (type.def(v) && type.def(w) && type.def(x)) return v+'@'+w+'.'+x; 
    		if (type.def(v) && type.def(w)) return v+'@'+w;
    		return type.email.a();
    	},
    	can: can("email")
	});




	type.extend({
		name:'unique',  
		a: "0",
		is: function(v){ 
			v = type.str(v);
			if(v) return _.indexOf(type.unique.ids, v)!==-1; 
			return false;
		}, 
		can: function(v){ 
			v = type.make('str', v); 
			if(v) return _.indexOf(type.unique.ids, v)===-1; 
			return false;
		}, 
		to: function(v){ 
			v = type.make('str', v);
			while(_.indexOf(type.unique.ids, v)!==-1){
				v = _.uniqueId();
			} 
			type.unique.ids.push(v); 
			return v;
		},
		methods: {
			ids: ["0"]
		}
	});


	/** COLLECTION TYPES **/

	type.extend({
		name:'col',  
		a: [],
		is: function(v){ return _.isObject(v) || _.isArray(v); }, 
		can: function(v){ return type.col(v); }, 
		to: function(v){ 
			if (type.col(v)) { return v; }
			return type.arr.to(v); 
		},
		methods : {
			each: _.each,
			map: _.map,
			reduce: _.reduce,
			reduceRight: _.reduceRight,
			find: _.find,
			filter: _.filter,
			where: _.where,
			reject: _.reject,
			contains: _.contains,
			invoke: _.invoke,
			pluck: _.pluck,
			sortBy: _.sortBy,
			groupBy: _.groupBy,
			countBy: _.countBy,
			shuffle: _.shuffle,
			toArray: _.toArray,
			length: _.length,

			all: _.all,
			any: _.any,
			max: _.max,
			min: _.min,

			mapValues: function (a, fn) {
		        return _.reduce(a, function (obj, v, k) {
		            obj[k] = fn(v, k, a); return obj;
		        }, {});
		    }
		    
		}
	});

	type.extend({
		name:'arr',  
		a: [], 
		inherits: "col",
		is: _.isArray, 
		to: function(v){ 
			if(type.args(v)) return _.toArray(v); 
			if(type.arr(v)) return v; 
			if(type.obj(v)) return _.map(v, function(v){ return v; }); 
			if(type.fn(v)){ 
				if(type.arr(v())) return v(); 
			};
			if(type.def(v)) return _.toArray(arguments); 
			return false;
		},
		can: can("arr"),
		methods : {

			push: function(a, b){return a.push(b);},
			pop: function(a){return a.pop();},
			unshift: function(a, b){return a.unshift(b);},
			shift: function(a){return a.shift();},
			slice: function(a, b, c){return a.slice(b,c);},
			splice: function(a){return a.splice.apply(this, arguments);},
			sort: function(a, b){return a.sort(b);},
		
			range: _.range,
			toObject: _.object,
			zip: _.zip,
			indexOf: _.indexOf,
			lastIndexOf: _.lastIndexOf,
			
			first: _.first,
			last: _.last,
			initial: _.initial,
			rest: _.rest,
			compact: _.compact,
			flatten: _.flatten,
			without: _.without,
			union: _.union,
			intersection: _.intersection,
			difference: _.difference,
			unique: _.unique,
			sortedIndex: _.sortedIndex,
			
			average: function (arr) {
				return _.reduce(arr, function(memo, num) {
					return memo + num;
				}, 0) / arr.length;
			}

		}
	});

	type.extend({
		name:'args',  
		a: (function(){ return arguments; })(),
		inherits: 'arr',
		is: function(v){
			return (v != null) // since undefined == null
	        	&& ((Object.prototype.toString.call(v) == '[object Arguments]') 
	        	|| (!!v.callee)); // fixes for ie8 non-strict-mode
    	},
    	can: function(v){ return type.args.is(v) || type.arr(v); },
		to: function(){ return arguments; },
		methods: {
			toArray: function(a){ return Array.prototype.slice.call(a); },
			sub: function(a, b){ return type.arr.to(a).slice((b||1), a.length ); },
			pre: function(a, b){ return type.arr.to(a).unshift(b); }
		}
	});

	type.extend({
	 	name:'obj',  
	 	a: {}, 
	 	inherits: "col",
		is: function(v){ return _.isObject(v) && !type.arr(v); }, 
		to: function(v, w){ 
			if(type.obj(v)) return v;
			if(type.arr(v)){ return (type.arr(w)) ? _.object(v,w) : _.extend({}, v); };
			if(type.fn(v)){ if(type.obj(v())){ return v(); }; };
			if(type.def(v)){ return {a: value(v)}; };
			return false;
		},
		can: can("obj"),

		methods: {
			extend: _.extend,
			clone: _.clone,
			
			pairs: _.pairs,
			invert: _.invert,
			functions: _.functions,
			pick: _.pick,
			omit: _.omit,
			defaults: _.defaults,
			tap: _.tap,
		
			keys: _.keys,
			values: _.values,
			isEqual: _.isEqual,
			isEmpty: _.isEmpty,
			isElement: _.isElement,
			has: _.has,
			result: _.result,

			isSubobject: function (small, big) { return _.isEqual(small, _.pick(big, _.keys(small))); }
			
		}
	});


	// /** FUNCTIONAL TYPES **/

	type.extend({
		name:'fn',  
		a: noop, 
		is: _.isFunction, 
		can: function(v){ return _.isFunction(v); }, 
		to: function(v){ 
			if(type.fn.is(v)) return v; 
			return type.fn.a(); 
		},
		methods: {
			noop: noop,
			
			compose: _.compose,
			identity: _.identity,
			bind: _.bind,
			memorize: _.memorize,
			delay: _.delay,
			defer: _.defer,
			throttle: _.throttle,
			debounce: _.debounce,
			once: _.once,
			after: _.after,
			wrap: _.wrap,
			times: _.times,

			always: function(v){ return function(){ return v; }; },
			sample: function(func, rate) {
				var context, args;
				return function() {
					context = this; args = arguments;
					if (Math.random() < rate){
						func.apply(context, args);
					}
				};
			}
	
			//call: function(a){ return a.call.apply(a, arguments); },
			//apply: function(a,b){ return this.a().apply(a,b); },
			//callIf: function(v){ if(Type.is('true',v) || Type.types.is(v)) return this.a().call(arguments); return false; },
			//proxy: function(c){ return function(){ return this.a.apply(c, arguments); } },

		}
	});


	// Regex

	type.extend({
		name:'reg',  
		a: new RegExp(), 
		is: _.isRegExp, 
		to: function(a,b){ return new RegExp(a,b); },
		can: can("reg")
	});

	// Time

	type.extend({
		name:'date',  
		a: new Date(), 
		is: _.isDate, 
		to: function(v){ return new Date(v); },
		can: can("date"),
		methods: {
			shortMonth: function (index){
				var monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]; 
				return monthNames[index] || monthNames;
			},
			day: function(index){
				var days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
				return days[index] || days;
			},
			shortDay: function(index){
				var days=['Su','M','Tu','W','Th','F','Sa'];
				return days[index] || days;
			}
		}
	});


	// Compound

	type.extend({
		name:'vec',  
		a: [0],  
		is: function(v, w){ 
			var len;
			if (type.int(v)) len = v, v = w;
			if (type.arr(v)) {
				if(_.all(v, function(v){ return type.num(v); }) ) {
					if (type.def(len)) {
						if(v.length === len) { return true; };
					} else {
						return true;
					};
				};
			};
			return false; 
		},
		to: function(v, w){ 
			var len;
			if (type.int(v)) len = v, v = w;
			if (type.arr(v)) {
				var map = _.map(v, function(v){ return type.num(v); });
				if (type.def(len)) { return map.slice(0, len); }
				return map;
			}
			if (_.all(arguments, function(val){ return type.num(val); })) {
				return _.map(arguments, value);				
			}
			return type.vec.a(); 
		},
    	can: function(a){
    		return type.vec(a);
    	}
	});


	type.extend({
	 	name:'geo',  
	 	a: {lat:0, long:0}, 
	 	is: function(v){ 
	 		if (type.obj(v)) {
	 			if(v.hasOwnProperty('lat') && v.hasOwnProperty('long')) {
	 				if(type.num(v.lat) && type.num(v.long)) {
	 					return true;
	 				}
	 			}
	 		}
	 		return false; 
	 	}, 
		to: function(v, w){ 
			if(type.num(w) && type.num(v)) return {lat:v, long:w}; 
			if(type.geo(v)) return v;
			if(type.obj(v)) return _.extend(type.geo.a(), v); 
			if(type.arr(v)){ 
				if(v.length === 2) return {lat: a[0], long:a[1]};
			}
			if(type.fn(v)){ if(type.geo(v())) return v(); };
			return type.geo.a();
		},
		can: can("geo")
	});


	type.extend({
		name:'json',  
		a: {}, 
		is: function(v){ 
			if(type.str(v)) return type.obj(JSON.parse(v)); 
			if(type.obj(v) || type.arr(v)) return type.str(JSON.stringify(v));
			return false;
		}, 
		to: function(v){
			if(type.str(v)) return JSON.parse(v); 
			if(type.obj(v) || type.arr(v)) return JSON.stringify(v);
			return this.a();
		},
		methods: {
			stringify : JSON.stringify,
			parse: JSON.parse
		}
	});


	type.extend({
		name:'que',  
		a: [], 
		is: function(v){ 
			return type.arr(v) 
				&& _.all(v, function(v){ return type.fn(v); }); 
		}, 
		to: function(v){ 
			if(type.que(v)) return v; 
			if(type.fn(v)) return [v]; 
			return [];
		},
		can: can("que")
	});


	type['boolean'] = type.bool;
    type['string'] = type.str;
    type['number'] = type.num;
    type['object'] = type.obj;
    type['array'] = type.arr;
    type['function'] = type.fn;



	return type;
    
})); // ...and fade to black