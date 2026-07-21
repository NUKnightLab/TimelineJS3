import TLError from "../core/TLError"

const css_named_colors = {
    "aliceblue": "#f0f8ff",
    "antiquewhite": "#faebd7",
    "aqua": "#00ffff",
    "aquamarine": "#7fffd4",
    "azure": "#f0ffff",
    "beige": "#f5f5dc",
    "bisque": "#ffe4c4",
    "black": "#000000",
    "blanchedalmond": "#ffebcd",
    "blue": "#0000ff",
    "blueviolet": "#8a2be2",
    "brown": "#a52a2a",
    "burlywood": "#deb887",
    "cadetblue": "#5f9ea0",
    "chartreuse": "#7fff00",
    "chocolate": "#d2691e",
    "coral": "#ff7f50",
    "cornflowerblue": "#6495ed",
    "cornsilk": "#fff8dc",
    "crimson": "#dc143c",
    "cyan": "#00ffff",
    "darkblue": "#00008b",
    "darkcyan": "#008b8b",
    "darkgoldenrod": "#b8860b",
    "darkgray": "#a9a9a9",
    "darkgreen": "#006400",
    "darkkhaki": "#bdb76b",
    "darkmagenta": "#8b008b",
    "darkolivegreen": "#556b2f",
    "darkorange": "#ff8c00",
    "darkorchid": "#9932cc",
    "darkred": "#8b0000",
    "darksalmon": "#e9967a",
    "darkseagreen": "#8fbc8f",
    "darkslateblue": "#483d8b",
    "darkslategray": "#2f4f4f",
    "darkturquoise": "#00ced1",
    "darkviolet": "#9400d3",
    "deeppink": "#ff1493",
    "deepskyblue": "#00bfff",
    "dimgray": "#696969",
    "dodgerblue": "#1e90ff",
    "firebrick": "#b22222",
    "floralwhite": "#fffaf0",
    "forestgreen": "#228b22",
    "fuchsia": "#ff00ff",
    "gainsboro": "#dcdcdc",
    "ghostwhite": "#f8f8ff",
    "gold": "#ffd700",
    "goldenrod": "#daa520",
    "gray": "#808080",
    "green": "#008000",
    "greenyellow": "#adff2f",
    "honeydew": "#f0fff0",
    "hotpink": "#ff69b4",
    "indianred": "#cd5c5c",
    "indigo": "#4b0082",
    "ivory": "#fffff0",
    "khaki": "#f0e68c",
    "lavender": "#e6e6fa",
    "lavenderblush": "#fff0f5",
    "lawngreen": "#7cfc00",
    "lemonchiffon": "#fffacd",
    "lightblue": "#add8e6",
    "lightcoral": "#f08080",
    "lightcyan": "#e0ffff",
    "lightgoldenrodyellow": "#fafad2",
    "lightgray": "#d3d3d3",
    "lightgreen": "#90ee90",
    "lightpink": "#ffb6c1",
    "lightsalmon": "#ffa07a",
    "lightseagreen": "#20b2aa",
    "lightskyblue": "#87cefa",
    "lightslategray": "#778899",
    "lightsteelblue": "#b0c4de",
    "lightyellow": "#ffffe0",
    "lime": "#00ff00",
    "limegreen": "#32cd32",
    "linen": "#faf0e6",
    "magenta": "#ff00ff",
    "maroon": "#800000",
    "mediumaquamarine": "#66cdaa",
    "mediumblue": "#0000cd",
    "mediumorchid": "#ba55d3",
    "mediumpurple": "#9370db",
    "mediumseagreen": "#3cb371",
    "mediumslateblue": "#7b68ee",
    "mediumspringgreen": "#00fa9a",
    "mediumturquoise": "#48d1cc",
    "mediumvioletred": "#c71585",
    "midnightblue": "#191970",
    "mintcream": "#f5fffa",
    "mistyrose": "#ffe4e1",
    "moccasin": "#ffe4b5",
    "navajowhite": "#ffdead",
    "navy": "#000080",
    "oldlace": "#fdf5e6",
    "olive": "#808000",
    "olivedrab": "#6b8e23",
    "orange": "#ffa500",
    "orangered": "#ff4500",
    "orchid": "#da70d6",
    "palegoldenrod": "#eee8aa",
    "palegreen": "#98fb98",
    "paleturquoise": "#afeeee",
    "palevioletred": "#db7093",
    "papayawhip": "#ffefd5",
    "peachpuff": "#ffdab9",
    "peru": "#cd853f",
    "pink": "#ffc0cb",
    "plum": "#dda0dd",
    "powderblue": "#b0e0e6",
    "purple": "#800080",
    "rebeccapurple": "#663399",
    "red": "#ff0000",
    "rosybrown": "#bc8f8f",
    "royalblue": "#4169e1",
    "saddlebrown": "#8b4513",
    "salmon": "#fa8072",
    "sandybrown": "#f4a460",
    "seagreen": "#2e8b57",
    "seashell": "#fff5ee",
    "sienna": "#a0522d",
    "silver": "#c0c0c0",
    "skyblue": "#87ceeb",
    "slateblue": "#6a5acd",
    "slategray": "#708090",
    "snow": "#fffafa",
    "springgreen": "#00ff7f",
    "steelblue": "#4682b4",
    "tan": "#d2b48c",
    "teal": "#008080",
    "thistle": "#d8bfd8",
    "tomato": "#ff6347",
    "turquoise": "#40e0d0",
    "violet": "#ee82ee",
    "wheat": "#f5deb3",
    "white": "#ffffff",
    "whitesmoke": "#f5f5f5",
    "yellow": "#ffff00",
    "yellowgreen": "#9acd32"
}

