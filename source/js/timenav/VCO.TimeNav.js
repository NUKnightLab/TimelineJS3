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
		this.data = {};
		
		//Options
		this.options = {
			width: 					600,
			height: 				600,
			duration: 				1000,
			ease: 					VCO.Ease.easeInOutQuint,
			has_groups: 			false,
			optimal_tick_width: 	50,
			scale_factor: 			2, 				// How many screen widths wide should the timeline be
			marker_padding: 		5,
			timenav_height_min: 	150, 			// Minimum timenav height
			marker_height_min: 		30, 			// Minimum Marker Height
			marker_width_min: 		100, 			// Minimum Marker Width
			zoom_sequence:          [0.5, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89] // Array of Fibonacci numbers for TimeNav zoom levels http://www.maths.surrey.ac.uk/hosted-sites/R.Knott/Fibonacci/fibtable.html
		};
		
		// Animation
		this.animator = null;
		
		// Markers Array
		this._markers = [];
		
		// Groups Array
		this._groups = [];
		
		// Row Height
		this._calculated_row_height = 100;
		
		// Current Marker
		this.current_id = "";
		
		// TimeScale
		this.timescale = {};
		
		// TimeAxis
		this.timeaxis = {};
		this.axishelper = {};
		
		// Max Rows
		this.max_rows = 6;
		
		// Animate CSS
		this.animate_css = false;
		
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
				
		this._onLoaded();
	},
	
	/*	Public
	================================================== */
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
		/* maybe the establishing config values (marker_height_min and max_rows) should be
		separated from making a TimeScale object, which happens in another spot in this file with duplicate mapping of properties of this TimeNav into the TimeScale options object? */
		// Set Max Rows
		var marker_height_min = 0;
		try {
			marker_height_min = parseInt(this.options.marker_height_min);
		} catch(e) {
			trace("Invalid value for marker_height_min option."); 
			marker_height_min = 30;
		}
		if (marker_height_min == 0) {
			trace("marker_height_min option must not be zero.")
			marker_height_min = 30;
		}
		this.max_rows = Math.round((this.options.height - this._el.timeaxis_background.offsetHeight - (this.options.marker_padding)) / marker_height_min);
		if (this.max_rows < 1) {
			this.max_rows = 1;
		}
		return new VCO.TimeScale(this.data, {
            display_width: this._el.container.offsetWidth,
            screen_multiplier: this.options.scale_factor,
            max_rows: this.max_rows

		});
	},
	
	_updateTimeScale: function(new_scale) {
		this.options.scale_factor = new_scale;
		this._updateDrawTimeline();
	},
	
	zoomIn: function(n) {
		var new_scale = 1;
		for (var i = 0; i < this.options.zoom_sequence.length; i++) {
			
			if (this.options.scale_factor == this.options.zoom_sequence[i]) {
				if (this.options.scale_factor == this.options.zoom_sequence[this.options.zoom_sequence.length - 1]) {
					new_scale = this.options.scale_factor;
				} else {
					new_scale = this.options.zoom_sequence[i + 1];
				}
			}
		};

		this.options.scale_factor = new_scale;
		//this._updateDrawTimeline(true);
		this.goToId(this.current_id, !this._updateDrawTimeline(true), true);
	},
	
	zoomOut: function(n) {
		if (this.options.scale_factor > 0) {
			var new_scale = 1;
			for (var i = 0; i < this.options.zoom_sequence.length; i++) {
			
				if (this.options.scale_factor == this.options.zoom_sequence[i]) {
					if (this.options.scale_factor == this.options.zoom_sequence[0]) {
						new_scale = this.options.zoom_sequence[0];
					} else {
						new_scale = this.options.zoom_sequence[i -1];
					}
				}
			};
			
			this.options.scale_factor = new_scale;
			//this._updateDrawTimeline(true);
			this.goToId(this.current_id, !this._updateDrawTimeline(true), true);
		}
		
	},
	
	/*	Groups
	================================================== */
	_createGroups: function() {
		var group_labels = this.timescale.getGroupLabels();
		
		if (group_labels) {
			this.options.has_groups = true;
			for (var i = 0; i < group_labels.length; i++) {
				this._createGroup(group_labels[i]);
			}
		}
		
	},
	
	_createGroup: function(group_label) {
		var group = new VCO.TimeGroup(group_label);
		this._addGroup(group);
		this._groups.push(group);
	},
	
	_addGroup:function(group) {
		group.addTo(this._el.container);
		
	},
	
	_positionGroups: function() {
		if (this.options.has_groups) {
			var available_height 	= (this.options.height - this._el.timeaxis_background.offsetHeight ),
				group_height 		= Math.floor((available_height /this.timescale.getNumberOfRows()) - this.options.marker_padding),
				group_labels		= this.timescale.getGroupLabels();
			
			for (var i = 0, group_rows = 0; i < this._groups.length; i++) {
				var group_y = Math.floor(group_rows * (group_height + this.options.marker_padding));
				
				this._groups[i].setRowPosition(group_y, this._calculated_row_height + this.options.marker_padding/2); 
				this._groups[i].setAlternateRowColor(VCO.Util.isEven(i));
				
				group_rows += this._groups[i].data.rows;    // account for groups spanning multiple rows
			}
		}		
	},
	
	/*	Markers
	================================================== */
	_addMarker:function(marker) {
		marker.addTo(this._el.marker_item_container);
		marker.on('markerclick', this._onMarkerClick, this);
		marker.on('added', this._onMarkerAdded, this);
	},

	_createMarker: function(data, n) {
		var marker = new VCO.TimeMarker(data, this.options);
		this._addMarker(marker);
		if(n < 0) {
		    this._markers.push(marker);
		} else {
		    this._markers.splice(n, 0, marker);
		}
	},

	_createMarkers: function(array) { 
		for (var i = 0; i < array.length; i++) {
			this._createMarker(array[i], -1);
		}		
	},
	
	_removeMarker: function(marker) {
		marker.removeFrom(this._el.marker_item_container);
		//marker.off('added', this._onMarkerRemoved, this);
	},
	
	_destroyMarker: function(n) {
	    this._removeMarker(this._markers[n]);
	    this._markers.splice(n, 1);
	},
		
	_positionMarkers: function(fast) {
		// POSITION X
		for (var i = 0; i < this._markers.length; i++) {
			var pos = this.timescale.getPositionInfo(i);
			if (fast) {
				this._markers[i].setClass("vco-timemarker vco-timemarker-fast");
			} else {
				this._markers[i].setClass("vco-timemarker");
			}
			this._markers[i].setPosition({left:pos.start});
			this._markers[i].setWidth(pos.width);
		};
		
	},
	
	_assignRowsToMarkers: function() {
		var available_height 	= (this.options.height - this._el.timeaxis_background.offsetHeight - (this.options.marker_padding)),
			marker_height 		= Math.floor((available_height /this.timescale.getNumberOfRows()) - this.options.marker_padding);
			
		this._calculated_row_height = Math.floor(available_height /this.timescale.getNumberOfRows());
			
		for (var i = 0; i < this._markers.length; i++) {
			
			// Set Height
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
	
	_findMarkerIndex: function(n) {	
	    var _n = -1;
		if (typeof n == 'string' || n instanceof String) {
			_n = VCO.Util.findArrayNumberByUniqueID(n, this._markers, "uniqueid", _n);
		} 
		return _n;
	},

	/*	Public
	================================================== */
	
	// Create a marker
	createMarker: function(d, n) {
	    this._createMarker(d, n);
	},
	
	// Create many markers from an array
	createMarkers: function(array) {
	    this._createMarkers(array);
	},
	
	// Destroy marker by index
	destroyMarker: function(n) {
	    this._destroyMarker(n);
	},
	
	// Destroy marker by id
	destroyMarkerId: function(id) {
	    this.destroyMarker(this._findMarkerIndex(id));
	},
	
	/*	Navigation
	================================================== */	
	goTo: function(n, fast, css_animation) {		
		var self = 	this,
			_ease = this.options.ease,
			_duration = this.options.duration,
			_n = (n < 0) ? 0 : n; 
		
		// Set Marker active state
		this._resetMarkersActive();
		if(n >= 0 && n < this._markers.length) {
		    this._markers[n].setActive(true);
		}
		// Stop animation
		if (this.animator) {
			this.animator.stop();
		}
		
		if (fast) {
			this._el.slider.className = "vco-timenav-slider";
			this._el.slider.style.left = -this._markers[_n].getLeft() + (this.options.width/2) + "px";
		} else {
			if (css_animation) {
				this._el.slider.className = "vco-timenav-slider vco-timenav-slider-animate";
				this.animate_css = true;
				this._el.slider.style.left = -this._markers[_n].getLeft() + (this.options.width/2) + "px";
			} else {
				this._el.slider.className = "vco-timenav-slider";
				this.animator = VCO.Animate(this._el.slider, {
					left: 		-this._markers[_n].getLeft() + (this.options.width/2) + "px",
					duration: 	_duration,
					easing: 	_ease
				});
			}
		}
		
		if(n >= 0 && n < this._markers.length) {
		    this.current_id = this._markers[n].data.uniqueid;
		} else {
		    this.current_id = '';
		}
	},

	goToId: function(id, fast, css_animation) {
		this.goTo(this._findMarkerIndex(id), fast, css_animation);		
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
		// Go to the clicked marker
		this.goToId(e.uniqueid);
		this.fire("change", {uniqueid: e.uniqueid});
	},
	
	_onMouseScroll: function(e) {
		
		var delta		= 0,
			scroll_to	= 0,
			constraint 	= {
				right: 	-(this.timescale.getPixelWidth() - (this.options.width/2)),
				left: 	this.options.width/2
			};
		if (!e) {
			e = window.event;
		}
		if (e.originalEvent) {
			e = e.originalEvent;
		}
		
		// Webkit and browsers able to differntiate between up/down and left/right scrolling
		if (typeof e.wheelDeltaX != 'undefined' ) {
			delta = e.wheelDeltaY/6;
			if (Math.abs(e.wheelDeltaX) > Math.abs(e.wheelDeltaY)) {
				delta = e.wheelDeltaX/6;
			} else {
				//delta = e.wheelDeltaY/6;
				delta = 0;
			}
		}
		if (delta) {
			if (e.preventDefault) {
				 e.preventDefault();
			}
			e.returnValue = false;
		}
		// Stop from scrolling too far
		scroll_to = parseInt(this._el.slider.style.left.replace("px", "")) + delta;
		
		
		if (scroll_to > constraint.left) {
			scroll_to = constraint.left;
		} else if (scroll_to < constraint.right) {
			scroll_to = constraint.right;
		}
		
		if (this.animate_css) {
			this._el.slider.className = "vco-timenav-slider";
			this.animate_css = false;
		}
		
		this._el.slider.style.left = scroll_to + "px";
		
	},
	
	_onDragMove: function(e) {
		if (this.animate_css) {
			this._el.slider.className = "vco-timenav-slider";
			this.animate_css = false;
		}
		
	},
	
	/*	Private Methods
	================================================== */
	// Update Display
	_updateDisplay: function(width, height, animate) {
		
		if (width) {
			this.options.width = width;
		}
		if (height && height != this.options.height) {
			this.options.height = height;
			this.timescale = this._getTimeScale();
		}
		
		// Size Markers
		this._assignRowsToMarkers();
		
		// Size swipable area
		this._el.slider_background.style.width = this.timescale.getPixelWidth() + this.options.width + "px";
		this._el.slider_background.style.left = -(this.options.width/2) + "px";
		this._el.slider.style.width = this.timescale.getPixelWidth() + this.options.width + "px";
		
		// Update Swipable constraint
		this._swipable.updateConstraint({top: false,bottom: false,left: (this.options.width/2),right: -(this.timescale.getPixelWidth() - (this.options.width/2))});
		
		// Go to the current slide
		this.goToId(this.current_id, true);
	},
	
	_drawTimeline: function(fast) {
		this.timescale = this._getTimeScale();
		this.timeaxis.drawTicks(this.timescale, this.options.optimal_tick_width);
		this._positionMarkers(fast);
		this._assignRowsToMarkers();
		this._createGroups();
		this._positionGroups();
	},
	
	_updateDrawTimeline: function(check_update) {
		var do_update = false;
		
		// Check to see if redraw is needed
		if (check_update) {
			/* keep this aligned with _getTimeScale or reduce code duplication */
			var temp_timescale = new VCO.TimeScale(this.data, {
	            display_width: this._el.container.offsetWidth,
	            screen_multiplier: this.options.scale_factor,
	            max_rows: this.max_rows

			});

			if (this.timescale.getMajorScale() == temp_timescale.getMajorScale() 
			 && this.timescale.getMinorScale() == temp_timescale.getMinorScale()) {
				do_update = true;
			}
		} else {
			do_update = true;
		}
		
		// Perform update or redraw
		if (do_update) {
			this.timescale = this._getTimeScale();
			this.timeaxis.positionTicks(this.timescale, this.options.optimal_tick_width);
			this._positionMarkers();
			this._assignRowsToMarkers();
			this._positionGroups();
			this._updateDisplay();
		} else {
			this._drawTimeline(true);
		}
		
		return do_update;
		
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
		this.timeaxis = new VCO.TimeAxis(this._el.timeaxis, this.options);
		
		// Swipable
		this._swipable = new VCO.Swipable(this._el.slider_background, this._el.slider, {
			enable: {x:true, y:false},
			constraint: {top: false,bottom: false,left: (this.options.width/2),right: false},
			snap: 	false
		});
		this._swipable.enable();
		
	},
	
	_initEvents: function () {
		// Drag Events
		this._swipable.on('dragmove', this._onDragMove, this);
		
		// Scroll Events
		VCO.DomEvent.addListener(this._el.container, 'mousewheel', this._onMouseScroll, this);
		VCO.DomEvent.addListener(this._el.container, 'DOMMouseScroll', this._onMouseScroll, this);
	},
	
	_initData: function() {
		// Create Markers and then add them
		this._createMarkers(this.data.events);
		this._drawTimeline();
		
	}
	
	
});