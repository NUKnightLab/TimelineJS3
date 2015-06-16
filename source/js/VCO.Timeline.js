/*  TimelineJS
Designed and built by Zach Wise at KnightLab
  
This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.
  
================================================== */
/* 
TODO
  
*/ 

/*  Required Files
CodeKit Import
http://incident57.com/codekit/
================================================== */

// CORE
	// @codekit-prepend "core/VCO.js";
	// @codekit-prepend "core/VCO.Util.js";
	// @codekit-prepend "data/VCO.Data.js";
	// @codekit-prepend "core/VCO.Class.js";
	// @codekit-prepend "core/VCO.Events.js";
	// @codekit-prepend "core/VCO.Browser.js";
	// @codekit-prepend "core/VCO.Load.js";
	// @codekit-prepend "core/VCO.TimelineConfig.js";
	// @codekit-prepend "core/VCO.ConfigFactory.js";


// LANGUAGE
	// @codekit-prepend "language/VCO.Language.js";
	// @codekit-prepend "language/VCO.I18NMixins.js";

// ANIMATION
	// @codekit-prepend "animation/VCO.Ease.js";
	// @codekit-prepend "animation/VCO.Animate.js";

// DOM
	// @codekit-prepend "dom/VCO.Point.js";
	// @codekit-prepend "dom/VCO.DomMixins.js";
	// @codekit-prepend "dom/VCO.Dom.js";
	// @codekit-prepend "dom/VCO.DomUtil.js";
	// @codekit-prepend "dom/VCO.DomEvent.js";
	// @codekit-prepend "dom/VCO.StyleSheet.js";
  
// Date
	// @codekit-prepend "date/VCO.Date.js";
	// @codekit-prepend "date/VCO.DateUtil.js";

// UI
	// @codekit-prepend "ui/VCO.Draggable.js";
	// @codekit-prepend "ui/VCO.Swipable.js";
	// @codekit-prepend "ui/VCO.MenuBar.js";
	// @codekit-prepend "ui/VCO.Message.js";

// MEDIA
	// @codekit-prepend "media/VCO.MediaType.js";
	// @codekit-prepend "media/VCO.Media.js";

// MEDIA TYPES
	// @codekit-prepend "media/types/VCO.Media.Blockquote.js";
	// @codekit-prepend "media/types/VCO.Media.DailyMotion.js";
	// @codekit-prepend "media/types/VCO.Media.DocumentCloud.js";
	// @codekit-prepend "media/types/VCO.Media.Flickr.js";
	// @codekit-prepend "media/types/VCO.Media.GoogleDoc.js";
	// @codekit-prepend "media/types/VCO.Media.GooglePlus.js";
	// @codekit-prepend "media/types/VCO.Media.IFrame.js";
	// @codekit-prepend "media/types/VCO.Media.Image.js";
	// @codekit-prepend "media/types/VCO.Media.Instagram.js";
	// @codekit-prepend "media/types/VCO.Media.Map.js";
	// @codekit-prepend "media/types/VCO.Media.Profile.js";
	// @codekit-prepend "media/types/VCO.Media.Slider.js";
	// @codekit-prepend "media/types/VCO.Media.SoundCloud.js";
	// @codekit-prepend "media/types/VCO.Media.Spotify.js";
	// @codekit-prepend "media/types/VCO.Media.Storify.js";
	// @codekit-prepend "media/types/VCO.Media.Text.js";
	// @codekit-prepend "media/types/VCO.Media.Twitter.js";
	// @codekit-prepend "media/types/VCO.Media.Vimeo.js";
	// @codekit-prepend "media/types/VCO.Media.Vine.js";
	// @codekit-prepend "media/types/VCO.Media.Website.js";
	// @codekit-prepend "media/types/VCO.Media.Wikipedia.js";
	// @codekit-prepend "media/types/VCO.Media.YouTube.js";

// STORYSLIDER
	// @codekit-prepend "slider/VCO.Slide.js";
	// @codekit-prepend "slider/VCO.SlideNav.js";
	// @codekit-prepend "slider/VCO.StorySlider.js";

// TIMENAV
	// @codekit-prepend "timenav/VCO.TimeNav.js"; 
	// @codekit-prepend "timenav/VCO.TimeMarker.js";
	// @codekit-prepend "timenav/VCO.TimeGroup.js";
	// @codekit-prepend "timenav/VCO.TimeScale.js";
	// @codekit-prepend "timenav/VCO.TimeAxis.js";
	// @codekit-prepend "timenav/VCO.AxisHelper.js";


