/*	TL.TimeGroup
	
================================================== */
 
TL.TimeGroup = TL.Class.extend({
	
	includes: [TL.Events, TL.DomMixins],
	
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
		
		
		this._el.container = TL.Dom.create("div", "tl-timegroup"); 
		
		// Merge Data
		TL.Util.mergeData(this.data, data);
		
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
			this._el.container.className = "tl-timegroup tl-timegroup-alternate";
		} else {
			this._el.container.className = "tl-timegroup";
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
		this._el.message = TL.Dom.create("div", "tl-timegroup-message", this._el.container);
		this._el.message.innerHTML = this.data.label;
		
		
	},
	
	_initEvents: function () {
		TL.DomEvent.addListener(this._el.container, 'click', this._onMouseClick, this);
	},
	
	// Update Display
	_updateDisplay: function(width, height, animate) {
		
	}
	
});