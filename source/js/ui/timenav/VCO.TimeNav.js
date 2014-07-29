/*	VCO.TimeNav
	
================================================== */
 
VCO.TimeNav = VCO.Class.extend({
	
	includes: [VCO.Events, VCO.DomMixins],
	
	_el: {},
	
	/*	Constructor
	================================================== */
	initialize: function(elem, parent_elem, options) {
		// DOM ELEMENTS
		this._el = {
			parent: {},
			container: {},
			button_overview: {},
			button_backtostart: {},
			button_collapse_toggle: {},
			arrow: {},
			line: {},
			coverbar: {},
			grip: {}
		};
		
		this.collapsed = false;
		
		if (typeof elem === 'object') {
			this._el.container = elem;
		} else {
			this._el.container = VCO.Dom.get(elem);
		}
		
		if (parent_elem) {
			this._el.parent = parent_elem;
		}
	
		//Options
		this.options = {
			width: 					600,
			height: 				600,
			duration: 				1000,
			ease: 					VCO.Ease.easeInOutQuint
		};
		
		// Animation
		this.animator = {};
		
		// Merge Data and Options
		VCO.Util.mergeData(this.options, options);
		
		this._initLayout();
		this._initEvents();
	},
	
	/*	Public
	================================================== */
	show: function(d) {
		
		var duration = this.options.duration;
		if (d) {
			duration = d;
		}
		/*
		this.animator = VCO.Animate(this._el.container, {
			top: 		this.options.menubar_default_y + "px",
			duration: 	duration,
			easing: 	VCO.Ease.easeOutStrong
		});
		*/
	},
	
	hide: function(top) {
		/*
		this.animator = VCO.Animate(this._el.container, {
			top: 		top,
			duration: 	this.options.duration,
			easing: 	VCO.Ease.easeOutStrong
		});
		*/
	},
	
	/*	Update Display
	================================================== */
	updateDisplay: function(w, h, a, l) {
		this._updateDisplay(w, h, a, l);
	},
	

	/*	Events
	================================================== */

	
	_onButtonOverview: function(e) {
		this.fire("overview", e);
	},

	
	/*	Private Methods
	================================================== */
	_initLayout: function () {
		// Create Layout
		
		// Buttons
		this._el.button_overview 						= VCO.Dom.create('span', 'vco-timenav-button', this._el.container);
		//VCO.DomEvent.addListener(this._el.button_overview, 'click', this._onButtonOverview, this);
		
		this._el.button_backtostart 					= VCO.Dom.create('span', 'vco-timenav-button', this._el.container);
		//VCO.DomEvent.addListener(this._el.button_backtostart, 'click', this._onButtonBackToStart, this);
		
		this._el.button_collapse_toggle 				= VCO.Dom.create('span', 'vco-timenav-button', this._el.container);
		//VCO.DomEvent.addListener(this._el.button_collapse_toggle, 'click', this._onButtonCollapseMap, this);
		
		
		if (VCO.Browser.mobile) {
		} 
		
	},
	
	_initEvents: function () {
		
	},
	
	// Update Display
	_updateDisplay: function(width, height, animate) {
		
		if (width) {
			this.options.width = width;
		}
		if (height) {
			this.options.height = height;
		}
	}
	
});