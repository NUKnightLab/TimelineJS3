/*	VCO.MenuBar
	Draggable component to control size
================================================== */
 
VCO.MenuBar = VCO.Class.extend({
	
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
			ease: 					VCO.Ease.easeInOutQuint,
			menubar_default_y: 		0
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
		
	
	setSticky: function(y) {
		this.options.menubar_default_y = y;
	},
	
	/*	Color
	================================================== */
	setColor: function(inverted) {
		if (inverted) {
			this._el.container.className = 'vco-menubar vco-menubar-inverted';
		} else {
			this._el.container.className = 'vco-menubar';
		}
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
	
	_onButtonBackToStart: function(e) {
		this.fire("back_to_start", e);
	},
	
	_onButtonCollapseMap: function(e) {
		if (this.collapsed) {
			this.collapsed = false;
			this.show();
			this._el.button_overview.style.display = "inline";
			this.fire("collapse", {y:this.options.menubar_default_y});
			if (VCO.Browser.mobile) {
				this._el.button_collapse_toggle.innerHTML	= "<span class='vco-icon-arrow-up'></span>";
			} else {
				this._el.button_collapse_toggle.innerHTML	= VCO.Language.buttons.collapse_toggle + "<span class='vco-icon-arrow-up'></span>";
			}
		} else {
			this.collapsed = true;
			this.hide(25);
			this._el.button_overview.style.display = "none";
			this.fire("collapse", {y:1});
			if (VCO.Browser.mobile) {
				this._el.button_collapse_toggle.innerHTML	= "<span class='vco-icon-arrow-down'></span>";
			} else {
				this._el.button_collapse_toggle.innerHTML	= VCO.Language.buttons.uncollapse_toggle + "<span class='vco-icon-arrow-down'></span>";
			}
		}
	},
	
	/*	Private Methods
	================================================== */
	_initLayout: function () {
		// Create Layout
		
		// Buttons
		this._el.button_overview 						= VCO.Dom.create('span', 'vco-menubar-button', this._el.container);
		VCO.DomEvent.addListener(this._el.button_overview, 'click', this._onButtonOverview, this);
		
		this._el.button_backtostart 					= VCO.Dom.create('span', 'vco-menubar-button', this._el.container);
		VCO.DomEvent.addListener(this._el.button_backtostart, 'click', this._onButtonBackToStart, this);
		
		this._el.button_collapse_toggle 				= VCO.Dom.create('span', 'vco-menubar-button', this._el.container);
		VCO.DomEvent.addListener(this._el.button_collapse_toggle, 'click', this._onButtonCollapseMap, this);
		
		if (this.options.map_as_image) {
			this._el.button_overview.innerHTML			= VCO.Language.buttons.overview;
		} else {
			this._el.button_overview.innerHTML			= VCO.Language.buttons.map_overview;
		}
		
		if (VCO.Browser.mobile) {
			
			this._el.button_backtostart.innerHTML		= "<span class='vco-icon-goback'></span>";
			this._el.button_collapse_toggle.innerHTML	= "<span class='vco-icon-arrow-up'></span>";
			this._el.container.setAttribute("ontouchstart"," ");
		} else {
			
			this._el.button_backtostart.innerHTML		= VCO.Language.buttons.backtostart + " <span class='vco-icon-goback'></span>";
			this._el.button_collapse_toggle.innerHTML	= VCO.Language.buttons.collapse_toggle + "<span class='vco-icon-arrow-up'></span>";
		}
		
		if (this.options.layout == "landscape") {
			this._el.button_collapse_toggle.style.display = "none";
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