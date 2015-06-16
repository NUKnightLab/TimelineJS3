/*!
	VCO
*/

(function (root) {
	root.VCO = {
		VERSION: '0.1',
		_originalL: root.VCO
	};
}(this));

/*	VCO.Debug
	Debug mode
================================================== */
VCO.debug = true;



/*	VCO.Bind
================================================== */
VCO.Bind = function (/*Function*/ fn, /*Object*/ obj) /*-> Object*/ {
	return function () {
		return fn.apply(obj, arguments);
	};
};



/* Trace (console.log)
================================================== */
trace = function( msg ) {
	if (VCO.debug) {
		if (window.console) {
			console.log(msg);
		} else if ( typeof( jsTrace ) != 'undefined' ) {
			jsTrace.send( msg );
		} else {
			//alert(msg);
		}
	}
}

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


// Expects VCO to be visible in scope

;(function(VCO){
    /* Zepto v1.1.2-15-g59d3fe5 - zepto event ajax form ie - zeptojs.com/license */

    var Zepto = (function() {
      var undefined, key, $, classList, emptyArray = [], slice = emptyArray.slice, filter = emptyArray.filter,
        document = window.document,
        elementDisplay = {}, classCache = {},
        cssNumber = { 'column-count': 1, 'columns': 1, 'font-weight': 1, 'line-height': 1,'opacity': 1, 'z-index': 1, 'zoom': 1 },
        fragmentRE = /^\s*<(\w+|!)[^>]*>/,
        singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
        tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
        rootNodeRE = /^(?:body|html)$/i,
        capitalRE = /([A-Z])/g,

        // special attributes that should be get/set via method calls
        methodAttributes = ['val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset'],

        adjacencyOperators = [ 'after', 'prepend', 'before', 'append' ],
        table = document.createElement('table'),
        tableRow = document.createElement('tr'),
        containers = {
          'tr': document.createElement('tbody'),
          'tbody': table, 'thead': table, 'tfoot': table,
          'td': tableRow, 'th': tableRow,
          '*': document.createElement('div')
        },
        readyRE = /complete|loaded|interactive/,
        classSelectorRE = /^\.([\w-]+)$/,
        idSelectorRE = /^#([\w-]*)$/,
        simpleSelectorRE = /^[\w-]*$/,
        class2type = {},
        toString = class2type.toString,
        zepto = {},
        camelize, uniq,
        tempParent = document.createElement('div'),
        propMap = {
          'tabindex': 'tabIndex',
          'readonly': 'readOnly',
          'for': 'htmlFor',
          'class': 'className',
          'maxlength': 'maxLength',
          'cellspacing': 'cellSpacing',
          'cellpadding': 'cellPadding',
          'rowspan': 'rowSpan',
          'colspan': 'colSpan',
          'usemap': 'useMap',
          'frameborder': 'frameBorder',
          'contenteditable': 'contentEditable'
        },
        isArray = Array.isArray ||
          function(object){ return object instanceof Array }

      zepto.matches = function(element, selector) {
        if (!selector || !element || element.nodeType !== 1) return false
        var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector ||
                              element.oMatchesSelector || element.matchesSelector
        if (matchesSelector) return matchesSelector.call(element, selector)
        // fall back to performing a selector:
        var match, parent = element.parentNode, temp = !parent
        if (temp) (parent = tempParent).appendChild(element)
        match = ~zepto.qsa(parent, selector).indexOf(element)
        temp && tempParent.removeChild(element)
        return match
      }

      function type(obj) {
        return obj == null ? String(obj) :
          class2type[toString.call(obj)] || "object"
      }

      function isFunction(value) { return type(value) == "function" }
      function isWindow(obj)     { return obj != null && obj == obj.window }
      function isDocument(obj)   { return obj != null && obj.nodeType == obj.DOCUMENT_NODE }
      function isObject(obj)     { return type(obj) == "object" }
      function isPlainObject(obj) {
        return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
      }
      function likeArray(obj) { return typeof obj.length == 'number' }

      function compact(array) { return filter.call(array, function(item){ return item != null }) }
      function flatten(array) { return array.length > 0 ? $.fn.concat.apply([], array) : array }
      camelize = function(str){ return str.replace(/-+(.)?/g, function(match, chr){ return chr ? chr.toUpperCase() : '' }) }
      function dasherize(str) {
        return str.replace(/::/g, '/')
               .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
               .replace(/([a-z\d])([A-Z])/g, '$1_$2')
               .replace(/_/g, '-')
               .toLowerCase()
      }
      uniq = function(array){ return filter.call(array, function(item, idx){ return array.indexOf(item) == idx }) }

      function classRE(name) {
        return name in classCache ?
          classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'))
      }

      function maybeAddPx(name, value) {
        return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value
      }

      function defaultDisplay(nodeName) {
        var element, display
        if (!elementDisplay[nodeName]) {
          element = document.createElement(nodeName)
          document.body.appendChild(element)
          display = getComputedStyle(element, '').getPropertyValue("display")
          element.parentNode.removeChild(element)
          display == "none" && (display = "block")
          elementDisplay[nodeName] = display
        }
        return elementDisplay[nodeName]
      }

      function children(element) {
        return 'children' in element ?
          slice.call(element.children) :
          $.map(element.childNodes, function(node){ if (node.nodeType == 1) return node })
      }

      // `$.zepto.fragment` takes a html string and an optional tag name
      // to generate DOM nodes nodes from the given html string.
      // The generated DOM nodes are returned as an array.
      // This function can be overriden in plugins for example to make
      // it compatible with browsers that don't support the DOM fully.
      zepto.fragment = function(html, name, properties) {
        var dom, nodes, container

        // A special case optimization for a single tag
        if (singleTagRE.test(html)) dom = $(document.createElement(RegExp.$1))

        if (!dom) {
          if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>")
          if (name === undefined) name = fragmentRE.test(html) && RegExp.$1
          if (!(name in containers)) name = '*'

          container = containers[name]
          container.innerHTML = '' + html
          dom = $.each(slice.call(container.childNodes), function(){
            container.removeChild(this)
          })
        }

        if (isPlainObject(properties)) {
          nodes = $(dom)
          $.each(properties, function(key, value) {
            if (methodAttributes.indexOf(key) > -1) nodes[key](value)
            else nodes.attr(key, value)
          })
        }

        return dom
      }

      // `$.zepto.Z` swaps out the prototype of the given `dom` array
      // of nodes with `$.fn` and thus supplying all the Zepto functions
      // to the array. Note that `__proto__` is not supported on Internet
      // Explorer. This method can be overriden in plugins.
      zepto.Z = function(dom, selector) {
        dom = dom || []
        dom.__proto__ = $.fn
        dom.selector = selector || ''
        return dom
      }

      // `$.zepto.isZ` should return `true` if the given object is a Zepto
      // collection. This method can be overriden in plugins.
      zepto.isZ = function(object) {
        return object instanceof zepto.Z
      }

      // `$.zepto.init` is Zepto's counterpart to jQuery's `$.fn.init` and
      // takes a CSS selector and an optional context (and handles various
      // special cases).
      // This method can be overriden in plugins.
      zepto.init = function(selector, context) {
        var dom
        // If nothing given, return an empty Zepto collection
        if (!selector) return zepto.Z()
        // Optimize for string selectors
        else if (typeof selector == 'string') {
          selector = selector.trim()
          // If it's a html fragment, create nodes from it
          // Note: In both Chrome 21 and Firefox 15, DOM error 12
          // is thrown if the fragment doesn't begin with <
          if (selector[0] == '<' && fragmentRE.test(selector))
            dom = zepto.fragment(selector, RegExp.$1, context), selector = null
          // If there's a context, create a collection on that context first, and select
          // nodes from there
          else if (context !== undefined) return $(context).find(selector)
          // If it's a CSS selector, use it to select nodes.
          else dom = zepto.qsa(document, selector)
        }
        // If a function is given, call it when the DOM is ready
        else if (isFunction(selector)) return $(document).ready(selector)
        // If a Zepto collection is given, just return it
        else if (zepto.isZ(selector)) return selector
        else {
          // normalize array if an array of nodes is given
          if (isArray(selector)) dom = compact(selector)
          // Wrap DOM nodes.
          else if (isObject(selector))
            dom = [selector], selector = null
          // If it's a html fragment, create nodes from it
          else if (fragmentRE.test(selector))
            dom = zepto.fragment(selector.trim(), RegExp.$1, context), selector = null
          // If there's a context, create a collection on that context first, and select
          // nodes from there
          else if (context !== undefined) return $(context).find(selector)
          // And last but no least, if it's a CSS selector, use it to select nodes.
          else dom = zepto.qsa(document, selector)
        }
        // create a new Zepto collection from the nodes found
        return zepto.Z(dom, selector)
      }

      // `$` will be the base `Zepto` object. When calling this
      // function just call `$.zepto.init, which makes the implementation
      // details of selecting nodes and creating Zepto collections
      // patchable in plugins.
      $ = function(selector, context){
        return zepto.init(selector, context)
      }

      function extend(target, source, deep) {
        for (key in source)
          if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
            if (isPlainObject(source[key]) && !isPlainObject(target[key]))
              target[key] = {}
            if (isArray(source[key]) && !isArray(target[key]))
              target[key] = []
            extend(target[key], source[key], deep)
          }
          else if (source[key] !== undefined) target[key] = source[key]
      }

      // Copy all but undefined properties from one or more
      // objects to the `target` object.
      $.extend = function(target){
        var deep, args = slice.call(arguments, 1)
        if (typeof target == 'boolean') {
          deep = target
          target = args.shift()
        }
        args.forEach(function(arg){ extend(target, arg, deep) })
        return target
      }

      // `$.zepto.qsa` is Zepto's CSS selector implementation which
      // uses `document.querySelectorAll` and optimizes for some special cases, like `#id`.
      // This method can be overriden in plugins.
      zepto.qsa = function(element, selector){
        var found,
            maybeID = selector[0] == '#',
            maybeClass = !maybeID && selector[0] == '.',
            nameOnly = maybeID || maybeClass ? selector.slice(1) : selector, // Ensure that a 1 char tag name still gets checked
            isSimple = simpleSelectorRE.test(nameOnly)
        return (isDocument(element) && isSimple && maybeID) ?
          ( (found = element.getElementById(nameOnly)) ? [found] : [] ) :
          (element.nodeType !== 1 && element.nodeType !== 9) ? [] :
          slice.call(
            isSimple && !maybeID ?
              maybeClass ? element.getElementsByClassName(nameOnly) : // If it's simple, it could be a class
              element.getElementsByTagName(selector) : // Or a tag
              element.querySelectorAll(selector) // Or it's not simple, and we need to query all
          )
      }

      function filtered(nodes, selector) {
        return selector == null ? $(nodes) : $(nodes).filter(selector)
      }

      $.contains = function(parent, node) {
        return parent !== node && parent.contains(node)
      }

      function funcArg(context, arg, idx, payload) {
        return isFunction(arg) ? arg.call(context, idx, payload) : arg
      }

      function setAttribute(node, name, value) {
        value == null ? node.removeAttribute(name) : node.setAttribute(name, value)
      }

      // access className property while respecting SVGAnimatedString
      function className(node, value){
        var klass = node.className,
            svg   = klass && klass.baseVal !== undefined

        if (value === undefined) return svg ? klass.baseVal : klass
        svg ? (klass.baseVal = value) : (node.className = value)
      }

      // "true"  => true
      // "false" => false
      // "null"  => null
      // "42"    => 42
      // "42.5"  => 42.5
      // "08"    => "08"
      // JSON    => parse if valid
      // String  => self
      function deserializeValue(value) {
        var num
        try {
          return value ?
            value == "true" ||
            ( value == "false" ? false :
              value == "null" ? null :
              !/^0/.test(value) && !isNaN(num = Number(value)) ? num :
              /^[\[\{]/.test(value) ? $.parseJSON(value) :
              value )
            : value
        } catch(e) {
          return value
        }
      }

      $.type = type
      $.isFunction = isFunction
      $.isWindow = isWindow
      $.isArray = isArray
      $.isPlainObject = isPlainObject

      $.isEmptyObject = function(obj) {
        var name
        for (name in obj) return false
        return true
      }

      $.inArray = function(elem, array, i){
        return emptyArray.indexOf.call(array, elem, i)
      }

      $.camelCase = camelize
      $.trim = function(str) {
        return str == null ? "" : String.prototype.trim.call(str)
      }

      // plugin compatibility
      $.uuid = 0
      $.support = { }
      $.expr = { }

      $.map = function(elements, callback){
        var value, values = [], i, key
        if (likeArray(elements))
          for (i = 0; i < elements.length; i++) {
            value = callback(elements[i], i)
            if (value != null) values.push(value)
          }
        else
          for (key in elements) {
            value = callback(elements[key], key)
            if (value != null) values.push(value)
          }
        return flatten(values)
      }

      $.each = function(elements, callback){
        var i, key
        if (likeArray(elements)) {
          for (i = 0; i < elements.length; i++)
            if (callback.call(elements[i], i, elements[i]) === false) return elements
        } else {
          for (key in elements)
            if (callback.call(elements[key], key, elements[key]) === false) return elements
        }

        return elements
      }

      $.grep = function(elements, callback){
        return filter.call(elements, callback)
      }

      if (window.JSON) $.parseJSON = JSON.parse

      // Populate the class2type map
      $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
        class2type[ "[object " + name + "]" ] = name.toLowerCase()
      })

      // Define methods that will be available on all
      // Zepto collections
      $.fn = {
        // Because a collection acts like an array
        // copy over these useful array functions.
        forEach: emptyArray.forEach,
        reduce: emptyArray.reduce,
        push: emptyArray.push,
        sort: emptyArray.sort,
        indexOf: emptyArray.indexOf,
        concat: emptyArray.concat,

        // `map` and `slice` in the jQuery API work differently
        // from their array counterparts
        map: function(fn){
          return $($.map(this, function(el, i){ return fn.call(el, i, el) }))
        },
        slice: function(){
          return $(slice.apply(this, arguments))
        },

        ready: function(callback){
          // need to check if document.body exists for IE as that browser reports
          // document ready when it hasn't yet created the body element
          if (readyRE.test(document.readyState) && document.body) callback($)
          else document.addEventListener('DOMContentLoaded', function(){ callback($) }, false)
          return this
        },
        get: function(idx){
          return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length]
        },
        toArray: function(){ return this.get() },
        size: function(){
          return this.length
        },
        remove: function(){
          return this.each(function(){
            if (this.parentNode != null)
              this.parentNode.removeChild(this)
          })
        },
        each: function(callback){
          emptyArray.every.call(this, function(el, idx){
            return callback.call(el, idx, el) !== false
          })
          return this
        },
        filter: function(selector){
          if (isFunction(selector)) return this.not(this.not(selector))
          return $(filter.call(this, function(element){
            return zepto.matches(element, selector)
          }))
        },
        add: function(selector,context){
          return $(uniq(this.concat($(selector,context))))
        },
        is: function(selector){
          return this.length > 0 && zepto.matches(this[0], selector)
        },
        not: function(selector){
          var nodes=[]
          if (isFunction(selector) && selector.call !== undefined)
            this.each(function(idx){
              if (!selector.call(this,idx)) nodes.push(this)
            })
          else {
            var excludes = typeof selector == 'string' ? this.filter(selector) :
              (likeArray(selector) && isFunction(selector.item)) ? slice.call(selector) : $(selector)
            this.forEach(function(el){
              if (excludes.indexOf(el) < 0) nodes.push(el)
            })
          }
          return $(nodes)
        },
        has: function(selector){
          return this.filter(function(){
            return isObject(selector) ?
              $.contains(this, selector) :
              $(this).find(selector).size()
          })
        },
        eq: function(idx){
          return idx === -1 ? this.slice(idx) : this.slice(idx, + idx + 1)
        },
        first: function(){
          var el = this[0]
          return el && !isObject(el) ? el : $(el)
        },
        last: function(){
          var el = this[this.length - 1]
          return el && !isObject(el) ? el : $(el)
        },
        find: function(selector){
          var result, $this = this
          if (typeof selector == 'object')
            result = $(selector).filter(function(){
              var node = this
              return emptyArray.some.call($this, function(parent){
                return $.contains(parent, node)
              })
            })
          else if (this.length == 1) result = $(zepto.qsa(this[0], selector))
          else result = this.map(function(){ return zepto.qsa(this, selector) })
          return result
        },
        closest: function(selector, context){
          var node = this[0], collection = false
          if (typeof selector == 'object') collection = $(selector)
          while (node && !(collection ? collection.indexOf(node) >= 0 : zepto.matches(node, selector)))
            node = node !== context && !isDocument(node) && node.parentNode
          return $(node)
        },
        parents: function(selector){
          var ancestors = [], nodes = this
          while (nodes.length > 0)
            nodes = $.map(nodes, function(node){
              if ((node = node.parentNode) && !isDocument(node) && ancestors.indexOf(node) < 0) {
                ancestors.push(node)
                return node
              }
            })
          return filtered(ancestors, selector)
        },
        parent: function(selector){
          return filtered(uniq(this.pluck('parentNode')), selector)
        },
        children: function(selector){
          return filtered(this.map(function(){ return children(this) }), selector)
        },
        contents: function() {
          return this.map(function() { return slice.call(this.childNodes) })
        },
        siblings: function(selector){
          return filtered(this.map(function(i, el){
            return filter.call(children(el.parentNode), function(child){ return child!==el })
          }), selector)
        },
        empty: function(){
          return this.each(function(){ this.innerHTML = '' })
        },
        // `pluck` is borrowed from Prototype.js
        pluck: function(property){
          return $.map(this, function(el){ return el[property] })
        },
        show: function(){
          return this.each(function(){
            this.style.display == "none" && (this.style.display = '')
            if (getComputedStyle(this, '').getPropertyValue("display") == "none")
              this.style.display = defaultDisplay(this.nodeName)
          })
        },
        replaceWith: function(newContent){
          return this.before(newContent).remove()
        },
        wrap: function(structure){
          var func = isFunction(structure)
          if (this[0] && !func)
            var dom   = $(structure).get(0),
                clone = dom.parentNode || this.length > 1

          return this.each(function(index){
            $(this).wrapAll(
              func ? structure.call(this, index) :
                clone ? dom.cloneNode(true) : dom
            )
          })
        },
        wrapAll: function(structure){
          if (this[0]) {
            $(this[0]).before(structure = $(structure))
            var children
            // drill down to the inmost element
            while ((children = structure.children()).length) structure = children.first()
            $(structure).append(this)
          }
          return this
        },
        wrapInner: function(structure){
          var func = isFunction(structure)
          return this.each(function(index){
            var self = $(this), contents = self.contents(),
                dom  = func ? structure.call(this, index) : structure
            contents.length ? contents.wrapAll(dom) : self.append(dom)
          })
        },
        unwrap: function(){
          this.parent().each(function(){
            $(this).replaceWith($(this).children())
          })
          return this
        },
        clone: function(){
          return this.map(function(){ return this.cloneNode(true) })
        },
        hide: function(){
          return this.css("display", "none")
        },
        toggle: function(setting){
          return this.each(function(){
            var el = $(this)
            ;(setting === undefined ? el.css("display") == "none" : setting) ? el.show() : el.hide()
          })
        },
        prev: function(selector){ return $(this.pluck('previousElementSibling')).filter(selector || '*') },
        next: function(selector){ return $(this.pluck('nextElementSibling')).filter(selector || '*') },
        html: function(html){
          return arguments.length === 0 ?
            (this.length > 0 ? this[0].innerHTML : null) :
            this.each(function(idx){
              var originHtml = this.innerHTML
              $(this).empty().append( funcArg(this, html, idx, originHtml) )
            })
        },
        text: function(text){
          return arguments.length === 0 ?
            (this.length > 0 ? this[0].textContent : null) :
            this.each(function(){ this.textContent = (text === undefined) ? '' : ''+text })
        },
        attr: function(name, value){
          var result
          return (typeof name == 'string' && value === undefined) ?
            (this.length == 0 || this[0].nodeType !== 1 ? undefined :
              (name == 'value' && this[0].nodeName == 'INPUT') ? this.val() :
              (!(result = this[0].getAttribute(name)) && name in this[0]) ? this[0][name] : result
            ) :
            this.each(function(idx){
              if (this.nodeType !== 1) return
              if (isObject(name)) for (key in name) setAttribute(this, key, name[key])
              else setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)))
            })
        },
        removeAttr: function(name){
          return this.each(function(){ this.nodeType === 1 && setAttribute(this, name) })
        },
        prop: function(name, value){
          name = propMap[name] || name
          return (value === undefined) ?
            (this[0] && this[0][name]) :
            this.each(function(idx){
              this[name] = funcArg(this, value, idx, this[name])
            })
        },
        data: function(name, value){
          var data = this.attr('data-' + name.replace(capitalRE, '-$1').toLowerCase(), value)
          return data !== null ? deserializeValue(data) : undefined
        },
        val: function(value){
          return arguments.length === 0 ?
            (this[0] && (this[0].multiple ?
               $(this[0]).find('option').filter(function(){ return this.selected }).pluck('value') :
               this[0].value)
            ) :
            this.each(function(idx){
              this.value = funcArg(this, value, idx, this.value)
            })
        },
        offset: function(coordinates){
          if (coordinates) return this.each(function(index){
            var $this = $(this),
                coords = funcArg(this, coordinates, index, $this.offset()),
                parentOffset = $this.offsetParent().offset(),
                props = {
                  top:  coords.top  - parentOffset.top,
                  left: coords.left - parentOffset.left
                }

            if ($this.css('position') == 'static') props['position'] = 'relative'
            $this.css(props)
          })
          if (this.length==0) return null
          var obj = this[0].getBoundingClientRect()
          return {
            left: obj.left + window.pageXOffset,
            top: obj.top + window.pageYOffset,
            width: Math.round(obj.width),
            height: Math.round(obj.height)
          }
        },
        css: function(property, value){
          if (arguments.length < 2) {
            var element = this[0], computedStyle = getComputedStyle(element, '')
            if(!element) return
            if (typeof property == 'string')
              return element.style[camelize(property)] || computedStyle.getPropertyValue(property)
            else if (isArray(property)) {
              var props = {}
              $.each(isArray(property) ? property: [property], function(_, prop){
                props[prop] = (element.style[camelize(prop)] || computedStyle.getPropertyValue(prop))
              })
              return props
            }
          }

          var css = ''
          if (type(property) == 'string') {
            if (!value && value !== 0)
              this.each(function(){ this.style.removeProperty(dasherize(property)) })
            else
              css = dasherize(property) + ":" + maybeAddPx(property, value)
          } else {
            for (key in property)
              if (!property[key] && property[key] !== 0)
                this.each(function(){ this.style.removeProperty(dasherize(key)) })
              else
                css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';'
          }

          return this.each(function(){ this.style.cssText += ';' + css })
        },
        index: function(element){
          return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0])
        },
        hasClass: function(name){
          if (!name) return false
          return emptyArray.some.call(this, function(el){
            return this.test(className(el))
          }, classRE(name))
        },
        addClass: function(name){
          if (!name) return this
          return this.each(function(idx){
            classList = []
            var cls = className(this), newName = funcArg(this, name, idx, cls)
            newName.split(/\s+/g).forEach(function(klass){
              if (!$(this).hasClass(klass)) classList.push(klass)
            }, this)
            classList.length && className(this, cls + (cls ? " " : "") + classList.join(" "))
          })
        },
        removeClass: function(name){
          return this.each(function(idx){
            if (name === undefined) return className(this, '')
            classList = className(this)
            funcArg(this, name, idx, classList).split(/\s+/g).forEach(function(klass){
              classList = classList.replace(classRE(klass), " ")
            })
            className(this, classList.trim())
          })
        },
        toggleClass: function(name, when){
          if (!name) return this
          return this.each(function(idx){
            var $this = $(this), names = funcArg(this, name, idx, className(this))
            names.split(/\s+/g).forEach(function(klass){
              (when === undefined ? !$this.hasClass(klass) : when) ?
                $this.addClass(klass) : $this.removeClass(klass)
            })
          })
        },
        scrollTop: function(value){
          if (!this.length) return
          var hasScrollTop = 'scrollTop' in this[0]
          if (value === undefined) return hasScrollTop ? this[0].scrollTop : this[0].pageYOffset
          return this.each(hasScrollTop ?
            function(){ this.scrollTop = value } :
            function(){ this.scrollTo(this.scrollX, value) })
        },
        scrollLeft: function(value){
          if (!this.length) return
          var hasScrollLeft = 'scrollLeft' in this[0]
          if (value === undefined) return hasScrollLeft ? this[0].scrollLeft : this[0].pageXOffset
          return this.each(hasScrollLeft ?
            function(){ this.scrollLeft = value } :
            function(){ this.scrollTo(value, this.scrollY) })
        },
        position: function() {
          if (!this.length) return

          var elem = this[0],
            // Get *real* offsetParent
            offsetParent = this.offsetParent(),
            // Get correct offsets
            offset       = this.offset(),
            parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset()

          // Subtract element margins
          // note: when an element has margin: auto the offsetLeft and marginLeft
          // are the same in Safari causing offset.left to incorrectly be 0
          offset.top  -= parseFloat( $(elem).css('margin-top') ) || 0
          offset.left -= parseFloat( $(elem).css('margin-left') ) || 0

          // Add offsetParent borders
          parentOffset.top  += parseFloat( $(offsetParent[0]).css('border-top-width') ) || 0
          parentOffset.left += parseFloat( $(offsetParent[0]).css('border-left-width') ) || 0

          // Subtract the two offsets
          return {
            top:  offset.top  - parentOffset.top,
            left: offset.left - parentOffset.left
          }
        },
        offsetParent: function() {
          return this.map(function(){
            var parent = this.offsetParent || document.body
            while (parent && !rootNodeRE.test(parent.nodeName) && $(parent).css("position") == "static")
              parent = parent.offsetParent
            return parent
          })
        }
      }

      // for now
      $.fn.detach = $.fn.remove

      // Generate the `width` and `height` functions
      ;['width', 'height'].forEach(function(dimension){
        var dimensionProperty =
          dimension.replace(/./, function(m){ return m[0].toUpperCase() })

        $.fn[dimension] = function(value){
          var offset, el = this[0]
          if (value === undefined) return isWindow(el) ? el['inner' + dimensionProperty] :
            isDocument(el) ? el.documentElement['scroll' + dimensionProperty] :
            (offset = this.offset()) && offset[dimension]
          else return this.each(function(idx){
            el = $(this)
            el.css(dimension, funcArg(this, value, idx, el[dimension]()))
          })
        }
      })

      function traverseNode(node, fun) {
        fun(node)
        for (var key in node.childNodes) traverseNode(node.childNodes[key], fun)
      }

      // Generate the `after`, `prepend`, `before`, `append`,
      // `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
      adjacencyOperators.forEach(function(operator, operatorIndex) {
        var inside = operatorIndex % 2 //=> prepend, append

        $.fn[operator] = function(){
          // arguments can be nodes, arrays of nodes, Zepto objects and HTML strings
          var argType, nodes = $.map(arguments, function(arg) {
                argType = type(arg)
                return argType == "object" || argType == "array" || arg == null ?
                  arg : zepto.fragment(arg)
              }),
              parent, copyByClone = this.length > 1
          if (nodes.length < 1) return this

          return this.each(function(_, target){
            parent = inside ? target : target.parentNode

            // convert all methods to a "before" operation
            target = operatorIndex == 0 ? target.nextSibling :
                     operatorIndex == 1 ? target.firstChild :
                     operatorIndex == 2 ? target :
                     null

            nodes.forEach(function(node){
              if (copyByClone) node = node.cloneNode(true)
              else if (!parent) return $(node).remove()

              traverseNode(parent.insertBefore(node, target), function(el){
                if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' &&
                   (!el.type || el.type === 'text/javascript') && !el.src)
                  window['eval'].call(window, el.innerHTML)
              })
            })
          })
        }

        // after    => insertAfter
        // prepend  => prependTo
        // before   => insertBefore
        // append   => appendTo
        $.fn[inside ? operator+'To' : 'insert'+(operatorIndex ? 'Before' : 'After')] = function(html){
          $(html)[operator](this)
          return this
        }
      })

      zepto.Z.prototype = $.fn

      // Export internal API functions in the `$.zepto` namespace
      zepto.uniq = uniq
      zepto.deserializeValue = deserializeValue
      $.zepto = zepto

      return $
    })()

    window.Zepto = Zepto
    window.$ === undefined && (window.$ = Zepto)

    ;(function($){
      var $$ = $.zepto.qsa, _zid = 1, undefined,
          slice = Array.prototype.slice,
          isFunction = $.isFunction,
          isString = function(obj){ return typeof obj == 'string' },
          handlers = {},
          specialEvents={},
          focusinSupported = 'onfocusin' in window,
          focus = { focus: 'focusin', blur: 'focusout' },
          hover = { mouseenter: 'mouseover', mouseleave: 'mouseout' }

      specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents'

      function zid(element) {
        return element._zid || (element._zid = _zid++)
      }
      function findHandlers(element, event, fn, selector) {
        event = parse(event)
        if (event.ns) var matcher = matcherFor(event.ns)
        return (handlers[zid(element)] || []).filter(function(handler) {
          return handler
            && (!event.e  || handler.e == event.e)
            && (!event.ns || matcher.test(handler.ns))
            && (!fn       || zid(handler.fn) === zid(fn))
            && (!selector || handler.sel == selector)
        })
      }
      function parse(event) {
        var parts = ('' + event).split('.')
        return {e: parts[0], ns: parts.slice(1).sort().join(' ')}
      }
      function matcherFor(ns) {
        return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)')
      }

      function eventCapture(handler, captureSetting) {
        return handler.del &&
          (!focusinSupported && (handler.e in focus)) ||
          !!captureSetting
      }

      function realEvent(type) {
        return hover[type] || (focusinSupported && focus[type]) || type
      }

      function add(element, events, fn, data, selector, delegator, capture){
        var id = zid(element), set = (handlers[id] || (handlers[id] = []))
        events.split(/\s/).forEach(function(event){
          if (event == 'ready') return $(document).ready(fn)
          var handler   = parse(event)
          handler.fn    = fn
          handler.sel   = selector
          // emulate mouseenter, mouseleave
          if (handler.e in hover) fn = function(e){
            var related = e.relatedTarget
            if (!related || (related !== this && !$.contains(this, related)))
              return handler.fn.apply(this, arguments)
          }
          handler.del   = delegator
          var callback  = delegator || fn
          handler.proxy = function(e){
            e = compatible(e)
            if (e.isImmediatePropagationStopped()) return
            e.data = data
            var result = callback.apply(element, e._args == undefined ? [e] : [e].concat(e._args))
            if (result === false) e.preventDefault(), e.stopPropagation()
            return result
          }
          handler.i = set.length
          set.push(handler)
          if ('addEventListener' in element)
            element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
        })
      }
      function remove(element, events, fn, selector, capture){
        var id = zid(element)
        ;(events || '').split(/\s/).forEach(function(event){
          findHandlers(element, event, fn, selector).forEach(function(handler){
            delete handlers[id][handler.i]
          if ('removeEventListener' in element)
            element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
          })
        })
      }

      $.event = { add: add, remove: remove }

      $.proxy = function(fn, context) {
        if (isFunction(fn)) {
          var proxyFn = function(){ return fn.apply(context, arguments) }
          proxyFn._zid = zid(fn)
          return proxyFn
        } else if (isString(context)) {
          return $.proxy(fn[context], fn)
        } else {
          throw new TypeError("expected function")
        }
      }

      $.fn.bind = function(event, data, callback){
        return this.on(event, data, callback)
      }
      $.fn.unbind = function(event, callback){
        return this.off(event, callback)
      }
      $.fn.one = function(event, selector, data, callback){
        return this.on(event, selector, data, callback, 1)
      }

      var returnTrue = function(){return true},
          returnFalse = function(){return false},
          ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$)/,
          eventMethods = {
            preventDefault: 'isDefaultPrevented',
            stopImmediatePropagation: 'isImmediatePropagationStopped',
            stopPropagation: 'isPropagationStopped'
          }

      function compatible(event, source) {
        if (source || !event.isDefaultPrevented) {
          source || (source = event)

          $.each(eventMethods, function(name, predicate) {
            var sourceMethod = source[name]
            event[name] = function(){
              this[predicate] = returnTrue
              return sourceMethod && sourceMethod.apply(source, arguments)
            }
            event[predicate] = returnFalse
          })

          if (source.defaultPrevented !== undefined ? source.defaultPrevented :
              'returnValue' in source ? source.returnValue === false :
              source.getPreventDefault && source.getPreventDefault())
            event.isDefaultPrevented = returnTrue
        }
        return event
      }

      function createProxy(event) {
        var key, proxy = { originalEvent: event }
        for (key in event)
          if (!ignoreProperties.test(key) && event[key] !== undefined) proxy[key] = event[key]

        return compatible(proxy, event)
      }

      $.fn.delegate = function(selector, event, callback){
        return this.on(event, selector, callback)
      }
      $.fn.undelegate = function(selector, event, callback){
        return this.off(event, selector, callback)
      }

      $.fn.live = function(event, callback){
        $(document.body).delegate(this.selector, event, callback)
        return this
      }
      $.fn.die = function(event, callback){
        $(document.body).undelegate(this.selector, event, callback)
        return this
      }

      $.fn.on = function(event, selector, data, callback, one){
        var autoRemove, delegator, $this = this
        if (event && !isString(event)) {
          $.each(event, function(type, fn){
            $this.on(type, selector, data, fn, one)
          })
          return $this
        }

        if (!isString(selector) && !isFunction(callback) && callback !== false)
          callback = data, data = selector, selector = undefined
        if (isFunction(data) || data === false)
          callback = data, data = undefined

        if (callback === false) callback = returnFalse

        return $this.each(function(_, element){
          if (one) autoRemove = function(e){
            remove(element, e.type, callback)
            return callback.apply(this, arguments)
          }

          if (selector) delegator = function(e){
            var evt, match = $(e.target).closest(selector, element).get(0)
            if (match && match !== element) {
              evt = $.extend(createProxy(e), {currentTarget: match, liveFired: element})
              return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)))
            }
          }

          add(element, event, callback, data, selector, delegator || autoRemove)
        })
      }
      $.fn.off = function(event, selector, callback){
        var $this = this
        if (event && !isString(event)) {
          $.each(event, function(type, fn){
            $this.off(type, selector, fn)
          })
          return $this
        }

        if (!isString(selector) && !isFunction(callback) && callback !== false)
          callback = selector, selector = undefined

        if (callback === false) callback = returnFalse

        return $this.each(function(){
          remove(this, event, callback, selector)
        })
      }

      $.fn.trigger = function(event, args){
        event = (isString(event) || $.isPlainObject(event)) ? $.Event(event) : compatible(event)
        event._args = args
        return this.each(function(){
          // items in the collection might not be DOM elements
          if('dispatchEvent' in this) this.dispatchEvent(event)
          else $(this).triggerHandler(event, args)
        })
      }

      // triggers event handlers on current element just as if an event occurred,
      // doesn't trigger an actual event, doesn't bubble
      $.fn.triggerHandler = function(event, args){
        var e, result
        this.each(function(i, element){
          e = createProxy(isString(event) ? $.Event(event) : event)
          e._args = args
          e.target = element
          $.each(findHandlers(element, event.type || event), function(i, handler){
            result = handler.proxy(e)
            if (e.isImmediatePropagationStopped()) return false
          })
        })
        return result
      }

      // shortcut methods for `.bind(event, fn)` for each event type
      ;('focusin focusout load resize scroll unload click dblclick '+
      'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave '+
      'change select keydown keypress keyup error').split(' ').forEach(function(event) {
        $.fn[event] = function(callback) {
          return callback ?
            this.bind(event, callback) :
            this.trigger(event)
        }
      })

      ;['focus', 'blur'].forEach(function(name) {
        $.fn[name] = function(callback) {
          if (callback) this.bind(name, callback)
          else this.each(function(){
            try { this[name]() }
            catch(e) {}
          })
          return this
        }
      })

      $.Event = function(type, props) {
        if (!isString(type)) props = type, type = props.type
        var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true
        if (props) for (var name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name])
        event.initEvent(type, bubbles, true)
        return compatible(event)
      }

    })(Zepto)

    ;(function($){
      var jsonpID = 0,
          document = window.document,
          key,
          name,
          rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
          scriptTypeRE = /^(?:text|application)\/javascript/i,
          xmlTypeRE = /^(?:text|application)\/xml/i,
          jsonType = 'application/json',
          htmlType = 'text/html',
          blankRE = /^\s*$/

      // trigger a custom event and return false if it was cancelled
      function triggerAndReturn(context, eventName, data) {
        var event = $.Event(eventName)
        $(context).trigger(event, data)
        return !event.isDefaultPrevented()
      }

      // trigger an Ajax "global" event
      function triggerGlobal(settings, context, eventName, data) {
        if (settings.global) return triggerAndReturn(context || document, eventName, data)
      }

      // Number of active Ajax requests
      $.active = 0

      function ajaxStart(settings) {
        if (settings.global && $.active++ === 0) triggerGlobal(settings, null, 'ajaxStart')
      }
      function ajaxStop(settings) {
        if (settings.global && !(--$.active)) triggerGlobal(settings, null, 'ajaxStop')
      }

      // triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable
      function ajaxBeforeSend(xhr, settings) {
        var context = settings.context
        if (settings.beforeSend.call(context, xhr, settings) === false ||
            triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) === false)
          return false

        triggerGlobal(settings, context, 'ajaxSend', [xhr, settings])
      }
      function ajaxSuccess(data, xhr, settings, deferred) {
        var context = settings.context, status = 'success'
        settings.success.call(context, data, status, xhr)
        if (deferred) deferred.resolveWith(context, [data, status, xhr])
        triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data])
        ajaxComplete(status, xhr, settings)
      }
      // type: "timeout", "error", "abort", "parsererror"
      function ajaxError(error, type, xhr, settings, deferred) {
        var context = settings.context
        settings.error.call(context, xhr, type, error)
        if (deferred) deferred.rejectWith(context, [xhr, type, error])
        triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error || type])
        ajaxComplete(type, xhr, settings)
      }
      // status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
      function ajaxComplete(status, xhr, settings) {
        var context = settings.context
        settings.complete.call(context, xhr, status)
        triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings])
        ajaxStop(settings)
      }

      // Empty function, used as default callback
      function empty() {}

      $.ajaxJSONP = function(options, deferred){
        if (!('type' in options)) return $.ajax(options)

        var _callbackName = options.jsonpCallback,
          callbackName = ($.isFunction(_callbackName) ?
            _callbackName() : _callbackName) || ('jsonp' + (++jsonpID)),
          script = document.createElement('script'),
          originalCallback = window[callbackName],
          responseData,
          abort = function(errorType) {
            $(script).triggerHandler('error', errorType || 'abort')
          },
          xhr = { abort: abort }, abortTimeout

        if (deferred) deferred.promise(xhr)

        $(script).on('load error', function(e, errorType){
          clearTimeout(abortTimeout)
          $(script).off().remove()

          if (e.type == 'error' || !responseData) {
            ajaxError(null, errorType || 'error', xhr, options, deferred)
          } else {
            ajaxSuccess(responseData[0], xhr, options, deferred)
          }

          window[callbackName] = originalCallback
          if (responseData && $.isFunction(originalCallback))
            originalCallback(responseData[0])

          originalCallback = responseData = undefined
        })

        if (ajaxBeforeSend(xhr, options) === false) {
          abort('abort')
          return xhr
        }

        window[callbackName] = function(){
          responseData = arguments
        }

        script.src = options.url.replace(/\?(.+)=\?/, '?$1=' + callbackName)
        document.head.appendChild(script)

        if (options.timeout > 0) abortTimeout = setTimeout(function(){
          abort('timeout')
        }, options.timeout)

        return xhr
      }

      $.ajaxSettings = {
        // Default type of request
        type: 'GET',
        // Callback that is executed before request
        beforeSend: empty,
        // Callback that is executed if the request succeeds
        success: empty,
        // Callback that is executed the the server drops error
        error: empty,
        // Callback that is executed on request complete (both: error and success)
        complete: empty,
        // The context for the callbacks
        context: null,
        // Whether to trigger "global" Ajax events
        global: true,
        // Transport
        xhr: function () {
          return new window.XMLHttpRequest()
        },
        // MIME types mapping
        // IIS returns Javascript as "application/x-javascript"
        accepts: {
          script: 'text/javascript, application/javascript, application/x-javascript',
          json:   jsonType,
          xml:    'application/xml, text/xml',
          html:   htmlType,
          text:   'text/plain'
        },
        // Whether the request is to another domain
        crossDomain: false,
        // Default timeout
        timeout: 0,
        // Whether data should be serialized to string
        processData: true,
        // Whether the browser should be allowed to cache GET responses
        cache: true
      }

      function mimeToDataType(mime) {
        if (mime) mime = mime.split(';', 2)[0]
        return mime && ( mime == htmlType ? 'html' :
          mime == jsonType ? 'json' :
          scriptTypeRE.test(mime) ? 'script' :
          xmlTypeRE.test(mime) && 'xml' ) || 'text'
      }

      function appendQuery(url, query) {
        if (query == '') return url
        return (url + '&' + query).replace(/[&?]{1,2}/, '?')
      }

      // serialize payload and append it to the URL for GET requests
      function serializeData(options) {
        if (options.processData && options.data && $.type(options.data) != "string")
          options.data = $.param(options.data, options.traditional)
        if (options.data && (!options.type || options.type.toUpperCase() == 'GET'))
          options.url = appendQuery(options.url, options.data), options.data = undefined
      }

      $.ajax = function(options){
        var settings = $.extend({}, options || {}),
            deferred = $.Deferred && $.Deferred()
        for (key in $.ajaxSettings) if (settings[key] === undefined) settings[key] = $.ajaxSettings[key]

        ajaxStart(settings)

        if (!settings.crossDomain) settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) &&
          RegExp.$2 != window.location.host

        if (!settings.url) settings.url = window.location.toString()
        serializeData(settings)
        if (settings.cache === false) settings.url = appendQuery(settings.url, '_=' + Date.now())

        var dataType = settings.dataType, hasPlaceholder = /\?.+=\?/.test(settings.url)
        if (dataType == 'jsonp' || hasPlaceholder) {
          if (!hasPlaceholder)
            settings.url = appendQuery(settings.url,
              settings.jsonp ? (settings.jsonp + '=?') : settings.jsonp === false ? '' : 'callback=?')
          return $.ajaxJSONP(settings, deferred)
        }

        var mime = settings.accepts[dataType],
            headers = { },
            setHeader = function(name, value) { headers[name.toLowerCase()] = [name, value] },
            protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
            xhr = settings.xhr(),
            nativeSetHeader = xhr.setRequestHeader,
            abortTimeout

        if (deferred) deferred.promise(xhr)

        if (!settings.crossDomain) setHeader('X-Requested-With', 'XMLHttpRequest')
        setHeader('Accept', mime || '*/*')
        if (mime = settings.mimeType || mime) {
          if (mime.indexOf(',') > -1) mime = mime.split(',', 2)[0]
          xhr.overrideMimeType && xhr.overrideMimeType(mime)
        }
        if (settings.contentType || (settings.contentType !== false && settings.data && settings.type.toUpperCase() != 'GET'))
          setHeader('Content-Type', settings.contentType || 'application/x-www-form-urlencoded')

        if (settings.headers) for (name in settings.headers) setHeader(name, settings.headers[name])
        xhr.setRequestHeader = setHeader

        xhr.onreadystatechange = function(){
          if (xhr.readyState == 4) {
            xhr.onreadystatechange = empty
            clearTimeout(abortTimeout)
            var result, error = false
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
              dataType = dataType || mimeToDataType(settings.mimeType || xhr.getResponseHeader('content-type'))
              result = xhr.responseText

              try {
                // http://perfectionkills.com/global-eval-what-are-the-options/
                if (dataType == 'script')    (1,eval)(result)
                else if (dataType == 'xml')  result = xhr.responseXML
                else if (dataType == 'json') result = blankRE.test(result) ? null : $.parseJSON(result)
              } catch (e) { error = e }

              if (error) ajaxError(error, 'parsererror', xhr, settings, deferred)
              else ajaxSuccess(result, xhr, settings, deferred)
            } else {
              ajaxError(xhr.statusText || null, xhr.status ? 'error' : 'abort', xhr, settings, deferred)
            }
          }
        }

        if (ajaxBeforeSend(xhr, settings) === false) {
          xhr.abort()
          ajaxError(null, 'abort', xhr, settings, deferred)
          return xhr
        }

        if (settings.xhrFields) for (name in settings.xhrFields) xhr[name] = settings.xhrFields[name]

        var async = 'async' in settings ? settings.async : true
        xhr.open(settings.type, settings.url, async, settings.username, settings.password)

        for (name in headers) nativeSetHeader.apply(xhr, headers[name])

        if (settings.timeout > 0) abortTimeout = setTimeout(function(){
            xhr.onreadystatechange = empty
            xhr.abort()
            ajaxError(null, 'timeout', xhr, settings, deferred)
          }, settings.timeout)

        // avoid sending empty string (#319)
        xhr.send(settings.data ? settings.data : null)
        return xhr
      }

      // handle optional data/success arguments
      function parseArguments(url, data, success, dataType) {
        var hasData = !$.isFunction(data)
        return {
          url:      url,
          data:     hasData  ? data : undefined,
          success:  !hasData ? data : $.isFunction(success) ? success : undefined,
          dataType: hasData  ? dataType || success : success
        }
      }

      $.get = function(url, data, success, dataType){
        return $.ajax(parseArguments.apply(null, arguments))
      }

      $.post = function(url, data, success, dataType){
        var options = parseArguments.apply(null, arguments)
        options.type = 'POST'
        return $.ajax(options)
      }

      $.getJSON = function(url, data, success){
        var options = parseArguments.apply(null, arguments)
        options.dataType = 'json'
        return $.ajax(options)
      }

      $.fn.load = function(url, data, success){
        if (!this.length) return this
        var self = this, parts = url.split(/\s/), selector,
            options = parseArguments(url, data, success),
            callback = options.success
        if (parts.length > 1) options.url = parts[0], selector = parts[1]
        options.success = function(response){
          self.html(selector ?
            $('<div>').html(response.replace(rscript, "")).find(selector)
            : response)
          callback && callback.apply(self, arguments)
        }
        $.ajax(options)
        return this
      }

      var escape = encodeURIComponent

      function serialize(params, obj, traditional, scope){
        var type, array = $.isArray(obj), hash = $.isPlainObject(obj)
        $.each(obj, function(key, value) {
          type = $.type(value)
          if (scope) key = traditional ? scope :
            scope + '[' + (hash || type == 'object' || type == 'array' ? key : '') + ']'
          // handle data in serializeArray() format
          if (!scope && array) params.add(value.name, value.value)
          // recurse into nested objects
          else if (type == "array" || (!traditional && type == "object"))
            serialize(params, value, traditional, key)
          else params.add(key, value)
        })
      }

      $.param = function(obj, traditional){
        var params = []
        params.add = function(k, v){ this.push(escape(k) + '=' + escape(v)) }
        serialize(params, obj, traditional)
        return params.join('&').replace(/%20/g, '+')
      }
    })(Zepto)

    ;(function($){
      $.fn.serializeArray = function() {
        var result = [], el
        $([].slice.call(this.get(0).elements)).each(function(){
          el = $(this)
          var type = el.attr('type')
          if (this.nodeName.toLowerCase() != 'fieldset' &&
            !this.disabled && type != 'submit' && type != 'reset' && type != 'button' &&
            ((type != 'radio' && type != 'checkbox') || this.checked))
            result.push({
              name: el.attr('name'),
              value: el.val()
            })
        })
        return result
      }

      $.fn.serialize = function(){
        var result = []
        this.serializeArray().forEach(function(elm){
          result.push(encodeURIComponent(elm.name) + '=' + encodeURIComponent(elm.value))
        })
        return result.join('&')
      }

      $.fn.submit = function(callback) {
        if (callback) this.bind('submit', callback)
        else if (this.length) {
          var event = $.Event('submit')
          this.eq(0).trigger(event)
          if (!event.isDefaultPrevented()) this.get(0).submit()
        }
        return this
      }

    })(Zepto)

    ;(function($){
      // __proto__ doesn't exist on IE<11, so redefine
      // the Z function to use object extension instead
      if (!('__proto__' in {})) {
        $.extend($.zepto, {
          Z: function(dom, selector){
            dom = dom || []
            $.extend(dom, $.fn)
            dom.selector = selector || ''
            dom.__Z = true
            return dom
          },
          // this is a kludge but works
          isZ: function(object){
            return $.type(object) === 'array' && '__Z' in object
          }
        })
      }

      // getComputedStyle shouldn't freak out when called
      // without a valid element as argument
      try {
        getComputedStyle(undefined)
      } catch(e) {
        var nativeGetComputedStyle = getComputedStyle;
        window.getComputedStyle = function(element){
          try {
            return nativeGetComputedStyle(element)
          } catch(e) {
            return null
          }
        }
      }
    })(Zepto)


  VCO.getJSON = Zepto.getJSON;
	VCO.ajax = Zepto.ajax;
})(VCO)

