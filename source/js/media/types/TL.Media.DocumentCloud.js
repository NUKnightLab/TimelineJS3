/*	TL.Media.DocumentCloud
================================================== */

TL.Media.DocumentCloud = TL.Media.extend({

	includes: [TL.Events],

	/*	Load the media
	================================================== */
	_loadMedia: function() {
		var self = this;

		// Create Dom elements
		this._el.content_item	= TL.Dom.create("div", "tl-media-item tl-media-documentcloud tl-media-shadow", this._el.content);
        this._el.content_item.setAttribute("style", "min-width:300px; z-index:-1;");
		this._el.content_item.id = TL.Util.unique_ID(7)

		// Check url
		if(this.data.url.match(/\.html$/)) {
		    this.data.url = this._transformURL(this.data.url);
		} else if(!(this.data.url.match(/.(json|js)$/))) {
		    trace("DOCUMENT CLOUD IN URL BUT INVALID SUFFIX");
		}

		// Load viewer API
        TL.Load.js([
					'https://assets.documentcloud.org/viewer/loader.js',
					'https://assets.documentcloud.org/viewer/viewer.js'],
            function() {	
	            self.createMedia();
			}
		);
	},

	// Viewer API needs js, not html
	_transformURL: function(url) {
        return url.replace(/(.*)\.html$/, '$1.js')
	},

	// Update Media Display
	_updateMediaDisplay: function() {
        if(TL.Browser.mobile && (this.options.width <= this.options.medium_size && this.options.width >= this.options.skinny_size)) {
            this._media.updateDisplay(this.options.width, this.options.height, layout);
		} else if (this.options.width <= this.options.medium_size && this.options.width >= this.options.skinny_size) {
			this._media.updateDisplay(this.options.width-100, this.options.height, layout);
		} 
        
        this._el.content_item.style.height = this.options.height + "px";
		//this._el.content_item.style.width = this.options.width + "px";
	},

	createMedia: function() {
		// DocumentCloud API call
		DV.load(this.data.url, {
		    container: '#'+this._el.content_item.id,
		    showSidebar: false,
            responsive: true
        });
		this.onLoaded();
	},



	/*	Events
	================================================== */



});
