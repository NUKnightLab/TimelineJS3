/*	TL.Slide
	Creates a slide. Takes a data object and
	populates the slide with content.
================================================== */

TL.Slide = TL.Class.extend({

	includes: [TL.Events, TL.DomMixins, TL.I18NMixins],

	_el: {},

	/*	Constructor
	================================================== */
	initialize: function(data, options, title_slide) {
		// DOM Elements
		this._el = {
			container: {},
			scroll_container: {},
			background: {},
			content_container: {},
			content: {}
		};

		// Components
		this._media 		= null;
		this._mediaclass	= {};
		this._text			= {};
		this._background_media = null;

		// State
		this._state = {
			loaded: 		false
		};

		this.has = {
			headline: 	false,
			text: 		false,
			media: 		false,
			title: 		false,
			background: {
				image: false,
				color: false,
				color_value :""
			}
		}

		this.has.title = title_slide;

		// Data
		this.data = {
			unique_id: 				null,
			background: 			null,
			start_date: 			null,
			end_date: 				null,
			location: 				null,
			text: 					null,
			media: 					null,
            autolink: true
		};

		// Options
		this.options = {
			// animation
			duration: 			1000,
			slide_padding_lr: 	40,
			ease: 				TL.Ease.easeInSpline,
			width: 				600,
			height: 			600,
			skinny_size: 		650,
			media_name: 		""
		};

		// Actively Displaying
		this.active = false;

		// Animation Object
		this.animator = {};

		// Merge Data and Options
		TL.Util.mergeData(this.options, options);
		TL.Util.mergeData(this.data, data);

		this._initLayout();
		this._initEvents();


	},

	/*	Adding, Hiding, Showing etc
	================================================== */
	show: function() {
		this.animator = TL.Animate(this._el.slider_container, {
			left: 		-(this._el.container.offsetWidth * n) + "px",
			duration: 	this.options.duration,
			easing: 	this.options.ease
		});
	},

	hide: function() {

	},

	setActive: function(is_active) {
		this.active = is_active;

		if (this.active) {
			if (this.data.background) {
				this.fire("background_change", this.has.background);
			}
			this.loadMedia();
		} else {
			this.stopMedia();
		}
	},

	addTo: function(container) {
		container.appendChild(this._el.container);
		//this.onAdd();
	},

	removeFrom: function(container) {
		container.removeChild(this._el.container);
	},

	updateDisplay: function(w, h, l) {
		this._updateDisplay(w, h, l);
	},

	loadMedia: function() {
        var self = this;
        
		if (this._media && !this._state.loaded) {
			this._media.loadMedia();
			this._state.loaded = true;
		}
		
		if(this._background_media && !this._background_media._state.loaded) {
		    this._background_media.on("loaded", function() {
		        self._updateBackgroundDisplay();
		    });
		    this._background_media.loadMedia();
		}
	},

	stopMedia: function() {
		if (this._media && this._state.loaded) {
			this._media.stopMedia();
		}
	},

	getBackground: function() {
		return this.has.background;
	},

	scrollToTop: function() {
		this._el.container.scrollTop = 0;
	},

	getFormattedDate: function() {

		if (TL.Util.trim(this.data.display_date).length > 0) {
			return this.data.display_date;
		}
		var date_text = "";

		if(!this.has.title) {
            if (this.data.end_date) {
                date_text = " &mdash; " + this.data.end_date.getDisplayDate(this.getLanguage());
            }
            if (this.data.start_date) {
                date_text = this.data.start_date.getDisplayDate(this.getLanguage()) + date_text;
            }
        }
		return date_text;
	},

	/*	Events
	================================================== */


	/*	Private Methods
	================================================== */
	_initLayout: function () {
		// Create Layout
		this._el.container 				= TL.Dom.create("div", "tl-slide");

		if (this.has.title) {
			this._el.container.className = "tl-slide tl-slide-titleslide";
		}

		if (this.data.unique_id) {
			this._el.container.id 		= this.data.unique_id;
		}
		this._el.scroll_container 		= TL.Dom.create("div", "tl-slide-scrollable-container", this._el.container);
		this._el.content_container		= TL.Dom.create("div", "tl-slide-content-container", this._el.scroll_container);
		this._el.content				= TL.Dom.create("div", "tl-slide-content", this._el.content_container);
		this._el.background				= TL.Dom.create("div", "tl-slide-background", this._el.container);
		// Style Slide Background
		if (this.data.background) {
			if (this.data.background.url) {
			    var media_type = TL.MediaType(this.data.background, true);
			    if(media_type) {
                    this._background_media = new media_type.cls(this.data.background, {background: 1});
                
                    this.has.background.image 					= true;
                    this._el.container.className 				+= ' tl-full-image-background';
                    this.has.background.color_value 			= "#000";
                    this._el.background.style.display 			= "block";
                }
			}
			if (this.data.background.color) {
				this.has.background.color 					= true;
				this._el.container.className 				+= ' tl-full-color-background';
				this.has.background.color_value 			= this.data.background.color;
				//this._el.container.style.backgroundColor = this.data.background.color;
				//this._el.background.style.backgroundColor 	= this.data.background.color;
				//this._el.background.style.display 			= "block";
			}
			if (this.data.background.text_background) {
				this._el.container.className 				+= ' tl-text-background';
			}

		}



		// Determine Assets for layout and loading
		if (this.data.media && this.data.media.url && this.data.media.url != "") {
			this.has.media = true;
		}
		if (this.data.text && this.data.text.text) {
			this.has.text = true;
		}
		if (this.data.text && this.data.text.headline) {
			this.has.headline = true;
		}

		// Create Media
		if (this.has.media) {

			// Determine the media type
			this.data.media.mediatype 	= TL.MediaType(this.data.media);
			this.options.media_name 	= this.data.media.mediatype.name;
			this.options.media_type 	= this.data.media.mediatype.type;
            this.options.autolink = this.data.autolink;

			// Create a media object using the matched class name
			this._media = new this.data.media.mediatype.cls(this.data.media, this.options);

		}

		// Create Text
		if (this.has.text || this.has.headline) {
			this._text = new TL.Media.Text(this.data.text, {title:this.has.title,language: this.options.language, autolink: this.data.autolink });
			this._text.addDateText(this.getFormattedDate());
		}



		// Add to DOM
		if (!this.has.text && !this.has.headline && this.has.media) {
			TL.DomUtil.addClass(this._el.container, 'tl-slide-media-only');
			this._media.addTo(this._el.content);
		} else if (this.has.headline && this.has.media && !this.has.text) {
			TL.DomUtil.addClass(this._el.container, 'tl-slide-media-only');
			this._text.addTo(this._el.content);
			this._media.addTo(this._el.content);
		} else if (this.has.text && this.has.media) {
			this._media.addTo(this._el.content);
			this._text.addTo(this._el.content);
		} else if (this.has.text || this.has.headline) {
			TL.DomUtil.addClass(this._el.container, 'tl-slide-text-only');
			this._text.addTo(this._el.content);
		}

		// Fire event that the slide is loaded
		this.onLoaded();

	},

	_initEvents: function() {

	},

	// Update Display
	_updateDisplay: function(width, height, layout) {
		var content_width,
			content_padding_left = this.options.slide_padding_lr,
			content_padding_right = this.options.slide_padding_lr;

		if (width) {
			this.options.width 					= width;
		} else {
			this.options.width 					= this._el.container.offsetWidth;
		}

		content_width = this.options.width - (this.options.slide_padding_lr * 2);

		if(TL.Browser.mobile && (this.options.width <= this.options.skinny_size)) {
			content_padding_left = 0;
			content_padding_right = 0;
			content_width = this.options.width;
		} else if (layout == "landscape") {

		} else if (this.options.width <= this.options.skinny_size) {
			content_padding_left = 50;
			content_padding_right = 50;
			content_width = this.options.width - content_padding_left - content_padding_right;
		} else {

		}

		this._el.content.style.paddingLeft 	= content_padding_left + "px";
		this._el.content.style.paddingRight = content_padding_right + "px";
		this._el.content.style.width		= content_width + "px";

		if (height) {
			this.options.height = height;
			//this._el.scroll_container.style.height		= this.options.height + "px";

		} else {
			this.options.height = this._el.container.offsetHeight;
		}

		if (this._media) {

			if (!this.has.text && this.has.headline) {
				this._media.updateDisplay(content_width, (this.options.height - this._text.headlineHeight()), layout);
			} else if (!this.has.text && !this.has.headline) {
				this._media.updateDisplay(content_width, this.options.height, layout);
			} else if (this.options.width <= this.options.skinny_size) {
				this._media.updateDisplay(content_width, this.options.height, layout);
			} else {
				this._media.updateDisplay(content_width/2, this.options.height, layout);
			}
		}
		
		this._updateBackgroundDisplay();
	},
	
	_updateBackgroundDisplay: function() {
	    if(this._background_media && this._background_media._state.loaded) {
	        this._el.background.style.backgroundImage 	= "url('" + this._background_media.getImageURL(this.options.width, this.options.height) + "')";
	    }
	}

});
