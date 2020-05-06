// simple test environment to make sure some things work
import * as DOM from "../dom/DOM"
import { addClass } from "../dom/DOMUtil"
import { hexToRgb, mergeData, classMixin, isTrue } from "../core/Util";
import { easeInOutQuint, easeOutStrong } from "../animation/Ease";
import { Message } from "../ui/Message"
import { Language, fallback } from "../language/Language"
import { I18NMixins } from "../language/I18NMixins";
import { makeConfig } from "../core/ConfigFactory"
import { TimelineConfig } from "../core/TimelineConfig"

/*
    needed imports: 
        TL.Browser
        TL.Animate
        TL.TimeNav
        TL.StorySlider
        TL.MenuBar
*/

function make_keydown_handler(timeline) {
  return function (event) {
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

/**
 * Primary entry point for using TimelineJS.
 * @constructor
 * @param {HTMLElement|string} elem - the HTML element, or its ID, to which 
 *     the Timeline should be bound
 * @param {object} - a JavaScript object conforming to the TimelineJS 
 *     configuration format
 * @param {object} [options] - a JavaScript object specifying 
 *     presentation options
 */
class Timeline {
  constructor(elem, data, options) {
    this.ready = false;
    this._el = {
      container: DOM.get(elem),
      storyslider: {},
      timenav: {},
      menubar: {}
    };

    this.language = fallback;

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

    this.message = new Message(this._el.container, { message_class: "tl-message-full" });

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
    try {
      var lang = this.options.language
      var script_path = this.options.script_path
      this.language = new Language(lang, script_path)
      this.message.setLanguage(this.language)
      console.log('_loadLanguage')
      console.log(this.language)
      this.showMessage(this._('loading_timeline'))
      this._initData(data)
    } catch (e) {
      this.showMessage(this._translateError(e))
    }
  }

  /**
   * Initialize the data for this timeline. If data is a URL, pass it to ConfigFactory
   * to get a TimelineConfig; if data is a TimelineConfig, just use it; otherwise, 
   * assume it's a JSON object in the right format, and wrap it in a new TimelineConfig.
   * @param {string|TimelineConfig|object} data
   */
  _initData(data) {
    if (typeof data == 'string') {
      makeConfig(data, function (config) {
        this.setConfig(config);
      }.bind(this));
    } else if (TL.TimelineConfig == data.constructor) {
      this.setConfig(data);
    } else {
      this.setConfig(new TL.TimelineConfig(data));
    }
  }

  /**
   * Given an input, if it is a Timeline Error object, look up the
   * appropriate error in the current language and return it, optionally 
   * with detail that also comes in the object. Alternatively, pass back
   * the input, which is expected to be a string ready to display.
   * @param {Error|string} e - an Error object which can be localized, 
   *     or a string message
   */
  _translateError(e) {

    if (e.hasOwnProperty('stack')) {
      trace(e.stack);
    }
    if (e.message_key) {
      return this._(e.message_key) + (e.detail ? ' [' + e.detail + ']' : '')
    }
    return e;

  }

  /**
   * Display a message in the Timeline window.
   * @param {string} msg 
   */
  showMessage(msg) {
    if (this.message) {
      this.message.updateMessage(msg);
    } else {
      trace("No message display available.")
      trace(msg);
    }
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


  setConfig(config) {
    this.config = config;
    this.config.validate();
    this._validateOptions();
    if (this.config.isValid()) {
      this.showMessage("config is valid")
      // try {
      //   this._onDataLoaded();
      // } catch (e) {
      //   this.showMessage("<strong>" + this._('error') + ":</strong> " + this._translateError(e));
      // }
    } else {
      var translated_errs = [];

      for (var i = 0, errs = this.config.getErrors(); i < errs.length; i++) {
        translated_errs.push(this._translateError(errs[i]));
      }

      this.showMessage("<strong>" + this._('error') + ":</strong> " + translated_errs.join('<br>'));
      // should we set 'self.ready'? if not, it won't resize,
      // but most resizing would only work
      // if more setup happens
    }
  }

  _validateOptions() {
    // assumes that this.options and this.config have been set.
    var INTEGER_PROPERTIES = ['timenav_height', 'timenav_height_min', 'marker_height_min', 'marker_width_min', 'marker_padding', 'start_at_slide', 'slide_padding_lr'];

    for (var i = 0; i < INTEGER_PROPERTIES.length; i++) {
      var opt = INTEGER_PROPERTIES[i];
      var value = this.options[opt];
      let valid = true;
      if (typeof (value) == 'number') {
        valid = (value == parseInt(value))
      } else if (typeof (value) == "string") {
        valid = (value.match(/^\s*(\-?\d+)?\s*$/));
      }
      if (!valid) {
        this.config.logError({ message_key: 'invalid_integer_option', detail: opt });
      }
    }
  } 
}

classMixin(Timeline, I18NMixins) // TODO mixin Events after its a class

var debug = false; // can we fiddle with this and if others do, does that propogate?
export { Timeline, debug }