VCO.Timeline = VCO.Class.extend({
	includes: VCO.Events,

	/*  Private Methods
	================================================== */
	initialize: function (elem, data, options) {
		var self = this;
		// Version
		this.version = "0.0.20";

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
			this._el.container = VCO.Dom.get(elem);
		}

		// Slider
		this._storyslider = {};

		// Style Sheet
		this._style_sheet = new VCO.StyleSheet();

		// TimeNav
		this._timenav = {};
		
		// Message
		this.message = {};

		// Menu Bar
		this._menubar = {};

		// Loaded State
		this._loaded = {storyslider:false, timenav:false};

		// Data Object
		// Test Data compiled from http://www.pbs.org/marktwain/learnmore/chronology.html
		this.config = null;

		this.options = {
			script_path:        "",
			height:           this._el.container.offsetHeight,
			width:            this._el.container.offsetWidth,
			theme_color:        false,
			hash_bookmark:        false,
			default_bg_color:       {r:255, g:255, b:255},
			scale_factor:         2,        // How many screen widths wide should the timeline be
			layout:           "landscape",  // portrait or landscape
			timenav_position:       "bottom",     // timeline on top or bottom 
			optimal_tick_width:     60,       // optimal distance (in pixels) between ticks on axis
			base_class:         "",
			timenav_height:       175,
			timenav_height_percentage:  25,       // Overrides timenav height as a percentage of the screen
			timenav_height_min:     175,      // Minimum timenav height
			marker_height_min:      30,       // Minimum Marker Height
			marker_width_min:       100,      // Minimum Marker Width
			marker_padding:       5,        // Top Bottom Marker Padding
			start_at_slide:       0,
			start_at_end: false,
			menubar_height:       0,
			skinny_size:        650,
			relative_date:        false,      // Use momentjs to show a relative date from the slide.text.date.created_time field
			use_bc:           false,      // Use declared suffix on dates earlier than 0
			// animation
			duration:           1000,
			ease:             VCO.Ease.easeInOutQuint,
			// interaction
			dragging:           true,
			trackResize:        true,
			map_type:           "stamen:toner-lite",
			slide_padding_lr:       100,      // padding on slide of slide
			slide_default_fade:     "0%",       // landscape fade
			zoom_sequence:        [0.5, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89], // Array of Fibonacci numbers for TimeNav zoom levels http://www.maths.surrey.ac.uk/hosted-sites/R.Knott/Fibonacci/fibtable.html
			language:           "en",
			ga_property_id:       null,
			track_events:         ['back_to_start','nav_next','nav_previous','zoom_in','zoom_out' ]
		};

		// Current Slide
		// this.current_slide = this.options.start_at_slide;
		// no longer using this, track current slide by id only

		// Animation Objects
		this.animator_timenav = null;
		this.animator_storyslider = null;
		this.animator_menubar = null;

		// Merge Options
		VCO.Util.mergeData(this.options, options);

		// Use Relative Date Calculations
		if(this.options.relative_date) {
			if (typeof(moment) !== 'undefined') {
				self._loadLanguage(data);
			} else {
				VCO.Load.js(this.options.script_path + "/library/moment.js", function() {
					self._loadLanguage(data);
					trace("LOAD MOMENTJS")
				});
			}

		} else {
			self._loadLanguage(data);
		}

		if (this.options.theme_color) {
			this._applyCustomColor(this.options.theme_color);
		}
		
		// Apply base class to container
		this._el.container.className += ' vco-timeline';
		
		// Message
		this.message = new VCO.Message({}, {
			message_class: "vco-message-full"
		});
		
		this.message.addTo(this._el.container);

	},

	/*  Load Language
	================================================== */
	_loadLanguage: function(data) {
		var self = this;
		this.options.language = new VCO.Language(this.options);
		this._initData(data);
	},

  
	/*  Navigation
	================================================== */
  
	// Goto slide with id
	goToId: function(id) {
		if (this.current_id != id) {
			this.current_id = id;
			this._timenav.goToId(this.current_id);
			this._storyslider.goToId(this.current_id, false, true);
			this.fire("change", {uniqueid: this.current_id}, this);
		}
	},
  
	// Goto slide n
	goTo: function(n) {
		if(this.config.title) {
			if(n == 0) {
				this.goToId(this.config.title.uniqueid);
			} else {
				this.goToId(this.config.events[n - 1].uniqueid);
			}
		} else {
			this.goToId(this.config.events[n].uniqueid);      
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
		var uniqueid = this.config.addEvent(data);
      
		var n = this._getEventIndex(uniqueid);
		var d = this.config.events[n];
        
		this._storyslider.createSlide(d, this.config.title ? n+1 : n);
		this._storyslider._updateDrawSlides();            
        
		this._timenav.createMarker(d, n);
		this._timenav._updateDrawTimeline(false); 
        
		this.fire("added", {uniqueid: uniqueid});
	},
  
	// Remove an event
	remove: function(n) {
		if(n >= 0  && n < this.config.events.length) {
			// If removing the current, nav to new one first
			if(this.config.events[n].uniqueid == this.current_id) {
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
         
			this.fire("removed", {uniqueid: event[0].uniqueid});
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

	getDataId: function(id) {
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
			this.options.layout = "portrait";
		} else {
			this.options.layout = "landscape";
		}
    
		// Detect Mobile and Update Orientation on Touch devices
		if (VCO.Browser.touch) {
			this.options.layout = VCO.Browser.orientation();
		} 
    
		if (VCO.Browser.mobile) {
			display_class += " vco-mobile";
			// Set TimeNav Height
			this.options.timenav_height = this._calculateTimeNavHeight(timenav_height, 40);
		} else {
			// Set TimeNav Height
			this.options.timenav_height = this._calculateTimeNavHeight(timenav_height);
		}
    
		// LAYOUT
		if (this.options.layout == "portrait") {
      
			display_class += " vco-skinny";
			// Portrait
			display_class += " vco-layout-portrait";

		} else {
			// Landscape
			display_class += " vco-layout-landscape";
      
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
    
			this.animator_timenav = VCO.Animate(this._el.timenav, {
			height:   (this.options.timenav_height) + "px",
			duration:   duration/4,
			easing:   VCO.Ease.easeOutStrong,
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
			this.animator_storyslider = VCO.Animate(this._el.storyslider, {
				height:   this.options.storyslider_height + "px",
				duration:   duration/2,
				easing:   VCO.Ease.easeOutStrong
			});
      
			// Animate Menubar
			if (this.animator_menubar) {
				this.animator_menubar.stop();
			}
      
			this.animator_menubar = VCO.Animate(this._el.menubar, {
				top:  menu_position + "px",
				duration:   duration/2,
				easing:   VCO.Ease.easeOutStrong
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
		window.location.hash = "#" + "event-" + id.toString();
		this.fire("hash_updated", {uniqueid:this.current_id, hashbookmark:"#" + "event-" + id.toString()}, this);
	},
  
	// Customize Color
	_applyCustomColor: function(color) {
		var rgb = VCO.Util.hexToRgb(color);
    
		var background_selectors = ".vco-timemarker.vco-timemarker-active .vco-timemarker-content-container,"
		background_selectors  += ".vco-timemarker.vco-timemarker-active .vco-timemarker-timespan .vco-timemarker-timespan-content,"
		background_selectors  += ".vco-timemarker.vco-timemarker-with-end.vco-timemarker-active .vco-timemarker-line-left:after,"
		background_selectors  += ".vco-timemarker.vco-timemarker-with-end.vco-timemarker-active .vco-timemarker-line-right:after,";
		background_selectors  += ".vco-timemarker.vco-timemarker-active .vco-timemarker-line-left:after,";
		background_selectors  += ".vco-timemarker.vco-timemarker-active .vco-timemarker-line-right:after,";
		background_selectors  += ".vco-menubar-button:hover";
    
		this._style_sheet.addRule(background_selectors, "background-color:" + color + " !important;");
		this._style_sheet.addRule(".vco-timemarker.vco-timemarker-active .vco-timemarker-timespan", "background-color:rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ",.15) !important;");
		this._style_sheet.addRule(".vco-timemarker.vco-timemarker-with-end.vco-timemarker-active .vco-timemarker-timespan:after", "background-color:rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ",.5) !important;");
		this._style_sheet.addRule(".vco-timemarker.vco-timemarker-active .vco-timemarker-line-left, .vco-timemarker.vco-timemarker-active .vco-timemarker-line-right", "border-color:" + color + " !important;");
		this._style_sheet.addRule('.vco-timemarker.vco-timemarker-active .vco-timemarker-content-container .vco-timemarker-content .vco-timemarker-media-container [class^=vco-icon-], .vco-timemarker.vco-timemarker-active .vco-timemarker-content-container .vco-timemarker-content .vco-timemarker-media-container [class*=" vco-icon-"]', "color:rgba(255,255,255,.7) !important;");
    
		this._style_sheet.addRule(".vco-timemarker.vco-timemarker-active .vco-timemarker-content-container .vco-timemarker-content .vco-timemarker-text h2.vco-headline.vco-headline-fadeout:after", " background: linear-gradient(to bottom, rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + ",.15) 0px, " + color + " 80%) repeat scroll 0% 0% transparent !important;");
	},
  
	/*  Init
	================================================== */
	// Initialize the data
	_initData: function(data) {
		var self = this;
		if (VCO.TimelineConfig == data.constructor) {
			self.config = data;
			self._onDataLoaded();
		} else {
			self.config = new VCO.TimelineConfig(data,function() {self._onDataLoaded()});
		}
		self.config.on('load_error', this._onError, this);
		
	},
  
	// Initialize the layout
	_initLayout: function () {
		var self = this;
    
		//this._el.container.className += ' vco-timeline';
		this.options.base_class = this._el.container.className;
		this._el.container.innerHTML = "";
		// Create Layout
		if (this.options.timenav_position == "top") {
			this._el.timenav		= VCO.Dom.create('div', 'vco-timenav', this._el.container);
			this._el.storyslider	= VCO.Dom.create('div', 'vco-storyslider', this._el.container);
		} else {
			this._el.storyslider  	= VCO.Dom.create('div', 'vco-storyslider', this._el.container);
			this._el.timenav		= VCO.Dom.create('div', 'vco-timenav', this._el.container);
		}
    
		this._el.menubar			= VCO.Dom.create('div', 'vco-menubar', this._el.container);

    
		// Initial Default Layout
		this.options.width        = this._el.container.offsetWidth;
		this.options.height       = this._el.container.offsetHeight;
		this._el.storyslider.style.top  = "1px";
    
		// Set TimeNav Height
		this.options.timenav_height = this._calculateTimeNavHeight();
    
		// Create TimeNav
		this._timenav = new VCO.TimeNav(this._el.timenav, this.config, this.options);
		this._timenav.on('loaded', this._onTimeNavLoaded, this);
		this._timenav.options.height = this.options.timenav_height;
		this._timenav.init();
    
		// Create StorySlider
		this._storyslider = new VCO.StorySlider(this._el.storyslider, this.config, this.options);
		this._storyslider.on('loaded', this._onStorySliderLoaded, this);
		this._storyslider.init();
    
		// Create Menu Bar
		this._menubar = new VCO.MenuBar(this._el.menubar, this._el.container, this.options);
    
		// LAYOUT
		if (this.options.layout == "portrait") {
			this.options.storyslider_height = (this.options.height - this.options.timenav_height - 1);
		} else {
			this.options.storyslider_height = (this.options.height - 1);
		}
		
		
		
		// Update Display
		this._updateDisplay(false, true, 2000);
    
	},
  
	_initEvents: function () {    
		// TimeNav Events
		this._timenav.on('change', this._onTimeNavChange, this);
    
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
		var events = this.options.track_events;
		for (i=0; i < events.length; i++) {
			var event_ = events[i];
			this.addEventListener(event_, function(e) {
				ga('send', e.type);
			});
		}
	},
    
	/* Get index of event by id
	================================================== */
	_getEventIndex: function(id) {
		for(var i = 0; i < this.config.events.length; i++) {
			if(id == this.config.events[i].uniqueid) {
				return i;
			}
		}
		return -1;
	},  
  
	/*  Get index of slide by id
	================================================== */
	_getSlideIndex: function(id) {
		if(this.config.title && this.config.title.uniqueid == id) {
			return 0;
		}
		for(var i = 0; i < this.config.events.length; i++) {
			if(id == this.config.events[i].uniqueid) {
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
	
	_onError: function(e) {
		if (this.message) {
			this.message.updateMessage("<strong>Error: </strong>" + e.message);
		}
	},
  
	_onColorChange: function(e) {
		this.fire("color_change", {uniqueid:this.current_id}, this);
		if (e.color || e.image) {
      
		} else {
      
		}
	},
  
	_onSlideChange: function(e) {
		if (this.current_id != e.uniqueid) {
			this.current_id = e.uniqueid;
			this._timenav.goToId(this.current_id);
			this._onChange(e);
		}
	},
  
	_onTimeNavChange: function(e) {
		if (this.current_id != e.uniqueid) {
			this.current_id = e.uniqueid;
			this._storyslider.goToId(this.current_id);
			this._onChange(e);
		}
	},
  
	_onChange: function(e) {
		this.fire("change", {uniqueid:this.current_id}, this);
		if (this.options.hash_bookmark) {
			this._updateHashBookmark(this.current_id);
		}
	},
  
	_onBackToStart: function(e) {
		this._storyslider.goTo(0);
		this.fire("back_to_start", {uniqueid:this.current_id}, this);
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
				if(this.options.start_at_end == "true") {
					this.goToEnd();
				} else {
					this.goTo(this.options.start_at_slide);
				}
				this.current_id = this._timenav.current_id;
				if (this.options.hash_bookmark) {
					this._updateHashBookmark(this.current_id);
				}
			}
			
		}
	}

});

VCO.Timeline.source_path = (function() {
	var script_tags = document.getElementsByTagName('script');
	var src = script_tags[script_tags.length-1].src;
	return src.substr(0,src.lastIndexOf('/'));
})();