function intToHexString(i) {
    return pad(parseInt(i, 10).toString(16));
}

export function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    if (css_named_colors[hex.toLowerCase()]) {
        hex = css_named_colors[hex.toLowerCase()];
    }
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
}
// given an object with r, g, and b keys, or a string of the form 'rgb(mm,nn,ll)', return a CSS hex string including the leading '#' character
export function rgbToHex(rgb) {
    var r, g, b;
    if (typeof(rgb) == 'object') {
        r = rgb.r;
        g = rgb.g;
        b = rgb.b;
    } else if (typeof(rgb.match) == 'function') {
        var parts = rgb.match(/^rgb\((\d+),(\d+),(\d+)\)$/);
        if (parts) {
            r = parts[1];
            g = parts[2];
            b = parts[3];
        }
    }
    if (isNaN(r) || isNaN(b) || isNaN(g)) {
        throw new TLError("invalid_rgb_err");
    }
    return "#" + intToHexString(r) + intToHexString(g) + intToHexString(b);
}

export function mergeData(data_main, data_to_merge) {
    var x;
    for (x in data_to_merge) {
        if (Object.prototype.hasOwnProperty.call(data_to_merge, x)) {
            data_main[x] = data_to_merge[x];
        }
    }
    return data_main;
}

export function isTrue(s) {
    if (s == null) return false;
    return s == true || String(s).toLowerCase() == 'true' || Number(s) == 1;
}

// like mergeData but takes an arbitrarily long list of sources to merge.
export function extend( /*Object*/ dest) /*-> Object*/ { // merge src properties into dest
    var sources = Array.prototype.slice.call(arguments, 1);
    for (var j = 0, len = sources.length, src; j < len; j++) {
        src = sources[j] || {};
        mergeData(dest, src);
    }
    return dest;
}

const TRACE_HANDLERS = []

/**
 * Register a callback to be executed when trace is called in this runtime.
 * Callbacks will be called with whatever was passed to `trace` which is 
 * expected to be a string.
 * @param {callable} cb 
 */
export function addTraceHandler(cb) {
    TRACE_HANDLERS.push(cb)
}


/**
 * Pass the given `msg` to each registered trace handler.
 * This is a crude adaptation of the original Timeline trace
 * function which assumed access to a global `debug` flag.
 * 
 * @param {string} msg 
 */
export function trace(msg) {
    TRACE_HANDLERS.forEach((cb) => {
        try {
            cb(msg)
        } catch (e) {
            if (console && console.log) {
                console.log("Error handling trace", e)
            }
        }
    })
}


export function pad(val, len) {
    val = String(val);
    len = len || 2;
    while (val.length < len) val = "0" + val;
    return val;
}

export const stamp = (function() {
    var lastId = 0,
        key = '_tl_id';

    return function( /*Object*/ obj) {
        obj[key] = obj[key] || ++lastId;
        return obj[key];
    };
}())

/**
 * Remove any leading or trailing whitespace from the given string.
 * If `str` is undefined or does not have a `replace` function, return
 * an empty string.
 */
export function trim(str) {
    if (str && typeof(str.replace) == 'function') {
        return str.replace(/^\s+|\s+$/g, '');
    }
    return "";
}

export function maxDepth(ary) {
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
}

/**
 * Implement mixin behavior. Based on 
 *     https://blog.bitsrc.io/understanding-mixins-in-javascript-de5d3e02b466
 * @param {class} cls 
 * @param  {...class} src 
 */
