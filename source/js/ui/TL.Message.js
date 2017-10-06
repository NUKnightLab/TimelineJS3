/*	TL.Message

================================================== */
import { Util } from '../core/TL.Util.js'
import { Dom } from '../dom/TL.Dom.js'
import { DomEvent } from '../dom/TL.DomEvent.js'

var Message = function(data, options, add_to_container) {
  // DOM ELEMENTS
  this._el = {
  	parent: {},
  	container: {},
  	message_container: {},
  	loading_icon: {},
  	message: {}
  };
  this.options = {
  	width: 					600,
  	height: 				600,
  	message_class: 			"tl-message",
  	message_icon_class: 	"tl-loading-icon"
  };

  this._add_to_container = add_to_container || {}; // save ref
  this.initialize(data, options, add_to_container)
}
Message.prototype = {
	initialize: function(data, options, add_to_container) {
		// Merge Data and Options
		Util.mergeData(this.data, data);
		Util.mergeData(this.options, options);

		this._el.container = Dom.create("div", this.options.message_class);

		if (add_to_container) {
			add_to_container.appendChild(this._el.container);
			this._el.parent = add_to_container;
		}

		// Animation
		this.animator = {};

		this._initLayout();
		this._initEvents();
	},

	/*	Public
	================================================== */
	updateMessage: function(t) {
		this._updateMessage(t);
	},


	/*	Update Display
	================================================== */
	updateDisplay: function(w, h) {
		this._updateDisplay(w, h);
	},

	_updateMessage: function(t) {
		if (!t) {
			this._el.message.innerHTML = 'loading';
		} else {
			this._el.message.innerHTML = t;
		}

		// Re-add to DOM?
		if(!this._el.parent.atrributes && this._add_to_container.attributes) {
		    this._add_to_container.appendChild(this._el.container);
		    this._el.parent = this._add_to_container;
		}
	},


	/*	Events
	================================================== */


	_onMouseClick: function() {
		this.fire("clicked", this.options);
	},

	_onRemove: function() {
	    this._el.parent = {};
	},


	/*	Private Methods
	================================================== */
	_initLayout: function () {

		// Create Layout
		this._el.message_container = Dom.create("div", "tl-message-container", this._el.container);
		this._el.loading_icon = Dom.create("div", this.options.message_icon_class, this._el.message_container);
		this._el.message = Dom.create("div", "tl-message-content", this._el.message_container);

		this._updateMessage();

	},

	_initEvents: function () {
		DomEvent.addListener(this._el.container, 'click', this._onMouseClick, this);
		DomEvent.addListener(this, 'removed', this._onRemove, this);
	},

	// Update Display
	_updateDisplay: function(width, height, animate) {

	}

};

module.exports = {
  Message
}
