/*	TL.Media
	Main media template for media assets.
	Takes a data object and populates a dom object
================================================== */
// TODO add link

TL.Media = TL.Class.extend({

	includes: [TL.Events, TL.I18NMixins],

	_el: {},

	/*	Constructor
	================================================== */
	initialize: function(data, options, add_to_container) {
		// DOM ELEMENTS
		this._el = {
			container: {},
			content_container: {},
			content: {},
			content_item: {},
			content_link: {},
			caption: null,
			credit: null,
			parent: {},
			link: null
		};

		// Player (If Needed)
		this.player = null;

		// Timer (If Needed)
		this.timer = null;
		this.load_timer = null;

		// Message
		this.message = null;

		// Media ID
		this.media_id = null;

		// State
		this._state = {
			loaded: false,
			show_meta: false,
			media_loaded: false
		};

		// Data
		this.data = {
			unique_id: 			null,
			url: 				null,
			credit:				null,
			caption:			null,
			credit_alternate: 	null,
			caption_alternate: 	null,
			link: 				null,
			link_target: 		null
		};

		//Options
		this.options = {
			api_key_flickr: 		"f2cc870b4d233dd0a5bfe73fd0d64ef0",
			api_key_googlemaps: 	"AIzaSyB9dW8e_iRrATFa8g24qB6BDBGdkrLDZYI",
			api_key_embedly: 		"", // ae2da610d1454b66abdf2e6a4c44026d
			credit_height: 			0,
			caption_height: 		0,
			background:             0   // is background media (for slide)
		};

		this.animator = {};

		// Merge Data and Options
		TL.Util.mergeData(this.options, options);
		TL.Util.mergeData(this.data, data);

        // Don't create DOM elements if this is background media
        if(!this.options.background) {
            this._el.container = TL.Dom.create("div", "tl-media");

            if (this.data.unique_id) {
                this._el.container.id = this.data.unique_id;
            }

            this._initLayout();

            if (add_to_container) {
                add_to_container.appendChild(this._el.container);
                this._el.parent = add_to_container;
            }
        }
	},

	loadMedia: function() {
		var self = this;

		if (!this._state.loaded) {
			try {
				this.load_timer = setTimeout(function() {
		            self.loadingMessage();
					self._loadMedia();
					// self._state.loaded = true; handled in onLoaded()
					self._updateDisplay();
				}, 1200);
			} catch (e) {
				trace("Error loading media for ", this._media);
				trace(e);
			}
		}
	},

    _updateMessage: function(msg) {
        if(this.message) {
            this.message.updateMessage(msg);
        }    
    },
    
	loadingMessage: function() {
	    this._updateMessage(this._('loading') + " " + this.options.media_name);
	},

	errorMessage: function(msg) {
		if (msg) {
			msg = this._('error') + ": " + msg;
		} else {
			msg = this._('error');
		}
		this._updateMessage(msg);
	},

	updateMediaDisplay: function(layout) {
		if (this._state.loaded && !this.options.background) {

			if (TL.Browser.mobile) {
				this._el.content_item.style.maxHeight = (this.options.height/2) + "px";
			} else {
				this._el.content_item.style.maxHeight = this.options.height - this.options.credit_height - this.options.caption_height - 30 + "px";
			}

			//this._el.content_item.style.maxWidth = this.options.width + "px";
			this._el.container.style.maxWidth = this.options.width + "px";
			// Fix for max-width issues in Firefox
			if (TL.Browser.firefox) {
				if (this._el.content_item.offsetWidth > this._el.content_item.offsetHeight) {
					//this._el.content_item.style.width = "100%";
				}
			}

			this._updateMediaDisplay(layout);

			if (this._state.media_loaded) {
				if (this._el.credit) {
					this._el.credit.style.width		= this._el.content_item.offsetWidth + "px";
				}
				if (this._el.caption) {
					this._el.caption.style.width		= this._el.content_item.offsetWidth + "px";
				}
			}

		}
	},

	/*	Media Specific
	================================================== */
    _loadMedia: function() {        
        // All overrides must call this.onLoaded() to set state
        this.onLoaded();
    },

    _updateMediaDisplay: function(l) {
        //this._el.content_item.style.maxHeight = (this.options.height - this.options.credit_height - this.options.caption_height - 16) + "px";
        if(TL.Browser.firefox) {
            this._el.content_item.style.maxWidth = this.options.width + "px";
            this._el.content_item.style.width = "auto";
        }
    },

    _getMeta: function() {

    },

    _getImageURL: function(w, h) {
        // Image-based media types should return <img>-compatible src url
        return "";
    },
    
	/*	Public
	================================================== */
	show: function() {

	},

	hide: function() {

	},

	addTo: function(container) {
		container.appendChild(this._el.container);
		this.onAdd();
	},

	removeFrom: function(container) {
		container.removeChild(this._el.container);
		this.onRemove();
	},

    getImageURL: function(w, h) {
        return this._getImageURL(w, h);
    },
    
	// Update Display
	updateDisplay: function(w, h, l) {
		this._updateDisplay(w, h, l);
	},

	stopMedia: function() {
		this._stopMedia();
	},

	loadErrorDisplay: function(message) {
		try {
			this._el.content.removeChild(this._el.content_item);
		} catch(e) {
			// if this._el.content_item isn't a child of this._el then just keep truckin
		}
		this._el.content_item	= TL.Dom.create("div", "tl-media-item tl-media-loaderror", this._el.content);
		this._el.content_item.innerHTML = "<div class='tl-icon-" + this.options.media_type + "'></div><p>" + message + "</p>";

		// After Loaded
		this.onLoaded(true);
	},

	/*	Events
	================================================== */
	onLoaded: function(error) {
		this._state.loaded = true;
		this.fire("loaded", this.data);
		if (this.message) {
			this.message.hide();
		}
		if (!(error || this.options.background)) {
			this.showMeta();
		}
		this.updateDisplay();
	},

	onMediaLoaded: function(e) {
		this._state.media_loaded = true;
		this.fire("media_loaded", this.data);
		if (this._el.credit) {
			this._el.credit.style.width		= this._el.content_item.offsetWidth + "px";
		}
		if (this._el.caption) {
			this._el.caption.style.width		= this._el.content_item.offsetWidth + "px";
		}
	},

	showMeta: function(credit, caption) {
		this._state.show_meta = true;
		// Credit
		if (this.data.credit && this.data.credit != "") {
			this._el.credit					= TL.Dom.create("div", "tl-credit", this._el.content_container);
			this._el.credit.innerHTML		= this.options.autolink == true ? TL.Util.linkify(this.data.credit) : this.data.credit;
			this.options.credit_height 		= this._el.credit.offsetHeight;
		}

		// Caption
		if (this.data.caption && this.data.caption != "") {
			this._el.caption				= TL.Dom.create("div", "tl-caption", this._el.content_container);
			this._el.caption.innerHTML		= this.options.autolink == true ? TL.Util.linkify(this.data.caption) : this.data.caption;
			this.options.caption_height 	= this._el.caption.offsetHeight;
		}

		if (!this.data.caption || !this.data.credit) {
			this.getMeta();
		}

	},

	getMeta: function() {
		this._getMeta();
	},

	updateMeta: function() {
		if (!this.data.credit && this.data.credit_alternate) {
			this._el.credit					= TL.Dom.create("div", "tl-credit", this._el.content_container);
			this._el.credit.innerHTML		= this.data.credit_alternate;
			this.options.credit_height 		= this._el.credit.offsetHeight;
		}

		if (!this.data.caption && this.data.caption_alternate) {
			this._el.caption				= TL.Dom.create("div", "tl-caption", this._el.content_container);
			this._el.caption.innerHTML		= this.data.caption_alternate;
			this.options.caption_height 	= this._el.caption.offsetHeight;
		}

		this.updateDisplay();
	},

	onAdd: function() {
		this.fire("added", this.data);
	},

	onRemove: function() {
		this.fire("removed", this.data);
	},

	/*	Private Methods
	================================================== */
	_initLayout: function () {

		// Message
		this.message = new TL.Message({}, this.options);
		this.message.addTo(this._el.container);

		// Create Layout
		this._el.content_container = TL.Dom.create("div", "tl-media-content-container", this._el.container);

		// Link
		if (this.data.link && this.data.link != "") {

			this._el.link = TL.Dom.create("a", "tl-media-link", this._el.content_container);
			this._el.link.href = this.data.link;
			if (this.data.link_target && this.data.link_target != "") {
				this._el.link.target = this.data.link_target;
			} else {
				this._el.link.target = "_blank";
			}

			this._el.content = TL.Dom.create("div", "tl-media-content", this._el.link);

		} else {
			this._el.content = TL.Dom.create("div", "tl-media-content", this._el.content_container);
		}


	},

	// Update Display
	_updateDisplay: function(w, h, l) {
		if (w) {
			this.options.width = w;

		}
		//this._el.container.style.width = this.options.width + "px";
		if (h) {
			this.options.height = h;
		}

		if (l) {
			this.options.layout = l;
		}

		if (this._el.credit) {
			this.options.credit_height 		= this._el.credit.offsetHeight;
		}
		if (this._el.caption) {
			this.options.caption_height 	= this._el.caption.offsetHeight + 5;
		}

		this.updateMediaDisplay(this.options.layout);

	},

	_stopMedia: function() {

	}

});
