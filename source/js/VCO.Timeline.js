/*	TimelineJS
	Designed and built by Zach Wise at KnightLab

	This Source Code Form is subject to the terms of the Mozilla Public
	License, v. 2.0. If a copy of the MPL was not distributed with this
	file, You can obtain one at http://mozilla.org/MPL/2.0/.
	
================================================== */
/* 
	TODO
	
*/ 

/*	Required Files
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

// LANGUAGE
	// @codekit-prepend "language/VCO.Language.js";

// ANIMATION
	// @codekit-prepend "animation/VCO.Ease.js";
	// @codekit-prepend "animation/VCO.Animate.js";

// DOM
	// @codekit-prepend "dom/VCO.Point.js";
	// @codekit-prepend "dom/VCO.DomMixins.js";
	// @codekit-prepend "dom/VCO.Dom.js";
	// @codekit-prepend "dom/VCO.DomUtil.js";
	// @codekit-prepend "dom/VCO.DomEvent.js";
	
// Date
	// @codekit-prepend "date/VCO.DateFormat.js";
	// @codekit-prepend "date/VCO.Date.js";

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
	// @codekit-prepend "media/types/VCO.Media.Flickr.js";
	// @codekit-prepend "media/types/VCO.Media.Instagram.js";
	// @codekit-prepend "media/types/VCO.Media.Profile.js";
	// @codekit-prepend "media/types/VCO.Media.GoogleDoc.js";
	// @codekit-prepend "media/types/VCO.Media.GooglePlus.js";
	// @codekit-prepend "media/types/VCO.Media.IFrame.js";
	// @codekit-prepend "media/types/VCO.Media.Image.js";
	// @codekit-prepend "media/types/VCO.Media.SoundCloud.js";
	// @codekit-prepend "media/types/VCO.Media.Storify.js";
	// @codekit-prepend "media/types/VCO.Media.Text.js";
	// @codekit-prepend "media/types/VCO.Media.Twitter.js";
	// @codekit-prepend "media/types/VCO.Media.Vimeo.js";
	// @codekit-prepend "media/types/VCO.Media.DailyMotion.js";
	// @codekit-prepend "media/types/VCO.Media.Vine.js";
	// @codekit-prepend "media/types/VCO.Media.Website.js";
	// @codekit-prepend "media/types/VCO.Media.Wikipedia.js";
	// @codekit-prepend "media/types/VCO.Media.YouTube.js";
	// @codekit-prepend "media/types/VCO.Media.Slider.js";

// STORYSLIDER
	// @codekit-prepend "slider/VCO.Slide.js";
	// @codekit-prepend "slider/VCO.SlideNav.js";
	// @codekit-prepend "slider/VCO.StorySlider.js";

// TIMENAV
	// @codekit-prepend "timenav/VCO.TimeNav.js";
	// @codekit-prepend "timenav/VCO.TimeUtil.js";
	// @codekit-prepend "timenav/VCO.TimeMarker.js";


VCO.Timeline = VCO.Class.extend({
	
	includes: VCO.Events,
	
	/*	Private Methods
	================================================== */
	initialize: function (elem, data, options) {
		var self = this;
		
		// Version
		this.version = "0.0.16";
		
		// Ready
		this.ready = false;
		
		// DOM ELEMENTS
		this._el = {
			container: {},
			storyslider: {},
			map: {},
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
		
		// Map
		this._map = {};
		this.map = {}; // For direct access to Leaflet Map
		
		// TimeNav
		this._timenav = {};
		
		// Menu Bar
		this._menubar = {};
		
		// Loaded State
		this._loaded = {storyslider:false, timenav:false};
		
		// Data Object
		// Test Data compiled from http://www.pbs.org/marktwain/learnmore/chronology.html
		this.data = {
			uniqueid: 				"",
			slides: 				[
				{
					uniqueid: 				"",
					type: 					"overview", // Optional
					background: {			// OPTIONAL
						url: 				"http://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Mark_Twain_by_Abdullah_Fr%C3%A8res%2C_1867.jpg/418px-Mark_Twain_by_Abdullah_Fr%C3%A8res%2C_1867.jpg",
						color: 				"",
						opacity: 			50
					},
					date: {
						year:			1978,
						month:			01,
						day: 			05,
						hour: 			6,
						minute: 		45,
						second: 		56,
						millisecond: 	98,
						format: 		""
					},
					text: {
						headline: 			"Mark Twain",
						text: 				"Samuel Langhorne Clemens (November 30, 1835 – April 21, 1910), better known by his pen name Mark Twain, was an American author and humorist. He wrote The Adventures of Tom Sawyer (1876) and its sequel, Adventures of Huckleberry Finn (1885), the latter often called \"the Great American Novel.\""
					},
					media: {
						url: 				"http://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Mark_Twain_birthplace.jpg/800px-Mark_Twain_birthplace.jpg",
						thumb: 				"http://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Mark_Twain_birthplace.jpg/800px-Mark_Twain_birthplace.jpg",
						credit:				"",
						caption:			"Mark Twain's birthplace, Florida, Missouri"
					}
				},
				{
					uniqueid: 				"",
					date: {
						year:			1978,
						month:			01,
						day: 			05,
						hour: 			6,
						minute: 		45,
						second: 		56,
						millisecond: 	98,
						thumbnail: 		"",
						format: 		""
					},
					location: {
						lat: 				39.491711,
						lon: 				-91.793260,
						name: 				"Florida, Missouri",
						zoom: 				12,
						icon: 				"http://maps.gstatic.com/intl/en_us/mapfiles/ms/micons/blue-pushpin.png",
						line: 				true
					},
					text: {
						headline: 			"Florida, Missouri",
						text: 				"Born in Florida, Missouri. Halley’s comet visible from earth."
					},
					media: {
						url: 				"http://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Mark_Twain_birthplace.jpg/800px-Mark_Twain_birthplace.jpg",
						credit:				"",
						caption:			"Mark Twain's birthplace, Florida, Missouri"
					}
				}
			]
		};
	
		this.options = {
			script_path:            "",
			height: 				this._el.container.offsetHeight,
			width: 					this._el.container.offsetWidth,
			layout: 				"landscape", 	// portrait or landscape
			timenav_position: 		"bottom", 		// timeline on top or bottom
			base_class: 			"",
			timenav_height: 		200,
			start_at_slide: 		0,
			menubar_height: 		0,
			skinny_size: 			650,
			relative_date: 			false, 			// Use momentjs to show a relative date from the slide.text.date.created_time field
			// animation
			duration: 				1000,
			ease: 					VCO.Ease.easeInOutQuint,
			// interaction
			dragging: 				true,
			trackResize: 			true,
			map_type: 				"stamen:toner-lite",
			slide_padding_lr: 		100, 			// padding on slide of slide
			slide_default_fade: 	"0%", 			// landscape fade
			menubar_default_y: 		0,
			map_popup: 				false,
			zoom_distance: 			100,
			line_follows_path: 		true,   		// Map history path follows default line, if false it will connect previous and current only
			line_color: 			"#c34528", //"#DA0000",
			line_color_inactive: 	"#CCC",
			line_join: 				"miter",
			line_weight: 			3,
			line_opacity: 			0.80,
			line_dash: 				"5,5",
			api_key_flickr: 		"f2cc870b4d233dd0a5bfe73fd0d64ef0",
			language:               "en"		
		};
		
		// Current Slide
		this.current_slide = this.options.start_at_slide;
		
		// Animation Objects
		this.animator_timenav = null;
		this.animator_storyslider = null;
		
		// Merge Options
		VCO.Util.mergeData(this.options, options);
		
		if (this.options.layout == "landscape") {
			this.options.map_center_offset = {left: -200, top: 0};
		}
		
		// Zoomify Layout
		if (this.options.map_type == "zoomify" && this.options.map_as_image) {
			this.options.map_size_sticky = 2;
			
		}
		
		// Map as Image 
		if (this.options.map_as_image) {
			this.options.calculate_zoom = false;
		}
		
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
		
		

	},
	
	/*	Load Language
	================================================== */
	_loadLanguage: function(data) {
		var self = this;
		if(this.options.language == 'en') {
		    this.options.language = VCO.Language;
		    this._initData(data);
		} else {
			VCO.Load.js(this.options.script_path + "/locale/" + this.options.language + ".js", function() {
				self._initData(data);
			});
		}
	},
	
	/*	Navigation
	================================================== */
	goToId: function(n) {
		if (this.current_id != n) {
			this.current_id = e.uniqueid;
			this._timenav.goToId(this.current_id);
			this._storyslider.goToId(this.current_id);
			this.fire("change", {uniqueid:this.current_id}, this);
		}
	},
	
	goTo: function(n) {
		if (n != this.current_slide) {
			this.current_slide = n;
			this._storyslider.goTo(this.current_slide);
			this._map.goTo(this.current_slide);
		}
	},

	updateDisplay: function() {
		if (this.ready) {
			this._updateDisplay();
		}
	},
	
	/*	Private Methods
	================================================== */
	
	// Update View
	_updateDisplay: function(timenav_height, animate, d) {
		var duration 		= this.options.duration,
			display_class 	= this.options.base_class,
			self			= this;
		
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
		
		
		// Map Height
		if (timenav_height) {
			this.options.timenav_height = timenav_height;
		}
		
		
		// Detect Mobile and Update Orientation on Touch devices
		if (VCO.Browser.touch) {
			this.options.layout = VCO.Browser.orientation();
			display_class += " vco-mobile";
		}
		
		// LAYOUT
		if (this.options.layout == "portrait") {
			display_class += " vco-skinny";
			// Map Offset
			//this._map.setMapOffset(0, 0);
			
			//this.options.timenav_height 		= 0;//(this.options.height / this.options.map_size_sticky);
			this.options.storyslider_height = (this.options.height - this.options.timenav_height - 1);
			
			// Portrait
			display_class += " vco-layout-portrait";
			
			
			
			if (animate) {
			
				// Animate Map
				if (this.animator_timenav) {
					this.animator_timenav.stop();
				}
			
				this.animator_timenav = VCO.Animate(this._el.map, {
					height: 	(this.options.timenav_height) + "px",
					duration: 	duration,
					easing: 	VCO.Ease.easeOutStrong,
					complete: function () {
						//self._map.updateDisplay(self.options.width, self.options.timenav_height, animate, d, self.options.menubar_height);
					}
				});
			
				// Animate StorySlider
				if (this.animator_storyslider) {
					this.animator_storyslider.stop();
				}
				this.animator_storyslider = VCO.Animate(this._el.storyslider, {
					height: 	this.options.storyslider_height + "px",
					duration: 	duration,
					easing: 	VCO.Ease.easeOutStrong
				});
			
			} else {
				// Map
				this._el.timenav.style.height = Math.ceil(this.options.timenav_height) + "px";
			
				// StorySlider
				this._el.storyslider.style.height = this.options.storyslider_height + "px";
			}
			
			// Update Component Displays
			this._timenav.updateDisplay(this.options.width, this.options.height, animate);
			this._storyslider.updateDisplay(this.options.width, this.options.storyslider_height, animate, this.options.layout);
			
		} else {
			
			// Landscape
			display_class += " vco-layout-landscape";
			
			this.options.storyslider_height = this.options.height - this.options.timenav_height;
			
			// Map Padding
			//this._map.padding = [0,this.options.width/2];
			
			this._el.timenav.style.height = this.options.timenav_height + "px";
			
			// StorySlider
			this._el.storyslider.style.top = 0;
			this._el.storyslider.style.height = this.options.storyslider_height + "px";
			
			this._timenav.updateDisplay(this.options.width, this.options.height, animate);
			this._storyslider.updateDisplay(this.options.width, this.options.storyslider_height, animate, this.options.layout);
		}
		
		
		
		// Apply class
		this._el.container.className = display_class;
		
		
	},
	
	/*	Data Prep
	================================================== */
	_makeUniqueIdentifiers: function(array) {
		for (var i = 0; i < array.length; i++) {
			if (!array[i].uniqueid || array[i].uniqueid == "") {
				array[i].uniqueid = VCO.Util.unique_ID(6, "vco-slide");
			}
		};
	},
	
	/*	Init
	================================================== */
	// Initialize the data
	_initData: function(data) {
		trace("_initData")
		var self = this;
		
		if (typeof data === 'string') {
			trace("string");
			
			VCO.ajax({
				type: 'GET',
				url: data,
				dataType: 'json', //json data type
				success: function(d){
					if (d && d.timeline) {
						VCO.Util.mergeData(self.data, d.timeline);
					}
					self._makeUniqueIdentifiers(self.data.slides);
					self._onDataLoaded();
				},
				error:function(xhr, type){
					trace("ERROR LOADING");
					trace(xhr);
					trace(type);
				}
			});
		} else if (typeof data === 'object') {
			if (data.timeline) {
				self.data = data.timeline;
			} else {
				trace("data must have a timeline property")
			}
			self._onDataLoaded();
		} else {
			self._onDataLoaded();
		}
	},
	
	// Initialize the layout
	_initLayout: function () {
		var self = this;
		
		this._el.container.className += ' vco-timeline';
		this.options.base_class = this._el.container.className;
		
		// Create Layout
		if (this.options.timenav_position == "top") {
			this._el.timenav 		= VCO.Dom.create('div', 'vco-timenav', this._el.container);
			this._el.storyslider 	= VCO.Dom.create('div', 'vco-storyslider', this._el.container);
		} else {
			this._el.storyslider 	= VCO.Dom.create('div', 'vco-storyslider', this._el.container);
			this._el.timenav 		= VCO.Dom.create('div', 'vco-timenav', this._el.container);
		}
		

		
		// Initial Default Layout
		this.options.width 				= this._el.container.offsetWidth;
		this.options.height 			= this._el.container.offsetHeight;
		this._el.storyslider.style.top 	= "1px";
		
		// Create Map using preferred Map API
		//this._map = new VCO.Map.Leaflet(this._el.map, this.data, this.options);
		//this.map = this._map._map; // For access to Leaflet Map.
		//this._map.on('loaded', this._onMapLoaded, this);
		
		// Map Background Color
		//this._el.map.style.backgroundColor = this.options.map_background_color;
		
		// Create TimeNav
		this._timenav = new VCO.TimeNav(this._el.timenav, this.data, this.options);
		this._timenav.on('loaded', this._onTimeNavLoaded, this);
		this._timenav.init();
		
		// Create StorySlider
		this._storyslider = new VCO.StorySlider(this._el.storyslider, this.data, this.options);
		this._storyslider.on('loaded', this._onStorySliderLoaded, this);
		this._storyslider.init();
		
		// LAYOUT
		if (this.options.layout == "portrait") {
			this.options.storyslider_height = (this.options.height - this._el.menubar.offsetHeight - this.options.timenav_height - 1);
		} else {
			this.options.menubar_height = this._el.menubar.offsetHeight;
			this.options.storyslider_height = (this.options.height - this._el.menubar.offsetHeight - 1);
		}
		
		
		// Update Display
		this._updateDisplay(this.options.timenav_height, true, 2000);
		
	},
	
	_initEvents: function () {
		
		// TimeNav Events
		this._timenav.on('collapse', this._onMenuBarCollapse, this);
		this._timenav.on('change', this._onTimeNavChange, this);
		
		// StorySlider Events
		this._storyslider.on('change', this._onSlideChange, this);
		this._storyslider.on('colorchange', this._onColorChange, this);
	},
	
	/*	Set Current Slide
	================================================== */
	_getCurrentSlide: function(n, array) {
		// Find Array Number
		if (typeof n == 'string' || n instanceof String) {
			_n = VCO.Util.findArrayNumberByUniqueID(n, array, "uniqueid");
		} else {
			_n = n;
		}
		return _n;
	},
	
	/*	Events
	================================================== */
	
	_onDataLoaded: function(e) {
		trace("dataloaded");
		this.fire("dataloaded");
		this._initLayout();
		this._initEvents();
		this.ready = true;
		
	},
	
	_onColorChange: function(e) {
		if (e.color || e.image) {
			
		} else {
			
		}
	},
	
	_onSlideChange: function(e) {
		if (this.current_id != e.uniqueid) {
			this.current_id = e.uniqueid;
			this._timenav.goToId(this.current_id);
			this.fire("change", {uniqueid:this.current_id}, this);
		}
	},
	
	_onTimeNavChange: function(e) {
		if (this.current_id != e.uniqueid) {
			this.current_id = e.uniqueid;
			this._storyslider.goToId(this.current_id);
			this.fire("change", {uniqueid:this.current_id}, this);
		}
	},
	
	_onOverview: function(e) {
		this._timenav.goToOverview();
	},
	
	_onBackToStart: function(e) {
		this.current_slide = 0;
		this._timenav.goTo(this.current_slide);
		this._storyslider.goTo(this.current_slide);
		this.fire("change", {current_slide: this.current_slide}, this);
	},
	
	_onMenuBarCollapse: function(e) {
		this._updateDisplay(e.y, true);
	},
	
	_onMouseClick: function(e) {
		
	},
	
	_fireMouseEvent: function (e) {
		if (!this._loaded) {
			return;
		}

		var type = e.type;
		type = (type === 'mouseenter' ? 'mouseover' : (type === 'mouseleave' ? 'mouseout' : type));

		if (!this.hasEventListeners(type)) {
			return;
		}

		if (type === 'contextmenu') {
			VCO.DomEvent.preventDefault(e);
		}
		
		this.fire(type, {
			latlng: "something", //this.mouseEventToLatLng(e),
			layerPoint: "something else" //this.mouseEventToLayerPoint(e)
		});
	},
	
	_onTimeNavLoaded: function() {
		this._loaded.timenav = true;
		this._onLoaded();
	},
	
	_onStorySliderLoaded: function() {
		this._loaded.storyslider = true;
		this._onLoaded();
	},
		
	_onLoaded: function() {
		if (this._loaded.storyslider && this._loaded.timenav) {
			this.fire("loaded", this.data);
		}
	}
	
	
});


