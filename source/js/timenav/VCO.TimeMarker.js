/*	VCO.TimeMarker
	
================================================== */

VCO.TimeMarker = VCO.Class.extend({
	
	includes: [VCO.Events, VCO.DomMixins],
	
	_el: {},
	
	/*	Constructor
	================================================== */
	initialize: function(data, options, title_slide) {
		
		// DOM Elements
		this._el = {
			container: {},
			content_container: {},
			content: {}
		};
	
		// Components
		this._media 		= null;
		this._mediaclass	= {};
		this._text			= {};
	
		// State
		this._state = {
			loaded: 		false
		};
		
		
		// Data
		this.data = {
			uniqueid: 			"",
			background: 		null,
			date: {
				year:			0,
				month:			0,
				day: 			0,
				hour: 			0,
				minute: 		0,
				second: 		0,
				millisecond: 	0,
				format: 		""
			},
			text: {
				headline: 		"",
				text: 			""
			},
			media: 				null
		};
	
		// Options
		this.options = {
			duration: 			1000,
			ease: 				VCO.Ease.easeInSpline,
			width: 				600,
			height: 			600
		};
		
		// Actively Displaying
		this.active = false;
		
		// Animation Object
		this.animator = {};
		
		// Merge Data and Options
		VCO.Util.mergeData(this.options, options);
		VCO.Util.mergeData(this.data, data);
		
		this._initLayout();
		this._initEvents();
		
		
	},
	
	/*	Adding, Hiding, Showing etc
	================================================== */
	show: function() {
		trace("show");
		/*
		this.animator = VCO.Animate(this._el.slider_container, {
			left: 		-(this._el.container.offsetWidth * n) + "px",
			duration: 	this.options.duration,
			easing: 	this.options.ease
		});
		*/
	},
	
	hide: function() {
		
	},
	
	setActive: function(is_active) {
		this.active = is_active;
		
		if (this.active) {
			this.loadMedia();
		} else {
			this.stopMedia();
		}
	},
	
	addTo: function(container) {
		container.appendChild(this._el.container);
	},
	
	removeFrom: function(container) {
		container.removeChild(this._el.container);
	},
	
	updateDisplay: function(w, h) {
		this._updateDisplay(w, h);
	},
	
	loadMedia: function() {
		
		if (this._media && !this._state.loaded) {
			this._media.loadMedia();
			this._state.loaded = true;
		}
	},
	
	stopMedia: function() {
		if (this._media && this._state.loaded) {
			this._media.stopMedia();
		}
	},
	
	/*	Events
	================================================== */

	
	/*	Private Methods
	================================================== */
	_initLayout: function () {
		
		// Create Layout
		this._el.container 				= VCO.Dom.create("div", "vco-timemarker");
		if (this.data.uniqueid) {
			this._el.container.id 		= this.data.uniqueid;
		}
		
		this._el.content_container		= VCO.Dom.create("div", "vco-timemarker-content-container", this._el.container);
		this._el.content				= VCO.Dom.create("div", "vco-timemarker-content", this._el.content_container);
		
		this._text						= VCO.Dom.create("h2", "vco-headline", this._el.content);
		this._text.innerHTML			= this.data.text.headline;
		
		//this._text.addTo(this._el.content);
		
		/*
		
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
			this.data.media.mediatype 	= VCO.MediaType(this.data.media);
			this.options.media_name 	= this.data.media.mediatype.name;
			this.options.media_type 	= this.data.media.mediatype.type;
			
			// Create a media object using the matched class name
			this._media = new this.data.media.mediatype.cls(this.data.media, this.options);
			
		}
		
		// Create Text
		if (this.has.text || this.has.headline) {
			this._text = new VCO.Media.Text(this.data.text, {title:this.has.title});
		}
		
		// Add to DOM
		if (!this.has.text && !this.has.headline && this.has.media) {
			this._el.container.className += ' vco-slide-media-only';
			this._media.addTo(this._el.content);
		} else if (this.has.headline && this.has.media && !this.has.text) {
			this._el.container.className += ' vco-slide-media-only';
			this._text.addTo(this._el.content);
			this._media.addTo(this._el.content);
		} else if (this.has.text && this.has.media) {
			this._media.addTo(this._el.content);
			this._text.addTo(this._el.content);
		} else if (this.has.text || this.has.headline) {
			this._el.container.className += ' vco-slide-text-only';
			this._text.addTo(this._el.content);
		}
		*/
		// Fire event that the slide is loaded
		this.onLoaded();
		
	},
	
	_initEvents: function() {
		
	},
	
	// Update Display
	_updateDisplay: function(width, height, layout) {
		
		if (width) {
			this.options.width 					= width;
		} 

		if (height) {
			this.options.height = height;
		}
		
	}
	
});
