/*	VCO.Util
	Class of utilities
================================================== */

VCO.Util = {
	
	extend: function (/*Object*/ dest) /*-> Object*/ {	// merge src properties into dest
		var sources = Array.prototype.slice.call(arguments, 1);
		for (var j = 0, len = sources.length, src; j < len; j++) {
			src = sources[j] || {};
			for (var i in src) {
				if (src.hasOwnProperty(i)) {
					dest[i] = src[i];
				}
			}
		}
		return dest;
	},
	
	setOptions: function (obj, options) {
		obj.options = VCO.Util.extend({}, obj.options, options);
		if (obj.options.uniqueid === "") {
			obj.options.uniqueid = VCO.Util.unique_ID(6);
		}
	},
	
	convertUnixTime: function(str) {
		var _date, _months, _year, _month, _day, _time, _date_array = [],
			_date_str = {
				ymd:"",
				time:"",
				time_array:[],
				date_array:[],
				full_array:[]
			};
			
		_date_str.ymd = str.split(" ")[0];
		_date_str.time = str.split(" ")[1];
		_date_str.date_array = _date_str.ymd.split("-");
		_date_str.time_array = _date_str.time.split(":");
		_date_str.full_array = _date_str.date_array.concat(_date_str.time_array)
		
		for(var i = 0; i < _date_str.full_array.length; i++) {
			_date_array.push( parseInt(_date_str.full_array[i]) )
		}

		_date = new Date(_date_array[0], _date_array[1], _date_array[2], _date_array[3], _date_array[4], _date_array[5]);
		_months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		_year = _date.getFullYear();
		_month = _months[_date.getMonth()];
		_day = _date.getDate();
		_time = _month + ', ' + _day + ' ' + _year;
		
		return _time;
	},
	
	setData: function (obj, data) {
		obj.data = VCO.Util.extend({}, obj.data, data);
		if (obj.data.uniqueid === "") {
			obj.data.uniqueid = VCO.Util.unique_ID(6);
		}
	},
	
	mergeData: function(data_main, data_to_merge) {
		var x;
		for (x in data_to_merge) {
			if (Object.prototype.hasOwnProperty.call(data_to_merge, x)) {
				data_main[x] = data_to_merge[x];
			}
		}
		return data_main;
	},
	
	stamp: (function () {
		var lastId = 0, key = '_vco_id';
		

		return function (/*Object*/ obj) {
			obj[key] = obj[key] || ++lastId;
			return obj[key];
		};
	}()),
	
	isArray: (function () {
	    // Use compiler's own isArray when available
	    if (Array.isArray) {
	        return Array.isArray;
	    }
 
	    // Retain references to variables for performance
	    // optimization
	    var objectToStringFn = Object.prototype.toString,
	        arrayToStringResult = objectToStringFn.call([]);
 
	    return function (subject) {
	        return objectToStringFn.call(subject) === arrayToStringResult;
	    };
	}()),
	
	unique_ID: function(size, prefix) {
		
		var getRandomNumber = function(range) {
			return Math.floor(Math.random() * range);
		};

		var getRandomChar = function() {
			var chars = "abcdefghijklmnopqurstuvwxyz";
			return chars.substr( getRandomNumber(32), 1 );
		};

		var randomID = function(size) {
			var str = "";
			for(var i = 0; i < size; i++) {
				str += getRandomChar();
			}
			return str;
		};
		
		if (prefix) {
			return prefix + "-" + randomID(size);
		} else {
			return "vco-" + randomID(size);
		}
	},
	
	htmlify: function(str) {
		//if (str.match(/<\s*p[^>]*>([^<]*)<\s*\/\s*p\s*>/)) {
		if (str.match(/<p>[\s\S]*?<\/p>/)) {
			
			return str;
		} else {
			return "<p>" + str + "</p>";
		}
	},
	
	getParamString: function (obj) {
		var params = [];
		for (var i in obj) {
			if (obj.hasOwnProperty(i)) {
				params.push(i + '=' + obj[i]);
			}
		}
		return '?' + params.join('&');
	},
	
	formatNum: function (num, digits) {
		var pow = Math.pow(10, digits || 5);
		return Math.round(num * pow) / pow;
	},
	
	falseFn: function () {
		return false;
	},
	
	requestAnimFrame: (function () {
		function timeoutDefer(callback) {
			window.setTimeout(callback, 1000 / 60);
		}

		var requestFn = window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			timeoutDefer;

		return function (callback, context, immediate, contextEl) {
			callback = context ? VCO.Util.bind(callback, context) : callback;
			if (immediate && requestFn === timeoutDefer) {
				callback();
			} else {
				requestFn(callback, contextEl);
			}
		};
	}()),
	
	bind: function (/*Function*/ fn, /*Object*/ obj) /*-> Object*/ {
		return function () {
			return fn.apply(obj, arguments);
		};
	},
	
	template: function (str, data) {
		return str.replace(/\{ *([\w_]+) *\}/g, function (str, key) {
			var value = data[key];
			if (!data.hasOwnProperty(key)) {
				throw new Error('No value provided for variable ' + str);
			}
			return value;
		});
	},
	
	hexToRgb: function(hex) {
	    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
	    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
	        return r + r + g + g + b + b;
	    });

	    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	    return result ? {
	        r: parseInt(result[1], 16),
	        g: parseInt(result[2], 16),
	        b: parseInt(result[3], 16)
	    } : null;
	},
	
	ratio: {
		square: function(size) {
			var s = {
				w: 0,
				h: 0
			}
			if (size.w > size.h && size.h > 0) {
				s.h = size.h;
				s.w = size.h;
			} else {
				s.w = size.w;
				s.h = size.w;
			}
			return s;
		},
		
		r16_9: function(size) {
			if (size.w !== null && size.w !== "") {
				return Math.round((size.w / 16) * 9);
			} else if (size.h !== null && size.h !== "") {
				return Math.round((size.h / 9) * 16);
			} else {
				return 0;
			}
		},
		r4_3: function(size) {
			if (size.w !== null && size.w !== "") {
				return Math.round((size.w / 4) * 3);
			} else if (size.h !== null && size.h !== "") {
				return Math.round((size.h / 3) * 4);
			}
		}
	},
	getObjectAttributeByIndex: function(obj, index) {
		if(typeof obj != 'undefined') {
			var i = 0;
			for (var attr in obj){
				if (index === i){
					return obj[attr];
				}
				i++;
			}
			return "";
		} else {
			return "";
		}
		
	},
	getUrlVars: function(string) {
		var str,
			vars = [],
			hash,
			hashes;
		
		str = string.toString();
		
		if (str.match('&#038;')) { 
			str = str.replace("&#038;", "&");
		} else if (str.match('&#38;')) {
			str = str.replace("&#38;", "&");
		} else if (str.match('&amp;')) {
			str = str.replace("&amp;", "&");
		}
		
		hashes = str.slice(str.indexOf('?') + 1).split('&');
		
		for(var i = 0; i < hashes.length; i++) {
			hash = hashes[i].split('=');
			vars.push(hash[0]);
			vars[hash[0]] = hash[1];
		}
		
		
		return vars;
	}
};