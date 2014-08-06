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
		
		// Minor tick dom element array
		this.minor_ticks = [];
		
		// Minor tick dom element array
		this.major_ticks = [];
		
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
	
	drawTicks: function(timescale, optimal_tick_width) {
		this.axis_helper = VCO.AxisHelper.getBestHelper(timescale, optimal_tick_width);
		var major_ticks = this.axis_helper.getMajorTicks(timescale),
			minor_ticks = this.axis_helper.getMinorTicks(timescale);
		
		
		// Create Minor Ticks
		for (var i = 0; i < minor_ticks.ticks.length; i++) {
			var tick = VCO.Dom.create("div", "vco-timeaxis-tick vco-animate", this._el.minor);
			tick.innerHTML = minor_ticks.ticks[i].getDisplayDate();
			this.minor_ticks.push({
				tick:tick,
				date:minor_ticks.ticks[i]
			});
		}
		
		// Create Major Ticks
		for (var j = 0; j < major_ticks.ticks.length; j++) {
			var tick = VCO.Dom.create("div", "vco-timeaxis-tick vco-animate", this._el.major);
			tick.innerHTML = major_ticks.ticks[j].getDisplayDate();
			this.major_ticks.push({
				tick:tick,
				date:major_ticks.ticks[j]
			});
		}
		
		this.positionTicks(timescale, optimal_tick_width);
	},
	
	positionTicks: function(timescale, optimal_tick_width) {
		for (var i = 0; i < this.minor_ticks.length; i++) {
			var tick = this.minor_ticks[i];
			tick.tick.style.left = timescale.getPosition(tick.date.getMillisecond()) + "px";
		};
		
		for (var j = 0; j < this.major_ticks.length; j++) {
			var tick = this.major_ticks[j];
			tick.tick.style.left = timescale.getPosition(tick.date.getMillisecond()) + "px";
		};
	},
	
	/*	Events
	================================================== */

	
	/*	Private Methods
	================================================== */
	_initLayout: function () {
		
		
		this._el.content_container		= VCO.Dom.create("div", "vco-timeaxis-content-container", this._el.container);
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
