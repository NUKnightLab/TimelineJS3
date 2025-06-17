/**
 * Modern Network Utilities
 * Replaces the custom Zepto AJAX implementation with modern fetch API
 * Provides backward compatibility for existing code
 */

/**
 * Modern fetch-based implementations
 */
export const fetchJSON = async (url, options = {}) => {
    const response = await fetch(url, {
        headers: {
            'Accept': 'application/json',
            ...options.headers
        },
        ...options
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
};

export const fetchText = async (url, options = {}) => {
    const response = await fetch(url, options);
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.text();
};

/**
 * Legacy compatibility functions for gradual migration
 * These maintain the same API as the original Zepto functions
 */
export const getJSON = (url, callback) => {
    if (typeof callback === 'function') {
        // Callback-based usage (legacy)
        fetchJSON(url)
            .then(data => callback(data))
            .catch(error => {
                console.error('Error fetching JSON:', error);
                if (callback) callback(null, error);
            });
    } else {
        // Promise-based usage (modern)
        return fetchJSON(url);
    }
};

export const ajax = (options) => {
    const {
        url,
        type = 'GET',
        method = type, // Support both 'type' and 'method'
        data,
        success,
        error,
        dataType = 'json',
        headers = {},
        timeout = 0
    } = options;

    const fetchOptions = {
        method: method.toUpperCase(),
        headers: {
            'Accept': dataType === 'json' ? 'application/json' : 'text/plain',
            ...headers
        }
    };

    // Handle request body
    if (data && (method.toUpperCase() === 'POST' || method.toUpperCase() === 'PUT')) {
        if (typeof data === 'string') {
            fetchOptions.body = data;
        } else if (data instanceof FormData) {
            fetchOptions.body = data;
            // Don't set Content-Type for FormData, let browser set it
        } else {
            fetchOptions.body = JSON.stringify(data);
            fetchOptions.headers['Content-Type'] = 'application/json';
        }
    }

    // Create abort controller for timeout
    const controller = new AbortController();
    fetchOptions.signal = controller.signal;

    let timeoutId;
    if (timeout > 0) {
        timeoutId = setTimeout(() => {
            controller.abort();
        }, timeout);
    }

    const fetchPromise = fetch(url, fetchOptions)
        .then(response => {
            if (timeoutId) clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Parse response based on dataType
            if (dataType === 'json') {
                return response.json();
            } else if (dataType === 'text' || dataType === 'html') {
                return response.text();
            } else if (dataType === 'xml') {
                return response.text().then(text => {
                    const parser = new DOMParser();
                    return parser.parseFromString(text, 'text/xml');
                });
            } else {
                return response;
            }
        })
        .then(data => {
            if (success) success(data);
            return data;
        })
        .catch(err => {
            if (timeoutId) clearTimeout(timeoutId);
            
            if (err.name === 'AbortError') {
                err.message = 'Request timeout';
            }
            
            if (error) {
                error(err);
            } else {
                console.error('AJAX error:', err);
            }
            throw err;
        });

    return fetchPromise;
};

/**
 * Utility functions for backward compatibility
 */
export const get = (url, data, success, dataType) => {
    if (typeof data === 'function') {
        dataType = success;
        success = data;
        data = undefined;
    }
    
    return ajax({
        url,
        method: 'GET',
        data,
        success,
        dataType
    });
};

export const post = (url, data, success, dataType) => {
    return ajax({
        url,
        method: 'POST',
        data,
        success,
        dataType
    });
};

/**
 * JSON parsing utilities
 */
export const parseJSON = (str) => {
    try {
        return JSON.parse(str);
    } catch (e) {
        throw new Error(`Invalid JSON: ${e.message}`);
    }
};

/**
 * URL parameter serialization
 */
export const param = (obj) => {
    const params = new URLSearchParams();
    
    for (const [key, value] of Object.entries(obj)) {
        if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v));
        } else if (value !== null && value !== undefined) {
            params.append(key, value);
        }
    }
    
    return params.toString();
};

// Export all functions for easy migration
export default {
    fetchJSON,
    fetchText,
    getJSON,
    ajax,
    get,
    post,
    parseJSON,
    param
};
