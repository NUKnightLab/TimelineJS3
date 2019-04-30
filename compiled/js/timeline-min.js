/*!
	TL
*/
/* Timeline Error class */
function TL_Error(t,e){this.name="TL.Error",this.message=t||"error",this.message_key=this.message,this.detail=e||"";
// Grab stack?
var i=new Error;i.hasOwnProperty("stack")&&(this.stack=i.stack)}!function(t){t.TL={VERSION:"0.1",_originalL:t.TL}}(this),
/*	TL.Debug
	Debug mode
================================================== */
TL.debug=!1,
/*	TL.Bind
================================================== */
TL.Bind=function(/*Function*/t,/*Object*/e){return function(){return t.apply(e,arguments)}},
/* Trace (console.log)
================================================== */
trace=function(t){TL.debug&&(window.console?console.log(t):"undefined"!=typeof jsTrace&&jsTrace.send(t))},TL_Error.prototype=Object.create(Error.prototype),TL_Error.prototype.constructor=TL_Error,TL.Error=TL_Error,
/*	TL.Util
	Class of utilities
================================================== */
TL.Util={mergeData:function(t,e){var i;for(i in e)Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i]);return t},
// like TL.Util.mergeData but takes an arbitrarily long list of sources to merge.
extend:function(/*Object*/t){for(// merge src properties into dest
var e=Array.prototype.slice.call(arguments,1),i=0,n=e.length,a;i<n;i++)a=e[i]||{},TL.Util.mergeData(t,a);return t},isEven:function(t){return t==parseFloat(t)?!(t%2):void 0},isTrue:function(t){return null!=t&&(1==t||"true"==String(t).toLowerCase()||1==Number(t))},findArrayNumberByUniqueID:function(t,e,i,n){for(var a=n||0,s=0;s<e.length;s++)e[s].data[i]==t&&(a=s);return a},convertUnixTime:function(t){var e,i,n,a,s,o,r=[],l={ymd:"",time:"",time_array:[],date_array:[],full_array:[]};l.ymd=t.split(" ")[0],l.time=t.split(" ")[1],l.date_array=l.ymd.split("-"),l.time_array=l.time.split(":"),l.full_array=l.date_array.concat(l.time_array);for(var h=0;h<l.full_array.length;h++)r.push(parseInt(l.full_array[h]));return i=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],n=(e=new Date(r[0],r[1],r[2],r[3],r[4],r[5])).getFullYear(),o=(a=i[e.getMonth()])+", "+(s=e.getDate())+" "+n},setData:function(t,e){t.data=TL.Util.extend({},t.data,e),""===t.data.unique_id&&(t.data.unique_id=TL.Util.unique_ID(6))},stamp:function(){var e=0,i="_tl_id";return function(/*Object*/t){return t[i]=t[i]||++e,t[i]}}(),isArray:function(){
// Use compiler's own isArray when available
if(Array.isArray)return Array.isArray;
// Retain references to variables for performance
// optimization
var e=Object.prototype.toString,i=e.call([]);return function(t){return e.call(t)===i}}(),getRandomNumber:function(t){return Math.floor(Math.random()*t)},unique_ID:function(t,e){var i=function(t){return Math.floor(Math.random()*t)},n=function(){var t;return"abcdefghijklmnopqurstuvwxyz".substr(i(32),1)},a=function(t){for(var e="",i=0;i<t;i++)e+=n();return e};return e?e+"-"+a(t):"tl-"+a(t)},ensureUniqueKey:function(t,e){if(e||(e=TL.Util.unique_ID(6)),!(e in t))return e;var i=e.match(/^(.+)(-\d+)?$/)[1],n=[];
// get an alternative
for(key in t)key.match(/^(.+?)(-\d+)?$/)[1]==i&&n.push(key);e=i+"-"+(n.length+1);for(var a=n.length;-1!=n.indexOf(e);a++)e=i+"-"+a;return e},htmlify:function(t){
//if (str.match(/<\s*p[^>]*>([^<]*)<\s*\/\s*p\s*>/)) {
return t.match(/<p>[\s\S]*?<\/p>/)?t:"<p>"+t+"</p>"},unhtmlify:function(t){return(t=t.replace(/(<[^>]*>)+/g,"")).replace('"',"'")},
/*	* Turns plain text links into real links
	================================================== */
