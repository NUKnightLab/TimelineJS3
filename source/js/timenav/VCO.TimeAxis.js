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
		
		// Optimal Tick width
		this.optimal_tick_width = 100;
		
		// Minor tick dom element array
		this.minor_ticks = [];
		
		// Minor tick dom element array
		this.major_ticks = [];
		
		// Date Format Lookup
		this.dateformat_lookup = {
	        millisecond: 1,
	        second: VCO.Language.dateformats.time_short,
	        minute: VCO.Language.dateformats.time_no_seconds_short,
	        hour: VCO.Language.dateformats.time_no_seconds_short,
	        day: VCO.Language.dateformats.full_short,
	        month: VCO.Language.dateformats.month_short,
	        year: VCO.Language.dateformats.year,
	        decade: VCO.Language.dateformats.year,
	        century: VCO.Language.dateformats.year,
	        millennium: VCO.Language.dateformats.year,
	        age: VCO.Language.dateformats.year,
	        epoch: VCO.Language.dateformats.year,
	        era: VCO.Language.dateformats.year,
	        eon: VCO.Language.dateformats.year,
	    }
		
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
	
	drawTicks: function(timescale, optimal_tick_width, marker_ticks) {
		var major_ticks = timescale.getMajorTicks(),
			minor_ticks = timescale.getMinorTicks();
		
		
		// Create Minor Ticks
		
		for (var i = 0; i < minor_ticks.ticks.length; i++) {
			var tick 		= VCO.Dom.create("div", "vco-timeaxis-tick vco-animate", this._el.minor),
				tick_text 	= VCO.Dom.create("span", "vco-timeaxis-tick-text", tick);
			minor_ticks.ticks[i].setDateFormat(this.dateformat_lookup[minor_ticks.name]);
			tick_text.innerHTML = minor_ticks.ticks[i].getDisplayDate();
			this.minor_ticks.push({
				tick:tick,
				tick_text:tick_text,
				display_text:minor_ticks.ticks[i].getDisplayDate(),
				date:minor_ticks.ticks[i]
			});
		}
		
		// Create Major Ticks
		for (var j = 0; j < major_ticks.ticks.length; j++) {
			var tick		 = VCO.Dom.create("div", "vco-timeaxis-tick vco-animate", this._el.major),
				tick_text 	= VCO.Dom.create("span", "vco-timeaxis-tick-text", tick);
			major_ticks.ticks[j].setDateFormat(this.dateformat_lookup[major_ticks.name]);
			tick_text.innerHTML = major_ticks.ticks[j].getDisplayDate();
			this.major_ticks.push({
				tick:tick,
				tick_text:tick_text,
				display_text:major_ticks.ticks[j].getDisplayDate(),
				date:major_ticks.ticks[j]
			});
		}
		
		this.positionTicks(timescale, optimal_tick_width);
	},
	
	positionTicks: function(timescale, optimal_tick_width) {
		
		// Poition Major Ticks
		for (var j = 0; j < this.major_ticks.length; j++) {
			var tick = this.major_ticks[j];
			tick.tick.style.left = timescale.getPosition(tick.date.getMillisecond()) + "px";
		};
		
		// Poition Minor Ticks
		for (var i = 0; i < this.minor_ticks.length; i++) {
			var tick = this.minor_ticks[i];
			tick.tick.style.left = timescale.getPosition(tick.date.getMillisecond()) + "px";
			tick.tick_text.innerHTML = tick.display_text;
		};
		
		// Handle density of minor ticks
		var distance = (this.minor_ticks[1].tick.offsetLeft - this.minor_ticks[0].tick.offsetLeft),
			fraction_of_array = 1;
			
		if (distance < (optimal_tick_width/2 ) / 4) {
			fraction_of_array = 3;
		} else if (distance < (optimal_tick_width/2) / 3) {
			fraction_of_array = 3;
		} else if (distance < optimal_tick_width/2) {
			fraction_of_array = 2;
		}
		
		if (fraction_of_array > 1) {
			var show = 1;
			for (var i = 0; i < this.minor_ticks.length; i++) {
				if (show >= fraction_of_array) {
					show = 1;
					
				} else {
					show++;
					this.minor_ticks[i].tick_text.innerHTML = "&nbsp;";
				}
			};
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
