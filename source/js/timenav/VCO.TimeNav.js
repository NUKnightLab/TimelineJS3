/*	VCO.TimeNav
	
================================================== */
  
VCO.TimeNav = VCO.Class.extend({
	
	includes: [VCO.Events, VCO.DomMixins],
	
	_el: {},
	
	/*	Constructor
	================================================== */
	initialize: function (elem, data, options, init) {
		// DOM ELEMENTS
		this._el = {
			parent: {},
			container: {},
			slider: {},
			slider_background: {},
			line: {},
			marker_container_mask: {},
			marker_container: {},
			marker_item_container: {},
			timeaxis: {},
			timeaxis_background: {}
		};
		
		this.collapsed = false;
		
		if (typeof elem === 'object') {
			this._el.container = elem;
		} else {
			this._el.container = VCO.Dom.get(elem);
		}
		
		// Data Object
		this.data = {
			uniqueid: 				"",
			slides: 				[
				{
					uniqueid: 				"",
					background: {			// OPTIONAL
						url: 				null,
						color: 				null,
						opacity: 			50
					},
					date: 					null,
					location: {
						lat: 				-9.143962,
						lon: 				38.731094,
						zoom: 				13,
						icon: 				"http://maps.gstatic.com/intl/en_us/mapfiles/ms/micons/blue-pushpin.png"
					},
					text: {
						headline: 			"Slideshow Example",
						text: 				"Example slideshow slide "
					},
					media: [
						{
							uniqueid: 				"",
							text: {
								headline: 			"Slideshow Example",
								text: 				""
							},
							media: {
								url: 				"http://2.bp.blogspot.com/-dxJbW0CG8Zs/TmkoMA5-cPI/AAAAAAAAAqw/fQpsz9GpFdo/s1600/voyage-dans-la-lune-1902-02-g.jpg",
								credit:				"",
								caption:			"",
								link: 				null,
								link_target: 		null
							}
						},
						{
							uniqueid: 				"",
							text: {
								headline: 			"Slideshow Example",
								text: 				""
							},
							media: {
								url: 				"http://2.bp.blogspot.com/-dxJbW0CG8Zs/TmkoMA5-cPI/AAAAAAAAAqw/fQpsz9GpFdo/s1600/voyage-dans-la-lune-1902-02-g.jpg",
								credit:				"",
								caption:			"",
								link: 				null,
								link_target: 		null
							}
						},
						{
							uniqueid: 				"",
							text: {
								headline: 			"Slideshow Example",
								text: 				""
							},
							media: {
								url: 				"http://2.bp.blogspot.com/-dxJbW0CG8Zs/TmkoMA5-cPI/AAAAAAAAAqw/fQpsz9GpFdo/s1600/voyage-dans-la-lune-1902-02-g.jpg",
								credit:				"",
								caption:			"",
								link: 				null,
								link_target: 		null
							}
						},
						{
							uniqueid: 				"",
							text: {
								headline: 			"Slideshow Example",
								text: 				""
							},
							media: {
								url: 				"http://2.bp.blogspot.com/-dxJbW0CG8Zs/TmkoMA5-cPI/AAAAAAAAAqw/fQpsz9GpFdo/s1600/voyage-dans-la-lune-1902-02-g.jpg",
								credit:				"",
								caption:			"",
								link: 				null,
								link_target: 		null
							}
						}
					]
				},
				{
					uniqueid: 				"",
					background: {			// OPTIONAL
						url: 				null,
						color: 				null,
						opacity: 			50
					},
					date: 					null,
					location: {
						lat: 				-9.143962,
						lon: 				38.731094,
						zoom: 				13,
						icon: 				"http://maps.gstatic.com/intl/en_us/mapfiles/ms/micons/blue-pushpin.png"
					},
					text: {
						headline: 			"YouTube",
						text: 				"Just add a link to the video in the media field."
					},
					media: {
						url: 				"http://www.youtube.com/watch?v=lIvftGgps24",
						credit:				"",
						caption:			"",
						link: 				null,
						link_target: 		null
					}
				}
			]
		};
		
		//Options
		this.options = {
			width: 					600,
			height: 				600,
			duration: 				1000,
			ease: 					VCO.Ease.easeInOutQuint,
			optimal_tick_width: 	50,
			scale_factor: 			2, 				// How many screen widths wide should the timeline be
			marker_padding: 		5,
			timenav_height_min: 	150, 			// Minimum timenav height
			marker_height_min: 		30, 			// Minimum Marker Height
			marker_width_min: 		100 			// Minimum Marker Width
		};
		
		// Animation
		this.animator = null;
		
		// Markers Array
		this._markers = [];
		this._marker_ticks = [];
		
		// Current Marker
		this.current_marker = 0;
		
		// TimeScale
		this.timescale = {};
		
		// TimeAxis
		this.timeaxis = {};
		this.axishelper = {};
		
		// Swipe Object
		this._swipable;
		
		// Merge Data and Options
		VCO.Util.mergeData(this.options, options);
		VCO.Util.mergeData(this.data, data);
		
		if (init) {
			this.init();
		}
	},
	
	init: function() {
		this._initLayout();
		this._initEvents();
		this._initData();
		this._updateDisplay();
		
		// Go to initial slide
		//this.goTo(this.options.start_at_slide);
		
		this._onLoaded();
	},
	
	/*	Public
	================================================== */
	show: function(d) {
		
		var duration = this.options.duration;
		if (d) {
			duration = d;
		}
		/*
		this.animator = VCO.Animate(this._el.container, {
			top: 		this.options.menubar_default_y + "px",
			duration: 	duration,
			easing: 	VCO.Ease.easeOutStrong
		});
		*/
	},
	
	hide: function(top) {
		/*
		this.animator = VCO.Animate(this._el.container, {
			top: 		top,
			duration: 	this.options.duration,
			easing: 	VCO.Ease.easeOutStrong
		});
		*/
	},
	
	positionMarkers: function() {
		this._positionMarkers();
	},
	
	/*	Update Display
	================================================== */
	updateDisplay: function(w, h, a, l) {
		this._updateDisplay(w, h, a, l);
	},
	

	
	/*	TimeScale
	================================================== */
	_getTimeScale: function() {
		this.timescale = new VCO.TimeScale(this.data.slides, this._el.container.offsetWidth, this.options.scale_factor);
	},
	
	/*	Markers
	================================================== */
	_createMarkers: function(array) { 
		for (var i = 0; i < array.length; i++) {
			array[i].marker_number = i;
			this._createMarker(array[i]);
		};
		
	},
	
	_createMarker: function(data) {
		var marker = new VCO.TimeMarker(data, this.options);
		this._addMarker(marker);
		this._markers.push(marker);
		this._marker_ticks.push(marker.getTime());
	},
	
	_addMarker:function(marker) {
		marker.addTo(this._el.marker_item_container);
		marker.on('markerclick', this._onMarkerClick, this);
		marker.on('added', this._onMarkerAdded, this);
	},
	
	_removeMarker: function(marker) {
		marker.removeFrom(this._el.marker_item_container);
		//marker.off('added', this._onMarkerRemoved, this);
	},
	
	_positionMarkers: function() {
		// POSITION X
		for (var i = 0; i < this._markers.length; i++) {
			var pos = this.timescale.getPositionInfo(i);
			this._markers[i].setPosition({left:pos.start});
			this._markers[i].setWidth(pos.width);
		};
		
	},
	
	_assignRowsToMarkers: function() {
		var available_height = (this.options.height - this._el.timeaxis_background.offsetHeight - (this.options.marker_padding));
		
		for (var i = 0; i < this._markers.length; i++) {
			
			// Set Height
			var marker_height = Math.floor((available_height /this.timescale.getNumberOfRows()) - this.options.marker_padding);
			this._markers[i].setHeight(marker_height);
			
			//Position by Row
			var row = this.timescale.getPositionInfo(i).row;
			var marker_y = Math.floor(row * (marker_height + this.options.marker_padding)) + this.options.marker_padding;
			
			var remainder_height = available_height - marker_y + this.options.marker_padding;
			this._markers[i].setRowPosition(marker_y, remainder_height);
		};
		
	},
	
	_resetMarkersActive: function() {
		for (var i = 0; i < this._markers.length; i++) {
			this._markers[i].setActive(false);
		};
	},
	
	/*	Navigation
	================================================== */
	goToId: function(n, fast, displayupdate) {
		if (typeof n == 'string' || n instanceof String) {
			_n = VCO.Util.findArrayNumberByUniqueID(n, this._markers, "uniqueid");
		} else {
			_n = n;
		}
		
		this.goTo(_n, fast, displayupdate);
		
	},
	
	goTo: function(n, fast, displayupdate) {
		
		var self = 	this;

		// Set Marker active state
		this._resetMarkersActive();
		this._markers[n].setActive(true);
		
		// Move container to marker position
		
		// Stop animation
		if (this.animator) {
			this.animator.stop();
		}
		
		if (fast) {
			this._el.slider.style.left = -this._markers[n].getLeft() + (this.options.width/2) + "px";
		} else {
			this.animator = VCO.Animate(this._el.slider, {
				left: 		-this._markers[n].getLeft() + (this.options.width/2) + "px",
				duration: 	this.options.duration,
				easing: 	this.options.ease
			});
			
		}
		
		//this._el.slider.style.left = -this._markers[n].getLeft() + (this.options.width/2) + "px";
		this.current_marker = n;
		
	},
	
	
	
	/*	Events
	================================================== */
	
	_onLoaded: function() {
		this.fire("loaded", this.data);
	},
	
	_onMarkerAdded: function(e) {

		this.fire("dateAdded", this.data);
	},
	
	_onMarkerRemoved: function(e) {
		this.fire("dateRemoved", this.data);
	},
	
	_onMarkerClick: function(e) {
		// Go to the current marker
		this.goTo(e.marker_number);
		this.fire("change", {uniqueid: e.uniqueid});
	},
	
	
	/*	Private Methods
	================================================== */
	
	// Update Display
	_updateDisplay: function(width, height, animate) {
		
		if (width) {
			this.options.width = width;
		}
		if (height) {
			this.options.height = height;
		}
		
		// Size Markers
		this._assignRowsToMarkers();
		
		// Go to the current slide
		this.goTo(this.current_marker, true, true);
	},
	
	_drawTimeline: function() {
		this._getTimeScale();
		this.timeaxis.drawTicks(this.timescale, this.options.optimal_tick_width, this._marker_ticks);
		this._positionMarkers();
		this._assignRowsToMarkers();
	},
	
	_updateDrawTimeline: function() {
		this._getTimeScale();
		this.timeaxis.positionTicks(this.timescale, this.options.optimal_tick_width);
		this._positionMarkers();
		this._assignRowsToMarkers();
	},
	
	_onDragMove: function(e) {
		
	},
	
	/*	Init
	================================================== */
	_initLayout: function () {
		// Create Layout
		this._el.line						= VCO.Dom.create('div', 'vco-timenav-line', this._el.container);
		this._el.slider						= VCO.Dom.create('div', 'vco-timenav-slider', this._el.container);
		this._el.slider_background			= VCO.Dom.create('div', 'vco-timenav-slider-background', this._el.slider);
		this._el.marker_container_mask		= VCO.Dom.create('div', 'vco-timenav-container-mask', this._el.slider);
		this._el.marker_container			= VCO.Dom.create('div', 'vco-timenav-container', this._el.marker_container_mask);
		this._el.marker_item_container		= VCO.Dom.create('div', 'vco-timenav-item-container', this._el.marker_container);
		this._el.timeaxis 					= VCO.Dom.create('div', 'vco-timeaxis', this._el.slider);
		this._el.timeaxis_background 		= VCO.Dom.create('div', 'vco-timeaxis-background', this._el.container);
		
		// Time Axis
		this.timeaxis = new VCO.TimeAxis(this._el.timeaxis);
		
		// Update Size
		this.options.width = this._el.container.offsetWidth;
		this.options.height = this._el.container.offsetHeight;
		
		// Swipable
		this._swipable = new VCO.Swipable(this._el.slider_background, this._el.slider, {
			enable: {x:true, y:false},
			constraint: {top: false,bottom: false,left: false,right: false},
			snap: 	false
		});
		this._swipable.on('dragmove', this._onDragMove, this);
		this._swipable.enable();
		
		// Buttons
		//this._el.button_overview 						= VCO.Dom.create('span', 'vco-timenav-button', this._el.container);
		//VCO.DomEvent.addListener(this._el.button_overview, 'click', this._onButtonOverview, this);
		
		//this._el.button_backtostart 					= VCO.Dom.create('span', 'vco-timenav-button', this._el.container);
		//VCO.DomEvent.addListener(this._el.button_backtostart, 'click', this._onButtonBackToStart, this);
		
		//this._el.button_collapse_toggle 				= VCO.Dom.create('span', 'vco-timenav-button', this._el.container);
		//VCO.DomEvent.addListener(this._el.button_collapse_toggle, 'click', this._onButtonCollapseMap, this);
		
		
		
		
	},
	
	_initEvents: function () {
		
	},
	
	_initData: function() {
		// Create Markers and then add them
		this._createMarkers(this.data.slides);
		this._drawTimeline();
	}
	
	
});