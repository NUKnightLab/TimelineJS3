/*	VCO.TimeAxis
	Display element for showing timescale ticks
================================================== */

VCO.TimeAxis = VCO.Class.extend({
	
	includes: [VCO.Events, VCO.DomMixins],
	
	_el: {},
	
	/*	Constructor
	================================================== */
	initialize: function(data, options) {
		
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
	
	/*	Events
	================================================== */

	
	/*	Private Methods
	================================================== */
	_initLayout: function () {
		
		// Create Layout
		this._el.container 				= VCO.Dom.create("div", "vco-timeaxis");
		
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
