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
	
	isEven: function(n) {
	  return n == parseFloat(n)? !(n%2) : void 0;
	},
	
	findArrayNumberByUniqueID: function(id, array, prop, defaultVal) {
		var _n = defaultVal || 0;
		
		for (var i = 0; i < array.length; i++) {
			if (array[i].data[prop] == id) {
				_n = i;
			}
		};
		
		return _n;
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
	
    getRandomNumber: function(range) {
   		return Math.floor(Math.random() * range);
   	},
		
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
	
	/*	* Turns plain text links into real links
	================================================== */
	linkify: function(text,targets,is_touch) {
		
		// http://, https://, ftp://
		var urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;

		// www. sans http:// or https://
		var pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;

		// Email addresses
		var emailAddressPattern = /(([a-zA-Z0-9_\-\.]+)@[a-zA-Z_]+?(?:\.[a-zA-Z]{2,6}))+/gim;
		

		return text
			.replace(urlPattern, "<a target='_blank' href='$&' onclick='void(0)'>$&</a>")
			.replace(pseudoUrlPattern, "$1<a target='_blank' onclick='void(0)' href='http://$2'>$2</a>")
			.replace(emailAddressPattern, "<a target='_blank' onclick='void(0)' href='mailto:$1'>$1</a>");
	},
	
	unlinkify: function(text) {
		if(!text) return text;
		text = text.replace(/<a\b[^>]*>/i,"");
		text = text.replace(/<\/a>/i, "");
		return text;
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
	},

	trim: function(str) {
		return str.replace(/^\s+|\s+$/g, '');
	},

	slugify: function(str) {
		// borrowed from http://stackoverflow.com/a/5782563/102476
		str = VCO.Util.trim(str);
		str = str.toLowerCase();

		// remove accents, swap ñ for n, etc
		var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
		var to   = "aaaaaeeeeeiiiiooooouuuunc------";
		for (var i=0, l=from.length ; i<l ; i++) {
		str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
		}

		str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
		.replace(/\s+/g, '-') // collapse whitespace and replace by -
		.replace(/-+/g, '-'); // collapse dashes

		str = str.replace(/^([0-9])/,'_$1');
		return str;
	},
	maxDepth: function(ary) {
		// given a sorted array of 2-tuples of numbers, count how many "deep" the items are.
		// that is, what is the maximum number of tuples that occupy any one moment
		// each tuple should also be sorted
		var stack = [];
		var max_depth = 0;
		for (var i = 0; i < ary.length; i++) {

			stack.push(ary[i]);
			if (stack.length > 1) {
				var top = stack[stack.length - 1]
				var bottom_idx = -1;
				for (var j = 0; j < stack.length - 1; j++) {
					if (stack[j][1] < top[0]) {
						bottom_idx = j;
					}
				};
				if (bottom_idx >= 0) {
					stack = stack.slice(bottom_idx + 1);
				}

			}

			if (stack.length > max_depth) {
				max_depth = stack.length;
			}
		};
		return max_depth;
	},

	pad: function (val, len) {
		val = String(val);
		len = len || 2;
		while (val.length < len) val = "0" + val;
		return val;
	},

	makeGoogleMapsEmbedURL: function(url,api_key) {
    var Streetview = false;

    function determineMapMode(url){
          function parseDisplayMode(display_mode, param_string) {
            // Set the zoom param
            if (display_mode.slice(-1) == "z") {
                param_string["zoom"] = display_mode;
            // Set the maptype to something other than "roadmap"
            } else if (display_mode.slice(-1) == "m") {
                // TODO: make this somehow interpret the correct zoom level
                // until then fake it by using Google's default zoom level
                param_string["zoom"] = 14;
                param_string["maptype"] = "satellite";
            // Set all the fun streetview params
            } else if (display_mode.slice(-1) == "t") {
                Streetview = true;
                // streetview uses "location" instead of "center"
                // "place" mode doesn't have the center param, so we may need to grab that now
                if (mapmode == "place") {
                    var center = url.match(regexes["place"])[3] + "," + url.match(regexes["place"])[4];
                } else {
                    var center = param_string["center"];
                    delete param_string["center"];
                }
                // Clear out all the other params -- this is so hacky
                param_string = {};
                param_string["location"] = center;
                streetview_params = display_mode.split(",");
                for (param in param_defs["streetview"]) {
                    var i = parseInt(param) + 1;
                    param_string[param_defs["streetview"][param]] = streetview_params[i].slice(0,-1);
                }

            }
            return param_string;
          }
          function determineMapModeURL(mapmode, match) {
            var param_string = {};
            var url_root = match[1], display_mode = match[match.length - 1];
            for (param in param_defs[mapmode]) {
                // skip first 2 matches, because they reflect the URL and not params
                var i = parseInt(param)+2;
                if (param_defs[mapmode][param] == "center") {
                  param_string[param_defs[mapmode][param]] = match[i] + "," + match[++i];
                } else {
                  param_string[param_defs[mapmode][param]] = match[i];
                }
            }

            param_string = parseDisplayMode(display_mode, param_string);
            param_string["key"] = api_key;
            if (Streetview == true) {
                mapmode = "streetview";
            } else {
            }
            return (url_root + "/embed/v1/" + mapmode + VCO.Util.getParamString(param_string));
        }


        mapmode = "view";
        if (url.match(regexes["place"])) {
            mapmode = "place";
        } else if (url.match(regexes["directions"])) {
            mapmode = "directions";
        } else if (url.match(regexes["search"])) {
            mapmode = "search";
        }
        return determineMapModeURL(mapmode, url.match(regexes[mapmode]));

    }

    // These must be in the order they appear in the original URL
    // "key" param not included since it's not in the URL structure
    // Streetview "location" param not included since it's captured as "center"
    // Place "center" param ...um...
    var param_defs = {
        "view": ["center"],
        "place": ["q", "center"],
        "directions": ["origin", "destination", "center"],
        "search": ["q", "center"],
        "streetview": ["fov", "heading", "pitch"]
    };
    // Set up regex parts to make updating these easier if Google changes them
    var root_url_regex = /(https:\/\/.+google.+?\/maps)/;
    var coords_regex = /@([-\d.]+),([-\d.]+)/;
    var addy_regex = /([\w\W]+)/;

    // Data doesn't seem to get used for anything
    var data_regex = /data=[\S]*/;

    // Capture the parameters that determine what map tiles to use
    // In roadmap view, mode URLs include zoom paramater (e.g. "14z")
    // In satellite (or "earth") view, URLs include a distance parameter (e.g. "84511m")
    // In streetview, URLs include paramaters like "3a,75y,49.76h,90t" -- see http://stackoverflow.com/a/22988073
    var display_mode_regex = /,((?:[-\d.]+[zmayht],?)*)/;

		var regexes = {
        view: new RegExp(root_url_regex.source + "/" + coords_regex.source + display_mode_regex.source),
        place: new RegExp(root_url_regex.source + "/place/" + addy_regex.source + "/" + coords_regex.source + display_mode_regex.source),
        directions: new RegExp(root_url_regex.source + "/dir/" + addy_regex.source + "/" + addy_regex.source + "/" + coords_regex.source + display_mode_regex.source),
        search: new RegExp(root_url_regex.source + "/search/" + addy_regex.source + "/" + coords_regex.source + display_mode_regex.source)
    };
    return determineMapMode(url);
	}
};
