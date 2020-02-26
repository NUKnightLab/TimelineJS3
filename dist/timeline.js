var TL =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/core/Browser.js":
/*!*****************************!*\
  !*** ./src/core/Browser.js ***!
  \*****************************/
/*! exports provided: ie, ua, webkit, android23, ie3d, webkit3d, gecko3d, opera3d, mobile */
/*! exports used: android, webkit3d */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("/* unused harmony export ie */\n/* unused harmony export ua */\n/* unused harmony export webkit */\n/* unused harmony export android23 */\n/* unused harmony export ie3d */\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"b\", function() { return webkit3d; });\n/* unused harmony export gecko3d */\n/* unused harmony export opera3d */\n/* unused harmony export mobile */\n/*\n\tBased on Leaflet Browser\n\tTL.Browser handles different browser and feature detections for internal  use.\n*/\n\nconst ie = window && 'ActiveXObject' in window\nconst ua = (navigator) ? navigator.userAgent.toLowerCase() : null\nconst doc = (document) ? document.documentElement : null\nconst webkit = (ua) ? ua.indexOf('webkit') !== -1 : false\nconst phantomjs = (ua) ? ua.indexOf('phantom') !== -1 : false\nconst android23 = (ua) ? ua.search('android [23]') !== -1 : false\nconst mobile = (window) ? typeof window.orientation !== 'undefined' : false\nconst msPointer = (navigator && window) ? navigator.msPointerEnabled && navigator.msMaxTouchPoints && !window.PointerEvent : false\nconst pointer = (navigator && window) ? (window.PointerEvent && navigator.pointerEnabled && navigator.maxTouchPoints) : msPointer\nconst ie3d = (doc) ? ie && 'transition' in doc.style : false\nconst webkit3d = (window) ? ('WebKitCSSMatrix' in window) && ('m11' in new window.WebKitCSSMatrix()) && !android23 : false\nconst gecko3d = (doc) ? 'MozPerspective' in doc.style : false\nconst opera3d = (doc) ? 'OTransition' in doc.style: false\nconst opera = (window) ? window.opera : false\nlet retina = (window) ? 'devicePixelRatio' in window && window.devicePixelRatio > 1 : false\n\nif (!retina && window && 'matchMedia' in window) {\n    var matches = window.matchMedia('(min-resolution:144dpi)');\n    retina = matches && matches.matches;\n}\n\nconst touch = (window) ? \n    !window.L_NO_TOUCH && \n    !phantomjs && \n    (pointer || 'ontouchstart' in window || (window.DocumentTouch && document instanceof window.DocumentTouch)) : false\n\n\t\n\n\n//# sourceURL=webpack://TL/./src/core/Browser.js?");

/***/ }),

/***/ "./src/dom/DOM.js":
/*!************************!*\
  !*** ./src/dom/DOM.js ***!
  \************************/