export function classMixin(cls, ...src) {
    for (let _cl of src) {
        for (var key of Object.getOwnPropertyNames(_cl.prototype)) {
            cls.prototype[key] = _cl.prototype[key]
        }
    }
}

export function ensureUniqueKey(obj, candidate) {
    if (!candidate) { candidate = unique_ID(6); }

    if (!(candidate in obj)) { return candidate; }

    var root = candidate.match(/^(.+)(-\d+)?$/)[1];
    var similar_ids = [];
    // get an alternative
    for (let key in obj) {
        if (key.match(/^(.+?)(-\d+)?$/)[1] == root) {
            similar_ids.push(key);
        }
    }
    candidate = root + "-" + (similar_ids.length + 1);

    for (var counter = similar_ids.length; similar_ids.indexOf(candidate) != -1; counter++) {
        candidate = root + '-' + counter;
    }

    return candidate;
}

export function isEmptyObject(o) {
    var properties = []
    if (Object.keys) {
        properties = Object.keys(o);
    } else { // all this to support IE 8
        for (var p in o)
            if (Object.prototype.hasOwnProperty.call(o, p)) properties.push(p);
    }
    for (var i = 0; i < properties.length; i++) {
        var k = properties[i];
        if (o[k] != null && typeof o[k] != "string") return false;
        if (trim(o[k]).length != 0) return false;
    }
    return true;
}

export function slugify(str) {
    // borrowed from http://stackoverflow.com/a/5782563/102476
    str = trim(str);
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
    var to = "aaaaaeeeeeiiiiooooouuuunc------";
    for (var i = 0, l = from.length; i < l; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes

    str = str.replace(/^([0-9])/, '_$1');
    return str;
}

export function unique_ID(size, prefix) {

    var getRandomNumber = function(range) {
        return Math.floor(Math.random() * range);
    };

    var getRandomChar = function() {
        var chars = "abcdefghijklmnopqurstuvwxyz";
        return chars.substr(getRandomNumber(32), 1);
    };

    var randomID = function(size) {
        var str = "";
        for (var i = 0; i < size; i++) {
            str += getRandomChar();
        }
        return str;
    };

    if (prefix) {
        return prefix + "-" + randomID(size);
    } else {
        return "tl-" + randomID(size);
    }
}

export function findNextGreater(list, current, default_value) {
    // given a sorted list and a current value which *might* be in the list,
    // return the next greatest value if the current value is >= the last item in the list, return default,
    // or if default is undefined, return input value
    for (var i = 0; i < list.length; i++) {
        if (current < list[i]) {
            return list[i];
        }
    }

    return (default_value) ? default_value : current;
}

export function findNextLesser(list, current, default_value) {
    // given a sorted list and a current value which *might* be in the list,
    // return the next lesser value if the current value is <= the last item in the list, return default,
    // or if default is undefined, return input value
    for (var i = list.length - 1; i >= 0; i--) {
        if (current > list[i]) {
            return list[i];
        }
    }

    return (default_value) ? default_value : current;
}

export function isEven(n) {
    return n == parseFloat(n) ? !(n % 2) : void 0;
}

export function findArrayNumberByUniqueID(id, array, prop, defaultVal) {
    var _n = defaultVal || 0;

    for (var i = 0; i < array.length; i++) {
        if (array[i].data[prop] == id) {
            _n = i;
        }
    };

    return _n;
}

export function unlinkify(text) {
    if (!text) return text;
    text = text.replace(/<a\b[^>]*>/i, "");
    text = text.replace(/<\/a>/i, "");
    return text;
}

export function setData(obj, data) {
    obj.data = extend({}, obj.data, data);
    if (obj.data.unique_id === "") {
        obj.data.unique_id = unique_ID(6);
    }
}

export function htmlify(str) {
    //if (str.match(/<\s*p[^>]*>([^<]*)<\s*\/\s*p\s*>/)) {
    if (str.match(/<p>[\s\S]*?<\/p>/)) {

        return str;
    } else {
        return "<p>" + str + "</p>";
    }
}

export function unhtmlify(str) {
    str = str.replace(/(<[^>]*>)+/g, '');
    return str.replace('"', "'");
}

/*	* Turns plain text links into real links
================================================== */
export function linkify(text, targets, is_touch) {

    var make_link = function(url, link_text, prefix) {
            if (!prefix) {
                prefix = "";
            }
            var MAX_LINK_TEXT_LENGTH = 30;
            if (link_text && link_text.length > MAX_LINK_TEXT_LENGTH) {
                link_text = link_text.substring(0, MAX_LINK_TEXT_LENGTH) + "\u2026"; // unicode ellipsis
            }
            return prefix + "<a class='tl-makelink' href='" + url + "' onclick='void(0)'>" + link_text + "</a>";
        }
        // http://, https://, ftp://
    var urlPattern = /\b(?:https?|ftp):\/\/([a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|])/gim;

    // www. sans http:// or https://
    var pseudoUrlPattern = /(^|[^\/>])(www\.[\S]+(\b|$))/gim;

    // Email addresses
    var emailAddressPattern = /([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)/gim;


    return text
        .replace(urlPattern, function(match, url_sans_protocol, offset, string) {
            // Javascript doesn't support negative lookbehind assertions, so
            // we need to handle risk of matching URLs in legit hrefs
            if (offset > 0) {
                var prechar = string[offset - 1];
                if (prechar == '"' || prechar == "'" || prechar == "=") {
                    return match;
                }
            }
            return make_link(match, url_sans_protocol);
        })
        .replace(pseudoUrlPattern, function(match, beforePseudo, pseudoUrl, offset, string) {
            return make_link('http://' + pseudoUrl, pseudoUrl, beforePseudo);
        })
        .replace(emailAddressPattern, function(match, email, offset, string) {
            return make_link('mailto:' + email, email);
        });
}

/**
 * Try to make seamless the process of interpreting a URL to a web page which embeds an image for sharing purposes
 * as a direct image link. Some services have predictable transformations we can use rather than explain to people
 * this subtlety.
 */
export function transformMediaURL(url) {
    return url.replace(/(.*)www.dropbox.com\/(.*)/, '$1dl.dropboxusercontent.com/$2')
}

export const ratio = {
    square: (size) => {
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
    r16_9: (size) => {
        if (size.w !== null && size.w !== "") {
            return Math.round((size.w / 16) * 9);
        } else if (size.h !== null && size.h !== "") {
            return Math.round((size.h / 9) * 16);
        } else {
            return 0;
        }
    },
    r4_3: (size) => {
        if (size.w !== null && size.w !== "") {
            return Math.round((size.w / 4) * 3);
        } else if (size.h !== null && size.h !== "") {
            return Math.round((size.h / 3) * 4);
        }
    }
}

export function getUrlVars(string) {
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

    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }


    return vars;
}

export function getParamString(obj) {
    var params = [];
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            params.push(i + '=' + obj[i]);
        }
    }
    return '?' + params.join('&');
}

