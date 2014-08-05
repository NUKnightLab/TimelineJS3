/*	VCO.TimeMarker
	
================================================== */

VCO.TimeMarker = VCO.Class.extend({
	
	includes: [VCO.Events, VCO.DomMixins],
	
	_el: {},
	
	/*	Constructor
	================================================== */
	initialize: function(data, options) {
		
		// DOM Elements
		this._el = {
			container: {},
			content_container: {},
			content: {},
			text: {},
			media: {},
		};
	
		// Components
		this._text			= {};
	
		// State
		this._state = {
			loaded: 		false
		};
		
		
		// Data
		this.data = {
			uniqueid: 			"",
			marker_number: 		0,
			background: 		null,
			date: {
				year:			0,
				month:			0,
				day: 			0,
				hour: 			0,
				minute: 		0,
				second: 		0,
				millisecond: 	0,
				thumbnail: 		"",
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
			this._el.container.className = 'vco-timemarker vco-timemarker-active';
		} else {
			this._el.container.className = 'vco-timemarker';
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
	
	getLeft: function() {
		return this._el.container.style.left.slice(0, -2);
	},
	
	/*	Events
	================================================== */
	_onMarkerClick: function(e) {
		this.fire("markerclick", {marker_number: this.data.marker_number, uniqueid:this.data.uniqueid});
	},
	
	/*	Private Methods
	================================================== */
	_initLayout: function () {
		
		// Create Layout
		this._el.container 				= VCO.Dom.create("div", "vco-timemarker");
		if (this.data.uniqueid) {
			this._el.container.id 		= this.data.uniqueid + "-marker";
		}
		
		this._el.content_container		= VCO.Dom.create("div", "vco-timemarker-content-container", this._el.container);
		this._el.content				= VCO.Dom.create("div", "vco-timemarker-content", this._el.content_container);
		this._el.text					= VCO.Dom.create("div", "vco-timemarker-text", this._el.content);
		
		// Thumbnail
		if (this.data.media.thumb && this.data.media.thumb != "") {
			this._el.media				= VCO.Dom.create("img", "vco-timemarker-media", this._el.content);
			this._el.media.src			= this.data.media.thumb;
		}
		
		// Text
		this._text						= VCO.Dom.create("h2", "vco-headline", this._el.text);
		if (this.data.text.headline && this.data.text.headline != "") {
			this._text.innerHTML			= this.data.text.headline;
		} else if (this.data.text.text && this.data.text.text != "") {
			this._text.innerHTML			= this.data.text.text;
		} else if (this.data.media.caption && this.data.media.caption != "") {
			this._text.innerHTML			= this.data.media.caption;
		}

		
		
		// Fire event that the slide is loaded
		this.onLoaded();
		
	},
	
	_initEvents: function() {
		VCO.DomEvent.addListener(this._el.container, 'click', this._onMarkerClick, this);
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
