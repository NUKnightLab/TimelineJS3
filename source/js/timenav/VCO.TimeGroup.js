/*	VCO.TimeGroup
	
================================================== */
 
VCO.TimeGroup = VCO.Class.extend({
	
	includes: [VCO.Events, VCO.DomMixins],
	
	_el: {},
	
	/*	Constructor
	================================================== */
	initialize: function(data) {
		
		// DOM ELEMENTS
		this._el = {
			parent: {},
			container: {},
			message: {}
		};
		
		//Options
		this.options = {
			width: 					600,
			height: 				600
		};
		
		// Data
		this.data = {
			label: "",
			rows: 1
		};
		
		
		this._el.container = VCO.Dom.create("div", "vco-timegroup"); 
		
		// Merge Data
		VCO.Util.mergeData(this.data, data);
		
		// Animation
		this.animator = {};
		
		
		this._initLayout();
		this._initEvents();
	},
	
	/*	Public
	================================================== */
	
	
	
	/*	Update Display
	================================================== */
	updateDisplay: function(w, h) {
		
	},
	
	setRowPosition: function(n, h) {
		this.options.height = h * this.data.rows;
		this.setPosition({top:n});
		this._el.container.style.height = this.options.height + "px";
		
	},
	
	setAlternateRowColor: function(alternate) {
		if (alternate) {
			this._el.container.className = "vco-timegroup vco-timegroup-alternate";
		} else {
			this._el.container.className = "vco-timegroup";
		}
	},
	
	/*	Events
	================================================== */

	
	_onMouseClick: function() {
		this.fire("clicked", this.options);
	},

	
	/*	Private Methods
	================================================== */
	_initLayout: function () {
		
		// Create Layout
		this._el.message = VCO.Dom.create("div", "vco-timegroup-message", this._el.container);
		this._el.message.innerHTML = this.data.label;
		
		
	},
	
	_initEvents: function () {
		VCO.DomEvent.addListener(this._el.container, 'click', this._onMouseClick, this);
	},
	
	// Update Display
	_updateDisplay: function(width, height, animate) {
		
	}
	
});