export function getObjectAttributeByIndex(obj, index) {
    if (typeof obj != 'undefined') {
        var i = 0;
        for (var attr in obj) {
            if (index === i) {
                return obj[attr];
            }
            i++;
        }
        return "";
    } else {
        return "";
    }

}

let base58 = (function(alpha) {
    var alphabet = alpha || '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ',
        base = alphabet.length;
    return {
        encode: function(enc) {
            if (typeof enc !== 'number' || enc !== parseInt(enc))
                throw '"encode" only accepts integers.';
            var encoded = '';
            while (enc) {
                var remainder = enc % base;
                enc = Math.floor(enc / base);
                encoded = alphabet[remainder].toString() + encoded;
            }
            return encoded;
        },
        decode: function(dec) {
            if (typeof dec !== 'string')
                throw '"decode" only accepts strings.';
            var decoded = 0;
            while (dec) {
                var alphabetPosition = alphabet.indexOf(dec[0]);
                if (alphabetPosition < 0)
                    throw '"decode" can\'t find "' + dec[0] + '" in the alphabet: "' + alphabet + '"';
                var powerOf = dec.length - 1;
                decoded += alphabetPosition * (Math.pow(base, powerOf));
                dec = dec.substring(1);
            }
            return decoded;
        }
    };
})()

export { base58 }


export function parseYouTubeTime(s) {
    // given a YouTube start time string in a reasonable format, reduce it to a number of seconds as an integer.
    if (typeof(s) == 'string') {
        let parts = s.match(/^\s*(\d+h)?(\d+m)?(\d+s)?\s*/i);
        if (parts) {
            var hours = parseInt(parts[1]) || 0;
            var minutes = parseInt(parts[2]) || 0;
            var seconds = parseInt(parts[3]) || 0;
            return seconds + (minutes * 60) + (hours * 60 * 60);
        }
    } else if (typeof(s) == 'number') {
        return s;
    }
    return 0;
}

export function stripMarkup(txt) {
    var doc = new DOMParser().parseFromString(txt, 'text/html');
    return doc.body.textContent || "";
}