/*	VCO.TimeAxis
	Display element for showing timescale ticks
================================================== */

VCO.TimeAxis = VCO.Class.extend({
	
	includes: [VCO.Events, VCO.DomMixins],
	
	_el: {},
	
	/*	Constructor
	================================================== */
	initialize: function(elem, data, options) {
		
		// DOM Elements
		this._el = {
			container: {},
			content_container: {},
			background: {},
			major: {},
			minor: {},
		};
	
		// Components
		this._text			= {};
	
		// State
		this._state = {
			loaded: 		false
		};
		
		
		// Data
		this.data = {
			
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
		
		// Axis Helper
		this.axis_helper = {};
		
		// Main element
		if (typeof elem === 'object') {
			this._el.container = elem;
		} else {
			this._el.container = VCO.Dom.get(elem);
		}
		
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
	
	addTo: function(container) {
		container.appendChild(this._el.container);
	},
	
	removeFrom: function(container) {
		container.removeChild(this._el.container);
	},
	
	updateDisplay: function(w, h) {
		this._updateDisplay(w, h);
	},
	
	getLeft: function() {
		return this._el.container.style.left.slice(0, -2);
	},
	
	drawAxis: function(timescale) {
		this.axis_helper = VCO.AxisHelper.getBestHelper(timescale, 50);
		var major_ticks = this.axis_helper.getMajorTicks(timescale),
			minor_ticks = this.axis_helper.getMinorTicks(timescale);
			
		trace(minor_ticks);
		trace(major_ticks);
		
		// Create Minor Ticks
		for (var i = 0; i < minor_ticks.ticks.length; i++) {
			trace(minor_ticks.ticks[i].data.date_obj);
		}
		
		// Create Minor Ticks
		trace("-- Minor --");
		for (var i = 0; i < minor_ticks.ticks.length; i++) {
			trace(minor_ticks.ticks[i].data.date_obj);
		}
		
		trace("-- Major --");
		// Create Major Ticks
		for (var j = 0; j < major_ticks.ticks.length; j++) {
			trace(major_ticks.ticks[j].data.date_obj);
		}
	},
	
	/*	Events
	================================================== */

	
	/*	Private Methods
	================================================== */
	_initLayout: function () {
		
		
		this._el.content_container		= VCO.Dom.create("div", "vco-timeaxis-content-container", this._el.container);
		this._el.background				= VCO.Dom.create("div", "vco-timeaxis-background", this._el.content_container);
		this._el.major					= VCO.Dom.create("div", "vco-timeaxis-major", this._el.content_container);
		this._el.minor					= VCO.Dom.create("div", "vco-timeaxis-minor", this._el.content_container);
		
		
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
