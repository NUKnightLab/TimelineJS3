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
			marker_container_mask: {},
			marker_container: {},
			marker_item_container: {}
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
			ease: 					VCO.Ease.easeInOutQuint
		};
		
		// Animation
		this.animator = {};
		
		// Markers Array
		this._markers = [];
		
		// Current Marker
		this.current_marker = 0;
		
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
	
	// Create Dates
	createDates: function(array) {
		this._createDates(array);
	},
	
	// Create a date
	createDate: function(d) {
		this._createDate(d);
	},
	
	positionMarkers: function() {
		this._positionMarkers();
	},
	
	/*	Update Display
	================================================== */
	updateDisplay: function(w, h, a, l) {
		this._updateDisplay(w, h, a, l);
	},
	
	/*	Dates
	================================================== */
	_createDates: function(array) {
		for (var i = 0; i < array.length; i++) {
			this._createDate(array[i]);
		};
	},
	
	_createDate: function(d) {
		var date = new VCO.Date(d.date);
		trace("date");
		//this._addDate(date);
		this._markers.push(date);
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
		var marker = new VCO.TimeMarker(data);
		this._addMarker(marker);
		this._markers.push(marker);
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
		// Temporary Position Markers
		for (var i = 0; i < this._markers.length; i++) {
			this._markers[i].setPosition({left:(100 * i), top:0});
		};
	},
	
	_resetMarkersActive: function() {
		for (var i = 0; i < this._markers.length; i++) {
			this._markers[i].setActive(false);
		};
	},
	
	/*	Navigation
	================================================== */
	
	goTo: function(n, fast, displayupdate) {
		
		var self = this;
		
		// Set Marker active state
		this._resetMarkersActive();
		this._markers[n].setActive(true);
		
		this.current_marker = n;
		
	},
	
	/*	Events
	================================================== */
	
	_onLoaded: function() {
		this.fire("loaded", this.data);
	},
	
	_onMarkerAdded: function(e) {
		trace("dateAdded")
		this.fire("dateAdded", this.data);
	},
	
	_onMarkerRemoved: function(e) {
		this.fire("dateRemoved", this.data);
	},
	
	_onMarkerClick: function(e) {
		// Go to the current marker
		this.goTo(e.marker_number);
		this.fire("change", {current_marker: e.marker_number});
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
		
		// Go to the current slide
		this.goTo(this.current_marker, true, true);
	},
	
	/*	Init
	================================================== */
	_initLayout: function () {
		// Create Layout

		this._el.marker_container_mask		= VCO.Dom.create('div', 'vco-timenav-container-mask', this._el.container);
		this._el.marker_container			= VCO.Dom.create('div', 'vco-timenav-container vcoanimate', this._el.marker_container_mask);
		this._el.marker_item_container		= VCO.Dom.create('div', 'vco-timenav-item-container', this._el.marker_container);
		
		// Update Size
		this.options.width = this._el.container.offsetWidth;
		this.options.height = this._el.container.offsetHeight;
		// Buttons
		//this._el.button_overview 						= VCO.Dom.create('span', 'vco-timenav-button', this._el.container);
		//VCO.DomEvent.addListener(this._el.button_overview, 'click', this._onButtonOverview, this);
		
		//this._el.button_backtostart 					= VCO.Dom.create('span', 'vco-timenav-button', this._el.container);
		//VCO.DomEvent.addListener(this._el.button_backtostart, 'click', this._onButtonBackToStart, this);
		
		//this._el.button_collapse_toggle 				= VCO.Dom.create('span', 'vco-timenav-button', this._el.container);
		//VCO.DomEvent.addListener(this._el.button_collapse_toggle, 'click', this._onButtonCollapseMap, this);
		
		
		if (VCO.Browser.mobile) {
		}
		
		
	},
	
	_initEvents: function () {
		
	},
	
	_initData: function() {
		// Create Markers and then add them
		this._createMarkers(this.data.slides);
		this._positionMarkers();
	}
	
	
});