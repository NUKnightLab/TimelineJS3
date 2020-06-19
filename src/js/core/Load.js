/*	Load
  Loads External Javascript and CSS
  Adapted from LazyLoad and adjusted from earlier TimelineJS to
  not add an extra layer.  Seems like we could simplify
  this, but leaving in in case users need support for older browsers.
  ================================================== */

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

*/
class Loader {

    constructor(document) {
        this.doc = document
        this.pending = {}
        this.queue = { css: [], js: [] };
        this.styleSheets = document.styleSheets
        this.env = this.getEnv()
        this.head = this.doc.head || this.doc.getElementsByTagName('head')[0];
        this.pollCount = 0

    }



    // -- Private Methods --------------------------------------------------------

    /**
    Creates and returns an HTML element with the specified name and attributes.

    @method createNode
    @param {String} name element name
    @param {Object} attrs name/value mapping of element attributes
    @return {HTMLElement}
    @private
    */
    createNode(name, attrs) {
        var node = this.doc.createElement(name),
            attr;

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
    finish(type) {
        var p = this.pending[type],
            callback,
            urls;

        if (p) {
            callback = p.callback;
            urls = p.urls;

            urls.shift();
            this.pollCount = 0;

            // If this is the last of the pending URLs, execute the callback and
            // start the next request in the queue (if any).
            if (!urls.length) {
                callback && callback.call(p.context, p.obj);
                this.pending[type] = null;
                this.queue[type].length && this.load(type);
            }
        }
    }

    /**
    Populates the <code>env</code> variable with user agent and feature test
    information.

    @method getEnv
    @private
    */
    getEnv() {
        var ua = navigator.userAgent;

        var env = {
            // True if this browser supports disabling async mode on dynamically
            // created script nodes. See
            // http://wiki.whatwg.org/wiki/Dynamic_Script_Execution_Order
            async: this.doc.createElement('script').async === true
        };

        (env.webkit = /AppleWebKit\//.test(ua)) ||
        (env.ie = /MSIE/.test(ua)) ||
        (env.opera = /Opera/.test(ua)) ||
        (env.gecko = /Gecko\//.test(ua)) ||
        (env.unknown = true);

        return env;
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
    load(type, urls, callback, obj, context) {
        var _finish = function() { this.finish(type); }.bind(this),
            isCSS = type === 'css',
            nodes = [],
            i, len, node, p, pendingUrls, url;



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
            if (isCSS || this.env.async || this.env.gecko || this.env.opera) {
                // Load in parallel.
                this.queue[type].push({
                    urls: urls,
                    callback: callback,
                    obj: obj,
                    context: context
                });
            } else {
                // Load sequentially.
                for (i = 0, len = urls.length; i < len; ++i) {
                    this.queue[type].push({
                        urls: [urls[i]],
                        callback: i === len - 1 ? callback : null, // callback is only added to the last URL
                        obj: obj,
                        context: context
                    });
                }
            }
        }

        // If a previous load request of this type is currently in progress, we'll
        // wait our turn. Otherwise, grab the next item in the queue.
        if (this.pending[type] || !(p = this.pending[type] = this.queue[type].shift())) {
            return;
        }


        pendingUrls = p.urls;

        for (i = 0, len = pendingUrls.length; i < len; ++i) {
            url = pendingUrls[i];

            if (isCSS) {
                node = this.env.gecko ? this.createNode('style') : this.createNode('link', {
                    href: url,
                    rel: 'stylesheet'
                });
            } else {
                node = this.createNode('script', { src: url });
                node.async = false;
            }

            node.className = 'lazyload';
            node.setAttribute('charset', 'utf-8');

            if (this.env.ie && !isCSS) {
                node.onreadystatechange = function() {
                    if (/loaded|complete/.test(node.readyState)) {
                        node.onreadystatechange = null;
                        _finish();
                    }
                };
            } else if (isCSS && (this.env.gecko || this.env.webkit)) {
                // Gecko and WebKit don't support the onload event on link nodes.
                if (this.env.webkit) {
                    // In WebKit, we can poll for changes to document.styleSheets to
                    // figure out when stylesheets have loaded.
                    p.urls[i] = node.href; // resolve relative URLs (or polling won't work)
                    this.pollWebKit();
                } else {
                    // In Gecko, we can import the requested URL into a <style> node and
                    // poll for the existence of node.sheet.cssRules. Props to Zach
                    // Leatherman for calling my attention to this technique.
                    node.innerHTML = '@import "' + url + '";';
                    this.pollGecko(node);
                }
            } else {
                node.onload = node.onerror = _finish;
            }

            nodes.push(node);
        }

        for (i = 0, len = nodes.length; i < len; ++i) {
            this.head.appendChild(nodes[i]);
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
    pollGecko(node) {
        var hasRules;

        try {
            // We don't really need to store this value or ever refer to it again, but
            // if we don't store it, Closure Compiler assumes the code is useless and
            // removes it.
            hasRules = !!node.sheet.cssRules;
        } catch (ex) {
            // An exception means the stylesheet is still loading.
            this.pollCount += 1;

            if (this.pollCount < 200) {
                var self = this;
                setTimeout(function() { self.pollGecko(node); }, 50);
            } else {
                // We've been polling for 10 seconds and nothing's happened. Stop
                // polling and finish the pending requests to avoid blocking further
                // requests.
                hasRules && this.finish('css');
            }

            return;
        }

        // If we get here, the stylesheet has loaded.
        this.finish('css');
    }

    /**
    Begins polling to determine when pending stylesheets have finished loading
    in WebKit. Polling stops when all pending stylesheets have loaded or after 10
    seconds (to prevent stalls).

    @method pollWebKit
    @private
    */
    pollWebKit() {
        var css = this.pending.css,
            i;

        if (css) {
            i = this.styleSheets.length;

            // Look for a stylesheet matching the pending URL.
            while (--i >= 0) {
                if (this.styleSheets[i].href === css.urls[0]) {
                    this.finish('css');
                    break;
                }
            }

            this.pollCount += 1;

            if (css) {
                if (this.pollCount < 200) {
                    setTimeout(this.pollWebKit.bind(this), 50);
                } else {
                    // We've been polling for 10 seconds and nothing's happened, which may
                    // indicate that the stylesheet has been removed from the document
                    // before it had a chance to load. Stop polling and finish the pending
                    // request to prevent blocking further requests.
                    this.finish('css');
                }
            }
        }
    }

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
    css(urls, callback, obj, context) {
        this.load('css', urls, callback, obj, context);
    }

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
    js(urls, callback, obj, context) {
        this.load('js', urls, callback, obj, context);
    }
}

function loadJS(urls, callback, obj, context) {
    loader.js(urls, callback, obj, context)
}

function loadCSS(urls, callback, obj, context) {
    loader.css(urls, callback, obj, context)
}


// this seems fragile but not sure how else to inject the document
// besides 
let loader = new Loader(document)

export { loadJS, loadCSS }