/*  TimelineJS
Designed and built by Zach Wise at KnightLab

This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at https://mozilla.org/MPL/2.0/.

================================================== */
/*
TODO

*/

/*  Required Files
CodeKit Import
https://incident57.com/codekit/
================================================== */

// CORE
	// @codekit-prepend "core/TL.js";
	// @codekit-prepend "core/TL.Error.js";
	// @codekit-prepend "core/TL.Util.js";
	// @codekit-prepend "data/TL.Data.js";
	// @codekit-prepend "core/TL.Class.js";
	// @codekit-prepend "core/TL.Events.js";
	// @codekit-prepend "core/TL.Browser.js";
	// @codekit-prepend "core/TL.Load.js";
	// @codekit-prepend "core/TL.TimelineConfig.js";
	// @codekit-prepend "core/TL.ConfigFactory.js";


// LANGUAGE
	// @codekit-prepend "language/TL.Language.js";
	// @codekit-prepend "language/TL.I18NMixins.js";

// ANIMATION
	// @codekit-prepend "animation/TL.Ease.js";
	// @codekit-prepend "animation/TL.Animate.js";

// DOM
	// @codekit-prepend "dom/TL.Point.js";
	// @codekit-prepend "dom/TL.DomMixins.js";
	// @codekit-prepend "dom/TL.Dom.js";
	// @codekit-prepend "dom/TL.DomUtil.js";
	// @codekit-prepend "dom/TL.DomEvent.js";
	// @codekit-prepend "dom/TL.StyleSheet.js";

// Date
	// @codekit-prepend "date/TL.Date.js";
	// @codekit-prepend "date/TL.DateUtil.js";

// UI
	// @codekit-prepend "ui/TL.Draggable.js";
	// @codekit-prepend "ui/TL.Swipable.js";
	// @codekit-prepend "ui/TL.MenuBar.js";
	// @codekit-prepend "ui/TL.Message.js";

// MEDIA
	// @codekit-prepend "media/TL.MediaType.js";
	// @codekit-prepend "media/TL.Media.js";

// MEDIA TYPES
	// @codekit-prepend "media/types/TL.Media.Blockquote.js";
	// @codekit-prepend "media/types/TL.Media.DailyMotion.js";
	// @codekit-prepend "media/types/TL.Media.DocumentCloud.js";
	// @codekit-prepend "media/types/TL.Media.Flickr.js";
	// @codekit-prepend "media/types/TL.Media.GoogleDoc.js";
	// @codekit-prepend "media/types/TL.Media.GooglePlus.js";
	// @codekit-prepend "media/types/TL.Media.IFrame.js";
	// @codekit-prepend "media/types/TL.Media.Image.js";
	// @codekit-prepend "media/types/TL.Media.Imgur.js";
	// @codekit-prepend "media/types/TL.Media.Instagram.js";
	// @codekit-prepend "media/types/TL.Media.GoogleMap.js";
	// @codekit-prepend "media/types/TL.Media.PDF.js";
	// @codekit-prepend "media/types/TL.Media.Profile.js";
	// @codekit-prepend "media/types/TL.Media.Slider.js";
	// @codekit-prepend "media/types/TL.Media.SoundCloud.js";
	// @codekit-prepend "media/types/TL.Media.Spotify.js";
	// @codekit-prepend "media/types/TL.Media.Storify.js";
	// @codekit-prepend "media/types/TL.Media.Text.js";
	// @codekit-prepend "media/types/TL.Media.Twitter.js";
	// @codekit-prepend "media/types/TL.Media.TwitterEmbed.js";
	// @codekit-prepend "media/types/TL.Media.Vimeo.js";
	// @codekit-prepend "media/types/TL.Media.Vine.js";
	// @codekit-prepend "media/types/TL.Media.Website.js";
	// @codekit-prepend "media/types/TL.Media.Wikipedia.js";
	// @codekit-prepend "media/types/TL.Media.YouTube.js";

// STORYSLIDER
	// @codekit-prepend "slider/TL.Slide.js";
	// @codekit-prepend "slider/TL.SlideNav.js";
	// @codekit-prepend "slider/TL.StorySlider.js";

