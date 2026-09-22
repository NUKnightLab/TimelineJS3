import * as Browser from "../core/Browser"

/**
 * Get element by ID or return the element itself
 * @param {string|HTMLElement} id - Element ID or element itself
 * @returns {HTMLElement}
 */
function get(id) {
	return (typeof id === 'string' ? document.getElementById(id) : id);
}

/**
 * Get elements by class name (use querySelector/querySelectorAll for more complex queries)
 * @param {string} className
 * @returns {HTMLCollection}
 */
function getByClass(className) {
	return className ? document.getElementsByClassName(className) : null;
}

/**
 * Create an element with a class name and optionally append to a container
 * @param {string} tagName - HTML tag name
 * @param {string} className - CSS class name(s)
 * @param {HTMLElement} [container] - Optional container to append to
 * @returns {HTMLElement}
 */
function create(tagName, className, container) {
	const el = document.createElement(tagName);
	if (className) {
		el.className = className;
	}
	if (container) {
		container.appendChild(el);
	}
	return el;
}

/**
 * Create a button element
 * @param {string} className - CSS class name(s)
 * @param {HTMLElement} [container] - Optional container to append to
 * @returns {HTMLButtonElement}
 */
function createButton(className, container) {
	const el = create('button', className, container);
	el.type = 'button';
	return el;
}

/**
 * Create a text node
 * @param {string} content - Text content
 * @param {HTMLElement} [container] - Optional container to append to
 * @returns {Text}
 */
function createText(content, container) {
	const el = document.createTextNode(content);
	if (container) {
		container.appendChild(el);
	}
	return el;
}

/**
 * Get CSS translate string for transforms
 * @param {Object} point - Point with x and y properties
 * @returns {string}
 */
function getTranslateString(point) {
	// Use translate3d for better performance on supporting browsers
	return Browser.webkit3d ?
		`translate3d(${point.x}px, ${point.y}px, 0)` :
		`translate(${point.x}px, ${point.y}px)`;
}

/**
 * Set element position using modern transform or fallback to left/top
 * @param {HTMLElement} el - Element to position
 * @param {Object} point - Point with x and y properties
 */
function setPosition(el, point) {
	el._tl_pos = point;
	// Use CSS transforms for better performance
	el.style.transform = getTranslateString(point);
}

/**
 * Get element position relative to document
 * @param {HTMLElement} el - Element to get position of
 * @returns {Object} Position with x and y properties
 */
function getPosition(el) {
	const rect = el.getBoundingClientRect();
	return {
		x: rect.left + window.scrollX,
		y: rect.top + window.scrollY
	};
}

/**
 * Test which CSS property is supported (all modern browsers support unprefixed versions)
 * @param {string[]} props - Array of property names to test
 * @returns {string|false} Supported property name or false
 */
function testProp(props) {
	const style = document.documentElement.style;
	for (let i = 0; i < props.length; i++) {
		if (props[i] in style) {
			return props[i];
		}
	}
	return false;
}

// Modern browsers support unprefixed versions
const TRANSITION = testProp(['transition', 'webkitTransition'])
const TRANSFORM = testProp(['transform', 'WebkitTransform'])

export { get, create, createButton, getPosition, TRANSITION, TRANSFORM }
