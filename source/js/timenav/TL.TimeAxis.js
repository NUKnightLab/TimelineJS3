/*	TL.TimeAxis
	Display element for showing timescale ticks
================================================== */

TL.TimeAxis = TL.Class.extend({

	includes: [TL.Events, TL.DomMixins, TL.I18NMixins],

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
			ease: 					TL.Ease.easeInSpline,
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

		// Date Format Lookup, map TL.Date.SCALES names to...
		this.dateformat_lookup = {
	        millisecond: 'time_milliseconds',     // ...TL.Language.<code>.dateformats
	        second: 'time_short',
	        minute: 'time_no_seconds_short',
	        hour: 'time_no_minutes_short',
	        day: 'full_short',
	        month: 'month_short',
	        year: 'year',
	        decade: 'year',
	        century: 'year',
	        millennium: 'year',
	        age: 'compact',  // ...TL.Language.<code>.bigdateformats
	        epoch: 'compact',
	        era: 'compact',
	        eon: 'compact',
	        eon2: 'compact'
	    }

		// Main element
		if (typeof elem === 'object') {
			this._el.container = elem;
		} else {
			this._el.container = TL.Dom.get(elem);
		}

		// Merge Data and Options
		TL.Util.mergeData(this.options, options);

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

	drawTicks: function(timescale, optimal_tick_width) {

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
		this._el.major.className = "tl-timeaxis-major";
		this._el.minor.className = "tl-timeaxis-minor";
		this._el.major.style.opacity = 0;
		this._el.minor.style.opacity = 0;

		// CREATE MAJOR TICKS
		this.major_ticks = this._createTickElements(
			ticks['major'].ticks,
			this._el.major,
			this.dateformat_lookup[ticks['major'].name]
		);

		// CREATE MINOR TICKS
		this.minor_ticks = this._createTickElements(
			ticks['minor'].ticks,
			this._el.minor,
			this.dateformat_lookup[ticks['minor'].name],
			ticks['major'].ticks
		);

		this.positionTicks(timescale, optimal_tick_width, true);

		// FADE IN
		this._el.major.className = "tl-timeaxis-major tl-animate-opacity tl-timeaxis-animate-opacity";
		this._el.minor.className = "tl-timeaxis-minor tl-animate-opacity tl-timeaxis-animate-opacity";
		this._el.major.style.opacity = 1;
		this._el.minor.style.opacity = 1;
	},

	_createTickElements: function(ts_ticks,tick_element,dateformat,ticks_to_skip) {
		tick_element.innerHTML = "";
		var skip_times = {}
		if (ticks_to_skip){
			for (var i = 0; i < ticks_to_skip.length; i++) {
				skip_times[ticks_to_skip[i].getTime()] = true;
			}
		}

		var tick_elements = []
		for (var i = 0; i < ts_ticks.length; i++) {
			var ts_tick = ts_ticks[i];
			if (!(ts_tick.getTime() in skip_times)) {
				var tick = TL.Dom.create("div", "tl-timeaxis-tick", tick_element),
					tick_text 	= TL.Dom.create("span", "tl-timeaxis-tick-text tl-animate-opacity", tick);

				tick_text.innerHTML = ts_tick.getDisplayDate(this.getLanguage(), dateformat);

				tick_elements.push({
					tick:tick,
					tick_text:tick_text,
					display_date:ts_tick.getDisplayDate(this.getLanguage(), dateformat),
					date:ts_tick
				});
			}
		}
		return tick_elements;
	},

	positionTicks: function(timescale, optimal_tick_width, no_animate) {

		// Handle Animation
		if (no_animate) {
			this._el.major.className = "tl-timeaxis-major";
			this._el.minor.className = "tl-timeaxis-minor";
		} else {
			this._el.major.className = "tl-timeaxis-major tl-timeaxis-animate";
			this._el.minor.className = "tl-timeaxis-minor tl-timeaxis-animate";
		}

		this._positionTickArray(this.major_ticks, timescale, optimal_tick_width);
		this._positionTickArray(this.minor_ticks, timescale, optimal_tick_width);

	},

	_positionTickArray: function(tick_array, timescale, optimal_tick_width) {
		// Poition Ticks & Handle density of ticks
		if (tick_array[1] && tick_array[0]) {
			var distance = ( timescale.getPosition(tick_array[1].date.getMillisecond()) - timescale.getPosition(tick_array[0].date.getMillisecond()) ),
				fraction_of_array = 1;


			if (distance < optimal_tick_width) {
				fraction_of_array = Math.round(optimal_tick_width/timescale.getPixelsPerTick());
			}

			var show = 1;

			for (var i = 0; i < tick_array.length; i++) {

				var tick = tick_array[i];

				// Poition Ticks
				tick.tick.style.left = timescale.getPosition(tick.date.getMillisecond()) + "px";
				tick.tick_text.innerHTML = tick.display_date;

				// Handle density of ticks
				if (fraction_of_array > 1) {
					if (show >= fraction_of_array) {
						show = 1;
						tick.tick_text.style.opacity = 1;
						tick.tick.className = "tl-timeaxis-tick";
					} else {
						show++;
						tick.tick_text.style.opacity = 0;
						tick.tick.className = "tl-timeaxis-tick tl-timeaxis-tick-hidden";
					}
				} else {
					tick.tick_text.style.opacity = 1;
					tick.tick.className = "tl-timeaxis-tick";
				}

			};
		}
	},

	/*	Events
	================================================== */


	/*	Private Methods
	================================================== */
	_initLayout: function () {
		this._el.content_container		= TL.Dom.create("div", "tl-timeaxis-content-container", this._el.container);
		this._el.major					= TL.Dom.create("div", "tl-timeaxis-major", this._el.content_container);
		this._el.minor					= TL.Dom.create("div", "tl-timeaxis-minor", this._el.content_container);

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