// TIMENAV
	// @codekit-prepend "timenav/TL.TimeNav.js";
	// @codekit-prepend "timenav/TL.TimeMarker.js";
	// @codekit-prepend "timenav/TL.TimeEra.js";
	// @codekit-prepend "timenav/TL.TimeGroup.js";
	// @codekit-prepend "timenav/TL.TimeScale.js";
	// @codekit-prepend "timenav/TL.TimeAxis.js";
	// @codekit-prepend "timenav/TL.AxisHelper.js";


TL.Timeline = TL.Class.extend({
	includes: [TL.Events, TL.I18NMixins],

	/*  Private Methods
	================================================== */
	initialize: function (elem, data, options) {
		var self = this;
		if (!options) { options = {}};
		// Version
		this.version = "3.2.6";

		// Ready
		this.ready = false;

		// DOM ELEMENTS
		this._el = {
			container: {},
			storyslider: {},
			timenav: {},
			menubar: {}
		};

		// Determine Container Element
		if (typeof elem === 'object') {
			this._el.container = elem;
		} else {
			this._el.container = TL.Dom.get(elem);
		}

		// Slider
		this._storyslider = {};

		// Style Sheet
		this._style_sheet = new TL.StyleSheet();

		// TimeNav
		this._timenav = {};

		// Menu Bar
		this._menubar = {};

		// Loaded State
		this._loaded = {storyslider:false, timenav:false};

		// Data Object
		this.config = null;

		this.options = {
			script_path: 				"",
			height: 					this._el.container.offsetHeight,
			width: 						this._el.container.offsetWidth,
			debug: 						false,
			is_embed: 					false,
			is_full_embed: 				false,
			hash_bookmark: false,
			default_bg_color: 			{r:255, g:255, b:255},
			scale_factor: 				2,						// How many screen widths wide should the timeline be
			layout: 					"landscape",			// portrait or landscape
			timenav_position: 			"bottom",				// timeline on top or bottom
			optimal_tick_width: 		60,						// optimal distance (in pixels) between ticks on axis
			base_class: 				"tl-timeline", 		// removing tl-timeline will break all default stylesheets...
			timenav_height: 			null,
			timenav_height_percentage: 	25,						// Overrides timenav height as a percentage of the screen
			timenav_mobile_height_percentage: 40, 				// timenav height as a percentage on mobile devices
			timenav_height_min: 		175,					// Minimum timenav height
			marker_height_min: 			30,						// Minimum Marker Height
			marker_width_min: 			100,					// Minimum Marker Width
			marker_padding: 			5,						// Top Bottom Marker Padding
			start_at_slide: 			0,
			start_at_end: 				false,
			menubar_height: 			0,
			skinny_size: 				650,
			medium_size: 				800,
			relative_date: 				false,					// Use momentjs to show a relative date from the slide.text.date.created_time field
			use_bc: 					false,					// Use declared suffix on dates earlier than 0
			// animation
			duration: 					1000,
			ease: 						TL.Ease.easeInOutQuint,
			// interaction
			dragging: 					true,
			trackResize: 				true,
			map_type: 					"stamen:toner-lite",
			slide_padding_lr: 			100,					// padding on slide of slide
			slide_default_fade: 		"0%",					// landscape fade
			zoom_sequence: 				[0.5, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89], // Array of Fibonacci numbers for TimeNav zoom levels
			language: 					"en",
			ga_property_id: 			null,
			track_events: 				['back_to_start','nav_next','nav_previous','zoom_in','zoom_out' ]
		};

		// Animation Objects
		this.animator_timenav = null;
		this.animator_storyslider = null;
		this.animator_menubar = null;

		// Add message to DOM
		this.message = new TL.Message({}, {message_class: "tl-message-full"}, this._el.container);

		// Merge Options
		if (typeof(options.default_bg_color) == "string") {
			var parsed = TL.Util.hexToRgb(options.default_bg_color); // will clear it out if its invalid
			if (parsed) {
				options.default_bg_color = parsed;
			} else {
				delete options.default_bg_color
				trace("Invalid default background color. Ignoring.");
			}
		}
		TL.Util.mergeData(this.options, options);

		window.addEventListener("resize", function(e){
			self.updateDisplay();
		});

		// Set Debug Mode
		TL.debug = this.options.debug;

		// Apply base class to container
		TL.DomUtil.addClass(this._el.container, 'tl-timeline');

		if (this.options.is_embed) {
			TL.DomUtil.addClass(this._el.container, 'tl-timeline-embed');
		}

		if (this.options.is_full_embed) {
			TL.DomUtil.addClass(this._el.container, 'tl-timeline-full-embed');
		}

		// Use Relative Date Calculations
		// NOT YET IMPLEMENTED
		if(this.options.relative_date) {
			if (typeof(moment) !== 'undefined') {
				self._loadLanguage(data);
			} else {
				TL.Load.js(this.options.script_path + "/library/moment.js", function() {
					self._loadLanguage(data);
					trace("LOAD MOMENTJS")
				});
			}
		} else {
			self._loadLanguage(data);
		}

	},
	_translateError: function(e) {
	    if(e.hasOwnProperty('stack')) {
	        trace(e.stack);
	    }
	    if(e.message_key) {
	        return this._(e.message_key) + (e.detail ? ' [' + e.detail +']' : '')
	    }
	    return e;
	},

	/*  Load Language
	================================================== */
	_loadLanguage: function(data) {
		try {
		    this.options.language = new TL.Language(this.options);
		    this._initData(data);
		} catch(e) {
		    this.showMessage(this._translateError(e));
		}
	},


	/*  Navigation
	================================================== */

	// Goto slide with id
	goToId: function(id) {
		if (this.current_id != id) {
			this.current_id = id;
			this._timenav.goToId(this.current_id);
			this._storyslider.goToId(this.current_id, false, true);
			this.fire("change", {unique_id: this.current_id}, this);
		}
	},

	// Goto slide n
	goTo: function(n) {
		if(this.config.title) {
			if(n == 0) {
				this.goToId(this.config.title.unique_id);
			} else {
				this.goToId(this.config.events[n - 1].unique_id);
			}
		} else {
			this.goToId(this.config.events[n].unique_id);
		}
	},

	// Goto first slide
	goToStart: function() {
		this.goTo(0);
	},

	// Goto last slide
	goToEnd: function() {
		var _n = this.config.events.length - 1;
		this.goTo(this.config.title ? _n + 1 : _n);
	},

	// Goto previous slide
	goToPrev: function() {
		this.goTo(this._getSlideIndex(this.current_id) - 1);
	},

	// Goto next slide
	goToNext: function() {
		this.goTo(this._getSlideIndex(this.current_id) + 1);
	},

	/* Event maniupluation
	================================================== */

	// Add an event
	add: function(data) {
		var unique_id = this.config.addEvent(data);

		var n = this._getEventIndex(unique_id);
		var d = this.config.events[n];

		this._storyslider.createSlide(d, this.config.title ? n+1 : n);
		this._storyslider._updateDrawSlides();

		this._timenav.createMarker(d, n);
		this._timenav._updateDrawTimeline(false);

		this.fire("added", {unique_id: unique_id});
	},

	// Remove an event
	remove: function(n) {
		if(n >= 0  && n < this.config.events.length) {
			// If removing the current, nav to new one first
			if(this.config.events[n].unique_id == this.current_id) {
				if(n < this.config.events.length - 1) {
					this.goTo(n + 1);
				} else {
					this.goTo(n - 1);
				}
			}

			var event = this.config.events.splice(n, 1);

			this._storyslider.destroySlide(this.config.title ? n+1 : n);
			this._storyslider._updateDrawSlides();

			this._timenav.destroyMarker(n);
			this._timenav._updateDrawTimeline(false);

			this.fire("removed", {unique_id: event[0].unique_id});
		}
	},

	removeId: function(id) {
		this.remove(this._getEventIndex(id));
	},

	/* Get slide data
	================================================== */

	getData: function(n) {
		if(this.config.title) {
			if(n == 0) {
				return this.config.title;
			} else if(n > 0 && n <= this.config.events.length) {
				return this.config.events[n - 1];
			}
		} else if(n >= 0 && n < this.config.events.length) {
			return this.config.events[n];
		}
		return null;
	},

	getDataById: function(id) {
		return this.getData(this._getSlideIndex(id));
	},

	/* Get slide object
	================================================== */

	getSlide: function(n) {
		if(n >= 0 && n < this._storyslider._slides.length) {
			return this._storyslider._slides[n];
		}
		return null;
	},

	getSlideById: function(id) {
		return this.getSlide(this._getSlideIndex(id));
	},

	getCurrentSlide: function() {
		return this.getSlideById(this.current_id);
	},


	/*  Display
	================================================== */
	updateDisplay: function() {
		if (this.ready) {
			this._updateDisplay();
		}
	},

  	/*
  		Compute the height of the navigation section of the Timeline, taking into account
  		the possibility of an explicit height or height percentage, but also honoring the
  		`timenav_height_min` option value. If `timenav_height` is specified it takes precedence over `timenav_height_percentage` but in either case, if the resultant pixel height is less than `options.timenav_height_min` then the value of `options.timenav_height_min` will be returned. (A minor adjustment is made to the returned value to account for marker padding.)

  		Arguments:
  		@timenav_height (optional): an integer value for the desired height in pixels
  		@timenav_height_percentage (optional): an integer between 1 and 100

  	 */
	_calculateTimeNavHeight: function(timenav_height, timenav_height_percentage) {

		var height = 0;

		if (timenav_height) {
			height = timenav_height;
		} else {
			if (this.options.timenav_height_percentage || timenav_height_percentage) {
				if (timenav_height_percentage) {
					height = Math.round((this.options.height/100)*timenav_height_percentage);
				} else {
					height = Math.round((this.options.height/100)*this.options.timenav_height_percentage);
				}

			}
		}

		// Set new minimum based on how many rows needed
		if (this._timenav.ready) {
			if (this.options.timenav_height_min < this._timenav.getMinimumHeight()) {
				this.options.timenav_height_min = this._timenav.getMinimumHeight();
			}
		}

		// If height is less than minimum set it to minimum
		if (height < this.options.timenav_height_min) {
			height = this.options.timenav_height_min;
		}

		height = height - (this.options.marker_padding * 2);

		return height;
	},

	/*  Private Methods
	================================================== */

	// Update View
	_updateDisplay: function(timenav_height, animate, d) {
		var duration    = this.options.duration,
		display_class   = this.options.base_class,
		menu_position   = 0,
		self      = this;

		if (d) {
			duration = d;
		}

		// Update width and height
		this.options.width = this._el.container.offsetWidth;
		this.options.height = this._el.container.offsetHeight;

		// Check if skinny
		if (this.options.width <= this.options.skinny_size) {
			display_class += " tl-skinny";
			this.options.layout = "portrait";
		} else if (this.options.width <= this.options.medium_size) {
			display_class += " tl-medium";
			this.options.layout = "landscape";
		} else {
			this.options.layout = "landscape";
		}

		// Detect Mobile and Update Orientation on Touch devices
		if (TL.Browser.touch) {
			this.options.layout = TL.Browser.orientation();
		}

		if (TL.Browser.mobile) {
			display_class += " tl-mobile";
			// Set TimeNav Height
			this.options.timenav_height = this._calculateTimeNavHeight(timenav_height, this.options.timenav_mobile_height_percentage);
		} else {
			// Set TimeNav Height
			this.options.timenav_height = this._calculateTimeNavHeight(timenav_height);
		}

		// LAYOUT
		if (this.options.layout == "portrait") {
			// Portrait
			display_class += " tl-layout-portrait";

		} else {
			// Landscape
			display_class += " tl-layout-landscape";

		}

		// Set StorySlider Height
		this.options.storyslider_height = (this.options.height - this.options.timenav_height);

		// Positon Menu
		if (this.options.timenav_position == "top") {
			menu_position = ( Math.ceil(this.options.timenav_height)/2 ) - (this._el.menubar.offsetHeight/2) - (39/2) ;
		} else {
			menu_position = Math.round(this.options.storyslider_height + 1 + ( Math.ceil(this.options.timenav_height)/2 ) - (this._el.menubar.offsetHeight/2) - (35/2));
		}


		if (animate) {

			// Animate TimeNav

			/*
			if (this.animator_timenav) {
			this.animator_timenav.stop();
			}

			this.animator_timenav = TL.Animate(this._el.timenav, {
			height:   (this.options.timenav_height) + "px",
			duration:   duration/4,
			easing:   TL.Ease.easeOutStrong,
			complete: function () {
			//self._map.updateDisplay(self.options.width, self.options.timenav_height, animate, d, self.options.menubar_height);
			}
			});
			*/

			this._el.timenav.style.height = Math.ceil(this.options.timenav_height) + "px";

			// Animate StorySlider
			if (this.animator_storyslider) {
				this.animator_storyslider.stop();
			}
			this.animator_storyslider = TL.Animate(this._el.storyslider, {
				height:   this.options.storyslider_height + "px",
				duration:   duration/2,
				easing:   TL.Ease.easeOutStrong
			});

			// Animate Menubar
			if (this.animator_menubar) {
				this.animator_menubar.stop();
			}

			this.animator_menubar = TL.Animate(this._el.menubar, {
				top:  menu_position + "px",
				duration:   duration/2,
				easing:   TL.Ease.easeOutStrong
			});

		} else {
			// TimeNav
			this._el.timenav.style.height = Math.ceil(this.options.timenav_height) + "px";

			// StorySlider
			this._el.storyslider.style.height = this.options.storyslider_height + "px";

			// Menubar
			this._el.menubar.style.top = menu_position + "px";
		}

		if (this.message) {
			this.message.updateDisplay(this.options.width, this.options.height);
		}
		// Update Component Displays
		this._timenav.updateDisplay(this.options.width, this.options.timenav_height, animate);
		this._storyslider.updateDisplay(this.options.width, this.options.storyslider_height, animate, this.options.layout);

		// Apply class
		this._el.container.className = display_class;

	},

	// Update hashbookmark in the url bar
	_updateHashBookmark: function(id) {
		var hash = "#" + "event-" + id.toString();
		if (window.location.protocol != 'file:') {
			window.history.replaceState(null, "Browsing TimelineJS", hash);
		}
		this.fire("hash_updated", {unique_id:this.current_id, hashbookmark:"#" + "event-" + id.toString()}, this);
	},

	/*  Init
	================================================== */
	// Initialize the data
	_initData: function(data) {
		var self = this;

		if (typeof data == 'string') {
			var self = this;
			TL.ConfigFactory.makeConfig(data, function(config) {
				self.setConfig(config);
			});
		} else if (TL.TimelineConfig == data.constructor) {
			this.setConfig(data);
		} else {
			this.setConfig(new TL.TimelineConfig(data));
		}
	},

	setConfig: function(config) {
		this.config = config;
		this.config.validate();
		this._validateOptions();
		if (this.config.isValid()) {
		    try {
			    this._onDataLoaded();
			} catch(e) {
			    this.showMessage("<strong>"+ this._('error') +":</strong> " + this._translateError(e));
			}
		} else {
		    var translated_errs = [];

		    for(var i = 0, errs = this.config.getErrors(); i < errs.length; i++) {
		        translated_errs.push(this._translateError(errs[i]));
		    }

			this.showMessage("<strong>"+ this._('error') +":</strong> " + translated_errs.join('<br>'));
			// should we set 'self.ready'? if not, it won't resize,
			// but most resizing would only work
			// if more setup happens
		}
	},
	_validateOptions: function() {
		// assumes that this.options and this.config have been set.
		var INTEGER_PROPERTIES = ['timenav_height', 'timenav_height_min', 'marker_height_min', 'marker_width_min', 'marker_padding', 'start_at_slide', 'slide_padding_lr'  ];

		for (var i = 0; i < INTEGER_PROPERTIES.length; i++) {
				var opt = INTEGER_PROPERTIES[i];
				var value = this.options[opt];
				valid = true;
				if (typeof(value) == 'number') {
					valid = (value == parseInt(value))
				} else if (typeof(value) == "string") {
					valid = (value.match(/^\s*\-?\d+\s*$/));
				}
				if (!valid) {
					this.config.logError({ message_key: 'invalid_integer_option', detail: opt });
				}
		}
	},
	// Initialize the layout
	_initLayout: function () {
		var self = this;

        this.message.removeFrom(this._el.container);
		this._el.container.innerHTML = "";

		// Create Layout
		if (this.options.timenav_position == "top") {
			this._el.timenav		= TL.Dom.create('div', 'tl-timenav', this._el.container);
			this._el.storyslider	= TL.Dom.create('div', 'tl-storyslider', this._el.container);
		} else {
			this._el.storyslider  	= TL.Dom.create('div', 'tl-storyslider', this._el.container);
			this._el.timenav		= TL.Dom.create('div', 'tl-timenav', this._el.container);
		}

		this._el.menubar			= TL.Dom.create('div', 'tl-menubar', this._el.container);


		// Initial Default Layout
		this.options.width        = this._el.container.offsetWidth;
		this.options.height       = this._el.container.offsetHeight;
		this._el.storyslider.style.top  = "1px";

		// Set TimeNav Height
		this.options.timenav_height = this._calculateTimeNavHeight(this.options.timenav_height);

		// Create TimeNav
		this._timenav = new TL.TimeNav(this._el.timenav, this.config, this.options);
		this._timenav.on('loaded', this._onTimeNavLoaded, this);
		this._timenav.on('update_timenav_min', this._updateTimeNavHeightMin, this);
		this._timenav.options.height = this.options.timenav_height;
		this._timenav.init();

        // intial_zoom cannot be applied before the timenav has been created
        if (this.options.initial_zoom) {
            // at this point, this.options refers to the merged set of options
            this.setZoom(this.options.initial_zoom);
        }

		// Create StorySlider
		this._storyslider = new TL.StorySlider(this._el.storyslider, this.config, this.options);
		this._storyslider.on('loaded', this._onStorySliderLoaded, this);
		this._storyslider.init();

		// Create Menu Bar
		this._menubar = new TL.MenuBar(this._el.menubar, this._el.container, this.options);

		// LAYOUT
		if (this.options.layout == "portrait") {
			this.options.storyslider_height = (this.options.height - this.options.timenav_height - 1);
		} else {
			this.options.storyslider_height = (this.options.height - 1);
		}


		// Update Display
		this._updateDisplay(this._timenav.options.height, true, 2000);

	},

  /* Depends upon _initLayout because these events are on things the layout initializes */
	_initEvents: function () {
		// TimeNav Events
		this._timenav.on('change', this._onTimeNavChange, this);
		this._timenav.on('zoomtoggle', this._onZoomToggle, this);

		// StorySlider Events
		this._storyslider.on('change', this._onSlideChange, this);
		this._storyslider.on('colorchange', this._onColorChange, this);
		this._storyslider.on('nav_next', this._onStorySliderNext, this);
		this._storyslider.on('nav_previous', this._onStorySliderPrevious, this);

		// Menubar Events
		this._menubar.on('zoom_in', this._onZoomIn, this);
		this._menubar.on('zoom_out', this._onZoomOut, this);
		this._menubar.on('back_to_start', this._onBackToStart, this);

	},

	/* Analytics
	================================================== */
	_initGoogleAnalytics: function() {
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

		ga('create', this.options.ga_property_id, 'auto');
	},

	_initAnalytics: function() {
		if (this.options.ga_property_id === null) { return; }
		this._initGoogleAnalytics();
        ga('send', 'pageview');
		var events = this.options.track_events;
		for (i=0; i < events.length; i++) {
			var event_ = events[i];
			this.addEventListener(event_, function(e) {
				ga('send', 'event', e.type, 'clicked');
			});
		}
	},

	_onZoomToggle: function(e) {
		if (e.zoom == "in") {
			this._menubar.toogleZoomIn(e.show);
		} else if (e.zoom == "out") {
			this._menubar.toogleZoomOut(e.show);
		}

	},

	/* Get index of event by id
	================================================== */
	_getEventIndex: function(id) {
		for(var i = 0; i < this.config.events.length; i++) {
			if(id == this.config.events[i].unique_id) {
				return i;
			}
		}
		return -1;
	},

	/*  Get index of slide by id
	================================================== */
	_getSlideIndex: function(id) {
		if(this.config.title && this.config.title.unique_id == id) {
			return 0;
		}
		for(var i = 0; i < this.config.events.length; i++) {
			if(id == this.config.events[i].unique_id) {
				return this.config.title ? i+1 : i;
			}
		}
		return -1;
	},

	/*  Events
	================================================== */

	_onDataLoaded: function(e) {
		this.fire("dataloaded");
		this._initLayout();
		this._initEvents();
		this._initAnalytics();
		if (this.message) {
			this.message.hide();
		}

		this.ready = true;

	},

	showMessage: function(msg) {
		if (this.message) {
			this.message.updateMessage(msg);
		} else {
			trace("No message display available.")
			trace(msg);
		}
	},

	_onColorChange: function(e) {
		this.fire("color_change", {unique_id:this.current_id}, this);
		if (e.color || e.image) {

		} else {

		}
	},

	_onSlideChange: function(e) {
		if (this.current_id != e.unique_id) {
			this.current_id = e.unique_id;
			this._timenav.goToId(this.current_id);
			this._onChange(e);
		}
	},

	_onTimeNavChange: function(e) {
		if (this.current_id != e.unique_id) {
			this.current_id = e.unique_id;
			this._storyslider.goToId(this.current_id);
			this._onChange(e);
		}
	},

	_onChange: function(e) {
		this.fire("change", {unique_id:this.current_id}, this);
		if (this.options.hash_bookmark && this.current_id) {
			this._updateHashBookmark(this.current_id);
		}
	},

	_onBackToStart: function(e) {
		this._storyslider.goTo(0);
		this.fire("back_to_start", {unique_id:this.current_id}, this);
	},

	/**
	 * Zoom in and zoom out should be part of the public API.
	 */
	zoomIn: function() {
	    this._timenav.zoomIn();
	},
	zoomOut: function() {
	    this._timenav.zoomOut();
	},

	setZoom: function(level) {
	    this._timenav.setZoom(level);
	},

	_onZoomIn: function(e) {
		this._timenav.zoomIn();
		this.fire("zoom_in", {zoom_level:this._timenav.options.scale_factor}, this);
	},

	_onZoomOut: function(e) {
		this._timenav.zoomOut();
		this.fire("zoom_out", {zoom_level:this._timenav.options.scale_factor}, this);
	},

	_onTimeNavLoaded: function() {
		this._loaded.timenav = true;
		this._onLoaded();
	},

	_onStorySliderLoaded: function() {
		this._loaded.storyslider = true;
		this._onLoaded();
	},

	_onStorySliderNext: function(e) {
		this.fire("nav_next", e);
	},

	_onStorySliderPrevious: function(e) {
		this.fire("nav_previous", e);
	},

	_onLoaded: function() {
		if (this._loaded.storyslider && this._loaded.timenav) {
			this.fire("loaded", this.config);
			// Go to proper slide
			if (this.options.hash_bookmark && window.location.hash != "") {
				this.goToId(window.location.hash.replace("#event-", ""));
			} else {
				if(this.options.start_at_end == "true" || this.options.start_at_slide > this.config.events.length ) {
					this.goToEnd();
				} else {
					this.goTo(this.options.start_at_slide);
				}
				if (this.options.hash_bookmark ) {
					this._updateHashBookmark(this.current_id);
				}
			}

		}
	}

});

TL.Timeline.source_path = (function() {
	var script_tags = document.getElementsByTagName('script');
	var src = script_tags[script_tags.length-1].src;
	return src.substr(0,src.lastIndexOf('/'));
})();
