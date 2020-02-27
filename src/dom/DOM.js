import * as Browser from "../core/Browser"

function get (id) {
	return (typeof id === 'string' ? document.getElementById(id) : id);
}

function getByClass(id) {
	if (id) {
		return document.getElementsByClassName(id);
	}
}

function create(tagName, className, container) {
	var el = document.createElement(tagName);
	el.className = className;
	if (container) {
		container.appendChild(el);
	}
	return el;
}

function createText(content, container) {
	var el = document.createTextNode(content);
	if (container) {
		container.appendChild(el);
	}
	return el;
}

function getTranslateString(point) {
	return TRANSLATE_OPEN +
			point.x + 'px,' + point.y + 'px' +
			TRANSLATE_CLOSE;
}

function setPosition(el, point) {
	el._tl_pos = point;
	if (Browser.webkit3d) {
		el.style[TRANSFORM] =  getTranslateString(point);

		if (Browser.android) {
			el.style['-webkit-perspective'] = '1000';
			el.style['-webkit-backface-visibility'] = 'hidden';
		}
	} else {
		el.style.left = point.x + 'px';
		el.style.top = point.y + 'px';
	}
}

function getPosition(el){
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
}

function testProp(props) {
	var style = document.documentElement.style;

	for (var i = 0; i < props.length; i++) {
		if (props[i] in style) {
			return props[i];
		}
	}
	return false;
}

let TRANSITION = testProp(['transition', 'webkitTransition', 'OTransition', 'MozTransition', 'msTransition'])
let TRANSFORM = testProp(['transformProperty', 'WebkitTransform', 'OTransform', 'MozTransform', 'msTransform'])

let TRANSLATE_OPEN = 'translate' + (Browser.webkit3d ? '3d(' : '(')
let TRANSLATE_CLOSE = Browser.webkit3d ? ',0)' : ')'

export { get, create, getPosition }