linkify:function(t,e,i){var s=function(t,e,i){i||(i="");var n=30;return e&&30<e.length&&(e=e.substring(0,30)+"…"),i+"<a class='tl-makelink' href='"+t+"' onclick='void(0)'>"+e+"</a>"}
// http://, https://, ftp://
,n=/\b(?:https?|ftp):\/\/([a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|])/gim,a=/(^|[^\/>])(www\.[\S]+(\b|$))/gim,o=/([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)/gim;return t.replace(n,function(t,e,i,n){
// Javascript doesn't support negative lookbehind assertions, so
// we need to handle risk of matching URLs in legit hrefs
if(0<i){var a=n[i-1];if('"'==a||"'"==a||"="==a)return t}return s(t,e)}).replace(a,function(t,e,i,n,a){return s("http://"+i,i,e)}).replace(o,function(t,e,i,n){return s("mailto:"+e,e)})},unlinkify:function(t){return t?t=(t=t.replace(/<a\b[^>]*>/i,"")).replace(/<\/a>/i,""):t},getParamString:function(t){var e=[];for(var i in t)t.hasOwnProperty(i)&&e.push(i+"="+t[i]);return"?"+e.join("&")},formatNum:function(t,e){var i=Math.pow(10,e||5);return Math.round(t*i)/i},falseFn:function(){return!1},requestAnimFrame:function(){function a(t){window.setTimeout(t,1e3/60)}var s=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||a;return function(t,e,i,n){t=e?TL.Util.bind(t,e):t,i&&s===a?t():s(t,n)}}(),bind:function(/*Function*/t,/*Object*/e){return function(){return t.apply(e,arguments)}},template:function(t,n){return t.replace(/\{ *([\w_]+) *\}/g,function(t,e){var i=n[e];if(!n.hasOwnProperty(e))throw new TL.Error("template_value_err",t);return i})},hexToRgb:function(t){
// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
TL.Util.css_named_colors[t.toLowerCase()]&&(t=TL.Util.css_named_colors[t.toLowerCase()]);var e=/^#?([a-f\d])([a-f\d])([a-f\d])$/i;t=t.replace(e,function(t,e,i,n){return e+e+i+i+n+n});var i=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);return i?{r:parseInt(i[1],16),g:parseInt(i[2],16),b:parseInt(i[3],16)}:null},
// given an object with r, g, and b keys, or a string of the form 'rgb(mm,nn,ll)', return a CSS hex string including the leading '#' character
rgbToHex:function(t){var e,i,n;if("object"==typeof t)e=t.r,i=t.g,n=t.b;else if("function"==typeof t.match){var a=t.match(/^rgb\((\d+),(\d+),(\d+)\)$/);a&&(e=a[1],i=a[2],n=a[3])}if(isNaN(e)||isNaN(n)||isNaN(i))throw new TL.Error("invalid_rgb_err");return"#"+TL.Util.intToHexString(e)+TL.Util.intToHexString(i)+TL.Util.intToHexString(n)},colorObjToHex:function(t){var e=[t.r,t.g,t.b];return TL.Util.rgbToHex("rgb("+e.join(",")+")")},css_named_colors:{aliceblue:"#f0f8ff",antiquewhite:"#faebd7",aqua:"#00ffff",aquamarine:"#7fffd4",azure:"#f0ffff",beige:"#f5f5dc",bisque:"#ffe4c4",black:"#000000",blanchedalmond:"#ffebcd",blue:"#0000ff",blueviolet:"#8a2be2",brown:"#a52a2a",burlywood:"#deb887",cadetblue:"#5f9ea0",chartreuse:"#7fff00",chocolate:"#d2691e",coral:"#ff7f50",cornflowerblue:"#6495ed",cornsilk:"#fff8dc",crimson:"#dc143c",cyan:"#00ffff",darkblue:"#00008b",darkcyan:"#008b8b",darkgoldenrod:"#b8860b",darkgray:"#a9a9a9",darkgreen:"#006400",darkkhaki:"#bdb76b",darkmagenta:"#8b008b",darkolivegreen:"#556b2f",darkorange:"#ff8c00",darkorchid:"#9932cc",darkred:"#8b0000",darksalmon:"#e9967a",darkseagreen:"#8fbc8f",darkslateblue:"#483d8b",darkslategray:"#2f4f4f",darkturquoise:"#00ced1",darkviolet:"#9400d3",deeppink:"#ff1493",deepskyblue:"#00bfff",dimgray:"#696969",dodgerblue:"#1e90ff",firebrick:"#b22222",floralwhite:"#fffaf0",forestgreen:"#228b22",fuchsia:"#ff00ff",gainsboro:"#dcdcdc",ghostwhite:"#f8f8ff",gold:"#ffd700",goldenrod:"#daa520",gray:"#808080",green:"#008000",greenyellow:"#adff2f",honeydew:"#f0fff0",hotpink:"#ff69b4",indianred:"#cd5c5c",indigo:"#4b0082",ivory:"#fffff0",khaki:"#f0e68c",lavender:"#e6e6fa",lavenderblush:"#fff0f5",lawngreen:"#7cfc00",lemonchiffon:"#fffacd",lightblue:"#add8e6",lightcoral:"#f08080",lightcyan:"#e0ffff",lightgoldenrodyellow:"#fafad2",lightgray:"#d3d3d3",lightgreen:"#90ee90",lightpink:"#ffb6c1",lightsalmon:"#ffa07a",lightseagreen:"#20b2aa",lightskyblue:"#87cefa",lightslategray:"#778899",lightsteelblue:"#b0c4de",lightyellow:"#ffffe0",lime:"#00ff00",limegreen:"#32cd32",linen:"#faf0e6",magenta:"#ff00ff",maroon:"#800000",mediumaquamarine:"#66cdaa",mediumblue:"#0000cd",mediumorchid:"#ba55d3",mediumpurple:"#9370db",mediumseagreen:"#3cb371",mediumslateblue:"#7b68ee",mediumspringgreen:"#00fa9a",mediumturquoise:"#48d1cc",mediumvioletred:"#c71585",midnightblue:"#191970",mintcream:"#f5fffa",mistyrose:"#ffe4e1",moccasin:"#ffe4b5",navajowhite:"#ffdead",navy:"#000080",oldlace:"#fdf5e6",olive:"#808000",olivedrab:"#6b8e23",orange:"#ffa500",orangered:"#ff4500",orchid:"#da70d6",palegoldenrod:"#eee8aa",palegreen:"#98fb98",paleturquoise:"#afeeee",palevioletred:"#db7093",papayawhip:"#ffefd5",peachpuff:"#ffdab9",peru:"#cd853f",pink:"#ffc0cb",plum:"#dda0dd",powderblue:"#b0e0e6",purple:"#800080",rebeccapurple:"#663399",red:"#ff0000",rosybrown:"#bc8f8f",royalblue:"#4169e1",saddlebrown:"#8b4513",salmon:"#fa8072",sandybrown:"#f4a460",seagreen:"#2e8b57",seashell:"#fff5ee",sienna:"#a0522d",silver:"#c0c0c0",skyblue:"#87ceeb",slateblue:"#6a5acd",slategray:"#708090",snow:"#fffafa",springgreen:"#00ff7f",steelblue:"#4682b4",tan:"#d2b48c",teal:"#008080",thistle:"#d8bfd8",tomato:"#ff6347",turquoise:"#40e0d0",violet:"#ee82ee",wheat:"#f5deb3",white:"#ffffff",whitesmoke:"#f5f5f5",yellow:"#ffff00",yellowgreen:"#9acd32"},ratio:{square:function(t){var e={w:0,h:0};return t.w>t.h&&0<t.h?(e.h=t.h,e.w=t.h):(e.w=t.w,e.h=t.w),e},r16_9:function(t){return null!==t.w&&""!==t.w?Math.round(t.w/16*9):null!==t.h&&""!==t.h?Math.round(t.h/9*16):0},r4_3:function(t){return null!==t.w&&""!==t.w?Math.round(t.w/4*3):null!==t.h&&""!==t.h?Math.round(t.h/3*4):void 0}},getObjectAttributeByIndex:function(t,e){if(void 0===t)return"";var i=0;for(var n in t){if(e===i)return t[n];i++}return""},getUrlVars:function(t){var e,i=[],n,a;(e=t.toString()).match("&#038;")?e=e.replace("&#038;","&"):e.match("&#38;")?e=e.replace("&#38;","&"):e.match("&amp;")&&(e=e.replace("&amp;","&")),a=e.slice(e.indexOf("?")+1).split("&");for(var s=0;s<a.length;s++)n=a[s].split("="),i.push(n[0]),i[n[0]]=n[1];return i},
/**
     * Remove any leading or trailing whitespace from the given string.
     * If `str` is undefined or does not have a `replace` function, return
     * an empty string.
     */
trim:function(t){return t&&"function"==typeof t.replace?t.replace(/^\s+|\s+$/g,""):""},slugify:function(t){t=(
// borrowed from http://stackoverflow.com/a/5782563/102476
t=TL.Util.trim(t)).toLowerCase();for(
// remove accents, swap ñ for n, etc
var e="ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;",i="aaaaaeeeeeiiiiooooouuuunc------",n=0,a=e.length;n<a;n++)t=t.replace(new RegExp(e.charAt(n),"g"),i.charAt(n));// collapse dashes
return t=(t=t.replace(/[^a-z0-9 -]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-")).replace(/^([0-9])/,"_$1")},maxDepth:function(t){for(
// given a sorted array of 2-tuples of numbers, count how many "deep" the items are.
// that is, what is the maximum number of tuples that occupy any one moment
// each tuple should also be sorted
var e=[],i=0,n=0;n<t.length;n++){if(e.push(t[n]),1<e.length){for(var a=e[e.length-1],s=-1,o=0;o<e.length-1;o++)e[o][1]<a[0]&&(s=o);0<=s&&(e=e.slice(s+1))}e.length>i&&(i=e.length)}return i},pad:function(t,e){for(t=String(t),e=e||2;t.length<e;)t="0"+t;return t},intToHexString:function(t){return TL.Util.pad(parseInt(t,10).toString(16))},findNextGreater:function(t,e,i){
// given a sorted list and a current value which *might* be in the list,
// return the next greatest value if the current value is >= the last item in the list, return default,
// or if default is undefined, return input value
for(var n=0;n<t.length;n++)if(e<t[n])return t[n];return i||e},findNextLesser:function(t,e,i){
// given a sorted list and a current value which *might* be in the list,
// return the next lesser value if the current value is <= the last item in the list, return default,
// or if default is undefined, return input value
for(var n=t.length-1;0<=n;n--)if(e>t[n])return t[n];return i||e},isEmptyObject:function(t){var e=[];if(Object.keys)e=Object.keys(t);else// all this to support IE 8
for(var i in t)Object.prototype.hasOwnProperty.call(t,i)&&e.push(i);for(var n=0;n<e.length;n++){var a=e[n];if(null!=t[a]&&"string"!=typeof t[a])return!1;if(0!=TL.Util.trim(t[a]).length)return!1}return!0},parseYouTubeTime:function(t){
// given a YouTube start time string in a reasonable format, reduce it to a number of seconds as an integer.
if("string"==typeof t){if(parts=t.match(/^\s*(\d+h)?(\d+m)?(\d+s)?\s*/i),parts){var e=parseInt(parts[1])||0,i=parseInt(parts[2])||0,n;return(parseInt(parts[3])||0)+60*i+60*e*60}}else if("number"==typeof t)return t;return 0},
/**
	 * Try to make seamless the process of interpreting a URL to a web page which embeds an image for sharing purposes
	 * as a direct image link. Some services have predictable transformations we can use rather than explain to people
	 * this subtlety.
	 */
transformImageURL:function(t){return t.replace(/(.*)www.dropbox.com\/(.*)/,"$1dl.dropboxusercontent.com/$2")},base58:function(t){var a="123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ",s=a.length;return{encode:function(t){if("number"!=typeof t||t!==parseInt(t))throw'"encode" only accepts integers.';for(var e="";t;){var i=t%s;t=Math.floor(t/s),e=a[i].toString()+e}return e},decode:function(t){if("string"!=typeof t)throw'"decode" only accepts strings.';for(var e=0;t;){var i=a.indexOf(t[0]);if(i<0)throw'"decode" can\'t find "'+t[0]+'" in the alphabet: "'+a+'"';var n=t.length-1;e+=i*Math.pow(s,n),t=t.substring(1)}return e}}}()},function(uc){
/* Zepto v1.1.2-15-g59d3fe5 - zepto event ajax form ie - zeptojs.com/license */
var vc=function(){function r(t){return null==t?String(t):Q[$.call(t)]||"object"}function o(t){return"function"==r(t)}function s(t){return null!=t&&t==t.window}function l(t){return null!=t&&t.nodeType==t.DOCUMENT_NODE}function n(t){return"object"==r(t)}function h(t){return n(t)&&!s(t)&&Object.getPrototypeOf(t)==Object.prototype}function d(t){return"number"==typeof t.length}function a(t){return E.call(t,function(t){return null!=t})}function c(t){return 0<t.length?k.fn.concat.apply([],t):t}function u(t){return t.replace(/::/g,"/").replace(/([A-Z]+)([A-Z][a-z])/g,"$1_$2").replace(/([a-z\d])([A-Z])/g,"$1_$2").replace(/_/g,"-").toLowerCase()}function i(t){return t in e?e[t]:e[t]=new RegExp("(^|\\s)"+t+"(\\s|$)")}function m(t,e){return"number"!=typeof e||N[u(t)]?e:e+"px"}function t(t){var e,i;return C[t]||(e=S.createElement(t),S.body.appendChild(e),i=getComputedStyle(e,"").getPropertyValue("display"),e.parentNode.removeChild(e),"none"==i&&(i="block"),C[t]=i),C[t]}function _(t){return"children"in t?D.call(t.children):k.map(t.childNodes,function(t){if(1==t.nodeType)return t})}
// `$.zepto.fragment` takes a html string and an optional tag name
// to generate DOM nodes nodes from the given html string.
// The generated DOM nodes are returned as an array.
// This function can be overriden in plugins for example to make
// it compatible with browsers that don't support the DOM fully.
function p(t,e,i){for(b in e)i&&(h(e[b])||K(e[b]))?(h(e[b])&&!h(t[b])&&(t[b]={}),K(e[b])&&!K(t[b])&&(t[b]=[]),p(t[b],e[b],i)):e[b]!==w&&(t[b]=e[b])}
// Copy all but undefined properties from one or more
// objects to the `target` object.
function f(t,e){return null==e?k(t):k(t).filter(e)}function g(t,e,i,n){return o(e)?e.call(t,i,n):e}function v(t,e,i){null==i?t.removeAttribute(e):t.setAttribute(e,i)}
// access className property while respecting SVGAnimatedString
function y(t,e){var i=t.className,n=i&&i.baseVal!==w;if(e===w)return n?i.baseVal:i;n?i.baseVal=e:t.className=e}
// "true"  => true
// "false" => false
// "null"  => null
// "42"    => 42
// "42.5"  => 42.5
// "08"    => "08"
// JSON    => parse if valid
// String  => self
function T(e){var t;try{return e?"true"==e||"false"!=e&&("null"==e?null:/^0/.test(e)||isNaN(t=Number(e))?/^[\[\{]/.test(e)?k.parseJSON(e):e:t):e}catch(t){return e}}function L(t,e){for(var i in e(t),t.childNodes)L(t.childNodes[i],e)}
// Generate the `after`, `prepend`, `before`, `append`,
// `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
var w,b,k,x,M=[],D=M.slice,E=M.filter,S=window.document,C={},e={},N={"column-count":1,columns:1,"font-weight":1,"line-height":1,opacity:1,"z-index":1,zoom:1},I=/^\s*<(\w+|!)[^>]*>/,U=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,A=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,j=/^(?:body|html)$/i,O=/([A-Z])/g,
// special attributes that should be get/set via method calls
P=["val","css","html","text","data","width","height","offset"],B=["after","prepend","before","append"],z=S.createElement("table"),R=S.createElement("tr"),q={tr:S.createElement("tbody"),tbody:z,thead:z,tfoot:z,td:R,th:R,"*":S.createElement("div")},H=/complete|loaded|interactive/,F=/^\.([\w-]+)$/,Y=/^#([\w-]*)$/,W=/^[\w-]*$/,Q={},$=Q.toString,Z={},G,J,V=S.createElement("div"),X={tabindex:"tabIndex",readonly:"readOnly",for:"htmlFor",class:"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},K=Array.isArray||function(t){return t instanceof Array};return Z.matches=function(t,e){if(!e||!t||1!==t.nodeType)return!1;var i=t.webkitMatchesSelector||t.mozMatchesSelector||t.oMatchesSelector||t.matchesSelector;if(i)return i.call(t,e);
// fall back to performing a selector:
var n,a=t.parentNode,s=!a;return s&&(a=V).appendChild(t),n=~Z.qsa(a,e).indexOf(t),s&&V.removeChild(t),n},G=function(t){return t.replace(/-+(.)?/g,function(t,e){return e?e.toUpperCase():""})},J=function(i){return E.call(i,function(t,e){return i.indexOf(t)==e})},Z.fragment=function(t,e,i){var n,a,s;
// A special case optimization for a single tag
return U.test(t)&&(n=k(S.createElement(RegExp.$1))),n||(t.replace&&(t=t.replace(A,"<$1></$2>")),e===w&&(e=I.test(t)&&RegExp.$1),e in q||(e="*"),(s=q[e]).innerHTML=""+t,n=k.each(D.call(s.childNodes),function(){s.removeChild(this)})),h(i)&&(a=k(n),k.each(i,function(t,e){-1<P.indexOf(t)?a[t](e):a.attr(t,e)})),n}
// `$.zepto.Z` swaps out the prototype of the given `dom` array
// of nodes with `$.fn` and thus supplying all the Zepto functions
// to the array. Note that `__proto__` is not supported on Internet
// Explorer. This method can be overriden in plugins.
,Z.Z=function(t,e){return(t=t||[]).__proto__=k.fn,t.selector=e||"",t}
// `$.zepto.isZ` should return `true` if the given object is a Zepto
// collection. This method can be overriden in plugins.
,Z.isZ=function(t){return t instanceof Z.Z}
// `$.zepto.init` is Zepto's counterpart to jQuery's `$.fn.init` and
// takes a CSS selector and an optional context (and handles various
// special cases).
// This method can be overriden in plugins.
,Z.init=function(t,e){var i;
// If nothing given, return an empty Zepto collection
if(!t)return Z.Z();
// Optimize for string selectors
// create a new Zepto collection from the nodes found
if("string"==typeof t)
// If it's a html fragment, create nodes from it
// Note: In both Chrome 21 and Firefox 15, DOM error 12
// is thrown if the fragment doesn't begin with <
if("<"==(t=t.trim())[0]&&I.test(t))i=Z.fragment(t,RegExp.$1,e),t=null;
// If there's a context, create a collection on that context first, and select
// nodes from there
else{if(e!==w)return k(e).find(t);
// If it's a CSS selector, use it to select nodes.
i=Z.qsa(S,t)}else{if(o(t))return k(S).ready(t);
// If a Zepto collection is given, just return it
if(Z.isZ(t))return t;
// normalize array if an array of nodes is given
if(K(t))i=a(t);
// Wrap DOM nodes.
else if(n(t))i=[t],t=null;
// If it's a html fragment, create nodes from it
else if(I.test(t))i=Z.fragment(t.trim(),RegExp.$1,e),t=null;
// If there's a context, create a collection on that context first, and select
// nodes from there
else{if(e!==w)return k(e).find(t);
// And last but no least, if it's a CSS selector, use it to select nodes.
i=Z.qsa(S,t)}}return Z.Z(i,t)}
// `$` will be the base `Zepto` object. When calling this
// function just call `$.zepto.init, which makes the implementation
// details of selecting nodes and creating Zepto collections
// patchable in plugins.
,(k=function(t,e){return Z.init(t,e)}).extend=function(e){var i,t=D.call(arguments,1);return"boolean"==typeof e&&(i=e,e=t.shift()),t.forEach(function(t){p(e,t,i)}),e}
// `$.zepto.qsa` is Zepto's CSS selector implementation which
// uses `document.querySelectorAll` and optimizes for some special cases, like `#id`.
// This method can be overriden in plugins.
,Z.qsa=function(t,e){var i,n="#"==e[0],a=!n&&"."==e[0],s=n||a?e.slice(1):e,// Ensure that a 1 char tag name still gets checked
o=W.test(s);return l(t)&&o&&n?(i=t.getElementById(s))?[i]:[]:1!==t.nodeType&&9!==t.nodeType?[]:D.call(o&&!n?a?t.getElementsByClassName(s):// If it's simple, it could be a class
t.getElementsByTagName(e):// Or a tag
t.querySelectorAll(e))},k.contains=function(t,e){return t!==e&&t.contains(e)},k.type=r,k.isFunction=o,k.isWindow=s,k.isArray=K,k.isPlainObject=h,k.isEmptyObject=function(t){var e;for(e in t)return!1;return!0},k.inArray=function(t,e,i){return M.indexOf.call(e,t,i)},k.camelCase=G,k.trim=function(t){return null==t?"":String.prototype.trim.call(t)}
// plugin compatibility
,k.uuid=0,k.support={},k.expr={},k.map=function(t,e){var i,n=[],a,s;if(d(t))for(a=0;a<t.length;a++)null!=(i=e(t[a],a))&&n.push(i);else for(s in t)null!=(i=e(t[s],s))&&n.push(i);return c(n)},k.each=function(t,e){var i,n;if(d(t)){for(i=0;i<t.length;i++)if(!1===e.call(t[i],i,t[i]))return t}else for(n in t)if(!1===e.call(t[n],n,t[n]))return t;return t},k.grep=function(t,e){return E.call(t,e)},window.JSON&&(k.parseJSON=JSON.parse),
// Populate the class2type map
k.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(t,e){Q["[object "+e+"]"]=e.toLowerCase()}),
// Define methods that will be available on all
// Zepto collections
k.fn={
// Because a collection acts like an array
// copy over these useful array functions.
forEach:M.forEach,reduce:M.reduce,push:M.push,sort:M.sort,indexOf:M.indexOf,concat:M.concat,
// `map` and `slice` in the jQuery API work differently
// from their array counterparts
map:function(i){return k(k.map(this,function(t,e){return i.call(t,e,t)}))},slice:function(){return k(D.apply(this,arguments))},ready:function(t){
// need to check if document.body exists for IE as that browser reports
// document ready when it hasn't yet created the body element
return H.test(S.readyState)&&S.body?t(k):S.addEventListener("DOMContentLoaded",function(){t(k)},!1),this},get:function(t){return t===w?D.call(this):this[0<=t?t:t+this.length]},toArray:function(){return this.get()},size:function(){return this.length},remove:function(){return this.each(function(){null!=this.parentNode&&this.parentNode.removeChild(this)})},each:function(i){return M.every.call(this,function(t,e){return!1!==i.call(t,e,t)}),this},filter:function(e){return o(e)?this.not(this.not(e)):k(E.call(this,function(t){return Z.matches(t,e)}))},add:function(t,e){return k(J(this.concat(k(t,e))))},is:function(t){return 0<this.length&&Z.matches(this[0],t)},not:function(e){var i=[];if(o(e)&&e.call!==w)this.each(function(t){e.call(this,t)||i.push(this)});else{var n="string"==typeof e?this.filter(e):d(e)&&o(e.item)?D.call(e):k(e);this.forEach(function(t){n.indexOf(t)<0&&i.push(t)})}return k(i)},has:function(t){return this.filter(function(){return n(t)?k.contains(this,t):k(this).find(t).size()})},eq:function(t){return-1===t?this.slice(t):this.slice(t,+t+1)},first:function(){var t=this[0];return t&&!n(t)?t:k(t)},last:function(){var t=this[this.length-1];return t&&!n(t)?t:k(t)},find:function(t){var e,i=this;return e="object"==typeof t?k(t).filter(function(){var e=this;return M.some.call(i,function(t){return k.contains(t,e)})}):1==this.length?k(Z.qsa(this[0],t)):this.map(function(){return Z.qsa(this,t)})},closest:function(t,e){var i=this[0],n=!1;for("object"==typeof t&&(n=k(t));i&&!(n?0<=n.indexOf(i):Z.matches(i,t));)i=i!==e&&!l(i)&&i.parentNode;return k(i)},parents:function(t){for(var e=[],i=this;0<i.length;)i=k.map(i,function(t){if((t=t.parentNode)&&!l(t)&&e.indexOf(t)<0)return e.push(t),t});return f(e,t)},parent:function(t){return f(J(this.pluck("parentNode")),t)},children:function(t){return f(this.map(function(){return _(this)}),t)},contents:function(){return this.map(function(){return D.call(this.childNodes)})},siblings:function(t){return f(this.map(function(t,e){return E.call(_(e.parentNode),function(t){return t!==e})}),t)},empty:function(){return this.each(function(){this.innerHTML=""})},
// `pluck` is borrowed from Prototype.js
pluck:function(e){return k.map(this,function(t){return t[e]})},show:function(){return this.each(function(){"none"==this.style.display&&(this.style.display=""),"none"==getComputedStyle(this,"").getPropertyValue("display")&&(this.style.display=t(this.nodeName))})},replaceWith:function(t){return this.before(t).remove()},wrap:function(e){var i=o(e);if(this[0]&&!i)var n=k(e).get(0),a=n.parentNode||1<this.length;return this.each(function(t){k(this).wrapAll(i?e.call(this,t):a?n.cloneNode(!0):n)})},wrapAll:function(t){if(this[0]){var e;
// drill down to the inmost element
for(k(this[0]).before(t=k(t));(e=t.children()).length;)t=e.first();k(t).append(this)}return this},wrapInner:function(a){var s=o(a);return this.each(function(t){var e=k(this),i=e.contents(),n=s?a.call(this,t):a;i.length?i.wrapAll(n):e.append(n)})},unwrap:function(){return this.parent().each(function(){k(this).replaceWith(k(this).children())}),this},clone:function(){return this.map(function(){return this.cloneNode(!0)})},hide:function(){return this.css("display","none")},toggle:function(e){return this.each(function(){var t=k(this);(e===w?"none"==t.css("display"):e)?t.show():t.hide()})},prev:function(t){return k(this.pluck("previousElementSibling")).filter(t||"*")},next:function(t){return k(this.pluck("nextElementSibling")).filter(t||"*")},html:function(i){return 0===arguments.length?0<this.length?this[0].innerHTML:null:this.each(function(t){var e=this.innerHTML;k(this).empty().append(g(this,i,t,e))})},text:function(t){return 0===arguments.length?0<this.length?this[0].textContent:null:this.each(function(){this.textContent=t===w?"":""+t})},attr:function(e,i){var t;return"string"==typeof e&&i===w?0==this.length||1!==this[0].nodeType?w:"value"==e&&"INPUT"==this[0].nodeName?this.val():!(t=this[0].getAttribute(e))&&e in this[0]?this[0][e]:t:this.each(function(t){if(1===this.nodeType)if(n(e))for(b in e)v(this,b,e[b]);else v(this,e,g(this,i,t,this.getAttribute(e)))})},removeAttr:function(t){return this.each(function(){1===this.nodeType&&v(this,t)})},prop:function(e,i){return e=X[e]||e,i===w?this[0]&&this[0][e]:this.each(function(t){this[e]=g(this,i,t,this[e])})},data:function(t,e){var i=this.attr("data-"+t.replace(O,"-$1").toLowerCase(),e);return null!==i?T(i):w},val:function(e){return 0===arguments.length?this[0]&&(this[0].multiple?k(this[0]).find("option").filter(function(){return this.selected}).pluck("value"):this[0].value):this.each(function(t){this.value=g(this,e,t,this.value)})},offset:function(s){if(s)return this.each(function(t){var e=k(this),i=g(this,s,t,e.offset()),n=e.offsetParent().offset(),a={top:i.top-n.top,left:i.left-n.left};"static"==e.css("position")&&(a.position="relative"),e.css(a)});if(0==this.length)return null;var t=this[0].getBoundingClientRect();return{left:t.left+window.pageXOffset,top:t.top+window.pageYOffset,width:Math.round(t.width),height:Math.round(t.height)}},css:function(t,e){if(arguments.length<2){var i=this[0],n=getComputedStyle(i,"");if(!i)return;if("string"==typeof t)return i.style[G(t)]||n.getPropertyValue(t);if(K(t)){var a={};return k.each(K(t)?t:[t],function(t,e){a[e]=i.style[G(e)]||n.getPropertyValue(e)}),a}}var s="";if("string"==r(t))e||0===e?s=u(t)+":"+m(t,e):this.each(function(){this.style.removeProperty(u(t))});else for(b in t)t[b]||0===t[b]?s+=u(b)+":"+m(b,t[b])+";":this.each(function(){this.style.removeProperty(u(b))});return this.each(function(){this.style.cssText+=";"+s})},index:function(t){return t?this.indexOf(k(t)[0]):this.parent().children().indexOf(this[0])},hasClass:function(t){return!!t&&M.some.call(this,function(t){return this.test(y(t))},i(t))},addClass:function(n){return n?this.each(function(t){x=[];var e=y(this),i;g(this,n,t,e).split(/\s+/g).forEach(function(t){k(this).hasClass(t)||x.push(t)},this),x.length&&y(this,e+(e?" ":"")+x.join(" "))}):this},removeClass:function(e){return this.each(function(t){if(e===w)return y(this,"");x=y(this),g(this,e,t,x).split(/\s+/g).forEach(function(t){x=x.replace(i(t)," ")}),y(this,x.trim())})},toggleClass:function(n,a){return n?this.each(function(t){var e=k(this),i;g(this,n,t,y(this)).split(/\s+/g).forEach(function(t){(a===w?!e.hasClass(t):a)?e.addClass(t):e.removeClass(t)})}):this},scrollTop:function(t){if(this.length){var e="scrollTop"in this[0];return t===w?e?this[0].scrollTop:this[0].pageYOffset:this.each(e?function(){this.scrollTop=t}:function(){this.scrollTo(this.scrollX,t)})}},scrollLeft:function(t){if(this.length){var e="scrollLeft"in this[0];return t===w?e?this[0].scrollLeft:this[0].pageXOffset:this.each(e?function(){this.scrollLeft=t}:function(){this.scrollTo(t,this.scrollY)})}},position:function(){if(this.length){var t=this[0],
// Get *real* offsetParent
e=this.offsetParent(),
// Get correct offsets
i=this.offset(),n=j.test(e[0].nodeName)?{top:0,left:0}:e.offset();
// Subtract element margins
// note: when an element has margin: auto the offsetLeft and marginLeft
// are the same in Safari causing offset.left to incorrectly be 0
// Subtract the two offsets
return i.top-=parseFloat(k(t).css("margin-top"))||0,i.left-=parseFloat(k(t).css("margin-left"))||0,
// Add offsetParent borders
n.top+=parseFloat(k(e[0]).css("border-top-width"))||0,n.left+=parseFloat(k(e[0]).css("border-left-width"))||0,{top:i.top-n.top,left:i.left-n.left}}},offsetParent:function(){return this.map(function(){for(var t=this.offsetParent||S.body;t&&!j.test(t.nodeName)&&"static"==k(t).css("position");)t=t.offsetParent;return t})}},
// for now
k.fn.detach=k.fn.remove,["width","height"].forEach(function(n){var a=n.replace(/./,function(t){return t[0].toUpperCase()});k.fn[n]=function(e){var t,i=this[0];return e===w?s(i)?i["inner"+a]:l(i)?i.documentElement["scroll"+a]:(t=this.offset())&&t[n]:this.each(function(t){(i=k(this)).css(n,g(this,e,t,i[n]()))})}}),B.forEach(function(e,s){var o=s%2;//=> prepend, append
k.fn[e]=function(){
// arguments can be nodes, arrays of nodes, Zepto objects and HTML strings
var e,i=k.map(arguments,function(t){return"object"==(e=r(t))||"array"==e||null==t?t:Z.fragment(t)}),n,a=1<this.length;return i.length<1?this:this.each(function(t,e){n=o?e:e.parentNode,
// convert all methods to a "before" operation
e=0==s?e.nextSibling:1==s?e.firstChild:2==s?e:null,i.forEach(function(t){if(a)t=t.cloneNode(!0);else if(!n)return k(t).remove();L(n.insertBefore(t,e),function(t){null==t.nodeName||"SCRIPT"!==t.nodeName.toUpperCase()||t.type&&"text/javascript"!==t.type||t.src||window.eval.call(window,t.innerHTML)})})})}
// after    => insertAfter
// prepend  => prependTo
// before   => insertBefore
// append   => appendTo
,k.fn[o?e+"To":"insert"+(s?"Before":"After")]=function(t){return k(t)[e](this),this}}),Z.Z.prototype=k.fn,
// Export internal API functions in the `$.zepto` namespace
Z.uniq=J,Z.deserializeValue=T,k.zepto=Z,k}(),Um;window.Zepto=vc,void 0===window.$&&(window.$=vc),function(d){function c(t){return t._zid||(t._zid=e++)}function o(t,e,i,n){if((e=u(e)).ns)var a=s(e.ns);return(w[c(t)]||[]).filter(function(t){return t&&(!e.e||t.e==e.e)&&(!e.ns||a.test(t.ns))&&(!i||c(t.fn)===c(i))&&(!n||t.sel==n)})}function u(t){var e=(""+t).split(".");return{e:e[0],ns:e.slice(1).sort().join(" ")}}function s(t){return new RegExp("(?:^| )"+t.replace(" "," .* ?")+"(?: |$)")}function m(t,e){return t.del&&!i&&t.e in n||!!e}function _(t){return b[t]||i&&n[t]||t}function h(a,t,e,s,o,r,l){var i=c(a),h=w[i]||(w[i]=[]);t.split(/\s/).forEach(function(t){if("ready"==t)return d(document).ready(e);var i=u(t);i.fn=e,i.sel=o,
// emulate mouseenter, mouseleave
i.e in b&&(e=function(t){var e=t.relatedTarget;if(!e||e!==this&&!d.contains(this,e))return i.fn.apply(this,arguments)});var n=(i.del=r)||e;i.proxy=function(t){if(!(t=f(t)).isImmediatePropagationStopped()){t.data=s;var e=n.apply(a,t._args==v?[t]:[t].concat(t._args));return!1===e&&(t.preventDefault(),t.stopPropagation()),e}},i.i=h.length,h.push(i),"addEventListener"in a&&a.addEventListener(_(i.e),i.proxy,m(i,l))})}function p(e,t,i,n,a){var s=c(e);(t||"").split(/\s/).forEach(function(t){o(e,t,i,n).forEach(function(t){delete w[s][t.i],"removeEventListener"in e&&e.removeEventListener(_(t.e),t.proxy,m(t,a))})})}function f(n,a){return!a&&n.isDefaultPrevented||(a||(a=n),d.each(x,function(t,e){var i=a[t];n[t]=function(){return this[e]=l,i&&i.apply(a,arguments)},n[e]=k}),(a.defaultPrevented!==v?a.defaultPrevented:"returnValue"in a?!1===a.returnValue:a.getPreventDefault&&a.getPreventDefault())&&(n.isDefaultPrevented=l)),n}function g(t){var e,i={originalEvent:t};for(e in t)a.test(e)||t[e]===v||(i[e]=t[e]);return f(i,t)}var t=d.zepto.qsa,e=1,v,y=Array.prototype.slice,T=d.isFunction,L=function(t){return"string"==typeof t},w={},r={},i="onfocusin"in window,n={focus:"focusin",blur:"focusout"},b={mouseenter:"mouseover",mouseleave:"mouseout"};r.click=r.mousedown=r.mouseup=r.mousemove="MouseEvents",d.event={add:h,remove:p},d.proxy=function(t,e){if(T(t)){var i=function(){return t.apply(e,arguments)};return i._zid=c(t),i}if(L(e))return d.proxy(t[e],t);throw new TypeError("expected function")},d.fn.bind=function(t,e,i){return this.on(t,e,i)},d.fn.unbind=function(t,e){return this.off(t,e)},d.fn.one=function(t,e,i,n){return this.on(t,e,i,n,1)};var l=function(){return!0},k=function(){return!1},a=/^([A-Z]|returnValue$|layer[XY]$)/,x={preventDefault:"isDefaultPrevented",stopImmediatePropagation:"isImmediatePropagationStopped",stopPropagation:"isPropagationStopped"};d.fn.delegate=function(t,e,i){return this.on(e,t,i)},d.fn.undelegate=function(t,e,i){return this.off(e,t,i)},d.fn.live=function(t,e){return d(document.body).delegate(this.selector,t,e),this},d.fn.die=function(t,e){return d(document.body).undelegate(this.selector,t,e),this},d.fn.on=function(e,a,i,s,o){var r,l,n=this;return e&&!L(e)?(d.each(e,function(t,e){n.on(t,a,i,e,o)}),n):(L(a)||T(s)||!1===s||(s=i,i=a,a=v),(T(i)||!1===i)&&(s=i,i=v),!1===s&&(s=k),n.each(function(t,n){o&&(r=function(t){return p(n,t.type,s),s.apply(this,arguments)}),a&&(l=function(t){var e,i=d(t.target).closest(a,n).get(0);if(i&&i!==n)return e=d.extend(g(t),{currentTarget:i,liveFired:n}),(r||s).apply(i,[e].concat(y.call(arguments,1)))}),h(n,e,s,i,a,l||r)}))},d.fn.off=function(t,i,e){var n=this;return t&&!L(t)?(d.each(t,function(t,e){n.off(t,i,e)}),n):(L(i)||T(e)||!1===e||(e=i,i=v),!1===e&&(e=k),n.each(function(){p(this,t,e,i)}))},d.fn.trigger=function(t,e){return(t=L(t)||d.isPlainObject(t)?d.Event(t):f(t))._args=e,this.each(function(){
// items in the collection might not be DOM elements
"dispatchEvent"in this?this.dispatchEvent(t):d(this).triggerHandler(t,e)})}
// triggers event handlers on current element just as if an event occurred,
// doesn't trigger an actual event, doesn't bubble
,d.fn.triggerHandler=function(i,n){var a,s;return this.each(function(t,e){(a=g(L(i)?d.Event(i):i))._args=n,a.target=e,d.each(o(e,i.type||i),function(t,e){if(s=e.proxy(a),a.isImmediatePropagationStopped())return!1})}),s}
// shortcut methods for `.bind(event, fn)` for each event type
,"focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select keydown keypress keyup error".split(" ").forEach(function(e){d.fn[e]=function(t){return t?this.bind(e,t):this.trigger(e)}}),["focus","blur"].forEach(function(e){d.fn[e]=function(t){return t?this.bind(e,t):this.each(function(){try{this[e]()}catch(t){}}),this}}),d.Event=function(t,e){L(t)||(t=(e=t).type);var i=document.createEvent(r[t]||"Events"),n=!0;if(e)for(var a in e)"bubbles"==a?n=!!e[a]:i[a]=e[a];return i.initEvent(t,n,!0),f(i)}}(vc),function(xk){
// trigger a custom event and return false if it was cancelled
function Ik(t,e,i){var n=xk.Event(e);return xk(t).trigger(n,i),!n.isDefaultPrevented()}
// trigger an Ajax "global" event
function Jk(t,e,i,n){if(t.global)return Ik(e||zk,i,n)}
// Number of active Ajax requests
function Kk(t){t.global&&0==xk.active++&&Jk(t,null,"ajaxStart")}function Lk(t){t.global&&!--xk.active&&Jk(t,null,"ajaxStop")}
// triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable
function Mk(t,e){var i=e.context;if(!1===e.beforeSend.call(i,t,e)||!1===Jk(e,i,"ajaxBeforeSend",[t,e]))return!1;Jk(e,i,"ajaxSend",[t,e])}function Nk(t,e,i,n){var a=i.context,s="success";i.success.call(a,t,s,e),n&&n.resolveWith(a,[t,s,e]),Jk(i,a,"ajaxSuccess",[e,i,t]),Pk(s,e,i)}
// type: "timeout", "error", "abort", "parsererror"
function Ok(t,e,i,n,a){var s=n.context;n.error.call(s,i,e,t),a&&a.rejectWith(s,[i,e,t]),Jk(n,s,"ajaxError",[i,n,t||e]),Pk(e,i,n)}
// status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
function Pk(t,e,i){var n=i.context;i.complete.call(n,e,t),Jk(i,n,"ajaxComplete",[e,i]),Lk(i)}
// Empty function, used as default callback
function Qk(){}function Rk(t){return t&&(t=t.split(";",2)[0]),t&&(t==Gk?"html":t==Fk?"json":Dk.test(t)?"script":Ek.test(t)&&"xml")||"text"}function Sk(t,e){return""==e?t:(t+"&"+e).replace(/[&?]{1,2}/,"?")}
// serialize payload and append it to the URL for GET requests
function Tk(t){t.processData&&t.data&&"string"!=xk.type(t.data)&&(t.data=xk.param(t.data,t.traditional)),!t.data||t.type&&"GET"!=t.type.toUpperCase()||(t.url=Sk(t.url,t.data),t.data=void 0)}
// handle optional data/success arguments
function Uk(t,e,i,n){var a=!xk.isFunction(e);return{url:t,data:a?e:void 0,success:a?xk.isFunction(i)?i:void 0:e,dataType:a&&n||i}}function Wk(i,t,n,a){var s,o=xk.isArray(t),r=xk.isPlainObject(t);xk.each(t,function(t,e){s=xk.type(e),a&&(t=n?a:a+"["+(r||"object"==s||"array"==s?t:"")+"]"),
// handle data in serializeArray() format
!a&&o?i.add(e.name,e.value):"array"==s||!n&&"object"==s?Wk(i,e,n,t):i.add(t,e)})}var yk=0,zk=window.document,Ak,Bk,Ck=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,Dk=/^(?:text|application)\/javascript/i,Ek=/^(?:text|application)\/xml/i,Fk="application/json",Gk="text/html",Hk=/^\s*$/;xk.active=0,xk.ajaxJSONP=function(i,n){if(!("type"in i))return xk.ajax(i);var t=i.jsonpCallback,a=(xk.isFunction(t)?t():t)||"jsonp"+ ++yk,s=zk.createElement("script"),o=window[a],r,e=function(t){xk(s).triggerHandler("error",t||"abort")},l={abort:e},h;return n&&n.promise(l),xk(s).on("load error",function(t,e){clearTimeout(h),xk(s).off().remove(),"error"!=t.type&&r?Nk(r[0],l,i,n):Ok(null,e||"error",l,i,n),window[a]=o,r&&xk.isFunction(o)&&o(r[0]),o=r=void 0}),!1===Mk(l,i)?e("abort"):(window[a]=function(){r=arguments},s.src=i.url.replace(/\?(.+)=\?/,"?$1="+a),zk.head.appendChild(s),0<i.timeout&&(h=setTimeout(function(){e("timeout")},i.timeout))),l},xk.ajaxSettings={
// Default type of request
type:"GET",
// Callback that is executed before request
beforeSend:Qk,
// Callback that is executed if the request succeeds
success:Qk,
// Callback that is executed the the server drops error
error:Qk,
// Callback that is executed on request complete (both: error and success)
complete:Qk,
// The context for the callbacks
context:null,
// Whether to trigger "global" Ajax events
global:!0,
// Transport
xhr:function(){return new window.XMLHttpRequest},
// MIME types mapping
// IIS returns Javascript as "application/x-javascript"
accepts:{script:"text/javascript, application/javascript, application/x-javascript",json:Fk,xml:"application/xml, text/xml",html:Gk,text:"text/plain"},
// Whether the request is to another domain
crossDomain:!1,
// Default timeout
timeout:0,
// Whether data should be serialized to string
processData:!0,
// Whether the browser should be allowed to cache GET responses
cache:!0},xk.ajax=function(Pl){var Ql=xk.extend({},Pl||{}),Rl=xk.Deferred&&xk.Deferred();for(Ak in xk.ajaxSettings)void 0===Ql[Ak]&&(Ql[Ak]=xk.ajaxSettings[Ak]);Kk(Ql),Ql.crossDomain||(Ql.crossDomain=/^([\w-]+:)?\/\/([^\/]+)/.test(Ql.url)&&RegExp.$2!=window.location.host),Ql.url||(Ql.url=window.location.toString()),Tk(Ql),!1===Ql.cache&&(Ql.url=Sk(Ql.url,"_="+Date.now()));var Sl=Ql.dataType,Tl=/\?.+=\?/.test(Ql.url);if("jsonp"==Sl||Tl)return Tl||(Ql.url=Sk(Ql.url,Ql.jsonp?Ql.jsonp+"=?":!1===Ql.jsonp?"":"callback=?")),xk.ajaxJSONP(Ql,Rl);var Ul=Ql.accepts[Sl],Vl={},Wl=function(t,e){Vl[t.toLowerCase()]=[t,e]},Xl=/^([\w-]+:)\/\//.test(Ql.url)?RegExp.$1:window.location.protocol,Yl=Ql.xhr(),Zl=Yl.setRequestHeader,$l;if(Rl&&Rl.promise(Yl),Ql.crossDomain||Wl("X-Requested-With","XMLHttpRequest"),Wl("Accept",Ul||"*/*"),(Ul=Ql.mimeType||Ul)&&(-1<Ul.indexOf(",")&&(Ul=Ul.split(",",2)[0]),Yl.overrideMimeType&&Yl.overrideMimeType(Ul)),(Ql.contentType||!1!==Ql.contentType&&Ql.data&&"GET"!=Ql.type.toUpperCase())&&Wl("Content-Type",Ql.contentType||"application/x-www-form-urlencoded"),Ql.headers)for(Bk in Ql.headers)Wl(Bk,Ql.headers[Bk]);if(Yl.setRequestHeader=Wl,!(Yl.onreadystatechange=function(){if(4==Yl.readyState){Yl.onreadystatechange=Qk,clearTimeout($l);var cm,dm=!1;if(200<=Yl.status&&Yl.status<300||304==Yl.status||0==Yl.status&&"file:"==Xl){Sl=Sl||Rk(Ql.mimeType||Yl.getResponseHeader("content-type")),cm=Yl.responseText;try{
// http://perfectionkills.com/global-eval-what-are-the-options/
"script"==Sl?eval(cm):"xml"==Sl?cm=Yl.responseXML:"json"==Sl&&(cm=Hk.test(cm)?null:xk.parseJSON(cm))}catch(t){dm=t}dm?Ok(dm,"parsererror",Yl,Ql,Rl):Nk(cm,Yl,Ql,Rl)}else Ok(Yl.statusText||null,Yl.status?"error":"abort",Yl,Ql,Rl)}})===Mk(Yl,Ql))return Yl.abort(),Ok(null,"abort",Yl,Ql,Rl),Yl;if(Ql.xhrFields)for(Bk in Ql.xhrFields)Yl[Bk]=Ql.xhrFields[Bk];var _l=!("async"in Ql)||Ql.async;for(Bk in Yl.open(Ql.type,Ql.url,_l,Ql.username,Ql.password),Vl)Zl.apply(Yl,Vl[Bk]);return 0<Ql.timeout&&($l=setTimeout(function(){Yl.onreadystatechange=Qk,Yl.abort(),Ok(null,"timeout",Yl,Ql,Rl)},Ql.timeout)),
// avoid sending empty string (#319)
Yl.send(Ql.data?Ql.data:null),Yl},xk.get=function(t,e,i,n){return xk.ajax(Uk.apply(null,arguments))},xk.post=function(t,e,i,n){var a=Uk.apply(null,arguments);return a.type="POST",xk.ajax(a)},xk.getJSON=function(t,e,i){var n=Uk.apply(null,arguments);return n.dataType="json",xk.ajax(n)},xk.fn.load=function(t,e,i){if(!this.length)return this;var n=this,a=t.split(/\s/),s,o=Uk(t,e,i),r=o.success;return 1<a.length&&(o.url=a[0],s=a[1]),o.success=function(t){n.html(s?xk("<div>").html(t.replace(Ck,"")).find(s):t),r&&r.apply(n,arguments)},xk.ajax(o),this};var Vk=encodeURIComponent;xk.param=function(t,e){var i=[];return i.add=function(t,e){this.push(Vk(t)+"="+Vk(e))},Wk(i,t,e),i.join("&").replace(/%20/g,"+")}}(vc),(Um=vc).fn.serializeArray=function(){var e=[],i;return Um([].slice.call(this.get(0).elements)).each(function(){var t=(i=Um(this)).attr("type");"fieldset"!=this.nodeName.toLowerCase()&&!this.disabled&&"submit"!=t&&"reset"!=t&&"button"!=t&&("radio"!=t&&"checkbox"!=t||this.checked)&&e.push({name:i.attr("name"),value:i.val()})}),e},Um.fn.serialize=function(){var e=[];return this.serializeArray().forEach(function(t){e.push(encodeURIComponent(t.name)+"="+encodeURIComponent(t.value))}),e.join("&")},Um.fn.submit=function(t){if(t)this.bind("submit",t);else if(this.length){var e=Um.Event("submit");this.eq(0).trigger(e),e.isDefaultPrevented()||this.get(0).submit()}return this},function(i){
// __proto__ doesn't exist on IE<11, so redefine
// the Z function to use object extension instead
"__proto__"in{}||i.extend(i.zepto,{Z:function(t,e){return t=t||[],i.extend(t,i.fn),t.selector=e||"",t.__Z=!0,t},
// this is a kludge but works
isZ:function(t){return"array"===i.type(t)&&"__Z"in t}});
// getComputedStyle shouldn't freak out when called
// without a valid element as argument
try{getComputedStyle(void 0)}catch(t){var n=getComputedStyle;window.getComputedStyle=function(t,e){try{return n(t,e)}catch(t){return null}}}}(vc),uc.getJSON=vc.getJSON,uc.ajax=vc.ajax}(TL),
/*	TL.Class
	Class powers the OOP facilities of the library.
================================================== */
TL.Class=function(){},TL.Class.extend=function(/*Object*/t){
// extended class with the new prototype
var e=function(){this.initialize&&this.initialize.apply(this,arguments)},i=function(){};
// instantiate class without calling constructor
i.prototype=this.prototype;var n=new i;
// add class name
//proto.className = props;
//inherit parent's statics
for(var a in(n.constructor=e).prototype=n,
// add superclass access
e.superclass=this.prototype,this)this.hasOwnProperty(a)&&"prototype"!==a&&"superclass"!==a&&(e[a]=this[a]);
// mix static properties into the class
return t.statics&&(TL.Util.extend(e,t.statics),delete t.statics),
// mix includes into the prototype
t.includes&&(TL.Util.extend.apply(null,[n].concat(t.includes)),delete t.includes),
// merge options
t.options&&n.options&&(t.options=TL.Util.extend({},n.options,t.options)),
// mix given properties into the prototype
TL.Util.extend(n,t),
// allow inheriting further
e.extend=TL.Class.extend,
// method for adding properties to prototype
e.include=function(t){TL.Util.extend(this.prototype,t)},e},
/*	TL.Events
	adds custom events functionality to TL classes
================================================== */
TL.Events={addEventListener:function(/*String*/t,/*Function*/e,/*(optional) Object*/i){var n=this._tl_events=this._tl_events||{};return n[t]=n[t]||[],n[t].push({action:e,context:i||this}),this},hasEventListeners:function(/*String*/t){var e="_tl_events";return e in this&&t in this[e]&&0<this[e][t].length},removeEventListener:function(/*String*/t,/*Function*/e,/*(optional) Object*/i){if(!this.hasEventListeners(t))return this;for(var n=0,a=this._tl_events,s=a[t].length;n<s;n++)if(a[t][n].action===e&&(!i||a[t][n].context===i))return a[t].splice(n,1),this;return this},fireEvent:function(/*String*/t,/*(optional) Object*/e){if(!this.hasEventListeners(t))return this;for(var i=TL.Util.mergeData({type:t,target:this},e),n=this._tl_events[t].slice(),a=0,s=n.length;a<s;a++)n[a].action.call(n[a].context||this,i);return this}},TL.Events.on=TL.Events.addEventListener,TL.Events.off=TL.Events.removeEventListener,TL.Events.fire=TL.Events.fireEvent,
/*
	Based on Leaflet Browser
	TL.Browser handles different browser and feature detections for internal  use.
*/
function(){var t=navigator.userAgent.toLowerCase(),e=document.documentElement,i="ActiveXObject"in window,n=-1!==t.indexOf("webkit"),a=-1!==t.indexOf("phantom"),s=-1!==t.search("android [23]"),o="undefined"!=typeof orientation,r=navigator.msPointerEnabled&&navigator.msMaxTouchPoints&&!window.PointerEvent,l=window.PointerEvent&&navigator.pointerEnabled&&navigator.maxTouchPoints||r,h=i&&"transition"in e.style,d="WebKitCSSMatrix"in window&&"m11"in new window.WebKitCSSMatrix&&!s,c="MozPerspective"in e.style,u="OTransition"in e.style,m=window.opera,_="devicePixelRatio"in window&&1<window.devicePixelRatio;if(!_&&"matchMedia"in window){var p=window.matchMedia("(min-resolution:144dpi)");_=p&&p.matches}var f=!window.L_NO_TOUCH&&!a&&(l||"ontouchstart"in window||window.DocumentTouch&&document instanceof window.DocumentTouch);TL.Browser={ie:i,ua:t,ie9:Boolean(i&&t.match(/MSIE 9/i)),ielt9:i&&!document.addEventListener,webkit:n,
//gecko: (ua.indexOf('gecko') !== -1) && !webkit && !window.opera && !ie,
firefox:-1!==t.indexOf("gecko")&&!n&&!window.opera&&!i,android:-1!==t.indexOf("android"),android23:s,chrome:-1!==t.indexOf("chrome"),edge:-1!==t.indexOf("edge/"),ie3d:h,webkit3d:d,gecko3d:c,opera3d:u,any3d:!window.L_DISABLE_3D&&(h||d||c||u)&&!a,mobile:o,mobileWebkit:o&&n,mobileWebkit3d:o&&d,mobileOpera:o&&window.opera,touch:!!f,msPointer:!!r,pointer:!!l,retina:!!_,orientation:function(){var t=window.innerWidth,e,i="portrait";return window.innerHeight<t&&(i="landscape"),Math.abs(window.orientation),trace(i),i}}}(),
/*	TL.Load
	Loads External Javascript and CSS
================================================== */
TL.Load=function(t){function a(t){var e=0,i=!1;for(e=0;e<n.length;e++)n[e]==t&&(i=!0);return!!i||(n.push(t),!1)}var n=[];return{css:function(t,e,i,n){a(t)?e():TL.LoadIt.css(t,e,i,n)},js:function(t,e,i,n){a(t)?e():TL.LoadIt.js(t,e,i,n)}}}(this.document),
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
TL.LoadIt=function(_){
// -- Private Methods --------------------------------------------------------
/**
  Creates and returns an HTML element with the specified name and attributes.

  @method createNode
  @param {String} name element name
  @param {Object} attrs name/value mapping of element attributes
  @return {HTMLElement}
  @private
  */
function p(t,e){var i=_.createElement(t),n;for(n in e)e.hasOwnProperty(n)&&i.setAttribute(n,e[n]);return i}
/**
  Called when the current pending resource of the specified type has finished
  loading. Executes the associated callback (if any) and loads the next
  resource in the queue.

  @method finish
  @param {String} type resource type ('css' or 'js')
  @private
  */function f(t){var e=w[t],i,n;e&&(i=e.callback,(n=e.urls).shift(),s=0,
// If this is the last of the pending URLs, execute the callback and
// start the next request in the queue (if any).
n.length||(i&&i.call(e.context,e.obj),w[t]=null,b[t].length&&a(t)))}
/**
  Populates the <code>env</code> variable with user agent and feature test
  information.

  @method getEnv
  @private
  */function g(){var t=navigator.userAgent;((T={
// True if this browser supports disabling async mode on dynamically
// created script nodes. See
// http://wiki.whatwg.org/wiki/Dynamic_Script_Execution_Order
async:!0===_.createElement("script").async}).webkit=/AppleWebKit\//.test(t))||(T.ie=/MSIE/.test(t))||(T.opera=/Opera/.test(t))||(T.gecko=/Gecko\//.test(t))||(T.unknown=!0)}
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
  */function a(t,e,i,n,a){var s=function(){f(t)},o="css"===t,r=[],l,h,d,c,u,m;if(T||g(),e)
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
if(
// If urls is a string, wrap it in an array. Otherwise assume it's an
// array and create a copy of it so modifications won't be made to the
// original.
e="string"==typeof e?[e]:e.concat(),o||T.async||T.gecko||T.opera)
// Load in parallel.
b[t].push({urls:e,callback:i,obj:n,context:a});else
// Load sequentially.
for(l=0,h=e.length;l<h;++l)b[t].push({urls:[e[l]],callback:l===h-1?i:null,// callback is only added to the last URL
obj:n,context:a});
// If a previous load request of this type is currently in progress, we'll
// wait our turn. Otherwise, grab the next item in the queue.
if(!w[t]&&(c=w[t]=b[t].shift())){for(L||(L=_.head||_.getElementsByTagName("head")[0]),l=0,h=(u=c.urls).length;l<h;++l)m=u[l],o?d=T.gecko?p("style"):p("link",{href:m,rel:"stylesheet"}):(d=p("script",{src:m})).async=!1,d.className="lazyload",d.setAttribute("charset","utf-8"),T.ie&&!o?d.onreadystatechange=function(){/loaded|complete/.test(d.readyState)&&(d.onreadystatechange=null,s())}:o&&(T.gecko||T.webkit)?
// Gecko and WebKit don't support the onload event on link nodes.
T.webkit?(
// In WebKit, we can poll for changes to document.styleSheets to
// figure out when stylesheets have loaded.
c.urls[l]=d.href,// resolve relative URLs (or polling won't work)
y()):(
// In Gecko, we can import the requested URL into a <style> node and
// poll for the existence of node.sheet.cssRules. Props to Zach
// Leatherman for calling my attention to this technique.
d.innerHTML='@import "'+m+'";',v(d)):d.onload=d.onerror=s,r.push(d);for(l=0,h=r.length;l<h;++l)L.appendChild(r[l])}}
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
  */function v(e){var i;try{
// We don't really need to store this value or ever refer to it again, but
// if we don't store it, Closure Compiler assumes the code is useless and
// removes it.
i=!!e.sheet.cssRules}catch(t){
// An exception means the stylesheet is still loading.
return void((s+=1)<200?setTimeout(function(){v(e)},50):
// We've been polling for 10 seconds and nothing's happened. Stop
// polling and finish the pending requests to avoid blocking further
// requests.
i&&f("css"))}
// If we get here, the stylesheet has loaded.
f("css")}
/**
  Begins polling to determine when pending stylesheets have finished loading
  in WebKit. Polling stops when all pending stylesheets have loaded or after 10
  seconds (to prevent stalls).

  @method pollWebKit
  @private
  */function y(){var t=w.css,e;if(t){
// Look for a stylesheet matching the pending URL.
for(e=i.length;0<=--e;)if(i[e].href===t.urls[0]){f("css");break}s+=1,t&&(s<200?setTimeout(y,50):
// We've been polling for 10 seconds and nothing's happened, which may
// indicate that the stylesheet has been removed from the document
// before it had a chance to load. Stop polling and finish the pending
// request to prevent blocking further requests.
f("css"))}}
// -- Private Variables ------------------------------------------------------
// User agent and feature test information.
var T,
// Reference to the <head> element (populated lazily).
L,
// Requests currently in progress, if any.
w={},
// Number of times we've polled to check whether a pending stylesheet has
// finished loading. If this gets too high, we're probably stalled.
s=0,
// Queued requests.
b={css:[],js:[]},
// Reference to the browser's list of stylesheets.
i=_.styleSheets;return{
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
css:function(t,e,i,n){a("css",t,e,i,n)},
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
js:function(t,e,i,n){a("js",t,e,i,n)}}}(this.document),
/*  TL.TimelineConfig
separate the configuration from the display (TL.Timeline)
to make testing easier
================================================== */
TL.TimelineConfig=TL.Class.extend({includes:[],initialize:function(t){
// Initialize the data
if(this.title="",this.scale="",this.events=[],this.eras=[],this.event_dict={},// despite name, all slides (events + title) indexed by slide.unique_id
this.messages={errors:[],warnings:[]},"object"==typeof t&&t.events){if(this.scale=t.scale,this.events=[],this._ensureValidScale(t.events),t.title){var e=this._assignID(t.title);this._tidyFields(t.title),this.title=t.title,this.event_dict[e]=this.title}for(var i=0;i<t.events.length;i++)try{this.addEvent(t.events[i],!0)}catch(t){this.logError(t)}if(t.eras)for(var i=0;i<t.eras.length;i++)try{this.addEra(t.eras[i],!0)}catch(t){this.logError("Era "+i+": "+t)}TL.DateUtil.sortByDate(this.events),TL.DateUtil.sortByDate(this.eras)}},logError:function(t){trace(t),this.messages.errors.push(t)},
/*
	 * Return any accumulated error messages. If `sep` is passed, it should be a string which will be used to join all messages, resulting in a string return value. Otherwise,
	 * errors will be returned as an array.
	 */
getErrors:function(t){return t?this.messages.errors.join(t):this.messages.errors},
/*
	 * Perform any sanity checks we can before trying to use this to make a timeline. Returns nothing, but errors will be logged
	 * such that after this is called, one can test `this.isValid()` to see if everything is OK.
	 */
validate:function(){void 0!==this.events&&void 0!==this.events.length&&0!=this.events.length||this.logError("Timeline configuration has no events.");
// make sure all eras have start and end dates
for(var t=0;t<this.eras.length;t++){var e;if(void 0===this.eras[t].start_date||void 0===this.eras[t].end_date)e=this.eras[t].text&&this.eras[t].text.headline?this.eras[t].text.headline:"era "+(t+1),this.logError("All eras must have start and end dates. ["+e+"]")}},isValid:function(){return 0==this.messages.errors.length},
/* Add an event (including cleaning/validation) and return the unique id.
	* All event data validation should happen in here.
	* Throws: TL.Error for any validation problems.
	*/
addEvent:function(t,e){var i=this._assignID(t);if(void 0===t.start_date)throw new TL.Error("missing_start_date_err",i);return this._processDates(t),this._tidyFields(t),this.events.push(t),this.event_dict[i]=t,e||TL.DateUtil.sortByDate(this.events),i},addEra:function(t,e){var i=this._assignID(t);if(void 0===t.start_date)throw new TL.Error("missing_start_date_err",i);return this._processDates(t),this._tidyFields(t),this.eras.push(t),this.event_dict[i]=t,e||TL.DateUtil.sortByDate(this.eras),i},
/**
	 * Given a slide, verify that its ID is unique, or assign it one which is.
	 * The assignment happens in this function, and the assigned ID is also
	 * the return value. Not thread-safe, because ids are not reserved
	 * when assigned here.
	 */
_assignID:function(t){var e=t.unique_id;return TL.Util.trim(e)||(
// give it an ID if it doesn't have one
e=t.text?TL.Util.slugify(t.text.headline):null),
// make sure it's unique and add it.
t.unique_id=TL.Util.ensureUniqueKey(this.event_dict,e),t.unique_id},
/**
	 * Given an array of slide configs (the events), ensure that each one has a distinct unique_id. The id of the title
	 * is also passed in because in most ways it functions as an event slide, and the event IDs must also all be unique
	 * from the title ID.
	 */
_makeUniqueIdentifiers:function(t,e){
// establish which IDs are assigned and if any appear twice, clear out successors.
for(var i=[t],n=0;n<e.length;n++)TL.Util.trim(e[n].unique_id)&&(e[n].unique_id=TL.Util.slugify(e[n].unique_id),// enforce valid
-1==i.indexOf(e[n].unique_id)?i.push(e[n].unique_id):// it was already used, wipe it out
e[n].unique_id="");if(i.length!=e.length+1)
// at least some are yet to be assigned
for(var n=0;n<e.length;n++)if(!e[n].unique_id){
// use the headline for the unique ID if it's available
var a=e[n].text?TL.Util.slugify(e[n].text.headline):null;a||(a=TL.Util.unique_ID(6)),-1!=i.indexOf(a)&&(a=a+"-"+n),i.push(a),e[n].unique_id=a}},_ensureValidScale:function(t){if(!this.scale){trace("Determining scale dynamically"),this.scale="human";// default to human unless there's a slide which is explicitly 'cosmological' or one which has a cosmological year
for(var e=0;e<t.length;e++){if("cosmological"==t[e].scale){this.scale="cosmological";break}if(t[e].start_date&&void 0!==t[e].start_date.year){var i,n=new TL.BigDate(t[e].start_date).data.date_obj.year;if(n<-271820||275759<n){this.scale="cosmological";break}}}}var a;TL.DateUtil.SCALE_DATE_CLASSES[this.scale]||this.logError("Don't know how to process dates on scale "+this.scale)},
/*
	   Given a thing which has a start_date and optionally an end_date, make sure that it is an instance
		 of the correct date class (for human or cosmological scale). For slides, remove redundant end dates
		 (people frequently configure an end date which is the same as the start date).
	 */
_processDates:function(t){var e=TL.DateUtil.SCALE_DATE_CLASSES[this.scale];if(!(t.start_date instanceof e)){var i=t.start_date;
// eliminate redundant end dates.
if(t.start_date=new e(i),void 0!==t.end_date&&!(t.end_date instanceof e)){var n=t.end_date,a=!0;for(property in i)a=a&&i[property]==n[property];a?(trace("End date same as start date is redundant; dropping end date"),delete t.end_date):t.end_date=new e(n)}}},
/**
	 * Return the earliest date that this config knows about, whether it's a slide or an era
	 */
getEarliestDate:function(){
// counting that dates were sorted in initialization
var t=this.events[0].start_date;return this.eras&&0<this.eras.length&&this.eras[0].start_date.isBefore(t)?this.eras[0].start_date:t},
/**
	 * Return the latest date that this config knows about, whether it's a slide or an era, taking end_dates into account.
	 */
getLatestDate:function(){for(var t=[],e=0;e<this.events.length;e++)this.events[e].end_date?t.push({date:this.events[e].end_date}):t.push({date:this.events[e].start_date});for(var e=0;e<this.eras.length;e++)this.eras[e].end_date?t.push({date:this.eras[e].end_date}):t.push({date:this.eras[e].start_date});return TL.DateUtil.sortByDate(t,"date"),t.slice(-1)[0].date},_tidyFields:function(t){function e(t,e,i){i||(i=""),t.hasOwnProperty(e)||(t[e]=i)}t.group&&(t.group=TL.Util.trim(t.group)),t.text||(t.text={}),e(t.text,"text"),e(t.text,"headline")}}),function(h){
/*
     * Convert a URL to a Google Spreadsheet (typically a /pubhtml version but somewhat flexible) into an object with the spreadsheet key (ID) and worksheet ID.

     If `url` is actually a string which is only letters, numbers, '-' and '_', then it's assumed to be an ID already. If we had a more precise way of testing to see if the input argument was a valid key, we might apply it, but I don't know where that's documented.

     If we're pretty sure this isn't a bare key or a url that could be used to find a Google spreadsheet then return null.
     */
function o(t){parts={key:null,worksheet:0};
// key as url parameter (old-fashioned)
var e=/\bkey=([-_A-Za-z0-9]+)&?/i,i=/docs.google.com\/spreadsheets(.*?)\/d\//;// fixing issue of URLs with u/0/d
if(t.match(e))parts.key=t.match(e)[1];
// can we get a worksheet from this form?
else if(t.match(i)){var n=t.search(i)+t.match(i)[0].length,a=t.substr(n);parts.key=a.split("/")[0],t.match(/\?gid=(\d+)/)&&(parts.worksheet=t.match(/\?gid=(\d+)/)[1])}else t.match(/^\b[-_A-Za-z0-9]+$/)&&(parts.key=t);return parts.key?parts:null}function n(t){var e={};for(k in t)0==k.indexOf("gsx$")&&(e[k.substr(4)]=t[k].$t);if(h.Util.isEmptyObject(e))return null;var i={media:{caption:e.mediacaption||"",credit:e.mediacredit||"",url:e.media||"",thumbnail:e.mediathumbnail||""},text:{headline:e.headline||"",text:e.text||""},group:e.tag||"",type:e.type||""};return e.startdate&&(i.start_date=h.Date.parseDate(e.startdate)),e.enddate&&(i.end_date=h.Date.parseDate(e.enddate)),i}function a(t){function e(t){if(t)return t.replace(/[\s,]+/g,"");// doesn't handle '.' as comma separator, but how to distinguish that from decimal separator?
}var i={};for(k in t)0==k.indexOf("gsx$")&&(i[k.substr(4)]=h.Util.trim(t[k].$t));if(h.Util.isEmptyObject(i))return null;var n={media:{caption:i.mediacaption||"",credit:i.mediacredit||"",url:i.media||"",thumbnail:i.mediathumbnail||""},text:{headline:i.headline||"",text:i.text||""},start_date:{year:e(i.year),month:e(i.month)||"",day:e(i.day)||""},end_date:{year:e(i.endyear)||"",month:e(i.endmonth)||"",day:e(i.endday)||""},display_date:i.displaydate||"",type:i.type||""};if(i.time&&h.Util.mergeData(n.start_date,h.DateUtil.parseTime(i.time)),i.endtime&&h.Util.mergeData(n.end_date,h.DateUtil.parseTime(i.endtime)),i.group&&(n.group=i.group),""==n.end_date.year){var a=n.end_date;if(delete n.end_date,""!=a.month||""!=a.day||""!=a.time){var s=n.text.headline||trace("Invalid end date for spreadsheet row. Must have a year if any other date fields are specified.");trace(t)}}return i.background&&(i.background.match(/^(https?:)?\/\/?/)?// support http, https, protocol relative, site relative
n.background={url:i.background}:// for now we'll trust it's a color
n.background={color:i.background}),n}function s(t,e){function i(t){if(t)return t.replace(/[\s,]+/g,"");// doesn't handle '.' as comma separator, but how to distinguish that from decimal separator?
}
// console.log(item);
for(var n={},a=1;a<e.length;a++){var s;
// console.log(column_name);
// console.log(column[i]);
// console.log("Column:" + column_name + " Value: " + item[i]);
if(t.length>=a)n[t[a].toLowerCase().replace(" ","")]=e[a]}var o={media:{caption:n.mediacaption||"",credit:n.mediacredit||"",url:n.media||"",thumbnail:n.mediathumbnail||""},text:{headline:n.headline||"",text:n.text||""},start_date:{year:i(e[0]),month:i(e[1])||"",day:i(e[2])||""},end_date:{year:i(n.endyear)||"",month:i(n.endmonth)||"",day:i(n.endday)||""},display_date:n.displaydate||"",type:n.type||""};if(n.time&&h.Util.mergeData(o.start_date,h.DateUtil.parseTime(e[3])),n.endtime&&h.Util.mergeData(o.end_date,h.DateUtil.parseTime(n.endtime)),n.group&&(o.group=n.group),""==o.end_date.year){var r=o.end_date;if(delete o.end_date,""!=r.month||""!=r.day||""!=r.time){var l=o.text.headline||trace("Invalid end date for spreadsheet row. Must have a year if any other date fields are specified.");trace(e)}}
// console.log(event);
return console.log(n.background),n.background&&(n.background.match(/^(https?:)?\/\/?/)?// support http, https, protocol relative, site relative
o.background={url:n.background}:// for now we'll trust it's a color
o.background={color:n.background}),o}var t=function(t){if(void 0===t.feed.entry||0==t.feed.entry.length)throw new h.Error("empty_feed_err");var e=t.feed.entry[0];if(void 0!==e.gsx$startdate)
// check headers V1
// var headers_V1 = ['startdate', 'enddate', 'headline','text','media','mediacredit','mediacaption','mediathumbnail','media','type','tag'];
// for (var i = 0; i < headers_V1.length; i++) {
//     if (typeof entry['gsx$' + headers_V1[i]] == 'undefined') {
//         throw new TL.Error("invalid_data_format_err");
//     }
// }
return n;if(void 0===e.gsx$year)throw new h.Error("invalid_data_format_err");
// check rest of V3 headers
var i=["month","day","time","endmonth","endyear","endday","endtime","displaydate","headline","text","media","mediacredit","mediacaption","mediathumbnail","type","group","background"];
// for (var i = 0; i < headers_V3.length; i++) {
//     if (typeof entry['gsx$' + headers_V3[i]] == 'undefined') {
//         throw new TL.Error("invalid_data_format_err");
//     }
// }
return a},r=function(t){
// var api_3 = "https://spreadsheets.google.com/feeds/list/" + parts.key + "/od6/public/values?alt=json";
var e;return"https://sheets.googleapis.com/v4/spreadsheets/"+t.key+"/values/A1:R1000?key=AIzaSyCInR0kjJJ2Co6aQAXjLBQ14CEHam3K0xg"},l=function(t){var t=r(o(t)),e={events:[]},i=h.ajax({url:t,async:!1});return i=JSON.parse(i.responseText),d(i)},d=function(t){for(var e={events:[],errors:[],warnings:[],eras:[]},i=1;i<t.values.length;i++){var n=s(t.values[0],t.values[i]);if(n){// blank rows return null
var a="event";void 0!==n.type&&(a=n.type,delete n.type),"title"==a?e.title?(e.warnings.push("Multiple title slides detected."),e.events.push(n)):e.title=n:"era"==a?e.eras.push(n):e.events.push(n)}}
// var extract = getGoogleItemExtractor(data);
// for (var i = 0; i < data.feed.entry.length; i++) {
//     try {
//         var event = extract(data.feed.entry[i]);
//         if (event) { // blank rows return null
//           var row_type = 'event';
//           if (typeof(event.type) != 'undefined') {
//               row_type = event.type;
//               delete event.type;
//           }
//           if (row_type == 'title') {
//             if (!timeline_config.title) {
//               timeline_config.title = event;
//             } else {
//               timeline_config.warnings.push("Multiple title slides detected.");
//               timeline_config.events.push(event);
//             }
//           } else if (row_type == 'era') {
//             timeline_config.eras.push(event);
//           } else {
//               timeline_config.events.push(event);
//           }
//         }
//     } catch(e) {
//         if (e.message) {
//             e = e.message;
//         }
//         timeline_config.errors.push(e + " ["+ i +"]");
//     }
// };
return console.log(e.events),e},e=function(t,n){var a,e;if(o(t)){try{var i=l(t)}catch(t){return a=new h.TimelineConfig,"NetworkError"==t.name?a.logError(new h.Error("network_err")):"TL.Error"==t.name?a.logError(t):a.logError(new h.Error("unknown_read_err",t.name)),void n(a)}if(a=new h.TimelineConfig(i),i.errors)for(var s=0;s<i.errors.length;s++)a.logError(i.errors[s]);n(a)}else h.ajax({url:t,dataType:"json",success:function(t){try{a=new h.TimelineConfig(t)}catch(t){(a=new h.TimelineConfig).logError(t)}n(a)},error:function(t,e,i){if(a=new h.TimelineConfig,"parsererror"==e)var i=new h.Error("invalid_url_err");else var i=new h.Error("unknown_read_err",e);a.logError(i),n(a)}})};h.ConfigFactory={
// export for unit testing and use by authoring tool
parseGoogleSpreadsheetURL:o,
// export for unit testing
googleFeedJSONtoTimelineJSON:d,fromGoogle:function(t){return console.warn("TL.ConfigFactory.fromGoogle is deprecated and will be removed soon. Use TL.ConfigFactory.makeConfig(url,callback)"),l(t)},
/*
         * Given a URL to a Timeline data source, read the data, create a TimelineConfig
         * object, and call the given `callback` function passing the created config as
         * the only argument. This should be the main public interface to getting configs
         * from any kind of URL, Google or direct JSON.
         */
makeConfig:e}}(TL),TL.Language=function(t){
// borrowed from http://stackoverflow.com/a/14446414/102476
for(k in TL.Language.languages.en)this[k]=TL.Language.languages.en[k];if(t&&t.language&&"string"==typeof t.language&&"en"!=t.language){var e=t.language;if(!(e in TL.Language.languages)){if(/\.json$/.test(e))var i=e;else{var n="/locale/"+e+".json",a=t.script_path||TL.Timeline.source_path;/\/$/.test(a)&&(n=n.substr(1));var i=a+n}var s=this,o=TL.ajax({url:i,async:!1});if(200!=o.status)throw"Could not load language ["+e+"]: "+o.statusText;TL.Language.languages[e]=JSON.parse(o.responseText)}TL.Util.mergeData(this,TL.Language.languages[e])}},TL.Language.formatNumber=function(t,e){if(e.match(/%(\.(\d+))?f/)){var i=e.match(/%(\.(\d+))?f/),n=i[0];return i[2]&&(t=t.toFixed(i[2])),e.replace(n,t)}
// use mask as literal display value.
return e}
/* TL.Util.mergeData is shallow, we have nested dicts.
   This is a simplistic handling but should work.
 */,TL.Language.prototype.mergeData=function(t){for(k in TL.Language.languages.en)t[k]&&("object"==typeof this[k]?TL.Util.mergeData(t[k],this[k]):this[k]=t[k])},TL.Language.fallback={messages:{}},// placeholder to satisfy IE8 early compilation
TL.Language.prototype.getMessage=function(t){return this.messages[t]||TL.Language.fallback.messages[t]||t},TL.Language.prototype._=TL.Language.prototype.getMessage,// keep it concise
TL.Language.prototype.formatDate=function(t,e){return t.constructor==Date?this.formatJSDate(t,e):t.constructor==TL.BigYear?this.formatBigYear(t,e):t.data&&t.data.date_obj?this.formatDate(t.data.date_obj,e):(trace("Unfamiliar date presented for formatting"),t.toString())},TL.Language.prototype.formatBigYear=function(t,e){var i=t.year,n=this.bigdateformats[e]||this.bigdateformats.fallback;if(n){for(var a=0;a<n.length;a++){var s=n[a];if(1<Math.abs(i/s[0]))
// will we ever deal with distant future dates?
return TL.Language.formatNumber(Math.abs(i/s[0]),s[1])}return i.toString()}return trace("Language file dateformats missing cosmological. Falling back."),TL.Language.formatNumber(i,e)},TL.Language.prototype.formatJSDate=function(t,e){
// ultimately we probably want this to work with TL.Date instead of (in addition to?) JS Date
// utc, timezone and timezoneClip are carry over from Steven Levithan implementation. We probably aren't going to use them.
var n=this,i=function(t,e){var i=n.period_labels[t];if(i)var t=e<12?i[0]:i[1];return"<span class='tl-timeaxis-timesuffix'>"+t+"</span>"},a=!1,s=/\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,o=/[^-+\dA-Z]/g;e||(e="full");var r=this.dateformats[e]||TL.Language.fallback.dateformats[e];r||(r=e);var l="get",h=t.getDate(),d=t.getDay(),c=t.getMonth(),u=t.getFullYear(),m=t.getHours(),_=t.getMinutes(),p=t.getSeconds(),f=t.getMilliseconds(),g=t.getTimezoneOffset(),v="",y={d:h,dd:TL.Util.pad(h),ddd:this.date.day_abbr[d],dddd:this.date.day[d],m:c+1,mm:TL.Util.pad(c+1),mmm:this.date.month_abbr[c],mmmm:this.date.month[c],yy:String(u).slice(2),yyyy:u<0&&this.has_negative_year_modifier()?Math.abs(u):u,h:m%12||12,hh:TL.Util.pad(m%12||12),H:m,HH:TL.Util.pad(m),M:_,MM:TL.Util.pad(_),s:p,ss:TL.Util.pad(p),l:TL.Util.pad(f,3),L:TL.Util.pad(99<f?Math.round(f/10):f),t:i("t",m),tt:i("tt",m),T:i("T",m),TT:i("TT",m),Z:(String(t).match(s)||[""]).pop().replace(o,""),o:(0<g?"-":"+")+TL.Util.pad(100*Math.floor(Math.abs(g)/60)+Math.abs(g)%60,4),S:["th","st","nd","rd"][3<h%10?0:(h%100-h%10!=10)*h%10]},T=r.replace(TL.Language.DATE_FORMAT_TOKENS,function(t){return t in y?y[t]:t.slice(1,t.length-1)});return this._applyEra(T,u)},TL.Language.prototype.has_negative_year_modifier=function(){return Boolean(this.era_labels.negative_year.prefix||this.era_labels.negative_year.suffix)},TL.Language.prototype._applyEra=function(t,e){
// trusts that the formatted_date was property created with a non-negative year if there are
// negative affixes to be applied
var i=e<0?this.era_labels.negative_year:this.era_labels.positive_year,n="";return i.prefix&&(n+="<span>"+i.prefix+"</span> "),n+=t,i.suffix&&(n+=" <span>"+i.suffix+"</span>"),n},TL.Language.DATE_FORMAT_TOKENS=/d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,TL.Language.languages={
/*
	This represents the canonical list of message keys which translation files should handle. The existence of the 'en.json' file should not mislead you.
	It is provided more as a starting point for someone who wants to provide a
	new translation since the form for non-default languages (JSON not JS) is slightly different from what appears below. Also, those files have some message keys grandfathered in from TimelineJS2 which we'd rather not have to
	get "re-translated" if we use them.
*/
en:{name:"English",lang:"en",api:{wikipedia:"en"},messages:{loading:"Loading",wikipedia:"From Wikipedia, the free encyclopedia",error:"Error",contract_timeline:"Contract Timeline",return_to_title:"Return to Title",loading_content:"Loading Content",expand_timeline:"Expand Timeline",loading_timeline:"Loading Timeline... ",swipe_to_navigate:"Swipe to Navigate<br><span class='tl-button'>OK</span>",unknown_read_err:"An unexpected error occurred trying to read your spreadsheet data",invalid_url_err:"Unable to read Timeline data. Make sure your URL is for a Google Spreadsheet or a Timeline JSON file.",network_err:"Unable to read your Google Spreadsheet. Make sure you have published it to the web.",empty_feed_err:"No data entries found",missing_start_date_err:"Missing start_date",invalid_data_format_err:"Header row has been modified.",date_compare_err:"Can't compare TL.Dates on different scales",invalid_scale_err:"Invalid scale",invalid_date_err:"Invalid date: month, day and year must be numbers.",invalid_separator_error:"Invalid time: misuse of : or . as separator.",invalid_hour_err:"Invalid time (hour)",invalid_minute_err:"Invalid time (minute)",invalid_second_err:"Invalid time (second)",invalid_fractional_err:"Invalid time (fractional seconds)",invalid_second_fractional_err:"Invalid time (seconds and fractional seconds)",invalid_year_err:"Invalid year",flickr_notfound_err:"Photo not found or private",flickr_invalidurl_err:"Invalid Flickr URL",imgur_invalidurl_err:"Invalid Imgur URL",twitter_invalidurl_err:"Invalid Twitter URL",twitter_load_err:"Unable to load Tweet",twitterembed_invalidurl_err:"Invalid Twitter Embed url",wikipedia_load_err:"Unable to load Wikipedia entry",youtube_invalidurl_err:"Invalid YouTube URL",spotify_invalid_url:"Invalid Spotify URL",template_value_err:"No value provided for variable",invalid_rgb_err:"Invalid RGB argument",time_scale_scale_err:"Don't know how to get date from time for scale",axis_helper_no_options_err:"Axis helper must be configured with options",axis_helper_scale_err:"No AxisHelper available for scale",invalid_integer_option:"Invalid option value—must be a whole number."},date:{month:["January","February","March","April","May","June","July","August","September","October","November","December"],month_abbr:["Jan.","Feb.","March","April","May","June","July","Aug.","Sept.","Oct.","Nov.","Dec."],day:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],day_abbr:["Sun.","Mon.","Tues.","Wed.","Thurs.","Fri.","Sat."]},era_labels:{// specify prefix or suffix to apply to formatted date. Blanks mean no change.
positive_year:{prefix:"",suffix:""},negative_year:{// if either of these is specified, the year will be converted to positive before they are applied
prefix:"",suffix:"BCE"}},period_labels:{// use of t/tt/T/TT legacy of original Timeline date format
t:["a","p"],tt:["am","pm"],T:["A","P"],TT:["AM","PM"]},dateformats:{year:"yyyy",month_short:"mmm",month:"mmmm yyyy",full_short:"mmm d",full:"mmmm d',' yyyy",time:"h:MM:ss TT' <small>'mmmm d',' yyyy'</small>'",time_short:"h:MM:ss TT",time_no_seconds_short:"h:MM TT",time_no_minutes_short:"h TT",time_no_seconds_small_date:"h:MM TT' <small>'mmmm d',' yyyy'</small>'",time_milliseconds:"l",full_long:"mmm d',' yyyy 'at' h:MM TT",full_long_small_date:"h:MM TT' <small>mmm d',' yyyy'</small>'"},bigdateformats:{fallback:[// a list of tuples, with t[0] an order of magnitude and t[1] a format string. format string syntax may change...
[1e9,"%.2f billion years ago"],[1e6,"%.1f million years ago"],[1e3,"%.1f thousand years ago"],[1,"%f years ago"]],compact:[[1e9,"%.2f bya"],[1e6,"%.1f mya"],[1e3,"%.1f kya"],[1,"%f years ago"]],verbose:[[1e9,"%.2f billion years ago"],[1e6,"%.1f million years ago"],[1e3,"%.1f thousand years ago"],[1,"%f years ago"]]}}},TL.Language.fallback=new TL.Language,
/*  TL.I18NMixins
    assumes that its class has an options object with a TL.Language instance    
================================================== */
TL.I18NMixins={getLanguage:function(){return this.options&&this.options.language?this.options.language:(trace("Expected a language option"),TL.Language.fallback)},_:function(t){return this.getLanguage()._(t)}},
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
TL.Easings={ease:[.25,.1,.25,1],linear:[0,0,1,1],easein:[.42,0,1,1],easeout:[0,0,.58,1],easeinout:[.42,0,.58,1]},TL.Ease={KeySpline:function(s){function n(t,e){return 1-3*e+3*t}function a(t,e){return 3*e-6*t}function o(t){return 3*t}
// Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
function r(t,e,i){return((n(e,i)*t+a(e,i))*t+o(e))*t}
// Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
function l(t,e,i){return 3*n(e,i)*t*t+2*a(e,i)*t+o(e)}function e(t){for(
// Newton raphson iteration
var e=t,i=0;i<4;++i){var n=l(e,s[0],s[2]),a;if(0==n)return e;e-=(r(e,s[0],s[2])-t)/n}return e}
//KeySpline: function(mX1, mY1, mX2, mY2) {
this.get=function(t){return s[0]==s[1]&&s[2]==s[3]?t:r(e(t),s[1],s[3]);// linear
}},easeInSpline:function(t){var e;return new TL.Ease.KeySpline(TL.Easings.easein).get(t)},easeInOutExpo:function(t){var e;return new TL.Ease.KeySpline(TL.Easings.easein).get(t)},easeOut:function(t){return Math.sin(t*Math.PI/2)},easeOutStrong:function(t){return 1==t?1:1-Math.pow(2,-10*t)},easeIn:function(t){return t*t},easeInStrong:function(t){return 0==t?0:Math.pow(2,10*(t-1))},easeOutBounce:function(t){return t<1/2.75?7.5625*t*t:t<2/2.75?7.5625*(t-=1.5/2.75)*t+.75:t<2.5/2.75?7.5625*(t-=2.25/2.75)*t+.9375:7.5625*(t-=2.625/2.75)*t+.984375},easeInBack:function(t){var e=1.70158;return t*t*((e+1)*t-e)},easeOutBack:function(t){var e=1.70158;return(t-=1)*t*((e+1)*t+e)+1},bounce:function(t){return t<1/2.75?7.5625*t*t:t<2/2.75?7.5625*(t-=1.5/2.75)*t+.75:t<2.5/2.75?7.5625*(t-=2.25/2.75)*t+.9375:7.5625*(t-=2.625/2.75)*t+.984375},bouncePast:function(t){return t<1/2.75?7.5625*t*t:t<2/2.75?2-(7.5625*(t-=1.5/2.75)*t+.75):t<2.5/2.75?2-(7.5625*(t-=2.25/2.75)*t+.9375):2-(7.5625*(t-=2.625/2.75)*t+.984375)},swingTo:function(t){var e=1.70158;return(t-=1)*t*((e+1)*t+e)+1},swingFrom:function(t){var e=1.70158;return t*t*((e+1)*t-e)},elastic:function(t){return-1*Math.pow(4,-8*t)*Math.sin((6*t-1)*(2*Math.PI)/2)+1},spring:function(t){return 1-Math.cos(4.5*t*Math.PI)*Math.exp(6*-t)},blink:function(t,e){return Math.round(t*(e||5))%2},pulse:function(t,e){return-Math.cos(t*((e||5)-.5)*2*Math.PI)/2+.5},wobble:function(t){return-Math.cos(t*Math.PI*(9*t))/2+.5},sinusoidal:function(t){return-Math.cos(t*Math.PI)/2+.5},flicker:function(t){var t=t+(Math.random()-.5)/5;return easings.sinusoidal(t<0?0:1<t?1:t)},mirror:function(t){return t<.5?easings.sinusoidal(2*t):easings.sinusoidal(1-2*(t-.5))},
// accelerating from zero velocity
easeInQuad:function(t){return t*t},
// decelerating to zero velocity
easeOutQuad:function(t){return t*(2-t)},
// acceleration until halfway, then deceleration
easeInOutQuad:function(t){return t<.5?2*t*t:(4-2*t)*t-1},
// accelerating from zero velocity 
easeInCubic:function(t){return t*t*t},
// decelerating to zero velocity 
easeOutCubic:function(t){return--t*t*t+1},
// acceleration until halfway, then deceleration 
easeInOutCubic:function(t){return t<.5?4*t*t*t:(t-1)*(2*t-2)*(2*t-2)+1},
// accelerating from zero velocity 
easeInQuart:function(t){return t*t*t*t},
// decelerating to zero velocity 
easeOutQuart:function(t){return 1- --t*t*t*t},
// acceleration until halfway, then deceleration
easeInOutQuart:function(t){return t<.5?8*t*t*t*t:1-8*--t*t*t*t},
// accelerating from zero velocity
easeInQuint:function(t){return t*t*t*t*t},
// decelerating to zero velocity
easeOutQuint:function(t){return 1+--t*t*t*t*t},
// acceleration until halfway, then deceleration 
easeInOutQuint:function(t){return t<.5?16*t*t*t*t*t:1+16*--t*t*t*t*t}},
/*	TL.Animate
	Basic animation
================================================== */
TL.Animate=function(t,e){var i,n;
/*
		// POSSIBLE ISSUE WITH WEBKIT FUTURE BUILDS
	var onWebKitTimeout = function() {

		animation.stop(true);
	}
	if (TL.Browser.webkit) {
		webkit_timeout = setTimeout(function(){onWebKitTimeout()}, options.duration);
	}
	*/return new tlanimate(t,e)},
/*	Based on: Morpheus
	https://github.com/ded/morpheus - (c) Dustin Diaz 2011
	License MIT
================================================== */
window.tlanimate=function(){function n(t,e,i){if(Array.prototype.indexOf)return t.indexOf(e);for(i=0;i<t.length;++i)if(t[i]===e)return i}function a(t){var e,i=P.length;
// if we're using a high res timer, make sure timestamp is not the old epoch-based value.
// http://updates.html5rocks.com/2012/05/requestAnimationFrame-API-now-with-sub-millisecond-precision
for(r&&1e12<t&&(t=g()),d&&(t=g()),e=i;e--;)P[e](t);P.length&&O(a)}function e(t){1===P.push(t)&&O(a)}function _(t){var e,i=n(P,t);0<=i&&(e=P.slice(i+1),P.length=i,P=P.concat(e))}function L(t,e){var i={},n;return(n=t.match(u))&&(i.rotate=S(n[1],e?e.rotate:null)),(n=t.match(m))&&(i.scale=S(n[1],e?e.scale:null)),(n=t.match(y))&&(i.skewx=S(n[1],e?e.skewx:null),i.skewy=S(n[3],e?e.skewy:null)),(n=t.match(T))&&(i.translatex=S(n[1],e?e.translatex:null),i.translatey=S(n[3],e?e.translatey:null)),i}function w(t){var e="";return"rotate"in t&&(e+="rotate("+t.rotate+"deg) "),"scale"in t&&(e+="scale("+t.scale+") "),"translatex"in t&&(e+="translate("+t.translatex+"px,"+t.translatey+"px) "),"skewx"in t&&(e+="skew("+t.skewx+"deg,"+t.skewy+"deg)"),e}function i(t,e,i){return"#"+(1<<24|t<<16|e<<8|i).toString(16).slice(1)}
// convert rgb and short hex to long hex
function b(t){var e=t.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);return(e?i(e[1],e[2],e[3]):t).replace(/#(\w)(\w)(\w)$/,"#$1$1$2$2$3$3");// short skirt to long jacket
}
// change font-size => fontSize etc.
function k(t){return t.replace(/-(.)/g,function(t,e){return e.toUpperCase()})}
// aren't we having it?
function x(t){return"function"==typeof t}function p(t){
// default to a pleasant-to-the-eye easeOut (like native animations)
return Math.sin(t*Math.PI/2)}
/**
    * Core tween method that requests each frame
    * @param duration: time in milliseconds. defaults to 1000
    * @param fn: tween frame callback function receiving 'position'
    * @param done {optional}: complete callback function
    * @param ease {optional}: easing method. defaults to easeOut
    * @param from {optional}: integer to start from
    * @param to {optional}: integer to end at
    * @returns method to stop the animation
    */function M(t,i,n,a,s,o){function r(t){var e=t-c;if(l<e||u)return o=isFinite(o)?o:1,u?m&&i(o):i(o),_(r),n&&n.apply(h);
// if you don't specify a 'to' you can use tween as a generic delta tweener
// cool, eh?
isFinite(o)?i(d*a(e/l)+s):i(a(e/l))}a=x(a)?a:f.easings[a]||p;var l=t||v,h=this,d=o-s,c=g(),u=0,m=0;return e(r),{stop:function(t){u=1,// jump to end of animation?
(m=t)||(n=null)}}}
/**
    * generic bezier method for animating x|y coordinates
    * minimum of 2 points required (start and end).
    * first point start, last point end
    * additional control points are optional (but why else would you use this anyway ;)
    * @param points: array containing control points
       [[0, 0], [100, 200], [200, 100]]
    * @param pos: current be(tween) position represented as float  0 - 1
    * @return [x, y]
    */function D(t,e){var i=t.length,n=[],a,s;for(a=0;a<i;++a)n[a]=[t[a][0],t[a][1]];for(s=1;s<i;++s)for(a=0;a<i-s;++a)n[a][0]=(1-e)*n[a][0]+e*n[parseInt(a+1,10)][0],n[a][1]=(1-e)*n[a][1]+e*n[parseInt(a+1,10)][1];return[n[0][0],n[0][1]]}
// this gets you the next hex in line according to a 'position'
function l(t,e,i){var n=[],a,s,o,r;for(a=0;a<6;a++)o=Math.min(15,parseInt(e.charAt(a),16)),r=Math.min(15,parseInt(i.charAt(a),16)),s=15<(s=Math.floor((r-o)*t+o))?15:s<0?0:s,n[a]=s.toString(16);return"#"+n.join("")}
// this retreives the frame value within a sequence
function E(t,e,i,n,a,s,o){if("transform"!=a)return"string"==typeof i[s][a]?l(t,i[s][a],n[s][a]):(
// round so we don't get crazy long floats
o=Math.round(((n[s][a]-i[s][a])*t+i[s][a])*v)/v,
// some css properties don't require a unit (like zIndex, lineHeight, opacity)
a in I||(o+=e[s][a]||"px"),o);for(var r in o={},i[s][a])o[r]=r in n[s][a]?Math.round(((n[s][a][r]-i[s][a][r])*t+i[s][a][r])*v)/v:i[s][a][r];return o}
// support for relative movement via '+=n' or '-=n'
function S(t,e,i,n,a){return(i=c.exec(t))?(a=parseFloat(i[2]))&&e+("+"==i[1]?1:-1)*a:parseFloat(t)}
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
    */function f(t,a){var s=t?s=isFinite(t.length)?t:[t]:[],o,e=a.complete,i=a.duration,n=a.easing,r=a.bezier,l=[],h=[],d=[],c=[],u,m;for(r&&(
// remember the original values for top|left
u=a.left,m=a.top,delete a.right,delete a.bottom,delete a.left,delete a.top),o=s.length;o--;){
// are we 'moving'?
if(
// record beginning and end states to calculate positions
l[o]={},h[o]={},d[o]={},r){var _=j(s[o],"left"),p=j(s[o],"top"),f=[S(x(u)?u(s[o]):u||0,parseFloat(_)),S(x(m)?m(s[o]):m||0,parseFloat(p))];c[o]=x(r)?r(s[o],f):r,c[o].push(f),c[o].unshift([parseInt(_,10),parseInt(p,10)])}for(var g in a){switch(g){case"complete":case"duration":case"easing":case"bezier":continue}var v=j(s[o],g),y,T=x(a[g])?a[g](s[o]):a[g];"string"!=typeof T||!C.test(T)||C.test(v)?(l[o][g]="transform"==g?L(v):"string"==typeof T&&C.test(T)?b(v).slice(1):parseFloat(v),h[o][g]="transform"==g?L(T,l[o][g]):"string"==typeof T&&"#"==T.charAt(0)?b(T).slice(1):S(T,parseFloat(v)),
// record original unit
"string"==typeof T&&(y=T.match(N))&&(d[o][g]=y[1])):delete a[g]}}
// ONE TWEEN TO RULE THEM ALL
return M.apply(s,[i,function(t,e,i){
// normally not a fan of optimizing for() loops, but we want something
// fast for animating
for(o=s.length;o--;)for(var n in r&&(i=D(c[o],t),s[o].style.left=i[0]+"px",s[o].style.top=i[1]+"px"),a)e=E(t,d,l,h,n,o),"transform"==n?s[o].style[U]=w(e):"opacity"!=n||A?s[o].style[k(n)]=e:s[o].style.filter="alpha(opacity="+100*e+")"},e,n])}
// expose useful methods
var s=document,o=window,t=o.performance,r=t&&(t.now||t.webkitNow||t.msNow||t.mozNow),g=r?function(){return r.call(t)}:function(){return+new Date},h=s.documentElement,d=!1,// feature detected below
v=1e3,C=/^rgb\(|#/,c=/^([+\-])=([\d\.]+)/,N=/^(?:[\+\-]=?)?\d+(?:\.\d+)?(%|in|cm|mm|em|ex|pt|pc|px)$/,u=/rotate\(((?:[+\-]=)?([\-\d\.]+))deg\)/,m=/scale\(((?:[+\-]=)?([\d\.]+))\)/,y=/skew\(((?:[+\-]=)?([\-\d\.]+))deg, ?((?:[+\-]=)?([\-\d\.]+))deg\)/,T=/translate\(((?:[+\-]=)?([\-\d\.]+))px, ?((?:[+\-]=)?([\-\d\.]+))px\)/,
// these elements do not require 'px'
I={lineHeight:1,zoom:1,zIndex:1,opacity:1,transform:1},U=function(){var t=s.createElement("a").style,e=["webkitTransform","MozTransform","OTransform","msTransform","Transform"],i;for(i=0;i<e.length;i++)if(e[i]in t)return e[i]}(),A=void 0!==s.createElement("a").style.opacity,j=s.defaultView&&s.defaultView.getComputedStyle?function(t,e){e=k(e="transform"==e?U:e);var i=null,n=s.defaultView.getComputedStyle(t,"");return n&&(i=n[e]),t.style[e]||i}:h.currentStyle?function(e,t){if("opacity"==(t=k(t))){var i=100;try{i=e.filters["DXImageTransform.Microsoft.Alpha"].opacity}catch(t){try{i=e.filters("alpha").opacity}catch(t){}}return i/100}var n=e.currentStyle?e.currentStyle[t]:null;return e.style[t]||n}:function(t,e){return t.style[k(e)]},O=o.requestAnimationFrame||o.webkitRequestAnimationFrame||o.mozRequestAnimationFrame||o.msRequestAnimationFrame||o.oRequestAnimationFrame||function(t){o.setTimeout(function(){t(+new Date)},17);// when I was 17..
},P=[];
// which property name does this browser use for transform
return O(function(t){
// feature-detect if rAF and now() are of the same scale (epoch or high-res),
// if not, we have to do a timestamp fix on each frame
d=1e12<t!=1e12<g()}),f.tween=M,f.getStyle=j,f.bezier=D,f.transform=U,f.parseTransform=L,f.formatTransform=w,f.easings={},f}(),
/*	TL.Point
	Inspired by Leaflet
	TL.Point represents a point with x and y coordinates.
================================================== */
TL.Point=function(/*Number*/t,/*Number*/e,/*Boolean*/i){this.x=i?Math.round(t):t,this.y=i?Math.round(e):e},TL.Point.prototype={add:function(t){return this.clone()._add(t)},_add:function(t){return this.x+=t.x,this.y+=t.y,this},subtract:function(t){return this.clone()._subtract(t)},
// destructive subtract (faster)
_subtract:function(t){return this.x-=t.x,this.y-=t.y,this},divideBy:function(t,e){return new TL.Point(this.x/t,this.y/t,e)},multiplyBy:function(t){return new TL.Point(this.x*t,this.y*t)},distanceTo:function(t){var e=t.x-this.x,i=t.y-this.y;return Math.sqrt(e*e+i*i)},round:function(){return this.clone()._round()},
// destructive round
_round:function(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this},clone:function(){return new TL.Point(this.x,this.y)},toString:function(){return"Point("+TL.Util.formatNum(this.x)+", "+TL.Util.formatNum(this.y)+")"}},
/*	TL.DomMixins
	DOM methods used regularly
	Assumes there is a _el.container and animator
================================================== */
TL.DomMixins={
/*	Adding, Hiding, Showing etc
	================================================== */
show:function(t){t||(this._el.container.style.display="block")},hide:function(t){this._el.container.style.display="none"},addTo:function(t){t.appendChild(this._el.container),this.onAdd()},removeFrom:function(t){t.removeChild(this._el.container),this.onRemove()},
/*	Animate to Position
	================================================== */
animatePosition:function(t,e){var i={duration:this.options.duration,easing:this.options.ease};for(var n in t)t.hasOwnProperty(n)&&(i[n]=t[n]+"px");this.animator&&this.animator.stop(),this.animator=TL.Animate(e,i)},
/*	Events
	================================================== */
onLoaded:function(){this.fire("loaded",this.data)},onAdd:function(){this.fire("added",this.data)},onRemove:function(){this.fire("removed",this.data)},
/*	Set the Position
	================================================== */
setPosition:function(t,e){for(var i in t)t.hasOwnProperty(i)&&(e?e.style[i]=t[i]+"px":this._el.container.style[i]=t[i]+"px")},getPosition:function(){return TL.Dom.getPosition(this._el.container)}},
/*	TL.Dom
	Utilities for working with the DOM
================================================== */
TL.Dom={get:function(t){return"string"==typeof t?document.getElementById(t):t},getByClass:function(t){if(t)return document.getElementsByClassName(t)},create:function(t,e,i){var n=document.createElement(t);return n.className=e,i&&i.appendChild(n),n},createText:function(t,e){var i=document.createTextNode(t);return e&&e.appendChild(i),i},getTranslateString:function(t){return TL.Dom.TRANSLATE_OPEN+t.x+"px,"+t.y+"px"+TL.Dom.TRANSLATE_CLOSE},setPosition:function(t,e){t._tl_pos=e,TL.Browser.webkit3d?(t.style[TL.Dom.TRANSFORM]=TL.Dom.getTranslateString(e),TL.Browser.android&&(t.style["-webkit-perspective"]="1000",t.style["-webkit-backface-visibility"]="hidden")):(t.style.left=e.x+"px",t.style.top=e.y+"px")},getPosition:function(t){for(var e={x:0,y:0};t&&!isNaN(t.offsetLeft)&&!isNaN(t.offsetTop);)e.x+=t.offsetLeft,// - el.scrollLeft;
e.y+=t.offsetTop,// - el.scrollTop;
t=t.offsetParent;return e},testProp:function(t){for(var e=document.documentElement.style,i=0;i<t.length;i++)if(t[i]in e)return t[i];return!1}},TL.Util.mergeData(TL.Dom,{TRANSITION:TL.Dom.testProp(["transition","webkitTransition","OTransition","MozTransition","msTransition"]),TRANSFORM:TL.Dom.testProp(["transformProperty","WebkitTransform","OTransform","MozTransform","msTransform"]),TRANSLATE_OPEN:"translate"+(TL.Browser.webkit3d?"3d(":"("),TRANSLATE_CLOSE:TL.Browser.webkit3d?",0)":")"}),
/*	TL.DomUtil
	Inspired by Leaflet
	TL.DomUtil contains various utility functions for working with DOM
================================================== */
TL.DomUtil={get:function(t){return"string"==typeof t?document.getElementById(t):t},getStyle:function(t,e){var i=t.style[e];if(!i&&t.currentStyle&&(i=t.currentStyle[e]),!i||"auto"===i){var n=document.defaultView.getComputedStyle(t,null);i=n?n[e]:null}return"auto"===i?null:i},getViewportOffset:function(t){var e=0,i=0,n=t,a=document.body;do{if(e+=n.offsetTop||0,i+=n.offsetLeft||0,n.offsetParent===a&&"absolute"===TL.DomUtil.getStyle(n,"position"))break;n=n.offsetParent}while(n);n=t;do{if(n===a)break;e-=n.scrollTop||0,i-=n.scrollLeft||0,n=n.parentNode}while(n);return new TL.Point(i,e)},create:function(t,e,i){var n=document.createElement(t);return n.className=e,i&&i.appendChild(n),n},disableTextSelection:function(){document.selection&&document.selection.empty&&document.selection.empty(),this._onselectstart||(this._onselectstart=document.onselectstart,document.onselectstart=TL.Util.falseFn)},enableTextSelection:function(){document.onselectstart=this._onselectstart,this._onselectstart=null},hasClass:function(t,e){return 0<t.className.length&&new RegExp("(^|\\s)"+e+"(\\s|$)").test(t.className)},addClass:function(t,e){TL.DomUtil.hasClass(t,e)||(t.className+=(t.className?" ":"")+e)},removeClass:function(t,i){t.className=t.className.replace(/(\S+)\s*/g,function(t,e){return e===i?"":t}).replace(/^\s+/,"")},setOpacity:function(t,e){TL.Browser.ie?t.style.filter="alpha(opacity="+Math.round(100*e)+")":t.style.opacity=e},testProp:function(t){for(var e=document.documentElement.style,i=0;i<t.length;i++)if(t[i]in e)return t[i];return!1},getTranslateString:function(t){return TL.DomUtil.TRANSLATE_OPEN+t.x+"px,"+t.y+"px"+TL.DomUtil.TRANSLATE_CLOSE},getScaleString:function(t,e){var i,n,a;return TL.DomUtil.getTranslateString(e)+(" scale("+t+") ")+TL.DomUtil.getTranslateString(e.multiplyBy(-1))},setPosition:function(t,e){t._tl_pos=e,TL.Browser.webkit3d?(t.style[TL.DomUtil.TRANSFORM]=TL.DomUtil.getTranslateString(e),TL.Browser.android&&(t.style["-webkit-perspective"]="1000",t.style["-webkit-backface-visibility"]="hidden")):(t.style.left=e.x+"px",t.style.top=e.y+"px")},getPosition:function(t){return t._tl_pos}},
/*	TL.DomEvent
	Inspired by Leaflet 
	DomEvent contains functions for working with DOM events.
================================================== */
// TODO stamp
TL.DomEvent={
/* inpired by John Resig, Dean Edwards and YUI addEvent implementations */
addListener:function(/*HTMLElement*/e,/*String*/t,/*Function*/i,/*Object*/n){var a=TL.Util.stamp(i),s="_tl_"+t+a;if(!e[s]){var o=function(t){return i.call(n||e,t||TL.DomEvent._getEvent())};if(TL.Browser.touch&&"dblclick"===t&&this.addDoubleTapListener)this.addDoubleTapListener(e,o,a);else if("addEventListener"in e)if("mousewheel"===t)e.addEventListener("DOMMouseScroll",o,!1),e.addEventListener(t,o,!1);else if("mouseenter"===t||"mouseleave"===t){var r=o,l="mouseenter"===t?"mouseover":"mouseout";o=function(t){if(TL.DomEvent._checkMouse(e,t))return r(t)},e.addEventListener(l,o,!1)}else e.addEventListener(t,o,!1);else"attachEvent"in e&&e.attachEvent("on"+t,o);e[s]=o}},removeListener:function(/*HTMLElement*/t,/*String*/e,/*Function*/i){var n=TL.Util.stamp(i),a="_tl_"+e+n,s=t[a];s&&(TL.Browser.touch&&"dblclick"===e&&this.removeDoubleTapListener?this.removeDoubleTapListener(t,n):"removeEventListener"in t?"mousewheel"===e?(t.removeEventListener("DOMMouseScroll",s,!1),t.removeEventListener(e,s,!1)):"mouseenter"===e||"mouseleave"===e?t.removeEventListener("mouseenter"===e?"mouseover":"mouseout",s,!1):t.removeEventListener(e,s,!1):"detachEvent"in t&&t.detachEvent("on"+e,s),t[a]=null)},_checkMouse:function(t,e){var i=e.relatedTarget;if(!i)return!0;try{for(;i&&i!==t;)i=i.parentNode}catch(t){return!1}return i!==t},
/*jshint noarg:false */ // evil magic for IE
_getEvent:function(){var t=window.event;if(!t)for(var e=arguments.callee.caller;e&&(!(t=e.arguments[0])||window.Event!==t.constructor);)e=e.caller;return t},
/*jshint noarg:false */
stopPropagation:function(/*Event*/t){t.stopPropagation?t.stopPropagation():t.cancelBubble=!0},
// TODO TL.Draggable.START
disableClickPropagation:function(/*HTMLElement*/t){TL.DomEvent.addListener(t,TL.Draggable.START,TL.DomEvent.stopPropagation),TL.DomEvent.addListener(t,"click",TL.DomEvent.stopPropagation),TL.DomEvent.addListener(t,"dblclick",TL.DomEvent.stopPropagation)},preventDefault:function(/*Event*/t){t.preventDefault?t.preventDefault():t.returnValue=!1},stop:function(t){TL.DomEvent.preventDefault(t),TL.DomEvent.stopPropagation(t)},getWheelDelta:function(t){var e=0;return t.wheelDelta&&(e=t.wheelDelta/120),t.detail&&(e=-t.detail/3),e}},
/*	TL.StyleSheet
	Style Sheet Object
================================================== */
TL.StyleSheet=TL.Class.extend({includes:[TL.Events],_el:{},
/*	Constructor
	================================================== */
initialize:function(){
// Borrowed from: http://davidwalsh.name/add-rules-stylesheets
this.style=document.createElement("style"),
// WebKit hack :(
this.style.appendChild(document.createTextNode("")),
// Add the <style> element to the page
document.head.appendChild(this.style),this.sheet=this.style.sheet},addRule:function(t,e,i){var n=0;i&&(n=i),"insertRule"in this.sheet?this.sheet.insertRule(t+"{"+e+"}",n):"addRule"in this.sheet&&this.sheet.addRule(t,e,n)},
/*	Events
	================================================== */
onLoaded:function(t){this._state.loaded=!0,this.fire("loaded",this.data)}}),
/*	TL.Date
	Date object
	MONTHS are 1-BASED, not 0-BASED (different from Javascript date objects)
================================================== */
//
// Class for human dates
//
TL.Date=TL.Class.extend({
// @data = ms, JS Date object, or JS dictionary with date properties
initialize:function(t,e,i){"number"==typeof t?this.data={format:"yyyy mmmm",date_obj:new Date(t)}:Date==t.constructor?this.data={format:"yyyy mmmm",date_obj:t}:(this.data=JSON.parse(JSON.stringify(t)),// clone don't use by reference.
this._createDateObj()),this._setFormat(e,i)},setDateFormat:function(t){this.data.format=t},getDisplayDate:function(t,e){if(this.data.display_date)return this.data.display_date;t||(t=TL.Language.fallback),t.constructor!=TL.Language&&(trace("First argument to getDisplayDate must be TL.Language"),t=TL.Language.fallback);var i=e||this.data.format;return t.formatDate(this.data.date_obj,i)},getMillisecond:function(){return this.getTime()},getTime:function(){return this.data.date_obj.getTime()},isBefore:function(t){if(!this.data.date_obj.constructor==t.data.date_obj.constructor)throw new TL.Error("date_compare_err");// but should be able to compare 'cosmological scale' dates once we get to that...
return"isBefore"in this.data.date_obj?this.data.date_obj.isBefore(t.data.date_obj):this.data.date_obj<t.data.date_obj},isAfter:function(t){if(!this.data.date_obj.constructor==t.data.date_obj.constructor)throw new TL.Error("date_compare_err");// but should be able to compare 'cosmological scale' dates once we get to that...
return"isAfter"in this.data.date_obj?this.data.date_obj.isAfter(t.data.date_obj):this.data.date_obj>t.data.date_obj},
// Return a new TL.Date which has been 'floored' at the given scale.
// @scale = string value from TL.Date.SCALES
floor:function(t){for(var e=new Date(this.data.date_obj.getTime()),i=0;i<TL.Date.SCALES.length;i++)if(
// for JS dates, we iteratively apply flooring functions
TL.Date.SCALES[i][2](e),TL.Date.SCALES[i][0]==t)return new TL.Date(e);throw new TL.Error("invalid_scale_err",t)},
/*	Private Methods
	================================================== */
_getDateData:function(){var t={year:0,month:1,// stupid JS dates
day:1,hour:0,minute:0,second:0,millisecond:0};
// Merge data
TL.Util.mergeData(t,this.data);
// Make strings into numbers
var e=TL.Date.DATE_PARTS;for(var i in e){var n;if(!TL.Util.trim(t[e[i]]).match(/^-?\d*$/))throw new TL.Error("invalid_date_err",e[i]+" = '"+t[e[i]]+"'");var a=parseInt(t[e[i]]);isNaN(a)&&(a=4==i||5==i?1:0),t[e[i]]=a}return 0<t.month&&t.month<=12&&(// adjust for JS's weirdness
t.month=t.month-1),t},_createDateObj:function(){var t=this._getDateData();this.data.date_obj=new Date(t.year,t.month,t.day,t.hour,t.minute,t.second,t.millisecond),this.data.date_obj.getFullYear()!=t.year&&
// Javascript has stupid defaults for two-digit years
this.data.date_obj.setFullYear(t.year)},
/*  Find Best Format
     * this may not work with 'cosmologic' dates, or with TL.Date if we
     * support constructing them based on JS Date and time
    ================================================== */
findBestFormat:function(t){for(var e=TL.Date.DATE_PARTS,i="",n=0;n<e.length;n++)if(this.data[e[n]])return t?t in TL.Date.BEST_DATEFORMATS||(t="short"):t="base",TL.Date.BEST_DATEFORMATS[t][e[n]];return""},_setFormat:function(t,e){t?this.data.format=t:this.data.format||(this.data.format=this.findBestFormat()),e?this.data.format_short=e:this.data.format_short||(this.data.format_short=this.findBestFormat(!0))}}),
// offer something that can figure out the right date class to return
TL.Date.makeDate=function(t){var e=new TL.Date(t);return isNaN(e.getTime())?new TL.BigDate(t):e},TL.BigYear=TL.Class.extend({initialize:function(t){if(this.year=parseInt(t),isNaN(this.year))throw new TL.Error("invalid_year_err",t)},isBefore:function(t){return this.year<t.year},isAfter:function(t){return this.year>t.year},getTime:function(){return this.year}}),function(r){
// human scales
r.SCALES=[// ( name, units_per_tick, flooring function )
["millisecond",1,function(t){}],["second",1e3,function(t){t.setMilliseconds(0)}],["minute",6e4,function(t){t.setSeconds(0)}],["hour",36e5,function(t){t.setMinutes(0)}],["day",864e5,function(t){t.setHours(0)}],["month",2592e6,function(t){t.setDate(1)}],["year",31536e6,function(t){t.setMonth(0)}],["decade",31536e7,function(t){var e=t.getFullYear();t.setFullYear(e-e%10)}],["century",31536e8,function(t){var e=t.getFullYear();t.setFullYear(e-e%100)}],["millennium",31536e9,function(t){var e=t.getFullYear();t.setFullYear(e-e%1e3)}]],
// Date parts from highest to lowest precision
r.DATE_PARTS=["millisecond","second","minute","hour","day","month","year"];var l=/^([\+-]?\d+?)(-\d{2}?)?(-\d{2}?)?$/,h=/^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/;
// regex below from
// http://www.pelagodesign.com/blog/2009/05/20/iso-8601-date-validation-that-doesnt-suck/
/* For now, rather than extract parts from regexp, lets trust the browser.
     * Famous last words...
     * What about UTC vs local time?
     * see also http://stackoverflow.com/questions/10005374/ecmascript-5-date-parse-results-for-iso-8601-test-cases
     */
r.parseISODate=function(t){var e=new Date(t);if(isNaN(e))throw new TL.Error("invalid_date_err",t);return{year:e.getFullYear(),month:e.getMonth()+1,day:e.getDate(),hour:e.getHours(),minute:e.getMinutes(),second:e.getSeconds(),millisecond:e.getMilliseconds()}},r.parseDate=function(t){if(t.match(l)){
// parse short specifically to avoid timezone offset confusion
// most browsers assume short is UTC, not local time.
var e=t.match(l).slice(1),i={year:e[0].replace("+","")};// year can be negative
return e[1]&&(i.month=e[1].replace("-","")),e[2]&&(i.day=e[2].replace("-","")),i}if(t.match(h))return r.parseISODate(t);if(t.match(/^\-?\d+$/))return{year:t};var n={};if(t.match(/\d+\/\d+\/\d+/)){// mm/yy/dddd
var a=t.match(/\d+\/\d+\/\d+/)[0];t=TL.Util.trim(t.replace(a,""));var s=a.split("/");n.month=s[0],n.day=s[1],n.year=s[2]}if(t.match(/\d+\/\d+/)){// mm/yy
var a=t.match(/\d+\/\d+/)[0];t=TL.Util.trim(t.replace(a,""));var s=a.split("/");n.month=s[0],n.year=s[1]}
// todo: handle hours, minutes, seconds, millis other date formats, etc...
if(t.match(":")){var o=t.split(":");n.hour=o[0],n.minute=o[1],o[2]&&(second_parts=o[2].split("."),n.second=second_parts[0],n.millisecond=second_parts[1])}return n},r.BEST_DATEFORMATS={base:{millisecond:"time_short",second:"time",minute:"time_no_seconds_small_date",hour:"time_no_seconds_small_date",day:"full",month:"month",year:"year",decade:"year",century:"year",millennium:"year",age:"fallback",epoch:"fallback",era:"fallback",eon:"fallback",eon2:"fallback"},short:{millisecond:"time_short",second:"time_short",minute:"time_no_seconds_short",hour:"time_no_minutes_short",day:"full_short",month:"month_short",year:"year",decade:"year",century:"year",millennium:"year",age:"fallback",epoch:"fallback",era:"fallback",eon:"fallback",eon2:"fallback"}}}(TL.Date),
//
// Class for cosmological dates
//
TL.BigDate=TL.Date.extend({
// @data = TL.BigYear object or JS dictionary with date properties
initialize:function(t,e,i){TL.BigYear==t.constructor?this.data={date_obj:t}:(this.data=JSON.parse(JSON.stringify(t)),this._createDateObj()),this._setFormat(e,i)},
// Create date_obj
_createDateObj:function(){var t=this._getDateData();this.data.date_obj=new TL.BigYear(t.year)},
// Return a new TL.BigDate which has been 'floored' at the given scale.
// @scale = string value from TL.BigDate.SCALES
floor:function(t){for(var e=0;e<TL.BigDate.SCALES.length;e++)if(TL.BigDate.SCALES[e][0]==t){var i=TL.BigDate.SCALES[e][2](this.data.date_obj);return new TL.BigDate(i)}throw new TL.Error("invalid_scale_err",t)}}),function(t){
// cosmo units are years, not millis
var e=1e6,i=1e7,n=1e8,a=1e9,s=function(i){return function(t){var e=t.getTime();return new TL.BigYear(Math.floor(e/i)*i)}}
// cosmological scales;
t.SCALES=[// ( name, units_per_tick, flooring function )
["year",1,new s(1)],["decade",10,new s(10)],["century",100,new s(100)],["millennium",1e3,new s(1e3)],["age",e,new s(e)],// 1M years
["epoch",i,new s(i)],// 10M years
["era",n,new s(n)],// 100M years
["eon",a,new s(a)]]}(TL.BigDate),
/*	TL.DateUtil
	Utilities for parsing time
================================================== */
TL.DateUtil={get:function(t){return"string"==typeof t?document.getElementById(t):t},sortByDate:function(t,i){// only for use with slide data objects
var i=i||"start_date";t.sort(function(t,e){return t[i].isBefore(e[i])?-1:t[i].isAfter(e[i])?1:0})},parseTime:function(t){var e={hour:null,minute:null,second:null,millisecond:null},i=null,n=t.match(/(\s*[AaPp]\.?[Mm]\.?\s*)$/);n&&(i=TL.Util.trim(n[0]),t=TL.Util.trim(t.substring(0,t.lastIndexOf(i))));var a=[],s=t.match(/^\s*(\d{1,2})(\d{2})\s*$/);if(s?a=s.slice(1):1==(a=t.split(":")).length&&(a=t.split(".")),4<a.length)throw new TL.Error("invalid_separator_error");if(e.hour=parseInt(a[0]),i&&"p"==i.toLowerCase()[0]&&12!=e.hour?e.hour+=12:i&&"a"==i.toLowerCase()[0]&&12==e.hour&&(e.hour=0),isNaN(e.hour)||e.hour<0||23<e.hour)throw new TL.Error("invalid_hour_err",e.hour);if(1<a.length&&(e.minute=parseInt(a[1]),isNaN(e.minute)))throw new TL.Error("invalid_minute_err",e.minute);if(2<a.length){var o;// deal with various methods of specifying fractional seconds
if(2<(a=a[2].split(/[\.,]/).concat(a.slice(3))).length)throw new TL.Error("invalid_second_fractional_err");if(e.second=parseInt(a[0]),isNaN(e.second))throw new TL.Error("invalid_second_err");if(2==a.length){var r=parseInt(a[1]);if(isNaN(r))throw new TL.Error("invalid_fractional_err");e.millisecond=100*r}}return e},SCALE_DATE_CLASSES:{human:TL.Date,cosmological:TL.BigDate}},
/*	TL.Draggable
	TL.Draggable allows you to add dragging capabilities to any element. Supports mobile devices too.
	TODO Enable constraints
================================================== */
TL.Draggable=TL.Class.extend({includes:TL.Events,_el:{},mousedrag:{down:"mousedown",up:"mouseup",leave:"mouseleave",move:"mousemove"},touchdrag:{down:"touchstart",up:"touchend",leave:"mouseleave",move:"touchmove"},initialize:function(t,e,i){
// DOM ELements 
this._el={drag:t,move:t},i&&(this._el.move=i),
//Options
this.options={enable:{x:!0,y:!0},constraint:{top:!1,bottom:!1,left:!1,right:!1},momentum_multiplier:2e3,duration:1e3,ease:TL.Ease.easeInOutQuint},
// Animation Object
this.animator=null,
// Drag Event Type
this.dragevent=this.mousedrag,TL.Browser.touch&&(this.dragevent=this.touchdrag),
// Draggable Data
this.data={sliding:!1,direction:"none",pagex:{start:0,end:0},pagey:{start:0,end:0},pos:{start:{x:0,y:0},end:{x:0,y:0}},new_pos:{x:0,y:0},new_pos_parent:{x:0,y:0},time:{start:0,end:0},touch:!1},
// Merge Data and Options
TL.Util.mergeData(this.options,e)},enable:function(t){this.data.pos.start=0,this._el.move.style.left=this.data.pos.start.x+"px",this._el.move.style.top=this.data.pos.start.y+"px",this._el.move.style.position="absolute"},disable:function(){TL.DomEvent.removeListener(this._el.drag,this.dragevent.down,this._onDragStart,this),TL.DomEvent.removeListener(this._el.drag,this.dragevent.up,this._onDragEnd,this)},stopMomentum:function(){this.animator&&this.animator.stop()},updateConstraint:function(t){this.options.constraint=t},
/*	Private Methods
	================================================== */
_onDragStart:function(t){TL.Browser.touch?t.originalEvent?(this.data.pagex.start=t.originalEvent.touches[0].screenX,this.data.pagey.start=t.originalEvent.touches[0].screenY):(this.data.pagex.start=t.targetTouches[0].screenX,this.data.pagey.start=t.targetTouches[0].screenY):(this.data.pagex.start=t.pageX,this.data.pagey.start=t.pageY),
// Center element to finger or mouse
this.options.enable.x&&(this._el.move.style.left=this.data.pagex.start-this._el.move.offsetWidth/2+"px"),this.options.enable.y&&(this._el.move.style.top=this.data.pagey.start-this._el.move.offsetHeight/2+"px"),this.data.pos.start=TL.Dom.getPosition(this._el.drag),this.data.time.start=(new Date).getTime(),this.fire("dragstart",this.data),TL.DomEvent.addListener(this._el.drag,this.dragevent.move,this._onDragMove,this),TL.DomEvent.addListener(this._el.drag,this.dragevent.leave,this._onDragEnd,this)},_onDragEnd:function(t){this.data.sliding=!1,TL.DomEvent.removeListener(this._el.drag,this.dragevent.move,this._onDragMove,this),TL.DomEvent.removeListener(this._el.drag,this.dragevent.leave,this._onDragEnd,this),this.fire("dragend",this.data),
//  momentum
this._momentum()},_onDragMove:function(t){t.preventDefault(),this.data.sliding=!0,TL.Browser.touch?t.originalEvent?(this.data.pagex.end=t.originalEvent.touches[0].screenX,this.data.pagey.end=t.originalEvent.touches[0].screenY):(this.data.pagex.end=t.targetTouches[0].screenX,this.data.pagey.end=t.targetTouches[0].screenY):(this.data.pagex.end=t.pageX,this.data.pagey.end=t.pageY),this.data.pos.end=TL.Dom.getPosition(this._el.drag),this.data.new_pos.x=-(this.data.pagex.start-this.data.pagex.end-this.data.pos.start.x),this.data.new_pos.y=-(this.data.pagey.start-this.data.pagey.end-this.data.pos.start.y),this.options.enable.x&&(this._el.move.style.left=this.data.new_pos.x+"px"),this.options.enable.y&&(this._el.move.style.top=this.data.new_pos.y+"px"),this.fire("dragmove",this.data)},_momentum:function(){var t={x:0,y:0,time:0},e={x:0,y:0,time:0},i=!1,n="";TL.Browser.touch,t.time=10*((new Date).getTime()-this.data.time.start),e.time=10*((new Date).getTime()-this.data.time.start),e.x=this.options.momentum_multiplier*(Math.abs(this.data.pagex.end)-Math.abs(this.data.pagex.start)),e.y=this.options.momentum_multiplier*(Math.abs(this.data.pagey.end)-Math.abs(this.data.pagey.start)),t.x=Math.round(e.x/e.time),t.y=Math.round(e.y/e.time),this.data.new_pos.x=Math.min(this.data.pos.end.x+t.x),this.data.new_pos.y=Math.min(this.data.pos.end.y+t.y),this.options.enable.x?this.data.new_pos.x<0&&(this.data.new_pos.x=0):this.data.new_pos.x=this.data.pos.start.x,this.options.enable.y?this.data.new_pos.y<0&&(this.data.new_pos.y=0):this.data.new_pos.y=this.data.pos.start.y,
// Detect Swipe
e.time<3e3&&(i=!0),
// Detect Direction
1e4<Math.abs(e.x)&&(this.data.direction="left",0<e.x&&(this.data.direction="right")),
// Detect Swipe
1e4<Math.abs(e.y)&&(this.data.direction="up",0<e.y&&(this.data.direction="down")),this._animateMomentum(),i&&this.fire("swipe_"+this.data.direction,this.data)},_animateMomentum:function(){var t={x:this.data.new_pos.x,y:this.data.new_pos.y},e={duration:this.options.duration,easing:TL.Ease.easeOutStrong};this.options.enable.y&&((this.options.constraint.top||this.options.constraint.bottom)&&(t.y>this.options.constraint.bottom?t.y=this.options.constraint.bottom:t.y<this.options.constraint.top&&(t.y=this.options.constraint.top)),e.top=Math.floor(t.y)+"px"),this.options.enable.x&&((this.options.constraint.left||this.options.constraint.right)&&(t.x>this.options.constraint.left?t.x=this.options.constraint.left:t.x<this.options.constraint.right&&(t.x=this.options.constraint.right)),e.left=Math.floor(t.x)+"px"),this.animator=TL.Animate(this._el.move,e),this.fire("momentum",this.data)}}),
/*	TL.Swipable
	TL.Draggable allows you to add dragging capabilities to any element. Supports mobile devices too.
	TODO Enable constraints
================================================== */
TL.Swipable=TL.Class.extend({includes:TL.Events,_el:{},mousedrag:{down:"mousedown",up:"mouseup",leave:"mouseleave",move:"mousemove"},touchdrag:{down:"touchstart",up:"touchend",leave:"mouseleave",move:"touchmove"},initialize:function(t,e,i){
// DOM ELements 
this._el={drag:t,move:t},e&&(this._el.move=e),
//Options
this.options={snap:!1,enable:{x:!0,y:!0},constraint:{top:!1,bottom:!1,left:0,right:!1},momentum_multiplier:2e3,duration:1e3,ease:TL.Ease.easeInOutQuint},
// Animation Object
this.animator=null,
// Drag Event Type
this.dragevent=this.mousedrag,TL.Browser.touch&&(this.dragevent=this.touchdrag),
// Draggable Data
this.data={sliding:!1,direction:"none",pagex:{start:0,end:0},pagey:{start:0,end:0},pos:{start:{x:0,y:0},end:{x:0,y:0}},new_pos:{x:0,y:0},new_pos_parent:{x:0,y:0},time:{start:0,end:0},touch:!1},
// Merge Data and Options
TL.Util.mergeData(this.options,i)},enable:function(t){TL.DomEvent.addListener(this._el.drag,this.dragevent.down,this._onDragStart,this),TL.DomEvent.addListener(this._el.drag,this.dragevent.up,this._onDragEnd,this),this.data.pos.start=0,//TL.Dom.getPosition(this._el.move);
this._el.move.style.left=this.data.pos.start.x+"px",this._el.move.style.top=this.data.pos.start.y+"px",this._el.move.style.position="absolute"},disable:function(){TL.DomEvent.removeListener(this._el.drag,this.dragevent.down,this._onDragStart,this),TL.DomEvent.removeListener(this._el.drag,this.dragevent.up,this._onDragEnd,this)},stopMomentum:function(){this.animator&&this.animator.stop()},updateConstraint:function(t){this.options.constraint=t;
// Temporary until issues are fixed
},
/*	Private Methods
	================================================== */
_onDragStart:function(t){this.animator&&this.animator.stop(),TL.Browser.touch?t.originalEvent?(this.data.pagex.start=t.originalEvent.touches[0].screenX,this.data.pagey.start=t.originalEvent.touches[0].screenY):(this.data.pagex.start=t.targetTouches[0].screenX,this.data.pagey.start=t.targetTouches[0].screenY):(this.data.pagex.start=t.pageX,this.data.pagey.start=t.pageY),this.options.enable.x,this.options.enable.y,this.data.pos.start={x:this._el.move.offsetLeft,y:this._el.move.offsetTop},this.data.time.start=(new Date).getTime(),this.fire("dragstart",this.data),TL.DomEvent.addListener(this._el.drag,this.dragevent.move,this._onDragMove,this),TL.DomEvent.addListener(this._el.drag,this.dragevent.leave,this._onDragEnd,this)},_onDragEnd:function(t){this.data.sliding=!1,TL.DomEvent.removeListener(this._el.drag,this.dragevent.move,this._onDragMove,this),TL.DomEvent.removeListener(this._el.drag,this.dragevent.leave,this._onDragEnd,this),this.fire("dragend",this.data),
//  momentum
this._momentum()},_onDragMove:function(t){var e={x:0,y:0};
//e.preventDefault();
this.data.sliding=!0,TL.Browser.touch?t.originalEvent?(this.data.pagex.end=t.originalEvent.touches[0].screenX,this.data.pagey.end=t.originalEvent.touches[0].screenY):(this.data.pagex.end=t.targetTouches[0].screenX,this.data.pagey.end=t.targetTouches[0].screenY):(this.data.pagex.end=t.pageX,this.data.pagey.end=t.pageY),e.x=this.data.pagex.start-this.data.pagex.end,e.y=this.data.pagey.start-this.data.pagey.end,this.data.pos.end={x:this._el.drag.offsetLeft,y:this._el.drag.offsetTop},this.data.new_pos.x=-(e.x-this.data.pos.start.x),this.data.new_pos.y=-(e.y-this.data.pos.start.y),this.options.enable.x&&Math.abs(e.x)>Math.abs(e.y)&&(t.preventDefault(),this._el.move.style.left=this.data.new_pos.x+"px"),this.options.enable.y&&Math.abs(e.y)>Math.abs(e.y)&&(t.preventDefault(),this._el.move.style.top=this.data.new_pos.y+"px"),this.fire("dragmove",this.data)},_momentum:function(){var t={x:0,y:0,time:0},e={x:0,y:0,time:0},i={x:!1,y:!1},n=!1,a="";this.data.direction=null,t.time=10*((new Date).getTime()-this.data.time.start),e.time=10*((new Date).getTime()-this.data.time.start),e.x=this.options.momentum_multiplier*(Math.abs(this.data.pagex.end)-Math.abs(this.data.pagex.start)),e.y=this.options.momentum_multiplier*(Math.abs(this.data.pagey.end)-Math.abs(this.data.pagey.start)),t.x=Math.round(e.x/e.time),t.y=Math.round(e.y/e.time),this.data.new_pos.x=Math.min(this.data.new_pos.x+t.x),this.data.new_pos.y=Math.min(this.data.new_pos.y+t.y),this.options.enable.x?this.options.constraint.left&&this.data.new_pos.x>this.options.constraint.left&&(this.data.new_pos.x=this.options.constraint.left):this.data.new_pos.x=this.data.pos.start.x,this.options.enable.y?this.data.new_pos.y<0&&(this.data.new_pos.y=0):this.data.new_pos.y=this.data.pos.start.y,
// Detect Swipe
e.time<2e3&&(n=!0),this.options.enable.x&&this.options.enable.y?Math.abs(e.x)>Math.abs(e.y)?i.x=!0:i.y=!0:this.options.enable.x?Math.abs(e.x)>Math.abs(e.y)&&(i.x=!0):Math.abs(e.y)>Math.abs(e.x)&&(i.y=!0),
// Detect Direction and long swipe
i.x&&(
// Long Swipe
Math.abs(e.x)>this._el.drag.offsetWidth/2&&(n=!0),1e4<Math.abs(e.x)&&(this.data.direction="left",0<e.x&&(this.data.direction="right"))),i.y&&(
// Long Swipe
Math.abs(e.y)>this._el.drag.offsetHeight/2&&(n=!0),1e4<Math.abs(e.y)&&(this.data.direction="up",0<e.y&&(this.data.direction="down"))),e.time<1e3||this._animateMomentum(),n&&this.data.direction?this.fire("swipe_"+this.data.direction,this.data):this.data.direction?this.fire("swipe_nodirection",this.data):this.options.snap&&(this.animator.stop(),this.animator=TL.Animate(this._el.move,{top:this.data.pos.start.y,left:this.data.pos.start.x,duration:this.options.duration,easing:TL.Ease.easeOutStrong}))},_animateMomentum:function(){var t={x:this.data.new_pos.x,y:this.data.new_pos.y},e={duration:this.options.duration,easing:TL.Ease.easeOutStrong};this.options.enable.y&&((this.options.constraint.top||this.options.constraint.bottom)&&(t.y>this.options.constraint.bottom?t.y=this.options.constraint.bottom:t.y<this.options.constraint.top&&(t.y=this.options.constraint.top)),e.top=Math.floor(t.y)+"px"),this.options.enable.x&&(this.options.constraint.left&&t.x>=this.options.constraint.left&&(t.x=this.options.constraint.left),this.options.constraint.right&&t.x<this.options.constraint.right&&(t.x=this.options.constraint.right),e.left=Math.floor(t.x)+"px"),this.animator=TL.Animate(this._el.move,e),this.fire("momentum",this.data)}}),
/*	TL.MenuBar
	Draggable component to control size
================================================== */
TL.MenuBar=TL.Class.extend({includes:[TL.Events,TL.DomMixins],_el:{},
/*	Constructor
	================================================== */
initialize:function(t,e,i){
// DOM ELEMENTS
this._el={parent:{},container:{},button_backtostart:{},button_zoomin:{},button_zoomout:{},arrow:{},line:{},coverbar:{},grip:{}},this.collapsed=!1,this._el.container="object"==typeof t?t:TL.Dom.get(t),e&&(this._el.parent=e),
//Options
this.options={width:600,height:600,duration:1e3,ease:TL.Ease.easeInOutQuint,menubar_default_y:0},
// Animation
this.animator={},
// Merge Data and Options
TL.Util.mergeData(this.options,i),this._initLayout(),this._initEvents()},
/*	Public
	================================================== */
show:function(t){var e=this.options.duration;t&&(e=t)
/*
		this.animator = TL.Animate(this._el.container, {
			top: 		this.options.menubar_default_y + "px",
			duration: 	duration,
			easing: 	TL.Ease.easeOutStrong
		});
		*/},hide:function(t){
/*
		this.animator = TL.Animate(this._el.container, {
			top: 		top,
			duration: 	this.options.duration,
			easing: 	TL.Ease.easeOutStrong
		});
		*/},toogleZoomIn:function(t){t?TL.DomUtil.removeClass(this._el.button_zoomin,"tl-menubar-button-inactive"):TL.DomUtil.addClass(this._el.button_zoomin,"tl-menubar-button-inactive")},toogleZoomOut:function(t){t?TL.DomUtil.removeClass(this._el.button_zoomout,"tl-menubar-button-inactive"):TL.DomUtil.addClass(this._el.button_zoomout,"tl-menubar-button-inactive")},setSticky:function(t){this.options.menubar_default_y=t},
/*	Color
	================================================== */
setColor:function(t){this._el.container.className=t?"tl-menubar tl-menubar-inverted":"tl-menubar"},
/*	Update Display
	================================================== */
updateDisplay:function(t,e,i,n){this._updateDisplay(t,e,i,n)},
/*	Events
	================================================== */
_onButtonZoomIn:function(t){this.fire("zoom_in",t)},_onButtonZoomOut:function(t){this.fire("zoom_out",t)},_onButtonBackToStart:function(t){this.fire("back_to_start",t)},
/*	Private Methods
	================================================== */
_initLayout:function(){
// Create Layout
this._el.button_zoomin=TL.Dom.create("span","tl-menubar-button",this._el.container),this._el.button_zoomout=TL.Dom.create("span","tl-menubar-button",this._el.container),this._el.button_backtostart=TL.Dom.create("span","tl-menubar-button",this._el.container),TL.Browser.mobile&&this._el.container.setAttribute("ontouchstart"," "),this._el.button_backtostart.innerHTML="<span class='tl-icon-goback'></span>",this._el.button_zoomin.innerHTML="<span class='tl-icon-zoom-in'></span>",this._el.button_zoomout.innerHTML="<span class='tl-icon-zoom-out'></span>"},_initEvents:function(){TL.DomEvent.addListener(this._el.button_backtostart,"click",this._onButtonBackToStart,this),TL.DomEvent.addListener(this._el.button_zoomin,"click",this._onButtonZoomIn,this),TL.DomEvent.addListener(this._el.button_zoomout,"click",this._onButtonZoomOut,this)},
// Update Display
_updateDisplay:function(t,e,i){t&&(this.options.width=t),e&&(this.options.height=e)}}),
/*	TL.Message
	
================================================== */
TL.Message=TL.Class.extend({includes:[TL.Events,TL.DomMixins,TL.I18NMixins],_el:{},
/*	Constructor
	================================================== */
initialize:function(t,e,i){
// DOM ELEMENTS
this._el={parent:{},container:{},message_container:{},loading_icon:{},message:{}},
//Options
this.options={width:600,height:600,message_class:"tl-message",message_icon_class:"tl-loading-icon"},this._add_to_container=i||{},// save ref
// Merge Data and Options
TL.Util.mergeData(this.data,t),TL.Util.mergeData(this.options,e),this._el.container=TL.Dom.create("div",this.options.message_class),i&&(i.appendChild(this._el.container),this._el.parent=i),
// Animation
this.animator={},this._initLayout(),this._initEvents()},
/*	Public
	================================================== */
updateMessage:function(t){this._updateMessage(t)},
/*	Update Display
	================================================== */
updateDisplay:function(t,e){this._updateDisplay(t,e)},_updateMessage:function(t){this._el.message.innerHTML=t||this._("loading"),
// Re-add to DOM?
!this._el.parent.atrributes&&this._add_to_container.attributes&&(this._add_to_container.appendChild(this._el.container),this._el.parent=this._add_to_container)},
/*	Events
	================================================== */
_onMouseClick:function(){this.fire("clicked",this.options)},_onRemove:function(){this._el.parent={}},
/*	Private Methods
	================================================== */
_initLayout:function(){
// Create Layout
this._el.message_container=TL.Dom.create("div","tl-message-container",this._el.container),this._el.loading_icon=TL.Dom.create("div",this.options.message_icon_class,this._el.message_container),this._el.message=TL.Dom.create("div","tl-message-content",this._el.message_container),this._updateMessage()},_initEvents:function(){TL.DomEvent.addListener(this._el.container,"click",this._onMouseClick,this),TL.DomEvent.addListener(this,"removed",this._onRemove,this)},
// Update Display
_updateDisplay:function(t,e,i){}}),
/*    TL.MediaType
    Determines the type of media the url string is.
    returns an object with .type and .id
    You can add new media types by adding a regex
    to match and the media class name to use to
    render the media

    The image_only parameter indicates that the
    call only wants an image-based media type
    that can be resolved to an image URL.

    TODO
    Allow array so a slideshow can be a mediatype
================================================== */
TL.MediaType=function(t,e){var i={},n=[{type:"youtube",name:"YouTube",match_str:"^(https?:)?/*(www.)?youtube|youtu.be",cls:TL.Media.YouTube},{type:"vimeo",name:"Vimeo",match_str:"^(https?:)?/*(player.)?vimeo.com",cls:TL.Media.Vimeo},{type:"dailymotion",name:"DailyMotion",match_str:"^(https?:)?/*(www.)?dailymotion.com",cls:TL.Media.DailyMotion},{type:"vine",name:"Vine",match_str:"^(https?:)?/*(www.)?vine.co",cls:TL.Media.Vine},{type:"soundcloud",name:"SoundCloud",match_str:"^(https?:)?/*(player.)?soundcloud.com",cls:TL.Media.SoundCloud},{type:"twitter",name:"Twitter",match_str:"^(https?:)?/*(www.)?twitter.com",cls:TL.Media.Twitter},{type:"twitterembed",name:"TwitterEmbed",match_str:"<blockquote class=['\"]twitter-tweet['\"]",cls:TL.Media.Twitter},{type:"googlemaps",name:"Google Map",match_str:/google.+?\/maps\/@([-\d.]+),([-\d.]+),((?:[-\d.]+[zmayht],?)*)|google.+?\/maps\/search\/([\w\W]+)\/@([-\d.]+),([-\d.]+),((?:[-\d.]+[zmayht],?)*)|google.+?\/maps\/place\/([\w\W]+)\/@([-\d.]+),([-\d.]+),((?:[-\d.]+[zmayht],?)*)|google.+?\/maps\/dir\/([\w\W]+)\/([\w\W]+)\/@([-\d.]+),([-\d.]+),((?:[-\d.]+[zmayht],?)*)/,cls:TL.Media.GoogleMap},{type:"googleplus",name:"Google+",match_str:"^(https?:)?/*plus.google",cls:TL.Media.GooglePlus},{type:"flickr",name:"Flickr",match_str:"^(https?:)?/*(www.)?flickr.com/photos",cls:TL.Media.Flickr},{type:"flickr",name:"Flickr",match_str:"^(https?://)?flic.kr/.*",cls:TL.Media.Flickr},{type:"instagram",name:"Instagram",match_str:/^(https?:)?\/*(www.)?(instagr.am|^(https?:)?\/*(www.)?instagram.com)\/p\//,cls:TL.Media.Instagram},{type:"profile",name:"Profile",match_str:/^(https?:)?\/*(www.)?instagr.am\/[a-zA-Z0-9]{2,}|^(https?:)?\/*(www.)?instagram.com\/[a-zA-Z0-9]{2,}/,cls:TL.Media.Profile},{type:"documentcloud",name:"Document Cloud",match_str:/documentcloud.org\//,cls:TL.Media.DocumentCloud},{type:"image",name:"Image",match_str:/(jpg|jpeg|png|gif|svg)(\?.*)?$/i,cls:TL.Media.Image},{type:"imgur",name:"Imgur",match_str:/^.*imgur.com\/.+$|<blockquote class=['\"]imgur-embed-pub['\"]/i,cls:TL.Media.Imgur},{type:"googledocs",name:"Google Doc",match_str:"^(https?:)?/*[^.]*.google.com/[^/]*/d/[^/]*/[^/]*?usp=sharing|^(https?:)?/*drive.google.com/open?id=[^&]*&authuser=0|^(https?:)?/*drive.google.com/open?id=[^&]*|^(https?:)?/*[^.]*.googledrive.com/host/[^/]*/",cls:TL.Media.GoogleDoc},{type:"pdf",name:"PDF",match_str:/^.*\.pdf(\?.*)?(\#.*)?/,cls:TL.Media.PDF},{type:"wikipedia",name:"Wikipedia",match_str:"^(https?:)?/*(www.)?wikipedia.org|^(https?:)?/*([a-z][a-z].)?wikipedia.org",cls:TL.Media.Wikipedia},{type:"spotify",name:"spotify",match_str:"spotify",cls:TL.Media.Spotify},{type:"iframe",name:"iFrame",match_str:"iframe",cls:TL.Media.IFrame},{type:"storify",name:"Storify",match_str:"storify",cls:TL.Media.Storify},{type:"blockquote",name:"Quote",match_str:"blockquote",cls:TL.Media.Blockquote},
// {
//     type:         "website",
//     name:         "Website",
//     match_str:     "https?://",
//     cls:         TL.Media.Website
// },
{type:"video",name:"Video",match_str:/(mp4)(\?.*)?$/i,cls:TL.Media.Video},{type:"wistia",name:"Wistia",match_str:/https?:\/\/(.+)?(wistia\.com|wi\.st)\/.*/i,cls:TL.Media.Wistia},{type:"audio",name:"Audio",match_str:/(mp3|wav|m4a)(\?.*)?$/i,cls:TL.Media.Audio},{type:"imageblank",name:"Imageblank",match_str:"",cls:TL.Media.Image}];if(e){if(t instanceof Array)return!1;for(var a=0;a<n.length;a++)switch(n[a].type){case"flickr":case"image":case"instagram":if(t.url.match(n[a].match_str))return i=n[a];break;default:break}}else for(var a=0;a<n.length;a++){if(t instanceof Array)return i={type:"slider",cls:TL.Media.Slider};if(t.url.match(n[a].match_str))return i=n[a]}return!1},
/*	TL.Media
	Main media template for media assets.
	Takes a data object and populates a dom object
================================================== */
// TODO add link
TL.Media=TL.Class.extend({includes:[TL.Events,TL.I18NMixins],_el:{},
/*	Constructor
	================================================== */
initialize:function(t,e,i){
// DOM ELEMENTS
this._el={container:{},content_container:{},content:{},content_item:{},content_link:{},caption:null,credit:null,parent:{},link:null},
// Player (If Needed)
this.player=null,
// Timer (If Needed)
this.timer=null,this.load_timer=null,
// Message
this.message=null,
// Media ID
this.media_id=null,
// State
this._state={loaded:!1,show_meta:!1,media_loaded:!1},
// Data
this.data={unique_id:null,url:null,credit:null,caption:null,credit_alternate:null,caption_alternate:null,link:null,link_target:null},
//Options
this.options={api_key_flickr:"f2cc870b4d233dd0a5bfe73fd0d64ef0",api_key_googlemaps:"AIzaSyB9dW8e_iRrATFa8g24qB6BDBGdkrLDZYI",api_key_embedly:"",// ae2da610d1454b66abdf2e6a4c44026d
credit_height:0,caption_height:0,background:0},this.animator={},
// Merge Data and Options
TL.Util.mergeData(this.options,e),TL.Util.mergeData(this.data,t),
// Don't create DOM elements if this is background media
this.options.background||(this._el.container=TL.Dom.create("div","tl-media"),this.data.unique_id&&(this._el.container.id=this.data.unique_id),this._initLayout(),i&&(i.appendChild(this._el.container),this._el.parent=i))},loadMedia:function(){var t=this;if(!this._state.loaded)try{this.load_timer=setTimeout(function(){t.loadingMessage(),t._loadMedia(),
// self._state.loaded = true; handled in onLoaded()
t._updateDisplay()},1200)}catch(t){trace("Error loading media for ",this._media),trace(t)}},_updateMessage:function(t){this.message&&this.message.updateMessage(t)},loadingMessage:function(){this._updateMessage(this._("loading")+" "+this.options.media_name)},errorMessage:function(t){t=t?this._("error")+": "+t:this._("error"),this._updateMessage(t)},updateMediaDisplay:function(t){this._state.loaded&&!this.options.background&&(TL.Browser.mobile?this._el.content_item.style.maxHeight=this.options.height/2+"px":this._el.content_item.style.maxHeight=this.options.height-this.options.credit_height-this.options.caption_height-30+"px",
//this._el.content_item.style.maxWidth = this.options.width + "px";
this._el.container.style.maxWidth=this.options.width+"px",
// Fix for max-width issues in Firefox
TL.Browser.firefox&&(this._el.content_item.offsetWidth,this._el.content_item.offsetHeight),this._updateMediaDisplay(t),this._state.media_loaded&&(this._el.credit&&(this._el.credit.style.width=this._el.content_item.offsetWidth+"px"),this._el.caption&&(this._el.caption.style.width=this._el.content_item.offsetWidth+"px")))},
/*	Media Specific
	================================================== */
_loadMedia:function(){
// All overrides must call this.onLoaded() to set state
this.onLoaded()},_updateMediaDisplay:function(t){
//this._el.content_item.style.maxHeight = (this.options.height - this.options.credit_height - this.options.caption_height - 16) + "px";
TL.Browser.firefox&&(this._el.content_item.style.maxWidth=this.options.width+"px",this._el.content_item.style.width="auto")},_getMeta:function(){},_getImageURL:function(t,e){
// Image-based media types should return <img>-compatible src url
return""},
/*	Public
	================================================== */
show:function(){},hide:function(){},addTo:function(t){t.appendChild(this._el.container),this.onAdd()},removeFrom:function(t){t.removeChild(this._el.container),this.onRemove()},getImageURL:function(t,e){return this._getImageURL(t,e)},
// Update Display
updateDisplay:function(t,e,i){this._updateDisplay(t,e,i)},stopMedia:function(){this._stopMedia()},loadErrorDisplay:function(t){try{this._el.content.removeChild(this._el.content_item)}catch(t){
// if this._el.content_item isn't a child of this._el then just keep truckin
}this._el.content_item=TL.Dom.create("div","tl-media-item tl-media-loaderror",this._el.content),this._el.content_item.innerHTML="<div class='tl-icon-"+this.options.media_type+"'></div><p>"+t+"</p>",
// After Loaded
this.onLoaded(!0)},
/*	Events
	================================================== */
onLoaded:function(t){this._state.loaded=!0,this.fire("loaded",this.data),this.message&&this.message.hide(),t||this.options.background||this.showMeta(),this.updateDisplay()},onMediaLoaded:function(t){this._state.media_loaded=!0,this.fire("media_loaded",this.data),this._el.credit&&(this._el.credit.style.width=this._el.content_item.offsetWidth+"px"),this._el.caption&&(this._el.caption.style.width=this._el.content_item.offsetWidth+"px")},showMeta:function(t,e){this._state.show_meta=!0,
// Credit
this.data.credit&&""!=this.data.credit&&(this._el.credit=TL.Dom.create("div","tl-credit",this._el.content_container),this._el.credit.innerHTML=1==this.options.autolink?TL.Util.linkify(this.data.credit):this.data.credit,this.options.credit_height=this._el.credit.offsetHeight),
// Caption
this.data.caption&&""!=this.data.caption&&(this._el.caption=TL.Dom.create("div","tl-caption",this._el.content_container),this._el.caption.innerHTML=1==this.options.autolink?TL.Util.linkify(this.data.caption):this.data.caption,this.options.caption_height=this._el.caption.offsetHeight),this.data.caption&&this.data.credit||this.getMeta()},getMeta:function(){this._getMeta()},updateMeta:function(){!this.data.credit&&this.data.credit_alternate&&(this._el.credit=TL.Dom.create("div","tl-credit",this._el.content_container),this._el.credit.innerHTML=this.data.credit_alternate,this.options.credit_height=this._el.credit.offsetHeight),!this.data.caption&&this.data.caption_alternate&&(this._el.caption=TL.Dom.create("div","tl-caption",this._el.content_container),this._el.caption.innerHTML=this.data.caption_alternate,this.options.caption_height=this._el.caption.offsetHeight),this.updateDisplay()},onAdd:function(){this.fire("added",this.data)},onRemove:function(){this.fire("removed",this.data)},
/*	Private Methods
	================================================== */
_initLayout:function(){
// Message
this.message=new TL.Message({},this.options),this.message.addTo(this._el.container),
// Create Layout
this._el.content_container=TL.Dom.create("div","tl-media-content-container",this._el.container),
// Link
this.data.link&&""!=this.data.link?(this._el.link=TL.Dom.create("a","tl-media-link",this._el.content_container),this._el.link.href=this.data.link,this.data.link_target&&""!=this.data.link_target?this._el.link.target=this.data.link_target:this._el.link.target="_blank",this._el.content=TL.Dom.create("div","tl-media-content",this._el.link)):this._el.content=TL.Dom.create("div","tl-media-content",this._el.content_container)},
// Update Display
_updateDisplay:function(t,e,i){t&&(this.options.width=t),
//this._el.container.style.width = this.options.width + "px";
e&&(this.options.height=e),i&&(this.options.layout=i),this._el.credit&&(this.options.credit_height=this._el.credit.offsetHeight),this._el.caption&&(this.options.caption_height=this._el.caption.offsetHeight+5),this.updateMediaDisplay(this.options.layout)},_stopMedia:function(){}}),
/*	TL.Media.Blockquote
================================================== */
TL.Media.Blockquote=TL.Media.extend({includes:[TL.Events],
/*	Load the media
	================================================== */
_loadMedia:function(){
// Create Dom element
this._el.content_item=TL.Dom.create("div","tl-media-item tl-media-blockquote",this._el.content),this._el.content_container.className="tl-media-content-container tl-media-content-container-text",
// Get Media ID
this.media_id=this.data.url,
// API Call
this._el.content_item.innerHTML=this.media_id,
// After Loaded
this.onLoaded()},updateMediaDisplay:function(){},_updateMediaDisplay:function(){}}),
/*	TL.Media.DailyMotion
================================================== */
TL.Media.DailyMotion=TL.Media.extend({includes:[TL.Events],
/*	Load the media
	================================================== */
_loadMedia:function(){var t,e=this;
// Create Dom element
this._el.content_item=TL.Dom.create("div","tl-media-item tl-media-iframe tl-media-dailymotion",this._el.content),
// Get Media ID
this.data.url.match("video")?this.media_id=this.data.url.split("video/")[1].split(/[?&]/)[0]:this.media_id=this.data.url.split("embed/")[1].split(/[?&]/)[0],
// API URL
t="https://www.dailymotion.com/embed/video/"+this.media_id+"?api=postMessage",
// API Call
this._el.content_item.innerHTML="<iframe autostart='false' frameborder='0' width='100%' height='100%' src='"+t+"'></iframe>",
// After Loaded
this.onLoaded()},
// Update Media Display
_updateMediaDisplay:function(){this._el.content_item.style.height=TL.Util.ratio.r16_9({w:this._el.content_item.offsetWidth})+"px"},_stopMedia:function(){this._el.content_item.querySelector("iframe").contentWindow.postMessage('{"command":"pause","parameters":[]}',"*")}}),
/*	TL.Media.DocumentCloud
================================================== */
TL.Media.DocumentCloud=TL.Media.extend({includes:[TL.Events],
/*	Load the media
	================================================== */
_loadMedia:function(){var t=this;
// Create Dom elements
this._el.content_item=TL.Dom.create("div","tl-media-item tl-media-documentcloud tl-media-shadow",this._el.content),this._el.content_item.id=TL.Util.unique_ID(7),
// Check url
this.data.url.match(/\.html$/)?this.data.url=this._transformURL(this.data.url):this.data.url.match(/.(json|js)$/)||trace("DOCUMENT CLOUD IN URL BUT INVALID SUFFIX"),
// Load viewer API
TL.Load.js(["https://assets.documentcloud.org/viewer/loader.js","https://assets.documentcloud.org/viewer/viewer.js"],function(){t.createMedia()})},
// Viewer API needs js, not html
_transformURL:function(t){return t.replace(/(.*)\.html$/,"$1.js")},
// Update Media Display
_updateMediaDisplay:function(){this._el.content_item.style.height=this.options.height+"px";
//this._el.content_item.style.width = this.options.width + "px";
},createMedia:function(){
// DocumentCloud API call
DV.load(this.data.url,{container:"#"+this._el.content_item.id,showSidebar:!1}),this.onLoaded()}}),
/*	TL.Media.Flickr

================================================== */
TL.Media.Flickr=TL.Media.extend({includes:[TL.Events],
/*	Load the media
	================================================== */
_loadMedia:function(){var t,e=this;try{
// Get Media ID
this.establishMediaID(),
// API URL
t="https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key="+this.options.api_key_flickr+"&photo_id="+this.media_id+"&format=json&jsoncallback=?",
// API Call
TL.getJSON(t,function(t){"ok"==t.stat?(e.sizes=t.sizes.size,// store sizes info
e.options.background||e.createMedia(),e.onLoaded()):e.loadErrorDisplay(e._("flickr_notfound_err"))})}catch(t){e.loadErrorDisplay(e._(t.message_key))}},establishMediaID:function(){if(this.data.url.match(/flic.kr\/.+/i)){var t=this.data.url.split("/").slice(-1)[0];this.media_id=TL.Util.base58.decode(t)}else{var e="flickr.com/photos/",i=this.data.url.indexOf(e);if(-1==i)throw new TL.Error("flickr_invalidurl_err");var n=i+e.length;this.media_id=this.data.url.substr(n).split("/")[1]}},createMedia:function(){var e=this;
// Link
this._el.content_link=TL.Dom.create("a","",this._el.content),this._el.content_link.href=this.data.url,this._el.content_link.target="_blank",
// Photo
this._el.content_item=TL.Dom.create("img","tl-media-item tl-media-image tl-media-flickr tl-media-shadow",this._el.content_link),this.data.alt?this._el.content_item.alt=this.data.alt:this.data.caption&&(this._el.content_item.alt=TL.Util.unhtmlify(this.data.caption)),this.data.title?this._el.content_item.title=this.data.title:this.data.caption&&(this._el.content_item.title=TL.Util.unhtmlify(this.data.caption)),
// Media Loaded Event
this._el.content_item.addEventListener("load",function(t){e.onMediaLoaded()}),
// Set Image Source
this._el.content_item.src=this.getImageURL(this.options.width,this.options.height)},getImageURL:function(t,e){for(var i=this.size_label(e),n=this.sizes[this.sizes.length-2].source,a=0;a<this.sizes.length;a++)this.sizes[a].label==i&&(n=this.sizes[a].source);return n},_getMeta:function(){var e=this,t;
// API URL
t="https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key="+this.options.api_key_flickr+"&photo_id="+this.media_id+"&format=json&jsoncallback=?",
// API Call
TL.getJSON(t,function(t){e.data.credit_alternate="<a href='"+e.data.url+"' target='_blank'>"+t.photo.owner.realname+"</a>",e.data.caption_alternate=t.photo.title._content+" "+t.photo.description._content,e.updateMeta()})},size_label:function(t){var e="";return e=t<=75?t<=0?"Large":"Thumbnail":t<=180?"Small":t<=240?"Small 320":t<=375?"Medium":t<=480?"Medium 640":"Large"}}),
/*	TL.Media.GoogleDoc

================================================== */
TL.Media.GoogleDoc=TL.Media.extend({includes:[TL.Events],
/*	Load the media
	================================================== */
_loadMedia:function(){var t,e=this;
// Create Dom element
// Get Media ID
if(this._el.content_item=TL.Dom.create("div","tl-media-item tl-media-iframe",this._el.content),this.data.url.match("open?id="))this.media_id=this.data.url.split("open?id=")[1],this.data.url.match("&authuser=0")&&(t=this.media_id.match("&authuser=0")[0]);else if(this.data.url.match(/file\/d\/([^/]*)\/?/)){var i;t="https://drive.google.com/file/d/"+this.data.url.match(/file\/d\/([^/]*)\/?/)[1]+"/preview"}else t=this.data.url;
// this URL makes something suitable for an img src but what if it's not an image?
// api_url = "http://www.googledrive.com/host/" + this.media_id + "/";
this._el.content_item.innerHTML="<iframe class='doc' frameborder='0' width='100%' height='100%' src='"+t+"'></iframe>",
// After Loaded
this.onLoaded()},
// Update Media Display
_updateMediaDisplay:function(){this._el.content_item.style.height=this.options.height+"px"}}),
/*	TL.Media.GooglePlus
================================================== */
TL.Media.GooglePlus=TL.Media.extend({includes:[TL.Events],
/*	Load the media
	================================================== */
_loadMedia:function(){var t,e=this;
// Create Dom element
this._el.content_item=TL.Dom.create("div","tl-media-item tl-media-googleplus",this._el.content),
// Get Media ID
this.media_id=this.data.url,
// API URL
t=this.media_id,
// API Call
this._el.content_item.innerHTML="<iframe frameborder='0' width='100%' height='100%' src='"+t+"'></iframe>",
// After Loaded
this.onLoaded()},
// Update Media Display
_updateMediaDisplay:function(){this._el.content_item.style.height=this.options.height+"px"}}),
/*	TL.Media.IFrame
================================================== */
TL.Media.IFrame=TL.Media.extend({includes:[TL.Events],
/*	Load the media
	================================================== */
_loadMedia:function(){var t,e=this;
// Create Dom element
this._el.content_item=TL.Dom.create("div","tl-media-item tl-media-iframe",this._el.content),
// Get Media ID
this.media_id=this.data.url,
// API URL
t=this.media_id,
// API Call
this._el.content_item.innerHTML=t,
// After Loaded
this.onLoaded()},
// Update Media Display
_updateMediaDisplay:function(){this._el.content_item.style.height=this.options.height+"px"}}),
/*	TL.Media.Image
	Produces image assets.
	Takes a data object and populates a dom object
================================================== */
TL.Media.Image=TL.Media.extend({includes:[TL.Events],
/*	Load the media
	================================================== */
_loadMedia:function(){
// Loading Message
this.loadingMessage(),
// Create media?
this.options.background||this.createMedia(),
// After loaded
this.onLoaded()},createMedia:function(){var e=this,t="tl-media-item tl-media-image tl-media-shadow";(this.data.url.match(/.png(\?.*)?$/)||this.data.url.match(/.svg(\?.*)?$/))&&(t="tl-media-item tl-media-image"),
// Link
this.data.link?(this._el.content_link=TL.Dom.create("a","",this._el.content),this._el.content_link.href=this.data.link,this._el.content_link.target="_blank",this._el.content_item=TL.Dom.create("img",t,this._el.content_link)):this._el.content_item=TL.Dom.create("img",t,this._el.content),this.data.alt?this._el.content_item.alt=this.data.alt:this.data.caption&&(this._el.content_item.alt=TL.Util.unhtmlify(this.data.caption)),this.data.title?this._el.content_item.title=this.data.title:this.data.caption&&(this._el.content_item.title=TL.Util.unhtmlify(this.data.caption)),
// Media Loaded Event
this._el.content_item.addEventListener("load",function(t){e.onMediaLoaded()}),this._el.content_item.src=this.getImageURL()},getImageURL:function(t,e){return TL.Util.transformImageURL(this.data.url)},_updateMediaDisplay:function(t){TL.Browser.firefox&&(
//this._el.content_item.style.maxWidth = (this.options.width/2) - 40 + "px";
this._el.content_item.style.width="auto")}}),
/*	TL.Media.Flickr

================================================== */
TL.Media.Imgur=TL.Media.extend({includes:[TL.Events],
/*	Load the media
	================================================== */
_loadMedia:function(){try{var t=this;if(this.data.url.match("<blockquote class=['\"]imgur-embed-pub['\"]")){var e=this.data.url.match(/(imgur\.com)\/(\w+)/);this.media_id=e[2],this.data.url="http://imgur.com/gallery/"+this.media_id}else this.data.url&&(this.media_id=this.data.url.split("/").slice(-1)[0]);TL.Load.js(["https://s.imgur.com/min/embed.js"],function(){t.createMedia()})}catch(t){this.loadErrorDisplay(this._("imgur_invalidurl_err"))}},createMedia:function(){var n=this,t="https://api.imgur.com/oembed.json?url="+this.data.url;
// Content div
this._el.content_item=TL.Dom.create("div","tl-media-item tl-media-image tl-media-imgur",this._el.content),
// API Call
TL.ajax({type:"GET",url:t,dataType:"json",success:function(t){try{n._el.content_item.innerHTML=t.html,setInterval(function(){null==document.querySelector("blockquote.imgur-embed-pub")?clearInterval():(imgurEmbed.createIframe(),document.getElementById("imageElement").removeAttribute("style"),document.getElementById("image").removeAttribute("style"))},2e3)}catch(t){}},error:function(t,e,i){if(tc=new TL.TimelineConfig,"parsererror"==e)var i=new TL.Error("invalid_url_err");else var i=new TL.Error("unknown_read_err",e);n.loadErrorDisplay(n._("imgur_invalidurl_err")),tc.logError(i)}}),this.onLoaded()},_updateMediaDisplay:function(){
//this.el.content_item = document.getElementById(this._el.content_item.id);
this._el.content_item.style.width=this.options.width+"px",this._el.content_item.style.height=TL.Util.ratio.r16_9({w:this.options.width})+"px"}}),
/*	TL.Media.Instagram

================================================== */
TL.Media.Instagram=TL.Media.extend({includes:[TL.Events],
/*	Load the media
	================================================== */
_loadMedia:function(){
// Get Media ID
this.media_id=this.data.url.split("/p/")[1].split("/")[0],this.options.background||this.createMedia(),
// After Loaded
this.onLoaded()},createMedia:function(){var e=this;
// Link
this._el.content_link=TL.Dom.create("a","",this._el.content),this._el.content_link.href=this.data.url,this._el.content_link.target="_blank",
// Photo
this._el.content_item=TL.Dom.create("img","tl-media-item tl-media-image tl-media-instagram tl-media-shadow",this._el.content_link),this.data.alt?this._el.content_item.alt=this.data.alt:this.data.caption&&(this._el.content_item.alt=TL.Util.unhtmlify(this.data.caption)),this.data.title?this._el.content_item.title=this.data.title:this.data.caption&&(this._el.content_item.title=TL.Util.unhtmlify(this.data.caption)),
// Media Loaded Event
this._el.content_item.addEventListener("load",function(t){e.onMediaLoaded()}),this._el.content_item.src=this.getImageURL(this._el.content.offsetWidth)},getImageURL:function(t,e){return"https://instagram.com/p/"+this.media_id+"/media/?size="+this.sizes(t)},_getMeta:function(){var e=this,t;
// API URL
t="https://api.instagram.com/oembed?url=https://instagr.am/p/"+this.media_id+"&callback=?",
// API Call
TL.getJSON(t,function(t){e.data.credit_alternate="<a href='"+t.author_url+"' target='_blank'>"+t.author_name+"</a>",e.data.caption_alternate=t.title,e.updateMeta()})},sizes:function(t){var e="";return e=t<=150?"t":t<=306?"m":"l"}}),
/*  TL.Media.Map
================================================== */
TL.Media.GoogleMap=TL.Media.extend({includes:[TL.Events],
/*  Load the media
	================================================== */
_loadMedia:function(){
// Create Dom element
this._el.content_item=TL.Dom.create("div","tl-media-item tl-media-map tl-media-shadow",this._el.content),
// Get Media ID
this.media_id=this.data.url,
// API Call
this.mapframe=TL.Dom.create("iframe","",this._el.content_item),(window.stash=this).mapframe.width="100%",this.mapframe.height="100%",this.mapframe.frameBorder="0",this.mapframe.src=this.makeGoogleMapsEmbedURL(this.media_id,this.options.api_key_googlemaps),
// After Loaded
this.onLoaded()},_updateMediaDisplay:function(){if(this._state.loaded){var t=TL.Util.ratio.square({w:this._el.content_item.offsetWidth});this._el.content_item.style.height=t.h+"px"}},makeGoogleMapsEmbedURL:function(t,r){function e(a){function o(t,e){
// Set the zoom param
if("z"==t.slice(-1))e.zoom=t;
// Set the maptype to something other than "roadmap"
else if("m"==t.slice(-1))
// TODO: make this somehow interpret the correct zoom level
// until then fake it by using Google's default zoom level
e.zoom=14,e.maptype="satellite";else if("t"==t.slice(-1)){
// streetview uses "location" instead of "center"
// "place" mode doesn't have the center param, so we may need to grab that now
if(l=!0,"place"==mapmode)var i=a.match(d.place)[3]+","+a.match(d.place)[4];else{var i=e.center;delete e.center}
// Clear out all the other params -- this is so hacky
for(param in(e={}).location=i,streetview_params=t.split(","),h.streetview){var n=parseInt(param)+1;"pitch"==h.streetview[param]&&"90t"==streetview_params[n]?
// Although 90deg is the horizontal default in the URL, 0 is horizontal default for embed URL. WHY??
// https://developers.google.com/maps/documentation/javascript/streetview
e[h.streetview[param]]=0:e[h.streetview[param]]=streetview_params[n].slice(0,-1)}}return e}function t(t,e){var i={},n=e[1],a=e[e.length-1];for(param in h[t]){
// skip first 2 matches, because they reflect the URL and not params
var s=parseInt(param)+2;"center"==h[t][param]?i[h[t][param]]=e[s]+","+e[++s]:i[h[t][param]]=e[s]}return(i=o(a,i)).key=r,1==l&&(t="streetview"),n+"/embed/v1/"+t+TL.Util.getParamString(i)}return mapmode="view",a.match(d.place)?mapmode="place":a.match(d.directions)?mapmode="directions":a.match(d.search)&&(mapmode="search"),t(mapmode,a.match(d[mapmode]))}
// These must be in the order they appear in the original URL
// "key" param not included since it's not in the URL structure
// Streetview "location" param not included since it's captured as "center"
// Place "center" param ...um...
// Test with https://docs.google.com/spreadsheets/d/1zCpvtRdftlR5fBPppmy_-SkGIo7RMwoPUiGFZDAXbTc/edit
var l=!1,h={view:["center"],place:["q","center"],directions:["origin","destination","center"],search:["q","center"],streetview:["fov","heading","pitch"]},i=/(https:\/\/.+google.+?\/maps)/,n=/@([-\d.]+),([-\d.]+)/,a=/([\w\W]+)/,s=/data=[\S]*/,o=/,((?:[-\d.]+[zmayht],?)*)/,d={view:new RegExp(i.source+"/"+n.source+o.source),place:new RegExp(i.source+"/place/"+a.source+"/"+n.source+o.source),directions:new RegExp(i.source+"/dir/"+a.source+"/"+a.source+"/"+n.source+o.source),search:new RegExp(i.source+"/search/"+a.source+"/"+n.source+o.source)};return e(t)}}),
/*	TL.Media.PDF
 * Chrome and Firefox on both OSes and Safari all support PDFs as iframe src.
 * This prompts for a download on IE10/11. We should investigate using
 * https://mozilla.github.io/pdf.js/ to support showing PDFs on IE.
================================================== */
TL.Media.PDF=TL.Media.extend({includes:[TL.Events],
/*	Load the media
	================================================== */
_loadMedia:function(){var t=TL.Util.transformImageURL(this.data.url),e=this;
// Create Dom element
this._el.content_item=TL.Dom.create("div","tl-media-item tl-media-iframe",this._el.content);var i="";
// not assigning media_id attribute. Seems like a holdover which is no longer used.
i=TL.Browser.ie||TL.Browser.edge||t.match(/dl.dropboxusercontent.com/)?"<iframe class='doc' frameborder='0' width='100%' height='100%' src='//docs.google.com/viewer?url="+t+"&amp;embedded=true'></iframe>":"<iframe class='doc' frameborder='0' width='100%' height='100%' src='"+t+"'></iframe>",this._el.content_item.innerHTML=i,this.onLoaded()},
// Update Media Display
_updateMediaDisplay:function(){this._el.content_item.style.height=this.options.height+"px"}}),
/*	TL.Media.Profile

================================================== */
TL.Media.Profile=TL.Media.extend({includes:[TL.Events],
/*	Load the media
	================================================== */
_loadMedia:function(){this._el.content_item=TL.Dom.create("img","tl-media-item tl-media-image tl-media-profile tl-media-shadow",this._el.content),this._el.content_item.src=this.data.url,this.onLoaded()},_updateMediaDisplay:function(t){TL.Browser.firefox&&(this._el.content_item.style.maxWidth=this.options.width/2-40+"px")}}),
/*	TL.Media.SLider
	Produces a Slider
	Takes a data object and populates a dom object
	TODO
	Placeholder
================================================== */
TL.Media.Slider=TL.Media.extend({includes:[TL.Events],
/*	Load the media
	================================================== */
_loadMedia:function(){this._el.content_item=TL.Dom.create("img","tl-media-item tl-media-image",this._el.content),this._el.content_item.src=this.data.url,this.onLoaded()}});
/*	TL.Media.SoundCloud
================================================== */
var soundCoudCreated=!1,mediaID;TL.Media.SoundCloud=TL.Media.extend({includes:[TL.Events],
/*	Load the media
	================================================== */
_loadMedia:function(){var t,e=this;
// Create Dom element
this._el.content_item=TL.Dom.create("div","tl-media-item tl-media-iframe tl-media-soundcloud tl-media-shadow",this._el.content),
// Get Media ID
this.media_id=this.data.url,
// API URL
t="https://soundcloud.com/oembed?url="+this.media_id+"&format=js&callback=?",
// API Call
TL.getJSON(t,function(t){TL.Load.js("https://w.soundcloud.com/player/api.js",function(){//load soundcloud api for pausing.
e.createMedia(t)})})},createMedia:function(t){this._el.content_item.innerHTML=t.html,this.soundCloudCreated=!0,self.widget=SC.Widget(this._el.content_item.querySelector("iframe")),//create widget for api use
// After Loaded
this.onLoaded()},_stopMedia:function(){this.soundCloudCreated&&self.widget.pause()}}),
/*	TL.Media.Spotify
================================================== */
TL.Media.Spotify=TL.Media.extend({includes:[TL.Events],
/*	Load the media
	================================================== */
_loadMedia:function(){var t,e=this;
// Create Dom element
if(this._el.content_item=TL.Dom.create("div","tl-media-item tl-media-iframe tl-media-spotify",this._el.content),
// Get Media ID
(this.data.url.match(/^spotify:track/)||this.data.url.match(/^spotify:album/)||this.data.url.match(/^spotify:user:.+:playlist:/))&&(this.media_id=this.data.url),this.data.url.match(/spotify\.com\/track\/(.+)/))this.media_id="spotify:track:"+this.data.url.match(/spotify\.com\/track\/(.+)/)[1];else if(this.data.url.match(/spotify\.com\/album\/(.+)/))this.media_id="spotify:album:"+this.data.url.match(/spotify\.com\/album\/(.+)/)[1];else if(this.data.url.match(/spotify\.com\/user\/(.+?)\/playlist\/(.+)/)){var i=this.data.url.match(/spotify\.com\/user\/(.+?)\/playlist\/(.+)/)[1],n=this.data.url.match(/spotify\.com\/user\/(.+?)\/playlist\/(.+)/)[2];this.media_id="spotify:user:"+i+":playlist:"+n}else if(this.data.url.match(/spotify\.com\/artist\/(.+)/)){var a=this.data.url.match(/spotify\.com\/artist\/(.+)/)[1];this.media_id="spotify:artist:"+a}this.media_id?(
// API URL
t="https://embed.spotify.com/?uri="+this.media_id+"&theme=white&view=coverart",this.player=TL.Dom.create("iframe","tl-media-shadow",this._el.content_item),this.player.width="100%",this.player.height="100%",this.player.frameBorder="0",this.player.src=t,
// After Loaded
this.onLoaded()):this.loadErrorDisplay(this._("spotify_invalid_url"))},
// Update Media Display
_updateMediaDisplay:function(t){var e=this.options.height,i=0,n=0;e=TL.Browser.mobile?this.options.height/2:this.options.height-this.options.credit_height-this.options.caption_height-30,this._el.content_item.style.maxHeight="none",trace(e),trace(this.options.width),n=e>this.options.width?(trace("height is greater"),i=this.options.width+80+"px",this.options.width+"px"):(trace("width is greater"),trace(this.options.width),i=e+"px",e-80+"px"),this.player.style.width=n,this.player.style.height=i,this._el.credit&&(this._el.credit.style.width=n),this._el.caption&&(this._el.caption.style.width=n)},_stopMedia:function(){
// Need spotify stop code
}}),
/*	TL.Media.Storify
================================================== */
TL.Media.Storify=TL.Media.extend({includes:[TL.Events],
/*	Load the media
	================================================== */
_loadMedia:function(){var t;
// Create Dom element
this._el.content_item=TL.Dom.create("div","tl-media-item tl-media-iframe tl-media-storify",this._el.content),
// Get Media ID
this.media_id=this.data.url,
// Content
t="<iframe frameborder='0' width='100%' height='100%' src='"+this.media_id+"/embed'></iframe>",t+="<script src='"+this.media_id+".js'><\/script>",
// API Call
this._el.content_item.innerHTML=t,
// After Loaded
this.onLoaded()},
// Update Media Display
_updateMediaDisplay:function(){this._el.content_item.style.height=this.options.height+"px"}}),TL.Media.Text=TL.Class.extend({includes:[TL.Events],
// DOM ELEMENTS
_el:{container:{},content_container:{},content:{},headline:{},date:{}},
// Data
data:{unique_id:"",headline:"headline",text:"text"},
// Options
options:{title:!1},
/*	Constructor
	================================================== */
initialize:function(t,e,i){TL.Util.setData(this,t),
// Merge Options
TL.Util.mergeData(this.options,e),this._el.container=TL.Dom.create("div","tl-text"),this._el.container.id=this.data.unique_id,this._initLayout(),i&&i.appendChild(this._el.container)},
/*	Adding, Hiding, Showing etc
	================================================== */
show:function(){},hide:function(){},addTo:function(t){t.appendChild(this._el.container);
//this.onAdd();
},removeFrom:function(t){t.removeChild(this._el.container)},headlineHeight:function(){return this._el.headline.offsetHeight+40},addDateText:function(t){this._el.date.innerHTML=t},
/*	Events
	================================================== */
onLoaded:function(){this.fire("loaded",this.data)},onAdd:function(){this.fire("added",this.data)},onRemove:function(){this.fire("removed",this.data)},
/*	Private Methods
	================================================== */
_initLayout:function(){
// Headline
if(
// Create Layout
this._el.content_container=TL.Dom.create("div","tl-text-content-container",this._el.container),
// Date
this._el.date=TL.Dom.create("h3","tl-headline-date",this._el.content_container),""!=this.data.headline){var t="tl-headline";this.options.title&&(t="tl-headline tl-headline-title"),this._el.headline=TL.Dom.create("h2",t,this._el.content_container),this._el.headline.innerHTML=this.data.headline}
// Text
if(""!=this.data.text){var e="";e+=TL.Util.htmlify(1==this.options.autolink?TL.Util.linkify(this.data.text):this.data.text),trace(this.data.text),this._el.content=TL.Dom.create("div","tl-text-content",this._el.content_container),this._el.content.innerHTML=e,trace(e),trace(this._el.content)}
// Fire event that the slide is loaded
this.onLoaded()}}),
/*	TL.Media.Twitter
	Produces Twitter Display
================================================== */
TL.Media.Twitter=TL.Media.extend({includes:[TL.Events],
/*	Load the media
	================================================== */
_loadMedia:function(){var t,n=this;
// Create Dom element
// Get Media ID
if(this._el.content_item=TL.Dom.create("div","tl-media-twitter",this._el.content),this._el.content_container.className="tl-media-content-container tl-media-content-container-text",this.data.url.match("^(https?:)?/*(www.)?twitter.com"))this.data.url.match("status/")?this.media_id=this.data.url.split("status/")[1]:this.data.url.match("statuses/")?this.media_id=this.data.url.split("statuses/")[1]:this.media_id="";else if(this.data.url.match("<blockquote class=['\"]twitter-tweet['\"]")){var e=this.data.url.match(/(status|statuses)\/(\d+)/);if(!(e&&2<e.length))return void n.loadErrorDisplay(n._("twitterembed_invalidurl_err"));this.media_id=e[2]}
// API URL
t="https://api.twitter.com/1/statuses/oembed.json?id="+this.media_id+"&omit_script=true&include_entities=true&callback=?",
// API Call
TL.ajax({type:"GET",url:t,dataType:"json",//json data type
success:function(t){n.createMedia(t)},error:function(t,e){var i="";i+=n._("twitter_load_err")+"<br/>"+n.media_id+"<br/>"+e,n.loadErrorDisplay(i)}})},createMedia:function(t){trace("create_media");var e="",i="",n="",a="",s="",o="",r=this;
//	TWEET CONTENT
i=t.html.split("</p>&mdash;")[0]+"</p></blockquote>",n=t.author_url.split("twitter.com/")[1],s=(a=t.html.split("</p>&mdash;")[1].split('<a href="')[1]).split('">')[0],o=a.split('">')[1].split("</a>")[0],(
// Open links in new window
i=i.replace(/<a href/gi,'<a target="_blank" href')).includes("pic.twitter.com")?TL.Load.js("https://platform.twitter.com/widgets.js",function(){twttr.widgets.createTweet(r.media_id,r._el.content_item,{conversation:"none",// or all
linkColor:"#cc0000",// default is blue
theme:"light"})}):(
// 	TWEET CONTENT
e+=i,
//	TWEET AUTHOR
e+="<div class='vcard'>",e+="<a href='"+s+"' class='twitter-date' target='_blank'>"+o+"</a>",e+="<img src='' class='tl-media-item tl-media-image' target='_blank'></a>",e+="<div class='author'>",e+="<a class='screen-name url' href='"+t.author_url+"' target='_blank'>",e+="<span class='avatar'></span>",e+="<span class='fn'>"+t.author_name+" <span class='tl-icon-twitter'></span></span>",e+="<span class='nickname'>@"+n+"<span class='thumbnail-inline'></span></span>",e+="</a>",e+="</div>",e+="</div>",
// Add to DOM
this._el.content_item.innerHTML=e),this.onLoaded()},updateMediaDisplay:function(){},_updateMediaDisplay:function(){}}),TL.Media.TwitterEmbed=TL.Media.extend({includes:[TL.Events],
/*	Load the media
	================================================== */
_loadMedia:function(){var t,n=this;
// Create Dom element
this._el.content_item=TL.Dom.create("div","tl-media-twitter",this._el.content),this._el.content_container.className="tl-media-content-container tl-media-content-container-text";
// Get Media ID
var e=this.data.url.match(/(status|statuses)\/(\d+)/),i,a,s,o,r,l;e&&2<e.length?(this.media_id=e[2],
// API URL
t="https://api.twitter.com/1/statuses/oembed.json?id="+this.media_id+"&omit_script=true&include_entities=true&callback=?",window.twttr=(i=document,a="script",s="twitter-wjs",r=i.getElementsByTagName(a)[0],l=window.twttr||{},i.getElementById(s)||((o=i.createElement(a)).id=s,o.src="https://platform.twitter.com/widgets.js",r.parentNode.insertBefore(o,r),l._e=[],l.ready=function(t){l._e.push(t)}),l),mediaID=this.media_id,
// API Call
TL.ajax({type:"GET",url:t,dataType:"json",//json data type
success:function(t){n.createMedia(t)},error:function(t,e){var i="";i+=n._("twitter_load_err")+"<br/>"+n.media_id+"<br/>"+e,n.loadErrorDisplay(i)}})):n.loadErrorDisplay(n._("twitterembed_invalidurl_err"))},createMedia:function(t){trace("create_media");var i="",e="",n="",a="",s="",o="";
//	TWEET CONTENT
e=t.html.split("</p>&mdash;")[0]+"</p></blockquote>",console.log(e),n=t.author_url.split("twitter.com/")[1],s=(a=t.html.split("</p>&mdash;")[1].split('<a href="')[1]).split('">')[0],o=a.split('">')[1].split("</a>")[0],(
// Open links in new window
e=e.replace(/<a href/gi,'<a target="_blank" href')).includes("pic.twitter.com")?twttr.ready(function(t){i=document.getElementsByClassName("tl-media-twitter")[0];var e=String(mediaID);twttr.widgets.createTweet(e,i,{conversation:"none",// or all
linkColor:"#cc0000",// default is blue
theme:"light"}).then(function(t){this.onLoaded()})}):(
// 	TWEET CONTENT
i+=e,
//	TWEET AUTHOR
i+="<div class='vcard'>",i+="<a href='"+s+"' class='twitter-date' target='_blank'>"+o+"</a>",i+="<div class='author'>",i+="<a class='screen-name url' href='"+t.author_url+"' target='_blank'>",i+="<span class='avatar'></span>",i+="<span class='fn'>"+t.author_name+" <span class='tl-icon-twitter'></span></span>",i+="<span class='nickname'>@"+n+"<span class='thumbnail-inline'></span></span>",i+="</a>",i+="</div>",i+="</div>"),this._el.content_item.innerHTML=i,this.onLoaded()},updateMediaDisplay:function(){},_updateMediaDisplay:function(){}}),
/*	TL.Media.Vimeo
================================================== */
TL.Media.Vimeo=TL.Media.extend({includes:[TL.Events],
/*	Load the media
	================================================== */
_loadMedia:function(){var t,e=this;
// Create Dom element
this._el.content_item=TL.Dom.create("div","tl-media-item tl-media-iframe tl-media-vimeo tl-media-shadow",this._el.content),
// Get Media ID
this.media_id=this.data.url.split(/video\/|\/\/vimeo\.com\//)[1].split(/[?&]/)[0];var i=null;
// Get start time
this.data.url.match(/#t=([^&]+).*/)&&(i=this.data.url.match(/#t=([^&]+).*/)[1]),
// API URL
t="https://player.vimeo.com/video/"+this.media_id+"?api=1&title=0&amp;byline=0&amp;portrait=0&amp;color=ffffff",i&&(t=t+="&amp;#t="+i),this.player=TL.Dom.create("iframe","",this._el.content_item),
// Media Loaded Event
this.player.addEventListener("load",function(t){e.onMediaLoaded()}),this.player.width="100%",this.player.height="100%",this.player.frameBorder="0",this.player.src=t,this.player.setAttribute("allowfullscreen",""),this.player.setAttribute("webkitallowfullscreen",""),this.player.setAttribute("mozallowfullscreen",""),
// After Loaded
this.onLoaded()},
// Update Media Display
_updateMediaDisplay:function(){this._el.content_item.style.height=TL.Util.ratio.r16_9({w:this._el.content_item.offsetWidth})+"px"},_stopMedia:function(){try{this.player.contentWindow.postMessage(JSON.stringify({method:"pause"}),"https://player.vimeo.com")}catch(t){trace(t)}}}),
/*	TL.Media.Vine

================================================== */
TL.Media.Vine=TL.Media.extend({includes:[TL.Events],
/*	Load the media
	================================================== */
_loadMedia:function(){var t,e=this;
// Create Dom element
this._el.content_item=TL.Dom.create("div","tl-media-item tl-media-iframe tl-media-vine tl-media-shadow",this._el.content),
// Get Media ID
this.media_id=this.data.url.split("vine.co/v/")[1],
// API URL
t="https://vine.co/v/"+this.media_id+"/embed/simple",
// API Call
this._el.content_item.innerHTML="<iframe frameborder='0' width='100%' height='100%' src='"+t+"'></iframe><script async src='https://platform.vine.co/static/scripts/embed.js' charset='utf-8'><\/script>",
// After Loaded
this.onLoaded()},
// Update Media Display
_updateMediaDisplay:function(){var t=TL.Util.ratio.square({w:this._el.content_item.offsetWidth,h:this.options.height});this._el.content_item.style.height=t.h+"px"},_stopMedia:function(){this._el.content_item.querySelector("iframe").contentWindow.postMessage("pause","*")}}),
/*	TL.Media.Website
	Uses Embedly
	http://embed.ly/docs/api/extract/endpoints/1/extract
================================================== */
TL.Media.Website=TL.Media.extend({includes:[TL.Events],
/*	Load the media
	================================================== */
_loadMedia:function(){var e=this;
// Get Media ID
this.media_id=this.data.url.replace(/.*?:\/\//g,""),this.options.api_key_embedly?(
// API URL
api_url="https://api.embed.ly/1/extract?key="+this.options.api_key_embedly+"&url="+this.media_id+"&callback=?",
// API Call
TL.getJSON(api_url,function(t){e.createMedia(t)})):this.createCardContent()},createCardContent:function(){!function(t,e){var i="embedly-platform",n="script";if(!e.getElementById(i)){t.embedly=t.embedly||function(){(t.embedly.q=t.embedly.q||[]).push(arguments)};var a=e.createElement(n);a.id=i,a.async=1,a.src=("https:"===document.location.protocol?"https":"http")+"://cdn.embedly.com/widgets/platform.js";var s=e.getElementsByTagName(n)[0];s.parentNode.insertBefore(a,s)}}(window,document);var t='<a href="'+this.data.url+'" class="embedly-card">'+this.data.url+"</a>";this._setContent(t)},createMedia:function(t){// this costs API credits...
var e="";e+="<h4><a href='"+this.data.url+"' target='_blank'>"+t.title+"</a></h4>",t.images&&t.images[0]&&(trace(t.images[0].url),e+="<img src='"+t.images[0].url+"' />"),t.favicon_url&&(e+="<img class='tl-media-website-icon' src='"+t.favicon_url+"' />"),e+="<span class='tl-media-website-description'>"+t.provider_name+"</span><br/>",e+="<p>"+t.description+"</p>",this._setContent(e)},_setContent:function(t){
// Create Dom element
this._el.content_item=TL.Dom.create("div","tl-media-item tl-media-website",this._el.content),this._el.content_container.className="tl-media-content-container tl-media-content-container-text",this._el.content_item.innerHTML=t,
// After Loaded
this.onLoaded()},updateMediaDisplay:function(){},_updateMediaDisplay:function(){}}),
/*	TL.Media.Wikipedia
================================================== */
TL.Media.Wikipedia=TL.Media.extend({includes:[TL.Events],
/*	Load the media
	================================================== */
_loadMedia:function(){var t,e,n=this;
// Create Dom element
this._el.content_item=TL.Dom.create("div","tl-media-item tl-media-wikipedia",this._el.content),this._el.content_container.className="tl-media-content-container tl-media-content-container-text",
// Get Media ID
this.media_id=this.data.url.split("wiki/")[1].split("#")[0].replace("_"," "),this.media_id=this.media_id.replace(" ","%20"),
// API URL
t="https://"+(e=this.data.url.split("//")[1].split(".wikipedia")[0])+".wikipedia.org/w/api.php?action=query&prop=extracts|pageimages&redirects=&titles="+this.media_id+"&exintro=1&format=json&callback=?",
// API Call
TL.ajax({type:"GET",url:t,dataType:"json",//json data type
success:function(t){n.createMedia(t)},error:function(t,e){var i="";i+=n._("wikipedia_load_err")+"<br/>"+n.media_id+"<br/>"+e,n.loadErrorDisplay(i)}})},createMedia:function(t){var e="";if(t.query){var i="",e;(e={entry:{},title:"",text:"",extract:"",paragraphs:1,page_image:"",text_array:[]}).entry=TL.Util.getObjectAttributeByIndex(t.query.pages,0),e.extract=e.entry.extract,e.title=e.entry.title,e.page_image=e.entry.thumbnail,e.extract.match("<p>")?e.text_array=e.extract.split("<p>"):e.text_array.push(e.extract);for(var n=0;n<e.text_array.length;n++)n+1<=e.paragraphs&&n+1<e.text_array.length&&(e.text+="<p>"+e.text_array[n+1]);i+="<span class='tl-icon-wikipedia'></span>",i+="<div class='tl-wikipedia-title'><h4><a href='"+this.data.url+"' target='_blank'>"+e.title+"</a></h4>",i+="<span class='tl-wikipedia-source'>"+this._("wikipedia")+"</span></div>",e.page_image,i+=e.text,e.extract.match("REDIRECT")||(
// Add to DOM
this._el.content_item.innerHTML=i,
// After Loaded
this.onLoaded())}},updateMediaDisplay:function(){},_updateMediaDisplay:function(){}}),
/*	TL.Media.Wistia
================================================== */
TL.Media.Wistia=TL.Media.extend({includes:[TL.Events],
/*	Load the media
	================================================== */
_loadMedia:function(){var t,e=this;
// Create Dom element
this._el.content_item=TL.Dom.create("div","tl-media-item tl-media-iframe tl-media-wistia tl-media-shadow",this._el.content),
// Get Media ID
this.media_id=this.data.url.split(/https?:\/\/(.+)?(wistia\.com|wi\.st)\/medias\/(.*)/)[3],
// API URL
t="https://fast.wistia.com/embed/iframe/"+this.media_id+"?version=v1&controlsVisibleOnLoad=true&playerColor=aae3d8",this.player=TL.Dom.create("iframe","",this._el.content_item),
// Media Loaded Event
this.player.addEventListener("load",function(t){e.onMediaLoaded()}),this.player.width="100%",this.player.height="100%",this.player.frameBorder="0",this.player.src=t,this.player.setAttribute("allowfullscreen",""),this.player.setAttribute("webkitallowfullscreen",""),this.player.setAttribute("mozallowfullscreen",""),
// After Loaded
this.onLoaded()},
// Update Media Display
_updateMediaDisplay:function(){this._el.content_item.style.height=TL.Util.ratio.r16_9({w:this._el.content_item.offsetWidth})+"px"},_stopMedia:function(){try{this.player.contentWindow.postMessage(JSON.stringify({method:"pause"}),"https://player.vimeo.com")}catch(t){trace(t)}}}),
/*	TL.Media.YouTube
================================================== */
TL.Media.YouTube=TL.Media.extend({includes:[TL.Events],
/*	Load the media
	================================================== */
_loadMedia:function(){var t=this,e;this.youtube_loaded=!1,
// Create Dom element
this._el.content_item=TL.Dom.create("div","tl-media-item tl-media-youtube tl-media-shadow",this._el.content),this._el.content_item.id=TL.Util.unique_ID(7),
// URL Vars
e=TL.Util.getUrlVars(this.data.url),
// Get Media ID
this.media_id={},this.data.url.match("v=")?this.media_id.id=e.v:this.data.url.match("/embed/")?this.media_id.id=this.data.url.split("embed/")[1].split(/[?&]/)[0]:this.data.url.match(/v\/|v=|youtu\.be\//)?this.media_id.id=this.data.url.split(/v\/|v=|youtu\.be\//)[1].split(/[?&]/)[0]:trace("YOUTUBE IN URL BUT NOT A VALID VIDEO"),
// Get start second
this.data.url.match("start=")?this.media_id.start=parseInt(this.data.url.split("start=")[1],10):this.data.url.match("t=")&&(this.media_id.start=parseInt(this.data.url.split("t=")[1],10)),
//Get end second
this.data.url.match("end=")&&(this.media_id.end=parseInt(this.data.url.split("end=")[1],10)),this.media_id.hd=Boolean(void 0!==e.hd),
// API Call
TL.Load.js("https://www.youtube.com/iframe_api",function(){t.createMedia()})},
// Update Media Display
_updateMediaDisplay:function(){
//this.el.content_item = document.getElementById(this._el.content_item.id);
this._el.content_item.style.height=TL.Util.ratio.r16_9({w:this.options.width})+"px",this._el.content_item.style.width=this.options.width+"px"},_stopMedia:function(){if(this.youtube_loaded)try{this.player.getPlayerState()==YT.PlayerState.PLAYING&&this.player.pauseVideo()}catch(t){trace(t)}},createMedia:function(){var t=this;clearTimeout(this.timer),"undefined"!=typeof YT&&void 0!==YT.Player?
// Create Player
this.player=new YT.Player(this._el.content_item.id,{playerVars:{enablejsapi:1,color:"white",controls:1,start:this.media_id.start,end:this.media_id.end,fs:1},videoId:this.media_id.id,events:{onReady:function(){t.onPlayerReady(),
// After Loaded
t.onLoaded()},onStateChange:t.onStateChange}}):this.timer=setTimeout(function(){t.createMedia()},1e3)},
/*	Events
	================================================== */
onPlayerReady:function(t){this.youtube_loaded=!0,this._el.content_item=document.getElementById(this._el.content_item.id),this.onMediaLoaded()},onStateChange:function(t){t.data==YT.PlayerState.ENDED&&(t.target.seekTo(0),t.target.pauseVideo())}}),
/*	TL.Media.Audio
	Produces audio assets.
	Takes a data object and populates a dom object
================================================== */
TL.Media.Audio=TL.Media.extend({includes:[TL.Events],
/*	Load the media
	================================================== */
_loadMedia:function(){
// Loading Message
this.loadingMessage(),
// Create media?
this.options.background||this.createMedia(),
// After loaded
this.onLoaded()},createMedia:function(){var e=this,t="tl-media-item tl-media-audio tl-media-shadow";
// Link
this.data.link?(this._el.content_link=TL.Dom.create("a","",this._el.content),this._el.content_link.href=this.data.link,this._el.content_link.target="_blank",this._el.content_item=TL.Dom.create("audio",t,this._el.content_link)):this._el.content_item=TL.Dom.create("audio",t,this._el.content),this._el.content_item.controls=!0,this._el.source_item=TL.Dom.create("source","",this._el.content_item),
// Media Loaded Event
this._el.content_item.addEventListener("load",function(t){e.onMediaLoaded()}),this._el.source_item.src=this.data.url,this._el.source_item.type=this._getType(this.data.url,this.data.mediatype.match_str),this._el.content_item.innerHTML+="Your browser doesn't support HTML5 audio with "+this._el.source_item.type},_updateMediaDisplay:function(t){TL.Browser.firefox&&(this._el.content_item.style.width="auto")},_getType:function(t,e){var i,n="audio/";switch(t.match(e)[1]){case"mp3":n+="mpeg";break;case"wav":n+="wav";break;case"m4a":n+="mp4";break;default:n="audio";break}return n}}),
/*	TL.Media.Video
	Produces video assets.
	Takes a data object and populates a dom object
================================================== */
TL.Media.Video=TL.Media.extend({includes:[TL.Events],
/*	Load the media
	================================================== */
_loadMedia:function(){
// Loading Message
this.loadingMessage(),
// Create media?
this.options.background||this.createMedia(),
// After loaded
this.onLoaded()},createMedia:function(){var e=this,t="tl-media-item tl-media-video tl-media-shadow";
// Link
this.data.link?(this._el.content_link=TL.Dom.create("a","",this._el.content),this._el.content_link.href=this.data.link,this._el.content_link.target="_blank",this._el.content_item=TL.Dom.create("video",t,this._el.content_link)):this._el.content_item=TL.Dom.create("video",t,this._el.content),this._el.content_item.controls=!0,this._el.source_item=TL.Dom.create("source","",this._el.content_item),
// Media Loaded Event
this._el.content_item.addEventListener("load",function(t){e.onMediaLoaded()}),this._el.source_item.src=this.data.url,this._el.source_item.type=this._getType(this.data.url,this.data.mediatype.match_str),this._el.content_item.innerHTML+="Your browser doesn't support HTML5 video with "+this._el.source_item.type},_updateMediaDisplay:function(t){TL.Browser.firefox&&(this._el.content_item.style.width="auto")},_getType:function(t,e){var i,n="video/";switch(t.match(e)[1]){case"mp4":n+="mp4";break;default:n="video";break}return n}}),
/*	TL.Slide
	Creates a slide. Takes a data object and
	populates the slide with content.
================================================== */
TL.Slide=TL.Class.extend({includes:[TL.Events,TL.DomMixins,TL.I18NMixins],_el:{},
/*	Constructor
	================================================== */
initialize:function(t,e,i){
// DOM Elements
this._el={container:{},scroll_container:{},background:{},content_container:{},content:{}},
// Components
this._media=null,this._mediaclass={},this._text={},this._background_media=null,
// State
this._state={loaded:!1},this.has={headline:!1,text:!1,media:!1,title:!1,background:{image:!1,color:!1,color_value:""}},this.has.title=i,
// Data
this.data={unique_id:null,background:null,start_date:null,end_date:null,location:null,text:null,media:null,autolink:!0},
// Options
this.options={
// animation
duration:1e3,slide_padding_lr:40,ease:TL.Ease.easeInSpline,width:600,height:600,skinny_size:650,media_name:""},
// Actively Displaying
this.active=!1,
// Animation Object
this.animator={},
// Merge Data and Options
TL.Util.mergeData(this.options,e),TL.Util.mergeData(this.data,t),this._initLayout(),this._initEvents()},
/*	Adding, Hiding, Showing etc
	================================================== */
show:function(){this.animator=TL.Animate(this._el.slider_container,{left:-this._el.container.offsetWidth*n+"px",duration:this.options.duration,easing:this.options.ease})},hide:function(){},setActive:function(t){this.active=t,this.active?(this.data.background&&this.fire("background_change",this.has.background),this.loadMedia()):this.stopMedia()},addTo:function(t){t.appendChild(this._el.container);
//this.onAdd();
},removeFrom:function(t){t.removeChild(this._el.container)},updateDisplay:function(t,e,i){this._updateDisplay(t,e,i)},loadMedia:function(){var t=this;this._media&&!this._state.loaded&&(this._media.loadMedia(),this._state.loaded=!0),this._background_media&&!this._background_media._state.loaded&&(this._background_media.on("loaded",function(){t._updateBackgroundDisplay()}),this._background_media.loadMedia())},stopMedia:function(){this._media&&this._state.loaded&&this._media.stopMedia()},getBackground:function(){return this.has.background},scrollToTop:function(){this._el.container.scrollTop=0},getFormattedDate:function(){if(0<TL.Util.trim(this.data.display_date).length)return this.data.display_date;var t="";return this.has.title||(this.data.end_date&&(t=" &mdash; "+this.data.end_date.getDisplayDate(this.getLanguage())),this.data.start_date&&(t=this.data.start_date.getDisplayDate(this.getLanguage())+t)),t},
/*	Events
	================================================== */
/*	Private Methods
	================================================== */
_initLayout:function(){
// Style Slide Background
if(
// Create Layout
this._el.container=TL.Dom.create("div","tl-slide"),this.has.title&&(this._el.container.className="tl-slide tl-slide-titleslide"),this.data.unique_id&&(this._el.container.id=this.data.unique_id),this._el.scroll_container=TL.Dom.create("div","tl-slide-scrollable-container",this._el.container),this._el.content_container=TL.Dom.create("div","tl-slide-content-container",this._el.scroll_container),this._el.content=TL.Dom.create("div","tl-slide-content",this._el.content_container),this._el.background=TL.Dom.create("div","tl-slide-background",this._el.container),this.data.background){if(this.data.background.url){var t=TL.MediaType(this.data.background,!0);t&&(this._background_media=new t.cls(this.data.background,{background:1}),this.has.background.image=!0,this._el.container.className+=" tl-full-image-background",this.has.background.color_value="#000",this._el.background.style.display="block")}this.data.background.color&&(this.has.background.color=!0,this._el.container.className+=" tl-full-color-background",this.has.background.color_value=this.data.background.color),this.data.background.text_background&&(this._el.container.className+=" tl-text-background")}
// Determine Assets for layout and loading
this.data.media&&this.data.media.url&&""!=this.data.media.url&&(this.has.media=!0),this.data.text&&this.data.text.text&&(this.has.text=!0),this.data.text&&this.data.text.headline&&(this.has.headline=!0),
// Create Media
this.has.media&&(
// Determine the media type
this.data.media.mediatype=TL.MediaType(this.data.media),this.options.media_name=this.data.media.mediatype.name,this.options.media_type=this.data.media.mediatype.type,this.options.autolink=this.data.autolink,
// Create a media object using the matched class name
this._media=new this.data.media.mediatype.cls(this.data.media,this.options)),
// Create Text
(this.has.text||this.has.headline)&&(this._text=new TL.Media.Text(this.data.text,{title:this.has.title,language:this.options.language,autolink:this.data.autolink}),this._text.addDateText(this.getFormattedDate())),
// Add to DOM
this.has.text||this.has.headline||!this.has.media?this.has.headline&&this.has.media&&!this.has.text?(TL.DomUtil.addClass(this._el.container,"tl-slide-media-only"),this._text.addTo(this._el.content),this._media.addTo(this._el.content)):this.has.text&&this.has.media?(this._media.addTo(this._el.content),this._text.addTo(this._el.content)):(this.has.text||this.has.headline)&&(TL.DomUtil.addClass(this._el.container,"tl-slide-text-only"),this._text.addTo(this._el.content)):(TL.DomUtil.addClass(this._el.container,"tl-slide-media-only"),this._media.addTo(this._el.content)),
// Fire event that the slide is loaded
this.onLoaded()},_initEvents:function(){},
// Update Display
_updateDisplay:function(t,e,i){var n,a=this.options.slide_padding_lr,s=this.options.slide_padding_lr;this.options.width=t||this._el.container.offsetWidth,n=this.options.width-2*this.options.slide_padding_lr,TL.Browser.mobile&&this.options.width<=this.options.skinny_size?(s=a=0,n=this.options.width):"landscape"==i||this.options.width<=this.options.skinny_size&&(s=a=50,n=this.options.width-a-s),this._el.content.style.paddingLeft=a+"px",this._el.content.style.paddingRight=s+"px",this._el.content.style.width=n+"px",this.options.height=e||this._el.container.offsetHeight,this._media&&(!this.has.text&&this.has.headline?this._media.updateDisplay(n,this.options.height-this._text.headlineHeight(),i):this.has.text||this.has.headline?this.options.width<=this.options.skinny_size?this._media.updateDisplay(n,this.options.height,i):this._media.updateDisplay(n/2,this.options.height,i):this._media.updateDisplay(n,this.options.height,i)),this._updateBackgroundDisplay()},_updateBackgroundDisplay:function(){this._background_media&&this._background_media._state.loaded&&(this._el.background.style.backgroundImage="url('"+this._background_media.getImageURL(this.options.width,this.options.height)+"')")}}),
/*	TL.SlideNav
	encapsulate DOM display/events for the 
	'next' and 'previous' buttons on a slide.
================================================== */
// TODO null out data
TL.SlideNav=TL.Class.extend({includes:[TL.Events,TL.DomMixins],_el:{},
/*	Constructor
	================================================== */
initialize:function(t,e,i){
// DOM ELEMENTS
this._el={container:{},content_container:{},icon:{},title:{},description:{}},
// Media Type
this.mediatype={},
// Data
this.data={title:"Navigation",description:"Description",date:"Date"},
//Options
this.options={direction:"previous"},this.animator=null,
// Merge Data and Options
TL.Util.mergeData(this.options,e),TL.Util.mergeData(this.data,t),this._el.container=TL.Dom.create("div","tl-slidenav-"+this.options.direction),TL.Browser.mobile&&this._el.container.setAttribute("ontouchstart"," "),this._initLayout(),this._initEvents(),i&&i.appendChild(this._el.container)},
/*	Update Content
	================================================== */
update:function(t){var e={title:"",description:"",date:t.getFormattedDate()};t.data.text&&t.data.text.headline&&(e.title=t.data.text.headline),this._update(e)},
/*	Color
	================================================== */
setColor:function(t){this._el.content_container.className=t?"tl-slidenav-content-container tl-slidenav-inverted":"tl-slidenav-content-container"},
/*	Events
	================================================== */
_onMouseClick:function(){this.fire("clicked",this.options)},
/*	Private Methods
	================================================== */
_update:function(t){
// update data
this.data=TL.Util.mergeData(this.data,t),
// Title
this._el.title.innerHTML=TL.Util.unlinkify(this.data.title),
// Date
this._el.description.innerHTML=TL.Util.unlinkify(this.data.date)},_initLayout:function(){
// Create Layout
this._el.content_container=TL.Dom.create("div","tl-slidenav-content-container",this._el.container),this._el.icon=TL.Dom.create("div","tl-slidenav-icon",this._el.content_container),this._el.title=TL.Dom.create("div","tl-slidenav-title",this._el.content_container),this._el.description=TL.Dom.create("div","tl-slidenav-description",this._el.content_container),this._el.icon.innerHTML="&nbsp;",this._update()},_initEvents:function(){TL.DomEvent.addListener(this._el.container,"click",this._onMouseClick,this)}}),
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
TL.StorySlider=TL.Class.extend({includes:[TL.Events,TL.I18NMixins],
/*	Private Methods
	================================================== */
initialize:function(t,e,i,n){
// DOM ELEMENTS
this._el={container:{},background:{},slider_container_mask:{},slider_container:{},slider_item_container:{}},this._nav={},this._nav.previous={},this._nav.next={},
// Slide Spacing
this.slide_spacing=0,
// Slides Array
this._slides=[],
// Swipe Object
this._swipable,
// Preload Timer
this.preloadTimer,
// Message
this._message,
// Current Slide
this.current_id="",
// Data Object
this.data={},this.options={id:"",layout:"portrait",width:600,height:600,default_bg_color:{r:255,g:255,b:255},slide_padding_lr:40,// padding on slide of slide
start_at_slide:1,slide_default_fade:"0%",// landscape fade
// animation
duration:1e3,ease:TL.Ease.easeInOutQuint,
// interaction
dragging:!0,trackResize:!0},
// Main element ID
"object"==typeof t?(this._el.container=t,this.options.id=TL.Util.unique_ID(6,"tl")):(this.options.id=t,this._el.container=TL.Dom.get(t)),this._el.container.id||(this._el.container.id=this.options.id),
// Animation Object
this.animator=null,
// Merge Data and Options
TL.Util.mergeData(this.options,i),TL.Util.mergeData(this.data,e),n&&this.init()},init:function(){this._initLayout(),this._initEvents(),this._initData(),this._updateDisplay(),
// Go to initial slide
this.goTo(this.options.start_at_slide),this._onLoaded()},
/* Slides
	================================================== */
_addSlide:function(t){t.addTo(this._el.slider_item_container),t.on("added",this._onSlideAdded,this),t.on("background_change",this._onBackgroundChange,this)},_createSlide:function(t,e,i){var n=new TL.Slide(t,this.options,e);this._addSlide(n),i<0?this._slides.push(n):this._slides.splice(i,0,n)},_createSlides:function(t){for(var e=0;e<t.length;e++)""==t[e].unique_id&&(t[e].unique_id=TL.Util.unique_ID(6,"tl-slide")),this._createSlide(t[e],!1,-1)},_removeSlide:function(t){t.removeFrom(this._el.slider_item_container),t.off("added",this._onSlideRemoved,this),t.off("background_change",this._onBackgroundChange)},_destroySlide:function(t){this._removeSlide(this._slides[t]),this._slides.splice(t,1)},_findSlideIndex:function(t){var e=t;return("string"==typeof t||t instanceof String)&&(e=TL.Util.findArrayNumberByUniqueID(t,this._slides,"unique_id")),e},
/*	Public
	================================================== */
updateDisplay:function(t,e,i,n){this._updateDisplay(t,e,i,n)},
// Create a slide
createSlide:function(t,e){this._createSlide(t,!1,e)},
// Create Many Slides from an array
createSlides:function(t){this._createSlides(t)},
// Destroy slide by index
destroySlide:function(t){this._destroySlide(t)},
// Destroy slide by id
destroySlideId:function(t){this.destroySlide(this._findSlideIndex(t))},
/*	Navigation
	================================================== */
goTo:function(t,e,i){t=parseInt(t),isNaN(t)&&(t=0);var n=this;this.changeBackground({color_value:"",image:!1}),
// Clear Preloader Timer
this.preloadTimer&&clearTimeout(this.preloadTimer);
// Set Slide Active State
for(var a=0;a<this._slides.length;a++)this._slides[a].setActive(!1);t<this._slides.length&&0<=t&&(this.current_id=this._slides[t].data.unique_id,
// Stop animation
this.animator&&this.animator.stop(),this._swipable&&this._swipable.stopMomentum(),e?(this._el.slider_container.style.left=-this.slide_spacing*t+"px",this._onSlideChange(i)):this.animator=TL.Animate(this._el.slider_container,{left:-this.slide_spacing*t+"px",duration:this.options.duration,easing:this.options.ease,complete:this._onSlideChange(i)}),
// Set Slide Active State
this._slides[t].setActive(!0),
// Update Navigation and Info
this._slides[t+1]?(this.showNav(this._nav.next,!0),this._nav.next.update(this._slides[t+1])):this.showNav(this._nav.next,!1),this._slides[t-1]?(this.showNav(this._nav.previous,!0),this._nav.previous.update(this._slides[t-1])):this.showNav(this._nav.previous,!1),
// Preload Slides
this.preloadTimer=setTimeout(function(){n.preloadSlides(t)},this.options.duration))},goToId:function(t,e,i){this.goTo(this._findSlideIndex(t),e,i)},preloadSlides:function(t){this._slides[t+1]&&(this._slides[t+1].loadMedia(),this._slides[t+1].scrollToTop()),this._slides[t+2]&&(this._slides[t+2].loadMedia(),this._slides[t+2].scrollToTop()),this._slides[t-1]&&(this._slides[t-1].loadMedia(),this._slides[t-1].scrollToTop()),this._slides[t-2]&&(this._slides[t-2].loadMedia(),this._slides[t-2].scrollToTop())},next:function(){var t=this._findSlideIndex(this.current_id);t+1<this._slides.length?this.goTo(t+1):this.goTo(t)},previous:function(){var t=this._findSlideIndex(this.current_id);0<=t-1?this.goTo(t-1):this.goTo(t)},showNav:function(t,e){this.options.width<=500&&TL.Browser.mobile||(e?t.show():t.hide())},changeBackground:function(t){var e={r:256,g:256,b:256},i;t.color_value&&""!=t.color_value?(e=TL.Util.hexToRgb(t.color_value))||(trace("Invalid color value "+t.color_value),e=this.options.default_bg_color):(e=this.options.default_bg_color,t.color_value="rgb("+e.r+" , "+e.g+", "+e.b+")"),i=e.r+","+e.g+","+e.b,this._el.background.style.backgroundImage="none",t.color_value?this._el.background.style.backgroundColor=t.color_value:this._el.background.style.backgroundColor="transparent",e.r<255||e.g<255||e.b<255||t.image?(this._nav.next.setColor(!0),this._nav.previous.setColor(!0)):(this._nav.next.setColor(!1),this._nav.previous.setColor(!1))},
/*	Private Methods
	================================================== */
// Update Display
_updateDisplay:function(t,e,i,n){var a,s;s=void 0===n?this.options.layout:n,this.options.layout=s,this.slide_spacing=2*this.options.width,this.options.width=t||this._el.container.offsetWidth,this.options.height=e||this._el.container.offsetHeight,
//this._el.container.style.height = this.options.height;
// position navigation
a=this.options.height/2,this._nav.next.setPosition({top:a}),this._nav.previous.setPosition({top:a});
// Position slides
for(var o=0;o<this._slides.length;o++)this._slides[o].updateDisplay(this.options.width,this.options.height,s),this._slides[o].setPosition({left:this.slide_spacing*o,top:0});
// Go to the current slide
this.goToId(this.current_id,!0,!0)},
// Reposition and redraw slides
_updateDrawSlides:function(){for(var t=this.options.layout,e=0;e<this._slides.length;e++)this._slides[e].updateDisplay(this.options.width,this.options.height,t),this._slides[e].setPosition({left:this.slide_spacing*e,top:0});this.goToId(this.current_id,!0,!1)},
/*	Init
	================================================== */
_initLayout:function(){TL.DomUtil.addClass(this._el.container,"tl-storyslider"),
// Create Layout
this._el.slider_container_mask=TL.Dom.create("div","tl-slider-container-mask",this._el.container),this._el.background=TL.Dom.create("div","tl-slider-background tl-animate",this._el.container),this._el.slider_container=TL.Dom.create("div","tl-slider-container tlanimate",this._el.slider_container_mask),this._el.slider_item_container=TL.Dom.create("div","tl-slider-item-container",this._el.slider_container),
// Update Size
this.options.width=this._el.container.offsetWidth,this.options.height=this._el.container.offsetHeight,
// Create Navigation
this._nav.previous=new TL.SlideNav({title:"Previous",description:"description"},{direction:"previous"}),this._nav.next=new TL.SlideNav({title:"Next",description:"description"},{direction:"next"}),
// add the navigation to the dom
this._nav.next.addTo(this._el.container),this._nav.previous.addTo(this._el.container),this._el.slider_container.style.left="0px",TL.Browser.touch&&(
//this._el.slider_touch_mask = TL.Dom.create('div', 'tl-slider-touch-mask', this._el.slider_container_mask);
this._swipable=new TL.Swipable(this._el.slider_container_mask,this._el.slider_container,{enable:{x:!0,y:!1},snap:!0}),this._swipable.enable(),
// Message
this._message=new TL.Message({},{message_class:"tl-message-full",message_icon_class:"tl-icon-swipe-left"}),this._message.updateMessage(this._("swipe_to_navigate")),this._message.addTo(this._el.container))},_initEvents:function(){this._nav.next.on("clicked",this._onNavigation,this),this._nav.previous.on("clicked",this._onNavigation,this),this._message&&this._message.on("clicked",this._onMessageClick,this),this._swipable&&(this._swipable.on("swipe_left",this._onNavigation,this),this._swipable.on("swipe_right",this._onNavigation,this),this._swipable.on("swipe_nodirection",this._onSwipeNoDirection,this))},_initData:function(){this.data.title&&this._createSlide(this.data.title,!0,-1),this._createSlides(this.data.events)},
/*	Events
	================================================== */
_onBackgroundChange:function(t){var e=this._findSlideIndex(this.current_id),i=this._slides[e].getBackground();this.changeBackground(t),this.fire("colorchange",i)},_onMessageClick:function(t){this._message.hide()},_onSwipeNoDirection:function(t){this.goToId(this.current_id)},_onNavigation:function(t){"next"==t.direction||"left"==t.direction?this.next():"previous"!=t.direction&&"right"!=t.direction||this.previous(),this.fire("nav_"+t.direction,this.data)},_onSlideAdded:function(t){trace("slideadded"),this.fire("slideAdded",this.data)},_onSlideRemoved:function(t){this.fire("slideRemoved",this.data)},_onSlideChange:function(t){t||this.fire("change",{unique_id:this.current_id})},_onMouseClick:function(t){},_fireMouseEvent:function(t){if(this._loaded){var e=t.type;e="mouseenter"===e?"mouseover":"mouseleave"===e?"mouseout":e,this.hasEventListeners(e)&&("contextmenu"===e&&TL.DomEvent.preventDefault(t),this.fire(e,{latlng:"something",//this.mouseEventToLatLng(e),
layerPoint:"something else"}))}},_onLoaded:function(){this.fire("loaded",this.data)}}),
/*	TL.TimeNav

================================================== */
TL.TimeNav=TL.Class.extend({includes:[TL.Events,TL.DomMixins],_el:{},
/*	Constructor
	================================================== */
initialize:function(t,e,i,n){
// DOM ELEMENTS
this._el={parent:{},container:{},slider:{},slider_background:{},line:{},marker_container_mask:{},marker_container:{},marker_item_container:{},timeaxis:{},timeaxis_background:{},attribution:{}},this.collapsed=!1,this._el.container="object"==typeof t?t:TL.Dom.get(t),this.config=e,
//Options
this.options={width:600,height:600,duration:1e3,ease:TL.Ease.easeInOutQuint,has_groups:!1,optimal_tick_width:50,scale_factor:2,// How many screen widths wide should the timeline be
marker_padding:5,timenav_height_min:150,// Minimum timenav height
marker_height_min:30,// Minimum Marker Height
marker_width_min:100,// Minimum Marker Width
zoom_sequence:[.5,1,2,3,5,8,13,21,34,55,89]},
// Animation
this.animator=null,
// Ready state
this.ready=!1,
// Markers Array
this._markers=[],
// Eras Array
this._eras=[],this.has_eras=!1,
// Groups Array
this._groups=[],
// Row Height
this._calculated_row_height=100,
// Current Marker
this.current_id="",
// TimeScale
this.timescale={},
// TimeAxis
this.timeaxis={},this.axishelper={},
// Max Rows
this.max_rows=6,
// Animate CSS
this.animate_css=!1,
// Swipe Object
this._swipable,
// Merge Data and Options
TL.Util.mergeData(this.options,i),n&&this.init()},init:function(){this._initLayout(),this._initEvents(),this._initData(),this._updateDisplay(),this._onLoaded()},
/*	Public
	================================================== */
positionMarkers:function(){this._positionMarkers()},
/*	Update Display
	================================================== */
updateDisplay:function(t,e,i,n){this._updateDisplay(t,e,i,n)},
/*	TimeScale
	================================================== */
_getTimeScale:function(){
/* maybe the establishing config values (marker_height_min and max_rows) should be
		separated from making a TimeScale object, which happens in another spot in this file with duplicate mapping of properties of this TimeNav into the TimeScale options object? */
// Set Max Rows
var e=0;try{e=parseInt(this.options.marker_height_min)}catch(t){trace("Invalid value for marker_height_min option."),e=30}return 0==e&&(trace("marker_height_min option must not be zero."),e=30),this.max_rows=Math.round((this.options.height-this._el.timeaxis_background.offsetHeight-this.options.marker_padding)/e),this.max_rows<1&&(this.max_rows=1),new TL.TimeScale(this.config,{display_width:this._el.container.offsetWidth,screen_multiplier:this.options.scale_factor,max_rows:this.max_rows})},_updateTimeScale:function(t){this.options.scale_factor=t,this._updateDrawTimeline()},zoomIn:function(){// move the the next "higher" scale factor
var t=TL.Util.findNextGreater(this.options.zoom_sequence,this.options.scale_factor);this.setZoomFactor(t)},zoomOut:function(){// move the the next "lower" scale factor
var t=TL.Util.findNextLesser(this.options.zoom_sequence,this.options.scale_factor);this.setZoomFactor(t)},setZoom:function(t){var e=this.options.zoom_sequence[t];"number"==typeof e?this.setZoomFactor(e):console.warn("Invalid zoom level. Please use an index number between 0 and "+(this.options.zoom_sequence.length-1))},setZoomFactor:function(t){t<=this.options.zoom_sequence[0]?this.fire("zoomtoggle",{zoom:"out",show:!1}):this.fire("zoomtoggle",{zoom:"out",show:!0}),t>=this.options.zoom_sequence[this.options.zoom_sequence.length-1]?this.fire("zoomtoggle",{zoom:"in",show:!1}):this.fire("zoomtoggle",{zoom:"in",show:!0}),0==t&&(console.warn("Zoom factor must be greater than zero. Using 0.1"),t=.1),this.options.scale_factor=t,
//this._updateDrawTimeline(true);
this.goToId(this.current_id,!this._updateDrawTimeline(!0),!0)},
/*	Groups
	================================================== */
_createGroups:function(){this._groups=[];var t=this.timescale.getGroupLabels();if(t){this.options.has_groups=!0;for(var e=0;e<t.length;e++)this._createGroup(t[e])}},_createGroup:function(t){var e=new TL.TimeGroup(t);this._addGroup(e),this._groups.push(e)},_addGroup:function(t){t.addTo(this._el.container)},_positionGroups:function(){if(this.options.has_groups)for(var t=this.options.height-this._el.timeaxis_background.offsetHeight,e=Math.floor(t/this.timescale.getNumberOfRows()-this.options.marker_padding),i=this.timescale.getGroupLabels(),n=0,a=0;n<this._groups.length;n++){var s=Math.floor(a*(e+this.options.marker_padding)),o=!1;s>t-this.options.marker_padding&&(o=!0),this._groups[n].setRowPosition(s,this._calculated_row_height+this.options.marker_padding/2),this._groups[n].setAlternateRowColor(TL.Util.isEven(n),o),a+=this._groups[n].data.rows}},
/*	Markers
	================================================== */
_addMarker:function(t){t.addTo(this._el.marker_item_container),t.on("markerclick",this._onMarkerClick,this),t.on("added",this._onMarkerAdded,this)},_createMarker:function(t,e){var i=new TL.TimeMarker(t,this.options);this._addMarker(i),e<0?this._markers.push(i):this._markers.splice(e,0,i)},_createMarkers:function(t){for(var e=0;e<t.length;e++)this._createMarker(t[e],-1)},_removeMarker:function(t){t.removeFrom(this._el.marker_item_container);
//marker.off('added', this._onMarkerRemoved, this);
},_destroyMarker:function(t){this._removeMarker(this._markers[t]),this._markers.splice(t,1)},_positionMarkers:function(t){
// POSITION X
for(var e=0;e<this._markers.length;e++){var i=this.timescale.getPositionInfo(e);t?this._markers[e].setClass("tl-timemarker tl-timemarker-fast"):this._markers[e].setClass("tl-timemarker"),this._markers[e].setPosition({left:i.start}),this._markers[e].setWidth(i.width)}},_calculateMarkerHeight:function(t){return t/this.timescale.getNumberOfRows()-this.options.marker_padding},_calculateRowHeight:function(t){return t/this.timescale.getNumberOfRows()},_calculateAvailableHeight:function(){return this.options.height-this._el.timeaxis_background.offsetHeight-this.options.marker_padding},_calculateMinimumTimeNavHeight:function(){return this.timescale.getNumberOfRows()*this.options.marker_height_min+this._el.timeaxis_background.offsetHeight+this.options.marker_padding},getMinimumHeight:function(){return this._calculateMinimumTimeNavHeight()},_assignRowsToMarkers:function(){var t=this._calculateAvailableHeight(),e=this._calculateMarkerHeight(t);this._positionGroups(),this._calculated_row_height=this._calculateRowHeight(t);for(var i=0;i<this._markers.length;i++){
// Set Height
this._markers[i].setHeight(e);
//Position by Row
var n=this.timescale.getPositionInfo(i).row,a=Math.floor(n*(e+this.options.marker_padding))+this.options.marker_padding,s=t-a+this.options.marker_padding;this._markers[i].setRowPosition(a,s)}},_resetMarkersActive:function(){for(var t=0;t<this._markers.length;t++)this._markers[t].setActive(!1)},_findMarkerIndex:function(t){var e=-1;return("string"==typeof t||t instanceof String)&&(e=TL.Util.findArrayNumberByUniqueID(t,this._markers,"unique_id",e)),e},
/*	ERAS
	================================================== */
_createEras:function(t){for(var e=0;e<t.length;e++)this._createEra(t[e],-1)},_createEra:function(t,e){var i=new TL.TimeEra(t,this.options);this._addEra(i),e<0?this._eras.push(i):this._eras.splice(e,0,i)},_addEra:function(t){t.addTo(this._el.marker_item_container),t.on("added",this._onEraAdded,this)},_removeEra:function(t){t.removeFrom(this._el.marker_item_container);
//marker.off('added', this._onMarkerRemoved, this);
},_destroyEra:function(t){this._removeEra(this._eras[t]),this._eras.splice(t,1)},_positionEras:function(t){
// POSITION X
for(var e=0,i=0;i<this._eras.length;i++){var n={start:0,end:0,width:0};n.start=this.timescale.getPosition(this._eras[i].data.start_date.getTime()),n.end=this.timescale.getPosition(this._eras[i].data.end_date.getTime()),n.width=n.end-n.start,t?this._eras[i].setClass("tl-timeera tl-timeera-fast"):this._eras[i].setClass("tl-timeera"),this._eras[i].setPosition({left:n.start}),this._eras[i].setWidth(n.width),5<++e&&(e=0),this._eras[i].setColor(e)}},
/*	Public
	================================================== */
// Create a marker
createMarker:function(t,e){this._createMarker(t,e)},
// Create many markers from an array
createMarkers:function(t){this._createMarkers(t)},
// Destroy marker by index
destroyMarker:function(t){this._destroyMarker(t)},
// Destroy marker by id
destroyMarkerId:function(t){this.destroyMarker(this._findMarkerIndex(t))},
/*	Navigation
	================================================== */
goTo:function(t,e,i){var n=this,a=this.options.ease,s=this.options.duration,o=t<0?0:t;
// Set Marker active state
this._resetMarkersActive(),0<=t&&t<this._markers.length&&this._markers[t].setActive(!0),
// Stop animation
this.animator&&this.animator.stop(),e?(this._el.slider.className="tl-timenav-slider",this._el.slider.style.left=-this._markers[o].getLeft()+this.options.width/2+"px"):i?(this._el.slider.className="tl-timenav-slider tl-timenav-slider-animate",this.animate_css=!0,this._el.slider.style.left=-this._markers[o].getLeft()+this.options.width/2+"px"):(this._el.slider.className="tl-timenav-slider",this.animator=TL.Animate(this._el.slider,{left:-this._markers[o].getLeft()+this.options.width/2+"px",duration:s,easing:a})),0<=t&&t<this._markers.length?this.current_id=this._markers[t].data.unique_id:this.current_id=""},goToId:function(t,e,i){this.goTo(this._findMarkerIndex(t),e,i)},
/*	Events
	================================================== */
_onLoaded:function(){this.ready=!0,this.fire("loaded",this.config)},_onMarkerAdded:function(t){this.fire("dateAdded",this.config)},_onEraAdded:function(t){this.fire("eraAdded",this.config)},_onMarkerRemoved:function(t){this.fire("dateRemoved",this.config)},_onMarkerClick:function(t){
// Go to the clicked marker
this.goToId(t.unique_id),this.fire("change",{unique_id:t.unique_id})},_onMouseScroll:function(t){var e=0,i=0,n={right:-(this.timescale.getPixelWidth()-this.options.width/2),left:this.options.width/2};t||(t=window.event),t.originalEvent&&(t=t.originalEvent),
// Webkit and browsers able to differntiate between up/down and left/right scrolling
void 0!==t.wheelDeltaX&&(e=t.wheelDeltaY/6,e=Math.abs(t.wheelDeltaX)>Math.abs(t.wheelDeltaY)?t.wheelDeltaX/6:0),e&&(t.preventDefault&&t.preventDefault(),t.returnValue=!1),(
// Stop from scrolling too far
i=parseInt(this._el.slider.style.left.replace("px",""))+e)>n.left?i=n.left:i<n.right&&(i=n.right),this.animate_css&&(this._el.slider.className="tl-timenav-slider",this.animate_css=!1),this._el.slider.style.left=i+"px"},_onDragMove:function(t){this.animate_css&&(this._el.slider.className="tl-timenav-slider",this.animate_css=!1)},
/*	Private Methods
	================================================== */
// Update Display
_updateDisplay:function(t,e,i){t&&(this.options.width=t),e&&e!=this.options.height&&(this.options.height=e,this.timescale=this._getTimeScale()),
// Size Markers
this._assignRowsToMarkers(),
// Size swipable area
this._el.slider_background.style.width=this.timescale.getPixelWidth()+this.options.width+"px",this._el.slider_background.style.left=-this.options.width/2+"px",this._el.slider.style.width=this.timescale.getPixelWidth()+this.options.width+"px",
// Update Swipable constraint
this._swipable.updateConstraint({top:!1,bottom:!1,left:this.options.width/2,right:-(this.timescale.getPixelWidth()-this.options.width/2)}),
// Go to the current slide
this.goToId(this.current_id,!0)},_drawTimeline:function(t){this.timescale=this._getTimeScale(),this.timeaxis.drawTicks(this.timescale,this.options.optimal_tick_width),this._positionMarkers(t),this._assignRowsToMarkers(),this._createGroups(),this._positionGroups(),this.has_eras&&this._positionEras(t)},_updateDrawTimeline:function(t){var e=!1;
// Check to see if redraw is needed
if(t){
/* keep this aligned with _getTimeScale or reduce code duplication */
var i=new TL.TimeScale(this.config,{display_width:this._el.container.offsetWidth,screen_multiplier:this.options.scale_factor,max_rows:this.max_rows});this.timescale.getMajorScale()==i.getMajorScale()&&this.timescale.getMinorScale()==i.getMinorScale()&&(e=!0)}else e=!0;
// Perform update or redraw
return e?(this.timescale=this._getTimeScale(),this.timeaxis.positionTicks(this.timescale,this.options.optimal_tick_width),this._positionMarkers(),this._assignRowsToMarkers(),this._positionGroups(),this.has_eras&&this._positionEras(),this._updateDisplay()):this._drawTimeline(!0),e},
/*	Init
	================================================== */
_initLayout:function(){
// Create Layout
this._el.attribution=TL.Dom.create("div","tl-attribution",this._el.container),this._el.line=TL.Dom.create("div","tl-timenav-line",this._el.container),this._el.slider=TL.Dom.create("div","tl-timenav-slider",this._el.container),this._el.slider_background=TL.Dom.create("div","tl-timenav-slider-background",this._el.slider),this._el.marker_container_mask=TL.Dom.create("div","tl-timenav-container-mask",this._el.slider),this._el.marker_container=TL.Dom.create("div","tl-timenav-container",this._el.marker_container_mask),this._el.marker_item_container=TL.Dom.create("div","tl-timenav-item-container",this._el.marker_container),this._el.timeaxis=TL.Dom.create("div","tl-timeaxis",this._el.slider),this._el.timeaxis_background=TL.Dom.create("div","tl-timeaxis-background",this._el.container),
// Knight Lab Logo
this._el.attribution.innerHTML="<a href='http://timeline.knightlab.com' target='_blank'><span class='tl-knightlab-logo'></span>Timeline JS</a>",
// Time Axis
this.timeaxis=new TL.TimeAxis(this._el.timeaxis,this.options),
// Swipable
this._swipable=new TL.Swipable(this._el.slider_background,this._el.slider,{enable:{x:!0,y:!1},constraint:{top:!1,bottom:!1,left:this.options.width/2,right:!1},snap:!1}),this._swipable.enable()},_initEvents:function(){
// Drag Events
this._swipable.on("dragmove",this._onDragMove,this),
// Scroll Events
TL.DomEvent.addListener(this._el.container,"mousewheel",this._onMouseScroll,this),TL.DomEvent.addListener(this._el.container,"DOMMouseScroll",this._onMouseScroll,this)},_initData:function(){
// Create Markers and then add them
this._createMarkers(this.config.events),this.config.eras&&(this.has_eras=!0,this._createEras(this.config.eras)),this._drawTimeline()}}),
/*	TL.TimeMarker

================================================== */
TL.TimeMarker=TL.Class.extend({includes:[TL.Events,TL.DomMixins],_el:{},
/*	Constructor
	================================================== */
initialize:function(t,e){
// DOM Elements
this._el={container:{},content_container:{},media_container:{},timespan:{},line_left:{},line_right:{},content:{},text:{},media:{}},
// Components
this._text={},
// State
this._state={loaded:!1},
// Data
this.data={unique_id:"",background:null,date:{year:0,month:0,day:0,hour:0,minute:0,second:0,millisecond:0,thumbnail:"",format:""},text:{headline:"",text:""},media:null},
// Options
this.options={duration:1e3,ease:TL.Ease.easeInSpline,width:600,height:600,marker_width_min:100},
// Actively Displaying
this.active=!1,
// Animation Object
this.animator={},
// End date
this.has_end_date=!1,
// Merge Data and Options
TL.Util.mergeData(this.options,e),TL.Util.mergeData(this.data,t),this._initLayout(),this._initEvents()},
/*	Adding, Hiding, Showing etc
	================================================== */
show:function(){},hide:function(){},setActive:function(t){this.active=t,this.active&&this.has_end_date?this._el.container.className="tl-timemarker tl-timemarker-with-end tl-timemarker-active":this.active?this._el.container.className="tl-timemarker tl-timemarker-active":this.has_end_date?this._el.container.className="tl-timemarker tl-timemarker-with-end":this._el.container.className="tl-timemarker"},addTo:function(t){t.appendChild(this._el.container)},removeFrom:function(t){t.removeChild(this._el.container)},updateDisplay:function(t,e){this._updateDisplay(t,e)},loadMedia:function(){this._media&&!this._state.loaded&&(this._media.loadMedia(),this._state.loaded=!0)},stopMedia:function(){this._media&&this._state.loaded&&this._media.stopMedia()},getLeft:function(){return this._el.container.style.left.slice(0,-2)},getTime:function(){// TODO does this need to know about the end date?
return this.data.start_date.getTime()},getEndTime:function(){return!!this.data.end_date&&this.data.end_date.getTime()},setHeight:function(t){var e=12,i=1;this._el.content_container.style.height=t+"px",this._el.timespan_content.style.height=t+"px",
// Handle Line height for better display of text
this._el.content.className=t<=30?"tl-timemarker-content tl-timemarker-content-small":"tl-timemarker-content",t<=56?TL.DomUtil.addClass(this._el.content_container,"tl-timemarker-content-container-small"):TL.DomUtil.removeClass(this._el.content_container,"tl-timemarker-content-container-small"),
// Handle number of lines visible vertically
TL.Browser.webkit?((i=Math.floor(t/14))<1&&(i=1),this._text.className="tl-headline",this._text.style.webkitLineClamp=i):(i=t/12,this._text.className=1<i?"tl-headline tl-headline-fadeout":"tl-headline",this._text.style.height=12*i+"px")},setWidth:function(t){this.data.end_date&&(this._el.container.style.width=t+"px",t>this.options.marker_width_min?(this._el.content_container.style.width=t+"px",this._el.content_container.className="tl-timemarker-content-container tl-timemarker-content-container-long"):(this._el.content_container.style.width=this.options.marker_width_min+"px",this._el.content_container.className="tl-timemarker-content-container"))},setClass:function(t){this._el.container.className=t},setRowPosition:function(t,e){this.setPosition({top:t}),this._el.timespan.style.height=e+"px"},
/*	Events
	================================================== */
_onMarkerClick:function(t){this.fire("markerclick",{unique_id:this.data.unique_id})},
/*	Private Methods
	================================================== */
_initLayout:function(){
// Thumbnail or Icon
if(
//trace(this.data)
// Create Layout
this._el.container=TL.Dom.create("div","tl-timemarker"),this.data.unique_id&&(this._el.container.id=this.data.unique_id+"-marker"),this.data.end_date&&(this.has_end_date=!0,this._el.container.className="tl-timemarker tl-timemarker-with-end"),this._el.timespan=TL.Dom.create("div","tl-timemarker-timespan",this._el.container),this._el.timespan_content=TL.Dom.create("div","tl-timemarker-timespan-content",this._el.timespan),this._el.content_container=TL.Dom.create("div","tl-timemarker-content-container",this._el.container),this._el.content=TL.Dom.create("div","tl-timemarker-content",this._el.content_container),this._el.line_left=TL.Dom.create("div","tl-timemarker-line-left",this._el.timespan),this._el.line_right=TL.Dom.create("div","tl-timemarker-line-right",this._el.timespan),this.data.media){this._el.media_container=TL.Dom.create("div","tl-timemarker-media-container",this._el.content);
// ugh. needs an overhaul
var t={url:this.data.media.thumbnail},e=this.data.media.thumbnail?TL.MediaType(t,!0):null;if(e){var i=new e.cls(t);i.on("loaded",function(){this._el.media=TL.Dom.create("img","tl-timemarker-media",this._el.media_container),this._el.media.src=i.getImageURL()}.bind(this)),i.loadMedia()}else{var n=TL.MediaType(this.data.media).type;this._el.media=TL.Dom.create("span","tl-icon-"+n,this._el.media_container)}}
// Text
this._el.text=TL.Dom.create("div","tl-timemarker-text",this._el.content),this._text=TL.Dom.create("h2","tl-headline",this._el.text),this.data.text.headline&&""!=this.data.text.headline?this._text.innerHTML=TL.Util.unlinkify(this.data.text.headline):this.data.text.text&&""!=this.data.text.text?this._text.innerHTML=TL.Util.unlinkify(this.data.text.text):this.data.media&&this.data.media.caption&&""!=this.data.media.caption&&(this._text.innerHTML=TL.Util.unlinkify(this.data.media.caption)),
// Fire event that the slide is loaded
this.onLoaded()},_initEvents:function(){TL.DomEvent.addListener(this._el.container,"click",this._onMarkerClick,this)},
// Update Display
_updateDisplay:function(t,e,i){t&&(this.options.width=t),e&&(this.options.height=e)}}),
/*	TL.TimeMarker

================================================== */
TL.TimeEra=TL.Class.extend({includes:[TL.Events,TL.DomMixins],_el:{},
/*	Constructor
	================================================== */
initialize:function(t,e){
// DOM Elements
this._el={container:{},background:{},content_container:{},content:{},text:{}},
// Components
this._text={},
// State
this._state={loaded:!1},
// Data
this.data={unique_id:"",date:{year:0,month:0,day:0,hour:0,minute:0,second:0,millisecond:0,thumbnail:"",format:""},text:{headline:"",text:""}},
// Options
this.options={duration:1e3,ease:TL.Ease.easeInSpline,width:600,height:600,marker_width_min:100},
// Actively Displaying
this.active=!1,
// Animation Object
this.animator={},
// End date
this.has_end_date=!1,
// Merge Data and Options
TL.Util.mergeData(this.options,e),TL.Util.mergeData(this.data,t),this._initLayout(),this._initEvents()},
/*	Adding, Hiding, Showing etc
	================================================== */
show:function(){},hide:function(){},setActive:function(t){},addTo:function(t){t.appendChild(this._el.container)},removeFrom:function(t){t.removeChild(this._el.container)},updateDisplay:function(t,e){this._updateDisplay(t,e)},getLeft:function(){return this._el.container.style.left.slice(0,-2)},getTime:function(){// TODO does this need to know about the end date?
return this.data.start_date.getTime()},getEndTime:function(){return!!this.data.end_date&&this.data.end_date.getTime()},setHeight:function(t){var e=12,i=1;this._el.content_container.style.height=t+"px",this._el.content.className="tl-timeera-content",
// Handle number of lines visible vertically
TL.Browser.webkit?((i=Math.floor(t/14))<1&&(i=1),this._text.className="tl-headline",this._text.style.webkitLineClamp=i):(i=t/12,this._text.className=1<i?"tl-headline tl-headline-fadeout":"tl-headline",this._text.style.height=12*i+"px")},setWidth:function(t){this.data.end_date&&(this._el.container.style.width=t+"px",t>this.options.marker_width_min?(this._el.content_container.style.width=t+"px",this._el.content_container.className="tl-timeera-content-container tl-timeera-content-container-long"):(this._el.content_container.style.width=this.options.marker_width_min+"px",this._el.content_container.className="tl-timeera-content-container"))},setClass:function(t){this._el.container.className=t},setRowPosition:function(t,e){this.setPosition({top:t})},setColor:function(t){this._el.container.className="tl-timeera tl-timeera-color"+t},
/*	Events
	================================================== */
/*	Private Methods
	================================================== */
_initLayout:function(){
//trace(this.data)
// Create Layout
this._el.container=TL.Dom.create("div","tl-timeera"),this.data.unique_id&&(this._el.container.id=this.data.unique_id+"-era"),this.data.end_date&&(this.has_end_date=!0,this._el.container.className="tl-timeera tl-timeera-with-end"),this._el.content_container=TL.Dom.create("div","tl-timeera-content-container",this._el.container),this._el.background=TL.Dom.create("div","tl-timeera-background",this._el.content_container),this._el.content=TL.Dom.create("div","tl-timeera-content",this._el.content_container),
// Text
this._el.text=TL.Dom.create("div","tl-timeera-text",this._el.content),this._text=TL.Dom.create("h2","tl-headline",this._el.text),this.data.text.headline&&""!=this.data.text.headline&&(this._text.innerHTML=TL.Util.unlinkify(this.data.text.headline)),
// Fire event that the slide is loaded
this.onLoaded()},_initEvents:function(){},
// Update Display
_updateDisplay:function(t,e,i){t&&(this.options.width=t),e&&(this.options.height=e)}}),
/*	TL.TimeGroup
	
================================================== */
TL.TimeGroup=TL.Class.extend({includes:[TL.Events,TL.DomMixins],_el:{},
/*	Constructor
	================================================== */
initialize:function(t){
// DOM ELEMENTS
this._el={parent:{},container:{},message:{}},
//Options
this.options={width:600,height:600},
// Data
this.data={label:"",rows:1},this._el.container=TL.Dom.create("div","tl-timegroup"),
// Merge Data
TL.Util.mergeData(this.data,t),
// Animation
this.animator={},this._initLayout(),this._initEvents()},
/*	Public
	================================================== */
/*	Update Display
	================================================== */
updateDisplay:function(t,e){},setRowPosition:function(t,e){
// trace(n);
// trace(this._el.container)
this.options.height=e*this.data.rows,this.setPosition({top:t}),this._el.container.style.height=this.options.height+"px"},setAlternateRowColor:function(t,e){var i="tl-timegroup";t&&(i+=" tl-timegroup-alternate"),e&&(i+=" tl-timegroup-hidden"),this._el.container.className=i},
/*	Events
	================================================== */
_onMouseClick:function(){this.fire("clicked",this.options)},
/*	Private Methods
	================================================== */
_initLayout:function(){
// Create Layout
this._el.message=TL.Dom.create("div","tl-timegroup-message",this._el.container),this._el.message.innerHTML=this.data.label},_initEvents:function(){TL.DomEvent.addListener(this._el.container,"click",this._onMouseClick,this)},
// Update Display
_updateDisplay:function(t,e,i){}}),
/*  TL.TimeScale
    Strategies for laying out the timenav
    make a new one if the slides change

    TODOS: deal with clustering
================================================== */
TL.TimeScale=TL.Class.extend({initialize:function(t,e){var i=t.events;this._scale=t.scale,e=TL.Util.mergeData({// establish defaults
display_width:500,screen_multiplier:3,max_rows:null},e),this._display_width=e.display_width,this._screen_multiplier=e.screen_multiplier,this._pixel_width=this._screen_multiplier*this._display_width,this._group_labels=void 0,this._positions=[],this._pixels_per_milli=0,this._earliest=t.getEarliestDate().getTime(),this._latest=t.getLatestDate().getTime(),this._span_in_millis=this._latest-this._earliest,this._span_in_millis<=0&&(this._span_in_millis=this._computeDefaultSpan(t)),this._average=this._span_in_millis/i.length,this._pixels_per_milli=this.getPixelWidth()/this._span_in_millis,this._axis_helper=TL.AxisHelper.getBestHelper(this),this._scaled_padding=1/this.getPixelsPerTick()*(this._display_width/2),this._computePositionInfo(i,e.max_rows)},_computeDefaultSpan:function(t){
// this gets called when all events are at the same instant,
// or maybe when the span_in_millis is > 0 but still below a desired threshold
// TODO: does this need smarts about eras?
if("human"!=t.scale)return 2e5;// what is the right handling for cosmo dates?
for(var e={},i=0;i<t.events.length;i++){var n=t.events[i].start_date.findBestFormat();e[n]=e[n]?e[n]+1:1}for(var i=TL.Date.SCALES.length-1;0<=i;i--)if(e.hasOwnProperty(TL.Date.SCALES[i][0])){var a=TL.Date.SCALES[TL.Date.SCALES.length-1];// default
return TL.Date.SCALES[i+1]&&(a=TL.Date.SCALES[i+1]),a[1]}return 31536e6;// default to a year?
},getGroupLabels:function(){
/*
        return an array of objects, one per group, in the order (top to bottom) that the groups are expected to appear. Each object will have two properties:
            * label (the string as specified in one or more 'group' properties of events in the configuration)
            * rows (the number of rows occupied by events associated with the label. )
        */
return this._group_labels||[]},getScale:function(){return this._scale},getNumberOfRows:function(){return this._number_of_rows},getPixelWidth:function(){return this._pixel_width},getPosition:function(t){
// be careful using millis, as they won't scale to cosmological time.
// however, we're moving to make the arg to this whatever value
// comes from TL.Date.getTime() which could be made smart about that --
// so it may just be about the naming.
return(t-this._earliest)*this._pixels_per_milli},getPositionInfo:function(t){return this._positions[t]},getPixelsPerTick:function(){return this._axis_helper.getPixelsPerTick(this._pixels_per_milli)},getTicks:function(){return{major:this._axis_helper.getMajorTicks(this),minor:this._axis_helper.getMinorTicks(this)}},getDateFromTime:function(t){if("human"==this._scale)return new TL.Date(t);if("cosmological"==this._scale)return new TL.BigDate(new TL.BigYear(t));throw new TL.Error("time_scale_scale_err",this._scale)},getMajorScale:function(){return this._axis_helper.major.name},getMinorScale:function(){return this._axis_helper.minor.name},_assessGroups:function(t){for(var e=[],i=!1,n=0;n<t.length;n++)t[n].group&&(e.indexOf(t[n].group)<0?e.push(t[n].group):i=!0);return e.length&&i&&e.push(""),e},
/*  Compute the marker row positions, minimizing the number of
        overlaps.

        @positions = list of objects from this._positions
        @rows_left = number of rows available (assume > 0)
    */
_computeRowInfo:function(t,e){for(var i=[],n=0,a=0;a<t.length;a++){var s=t[a],o=[];
// See if we can add item to an existing row without
// overlapping the previous item in that row
delete s.row;for(var r=0;r<i.length;r++)if(o.push(i[r].end-s.start),o[r]<=0){i[s.row=r]=s;break}
// If we couldn't add to an existing row without overlap...
if(void 0===s.row)if(null===e)
// Make a new row
s.row=i.length,i.push(s);else if(0<e)
// Make a new row
s.row=i.length,i.push(s),e--;else{
// Add to existing row with minimum overlap.
var l=Math.min.apply(null,o),h=o.indexOf(l);s.row=h,s.end>i[h].end&&(i[h]=s),n++}}return{n_rows:i.length,n_overlaps:n}},
/*  Compute marker positions.  If using groups, this._number_of_rows
        will never be less than the number of groups.

        @max_rows = total number of available rows
        @default_marker_width should be in pixels
    */
_computePositionInfo:function(t,e,i){i=i||100;
// Set start/end/width; enumerate groups
for(var n=[],a=!1,s=0;s<t.length;s++){var o={start:this.getPosition(t[s].start_date.getTime())};if(this._positions.push(o),void 0!==t[s].end_date){var r=this.getPosition(t[s].end_date.getTime());o.width=r-o.start,o.width>i?o.end=o.start+o.width:o.end=o.start+i}else o.width=i,o.end=o.start+i;t[s].group?n.indexOf(t[s].group)<0&&n.push(t[s].group):a=!0}if(n.length){a&&n.push("");
// Init group info
for(var l=[],s=0;s<n.length;s++)l[s]={label:n[s],idx:s,positions:[],n_rows:1,// default
n_overlaps:0};for(var s=0;s<this._positions.length;s++){var o;(o=this._positions[s]).group=n.indexOf(t[s].group||""),o.row=0;for(var h,d=(h=l[o.group]).positions.length-1;0<=d;d--)h.positions[d].end>o.start&&h.n_overlaps++;h.positions.push(o)}// start with 1 row per group
for(var c=n.length;;){
// Count free rows available
var u=Math.max(0,e-c);if(!u)break;// no free rows, nothing to do
// Sort by # overlaps, idx
if(l.sort(function(t,e){return t.n_overlaps>e.n_overlaps?-1:t.n_overlaps<e.n_overlaps?1:t.idx-e.idx}),!l[0].n_overlaps)break;// no overlaps, nothing to do
// Distribute free rows among groups with overlaps
for(var c=0,s=0;s<l.length;s++){var h;if((h=l[s]).n_overlaps&&u){var m=this._computeRowInfo(h.positions,h.n_rows+1);h.n_rows=m.n_rows,// update group info
h.n_overlaps=m.n_overlaps,u--}c+=h.n_rows}}
// Set number of rows
this._number_of_rows=c,
// Set group labels; offset row positions
this._group_labels=[],l.sort(function(t,e){return t.idx-e.idx});for(var s=0,_=0;s<l.length;s++){this._group_labels.push({label:l[s].label,rows:l[s].n_rows});for(var d=0;d<l[s].positions.length;d++){var o;(o=l[s].positions[d]).row+=_}_+=l[s].n_rows}}else{var p=this._computeRowInfo(this._positions,e);this._number_of_rows=p.n_rows}}}),
/*	TL.TimeAxis
	Display element for showing timescale ticks
================================================== */
TL.TimeAxis=TL.Class.extend({includes:[TL.Events,TL.DomMixins,TL.I18NMixins],_el:{},
/*	Constructor
	================================================== */
initialize:function(t,e){
// DOM Elements
this._el={container:{},content_container:{},major:{},minor:{}},
// Components
this._text={},
// State
this._state={loaded:!1},
// Data
this.data={},
// Options
this.options={duration:1e3,ease:TL.Ease.easeInSpline,width:600,height:600},
// Actively Displaying
this.active=!1,
// Animation Object
this.animator={},
// Axis Helper
this.axis_helper={},
// Minor tick dom element array
this.minor_ticks=[],
// Minor tick dom element array
this.major_ticks=[],
// Date Format Lookup, map TL.Date.SCALES names to...
this.dateformat_lookup={millisecond:"time_milliseconds",// ...TL.Language.<code>.dateformats
second:"time_short",minute:"time_no_seconds_short",hour:"time_no_minutes_short",day:"full_short",month:"month_short",year:"year",decade:"year",century:"year",millennium:"year",age:"compact",// ...TL.Language.<code>.bigdateformats
epoch:"compact",era:"compact",eon:"compact",eon2:"compact"},
// Main element
this._el.container="object"==typeof t?t:TL.Dom.get(t),
// Merge Data and Options
TL.Util.mergeData(this.options,e),this._initLayout(),this._initEvents()},
/*	Adding, Hiding, Showing etc
	================================================== */
show:function(){},hide:function(){},addTo:function(t){t.appendChild(this._el.container)},removeFrom:function(t){t.removeChild(this._el.container)},updateDisplay:function(t,e){this._updateDisplay(t,e)},getLeft:function(){return this._el.container.style.left.slice(0,-2)},drawTicks:function(t,e){var i=t.getTicks(),n={minor:{el:this._el.minor,dateformat:this.dateformat_lookup[i.minor.name],ts_ticks:i.minor.ticks,tick_elements:this.minor_ticks},major:{el:this._el.major,dateformat:this.dateformat_lookup[i.major.name],ts_ticks:i.major.ticks,tick_elements:this.major_ticks}};
// FADE OUT
this._el.major.className="tl-timeaxis-major",this._el.minor.className="tl-timeaxis-minor",this._el.major.style.opacity=0,this._el.minor.style.opacity=0,
// CREATE MAJOR TICKS
this.major_ticks=this._createTickElements(i.major.ticks,this._el.major,this.dateformat_lookup[i.major.name]),
// CREATE MINOR TICKS
this.minor_ticks=this._createTickElements(i.minor.ticks,this._el.minor,this.dateformat_lookup[i.minor.name],i.major.ticks),this.positionTicks(t,e,!0),
// FADE IN
this._el.major.className="tl-timeaxis-major tl-animate-opacity tl-timeaxis-animate-opacity",this._el.minor.className="tl-timeaxis-minor tl-animate-opacity tl-timeaxis-animate-opacity",this._el.major.style.opacity=1,this._el.minor.style.opacity=1},_createTickElements:function(t,e,i,n){e.innerHTML="";var a={},s;if(a[new Date(-1,13,-30).getTime()]=!0,n)for(var o=0;o<n.length;o++)a[n[o].getTime()]=!0;for(var r=[],o=0;o<t.length;o++){var l=t[o];if(!(l.getTime()in a)){var h=TL.Dom.create("div","tl-timeaxis-tick",e),d=TL.Dom.create("span","tl-timeaxis-tick-text tl-animate-opacity",h);d.innerHTML=l.getDisplayDate(this.getLanguage(),i),r.push({tick:h,tick_text:d,display_date:l.getDisplayDate(this.getLanguage(),i),date:l})}}return r},positionTicks:function(t,e,i){
// Handle Animation
this._el.minor.className=i?(this._el.major.className="tl-timeaxis-major","tl-timeaxis-minor"):(this._el.major.className="tl-timeaxis-major tl-timeaxis-animate","tl-timeaxis-minor tl-timeaxis-animate"),this._positionTickArray(this.major_ticks,t,e),this._positionTickArray(this.minor_ticks,t,e)},_positionTickArray:function(t,e,i){
// Poition Ticks & Handle density of ticks
if(t[1]&&t[0]){var n,a=1;e.getPosition(t[1].date.getMillisecond())-e.getPosition(t[0].date.getMillisecond())<i&&(a=Math.round(i/e.getPixelsPerTick()));for(var s=1,o=0;o<t.length;o++){var r=t[o];
// Poition Ticks
r.tick.style.left=e.getPosition(r.date.getMillisecond())+"px",r.tick_text.innerHTML=r.display_date,
// Handle density of ticks
r.tick.className=1<a?a<=s?(s=1,r.tick_text.style.opacity=1,"tl-timeaxis-tick"):(s++,r.tick_text.style.opacity=0,"tl-timeaxis-tick tl-timeaxis-tick-hidden"):(r.tick_text.style.opacity=1,"tl-timeaxis-tick")}}},
/*	Events
	================================================== */
/*	Private Methods
	================================================== */
_initLayout:function(){this._el.content_container=TL.Dom.create("div","tl-timeaxis-content-container",this._el.container),this._el.major=TL.Dom.create("div","tl-timeaxis-major",this._el.content_container),this._el.minor=TL.Dom.create("div","tl-timeaxis-minor",this._el.content_container),
// Fire event that the slide is loaded
this.onLoaded()},_initEvents:function(){},
// Update Display
_updateDisplay:function(t,e,i){t&&(this.options.width=t),e&&(this.options.height=e)}}),
/*  TL.AxisHelper
    Strategies for laying out the timenav
    markers and time axis
    Intended as a private class -- probably only known to TimeScale
================================================== */
TL.AxisHelper=TL.Class.extend({initialize:function(t){if(!t)throw new TL.Error("axis_helper_no_options_err");this.scale=t.scale,this.minor=t.minor,this.major=t.major},getPixelsPerTick:function(t){return t*this.minor.factor},getMajorTicks:function(t){return this._getTicks(t,this.major)},getMinorTicks:function(t){return this._getTicks(t,this.minor)},_getTicks:function(t,e){for(var i=t._scaled_padding*e.factor,n=t._earliest-i,a=t._latest+i,s=[],o=n;o<a;o+=e.factor)s.push(t.getDateFromTime(o).floor(e.name));return{name:e.name,ticks:s}}}),function(s){// add some class-level behavior
var d={},t=function(t,e){d[t]=[];for(var i=0;i<e.length-1;i++){var n=e[i],a=e[i+1];d[t].push(new s({scale:n[3],minor:{name:n[0],factor:n[1]},major:{name:a[0],factor:a[1]}}))}};t("human",TL.Date.SCALES),t("cosmological",TL.BigDate.SCALES),s.HELPERS=d,s.getBestHelper=function(t,e){"number"!=typeof e&&(e=100);var i=t.getScale(),n=d[i];if(!n)throw new TL.Error("axis_helper_scale_err",i);for(var a=null,s=0;s<n.length;s++){var o=n[s],r=o.getPixelsPerTick(t._pixels_per_milli),l,h;if(e<r)return null==a?o:Math.abs(e-r)<Math.abs(e-r)?o:a;a=o}return n[n.length-1];// last resort           
}}(TL.AxisHelper),
/*  TimelineJS
Designed and built by Zach Wise at KnightLab

This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at https://mozilla.org/MPL/2.0/.

================================================== */
/*
TODO

*/
/*  Required Files
CodeKit Import
https://incident57.com/codekit/
================================================== */
// CORE
// @codekit-prepend "core/TL.js";
// @codekit-prepend "core/TL.Error.js";
// @codekit-prepend "core/TL.Util.js";
// @codekit-prepend "data/TL.Data.js";
// @codekit-prepend "core/TL.Class.js";
// @codekit-prepend "core/TL.Events.js";
// @codekit-prepend "core/TL.Browser.js";
// @codekit-prepend "core/TL.Load.js";
// @codekit-prepend "core/TL.TimelineConfig.js";
// @codekit-prepend "core/TL.ConfigFactory.js";
// LANGUAGE
// @codekit-prepend "language/TL.Language.js";
// @codekit-prepend "language/TL.I18NMixins.js";
// ANIMATION
// @codekit-prepend "animation/TL.Ease.js";
// @codekit-prepend "animation/TL.Animate.js";
// DOM
// @codekit-prepend "dom/TL.Point.js";
// @codekit-prepend "dom/TL.DomMixins.js";
// @codekit-prepend "dom/TL.Dom.js";
// @codekit-prepend "dom/TL.DomUtil.js";
// @codekit-prepend "dom/TL.DomEvent.js";
// @codekit-prepend "dom/TL.StyleSheet.js";
// Date
// @codekit-prepend "date/TL.Date.js";
// @codekit-prepend "date/TL.DateUtil.js";
// UI
// @codekit-prepend "ui/TL.Draggable.js";
// @codekit-prepend "ui/TL.Swipable.js";
// @codekit-prepend "ui/TL.MenuBar.js";
// @codekit-prepend "ui/TL.Message.js";
// MEDIA
// @codekit-prepend "media/TL.MediaType.js";
// @codekit-prepend "media/TL.Media.js";
// MEDIA TYPES
// @codekit-prepend "media/types/TL.Media.Blockquote.js";
// @codekit-prepend "media/types/TL.Media.DailyMotion.js";
// @codekit-prepend "media/types/TL.Media.DocumentCloud.js";
// @codekit-prepend "media/types/TL.Media.Flickr.js";
// @codekit-prepend "media/types/TL.Media.GoogleDoc.js";
// @codekit-prepend "media/types/TL.Media.GooglePlus.js";
// @codekit-prepend "media/types/TL.Media.IFrame.js";
// @codekit-prepend "media/types/TL.Media.Image.js";
// @codekit-prepend "media/types/TL.Media.Imgur.js";
// @codekit-prepend "media/types/TL.Media.Instagram.js";
// @codekit-prepend "media/types/TL.Media.GoogleMap.js";
// @codekit-prepend "media/types/TL.Media.PDF.js";
// @codekit-prepend "media/types/TL.Media.Profile.js";
// @codekit-prepend "media/types/TL.Media.Slider.js";
// @codekit-prepend "media/types/TL.Media.SoundCloud.js";
// @codekit-prepend "media/types/TL.Media.Spotify.js";
// @codekit-prepend "media/types/TL.Media.Storify.js";
// @codekit-prepend "media/types/TL.Media.Text.js";
// @codekit-prepend "media/types/TL.Media.Twitter.js";
// @codekit-prepend "media/types/TL.Media.TwitterEmbed.js";
// @codekit-prepend "media/types/TL.Media.Vimeo.js";
// @codekit-prepend "media/types/TL.Media.Vine.js";
// @codekit-prepend "media/types/TL.Media.Website.js";
// @codekit-prepend "media/types/TL.Media.Wikipedia.js";
// @codekit-prepend "media/types/TL.Media.Wistia.js";
// @codekit-prepend "media/types/TL.Media.YouTube.js";
// @codekit-prepend "media/types/TL.Media.Audio.js";
// @codekit-prepend "media/types/TL.Media.Video.js";
// STORYSLIDER
// @codekit-prepend "slider/TL.Slide.js";
// @codekit-prepend "slider/TL.SlideNav.js";
// @codekit-prepend "slider/TL.StorySlider.js";
// TIMENAV
// @codekit-prepend "timenav/TL.TimeNav.js";
// @codekit-prepend "timenav/TL.TimeMarker.js";
// @codekit-prepend "timenav/TL.TimeEra.js";
// @codekit-prepend "timenav/TL.TimeGroup.js";
// @codekit-prepend "timenav/TL.TimeScale.js";
// @codekit-prepend "timenav/TL.TimeAxis.js";
// @codekit-prepend "timenav/TL.AxisHelper.js";
TL.Timeline=TL.Class.extend({includes:[TL.Events,TL.I18NMixins],
/*  Private Methods
	================================================== */
initialize:function(t,e,i){var o=this;
// Merge Options
if(i||(i={}),
// Version
this.version="3.2.6",
// Ready
this.ready=!1,
// DOM ELEMENTS
this._el={container:{},storyslider:{},timenav:{},menubar:{}},
// Determine Container Element
this._el.container="object"==typeof t?t:TL.Dom.get(t),
// Slider
this._storyslider={},
// Style Sheet
this._style_sheet=new TL.StyleSheet,
// TimeNav
this._timenav={},
// Menu Bar
this._menubar={},
// Loaded State
this._loaded={storyslider:!1,timenav:!1},
// Data Object
this.config=null,this.options={script_path:"",height:this._el.container.offsetHeight,width:this._el.container.offsetWidth,debug:!1,is_embed:!1,is_full_embed:!1,hash_bookmark:!1,default_bg_color:{r:255,g:255,b:255},scale_factor:2,// How many screen widths wide should the timeline be
layout:"landscape",// portrait or landscape
timenav_position:"bottom",// timeline on top or bottom
optimal_tick_width:60,// optimal distance (in pixels) between ticks on axis
base_class:"tl-timeline",// removing tl-timeline will break all default stylesheets...
timenav_height:null,timenav_height_percentage:25,// Overrides timenav height as a percentage of the screen
timenav_mobile_height_percentage:40,// timenav height as a percentage on mobile devices
timenav_height_min:175,// Minimum timenav height
marker_height_min:30,// Minimum Marker Height
marker_width_min:100,// Minimum Marker Width
marker_padding:5,// Top Bottom Marker Padding
start_at_slide:0,start_at_end:!1,menubar_height:0,skinny_size:650,medium_size:800,relative_date:!1,// Use momentjs to show a relative date from the slide.text.date.created_time field
use_bc:!1,// Use declared suffix on dates earlier than 0
// animation
duration:1e3,ease:TL.Ease.easeInOutQuint,
// interaction
dragging:!0,trackResize:!0,map_type:"stamen:toner-lite",slide_padding_lr:100,// padding on slide of slide
slide_default_fade:"0%",// landscape fade
zoom_sequence:[.5,1,2,3,5,8,13,21,34,55,89],// Array of Fibonacci numbers for TimeNav zoom levels
language:"en",ga_property_id:null,track_events:["back_to_start","nav_next","nav_previous","zoom_in","zoom_out"]},
// Animation Objects
this.animator_timenav=null,this.animator_storyslider=null,this.animator_menubar=null,
// Add message to DOM
this.message=new TL.Message({},{message_class:"tl-message-full"},this._el.container),"string"==typeof i.default_bg_color){var n=TL.Util.hexToRgb(i.default_bg_color);// will clear it out if its invalid
n?i.default_bg_color=n:(delete i.default_bg_color,trace("Invalid default background color. Ignoring."))}TL.Util.mergeData(this.options,i),window.addEventListener("resize",function(t){o.updateDisplay()}),
// Set Debug Mode
TL.debug=this.options.debug,
// Apply base class to container
TL.DomUtil.addClass(this._el.container,"tl-timeline"),this.options.is_embed&&TL.DomUtil.addClass(this._el.container,"tl-timeline-embed"),this.options.is_full_embed&&TL.DomUtil.addClass(this._el.container,"tl-timeline-full-embed"),document.addEventListener("keydown",function(t){var e=t.key,i=o._getSlideIndex(o.current_id),n=o.config.events.length-1,a=o.config.title?n+1:n,s=0;"ArrowLeft"==e?0!=i&&o.goToPrev():"ArrowRight"==e&&i!=a&&o.goToNext()}),
// Use Relative Date Calculations
// NOT YET IMPLEMENTED
this.options.relative_date?"undefined"!=typeof moment?o._loadLanguage(e):TL.Load.js(this.options.script_path+"/library/moment.js",function(){o._loadLanguage(e),trace("LOAD MOMENTJS")}):o._loadLanguage(e)},_translateError:function(t){return t.hasOwnProperty("stack")&&trace(t.stack),t.message_key?this._(t.message_key)+(t.detail?" ["+t.detail+"]":""):t},
/*  Load Language
	================================================== */
_loadLanguage:function(t){try{this.options.language=new TL.Language(this.options),this._initData(t)}catch(t){this.showMessage(this._translateError(t))}},
/*  Navigation
	================================================== */
// Goto slide with id
goToId:function(t){this.current_id!=t&&(this.current_id=t,this._timenav.goToId(this.current_id),this._storyslider.goToId(this.current_id,!1,!0),this.fire("change",{unique_id:this.current_id},this))},
// Goto slide n
goTo:function(t){this.config.title?0==t?this.goToId(this.config.title.unique_id):this.goToId(this.config.events[t-1].unique_id):this.goToId(this.config.events[t].unique_id)},
// Goto first slide
goToStart:function(){this.goTo(0)},
// Goto last slide
goToEnd:function(){var t=this.config.events.length-1;this.goTo(this.config.title?t+1:t)},
// Goto previous slide
goToPrev:function(){this.goTo(this._getSlideIndex(this.current_id)-1)},
// Goto next slide
goToNext:function(){this.goTo(this._getSlideIndex(this.current_id)+1)},
/* Event maniupluation
	================================================== */
// Add an event
add:function(t){var e=this.config.addEvent(t),i=this._getEventIndex(e),n=this.config.events[i];this._storyslider.createSlide(n,this.config.title?i+1:i),this._storyslider._updateDrawSlides(),this._timenav.createMarker(n,i),this._timenav._updateDrawTimeline(!1),this.fire("added",{unique_id:e})},
// Remove an event
remove:function(t){if(0<=t&&t<this.config.events.length){
// If removing the current, nav to new one first
this.config.events[t].unique_id==this.current_id&&(t<this.config.events.length-1?this.goTo(t+1):this.goTo(t-1));var e=this.config.events.splice(t,1);delete this.config.event_dict[e[0].unique_id],this._storyslider.destroySlide(this.config.title?t+1:t),this._storyslider._updateDrawSlides(),this._timenav.destroyMarker(t),this._timenav._updateDrawTimeline(!1),this.fire("removed",{unique_id:e[0].unique_id})}},removeId:function(t){this.remove(this._getEventIndex(t))},
/* Get slide data
	================================================== */
getData:function(t){if(this.config.title){if(0==t)return this.config.title;if(0<t&&t<=this.config.events.length)return this.config.events[t-1]}else if(0<=t&&t<this.config.events.length)return this.config.events[t];return null},getDataById:function(t){return this.getData(this._getSlideIndex(t))},
/* Get slide object
	================================================== */
getSlide:function(t){return 0<=t&&t<this._storyslider._slides.length?this._storyslider._slides[t]:null},getSlideById:function(t){return this.getSlide(this._getSlideIndex(t))},getCurrentSlide:function(){return this.getSlideById(this.current_id)},
/*  Display
	================================================== */
updateDisplay:function(){this.ready&&this._updateDisplay()},
/*
  		Compute the height of the navigation section of the Timeline, taking into account
  		the possibility of an explicit height or height percentage, but also honoring the
  		`timenav_height_min` option value. If `timenav_height` is specified it takes precedence over `timenav_height_percentage` but in either case, if the resultant pixel height is less than `options.timenav_height_min` then the value of `options.timenav_height_min` will be returned. (A minor adjustment is made to the returned value to account for marker padding.)

  		Arguments:
  		@timenav_height (optional): an integer value for the desired height in pixels
  		@timenav_height_percentage (optional): an integer between 1 and 100

  	 */
_calculateTimeNavHeight:function(t,e){var i=0;return t?i=t:(this.options.timenav_height_percentage||e)&&(i=e?Math.round(this.options.height/100*e):Math.round(this.options.height/100*this.options.timenav_height_percentage)),
// Set new minimum based on how many rows needed
this._timenav.ready&&this.options.timenav_height_min<this._timenav.getMinimumHeight()&&(this.options.timenav_height_min=this._timenav.getMinimumHeight()),
// If height is less than minimum set it to minimum
i<this.options.timenav_height_min&&(i=this.options.timenav_height_min),i-=2*this.options.marker_padding},
/*  Private Methods
	================================================== */
// Update View
_updateDisplay:function(t,e,i){var n=this.options.duration,a=this.options.base_class,s=0,o=this;i&&(n=i),
// Update width and height
this.options.width=this._el.container.offsetWidth,this.options.height=this._el.container.offsetHeight,
// Check if skinny
this.options.width<=this.options.skinny_size?(a+=" tl-skinny",this.options.layout="portrait"):(this.options.width<=this.options.medium_size&&(a+=" tl-medium"),this.options.layout="landscape"),
// Detect Mobile and Update Orientation on Touch devices
TL.Browser.touch&&(this.options.layout=TL.Browser.orientation()),TL.Browser.mobile?(a+=" tl-mobile",
// Set TimeNav Height
this.options.timenav_height=this._calculateTimeNavHeight(t,this.options.timenav_mobile_height_percentage)):
// Set TimeNav Height
this.options.timenav_height=this._calculateTimeNavHeight(t),
// LAYOUT
"portrait"==this.options.layout?
// Portrait
a+=" tl-layout-portrait":
// Landscape
a+=" tl-layout-landscape",
// Set StorySlider Height
this.options.storyslider_height=this.options.height-this.options.timenav_height,
// Positon Menu
s="top"==this.options.timenav_position?Math.ceil(this.options.timenav_height)/2-this._el.menubar.offsetHeight/2-19.5:Math.round(this.options.storyslider_height+1+Math.ceil(this.options.timenav_height)/2-this._el.menubar.offsetHeight/2-17.5),e?(
// Animate TimeNav
/*
			if (this.animator_timenav) {
			this.animator_timenav.stop();
			}

			this.animator_timenav = TL.Animate(this._el.timenav, {
			height:   (this.options.timenav_height) + "px",
			duration:   duration/4,
			easing:   TL.Ease.easeOutStrong,
			complete: function () {
			//self._map.updateDisplay(self.options.width, self.options.timenav_height, animate, d, self.options.menubar_height);
			}
			});
			*/
this._el.timenav.style.height=Math.ceil(this.options.timenav_height)+"px",
// Animate StorySlider
this.animator_storyslider&&this.animator_storyslider.stop(),this.animator_storyslider=TL.Animate(this._el.storyslider,{height:this.options.storyslider_height+"px",duration:n/2,easing:TL.Ease.easeOutStrong}),
// Animate Menubar
this.animator_menubar&&this.animator_menubar.stop(),this.animator_menubar=TL.Animate(this._el.menubar,{top:s+"px",duration:n/2,easing:TL.Ease.easeOutStrong})):(
// TimeNav
this._el.timenav.style.height=Math.ceil(this.options.timenav_height)+"px",
// StorySlider
this._el.storyslider.style.height=this.options.storyslider_height+"px",
// Menubar
this._el.menubar.style.top=s+"px"),this.message&&this.message.updateDisplay(this.options.width,this.options.height),
// Update Component Displays
this._timenav.updateDisplay(this.options.width,this.options.timenav_height,e),this._storyslider.updateDisplay(this.options.width,this.options.storyslider_height,e,this.options.layout),"rtl"==this.options.language.direction&&(a+=" tl-rtl"),
// Apply class
this._el.container.className=a},
// Update hashbookmark in the url bar
_updateHashBookmark:function(t){var e="#event-"+t.toString();"file:"!=window.location.protocol&&window.history.replaceState(null,"Browsing TimelineJS",e),this.fire("hash_updated",{unique_id:this.current_id,hashbookmark:"#event-"+t.toString()},this)},
/*  Init
	================================================== */
// Initialize the data
_initData:function(t){var e=this;if("string"==typeof t){var e=this;TL.ConfigFactory.makeConfig(t,function(t){e.setConfig(t)})}else TL.TimelineConfig==t.constructor?this.setConfig(t):this.setConfig(new TL.TimelineConfig(t))},setConfig:function(t){if(this.config=t,this.config.validate(),this._validateOptions(),this.config.isValid())try{this._onDataLoaded()}catch(t){this.showMessage("<strong>"+this._("error")+":</strong> "+this._translateError(t))}else{for(var e=[],i=0,n=this.config.getErrors();i<n.length;i++)e.push(this._translateError(n[i]));this.showMessage("<strong>"+this._("error")+":</strong> "+e.join("<br>"))}},_validateOptions:function(){for(
// assumes that this.options and this.config have been set.
var t=["timenav_height","timenav_height_min","marker_height_min","marker_width_min","marker_padding","start_at_slide","slide_padding_lr"],e=0;e<t.length;e++){var i=t[e],n=this.options[i];valid=!0,"number"==typeof n?valid=n==parseInt(n):"string"==typeof n&&(valid=n.match(/^\s*(\-?\d+)?\s*$/)),valid||this.config.logError({message_key:"invalid_integer_option",detail:i})}},
// Initialize the layout
_initLayout:function(){var t=this;this.message.removeFrom(this._el.container),this._el.container.innerHTML="",
// Create Layout
"top"==this.options.timenav_position?(this._el.timenav=TL.Dom.create("div","tl-timenav",this._el.container),this._el.storyslider=TL.Dom.create("div","tl-storyslider",this._el.container)):(this._el.storyslider=TL.Dom.create("div","tl-storyslider",this._el.container),this._el.timenav=TL.Dom.create("div","tl-timenav",this._el.container)),this._el.menubar=TL.Dom.create("div","tl-menubar",this._el.container),
// Initial Default Layout
this.options.width=this._el.container.offsetWidth,this.options.height=this._el.container.offsetHeight,
// this._el.storyslider.style.top  = "1px";
// Set TimeNav Height
this.options.timenav_height=this._calculateTimeNavHeight(this.options.timenav_height),
// Create TimeNav
this._timenav=new TL.TimeNav(this._el.timenav,this.config,this.options),this._timenav.on("loaded",this._onTimeNavLoaded,this),this._timenav.on("update_timenav_min",this._updateTimeNavHeightMin,this),this._timenav.options.height=this.options.timenav_height,this._timenav.init(),
// intial_zoom cannot be applied before the timenav has been created
this.options.initial_zoom&&
// at this point, this.options refers to the merged set of options
this.setZoom(this.options.initial_zoom),
// Create StorySlider
this._storyslider=new TL.StorySlider(this._el.storyslider,this.config,this.options),this._storyslider.on("loaded",this._onStorySliderLoaded,this),this._storyslider.init(),
// Create Menu Bar
this._menubar=new TL.MenuBar(this._el.menubar,this._el.container,this.options),
// LAYOUT
"portrait"==this.options.layout?this.options.storyslider_height=this.options.height-this.options.timenav_height-1:this.options.storyslider_height=this.options.height-1,
// Update Display
this._updateDisplay(this._timenav.options.height,!0,2e3)},
/* Depends upon _initLayout because these events are on things the layout initializes */
_initEvents:function(){
// TimeNav Events
this._timenav.on("change",this._onTimeNavChange,this),this._timenav.on("zoomtoggle",this._onZoomToggle,this),
// StorySlider Events
this._storyslider.on("change",this._onSlideChange,this),this._storyslider.on("colorchange",this._onColorChange,this),this._storyslider.on("nav_next",this._onStorySliderNext,this),this._storyslider.on("nav_previous",this._onStorySliderPrevious,this),
// Menubar Events
this._menubar.on("zoom_in",this._onZoomIn,this),this._menubar.on("zoom_out",this._onZoomOut,this),this._menubar.on("back_to_start",this._onBackToStart,this)},
/* Analytics
	================================================== */
_initGoogleAnalytics:function(){var t,e,i,n,a,s,o;t=window,e=document,i="script",n="//www.google-analytics.com/analytics.js",a="ga",t.GoogleAnalyticsObject=a,t.ga=t.ga||function(){(t.ga.q=t.ga.q||[]).push(arguments)},t.ga.l=1*new Date,s=e.createElement(i),o=e.getElementsByTagName(i)[0],s.async=1,s.src=n,o.parentNode.insertBefore(s,o),ga("create",this.options.ga_property_id,"auto"),ga("set","anonymizeIp",!0)},_initAnalytics:function(){if(null!==this.options.ga_property_id){this._initGoogleAnalytics(),ga("send","pageview");var t=this.options.track_events;for(i=0;i<t.length;i++){var e=t[i];this.addEventListener(e,function(t){ga("send","event",t.type,"clicked")})}}},_onZoomToggle:function(t){"in"==t.zoom?this._menubar.toogleZoomIn(t.show):"out"==t.zoom&&this._menubar.toogleZoomOut(t.show)},
/* Get index of event by id
	================================================== */
_getEventIndex:function(t){for(var e=0;e<this.config.events.length;e++)if(t==this.config.events[e].unique_id)return e;return-1},
/*  Get index of slide by id
	================================================== */
_getSlideIndex:function(t){if(this.config.title&&this.config.title.unique_id==t)return 0;for(var e=0;e<this.config.events.length;e++)if(t==this.config.events[e].unique_id)return this.config.title?e+1:e;return-1},
/*  Events
	================================================== */
_onDataLoaded:function(t){this.fire("dataloaded"),this._initLayout(),this._initEvents(),this._initAnalytics(),this.message&&this.message.hide(),this.ready=!0},showMessage:function(t){this.message?this.message.updateMessage(t):(trace("No message display available."),trace(t))},_onColorChange:function(t){this.fire("color_change",{unique_id:this.current_id},this),t.color||t.image},_onSlideChange:function(t){this.current_id!=t.unique_id&&(this.current_id=t.unique_id,this._timenav.goToId(this.current_id),this._onChange(t))},_onTimeNavChange:function(t){this.current_id!=t.unique_id&&(this.current_id=t.unique_id,this._storyslider.goToId(this.current_id),this._onChange(t))},_onChange:function(t){this.fire("change",{unique_id:this.current_id},this),this.options.hash_bookmark&&this.current_id&&this._updateHashBookmark(this.current_id)},_onBackToStart:function(t){this._storyslider.goTo(0),this.fire("back_to_start",{unique_id:this.current_id},this)},
/**
	 * Zoom in and zoom out should be part of the public API.
	 */
zoomIn:function(){this._timenav.zoomIn()},zoomOut:function(){this._timenav.zoomOut()},setZoom:function(t){this._timenav.setZoom(t)},_onZoomIn:function(t){this._timenav.zoomIn(),this.fire("zoom_in",{zoom_level:this._timenav.options.scale_factor},this)},_onZoomOut:function(t){this._timenav.zoomOut(),this.fire("zoom_out",{zoom_level:this._timenav.options.scale_factor},this)},_onTimeNavLoaded:function(){this._loaded.timenav=!0,this._onLoaded()},_onStorySliderLoaded:function(){this._loaded.storyslider=!0,this._onLoaded()},_onStorySliderNext:function(t){this.fire("nav_next",t)},_onStorySliderPrevious:function(t){this.fire("nav_previous",t)},_onLoaded:function(){this._loaded.storyslider&&this._loaded.timenav&&(this.fire("loaded",this.config),
// Go to proper slide
this.options.hash_bookmark&&""!=window.location.hash?this.goToId(window.location.hash.replace("#event-","")):(TL.Util.isTrue(this.options.start_at_end)||this.options.start_at_slide>this.config.events.length?this.goToEnd():this.goTo(this.options.start_at_slide),this.options.hash_bookmark&&this._updateHashBookmark(this.current_id)))}}),TL.Timeline.source_path=function(){var t=document.getElementsByTagName("script"),e=t[t.length-1].src;return e.substr(0,e.lastIndexOf("/"))}();