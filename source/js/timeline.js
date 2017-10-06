import { Ease } from './animation/TL.Ease'
import { Message } from './ui/TL.Message'

var Timeline = function(elem, data, options) {
  this.Version = '3.2.6'
  this.ready = false;
	this._el = {
		container: {},
		storyslider: {},
		timenav: {},
		menubar: {}
	};
  if(typeof elem === 'object') {
    this._el.container = elem;
  } else {
    this._el.container = document.getElementById(elem)
  }
  debugger
		// Slider
		this._storyslider = {};

		// TimeNav
		this._timenav = {};

		// Menu Bar
		this._menubar = {};

		// Loaded State
		this._loaded = {storyslider:false, timenav:false};

		// Data Object
		this.config = null;

		this.options = {
			script_path: 				"",
			height: 					this._el.container.offsetHeight,
			width: 						this._el.container.offsetWidth,
			debug: 						false,
			is_embed: 					false,
			is_full_embed: 				false,
			hash_bookmark: false,
			default_bg_color: 			{r:255, g:255, b:255},
			scale_factor: 				2,						// How many screen widths wide should the timeline be
			layout: 					"landscape",			// portrait or landscape
			timenav_position: 			"bottom",				// timeline on top or bottom
			optimal_tick_width: 		60,						// optimal distance (in pixels) between ticks on axis
			base_class: 				"tl-timeline", 		// removing tl-timeline will break all default stylesheets...
			timenav_height: 			null,
			timenav_height_percentage: 	25,						// Overrides timenav height as a percentage of the screen
			timenav_mobile_height_percentage: 40, 				// timenav height as a percentage on mobile devices
			timenav_height_min: 175,					// Minimum timenav height
			marker_height_min: 	30,						// Minimum Marker Height
			marker_width_min: 	100,					// Minimum Marker Width
			marker_padding: 		5,						// Top Bottom Marker Padding
			start_at_slide: 		0,
			start_at_end: 			false,
			menubar_height: 		0,
			skinny_size: 				650,
			medium_size: 				800,
			relative_date: 			false,					// Use momentjs to show a relative date from the slide.text.date.created_time field
			use_bc: 					  false,					// Use declared suffix on dates earlier than 0
			// animation
			duration: 					1000,
			ease:               function() { var t = new Ease; return t.easeInOutQuint }, //timeline.options.ease()(5)
			// interaction
			dragging: 					true,
			trackResize: 				true,
			map_type: 					"stamen:toner-lite",
			slide_padding_lr: 			100,					// padding on slide of slide
			slide_default_fade: 		"0%",					// landscape fade
			zoom_sequence: 				[0.5, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89], // Array of Fibonacci numbers for TimeNav zoom levels
			language: 					"en",
			ga_property_id: 			null,
			track_events: 				['back_to_start','nav_next','nav_previous','zoom_in','zoom_out' ]
		};
		// Animation Objects
		this.animator_timenav = null;
		this.animator_storyslider = null;
		this.animator_menubar = null;

    this.message = new Message({}, {message_class: "tl-message-full"}, this._el.container);
}

Timeline.prototype = {
  init: function() {

  },
  time: function() {
    return 'hello I am a timeline'
  }
}

module.exports = {
  Timeline
}
