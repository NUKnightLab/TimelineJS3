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
			button_backtostart: {},
			button_zoomin: {},
			button_zoomout: {},
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
	_onButtonZoomIn: function(e) {
		this.fire("zoom_in", e);
	},
	
	_onButtonZoomOut: function(e) {
		this.fire("zoom_out", e);
	},
	
	_onButtonBackToStart: function(e) {
		this.fire("back_to_start", e);
	},
	
	
	/*	Private Methods
	================================================== */
	_initLayout: function () {
		
		// Create Layout
		this._el.button_zoomin 							= VCO.Dom.create('span', 'vco-menubar-button', this._el.container);
		this._el.button_zoomout 						= VCO.Dom.create('span', 'vco-menubar-button', this._el.container);
		this._el.button_backtostart 					= VCO.Dom.create('span', 'vco-menubar-button', this._el.container);
		
		if (VCO.Browser.mobile) {
			this._el.container.setAttribute("ontouchstart"," ");
		}
		
		this._el.button_backtostart.innerHTML		= "<span class='vco-icon-goback'></span>";
		this._el.button_zoomin.innerHTML			= "<span class='vco-icon-zoom-in'></span>";
		this._el.button_zoomout.innerHTML			= "<span class='vco-icon-zoom-out'></span>";
		
		
	},
	
	_initEvents: function () {
		VCO.DomEvent.addListener(this._el.button_backtostart, 'click', this._onButtonBackToStart, this);
		VCO.DomEvent.addListener(this._el.button_zoomin, 'click', this._onButtonZoomIn, this);
		VCO.DomEvent.addListener(this._el.button_zoomout, 'click', this._onButtonZoomOut, this);
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