/*! exports provided: get */
/*! exports used: get */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"a\", function() { return get; });\n/* harmony import */ var _core_Browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/Browser */ \"./src/core/Browser.js\");\n\n\nfunction get (id) {\n\treturn (typeof id === 'string' ? document.getElementById(id) : id);\n}\n\nfunction getByClass(id) {\n\tif (id) {\n\t\treturn document.getElementsByClassName(id);\n\t}\n}\n\nfunction create(tagName, className, container) {\n\tvar el = document.createElement(tagName);\n\tel.className = className;\n\tif (container) {\n\t\tcontainer.appendChild(el);\n\t}\n\treturn el;\n}\n\nfunction createText(content, container) {\n\tvar el = document.createTextNode(content);\n\tif (container) {\n\t\tcontainer.appendChild(el);\n\t}\n\treturn el;\n}\n\nfunction getTranslateString(point) {\n\treturn TRANSLATE_OPEN +\n\t\t\tpoint.x + 'px,' + point.y + 'px' +\n\t\t\tTRANSLATE_CLOSE;\n}\n\nfunction setPosition(el, point) {\n\tel._tl_pos = point;\n\tif (_core_Browser__WEBPACK_IMPORTED_MODULE_0__[/* webkit3d */ \"b\"]) {\n\t\tel.style[TRANSFORM] =  getTranslateString(point);\n\n\t\tif (_core_Browser__WEBPACK_IMPORTED_MODULE_0__[\"android\"]) {\n\t\t\tel.style['-webkit-perspective'] = '1000';\n\t\t\tel.style['-webkit-backface-visibility'] = 'hidden';\n\t\t}\n\t} else {\n\t\tel.style.left = point.x + 'px';\n\t\tel.style.top = point.y + 'px';\n\t}\n}\n\nfunction getPosition(el){\n\tvar pos = {\n\t\tx: 0,\n\t\ty: 0\n\t}\n\twhile( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {\n\t\tpos.x += el.offsetLeft// - el.scrollLeft;\n\t\tpos.y += el.offsetTop// - el.scrollTop;\n\t\tel = el.offsetParent;\n\t}\n\treturn pos;\n}\n\nfunction testProp(props) {\n\tvar style = document.documentElement.style;\n\n\tfor (var i = 0; i < props.length; i++) {\n\t\tif (props[i] in style) {\n\t\t\treturn props[i];\n\t\t}\n\t}\n\treturn false;\n}\n\nlet TRANSITION = testProp(['transition', 'webkitTransition', 'OTransition', 'MozTransition', 'msTransition'])\nlet TRANSFORM = testProp(['transformProperty', 'WebkitTransform', 'OTransform', 'MozTransform', 'msTransform'])\n\nlet TRANSLATE_OPEN = 'translate' + (_core_Browser__WEBPACK_IMPORTED_MODULE_0__[/* webkit3d */ \"b\"] ? '3d(' : '(')\nlet TRANSLATE_CLOSE = _core_Browser__WEBPACK_IMPORTED_MODULE_0__[/* webkit3d */ \"b\"] ? ',0)' : ')'\n\n\n\n//# sourceURL=webpack://TL/./src/dom/DOM.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: Timeline */
/*! all exports used */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _timeline_Timeline__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./timeline/Timeline */ \"./src/timeline/Timeline.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"Timeline\", function() { return _timeline_Timeline__WEBPACK_IMPORTED_MODULE_0__[\"a\"]; });\n\n\n\n\n//# sourceURL=webpack://TL/./src/index.js?");

/***/ }),

/***/ "./src/timeline/Timeline.js":
/*!**********************************!*\
  !*** ./src/timeline/Timeline.js ***!
  \**********************************/
/*! exports provided: Timeline */
/*! exports used: Timeline */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"a\", function() { return Timeline; });\n/* harmony import */ var _dom_DOM__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dom/DOM */ \"./src/dom/DOM.js\");\n\n/*\n    needed imports: \n        TL.Dom (obsolete?)\n        TL.StyleSheet\n        TL.Ease.easeInOutQuint\n        TL.Ease.easeOutStrong\n        TL.Message\n        TL.Util.hexToRgb\n        TL.Util.mergeData\n        TL.Util.isTrue\n        TL.DomUtil.addClass\n        TL.Load.js\n        TL.Language\n        TL.Browser\n        TL.Animate\n        TL.TimelineConfig\n        TL.TimeNav\n        TL.StorySlider\n        TL.MenuBar\n*/\nclass Timeline {\n    constructor(elem, data, options) {\n    this.elem = _dom_DOM__WEBPACK_IMPORTED_MODULE_0__[/* get */ \"a\"](elem)\n\n\t\tthis.elem.innerHTML = `<b>Hello World</b>`;\n\n    }\n}\n\n\n\n\n\n//# sourceURL=webpack://TL/./src/timeline/Timeline.js?");

/***/ })

/******/ });