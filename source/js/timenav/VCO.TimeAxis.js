/*	VCO.TimeAxis
	Display element for showing timescale ticks
================================================== */

VCO.TimeAxis = VCO.Class.extend({
	
	includes: [VCO.Events, VCO.DomMixins],
	
	_el: {},
	
	/*	Constructor
	================================================== */
	initialize: function(elem, options) {
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
		this.data = {};
	
		// Options
		this.options = {
			duration: 				1000,
			ease: 					VCO.Ease.easeInSpline,
			width: 					600,
			height: 				600
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
		
		// Date Format Lookup
		this.dateformat_lookup = {
	        millisecond: 1,
	        second: 'dateformats.time_short',
	        minute: 'dateformats.time_no_seconds_short',
	        hour: 'dateformats.time_no_minutes_short',
	        day: 'dateformats.full_short',
	        month: 'dateformats.month_short',
	        year: 'dateformats.year',
	        decade: 'dateformats.year',
	        century: 'dateformats.year',
	        millennium: 'dateformats.year',
	        age: 'dateformats.year',
	        epoch: 'dateformats.year',
	        era: 'dateformats.year',
	        eon: 'dateformats.year'
	    }
		
		// Main element
		if (typeof elem === 'object') {
			this._el.container = elem;
		} else {
			this._el.container = VCO.Dom.get(elem);
		}
		
		// Merge Data and Options
		VCO.Util.mergeData(this.options, options);
		
		this._initLayout();
		this._initEvents();
		
		
	},
	
	/*	Adding, Hiding, Showing etc
	================================================== */
	show: function() {

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

		var ticks = timescale.getTicks();

		var controls = {
			minor: {
				el: this._el.minor,
				dateformat: this.dateformat_lookup[ticks['minor'].name],
				ts_ticks: ticks['minor'].ticks,
				tick_elements: this.minor_ticks
			},
			major: {
				el: this._el.major,
				dateformat: this.dateformat_lookup[ticks['major'].name],
				ts_ticks: ticks['major'].ticks,
				tick_elements: this.major_ticks
			}
		}
		// FADE OUT
		this._el.major.className = "vco-timeaxis-major";
		this._el.minor.className = "vco-timeaxis-minor";
		this._el.major.style.opacity = 0;
		this._el.minor.style.opacity = 0;
		
		this.major_ticks = this._createTickElements(
			ticks['major'].ticks, 
			this._el.major, 
			this.dateformat_lookup[ticks['major'].name]
		);
		
		this.minor_ticks = this._createTickElements(
			ticks['minor'].ticks, 
			this._el.minor, 
			this.dateformat_lookup[ticks['minor'].name],
			ticks['major'].ticks
		);
		
		this.positionTicks(timescale, optimal_tick_width, true);
		
		// FADE IN
		this._el.major.className = "vco-timeaxis-major vco-animate-opacity";
		this._el.minor.className = "vco-timeaxis-minor vco-animate-opacity";
		this._el.major.style.opacity = 1;
		this._el.minor.style.opacity = 1;
	},
	
	_createTickElements: function(ts_ticks,tick_element,dateformat,ticks_to_skip) {
		tick_element.innerHTML = "";
		var skip_times = {}
		if (ticks_to_skip){
			for (idx in ticks_to_skip) {
				skip_times[ticks_to_skip[idx].getTime()] = true;
			}
		}

		var tick_elements = []
		for (var i = 0; i < ts_ticks.length; i++) {
			var ts_tick = ts_ticks[i];
			if (!(ts_tick.getTime() in skip_times)) {
				var tick = VCO.Dom.create("div", "vco-timeaxis-tick vco-animate-opacity", tick_element),
					tick_text 	= VCO.Dom.create("span", "vco-timeaxis-tick-text vco-animate-opacity", tick);
				ts_tick.setDateFormat(dateformat);
				
				tick_text.innerHTML = ts_tick.getDisplayDate(true);
				tick_elements.push({
					tick:tick,
					tick_text:tick_text,
					display_text:ts_tick.getDisplayDate(true),
					date:ts_tick
				});
			}
		}
		return tick_elements;
	},

	positionTicks: function(timescale, optimal_tick_width, no_animate) {
		
		// Poition Major Ticks
		for (var j = 0; j < this.major_ticks.length; j++) {
			var tick = this.major_ticks[j];
			//tick.tick.style.opacity = 1;
			if (!no_animate) {
				tick.tick.className = "vco-timeaxis-tick vco-animate";
			} 
			
			tick.tick.style.left = timescale.getPosition(tick.date.getMillisecond()) + "px";
		};
		
		// Poition Minor Ticks
		for (var i = 0; i < this.minor_ticks.length; i++) {
			var tick = this.minor_ticks[i];
			if (!no_animate) {
				tick.tick.className = "vco-timeaxis-tick vco-animate";
			} 
			tick.tick.style.left = timescale.getPosition(tick.date.getMillisecond()) + "px";
			tick.tick_text.innerHTML = tick.display_text;
		};
		
		// Handle density of minor ticks
		if (this.minor_ticks[1] && this.minor_ticks[0]) {
			var distance = (this.minor_ticks[1].tick.offsetLeft - this.minor_ticks[0].tick.offsetLeft),
				fraction_of_array = 1;
				
			if (distance < optimal_tick_width) {
				fraction_of_array = Math.round(optimal_tick_width/timescale.getPixelsPerTick());
			}
			
			var show = 1;
			for (var i = 0; i < this.minor_ticks.length; i++) {
				if (fraction_of_array > 1) {
					
					if (show >= fraction_of_array) {
						show = 1;
						this.minor_ticks[i].tick_text.style.opacity = 1;
					} else {
						show++;
						this.minor_ticks[i].tick_text.style.opacity = 0;
					}
				} else {
					this.minor_ticks[i].tick_text.style.opacity = 1;
				}
				
			};
		}
		
		
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
