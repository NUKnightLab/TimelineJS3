/*
	Browser and device detection utilities
	Modernized to remove IE-specific detection
*/

export const ua = navigator ? navigator.userAgent.toLowerCase() : 'no-user-agent-specified';

export const webkit = ua.indexOf('webkit') !== -1
export const android = ua.indexOf('android') !== -1
export const mobile = window ? /mobile|tablet|ip(ad|hone|od)|android/i.test(ua) || 'ontouchstart' in window : false

export const gecko = ua.indexOf("gecko") !== -1 && !webkit
export const firefox = gecko && ua.indexOf("firefox") !== -1
export const chrome = ua.indexOf("chrome") !== -1
export const edge = ua.indexOf("edge/") !== -1 || ua.indexOf("edg/") !== -1
export const safari = webkit && ua.indexOf("safari") !== -1 && !chrome && !edge

// Modern browsers all support 3D transforms
export const webkit3d = window ? ('WebKitCSSMatrix' in window) && ('m11' in new window.WebKitCSSMatrix()) : false
export const any3d = window && !window.L_DISABLE_3D

export const mobileWebkit = mobile && webkit

// Retina display detection
export let retina = window ? 'devicePixelRatio' in window && window.devicePixelRatio > 1 : false

if (!retina && window && 'matchMedia' in window) {
    const media_matches = window.matchMedia('(min-resolution:144dpi), (-webkit-min-device-pixel-ratio: 1.5)');
    retina = media_matches && media_matches.matches;
}

// Touch support - using modern pointer events when available
export const pointer = window && window.PointerEvent && navigator.maxTouchPoints > 0
export const touch = window && (pointer || 'ontouchstart' in window || (window.DocumentTouch && document instanceof window.DocumentTouch))

/**
 * Determine device orientation based on viewport dimensions
 * @returns {string} "portrait" or "landscape"
 */
export function orientation() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    return w > h ? "landscape" : "portrait";
}