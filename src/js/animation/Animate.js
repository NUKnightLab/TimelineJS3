/*	Animate
  Modern animation using Web Animations API with CSS transitions fallback
  Provides a simpler, more performant alternative to the legacy Morpheus-based approach
================================================== */

/**
 * Animate element properties using Web Animations API or CSS transitions
 * @param {HTMLElement|HTMLElement[]} el - Element(s) to animate
 * @param {Object} options - Animation options
 * @param {number} [options.duration=1000] - Duration in milliseconds
 * @param {string|function} [options.easing='ease'] - Easing function
 * @param {function} [options.complete] - Callback when animation completes
 * @returns {Object} Animation controller with stop() method
 */
export function Animate(el, options) {
	return animate(el, options);
}

function animate(elements, options) {
	// Normalize to array
	const els = Array.isArray(elements) ? elements : (elements.length !== undefined ? Array.from(elements) : [elements]);

	const {
		duration = 1000,
		easing = 'ease',
		complete,
		...properties
	} = options;

	// Convert easing function to CSS easing string if needed
	const easingStr = typeof easing === 'function' ? 'ease-out' : easing;

	const animations = [];
	const useWebAnimations = 'animate' in HTMLElement.prototype;

	els.forEach(el => {
		if (!el || !el.style) return;

		if (useWebAnimations) {
			// Use Web Animations API for better performance and control
			const keyframes = {};
			for (const prop in properties) {
				if (properties.hasOwnProperty(prop)) {
					keyframes[prop] = properties[prop];
				}
			}

			try {
				const animation = el.animate(keyframes, {
					duration,
					easing: easingStr,
					fill: 'forwards'
				});

				animation.onfinish = () => {
					// Apply final styles
					for (const prop in properties) {
						if (properties.hasOwnProperty(prop)) {
							el.style[prop] = properties[prop];
						}
					}
				};

				animations.push(animation);
			} catch (e) {
				// Fallback to CSS transitions if Web Animations fails
				useCSSTransition(el, properties, duration, easingStr);
			}
		} else {
			// Fallback to CSS transitions
			useCSSTransition(el, properties, duration, easingStr);
		}
	});

	let stopped = false;

	// Return controller object
	return {
		stop(jump = false) {
			stopped = true;
			animations.forEach(anim => {
				if (anim && anim.cancel) {
					if (jump) {
						anim.finish();
					} else {
						anim.cancel();
					}
				}
			});
			if (!jump) {
				// Don't call complete callback if stopped without jumping
				return;
			}
			if (complete) {
				complete();
			}
		}
	};

	function useCSSTransition(el, props, dur, ease) {
		const propNames = Object.keys(props).map(camelToKebab).join(', ');
		el.style.transition = `${propNames} ${dur}ms ${ease}`;

		// Apply properties after a microtask to ensure transition triggers
		requestAnimationFrame(() => {
			for (const prop in props) {
				if (props.hasOwnProperty(prop)) {
					el.style[prop] = props[prop];
				}
			}
		});

		// Call complete callback
		const handleTransitionEnd = (e) => {
			if (e.target === el && !stopped) {
				el.removeEventListener('transitionend', handleTransitionEnd);
				el.style.transition = '';
				if (complete) {
					complete();
				}
			}
		};

		el.addEventListener('transitionend', handleTransitionEnd);
	}
}

/**
 * Convert camelCase to kebab-case for CSS properties
 */
function camelToKebab(str) {
	return str.replace(/([A-Z])/g, '-$1').toLowerCase();
}
