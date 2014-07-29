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
