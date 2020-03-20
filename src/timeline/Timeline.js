// simple test environment to make sure some things work
import * as DOM from "../dom/DOM"
import { addClass } from "../dom/DOMUtil"
import { hexToRgb, mergeData, isTrue } from "../core/Util";
import { easeInOutQuint, easeOutStrong } from "../animation/Ease";
import { Message } from "../ui/Message"
import { Language } from "../language/Language"
import { Loader } from "../core/Load"
/*
    needed imports: 
        TL.Browser
        TL.Animate
        TL.TimelineConfig
        TL.TimeNav
        TL.StorySlider
        TL.MenuBar
*/

function make_keydown_handler(timeline) {
  return function(event) {
    var keyName = event.key;
    var currentSlide = timeline._getSlideIndex(self.current_id);
    var _n = timeline.config.events.length - 1;
    var lastSlide = timeline.config.title ? _n + 1 : _n;
    var firstSlide = 0;

    if (keyName == 'ArrowLeft') {
      if (currentSlide != firstSlide) {
        timeline.goToPrev();
      }
    }
    else if (keyName == 'ArrowRight') {
      if (currentSlide != lastSlide) {
        timeline.goToNext();
      }
    }
  }
}

class Timeline {
  constructor(elem, data, options) {
    this.ready = false;
    this._el = {
      container: DOM.get(elem),
      storyslider: {},
      timenav: {},
      menubar: {}
    };

    // Slider
    this._storyslider = {};

    // TimeNav
    this._timenav = {};

    // Menu Bar
    this._menubar = {};

    // Loaded State
    this._loaded = { storyslider: false, timenav: false };

    // Data Object
    this.config = null;

    this.options = {
      script_path: "",
      height: this._el.container.offsetHeight,
      width: this._el.container.offsetWidth,
      debug: false,
      is_embed: false,
      is_full_embed: false,
      hash_bookmark: false,
      default_bg_color: { r: 255, g: 255, b: 255 },
      scale_factor: 2,						// How many screen widths wide should the timeline be
      layout: "landscape",			// portrait or landscape
      timenav_position: "bottom",				// timeline on top or bottom
      optimal_tick_width: 60,						// optimal distance (in pixels) between ticks on axis
      base_class: "tl-timeline", 		// removing tl-timeline will break all default stylesheets...
      timenav_height: null,
      timenav_height_percentage: 25,						// Overrides timenav height as a percentage of the screen
      timenav_mobile_height_percentage: 40, 				// timenav height as a percentage on mobile devices
      timenav_height_min: 175,					// Minimum timenav height
      marker_height_min: 30,						// Minimum Marker Height
      marker_width_min: 100,					// Minimum Marker Width
      marker_padding: 5,						// Top Bottom Marker Padding
      start_at_slide: 0,
      start_at_end: false,
      menubar_height: 0,
      skinny_size: 650,
      medium_size: 800,
      relative_date: false,					// Use momentjs to show a relative date from the slide.text.date.created_time field
      use_bc: false,					// Use declared suffix on dates earlier than 0
      // animation
      duration: 1000,
      ease: easeInOutQuint,
      // interaction
      dragging: true,
      trackResize: true,
      map_type: "stamen:toner-lite",
      slide_padding_lr: 100,					// padding on slide of slide
      slide_default_fade: "0%",					// landscape fade
      zoom_sequence: [0.5, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89], // Array of Fibonacci numbers for TimeNav zoom levels
      language: "en",
      ga_property_id: null,
      track_events: ['back_to_start', 'nav_next', 'nav_previous', 'zoom_in', 'zoom_out']
    };

    // Animation Objects
    this.animator_timenav = null;
    this.animator_storyslider = null;
    this.animator_menubar = null;

    var msg_options = mergeData(this.options, { message_class: "tl-message-full" })
    this.message = new Message({}, msg_options, this.elem);

    // Merge Options
    if (options && typeof (options.default_bg_color) == "string") {
      var parsed = hexToRgb(options.default_bg_color); // will clear it out if its invalid
      if (parsed) {
        options.default_bg_color = parsed;
      } else {
        delete options.default_bg_color
        trace("Invalid default background color. Ignoring.");
      }
    }
    mergeData(this.options, options);

    if (!(this.options.script_path)) {
      this.options.script_path = this.determineScriptPath()
    }

    document.addEventListener("keydown", make_keydown_handler(this));
    window.addEventListener("resize", function (e) {
      this.updateDisplay();
    }.bind(this));

    // TODO: fix this to not use TL
    // TL.debug = this.options.debug;

    // Apply base class to container
    addClass(this._el.container, 'tl-timeline');

    if (this.options.is_embed) {
      addClass(this._el.container, 'tl-timeline-embed');
    }

    if (this.options.is_full_embed) {
      addClass(this._el.container, 'tl-timeline-full-embed');
    }


    // TODO pick up here
    this._loadLanguage(data);


  }

  _loadLanguage(data) {
    console.log("_loadLanguage is not yet implemented")
  }
	/**
	 * Not ideal, but if users don't specify the script path, we try to figure it out.
	 * The script path is needed to load other languages
	 */
  determineScriptPath() {
    var script_tags = document.getElementsByTagName('script');
    var src = script_tags[script_tags.length - 1].src;
    if (src) {
      return src.substr(0, src.lastIndexOf('/'));
    } 
    return '';
  }

}

var debug = false; // can we fiddle with this and if others do, does that propogate?
export { Timeline, debug }