//     Based on https://github.com/madrobby/zepto/blob/5585fe00f1828711c04208372265a5d71e3238d1/src/ajax.js
//     Zepto.js
//     (c) 2010-2012 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.
/*
Copyright (c) 2010-2012 Thomas Fuchs
http://zeptojs.com

Permission is hereby granted, free of charge, to any person obtaining a copy 
of this software and associated documentation files (the "Software"), to deal 
in the Software without restriction, including without limitation the rights 
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
copies of the Software, and to permit persons to whom the Software is 
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all 
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE 
SOFTWARE.
*/


/*	VCO.Class
	Class powers the OOP facilities of the library.
================================================== */
VCO.Class = function () {};

VCO.Class.extend = function (/*Object*/ props) /*-> Class*/ {
 
	// extended class with the new prototype
	var NewClass = function () {
		if (this.initialize) {
			this.initialize.apply(this, arguments);
		}
	};

	// instantiate class without calling constructor
	var F = function () {};
	F.prototype = this.prototype;
	var proto = new F();

	proto.constructor = NewClass;
	NewClass.prototype = proto;

	// add superclass access
	NewClass.superclass = this.prototype;

	// add class name
	//proto.className = props;

	//inherit parent's statics
	for (var i in this) {
		if (this.hasOwnProperty(i) && i !== 'prototype' && i !== 'superclass') {
			NewClass[i] = this[i];
		}
	}

	// mix static properties into the class
	if (props.statics) {
		VCO.Util.extend(NewClass, props.statics);
		delete props.statics;
	}

	// mix includes into the prototype
	if (props.includes) {
		VCO.Util.extend.apply(null, [proto].concat(props.includes));
		delete props.includes;
	}

	// merge options
	if (props.options && proto.options) {
		props.options = VCO.Util.extend({}, proto.options, props.options);
	}

	// mix given properties into the prototype
	VCO.Util.extend(proto, props);

	// allow inheriting further
	NewClass.extend = VCO.Class.extend;

	// method for adding properties to prototype
	NewClass.include = function (props) {
		VCO.Util.extend(this.prototype, props);
	};

	return NewClass;
};


/*	VCO.Events
	adds custom events functionality to VCO classes
================================================== */
VCO.Events = {
	addEventListener: function (/*String*/ type, /*Function*/ fn, /*(optional) Object*/ context) {
		var events = this._vco_events = this._vco_events || {};
		events[type] = events[type] || [];
		events[type].push({
			action: fn,
			context: context || this
		});
		return this;
	},

	hasEventListeners: function (/*String*/ type) /*-> Boolean*/ {
		var k = '_vco_events';
		return (k in this) && (type in this[k]) && (this[k][type].length > 0);
	},

	removeEventListener: function (/*String*/ type, /*Function*/ fn, /*(optional) Object*/ context) {
		if (!this.hasEventListeners(type)) {
			return this;
		}

		for (var i = 0, events = this._vco_events, len = events[type].length; i < len; i++) {
			if (
				(events[type][i].action === fn) &&
				(!context || (events[type][i].context === context))
			) {
				events[type].splice(i, 1);
				return this;
			}
		}
		return this;
	},

	fireEvent: function (/*String*/ type, /*(optional) Object*/ data) {
		if (!this.hasEventListeners(type)) {
			return this;
		}

		var event = VCO.Util.extend({
			type: type,
			target: this
		}, data);

		var listeners = this._vco_events[type].slice();

		for (var i = 0, len = listeners.length; i < len; i++) {
			listeners[i].action.call(listeners[i].context || this, event);
		}

		return this;
	}
};

VCO.Events.on	= VCO.Events.addEventListener;
VCO.Events.off	= VCO.Events.removeEventListener;
VCO.Events.fire = VCO.Events.fireEvent;

/*
	Based on Leaflet Browser
	VCO.Browser handles different browser and feature detections for internal  use.
*/


(function() {

	var ua = navigator.userAgent.toLowerCase(),
		doc = document.documentElement,

		ie = 'ActiveXObject' in window,

		webkit = ua.indexOf('webkit') !== -1,
		phantomjs = ua.indexOf('phantom') !== -1,
		android23 = ua.search('android [23]') !== -1,

		mobile = typeof orientation !== 'undefined',
		msPointer = navigator.msPointerEnabled && navigator.msMaxTouchPoints && !window.PointerEvent,
		pointer = (window.PointerEvent && navigator.pointerEnabled && navigator.maxTouchPoints) || msPointer,

		ie3d = ie && ('transition' in doc.style),
		webkit3d = ('WebKitCSSMatrix' in window) && ('m11' in new window.WebKitCSSMatrix()) && !android23,
		gecko3d = 'MozPerspective' in doc.style,
		opera3d = 'OTransition' in doc.style,
		opera = window.opera;


	var retina = 'devicePixelRatio' in window && window.devicePixelRatio > 1;

	if (!retina && 'matchMedia' in window) {
		var matches = window.matchMedia('(min-resolution:144dpi)');
		retina = matches && matches.matches;
	}

	var touch = !window.L_NO_TOUCH && !phantomjs && (pointer || 'ontouchstart' in window || (window.DocumentTouch && document instanceof window.DocumentTouch));

	VCO.Browser = {
		ie: ie,
		ielt9: ie && !document.addEventListener,
		webkit: webkit,
		//gecko: (ua.indexOf('gecko') !== -1) && !webkit && !window.opera && !ie,
		firefox: (ua.indexOf('gecko') !== -1) && !webkit && !window.opera && !ie,
		android: ua.indexOf('android') !== -1,
		android23: android23,
		chrome: ua.indexOf('chrome') !== -1,

		ie3d: ie3d,
		webkit3d: webkit3d,
		gecko3d: gecko3d,
		opera3d: opera3d,
		any3d: !window.L_DISABLE_3D && (ie3d || webkit3d || gecko3d || opera3d) && !phantomjs,

		mobile: mobile,
		mobileWebkit: mobile && webkit,
		mobileWebkit3d: mobile && webkit3d,
		mobileOpera: mobile && window.opera,

		touch: !! touch,
		msPointer: !! msPointer,
		pointer: !! pointer,

		retina: !! retina,
		orientation: function() {
			var w = window.innerWidth,
				h = window.innerHeight,
				_orientation = "portrait";
			
			if (w > h) {
				_orientation = "landscape";
			}
			if (Math.abs(window.orientation) == 90) {
				//_orientation = "landscape";
			}
			trace(_orientation);
			return _orientation;
		}
	};

}()); 

/*	VCO.Load
	Loads External Javascript and CSS
================================================== */

VCO.Load = (function (doc) {
	var loaded	= [];
	
	function isLoaded(url) {
		
		var i			= 0,
			has_loaded	= false;
		
		for (i = 0; i < loaded.length; i++) {
			if (loaded[i] == url) {
				has_loaded = true;
			}
		}
		
		if (has_loaded) {
			return true;
		} else {
			loaded.push(url);
			return false;
		}
		
	}
	
	return {
		
		css: function (urls, callback, obj, context) {
			if (!isLoaded(urls)) {
				VCO.LoadIt.css(urls, callback, obj, context);
			} else {
				callback();
			}
		},

		js: function (urls, callback, obj, context) {
			if (!isLoaded(urls)) {
				VCO.LoadIt.js(urls, callback, obj, context);
			} else {
				callback();
			}
		}
    };
	
})(this.document);


/*jslint browser: true, eqeqeq: true, bitwise: true, newcap: true, immed: true, regexp: false */

/*
LazyLoad makes it easy and painless to lazily load one or more external
JavaScript or CSS files on demand either during or after the rendering of a web
page.

Supported browsers include Firefox 2+, IE6+, Safari 3+ (including Mobile
Safari), Google Chrome, and Opera 9+. Other browsers may or may not work and
are not officially supported.

Visit https://github.com/rgrove/lazyload/ for more info.

Copyright (c) 2011 Ryan Grove <ryan@wonko.com>
All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the 'Software'), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

@module lazyload
@class LazyLoad
@static
@version 2.0.3 (git)
*/

