/*	TL.TimeMarker

================================================== */

TL.TimeMarker = TL.Class.extend({

	includes: [TL.Events, TL.DomMixins],

	_el: {},

	/*	Constructor
	================================================== */
	initialize: function(data, options) {

		// DOM Elements
		this._el = {
			container: {},
			content_container: {},
			media_container: {},
			timespan: {},
			line_left: {},
			line_right: {},
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
			unique_id: 			"",
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
			ease: 				TL.Ease.easeInSpline,
			width: 				600,
			height: 			600,
			marker_width_min: 	100 			// Minimum Marker Width
		};

		// Actively Displaying
		this.active = false;

		// Animation Object
		this.animator = {};

		// End date
		this.has_end_date = false;

		// Merge Data and Options
		TL.Util.mergeData(this.options, options);
		TL.Util.mergeData(this.data, data);

		this._initLayout();
		this._initEvents();


	},

	/*	Adding, Hiding, Showing etc
	================================================== */
	show: function() {

	},

	hide: function() {

	},

	setActive: function(is_active) {
		this.active = is_active;

		if (this.active && this.has_end_date) {
			this._el.container.className = 'tl-timemarker tl-timemarker-with-end tl-timemarker-active';
		} else if (this.active){
			this._el.container.className = 'tl-timemarker tl-timemarker-active';
		} else if (this.has_end_date){
			this._el.container.className = 'tl-timemarker tl-timemarker-with-end';
		} else {
			this._el.container.className = 'tl-timemarker';
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

	getTime: function() { // TODO does this need to know about the end date?
		return this.data.start_date.getTime();
	},

	getEndTime: function() {

		if (this.data.end_date) {
			return this.data.end_date.getTime();
		} else {
			return false;
		}
	},

	setHeight: function(h) {
		var text_line_height = 12,
			text_lines = 1;

		this._el.content_container.style.height = h  + "px";
		this._el.timespan_content.style.height = h + "px";
		// Handle Line height for better display of text
		if (h <= 30) {
			this._el.content.className = "tl-timemarker-content tl-timemarker-content-small";
		} else {
			this._el.content.className = "tl-timemarker-content";
		}

		if (h <= 56) {
			TL.DomUtil.addClass(this._el.content_container, "tl-timemarker-content-container-small");
		} else {
			TL.DomUtil.removeClass(this._el.content_container, "tl-timemarker-content-container-small");
		}

		// Handle number of lines visible vertically

		if (TL.Browser.webkit) {
			text_lines = Math.floor(h / (text_line_height + 2));
			if (text_lines < 1) {
				text_lines = 1;
			}
			this._text.className = "tl-headline";
			this._text.style.webkitLineClamp = text_lines;
		} else {
			text_lines = h / text_line_height;
			if (text_lines > 1) {
				this._text.className = "tl-headline tl-headline-fadeout";
			} else {
				this._text.className = "tl-headline";
			}
			this._text.style.height = (text_lines * text_line_height)  + "px";
		}

	},

	setWidth: function(w) {
		if (this.data.end_date) {
			this._el.container.style.width = w + "px";

			if (w > this.options.marker_width_min) {
				this._el.content_container.style.width = w + "px";
				this._el.content_container.className = "tl-timemarker-content-container tl-timemarker-content-container-long";
			} else {
				this._el.content_container.style.width = this.options.marker_width_min + "px";
				this._el.content_container.className = "tl-timemarker-content-container";
			}
		}

	},

	setClass: function(n) {
		this._el.container.className = n;
	},

	setRowPosition: function(n, remainder) {
		this.setPosition({top:n});
		this._el.timespan.style.height = remainder + "px";

		if (remainder < 56) {
			//TL.DomUtil.removeClass(this._el.content_container, "tl-timemarker-content-container-small");
		}
	},

	/*	Events
	================================================== */
	_onMarkerClick: function(e) {
		this.fire("markerclick", {unique_id:this.data.unique_id});
	},

	/*	Private Methods
	================================================== */
	_initLayout: function () {
		//trace(this.data)
		// Create Layout
		this._el.container 				= TL.Dom.create("div", "tl-timemarker");
		if (this.data.unique_id) {
			this._el.container.id 		= this.data.unique_id + "-marker";
		}

		if (this.data.end_date) {
			this.has_end_date = true;
			this._el.container.className = 'tl-timemarker tl-timemarker-with-end';
		}

		this._el.timespan				= TL.Dom.create("div", "tl-timemarker-timespan", this._el.container);
		this._el.timespan_content		= TL.Dom.create("div", "tl-timemarker-timespan-content", this._el.timespan);
		this._el.content_container		= TL.Dom.create("div", "tl-timemarker-content-container", this._el.container);

		this._el.content				= TL.Dom.create("div", "tl-timemarker-content", this._el.content_container);

		this._el.line_left				= TL.Dom.create("div", "tl-timemarker-line-left", this._el.timespan);
		this._el.line_right				= TL.Dom.create("div", "tl-timemarker-line-right", this._el.timespan);

		// Thumbnail or Icon
		if (this.data.media) {
			this._el.media_container	= TL.Dom.create("div", "tl-timemarker-media-container", this._el.content);

			if (this.data.media.thumbnail && this.data.media.thumbnail != "") {
				this._el.media				= TL.Dom.create("img", "tl-timemarker-media", this._el.media_container);
				this._el.media.src			= TL.Util.transformImageURL(this.data.media.thumbnail);

			} else {
				var media_type = TL.MediaType(this.data.media).type;
				this._el.media				= TL.Dom.create("span", "tl-icon-" + media_type, this._el.media_container);

			}

		}


		// Text
		this._el.text					= TL.Dom.create("div", "tl-timemarker-text", this._el.content);
		this._text						= TL.Dom.create("h2", "tl-headline", this._el.text);
		if (this.data.text.headline && this.data.text.headline != "") {
			this._text.innerHTML		= TL.Util.unlinkify(this.data.text.headline);
		} else if (this.data.text.text && this.data.text.text != "") {
			this._text.innerHTML		= TL.Util.unlinkify(this.data.text.text);
		} else if (this.data.media.caption && this.data.media.caption != "") {
			this._text.innerHTML		= TL.Util.unlinkify(this.data.media.caption);
		}



		// Fire event that the slide is loaded
		this.onLoaded();

	},

	_initEvents: function() {
		TL.DomEvent.addListener(this._el.container, 'click', this._onMarkerClick, this);
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