VCO.LoadIt = (function (doc) {
  // -- Private Variables ------------------------------------------------------

  // User agent and feature test information.
  var env,

  // Reference to the <head> element (populated lazily).
  head,

  // Requests currently in progress, if any.
  pending = {},

  // Number of times we've polled to check whether a pending stylesheet has
  // finished loading. If this gets too high, we're probably stalled.
  pollCount = 0,

  // Queued requests.
  queue = {css: [], js: []},

  // Reference to the browser's list of stylesheets.
  styleSheets = doc.styleSheets;

  // -- Private Methods --------------------------------------------------------

  /**
  Creates and returns an HTML element with the specified name and attributes.

  @method createNode
  @param {String} name element name
  @param {Object} attrs name/value mapping of element attributes
  @return {HTMLElement}
  @private
  */
  function createNode(name, attrs) {
    var node = doc.createElement(name), attr;

    for (attr in attrs) {
      if (attrs.hasOwnProperty(attr)) {
        node.setAttribute(attr, attrs[attr]);
      }
    }

    return node;
  }

  /**
  Called when the current pending resource of the specified type has finished
  loading. Executes the associated callback (if any) and loads the next
  resource in the queue.

  @method finish
  @param {String} type resource type ('css' or 'js')
  @private
  */
  function finish(type) {
    var p = pending[type],
        callback,
        urls;

    if (p) {
      callback = p.callback;
      urls     = p.urls;

      urls.shift();
      pollCount = 0;

      // If this is the last of the pending URLs, execute the callback and
      // start the next request in the queue (if any).
      if (!urls.length) {
        callback && callback.call(p.context, p.obj);
        pending[type] = null;
        queue[type].length && load(type);
      }
    }
  }

  /**
  Populates the <code>env</code> variable with user agent and feature test
  information.

  @method getEnv
  @private
  */
  function getEnv() {
    var ua = navigator.userAgent;

    env = {
      // True if this browser supports disabling async mode on dynamically
      // created script nodes. See
      // http://wiki.whatwg.org/wiki/Dynamic_Script_Execution_Order
      async: doc.createElement('script').async === true
    };

    (env.webkit = /AppleWebKit\//.test(ua))
      || (env.ie = /MSIE/.test(ua))
      || (env.opera = /Opera/.test(ua))
      || (env.gecko = /Gecko\//.test(ua))
      || (env.unknown = true);
  }

  /**
  Loads the specified resources, or the next resource of the specified type
  in the queue if no resources are specified. If a resource of the specified
  type is already being loaded, the new request will be queued until the
  first request has been finished.

  When an array of resource URLs is specified, those URLs will be loaded in
  parallel if it is possible to do so while preserving execution order. All
  browsers support parallel loading of CSS, but only Firefox and Opera
  support parallel loading of scripts. In other browsers, scripts will be
  queued and loaded one at a time to ensure correct execution order.

  @method load
  @param {String} type resource type ('css' or 'js')
  @param {String|Array} urls (optional) URL or array of URLs to load
  @param {Function} callback (optional) callback function to execute when the
    resource is loaded
  @param {Object} obj (optional) object to pass to the callback function
  @param {Object} context (optional) if provided, the callback function will
    be executed in this object's context
  @private
  */
  function load(type, urls, callback, obj, context) {
    var _finish = function () { finish(type); },
        isCSS   = type === 'css',
        nodes   = [],
        i, len, node, p, pendingUrls, url;

    env || getEnv();

    if (urls) {
      // If urls is a string, wrap it in an array. Otherwise assume it's an
      // array and create a copy of it so modifications won't be made to the
      // original.
      urls = typeof urls === 'string' ? [urls] : urls.concat();

      // Create a request object for each URL. If multiple URLs are specified,
      // the callback will only be executed after all URLs have been loaded.
      //
      // Sadly, Firefox and Opera are the only browsers capable of loading
      // scripts in parallel while preserving execution order. In all other
      // browsers, scripts must be loaded sequentially.
      //
      // All browsers respect CSS specificity based on the order of the link
      // elements in the DOM, regardless of the order in which the stylesheets
      // are actually downloaded.
      if (isCSS || env.async || env.gecko || env.opera) {
        // Load in parallel.
        queue[type].push({
          urls    : urls,
          callback: callback,
          obj     : obj,
          context : context
        });
      } else {
        // Load sequentially.
        for (i = 0, len = urls.length; i < len; ++i) {
          queue[type].push({
            urls    : [urls[i]],
            callback: i === len - 1 ? callback : null, // callback is only added to the last URL
            obj     : obj,
            context : context
          });
        }
      }
    }

    // If a previous load request of this type is currently in progress, we'll
    // wait our turn. Otherwise, grab the next item in the queue.
    if (pending[type] || !(p = pending[type] = queue[type].shift())) {
      return;
    }

    head || (head = doc.head || doc.getElementsByTagName('head')[0]);
    pendingUrls = p.urls;

    for (i = 0, len = pendingUrls.length; i < len; ++i) {
      url = pendingUrls[i];

      if (isCSS) {
          node = env.gecko ? createNode('style') : createNode('link', {
            href: url,
            rel : 'stylesheet'
          });
      } else {
        node = createNode('script', {src: url});
        node.async = false;
      }

      node.className = 'lazyload';
      node.setAttribute('charset', 'utf-8');

      if (env.ie && !isCSS) {
        node.onreadystatechange = function () {
          if (/loaded|complete/.test(node.readyState)) {
            node.onreadystatechange = null;
            _finish();
          }
        };
      } else if (isCSS && (env.gecko || env.webkit)) {
        // Gecko and WebKit don't support the onload event on link nodes.
        if (env.webkit) {
          // In WebKit, we can poll for changes to document.styleSheets to
          // figure out when stylesheets have loaded.
          p.urls[i] = node.href; // resolve relative URLs (or polling won't work)
          pollWebKit();
        } else {
          // In Gecko, we can import the requested URL into a <style> node and
          // poll for the existence of node.sheet.cssRules. Props to Zach
          // Leatherman for calling my attention to this technique.
          node.innerHTML = '@import "' + url + '";';
          pollGecko(node);
        }
      } else {
        node.onload = node.onerror = _finish;
      }

      nodes.push(node);
    }

    for (i = 0, len = nodes.length; i < len; ++i) {
      head.appendChild(nodes[i]);
    }
  }

  /**
  Begins polling to determine when the specified stylesheet has finished loading
  in Gecko. Polling stops when all pending stylesheets have loaded or after 10
  seconds (to prevent stalls).

  Thanks to Zach Leatherman for calling my attention to the @import-based
  cross-domain technique used here, and to Oleg Slobodskoi for an earlier
  same-domain implementation. See Zach's blog for more details:
  http://www.zachleat.com/web/2010/07/29/load-css-dynamically/

  @method pollGecko
  @param {HTMLElement} node Style node to poll.
  @private
  */
  function pollGecko(node) {
    var hasRules;

    try {
      // We don't really need to store this value or ever refer to it again, but
      // if we don't store it, Closure Compiler assumes the code is useless and
      // removes it.
      hasRules = !!node.sheet.cssRules;
    } catch (ex) {
      // An exception means the stylesheet is still loading.
      pollCount += 1;

      if (pollCount < 200) {
        setTimeout(function () { pollGecko(node); }, 50);
      } else {
        // We've been polling for 10 seconds and nothing's happened. Stop
        // polling and finish the pending requests to avoid blocking further
        // requests.
        hasRules && finish('css');
      }

      return;
    }

    // If we get here, the stylesheet has loaded.
    finish('css');
  }

  /**
  Begins polling to determine when pending stylesheets have finished loading
  in WebKit. Polling stops when all pending stylesheets have loaded or after 10
  seconds (to prevent stalls).

  @method pollWebKit
  @private
  */
  function pollWebKit() {
    var css = pending.css, i;

    if (css) {
      i = styleSheets.length;

      // Look for a stylesheet matching the pending URL.
      while (--i >= 0) {
        if (styleSheets[i].href === css.urls[0]) {
          finish('css');
          break;
        }
      }

      pollCount += 1;

      if (css) {
        if (pollCount < 200) {
          setTimeout(pollWebKit, 50);
        } else {
          // We've been polling for 10 seconds and nothing's happened, which may
          // indicate that the stylesheet has been removed from the document
          // before it had a chance to load. Stop polling and finish the pending
          // request to prevent blocking further requests.
          finish('css');
        }
      }
    }
  }

  return {

    /**
    Requests the specified CSS URL or URLs and executes the specified
    callback (if any) when they have finished loading. If an array of URLs is
    specified, the stylesheets will be loaded in parallel and the callback
    will be executed after all stylesheets have finished loading.

    @method css
    @param {String|Array} urls CSS URL or array of CSS URLs to load
    @param {Function} callback (optional) callback function to execute when
      the specified stylesheets are loaded
    @param {Object} obj (optional) object to pass to the callback function
    @param {Object} context (optional) if provided, the callback function
      will be executed in this object's context
    @static
    */
    css: function (urls, callback, obj, context) {
      load('css', urls, callback, obj, context);
    },

    /**
    Requests the specified JavaScript URL or URLs and executes the specified
    callback (if any) when they have finished loading. If an array of URLs is
    specified and the browser supports it, the scripts will be loaded in
    parallel and the callback will be executed after all scripts have
    finished loading.

    Currently, only Firefox and Opera support parallel loading of scripts while
    preserving execution order. In other browsers, scripts will be
    queued and loaded one at a time to ensure correct execution order.

    @method js
    @param {String|Array} urls JS URL or array of JS URLs to load
    @param {Function} callback (optional) callback function to execute when
      the specified scripts are loaded
    @param {Object} obj (optional) object to pass to the callback function
    @param {Object} context (optional) if provided, the callback function
      will be executed in this object's context
    @static
    */
    js: function (urls, callback, obj, context) {
      load('js', urls, callback, obj, context);
    }

  };
})(this.document);


/*  VCO.TimelineConfig
separate the configuration from the display (VCO.Timeline)
to make testing easier
================================================== */
VCO.TimelineConfig = VCO.Class.extend({
	
	includes: [VCO.Events],
	VALID_PROPERTIES: ['scale', 'title', 'events'], // we'll only pull things in from this

	initialize: function (data, callback) {
		// Initialize the data
		if (typeof data === 'string') {
			var self = this;
            
			VCO.ajax({
				type: 'GET',
				url: data,
				dataType: 'json', //json data type
				success: function(d){
					if (d && d.events) {
						self._importProperties(d);
					} else {
						this.fire("load_error", {message:"data must have an events property"});
						throw("data must have an events property");
					}
					self._cleanData();
					if (callback) {
						callback(self);
					}
				},
				error:function(xhr, type){
					trace(xhr);
					trace(type);
					this.fire("load_error", {message:"Configuration could not be loaded: " + type});
					throw("Configuration could not be loaded: " + type);
					
				}
			});
		} else if (typeof data === 'object') {
			if (data.events) {
				this._importProperties(data);
				this._cleanData();
			} else {
				this.fire("load_error", {message:"data must have an events property"});
				throw("data must have a events property");
			}
			if (callback) {
				callback(this);
			}
		} else {
			this.fire("load_error", {message:"Invalid Argument"});
			throw("Invalid Argument");
		}
	},

	/* Add an event and return the unique id 
	*/
	addEvent: function(data) {
		var _id = (this.title) ? this.title.uniqueid : '';
		this.events.push(data);
		this._makeUniqueIdentifiers(_id, this.events); 
		this._processDates(this.events);    
        
		var uniqueid = this.events[this.events.length - 1].uniqueid;             
		VCO.DateUtil.sortByDate(this.events);
		return uniqueid;
	},

	_cleanData: function() {
		var _id = (this.title) ? this.title.uniqueid : '';
		this._makeUniqueIdentifiers(_id, this.events); 
		this._processDates(this.events);          
		VCO.DateUtil.sortByDate(this.events);
	},
    
	_importProperties: function(d) {
		for (var i = 0; i < this.VALID_PROPERTIES.length; i++) {
			k = this.VALID_PROPERTIES[i];
			this[k] = d[k];
		}
        
		// Make sure title slide has unique id
		if(this.title && !('uniqueid' in this.title)) {
			this.title.uniqueid = '';
		}
	},

	_makeUniqueIdentifiers: function(title_id, array) {
		var used = [title_id];
		for (var i = 0; i < array.length; i++) {
			if (array[i].uniqueid && array[i].uniqueid.replace(/\s+/,'').length > 0) {
				array[i].uniqueid = VCO.Util.slugify(array[i].uniqueid); // enforce valid
				if (used.indexOf(array[i].uniqueid) != -1) {
					array[i].uniqueid = '';
				} else {
					used.push(array[i].uniqueid);
				}
			}
		};
		if (used.length != (array.length + 1)) {
			for (var i = 0; i < array.length; i++) {
				if (!array[i].uniqueid) {
					var slug = (array[i].text) ? VCO.Util.slugify(array[i].text.headline) : null;
					if (!slug) {
						slug = VCO.Util.unique_ID(6);
					}
					if (used.indexOf(slug) != -1) {
						slug = slug + '-' + i;
					}
					used.push(slug);
					array[i].uniqueid = slug;
				}
			}
		}
	},

	_processDates: function(array) {
		var dateCls = null;
        
		if(!this.scale) {
			trace("Determining scale dynamically");
            
			this.scale = "javascript"; // default
            
			for (var i = 0; i < array.length; i++) {
				if (typeof(array[i].start_date) == 'undefined') {
					this.fire("load_error", {message:"item " + i + " is missing a start_date"});
					throw("item " + i + " is missing a start_date");
				}
                
				var d = new VCO.BigDate(array[i].start_date);
				var year = d.data.date_obj.year;               
				if(year < -271820 || year >  275759) {
					this.scale = "cosmological";
					break;
				}
			}
		}
        
		if(this.scale == 'javascript') {
			dateCls = VCO.Date;
			trace('using VCO.Date');
		} else if(this.scale == 'cosmological') {
			dateCls = VCO.BigDate;
			trace('using VCO.BigDate');
		} else {
			this.fire("load_error", {message:"Don't know how to process dates on scale "+this.scale});
			throw ("Don't know how to process dates on scale "+this.scale);
		}
            
		for (var i = 0; i < array.length; i++) {
			if (typeof(array[i].start_date) == 'undefined') {
				this.fire("load_error", {message:"item " + i + " is missing a start_date"});
				throw("item " + i + " is missing a start_date");
				
			}
			if(!(array[i].start_date instanceof dateCls)) {
				var start_date = array[i].start_date;
				array[i].start_date = new dateCls(start_date);

				// eliminate redundant end dates.
				if (typeof(array[i].end_date) != 'undefined' && !(array[i].end_date instanceof dateCls)) {
					var end_date = array[i].end_date;
					var equal = true;
					for (property in start_date) {
						equal = equal && (start_date[property] == end_date[property]);
					}
					if (equal) {
						trace("End date same as start date is redundant; dropping end date");
						delete array[i].end_date;
					} else {
						array[i].end_date = new dateCls(end_date);
					}

				}
			}
		}
	}
});


/* VCO.ConfigFactory.js
 * Build TimelineConfig objects from other data sources
 */
;(function(VCO){
    function extractSpreadsheetKey(url) {
        var pat = /\bkey=([-_A-Za-z0-9]+)&?/i;
        if (url.match(pat)) {
            return url.match(pat)[1];
        }
        var key = null;
        if (url.match("docs.google.com/spreadsheets/d/")) {
            var pos = url.indexOf("docs.google.com/spreadsheets/d/") + "docs.google.com/spreadsheets/d/".length;
            var tail = url.substr(pos);
            key = tail.split('/')[0]
        }
        if (!key) { key = url}
        return key;
    }

    function extractGoogleEntryData_V1(item) {
        var item_data = {}
        for (k in item) {
            if (k.indexOf('gsx$') == 0) {
                item_data[k.substr(4)] = item[k].$t;
            }
        }
        if (!item_data.startdate) {
            throw("All items must have a start date column.")
        }
        var d = {
            media: {
                caption: item_data.mediacaption || '',
                credit: item_data.mediacredit || '',
                url: item_data.media || '',
                thumb: ''
            },
            text: {
                headline: item_data.headline || '',
                text: item_data.text || ''
            }
        }
        d['start_date'] = VCO.Date.parseDate(item_data.startdate);
        if (item.enddate) {
            d['end_date'] = VCO.Date.parseDate(item.enddate);
        }
        return d;
    }

    function extractGoogleEntryData_V3(item) {
        var item_data = {}
        for (k in item) {
            if (k.indexOf('gsx$') == 0) {
                item_data[k.substr(4)] = item[k].$t;
            }
        }
        var d = {
            media: {
                caption: item_data.mediacaption || '',
                credit: item_data.mediacredit || '',
                url: item_data.media || '',
                thumb: item_data.mediathumbnail || ''
            },
            text: {
                headline: item_data.headline || '',
                text: item_data.text || ''
            },
            start_date: {
                year: item_data.year,
                month: item_data.month || '',
                day: item_data.day || '',
                time: item_data.time || ''
            },
            end_date: {
                year: item_data.endyear || '',
                month: item_data.endmonth || '',
                day: item_data.endday || '',
                time: item_data.endtime || ''
            },
            display_date: item_data.displaydate || '',

            type: item_data.type || ''
        }

        if (item_data.group) {
            d.group = item_data.group;
        }

        if (d.end_date.year == '') {
            var bad_date = d.end_date;
            delete d.end_date;
            if (bad_date.month != '' || bad_date.day != '' || bad_date.time != '') {
                var label = d.text.headline ||
                trace("Invalid end date for spreadsheet row. Must have a year if any other date fields are specified.");
                trace(item);
            }
        }

        return d;
    }

    var getGoogleItemExtractor = function(data) {
        if (typeof data.feed.entry === 'undefined' 
                || data.feed.entry.length == 0) {
            throw('No data entries found.');
        }
        var entry = data.feed.entry[0];
        if (typeof entry.gsx$startdate !== 'undefined') {
            return extractGoogleEntryData_V1;
        } else if (typeof entry.gsx$year !== 'undefined') {
            return extractGoogleEntryData_V3;
        } else {
            throw('Invalid data format.');
        }
    }

    VCO.ConfigFactory = {

        extractSpreadsheetKey: extractSpreadsheetKey,

        fromGoogle: function(url) {
            var key = extractSpreadsheetKey(url);
            // TODO: maybe get specific worksheets?
            var worksheet = '1';
            url = "https://spreadsheets.google.com/feeds/list/" + key + "/" + worksheet + "/public/values?alt=json";
            return this.fromFeed(url);
        },

        fromFeed: function(url) {
            var timeline_config = { 'events': [] };
            var data = VCO.ajax({
                url: url, 
                async: false
            });
            data = JSON.parse(data.responseText);
            window.google_data = data;
            var extract = getGoogleItemExtractor(data);
            for (var i = 0; i < data.feed.entry.length; i++) {
                var event = extract(data.feed.entry[i]);
                var row_type = 'event';
                if (typeof(event.type) != 'undefined') {
                    row_type = event.type;
                    delete event.type;
                }
                if (row_type == 'title') {
                    timeline_config.title = event;
                } else {
                    timeline_config.events.push(event);
                }
            };
            return timeline_config;
        }
    }
})(VCO)


VCO.Language = function(options) {
	// borrowed from http://stackoverflow.com/a/14446414/102476
	for (k in VCO.Language.languages.en) {
		this[k] = VCO.Language.languages.en[k];
	}
	if (options && options.language && typeof(options.language) == 'string' && options.language != 'en') {
		var code = options.language;
		if (!(code in VCO.Language.languages)) {
			if (/\.json$/.test(code)) {
				var url = code;
			} else {
				var fragment = "/locale/" + code + ".json";
				var script_path = options.script_path || VCO.Timeline.source_path;
				if (/\/$/.test(script_path)) { fragment = fragment.substr(1)}
				var url = script_path + fragment;
			}
			var self = this;
			var xhr = VCO.ajax({ 
				url: url, async: false
			});
			if (xhr.status == 200) {
				VCO.Language.languages[code] = JSON.parse(xhr.responseText);
			} else {
				throw "Could not load language [" + code + "]: " + xhr.statusText;
			}
		}
		VCO.Util.mergeData(this,VCO.Language.languages[code]);

	}
}

VCO.Language.formatNumber = function(val,mask) {
		if (mask.match(/%(\.(\d+))?f/)) {
			var match = mask.match(/%(\.(\d+))?f/);
			var token = match[0];
			if (match[2]) {
				val = val.toFixed(match[2]);
			}
			return mask.replace(token,val);
		}
		// use mask as literal display value.
		return mask;
	}



/* VCO.Util.mergeData is shallow, we have nested dicts. 
   This is a simplistic handling but should work.
 */
VCO.Language.prototype.mergeData = function(lang_json) {
	for (k in VCO.Language.languages.en) {
		if (lang_json[k]) {
			if (typeof(this[k]) == 'object') {
				VCO.Util.mergeData(lang_json[k], this[k]);
			} else {
				this[k] = lang_json[k]; // strings, mostly
			}
		}
	}
}

VCO.Language.fallback = { messages: {} }; // placeholder to satisfy IE8 early compilation
VCO.Language.prototype.getMessage = function(k) {
	return this.messages[k] || VCO.Language.fallback.messages[k] || k;
}

VCO.Language.prototype._ = VCO.Language.prototype.getMessage; // keep it concise

VCO.Language.prototype.formatDate = function(date, format_name) {

	if (date.constructor == Date) {
		return this.formatJSDate(date, format_name);
	}

	if (date.constructor == VCO.BigYear) {
		return this.formatBigYear(date, format_name);
	}

	if (date.data && date.data.date_obj) {
		return this.formatDate(date.data.date_obj, format_name);
	}

	trace("Unfamiliar date presented for formatting");
	return date.toString();
}

VCO.Language.prototype.formatBigYear = function(bigyear, format_name) {
	var the_year = bigyear.year;
	var format_list = this.bigdateformats[format_name] || this.bigdateformats['fallback'];

	if (format_list) {
		for (var i = 0; i < format_list.length; i++) {
			var tuple = format_list[i];
			if (Math.abs(the_year / tuple[0]) > 1) {
				// will we ever deal with distant future dates?
				return VCO.Language.formatNumber(Math.abs(the_year / tuple[0]),tuple[1])
			}
		};

		return the_year.toString();

	} else {	
	    trace("Language file dateformats missing cosmological. Falling back.");
	    return VCO.Language.formatNumber(the_year,format_name);
	}
}

VCO.Language.prototype.formatJSDate = function(js_date, format_name) {
	// ultimately we probably want this to work with VCO.Date instead of (in addition to?) JS Date
	// utc, timezone and timezoneClip are carry over from Steven Levithan implementation. We probably aren't going to use them.
	var utc = false, 
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g;


	if (!format_name) {
		format_name = 'full'; 
	}

	var mask = this.dateformats[format_name] || VCO.Language.fallback.dateformats[format_name];
	if (!mask) {
		mask = format_name; // allow custom format strings
	}


	var	_ = utc ? "getUTC" : "get",
		d = js_date[_ + "Date"](),
		D = js_date[_ + "Day"](),
		m = js_date[_ + "Month"](),
		y = js_date[_ + "FullYear"](),
		H = js_date[_ + "Hours"](),
		M = js_date[_ + "Minutes"](),
		s = js_date[_ + "Seconds"](),
		L = js_date[_ + "Milliseconds"](),
		o = utc ? 0 : js_date.getTimezoneOffset(),
		year = "",
		flags = {
			d:    d,
			dd:   VCO.Util.pad(d),
			ddd:  this.date.day_abbr[D],
			dddd: this.date.day[D],
			m:    m + 1,
			mm:   VCO.Util.pad(m + 1),
			mmm:  this.date.month_abbr[m],
			mmmm: this.date.month[m],
			yy:   String(y).slice(2),
			yyyy: (y < 0 && this.has_negative_year_modifier()) ? Math.abs(y) : y,
			h:    H % 12 || 12,
			hh:   VCO.Util.pad(H % 12 || 12),
			H:    H,
			HH:   VCO.Util.pad(H),
			M:    M,
			MM:   VCO.Util.pad(M),
			s:    s,
			ss:   VCO.Util.pad(s),
			l:    VCO.Util.pad(L, 3),
			L:    VCO.Util.pad(L > 99 ? Math.round(L / 10) : L),
			t:    H < 12 ? "a"  : "p",
			tt:   H < 12 ? "am" : "pm",
			T:    H < 12 ? "A"  : "P",
			TT:   H < 12 ? "AM" : "PM",
			Z:    utc ? "UTC" : (String(js_date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
			o:    (o > 0 ? "-" : "+") + VCO.Util.pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
			S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
		};

		var formatted = mask.replace(VCO.Language.DATE_FORMAT_TOKENS, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});

		return this._applyEra(formatted, y);
}

VCO.Language.prototype.has_negative_year_modifier = function() {
	return Boolean(this.era_labels.negative_year.prefix || this.era_labels.negative_year.suffix);
}


VCO.Language.prototype._applyEra = function(formatted_date, original_year) {
	// trusts that the formatted_date was property created with a non-negative year if there are 
	// negative affixes to be applied
	var smart_concat = function() {
		var parts = [];
		for (var i = 0; i < arguments.length; i++) {
			if (arguments[i]) parts.push(arguments[i]);
		}
		return parts.join(' ');
	}
	var labels = (original_year < 0) ? this.era_labels.negative_year : this.era_labels.positive_year;
	return smart_concat(labels.prefix,formatted_date,labels.suffix);
}


VCO.Language.DATE_FORMAT_TOKENS = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g;

VCO.Language.languages = {
	en: {
		name: 					"English",
		lang: 					"en",
		messages: {
			loading: 			"Loading",
			wikipedia: 			"From Wikipedia, the free encyclopedia"
		},
		date: {
			month: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
			month_abbr: ["Jan.", "Feb.", "March", "April", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."],
			day: ["Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
			day_abbr: ["Sun.","Mon.", "Tues.", "Wed.", "Thurs.", "Fri.", "Sat."]
		}, 
		era_labels: { // specify prefix or suffix to apply to formatted date. Blanks mean no change. 
	        positive_year: {
	        	prefix: '', 
	        	suffix: ''
	        },
	        negative_year: { // if either of these is specified, the year will be converted to positive before they are applied
	        	prefix: '', 
	        	suffix: 'BCE'
	        }
        },
		dateformats: {
			year: "yyyy",
			month_short: "mmm",
			month: "mmmm yyyy",
			full_short: "mmm d",
			full: "mmmm d',' yyyy",
			time: "h:MM:ss TT' <small>'mmmm d',' yyyy'</small>'",
			time_short: "h:MM:ss TT",
			time_no_seconds_short: "h:MM TT",
			time_no_minutes_short: "h TT",
			time_no_seconds_small_date: "h:MM TT' <small>'mmmm d',' yyyy'</small>'",
			full_long: "mmm d',' yyyy 'at' h:MM TT",
			full_long_small_date: "h:MM TT' <small>mmm d',' yyyy'</small>'"
		},
		bigdateformats: {
			fallback: [ // a list of tuples, with t[0] an order of magnitude and t[1] a format string. format string syntax may change...
				[1000000000,"%.2f billion years ago"],
				[1000000,"%.1f million years ago"],
				[1000,"%.1f thousand years ago"],
				[1, "%f years ago"]
			],
		    compact: [ 
				[1000000000,"%.2f bya"],
				[1000000,"%.1f mya"],
				[1000,"%.1f kya"],
				[1, "%f years ago"]
			],
		    verbose: [ 
				[1000000000,"%.2f billion years ago"],
				[1000000,"%.1f million years ago"],
				[1000,"%.1f thousand years ago"],
				[1, "%f years ago"]
			]		
		}
	}
}

VCO.Language.fallback = new VCO.Language();


/*  VCO.I18NMixins
    assumes that its class has an options object with a VCO.Language instance    
================================================== */
VCO.I18NMixins = {
    getLanguage: function() {
        if (this.options && this.options.language) {
            return this.options.language;
        }
        trace("Expected a language option");
        return VCO.Language.fallback;
    },

    _: function(msg) {
        return this.getLanguage()._(msg);
    }
}


/* The equations defined here are open source under BSD License.
 * http://www.robertpenner.com/easing_terms_of_use.html (c) 2003 Robert Penner
 * Adapted to single time-based by
 * Brian Crescimanno <brian.crescimanno@gmail.com>
 * Ken Snyder <kendsnyder@gmail.com>
 */

/** MIT License
 *
 * KeySpline - use bezier curve for transition easing function
 * Copyright (c) 2012 Gaetan Renaudeau <renaudeau.gaetan@gmail.com>
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */
/**
 * KeySpline - use bezier curve for transition easing function
 * is inspired from Firefox's nsSMILKeySpline.cpp
 * Usage:
 * var spline = new KeySpline(0.25, 0.1, 0.25, 1.0)
 * spline.get(x) => returns the easing value | x must be in [0, 1] range
 */

VCO.Easings = {
    ease:        [0.25, 0.1, 0.25, 1.0], 
    linear:      [0.00, 0.0, 1.00, 1.0],
    easein:     [0.42, 0.0, 1.00, 1.0],
    easeout:    [0.00, 0.0, 0.58, 1.0],
    easeinout: [0.42, 0.0, 0.58, 1.0]
};

VCO.Ease = {
	KeySpline: function(a) {
	//KeySpline: function(mX1, mY1, mX2, mY2) {
		this.get = function(aX) {
			if (a[0] == a[1] && a[2] == a[3]) return aX; // linear
			return CalcBezier(GetTForX(aX), a[1], a[3]);
		}

		function A(aA1, aA2) {
			return 1.0 - 3.0 * aA2 + 3.0 * aA1;
		}

		function B(aA1, aA2) {
			return 3.0 * aA2 - 6.0 * aA1;
		}

		function C(aA1) {
			return 3.0 * aA1;
		}

		// Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.

		function CalcBezier(aT, aA1, aA2) {
			return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
		}

		// Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.

		function GetSlope(aT, aA1, aA2) {
			return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
		}

		function GetTForX(aX) {
			// Newton raphson iteration
			var aGuessT = aX;
			for (var i = 0; i < 4; ++i) {
				var currentSlope = GetSlope(aGuessT, a[0], a[2]);
				if (currentSlope == 0.0) return aGuessT;
				var currentX = CalcBezier(aGuessT, a[0], a[2]) - aX;
				aGuessT -= currentX / currentSlope;
			}
			return aGuessT;
		}
	},
	
	easeInSpline: function(t) {
		var spline = new VCO.Ease.KeySpline(VCO.Easings.easein);
		return spline.get(t);
	},
	
	easeInOutExpo: function(t) {
		var spline = new VCO.Ease.KeySpline(VCO.Easings.easein);
		return spline.get(t);
	},
	
	easeOut: function(t) {
		return Math.sin(t * Math.PI / 2);
	},
	easeOutStrong: function(t) {
		return (t == 1) ? 1 : 1 - Math.pow(2, - 10 * t);
	},
	easeIn: function(t) {
		return t * t;
	},
	easeInStrong: function(t) {
		return (t == 0) ? 0 : Math.pow(2, 10 * (t - 1));
	},
	easeOutBounce: function(pos) {
		if ((pos) < (1 / 2.75)) {
			return (7.5625 * pos * pos);
		} else if (pos < (2 / 2.75)) {
			return (7.5625 * (pos -= (1.5 / 2.75)) * pos + .75);
		} else if (pos < (2.5 / 2.75)) {
			return (7.5625 * (pos -= (2.25 / 2.75)) * pos + .9375);
		} else {
			return (7.5625 * (pos -= (2.625 / 2.75)) * pos + .984375);
		}
	},
	easeInBack: function(pos) {
		var s = 1.70158;
		return (pos) * pos * ((s + 1) * pos - s);
	},
	easeOutBack: function(pos) {
		var s = 1.70158;
		return (pos = pos - 1) * pos * ((s + 1) * pos + s) + 1;
	},
	bounce: function(t) {
		if (t < (1 / 2.75)) {
			return 7.5625 * t * t;
		}
		if (t < (2 / 2.75)) {
			return 7.5625 * (t -= (1.5 / 2.75)) * t + 0.75;
		}
		if (t < (2.5 / 2.75)) {
			return 7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375;
		}
		return 7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375;
	},
	bouncePast: function(pos) {
		if (pos < (1 / 2.75)) {
			return (7.5625 * pos * pos);
		} else if (pos < (2 / 2.75)) {
			return 2 - (7.5625 * (pos -= (1.5 / 2.75)) * pos + .75);
		} else if (pos < (2.5 / 2.75)) {
			return 2 - (7.5625 * (pos -= (2.25 / 2.75)) * pos + .9375);
		} else {
			return 2 - (7.5625 * (pos -= (2.625 / 2.75)) * pos + .984375);
		}
	},
	swingTo: function(pos) {
		var s = 1.70158;
		return (pos -= 1) * pos * ((s + 1) * pos + s) + 1;
	},
	swingFrom: function(pos) {
		var s = 1.70158;
		return pos * pos * ((s + 1) * pos - s);
	},
	elastic: function(pos) {
		return -1 * Math.pow(4, - 8 * pos) * Math.sin((pos * 6 - 1) * (2 * Math.PI) / 2) + 1;
	},
	spring: function(pos) {
		return 1 - (Math.cos(pos * 4.5 * Math.PI) * Math.exp(-pos * 6));
	},
	blink: function(pos, blinks) {
		return Math.round(pos * (blinks || 5)) % 2;
	},
	pulse: function(pos, pulses) {
		return (-Math.cos((pos * ((pulses || 5) - .5) * 2) * Math.PI) / 2) + .5;
	},
	wobble: function(pos) {
		return (-Math.cos(pos * Math.PI * (9 * pos)) / 2) + 0.5;
	},
	sinusoidal: function(pos) {
		return (-Math.cos(pos * Math.PI) / 2) + 0.5;
	},
	flicker: function(pos) {
		var pos = pos + (Math.random() - 0.5) / 5;
		return easings.sinusoidal(pos < 0 ? 0 : pos > 1 ? 1 : pos);
	},
	mirror: function(pos) {
		if (pos < 0.5) return easings.sinusoidal(pos * 2);
		else return easings.sinusoidal(1 - (pos - 0.5) * 2);
	},
	// accelerating from zero velocity
	easeInQuad: function (t) { return t*t },
	// decelerating to zero velocity
	easeOutQuad: function (t) { return t*(2-t) },
	// acceleration until halfway, then deceleration
	easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
	// accelerating from zero velocity 
	easeInCubic: function (t) { return t*t*t },
	// decelerating to zero velocity 
	easeOutCubic: function (t) { return (--t)*t*t+1 },
	// acceleration until halfway, then deceleration 
	easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
	// accelerating from zero velocity 
	easeInQuart: function (t) { return t*t*t*t },
	// decelerating to zero velocity 
	easeOutQuart: function (t) { return 1-(--t)*t*t*t },
	// acceleration until halfway, then deceleration
	easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
	// accelerating from zero velocity
	easeInQuint: function (t) { return t*t*t*t*t },
	// decelerating to zero velocity
	easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
	// acceleration until halfway, then deceleration 
	easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
};

/*
Math.easeInExpo = function (t, b, c, d) {
	return c * Math.pow( 2, 10 * (t/d - 1) ) + b;
};

		

// exponential easing out - decelerating to zero velocity


Math.easeOutExpo = function (t, b, c, d) {
	return c * ( -Math.pow( 2, -10 * t/d ) + 1 ) + b;
};

		

// exponential easing in/out - accelerating until halfway, then decelerating


Math.easeInOutExpo = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2 * Math.pow( 2, 10 * (t - 1) ) + b;
	t--;
	return c/2 * ( -Math.pow( 2, -10 * t) + 2 ) + b;
};
*/

/*	VCO.Animate
	Basic animation
================================================== */

VCO.Animate = function(el, options) {
	var animation = new vcoanimate(el, options),
		webkit_timeout;
		/*
		// POSSIBLE ISSUE WITH WEBKIT FUTURE BUILDS
	var onWebKitTimeout = function() {

		animation.stop(true);
	}
	if (VCO.Browser.webkit) {
		webkit_timeout = setTimeout(function(){onWebKitTimeout()}, options.duration);
	}
	*/
	return animation;
};


/*	Based on: Morpheus
	https://github.com/ded/morpheus - (c) Dustin Diaz 2011
	License MIT
================================================== */
window.vcoanimate = (function() {

	var doc = document,
		win = window,
		perf = win.performance,
		perfNow = perf && (perf.now || perf.webkitNow || perf.msNow || perf.mozNow),
		now = perfNow ? function () { return perfNow.call(perf) } : function () { return +new Date() },
		html = doc.documentElement,
		fixTs = false, // feature detected below
		thousand = 1000,
		rgbOhex = /^rgb\(|#/,
		relVal = /^([+\-])=([\d\.]+)/,
		numUnit = /^(?:[\+\-]=?)?\d+(?:\.\d+)?(%|in|cm|mm|em|ex|pt|pc|px)$/,
		rotate = /rotate\(((?:[+\-]=)?([\-\d\.]+))deg\)/,
		scale = /scale\(((?:[+\-]=)?([\d\.]+))\)/,
		skew = /skew\(((?:[+\-]=)?([\-\d\.]+))deg, ?((?:[+\-]=)?([\-\d\.]+))deg\)/,
		translate = /translate\(((?:[+\-]=)?([\-\d\.]+))px, ?((?:[+\-]=)?([\-\d\.]+))px\)/,
		// these elements do not require 'px'
		unitless = { lineHeight: 1, zoom: 1, zIndex: 1, opacity: 1, transform: 1};

  // which property name does this browser use for transform
	var transform = function () {
		var styles = doc.createElement('a').style,
			props = ['webkitTransform', 'MozTransform', 'OTransform', 'msTransform', 'Transform'],
			i;

		for (i = 0; i < props.length; i++) {
			if (props[i] in styles) return props[i]
		};
	}();

	// does this browser support the opacity property?
	var opacity = function () {
		return typeof doc.createElement('a').style.opacity !== 'undefined'
	}();

	// initial style is determined by the elements themselves
	var getStyle = doc.defaultView && doc.defaultView.getComputedStyle ?
	function (el, property) {
		property = property == 'transform' ? transform : property
		property = camelize(property)
		var value = null,
			computed = doc.defaultView.getComputedStyle(el, '');

		computed && (value = computed[property]);
		return el.style[property] || value;
	} : html.currentStyle ?

    function (el, property) {
		property = camelize(property)

		if (property == 'opacity') {
			var val = 100
			try {
				val = el.filters['DXImageTransform.Microsoft.Alpha'].opacity
			} catch (e1) {
				try {
					val = el.filters('alpha').opacity
				} catch (e2) {

				}
			}
			return val / 100
		}
		var value = el.currentStyle ? el.currentStyle[property] : null
		return el.style[property] || value
	} :

    function (el, property) {
		return el.style[camelize(property)]
    }

  var frame = function () {
    // native animation frames
    // http://webstuff.nfshost.com/anim-timing/Overview.html
    // http://dev.chromium.org/developers/design-documents/requestanimationframe-implementation
    return win.requestAnimationFrame  ||
      win.webkitRequestAnimationFrame ||
      win.mozRequestAnimationFrame    ||
      win.msRequestAnimationFrame     ||
      win.oRequestAnimationFrame      ||
      function (callback) {
        win.setTimeout(function () {
          callback(+new Date())
        }, 17) // when I was 17..
      }
  }()

  var children = []

	frame(function(timestamp) {
	  	// feature-detect if rAF and now() are of the same scale (epoch or high-res),
		// if not, we have to do a timestamp fix on each frame
		fixTs = timestamp > 1e12 != now() > 1e12
	})

  function has(array, elem, i) {
    if (Array.prototype.indexOf) return array.indexOf(elem)
    for (i = 0; i < array.length; ++i) {
      if (array[i] === elem) return i
    }
  }

  function render(timestamp) {
    var i, count = children.length
    // if we're using a high res timer, make sure timestamp is not the old epoch-based value.
    // http://updates.html5rocks.com/2012/05/requestAnimationFrame-API-now-with-sub-millisecond-precision
    if (perfNow && timestamp > 1e12) timestamp = now()
	if (fixTs) timestamp = now()
    for (i = count; i--;) {
      children[i](timestamp)
    }
    children.length && frame(render)
  }

  function live(f) {
    if (children.push(f) === 1) frame(render)
  }

  function die(f) {
    var rest, index = has(children, f)
    if (index >= 0) {
      rest = children.slice(index + 1)
      children.length = index
      children = children.concat(rest)
    }
  }

  function parseTransform(style, base) {
    var values = {}, m
    if (m = style.match(rotate)) values.rotate = by(m[1], base ? base.rotate : null)
    if (m = style.match(scale)) values.scale = by(m[1], base ? base.scale : null)
    if (m = style.match(skew)) {values.skewx = by(m[1], base ? base.skewx : null); values.skewy = by(m[3], base ? base.skewy : null)}
    if (m = style.match(translate)) {values.translatex = by(m[1], base ? base.translatex : null); values.translatey = by(m[3], base ? base.translatey : null)}
    return values
  }

  function formatTransform(v) {
    var s = ''
    if ('rotate' in v) s += 'rotate(' + v.rotate + 'deg) '
    if ('scale' in v) s += 'scale(' + v.scale + ') '
    if ('translatex' in v) s += 'translate(' + v.translatex + 'px,' + v.translatey + 'px) '
    if ('skewx' in v) s += 'skew(' + v.skewx + 'deg,' + v.skewy + 'deg)'
    return s
  }

  function rgb(r, g, b) {
    return '#' + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)
  }

  // convert rgb and short hex to long hex
  function toHex(c) {
    var m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
    return (m ? rgb(m[1], m[2], m[3]) : c)
      .replace(/#(\w)(\w)(\w)$/, '#$1$1$2$2$3$3') // short skirt to long jacket
  }

  // change font-size => fontSize etc.
  function camelize(s) {
    return s.replace(/-(.)/g, function (m, m1) {
      return m1.toUpperCase()
    })
  }

  // aren't we having it?
  function fun(f) {
    return typeof f == 'function'
  }

  function nativeTween(t) {
    // default to a pleasant-to-the-eye easeOut (like native animations)
    return Math.sin(t * Math.PI / 2)
  }

  /**
    * Core tween method that requests each frame
    * @param duration: time in milliseconds. defaults to 1000
    * @param fn: tween frame callback function receiving 'position'
    * @param done {optional}: complete callback function
    * @param ease {optional}: easing method. defaults to easeOut
    * @param from {optional}: integer to start from
    * @param to {optional}: integer to end at
    * @returns method to stop the animation
    */
  function tween(duration, fn, done, ease, from, to) {
    ease = fun(ease) ? ease : morpheus.easings[ease] || nativeTween
    var time = duration || thousand
      , self = this
      , diff = to - from
      , start = now()
      , stop = 0
      , end = 0

    function run(t) {
      var delta = t - start
      if (delta > time || stop) {
        to = isFinite(to) ? to : 1
        stop ? end && fn(to) : fn(to)
        die(run)
        return done && done.apply(self)
      }
      // if you don't specify a 'to' you can use tween as a generic delta tweener
      // cool, eh?
      isFinite(to) ?
        fn((diff * ease(delta / time)) + from) :
        fn(ease(delta / time))
    }

    live(run)

    return {
      stop: function (jump) {
        stop = 1
        end = jump // jump to end of animation?
        if (!jump) done = null // remove callback if not jumping to end
      }
    }
  }

  /**
    * generic bezier method for animating x|y coordinates
    * minimum of 2 points required (start and end).
    * first point start, last point end
    * additional control points are optional (but why else would you use this anyway ;)
    * @param points: array containing control points
       [[0, 0], [100, 200], [200, 100]]
    * @param pos: current be(tween) position represented as float  0 - 1
    * @return [x, y]
    */
  function bezier(points, pos) {
    var n = points.length, r = [], i, j
    for (i = 0; i < n; ++i) {
      r[i] = [points[i][0], points[i][1]]
    }
    for (j = 1; j < n; ++j) {
      for (i = 0; i < n - j; ++i) {
        r[i][0] = (1 - pos) * r[i][0] + pos * r[parseInt(i + 1, 10)][0]
        r[i][1] = (1 - pos) * r[i][1] + pos * r[parseInt(i + 1, 10)][1]
      }
    }
    return [r[0][0], r[0][1]]
  }

  // this gets you the next hex in line according to a 'position'
  function nextColor(pos, start, finish) {
    var r = [], i, e, from, to
    for (i = 0; i < 6; i++) {
      from = Math.min(15, parseInt(start.charAt(i),  16))
      to   = Math.min(15, parseInt(finish.charAt(i), 16))
      e = Math.floor((to - from) * pos + from)
      e = e > 15 ? 15 : e < 0 ? 0 : e
      r[i] = e.toString(16)
    }
    return '#' + r.join('')
  }

  // this retreives the frame value within a sequence
  function getTweenVal(pos, units, begin, end, k, i, v) {
    if (k == 'transform') {
      v = {}
      for (var t in begin[i][k]) {
        v[t] = (t in end[i][k]) ? Math.round(((end[i][k][t] - begin[i][k][t]) * pos + begin[i][k][t]) * thousand) / thousand : begin[i][k][t]
      }
      return v
    } else if (typeof begin[i][k] == 'string') {
      return nextColor(pos, begin[i][k], end[i][k])
    } else {
      // round so we don't get crazy long floats
      v = Math.round(((end[i][k] - begin[i][k]) * pos + begin[i][k]) * thousand) / thousand
      // some css properties don't require a unit (like zIndex, lineHeight, opacity)
      if (!(k in unitless)) v += units[i][k] || 'px'
      return v
    }
  }

  // support for relative movement via '+=n' or '-=n'
  function by(val, start, m, r, i) {
    return (m = relVal.exec(val)) ?
      (i = parseFloat(m[2])) && (start + (m[1] == '+' ? 1 : -1) * i) :
      parseFloat(val)
  }

  /**
    * morpheus:
    * @param element(s): HTMLElement(s)
    * @param options: mixed bag between CSS Style properties & animation options
    *  - {n} CSS properties|values
    *     - value can be strings, integers,
    *     - or callback function that receives element to be animated. method must return value to be tweened
    *     - relative animations start with += or -= followed by integer
    *  - duration: time in ms - defaults to 1000(ms)
    *  - easing: a transition method - defaults to an 'easeOut' algorithm
    *  - complete: a callback method for when all elements have finished
    *  - bezier: array of arrays containing x|y coordinates that define the bezier points. defaults to none
    *     - this may also be a function that receives element to be animated. it must return a value
    */
  function morpheus(elements, options) {
    var els = elements ? (els = isFinite(elements.length) ? elements : [elements]) : [], i
      , complete = options.complete
      , duration = options.duration
      , ease = options.easing
      , points = options.bezier
      , begin = []
      , end = []
      , units = []
      , bez = []
      , originalLeft
      , originalTop

    if (points) {
      // remember the original values for top|left
      originalLeft = options.left;
      originalTop = options.top;
      delete options.right;
      delete options.bottom;
      delete options.left;
      delete options.top;
    }

    for (i = els.length; i--;) {

      // record beginning and end states to calculate positions
      begin[i] = {}
      end[i] = {}
      units[i] = {}

      // are we 'moving'?
      if (points) {

        var left = getStyle(els[i], 'left')
          , top = getStyle(els[i], 'top')
          , xy = [by(fun(originalLeft) ? originalLeft(els[i]) : originalLeft || 0, parseFloat(left)),
                  by(fun(originalTop) ? originalTop(els[i]) : originalTop || 0, parseFloat(top))]

        bez[i] = fun(points) ? points(els[i], xy) : points
        bez[i].push(xy)
        bez[i].unshift([
          parseInt(left, 10),
          parseInt(top, 10)
        ])
      }

      for (var k in options) {
        switch (k) {
        case 'complete':
        case 'duration':
        case 'easing':
        case 'bezier':
          continue
        }
        var v = getStyle(els[i], k), unit
          , tmp = fun(options[k]) ? options[k](els[i]) : options[k]
        if (typeof tmp == 'string' &&
            rgbOhex.test(tmp) &&
            !rgbOhex.test(v)) {
          delete options[k]; // remove key :(
          continue; // cannot animate colors like 'orange' or 'transparent'
                    // only #xxx, #xxxxxx, rgb(n,n,n)
        }

        begin[i][k] = k == 'transform' ? parseTransform(v) :
          typeof tmp == 'string' && rgbOhex.test(tmp) ?
            toHex(v).slice(1) :
            parseFloat(v)
        end[i][k] = k == 'transform' ? parseTransform(tmp, begin[i][k]) :
          typeof tmp == 'string' && tmp.charAt(0) == '#' ?
            toHex(tmp).slice(1) :
            by(tmp, parseFloat(v));
        // record original unit
        (typeof tmp == 'string') && (unit = tmp.match(numUnit)) && (units[i][k] = unit[1])
      }
    }
    // ONE TWEEN TO RULE THEM ALL
    return tween.apply(els, [duration, function (pos, v, xy) {
      // normally not a fan of optimizing for() loops, but we want something
      // fast for animating
      for (i = els.length; i--;) {
        if (points) {
          xy = bezier(bez[i], pos)
          els[i].style.left = xy[0] + 'px'
          els[i].style.top = xy[1] + 'px'
        }
        for (var k in options) {
          v = getTweenVal(pos, units, begin, end, k, i)
          k == 'transform' ?
            els[i].style[transform] = formatTransform(v) :
            k == 'opacity' && !opacity ?
              (els[i].style.filter = 'alpha(opacity=' + (v * 100) + ')') :
              (els[i].style[camelize(k)] = v)
        }
      }
    }, complete, ease])
  }

  // expose useful methods
  morpheus.tween = tween
  morpheus.getStyle = getStyle
  morpheus.bezier = bezier
  morpheus.transform = transform
  morpheus.parseTransform = parseTransform
  morpheus.formatTransform = formatTransform
  morpheus.easings = {}

  return morpheus
})();


/*	VCO.Point
	Inspired by Leaflet
	VCO.Point represents a point with x and y coordinates.
================================================== */

VCO.Point = function (/*Number*/ x, /*Number*/ y, /*Boolean*/ round) {
	this.x = (round ? Math.round(x) : x);
	this.y = (round ? Math.round(y) : y);
};

VCO.Point.prototype = {
	add: function (point) {
		return this.clone()._add(point);
	},

	_add: function (point) {
		this.x += point.x;
		this.y += point.y;
		return this;
	},

	subtract: function (point) {
		return this.clone()._subtract(point);
	},

	// destructive subtract (faster)
	_subtract: function (point) {
		this.x -= point.x;
		this.y -= point.y;
		return this;
	},

	divideBy: function (num, round) {
		return new VCO.Point(this.x / num, this.y / num, round);
	},

	multiplyBy: function (num) {
		return new VCO.Point(this.x * num, this.y * num);
	},

	distanceTo: function (point) {
		var x = point.x - this.x,
			y = point.y - this.y;
		return Math.sqrt(x * x + y * y);
	},

	round: function () {
		return this.clone()._round();
	},

	// destructive round
	_round: function () {
		this.x = Math.round(this.x);
		this.y = Math.round(this.y);
		return this;
	},

	clone: function () {
		return new VCO.Point(this.x, this.y);
	},

	toString: function () {
		return 'Point(' +
				VCO.Util.formatNum(this.x) + ', ' +
				VCO.Util.formatNum(this.y) + ')';
	}
};

/*	VCO.DomMixins
	DOM methods used regularly
	Assumes there is a _el.container and animator
================================================== */
VCO.DomMixins = {
	
	/*	Adding, Hiding, Showing etc
	================================================== */
	show: function(animate) {
		if (animate) {
			/*
			this.animator = VCO.Animate(this._el.container, {
				left: 		-(this._el.container.offsetWidth * n) + "px",
				duration: 	this.options.duration,
				easing: 	this.options.ease
			});
			*/
		} else {
			this._el.container.style.display = "block";
		}
	},
	
	hide: function(animate) {
		this._el.container.style.display = "none";
	},
	
	addTo: function(container) {
		container.appendChild(this._el.container);
		this.onAdd();
	},
	
	removeFrom: function(container) {
		container.removeChild(this._el.container);
		this.onRemove();
	},
	
	/*	Animate to Position
	================================================== */
	animatePosition: function(pos, el) {
		var ani = {
			duration: 	this.options.duration,
			easing: 	this.options.ease
		};
		for (var name in pos) {
			if (pos.hasOwnProperty(name)) {
				ani[name] = pos[name] + "px";
			}
		}
		
		if (this.animator) {
			this.animator.stop();
		}
		this.animator = VCO.Animate(el, ani);
	},
	
	/*	Events
	================================================== */
	
	onLoaded: function() {
		this.fire("loaded", this.data);
	},
	
	onAdd: function() {
		this.fire("added", this.data);
	},

	onRemove: function() {
		this.fire("removed", this.data);
	},
	
	/*	Set the Position
	================================================== */
	setPosition: function(pos, el) {
		for (var name in pos) {
			if (pos.hasOwnProperty(name)) {
				if (el) {
					el.style[name] = pos[name] + "px";
				} else {
					this._el.container.style[name] = pos[name] + "px";
				};
			}
		}
	},
	
	getPosition: function() {
		return VCO.Dom.getPosition(this._el.container);
	}
	
};


/*	VCO.Dom
	Utilities for working with the DOM
================================================== */

VCO.Dom = {

	get: function(id) {
		return (typeof id === 'string' ? document.getElementById(id) : id);
	},
	
	getByClass: function(id) {
		if (id) {
			return document.getElementsByClassName(id);
		}
	},
	
	create: function(tagName, className, container) {
		var el = document.createElement(tagName);
		el.className = className;
		if (container) {
			container.appendChild(el);
		}
		return el;
	},
	
	createText: function(content, container) {
		var el = document.createTextNode(content);
		if (container) {
			container.appendChild(el);
		}
		return el;
	},
	
	getTranslateString: function (point) {
		return VCO.Dom.TRANSLATE_OPEN +
				point.x + 'px,' + point.y + 'px' +
				VCO.Dom.TRANSLATE_CLOSE;
	},
	
	setPosition: function (el, point) {
		el._vco_pos = point;
		if (VCO.Browser.webkit3d) {
			el.style[VCO.Dom.TRANSFORM] =  VCO.Dom.getTranslateString(point);

			if (VCO.Browser.android) {
				el.style['-webkit-perspective'] = '1000';
				el.style['-webkit-backface-visibility'] = 'hidden';
			}
		} else {
			el.style.left = point.x + 'px';
			el.style.top = point.y + 'px';
		}
	},
	
	getPosition: function(el){
	    var pos = {
	    	x: 0,
			y: 0
	    }
	    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
	        pos.x += el.offsetLeft// - el.scrollLeft;
	        pos.y += el.offsetTop// - el.scrollTop;
	        el = el.offsetParent;
	    }
	    return pos;
	},

	testProp: function(props) {
		var style = document.documentElement.style;

		for (var i = 0; i < props.length; i++) {
			if (props[i] in style) {
				return props[i];
			}
		}
		return false;
	}
	
};

VCO.Util.extend(VCO.Dom, {
	TRANSITION: VCO.Dom.testProp(['transition', 'webkitTransition', 'OTransition', 'MozTransition', 'msTransition']),
	TRANSFORM: VCO.Dom.testProp(['transformProperty', 'WebkitTransform', 'OTransform', 'MozTransform', 'msTransform']),

	TRANSLATE_OPEN: 'translate' + (VCO.Browser.webkit3d ? '3d(' : '('),
	TRANSLATE_CLOSE: VCO.Browser.webkit3d ? ',0)' : ')'
});


/*	VCO.DomUtil
	Inspired by Leaflet
	VCO.DomUtil contains various utility functions for working with DOM
================================================== */


VCO.DomUtil = {
	get: function (id) {
		return (typeof id === 'string' ? document.getElementById(id) : id);
	},

	getStyle: function (el, style) {
		var value = el.style[style];
		if (!value && el.currentStyle) {
			value = el.currentStyle[style];
		}
		if (!value || value === 'auto') {
			var css = document.defaultView.getComputedStyle(el, null);
			value = css ? css[style] : null;
		}
		return (value === 'auto' ? null : value);
	},

	getViewportOffset: function (element) {
		var top = 0,
			left = 0,
			el = element,
			docBody = document.body;

		do {
			top += el.offsetTop || 0;
			left += el.offsetLeft || 0;

			if (el.offsetParent === docBody &&
					VCO.DomUtil.getStyle(el, 'position') === 'absolute') {
				break;
			}
			el = el.offsetParent;
		} while (el);

		el = element;

		do {
			if (el === docBody) {
				break;
			}

			top -= el.scrollTop || 0;
			left -= el.scrollLeft || 0;

			el = el.parentNode;
		} while (el);

		return new VCO.Point(left, top);
	},

	create: function (tagName, className, container) {
		var el = document.createElement(tagName);
		el.className = className;
		if (container) {
			container.appendChild(el);
		}
		return el;
	},

	disableTextSelection: function () {
		if (document.selection && document.selection.empty) {
			document.selection.empty();
		}
		if (!this._onselectstart) {
			this._onselectstart = document.onselectstart;
			document.onselectstart = VCO.Util.falseFn;
		}
	},

	enableTextSelection: function () {
		document.onselectstart = this._onselectstart;
		this._onselectstart = null;
	},

	hasClass: function (el, name) {
		return (el.className.length > 0) &&
				new RegExp("(^|\\s)" + name + "(\\s|$)").test(el.className);
	},

	addClass: function (el, name) {
		if (!VCO.DomUtil.hasClass(el, name)) {
			el.className += (el.className ? ' ' : '') + name;
		}
	},

	removeClass: function (el, name) {
		el.className = el.className.replace(/(\S+)\s*/g, function (w, match) {
			if (match === name) {
				return '';
			}
			return w;
		}).replace(/^\s+/, '');
	},

	setOpacity: function (el, value) {
		if (VCO.Browser.ie) {
			el.style.filter = 'alpha(opacity=' + Math.round(value * 100) + ')';
		} else {
			el.style.opacity = value;
		}
	},


	testProp: function (props) {
		var style = document.documentElement.style;

		for (var i = 0; i < props.length; i++) {
			if (props[i] in style) {
				return props[i];
			}
		}
		return false;
	},

	getTranslateString: function (point) {

		return VCO.DomUtil.TRANSLATE_OPEN +
				point.x + 'px,' + point.y + 'px' +
				VCO.DomUtil.TRANSLATE_CLOSE;
	},

	getScaleString: function (scale, origin) {
		var preTranslateStr = VCO.DomUtil.getTranslateString(origin),
			scaleStr = ' scale(' + scale + ') ',
			postTranslateStr = VCO.DomUtil.getTranslateString(origin.multiplyBy(-1));

		return preTranslateStr + scaleStr + postTranslateStr;
	},

	setPosition: function (el, point) {
		el._vco_pos = point;
		if (VCO.Browser.webkit3d) {
			el.style[VCO.DomUtil.TRANSFORM] =  VCO.DomUtil.getTranslateString(point);

			if (VCO.Browser.android) {
				el.style['-webkit-perspective'] = '1000';
				el.style['-webkit-backface-visibility'] = 'hidden';
			}
		} else {
			el.style.left = point.x + 'px';
			el.style.top = point.y + 'px';
		}
	},

	getPosition: function (el) {
		return el._vco_pos;
	}
};

/*	VCO.DomEvent
	Inspired by Leaflet 
	DomEvent contains functions for working with DOM events.
================================================== */
// TODO stamp

VCO.DomEvent = {
	/* inpired by John Resig, Dean Edwards and YUI addEvent implementations */
	addListener: function (/*HTMLElement*/ obj, /*String*/ type, /*Function*/ fn, /*Object*/ context) {
		var id = VCO.Util.stamp(fn),
			key = '_vco_' + type + id;

		if (obj[key]) {
			return;
		}

		var handler = function (e) {
			return fn.call(context || obj, e || VCO.DomEvent._getEvent());
		};

		if (VCO.Browser.touch && (type === 'dblclick') && this.addDoubleTapListener) {
			this.addDoubleTapListener(obj, handler, id);
		} else if ('addEventListener' in obj) {
			if (type === 'mousewheel') {
				obj.addEventListener('DOMMouseScroll', handler, false);
				obj.addEventListener(type, handler, false);
			} else if ((type === 'mouseenter') || (type === 'mouseleave')) {
				var originalHandler = handler,
					newType = (type === 'mouseenter' ? 'mouseover' : 'mouseout');
				handler = function (e) {
					if (!VCO.DomEvent._checkMouse(obj, e)) {
						return;
					}
					return originalHandler(e);
				};
				obj.addEventListener(newType, handler, false);
			} else {
				obj.addEventListener(type, handler, false);
			}
		} else if ('attachEvent' in obj) {
			obj.attachEvent("on" + type, handler);
		}

		obj[key] = handler;
	},

	removeListener: function (/*HTMLElement*/ obj, /*String*/ type, /*Function*/ fn) {
		var id = VCO.Util.stamp(fn),
			key = '_vco_' + type + id,
			handler = obj[key];

		if (!handler) {
			return;
		}

		if (VCO.Browser.touch && (type === 'dblclick') && this.removeDoubleTapListener) {
			this.removeDoubleTapListener(obj, id);
		} else if ('removeEventListener' in obj) {
			if (type === 'mousewheel') {
				obj.removeEventListener('DOMMouseScroll', handler, false);
				obj.removeEventListener(type, handler, false);
			} else if ((type === 'mouseenter') || (type === 'mouseleave')) {
				obj.removeEventListener((type === 'mouseenter' ? 'mouseover' : 'mouseout'), handler, false);
			} else {
				obj.removeEventListener(type, handler, false);
			}
		} else if ('detachEvent' in obj) {
			obj.detachEvent("on" + type, handler);
		}
		obj[key] = null;
	},

	_checkMouse: function (el, e) {
		var related = e.relatedTarget;

		if (!related) {
			return true;
		}

		try {
			while (related && (related !== el)) {
				related = related.parentNode;
			}
		} catch (err) {
			return false;
		}

		return (related !== el);
	},

	/*jshint noarg:false */ // evil magic for IE
	_getEvent: function () {
		var e = window.event;
		if (!e) {
			var caller = arguments.callee.caller;
			while (caller) {
				e = caller['arguments'][0];
				if (e && window.Event === e.constructor) {
					break;
				}
				caller = caller.caller;
			}
		}
		return e;
	},
	/*jshint noarg:false */

	stopPropagation: function (/*Event*/ e) {
		if (e.stopPropagation) {
			e.stopPropagation();
		} else {
			e.cancelBubble = true;
		}
	},
	
	// TODO VCO.Draggable.START
	disableClickPropagation: function (/*HTMLElement*/ el) {
		VCO.DomEvent.addListener(el, VCO.Draggable.START, VCO.DomEvent.stopPropagation);
		VCO.DomEvent.addListener(el, 'click', VCO.DomEvent.stopPropagation);
		VCO.DomEvent.addListener(el, 'dblclick', VCO.DomEvent.stopPropagation);
	},

	preventDefault: function (/*Event*/ e) {
		if (e.preventDefault) {
			e.preventDefault();
		} else {
			e.returnValue = false;
		}
	},

	stop: function (e) {
		VCO.DomEvent.preventDefault(e);
		VCO.DomEvent.stopPropagation(e);
	},


	getWheelDelta: function (e) {
		var delta = 0;
		if (e.wheelDelta) {
			delta = e.wheelDelta / 120;
		}
		if (e.detail) {
			delta = -e.detail / 3;
		}
		return delta;
	}
};




/*	VCO.StyleSheet
	Style Sheet Object
================================================== */

VCO.StyleSheet = VCO.Class.extend({
	
	includes: [VCO.Events],
	
	_el: {},
	
	/*	Constructor
	================================================== */
	initialize: function() {
		// Borrowed from: http://davidwalsh.name/add-rules-stylesheets
		this.style = document.createElement("style");
		
		// WebKit hack :(
		this.style.appendChild(document.createTextNode(""));
		
		// Add the <style> element to the page
		document.head.appendChild(this.style);
		
		this.sheet = this.style.sheet;
		
	},
	
	addRule: function(selector, rules, index) {
		var _index = 0;
		
		if (index) {
			_index = index;
		}
		
		if("insertRule" in this.sheet) {
			this.sheet.insertRule(selector + "{" + rules + "}", _index);
		}
		else if("addRule" in this.sheet) {
			this.sheet.addRule(selector, rules, _index);
		}
	},
	

	/*	Events
	================================================== */
	onLoaded: function(error) {
		this._state.loaded = true;
		this.fire("loaded", this.data);
	}
	
});

/*	VCO.Date
	Date object
	MONTHS are 1-BASED, not 0-BASED (different from Javascript date objects)
================================================== */

//
// Class for javascript dates
//

VCO.Date = VCO.Class.extend({
     
    // @data = ms, JS Date object, or JS dictionary with date properties
	initialize: function (data, format, format_short) {
	    if (typeof(data) == 'number') {
			this.data = {
				format:     "yyyy mmmm",
				date_obj:   new Date(data)
			};	        
	    } else if(Date == data.constructor) {
			this.data = {
				format:     "yyyy mmmm",
				date_obj:   data
			};	        
	    } else {
	        this.data = JSON.parse(JSON.stringify(data)); // clone don't use by reference.
            this._createDateObj();            
	    }
	    
		this._setFormat(format, format_short);			
    },

	setDateFormat: function(format) {
		this.data.format = format;
	},
	
	getDisplayDate: function(language, format) {
	    if (this.data.display_text) {
	        return this.data.display_text;
	    }	    
        if (!language) {
            language = VCO.Language.fallback;
        }
        if (language.constructor != VCO.Language) {
            trace("First argument to getDisplayDate must be VCO.Language");
            language = VCO.Language.fallback;
        }

        var format_key = format || this.data.format;
        return language.formatDate(this.data.date_obj, format_key);
	},
	
	getMillisecond: function() {
		return this.getTime();
	},
	
	getTime: function() {
		return this.data.date_obj.getTime();
	},
	
	isBefore: function(other_date) { 
        if (!this.data.date_obj.constructor == other_date.data.date_obj.constructor) {
            throw("Can't compare VCO.Dates on different scales") // but should be able to compare 'cosmological scale' dates once we get to that...
        }
        if ('isBefore' in this.data.date_obj) {
            return this.data.date_obj['isBefore'](other_date.data.date_obj);
        }
        return this.data.date_obj < other_date.data.date_obj
	},

	isAfter: function(other_date) {
        if (!this.data.date_obj.constructor == other_date.data.date_obj.constructor) {
            throw("Can't compare VCO.Dates on different scales") // but should be able to compare 'cosmological scale' dates once we get to that...
        }
        if ('isAfter' in this.data.date_obj) {
            return this.data.date_obj['isAfter'](other_date.data.date_obj);
        }
        return this.data.date_obj > other_date.data.date_obj
	},

    // Return a new VCO.Date which has been 'floored' at the given scale.
    // @scale = string value from VCO.Date.SCALES    
    floor: function(scale) { 
        var d = new Date(this.data.date_obj.getTime());
        for (var i = 0; i < VCO.Date.SCALES.length; i++) {
             // for JS dates, we iteratively apply flooring functions
            VCO.Date.SCALES[i][2](d);
            if (VCO.Date.SCALES[i][0] == scale) return new VCO.Date(d);
        };

        throw('invalid scale ' + scale);
    },

	/*	Private Methods
	================================================== */

    _getDateData: function() {
        var _date = {
            year: 			0,
            month: 			1, // stupid JS dates
            day: 			1,
            hour: 			0,
            minute: 		0,
            second: 		0,
            millisecond: 	0
		};
   
		// Merge data
		VCO.Util.mergeData(_date, this.data);
 
 		// Make strings into numbers
		var DATE_PARTS = VCO.Date.DATE_PARTS;
 
 		for (var ix in DATE_PARTS) {	
			var parsed = parseInt(_date[DATE_PARTS[ix]]);
			if (isNaN(parsed)) {
                parsed = (ix == 4 || ix == 5) ? 1 : 0; // month and day have diff baselines
            }
			_date[DATE_PARTS[ix]] = parsed;
		}
		
		if (_date.month > 0 && _date.month <= 12) { // adjust for JS's weirdness
			_date.month = _date.month - 1;
		}
		
		return _date;
    },

	_createDateObj: function() {
	    var _date = this._getDateData();          
        this.data.date_obj = new Date(_date.year, _date.month, _date.day, _date.hour, _date.minute, _date.second, _date.millisecond);
	},

    _setFormat: function(format, format_short) {
		if (format) {
			this.data.format = format;
		} else if (!this.data.format) {
			this.data.format = VCO.DateUtil.findBestFormat(this.data);
		}
		
		if (format_short) {
			this.data.format_short = format_short;
		} else if (!this.data.format_short) {
			this.data.format_short = VCO.DateUtil.findBestFormat(this.data, true);
		}
    }
});

// offer something that can figure out the right date class to return
VCO.Date.makeDate = function(data) {
    var date = new VCO.Date(data);
    if (!isNaN(date.getTime())) {
        return date;
    }
    return new VCO.BigDate(data);
}

VCO.BigYear = VCO.Class.extend({
    initialize: function (year) {
        this.year = parseInt(year);
        if (isNaN(this.year)) { throw("Invalid year " + year) }
    },
/* THERE ARE UNUSED ...    
    getDisplayText: function(vco_language) { 
        return this.year.toLocaleString(vco_language.lang);
    },

    getDisplayTextShort: function(vco_language) {
        return this.year.toLocaleString(vco_language.lang);
    },
*/
    isBefore: function(that) {
        return this.year < that.year;
    },

    isAfter: function(that) {
        return this.year > that.year;
    },

    getTime: function() {
        return this.year;
    }
});

(function(cls){
    
    // javascript scales
    cls.SCALES = [ // ( name, units_per_tick, flooring function )
        ['millisecond',1, function(d) { }],
        ['second',1000, function(d) { d.setMilliseconds(0);}],
        ['minute',1000 * 60, function(d) { d.setSeconds(0);}],
        ['hour',1000 * 60 * 60, function(d) { d.setMinutes(0);}],
        ['day',1000 * 60 * 60 * 24, function(d) { d.setHours(0);}],
        ['month',1000 * 60 * 60 * 24 * 30, function(d) { d.setDate(1);}],
        ['year',1000 * 60 * 60 * 24 * 365, function(d) { d.setMonth(0);}],
        ['decade',1000 * 60 * 60 * 24 * 365 * 10, function(d) { 
            var real_year = d.getFullYear();
            d.setFullYear( real_year - (real_year % 10)) 
        }],
        ['century',1000 * 60 * 60 * 24 * 365 * 100, function(d) { 
            var real_year = d.getFullYear();
            d.setFullYear( real_year - (real_year % 100)) 
        }],
        ['millennium',1000 * 60 * 60 * 24 * 365 * 1000, function(d) { 
            var real_year = d.getFullYear();
            d.setFullYear( real_year - (real_year % 1000)) 
        }]     
    ];
            
    // Date parts from highest to lowest precision    
    cls.DATE_PARTS = ["millisecond", "second", "minute", "hour", "day", "month", "year"];
    
    var ISO8601_SHORT_PATTERN = /^([\+-]?\d+?)(-\d{2}?)?(-\d{2}?)?$/;
    // regex below from
    // http://www.pelagodesign.com/blog/2009/05/20/iso-8601-date-validation-that-doesnt-suck/
    var ISO8601_PATTERN = /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;

    /* For now, rather than extract parts from regexp, let's trust the browser.
     * Famous last words...
     * What about UTC vs local time?
     * see also http://stackoverflow.com/questions/10005374/ecmascript-5-date-parse-results-for-iso-8601-test-cases
     */
    cls.parseISODate = function(str) {
        var d = new Date(str);
        if (isNaN(d)) throw "Invalid date: " + str;
        return {
            year: d.getFullYear(),
            month: d.getMonth() + 1,
            day: d.getDate(),
            hour: d.getHours(),
            minute: d.getMinutes(),
            second: d.getSeconds(),
            millisecond: d.getMilliseconds()
        }

    }

    cls.parseDate = function(str) {

        if (str.match(ISO8601_SHORT_PATTERN)) { 
            // parse short specifically to avoid timezone offset confusion
            // most browsers assume short is UTC, not local time.
            var parts = str.match(ISO8601_SHORT_PATTERN).slice(1);
            var d = { year: parts[0].replace('+','')} // year can be negative
            if (parts[1]) { d['month'] = parts[1].replace('-',''); }
            if (parts[2]) { d['day'] = parts[2].replace('-',''); }
            return d;
        }

        if (str.match(ISO8601_PATTERN)) {
            return cls.parseISODate(str);
        }

        if (str.match(/^\-?\d+$/)) {
            return { year: str }
        }

        var parsed = {}
        if (str.match(/\d+\/\d+\/\d+/)) { // mm/yy/dddd
            var date = str.match(/\d+\/\d+\/\d+/)[0];
            str = VCO.Util.trim(str.replace(date,''));
            var date_parts = date.split('/');
            parsed.month = date_parts[0];
            parsed.day = date_parts[1];
            parsed.year = date_parts[2];
        }

        if (str.match(/\d+\/\d+/)) { // mm/yy
            var date = str.match(/\d+\/\d+/)[0];
            str = VCO.Util.trim(str.replace(date,''));
            var date_parts = date.split('/');
            parsed.month = date_parts[0];
            parsed.year = date_parts[1];
        }
        // todo: handle hours, minutes, seconds, millis other date formats, etc...
        if (str.match(':')) {
            var time_parts = str.split(':');
            parsed.hour = time_parts[0];
            parsed.minute = time_parts[1];
            if (time_parts[2]) {
                second_parts = time_parts[2].split('.');
                parsed.second = second_parts[0];
                parsed.millisecond = second_parts[1];
            }
        }
        return parsed;
    }

})(VCO.Date)


//
// Class for cosmological dates
//
VCO.BigDate = VCO.Date.extend({
    
    // @data = VCO.BigYear object or JS dictionary with date properties
    initialize: function(data, format, format_short) {
        if (VCO.BigYear == data.constructor) {
            this.data = {
                date_obj:   data
            }
        } else {
            this.data = JSON.parse(JSON.stringify(data));
            this._createDateObj();
        }
        
        this._setFormat(format, format_short);
    },
    
    // Create date_obj
    _createDateObj: function() {
	    var _date = this._getDateData();          
        this.data.date_obj = new VCO.BigYear(_date.year);        
    },
    
    // Return a new VCO.BigDate which has been 'floored' at the given scale.
    // @scale = string value from VCO.BigDate.SCALES    
    floor: function(scale) {
        for (var i = 0; i < VCO.BigDate.SCALES.length; i++) {
            if (VCO.BigDate.SCALES[i][0] == scale) {
                var floored = VCO.BigDate.SCALES[i][2](this.data.date_obj);
                return new VCO.BigDate(floored);
            }
        };

        throw('invalid scale ' + scale);
    } 
});

(function(cls){
    // cosmo units are years, not millis
    var AGE = 1000000;
    var EPOCH = AGE * 10;
    var ERA = EPOCH * 10;
    var EON = ERA * 10;

    var Floorer = function(unit) {
        return function(a_big_year) {
            var year = a_big_year.getTime();
            return new VCO.BigYear(Math.floor(year/unit) * unit);
        }
    }

    // cosmological scales
    cls.SCALES = [ // ( name, units_per_tick, flooring function )
        ['age',AGE, new Floorer(AGE)],          // 1M years
        ['epoch',EPOCH, new Floorer(EPOCH)],    // 10M years
        ['era',ERA, new Floorer(ERA)],          // 100M years
        ['eon',EON, new Floorer(EON)]           // 1B years     
    ];

})(VCO.BigDate)


/*	VCO.DateUtil
	Utilities for parsing time
================================================== */


VCO.DateUtil = {
	get: function (id) {
		return (typeof id === 'string' ? document.getElementById(id) : id);
	},

	sortByDate: function(array,prop_name) { // only for use with slide data objects
		var prop_name = prop_name || 'start_date';
		array.sort(function(a,b){
			if (a[prop_name].isBefore(b[prop_name])) return -1;
			if (a[prop_name].isAfter(b[prop_name])) return 1;
			return 0;
		});
	},
	
	/*	Find Best Format
	 * this may not work with 'cosmologic' dates, or with VCO.Date if we 
	 * support constructing them based on JS Date and time
	================================================== */
	findBestFormat: function(data, variant) {
		var eval_array = VCO.Date.DATE_PARTS,
			format = "";
		
		for (var i = 0; i < eval_array.length; i++) {
			if ( data[eval_array[i]]) {
				if (variant) {
					if (!(variant in VCO.DateUtil.best_dateformats)) {
						variant = 'short'; // legacy
					}
				} else {
					variant = 'base'
				}
				return VCO.DateUtil.best_dateformats[variant][eval_array[i]];		
			}
		};
		return "";
	},
	
	best_dateformats: {
		base: {
			millisecond: 1,
			second: 'time',
			minute: 'time_no_seconds_small_date',
			hour: 'time_no_seconds_small_date',
			day: 'full',
			month: 'month',
			year: 'year',
			decade: 'year',
			century: 'year',
			millennium: 'year',
			age: 'fallback',
			epoch: 'fallback',
			era: 'fallback',
			eon: 'fallback',
			eon2: 'fallback'
		},
		
		short: {
			millisecond: 1,
			second: 'time_short',
			minute: 'time_no_seconds_short',
			hour: 'time_no_minutes_short',
			day: 'full_short',
			month: 'month_short',
			year: 'year',
			decade: 'year',
			century: 'year',
			millennium: 'year',
			age: 'fallback',
			epoch: 'fallback',
			era: 'fallback',
			eon: 'fallback',
			eon2: 'fallback'
		}
	}
	
};

/*	VCO.Draggable
	VCO.Draggable allows you to add dragging capabilities to any element. Supports mobile devices too.
	TODO Enable constraints
================================================== */

VCO.Draggable = VCO.Class.extend({
	
	includes: VCO.Events,
	
	_el: {},
	
	mousedrag: {
		down:		"mousedown",
		up:			"mouseup",
		leave:		"mouseleave",
		move:		"mousemove"
	},
	
	touchdrag: {
		down:		"touchstart",
		up:			"touchend",
		leave:		"mouseleave",
		move:		"touchmove"
	},

	initialize: function (drag_elem, options, move_elem) {
		
		// DOM ELements 
		this._el = {
			drag: drag_elem,
			move: drag_elem
		};
		
		if (move_elem) {
			this._el.move = move_elem;
		}
		
		
		//Options
		this.options = {
			enable:	{
				x: true,
				y: true
			},
			constraint: {
				top: false,
				bottom: false,
				left: false,
				right: false
			},
			momentum_multiplier: 	2000,
			duration: 				1000,
			ease: 					VCO.Ease.easeInOutQuint
		};
		
		
		// Animation Object
		this.animator = null;
		
		// Drag Event Type
		this.dragevent = this.mousedrag;
		
		if (VCO.Browser.touch) {
			this.dragevent = this.touchdrag;
		}
		
		// Draggable Data
		this.data = {
			sliding:		false,
			direction: 		"none",
			pagex: {
				start:		0,
				end:		0
			},
			pagey: {
				start:		0,
				end:		0
			},
			pos: {
				start: {
					x: 0,
					y:0
				},
				end: {
					x: 0,
					y:0
				}
			},
			new_pos: {
				x: 0,
				y: 0
			},
			new_pos_parent: {
				x: 0,
				y: 0
			},
			time: {
				start:		0,
				end:		0
			},
			touch:			false
		};
		
		// Merge Data and Options
		VCO.Util.mergeData(this.options, options);
		
		
	},
	
	enable: function(e) {
		
		this.data.pos.start = 0; 
		this._el.move.style.left = this.data.pos.start.x + "px";
		this._el.move.style.top = this.data.pos.start.y + "px";
		this._el.move.style.position = "absolute";
	},
	
	disable: function() {
		VCO.DomEvent.removeListener(this._el.drag, this.dragevent.down, this._onDragStart, this);
		VCO.DomEvent.removeListener(this._el.drag, this.dragevent.up, this._onDragEnd, this);
	},
	
	stopMomentum: function() {
		if (this.animator) {
			this.animator.stop();
		}

	},
	
	updateConstraint: function(c) {
		this.options.constraint = c;
		
	},
	
	/*	Private Methods
	================================================== */
	_onDragStart: function(e) {
		if (VCO.Browser.touch) {
			if (e.originalEvent) {
				this.data.pagex.start = e.originalEvent.touches[0].screenX;
				this.data.pagey.start = e.originalEvent.touches[0].screenY;
			} else {
				this.data.pagex.start = e.targetTouches[0].screenX;
				this.data.pagey.start = e.targetTouches[0].screenY;
			}
		} else {
			this.data.pagex.start = e.pageX;
			this.data.pagey.start = e.pageY;
		}
		
		// Center element to finger or mouse
		if (this.options.enable.x) {
			this._el.move.style.left = this.data.pagex.start - (this._el.move.offsetWidth / 2) + "px";
		}
		
		if (this.options.enable.y) {
			this._el.move.style.top = this.data.pagey.start - (this._el.move.offsetHeight / 2) + "px";
		}
		
		this.data.pos.start = VCO.Dom.getPosition(this._el.drag);
		this.data.time.start = new Date().getTime();
		
		this.fire("dragstart", this.data);
		VCO.DomEvent.addListener(this._el.drag, this.dragevent.move, this._onDragMove, this);
		VCO.DomEvent.addListener(this._el.drag, this.dragevent.leave, this._onDragEnd, this);
	},
	
	_onDragEnd: function(e) {
		this.data.sliding = false;
		VCO.DomEvent.removeListener(this._el.drag, this.dragevent.move, this._onDragMove, this);
		VCO.DomEvent.removeListener(this._el.drag, this.dragevent.leave, this._onDragEnd, this);
		this.fire("dragend", this.data);
		
		//  momentum
		this._momentum();
	},
	
	_onDragMove: function(e) {
		e.preventDefault();
		this.data.sliding = true;
		
		if (VCO.Browser.touch) {
			if (e.originalEvent) {
				this.data.pagex.end = e.originalEvent.touches[0].screenX;
				this.data.pagey.end = e.originalEvent.touches[0].screenY;
			} else {
				this.data.pagex.end = e.targetTouches[0].screenX;
				this.data.pagey.end = e.targetTouches[0].screenY;
			}

		} else {
			this.data.pagex.end = e.pageX;
			this.data.pagey.end = e.pageY;
		}
		
		this.data.pos.end = VCO.Dom.getPosition(this._el.drag);
		this.data.new_pos.x = -(this.data.pagex.start - this.data.pagex.end - this.data.pos.start.x);
		this.data.new_pos.y = -(this.data.pagey.start - this.data.pagey.end - this.data.pos.start.y );
		
		if (this.options.enable.x) {
			this._el.move.style.left = this.data.new_pos.x + "px";
		}
		
		if (this.options.enable.y) {
			this._el.move.style.top = this.data.new_pos.y + "px";
		}
		
		this.fire("dragmove", this.data);
	},
	
	_momentum: function() {
		var pos_adjust = {
				x: 0,
				y: 0,
				time: 0
			},
			pos_change = {
				x: 0,
				y: 0,
				time: 0
			},
			swipe = false,
			swipe_direction = "";
		
		
		if (VCO.Browser.touch) {
			// Treat mobile multiplier differently
			//this.options.momentum_multiplier = this.options.momentum_multiplier * 2;
		}
		
		pos_adjust.time = (new Date().getTime() - this.data.time.start) * 10;
		pos_change.time = (new Date().getTime() - this.data.time.start) * 10;
		
		pos_change.x = this.options.momentum_multiplier * (Math.abs(this.data.pagex.end) - Math.abs(this.data.pagex.start));
		pos_change.y = this.options.momentum_multiplier * (Math.abs(this.data.pagey.end) - Math.abs(this.data.pagey.start));
		
		pos_adjust.x = Math.round(pos_change.x / pos_change.time);
		pos_adjust.y = Math.round(pos_change.y / pos_change.time);
		
		this.data.new_pos.x = Math.min(this.data.pos.end.x + pos_adjust.x);
		this.data.new_pos.y = Math.min(this.data.pos.end.y + pos_adjust.y);

		
		if (!this.options.enable.x) {
			this.data.new_pos.x = this.data.pos.start.x;
		} else if (this.data.new_pos.x < 0) {
			this.data.new_pos.x = 0;
		}
		
		if (!this.options.enable.y) {
			this.data.new_pos.y = this.data.pos.start.y;
		} else if (this.data.new_pos.y < 0) {
			this.data.new_pos.y = 0;
		}
		
		// Detect Swipe
		if (pos_change.time < 3000) {
			swipe = true;
		}
		
		// Detect Direction
		if (Math.abs(pos_change.x) > 10000) {
			this.data.direction = "left";
			if (pos_change.x > 0) {
				this.data.direction = "right";
			}
		}
		// Detect Swipe
		if (Math.abs(pos_change.y) > 10000) {
			this.data.direction = "up";
			if (pos_change.y > 0) {
				this.data.direction = "down";
			}
		}
		this._animateMomentum();
		if (swipe) {
			this.fire("swipe_" + this.data.direction, this.data);
		}
		
	},
	
	
	_animateMomentum: function() {
		var pos = {
				x: this.data.new_pos.x,
				y: this.data.new_pos.y
			},
			animate = {
				duration: 	this.options.duration,
				easing: 	VCO.Ease.easeOutStrong
			};
		
		if (this.options.enable.y) {
			if (this.options.constraint.top || this.options.constraint.bottom) {
				if (pos.y > this.options.constraint.bottom) {
					pos.y = this.options.constraint.bottom;
				} else if (pos.y < this.options.constraint.top) {
					pos.y = this.options.constraint.top;
				}
			}
			animate.top = Math.floor(pos.y) + "px";
		}
		
		if (this.options.enable.x) {
			if (this.options.constraint.left || this.options.constraint.right) {
				if (pos.x > this.options.constraint.left) {
					pos.x = this.options.constraint.left;
				} else if (pos.x < this.options.constraint.right) {
					pos.x = this.options.constraint.right;
				}
			}
			animate.left = Math.floor(pos.x) + "px";
		}
		
		this.animator = VCO.Animate(this._el.move, animate);
		
		this.fire("momentum", this.data);
	}
});


/*	VCO.Swipable
	VCO.Draggable allows you to add dragging capabilities to any element. Supports mobile devices too.
	TODO Enable constraints
================================================== */

VCO.Swipable = VCO.Class.extend({
	
	includes: VCO.Events,
	
	_el: {},
	
	mousedrag: {
		down:		"mousedown",
		up:			"mouseup",
		leave:		"mouseleave",
		move:		"mousemove"
	},
	
	touchdrag: {
		down:		"touchstart",
		up:			"touchend",
		leave:		"mouseleave",
		move:		"touchmove"
	},

	initialize: function (drag_elem, move_elem, options) {
		
		// DOM ELements 
		this._el = {
			drag: drag_elem,
			move: drag_elem
		};
		
		if (move_elem) {
			this._el.move = move_elem;
		}
		
		
		//Options
		this.options = {
			snap: false,
			enable:	{
				x: true,
				y: true
			},
			constraint: {
				top: false,
				bottom: false,
				left: 0,
				right: false
			},
			momentum_multiplier: 	2000,
			duration: 				1000,
			ease: 					VCO.Ease.easeInOutQuint
		};
		
		
		// Animation Object
		this.animator = null;
		
		// Drag Event Type
		this.dragevent = this.mousedrag;
		
		if (VCO.Browser.touch) {
			this.dragevent = this.touchdrag;
		}
		
		// Draggable Data
		this.data = {
			sliding:		false,
			direction: 		"none",
			pagex: {
				start:		0,
				end:		0
			},
			pagey: {
				start:		0,
				end:		0
			},
			pos: {
				start: {
					x: 0,
					y:0
				},
				end: {
					x: 0,
					y:0
				}
			},
			new_pos: {
				x: 0,
				y: 0
			},
			new_pos_parent: {
				x: 0,
				y: 0
			},
			time: {
				start:		0,
				end:		0
			},
			touch:			false
		};
		
		// Merge Data and Options
		VCO.Util.mergeData(this.options, options);
		
		
	},
	
	enable: function(e) {
		VCO.DomEvent.addListener(this._el.drag, this.dragevent.down, this._onDragStart, this);
		VCO.DomEvent.addListener(this._el.drag, this.dragevent.up, this._onDragEnd, this);
		
		this.data.pos.start = 0; //VCO.Dom.getPosition(this._el.move);
		this._el.move.style.left = this.data.pos.start.x + "px";
		this._el.move.style.top = this.data.pos.start.y + "px";
		this._el.move.style.position = "absolute";
		//this._el.move.style.zIndex = "11";
		//this._el.move.style.cursor = "move";
	},
	
	disable: function() {
		VCO.DomEvent.removeListener(this._el.drag, this.dragevent.down, this._onDragStart, this);
		VCO.DomEvent.removeListener(this._el.drag, this.dragevent.up, this._onDragEnd, this);
	},
	
	stopMomentum: function() {
		if (this.animator) {
			this.animator.stop();
		}

	},
	
	updateConstraint: function(c) {
		this.options.constraint = c;
		
		// Temporary until issues are fixed
		
	},
	
	/*	Private Methods
	================================================== */
	_onDragStart: function(e) {
		
		if (this.animator) {
			this.animator.stop();
		}
		
		if (VCO.Browser.touch) {
			if (e.originalEvent) {
				this.data.pagex.start = e.originalEvent.touches[0].screenX;
				this.data.pagey.start = e.originalEvent.touches[0].screenY;
			} else {
				this.data.pagex.start = e.targetTouches[0].screenX;
				this.data.pagey.start = e.targetTouches[0].screenY;
			}
		} else {
			this.data.pagex.start = e.pageX;
			this.data.pagey.start = e.pageY;
		}
		
		// Center element to finger or mouse
		if (this.options.enable.x) {
			//this._el.move.style.left = this.data.pagex.start - (this._el.move.offsetWidth / 2) + "px";
		}
		
		if (this.options.enable.y) {
			//this._el.move.style.top = this.data.pagey.start - (this._el.move.offsetHeight / 2) + "px";
		}
		
		this.data.pos.start = {x:this._el.move.offsetLeft, y:this._el.move.offsetTop};
		
		
		this.data.time.start 			= new Date().getTime();
		
		this.fire("dragstart", this.data);
		VCO.DomEvent.addListener(this._el.drag, this.dragevent.move, this._onDragMove, this);
		VCO.DomEvent.addListener(this._el.drag, this.dragevent.leave, this._onDragEnd, this);
	},
	
	_onDragEnd: function(e) {
		this.data.sliding = false;
		VCO.DomEvent.removeListener(this._el.drag, this.dragevent.move, this._onDragMove, this);
		VCO.DomEvent.removeListener(this._el.drag, this.dragevent.leave, this._onDragEnd, this);
		this.fire("dragend", this.data);
		
		//  momentum
		this._momentum();
	},
	
	_onDragMove: function(e) {
		var change = {
			x:0,
			y:0
		}
		//e.preventDefault();
		this.data.sliding = true;
		
		if (VCO.Browser.touch) {
			if (e.originalEvent) {
				this.data.pagex.end = e.originalEvent.touches[0].screenX;
				this.data.pagey.end = e.originalEvent.touches[0].screenY;
			} else {
				this.data.pagex.end = e.targetTouches[0].screenX;
				this.data.pagey.end = e.targetTouches[0].screenY;
			}

		} else {
			this.data.pagex.end = e.pageX;
			this.data.pagey.end = e.pageY;
		}
		
		change.x = this.data.pagex.start - this.data.pagex.end;
		change.y = this.data.pagey.start - this.data.pagey.end;
		
		this.data.pos.end = {x:this._el.drag.offsetLeft, y:this._el.drag.offsetTop};
		
		this.data.new_pos.x = -(change.x - this.data.pos.start.x);
		this.data.new_pos.y = -(change.y - this.data.pos.start.y );
		
		if (this.options.enable.x && ( Math.abs(change.x) > Math.abs(change.y) ) ) {
			e.preventDefault();
			this._el.move.style.left = this.data.new_pos.x + "px";
		}
		
		if (this.options.enable.y && ( Math.abs(change.y) > Math.abs(change.y) ) ) {
			e.preventDefault();
			this._el.move.style.top = this.data.new_pos.y + "px";
		}
		
		this.fire("dragmove", this.data);
	},
	
	_momentum: function() {
		var pos_adjust = {
				x: 0,
				y: 0,
				time: 0
			},
			pos_change = {
				x: 0,
				y: 0,
				time: 0
			},
			swipe_detect = {
				x: false,
				y: false
			},
			swipe = false,
			swipe_direction = "";
		
		
		this.data.direction = null;
		
		pos_adjust.time = (new Date().getTime() - this.data.time.start) * 10;
		pos_change.time = (new Date().getTime() - this.data.time.start) * 10;
		
		pos_change.x = this.options.momentum_multiplier * (Math.abs(this.data.pagex.end) - Math.abs(this.data.pagex.start));
		pos_change.y = this.options.momentum_multiplier * (Math.abs(this.data.pagey.end) - Math.abs(this.data.pagey.start));
		
		pos_adjust.x = Math.round(pos_change.x / pos_change.time);
		pos_adjust.y = Math.round(pos_change.y / pos_change.time);
		
		this.data.new_pos.x = Math.min(this.data.new_pos.x + pos_adjust.x);
		this.data.new_pos.y = Math.min(this.data.new_pos.y + pos_adjust.y);
		
		if (!this.options.enable.x) {
			this.data.new_pos.x = this.data.pos.start.x;
		} else if (this.options.constraint.left && this.data.new_pos.x > this.options.constraint.left) {
			this.data.new_pos.x = this.options.constraint.left;
		}
		
		if (!this.options.enable.y) {
			this.data.new_pos.y = this.data.pos.start.y;
		} else if (this.data.new_pos.y < 0) {
			this.data.new_pos.y = 0;
		}
		
		// Detect Swipe
		if (pos_change.time < 2000) {
			swipe = true;
		}
		
		
		if (this.options.enable.x && this.options.enable.y) {
			if (Math.abs(pos_change.x) > Math.abs(pos_change.y)) {
				swipe_detect.x = true;
			} else {
				swipe_detect.y = true;
			}
		} else if (this.options.enable.x) {
			if (Math.abs(pos_change.x) > Math.abs(pos_change.y)) {
				swipe_detect.x = true;
			}
		} else {
			if (Math.abs(pos_change.y) > Math.abs(pos_change.x)) {
				swipe_detect.y = true;
			}
		}
		
		// Detect Direction and long swipe
		if (swipe_detect.x) {
			
			// Long Swipe
			if (Math.abs(pos_change.x) > (this._el.drag.offsetWidth/2)) {
				swipe = true;
			}
			
			if (Math.abs(pos_change.x) > 10000) {
				this.data.direction = "left";
				if (pos_change.x > 0) {
					this.data.direction = "right";
				}
			}
		}
		
		if (swipe_detect.y) {
			
			// Long Swipe
			if (Math.abs(pos_change.y) > (this._el.drag.offsetHeight/2)) {
				swipe = true;
			}
			
			if (Math.abs(pos_change.y) > 10000) {
				this.data.direction = "up";
				if (pos_change.y > 0) {
					this.data.direction = "down";
				}
			}
		}
		
		if (pos_change.time < 1000 ) {
			
		} else {
			this._animateMomentum();
		}
		
		if (swipe && this.data.direction) {
			this.fire("swipe_" + this.data.direction, this.data);
		} else if (this.data.direction) {
			this.fire("swipe_nodirection", this.data);
		} else if (this.options.snap) {
			this.animator.stop();
			
			this.animator = VCO.Animate(this._el.move, {
				top: 		this.data.pos.start.y,
				left: 		this.data.pos.start.x,
				duration: 	this.options.duration,
				easing: 	VCO.Ease.easeOutStrong
			});
		}
		
	},
	
	
	_animateMomentum: function() {
		var pos = {
				x: this.data.new_pos.x,
				y: this.data.new_pos.y
			},
			animate = {
				duration: 	this.options.duration,
				easing: 	VCO.Ease.easeOutStrong
			};
		
		if (this.options.enable.y) {
			if (this.options.constraint.top || this.options.constraint.bottom) {
				if (pos.y > this.options.constraint.bottom) {
					pos.y = this.options.constraint.bottom;
				} else if (pos.y < this.options.constraint.top) {
					pos.y = this.options.constraint.top;
				}
			}
			animate.top = Math.floor(pos.y) + "px";
		}
		
		if (this.options.enable.x) {
			if (this.options.constraint.left && pos.x >= this.options.constraint.left) {
				pos.x = this.options.constraint.left;
			}
			if (this.options.constraint.right && pos.x < this.options.constraint.right) {
				pos.x = this.options.constraint.right;
			}

			animate.left = Math.floor(pos.x) + "px";
		}
		
		this.animator = VCO.Animate(this._el.move, animate);
		
		this.fire("momentum", this.data);
	}
});


/*	VCO.MenuBar
	Draggable component to control size
================================================== */
 
VCO.MenuBar = VCO.Class.extend({
	
	includes: [VCO.Events, VCO.DomMixins],
	
	_el: {},
	
	/*	Constructor
	================================================== */
	initialize: function(elem, parent_elem, options) {
		// DOM ELEMENTS
		this._el = {
			parent: {},
			container: {},
			button_backtostart: {},
			button_zoomin: {},
			button_zoomout: {},
			arrow: {},
			line: {},
			coverbar: {},
			grip: {}
		};
		
		this.collapsed = false;
		
		if (typeof elem === 'object') {
			this._el.container = elem;
		} else {
			this._el.container = VCO.Dom.get(elem);
		}
		
		if (parent_elem) {
			this._el.parent = parent_elem;
		}
	
		//Options
		this.options = {
			width: 					600,
			height: 				600,
			duration: 				1000,
			ease: 					VCO.Ease.easeInOutQuint,
			menubar_default_y: 		0
		};
		
		// Animation
		this.animator = {};
		
		// Merge Data and Options
		VCO.Util.mergeData(this.options, options);
		
		this._initLayout();
		this._initEvents();
	},
	
	/*	Public
	================================================== */
	show: function(d) {
		
		var duration = this.options.duration;
		if (d) {
			duration = d;
		}
		/*
		this.animator = VCO.Animate(this._el.container, {
			top: 		this.options.menubar_default_y + "px",
			duration: 	duration,
			easing: 	VCO.Ease.easeOutStrong
		});
		*/
	},
	
	hide: function(top) {
		/*
		this.animator = VCO.Animate(this._el.container, {
			top: 		top,
			duration: 	this.options.duration,
			easing: 	VCO.Ease.easeOutStrong
		});
		*/
	},
		
	
	setSticky: function(y) {
		this.options.menubar_default_y = y;
	},
	
	/*	Color
	================================================== */
	setColor: function(inverted) {
		if (inverted) {
			this._el.container.className = 'vco-menubar vco-menubar-inverted';
		} else {
			this._el.container.className = 'vco-menubar';
		}
	},
	
	/*	Update Display
	================================================== */
	updateDisplay: function(w, h, a, l) {
		this._updateDisplay(w, h, a, l);
	},
	

	/*	Events
	================================================== */
	_onButtonZoomIn: function(e) {
		this.fire("zoom_in", e);
	},
	
	_onButtonZoomOut: function(e) {
		this.fire("zoom_out", e);
	},
	
	_onButtonBackToStart: function(e) {
		this.fire("back_to_start", e);
	},
	
	
	/*	Private Methods
	================================================== */
	_initLayout: function () {
		
		// Create Layout
		this._el.button_zoomin 							= VCO.Dom.create('span', 'vco-menubar-button', this._el.container);
		this._el.button_zoomout 						= VCO.Dom.create('span', 'vco-menubar-button', this._el.container);
		this._el.button_backtostart 					= VCO.Dom.create('span', 'vco-menubar-button', this._el.container);
		
		if (VCO.Browser.mobile) {
			this._el.container.setAttribute("ontouchstart"," ");
		}
		
		this._el.button_backtostart.innerHTML		= "<span class='vco-icon-goback'></span>";
		this._el.button_zoomin.innerHTML			= "<span class='vco-icon-zoom-in'></span>";
		this._el.button_zoomout.innerHTML			= "<span class='vco-icon-zoom-out'></span>";
		
		
	},
	
	_initEvents: function () {
		VCO.DomEvent.addListener(this._el.button_backtostart, 'click', this._onButtonBackToStart, this);
		VCO.DomEvent.addListener(this._el.button_zoomin, 'click', this._onButtonZoomIn, this);
		VCO.DomEvent.addListener(this._el.button_zoomout, 'click', this._onButtonZoomOut, this);
	},
	
	// Update Display
	_updateDisplay: function(width, height, animate) {
		
		if (width) {
			this.options.width = width;
		}
		if (height) {
			this.options.height = height;
		}
	}
	
});

/*	VCO.Message
	
================================================== */
 
VCO.Message = VCO.Class.extend({
	
	includes: [VCO.Events, VCO.DomMixins],
	
	_el: {},
	
	/*	Constructor
	================================================== */
	initialize: function(data, options, add_to_container) {
		// DOM ELEMENTS
		this._el = {
			parent: {},
			container: {},
			message_container: {},
			loading_icon: {},
			message: {}
		};
	
		//Options
		this.options = {
			width: 					600,
			height: 				600,
			message_class: 			"vco-message",
			message_icon_class: 	"vco-loading-icon"
		};
		
		// Merge Data and Options
		VCO.Util.mergeData(this.data, data);
		VCO.Util.mergeData(this.options, options);
		
		this._el.container = VCO.Dom.create("div", this.options.message_class);
		
		if (add_to_container) {
			add_to_container.appendChild(this._el.container);
			this._el.parent = add_to_container;
		};
		
		
		// Animation
		this.animator = {};
		
		
		this._initLayout();
		this._initEvents();
	},
	
	/*	Public
	================================================== */
	updateMessage: function(t) {
		this._updateMessage(t);
	},
	
	
	/*	Update Display
	================================================== */
	updateDisplay: function(w, h) {
		this._updateDisplay(w, h);
	},
	
	_updateMessage: function(t) {
		if (!t) {
			var lang = this.options.language || VCO.Language.fallback;
			this._el.message.innerHTML = lang._('loading');
		} else {
			this._el.message.innerHTML = t;
		}
	},
	

	/*	Events
	================================================== */

	
	_onMouseClick: function() {
		this.fire("clicked", this.options);
	},

	
	/*	Private Methods
	================================================== */
	_initLayout: function () {
		
		// Create Layout
		this._el.message_container = VCO.Dom.create("div", "vco-message-container", this._el.container);
		this._el.loading_icon = VCO.Dom.create("div", this.options.message_icon_class, this._el.message_container);
		this._el.message = VCO.Dom.create("div", "vco-message-content", this._el.message_container);
		
		this._updateMessage();
		
	},
	
	_initEvents: function () {
		VCO.DomEvent.addListener(this._el.container, 'click', this._onMouseClick, this);
	},
	
	// Update Display
	_updateDisplay: function(width, height, animate) {
		
	}
	
});

/*	VCO.MediaType
	Determines the type of media the url string is.
	returns an object with .type and .id
	You can add new media types by adding a regex 
	to match and the media class name to use to 
	render the media 

	TODO
	Allow array so a slideshow can be a mediatype
================================================== */
VCO.MediaType = function(m) {
	var media = {}, 
		media_types = 	[
			{
				type: 		"youtube",
				name: 		"YouTube", 
				match_str: 	"^(https?:)?\/*(www.)?youtube|youtu\.be",
				cls: 		VCO.Media.YouTube
			},
			{
				type: 		"vimeo",
				name: 		"Vimeo", 
				match_str: 	"^(https?:)?\/*(player.)?vimeo\.com",
				cls: 		VCO.Media.Vimeo
			},
			{
				type: 		"dailymotion",
				name: 		"DailyMotion", 
				match_str: 	"^(https?:)?\/*(www.)?dailymotion\.com",
				cls: 		VCO.Media.DailyMotion
			},
			{
				type: 		"vine",
				name: 		"Vine", 
				match_str: 	"^(https?:)?\/*(www.)?vine\.co",
				cls: 		VCO.Media.Vine
			},
			{
				type: 		"soundcloud",
				name: 		"SoundCloud", 
				match_str: 	"^(https?:)?\/*(player.)?soundcloud\.com",
				cls: 		VCO.Media.SoundCloud
			},
			{
				type: 		"twitter",
				name: 		"Twitter", 
				match_str: 	"^(https?:)?\/*(www.)?twitter\.com",
				cls: 		VCO.Media.Twitter
			},
			{
				type: 		"twitterembed",
				name: 		"TwitterEmbed", 
				match_str: 	"<blockquote class=\"twitter-tweet\"",
				cls: 		VCO.Media.TwitterEmbed
			},
			{
				type: 		"googlemaps",
				name: 		"Google Map", 
				match_str: 	/google.+?\/maps\/@([-\d.]+),([-\d.]+),((?:[-\d.]+[zmayht],?)*)|google.+?\/maps\/search\/([\w\W]+)\/@([-\d.]+),([-\d.]+),((?:[-\d.]+[zmayht],?)*)|google.+?\/maps\/place\/([\w\W]+)\/@([-\d.]+),([-\d.]+),((?:[-\d.]+[zmayht],?)*)|google.+?\/maps\/dir\/([\w\W]+)\/([\w\W]+)\/@([-\d.]+),([-\d.]+),((?:[-\d.]+[zmayht],?)*)/,
				cls: 		VCO.Media.Map
			},
			{
				type: 		"googleplus",
				name: 		"Google+", 
				match_str: 	"^(https?:)?\/*plus.google",
				cls: 		VCO.Media.GooglePlus
			},
			{
				type: 		"flickr",
				name: 		"Flickr", 
				match_str: 	"^(https?:)?\/*(www.)?flickr.com\/photos",
				cls: 		VCO.Media.Flickr
			},
			{
				type: 		"instagram",
				name: 		"Instagram", 
				match_str: 	/^(https?:)?\/*(www.)?(instagr.am|^(https?:)?\/*(www.)?instagram.com)\/p\//,
				cls: 		VCO.Media.Instagram
			},
			{
				type: 		"profile",
				name: 		"Profile", 
				match_str: 	/^(https?:)?\/*(www.)?instagr.am\/[a-zA-Z0-9]{2,}|^(https?:)?\/*(www.)?instagram.com\/[a-zA-Z0-9]{2,}/,
				cls: 		VCO.Media.Profile
			},
			{
			    type:       "documentcloud",
			    name:       "Document Cloud",
			    match_str:  /documentcloud.org\//,
			    cls:        VCO.Media.DocumentCloud
			},
			{
				type: 		"image",
				name: 		"Image",
				match_str: 	/(jpg|jpeg|png|gif)(\?.*)?$/i,
				cls: 		VCO.Media.Image
			},
			{
				type: 		"googledocs",
				name: 		"Google Doc",
				match_str: 	"^(https?:)?\/*[^.]*.google.com\/[^\/]*\/d\/[^\/]*\/[^\/]*\?usp=sharing|^(https?:)?\/*drive.google.com\/open\?id=[^\&]*\&authuser=0|^(https?:)?\/*drive.google.com\/open\?id=[^\&]*|^(https?:)?\/*[^.]*.googledrive.com\/host\/[^\/]*\/",
				cls: 		VCO.Media.GoogleDoc
			},
			{
				type: 		"wikipedia",
				name: 		"Wikipedia",
				match_str: 	"^(https?:)?\/*(www.)?wikipedia\.org|^(https?:)?\/*([a-z][a-z].)?wikipedia\.org",
				cls: 		VCO.Media.Wikipedia
			},
			{
				type: 		"spotify",
				name: 		"spotify",
				match_str: 	"spotify",
				cls: 		VCO.Media.Spotify
			},
			{
				type: 		"iframe",
				name: 		"iFrame",
				match_str: 	"iframe",
				cls: 		VCO.Media.IFrame
			},
			{
				type: 		"storify",
				name: 		"Storify",
				match_str: 	"storify",
				cls: 		VCO.Media.Storify
			},
			{
				type: 		"blockquote",
				name: 		"Quote",
				match_str: 	"blockquote",
				cls: 		VCO.Media.Blockquote
			},
			{
				type: 		"website",
				name: 		"Website",
				match_str: 	"http://",
				cls: 		VCO.Media.Website
			},
			{
				type: 		"imageblank",
				name: 		"Imageblank",
				match_str: 	"",
				cls: 		VCO.Media.Image
			}
		];
	
	for (var i = 0; i < media_types.length; i++) {
		if (m instanceof Array) {
			return media = {
				type: 		"slider",
				cls: 		VCO.Media.Slider
			};
		} else if (m.url.match(media_types[i].match_str)) {
			media 		= media_types[i];
			return media;
		}
	};
	
	return false;
	
}


/*	VCO.Media
	Main media template for media assets.
	Takes a data object and populates a dom object
================================================== */
// TODO add link

VCO.Media = VCO.Class.extend({
	
	includes: [VCO.Events, VCO.I18NMixins],
	
	_el: {},
	
	/*	Constructor
	================================================== */
	initialize: function(data, options, add_to_container) {
		// DOM ELEMENTS
		this._el = {
			container: {},
			content_container: {},
			content: {},
			content_item: {},
			content_link: {},
			caption: null,
			credit: null,
			parent: {},
			link: null
		};
		
		// Player (If Needed)
		this.player = null;
		
		// Timer (If Needed)
		this.timer = null;
		this.load_timer = null;
		
		// Message
		this.message = null;
		
		// Media ID
		this.media_id = null;
		
		// State
		this._state = {
			loaded: false,
			show_meta: false,
			media_loaded: false
		};
	
		// Data
		this.data = {
			uniqueid: 			null,
			url: 				null,
			credit:				null,
			caption:			null,
			credit_alternate: 	null,
			caption_alternate: 	null,
			link: 				null,
			link_target: 		null
		};
	
		//Options
		this.options = {
			api_key_flickr: 		"f2cc870b4d233dd0a5bfe73fd0d64ef0",
			api_key_googlemaps: 	"AIzaSyB9dW8e_iRrATFa8g24qB6BDBGdkrLDZYI",
			api_key_embedly: 		"ae2da610d1454b66abdf2e6a4c44026d",
			credit_height: 			0,
			caption_height: 		0
		};
	
		this.animator = {};
		
		// Merge Data and Options
		VCO.Util.mergeData(this.options, options);
		VCO.Util.mergeData(this.data, data);
		
		this._el.container = VCO.Dom.create("div", "vco-media");
		
		if (this.data.uniqueid) {
			this._el.container.id = this.data.uniqueid;
		}
		
		
		this._initLayout();
		
		if (add_to_container) {
			add_to_container.appendChild(this._el.container);
			this._el.parent = add_to_container;
		};
		
	},
	
	loadMedia: function() {
		var self = this;
		
		if (!this._state.loaded) {
			try {
				this.load_timer = setTimeout(function() {
					self._loadMedia();
					self._state.loaded = true;
					self._updateDisplay();
				}, 1200);
			} catch (e) {
				trace("Error loading media for ", this._media);
				trace(e);
			}
			
			//this._state.loaded = true;
		}
		
		
		
	},
	
	loadingMessage: function() {
		this.message.updateMessage(this._('loading') + " " + this.options.media_name);
	},

	updateMediaDisplay: function(layout) {
		if (this._state.loaded) {
			
			
			if (VCO.Browser.mobile) {
				this._el.content_item.style.maxHeight = (this.options.height/2) + "px";
			} else {
				this._el.content_item.style.maxHeight = this.options.height - this.options.credit_height - this.options.caption_height - 30 + "px";
			}
			
			//this._el.content_item.style.maxWidth = this.options.width + "px";
			this._el.container.style.maxWidth = this.options.width + "px";
			// Fix for max-width issues in Firefox
			if (VCO.Browser.firefox) {
				if (this._el.content_item.offsetWidth > this._el.content_item.offsetHeight) {
					//this._el.content_item.style.width = "100%";
				}
			}
			
			
			
			this._updateMediaDisplay(layout);
			
			if (this._state.media_loaded) {
				if (this._el.credit) {
					this._el.credit.style.width		= this._el.content_item.offsetWidth + "px";
				}
				if (this._el.caption) {
					this._el.caption.style.width		= this._el.content_item.offsetWidth + "px";
				}
			}
			
		}
	},
	
	/*	Media Specific
	================================================== */
		_loadMedia: function() {
		
		},
		
		_updateMediaDisplay: function(l) {
			//this._el.content_item.style.maxHeight = (this.options.height - this.options.credit_height - this.options.caption_height - 16) + "px";
			if(VCO.Browser.firefox) {
				this._el.content_item.style.maxWidth = this.options.width + "px";
				this._el.content_item.style.width = "auto";
			}
		},
		
		_getMeta: function() {
			
		},
	
	/*	Public
	================================================== */
	show: function() {
		
	},
	
	hide: function() {
		
	},
	
	addTo: function(container) {
		container.appendChild(this._el.container);
		this.onAdd();
	},
	
	removeFrom: function(container) {
		container.removeChild(this._el.container);
		this.onRemove();
	},
	
	// Update Display
	updateDisplay: function(w, h, l) {
		this._updateDisplay(w, h, l);
	},
	
	stopMedia: function() {
		this._stopMedia();
	},
	
	loadErrorDisplay: function(message) {
		this._el.content.removeChild(this._el.content_item);
		this._el.content_item	= VCO.Dom.create("div", "vco-media-item vco-media-loaderror", this._el.content);
		this._el.content_item.innerHTML = "<div class='vco-icon-" + this.options.media_type + "'></div><p>" + message + "</p>";
		
		// After Loaded
		this.onLoaded(true);
	},

	/*	Events
	================================================== */
	onLoaded: function(error) {
		this._state.loaded = true;
		this.fire("loaded", this.data);
		if (this.message) {
			this.message.hide();
		}
		if (!error) {
			this.showMeta();
		}
		this.updateDisplay();
	},
	
	onMediaLoaded: function(e) {
		this._state.media_loaded = true;
		this.fire("media_loaded", this.data);
		if (this._el.credit) {
			this._el.credit.style.width		= this._el.content_item.offsetWidth + "px";
		}
		if (this._el.caption) {
			this._el.caption.style.width		= this._el.content_item.offsetWidth + "px";
		}
	},
	
	showMeta: function(credit, caption) {
		this._state.show_meta = true;
		// Credit
		if (this.data.credit && this.data.credit != "") {
			this._el.credit					= VCO.Dom.create("div", "vco-credit", this._el.content_container);
			this._el.credit.innerHTML		= this.data.credit;
			this.options.credit_height 		= this._el.credit.offsetHeight;
		} 
		
		// Caption
		if (this.data.caption && this.data.caption != "") {
			this._el.caption				= VCO.Dom.create("div", "vco-caption", this._el.content_container);
			this._el.caption.innerHTML		= this.data.caption;
			this.options.caption_height 	= this._el.caption.offsetHeight;
		} 
		
		if (!this.data.caption || !this.data.credit) {
			this.getMeta();
		}
		
	},
	
	getMeta: function() {
		this._getMeta();
	},
	
	updateMeta: function() {
		if (!this.data.credit && this.data.credit_alternate) {
			this._el.credit					= VCO.Dom.create("div", "vco-credit", this._el.content_container);
			this._el.credit.innerHTML		= this.data.credit_alternate;
			this.options.credit_height 		= this._el.credit.offsetHeight;
		}
		
		if (!this.data.caption && this.data.caption_alternate) {
			this._el.caption				= VCO.Dom.create("div", "vco-caption", this._el.content_container);
			this._el.caption.innerHTML		= this.data.caption_alternate;
			this.options.caption_height 	= this._el.caption.offsetHeight;
		}
		
		this.updateDisplay();
	},
	
	onAdd: function() {
		this.fire("added", this.data);
	},

	onRemove: function() {
		this.fire("removed", this.data);
	},
	
	/*	Private Methods
	================================================== */
	_initLayout: function () {
		
		// Message
		this.message = new VCO.Message({}, this.options);
		this.message.addTo(this._el.container);
		
		// Create Layout
		this._el.content_container = VCO.Dom.create("div", "vco-media-content-container", this._el.container);
		
		// Link
		if (this.data.link && this.data.link != "") {
			
			this._el.link = VCO.Dom.create("a", "vco-media-link", this._el.content_container);
			this._el.link.href = this.data.link;
			if (this.data.link_target && this.data.link_target != "") {
				this._el.link.target = this.data.link_target;
			} else {
				this._el.link.target = "_blank";
			}
			
			this._el.content = VCO.Dom.create("div", "vco-media-content", this._el.link);
			
		} else {
			this._el.content = VCO.Dom.create("div", "vco-media-content", this._el.content_container);
		}
		
		
	},
	
	// Update Display
	_updateDisplay: function(w, h, l) {
		if (w) {
			this.options.width = w;
			
		} 
		//this._el.container.style.width = this.options.width + "px";
		if (h) {
			this.options.height = h;
		}
		
		if (l) {
			this.options.layout = l;
		} 
		
		if (this._el.credit) {
			this.options.credit_height 		= this._el.credit.offsetHeight;
		}
		if (this._el.caption) {
			this.options.caption_height 	= this._el.caption.offsetHeight + 5;
		}
		
		this.updateMediaDisplay(this.options.layout);
		
	},
	
	_stopMedia: function() {
		
	}
	
});

/*	VCO.Media.Blockquote
================================================== */

VCO.Media.Blockquote = VCO.Media.extend({
	
	includes: [VCO.Events],
	
	/*	Load the media
	================================================== */
	_loadMedia: function() {
		
		// Loading Message
		this.loadingMessage();
		
		// Create Dom element
		this._el.content_item	= VCO.Dom.create("div", "vco-media-item vco-media-blockquote", this._el.content);
		this._el.content_container.className = "vco-media-content-container vco-media-content-container-text";
		
		// Get Media ID
		this.media_id = this.data.url;
		
		// API Call
		this._el.content_item.innerHTML = this.media_id;
		
		// After Loaded
		this.onLoaded();
	},
	
	updateMediaDisplay: function() {
		
	},
	
	_updateMediaDisplay: function() {
		
	}

	
});


/*	VCO.Media.DailyMotion
================================================== */

VCO.Media.DailyMotion = VCO.Media.extend({
	
	includes: [VCO.Events],
	
	/*	Load the media
	================================================== */
	_loadMedia: function() {
		var api_url,
			self = this;
		
		// Loading Message
		this.loadingMessage();
		
		// Create Dom element
		this._el.content_item	= VCO.Dom.create("div", "vco-media-item vco-media-iframe vco-media-dailymotion", this._el.content);
		
		// Get Media ID
		if (this.data.url.match("video")) {
			this.media_id = this.data.url.split("video\/")[1].split(/[?&]/)[0];
		} else {
			this.media_id = this.data.url.split("embed\/")[1].split(/[?&]/)[0];
		}
		
		// API URL
		api_url = "http://www.dailymotion.com/embed/video/" + this.media_id;
		
		// API Call
		this._el.content_item.innerHTML = "<iframe autostart='false' frameborder='0' width='100%' height='100%' src='" + api_url + "'></iframe>"		
		
		// After Loaded
		this.onLoaded();
	},
	
	// Update Media Display
	_updateMediaDisplay: function() {
		this._el.content_item.style.height = VCO.Util.ratio.r16_9({w:this._el.content_item.offsetWidth}) + "px";
	}
	
});


/*	VCO.Media.DocumentCloud
================================================== */

VCO.Media.DocumentCloud = VCO.Media.extend({
	
	includes: [VCO.Events],
	
	/*	Load the media
	================================================== */
	_loadMedia: function() {
		var self = this;
		
		// Loading Message 
		this.loadingMessage();
				
		// Create Dom elements
		this._el.content_item	= VCO.Dom.create("div", "vco-media-item vco-media-documentcloud vco-media-shadow", this._el.content);
		this._el.content_item.id = VCO.Util.unique_ID(7)
		
		// Check url
		if(this.data.url.match(/\.html$/)) {
		    this.data.url = this._transformURL(this.data.url);
		} else if(!(this.data.url.match(/.(json|js)$/))) {
		    trace("DOCUMENT CLOUD IN URL BUT INVALID SUFFIX");
		}
		
		// Load viewer API
        VCO.Load.js([
                '//s3.documentcloud.org/viewer/loader.js', 
                '//s3.amazonaws.com/s3.documentcloud.org/viewer/viewer.js'],
            function() {	
	            self.createMedia();
			}
		);	
	},
	
	// Viewer API needs js, not html
	_transformURL: function(url) {
        return url.replace(/(.*)\.html$/, '$1.js')
	},
	
	// Update Media Display
	_updateMediaDisplay: function() {
        this._el.content_item.style.height = this.options.height + "px";
		//this._el.content_item.style.width = this.options.width + "px";
	},
		
	createMedia: function() {		
		// DocumentCloud API call	
		DV.load(this.data.url, {
		    container: '#'+this._el.content_item.id, 
		    showSidebar: false
		});
		this.onLoaded();
	},
	

	
	/*	Events
	================================================== */


	
});


/*	VCO.Media.Flickr

================================================== */

VCO.Media.Flickr = VCO.Media.extend({
	
	includes: [VCO.Events],
	
	/*	Load the media
	================================================== */
	_loadMedia: function() {
		var api_url,
			self = this;
		
		// Loading Message
		this.loadingMessage();
		
		// Link
		this._el.content_link 				= VCO.Dom.create("a", "", this._el.content);
		this._el.content_link.href 			= this.data.url;
		this._el.content_link.target 		= "_blank";
		
		// Photo
		this._el.content_item	= VCO.Dom.create("img", "vco-media-item vco-media-image vco-media-flickr vco-media-shadow", this._el.content_link);
		
		// Media Loaded Event
		this._el.content_item.addEventListener('load', function(e) {
			self.onMediaLoaded();
		});
		
		// Get Media ID
		this.establishMediaID();
		
		// API URL
		api_url = "https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=" + this.options.api_key_flickr + "&photo_id=" + this.media_id + "&format=json&jsoncallback=?";
		
		// API Call
		VCO.getJSON(api_url, function(d) {
			if (d.stat == "ok") {
				self.createMedia(d);
			} else {
				self.loadErrorDisplay("Photo not found or private.");
			}
		});
		
	},

	establishMediaID: function() {
		var marker = 'flickr.com/photos/';
		var idx = this.data.url.indexOf(marker);
		if (idx == -1) { throw "Invalid Flickr URL"; }
		var pos = idx + marker.length;
		this.media_id = this.data.url.substr(pos).split("/")[1];
	},
	
	createMedia: function(d) {
		trace(d);
		var best_size 	= this.sizes(this.options.height),
			size 		= d.sizes.size[d.sizes.size.length - 2].source;
			self = this;
		
		for(var i = 0; i < d.sizes.size.length; i++) {
			if (d.sizes.size[i].label == best_size) {
				size = d.sizes.size[i].source;
			}
		}
			
		// Set Image Source
		this._el.content_item.src			= size;
		
		// After Loaded
		this.onLoaded();
	},
	
	_getMeta: function() {
		var self = this,
		api_url;
		
		// API URL
		api_url = "https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=" + this.options.api_key_flickr + "&photo_id=" + this.media_id + "&format=json&jsoncallback=?";
		
		// API Call
		VCO.getJSON(api_url, function(d) {
			self.data.credit_alternate = "<a href='" + self.data.url + "' target='_blank'>" + d.photo.owner.realname + "</a>";
			self.data.caption_alternate = d.photo.title._content + " " + d.photo.description._content;
			self.updateMeta();
		});
	},
	
	sizes: function(s) {
		var _size = "";
		
		if (s <= 75) {
			if (s <= 0) {
				_size = "Large";
			} else {
				_size = "Thumbnail";
			}
		} else if (s <= 180) {
			_size = "Small";
		} else if (s <= 240) {
			_size = "Small 320";
		} else if (s <= 375) {
			_size = "Medium";
		} else if (s <= 480) {
			_size = "Medium 640";
		} else if (s <= 600) {
			_size = "Large";
		} else {
			_size = "Large";
		}
		
		return _size;
	}
	
	
	
});


/*	VCO.Media.GoogleDoc

================================================== */

VCO.Media.GoogleDoc = VCO.Media.extend({
	
	includes: [VCO.Events],
	
	/*	Load the media
	================================================== */
	_loadMedia: function() {
		var api_url,
			self = this;
		
		// Loading Message
		this.loadingMessage();
		
		// Create Dom element
		this._el.content_item	= VCO.Dom.create("div", "vco-media-item vco-media-iframe", this._el.content);
		
		// Get Media ID
		if (this.data.url.match("open\?id\=")) {
			this.media_id = this.data.url.split("open\?id\=")[1];
			if (this.data.url.match("\&authuser\=0")) {
				this.media_id = this.media_id("\&authuser\=0")[0];
			};
		} else if (this.data.url.match("\/d\/")) {
			this.media_id = this.data.url.split("\/d\/")[1];
			if (this.data.url.match("[^\/]*\/")) {
				this.media_id = this.media_id("[^\/]*\/")[0];
			};
		} else {
			this.media_id = "";
		}
		
		// API URL
		api_url = "http://www.googledrive.com/host/" + this.media_id + "/";
		
		// API Call
		if (this.media_id.match(/docs.google.com/i)) {
			this._el.content_item.innerHTML	=	"<iframe class='doc' frameborder='0' width='100%' height='100%' src='" + this.media_id + "&amp;embedded=true'></iframe>";
		} else {
			this._el.content_item.innerHTML	=	"<iframe class='doc' frameborder='0' width='100%' height='100%' src='" + "http://docs.google.com/viewer?url=" + this.media_id + "&amp;embedded=true'></iframe>";
		}
		
		// After Loaded
		this.onLoaded();
	},
	
	// Update Media Display
	_updateMediaDisplay: function() {
		this._el.content_item.style.height = this.options.height + "px";
	}

	
});


/*	VCO.Media.GooglePlus
================================================== */

VCO.Media.GooglePlus = VCO.Media.extend({
	
	includes: [VCO.Events],
	
	/*	Load the media
	================================================== */
	_loadMedia: function() {
		var api_url,
			self = this;
		
		// Loading Message
		this.loadingMessage();
		
		// Create Dom element
		this._el.content_item	= VCO.Dom.create("div", "vco-media-item vco-media-googleplus", this._el.content);
		
		// Get Media ID
		this.media_id = this.data.url;
		
		// API URL
		api_url = this.media_id;
		
		// API Call
		this._el.content_item.innerHTML = "<iframe frameborder='0' width='100%' height='100%' src='" + api_url + "'></iframe>"		
		
		// After Loaded
		this.onLoaded();
	},
	
	// Update Media Display
	_updateMediaDisplay: function() {
		this._el.content_item.style.height = this.options.height + "px";
	}

	
});


/*	VCO.Media.IFrame
================================================== */

VCO.Media.IFrame = VCO.Media.extend({
	
	includes: [VCO.Events],
	
	/*	Load the media
	================================================== */
	_loadMedia: function() {
		var api_url,
			self = this;
		
		// Loading Message
		this.loadingMessage();
		
		// Create Dom element
		this._el.content_item	= VCO.Dom.create("div", "vco-media-item vco-media-iframe", this._el.content);
		
		// Get Media ID
		this.media_id = this.data.url;
		
		// API URL
		api_url = this.media_id;
		
		// API Call
		this._el.content_item.innerHTML = api_url;
		
		// After Loaded
		this.onLoaded();
	},
	
	// Update Media Display
	_updateMediaDisplay: function() {
		this._el.content_item.style.height = this.options.height + "px";
	}
	
});


/*	VCO.Media.Image
	Produces image assets.
	Takes a data object and populates a dom object
================================================== */

VCO.Media.Image = VCO.Media.extend({
	
	includes: [VCO.Events],
	
	/*	Load the media
	================================================== */
	_loadMedia: function() {
		var self = this;
		// Loading Message
		this.loadingMessage();
		
		// Link
		if (this.data.link) {
			this._el.content_link 				= VCO.Dom.create("a", "", this._el.content);
			this._el.content_link.href 			= this.data.link;
			this._el.content_link.target 		= "_blank";
			this._el.content_item				= VCO.Dom.create("img", "vco-media-item vco-media-image vco-media-shadow", this._el.content_link);
		} else {
			this._el.content_item				= VCO.Dom.create("img", "vco-media-item vco-media-image vco-media-shadow", this._el.content);
		}
		
		// Media Loaded Event
		this._el.content_item.addEventListener('load', function(e) {
			self.onMediaLoaded();
		});
		
		this._el.content_item.src			= this._transformURL(this.data.url);
		
		this.onLoaded();
	},
	
	_transformURL: function(url) {
        return url.replace(/(.*)www.dropbox.com\/(.*)/, '$1dl.dropboxusercontent.com/$2')
	},
	
	_updateMediaDisplay: function(layout) {
		
		
		if(VCO.Browser.firefox) {
			//this._el.content_item.style.maxWidth = (this.options.width/2) - 40 + "px";
			this._el.content_item.style.width = "auto";
		}
		
	}
	
});

/*	VCO.Media.Instagram

================================================== */

VCO.Media.Instagram = VCO.Media.extend({
	
	includes: [VCO.Events],
	
	/*	Load the media
	================================================== */
	_loadMedia: function() {
		var api_url,
			self = this;
		
		// Loading Message
		this.loadingMessage();
		
		// Get Media ID
		this.media_id = this.data.url.split("\/p\/")[1].split("/")[0];
		
		// Link
		this._el.content_link 				= VCO.Dom.create("a", "", this._el.content);
		this._el.content_link.href 			= this.data.url;
		this._el.content_link.target 		= "_blank";
		
		// Photo
		this._el.content_item				= VCO.Dom.create("img", "vco-media-item vco-media-image vco-media-instagram vco-media-shadow", this._el.content_link);
		
		// Media Loaded Event
		this._el.content_item.addEventListener('load', function(e) {
			self.onMediaLoaded();
		});
		
		// Set source
		this._el.content_item.src			= "http://instagr.am/p/" + this.media_id + "/media/?size=" + this.sizes(this._el.content.offsetWidth);
		
		// API URL
		api_url = "http://api.instagram.com/oembed?url=http://instagr.am/p/" + this.media_id + "&callback=?";
		
		// After Loaded
		this.onLoaded();
	},
	
	_getMeta: function() {
		var self = this,
		api_url;
		
		// API URL
		api_url = "http://api.instagram.com/oembed?url=http://instagr.am/p/" + this.media_id + "&callback=?";
		
		// API Call
		VCO.getJSON(api_url, function(d) {
			self.data.credit_alternate = "<a href='" + d.author_url + "' target='_blank'>" + d.author_name + "</a>";
			self.data.caption_alternate = d.title;
			self.updateMeta();
		});
	},
	
	sizes: function(s) {
		var _size = "";
		if (s <= 150) {
			_size = "t";
		} else if (s <= 306) {
			_size = "m";
		} else {
			_size = "l";
		}
		
		return _size;
	}
	
	
	
});


/*  VCO.Media.Blockquote
================================================== */

VCO.Media.Map = VCO.Media.extend({
    includes: [VCO.Events],

    _API_KEY: "AIzaSyB9dW8e_iRrATFa8g24qB6BDBGdkrLDZYI",
    /*  Load the media
    ================================================== */
    _loadMedia: function() {

        // Loading Message
        this.loadingMessage();

        // Create Dom element
        this._el.content_item   = VCO.Dom.create("div", "vco-media-item vco-media-map", this._el.content);
        this._el.content_container.className = "vco-media-content-container vco-media-content-container-text";

        // Get Media ID (why?)
        this.media_id = this.data.url;

        // API Call

        this.mapframe = VCO.Dom.create("iframe", "", this._el.content_item);
        window.stash = this;
        this.mapframe.width       = "100%";
        this.mapframe.height      = "100%";
        this.mapframe.frameBorder = "0";
        this.mapframe.src         = VCO.Util.makeGoogleMapsEmbedURL(this.data.url, this.options.api_key_googlemaps);
        // After Loaded
        this.onLoaded();
    },

    _updateMediaDisplay: function() {
			if (this._state.loaded) {
        var dimensions = VCO.Util.ratio.square({w:this._el.content_item.offsetWidth});
        this._el.content_item.style.height = dimensions.h + "px";
      }
    }
});


/*	VCO.Media.Profile

================================================== */

VCO.Media.Profile = VCO.Media.extend({
	
	includes: [VCO.Events],
	
	/*	Load the media
	================================================== */
	_loadMedia: function() {
		// Loading Message
		this.loadingMessage();
		
		this._el.content_item				= VCO.Dom.create("img", "vco-media-item vco-media-image vco-media-profile vco-media-shadow", this._el.content);
		this._el.content_item.src			= this.data.url;
		
		this.onLoaded();
	},
	
	_updateMediaDisplay: function(layout) {
		
		
		if(VCO.Browser.firefox) {
			this._el.content_item.style.maxWidth = (this.options.width/2) - 40 + "px";
		}
	}
	
});

/*	VCO.Media.SLider
	Produces a Slider
	Takes a data object and populates a dom object
	TODO
	Placeholder
================================================== */

VCO.Media.Slider = VCO.Media.extend({
	
	includes: [VCO.Events],
	
	/*	Load the media
	================================================== */
	_loadMedia: function() {
		
		this._el.content_item				= VCO.Dom.create("img", "vco-media-item vco-media-image", this._el.content);
		this._el.content_item.src			= this.data.url;
		
		this.onLoaded();
	}
	
});

/*	VCO.Media.SoundCloud
================================================== */

VCO.Media.SoundCloud = VCO.Media.extend({
	
	includes: [VCO.Events],
	
	/*	Load the media
	================================================== */
	_loadMedia: function() {
		var api_url,
			self = this;
		
		// Loading Message
		this.loadingMessage();
		
		// Create Dom element
		this._el.content_item	= VCO.Dom.create("div", "vco-media-item vco-media-iframe vco-media-soundcloud vco-media-shadow", this._el.content);
		
		// Get Media ID
		this.media_id = this.data.url;
		
		// API URL
		api_url = "http://soundcloud.com/oembed?url=" + this.media_id + "&format=js&callback=?"
		
		// API Call
		VCO.getJSON(api_url, function(d) {
			self.createMedia(d);
		});
		
	},
	
	createMedia: function(d) {
		this._el.content_item.innerHTML = d.html;
		
		// After Loaded
		this.onLoaded();
	}
	
});


/*	VCO.Media.Spotify
================================================== */

VCO.Media.Spotify = VCO.Media.extend({
	
	includes: [VCO.Events],
	
	/*	Load the media
	================================================== */
	_loadMedia: function() {
		var api_url,
			self = this;
		
		// Loading Message
		this.loadingMessage();
		
		// Create Dom element
		this._el.content_item	= VCO.Dom.create("div", "vco-media-item vco-media-iframe vco-media-spotify", this._el.content);
		
		// Get Media ID
		if (this.data.url.match("open.spotify.com/track/")) {
			this.media_id = "spotify:track:" + this.data.url.split("open.spotify.com/track/")[1];
		} else if (this.data.url.match("spotify:track:")) {
			this.media_id = this.data.url;
		} else if (this.data.url.match("/playlist/")) {
			var user = this.data.url.split("open.spotify.com/user/")[1].split("/playlist/")[0];
			this.media_id = "spotify:user:" + user + ":playlist:" + this.data.url.split("/playlist/")[1];
		} else if (this.data.url.match(":playlist:")) {
			this.media_id = this.data.url;
		}
		
		// API URL
		api_url = "http://embed.spotify.com/?uri=" + this.media_id + "&theme=white&view=coverart";
				
		this.player = VCO.Dom.create("iframe", "vco-media-shadow", this._el.content_item);
		this.player.width 		= "100%";
		this.player.height 		= "100%";
		this.player.frameBorder = "0";
		this.player.src 		= api_url;
		
		// After Loaded
		this.onLoaded();
	},
	
	// Update Media Display
	
	_updateMediaDisplay: function(l) {
		var _height = this.options.height,
			_player_height = 0,
			_player_width = 0;
			
		if (VCO.Browser.mobile) {
			_height = (this.options.height/2);
		} else {
			_height = this.options.height - this.options.credit_height - this.options.caption_height - 30;
		}
		
		this._el.content_item.style.maxHeight = "none";
		trace(_height);
		trace(this.options.width)
		if (_height > this.options.width) {
			trace("height is greater")
			_player_height = this.options.width + 80 + "px";
			_player_width = this.options.width + "px";
		} else {
			trace("width is greater")
			trace(this.options.width)
			_player_height = _height + "px";
			_player_width = _height - 80 + "px";
		}
		

		this.player.style.width = _player_width;
		this.player.style.height = _player_height;
		
		if (this._el.credit) {
			this._el.credit.style.width		= _player_width;
		}
		if (this._el.caption) {
			this._el.caption.style.width		= _player_width;
		}
	},
	
	
	_stopMedia: function() {
		// Need spotify stop code
		
	}
	
});


/*	VCO.Media.Storify
================================================== */

VCO.Media.Storify = VCO.Media.extend({
	
	includes: [VCO.Events],
	
	/*	Load the media
	================================================== */
	_loadMedia: function() {
		var content;
		
		// Loading Message
		this.loadingMessage();
		
		// Create Dom element
		this._el.content_item	= VCO.Dom.create("div", "vco-media-item vco-media-iframe vco-media-storify", this._el.content);
		
		// Get Media ID
		this.media_id = this.data.url;
		
		// Content
		content =	"<iframe frameborder='0' width='100%' height='100%' src='" + this.media_id + "/embed'></iframe>";
		content +=	"<script src='" + this.media_id + ".js'></script>";
		
		// API Call
		this._el.content_item.innerHTML = content;
		
		// After Loaded
		this.onLoaded();
	},
	
	// Update Media Display
	_updateMediaDisplay: function() {
		this._el.content_item.style.height = this.options.height + "px";
	}
	
	
});


VCO.Media.Text = VCO.Class.extend({
	
	includes: [VCO.Events],
	
	// DOM ELEMENTS
	_el: {
		container: {},
		content_container: {},
		content: {},
		headline: {},
		date: {}
	},
	
	// Data
	data: {
		uniqueid: 			"",
		headline: 			"headline",
		text: 				"text"
	},
	
	// Options
	options: {
		title: 			false
	},
	
	/*	Constructor
	================================================== */
	initialize: function(data, options, add_to_container) {
		
		VCO.Util.setData(this, data);
		
		// Merge Options
		VCO.Util.mergeData(this.options, options);
		
		this._el.container = VCO.Dom.create("div", "vco-text");
		this._el.container.id = this.data.uniqueid;
		
		this._initLayout();
		
		if (add_to_container) {
			add_to_container.appendChild(this._el.container);
		};
		
	},
	
	/*	Adding, Hiding, Showing etc
	================================================== */
	show: function() {
		
	},
	
	hide: function() {
		
	},
	
	addTo: function(container) {
		container.appendChild(this._el.container);
		//this.onAdd();
	},
	
	removeFrom: function(container) {
		container.removeChild(this._el.container);
	},
	
	headlineHeight: function() {
		return this._el.headline.offsetHeight + 40;
	},
	
	addDateText: function(str) {
		this._el.date.innerHTML = str;
	},
	
	/*	Events
	================================================== */
	onLoaded: function() {
		this.fire("loaded", this.data);
	},
	
	onAdd: function() {
		this.fire("added", this.data);
	},

	onRemove: function() {
		this.fire("removed", this.data);
	},
	
	/*	Private Methods
	================================================== */
	_initLayout: function () {
		
		// Create Layout
		this._el.content_container			= VCO.Dom.create("div", "vco-text-content-container", this._el.container);
		
		// Date
		this._el.date 				= VCO.Dom.create("h3", "vco-headline-date", this._el.content_container);
		
		// Headline
		if (this.data.headline != "") {
			var headline_class = "vco-headline";
			if (this.options.title) {
				headline_class = "vco-headline vco-headline-title";
			}
			this._el.headline				= VCO.Dom.create("h2", headline_class, this._el.content_container);
			this._el.headline.innerHTML		= this.data.headline;
		}
		
		// Text
		if (this.data.text != "") {
			var text_content = "";
			
			text_content 					+= VCO.Util.htmlify(VCO.Util.linkify(this.data.text));
						
			this._el.content				= VCO.Dom.create("div", "vco-text-content", this._el.content_container);
			this._el.content.innerHTML		= text_content;
		}
		
		
		// Fire event that the slide is loaded
		this.onLoaded();
		
		
		
	}
	
});

/*	VCO.Media.Twitter
	Produces Twitter Display
================================================== */

VCO.Media.Twitter = VCO.Media.extend({
	
	includes: [VCO.Events],
	
	/*	Load the media
	================================================== */
	_loadMedia: function() {
		var api_url,
			self = this;
			
		// Loading Message
		this.loadingMessage();
		
		// Create Dom element
		this._el.content_item = VCO.Dom.create("div", "vco-media-twitter", this._el.content);
		this._el.content_container.className = "vco-media-content-container vco-media-content-container-text";
		
		// Get Media ID
		if (this.data.url.match("status\/")) {
			this.media_id = this.data.url.split("status\/")[1];
		} else if (url.match("statuses\/")) {
			this.media_id = this.data.url.split("statuses\/")[1];
		} else {
			this.media_id = "";
		}
		
		// API URL
		api_url = "https://api.twitter.com/1/statuses/oembed.json?id=" + this.media_id + "&omit_script=true&include_entities=true&callback=?";
		
		// API Call
		VCO.ajax({
			type: 'GET',
			url: api_url,
			dataType: 'json', //json data type
			success: function(d){
				self.createMedia(d);
			},
			error:function(xhr, type){
				var error_text = "";
				error_text += "Unable to load Tweet. <br/>" + self.media_id + "<br/>" + type;
				self.loadErrorDisplay(error_text);
			}
		});
		 
	},
	
	createMedia: function(d) {
		var tweet				= "",
			tweet_text			= "",
			tweetuser			= "",
			tweet_status_temp 	= "",
			tweet_status_url 	= "",
			tweet_status_date 	= "";
			
		//	TWEET CONTENT
		tweet_text 			= d.html.split("<\/p>\&mdash;")[0] + "</p></blockquote>";
		tweetuser			= d.author_url.split("twitter.com\/")[1];
		tweet_status_temp 	= d.html.split("<\/p>\&mdash;")[1].split("<a href=\"")[1];
		tweet_status_url 	= tweet_status_temp.split("\"\>")[0];
		tweet_status_date 	= tweet_status_temp.split("\"\>")[1].split("<\/a>")[0];
		
		// Open links in new window
		tweet_text = tweet_text.replace(/<a href/ig, '<a target="_blank" href');

		// 	TWEET CONTENT
		tweet += tweet_text;
		
		//	TWEET AUTHOR
		tweet += "<div class='vcard'>";
		tweet += "<a href='" + tweet_status_url + "' class='twitter-date' target='_blank'>" + tweet_status_date + "</a>";
		tweet += "<div class='author'>";
		tweet += "<a class='screen-name url' href='" + d.author_url + "' target='_blank'>";
		tweet += "<span class='avatar'></span>";
		tweet += "<span class='fn'>" + d.author_name + " <span class='vco-icon-twitter'></span></span>";
		tweet += "<span class='nickname'>@" + tweetuser + "<span class='thumbnail-inline'></span></span>";
		tweet += "</a>";
		tweet += "</div>";
		tweet += "</div>";
		
		
		// Add to DOM
		this._el.content_item.innerHTML	= tweet;
		
		// After Loaded
		this.onLoaded();
			
	},
	
	updateMediaDisplay: function() {
		
	},
	
	_updateMediaDisplay: function() {
		
	}
	
	
	
});


/*	VCO.Media.Vimeo
================================================== */

VCO.Media.Vimeo = VCO.Media.extend({

	includes: [VCO.Events],

	/*	Load the media
	================================================== */
	_loadMedia: function() {
		var api_url,
			self = this;

		// Loading Message
		this.loadingMessage();

		// Create Dom element
		this._el.content_item	= VCO.Dom.create("div", "vco-media-item vco-media-iframe vco-media-vimeo vco-media-shadow", this._el.content);

		// Get Media ID
		this.media_id = this.data.url.split(/video\/|\/\/vimeo\.com\//)[1].split(/[?&]/)[0];

		// API URL
		api_url = "http://player.vimeo.com/video/" + this.media_id + "?api=1&title=0&amp;byline=0&amp;portrait=0&amp;color=ffffff";

		this.player = VCO.Dom.create("iframe", "", this._el.content_item);

		// Media Loaded Event
		this.player.addEventListener('load', function(e) {
			self.onMediaLoaded();
		});

		this.player.width 		= "100%";
		this.player.height 		= "100%";
		this.player.frameBorder = "0";
		this.player.src 		= api_url;

		// After Loaded
		this.onLoaded();
	},

	// Update Media Display
	_updateMediaDisplay: function() {
		this._el.content_item.style.height = VCO.Util.ratio.r16_9({w:this._el.content_item.offsetWidth}) + "px";

	},

	_stopMedia: function() {

		try {
			this.player.contentWindow.postMessage(JSON.stringify({method: "pause"}), "http://player.vimeo.com");
		}
		catch(err) {
			trace(err);
		}

	}
});


/*	VCO.Media.Vine

================================================== */

VCO.Media.Vine = VCO.Media.extend({
	
	includes: [VCO.Events],
	
	/*	Load the media
	================================================== */
	_loadMedia: function() {
		var api_url,
			self = this;
		
		// Loading Message
		this.loadingMessage();
		
		// Create Dom element
		this._el.content_item	= VCO.Dom.create("div", "vco-media-item vco-media-iframe vco-media-vine vco-media-shadow", this._el.content);
		
		// Get Media ID
		this.media_id = this.data.url.split("vine.co/v/")[1];
		
		// API URL
		api_url = "https://vine.co/v/" + this.media_id + "/embed/simple";
		
		// API Call
		this._el.content_item.innerHTML = "<iframe frameborder='0' width='100%' height='100%' src='" + api_url + "'></iframe><script async src='http://platform.vine.co/static/scripts/embed.js' charset='utf-8'></script>"		
		
		// After Loaded
		this.onLoaded();
	},
	
	// Update Media Display
	_updateMediaDisplay: function() {
		var size = VCO.Util.ratio.square({w:this._el.content_item.offsetWidth , h:this.options.height});
		this._el.content_item.style.height = size.h + "px";
	}
	
});


/*	VCO.Media.Website
	Uses Embedly
	http://embed.ly/docs/api/extract/endpoints/1/extract
================================================== */

VCO.Media.Website = VCO.Media.extend({
	
	includes: [VCO.Events],
	
	/*	Load the media
	================================================== */
	_loadMedia: function() {
		var self = this;
		// Loading Message
		this.loadingMessage();
		
		// Get Media ID
		this.media_id = this.data.url.replace(/.*?:\/\//g, "");
		// API URL
		api_url = "http://api.embed.ly/1/extract?key=" + this.options.api_key_embedly + "&url=" + this.media_id + "&callback=?";
		
		// API Call
		VCO.getJSON(api_url, function(d) {
			self.createMedia(d);
		});
		
		
	},
	
	createMedia: function(d) {
		var content = "";
		
		
		content		+=	"<h4><a href='" + this.data.url + "' target='_blank'>" + d.title + "</a></h4>";
		if (d.images) {
			if (d.images[0]) {
				trace(d.images[0].url);
				content		+=	"<img src='" + d.images[0].url + "' />";
			}
		}
		content		+=	"<img class='vco-media-website-icon' src='" + d.favicon_url + "' />";
		content		+=	"<span class='vco-media-website-description'>" + d.provider_name + "</span><br/>";
		content		+=	"<p>" + d.description + "</p>";
		
		// Create Dom element
		this._el.content_item	= VCO.Dom.create("div", "vco-media-item vco-media-website", this._el.content);
		this._el.content_container.className = "vco-media-content-container vco-media-content-container-text";
		this._el.content_item.innerHTML = content;
		
		// After Loaded
		this.onLoaded();
	},
	
	updateMediaDisplay: function() {
		
	},
	
	_updateMediaDisplay: function() {
		
	}
	
	
});


/*	VCO.Media.Wikipedia
================================================== */

VCO.Media.Wikipedia = VCO.Media.extend({
	
	includes: [VCO.Events],
	
	/*	Load the media
	================================================== */
	_loadMedia: function() {
		var api_url,
			api_language,
			self = this;
		
		// Loading Message
		this.loadingMessage();
		
		// Create Dom element
		this._el.content_item	= VCO.Dom.create("div", "vco-media-item vco-media-wikipedia", this._el.content);
		this._el.content_container.className = "vco-media-content-container vco-media-content-container-text";
		
		// Get Media ID
		this.media_id	 = this.data.url.split("wiki\/")[1].split("#")[0].replace("_", " ");
		this.media_id	 = this.media_id.replace(" ", "%20");
		api_language	 = this.data.url.split("//")[1].split(".wikipedia")[0];
		
		// API URL
		api_url = "http://" + api_language + ".wikipedia.org/w/api.php?action=query&prop=extracts&redirects=&titles=" + this.media_id + "&exintro=1&format=json&callback=?";
		
		// API Call
		
		VCO.ajax({
			type: 'GET',
			url: api_url,
			dataType: 'json', //json data type
			
			success: function(d){
				self.createMedia(d);
			},
			error:function(xhr, type){
				var error_text = "";
				error_text += "Unable to load Wikipedia entry. <br/>" + self.media_id + "<br/>" + type;
				self.loadErrorDisplay(error_text);
			}
		});
		
	},
	
	createMedia: function(d) {
		var wiki = "";
		
		if (d.query) {
			var content,
				wiki = {
					entry: {},
					title: "",
					text: "",
					extract: "",
					paragraphs: 1,
					text_array: []
				};
			
			wiki.entry		 = VCO.Util.getObjectAttributeByIndex(d.query.pages, 0);
			wiki.extract	 = wiki.entry.extract;
			wiki.title		 = wiki.entry.title;
			
			if (wiki.extract.match("<p>")) {
				wiki.text_array = wiki.extract.split("<p>");
			} else {
				wiki.text_array.push(wiki.extract);
			}
			
			for(var i = 0; i < wiki.text_array.length; i++) {
				if (i+1 <= wiki.paragraphs && i+1 < wiki.text_array.length) {
					wiki.text	+= "<p>" + wiki.text_array[i+1];
				}
			}
			
			content		=	"<h4><a href='" + this.data.url + "' target='_blank'>" + wiki.title + "</a></h4>";
			content		+=	"<span class='wiki-source'>" + this._('wikipedia') + "</span>";
			content		+=	wiki.text;
			
			if (wiki.extract.match("REDIRECT")) {
			
			} else {
				// Add to DOM
				this._el.content_item.innerHTML	= content;
				// After Loaded
				this.onLoaded();
			}
			
			
		}
			
	},
	
	updateMediaDisplay: function() {
		
	},
	
	_updateMediaDisplay: function() {
		
	}
	
});


/*	VCO.Media.YouTube
================================================== */

VCO.Media.YouTube = VCO.Media.extend({
	
	includes: [VCO.Events],
	
	/*	Load the media
	================================================== */
	_loadMedia: function() {
		var self = this,
			url_vars;
		
		// Loading Message 
		this.loadingMessage();
		
		this.youtube_loaded = false;
		
		// Create Dom element
		this._el.content_item	= VCO.Dom.create("div", "vco-media-item vco-media-youtube vco-media-shadow", this._el.content);
		this._el.content_item.id = VCO.Util.unique_ID(7)
		
		// URL Vars
		url_vars = VCO.Util.getUrlVars(this.data.url);
		
		// Get Media ID
		this.media_id = {};
		
		if (this.data.url.match('v=')) {
			this.media_id.id	= url_vars["v"];
		} else if (this.data.url.match('\/embed\/')) {
			this.media_id.id	= this.data.url.split("embed\/")[1].split(/[?&]/)[0];
		} else if (this.data.url.match(/v\/|v=|youtu\.be\//)){
			this.media_id.id	= this.data.url.split(/v\/|v=|youtu\.be\//)[1].split(/[?&]/)[0];
		} else {
			trace("YOUTUBE IN URL BUT NOT A VALID VIDEO");
		}
		
		this.media_id.start		= url_vars["t"];
		this.media_id.hd		= url_vars["hd"];
		
		
		// API Call
		VCO.Load.js('https://www.youtube.com/player_api', function() {
			self.createMedia();
		});
		
	},
	
	// Update Media Display
	_updateMediaDisplay: function() {
		//this.el.content_item = document.getElementById(this._el.content_item.id);
		this._el.content_item.style.height = VCO.Util.ratio.r16_9({w:this.options.width}) + "px";
		this._el.content_item.style.width = this.options.width + "px";
	},
	
	_stopMedia: function() {
		if (this.youtube_loaded) {
			try {
				this.player.pauseVideo();
			}
			catch(err) {
				trace(err);
			}
			
		}
	},
	
	createMedia: function() {
		var self = this;
		
		// Determine Start of Media
		if (typeof(this.media_id.start) != 'undefined') {
			
			var vidstart			= this.media_id.start.toString(),
				vid_start_minutes	= 0,
				vid_start_seconds	= 0;
				
			if (vidstart.match('m')) {
				vid_start_minutes = parseInt(vidstart.split("m")[0], 10);
				vid_start_seconds = parseInt(vidstart.split("m")[1].split("s")[0], 10);
				this.media_id.start = (vid_start_minutes * 60) + vid_start_seconds;
			} else {
				this.media_id.start = 0;
			}
		} else {
			this.media_id.start = 0;
		}
		
		// Determine HD
		if (typeof(this.media_id.hd) != 'undefined') {
			this.media_id.hd = true;
		} else {
			this.media_id.hd = false;
		}
		
		this.createPlayer();
		
			
	},
	
	createPlayer: function() {
		var self = this;
		
		clearTimeout(this.timer);
		
		if(typeof YT != 'undefined' && typeof YT.Player != 'undefined') {
			// Create Player
			this.player = new YT.Player(this._el.content_item.id, {
				playerVars: {
					enablejsapi:		1,
					color: 				'white',
					autohide: 			1,
					showinfo:			0,
					theme:				'light',
					start:				this.media_id.start,
					fs: 				0,
					rel:				0
				},
				videoId: this.media_id.id,
				events: {
					onReady: 			function() {
						self.onPlayerReady();
						// After Loaded
						self.onLoaded();
					},
					'onStateChange': 	self.onStateChange
				}
			});
		} else {
			this.timer = setTimeout(function() {
				self.createPlayer();
			}, 1000);
		}
		
	},
	
	/*	Events
	================================================== */
	onPlayerReady: function(e) {
		this.youtube_loaded = true;
		this._el.content_item = document.getElementById(this._el.content_item.id);
		this.onMediaLoaded();
		
	},
	
	onStateChange: function(e) {
		
	}

	
});


/*	VCO.Slide
	Creates a slide. Takes a data object and
	populates the slide with content.
================================================== */

VCO.Slide = VCO.Class.extend({
	
	includes: [VCO.Events, VCO.DomMixins, VCO.I18NMixins],
	
	_el: {},
	
	/*	Constructor
	================================================== */
	initialize: function(data, options, title_slide) {
		// DOM Elements
		this._el = {
			container: {},
			scroll_container: {},
			background: {},
			content_container: {},
			content: {}
		};
	
		// Components
		this._media 		= null;
		this._mediaclass	= {};
		this._text			= {};
	
		// State
		this._state = {
			loaded: 		false
		};
		
		this.has = {
			headline: 	false,
			text: 		false,
			media: 		false,
			title: 		false,
			background: {
				image: false,
				color: false,
				color_value :""
			}
		}
		
		this.has.title = title_slide;
		
		// Data
		this.data = {
			uniqueid: 				null,
			background: 			null,
			start_date: 			null,
			end_date: 				null,
			location: 				null,
			text: 					null,
			media: 					null
		};
	
		// Options
		this.options = {
			// animation
			duration: 			1000,
			slide_padding_lr: 	40,
			ease: 				VCO.Ease.easeInSpline,
			width: 				600,
			height: 			600,
			skinny_size: 		650,
			media_name: 		""
		};
		
		// Actively Displaying
		this.active = false;
		
		// Animation Object
		this.animator = {};
		
		// Merge Data and Options
		VCO.Util.mergeData(this.options, options);
		VCO.Util.mergeData(this.data, data);
		
		this._initLayout();
		this._initEvents();
		
		
	},
	
	/*	Adding, Hiding, Showing etc
	================================================== */
	show: function() {
		this.animator = VCO.Animate(this._el.slider_container, {
			left: 		-(this._el.container.offsetWidth * n) + "px",
			duration: 	this.options.duration,
			easing: 	this.options.ease
		});
	},
	
	hide: function() {
		
	},
	
	setActive: function(is_active) {
		this.active = is_active;
		
		if (this.active) {
			if (this.data.background) {
				this.fire("background_change", this.has.background);
			}
			this.loadMedia();
		} else {
			this.stopMedia();
		}
	},
	
	addTo: function(container) {
		container.appendChild(this._el.container);
		//this.onAdd();
	},
	
	removeFrom: function(container) {
		container.removeChild(this._el.container);
	},
	
	updateDisplay: function(w, h, l) {
		this._updateDisplay(w, h, l);
	},
	
	loadMedia: function() {
		
		if (this._media && !this._state.loaded) {
			this._media.loadMedia();
			this._state.loaded = true;
		}
	},
	
	stopMedia: function() {
		if (this._media && this._state.loaded) {
			this._media.stopMedia();
		}
	},
	
	getBackground: function() {
		return this.has.background;
	},
	
	scrollToTop: function() {
		this._el.container.scrollTop = 0;
	},

	getFormattedDate: function() {
		var date_text = "";
		
		if(!this.has.title) {
            if (this.data.end_date) {
                date_text = " &mdash; " + this.data.end_date.getDisplayDate(this.getLanguage());
            }
            if (this.data.start_date) {
                date_text = this.data.start_date.getDisplayDate(this.getLanguage()) + date_text;
            }
        }
		return date_text;
	},
	
	/*	Events
	================================================== */

	
	/*	Private Methods
	================================================== */
	_initLayout: function () {
		// Create Layout
		this._el.container 				= VCO.Dom.create("div", "vco-slide");
		
		if (this.has.title) {
			this._el.container.className = "vco-slide vco-slide-titleslide";
		}
		
		if (this.data.uniqueid) {
			this._el.container.id 		= this.data.uniqueid;
		}
		this._el.scroll_container 		= VCO.Dom.create("div", "vco-slide-scrollable-container", this._el.container);
		this._el.content_container		= VCO.Dom.create("div", "vco-slide-content-container", this._el.scroll_container);
		this._el.content				= VCO.Dom.create("div", "vco-slide-content", this._el.content_container);
		this._el.background				= VCO.Dom.create("div", "vco-slide-background", this._el.container);
		// Style Slide Background
		if (this.data.background) {
			if (this.data.background.url) {
				this.has.background.image 					= true;
				this._el.container.className 				+= ' vco-full-image-background';
				//this._el.container.style.backgroundImage="url('" + this.data.background.url + "')";
				this.has.background.color_value 			= "#000";
				this._el.background.style.backgroundImage 	= "url('" + this.data.background.url + "')";
				this._el.background.style.display 			= "block";
			}
			if (this.data.background.color) {
				this.has.background.color 					= true;
				this._el.container.className 				+= ' vco-full-color-background';
				this.has.background.color_value 			= this.data.background.color;
				//this._el.container.style.backgroundColor = this.data.background.color;
				//this._el.background.style.backgroundColor 	= this.data.background.color;
				//this._el.background.style.display 			= "block";
			}
			if (this.data.background.text_background) {
				this._el.container.className 				+= ' vco-text-background';
			}
			
		} 
		
		
		
		// Determine Assets for layout and loading
		if (this.data.media && this.data.media.url && this.data.media.url != "") {
			this.has.media = true;
		}
		if (this.data.text && this.data.text.text) {
			this.has.text = true;
		}
		if (this.data.text && this.data.text.headline) {
			this.has.headline = true;
		}
		
		// Create Media
		if (this.has.media) {
			
			// Determine the media type
			this.data.media.mediatype 	= VCO.MediaType(this.data.media);
			this.options.media_name 	= this.data.media.mediatype.name;
			this.options.media_type 	= this.data.media.mediatype.type;
			
			// Create a media object using the matched class name
			this._media = new this.data.media.mediatype.cls(this.data.media, this.options);
			
		}
		
		// Create Text
		if (this.has.text || this.has.headline) {
			this._text = new VCO.Media.Text(this.data.text, {title:this.has.title,language: this.options.language});
			this._text.addDateText(this.getFormattedDate());
		}
		
		
		
		// Add to DOM
		if (!this.has.text && !this.has.headline && this.has.media) {
			this._el.container.className += ' vco-slide-media-only';
			this._media.addTo(this._el.content);
		} else if (this.has.headline && this.has.media && !this.has.text) {
			this._el.container.className += ' vco-slide-media-only';
			this._text.addTo(this._el.content);
			this._media.addTo(this._el.content);
		} else if (this.has.text && this.has.media) {
			this._media.addTo(this._el.content);
			this._text.addTo(this._el.content);
		} else if (this.has.text || this.has.headline) {
			this._el.container.className += ' vco-slide-text-only';
			this._text.addTo(this._el.content);
		}
		
		// Fire event that the slide is loaded
		this.onLoaded();
		
	},
	
	_initEvents: function() {
		
	},
	
	// Update Display
	_updateDisplay: function(width, height, layout) {
		var content_width,
			content_padding_left = this.options.slide_padding_lr,
			content_padding_right = this.options.slide_padding_lr;
		
		if (width) {
			this.options.width 					= width;
		} else {
			this.options.width 					= this._el.container.offsetWidth;
		}
		
		content_width = this.options.width - (this.options.slide_padding_lr * 2);
		
		if(VCO.Browser.mobile && (this.options.width <= this.options.skinny_size)) {
			content_padding_left = 0;
			content_padding_right = 0;
			content_width = this.options.width;
		} else if (layout == "landscape") {
			
		} else if (this.options.width <= this.options.skinny_size) {
			content_padding_left = 50;
			content_padding_right = 50;
			content_width = this.options.width - content_padding_left - content_padding_right;
		} else {
			
		}
		
		this._el.content.style.paddingLeft 	= content_padding_left + "px";
		this._el.content.style.paddingRight = content_padding_right + "px";
		this._el.content.style.width		= content_width + "px";
		
		if (height) {
			this.options.height = height;
			//this._el.scroll_container.style.height		= this.options.height + "px";
			
		} else {
			this.options.height = this._el.container.offsetHeight;
		}
		
		if (this._media) {
			
			if (!this.has.text && this.has.headline) {
				this._media.updateDisplay(content_width, (this.options.height - this._text.headlineHeight()), layout);
			} else if (!this.has.text && !this.has.headline) {
				this._media.updateDisplay(content_width, this.options.height, layout);
			} else if (this.options.width <= this.options.skinny_size) {
				this._media.updateDisplay(content_width, this.options.height, layout);
			} else {
				this._media.updateDisplay(content_width/2, this.options.height, layout);
			}
		}
		
	}
	
});


/*	VCO.SlideNav
	encapsulate DOM display/events for the 
	'next' and 'previous' buttons on a slide.
================================================== */
// TODO null out data

VCO.SlideNav = VCO.Class.extend({
	
	includes: [VCO.Events, VCO.DomMixins],
	
	_el: {},
	
	/*	Constructor
	================================================== */
	initialize: function(data, options, add_to_container) {
		// DOM ELEMENTS
		this._el = {
			container: {},
			content_container: {},
			icon: {},
			title: {},
			description: {}
		};
	
		// Media Type
		this.mediatype = {};
		
		// Data
		this.data = {
			title: "Navigation",
			description: "Description",
			date: "Date"
		};
	
		//Options
		this.options = {
			direction: 			"previous"
		};
	
		this.animator = null;
		
		// Merge Data and Options
		VCO.Util.mergeData(this.options, options);
		VCO.Util.mergeData(this.data, data);
		
		
		this._el.container = VCO.Dom.create("div", "vco-slidenav-" + this.options.direction);
		
		if (VCO.Browser.mobile) {
			this._el.container.setAttribute("ontouchstart"," ");
		}
		
		this._initLayout();
		this._initEvents();
		
		if (add_to_container) {
			add_to_container.appendChild(this._el.container);
		};
		
	},
	
	/*	Update Content
	================================================== */
	update: function(slide) {
		var d = {
			title: "",
			description: "",
			date: slide.getFormattedDate()
		};
		
		if (slide.data.text) {
			if (slide.data.text.headline) {
				d.title = slide.data.text.headline;
			}
		}

		this._update(d);
	},
	
	/*	Color
	================================================== */
	setColor: function(inverted) {
		if (inverted) {
			this._el.content_container.className = 'vco-slidenav-content-container vco-slidenav-inverted';
		} else {
			this._el.content_container.className = 'vco-slidenav-content-container';
		}
	},
	
	/*	Events
	================================================== */
	_onMouseClick: function() {
		this.fire("clicked", this.options);
	},
	
	/*	Private Methods
	================================================== */
	_update: function(d) {
		// update data
		this.data = VCO.Util.mergeData(this.data, d);
		
		// Title
		this._el.title.innerHTML = VCO.Util.unlinkify(this.data.title);
		
		// Date
		this._el.description.innerHTML	= VCO.Util.unlinkify(this.data.date);
	},
	
	_initLayout: function () {
		
		// Create Layout
		this._el.content_container			= VCO.Dom.create("div", "vco-slidenav-content-container", this._el.container);
		this._el.icon						= VCO.Dom.create("div", "vco-slidenav-icon", this._el.content_container);
		this._el.title						= VCO.Dom.create("div", "vco-slidenav-title", this._el.content_container);
		this._el.description				= VCO.Dom.create("div", "vco-slidenav-description", this._el.content_container);
		
		this._el.icon.innerHTML				= "&nbsp;"
		
		this._update();
	},
	
	_initEvents: function () {
		VCO.DomEvent.addListener(this._el.container, 'click', this._onMouseClick, this);
	}
	
	
});

/*	StorySlider
	is the central class of the API - it is used to create a StorySlider

	Events:
	nav_next
	nav_previous
	slideDisplayUpdate
	loaded
	slideAdded
	slideLoaded
	slideRemoved

	
================================================== */

VCO.StorySlider = VCO.Class.extend({
	
	includes: VCO.Events,
	
	/*	Private Methods
	================================================== */
	initialize: function (elem, data, options, init) {
		
		// DOM ELEMENTS
		this._el = {
			container: {},
			background: {},
			slider_container_mask: {},
			slider_container: {},
			slider_item_container: {}
		};
		
		this._nav = {};
		this._nav.previous = {};
		this._nav.next = {};
		
		// Slide Spacing
		this.slide_spacing = 0;
		
		// Slides Array
		this._slides = [];
		
		// Swipe Object
		this._swipable;
		
		// Preload Timer
		this.preloadTimer;
		
		// Message
		this._message;
		
		// Current Slide
		this.current_id = '';
		
		// Data Object
		this.data = {};
		
		this.options = {
			id: 					"",
			layout: 				"portrait",
			width: 					600,
			height: 				600,
			default_bg_color: 		{r:256, g:256, b:256},
			slide_padding_lr: 		40, 			// padding on slide of slide
			start_at_slide: 		1,
			slide_default_fade: 	"0%", 			// landscape fade
			// animation
			duration: 				1000,
			ease: 					VCO.Ease.easeInOutQuint,
			// interaction
			dragging: 				true,
			trackResize: 			true
		};
		
		// Main element ID
		if (typeof elem === 'object') {
			this._el.container = elem;
			this.options.id = VCO.Util.unique_ID(6, "vco");
		} else {
			this.options.id = elem;
			this._el.container = VCO.Dom.get(elem);
		}

		if (!this._el.container.id) {
			this._el.container.id = this.options.id;
		}
		
		// Animation Object
		this.animator = null;
		
		// Merge Data and Options
		VCO.Util.mergeData(this.options, options);
		VCO.Util.mergeData(this.data, data);
		
		if (init) {
			this.init();
		}
	},
	
	init: function() {
		this._initLayout();
		this._initEvents();
		this._initData();
		this._updateDisplay();
		
		// Go to initial slide
		this.goTo(this.options.start_at_slide);
		
		this._onLoaded();
	},
	
	/* Slides
	================================================== */	
	_addSlide:function(slide) {
		slide.addTo(this._el.slider_item_container);
		slide.on('added', this._onSlideAdded, this);
		slide.on('background_change', this._onBackgroundChange, this);
	},

	_createSlide: function(d, title_slide, n) {
		var slide = new VCO.Slide(d, this.options, title_slide);
		this._addSlide(slide);
		if(n < 0) { 
		    this._slides.push(slide);
		} else {
		    this._slides.splice(n, 0, slide);
		}
	},

	_createSlides: function(array) {
		for (var i = 0; i < array.length; i++) {
			if (array[i].uniqueid == "") {
				array[i].uniqueid = VCO.Util.unique_ID(6, "vco-slide");
			}
            this._createSlide(array[i], false, -1);
		}
	},
		
	_removeSlide: function(slide) {
		slide.removeFrom(this._el.slider_item_container);
		slide.off('added', this._onSlideRemoved, this);
		slide.off('background_change', this._onBackgroundChange);
	},

	_destroySlide: function(n) {
		this._removeSlide(this._slides[n]);
		this._slides.splice(n, 1);
	},
		
    _findSlideIndex: function(n) {
        var _n = n;
		if (typeof n == 'string' || n instanceof String) {
			_n = VCO.Util.findArrayNumberByUniqueID(n, this._slides, "uniqueid");
		}
		return _n;
    },

	/*	Public
	================================================== */
	updateDisplay: function(w, h, a, l) {
		this._updateDisplay(w, h, a, l);
	},
	
	// Create a slide
	createSlide: function(d, n) {
		this._createSlide(d, false, n);
	},
	
	// Create Many Slides from an array
	createSlides: function(array) {
		this._createSlides(array);
	},
	    
	// Destroy slide by index
	destroySlide: function(n) {
	    this._destroySlide(n);
	},
	
	// Destroy slide by id
	destroySlideId: function(id) {
	    this.destroySlide(this._findSlideIndex(id));
	},
		
	/*	Navigation
	================================================== */
	goTo: function(n, fast, displayupdate) {
		var self = this;
		
		this.changeBackground({color_value:"", image:false});
		
		// Clear Preloader Timer
		if (this.preloadTimer) {
			clearTimeout(this.preloadTimer);
		}
		
		// Set Slide Active State
		for (var i = 0; i < this._slides.length; i++) {
			this._slides[i].setActive(false);
		}
		
		if (n < this._slides.length && n >= 0) {			
			this.current_id = this._slides[n].data.uniqueid;

			// Stop animation
			if (this.animator) {
				this.animator.stop();
			}
			if (this._swipable) {
				this._swipable.stopMomentum();
			}
			
			if (fast) {
				this._el.slider_container.style.left = -(this.slide_spacing * n) + "px";
				this._onSlideChange(displayupdate);
			} else {
				this.animator = VCO.Animate(this._el.slider_container, {
					left: 		-(this.slide_spacing * n) + "px",
					duration: 	this.options.duration,
					easing: 	this.options.ease,
					complete: 	this._onSlideChange(displayupdate)
				});				
			}
			
			// Set Slide Active State
			this._slides[n].setActive(true);
			
			// Update Navigation and Info
			if (this._slides[n + 1]) {
				this.showNav(this._nav.next, true);
				this._nav.next.update(this._slides[n + 1]);
			} else {
				this.showNav(this._nav.next, false);
			}
			if (this._slides[n - 1]) {
				this.showNav(this._nav.previous, true);
				this._nav.previous.update(this._slides[n - 1]);
			} else {
				this.showNav(this._nav.previous, false);
			}
							
			// Preload Slides
			this.preloadTimer = setTimeout(function() {
				self.preloadSlides(n);
			}, this.options.duration);			
		}
	},

	goToId: function(id, fast, displayupdate) {
		this.goTo(this._findSlideIndex(id), fast, displayupdate);		
	},
		
	preloadSlides: function(n) {
		if (this._slides[n + 1]) {
			this._slides[n + 1].loadMedia();
			this._slides[n + 1].scrollToTop();
		}
		if (this._slides[n + 2]) {
			this._slides[n + 2].loadMedia();
			this._slides[n + 2].scrollToTop();
		}
		if (this._slides[n - 1]) {
			this._slides[n - 1].loadMedia();
			this._slides[n - 1].scrollToTop();
		}
		if (this._slides[n - 2]) {
			this._slides[n - 2].loadMedia();
			this._slides[n - 2].scrollToTop();
		}
	},
		
	next: function() {
	    var n = this._findSlideIndex(this.current_id);	    
		if ((n + 1) < (this._slides.length)) {
			this.goTo(n + 1);
		} else {
			this.goTo(n);
		}
	},
	
	previous: function() {
	    var n = this._findSlideIndex(this.current_id);
		if (n - 1 >= 0) {
			this.goTo(n - 1);
		} else {
			this.goTo(n);
		}
	},
	
	showNav: function(nav_obj, show) {
		
		if (this.options.width <= 500 && VCO.Browser.mobile) {
			
		} else {
			if (show) {
				nav_obj.show();
			} else {
				nav_obj.hide();
			}
			
		}
	},
	
	changeBackground: function(bg) {
		
		var bg_color = {r:256, g:256, b:256},
			bg_color_rgb,
			bg_percent_start 	= this.options.slide_default_fade,
			bg_percent_end 		= "15%",
			bg_alpha_end 		= "0.87",
			bg_css 				= "";
			
		if (bg.color_value) {
			bg_color		= VCO.Util.hexToRgb(bg.color_value);
		} else {
			bg_color = this.options.default_bg_color;
		}
		
		bg_color_rgb 	= bg_color.r + "," + bg_color.g + "," + bg_color.b;
		this._el.background.style.backgroundImage = "none";
		
		if (bg.color_value) {
			this._el.background.style.backgroundColor = bg.color_value;
		} else {
			this._el.background.style.backgroundColor = "transparent";
		}
		
		if (bg_color.r < 255 && bg_color.g < 255 && bg_color.b < 255 || bg.image) {
			this._nav.next.setColor(true);
			this._nav.previous.setColor(true);
		} else {
			this._nav.next.setColor(false);
			this._nav.previous.setColor(false);
		}
	},
	
	/*	Private Methods
	================================================== */
	
	// Update Display
	_updateDisplay: function(width, height, animate, layout) {
		var nav_pos, _layout;
		
		if(typeof layout === 'undefined'){
			_layout = this.options.layout;
		} else {
			_layout = layout;
		}
		
		this.options.layout = _layout;
		
		this.slide_spacing = this.options.width*2;
		
		if (width) {
			this.options.width = width;
		} else {
			this.options.width = this._el.container.offsetWidth;
		}
		
		if (height) {
			this.options.height = height;
		} else {
			this.options.height = this._el.container.offsetHeight;
		}
		
		//this._el.container.style.height = this.options.height;
		
		// position navigation
		nav_pos = (this.options.height/2);
		this._nav.next.setPosition({top:nav_pos});
		this._nav.previous.setPosition({top:nav_pos});
		
		
		// Position slides
		for (var i = 0; i < this._slides.length; i++) {
			this._slides[i].updateDisplay(this.options.width, this.options.height, _layout);
			this._slides[i].setPosition({left:(this.slide_spacing * i), top:0});
			
		};
		
		// Go to the current slide
		this.goToId(this.current_id, true, true);
	},
	
	// Reposition and redraw slides
    _updateDrawSlides: function() {
	    var _layout = this.options.layout;
   
		for (var i = 0; i < this._slides.length; i++) {
			this._slides[i].updateDisplay(this.options.width, this.options.height, _layout);
			this._slides[i].setPosition({left:(this.slide_spacing * i), top:0});			
		};
	
		this.goToId(this.current_id, true, false);	
	},
	
	
	/*	Init
	================================================== */
	_initLayout: function () {
		
		this._el.container.className += ' vco-storyslider';
		
		// Create Layout
		this._el.slider_container_mask		= VCO.Dom.create('div', 'vco-slider-container-mask', this._el.container);
		this._el.background 				= VCO.Dom.create('div', 'vco-slider-background vco-animate', this._el.container); 
		this._el.slider_container			= VCO.Dom.create('div', 'vco-slider-container vcoanimate', this._el.slider_container_mask);
		this._el.slider_item_container		= VCO.Dom.create('div', 'vco-slider-item-container', this._el.slider_container);
		
		
		// Update Size
		this.options.width = this._el.container.offsetWidth;
		this.options.height = this._el.container.offsetHeight;
		
		// Create Navigation
		this._nav.previous = new VCO.SlideNav({title: "Previous", description: "description"}, {direction:"previous"});
		this._nav.next = new VCO.SlideNav({title: "Next",description: "description"}, {direction:"next"});
		
		// add the navigation to the dom
		this._nav.next.addTo(this._el.container);
		this._nav.previous.addTo(this._el.container);
		
		
				
		this._el.slider_container.style.left="0px";
		
		if (VCO.Browser.touch) {
			//this._el.slider_touch_mask = VCO.Dom.create('div', 'vco-slider-touch-mask', this._el.slider_container_mask);
			this._swipable = new VCO.Swipable(this._el.slider_container_mask, this._el.slider_container, {
				enable: {x:true, y:false},
				snap: 	true
			});
			this._swipable.enable();
			
			// Message
			this._message = new VCO.Message({}, {
				message_class: 		"vco-message-full",
				message_icon_class: "vco-icon-swipe-left"
			});
			this._message.updateMessage("Swipe to Navigate<br><span class='vco-button'>OK</span>");
			this._message.addTo(this._el.container);
		}
		
	},
	
	_initEvents: function () {
		this._nav.next.on('clicked', this._onNavigation, this);
		this._nav.previous.on('clicked', this._onNavigation, this);
		
		if (this._message) {
			this._message.on('clicked', this._onMessageClick, this);
		}
		
		if (this._swipable) {
			this._swipable.on('swipe_left', this._onNavigation, this);
			this._swipable.on('swipe_right', this._onNavigation, this);
			this._swipable.on('swipe_nodirection', this._onSwipeNoDirection, this);
		}
		
		
	},
	
	_initData: function() {
	    if(this.data.title) {
	        this._createSlide(this.data.title, true, -1);
	    }
        this._createSlides(this.data.events);
	},
	
	/*	Events
	================================================== */
	_onBackgroundChange: function(e) {
	    var n = this._findSlideIndex(this.current_id);
		var slide_background = this._slides[n].getBackground();
		this.changeBackground(e);
		this.fire("colorchange", slide_background);
	},
	
	_onMessageClick: function(e) {
		this._message.hide();
	},
	
	_onSwipeNoDirection: function(e) {
		this.goToId(this.current_id);
	},
	
	_onNavigation: function(e) {
		
		if (e.direction == "next" || e.direction == "left") {
			this.next();
		} else if (e.direction == "previous" || e.direction == "right") {
			this.previous();
		} 
		this.fire("nav_" + e.direction, this.data);
	},
	
	_onSlideAdded: function(e) {
		trace("slideadded")
		this.fire("slideAdded", this.data);
	},
	
	_onSlideRemoved: function(e) {
		this.fire("slideRemoved", this.data);
	},
	
	_onSlideChange: function(displayupdate) {		
		if (!displayupdate) {
			this.fire("change", {uniqueid: this.current_id});
		}
	},
	
	_onMouseClick: function(e) {
		
	},
	
	_fireMouseEvent: function (e) {
		if (!this._loaded) {
			return;
		}

		var type = e.type;
		type = (type === 'mouseenter' ? 'mouseover' : (type === 'mouseleave' ? 'mouseout' : type));

		if (!this.hasEventListeners(type)) {
			return;
		}

		if (type === 'contextmenu') {
			VCO.DomEvent.preventDefault(e);
		}
		
		this.fire(type, {
			latlng: "something", //this.mouseEventToLatLng(e),
			layerPoint: "something else" //this.mouseEventToLayerPoint(e)
		});
	},
	
	_onLoaded: function() {
		this.fire("loaded", this.data);
	}
	
	
});

/*	VCO.TimeNav
	
================================================== */
  
VCO.TimeNav = VCO.Class.extend({
	
	includes: [VCO.Events, VCO.DomMixins],
	
	_el: {},
	
	/*	Constructor
	================================================== */
	initialize: function (elem, data, options, init) {
		// DOM ELEMENTS
		this._el = {
			parent: {},
			container: {},
			slider: {},
			slider_background: {},
			line: {},
			marker_container_mask: {},
			marker_container: {},
			marker_item_container: {},
			timeaxis: {},
			timeaxis_background: {}
		};
		
		this.collapsed = false;
		
		if (typeof elem === 'object') {
			this._el.container = elem;
		} else {
			this._el.container = VCO.Dom.get(elem);
		}
		
		// Data Object
		this.data = {};
		
		//Options
		this.options = {
			width: 					600,
			height: 				600,
			duration: 				1000,
			ease: 					VCO.Ease.easeInOutQuint,
			has_groups: 			false,
			optimal_tick_width: 	50,
			scale_factor: 			2, 				// How many screen widths wide should the timeline be
			marker_padding: 		5,
			timenav_height_min: 	150, 			// Minimum timenav height
			marker_height_min: 		30, 			// Minimum Marker Height
			marker_width_min: 		100, 			// Minimum Marker Width
			zoom_sequence:          [0.5, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89] // Array of Fibonacci numbers for TimeNav zoom levels http://www.maths.surrey.ac.uk/hosted-sites/R.Knott/Fibonacci/fibtable.html
		};
		
		// Animation
		this.animator = null;
		
		// Markers Array
		this._markers = [];
		
		// Groups Array
		this._groups = [];
		
		// Row Height
		this._calculated_row_height = 100;
		
		// Current Marker
		this.current_id = "";
		
		// TimeScale
		this.timescale = {};
		
		// TimeAxis
		this.timeaxis = {};
		this.axishelper = {};
		
		// Max Rows
		this.max_rows = 6;
		
		// Animate CSS
		this.animate_css = false;
		
		// Swipe Object
		this._swipable;
		
		// Merge Data and Options
		VCO.Util.mergeData(this.options, options);
		VCO.Util.mergeData(this.data, data);
			   
		if (init) {
			this.init();
		}
	},
	
	init: function() {
		this._initLayout();
		this._initEvents();
		this._initData();
		this._updateDisplay();
				
		this._onLoaded();
	},
	
	/*	Public
	================================================== */
	positionMarkers: function() {
		this._positionMarkers();
	},
	
	/*	Update Display
	================================================== */
	updateDisplay: function(w, h, a, l) {
		this._updateDisplay(w, h, a, l);
	},
	
	
	/*	TimeScale
	================================================== */
	_getTimeScale: function() { 
		/* maybe the establishing config values (marker_height_min and max_rows) should be
		separated from making a TimeScale object, which happens in another spot in this file with duplicate mapping of properties of this TimeNav into the TimeScale options object? */
		// Set Max Rows
		var marker_height_min = 0;
		try {
			marker_height_min = parseInt(this.options.marker_height_min);
		} catch(e) {
			trace("Invalid value for marker_height_min option."); 
			marker_height_min = 30;
		}
		if (marker_height_min == 0) {
			trace("marker_height_min option must not be zero.")
			marker_height_min = 30;
		}
		this.max_rows = Math.round((this.options.height - this._el.timeaxis_background.offsetHeight - (this.options.marker_padding)) / marker_height_min);
		if (this.max_rows < 1) {
			this.max_rows = 1;
		}
		return new VCO.TimeScale(this.data, {
            display_width: this._el.container.offsetWidth,
            screen_multiplier: this.options.scale_factor,
            max_rows: this.max_rows

		});
	},
	
	_updateTimeScale: function(new_scale) {
		this.options.scale_factor = new_scale;
		this._updateDrawTimeline();
	},
	
	zoomIn: function(n) {
		var new_scale = 1;
		for (var i = 0; i < this.options.zoom_sequence.length; i++) {
			
			if (this.options.scale_factor == this.options.zoom_sequence[i]) {
				if (this.options.scale_factor == this.options.zoom_sequence[this.options.zoom_sequence.length - 1]) {
					new_scale = this.options.scale_factor;
				} else {
					new_scale = this.options.zoom_sequence[i + 1];
				}
			}
		};

		this.options.scale_factor = new_scale;
		//this._updateDrawTimeline(true);
		this.goToId(this.current_id, !this._updateDrawTimeline(true), true);
	},
	
	zoomOut: function(n) {
		if (this.options.scale_factor > 0) {
			var new_scale = 1;
			for (var i = 0; i < this.options.zoom_sequence.length; i++) {
			
				if (this.options.scale_factor == this.options.zoom_sequence[i]) {
					if (this.options.scale_factor == this.options.zoom_sequence[0]) {
						new_scale = this.options.zoom_sequence[0];
					} else {
						new_scale = this.options.zoom_sequence[i -1];
					}
				}
			};
			
			this.options.scale_factor = new_scale;
			//this._updateDrawTimeline(true);
			this.goToId(this.current_id, !this._updateDrawTimeline(true), true);
		}
		
	},
	
	/*	Groups
	================================================== */
	_createGroups: function() {
		var group_labels = this.timescale.getGroupLabels();
		
		if (group_labels) {
			this.options.has_groups = true;
			for (var i = 0; i < group_labels.length; i++) {
				this._createGroup(group_labels[i]);
			}
		}
		
	},
	
	_createGroup: function(group_label) {
		var group = new VCO.TimeGroup(group_label);
		this._addGroup(group);
		this._groups.push(group);
	},
	
	_addGroup:function(group) {
		group.addTo(this._el.container);
		
	},
	
	_positionGroups: function() {
		if (this.options.has_groups) {
			var available_height 	= (this.options.height - this._el.timeaxis_background.offsetHeight ),
				group_height 		= Math.floor((available_height /this.timescale.getNumberOfRows()) - this.options.marker_padding),
				group_labels		= this.timescale.getGroupLabels();
			
			for (var i = 0, group_rows = 0; i < this._groups.length; i++) {
				var group_y = Math.floor(group_rows * (group_height + this.options.marker_padding));
				
				this._groups[i].setRowPosition(group_y, this._calculated_row_height + this.options.marker_padding/2); 
				this._groups[i].setAlternateRowColor(VCO.Util.isEven(i));
				
				group_rows += this._groups[i].data.rows;    // account for groups spanning multiple rows
			}
		}		
	},
	
	/*	Markers
	================================================== */
	_addMarker:function(marker) {
		marker.addTo(this._el.marker_item_container);
		marker.on('markerclick', this._onMarkerClick, this);
		marker.on('added', this._onMarkerAdded, this);
	},

	_createMarker: function(data, n) {
		var marker = new VCO.TimeMarker(data, this.options);
		this._addMarker(marker);
		if(n < 0) {
		    this._markers.push(marker);
		} else {
		    this._markers.splice(n, 0, marker);
		}
	},

	_createMarkers: function(array) { 
		for (var i = 0; i < array.length; i++) {
			this._createMarker(array[i], -1);
		}		
	},
	
	_removeMarker: function(marker) {
		marker.removeFrom(this._el.marker_item_container);
		//marker.off('added', this._onMarkerRemoved, this);
	},
	
	_destroyMarker: function(n) {
	    this._removeMarker(this._markers[n]);
	    this._markers.splice(n, 1);
	},
		
	_positionMarkers: function(fast) {
		// POSITION X
		for (var i = 0; i < this._markers.length; i++) {
			var pos = this.timescale.getPositionInfo(i);
			if (fast) {
				this._markers[i].setClass("vco-timemarker vco-timemarker-fast");
			} else {
				this._markers[i].setClass("vco-timemarker");
			}
			this._markers[i].setPosition({left:pos.start});
			this._markers[i].setWidth(pos.width);
		};
		
	},
	
	_assignRowsToMarkers: function() {
		var available_height 	= (this.options.height - this._el.timeaxis_background.offsetHeight - (this.options.marker_padding)),
			marker_height 		= Math.floor((available_height /this.timescale.getNumberOfRows()) - this.options.marker_padding);
			
		this._calculated_row_height = Math.floor(available_height /this.timescale.getNumberOfRows());
			
		for (var i = 0; i < this._markers.length; i++) {
			
			// Set Height
			this._markers[i].setHeight(marker_height);
			
			//Position by Row
			var row = this.timescale.getPositionInfo(i).row;
			
			var marker_y = Math.floor(row * (marker_height + this.options.marker_padding)) + this.options.marker_padding;
			
			var remainder_height = available_height - marker_y + this.options.marker_padding;
			this._markers[i].setRowPosition(marker_y, remainder_height);
		};
		
	},
	
	_resetMarkersActive: function() {
		for (var i = 0; i < this._markers.length; i++) {
			this._markers[i].setActive(false);
		};
	},
	
	_findMarkerIndex: function(n) {	
	    var _n = -1;
		if (typeof n == 'string' || n instanceof String) {
			_n = VCO.Util.findArrayNumberByUniqueID(n, this._markers, "uniqueid", _n);
		} 
		return _n;
	},

	/*	Public
	================================================== */
	
	// Create a marker
	createMarker: function(d, n) {
	    this._createMarker(d, n);
	},
	
	// Create many markers from an array
	createMarkers: function(array) {
	    this._createMarkers(array);
	},
	
	// Destroy marker by index
	destroyMarker: function(n) {
	    this._destroyMarker(n);
	},
	
	// Destroy marker by id
	destroyMarkerId: function(id) {
	    this.destroyMarker(this._findMarkerIndex(id));
	},
	
	/*	Navigation
	================================================== */	
	goTo: function(n, fast, css_animation) {		
		var self = 	this,
			_ease = this.options.ease,
			_duration = this.options.duration,
			_n = (n < 0) ? 0 : n; 
		
		// Set Marker active state
		this._resetMarkersActive();
		if(n >= 0 && n < this._markers.length) {
		    this._markers[n].setActive(true);
		}
		// Stop animation
		if (this.animator) {
			this.animator.stop();
		}
		
		if (fast) {
			this._el.slider.className = "vco-timenav-slider";
			this._el.slider.style.left = -this._markers[_n].getLeft() + (this.options.width/2) + "px";
		} else {
			if (css_animation) {
				this._el.slider.className = "vco-timenav-slider vco-timenav-slider-animate";
				this.animate_css = true;
				this._el.slider.style.left = -this._markers[_n].getLeft() + (this.options.width/2) + "px";
			} else {
				this._el.slider.className = "vco-timenav-slider";
				this.animator = VCO.Animate(this._el.slider, {
					left: 		-this._markers[_n].getLeft() + (this.options.width/2) + "px",
					duration: 	_duration,
					easing: 	_ease
				});
			}
		}
		
		if(n >= 0 && n < this._markers.length) {
		    this.current_id = this._markers[n].data.uniqueid;
		} else {
		    this.current_id = '';
		}
	},

	goToId: function(id, fast, css_animation) {
		this.goTo(this._findMarkerIndex(id), fast, css_animation);		
	},
		
	/*	Events
	================================================== */
	_onLoaded: function() {
		this.fire("loaded", this.data);
	},
	
	_onMarkerAdded: function(e) {
		this.fire("dateAdded", this.data);
	},
	
	_onMarkerRemoved: function(e) {
		this.fire("dateRemoved", this.data);
	},
	
	_onMarkerClick: function(e) {
		// Go to the clicked marker
		this.goToId(e.uniqueid);
		this.fire("change", {uniqueid: e.uniqueid});
	},
	
	_onMouseScroll: function(e) {
		
		var delta		= 0,
			scroll_to	= 0,
			constraint 	= {
				right: 	-(this.timescale.getPixelWidth() - (this.options.width/2)),
				left: 	this.options.width/2
			};
		if (!e) {
			e = window.event;
		}
		if (e.originalEvent) {
			e = e.originalEvent;
		}
		
		// Webkit and browsers able to differntiate between up/down and left/right scrolling
		if (typeof e.wheelDeltaX != 'undefined' ) {
			delta = e.wheelDeltaY/6;
			if (Math.abs(e.wheelDeltaX) > Math.abs(e.wheelDeltaY)) {
				delta = e.wheelDeltaX/6;
			} else {
				//delta = e.wheelDeltaY/6;
				delta = 0;
			}
		}
		if (delta) {
			if (e.preventDefault) {
				 e.preventDefault();
			}
			e.returnValue = false;
		}
		// Stop from scrolling too far
		scroll_to = parseInt(this._el.slider.style.left.replace("px", "")) + delta;
		
		
		if (scroll_to > constraint.left) {
			scroll_to = constraint.left;
		} else if (scroll_to < constraint.right) {
			scroll_to = constraint.right;
		}
		
		if (this.animate_css) {
			this._el.slider.className = "vco-timenav-slider";
			this.animate_css = false;
		}
		
		this._el.slider.style.left = scroll_to + "px";
		
	},
	
	_onDragMove: function(e) {
		if (this.animate_css) {
			this._el.slider.className = "vco-timenav-slider";
			this.animate_css = false;
		}
		
	},
	
	/*	Private Methods
	================================================== */
	// Update Display
	_updateDisplay: function(width, height, animate) {
		
		if (width) {
			this.options.width = width;
		}
		if (height && height != this.options.height) {
			this.options.height = height;
			this.timescale = this._getTimeScale();
		}
		
		// Size Markers
		this._assignRowsToMarkers();
		
		// Size swipable area
		this._el.slider_background.style.width = this.timescale.getPixelWidth() + this.options.width + "px";
		this._el.slider_background.style.left = -(this.options.width/2) + "px";
		this._el.slider.style.width = this.timescale.getPixelWidth() + this.options.width + "px";
		
		// Update Swipable constraint
		this._swipable.updateConstraint({top: false,bottom: false,left: (this.options.width/2),right: -(this.timescale.getPixelWidth() - (this.options.width/2))});
		
		// Go to the current slide
		this.goToId(this.current_id, true);
	},
	
	_drawTimeline: function(fast) {
		this.timescale = this._getTimeScale();
		this.timeaxis.drawTicks(this.timescale, this.options.optimal_tick_width);
		this._positionMarkers(fast);
		this._assignRowsToMarkers();
		this._createGroups();
		this._positionGroups();
	},
	
	_updateDrawTimeline: function(check_update) {
		var do_update = false;
		
		// Check to see if redraw is needed
		if (check_update) {
			/* keep this aligned with _getTimeScale or reduce code duplication */
			var temp_timescale = new VCO.TimeScale(this.data, {
	            display_width: this._el.container.offsetWidth,
	            screen_multiplier: this.options.scale_factor,
	            max_rows: this.max_rows

			});

			if (this.timescale.getMajorScale() == temp_timescale.getMajorScale() 
			 && this.timescale.getMinorScale() == temp_timescale.getMinorScale()) {
				do_update = true;
			}
		} else {
			do_update = true;
		}
		
		// Perform update or redraw
		if (do_update) {
			this.timescale = this._getTimeScale();
			this.timeaxis.positionTicks(this.timescale, this.options.optimal_tick_width);
			this._positionMarkers();
			this._assignRowsToMarkers();
			this._positionGroups();
			this._updateDisplay();
		} else {
			this._drawTimeline(true);
		}
		
		return do_update;
		
	},
	
	
	/*	Init
	================================================== */
	_initLayout: function () {
		// Create Layout
		this._el.line						= VCO.Dom.create('div', 'vco-timenav-line', this._el.container);
		this._el.slider						= VCO.Dom.create('div', 'vco-timenav-slider', this._el.container);
		this._el.slider_background			= VCO.Dom.create('div', 'vco-timenav-slider-background', this._el.slider);
		this._el.marker_container_mask		= VCO.Dom.create('div', 'vco-timenav-container-mask', this._el.slider);
		this._el.marker_container			= VCO.Dom.create('div', 'vco-timenav-container', this._el.marker_container_mask);
		this._el.marker_item_container		= VCO.Dom.create('div', 'vco-timenav-item-container', this._el.marker_container);
		this._el.timeaxis 					= VCO.Dom.create('div', 'vco-timeaxis', this._el.slider);
		this._el.timeaxis_background 		= VCO.Dom.create('div', 'vco-timeaxis-background', this._el.container);
		
		// Time Axis
		this.timeaxis = new VCO.TimeAxis(this._el.timeaxis, this.options);
		
		// Swipable
		this._swipable = new VCO.Swipable(this._el.slider_background, this._el.slider, {
			enable: {x:true, y:false},
			constraint: {top: false,bottom: false,left: (this.options.width/2),right: false},
			snap: 	false
		});
		this._swipable.enable();
		
	},
	
	_initEvents: function () {
		// Drag Events
		this._swipable.on('dragmove', this._onDragMove, this);
		
		// Scroll Events
		VCO.DomEvent.addListener(this._el.container, 'mousewheel', this._onMouseScroll, this);
		VCO.DomEvent.addListener(this._el.container, 'DOMMouseScroll', this._onMouseScroll, this);
	},
	
	_initData: function() {
		// Create Markers and then add them
		this._createMarkers(this.data.events);
		this._drawTimeline();
		
	}
	
	
});

/*	VCO.TimeMarker
	
================================================== */

VCO.TimeMarker = VCO.Class.extend({
	
	includes: [VCO.Events, VCO.DomMixins],
	
	_el: {},
	
	/*	Constructor
	================================================== */
	initialize: function(data, options) {
		
		// DOM Elements
		this._el = {
			container: {},
			content_container: {},
			media_container: {},
			timespan: {},
			line_left: {},
			line_right: {},
			content: {},
			text: {},
			media: {},
		};
	
		// Components
		this._text			= {};
	
		// State
		this._state = {
			loaded: 		false
		};
		
		
		// Data
		this.data = {
			uniqueid: 			"",
			background: 		null,
			date: {
				year:			0,
				month:			0,
				day: 			0,
				hour: 			0,
				minute: 		0,
				second: 		0,
				millisecond: 	0,
				thumbnail: 		"",
				format: 		""
			},
			text: {
				headline: 		"",
				text: 			""
			},
			media: 				null
		};
	
		// Options
		this.options = {
			duration: 			1000,
			ease: 				VCO.Ease.easeInSpline,
			width: 				600,
			height: 			600,
			marker_width_min: 	100 			// Minimum Marker Width
		};
		
		// Actively Displaying
		this.active = false;
		
		// Animation Object
		this.animator = {};
		
		// End date
		this.has_end_date = false;
		
		// Merge Data and Options
		VCO.Util.mergeData(this.options, options);
		VCO.Util.mergeData(this.data, data);
		
		this._initLayout();
		this._initEvents();
		
		
	},
	
	/*	Adding, Hiding, Showing etc
	================================================== */
	show: function() {

	},
	
	hide: function() {
		
	},
	
	setActive: function(is_active) {
		this.active = is_active;
		
		if (this.active && this.has_end_date) {
			this._el.container.className = 'vco-timemarker vco-timemarker-with-end vco-timemarker-active';
		} else if (this.active){
			this._el.container.className = 'vco-timemarker vco-timemarker-active';
		} else if (this.has_end_date){
			this._el.container.className = 'vco-timemarker vco-timemarker-with-end';
		} else {
			this._el.container.className = 'vco-timemarker';
		}
	},
	
	addTo: function(container) {
		container.appendChild(this._el.container);
	},
	
	removeFrom: function(container) {
		container.removeChild(this._el.container);
	},
	
	updateDisplay: function(w, h) {
		this._updateDisplay(w, h);
	},
	
	loadMedia: function() {
		
		if (this._media && !this._state.loaded) {
			this._media.loadMedia();
			this._state.loaded = true;
		}
	},
	
	stopMedia: function() {
		if (this._media && this._state.loaded) {
			this._media.stopMedia();
		}
	},
	
	getLeft: function() {
		return this._el.container.style.left.slice(0, -2);
	},
	
	getTime: function() { // TODO does this need to know about the end date?
		return this.data.start_date.getTime();
	},
	
	getEndTime: function() {
		
		if (this.data.end_date) {
			return this.data.end_date.getTime();
		} else {
			return false;
		}
	},
	
	setHeight: function(h) {
		var text_line_height = 12,
			text_lines = 1;
			
		this._el.content_container.style.height = h  + "px";
		this._el.timespan_content.style.height = h + "px";
		// Handle Line height for better display of text
		if (h <= 30) {
			this._el.content.className = "vco-timemarker-content vco-timemarker-content-small";
		} else {
			this._el.content.className = "vco-timemarker-content";
		}
		
		// Handle number of lines visible vertically
		
		if (VCO.Browser.webkit) {
			text_lines = Math.floor(h / (text_line_height + 2));
			if (text_lines < 1) {
				text_lines = 1;
			}
			this._text.className = "vco-headline";
			this._text.style.webkitLineClamp = text_lines;
		} else {
			text_lines = h / text_line_height;
			if (text_lines > 1) {
				this._text.className = "vco-headline vco-headline-fadeout";
			} else {
				this._text.className = "vco-headline";
			}
			this._text.style.height = (text_lines * text_line_height)  + "px";
		}
		
	},
	
	setWidth: function(w) {
		if (this.data.end_date) {
			this._el.container.style.width = w + "px";
			
			if (w > this.options.marker_width_min) {
				this._el.content_container.style.width = w + "px";
			} else {
				this._el.content_container.style.width = this.options.marker_width_min + "px";
			}
		}
		
	},
	
	setClass: function(n) {
		this._el.container.className = n;
	},
	
	setRowPosition: function(n, remainder) {
		this.setPosition({top:n});
		this._el.timespan.style.height = remainder + "px";
		
	},
	
	/*	Events
	================================================== */
	_onMarkerClick: function(e) {
		this.fire("markerclick", {uniqueid:this.data.uniqueid});
	},
	
	/*	Private Methods
	================================================== */
	_initLayout: function () {
		//trace(this.data)
		// Create Layout
		this._el.container 				= VCO.Dom.create("div", "vco-timemarker");
		if (this.data.uniqueid) {
			this._el.container.id 		= this.data.uniqueid + "-marker";
		}
		
		if (this.data.end_date) {
			this.has_end_date = true;
			this._el.container.className = 'vco-timemarker vco-timemarker-with-end';
		}
		
		this._el.timespan				= VCO.Dom.create("div", "vco-timemarker-timespan", this._el.container);
		this._el.timespan_content		= VCO.Dom.create("div", "vco-timemarker-timespan-content", this._el.timespan);
		this._el.content_container		= VCO.Dom.create("div", "vco-timemarker-content-container", this._el.container);
		
		this._el.content				= VCO.Dom.create("div", "vco-timemarker-content", this._el.content_container);
		
		this._el.line_left				= VCO.Dom.create("div", "vco-timemarker-line-left", this._el.timespan);
		this._el.line_right				= VCO.Dom.create("div", "vco-timemarker-line-right", this._el.timespan);
		
		// Thumbnail or Icon
		if (this.data.media) {
			this._el.media_container	= VCO.Dom.create("div", "vco-timemarker-media-container", this._el.content);
			
			if (this.data.media.thumb && this.data.media.thumb != "") {
				this._el.media				= VCO.Dom.create("img", "vco-timemarker-media", this._el.media_container);
				this._el.media.src			= this.data.media.thumb;
				
			} else {
				var media_type = VCO.MediaType(this.data.media).type;
				this._el.media				= VCO.Dom.create("span", "vco-icon-" + media_type, this._el.media_container);
				
			}
			
		}
		
		
		// Text
		this._el.text					= VCO.Dom.create("div", "vco-timemarker-text", this._el.content);
		this._text						= VCO.Dom.create("h2", "vco-headline", this._el.text);
		if (this.data.text.headline && this.data.text.headline != "") {
			this._text.innerHTML		= VCO.Util.unlinkify(this.data.text.headline);
		} else if (this.data.text.text && this.data.text.text != "") {
			this._text.innerHTML		= VCO.Util.unlinkify(this.data.text.text);
		} else if (this.data.media.caption && this.data.media.caption != "") {
			this._text.innerHTML		= VCO.Util.unlinkify(this.data.media.caption);
		}

		
		
		// Fire event that the slide is loaded
		this.onLoaded();
		
	},
	
	_initEvents: function() {
		VCO.DomEvent.addListener(this._el.container, 'click', this._onMarkerClick, this);
	},
	
	// Update Display
	_updateDisplay: function(width, height, layout) {
		
		if (width) {
			this.options.width 					= width;
		} 

		if (height) {
			this.options.height = height;
		}
		
	}
	
});


/*	VCO.TimeGroup
	
================================================== */
 
VCO.TimeGroup = VCO.Class.extend({
	
	includes: [VCO.Events, VCO.DomMixins],
	
	_el: {},
	
	/*	Constructor
	================================================== */
	initialize: function(data) {
		
		// DOM ELEMENTS
		this._el = {
			parent: {},
			container: {},
			message: {}
		};
		
		//Options
		this.options = {
			width: 					600,
			height: 				600
		};
		
		// Data
		this.data = {
			label: "",
			rows: 1
		};
		
		
		this._el.container = VCO.Dom.create("div", "vco-timegroup"); 
		
		// Merge Data
		VCO.Util.mergeData(this.data, data);
		
		// Animation
		this.animator = {};
		
		
		this._initLayout();
		this._initEvents();
	},
	
	/*	Public
	================================================== */
	
	
	
	/*	Update Display
	================================================== */
	updateDisplay: function(w, h) {
		
	},
	
	setRowPosition: function(n, h) {
		this.options.height = h * this.data.rows;
		this.setPosition({top:n});
		this._el.container.style.height = this.options.height + "px";
		
	},
	
	setAlternateRowColor: function(alternate) {
		if (alternate) {
			this._el.container.className = "vco-timegroup vco-timegroup-alternate";
		} else {
			this._el.container.className = "vco-timegroup";
		}
	},
	
	/*	Events
	================================================== */

	
	_onMouseClick: function() {
		this.fire("clicked", this.options);
	},

	
	/*	Private Methods
	================================================== */
	_initLayout: function () {
		
		// Create Layout
		this._el.message = VCO.Dom.create("div", "vco-timegroup-message", this._el.container);
		this._el.message.innerHTML = this.data.label;
		
		
	},
	
	_initEvents: function () {
		VCO.DomEvent.addListener(this._el.container, 'click', this._onMouseClick, this);
	},
	
	// Update Display
	_updateDisplay: function(width, height, animate) {
		
	}
	
});

/*  VCO.TimeScale
    Strategies for laying out the timenav
    make a new one if the slides change

    TODOS: deal with clustering 
================================================== */
VCO.TimeScale = VCO.Class.extend({
    
    initialize: function (timeline_config, options) {
        timeline_config = VCO.Util.extend({ // establish defaults
            scale: 'javascript'
        }, timeline_config);

        var slides = timeline_config.events;
        this._scale = timeline_config.scale;

        options = VCO.Util.extend({ // establish defaults
            display_width: 500,
            screen_multiplier: 3,
            max_rows: null
        }, options);

        this._display_width = options.display_width;
        this._screen_multiplier = options.screen_multiplier;
        this._pixel_width = this._screen_multiplier * this._display_width;

        this._group_labels = undefined;
        this._positions = [];
        this._pixels_per_milli = 0;
        
        this._earliest = slides[0].start_date.getTime();
        // TODO: should _latest be the end date if there is one?
        this._latest = slides[slides.length - 1].start_date.getTime();
        this._span_in_millis = this._latest - this._earliest;
        this._average = (this._span_in_millis)/slides.length;

        this._pixels_per_milli = this.getPixelWidth() / this._span_in_millis;

        this._axis_helper = VCO.AxisHelper.getBestHelper(this);

        this._scaled_padding = (1/this.getPixelsPerTick()) * (this._display_width/2)
        this._computePositionInfo(slides, options.max_rows);
    },
    
    getGroupLabels: function() { /* 
        return an array of objects, one per group, in the order (top to bottom) that the groups are expected to appear. Each object will have two properties:
            * label (the string as specified in one or more 'group' properties of events in the configuration)
            * rows (the number of rows occupied by events associated with the label. ) 
        */
        return (this._group_labels || []);
    },
    
    getScale: function() {
        return this._scale;
    },
    
    getNumberOfRows: function() {
        return this._number_of_rows
    },

    getPixelWidth: function() {
        return this._pixel_width;
    },

    getPosition: function(time_in_millis) {
        // be careful using millis, as they won't scale to cosmological time.
        // however, we're moving to make the arg to this whatever value 
        // comes from VCO.Date.getTime() which could be made smart about that -- 
        // so it may just be about the naming.
        return ( time_in_millis - this._earliest ) * this._pixels_per_milli
    },

    getPositionInfo: function(idx) {
        return this._positions[idx];
    },

    getPixelsPerTick: function() {
        return this._axis_helper.getPixelsPerTick(this._pixels_per_milli);
    },

    getTicks: function() {
        return { 
            major: this._axis_helper.getMajorTicks(this), 
            minor: this._axis_helper.getMinorTicks(this) }
    },

    getDateFromTime: function(t) {
        if(this._scale == 'javascript') {
            return new VCO.Date(t);
        } else if(this._scale == 'cosmological') {
            return new VCO.BigDate(new VCO.BigYear(t));
        }  
        
        throw("Don't know how to get date from time for "+this._scale);
    },
    
    getMajorScale: function() {
        return this._axis_helper.major.name;
    },
    
    getMinorScale: function() {
        return this._axis_helper.minor.name;
    },

    _assessGroups: function(slides) {
        var groups = [];
        var empty_group = false;
        for (var i = 0; i < slides.length; i++) {
            if(slides[i].group) {
                if(groups.indexOf(slides[i].group) < 0) {
                    groups.push(slides[i].group);
                } else {
                    empty_group = true;
                }            
            } 
        };
        if (groups.length && empty_group) {
            groups.push('');
        }
        return groups;
    },

    /*  Compute the marker row positions, minimizing the number of
        overlaps.
        
        @positions = list of objects from this._positions
        @rows_left = number of rows available (assume > 0)
    */
    _computeRowInfo: function(positions, rows_left) {
        var lasts_in_row = [];
        var n_overlaps = 0;
        
        for (var i = 0; i < positions.length; i++) {
            var pos_info = positions[i];      
            var overlaps = [];
                       
            // See if we can add item to an existing row without 
            // overlapping the previous item in that row      
            delete pos_info.row;
             
            for (var j = 0; j < lasts_in_row.length; j++) {
                overlaps.push(lasts_in_row[j].end - pos_info.start);
                if(overlaps[j] <= 0) {
                    pos_info.row = j;
                    lasts_in_row[j] = pos_info;
                    break;
                }                        
            }
            
            // If we couldn't add to an existing row without overlap...
            if (typeof(pos_info.row) == 'undefined') {    
                if (rows_left === null) {
                    // Make a new row
                    pos_info.row = lasts_in_row.length;
                    lasts_in_row.push(pos_info);                  
                } else if (rows_left > 0) {
                    // Make a new row
                    pos_info.row = lasts_in_row.length;
                    lasts_in_row.push(pos_info);  
                    rows_left--;
                } else {
                    // Add to existing row with minimum overlap.
                    var min_overlap = Math.min.apply(null, overlaps);
                    var idx = overlaps.indexOf(min_overlap);                   
                    pos_info.row = idx;
                    if (pos_info.end > lasts_in_row[idx].end) {
                        lasts_in_row[idx] = pos_info;                                          
                    }
                    n_overlaps++;
                }                        
            }   
        }   
        
        return {n_rows: lasts_in_row.length, n_overlaps: n_overlaps};
    },   

    /*  Compute marker positions.  If using groups, this._number_of_rows
        will never be less than the number of groups.
        
        @max_rows = total number of available rows
        @default_marker_width should be in pixels
    */
    _computePositionInfo: function(slides, max_rows, default_marker_width) {
        default_marker_width = default_marker_width || 100;
        
        var groups = [];
        var empty_group = false;

        // Set start/end/width; enumerate groups
        for (var i = 0; i < slides.length; i++) {
            var pos_info = {
                start: this.getPosition(slides[i].start_date.getTime()) 
            };
            this._positions.push(pos_info);
            
            if (typeof(slides[i].end_date) != 'undefined') {
                var end_pos = this.getPosition(slides[i].end_date.getTime());
                pos_info.width = end_pos - pos_info.start;
                if (pos_info.width > default_marker_width) {
                    pos_info.end = pos_info.start + pos_info.width; 
                } else {
                    pos_info.end = pos_info.start + default_marker_width; 
                }
            } else {
                pos_info.width = default_marker_width;
                pos_info.end = pos_info.start + default_marker_width;
            }
            
            if(slides[i].group) {
                if(groups.indexOf(slides[i].group) < 0) {
                    groups.push(slides[i].group);
                }            
            } else {
                empty_group = true;
            }
        }

        if(groups.length) {                       
            if(empty_group) {
                groups.push("");
            }

            // Init group info
            var group_info = [];            
            
            for(var i = 0; i < groups.length; i++) {
                group_info[i] = {
                    label: groups[i],
                    idx: i,
                    positions: [], 
                    n_rows: 1,      // default
                    n_overlaps: 0
                };
            }       
                             
            for(var i = 0; i < this._positions.length; i++) {
                var pos_info = this._positions[i];
                                
                pos_info.group = groups.indexOf(slides[i].group || "");
                pos_info.row = 0;
                
                var gi = group_info[pos_info.group];
                for(var j = gi.positions.length - 1; j >= 0; j--) {
                    if(gi.positions[j].end > pos_info.start) {
                        gi.n_overlaps++;
                    }                   
                }   
                
                gi.positions.push(pos_info);                
            }
            
            var n_rows = groups.length; // start with 1 row per group
          
            while(true) {
                // Count free rows available              
                var rows_left = Math.max(0, max_rows - n_rows);                
                if(!rows_left) {
                    break;  // no free rows, nothing to do
                }

                // Sort by # overlaps, idx
               group_info.sort(function(a, b) {
                    if(a.n_overlaps > b.n_overlaps) {
                        return -1;
                    } else if(a.n_overlaps < b.n_overlaps) {
                        return 1;
                    } 
                    return a.idx - b.idx;
                });               
                if(!group_info[0].n_overlaps) {
                    break; // no overlaps, nothing to do
                }
                                                
                // Distribute free rows among groups with overlaps
                var n_rows = 0;
                for(var i = 0; i < group_info.length; i++) {
                    var gi = group_info[i];
                    
                    if(gi.n_overlaps && rows_left) {
                        var res = this._computeRowInfo(gi.positions,  gi.n_rows + 1);
                        gi.n_rows = res.n_rows;     // update group info
                        gi.n_overlaps = res.n_overlaps; 
                        rows_left--;                // update rows left
                    } 
                    
                    n_rows += gi.n_rows;            // update rows used          
                }
            } 
                        
            // Set number of rows
            this._number_of_rows = n_rows;
                                
            // Set group labels; offset row positions
            this._group_labels = [];
            
            group_info.sort(function(a, b) {return a.idx - b.idx; });               
            
            for(var i = 0, row_offset = 0; i < group_info.length; i++) {
                this._group_labels.push({
                    label: group_info[i].label,
                    rows: group_info[i].n_rows
                });   
                 
                for(var j = 0; j < group_info[i].positions.length; j++) {
                    var pos_info = group_info[i].positions[j];
                    pos_info.row += row_offset;
                }
                
                row_offset += group_info[i].n_rows;       
            }
        } else {
            var result = this._computeRowInfo(this._positions, max_rows);  
            this._number_of_rows = result.n_rows;    
        }  
        
    }
});


/*	VCO.TimeAxis
	Display element for showing timescale ticks
================================================== */

VCO.TimeAxis = VCO.Class.extend({
	
	includes: [VCO.Events, VCO.DomMixins, VCO.I18NMixins],
	
	_el: {},
	
	/*	Constructor
	================================================== */
	initialize: function(elem, options) {
		// DOM Elements
		this._el = {
			container: {},
			content_container: {},
			major: {},
			minor: {},
		};
	
		// Components
		this._text			= {};
	
		// State
		this._state = {
			loaded: 		false
		};
		
		
		// Data
		this.data = {};
	
		// Options
		this.options = {
			duration: 				1000,
			ease: 					VCO.Ease.easeInSpline,
			width: 					600,
			height: 				600
		};
		
		// Actively Displaying
		this.active = false;
		
		// Animation Object
		this.animator = {};
		
		// Axis Helper
		this.axis_helper = {};
		
		// Minor tick dom element array
		this.minor_ticks = [];
		
		// Minor tick dom element array
		this.major_ticks = [];
		
		// Date Format Lookup, map VCO.Date.SCALES names to...
		this.dateformat_lookup = {
	        millisecond: 1,     // ...VCO.Language.<code>.dateformats
	        second: 'time_short',
	        minute: 'time_no_seconds_short',
	        hour: 'time_no_minutes_short',
	        day: 'full_short',
	        month: 'month_short',
	        year: 'year',
	        decade: 'year',
	        century: 'year',
	        millennium: 'year', 
	        age: 'compact',  // ...VCO.Language.<code>.bigdateformats
	        epoch: 'compact',
	        era: 'compact',
	        eon: 'compact',
	        eon2: 'compact'
	    }
		
		// Main element
		if (typeof elem === 'object') {
			this._el.container = elem;
		} else {
			this._el.container = VCO.Dom.get(elem);
		}
		
		// Merge Data and Options
		VCO.Util.mergeData(this.options, options);
		
		this._initLayout();
		this._initEvents();
		
	},
	
	/*	Adding, Hiding, Showing etc
	================================================== */
	show: function() {

	},
	
	hide: function() {
		
	},
	
	addTo: function(container) {
		container.appendChild(this._el.container);
	},
	
	removeFrom: function(container) {
		container.removeChild(this._el.container);
	},
	
	updateDisplay: function(w, h) {
		this._updateDisplay(w, h);
	},
	
	getLeft: function() {
		return this._el.container.style.left.slice(0, -2);
	},
	
	drawTicks: function(timescale, optimal_tick_width) {

		var ticks = timescale.getTicks();

		var controls = {
			minor: {
				el: this._el.minor,
				dateformat: this.dateformat_lookup[ticks['minor'].name],
				ts_ticks: ticks['minor'].ticks,
				tick_elements: this.minor_ticks
			},
			major: {
				el: this._el.major,
				dateformat: this.dateformat_lookup[ticks['major'].name],
				ts_ticks: ticks['major'].ticks,
				tick_elements: this.major_ticks
			}
		}
		// FADE OUT
		this._el.major.className = "vco-timeaxis-major";
		this._el.minor.className = "vco-timeaxis-minor";
		this._el.major.style.opacity = 0;
		this._el.minor.style.opacity = 0;
		
		// CREATE MAJOR TICKS
		this.major_ticks = this._createTickElements(
			ticks['major'].ticks, 
			this._el.major, 
			this.dateformat_lookup[ticks['major'].name]
		);
		
		// CREATE MINOR TICKS
		this.minor_ticks = this._createTickElements(
			ticks['minor'].ticks, 
			this._el.minor, 
			this.dateformat_lookup[ticks['minor'].name],
			ticks['major'].ticks
		);
		
		this.positionTicks(timescale, optimal_tick_width, true);
		
		// FADE IN
		this._el.major.className = "vco-timeaxis-major vco-animate-opacity vco-timeaxis-animate-opacity";
		this._el.minor.className = "vco-timeaxis-minor vco-animate-opacity vco-timeaxis-animate-opacity";
		this._el.major.style.opacity = 1;
		this._el.minor.style.opacity = 1;
	},
	
	_createTickElements: function(ts_ticks,tick_element,dateformat,ticks_to_skip) {
		tick_element.innerHTML = "";
		var skip_times = {}
		if (ticks_to_skip){
			for (idx in ticks_to_skip) {
				skip_times[ticks_to_skip[idx].getTime()] = true;
			}
		}

		var tick_elements = []
		for (var i = 0; i < ts_ticks.length; i++) {
			var ts_tick = ts_ticks[i];
			if (!(ts_tick.getTime() in skip_times)) {
				var tick = VCO.Dom.create("div", "vco-timeaxis-tick", tick_element),
					tick_text 	= VCO.Dom.create("span", "vco-timeaxis-tick-text vco-animate-opacity", tick);
				
				tick_text.innerHTML = ts_tick.getDisplayDate(this.getLanguage(), dateformat);
				
				tick_elements.push({
					tick:tick,
					tick_text:tick_text,
					display_text:ts_tick.getDisplayDate(this.getLanguage(), dateformat),
					date:ts_tick
				});
			}
		}
		return tick_elements;
	},

	positionTicks: function(timescale, optimal_tick_width, no_animate) {
		
		// Handle Animation
		if (no_animate) {
			this._el.major.className = "vco-timeaxis-major";
			this._el.minor.className = "vco-timeaxis-minor";
		} else {
			this._el.major.className = "vco-timeaxis-major vco-timeaxis-animate";
			this._el.minor.className = "vco-timeaxis-minor vco-timeaxis-animate";
		}
		
		this._positionTickArray(this.major_ticks, timescale, optimal_tick_width);
		this._positionTickArray(this.minor_ticks, timescale, optimal_tick_width);
		
	},
	
	_positionTickArray: function(tick_array, timescale, optimal_tick_width) {
		// Poition Ticks & Handle density of ticks
		if (tick_array[1] && tick_array[0]) {
			var distance = ( timescale.getPosition(tick_array[1].date.getMillisecond()) - timescale.getPosition(tick_array[0].date.getMillisecond()) ),
				fraction_of_array = 1;
				
				
			if (distance < optimal_tick_width) {
				fraction_of_array = Math.round(optimal_tick_width/timescale.getPixelsPerTick());
			}
			
			var show = 1;
			
			for (var i = 0; i < tick_array.length; i++) {
				
				var tick = tick_array[i];
				
				// Poition Ticks
				tick.tick.style.left = timescale.getPosition(tick.date.getMillisecond()) + "px";
				tick.tick_text.innerHTML = tick.display_text;
				
				// Handle density of ticks
				if (fraction_of_array > 1) {
					if (show >= fraction_of_array) {
						show = 1;
						tick.tick_text.style.opacity = 1;
					} else {
						show++;
						tick.tick_text.style.opacity = 0;
					}
				} else {
					tick.tick_text.style.opacity = 1;
				}
				
			};
		}
	},
	
	/*	Events
	================================================== */

	
	/*	Private Methods
	================================================== */
	_initLayout: function () {
		this._el.content_container		= VCO.Dom.create("div", "vco-timeaxis-content-container", this._el.container);
		this._el.major					= VCO.Dom.create("div", "vco-timeaxis-major", this._el.content_container);
		this._el.minor					= VCO.Dom.create("div", "vco-timeaxis-minor", this._el.content_container);
		
		// Fire event that the slide is loaded
		this.onLoaded();
	},
	
	_initEvents: function() {
		
	},
	
	// Update Display
	_updateDisplay: function(width, height, layout) {
		
		if (width) {
			this.options.width 					= width;
		} 

		if (height) {
			this.options.height = height;
		}
		
	}
	
});


/*  VCO.AxisHelper
    Strategies for laying out the timenav
    markers and time axis
    Intended as a private class -- probably only known to TimeScale
================================================== */
VCO.AxisHelper = VCO.Class.extend({
    initialize: function (options) {
		if (options) {
            this.scale = options.scale;
	        this.minor = options.minor;
	        this.major = options.major;
		} else {
            throw("Axis helper must be configured with options")
        }
       
    },
    
    getPixelsPerTick: function(pixels_per_milli) {
        return pixels_per_milli * this.minor.factor;
    },

    getMajorTicks: function(timescale) {
		return this._getTicks(timescale, this.major)
    },

    getMinorTicks: function(timescale) {
        return this._getTicks(timescale, this.minor)
    },

    _getTicks: function(timescale, option) {

        var factor_scale = timescale._scaled_padding * option.factor;
        var first_tick_time = timescale._earliest - factor_scale;
        var last_tick_time = timescale._latest + factor_scale;
        var ticks = []
        for (var i = first_tick_time; i < last_tick_time; i += option.factor) {
            ticks.push(timescale.getDateFromTime(i).floor(option.name));
        }

        return {
            name: option.name,
            ticks: ticks
        }

    }

});

(function(cls){ // add some class-level behavior

    var HELPERS = {};
    
    var setHelpers = function(scale_type, scales) {
        HELPERS[scale_type] = [];
        
        for (var idx = 0; idx < scales.length - 1; idx++) {
            var minor = scales[idx];
            var major = scales[idx+1];
            HELPERS[scale_type].push(new cls({
                scale: minor[3],
                minor: { name: minor[0], factor: minor[1]},
                major: { name: major[0], factor: major[1]}
            }));
        }
    };
    
    setHelpers('javascript', VCO.Date.SCALES);
    setHelpers('cosmological', VCO.BigDate.SCALES);
    
    cls.HELPERS = HELPERS;
    
    cls.getBestHelper = function(ts,optimal_tick_width) {
        if (typeof(optimal_tick_width) != 'number' ) {
            optimal_tick_width = 100;
        }
        var ts_scale = ts.getScale();
        var helpers = HELPERS[ts_scale];
        
        if (!helpers) {
            throw ("No AxisHelper available for "+ts_scale);
        }
        
        var prev = null;
        for (var idx in helpers) {
            var curr = helpers[idx];
            var pixels_per_tick = curr.getPixelsPerTick(ts._pixels_per_milli);
            if (pixels_per_tick > optimal_tick_width)  {
                if (prev == null) return curr;
                var curr_dist = Math.abs(optimal_tick_width - pixels_per_tick);
                var prev_dist = Math.abs(optimal_tick_width - pixels_per_tick);
                if (curr_dist < prev_dist) {
                    return curr;
                } else {
                    return prev;
                }
            }
            prev = curr;
        }
        return helpers[helpers.length - 1]; // last resort           
    }
})(VCO.AxisHelper);


/*  TimelineJS
Designed and built by Zach Wise at KnightLab
  
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.
  
================================================== */
/* 
TODO
  
*/ 

/*  Required Files
CodeKit Import
http://incident57.com/codekit/
================================================== */

// CORE
	// @codekit-prepend "core/VCO.js";
	// @codekit-prepend "core/VCO.Util.js";
	// @codekit-prepend "data/VCO.Data.js";
	// @codekit-prepend "core/VCO.Class.js";
	// @codekit-prepend "core/VCO.Events.js";
	// @codekit-prepend "core/VCO.Browser.js";
	// @codekit-prepend "core/VCO.Load.js";
	// @codekit-prepend "core/VCO.TimelineConfig.js";
	// @codekit-prepend "core/VCO.ConfigFactory.js";


// LANGUAGE
	// @codekit-prepend "language/VCO.Language.js";
	// @codekit-prepend "language/VCO.I18NMixins.js";

// ANIMATION
	// @codekit-prepend "animation/VCO.Ease.js";
	// @codekit-prepend "animation/VCO.Animate.js";

// DOM
	// @codekit-prepend "dom/VCO.Point.js";
	// @codekit-prepend "dom/VCO.DomMixins.js";
	// @codekit-prepend "dom/VCO.Dom.js";
	// @codekit-prepend "dom/VCO.DomUtil.js";
	// @codekit-prepend "dom/VCO.DomEvent.js";
	// @codekit-prepend "dom/VCO.StyleSheet.js";
  
// Date
	// @codekit-prepend "date/VCO.Date.js";
	// @codekit-prepend "date/VCO.DateUtil.js";

// UI
	// @codekit-prepend "ui/VCO.Draggable.js";
	// @codekit-prepend "ui/VCO.Swipable.js";
	// @codekit-prepend "ui/VCO.MenuBar.js";
	// @codekit-prepend "ui/VCO.Message.js";

// MEDIA
	// @codekit-prepend "media/VCO.MediaType.js";
	// @codekit-prepend "media/VCO.Media.js";

// MEDIA TYPES
	// @codekit-prepend "media/types/VCO.Media.Blockquote.js";
	// @codekit-prepend "media/types/VCO.Media.DailyMotion.js";
	// @codekit-prepend "media/types/VCO.Media.DocumentCloud.js";
	// @codekit-prepend "media/types/VCO.Media.Flickr.js";
	// @codekit-prepend "media/types/VCO.Media.GoogleDoc.js";
	// @codekit-prepend "media/types/VCO.Media.GooglePlus.js";
	// @codekit-prepend "media/types/VCO.Media.IFrame.js";
	// @codekit-prepend "media/types/VCO.Media.Image.js";
	// @codekit-prepend "media/types/VCO.Media.Instagram.js";
	// @codekit-prepend "media/types/VCO.Media.Map.js";
	// @codekit-prepend "media/types/VCO.Media.Profile.js";
	// @codekit-prepend "media/types/VCO.Media.Slider.js";
	// @codekit-prepend "media/types/VCO.Media.SoundCloud.js";
	// @codekit-prepend "media/types/VCO.Media.Spotify.js";
	// @codekit-prepend "media/types/VCO.Media.Storify.js";
	// @codekit-prepend "media/types/VCO.Media.Text.js";
	// @codekit-prepend "media/types/VCO.Media.Twitter.js";
	// @codekit-prepend "media/types/VCO.Media.Vimeo.js";
	// @codekit-prepend "media/types/VCO.Media.Vine.js";
	// @codekit-prepend "media/types/VCO.Media.Website.js";
	// @codekit-prepend "media/types/VCO.Media.Wikipedia.js";
	// @codekit-prepend "media/types/VCO.Media.YouTube.js";

// STORYSLIDER
	// @codekit-prepend "slider/VCO.Slide.js";
	// @codekit-prepend "slider/VCO.SlideNav.js";
	// @codekit-prepend "slider/VCO.StorySlider.js";

// TIMENAV
	// @codekit-prepend "timenav/VCO.TimeNav.js"; 
	// @codekit-prepend "timenav/VCO.TimeMarker.js";
	// @codekit-prepend "timenav/VCO.TimeGroup.js";
	// @codekit-prepend "timenav/VCO.TimeScale.js";
	// @codekit-prepend "timenav/VCO.TimeAxis.js";
	// @codekit-prepend "timenav/VCO.AxisHelper.js";


VCO.Timeline = VCO.Class.extend({
	includes: VCO.Events,

	/*  Private Methods
	================================================== */
	initialize: function (elem, data, options) {
		var self = this;
		// Version
		this.version = "0.0.20";

		// Ready
		this.ready = false;

		// DOM ELEMENTS
		this._el = {
			container: {},
			storyslider: {},
			timenav: {},
			menubar: {}
		};

		// Determine Container Element
		if (typeof elem === 'object') {
			this._el.container = elem;
		} else {
			this._el.container = VCO.Dom.get(elem);
		}

		// Slider
		this._storyslider = {};

		// Style Sheet
		this._style_sheet = new VCO.StyleSheet();

		// TimeNav
		this._timenav = {};
		
		// Message
		this.message = {};

		// Menu Bar
		this._menubar = {};

		// Loaded State
		this._loaded = {storyslider:false, timenav:false};

		// Data Object
		// Test Data compiled from http://www.pbs.org/marktwain/learnmore/chronology.html
		this.config = null;

		this.options = {
			script_path:        "",
			height:           this._el.container.offsetHeight,
			width:            this._el.container.offsetWidth,
			theme_color:        false,
			hash_bookmark:        false,
			default_bg_color:       {r:255, g:255, b:255},
			scale_factor:         2,        // How many screen widths wide should the timeline be
			layout:           "landscape",  // portrait or landscape
			timenav_position:       "bottom",     // timeline on top or bottom 
			optimal_tick_width:     60,       // optimal distance (in pixels) between ticks on axis
			base_class:         "",
			timenav_height:       175,
			timenav_height_percentage:  25,       // Overrides timenav height as a percentage of the screen
			timenav_height_min:     175,      // Minimum timenav height
			marker_height_min:      30,       // Minimum Marker Height
			marker_width_min:       100,      // Minimum Marker Width
			marker_padding:       5,        // Top Bottom Marker Padding
			start_at_slide:       0,
			start_at_end: false,
			menubar_height:       0,
			skinny_size:        650,
			relative_date:        false,      // Use momentjs to show a relative date from the slide.text.date.created_time field
			use_bc:           false,      // Use declared suffix on dates earlier than 0
			// animation
			duration:           1000,
			ease:             VCO.Ease.easeInOutQuint,
			// interaction
			dragging:           true,
			trackResize:        true,
			map_type:           "stamen:toner-lite",
			slide_padding_lr:       100,      // padding on slide of slide
			slide_default_fade:     "0%",       // landscape fade
			zoom_sequence:        [0.5, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89], // Array of Fibonacci numbers for TimeNav zoom levels http://www.maths.surrey.ac.uk/hosted-sites/R.Knott/Fibonacci/fibtable.html
			language:           "en",
			ga_property_id:       null,
			track_events:         ['back_to_start','nav_next','nav_previous','zoom_in','zoom_out' ]
		};

		// Current Slide
		// this.current_slide = this.options.start_at_slide;
		// no longer using this, track current slide by id only

		// Animation Objects
		this.animator_timenav = null;
		this.animator_storyslider = null;
		this.animator_menubar = null;

		// Merge Options
		VCO.Util.mergeData(this.options, options);

		// Use Relative Date Calculations
		if(this.options.relative_date) {
			if (typeof(moment) !== 'undefined') {
				self._loadLanguage(data);
			} else {
				VCO.Load.js(this.options.script_path + "/library/moment.js", function() {
					self._loadLanguage(data);
					trace("LOAD MOMENTJS")
				});
			}

		} else {
			self._loadLanguage(data);
		}

		if (this.options.theme_color) {
			this._applyCustomColor(this.options.theme_color);
		}
		
		// Apply base class to container
		this._el.container.className += ' vco-timeline';
		
		// Message
		this.message = new VCO.Message({}, {
			message_class: "vco-message-full"
		});
		
		this.message.addTo(this._el.container);

	},

	/*  Load Language
	================================================== */
	_loadLanguage: function(data) {
		var self = this;
		this.options.language = new VCO.Language(this.options);
		this._initData(data);
	},

  
	/*  Navigation
	================================================== */
  
	// Goto slide with id
	goToId: function(id) {
		if (this.current_id != id) {
			this.current_id = id;
			this._timenav.goToId(this.current_id);
			this._storyslider.goToId(this.current_id, false, true);
			this.fire("change", {uniqueid: this.current_id}, this);
		}
	},
  
	// Goto slide n
	goTo: function(n) {
		if(this.config.title) {
			if(n == 0) {
				this.goToId(this.config.title.uniqueid);
			} else {
				this.goToId(this.config.events[n - 1].uniqueid);
			}
		} else {
			this.goToId(this.config.events[n].uniqueid);      
		}
	},
  
	// Goto first slide
	goToStart: function() {
		this.goTo(0);
	},
  
	// Goto last slide
	goToEnd: function() {
		var _n = this.config.events.length - 1;
		this.goTo(this.config.title ? _n + 1 : _n);
	},
  
	// Goto previous slide
	goToPrev: function() {
		this.goTo(this._getSlideIndex(this.current_id) - 1);
	},
  
	// Goto next slide
	goToNext: function() {
		this.goTo(this._getSlideIndex(this.current_id) + 1);
	},
  
	/* Event maniupluation
	================================================== */
  
	// Add an event
	add: function(data) {
		var uniqueid = this.config.addEvent(data);
      
		var n = this._getEventIndex(uniqueid);
		var d = this.config.events[n];
        
		this._storyslider.createSlide(d, this.config.title ? n+1 : n);
		this._storyslider._updateDrawSlides();            
        
		this._timenav.createMarker(d, n);
		this._timenav._updateDrawTimeline(false); 
        
		this.fire("added", {uniqueid: uniqueid});
	},
  
	// Remove an event
	remove: function(n) {
		if(n >= 0  && n < this.config.events.length) {
			// If removing the current, nav to new one first
			if(this.config.events[n].uniqueid == this.current_id) {
				if(n < this.config.events.length - 1) {
					this.goTo(n + 1);
				} else {
					this.goTo(n - 1);
				}
			}
        
			var event = this.config.events.splice(n, 1);
        
			this._storyslider.destroySlide(this.config.title ? n+1 : n);
			this._storyslider._updateDrawSlides();            
        
			this._timenav.destroyMarker(n);
			this._timenav._updateDrawTimeline(false);
         
			this.fire("removed", {uniqueid: event[0].uniqueid});
		}
	},
  
	removeId: function(id) {
		this.remove(this._getEventIndex(id));
	},
    
	/* Get slide data
	================================================== */

	getData: function(n) {
		if(this.config.title) {
			if(n == 0) {
				return this.config.title;
			} else if(n > 0 && n <= this.config.events.length) {
				return this.config.events[n - 1];
			}
		} else if(n >= 0 && n < this.config.events.length) {
			return this.config.events[n];
		}
		return null;
	},

	getDataId: function(id) {
		return this.getData(this._getSlideIndex(id));
	},

	/* Get slide object
	================================================== */

	getSlide: function(n) {
		if(n >= 0 && n < this._storyslider._slides.length) {
			return this._storyslider._slides[n];
		}        
		return null;
	},

	getSlideById: function(id) {
		return this.getSlide(this._getSlideIndex(id));
	},

	getCurrentSlide: function() {
		return this.getSlideById(this.current_id);
	},


	/*  Display
	================================================== */
	updateDisplay: function() {
		if (this.ready) {
			this._updateDisplay();
		}
	},
  
	_calculateTimeNavHeight: function(timenav_height, timenav_height_percentage) {
		var height = 0;
    
		if (timenav_height) {
			height = timenav_height;
		} else {
			if (this.options.timenav_height_percentage || timenav_height_percentage) {
				if (timenav_height_percentage) {
					height = Math.round((this.options.height/100)*timenav_height_percentage);
				} else {
					height = Math.round((this.options.height/100)*this.options.timenav_height_percentage);
				}
        
			}
		}
		if (height < this.options.timenav_height_min) {
			height = this.options.timenav_height_min;
		}
    
		height = height - (this.options.marker_padding * 2);
    
		return height;
	},
  
	/*  Private Methods
	================================================== */
  
	// Update View
	_updateDisplay: function(timenav_height, animate, d) {
		var duration    = this.options.duration,
		display_class   = this.options.base_class,
		menu_position   = 0,
		self      = this;
    
		if (d) {
			duration = d;
		}
    
		// Update width and height
		this.options.width = this._el.container.offsetWidth;
		this.options.height = this._el.container.offsetHeight;
    
		// Check if skinny
		if (this.options.width <= this.options.skinny_size) {
			this.options.layout = "portrait";
		} else {
			this.options.layout = "landscape";
		}
    
		// Detect Mobile and Update Orientation on Touch devices
		if (VCO.Browser.touch) {
			this.options.layout = VCO.Browser.orientation();
		} 
    
		if (VCO.Browser.mobile) {
			display_class += " vco-mobile";
			// Set TimeNav Height
			this.options.timenav_height = this._calculateTimeNavHeight(timenav_height, 40);
		} else {
			// Set TimeNav Height
			this.options.timenav_height = this._calculateTimeNavHeight(timenav_height);
		}
    
		// LAYOUT
		if (this.options.layout == "portrait") {
      
			display_class += " vco-skinny";
			// Portrait
			display_class += " vco-layout-portrait";

		} else {
			// Landscape
			display_class += " vco-layout-landscape";
      
		}
    
		// Set StorySlider Height
		this.options.storyslider_height = (this.options.height - this.options.timenav_height);
    
		// Positon Menu
		if (this.options.timenav_position == "top") {
			menu_position = ( Math.ceil(this.options.timenav_height)/2 ) - (this._el.menubar.offsetHeight/2) - (39/2) ;
		} else {
			menu_position = Math.round(this.options.storyslider_height + 1 + ( Math.ceil(this.options.timenav_height)/2 ) - (this._el.menubar.offsetHeight/2) - (35/2));
		}
    
    
		if (animate) {
    
			// Animate TimeNav
			
			/*
			if (this.animator_timenav) {
			this.animator_timenav.stop();
			}
    
			this.animator_timenav = VCO.Animate(this._el.timenav, {
			height:   (this.options.timenav_height) + "px",
			duration:   duration/4,
			easing:   VCO.Ease.easeOutStrong,
			complete: function () {
			//self._map.updateDisplay(self.options.width, self.options.timenav_height, animate, d, self.options.menubar_height);
			}
			});
			*/
			
			this._el.timenav.style.height = Math.ceil(this.options.timenav_height) + "px";
			
			// Animate StorySlider
			if (this.animator_storyslider) {
				this.animator_storyslider.stop();
			}
			this.animator_storyslider = VCO.Animate(this._el.storyslider, {
				height:   this.options.storyslider_height + "px",
				duration:   duration/2,
				easing:   VCO.Ease.easeOutStrong
			});
      
			// Animate Menubar
			if (this.animator_menubar) {
				this.animator_menubar.stop();
			}
      
			this.animator_menubar = VCO.Animate(this._el.menubar, {
				top:  menu_position + "px",
				duration:   duration/2,
				easing:   VCO.Ease.easeOutStrong
			});
    
		} else {
			// TimeNav
			this._el.timenav.style.height = Math.ceil(this.options.timenav_height) + "px";
    
			// StorySlider
			this._el.storyslider.style.height = this.options.storyslider_height + "px";
      
			// Menubar
			this._el.menubar.style.top = menu_position + "px";
		}
		
		if (this.message) {
			this.message.updateDisplay(this.options.width, this.options.height);
		}
		// Update Component Displays
		this._timenav.updateDisplay(this.options.width, this.options.timenav_height, animate);
		this._storyslider.updateDisplay(this.options.width, this.options.storyslider_height, animate, this.options.layout);
    
		// Apply class
		this._el.container.className = display_class;
		
	},
  
	// Update hashbookmark in the url bar
	_updateHashBookmark: function(id) {
		window.location.hash = "#" + "event-" + id.toString();
		this.fire("hash_updated", {uniqueid:this.current_id, hashbookmark:"#" + "event-" + id.toString()}, this);
	},
  
	// Customize Color
	_applyCustomColor: function(color) {
		var rgb = VCO.Util.hexToRgb(color);
    
		var background_selectors = ".vco-timemarker.vco-timemarker-active .vco-timemarker-content-container,"
		background_selectors  += ".vco-timemarker.vco-timemarker-active .vco-timemarker-timespan .vco-timemarker-timespan-content,"
		background_selectors  += ".vco-timemarker.vco-timemarker-with-end.vco-timemarker-active .vco-timemarker-line-left:after,"
		background_selectors  += ".vco-timemarker.vco-timemarker-with-end.vco-timemarker-active .vco-timemarker-line-right:after,";
		background_selectors  += ".vco-timemarker.vco-timemarker-active .vco-timemarker-line-left:after,";
		background_selectors  += ".vco-timemarker.vco-timemarker-active .vco-timemarker-line-right:after,";
		background_selectors  += ".vco-menubar-button:hover";
    
		this._style_sheet.addRule(background_selectors, "background-color:" + color + " !important;");
		this._style_sheet.addRule(".vco-timemarker.vco-timemarker-active .vco-timemarker-timespan", "background-color:rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ",.15) !important;");
		this._style_sheet.addRule(".vco-timemarker.vco-timemarker-with-end.vco-timemarker-active .vco-timemarker-timespan:after", "background-color:rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ",.5) !important;");
		this._style_sheet.addRule(".vco-timemarker.vco-timemarker-active .vco-timemarker-line-left, .vco-timemarker.vco-timemarker-active .vco-timemarker-line-right", "border-color:" + color + " !important;");
		this._style_sheet.addRule('.vco-timemarker.vco-timemarker-active .vco-timemarker-content-container .vco-timemarker-content .vco-timemarker-media-container [class^=vco-icon-], .vco-timemarker.vco-timemarker-active .vco-timemarker-content-container .vco-timemarker-content .vco-timemarker-media-container [class*=" vco-icon-"]', "color:rgba(255,255,255,.7) !important;");
    
		this._style_sheet.addRule(".vco-timemarker.vco-timemarker-active .vco-timemarker-content-container .vco-timemarker-content .vco-timemarker-text h2.vco-headline.vco-headline-fadeout:after", " background: linear-gradient(to bottom, rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ",.15) 0px, " + color + " 80%) repeat scroll 0% 0% transparent !important;");
	},
  
	/*  Init
	================================================== */
	// Initialize the data
	_initData: function(data) {
		var self = this;
		if (VCO.TimelineConfig == data.constructor) {
			self.config = data;
			self._onDataLoaded();
		} else {
			self.config = new VCO.TimelineConfig(data,function() {self._onDataLoaded()});
		}
		self.config.on('load_error', this._onError, this);
		
	},
  
	// Initialize the layout
	_initLayout: function () {
		var self = this;
    
		//this._el.container.className += ' vco-timeline';
		this.options.base_class = this._el.container.className;
		this._el.container.innerHTML = "";
		// Create Layout
		if (this.options.timenav_position == "top") {
			this._el.timenav		= VCO.Dom.create('div', 'vco-timenav', this._el.container);
			this._el.storyslider	= VCO.Dom.create('div', 'vco-storyslider', this._el.container);
		} else {
			this._el.storyslider  	= VCO.Dom.create('div', 'vco-storyslider', this._el.container);
			this._el.timenav		= VCO.Dom.create('div', 'vco-timenav', this._el.container);
		}
    
		this._el.menubar			= VCO.Dom.create('div', 'vco-menubar', this._el.container);

    
		// Initial Default Layout
		this.options.width        = this._el.container.offsetWidth;
		this.options.height       = this._el.container.offsetHeight;
		this._el.storyslider.style.top  = "1px";
    
		// Set TimeNav Height
		this.options.timenav_height = this._calculateTimeNavHeight();
    
		// Create TimeNav
		this._timenav = new VCO.TimeNav(this._el.timenav, this.config, this.options);
		this._timenav.on('loaded', this._onTimeNavLoaded, this);
		this._timenav.options.height = this.options.timenav_height;
		this._timenav.init();
    
		// Create StorySlider
		this._storyslider = new VCO.StorySlider(this._el.storyslider, this.config, this.options);
		this._storyslider.on('loaded', this._onStorySliderLoaded, this);
		this._storyslider.init();
    
		// Create Menu Bar
		this._menubar = new VCO.MenuBar(this._el.menubar, this._el.container, this.options);
    
		// LAYOUT
		if (this.options.layout == "portrait") {
			this.options.storyslider_height = (this.options.height - this.options.timenav_height - 1);
		} else {
			this.options.storyslider_height = (this.options.height - 1);
		}
		
		
		
		// Update Display
		this._updateDisplay(false, true, 2000);
    
	},
  
	_initEvents: function () {    
		// TimeNav Events
		this._timenav.on('change', this._onTimeNavChange, this);
    
		// StorySlider Events
		this._storyslider.on('change', this._onSlideChange, this);
		this._storyslider.on('colorchange', this._onColorChange, this);
		this._storyslider.on('nav_next', this._onStorySliderNext, this);
		this._storyslider.on('nav_previous', this._onStorySliderPrevious, this);
    
		// Menubar Events
		this._menubar.on('zoom_in', this._onZoomIn, this);
		this._menubar.on('zoom_out', this._onZoomOut, this);
		this._menubar.on('back_to_start', this._onBackToStart, this);
    
	},
  
	/* Analytics
	================================================== */
	_initGoogleAnalytics: function() {
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

		ga('create', this.options.ga_property_id, 'auto');
	},

	_initAnalytics: function() {
		if (this.options.ga_property_id === null) { return; }
		this._initGoogleAnalytics();
		var events = this.options.track_events;
		for (i=0; i < events.length; i++) {
			var event_ = events[i];
			this.addEventListener(event_, function(e) {
				ga('send', e.type);
			});
		}
	},
    
	/* Get index of event by id
	================================================== */
	_getEventIndex: function(id) {
		for(var i = 0; i < this.config.events.length; i++) {
			if(id == this.config.events[i].uniqueid) {
				return i;
			}
		}
		return -1;
	},  
  
	/*  Get index of slide by id
	================================================== */
	_getSlideIndex: function(id) {
		if(this.config.title && this.config.title.uniqueid == id) {
			return 0;
		}
		for(var i = 0; i < this.config.events.length; i++) {
			if(id == this.config.events[i].uniqueid) {
				return this.config.title ? i+1 : i;
			}
		}
		return -1;
	},
  
	/*  Events
	================================================== */
  
	_onDataLoaded: function(e) {
		this.fire("dataloaded");
		this._initLayout();
		this._initEvents();
		this._initAnalytics();
		if (this.message) {
			this.message.hide();
		}
        
		this.ready = true;
    
	},
	
	_onError: function(e) {
		if (this.message) {
			this.message.updateMessage("<strong>Error: </strong>" + e.message);
		}
	},
  
	_onColorChange: function(e) {
		this.fire("color_change", {uniqueid:this.current_id}, this);
		if (e.color || e.image) {
      
		} else {
      
		}
	},
  
	_onSlideChange: function(e) {
		if (this.current_id != e.uniqueid) {
			this.current_id = e.uniqueid;
			this._timenav.goToId(this.current_id);
			this._onChange(e);
		}
	},
  
	_onTimeNavChange: function(e) {
		if (this.current_id != e.uniqueid) {
			this.current_id = e.uniqueid;
			this._storyslider.goToId(this.current_id);
			this._onChange(e);
		}
	},
  
	_onChange: function(e) {
		this.fire("change", {uniqueid:this.current_id}, this);
		if (this.options.hash_bookmark) {
			this._updateHashBookmark(this.current_id);
		}
	},
  
	_onBackToStart: function(e) {
		this._storyslider.goTo(0);
		this.fire("back_to_start", {uniqueid:this.current_id}, this);
	},
  
	_onZoomIn: function(e) {
		this._timenav.zoomIn();
		this.fire("zoom_in", {zoom_level:this._timenav.options.scale_factor}, this);
	},
  
	_onZoomOut: function(e) {
		this._timenav.zoomOut();
		this.fire("zoom_out", {zoom_level:this._timenav.options.scale_factor}, this);
	},
  
	_onTimeNavLoaded: function() {
		this._loaded.timenav = true;
		this._onLoaded();
	},
  
	_onStorySliderLoaded: function() {
		this._loaded.storyslider = true;
		this._onLoaded();
	},
  
	_onStorySliderNext: function(e) {
		this.fire("nav_next", e);
	},
  
	_onStorySliderPrevious: function(e) {
		this.fire("nav_previous", e);
	},
    
	_onLoaded: function() {
		if (this._loaded.storyslider && this._loaded.timenav) {
			this.fire("loaded", this.config);
			
			// Go to proper slide
			if (this.options.hash_bookmark && window.location.hash != "") {
				this.goToId(window.location.hash.replace("#event-", ""));
			} else {
				if(this.options.start_at_end == "true") {
					this.goToEnd();
				} else {
					this.goTo(this.options.start_at_slide);
				}
				this.current_id = this._timenav.current_id;
				if (this.options.hash_bookmark) {
					this._updateHashBookmark(this.current_id);
				}
			}
			
		}
	}

});

VCO.Timeline.source_path = (function() {
	var script_tags = document.getElementsByTagName('script');
	var src = script_tags[script_tags.length-1].src;
	return src.substr(0,src.lastIndexOf('/'));
})();





